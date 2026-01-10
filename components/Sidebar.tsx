
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView } from '../types';
import { ShieldCheck, LogOut, Radio, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <aside className="w-64 border-r border-black/5 dark:border-white/5 flex flex-col h-full bg-slate-50 dark:bg-[#0a0f18] z-20 transition-theme">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            M
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Mak Social</span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeView === item.id 
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-200 group-hover:scale-110 ${activeView === item.id ? 'text-blue-600 dark:text-blue-500' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide font-medium">{item.id === 'groups' ? 'Colleges' : item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setView('events')}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeView === 'events' 
              ? 'bg-red-600/10 text-red-600 dark:text-red-400 font-semibold' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio size={22} className={activeView === 'events' ? 'text-red-600 dark:text-red-500' : ''} />
            <span className="text-sm tracking-wide font-medium">Live Events</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setView('admin')}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all border border-dashed ${
              activeView === 'admin' 
              ? 'bg-green-600/10 border-green-600/50 text-green-600 dark:text-green-400' 
              : 'border-black/10 dark:border-white/10 text-slate-500 hover:border-black/30 dark:hover:border-white/30 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ShieldCheck size={20} />
            <span className="text-sm font-medium">Admin HQ</span>
          </button>
        )}
        
        <button onClick={onLogout} className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400">
          <LogOut size={20} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
