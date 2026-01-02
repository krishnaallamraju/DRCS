
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Incident, Task, NGOProfile, TaskStatus, Priority } from './types';
import DashboardLayout from './components/DashboardLayout';
import GovernmentPortal from './components/GovernmentPortal';
import NGODashboard from './components/NGODashboard';

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    reporter: 'Volunteer_04',
    description: 'Flash flooding observed in Sector 7, water level rising quickly near the bridge.',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    isAnalyzed: false,
    isConvertedToTask: false
  },
  {
    id: 'inc-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    reporter: 'S. Patel',
    description: 'Structure fire reported at the warehouse district. Potential hazardous materials stored on-site.',
    coordinates: { lat: 34.0622, lng: -118.2537 },
    isAnalyzed: true,
    type: 'Fire',
    severity_score: 8,
    urgency: 'High',
    suggested_action: 'Deploy specialized hazmat containment team and standard fire response.',
    isConvertedToTask: true
  }
];

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    incidentId: 'inc-2',
    title: 'Warehouse Fire Containment',
    priority: Priority.HIGH,
    requiredResources: ['Fire Engine', 'Hazmat Crew'],
    status: TaskStatus.OPEN,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    coordinates: { lat: 34.0622, lng: -118.2537 }
  }
];

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.UNAUTHENTICATED);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [ngoProfile, setNgoProfile] = useState<NGOProfile>({
    id: 'ngo-99',
    name: 'Red Shield Responders',
    activeVolunteers: 12
  });

  // Simulation of incoming reports
  useEffect(() => {
    if (role === UserRole.UNAUTHENTICATED) return;

    const interval = setInterval(() => {
      const newInc: Incident = {
        id: `inc-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date(),
        reporter: `Signal_${Math.floor(Math.random() * 100)}`,
        description: `Automatic detection of anomaly at coordinates ${Math.floor(Math.random() * 1000)}. Status: Critical.`,
        coordinates: { lat: 34 + Math.random(), lng: -118 - Math.random() },
        isAnalyzed: false,
        isConvertedToTask: false
      };
      setIncidents(prev => [...prev, newInc]);
    }, 45000); // Add report every 45s

    return () => clearInterval(interval);
  }, [role]);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(UserRole.UNAUTHENTICATED);
  };

  const handleIncidentAnalysis = (id: string, analysis: any) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, ...analysis, isAnalyzed: true } : inc
    ));
  };

  const handleConvertToTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    setIncidents(prev => prev.map(inc => 
      inc.id === task.incidentId ? { ...inc, isConvertedToTask: true } : inc
    ));
  };

  const handleClaimTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: TaskStatus.CLAIMED, claimedBy: ngoProfile.id } : t
    ));
  };

  const handleUpdateVolunteers = (count: number) => {
    setNgoProfile(prev => ({ ...prev, activeVolunteers: count }));
  };

  const handleBroadcast = (message: string) => {
    alert(`[SYSTEM BROADCAST] Sending signal to all active units in sector: ${message}`);
  };

  if (role === UserRole.UNAUTHENTICATED) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-trust-blue rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emergency-red rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
           <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emergency-red to-trust-blue p-0.5 mb-6">
                 <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-black">
                    DR
                 </div>
              </div>
              <h1 className="text-4xl font-black tracking-tighter mb-2">DRCS DASHBOARD</h1>
              <p className="text-slate-500 font-medium">Disaster Response Coordination System</p>
           </div>

           <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
              <div className="text-center">
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Select Operations Portal</h2>
              </div>
              
              <button 
                onClick={() => handleLogin(UserRole.GOVERNMENT)}
                className="group w-full flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-emergency-red transition-all"
              >
                 <div className="w-12 h-12 bg-emergency-red/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emergency-red" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <div className="text-left">
                    <div className="font-bold">Government Portal</div>
                    <div className="text-xs text-slate-500 font-mono">AUTHORIZED COMMAND ONLY</div>
                 </div>
              </button>

              <button 
                onClick={() => handleLogin(UserRole.NGO)}
                className="group w-full flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-trust-blue transition-all"
              >
                 <div className="w-12 h-12 bg-trust-blue/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-trust-blue" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" />
                    </svg>
                 </div>
                 <div className="text-left">
                    <div className="font-bold">NGO Dashboard</div>
                    <div className="text-xs text-slate-500 font-mono">FIELD PARTNER ACCESS</div>
                 </div>
              </button>
           </div>
           
           <p className="mt-8 text-center text-slate-600 text-[10px] tracking-widest uppercase">
              Secure Cloud Processing Protocol Active
           </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role={role} onLogout={handleLogout}>
      {role === UserRole.GOVERNMENT ? (
        <GovernmentPortal 
          incidents={incidents} 
          tasks={tasks}
          onAnalyze={handleIncidentAnalysis}
          onConvert={handleConvertToTask}
          onBroadcast={handleBroadcast}
        />
      ) : (
        <NGODashboard 
          ngoProfile={ngoProfile}
          tasks={tasks}
          onClaimTask={handleClaimTask}
          onUpdateVolunteers={handleUpdateVolunteers}
        />
      )}
    </DashboardLayout>
  );
};

export default App;
