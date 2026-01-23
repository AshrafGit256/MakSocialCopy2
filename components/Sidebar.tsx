
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Radio, Sun, Moon, Cpu, X, BookOpen, Layers, Settings, Lock, ChevronRight } from 'lucide-react';

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

  const userCollege = currentUser.email?.toLowerCase().startsWith('admin.') 
    ? currentUser.email?.split('.')[1]?.split('@')[0]?.toUpperCase() as College 
    : currentUser.college;

  useEffect(() => {
    setCurrentUser(db.getUser());
  }, [activeView]);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[2001] w-[280px] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] 
    flex flex-col h-full transition-transform duration-300 ease-in-out
    lg:static lg:translate-x-0 lg:z-50 lg:w-72
    ${isOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.3)]' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Header / Logo Section */}
      <div className="p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between lg:justify-start lg:gap-3">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Radio size={24} className="animate-pulse" />
             </div>
             <div className="flex flex-col">
                <h2 className="text-lg font-black italic tracking-tighter uppercase text-[var(--text-primary)]">MakSocial</h2>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">The Hill Pulse</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-slate-500 lg:hidden">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3">
        <nav className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Main Strata</p>
          {NAV_ITEMS.map((item) => {
            const isLocked = item.id === 'resources' && currentUser.subscriptionTier === 'Free';
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => !isLocked && setView(item.id as AppView)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all group relative ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-600 font-black border-l-4 border-indigo-600 rounded-l-none' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="text-[11px] tracking-widest font-black uppercase">
                    {item.id === 'groups' ? `${userCollege} Wing` : item.id === 'resources' ? 'Registry' : item.label}
                  </span>
                </div>
                {isLocked ? (
                   <Lock size={12} className="text-slate-400" />
                ) : (
                   isActive && <ChevronRight size={14} className="text-indigo-600" />
                )}
              </button>
            );
          })}
          
          <div className="pt-6">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Configuration</p>
             <button
               onClick={() => setView('settings')}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all group ${
                 activeView === 'settings' 
                 ? 'bg-indigo-600/10 text-indigo-600 border-l-4 border-indigo-600 rounded-l-none' 
                 : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
               }`}
             >
               <Settings size={20} className={activeView === 'settings' ? 'text-indigo-600' : 'text-slate-400'} />
               <span className="text-[11px] tracking-widest font-black uppercase">Customization</span>
             </button>
          </div>
        </nav>

        {isAdmin && (
          <div className="mt-8">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Command Deck</p>
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all border border-dashed ${
                activeView === 'admin' 
                ? 'bg-slate-900 dark:bg-indigo-600 text-white border-transparent' 
                : 'border-[var(--border-color)] text-slate-400 hover:border-indigo-500 hover:text-indigo-600'
              }`}
            >
              <Cpu size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest">Admin Control</span>
            </button>
          </div>
        )}
      </div>

      {/* User / Footer Section */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] mb-4">
           <img src={currentUser.avatar} className="w-8 h-8 rounded-md border border-[var(--border-color)] bg-white object-cover" />
           <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase truncate text-[var(--text-primary)]">{currentUser.name}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{currentUser.college} Sector</p>
           </div>
           <button onClick={onLogout} className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-md transition-all">
              <LogOut size={16} />
           </button>
        </div>
        <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest text-center">Protocol v4.2 Stable | MakSocial</p>
      </div>
    </aside>
  );
};

export default Sidebar;
