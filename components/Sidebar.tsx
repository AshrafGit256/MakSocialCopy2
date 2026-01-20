
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Sun, Moon, Cpu, X, BookOpen, Rocket, Menu, Bell } from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout, isOpen, onClose }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());

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
    if (isCollegeAdmin) {
      if (item.id === 'home') return false; 
    }
    return true;
  });

  // Adaptation: Hidden on mobile (lg:hidden flex), Sidebar intact for Tablet/Laptop (lg:static).
  // On Desktop hover, it expands from 20 to 72.
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[70] h-full bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] 
    flex flex-col shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    lg:static lg:translate-x-0 lg:z-50 lg:shadow-none lg:w-20 lg:hover:w-72 group
    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-6 h-24 flex items-center justify-between border-b border-[var(--border-color)] shrink-0">
          <div className="cursor-pointer flex items-center gap-3 overflow-hidden" onClick={() => setView(isCollegeAdmin ? 'groups' : 'home')}>
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
               <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap">
              MakSocial
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-rose-500 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as AppView); if(onClose) onClose(); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative ${
                activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-500 hover:bg-indigo-600/5 hover:text-indigo-600'
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-[10px] tracking-[0.2em] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.id === 'groups' ? `${userCollege} Wing` : item.label}
              </span>
              
              {activeView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 shrink-0">
          <div className="flex flex-col gap-2">
            {isAdmin && !isCollegeAdmin && (
              <button
                onClick={() => setView('admin')}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                  activeView === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-indigo-600/5'
                }`}
              >
                <div className="w-6 h-6 shrink-0 flex items-center justify-center"><Cpu size={20}/></div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">Console</span>
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="flex-1 p-4 bg-white dark:bg-white/5 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={onLogout} className="flex-1 p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                <LogOut size={18} />
              </button>
            </div>
            
            <div className="mt-2 flex items-center gap-3 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] object-cover shadow-sm" />
               <div className="min-w-0">
                  <p className="text-[10px] font-black text-[var(--text-primary)] truncate uppercase">{currentUser.name}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{currentUser.college}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
