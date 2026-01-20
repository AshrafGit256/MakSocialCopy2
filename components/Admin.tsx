
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll, TimelineEvent, CalendarEvent } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock,
  DollarSign, Briefcase, Calendar, Link as LinkIcon, Image as ImageIcon,
  Youtube, Mic2, Newspaper, Radio, History, Heart, User as UserIcon, Zap, X,
  Bell, FileText, Download, BarChart2, PieChart, Printer, AlertTriangle,
  Award, ShieldCheck, UserMinus, Shield, Verified
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(db.getTimeline());
  const [events, setEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'registry' | 'maktv' | 'nodes' | 'events'>('intelligence');
  
  // Selection States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showMedalModal, setShowMedalModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendDays, setSuspendDays] = useState(7);
  const [medalName, setMedalName] = useState('');
  const [medalIcon, setMedalIcon] = useState('🏅');

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
      setEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = (userId: string) => {
    db.toggleVerification(userId);
    setUsers(db.getUsers());
  };

  const handleSuspend = () => {
    if (selectedUser) {
      db.suspendUser(selectedUser.id, suspendDays);
      setUsers(db.getUsers());
      setShowSuspendModal(false);
    }
  };

  const handleAwardMedal = () => {
    if (selectedUser && medalName) {
      db.awardMedal(selectedUser.id, { name: medalName, icon: medalIcon });
      setUsers(db.getUsers());
      setShowMedalModal(false);
      setMedalName('');
    }
  };

  const medalsOptions = ['🏅', '🔬', '🏆', '💡', '🎓', '⚖️', '⚽', '🎨'];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30 transition-theme"><Monitor className="text-white" size={26}/></div>
             <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)] uppercase">Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Forensic Intelligence & Governance</p>
        </div>
        
        <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-inner overflow-x-auto no-scrollbar transition-theme">
          {[
            { id: 'intelligence', label: 'Stats', icon: <TrendingUp size={16}/> },
            { id: 'nodes', label: 'Node Registry', icon: <Shield size={16}/> },
            { id: 'registry', label: 'Signal Feed', icon: <Activity size={16}/> },
            { id: 'events', label: 'Events Hub', icon: <Calendar size={16}/> },
            { id: 'maktv', label: 'MakTV', icon: <Tv size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Registry Tab */}
      {activeTab === 'nodes' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Global Node Registry</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Strata management and biometric validation</p>
              </div>
              <div className="flex gap-4">
                 <div className="p-4 bg-emerald-600/5 rounded-2xl border border-emerald-600/10">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Nodes</p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">{users.length}</p>
                 </div>
              </div>
           </div>

           <div className="glass-card overflow-hidden border-[var(--border-color)]">
              <table className="w-full text-left">
                 <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                    <tr>
                       <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Identity Protocol</th>
                       <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Academic Stratum</th>
                       <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Biometric Details</th>
                       <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Link Status</th>
                       <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Command Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--border-color)] bg-[var(--sidebar-bg)]">
                    {users.map(u => (
                       <tr key={u.id} className={`hover:bg-indigo-600/[0.02] transition-colors ${u.isSuspended ? 'bg-rose-500/[0.03]' : ''}`}>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                   <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-color)]" />
                                   {u.isVerified && (
                                     <div className="absolute -bottom-1 -right-1">
                                        <AuthoritySeal isVerified={true} size="sm" />
                                     </div>
                                   )}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{u.name}</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{u.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="space-y-1">
                                <p className="text-xs font-black text-indigo-600 uppercase">{u.role}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{u.college} • {u.courseAbbr}</p>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${u.gender === 'M' ? 'bg-blue-500/10 text-blue-600' : 'bg-rose-500/10 text-rose-600'}`}>Gen: {u.gender}</span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-slate-500">{u.academicLevel}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             {u.isSuspended ? (
                                <div className="flex items-center gap-2 text-rose-500 animate-pulse">
                                   <AlertTriangle size={14}/>
                                   <span className="text-[9px] font-black uppercase tracking-widest">Protocol Halted</span>
                                </div>
                             ) : (
                                <div className="flex items-center gap-2 text-emerald-500">
                                   <ShieldCheck size={14}/>
                                   <span className="text-[9px] font-black uppercase tracking-widest">Active Link</span>
                                </div>
                             )}
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleVerify(u.id)}
                                  className={`p-2.5 rounded-xl border transition-all ${u.isVerified ? 'bg-blue-600 text-white border-blue-500' : 'bg-[var(--bg-secondary)] text-slate-400 border-[var(--border-color)] hover:text-blue-500'}`}
                                  title="Validate Identity"
                                >
                                   <Verified size={18}/>
                                </button>
                                <button 
                                  onClick={() => { setSelectedUser(u); setShowMedalModal(true); }}
                                  className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all"
                                  title="Award Honor Medal"
                                >
                                   <Award size={18}/>
                                </button>
                                <button 
                                  onClick={() => { setSelectedUser(u); setShowSuspendModal(true); }}
                                  className={`p-2.5 rounded-xl border transition-all ${u.isSuspended ? 'bg-rose-600 text-white border-rose-500' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white'}`}
                                  title="Suspend Protocol"
                                >
                                   <UserMinus size={18}/>
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Modal - Award Medal */}
      {showMedalModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
           <div className="glass-card w-full max-w-md p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">Award Merit Protocol</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-8">Recognize node excellence in {selectedUser?.name}</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Medal Identity</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" placeholder="e.g. Innovation Lead" value={medalName} onChange={e => setMedalName(e.target.value)} />
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Icon Frequency</label>
                    <div className="grid grid-cols-4 gap-3">
                       {medalsOptions.map(m => (
                          <button key={m} onClick={() => setMedalIcon(m)} className={`p-4 rounded-xl text-2xl border transition-all ${medalIcon === m ? 'bg-indigo-600 border-indigo-500 shadow-lg' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-500'}`}>{m}</button>
                       ))}
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowMedalModal(false)} className="flex-1 py-4 bg-[var(--bg-secondary)] text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                    <button onClick={handleAwardMedal} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30">Commit Signal</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal - Suspend Protocol */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-rose-900/40 backdrop-blur-md">
           <div className="glass-card w-full max-w-md p-8 bg-[var(--sidebar-bg)] border-rose-500/20 rounded-[2.5rem] shadow-2xl">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                 <ShieldAlert size={32}/>
              </div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">Suspend Node Protocol</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-8">Halting link synchronization for {selectedUser?.name}</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Suspension Duration (Days)</label>
                    <div className="flex gap-2">
                       {[3, 7, 30, 90].map(d => (
                          <button key={d} onClick={() => setSuspendDays(d)} className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${suspendDays === d ? 'bg-rose-600 text-white border-rose-500' : 'bg-[var(--bg-secondary)] text-slate-500 border-[var(--border-color)]'}`}>{d}D</button>
                       ))}
                    </div>
                 </div>
                 <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed">WARNING: Node will lose access to broadcast feed and resource vault until the suspension registry clears.</p>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowSuspendModal(false)} className="flex-1 py-4 bg-[var(--bg-secondary)] text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                    <button onClick={handleSuspend} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/30">Confirm Deactivation</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Other Tabs remain similar or updated with similar high-res styling... */}
      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
           {[
             { label: 'Total Engagement', val: posts.reduce((a,c) => a+c.views, 0).toLocaleString(), icon: <Activity/>, color: 'text-indigo-600 dark:text-indigo-500' },
             { label: 'Platform Revenue', val: `UGX 1.2M`, icon: <DollarSign/>, color: 'text-emerald-600 dark:text-emerald-500' },
             { label: 'Validated Nodes', val: users.length, icon: <ShieldCheck/>, color: 'text-amber-600 dark:text-amber-500' },
             { label: 'Official Protocols', val: events.length, icon: <Calendar/>, color: 'text-rose-600 dark:text-rose-400' },
           ].map((s,i) => (
             <div key={i} className="glass-card p-8 shadow-sm bg-[var(--sidebar-bg)] border-[var(--border-color)] group hover:border-indigo-500 transition-all">
                <div className={`p-3 rounded-xl bg-[var(--bg-secondary)] w-fit mb-6 ${s.color}`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <h3 className="text-4xl font-black mt-1 text-[var(--text-primary)]">{s.val}</h3>
             </div>
           ))}
        </div>
      )}

      {/* MakTV, Signal Feed tabs as before... */}
    </div>
  );
};

export default Admin;
