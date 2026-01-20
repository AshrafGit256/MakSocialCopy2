
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll, TimelineEvent, CalendarEvent, College, UserStatus, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock,
  DollarSign, Briefcase, Calendar, Link as LinkIcon, Image as ImageIcon,
  Youtube, Mic2, Newspaper, Radio, History, Heart, User as UserIcon, Zap, X,
  Bell, FileText, Download, BarChart2, PieChart, Printer, AlertTriangle,
  Award, ShieldCheck, UserMinus, Shield, Verified, UserPlus, RefreshCw
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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [suspendDays, setSuspendDays] = useState(7);
  const [medalName, setMedalName] = useState('');
  const [medalIcon, setMedalIcon] = useState('🏅');

  // Register Form State
  const [regForm, setRegForm] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Lecturer',
    college: 'COCIS',
    status: 'Graduate',
    courseAbbr: 'GEN',
    academicLevel: 'Faculty',
    gender: 'M',
    isVerified: true
  });

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

  const handleUnsuspend = (userId: string) => {
    if (window.confirm("Lift suspension protocol for this node? Authority confirmation required.")) {
      db.unsuspendUser(userId);
      setUsers(db.getUsers());
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

  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return;
    
    // Auto-verify if they are high-profile
    const isHighProfile = regForm.role === 'Lecturer' || regForm.role === 'Administrator' || regForm.role === 'Student Leader';
    
    db.registerNode({
      ...regForm,
      isVerified: isHighProfile || regForm.isVerified
    });
    
    setUsers(db.getUsers());
    setShowRegisterModal(false);
    setRegForm({
      name: '', email: '', role: 'Lecturer', college: 'COCIS', status: 'Graduate', 
      courseAbbr: 'GEN', academicLevel: 'Faculty', gender: 'M', isVerified: true
    });
    alert("Node registered and validated in the central registry.");
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
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Global Node Registry</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Strata management and biometric validation</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <div className="p-4 bg-emerald-600/5 rounded-2xl border border-emerald-600/10 flex-1 md:flex-none">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Nodes</p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">{users.length}</p>
                 </div>
                 <button 
                   onClick={() => setShowRegisterModal(true)}
                   className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
                 >
                    <UserPlus size={18}/> Register New Node
                 </button>
              </div>
           </div>

           <div className="glass-card overflow-x-auto border-[var(--border-color)] no-scrollbar">
              <table className="w-full text-left min-w-[1000px]">
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
                                {u.isSuspended ? (
                                  <button 
                                    onClick={() => handleUnsuspend(u.id)}
                                    className="p-2.5 rounded-xl bg-emerald-600 text-white border border-emerald-500 shadow-lg shadow-emerald-600/20 animate-in zoom-in"
                                    title="Restore Signal"
                                  >
                                     <RefreshCw size={18}/>
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => { setSelectedUser(u); setShowSuspendModal(true); }}
                                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all"
                                    title="Suspend Protocol"
                                  >
                                     <UserMinus size={18}/>
                                  </button>
                                )}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Modal - Register New Node */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-2xl p-10 bg-[var(--sidebar-bg)] border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Register High-Profile Node</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized creation of administrative & faculty identities</p>
                 </div>
                 <button onClick={() => setShowRegisterModal(false)} className="text-slate-500 hover:text-rose-500 p-2"><X size={28}/></button>
              </div>

              <form onSubmit={handleRegisterNode} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all"
                         required
                         value={regForm.name}
                         onChange={e => setRegForm({...regForm, name: e.target.value})}
                         placeholder="Dr. Jane Doe"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">University Email</label>
                       <input 
                         type="email"
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all"
                         required
                         value={regForm.email}
                         onChange={e => setRegForm({...regForm, email: e.target.value})}
                         placeholder="jane.doe@staff.mak.ac.ug"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Authority Stratum (Role)</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                         value={regForm.role}
                         onChange={e => setRegForm({...regForm, role: e.target.value as any})}
                       >
                          <option value="Lecturer">Lecturer / Faculty</option>
                          <option value="Administrator">University Administrator</option>
                          <option value="Student Leader">Student Leader (GRC/Guild)</option>
                          <option value="Student">Special Student Node</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                         value={regForm.academicLevel}
                         onChange={e => setRegForm({...regForm, academicLevel: e.target.value as any})}
                       >
                          <option value="Faculty">Faculty Member</option>
                          <option value="PhD">Doctoral Level</option>
                          <option value="Postgrad">Postgraduate Level</option>
                          <option value="Undergrad">Undergraduate Level</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">College Unit</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                         value={regForm.college}
                         onChange={e => setRegForm({...regForm, college: e.target.value as any})}
                       >
                          {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Course Abbr.</label>
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none"
                         value={regForm.courseAbbr}
                         onChange={e => setRegForm({...regForm, courseAbbr: e.target.value})}
                         placeholder="e.g. CS, LAW, SE"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none appearance-none"
                         value={regForm.gender}
                         onChange={e => setRegForm({...regForm, gender: e.target.value as any})}
                       >
                          <option value="M">Male Node</option>
                          <option value="F">Female Node</option>
                          <option value="Other">Other Protocol</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 p-4 bg-indigo-600/5 rounded-2xl border border-indigo-600/10">
                    <ShieldCheck size={20} className="text-indigo-600"/>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Automatic Validation Policy</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">High-profile nodes are biometrically verified by default upon registration.</p>
                    </div>
                    <input 
                       type="checkbox" 
                       className="w-6 h-6 rounded-lg border-indigo-600" 
                       checked={regForm.isVerified} 
                       onChange={e => setRegForm({...regForm, isVerified: e.target.checked})}
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowRegisterModal(false)} className="flex-1 py-4 bg-[var(--bg-secondary)] text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort Process</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700">Deploy Node Signal</button>
                 </div>
              </form>
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

      {/* Intelligence Tab */}
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

      {/* Placeholder for other tabs */}
      {(activeTab === 'maktv' || activeTab === 'registry' || activeTab === 'events') && (
        <div className="py-40 text-center space-y-8 animate-in zoom-in duration-700">
           <div className="w-32 h-32 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[var(--border-color)] text-slate-300">
              <RefreshCw size={56} className="animate-spin-slow" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter italic">Module Registry Under Construction</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">This tactical command module is currently being synchronized with the main grid.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
