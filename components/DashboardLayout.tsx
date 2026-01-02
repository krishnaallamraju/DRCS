
import React from 'react';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  userName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, onLogout, userName }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded flex items-center justify-center font-black text-xl ${role === UserRole.GOVERNMENT ? 'bg-emergency-red' : 'bg-trust-blue'}`}>
            DR
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg">DRCS SYSTEM</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
              {role === UserRole.GOVERNMENT ? 'Government Command' : 'NGO Operations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-sm font-medium">{userName || (role === UserRole.GOVERNMENT ? 'Commander Alpha' : 'Field Lead')}</span>
             <span className="text-xs text-slate-500">{role} PORTAL ACCESS</span>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-6 max-w-[1600px] w-full mx-auto">
        {children}
      </main>

      {/* Status Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 px-6 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        <div className="flex gap-4">
            <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Network Active
            </span>
            <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Gemini AI Online
            </span>
        </div>
        <div>v3.4.2-STABLE // BUILD 09-2025</div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
