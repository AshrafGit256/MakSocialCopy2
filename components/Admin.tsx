
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

const ACCENT_COLORS = [
  { name: 'Indigo Pulse', hex: '#6366f1' },
  { name: 'Emerald Logic', hex: '#10b981' },
  { name: 'Rose Violation', hex: '#f43f5e' },
  { name: 'Amber Signal', hex: '#f59e0b' },
  { name: 'Cyan Strata', hex: '#06b6d4' },
];

// Custom Candlestick implementation for Telemetry
const NetworkVolatilityChart = ({ data }: { data: any[] }) => {
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
             <Cell key={`wick-${index}`} stroke={entry.open > entry.close ? '#f43f5e' : '#10b981'} strokeWidth={1} />
          ))}
        </Scatter>
        <Bar dataKey="close" barSize={12}>
           {data.map((entry, index) => {
             const isUp = entry.close >= entry.open;
             return (
               <Cell key={`body-${index}`} fill={isUp ? '#10b981' : '#f43f5e'} fillOpacity={0.8} stroke={isUp ? '#10b981' : '#f43f5e'} />
             );
           })}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const MetricBlock: React.FC<{ 
  title: string, value: string | number, trend?: string, icon: React.ReactNode, accent: string 
}> = ({ title, value, trend, icon, accent }) => (
  <div className="bg-[#1e293b]/40 border border-[#334155] p-5 rounded-sm relative group hover:border-slate-400 transition-all overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${accent}`}>{icon}</div>
    <div className="space-y-1">
      <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.4em]">{title}</p>
      <h2 className="text-2xl font-black text-white italic tracking-tighter">{value}</h2>
      {trend && <div className={`text-[8px] font-black flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
         {trend.startsWith('+') ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {trend} SINCE_BOOT
      </div>}
    </div>
  </div>
);

type AdminTab = 'Telemetry' | 'Registry' | 'Surveillance' | 'Propaganda' | 'Shield' | 'Treasury' | 'Reports' | 'Command';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Telemetry');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [threatLevel, setThreatLevel] = useState(14);
  const [accentColor, setAccentColor] = useState('#6366f1');
  
  const users = db.getUsers();
  const ads = db.getAds();
  const posts = db.getPosts();

  // OS Protocol States
  const [protocols, setProtocols] = useState({
    maintenance: false,
    firewall: true,
    broadcast: true,
    intensity: 80
  });

  // Simulated live telemetry loop
  useEffect(() => {
    let base = 65;
    const initial = Array.from({ length: 24 }, (_, i) => {
      const open = base + (Math.random() - 0.5) * 12;
      const close = open + (Math.random() - 0.5) * 18;
      base = close;
      return {
        time: `${i}:00`, open, close,
        high: Math.max(open, close) + Math.random() * 5,
        low: Math.min(open, close) - Math.random() * 5
      };
    });
    setTelemetryData(initial);

    const timer = setInterval(() => {
      setTelemetryData(prev => {
        const last = prev[prev.length - 1];
        const nextOpen = last.close;
        const nextClose = nextOpen + (Math.random() - 0.5) * 10;
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

  return (
    <div className="flex h-screen w-full bg-[#020617] text-[#f1f5f9] font-mono overflow-hidden selection:bg-slate-700 selection:text-white">
      
      {/* SIDEBAR TACTICAL HUB */}
      <aside className={`bg-[#0f172a] border-r border-[#1e293b] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#1e293b] shrink-0">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center mr-3 shadow-xl" style={{ backgroundColor: accentColor }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-black text-[10px] text-white uppercase tracking-[0.3em] italic">MakAdmin.OS</span>}
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
              { id: 'Reports', icon: <FileJson size={18}/> },
              { id: 'Command', icon: <Sliders size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-4 py-3.5 rounded-sm transition-all group ${activeTab === item.id ? 'bg-slate-800 text-white shadow-inner border-l-4' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
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
              <Power size={16}/> {!isSidebarCollapsed && "Terminate_OS"}
           </button>
        </div>
      </aside>

      {/* MAIN COMMAND TERMINAL */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-[#0f172a] border-b border-[#1e293b] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-400 transition-colors"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-sm text-[8px] font-black uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Kernel_Optimized
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">HillRegistry_v4.2.9 // NODE_STABLE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right mr-2 hidden sm:block">
                <span className="text-[8px] font-black text-slate-500 uppercase">Authorization</span>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentColor }}>Super_Administrator</p>
             </div>
             <div className="relative group">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-sm border border-[#1e293b] bg-slate-800 shadow-2xl transition-all group-hover:scale-105" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] bg-[size:32px_32px]">
          
          {activeTab === 'Telemetry' && (
            <div className="space-y-8 animate-in fade-in duration-700">
               {/* Global Cluster Status */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricBlock title="Identity_Registry" value={users.length} trend="+12" icon={<Users size={20}/>} accent="text-indigo-500" />
                  <MetricBlock title="Signal_Flux" value="1.82k/s" trend="+8%" icon={<Zap size={20}/>} accent="text-amber-500" />
                  <MetricBlock title="System_Entropy" value={`${Math.round(threatLevel)}%`} trend="+2%" icon={<ShieldAlert size={20}/>} accent="text-rose-500" />
                  <MetricBlock title="Total_Liquidity" value="42.8M" trend="-1%" icon={<DollarSign size={20}/>} accent="text-emerald-500" />
               </div>

               {/* Advanced Telemetry Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm min-h-[500px] flex flex-col shadow-2xl">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-xs font-black uppercase tracking-[0.5em] flex items-center gap-3">
                              <Activity size={18} style={{ color: accentColor }}/> Network_Volatility_Analysis
                           </h3>
                           <p className="text-[8px] text-slate-500 uppercase mt-2 font-bold tracking-[0.2em]">Metric: Universal Node Handshakes / Polling: 5s</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-sm"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Stable_Flow</span></div>
                           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-sm"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Violation_Peak</span></div>
                        </div>
                     </div>
                     <div className="flex-1">
                        <NetworkVolatilityChart data={telemetryData} />
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Trophy size={140} className="text-amber-500" /></div>
                       <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-500 mb-8 flex items-center gap-3">
                          <Trophy size={16}/> Contributor_Elite
                       </h4>
                       <div className="space-y-4">
                          {leaderboard.map((u, i) => (
                             <div key={u.id} className="flex items-center justify-between p-4 bg-black/40 border border-[#1e293b] rounded-sm group hover:border-slate-500 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                   <div className="relative">
                                      <img src={u.avatar} className="w-10 h-10 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-[#1e293b]" />
                                      <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#0f172a] border border-[#1e293b] rounded-full flex items-center justify-center text-[9px] font-black" style={{ color: accentColor }}>{i+1}</div>
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-[11px] font-black uppercase text-white truncate leading-none">{u.name}</p>
                                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{u.college}_WING</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[11px] font-black" style={{ color: accentColor }}>{u.totalLikesCount.toLocaleString()}</p>
                                   <p className="text-[7px] text-slate-500 font-black uppercase tracking-tighter">Stars_Sync</p>
                                </div>
                             </div>
                          ))}
                       </div>
                       <button className="w-full mt-8 py-3 bg-indigo-600/10 border border-indigo-600/20 text-indigo-500 text-[8px] font-black uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl">Full_Registry_Manifest</button>
                    </div>

                    <div className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm relative overflow-hidden">
                       <h4 className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 flex items-center gap-3">
                          <Binary size={16}/> Sector_Synergy_Distribution
                       </h4>
                       <div className="h-56 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadialBarChart innerRadius="25%" outerRadius="100%" data={[
                               { name: 'COCIS', val: 88, fill: '#6366f1' },
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
                       <div className="grid grid-cols-2 gap-2 mt-4">
                          {['COCIS', 'CEDAT', 'CHUSS', 'LAW'].map(c => (
                             <div key={c} className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div> {c}_WING
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Registry' && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-sm overflow-hidden shadow-2xl">
                   <div className="p-8 border-b border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5">
                      <div className="flex items-center gap-4">
                         <Terminal size={22} style={{ color: accentColor }} />
                         <h3 className="text-sm font-black uppercase tracking-[0.5em]">Identity_Registry / Node_Manifest</h3>
                      </div>
                      <div className="relative group w-full md:w-96">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                         <input placeholder="Search node identity..." className="w-full bg-[#020617] border border-[#1e293b] rounded-sm px-12 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-slate-500 transition-all shadow-inner" />
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-bold border-collapse">
                        <thead className="bg-[#020617] text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-[#1e293b]">
                           <tr>
                              <th className="p-6">Node_Identity</th>
                              <th className="p-6">Sector_Wing</th>
                              <th className="p-6">Access_Stratum</th>
                              <th className="p-6">Signal_Stability</th>
                              <th className="p-6 text-right">Terminal_Control</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                           {users.map(u => (
                             <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6 flex items-center gap-4">
                                   <div className="relative">
                                      <img src={u.avatar} className="w-12 h-12 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-[#1e293b]" />
                                      {u.verified && <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1 border-2 border-[#0f172a] shadow-xl"><Check size={10} className="text-white"/></div>}
                                   </div>
                                   <div>
                                      <p className="font-black uppercase text-white tracking-tight leading-none">{u.name}</p>
                                      <p className="text-[9px] text-slate-500 font-mono italic mt-1.5 uppercase tracking-widest">ID_{u.id.slice(-8).toUpperCase()}</p>
                                   </div>
                                </td>
                                <td className="p-6 text-indigo-400 font-black uppercase tracking-widest">{u.college}_HUB</td>
                                <td className="p-6">
                                   <span className={`px-3 py-1 rounded-sm text-[9px] font-black border tracking-widest ${u.subscriptionTier === 'Pro' ? 'border-indigo-500/50 text-indigo-500 bg-indigo-500/5' : u.subscriptionTier === 'Enterprise' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' : 'border-slate-700 text-slate-500'}`}>{u.subscriptionTier}</span>
                                </td>
                                <td className="p-6">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full animate-pulse ${u.accountStatus === 'Suspended' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
                                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">{u.accountStatus || 'Stable'}</span>
                                   </div>
                                </td>
                                <td className="p-6 text-right">
                                   <div className="flex items-center justify-end gap-3">
                                      <button className="p-2.5 bg-slate-800 rounded-sm hover:bg-indigo-600 hover:text-white transition-all border border-slate-700 hover:border-transparent"><UserCheck size={16}/></button>
                                      <button className="p-2.5 bg-slate-800 rounded-sm hover:bg-rose-600 hover:text-white transition-all border border-slate-700 hover:border-transparent"><Ban size={16}/></button>
                                      <button className="p-2.5 bg-slate-800 rounded-sm hover:bg-white hover:text-black transition-all border border-slate-700 hover:border-transparent"><Edit3 size={16}/></button>
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

          {activeTab === 'Surveillance' && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm shadow-2xl">
                   <div className="flex justify-between items-center mb-12">
                      <div className="space-y-2">
                         <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white flex items-center gap-3">
                            <Eye size={22} style={{ color: accentColor }}/> Signal_Scrutiny_Matrix
                         </h3>
                         <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Global Multi-node Scanning Stream / Active Nodes: {posts.length}</p>
                      </div>
                      <div className="flex gap-2 bg-black/40 p-1.5 border border-[#1e293b] rounded-sm shadow-inner">
                         <button className="p-2.5 bg-slate-800 text-white rounded-sm shadow-lg"><Grid size={18}/></button>
                         <button className="p-2.5 text-slate-500 hover:text-white transition-all"><List size={18}/></button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {posts.map(post => {
                        const snippet = post.content.replace(/<[^>]*>/g, '').slice(0, 120);
                        const hasImg = post.images && post.images.length > 0;
                        return (
                          <div key={post.id} className="bg-white/5 border border-[#1e293b] rounded-sm flex flex-col group hover:border-slate-500 transition-all overflow-hidden relative shadow-lg">
                             <div className="px-4 py-2.5 border-b border-[#1e293b] flex justify-between bg-black/20 items-center">
                                <span className="text-[9px] font-black text-indigo-400 uppercase truncate max-w-[150px] tracking-widest">{post.author}</span>
                                <span className="text-[8px] font-mono text-slate-500 opacity-60">SHA_{post.id.slice(-6).toUpperCase()}</span>
                             </div>
                             
                             <div className="flex-1 p-5 space-y-4">
                                {hasImg ? (
                                   <div className="aspect-video bg-black rounded-sm overflow-hidden border border-[#1e293b] relative">
                                      <img src={post.images![0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                   </div>
                                ) : (
                                   <div className="aspect-video bg-indigo-600/5 border border-dashed border-[#1e293b] rounded-sm flex flex-col items-center justify-center gap-2">
                                      <ImageIcon size={24} className="text-slate-700" />
                                      <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Visual_Signal_Null</span>
                                   </div>
                                )}
                                <p className="text-[11px] leading-relaxed text-slate-400 italic line-clamp-3 font-medium">"{snippet || 'Empty alphanumeric signal buffer...'}"</p>
                             </div>

                             <div className="p-4 border-t border-[#1e293b] bg-black/40 grid grid-cols-3 gap-2">
                                <button className="p-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-lg" title="Purge Signal"><Trash2 size={16}/></button>
                                <button className="p-2.5 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-lg" title="Validate Hub"><Check size={16}/></button>
                                <button className="p-2.5 bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all rounded-sm flex items-center justify-center shadow-lg" title="Deep Node Inspection"><Search size={16}/></button>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Propaganda' && (
             <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm space-y-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px]"></div>
                      <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">Initialize_Ad</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Inject promotional signal into universal feed</p>
                      </div>

                      <div className="space-y-8 relative z-10">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Propaganda_Label</label>
                            <input className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-slate-500 transition-all shadow-inner" placeholder="e.g. MTN_Node_Discount" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Wing_Target_Sector</label>
                            <select className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
                               <option>Universal Cluster (All)</option>
                               <option>COCIS Wing Only</option>
                               <option>CEDAT Wing Only</option>
                               <option>COBAMS Wing Only</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Period_TTL (Days)</label>
                               <input type="number" className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-black outline-none" defaultValue={7} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Fiscal_Alloc (UGX)</label>
                               <input type="number" className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-black outline-none" placeholder="50,000" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Visual_Payload (URL)</label>
                            <input className="w-full bg-[#020617] border border-[#1e293b] rounded-sm p-4 text-xs font-black outline-none focus:border-slate-500" placeholder="https://cdn.hill.net/ad_01.png" />
                         </div>
                         <button className="w-full py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-sm shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all hover:bg-indigo-700">Broadcast_Campaign</button>
                      </div>
                   </div>

                   <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] rounded-sm overflow-hidden shadow-2xl flex flex-col">
                      <div className="p-8 border-b border-[#1e293b] bg-white/5 flex items-center justify-between">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-3"><Rocket size={18} className="text-amber-500"/> Active_Campaign_Manifest</h3>
                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase rounded-sm">Telemetry_Synchronized</span>
                      </div>
                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-[#020617] text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-[#1e293b]">
                              <tr>
                                 <th className="p-6">Campaign_Identity</th>
                                 <th className="p-6">Signal_Reach</th>
                                 <th className="p-6">Intensity (CTR)</th>
                                 <th className="p-6">Fiscal_Burn</th>
                                 <th className="p-6 text-right">TTL_Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-[#1e293b] text-[11px] font-black uppercase tracking-tight">
                              {[
                                { name: 'MTN_Pulse_Sync', reach: '24.2k', ctr: '4.2%', burn: 'UGX 120k', status: 'ACTIVE', ttl: '4d' },
                                { name: 'Stanbic_Node_Lending', reach: '12.8k', ctr: '2.8%', burn: 'UGX 45k', status: 'ACTIVE', ttl: '12d' },
                                { name: 'Guild_Inaug_Promo', reach: '8.4k', ctr: '1.2%', burn: 'UGX 12k', status: 'SUSPENDED', ttl: 'EXPIRED' },
                                { name: 'SafeBoda_Protocol_v2', reach: '45.1k', ctr: '8.5%', burn: 'UGX 340k', status: 'ACTIVE', ttl: '28d' }
                              ].map(ad => (
                                <tr key={ad.name} className="hover:bg-white/5 group transition-colors">
                                   <td className="p-6 flex items-center gap-4">
                                      <div className="p-3 bg-slate-800 rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><Rocket size={16}/></div>
                                      {ad.name}
                                   </td>
                                   <td className="p-6 text-slate-400 font-mono tracking-widest">{ad.reach} NODES</td>
                                   <td className="p-6">
                                      <div className="flex items-center gap-3">
                                         <div className="h-1 w-16 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: ad.ctr }}></div></div>
                                         <span className="text-emerald-500">{ad.ctr}</span>
                                      </div>
                                   </td>
                                   <td className="p-6 text-indigo-400">{ad.burn}</td>
                                   <td className="p-6 text-right">
                                      <div className="flex flex-col items-end">
                                         <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black border ${ad.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-rose-500/30 text-rose-500 bg-rose-500/5'}`}>{ad.status}</span>
                                         <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">Rem: {ad.ttl}</span>
                                      </div>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                      <div className="p-6 bg-black/40 border-t border-[#1e293b] flex justify-center">
                         <button className="text-[9px] font-black uppercase text-slate-500 tracking-[0.5em] hover:text-white transition-colors">View_Archive_Campaigns</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Reports' && (
            <div className="space-y-8 animate-in fade-in duration-700">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { title: 'Academic_Integrity_Manifest', size: '2.4 MB', type: 'PDF', icon: <FileText size={24}/> },
                    { title: 'Wing_Performance_Strata', size: '1.8 MB', type: 'CSV', icon: <Binary size={24}/> },
                    { title: 'Fiscal_Ledger_Q1_2026', size: '4.2 MB', type: 'XLSX', icon: <DollarSign size={24}/> },
                    { title: 'Node_Engagement_Telemetry', size: '5.6 MB', type: 'CSV', icon: <Activity size={24}/> },
                    { title: 'Violation_Safety_Audit', size: '840 KB', type: 'JSON', icon: <Shield size={24}/> },
                    { title: 'Universal_Asset_Index', size: '12.1 MB', type: 'PDF', icon: <Database size={24}/> },
                  ].map(report => (
                    <div key={report.title} className="bg-[#0f172a] border border-[#1e293b] p-8 rounded-sm group hover:border-indigo-600 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 rotate-45">{report.icon}</div>
                       <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-4 bg-white/5 border border-[#1e293b] rounded-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">{report.icon}</div>
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">{report.type}</span>
                          </div>
                          <h4 className="text-xs font-black uppercase text-white tracking-widest leading-tight group-hover:text-indigo-400 transition-colors">{report.title}</h4>
                       </div>
                       <div className="mt-10 pt-6 border-t border-[#1e293b] flex justify-between items-center relative z-10">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{report.size}</span>
                          <button className="text-[9px] font-black uppercase text-indigo-500 hover:text-white hover:underline transition-all flex items-center gap-2">
                             Download_Asset <Download size={14}/>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-10 border border-dashed border-indigo-600/20 rounded-sm bg-indigo-600/5 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                     <div className="p-5 bg-[#0f172a] border border-indigo-600/40 rounded-sm shadow-2xl">
                        <Cpu size={40} className="text-indigo-500 animate-spin-slow" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-tight italic text-white leading-none">Initialize_Custom_Report</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] leading-relaxed max-w-lg">Execute a deep scan across all nodes to generate a customized intelligence manifest for specific strata.</p>
                     </div>
                  </div>
                  <button className="px-10 py-5 bg-indigo-600 text-white rounded-sm font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">Generate_Signal</button>
               </div>
            </div>
          )}

          {activeTab === 'Treasury' && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm shadow-2xl">
                   <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-14">
                      <div>
                         <h3 className="text-sm font-black uppercase tracking-[0.5em] text-emerald-500 flex items-center gap-4">
                            <DollarSign size={24}/> Global_Treasury_Ledger
                         </h3>
                         <p className="text-[9px] text-slate-500 uppercase mt-2 italic tracking-[0.2em] font-bold">Reporting Strata: Jan 2026 - Present / Node: Central_Bank</p>
                      </div>
                      <div className="flex items-center gap-6 bg-black/40 p-6 border border-[#1e293b] rounded-sm shadow-inner min-w-[320px]">
                         <div className="text-right flex-1">
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">Aggregate_Net_Liquidity</p>
                            <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">UGX 42,850,000</p>
                         </div>
                         <div className="p-3 bg-emerald-600 text-white rounded-sm shadow-2xl shadow-emerald-600/20"><TrendingUp size={24}/></div>
                      </div>
                   </div>
                   <div className="h-[500px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={REVENUE_HISTORY}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{fill:'#94a3b8'}} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `UGX ${v/1000}k`} tick={{fill:'#94a3b8'}} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                            <Bar dataKey="revenue" fill="#10b981" barSize={50} fillOpacity={0.6} />
                            <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} dot={{r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#0f172a'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm shadow-2xl relative overflow-hidden">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 flex items-center gap-3">
                         <Layers size={18}/> Subscriber_Tier_Manifest
                      </h4>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={[
                                  { name: 'FREE_NODES', value: 850, fill: '#334155' },
                                  { name: 'PRO_SYMBOLS', value: 120, fill: '#6366f1' },
                                  { name: 'ENTERPRISE_HUBS', value: 30, fill: '#f59e0b' }
                               ]} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                                  <Cell /> <Cell /> <Cell />
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-[9px] font-black uppercase text-slate-500 mt-10 text-center">
                         <div className="space-y-2"><div className="w-2 h-2 bg-indigo-500 rounded-full mx-auto"></div> PRO (12%)</div>
                         <div className="space-y-2"><div className="w-2 h-2 bg-amber-500 rounded-full mx-auto"></div> ENTERPRISE (3%)</div>
                         <div className="space-y-2"><div className="w-2 h-2 bg-slate-700 rounded-full mx-auto"></div> FREE (85%)</div>
                      </div>
                   </div>

                   <div className="bg-indigo-600 p-12 rounded-sm text-white relative overflow-hidden flex flex-col justify-center shadow-2xl shadow-indigo-600/30">
                      <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 transition-transform hover:scale-110 duration-1000"><Zap size={220} fill="white"/></div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.5em] mb-6 relative z-10 opacity-70">Ad_Liquidity_Sync</h4>
                      <div className="space-y-10 relative z-10">
                         <div>
                            <p className="text-5xl font-black italic tracking-tighter leading-none">UGX 12,420,000</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mt-4 leading-relaxed">Sourced from 42 validated corporate partner nodes during current cycle.</p>
                         </div>
                         <button className="w-full py-5 bg-white text-indigo-600 rounded-sm font-black text-[11px] uppercase tracking-[0.5em] hover:bg-slate-50 shadow-2xl active:scale-95 transition-all">Generate_Fiscal_Audit</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Shield' && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-8 bg-[#0f172a] border border-[#1e293b] p-10 rounded-sm shadow-2xl">
                      <h3 className="text-sm font-black uppercase tracking-[0.5em] text-rose-500 mb-12 flex items-center gap-4">
                         <Flame size={22}/> Firewall_Violation_Manifest
                      </h3>
                      <div className="space-y-6">
                         {[
                           { type: 'AUTH_BRUTE_FORCE', count: 142, risk: 'HIGH', protocol: 'Neural_Sanitize_v2', color: 'text-rose-500' },
                           { type: 'SQL_INJECT_SYSTRATA', count: 12, risk: 'CRITICAL', protocol: 'Header_Scrub_v4', color: 'text-rose-600' },
                           { type: 'PROXY_LEAK_DETECTION', count: 852, risk: 'MID', protocol: 'Packet_Filter_Alpha', color: 'text-amber-500' },
                           { type: 'SPAM_UPLINK_FILTER', count: 42, risk: 'LOW', protocol: 'Spam_Aura_v1', color: 'text-indigo-500' }
                         ].map(v => (
                           <div key={v.type} className="flex items-center justify-between p-6 bg-black/40 border border-[#1e293b] rounded-sm group hover:border-rose-500 transition-all cursor-default">
                              <div className="flex items-center gap-6">
                                 <div className={`p-4 rounded-sm bg-rose-600/10 ${v.color} shadow-inner`}><ShieldAlert size={24}/></div>
                                 <div className="space-y-1">
                                    <p className="text-xs font-black uppercase text-white tracking-widest">{v.type}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Layer: {v.protocol}</p>
                                 </div>
                              </div>
                              <div className="text-right space-y-1">
                                 <p className={`text-2xl font-black italic leading-none ${v.color}`}>{v.count}</p>
                                 <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Risk: {v.risk}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] p-12 rounded-sm flex flex-col items-center justify-center text-center space-y-12 shadow-2xl">
                      <div className="relative w-64 h-64">
                         <svg className="w-full h-full transform -rotate-90">
                           <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                           <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={691} strokeDashoffset={691 * (1 - threatLevel/100)} className="text-rose-500 transition-all duration-1000 shadow-[0_0_20px_#f43f5e]" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black italic tracking-tighter text-rose-500">{Math.round(threatLevel)}%</span>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em] mt-2">Entropy_Risk</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-lg font-black uppercase text-white italic tracking-widest">Shield_Status: Deflecting</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed max-w-xs tracking-widest">Alphanumeric heuristic sensors are actively purging malformed headers from the Hill Registry.</p>
                      </div>
                      <button className="w-full py-6 bg-rose-600 hover:bg-rose-700 text-white rounded-sm font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl shadow-rose-600/30 active:scale-95 transition-all">Flush_Safety_Cache</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Command' && (
             <div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-[#0f172a] border border-[#1e293b] p-12 rounded-sm space-y-14 shadow-2xl relative">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-slate-800 rounded-sm text-white shadow-inner"><Sliders size={32}/></div>
                      <div>
                         <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Command_Parameters</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">Global personalization and site-wide protocol logic</p>
                      </div>
                   </div>

                   <div className="space-y-12">
                      <div className="space-y-6">
                         <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 flex items-center gap-3">
                            <Palette size={18} style={{ color: accentColor }}/> Terminal_Accent_Logic
                         </label>
                         <div className="flex flex-wrap gap-5 p-8 bg-[#020617] rounded-sm border border-[#1e293b] shadow-inner">
                            {ACCENT_COLORS.map(c => (
                               <button 
                                 key={c.hex} 
                                 onClick={() => setAccentColor(c.hex)} 
                                 className={`group relative w-16 h-16 rounded-sm border-2 transition-all ${accentColor === c.hex ? 'border-white scale-110 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                                 style={{ backgroundColor: c.hex }}
                               >
                                  {accentColor === c.hex && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Check size={28} className="text-white"/></div>
                                  )}
                                  <div className="absolute bottom-[-24px] left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <span className="text-[7px] font-black uppercase text-slate-500">{c.name}</span>
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                           { id: 'maintenance', label: 'Mainframe_Maintenance', desc: 'Lock universal feed and broadcast maintenance signal', icon: <Lock size={20}/> },
                           { id: 'firewall', label: 'Node_Identity_Firewall', desc: 'Prevent new node registrations in the Hill Registry', icon: <Shield size={20}/> },
                           { id: 'broadcast', label: 'Universal_Broadcast', desc: 'Enable global signal push and alert synchronization', icon: <Radio size={20}/> }
                         ].map(p => (
                            <div 
                              key={p.id}
                              onClick={() => setProtocols({...protocols, [p.id]: !protocols[p.id as keyof typeof protocols]})}
                              className={`p-8 rounded-sm border text-left flex items-start gap-6 transition-all cursor-pointer shadow-lg ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600/10 border-indigo-600' : 'bg-black/40 border-[#1e293b] opacity-60'}`}
                            >
                               <div className={`p-4 rounded-sm ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-800 text-slate-500 shadow-inner'}`}>{p.icon}</div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className={`text-[11px] font-black uppercase tracking-widest ${protocols[p.id as keyof typeof protocols] ? 'text-indigo-400' : 'text-slate-500'}`}>{p.label}</span>
                                     <div className={`w-12 h-6 rounded-full relative transition-colors ${protocols[p.id as keyof typeof protocols] ? 'bg-indigo-600 shadow-[0_0_10px_#6366f1]' : 'bg-slate-800 shadow-inner'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-sm transition-all ${protocols[p.id as keyof typeof protocols] ? 'left-7' : 'left-1'}`} />
                                     </div>
                                  </div>
                                  <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">{p.desc}</p>
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="space-y-6 p-10 bg-[#020617] rounded-sm border border-[#1e293b] shadow-inner">
                         <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 flex items-center gap-3">
                               <Gauge size={18} style={{ color: accentColor }}/> Universal_Signal_Intensity
                            </label>
                            <span className="font-black text-xs" style={{ color: accentColor }}>{protocols.intensity}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="100" 
                           value={protocols.intensity} 
                           onChange={(e) => setProtocols({...protocols, intensity: parseInt(e.target.value)})} 
                           className="w-full h-2 bg-slate-800 rounded-sm appearance-none cursor-pointer accent-indigo-600" 
                         />
                         <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                            <span>Muted_Strata</span>
                            <span>Standard_Sync</span>
                            <span>Force_Uplink</span>
                         </div>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-[#1e293b] flex justify-end">
                      <button className="px-14 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-sm shadow-2xl shadow-emerald-600/30 active:scale-95 transition-all">Commit_Protocol_Shifts</button>
                   </div>
                </div>
             </div>
          )}

        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
