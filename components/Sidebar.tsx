
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Radio, Sun, Moon, Cpu } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());

  useEffect(() => {
    setCurrentUser(db.getUser());
  }, [activeView]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-full bg-[#020617] z-50 transition-all shadow-2xl">
      <div className="p-6">
        <div className="mb-10 cursor-pointer group" onClick={() => setView('home')}>
          <img
  src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
  alt="MakSocial Logo"
/>

        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                activeView === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 font-bold' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${activeView === item.id ? 'text-indigo-400' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs tracking-wide font-bold uppercase">
                {item.id === 'groups' ? `${currentUser.college} Wing` : item.label}
              </span>
            </button>
          ))}
          
          <button
            onClick={() => setView('events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
              activeView === 'events' 
              ? 'bg-rose-600/10 text-rose-400 font-bold' 
              : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Radio size={20} className={activeView === 'events' ? 'text-rose-400' : ''} />
            <span className="text-xs tracking-wide font-bold uppercase">Live Hub</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-3">
        {isAdmin && (
          <button
            onClick={() => setView('admin')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all border border-dashed ${
              activeView === 'admin' 
              ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
              : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
            }`}
          >
            <Cpu size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Admin Control</span>
          </button>
        )}
        
        <div className="flex gap-2">
           <button onClick={toggleTheme} className="flex-1 p-3 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all flex items-center justify-center">
             {isDark ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button onClick={onLogout} className="flex-1 p-3 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
             <LogOut size={18} />
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
