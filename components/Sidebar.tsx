
import React, { useState, useEffect } from 'react';
import { AppView, User } from '../types';
import { db } from '../db';
import { 
  Home, Search, MessageCircle, User as UserIcon, Calendar, 
  BookOpen, Bell, Settings, ShieldCheck, LogOut, Award, Star, Cpu 
} from 'lucide-react';

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
  const [currentUser] = useState<User>(db.getUser());

  const navItems = [
    { id: 'home', label: 'Pulse Feed', icon: <Home size={22} /> },
    { id: 'chats', label: 'Chats Hub', icon: <MessageCircle size={22} /> },
    { id: 'search', label: 'Registry', icon: <Search size={22} /> },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
    { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
    { id: 'notifications', label: 'Signals', icon: <Bell size={22} /> },
    { id: 'profile', label: 'Terminal', icon: <UserIcon size={22} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2001] w-72 bg-[#1e1e2d] border-r border-white/5 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 rounded-xl bg-[#10918a] flex items-center justify-center shadow-xl shadow-[#10918a]/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-white">MakSocial</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeView === item.id ? 'bg-[#10918a]/20 text-[#10918a] shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-10 pt-10 border-t border-white/5">
            <button onClick={() => setView('admin')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${activeView === 'admin' ? 'bg-[#10918a]/20 text-[#10918a]' : 'text-slate-500 hover:text-white'}`}>
              <Cpu size={22} />
              <span className="text-[11px] font-black uppercase tracking-widest">Admin Terminal</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-[#1e1e2d]/50">
        <button onClick={onLogout} className="w-full py-4 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl">
          <LogOut size={18} /> Terminate
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
