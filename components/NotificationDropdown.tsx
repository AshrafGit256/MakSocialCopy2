
import React from 'react';
import { db } from '../db';
import { MakNotification } from '../types';
import { Bell, Trash2, ShieldCheck, Zap, Star, Activity, X, ChevronRight, Terminal } from 'lucide-react';

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
    // In a real app, you'd call db.saveNotifications here too
  };

  const getIcon = (type: MakNotification['type']) => {
    switch (type) {
      case 'skill_match': return <Zap size={14} className="text-amber-500" />;
      case 'engagement': return <Star size={14} className="text-[var(--brand-color)]" />;
      case 'system': return <ShieldCheck size={14} className="text-emerald-500" />;
      default: return <Activity size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-[360px] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-2xl z-[1000] overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--brand-color)]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Signal_Manifest</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={16}/></button>
      </div>

      <div className="max-h-[400px] overflow-y-auto no-scrollbar bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
        {notifications.length > 0 ? notifications.map((notif) => (
          <div key={notif.id} className="p-4 hover:bg-[var(--bg-secondary)] transition-all group cursor-pointer relative">
            <div className="flex gap-4">
              <div className="mt-0.5 shrink-0 p-2 bg-slate-50 dark:bg-white/5 rounded border border-[var(--border-color)]">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h5 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight mb-1">
                   {notif.title}
                </h5>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {notif.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{notif.timestamp}</span>
                   {notif.type === 'skill_match' && (
                     <span className="text-[8px] font-black text-emerald-500 uppercase">Match_Active</span>
                   )}
                </div>
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
