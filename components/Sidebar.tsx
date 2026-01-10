
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView } from '../types';
import { ShieldCheck, LogOut } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout }) => {
  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-full bg-[#0a0f18] z-20">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-500/20">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Mak Social</span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === item.id 
                ? 'bg-blue-600/10 text-blue-400 font-semibold' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-200 group-hover:scale-110 ${activeView === item.id ? 'text-blue-500' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        {isAdmin && (
          <button
            onClick={() => setView('admin')}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all border border-dashed ${
              activeView === 'admin' 
              ? 'bg-red-500/10 border-red-500/50 text-red-400' 
              : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-300'
            }`}
          >
            <ShieldCheck size={20} />
            <span className="text-sm font-medium">Admin Panel</span>
          </button>
        )}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
