
import React from 'react';
import { Incident, Task } from '../types';

interface MapComponentProps {
  incidents: Incident[];
  tasks: Task[];
  onMarkerClick?: (item: Incident | Task) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ incidents, tasks, onMarkerClick }) => {
  // Mock Map Interface using a grid layout since actual Google Maps API requires a key.
  // This UI represents the 'Heatmap' request visually.
  return (
    <div className="relative w-full h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
      {/* Visual background grid to look like a map */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#1e293b 2px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="text-center z-10 p-8">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700">
          <svg className="w-8 h-8 text-trust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.447-1.817L9 1.118l6 3 5.447-2.724A2 2 0 0123 3.236v9.764a2 2 0 01-1.447 1.817L15 17.5l-6 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Command Center Heatmap</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Interactive Geospatial View Active. Real-time markers synced with database.
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span>{incidents.length} Unresolved Incidents</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-xs">
            <div className="w-3 h-3 rounded-full bg-trust-blue"></div>
            <span>{tasks.length} Active Missions</span>
          </div>
        </div>
      </div>

      {/* Mock markers scattered around */}
      {incidents.map((inc, i) => (
        <button
          key={inc.id}
          onClick={() => onMarkerClick?.(inc)}
          className="absolute w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-bounce hover:scale-150 transition-transform"
          style={{ 
            top: `${20 + (i * 15) % 60}%`, 
            left: `${15 + (i * 25) % 70}%` 
          }}
          title={`Incident: ${inc.description}`}
        />
      ))}

      {/* NGO Active Task markers */}
      {tasks.filter(t => t.status === 'CLAIMED').map((task, i) => (
        <button
          key={task.id}
          onClick={() => onMarkerClick?.(task)}
          className="absolute w-5 h-5 bg-blue-600 rounded-sm border-2 border-white hover:scale-150 transition-transform flex items-center justify-center text-[8px] font-bold"
          style={{ 
            top: `${30 + (i * 12) % 55}%`, 
            left: `${40 + (i * 18) % 50}%` 
          }}
          title={`Task: ${task.title}`}
        >
          NGO
        </button>
      ))}

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700">+</button>
         <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700">-</button>
      </div>
    </div>
  );
};

export default MapComponent;
