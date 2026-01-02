
import React, { useState, useEffect, useRef } from 'react';
import { Incident, Task, Priority, TaskStatus } from '../types';
import MapComponent from './MapComponent';
import { analyzeIncident } from '../services/geminiService';

interface GovernmentPortalProps {
  incidents: Incident[];
  tasks: Task[];
  onAnalyze: (id: string, analysis: any) => void;
  onConvert: (task: Task) => void;
  onBroadcast: (area: string) => void;
}

const GovernmentPortal: React.FC<GovernmentPortalProps> = ({ incidents, tasks, onAnalyze, onConvert, onBroadcast }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>(Priority.MEDIUM);
  const [taskResources, setTaskResources] = useState('');
  
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [incidents]);

  const handleAiAnalyze = async (incident: Incident) => {
    setAnalyzingId(incident.id);
    try {
      const result = await analyzeIncident(incident.description);
      onAnalyze(incident.id, result);
    } catch (err) {
      alert("AI analysis failed. Check console for details.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      incidentId: selectedIncident.id,
      title: taskTitle,
      priority: taskPriority,
      requiredResources: taskResources.split(',').map(s => s.trim()),
      status: TaskStatus.OPEN,
      createdAt: new Date(),
      coordinates: selectedIncident.coordinates
    };

    onConvert(newTask);
    setSelectedIncident(null);
    setTaskTitle('');
    setTaskResources('');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcast(broadcastMessage);
    setBroadcastMessage('');
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Column: Live Feed & Analytics */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emergency-red animate-pulse"></span>
              Live Report Feed
            </h2>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">REALTIME</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {incidents.length === 0 && <p className="text-slate-500 text-xs text-center italic mt-10">Waiting for incoming signals...</p>}
            {incidents.slice().reverse().map(inc => (
              <div 
                key={inc.id} 
                className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${selectedIncident?.id === inc.id ? 'bg-slate-800 border-trust-blue' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
                onClick={() => setSelectedIncident(inc)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] text-slate-500">{inc.timestamp.toLocaleTimeString()}</span>
                  {inc.isAnalyzed && <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded">AI ANALYZED</span>}
                </div>
                <p className="line-clamp-3 mb-2">{inc.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rep: {inc.reporter}</span>
                  {!inc.isAnalyzed && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAiAnalyze(inc); }}
                      disabled={analyzingId === inc.id}
                      className="px-2 py-1 bg-trust-blue hover:bg-trust-blue/80 text-[10px] font-bold rounded flex items-center gap-1 disabled:opacity-50"
                    >
                      {analyzingId === inc.id ? '...' : 'AI ASSESS'}
                    </button>
                  )}
                </div>
                {inc.isAnalyzed && (
                    <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-slate-500">TYPE:</span> {inc.type}</div>
                        <div><span className="text-slate-500">URGENCY:</span> <span className={inc.urgency === 'High' ? 'text-red-500 font-bold' : 'text-blue-400'}>{inc.urgency}</span></div>
                    </div>
                )}
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>
        </div>

        {/* Broadcast Module */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-emergency-red" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Emergency Broadcast
          </h2>
          <form onSubmit={handleBroadcast}>
             <textarea 
               value={broadcastMessage}
               onChange={(e) => setBroadcastMessage(e.target.value)}
               placeholder="Enter alert message for Red Zones..." 
               className="w-full h-20 bg-slate-950 border border-slate-800 rounded p-2 text-xs focus:ring-1 focus:ring-emergency-red outline-none mb-2"
             />
             <button type="submit" className="w-full bg-emergency-red hover:bg-emergency-red/80 py-2 rounded font-bold text-xs">
               BROADCAST ALERT
             </button>
          </form>
        </div>
      </div>

      {/* Middle Column: Interactive Heatmap */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
        <div className="flex-1 relative">
           <MapComponent 
             incidents={incidents} 
             tasks={tasks} 
             onMarkerClick={(item) => 'description' in item ? setSelectedIncident(item as Incident) : null}
           />
        </div>
      </div>

      {/* Right Column: Task Creator / Deployment */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
         <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-full overflow-y-auto">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Mission Control</h2>
            
            {selectedIncident ? (
               <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
                     <div className="font-bold text-slate-500 mb-1">SELECTED INCIDENT:</div>
                     <p className="italic text-slate-400">"{selectedIncident.description}"</p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">TASK TITLE</label>
                    <input 
                      required
                      value={taskTitle}
                      onChange={e => setTaskTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none focus:border-trust-blue" 
                      placeholder="e.g. Search & Rescue - Zone B"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">PRIORITY LEVEL</label>
                    <select 
                      value={taskPriority}
                      onChange={e => setTaskPriority(e.target.value as Priority)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none"
                    >
                      {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">REQUIRED RESOURCES</label>
                    <textarea 
                      required
                      value={taskResources}
                      onChange={e => setTaskResources(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs outline-none h-20" 
                      placeholder="e.g. Medics, Truck, Ropes (comma separated)"
                    />
                  </div>

                  <button type="submit" className="w-full bg-trust-blue hover:bg-trust-blue/80 py-3 rounded font-black text-xs tracking-widest shadow-lg">
                    DEPLOY MISSION
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedIncident(null)}
                    className="w-full text-[10px] text-slate-500 hover:text-white"
                  >
                    CANCEL SELECTION
                  </button>
               </form>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p className="text-xs">Select an incident from the feed to initiate mission deployment.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default GovernmentPortal;
