
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { MakNotification } from '../types';
import { 
  Bell, Star, UserPlus, Zap, Clock, ShieldCheck, 
  Trash2, CheckCircle2, Terminal, Filter,
  Circle, Activity, Database, Hash,
  Mail, FileText, ExternalLink, Calendar
} from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<MakNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'engagements' | 'ai'>('all');
  useEffect(() => {
    const sync = () => setNotifications(db.getNotifications());
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'engagements') return n.type === 'engagement' || n.type === 'follow';
    if (filter === 'ai') return n.type === 'skill_match';
    return true;
  });
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    db.saveNotifications(updated);
    setNotifications(updated);
  };
  const deleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    db.saveNotifications(updated);
    setNotifications(updated);
  };
  const getIcon = (type: MakNotification['type']) => {
    switch (type) {
      case 'skill_match': return <Zap size={16} className="text-amber-500" />;
      case 'engagement': return <Star size={16} className="text-[var(--brand-color)]" />;
      case 'follow': return <UserPlus size={16} className="text-emerald-500" />;
      case 'event': return <Calendar size={16} className="text-rose-500" />;
      case 'system': return <ShieldCheck size={16} className="text-slate-400" />;
      default: return <Bell size={16} />;
    }
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-32 font-sans text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 font-sans">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-[var(--brand-color)] rounded-md text-white shadow-xl shadow-[var(--brand-color)]/20"><Bell size={28} /></div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Notifications</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                 <Activity size={10} className="text-emerald-500 animate-pulse" /> {unreadCount} New alerts
              </p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={markAllAsRead} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest hover:text-[var(--brand-color)] transition-all flex items-center gap-2"><CheckCircle2 size={12}/> Mark All Read</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        <aside className="lg:col-span-3 space-y-1">
           <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Categories</h3>
           {[
             { id: 'all', label: 'All Notifications', icon: <Database size={14}/> },
             { id: 'unread', label: 'Unread', count: unreadCount, icon: <Circle size={10} fill="currentColor"/> },
             { id: 'engagements', label: 'Engagements', icon: <Star size={14}/> },
             { id: 'ai', label: 'AI Matches', icon: <Zap size={14}/> }
           ].map(item => (
             <button key={item.id} onClick={() => setFilter(item.id as any)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${filter === item.id ? 'bg-[var(--bg-secondary)] border-l-4 border-[var(--brand-color)] text-[var(--brand-color)]' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}>
               <span className="flex items-center gap-3">{item.icon} {item.label}</span>
               {item.count !== undefined && <span className="bg-[var(--brand-color)] text-white px-2 py-0.5 rounded-full text-[8px] font-sans">{item.count}</span>}
             </button>
           ))}
        </aside>
        <main className="lg:col-span-9 space-y-0.5 border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-primary)] font-sans">
           <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Terminal size={14}/> Viewing: {filter}</div>
              <button className="text-slate-400 hover:text-[var(--brand-color)] transition-colors"><Filter size={14}/></button>
           </div>
           {filteredNotifs.length > 0 ? (
             <div className="divide-y divide-[var(--border-color)]">
                {filteredNotifs.map(notif => (
                  <div key={notif.id} className={`group relative p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!notif.isRead ? 'border-l-4 border-[var(--brand-color)] bg-[var(--brand-color)]/5' : ''}`}>
                    <div className="mt-1 shrink-0 relative">
                       {notif.meta?.nodeAvatar ? <img src={notif.meta.nodeAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover" /> : <div className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-slate-100 flex items-center justify-center">{getIcon(notif.type)}</div>}
                       <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5 border border-[var(--border-color)] shadow-sm">{getIcon(notif.type)}</div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                       <div className="flex items-center justify-between">
                          <h4 className="text-[13px] font-black uppercase text-[var(--text-primary)] tracking-tight">{notif.title}</h4>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => deleteNotif(notif.id)} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <p className="text-[12px] text-slate-500 font-medium leading-relaxed">"{notif.description}"</p>
                       <div className="pt-2 flex flex-wrap gap-2 font-sans">
                          {notif.type === 'follow' && <button className="px-4 py-1.5 bg-[var(--brand-color)] text-white rounded-[2px] text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2 active:scale-95"><UserPlus size={12}/> Follow Back</button>}
                          {notif.title.includes('Email') && <button className="px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[2px] text-[9px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all flex items-center gap-2"><Mail size={12}/> Open Message</button>}
                          {notif.title.includes('Vault') && <button className="px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[2px] text-[9px] font-black uppercase tracking-widest hover:border-emerald-600 transition-all flex items-center gap-2"><FileText size={12}/> View File</button>}
                          {notif.type === 'skill_match' && <button className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-[2px] text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2"><Zap size={12}/> View Match</button>}
                          {notif.type === 'event' && <button className="px-4 py-1.5 bg-rose-600 text-white rounded-[2px] text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2"><ExternalLink size={12}/> View Event</button>}
                       </div>
                       <div className="flex items-center gap-4 pt-1 font-sans">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10}/> {notif.timestamp}</span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 text-center space-y-6 font-sans">
                <Bell size={48} className="mx-auto text-slate-300 opacity-30" />
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-400">No Notifications</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">You don't have any notifications at the moment.</p>
                </div>
             </div>
           )}
        </main>
      </div>
      <div className="mt-20 p-6 border border-dashed border-slate-500/30 rounded-md bg-slate-500/5 flex items-center gap-6 font-sans">
         <div className="p-3 bg-white dark:bg-slate-900 rounded border border-[var(--border-color)]"><Hash size={24} className="text-slate-500" /></div>
         <div className="flex-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Note</p>
            <p className="text-[10px] font-medium text-slate-500">Your notifications are customized based on your profile and activities on campus.</p>
         </div>
      </div>
    </div>
  );
};

export default Notifications;
