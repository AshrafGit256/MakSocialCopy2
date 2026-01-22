
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { AppView, User, College } from '../types';
import { db } from '../db';
import { ShieldCheck, LogOut, Radio, Sun, Moon, Cpu, X, BookOpen, Layers, Settings, Lock } from 'lucide-react';

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

  const isCollegeAdmin = currentUser.email?.toLowerCase().startsWith('admin.');
  const userCollege = currentUser.email?.toLowerCase().startsWith('admin.') 
    ? currentUser.email?.split('.')[1]?.split('@')[0]?.toUpperCase() as College 
    : currentUser.college;

  useEffect(() => {
    setCurrentUser(db.getUser());
  }, [activeView]);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[100] w-[85%] max-w-[320px] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] 
    flex flex-col h-full shadow-[25px_0_50px_-12px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out
    lg:static lg:translate-x-0 lg:z-50 lg:shadow-none lg:w-72
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="p-6 overflow-y-auto no-scrollbar flex-1">
        {/* Mobile Close Icon */}
        <div className="flex items-center justify-between mb-10 lg:hidden">
          <div className="flex flex-col">
            <h2 className="text-xl font-black italic tracking-tighter uppercase text-indigo-600">MakSocial</h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Navigation Control</p>
          </div>
          <button onClick={onClose} className="p-3 bg-[var(--bg-secondary)] rounded-2xl text-slate-500 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:block mb-10 cursor-pointer group" onClick={() => setView('home')}>
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
            className="w-40 grayscale brightness-0 dark:grayscale-0 dark:brightness-100 transition-all group-hover:scale-105"
          />
        </div>

        <nav className="space-y-1.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Main Signals</p>
          {NAV_ITEMS.map((item) => {
            const isLocked = item.id === 'resources' && currentUser.subscriptionTier === 'Free';
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-[var(--radius-main)] transition-all group active:scale-[0.98] ${
                  activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:bg-[var(--bg-secondary)] hover:text-indigo-600'
                } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="text-[11px] tracking-widest font-black uppercase">
                    {item.id === 'groups' ? `${userCollege} Wing` : item.id === 'resources' ? 'Vault' : item.label}
                  </span>
                </div>
                {isLocked && <Lock size={14} className="text-slate-400" />}
              </button>
            );
          })}
          
          <button
            onClick={() => setView('settings')}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[var(--radius-main)] transition-all group active:scale-[0.98] ${
              activeView === 'settings' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'text-slate-500 hover:bg-[var(--bg-secondary)] hover:text-indigo-600'
            }`}
          >
            <Settings size={22} />
            <span className="text-[11px] tracking-widest font-black uppercase">Customization</span>
          </button>
        </nav>

        {isAdmin && (
          <div className="mt-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-4">Authorized Area</p>
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[var(--radius-main)] transition-all border border-dashed active:scale-[0.98] ${
                activeView === 'admin' 
                ? 'bg-slate-900 dark:bg-indigo-600 text-white border-transparent' 
                : 'border-[var(--border-color)] text-slate-500 hover:border-indigo-500 hover:text-indigo-600'
              }`}
            >
              <Cpu size={22} />
              <span className="text-[11px] font-black uppercase tracking-widest">Control Panel</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[var(--border-color)] space-y-4">
        <button 
          onClick={onLogout} 
          className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-95 shadow-sm"
        >
          <LogOut size={20} />
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest">Logout Signal</span>
        </button>
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest text-center">MakSocial Network v4.1 Stable</p>
      </div>
    </aside>
  );
};

export default Sidebar;
