import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Radio, Sun, Moon, Cpu, X, BookOpen, Layers, Settings, Lock, Award, Star, Bell, Zap, Target, Activity } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  unreadNotifications?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout, isOpen, onClose, unreadNotifications = 0 }) => {
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());
  useEffect(() => { setCurrentUser(db.getUser()); }, [activeView]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2001] w-[85%] max-w-[300px] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col h-full transition-transform duration-300 lg:static lg:translate-x-0 lg:z-50 lg:w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 overflow-y-auto no-scrollbar flex-1">
        <div className="hidden lg:block mb-8 cursor-pointer group" onClick={() => setView('home')}>
          <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" alt="Logo" className="w-32 grayscale brightness-0 dark:grayscale-0 dark:brightness-100" />
        </div>
        <div className="mb-8 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-3">
           <div className="flex justify-between items-center">
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Node_Authority</p>
              <Target size={12} className="text-indigo-600 animate-pulse"/>
           </div>
           <h4 className="text-lg font-black text-indigo-600 italic tracking-tighter">LVL_{currentUser.nodeAuthorityLevel || 4}</h4>
           <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: `68%` }}></div>
           </div>
        </div>
        <nav className="space-y-1">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Registry Control</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)] hover:text-indigo-600'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                   {item.icon}
                   {item.id === 'notifications' && unreadNotifications > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-[var(--sidebar-bg)]"></span>}
                </div>
                <span className="text-[10px] tracking-widest font-black uppercase">{item.label}</span>
              </div>
            </button>
          ))}
          <button onClick={() => setView('opportunities')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeView === 'opportunities' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)] hover:text-amber-600'}`}>
            <Award size={22} /><span className="text-[10px] tracking-widest font-black uppercase">Opportunities</span>
          </button>
        </nav>
      </div>
      <div className="p-6 border-t border-[var(--border-color)]">
        <button onClick={onLogout} className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
          <LogOut size={18} /><span className="ml-2 text-[9px] font-black uppercase tracking-widest">Terminate Signal</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;