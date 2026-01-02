
import React from 'react';
import { Task, NGOProfile, TaskStatus, Priority } from '../types';

interface NGODashboardProps {
  ngoProfile: NGOProfile;
  tasks: Task[];
  onClaimTask: (taskId: string) => void;
  onUpdateVolunteers: (count: number) => void;
}

const NGODashboard: React.FC<NGODashboardProps> = ({ ngoProfile, tasks, onClaimTask, onUpdateVolunteers }) => {
  const openTasks = tasks.filter(t => t.status === TaskStatus.OPEN);
  const myTasks = tasks.filter(t => t.claimedBy === ngoProfile.id);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL: return 'bg-red-500/20 text-red-500 border-red-500/30';
      case Priority.HIGH: return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case Priority.MEDIUM: return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Column: NGO Profile & Volunteer Stats */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-trust-blue text-2xl font-bold">
              {ngoProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{ngoProfile.name}</h2>
              <p className="text-xs text-slate-500">Registered Responder Group</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
               <label className="text-[10px] text-slate-500 font-bold block mb-2 tracking-widest uppercase">Active Field Volunteers</label>
               <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-trust-blue">{ngoProfile.activeVolunteers}</span>
                  <div className="flex flex-col gap-1">
                     <button onClick={() => onUpdateVolunteers(ngoProfile.activeVolunteers + 1)} className="p-1 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700">+</button>
                     <button onClick={() => onUpdateVolunteers(Math.max(0, ngoProfile.activeVolunteers - 1))} className="p-1 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700">-</button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 mb-1">Missions Claimed</div>
                  <div className="text-2xl font-bold">{myTasks.length}</div>
               </div>
               <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 mb-1">Completed</div>
                  <div className="text-2xl font-bold text-green-500">0</div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Operational Status</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span>Network Integrity</span>
                <span className="text-green-500 font-mono">100%</span>
             </div>
             <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full"></div>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span>Supply Reserves</span>
                <span className="text-yellow-500 font-mono">65%</span>
             </div>
             <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[65%]"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Marketplace & My Tasks */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 overflow-hidden">
        {/* Task Marketplace */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <svg className="w-5 h-5 text-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Task Marketplace
            </h2>
            <div className="flex gap-4">
               <span className="text-[10px] text-slate-500">{openTasks.length} Available Missions</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {openTasks.length === 0 && (
                 <div className="col-span-full py-20 text-center opacity-40 italic">No open missions currently available. Monitor feed for updates.</div>
               )}
               {openTasks.map(task => (
                 <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-trust-blue/50 transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${getPriorityColor(task.priority)}`}>
                         {task.priority.toUpperCase()}
                       </span>
                       <span className="text-[10px] font-mono text-slate-500">{new Date(task.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-trust-blue transition-colors">{task.title}</h3>
                    <div className="text-[11px] text-slate-400 mb-4 flex-1">
                       <div className="font-bold text-slate-500 mb-1">RESOURCES NEEDED:</div>
                       <ul className="list-disc list-inside space-y-1">
                          {task.requiredResources.map((res, i) => <li key={i}>{res}</li>)}
                       </ul>
                    </div>
                    <button 
                      onClick={() => onClaimTask(task.id)}
                      className="w-full bg-trust-blue hover:bg-trust-blue/80 py-2 rounded font-bold text-xs shadow-lg transition-transform active:scale-95"
                    >
                      CLAIM MISSION
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Claimed Tasks */}
        <div className="h-1/3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h2 className="text-sm font-bold uppercase tracking-wider">Our Active Engagements</h2>
          </div>
          <div className="flex-1 overflow-x-auto p-4">
             <table className="w-full text-xs">
                <thead>
                   <tr className="text-slate-500 border-b border-slate-800 text-left">
                      <th className="pb-3 font-medium">MISSION ID</th>
                      <th className="pb-3 font-medium">TASK</th>
                      <th className="pb-3 font-medium">PRIORITY</th>
                      <th className="pb-3 font-medium">STATUS</th>
                      <th className="pb-3 font-medium text-right">ACTION</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                   {myTasks.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-600 italic">No missions claimed yet. Visit the Marketplace to start deployment.</td>
                     </tr>
                   )}
                   {myTasks.map(task => (
                      <tr key={task.id} className="group hover:bg-slate-800/30 transition-colors">
                         <td className="py-3 font-mono text-slate-500">#{task.id.slice(0, 8)}</td>
                         <td className="py-3 font-bold">{task.title}</td>
                         <td className="py-3">
                            <span className={`text-[10px] font-bold ${getPriorityColor(task.priority).split(' ')[1]}`}>
                              {task.priority}
                            </span>
                         </td>
                         <td className="py-3">
                            <span className="flex items-center gap-2">
                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                               DEPLOYED
                            </span>
                         </td>
                         <td className="py-3 text-right">
                            <button className="text-slate-400 hover:text-white underline underline-offset-4">Report Completion</button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
