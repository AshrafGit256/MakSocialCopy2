
import React from 'react';
import { AppView } from '../types';
import { 
  Home, Search, MessageSquare, User as UserIcon, Calendar, 
  BookOpen, Bell, LogOut, Settings,
  Briefcase, Cpu, LayoutPanelTop
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
    { id: 'home', label: 'Pulse Feed', icon: <Home size={22} /> },
    { id: 'gallery', label: 'Visual Hub', icon: <LayoutPanelTop size={22} /> },
    { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
    { id: 'admin-calendar', label: 'Calendar', icon: <Calendar size={22} /> },
    { id: 'chats', label: 'Chat Hub', icon: <MessageSquare size={22} /> },
    { id: 'search-widget', label: 'Search', icon: <Search size={22} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={22} /> },
    { id: 'notifications', label: 'Signals', icon: <Bell size={22} /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={22} /> },
    { id: 'settings', label: 'OS Config', icon: <Settings size={22} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[2001] w-72 bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* LOGO CONTAINER */}
        <div className="px-6 py-10 flex items-center justify-center bg-transparent">
          <div 
            className="cursor-pointer w-full flex justify-center group outline-none" 
            onClick={() => setView('home')}
          >
            <img 
              src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" 
              className="w-full h-auto max-h-16 object-contain brightness-95 transition-all group-hover:scale-[1.01]" 
              alt="MakSocial Logo" 
            />
          </div>
        </div>

        <nav className="px-3 space-y-2">
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
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-full transition-all group ${activeView === item.id ? 'text-[var(--brand-color)] font-bold' : 'text-[var(--text-primary)] hover:bg-slate-500/10'}`}
            >
              <div className={activeView === item.id ? 'text-[var(--brand-color)]' : 'text-[var(--text-primary)]'}>
                {item.icon}
              </div>
              <span className="text-[22px] font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-8 pt-8 px-3 border-t border-[var(--border-color)]">
            <button onClick={() => setView('admin')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-full transition-all ${activeView === 'admin' ? 'text-[var(--brand-color)] font-bold' : 'text-[var(--text-primary)] hover:bg-slate-500/10'}`}>
              <Cpu size={22} />
              <span className="text-[22px] font-bold tracking-tight">Admin Terminal</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
        <button onClick={onLogout} className="w-full py-3 text-rose-600 rounded-full hover:bg-rose-50 transition-all flex items-center justify-center gap-2 font-bold text-[14px]">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
