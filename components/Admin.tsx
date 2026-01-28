
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
  Image as ImageIcon, Maximize2, Power, Sliders, Command, Radio, Target,
  Briefcase, Rocket, Gauge, Compass, Palette
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Custom Tactical Components
const UsageCandlestickChart = ({ data }: { data: any[] }) => {
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
        <XAxis dataKey="time" fontSize={8} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
        <YAxis domain={[minValue - 5, maxValue + 5]} fontSize={8} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `${v}r/s`} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px', borderRadius: '4px' }} itemStyle={{ color: '#f8fafc' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
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
  title: string, value: string | number, trend?: string, icon: React.ReactNode, accent: string 
}> = ({ title, value, trend, icon, accent }) => (
  <div className="bg-[#1e293b]/40 border border-[#334155] p-5 rounded-sm relative group hover:border-slate-400 transition-all overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${accent}`}>{icon}</div>
    <div className="space-y-1">
      <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.4em]">{title}</p>
      <h2 className="text-2xl font-black text-white italic tracking-tighter">{value}</h2>
      {trend && <div className={`text-[8px] font-black flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
         {trend.startsWith('+') ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {trend} SINCE_REBOOT
      </div>}
    </div>
  </div>
);

type AdminTab = 'Telemetry' | 'Registry' | 'Surveillance' | 'Propaganda' | 'Shield' | 'Treasury' | 'Command';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Telemetry');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [threatLevel, setThreatLevel] = useState(12);
  const [accentColor, setAccentColor] = useState('#6366f1');
  
  // Data for sections
  const users = db.getUsers();
  const ads = db.getAds();
  const posts = db.getPosts();

  // Site Protocol States
  const [protocols, setProtocols] = useState({
    maintenance: false,
    firewall: true,
    broadcast: true,
    intensity: 75
  });

  // Simulator
  useEffect(() => {
    let base = 60;
    const initial = Array.from({ length: 24 }, (_, i) => {
      const open = base + (Math.random() - 0.5) * 15;
      const close = open + (Math.random() - 0.5) * 20;
      base = close;
      return {
        time: `${i}:00`, open, close,
        high: Math.max(open, close) + Math.random() * 8,
        low: Math.min(open, close) - Math.random() * 8
      };
    });
    setUsageData(initial);

    const timer = setInterval(() => {
      setUsageData(prev => {
        const last = prev[prev.length - 1];
        const nextOpen = last.close;
        const nextClose = nextOpen + (Math.random() - 0.5) * 10;
        return [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: nextOpen, close: nextClose,
          high: Math.max(nextOpen, nextClose) + Math.random() * 5,
          low: Math.min(nextOpen, nextClose) - Math.random() * 5
        }];
      });
      setThreatLevel(t => Math.max(5, Math.min(95, t + (Math.random() - 0.5) * 6)));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const leaderboard = useMemo(() => {
    return [...users]
      .sort((a, b) => (b.totalLikesCount + b.postsCount * 10) - (a.totalLikesCount + a.postsCount * 10))
      .slice(0, 5);
  }, [users]);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-[#f1f5f9] font-mono overflow-hidden">
      
      {/* 1. TACTICAL SIDEBAR */}
      <aside className={`bg-[#0f172a] border-r border-[#1e293b] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#1e293b] shrink-0 justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center mr-3 shadow-lg" style={{ backgroundColor: accentColor }}>
              <ShieldCheck size={18} className="text-white" />
            </div>
            {!isSidebarCollapsed && <span className="font-black text-[10px] text-white uppercase tracking-[0.2em] italic">MakRegistry.OS</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-3">
            {[
              { id: 'Telemetry', icon: <Activity size={18}/> },
              { id: 'Registry', icon: <Users size={18}/> },
              { id: 'Surveillance', icon: <Eye size={18}/> },
              { id: 'Propaganda', icon: <Megaphone size={18}/> },
              { id: 'Shield', icon: <ShieldAlert size={18}/> },
              { id: 'Treasury', icon: <DollarSign size={18}/> },
              { id: 'Command', icon: <Sliders size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-4 py-3 rounded-sm transition-all group ${activeTab === item.id ? 'bg-slate-700/50 text-white shadow-inner border-l-2' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  style={activeTab === item.id ? { borderLeftColor: accentColor } : {}}
                >
                  <div className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-[0.3em]">{item.id}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#1e293b]">
           <button onClick={onLogout} className="w-full bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white py-3 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
              <Power size={16}/> {!isSidebarCollapsed && "Shutdown Signal"}
           </button>
        </div>
      </aside>

      {/* 2. MAIN TERMINAL */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-[#0f172a] border-b border-[#1e293b] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-sm text-[8px] font-black uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Kernel_Online
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">HillStrata_v4.2.8 // Encrypted_Sync</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right mr-2 hidden sm:block">
                <span className="text-[8px] font-black text-slate-500 uppercase">Authorization</span>
                <p className="text-[10px] font-black uppercase tracking-tighter" style={{ color: accentColor }}>Super_Administrator</p>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-sm border border-[#1e293b] bg-slate-800 shadow-xl" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px]">
          
          {activeTab === 'Telemetry' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Metrics Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatBlock title="Active_Nodes" value={users.length} trend="+12" icon={<Users size={20}/>} accent="text-indigo-500" />
                  <StatBlock title="Request_Flux" value="1.24k/s" trend="+4%" icon={<Zap size={20}/>} accent="text-amber-500" />
                  <StatBlock title="Entropy_Threat" value={`${Math.round(threatLevel)}%`} trendDir="up" icon={<ShieldAlert size={20}/>} accent="text-rose-500" />
                  <StatBlock title="Global_Ledger" value="14.8M" trend="-2%" icon={<DollarSign size={20}/>} accent="text-emerald-500" />
               </div>

               {/* Traffic & Leaderboard */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] p-6 rounded-sm min-h-[450px] flex flex-col">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2">
                              <Activity size={16} style={{ color: accentColor }}/> Network_Volatility (OHLC)
                           </h3>
                           <p className="text-[8px] text-slate-500 uppercase mt-1">Live polling frequency: 4s / Node: Main_Strata</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Stable</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Peak</span></div>
                        </div>
                     </div>
                     <div className="flex-1">
                        <UsageCandlestickChart data={usageData} />
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-sm shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Trophy size={100} className="text-amber-500 rotate-12" /></div>
                       <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500 mb-6 flex items-center gap-2">
                          <Trophy size={14}/> Top_Signal_Contributors
                       </h4>
                       <div className="space-y-4">
                          {leaderboard.map((u, i) => (
                             <div key={u.id} className="flex items-center justify-between p-3 bg-white/5 border border-[#1e293b] rounded-sm group hover:border-slate-500 transition-all">
                                <div className="flex items-center gap-3">
                                   <div className="relative">
                                      <img src={u.avatar} className="w-8 h-8 rounded-sm grayscale group-hover:grayscale-0" />
                                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#0f172a] border border-[#1e293b] rounded-full flex items-center justify-center text-[8px] font-black text-indigo-500">{i+1}</div>
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-[10px] font-black uppercase text-white truncate">{u.name}</p>
                                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{u.college}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-indigo-400">{u.totalLikesCount.toLocaleString()}</p>
                                   <p className="text-[7px] text-slate-500 font-black uppercase">Stars</p>
                                </div>
                             </div>
                          ))}
                       </div>
                       <button className="w-full mt-6 py-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 text-[8px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all">Full_Leaderboard_Manifest</button>
                    </div>

                    <div className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-sm relative overflow-hidden">
                       <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
                          <Binary size={14}/> Sector_Synergy
                       </h4>
                       <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadialBarChart innerRadius="20%" outerRadius="100%" data={[
                               { name: 'COCIS', val: 85, fill: '#6366f1' },
                               { name: 'CEDAT', val: 72, fill: '#10b981' },
                               { name: 'LAW', val: 45, fill: '#f43f5e' },
                               { name: 'CHUSS', val: 64, fill: '#f59e0b' },
                               { name: 'GLOBAL', val: 95, fill: '#8b5cf6' },
                             ]} startAngle={180} endAngle={0}>
                                <RadialBar background dataKey="val" cornerRadius={0} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} itemStyle={{fontSize: '10px'}} />
                             </RadialBarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Surveillance' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-sm">
                   <div className="flex justify-between items-center mb-10">
                      <div className="space-y-1">
                         <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
                            <Eye size={16} style={{ color: accentColor }}/> Signal_Surveillance_Matrix
                         </h3>
                         <p className="text-[9px] text-slate-500 uppercase">Global Multi-node Scanning Grid / Nodes: {posts.length}</p>
                      </div>
                      <div className="flex gap-2 bg-slate-900/50 p-1 border border-[#1e293b] rounded-sm">
                         <button className="p-2 bg-slate-800 text-white rounded-sm"><Grid size={14}/></button>
                         <button className="p-2 text-slate-500 hover:text-white transition-all"><List size={14}/></button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {posts.map(post => {
                        const snippet = post.content.replace(/<[^>]*>/g, '').slice(0, 100);
                        const hasImg = post.images && post.images.length > 0;
                        return (
                          <div key={post.id} className="bg-white/5 border border-[#1e293b] rounded-sm flex flex-col group hover:border-slate-500 transition-all overflow-hidden relative">
                             <div className="px-3 py-2 border-b border-[#1e293b] flex justify-between bg-white/5 items-center">
                                <span className="text-[8px] font-black text-indigo-400 uppercase truncate max-w-[120px]">{post.author}</span>
                                <span className="text-[8px] font-mono text-slate-500">SHA_{post.id.slice(-4)}</span>
                             </div>
                             
                             <div className="flex-1 p-4 space-y-3">
                                {hasImg ? (
                                   <div className="aspect-video bg-black rounded-sm overflow-hidden border border-[#1e293b]">
                                      <img src={post.images![0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                   </div>
                                ) : (
                                   <div className="aspect-video bg-indigo-600/5 border border-dashed border-[#1e293b] rounded-sm flex flex-col items-center justify-center gap-1">
                                      <ImageIcon size={20} className="text-slate-700" />
                                      <span className="text-[7px] font-black uppercase text-slate-600">Visual_Signal_Null</span>
                                   </div>
                                )}
                                <p className="text-[10px] leading-relaxed text-slate-400 italic line-clamp-3">"{snippet || 'Empty alphanumeric signal buffer...'}"</p>
                             </div>

                             <div className="p-3 border-t border-[#1e293b] bg-slate-900/40 grid grid-cols-3 gap-2">
                                <button onClick={() => db.deletePost(post.id)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all rounded-sm flex items-center justify-center" title="Purge Signal"><Trash2 size={14}/></button>
                                <button className="p-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all rounded-sm flex items-center justify-center" title="Validate Hub"><Check size={14}/></button>
                                <button className="p-2 bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all rounded-sm flex items-center justify-center" title="Inspect Node"><Search size={14}/></button>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Propaganda' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">Initialize_Ad</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Inject promotional signal into pulse feed</p>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Propaganda_Label</label>
                            <input className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. MTN_Node_Discount" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Wing_Targeting</label>
                            <select className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-bold outline-none">
                               <option>Universal Hub (All)</option>
                               <option>COCIS Wing Only</option>
                               <option>CEDAT Wing Only</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Signal_TTL (Days)</label>
                               <input type="number" className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-bold outline-none" defaultValue={7} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Budget_Alloc (UGX)</label>
                               <input type="number" className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-bold outline-none" placeholder="50,000" />
                            </div>
                         </div>
                         <button className="w-full py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Broadcast_Promotion</button>
                      </div>
                   </div>

                   <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-sm overflow-hidden">
                      <div className="p-6 border-b border-[#1e293b] bg-white/5 flex items-center justify-between">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><Rocket size={14} className="text-amber-500"/> Active_Campaign_Manifest</h3>
                         <span className="text-[8px] font-bold text-slate-500">Live Telemetry Synchronized</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-[#020617] text-[8px] font-black uppercase tracking-widest text-slate-500">
                              <tr>
                                 <th className="p-5">Campaign_Identity</th>
                                 <th className="p-5">Signal_Reach</th>
                                 <th className="p-5">Intensity (CTR)</th>
                                 <th className="p-5">Fiscal_Burn</th>
                                 <th className="p-5 text-right">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-[#1e293b] text-[10px] font-bold uppercase tracking-tight">
                              {[
                                { name: 'MTN_Pulse_Sync', reach: '24.2k', ctr: '4.2%', burn: 'UGX 120k', status: 'ACTIVE' },
                                { name: 'Stanbic_Lending_Node', reach: '12.8k', ctr: '2.8%', burn: 'UGX 45k', status: 'ACTIVE' },
                                { name: 'Guild_Merch_Inject', reach: '8.4k', ctr: '1.2%', burn: 'UGX 12k', status: 'SUSPENDED' },
                                { name: 'SafeBoda_Protocol', reach: '45.1k', ctr: '8.5%', burn: 'UGX 340k', status: 'ACTIVE' }
                              ].map(ad => (
                                <tr key={ad.name} className="hover:bg-white/5 group transition-colors">
                                   <td className="p-5 flex items-center gap-3">
                                      <div className="p-2 bg-slate-800 rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"><Rocket size={14}/></div>
                                      {ad.name}
                                   </td>
                                   <td className="p-5 text-slate-400">{ad.reach} Nodes</td>
                                   <td className="p-5">
                                      <div className="flex items-center gap-2">
                                         <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: ad.ctr }}></div></div>
                                         {ad.ctr}
                                      </div>
                                   </td>
                                   <td className="p-5 text-emerald-500">{ad.burn}</td>
                                   <td className="p-5 text-right">
                                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black border ${ad.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-rose-500/30 text-rose-500 bg-rose-500/5'}`}>{ad.status}</span>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Command' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm space-y-12">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-800 rounded-sm"><Sliders size={28}/></div>
                      <div>
                         <h3 className="text-2xl font-black uppercase tracking-tighter italic">Command_Parameters</h3>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Personalize OS environment & global protocol logic</p>
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Palette size={14}/> Terminal_Accent_Logic</label>
                         <div className="flex flex-wrap gap-4 p-6 bg-slate-900 rounded-sm border border-[#1e293b]">
                            {COLORS.map(c => (
                               <button key={c} onClick={() => setAccentColor(c)} className={`w-12 h-12 rounded-sm border-2 transition-all ${accentColor === c ? 'border-white scale-110 shadow-2xl' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {[
                           { id: 'maintenance', label: 'Mainframe_Maintenance', desc: 'Broadcast global lockdown signal', icon: <Lock size={18}/> },
                           { id: 'firewall', label: 'Identity_Firewall', desc: 'Prevent new node registration', icon: <Shield size={18}/> },
                           { id: 'broadcast', label: 'Universal_Broadcast', desc: 'Enable global signal push', icon: <Radio size={18}/> }
                         ].map(p => (
                            <button 
                              key={p.id}
                              onClick={() => setProtocols({...protocols, [p.id]: !protocols[p.id as keyof typeof protocols]})}
                              className={`p-6 rounded-sm border text-left flex items-start gap-5 transition-all ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600/5 border-indigo-600' : 'bg-slate-900 border-[#1e293b] opacity-60'}`}
                            >
                               <div className={`p-3 rounded-sm ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-800 text-slate-500'}`}>{p.icon}</div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${protocols[p.id as keyof typeof protocols] ? 'text-indigo-400' : 'text-slate-500'}`}>{p.label}</span>
                                     <div className={`w-10 h-5 rounded-full relative transition-colors ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600' : 'bg-slate-700'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${protocols[p.id as keyof typeof protocols] ? 'left-6' : 'left-1'}`} /></div>
                                  </div>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase">{p.desc}</p>
                               </div>
                            </button>
                         ))}
                      </div>

                      <div className="space-y-4 p-8 bg-slate-900 rounded-sm border border-[#1e293b]">
                         <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Gauge size={14}/> Broadcast_Intensity</label>
                            <span className="text-indigo-500 font-black text-xs">{protocols.intensity}%</span>
                         </div>
                         <input type="range" min="0" max="100" value={protocols.intensity} onChange={(e) => setProtocols({...protocols, intensity: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                      </div>
                   </div>

                   <div className="pt-8 border-t border-[#1e293b] flex justify-end">
                      <button className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-sm shadow-2xl active:scale-95 transition-all">Commit_Protocol_Shifts</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Registry' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-sm overflow-hidden shadow-2xl">
                   <div className="p-6 border-b border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                      <div className="flex items-center gap-3">
                         <Terminal size={18} style={{ color: accentColor }} />
                         <h3 className="text-xs font-black uppercase tracking-[0.4em]">Registry_Master_Manifest</h3>
                      </div>
                      <div className="relative group w-full md:w-80">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
                         <input placeholder="Search Node ID..." className="w-full bg-[#020617] border border-[#1e293b] rounded-sm px-9 py-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all" />
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold border-collapse">
                        <thead className="bg-[#020617] text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-[#1e293b]">
                           <tr>
                              <th className="p-5">Node_Identity</th>
                              <th className="p-5">Wing_Assignment</th>
                              <th className="p-5">Access_Stratum</th>
                              <th className="p-5">Signal_Uptime</th>
                              <th className="p-5 text-right">Terminal_Control</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                           {users.map(u => (
                             <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-5 flex items-center gap-4">
                                   <div className="relative">
                                      <img src={u.avatar} className="w-10 h-10 rounded-sm grayscale group-hover:grayscale-0 transition-all" />
                                      {u.verified && <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5"><Check size={8} className="text-white"/></div>}
                                   </div>
                                   <div>
                                      <p className="font-black uppercase text-white tracking-tight">{u.name}</p>
                                      <p className="text-[9px] text-slate-500 font-mono italic">ID_{u.id.slice(-6).toUpperCase()}</p>
                                   </div>
                                </td>
                                <td className="p-5 text-indigo-400">{u.college}_HUB</td>
                                <td className="p-5">
                                   <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black border ${u.subscriptionTier === 'Pro' ? 'border-indigo-500/50 text-indigo-500' : u.subscriptionTier === 'Enterprise' ? 'border-amber-500/50 text-amber-500' : 'border-slate-700 text-slate-500'}`}>{u.subscriptionTier}</span>
                                </td>
                                <td className="p-5">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.accountStatus === 'Suspended' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                                      <span className="text-[9px] uppercase tracking-widest text-slate-400">{u.accountStatus || 'Stable'}</span>
                                   </div>
                                </td>
                                <td className="p-5 text-right">
                                   <div className="flex items-center justify-end gap-2">
                                      <button className="p-2 bg-slate-800 rounded-sm hover:bg-indigo-600 hover:text-white transition-all"><UserCheck size={14}/></button>
                                      <button className="p-2 bg-slate-800 rounded-sm hover:bg-rose-600 hover:text-white transition-all"><Ban size={14}/></button>
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

          {activeTab === 'Shield' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500 mb-10 flex items-center gap-2"><Flame size={16}/> Filter_Violation_Attempts</h3>
                     <div className="space-y-4">
                        {[
                          { type: 'XSS_INJECTION', count: 142, risk: 'HIGH', time: '2m ago' },
                          { type: 'SQL_SYSTRATA', count: 12, risk: 'CRITICAL', time: '14m ago' },
                          { type: 'BRUTE_UPLINK', count: 852, risk: 'MID', time: '1h ago' },
                          { type: 'PROXY_LEAK', count: 4, risk: 'LOW', time: '3h ago' }
                        ].map(v => (
                           <div key={v.type} className="flex items-center justify-between p-5 bg-black/20 border border-[#1e293b] rounded-sm group hover:border-rose-500 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-sm bg-rose-600/10 text-rose-500`}><ShieldAlert size={20}/></div>
                                 <div>
                                    <p className="text-[11px] font-black uppercase text-white tracking-tight">{v.type}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol: Neural_Sanitize_v2</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xl font-black italic leading-none text-rose-500">{v.count}</p>
                                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">RISK: {v.risk} / {v.time}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm flex flex-col items-center justify-center text-center space-y-10">
                     <div className="relative w-52 h-52">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                           <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={578} strokeDashoffset={578 * (1 - threatLevel/100)} className="text-rose-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-5xl font-black italic tracking-tighter text-rose-500">{Math.round(threatLevel)}%</span>
                           <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.4em]">Entropy_Risk</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase text-white">Shield_Protocol: Active</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed max-w-[200px]">Scrubbing packet headers for malformed university tokens...</p>
                     </div>
                     <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Purge_Violation_Cache</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Treasury' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm">
                   <div className="flex justify-between items-end mb-10">
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2"><DollarSign size={16}/> Global_Treasury_Analytics</h3>
                         <p className="text-[9px] text-slate-500 uppercase mt-1 italic">Aggregated fiscal sync: Jan 2026 - Present</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/20 p-4 border border-[#1e293b] rounded-sm">
                         <div className="text-right">
                            <p className="text-[8px] font-black uppercase text-slate-500">Aggregate_Liquidity</p>
                            <p className="text-xl font-black text-emerald-500 italic">UGX 24,842,500</p>
                         </div>
                         <div className="p-2 bg-emerald-600 text-white rounded-sm shadow-xl"><TrendingUp size={20}/></div>
                      </div>
                   </div>
                   <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={REVENUE_HISTORY}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{fill:'#94a3b8'}} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `UGX ${v/1000}k`} tick={{fill:'#94a3b8'}} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                            <Bar dataKey="revenue" fill="#10b981" barSize={40} fillOpacity={0.6} />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{r: 5, fill: '#ef4444'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          )}

        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
