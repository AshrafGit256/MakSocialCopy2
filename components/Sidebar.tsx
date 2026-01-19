
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
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

  // Detect if current user is a college-specific admin
  const isCollegeAdmin = currentUser.email?.toLowerCase().startsWith('admin.');
  const userCollege = currentUser.email?.toLowerCase().startsWith('admin.') 
    ? currentUser.email?.split('.')[1]?.split('@')[0]?.toUpperCase() as College 
    : currentUser.college;

  useEffect(() => {
    setCurrentUser(db.getUser());
  }, [activeView]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    // If college admin, hide global feed and search to keep them in their wing? 
    // Prompt says: "they only see and update college specific content"
    if (isCollegeAdmin) {
      if (item.id === 'home') return false; // Global Pulse is for Super Admin
    }
    return true;
  });

  return (
    <aside className="w-64 border-r border-[var(--border-color)] flex flex-col h-full bg-[var(--sidebar-bg)] z-50 transition-theme shadow-lg">
      <div className="p-6">
        <div className="mb-10 cursor-pointer group" onClick={() => setView(isCollegeAdmin ? 'groups' : 'home')}>
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
            className="w-full grayscale brightness-0 dark:grayscale-0 dark:brightness-100 transition-all"
          />
        </div>

        <nav className="space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="text-[10px] tracking-widest font-black uppercase">
                {item.id === 'groups' ? `${userCollege} Wing` : item.label}
              </span>
            </button>
          ))}
          
          <button
            onClick={() => setView('events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
              activeView === 'events' 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Radio size={20} />
            <span className="text-[10px] tracking-widest font-black uppercase">Live Hub</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-3">
        {isAdmin && !isCollegeAdmin && (
          <button
            onClick={() => setView('admin')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all border border-dashed ${
              activeView === 'admin' 
              ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-indigo-500 hover:text-indigo-500'
            }`}
          >
            <Cpu size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Super Control</span>
          </button>
        )}
        
        <div className="flex gap-2">
           <button onClick={toggleTheme} className="flex-1 p-3 bg-[var(--bg-secondary)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center">
             {isDark ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button onClick={onLogout} className="flex-1 p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
             <LogOut size={18} />
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
