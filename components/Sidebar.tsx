
import React from 'react';
import { AppView } from '../types';
import { 
  Home, Search, MessageCircle, User as UserIcon, Calendar, 
  BookOpen, Bell, Settings, ShieldCheck, LogOut, 
  Zap, Cpu
} from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout, isOpen }) => {
  const navItems = [
    { id: 'home', label: 'Pulse Feed', icon: <Home size={20} /> },
    { id: 'chats', label: 'Chat Hub', icon: <MessageCircle size={20} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Zap size={20} /> },
    { id: 'search', label: 'Registry', icon: <Search size={20} /> },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'resources', label: 'The Vault', icon: <BookOpen size={20} /> },
    { id: 'notifications', label: 'Signals', icon: <Bell size={20} /> },
    { id: 'settings', label: 'UI Config', icon: <Settings size={20} /> },
    { id: 'profile', label: 'Terminal', icon: <UserIcon size={20} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2001] w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-color)] flex items-center justify-center shadow-xl shadow-[var(--brand-color)]/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">MakSocial</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'}`}
            >
              {item.icon}
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
            <button onClick={() => setView('admin')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === 'admin' ? 'bg-[var(--brand-color)]/20 text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}>
              <Cpu size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest">Admin Terminal</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
        <button onClick={onLogout} className="w-full py-4 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl">
          <LogOut size={18} /> Terminate
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
