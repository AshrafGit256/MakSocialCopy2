
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { Violation, User, Post } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Line, ScatterChart, Scatter, ZAxis,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, Cell, CartesianGrid, Legend, PieChart, Pie
} from 'recharts';
import { 
  Users, ShieldCheck, AlertTriangle, UserCheck, Activity, Flag, 
  Trash2, ShieldAlert, MessageSquareWarning, Ban, Search, 
  BarChart3, Cpu, Clock, Zap, Target, Database, TrendingUp, Monitor,
  // Added missing icons for content registry telemetry
  Heart, MessageCircle, Eye
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts());
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'content' | 'security' | 'users'>('intelligence');

  useEffect(() => {
    const sync = () => {
      setViolations(db.getViolations());
      setPosts(db.getPosts());
      setUsers(db.getUsers());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  // ANALYTICS DERIVATION
  const postsByLikes = useMemo(() => [...posts].sort((a,b) => b.likes - a.likes).slice(0, 5), [posts]);
  const postsByComments = useMemo(() => [...posts].sort((a,b) => b.commentsCount - a.commentsCount).slice(0, 5), [posts]);
  
  const hourlyData = useMemo(() => [
    { hour: '00:00', load: 120 }, { hour: '04:00', load: 45 }, { hour: '08:00', load: 450 },
    { hour: '12:00', load: 980 }, { hour: '16:00', load: 1200 }, { hour: '20:00', load: 850 },
    { hour: '23:59', load: 300 }
  ], []);

  const contentDistribution = useMemo(() => [
    { name: 'Academic', value: posts.filter(p => p.aiMetadata?.category === 'Academic').length },
    { name: 'Social', value: posts.filter(p => p.aiMetadata?.category === 'Social').length },
    { name: 'Career', value: posts.filter(p => p.aiMetadata?.category === 'Career').length },
    { name: 'Urgent', value: posts.filter(p => p.aiMetadata?.category === 'Urgent').length },
  ], [posts]);

  const engagementOverTime = useMemo(() => [
    { day: 'Mon', posts: 12, likes: 45, comments: 22 },
    { day: 'Tue', posts: 18, likes: 88, comments: 34 },
    { day: 'Wed', posts: 25, likes: 120, comments: 55 },
    { day: 'Thu', posts: 14, likes: 66, comments: 28 },
    { day: 'Fri', posts: 32, likes: 210, comments: 89 },
  ], []);

  const handleAction = (vId: string, action: 'confirm' | 'ignore', userId: string) => {
    if (action === 'confirm') {
      db.sendWarning(userId, "Account flagged for administrative review of pornographic/suggestive content.");
      db.updateViolationStatus(vId, 'reviewed_confirmed');
    } else {
      db.updateViolationStatus(vId, 'reviewed_ok');
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40 transition-theme">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg shadow-xl shadow-blue-600/20"><Monitor className="text-white" size={24}/></div>
             <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white">Admin Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Research-Grade Analytics & Global Moderation</p>
        </div>
        
        <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-[2rem] border border-black/10 dark:border-white/10 shadow-inner overflow-x-auto max-w-full">
          {[
            { id: 'intelligence', label: 'Dashboard', icon: <TrendingUp size={16}/> },
            { id: 'content', label: 'Live Content', icon: <Database size={16}/> },
            { id: 'security', label: 'Security & Audit', icon: <ShieldAlert size={16}/> },
            { id: 'users', label: 'Identities', icon: <Users size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'intelligence' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* TOP LEVEL STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Total Engagement', val: posts.reduce((acc,p) => acc+p.likes+p.commentsCount, 0), icon: <Zap/>, color: 'text-yellow-500' },
               { label: 'Active Researchers', val: users.length, icon: <Users/>, color: 'text-blue-500' },
               { label: 'Safety Integrity', val: '99.4%', icon: <ShieldCheck/>, color: 'text-emerald-500' },
               { label: 'Data Throughput', val: '2.4 GB', icon: <Activity/>, color: 'text-purple-500' },
             ].map((s,i) => (
               <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 shadow-xl">
                  <div className={`p-3 rounded-xl bg-black/5 w-fit mb-6 ${s.color}`}>{s.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                  <h3 className="text-4xl font-black italic mt-1">{s.val}</h3>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-[3rem] h-[450px]">
              <h4 className="text-xl font-black italic mb-8 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> Engagement Stream (7D)</h4>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={engagementOverTime}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="likes" stroke="#3b82f6" fillOpacity={1} fill="url(#areaColor)" />
                  <Area type="monotone" dataKey="comments" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-10 rounded-[3rem] h-[450px]">
              <h4 className="text-xl font-black italic mb-8 flex items-center gap-2"><Clock size={18} className="text-emerald-500"/> Peak Usage Intensity</h4>
              <ResponsiveContainer width="100%" height="80%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={hourlyData}>
                  <PolarGrid stroke="#2a2f3e" />
                  <PolarAngleAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                  <Radar name="Platform Load" dataKey="hour" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 glass-card p-10 rounded-[3rem] h-[400px]">
              <h4 className="text-xl font-black italic mb-8">Content Categories</h4>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={contentDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {contentDistribution.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] h-[400px]">
              <h4 className="text-xl font-black italic mb-8">Viral Calibration (Top Liked)</h4>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={postsByLikes} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="author" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                   <Bar dataKey="likes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="p-10 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-white/[0.02]">
             <div>
                <h3 className="text-3xl font-black italic tracking-tighter">Live Content Registry</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time engagement telemetry</p>
             </div>
             <button onClick={() => setPosts(db.getPosts())} className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><TrendingUp size={20}/></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="p-8">Contributor</th>
                  <th className="p-8">Content Fragment</th>
                  <th className="p-8">Classification</th>
                  <th className="p-8">Telemetry (L/C/V)</th>
                  <th className="p-8 text-right">Administrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                    <td className="p-8">
                       <div className="flex items-center gap-4">
                          <img src={p.authorAvatar} className="w-10 h-10 rounded-2xl object-cover shadow-lg" />
                          <p className="font-black italic text-slate-900 dark:text-slate-200">{p.author}</p>
                       </div>
                    </td>
                    <td className="p-8"><p className="text-sm text-slate-500 italic max-w-xs truncate">"{p.content}"</p></td>
                    <td className="p-8"><span className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-[9px] font-black uppercase text-blue-500">{p.aiMetadata?.category || 'Social'}</span></td>
                    <td className="p-8">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-red-500"><Heart size={14}/> <span className="text-xs font-black">{p.likes}</span></div>
                          <div className="flex items-center gap-2 text-blue-500"><MessageCircle size={14}/> <span className="text-xs font-black">{p.commentsCount}</span></div>
                          <div className="flex items-center gap-2 text-slate-500"><Eye size={14}/> <span className="text-xs font-black">{p.views}</span></div>
                       </div>
                    </td>
                    <td className="p-8 text-right">
                       <button onClick={() => { if(window.confirm("Purge content?")) setPosts(db.deletePost(p.id, 'admin')!); }} className="p-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-right-10 duration-500">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-black italic">NSFW Audit & Moderation Queue</h3>
            {violations.map(v => (
              <div key={v.id} className="glass-card p-8 rounded-[3rem] border-white/5 flex flex-col md:flex-row gap-8 hover:border-red-500/20 transition-all">
                <div className="w-full md:w-64 h-64 rounded-3xl overflow-hidden bg-black relative group cursor-crosshair shadow-2xl border border-white/10">
                  {v.media ? (
                    <img src={`data:${v.mimeType};base64,${v.media}`} className="w-full h-full object-cover blur-3xl group-hover:blur-none transition-all duration-1000 scale-110 group-hover:scale-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50">
                      <ShieldAlert size={48} className="text-red-500/20 mb-4" />
                      <p className="text-[10px] text-slate-600 font-black uppercase">Media Redacted</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 group-hover:opacity-0 transition-opacity">
                    <Zap size={24} className="text-white mb-2 animate-pulse" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Hold to Inspect Content</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                   <div>
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white">{v.userName}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{v.timestamp} • Origin: {v.userId}</p>
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${v.status === 'blocked' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>{v.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-6 font-medium italic border-l-2 border-red-500/20 pl-4 py-1">"{(v.content || 'System classified media as high-risk content.')}"</p>
                      <div className="mt-8 p-6 bg-red-500/5 dark:bg-red-500/[0.02] rounded-3xl border border-red-500/10 group-hover:bg-red-500/10 transition-colors">
                         <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2 mb-2"><ShieldAlert size={14}/> AI Forensic Inference</p>
                         <p className="text-xs text-slate-400 font-semibold leading-relaxed">{v.reason}</p>
                      </div>
                   </div>
                   {v.status === 'blocked' && (
                     <div className="flex gap-4 mt-8">
                        <button onClick={() => handleAction(v.id, 'ignore', v.userId)} className="flex-1 py-4 bg-emerald-500/10 text-emerald-600 font-black rounded-2xl text-[10px] uppercase tracking-widest border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all">False Positive</button>
                        <button onClick={() => handleAction(v.id, 'confirm', v.userId)} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all">Confirm Policy Breach</button>
                     </div>
                   )}
                </div>
              </div>
            ))}
            {violations.length === 0 && <div className="text-center py-40 glass-card rounded-[4rem] border-dashed border-2 border-black/5 dark:border-white/5"><Activity className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={64}/><p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Security Matrix Clear</p></div>}
          </div>
          
          <div className="space-y-10">
            <h3 className="text-3xl font-black italic">Risk Analysis</h3>
            <div className="glass-card p-10 rounded-[3rem] h-[350px] shadow-xl">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-2"><Target size={14}/> Attack Vector Magnitude</p>
               <ResponsiveContainer width="100%" height="70%">
                  <BarChart data={contentDistribution}>
                     <Bar dataKey="value" fill="#ef4444" radius={[6,6,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            
            <div className="glass-card p-10 rounded-[3rem] border-red-500/10 shadow-2xl bg-gradient-to-br from-red-500/[0.02] to-transparent">
               <h4 className="text-xs font-black uppercase text-red-600 dark:text-red-500 mb-8 tracking-[0.2em] flex items-center gap-2"><AlertTriangle size={16}/> High-Risk Surveillance</h4>
               <div className="space-y-4">
                  {users.filter(u => (u.warningsCount || 0) > 0).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5 group hover:bg-red-500/5 transition-all">
                       <div className="flex items-center gap-4">
                          <img src={u.avatar} className="w-10 h-10 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                          <div className="flex flex-col">
                             <p className="text-sm font-black italic text-slate-800 dark:text-slate-200">{u.name}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">{u.college}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-lg ${u.isSuspended ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-500'}`}>
                            {u.isSuspended ? 'SUSPENDED' : `${u.warningsCount}/3 STRIKES`}
                          </span>
                       </div>
                    </div>
                  ))}
                  {!users.some(u => (u.warningsCount || 0) > 0) && <p className="text-xs text-slate-500 italic font-medium">No behavioral anomalies detected across user identities.</p>}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card rounded-[4rem] overflow-hidden border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
             <h3 className="text-3xl font-black italic tracking-tighter">Student Identity Registry</h3>
             <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                <input className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" placeholder="Search identities..."/>
             </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="p-10">Verification Profile</th>
                <th className="p-10">Academic Unit</th>
                <th className="p-10">Trust Score</th>
                <th className="p-10 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={u.avatar} className="w-16 h-16 rounded-3xl object-cover border-2 border-slate-200 dark:border-white/10 group-hover:border-blue-500 transition-colors shadow-xl" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-[var(--bg-primary)] rounded-full ${u.isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-xl italic tracking-tight">{u.name}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex flex-col">
                      <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest w-fit border border-blue-500/20">{u.college}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 ml-1">{u.status}</span>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className={u.isSuspended ? 'text-red-500' : 'text-slate-400'}>{u.isSuspended ? 'REVOKED' : 'SECURE'}</span>
                          <span className="text-slate-600">{100 - (u.warningsCount || 0) * 33}%</span>
                       </div>
                       <div className="w-40 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${u.isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${100 - (u.warningsCount || 0) * 33}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-10 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => db.sendWarning(u.id, "Account flagged for administrative review.")} title="Send Policy Warning" className="p-4 bg-orange-500/10 text-orange-600 rounded-[1.5rem] hover:bg-orange-500 hover:text-white transition-all shadow-lg"><MessageSquareWarning size={20}/></button>
                      <button onClick={() => { if(window.confirm("Confirm Revocation?")) db.suspendUser(u.id); setUsers(db.getUsers()); }} title="Suspend Identity" className={`p-4 rounded-[1.5rem] transition-all shadow-lg ${u.isSuspended ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600 hover:bg-red-500 hover:text-white'}`}>
                        {u.isSuspended ? <UserCheck size={20}/> : <Ban size={20}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
