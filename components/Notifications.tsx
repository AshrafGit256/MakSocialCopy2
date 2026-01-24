import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Notification } from '../types';
import { 
  Bell, Star, UserPlus, Zap, Clock, ShieldCheck, 
  Trash2, CheckCircle2, Terminal, Filter, MoreHorizontal,
  ChevronRight, Circle, Activity, Database, Hash,
  Fingerprint, Cpu, Search, Inbox, AlertCircle, RefreshCcw
} from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'engagements' | 'ai'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
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
      
      {/* 1. REGISTRY HEADER CLUSTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-[#64748b] rounded text-white shadow-xl shadow-[#64748b]/20">
              <Inbox size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Signal_Center</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                 <Activity size={10} className="text-emerald-500 animate-pulse" /> Network: {unreadCount} Pending Synchronizations
              </p>
           </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleRefresh}
             className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded hover:text-[var(--text-primary)] transition-all"
           >
             <RefreshCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
           </button>
           <button onClick={markAllAsRead} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2">
              <CheckCircle2 size={12}/> Mark_Synced
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. CATEGORY SIDEPANEL */}
        <aside className="lg:col-span-3 space-y-1">
           <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Signal_Strata</h3>
           {[
             { id: 'all', label: 'Universal Feed', icon: <Database size={14}/> },
             { id: 'unread', label: 'Awaiting Sync', count: unreadCount, icon: <Circle size={10} fill="currentColor"/> },
             { id: 'engagements', label: 'Engagements', icon: <Star size={14}/> },
             { id: 'ai', label: 'Credential Match', icon: <Zap size={14}/> }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setFilter(item.id as any)}
               className={`w-full flex items-center justify-between px-3 py-3 rounded text-[11px] font-bold uppercase tracking-wide transition-all ${
                 filter === item.id ? 'bg-[var(--bg-secondary)] border-l-4 border-indigo-600 text-indigo-600 font-black' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'
               }`}
             >
               <span className="flex items-center gap-3">{item.icon} {item.label}</span>
               {item.count !== undefined && item.count > 0 && <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[8px]">{item.count}</span>}
             </button>
           ))}

           <div className="pt-8 space-y-4">
              <div className="p-4 bg-indigo-600/5 border border-indigo-600/10 rounded">
                 <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">AI Sync Engine</span>
                 </div>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">Credential matches are computed based on your node's verified academic profile.</p>
              </div>
           </div>
        </aside>

        {/* 3. SIGNAL LIST - GITHUB STYLE */}
        <main className="lg:col-span-9 space-y-0.5 border border-[var(--border-color)] rounded overflow-hidden bg-[var(--bg-primary)] shadow-sm">
           <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <Terminal size={14}/> Registry_Output / {filter}
              </div>
              <div className="flex items-center gap-4">
                 <Search size={14} className="text-slate-400 cursor-pointer" />
                 <Filter size={14} className="text-slate-400 cursor-pointer" />
              </div>
           </div>

           {filteredNotifs.length > 0 ? (
             <div className="divide-y divide-[var(--border-color)]">
                {filteredNotifs.map(notif => (
                  <div key={notif.id} className={`group relative p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-indigo-600/5 border-l-4 border-indigo-600' : ''}`}>
                    <div className="mt-1 shrink-0">
                       {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-[var(--text-primary)] tracking-tight">
                             {notif.title}
                          </h4>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">COMMIT_{notif.meta?.hash || '??'}</span>
                             <button onClick={() => deleteNotif(notif.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <p className={`text-[11px] font-bold uppercase tracking-tight leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-[var(--text-primary)]'}`}>
                          {notif.description}
                       </p>
                       <div className="flex items-center gap-4 pt-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Clock size={10}/> {notif.timestamp}
                          </span>
                          <span className="text-[8px] font-black text-indigo-600/60 uppercase tracking-[0.2em]">
                             Strata: {notif.meta?.reason || 'General'}
                          </span>
                          {!notif.isRead && (
                             <span className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1">
                                <AlertCircle size={10}/> Priority_Link
                             </span>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 text-center space-y-6">
                <Inbox size={48} className="mx-auto text-slate-300 opacity-20" />
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-400">Registry.Silence</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No active signal broadcasts detected in current strata.</p>
                </div>
             </div>
           )}
        </main>
      </div>

      {/* 4. AUDIT FOOTER */}
      <div className="mt-20 p-8 border border-dashed border-indigo-600/30 rounded bg-indigo-600/5 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
         <div className="p-4 bg-white dark:bg-slate-900 rounded border border-[var(--border-color)] shadow-xl">
            <Fingerprint size={32} className="text-indigo-600" />
         </div>
         <div className="flex-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Signal Protocol Advisory</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Signal Center alerts are parsed via decentralized node logic. AI-driven synchronization ensures that high-density opportunities are matched to your identity strands in real-time.
            </p>
         </div>
         <button className="px-8 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">View Security Audit</button>
      </div>

    </div>
  );
};

export default Notifications;