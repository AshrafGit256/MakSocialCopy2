
import React from 'react';
import { db } from '../db';
import { MakNotification } from '../types';
import { Bell, Trash2, ShieldCheck, Zap, Star, Activity, X, ChevronRight, Terminal, UserPlus, Mail, FileText, Calendar } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
  onViewAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, onViewAll }) => {
  const [notifications, setNotifications] = React.useState<MakNotification[]>([]);

  React.useEffect(() => {
    setNotifications(db.getNotifications().slice(0, 5));
  }, []);

  const deleteNotif = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
  };

  const getIcon = (type: MakNotification['type'], title: string) => {
    if (title.includes('Email')) return <Mail size={14} className="text-indigo-500" />;
    if (title.includes('Vault')) return <FileText size={14} className="text-emerald-500" />;
    if (title.includes('Opportunity')) return <Zap size={14} className="text-amber-500" />;
    
    switch (type) {
      case 'skill_match': return <Zap size={14} className="text-amber-500" />;
      case 'engagement': return <Star size={14} className="text-[var(--brand-color)]" />;
      case 'follow': return <UserPlus size={14} className="text-emerald-500" />;
      case 'event': return <Calendar size={14} className="text-rose-500" />;
      case 'system': return <ShieldCheck size={14} className="text-slate-400" />;
      default: return <Activity size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-[380px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-2xl z-[1000] overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--brand-color)]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Signal_Manifest</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={16}/></button>
      </div>

      <div className="max-h-[450px] overflow-y-auto no-scrollbar bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
        {notifications.length > 0 ? notifications.map((notif) => (
          <div key={notif.id} className={`p-4 hover:bg-[var(--bg-secondary)] transition-all group cursor-pointer relative ${!notif.isRead ? 'bg-indigo-500/5' : ''}`}>
            <div className="flex gap-4">
              <div className="mt-0.5 shrink-0 relative">
                {notif.meta?.nodeAvatar ? (
                  <img src={notif.meta.nodeAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-slate-50 flex items-center justify-center">
                    {getIcon(notif.type, notif.title)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5 border border-[var(--border-color)] shadow-sm">
                   {getIcon(notif.type, notif.title)}
                </div>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center justify-between gap-2 mb-1">
                   <h5 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                      {notif.title}
                   </h5>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{notif.timestamp}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {notif.description}
                </p>
                {notif.type === 'follow' && (
                  <div className="mt-2">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-[1px] text-[8px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Follow Back</button>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={(e) => deleteNotif(e, notif.id)}
              className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 rounded transition-all text-slate-400"
            >
              <Trash2 size={12}/>
            </button>
          </div>
        )) : (
          <div className="py-20 text-center space-y-4 opacity-30">
            <Bell size={32} className="mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest">Protocol.Silence</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => { onViewAll(); onClose(); }}
        className="w-full py-4 bg-[var(--bg-secondary)] hover:bg-[var(--brand-color)] hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-t border-[var(--border-color)] flex items-center justify-center gap-2"
      >
        Access Signal Center <ChevronRight size={12}/>
      </button>
    </div>
  );
};

export default NotificationDropdown;
