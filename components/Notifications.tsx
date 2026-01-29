
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Notification } from '../types';
import { 
  Bell, Star, UserPlus, Zap, Clock, ShieldCheck, 
  Trash2, CheckCircle2, Terminal, Filter, MoreHorizontal,
  ChevronRight, Circle, Activity, Database, Hash
} from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'skill_match': return <Zap size={16} className="text-amber-500" />;
      case 'engagement': return <Star size={16} className="text-indigo-500" />;
      case 'follow': return <UserPlus size={16} className="text-emerald-500" />;
      case 'event': return <Clock size={16} className="text-rose-500" />;
      case 'system': return <ShieldCheck size={16} className="text-slate-400" />;
      default: return <Bell size={16} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-32 font-mono text-[var(--text-primary)]">
      
      {/* 1. Header Cluster */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-indigo-600 rounded-md text-white shadow-xl shadow-indigo-600/20">
              <Bell size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Signal_Center</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                 <Activity size={10} className="text-emerald-500 animate-pulse" /> Uplink: {unreadCount} Pending Signals
              </p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={markAllAsRead} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2">
              <CheckCircle2 size={12}/> Mark_All_Synced
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Side Filters */}
        <aside className="lg:col-span-3 space-y-1">
           <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Signal_Categories</h3>
           {[
             { id: 'all', label: 'Universal Feed', icon: <Database size={14}/> },
             { id: 'unread', label: 'Awaiting Sync', count: unreadCount, icon: <Circle size={10} fill="currentColor"/> },
             { id: 'engagements', label: 'Engagements', icon: <Star size={14}/> },
             { id: 'ai', label: 'AI_Synchronizations', icon: <Zap size={14}/> }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setFilter(item.id as any)}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${
                 filter === item.id ? 'bg-[var(--bg-secondary)] border-l-4 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'
               }`}
             >
               <span className="flex items-center gap-3">{item.icon} {item.label}</span>
               {item.count !== undefined && <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[8px]">{item.count}</span>}
             </button>
           ))}
        </aside>

        {/* 3. Notifications List */}
        <main className="lg:col-span-9 space-y-0.5 border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-primary)]">
           <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <Terminal size={14}/> Registry_Output / {filter}
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Filter size={14}/></button>
           </div>

           {filteredNotifs.length > 0 ? (
             <div className="divide-y divide-[var(--border-color)]">
                {filteredNotifs.map(notif => (
                  <div key={notif.id} className={`group relative p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!notif.isRead ? 'border-l-4 border-indigo-600' : ''}`}>
                    <div className="mt-1 shrink-0">
                       {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-[var(--text-primary)] tracking-tight">
                             {notif.title}
                          </h4>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">ID_{notif.meta?.hash || '??'}</span>
                             <button onClick={() => deleteNotif(notif.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
                          "{notif.description}"
                       </p>
                       <div className="flex items-center gap-4 pt-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Clock size={10}/> {notif.timestamp}
                          </span>
                          <span className="text-[8px] font-black text-indigo-600/60 uppercase tracking-[0.2em]">
                             STRATA: {notif.meta?.reason || 'GENERAL'}
                          </span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 text-center space-y-6">
                <Bell size={48} className="mx-auto text-slate-300 opacity-30" />
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-400">Signal.Nullified</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No active signal broadcasts detected in current strata.</p>
                </div>
             </div>
           )}
        </main>
      </div>

      {/* 4. Technical Footer */}
      <div className="mt-20 p-6 border border-dashed border-indigo-600/30 rounded-md bg-indigo-600/5 flex items-center gap-6">
         <div className="p-3 bg-white dark:bg-slate-900 rounded border border-[var(--border-color)]">
            <Hash size={24} className="text-indigo-600" />
         </div>
         <div className="flex-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Integrity Advisory</p>
            <p className="text-[10px] font-medium text-slate-500 italic">"Alphanumeric signal alerts are parsed via local node logic. AI-driven skill matches are computed based on your verified academic profile strata."</p>
         </div>
      </div>

    </div>
  );
};

export default Notifications;
