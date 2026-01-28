
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog, College, Post } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart,
  RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Users, Activity, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Settings, Menu, Bell, 
  LogOut, Megaphone, TrendingUp, BarChart3,
  Edit3, HardDrive, Eye, ChevronRight, ChevronLeft,
  CalendarDays, Download, PieChart as PieChartIcon,
  MousePointer2, Clock, Globe, ShieldAlert,
  Search, Filter, CheckCircle, Ban, AlertTriangle, Terminal,
  UserCheck, Shield, Cpu, Binary, Radar, CandlestickChart,
  ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  Image as ImageIcon, Maximize2, Power, Sliders, Command, Radio
} from 'lucide-react';

// Tactical Candlestick Visualization
const UsageCandlestickChart = ({ data }: { data: any[] }) => {
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
        <XAxis dataKey="time" fontSize={8} axisLine={false} tickLine={false} tick={{ fill: '#8b949e' }} />
        <YAxis domain={[minValue - 5, maxValue + 5]} fontSize={8} axisLine={false} tickLine={false} tick={{ fill: '#8b949e' }} tickFormatter={(v) => `${v}r/s`} />
        <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px', borderRadius: '4px' }} itemStyle={{ color: '#c9d1d9' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Scatter dataKey="high" fill="none">
          {data.map((entry, index) => (
             <Cell key={`wick-${index}`} stroke={entry.open > entry.close ? '#ef4444' : '#10b981'} strokeWidth={1} />
          ))}
        </Scatter>
        <Bar dataKey="close" barSize={12}>
           {data.map((entry, index) => {
             const isUp = entry.close >= entry.open;
             return (
               <Cell key={`body-${index}`} fill={isUp ? '#10b981' : '#ef4444'} fillOpacity={0.8} stroke={isUp ? '#10b981' : '#ef4444'} />
             );
           })}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const StatBlock: React.FC<{ 
  title: string, value: string | number, trend?: string, icon: React.ReactNode, color: string 
}> = ({ title, value, trend, icon, color }) => (
  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-sm relative group hover:border-slate-500 transition-all">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>{icon}</div>
    <div className="flex flex-col gap-1">
      <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.3em]">{title}</p>
      <h2 className="text-2xl font-black text-white italic tracking-tighter">{value}</h2>
      {trend && <span className={`text-[8px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend} VS LAST_SYNC</span>}
    </div>
  </div>
);

type AdminTab = 'Telemetry' | 'Nodes' | 'Surveillance' | 'Shield' | 'Treasury' | 'Config' | 'Logs';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Telemetry');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [threatLevel, setThreatLevel] = useState(14);
  const [posts, setPosts] = useState<Post[]>(db.getPosts());
  const [users, setUsers] = useState<User[]>(db.getUsers());
  
  // Site Toggles (Control State)
  const [siteConfig, setSiteConfig] = useState({
    maintenanceMode: false,
    newUserLock: false,
    vaultPublicAccess: true,
    broadcastIntensity: 85
  });

  // Data Simulation
  useEffect(() => {
    const generateData = () => {
      let base = 65;
      return Array.from({ length: 24 }, (_, i) => {
        const open = base + (Math.random() - 0.5) * 12;
        const close = open + (Math.random() - 0.5) * 18;
        base = close;
        return {
          time: `${i}:00`,
          open, close,
          high: Math.max(open, close) + Math.random() * 5,
          low: Math.min(open, close) - Math.random() * 5
        };
      });
    };
    setUsageData(generateData());

    const timer = setInterval(() => {
      setUsageData(prev => {
        const last = prev[prev.length - 1];
        const nextOpen = last.close;
        const nextClose = nextOpen + (Math.random() - 0.5) * 12;
        return [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: nextOpen, close: nextClose,
          high: Math.max(nextOpen, nextClose) + Math.random() * 4,
          low: Math.min(nextOpen, nextClose) - Math.random() * 4
        }];
      });
      setThreatLevel(t => Math.max(5, Math.min(95, t + (Math.random() - 0.5) * 4)));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const leaderboard = useMemo(() => {
    return [...users]
      .sort((a, b) => (b.totalLikesCount + b.postsCount * 10) - (a.totalLikesCount + a.postsCount * 10))
      .slice(0, 5);
  }, [users]);

  const collegeEngagement = [
    { name: 'COCIS', val: 88, fill: '#6366f1' },
    { name: 'CEDAT', val: 72, fill: '#10b981' },
    { name: 'LAW', val: 45, fill: '#ef4444' },
    { name: 'CHUSS', val: 64, fill: '#f59e0b' },
    { name: 'GLOBAL', val: 95, fill: '#8b5cf6' },
  ];

  const violations = [
    { type: 'AUTH_BRUTE', count: 14, risk: 'High', color: 'text-rose-500' },
    { type: 'SQL_INJECT', count: 2, risk: 'Critical', color: 'text-rose-600' },
    { type: 'SPAM_UPLINK', count: 452, risk: 'Low', color: 'text-amber-500' },
    { type: 'XSS_FILTER', count: 28, risk: 'Mid', color: 'text-indigo-500' },
  ];

  const handlePurge = (id: string) => {
    if(confirm("PROTOCOL: Permanent removal of signal?")) {
      db.deletePost(id);
      setPosts(db.getPosts());
    }
  };

  const handleNodeAction = (id: string, action: 'suspend' | 'verify') => {
    const updated = users.map(u => {
      if(u.id === id) {
        if(action === 'suspend') return {...u, accountStatus: u.accountStatus === 'Suspended' ? 'Active' : 'Suspended' as any};
        if(action === 'verify') return {...u, verified: !u.verified};
      }
      return u;
    });
    setUsers(updated);
    db.saveUsers(updated);
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-[#c9d1d9] font-mono overflow-hidden">
      
      {/* 1. TACTICAL SIDEBAR */}
      <aside className={`bg-[#161b22] border-r border-[#30363d] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#30363d] shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center mr-3 shadow-lg shadow-indigo-600/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-black text-xs text-white uppercase tracking-tighter italic">MakAdmin.v4</span>}
        </div>

        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-3">
            {[
              { id: 'Telemetry', icon: <Activity size={18}/> },
              { id: 'Nodes', icon: <Users size={18}/> },
              { id: 'Surveillance', icon: <Eye size={18}/> },
              { id: 'Shield', icon: <ShieldAlert size={18}/> },
              { id: 'Treasury', icon: <DollarSign size={18}/> },
              { id: 'Config', icon: <Sliders size={18}/> },
              { id: 'Logs', icon: <Terminal size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-4 py-3 rounded-sm transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-widest">{item.id}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#30363d]">
           <button onClick={onLogout} className="w-full bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white py-3 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <Power size={16}/> {!isSidebarCollapsed && "Terminate Session"}
           </button>
        </div>
      </aside>

      {/* 2. COMMAND CENTER */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-[#0d1117] border-b border-[#30363d] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-sm text-[8px] font-black uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Kernel_Optimized
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Registry_v4.2 // HILL_STABLE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right mr-2 hidden sm:block">
                <p className="text-[8px] font-black text-slate-500 uppercase">Authorization</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase">Super_Administrator</p>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-sm border border-[#30363d] bg-[#161b22] shadow-xl" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32 bg-[radial-gradient(#161b22_1px,transparent_1px)] bg-[size:40px_40px]">
          
          {activeTab === 'Telemetry' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Global Stats Cluster */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatBlock title="Active_Nodes" value={users.length} trend="+12" icon={<Users size={20}/>} color="indigo" />
                  <StatBlock title="Request_Velocity" value="1,242/hr" trend="+4%" icon={<Zap size={20}/>} color="amber" />
                  <StatBlock title="Entropy_Threat" value={`${Math.round(threatLevel)}%`} trend="+2%" icon={<ShieldAlert size={20}/>} color="rose" />
                  <StatBlock title="Global_Liquidity" value="14.8M" trend="-2%" icon={<DollarSign size={20}/>} color="emerald" />
               </div>

               {/* Candlestick & Leaderboard */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] p-6 rounded-sm min-h-[450px] flex flex-col">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2">
                              <Activity size={16} className="text-indigo-500"/> Network_Volatility (OHLC)
                           </h3>
                           <p className="text-[8px] text-slate-500 uppercase mt-1">Metric: Server Requests per second / Interval: 4s</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-[8px] font-black uppercase text-slate-400">Optimal</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-500 rounded-full"></div><span className="text-[8px] font-black uppercase text-slate-400">Peak_Load</span></div>
                        </div>
                     </div>
                     <div className="flex-1">
                        <UsageCandlestickChart data={usageData} />
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                     <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Trophy size={120} className="text-amber-500 rotate-12" /></div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500 mb-6 flex items-center gap-2">
                           <Trophy size={14}/> Top_Signal_Contributors
                        </h4>
                        <div className="space-y-4">
                           {leaderboard.map((u, i) => (
                             <div key={u.id} className="flex items-center justify-between p-3 bg-black/20 border border-[#30363d] rounded-sm group hover:border-indigo-500 transition-all">
                                <div className="flex items-center gap-3">
                                   <div className="relative">
                                      <img src={u.avatar} className="w-8 h-8 rounded-sm grayscale group-hover:grayscale-0" />
                                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#161b22] border border-[#30363d] rounded-full flex items-center justify-center text-[8px] font-black text-indigo-500">{i+1}</div>
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-[10px] font-black text-white truncate uppercase">{u.name}</p>
                                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{u.college}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-indigo-400">{u.totalLikesCount.toLocaleString()}</p>
                                   <p className="text-[7px] text-slate-500 uppercase font-black">STARS</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm relative overflow-hidden">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
                           <Binary size={14} className="text-indigo-500"/> Sector_Synergy
                        </h4>
                        <div className="h-48">
                           <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart innerRadius="20%" outerRadius="100%" data={collegeEngagement} startAngle={180} endAngle={0}>
                                 <RadialBar background dataKey="val" cornerRadius={0} />
                                 <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} itemStyle={{fontSize: '10px'}} />
                              </RadialBarChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="space-y-1.5 mt-2">
                           {collegeEngagement.map(c => (
                              <div key={c.name} className="flex justify-between items-center text-[9px] font-black uppercase">
                                 <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: c.fill}}></div><span className="text-slate-400">{c.name}</span></div>
                                 <span className="text-white">{c.val}%</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Surveillance' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                   <div className="flex justify-between items-center mb-10">
                      <div className="space-y-1">
                         <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
                            <Eye size={16} className="text-indigo-500"/> Signal_Scrutiny_Matrix
                         </h3>
                         <p className="text-[9px] text-slate-500 uppercase tracking-widest">Global Surveillance Feed / Nodes Scanned: {posts.length}</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="bg-black/40 p-1 border border-[#30363d] rounded-sm flex">
                            <button className="p-2 bg-indigo-600 text-white rounded-sm"><Grid size={14}/></button>
                            <button className="p-2 text-slate-500 hover:text-white"><List size={14}/></button>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {posts.map(post => {
                        const hasImg = post.images && post.images.length > 0;
                        const snippet = post.content.replace(/<[^>]*>/g, '').slice(0, 150);
                        return (
                          <div key={post.id} className="bg-black/40 border border-[#30363d] rounded-sm flex flex-col group hover:border-indigo-500 transition-all overflow-hidden">
                             <div className="px-3 py-2 border-b border-[#30363d] flex justify-between bg-white/5 items-center">
                                <span className="text-[8px] font-black text-indigo-400 uppercase truncate max-w-[120px]">{post.author}</span>
                                <span className="text-[8px] font-mono text-slate-500">ID_{post.id.slice(-4)}</span>
                             </div>
                             
                             <div className="flex-1 p-4 space-y-3">
                                {hasImg ? (
                                   <div className="aspect-video bg-black rounded-sm overflow-hidden border border-[#30363d]">
                                      <img src={post.images![0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                   </div>
                                ) : (
                                   <div className="aspect-video bg-indigo-600/5 border border-dashed border-[#30363d] rounded-sm flex flex-col items-center justify-center gap-1">
                                      <ImageIcon size={20} className="text-slate-700" />
                                      <span className="text-[7px] font-black uppercase text-slate-600">No_Visual_Payload</span>
                                   </div>
                                )}
                                <p className="text-[10px] leading-relaxed text-slate-400 italic font-medium line-clamp-4">"{snippet || 'Empty alphanumeric signal buffer...'}"</p>
                             </div>

                             <div className="p-3 border-t border-[#30363d] bg-black/40 grid grid-cols-3 gap-2">
                                <button onClick={() => handlePurge(post.id)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-sm" title="Purge Signal"><Trash2 size={14}/></button>
                                <button className="p-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-sm" title="Validate Signal"><Check size={14}/></button>
                                <button className="p-2 bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-sm" title="Inspect Node"><Search size={14}/></button>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Shield' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500 mb-10 flex items-center gap-2">
                         <Flame size={16}/> Violation_Attempt_Manifest
                      </h3>
                      <div className="space-y-4">
                         {violations.map(v => (
                           <div key={v.type} className="flex items-center justify-between p-4 bg-black/20 border border-[#30363d] rounded-sm group hover:border-rose-500 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-sm bg-rose-600/10 ${v.color}`}><ShieldAlert size={20}/></div>
                                 <div>
                                    <p className="text-[11px] font-black uppercase text-white tracking-tight">{v.type}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">Detection_Layer: Neural_Guard_v2</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className={`text-xl font-black italic leading-none ${v.color}`}>{v.count}</p>
                                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">RISK: {v.risk}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-sm flex flex-col items-center justify-center text-center space-y-8">
                      <div className="relative w-48 h-48">
                         <svg className="w-full h-full transform -rotate-90">
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={552.9} strokeDashoffset={552.9 * (1 - threatLevel/100)} className="text-rose-500 transition-all duration-1000" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black italic tracking-tighter text-rose-500">{Math.round(threatLevel)}%</span>
                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Entropy_Risk</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-sm font-black uppercase text-white italic">Shield_Status: Deflecting</h4>
                         <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed max-w-[240px]">AI-driven heuristics are actively scrubbing packet headers for malformed university ID tokens.</p>
                      </div>
                      <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Flush_Safety_Buffers</button>
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center gap-2">
                      <Clock size={16} className="text-amber-500"/> Activity_Peak_Strata
                   </h3>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={ANALYTICS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
                            <XAxis dataKey="day" fontSize={9} axisLine={false} tickLine={false} tick={{fill:'#8b949e'}} />
                            <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{fill:'#8b949e'}} />
                            <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} />
                            <Line type="step" dataKey="messages" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill:'#6366f1'}} />
                            <Line type="step" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill:'#f59e0b'}} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-8 mt-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Message_Flux</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Node_Activeness</div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Treasury' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                   <div className="flex justify-between items-end mb-10">
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2">
                            <DollarSign size={16}/> Global_Treasury_Ledger
                         </h3>
                         <p className="text-[9px] text-slate-500 uppercase mt-1 italic">Reporting Period: Jan 2026 - Present</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/20 p-4 border border-[#30363d] rounded-sm">
                         <div className="text-right">
                            <p className="text-[8px] font-black uppercase text-slate-500">Aggregate_Net</p>
                            <p className="text-xl font-black text-emerald-500 italic">UGX 42,850,000</p>
                         </div>
                         <div className="p-2 bg-emerald-600 text-white rounded-sm shadow-lg"><TrendingUp size={20}/></div>
                      </div>
                   </div>
                   <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={REVENUE_HISTORY}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{fill:'#8b949e'}} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `UGX ${v/1000}k`} tick={{fill:'#8b949e'}} />
                            <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} />
                            <Bar dataKey="revenue" fill="#10b981" barSize={40} fillOpacity={0.6} />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{r: 5, fill:'#ef4444'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Subscriber_Strata</h4>
                      <div className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={[
                                  { name: 'Free', value: 850, fill: '#30363d' },
                                  { name: 'Pro', value: 120, fill: '#6366f1' },
                                  { name: 'Enterprise', value: 30, fill: '#f59e0b' }
                               ]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                  <Cell /> <Cell /> <Cell />
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex justify-around text-[9px] font-black uppercase text-slate-500 mt-4">
                         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> PRO (12%)</div>
                         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> ENTERPRISE (3%)</div>
                         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#30363d] rounded-full"></div> FREE (85%)</div>
                      </div>
                   </div>
                   <div className="bg-indigo-600 p-8 rounded-sm text-white relative overflow-hidden flex flex-col justify-center">
                      <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Zap size={140}/></div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Ad_Sync_Liquidity</h4>
                      <div className="space-y-6">
                         <div>
                            <p className="text-4xl font-black italic tracking-tighter">UGX 12,420,000</p>
                            <p className="text-[8px] font-bold uppercase tracking-widest opacity-80 mt-1">Sourced from 42 Validated Corporate Nodes</p>
                         </div>
                         <button className="w-full py-4 bg-white text-indigo-600 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 shadow-2xl active:scale-95 transition-all">Generate_Fiscal_Manifest</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Config' && (
             <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-sm space-y-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-700 text-white rounded-sm"><Command size={24}/></div>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">Command_Parameters</h3>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Configure global site operational logic</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      {[
                        { id: 'maintenanceMode', label: 'Mainframe_Maintenance_Mode', desc: 'Lock universal feed and broadcast maintenance signal.', icon: <Lock size={18}/> },
                        { id: 'newUserLock', label: 'Node_Registration_Firewall', desc: 'Prevent new identity enrollment in the global registry.', icon: <Users size={18}/> },
                        { id: 'vaultPublicAccess', label: 'Vault_Public_Synchronization', desc: 'Allow non-verified nodes to view basic academic assets.', icon: <Database size={18}/> }
                      ].map(cfg => (
                        <div key={cfg.id} className="flex items-center justify-between p-6 bg-black/20 border border-[#30363d] rounded-sm group hover:border-slate-500 transition-all">
                           <div className="flex items-center gap-5">
                              <div className={`p-3 rounded-sm ${siteConfig[cfg.id as keyof typeof siteConfig] ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[#0d1117] text-slate-500'}`}>{cfg.icon}</div>
                              <div>
                                 <p className="text-[11px] font-black uppercase text-white tracking-tight">{cfg.label}</p>
                                 <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-1">{cfg.desc}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setSiteConfig({...siteConfig, [cfg.id]: !siteConfig[cfg.id as keyof typeof siteConfig]})}
                             className={`w-14 h-7 rounded-full relative transition-colors ${siteConfig[cfg.id as keyof typeof siteConfig] ? 'bg-indigo-600' : 'bg-slate-800'}`}
                           >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${siteConfig[cfg.id as keyof typeof siteConfig] ? 'left-8' : 'left-1'}`} />
                           </button>
                        </div>
                      ))}

                      <div className="space-y-4 p-6 bg-black/20 border border-[#30363d] rounded-sm">
                         <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                               <Radio size={18} className="text-indigo-500" />
                               <span className="text-[11px] font-black uppercase text-white tracking-tight">Broadcast_Signal_Intensity</span>
                            </div>
                            <span className="text-indigo-500 font-black text-xs">{siteConfig.broadcastIntensity}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="100" 
                           value={siteConfig.broadcastIntensity}
                           onChange={(e) => setSiteConfig({...siteConfig, broadcastIntensity: parseInt(e.target.value)})}
                           className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                         />
                      </div>
                   </div>

                   <div className="pt-6 border-t border-[#30363d] flex justify-end">
                      <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-sm shadow-xl active:scale-95 transition-all">Commit_Protocol_Changes</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Nodes' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#161b22] border border-[#30363d] rounded-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-[#30363d] flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                      <div className="flex items-center gap-3">
                         <Terminal size={18} className="text-indigo-500" />
                         <h3 className="text-xs font-black uppercase tracking-[0.4em]">Registry / Node_Directory</h3>
                      </div>
                      <div className="relative group w-full md:w-80">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
                         <input placeholder="Search Node ID..." className="w-full bg-[#0d1117] border border-[#30363d] rounded-sm px-9 py-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all" />
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold border-collapse">
                        <thead className="bg-[#161b22] border-b border-[#30363d] uppercase text-slate-500">
                           <tr>
                              <th className="p-5 tracking-widest">Node_Identity</th>
                              <th className="p-5 tracking-widest">Sector</th>
                              <th className="p-5 tracking-widest">Strata_Tier</th>
                              <th className="p-5 tracking-widest">Signal_Status</th>
                              <th className="p-5 text-center tracking-widest">Control_Uplink</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                           {users.map(u => (
                             <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-5 flex items-center gap-4">
                                   <img src={u.avatar} className="w-10 h-10 rounded-sm border border-[#30363d] grayscale group-hover:grayscale-0 transition-all" />
                                   <div>
                                      <p className="font-black uppercase text-white tracking-tight flex items-center gap-2">
                                         {u.name} {u.verified && <CheckCircle size={10} className="text-indigo-500" />}
                                      </p>
                                      <p className="text-[9px] text-slate-500 font-mono italic uppercase">HASH_{u.id.slice(-6)}</p>
                                   </div>
                                </td>
                                <td className="p-5 text-indigo-400 font-black uppercase">{u.college}</td>
                                <td className="p-5">
                                   <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-black tracking-widest border ${u.subscriptionTier === 'Pro' ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' : u.subscriptionTier === 'Enterprise' ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-slate-700 text-slate-500'}`}>
                                      {u.subscriptionTier}
                                   </span>
                                </td>
                                <td className="p-5">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.accountStatus === 'Suspended' ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                                      <span className="text-[10px] font-black uppercase text-slate-400">{u.accountStatus || 'Stable'}</span>
                                   </div>
                                </td>
                                <td className="p-5 text-center">
                                   <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleNodeAction(u.id, 'verify')} className={`p-2 rounded-sm border transition-all ${u.verified ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-[#30363d] hover:text-white hover:border-indigo-500'}`} title="Verify Node"><UserCheck size={14}/></button>
                                      <button onClick={() => handleNodeAction(u.id, 'suspend')} className={`p-2 rounded-sm border transition-all ${u.accountStatus === 'Suspended' ? 'bg-rose-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-[#30363d] hover:text-white hover:border-rose-500'}`} title="Suspend Node"><Ban size={14}/></button>
                                      <button className="p-2 bg-slate-800 rounded-sm border border-[#30363d] text-slate-400 hover:text-white hover:border-slate-500 transition-all"><Edit3 size={14}/></button>
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Logs' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center gap-2">
                      <Terminal size={16}/> Protocol_Audit_Manifest
                   </h3>
                   <div className="space-y-3 font-mono text-[9px]">
                      {[
                        { time: '14:20:05', action: 'NODE_AUTH', user: 'root', target: 'COBAMS_WING', status: 'SUCCESS' },
                        { time: '14:21:12', action: 'SYNC_SIGNAL', user: 'ai_bot', target: 'PULSE_STREAM', status: 'COMMIT' },
                        { time: '14:24:10', action: 'FILTER_SIGNAL', user: 'neural_guard', target: 'SPAM_029', status: 'DROPPED' },
                        { time: '14:30:55', action: 'VIOLATION_DROP', user: 'shield_bot', target: 'XSS_INJECT', status: 'BLOCKED' },
                        { time: '14:35:12', action: 'TREASURY_SYNC', user: 'admin', target: 'FISCAL_DB', status: 'SUCCESS' },
                        { time: '14:40:01', action: 'POST_PURGE', user: 'root', target: 'NODE_HASH_842', status: 'SUCCESS' },
                        { time: '14:42:15', action: 'VERIFY_SIGNAL', user: 'admin', target: 'USER_CEDAT_04', status: 'SUCCESS' },
                      ].map((log, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 py-3 border-b border-[#30363d] last:border-0 hover:bg-white/5 transition-all px-4 group cursor-default">
                           <span className="text-slate-500 shrink-0">[{log.time}]</span>
                           <span className="text-indigo-400 font-bold w-32 shrink-0">{log.action}</span>
                           <span className="text-slate-400 tracking-tight shrink-0 uppercase">NODE: {log.user}</span>
                           <span className="text-slate-500 truncate flex-1 italic">TARGET: {log.target}</span>
                           <span className={`font-black tracking-widest shrink-0 ${log.status === 'DROPPED' || log.status === 'BLOCKED' ? 'text-rose-500' : 'text-emerald-500'}`}>[{log.status}]</span>
                           <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-white transition-all"><ChevronRight size={14}/></button>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 pt-8 border-t border-[#30363d] flex justify-between items-center text-[8px] font-black uppercase text-slate-500">
                      <span>Live Audit Buffer: 14,205 entries recorded</span>
                      <div className="flex gap-2">
                         <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 transition-all rounded-sm border border-[#30363d]">Export_Manifest</button>
                         <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 transition-all rounded-sm border border-[#30363d]">Clear_Buffer</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
