
import React from 'react';
import { AppView } from '../types';
import { 
  Home, Search, MessageSquare, User as UserIcon, Calendar, 
  BookOpen, Bell, Settings, LogOut, 
  Briefcase, Cpu, LayoutPanelTop, Mail, LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSearchToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isAdmin, onLogout, isOpen, onSearchToggle }) => {
  const navItems = [
    { id: 'home', label: 'Pulse Feed', icon: <Home size={20} /> },
    { id: 'gallery', label: 'Visual Hub', icon: <LayoutPanelTop size={20} /> },
    { id: 'chats', label: 'Chat Hub', icon: <MessageSquare size={20} /> },
    { id: 'email', label: 'Email Hub', icon: <Mail size={20} /> },
    { id: 'search-widget', label: 'Search', icon: <Search size={20} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={20} /> },
    { id: 'admin-calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'resources', label: 'The Vault', icon: <BookOpen size={20} /> },
    { id: 'notifications', label: 'Signals', icon: <Bell size={20} /> },
    { id: 'settings', label: 'UI Config', icon: <Settings size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2001] w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* LOGO CONTAINER - Fixed for blending */}
        <div className="px-6 py-10 flex items-center justify-center">
          <div 
            className="cursor-pointer w-full flex justify-center group" 
            onClick={() => setView('home')}
          >
            <img 
              src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" 
              className="w-full h-auto max-h-16 object-contain filter dark:brightness-100 brightness-90 transition-all group-hover:scale-[1.02] group-active:scale-95" 
              alt="MakSocial Logo" 
            />
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'search-widget') {
                  onSearchToggle();
                } else {
                  setView(item.id as AppView);
                }
              }}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all ${activeView === item.id ? 'bg-[var(--brand-color)] text-white shadow-md' : 'text-slate-500 hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'}`}
            >
              <div className={activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[var(--brand-color)]'}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-8 pt-8 px-3 border-t border-[var(--border-color)]">
            <button onClick={() => setView('admin')} className={`w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all ${activeView === 'admin' ? 'bg-[var(--brand-color)]/20 text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}>
              <Cpu size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin Terminal</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <button onClick={onLogout} className="w-full py-3 bg-rose-600/10 text-rose-500 rounded-md hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest">
          <LogOut size={16} /> Terminate_Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
