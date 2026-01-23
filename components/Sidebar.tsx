
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Radio, Cpu, X, Settings, Lock, ChevronRight, Fingerprint } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout, isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());

  useEffect(() => {
    setCurrentUser(db.getUser());
  }, [activeView]);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[2001] w-[280px] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] 
    flex flex-col h-full transition-transform duration-300 ease-in-out font-mono
    lg:static lg:translate-x-0 lg:z-50 lg:w-72
    ${isOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.2)]' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* 1. BRAND TERMINAL HEADER */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
             <div className="w-11 h-11 bg-indigo-600 rounded flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
                <Radio size={24} className="animate-pulse" />
             </div>
             <div className="flex flex-col">
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-[var(--text-primary)] leading-none">MakSocial</h2>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 leading-none opacity-80">The Hill Pulse</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-md text-slate-400 lg:hidden">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION MATRIX */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4 space-y-8">
        <section>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-3 opacity-60">System.Strata</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isLocked = item.id === 'resources' && currentUser.subscriptionTier === 'Free';
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !isLocked && setView(item.id as AppView)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded transition-all group relative ${
                    isActive 
                    ? 'bg-indigo-600/5 text-indigo-600 font-black' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r shadow-[0_0_10px_rgba(79,70,229,0.5)]" />}
                  
                  <div className="flex items-center space-x-3">
                    <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="text-[10px] tracking-[0.15em] font-black uppercase">
                      {item.id === 'groups' ? `${currentUser.college} Wing` : item.id === 'resources' ? 'Registry' : item.label}
                    </span>
                  </div>
                  
                  {isLocked ? <Lock size={12} className="text-slate-400" /> : isActive && <ChevronRight size={14} className="opacity-40" />}
                </button>
              );
            })}
          </nav>
        </section>

        {isAdmin && (
          <section>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-3 opacity-60">Admin.Console</p>
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition-all border border-dashed border-[var(--border-color)] ${
                activeView === 'admin' 
                ? 'bg-indigo-600 text-white border-transparent shadow-lg' 
                : 'text-slate-400 hover:border-indigo-600/50 hover:text-indigo-600'
              }`}
            >
              <Cpu size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Terminal Root</span>
            </button>
          </section>
        )}
      </div>

      {/* 3. USER NODE SECTION */}
      <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="relative">
              <img src={currentUser.avatar} className="w-9 h-9 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] object-cover" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[var(--sidebar-bg)] rounded-full"></div>
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase truncate text-[var(--text-primary)] tracking-tight">{currentUser.name}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">{currentUser.college} Sector</p>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
           <button onClick={() => setView('settings')} className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded hover:bg-indigo-600/5 hover:border-indigo-600/50 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <Settings size={14} />
           </button>
           <button onClick={onLogout} className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded hover:bg-rose-500/5 hover:border-rose-500/50 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center gap-2">
              <LogOut size={14} />
           </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[7px] text-slate-500 font-black uppercase tracking-[0.3em] opacity-40">
           <Fingerprint size={10} />
           <span>ID_VERIFIED_{currentUser.id.slice(0,6)}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
