
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog, College } from '../types';
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
  Lock, RefreshCcw, Database, Server, Flame
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Custom Candlestick implementation for Recharts
const UsageCandlestickChart = ({ data }: { data: any[] }) => {
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
        <XAxis 
          dataKey="time" 
          fontSize={8} 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#8b949e' }}
        />
        <YAxis 
          domain={[minValue - 5, maxValue + 5]} 
          fontSize={8} 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: '#8b949e' }}
          tickFormatter={(v) => `${v}req/s`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px', borderRadius: '4px' }}
          itemStyle={{ color: '#c9d1d9' }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        {/* The Wick (High/Low) - Using Scatter for visual lines */}
        <Scatter dataKey="high" fill="none">
          {data.map((entry, index) => (
             <Cell key={`wick-${index}`} stroke={entry.open > entry.close ? '#ef4444' : '#10b981'} strokeWidth={1} />
          ))}
        </Scatter>
        {/* The Body (Open/Close) - Using Bar */}
        <Bar dataKey="close" barSize={12}>
           {data.map((entry, index) => {
             const isUp = entry.close >= entry.open;
             return (
               <Cell 
                 key={`body-${index}`} 
                 fill={isUp ? '#10b981' : '#ef4444'} 
                 fillOpacity={0.8}
                 stroke={isUp ? '#10b981' : '#ef4444'}
               />
             );
           })}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const MetricCard: React.FC<{ 
  title: string, 
  value: string | number, 
  trend?: string, 
  trendDir?: 'up' | 'down' | 'neutral', 
  icon: React.ReactNode,
  colorClass: string 
}> = ({ title, value, trend, trendDir, icon, colorClass }) => (
  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-sm relative overflow-hidden group">
    <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className="text-slate-500 group-hover:text-white transition-colors">{icon}</div>
      {trend && (
        <span className={`text-[8px] font-black flex items-center gap-1 uppercase ${
          trendDir === 'up' ? 'text-emerald-500' : trendDir === 'down' ? 'text-rose-500' : 'text-slate-500'
        }`}>
          {trendDir === 'up' ? <ArrowUpRight size={10}/> : trendDir === 'down' ? <ArrowDownRight size={10}/> : null}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{title}</p>
    <p className="text-2xl font-black text-white mt-1 italic tracking-tighter">{value}</p>
  </div>
);

type AdminTab = 'Overview' | 'Nodes' | 'Safety' | 'Treasury' | 'Reports' | 'Audit';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [threatLevel, setThreatLevel] = useState(12);

  const users = db.getUsers();
  const ads = db.getAds();
  const auditLogs = db.getAuditLogs();
  
  // Real-time site usage simulator
  useEffect(() => {
    const initialData = [];
    let base = 70;
    for (let i = 0; i < 20; i++) {
      const open = base + (Math.random() - 0.5) * 15;
      const close = open + (Math.random() - 0.5) * 20;
      initialData.push({
        time: `${i}:00`,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 8,
        low: Math.min(open, close) - Math.random() * 8
      });
      base = close;
    }
    setUsageData(initialData);

    const interval = setInterval(() => {
      setUsageData(prev => {
        const last = prev[prev.length - 1];
        const nextOpen = last.close;
        const nextClose = nextOpen + (Math.random() - 0.5) * 15;
        const next = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: nextOpen,
          close: nextClose,
          high: Math.max(nextOpen, nextClose) + Math.random() * 6,
          low: Math.min(nextOpen, nextClose) - Math.random() * 6
        };
        return [...prev.slice(1), next];
      });
      setThreatLevel(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 10)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const collegePerformance = useMemo(() => [
    { name: 'COCIS', val: 85, fill: '#6366f1' },
    { name: 'CEDAT', val: 72, fill: '#10b981' },
    { name: 'LAW', val: 45, fill: '#f43f5e' },
    { name: 'CHS', val: 68, fill: '#f59e0b' },
    { name: 'Global', val: 95, fill: '#8b5cf6' },
  ], []);

  const violationStats = [
    { type: 'XSS_Attempt', count: 142, risk: 'High' },
    { type: 'SQL_Inject', count: 28, risk: 'Critical' },
    { type: 'Spam_Signal', count: 1205, risk: 'Low' },
    { type: 'Unauthorized_Uplink', count: 56, risk: 'Mid' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-[#c9d1d9] font-mono overflow-hidden">
      
      {/* 1. TACTICAL SIDEBAR */}
      <aside className={`bg-[#161b22] border-r border-[#30363d] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#30363d] shrink-0 justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center mr-3 shadow-lg shadow-indigo-600/20">
              <ShieldCheck size={18} className="text-white" />
            </div>
            {!isSidebarCollapsed && <span className="font-black text-xs text-white uppercase tracking-tighter italic">MakRegistry.OS</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-3">
            {[
              { id: 'Overview', label: 'Telemetry', icon: <Activity size={18}/> },
              { id: 'Nodes', label: 'Registry', icon: <Users size={18}/> },
              { id: 'Safety', label: 'Shield', icon: <ShieldAlert size={18}/> },
              { id: 'Treasury', label: 'Treasury', icon: <DollarSign size={18}/> },
              { id: 'Reports', label: 'Manifests', icon: <FileJson size={18}/> },
              { id: 'Audit', label: 'Audit_Logs', icon: <Terminal size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-4 py-3 rounded-sm transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#30363d]">
           <button onClick={onLogout} className="w-full bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white py-3 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={16}/> {!isSidebarCollapsed && "Shutdown Signal"}
           </button>
        </div>
      </aside>

      {/* 2. MAIN TERMINAL */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-[#0d1117] border-b border-[#30363d] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-sm text-[8px] font-black uppercase tracking-[0.2em]">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Kernel_Online
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Core_v4.2.8 // Encrypted_Sync</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end mr-2">
                <span className="text-[8px] font-black text-slate-500 uppercase">Authorization</span>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Super_Administrator</span>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-sm border border-[#30363d] bg-[#161b22] shadow-xl" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
          
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Dashboard Metric Cluster */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard title="Node_Registry" value={users.length} trend="+12.4%" trendDir="up" icon={<Users size={20}/>} colorClass="bg-indigo-500" />
                  <MetricCard title="Signal_Intensity" value="1.24k/m" trend="+2.1%" trendDir="up" icon={<Zap size={20}/>} colorClass="bg-amber-500" />
                  <MetricCard title="Entropy_Threat" value={`${Math.round(threatLevel)}%`} trendDir={threatLevel > 70 ? 'up' : 'neutral'} icon={<ShieldAlert size={20}/>} colorClass="bg-rose-500" />
                  <MetricCard title="Treasury_Flow" value="14.8M" trend="-0.4%" trendDir="down" icon={<DollarSign size={20}/>} colorClass="bg-emerald-500" />
               </div>

               {/* Real-time Candlestick & Peak Hours */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-sm p-6 flex flex-col min-h-[500px]">
                    <div className="flex justify-between items-center mb-8">
                       <div className="space-y-1">
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                             <Activity size={16} className="text-indigo-500"/> Network_Volatility (OHLC)
                          </h3>
                          <p className="text-[9px] text-slate-500 uppercase">Live polling frequency: 4s / Node: Main_Strata</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Stable</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> <span className="text-[8px] font-black uppercase text-slate-400">Peak</span></div>
                       </div>
                    </div>
                    <div className="flex-1 h-full">
                       <UsageCandlestickChart data={usageData} />
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Radar size={100} className="animate-spin-slow"/></div>
                       <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                          <Binary size={14} className="text-indigo-500"/> Sector_Synergy
                       </h4>
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadialBarChart innerRadius="20%" outerRadius="100%" data={collegePerformance} startAngle={180} endAngle={0}>
                                <RadialBar background dataKey="val" cornerRadius={0} />
                                {/* FIXED: Replaced RechartsTooltip with Tooltip */}
                                <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} itemStyle={{fontSize: '10px'}} />
                             </RadialBarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="mt-4 space-y-2">
                          {collegePerformance.map(cp => (
                             <div key={cp.name} className="flex justify-between items-center text-[9px] font-black uppercase">
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: cp.fill}}></div> <span className="text-slate-400">{cp.name}_Wing</span></div>
                                <span className="text-white">{cp.val}% Synced</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>

               {/* Peak Analysis & Traffic Flow */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-sm p-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-2">
                        <Clock size={16} className="text-amber-500"/> Peak_Load_Strata
                     </h3>
                     <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={ANALYTICS}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
                              <XAxis dataKey="day" fontSize={9} axisLine={false} tickLine={false} />
                              <YAxis fontSize={9} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} />
                              <Line type="monotone" dataKey="activeUsers" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
                              <Line type="monotone" dataKey="messages" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-sm p-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500"/> Node_Integrity_Index
                     </h3>
                     <div className="space-y-5">
                        {[
                          { label: 'Registry_Sync', val: 99.8, color: 'bg-emerald-500' },
                          { label: 'Credential_Auth', val: 94.2, color: 'bg-indigo-500' },
                          { label: 'System_Uptime', val: 99.9, color: 'bg-indigo-500' },
                          { label: 'Protocol_Safety', val: 88.5, color: 'bg-amber-500' }
                        ].map(bar => (
                          <div key={bar.label} className="space-y-2">
                             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                <span className="text-slate-500">{bar.label}</span>
                                <span className="text-white">{bar.val}%_OPTIMAL</span>
                             </div>
                             <div className="h-1 w-full bg-[#30363d] rounded-full overflow-hidden">
                                <div className={`h-full ${bar.color} transition-all duration-1000 shadow-[0_0_8px_currentColor]`} style={{ width: `${bar.val}%` }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
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
                        <h3 className="text-xs font-black uppercase tracking-[0.3em]">Registry: Node_Manifest</h3>
                     </div>
                     <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12}/>
                        <input placeholder="Query identity_hash..." className="w-full md:w-64 bg-[#0d1117] border border-[#30363d] rounded-sm px-8 py-2 text-[10px] font-bold outline-none focus:border-indigo-600 transition-all" />
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                      <thead className="bg-[#161b22] border-b border-[#30363d] uppercase text-slate-500">
                        <tr>
                          <th className="p-5 tracking-widest">Identity_Protocol</th>
                          <th className="p-5 tracking-widest">Wing</th>
                          <th className="p-5 tracking-widest">Strata</th>
                          <th className="p-5 tracking-widest">Signal_Status</th>
                          <th className="p-5 text-center tracking-widest">Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-5 flex items-center gap-4">
                               <img src={u.avatar} className="w-10 h-10 rounded-sm border border-[#30363d] grayscale group-hover:grayscale-0 transition-all" />
                               <div>
                                  <p className="font-black uppercase text-white tracking-tight flex items-center gap-2">
                                     {u.name}
                                     {u.verified && <CheckCircle size={10} className="text-indigo-500" />}
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-mono italic">HASH_{u.id.slice(-6).toUpperCase()}</p>
                               </div>
                            </td>
                            <td className="p-5 text-indigo-400 font-black">{u.college}</td>
                            <td className="p-5">
                               <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-black tracking-widest border ${u.subscriptionTier === 'Pro' ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' : u.subscriptionTier === 'Enterprise' ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-slate-700 text-slate-500'}`}>
                                  {u.subscriptionTier}
                               </span>
                            </td>
                            <td className="p-5">
                               <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.accountStatus === 'Suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                  <span className="text-[10px] font-black uppercase text-slate-400">{u.accountStatus || 'Stable'}</span>
                                </div>
                            </td>
                            <td className="p-5 text-center">
                               <div className="flex items-center justify-center gap-3">
                                  <button className="p-2 bg-slate-800 rounded-sm hover:bg-indigo-600 hover:text-white transition-all text-slate-400"><ShieldCheck size={14}/></button>
                                  <button className="p-2 bg-slate-800 rounded-sm hover:bg-rose-600 hover:text-white transition-all text-slate-400"><Trash2 size={14}/></button>
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

          {activeTab === 'Safety' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-sm p-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mb-8 flex items-center gap-2">
                        <Flame size={16}/> Neural_Filter_Log: Violation_Attempts
                     </h3>
                     <div className="space-y-4">
                        {violationStats.map(stat => (
                           <div key={stat.type} className="flex items-center justify-between p-4 bg-black/20 border border-[#30363d] rounded-sm group hover:border-rose-500/50 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-sm ${stat.risk === 'Critical' ? 'bg-rose-600 text-white' : 'bg-rose-600/10 text-rose-500'}`}>
                                    <ShieldAlert size={16}/>
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-black uppercase text-white tracking-tight">{stat.type}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">Registry_Protection_Layer_Active</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-rose-500 italic leading-none">{stat.count}</p>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">RISK: {stat.risk}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-sm p-6 flex flex-col items-center justify-center text-center space-y-6">
                     <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={552.9} strokeDashoffset={552.9 * (1 - threatLevel/100)} className="text-rose-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-4xl font-black italic tracking-tighter text-rose-500">{Math.round(threatLevel)}%</span>
                           <span className="text-[8px] font-black uppercase text-slate-400">Entropy_Level</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase italic text-white">Neural_Sanitizer: Status_Active</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed max-w-[200px]">Current site integrity is monitored via AI heuristics. Probability of successful breach is minimal.</p>
                     </div>
                     <button className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 active:scale-95">Purge_Temp_Buffer</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Treasury' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="bg-[#161b22] border border-[#30363d] rounded-sm p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                     <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                           <DollarSign size={16}/> Fiscal_Strata: Revenue_Analytics
                        </h3>
                        <p className="text-[9px] text-slate-500 uppercase italic">Aggregation period: Jan 2026 - Present</p>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-black/20 border border-[#30363d] rounded-sm">
                        <div className="text-right">
                           <p className="text-[8px] font-black uppercase text-slate-400">Net_Liquidity</p>
                           <p className="text-xl font-black text-emerald-500 italic">UGX 24,842,500</p>
                        </div>
                        <div className="p-2 bg-emerald-600 text-white rounded-sm">
                           <TrendingUp size={18}/>
                        </div>
                     </div>
                  </div>
                  <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={REVENUE_HISTORY}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" opacity={0.2} />
                           <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                           <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `UGX ${v/1000}k`} />
                           {/* FIXED: Replaced RechartsTooltip with Tooltip */}
                           <Tooltip contentStyle={{backgroundColor: '#0d1117', border: '1px solid #30363d'}} />
                           <Bar dataKey="revenue" fill="#10b981" barSize={30} fillOpacity={0.6} />
                           <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{r: 5}} />
                        </ComposedChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Subscribers_Ratio</h4>
                     <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={[
                                 { name: 'Free', value: 850, fill: '#30363d' },
                                 { name: 'Pro', value: 120, fill: '#6366f1' },
                                 { name: 'Enterprise', value: 30, fill: '#f59e0b' }
                              ]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                 <Cell /> <Cell /> <Cell />
                              </Pie>
                              {/* FIXED: Replaced RechartsTooltip with Tooltip */}
                              <Tooltip />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="flex justify-around text-[9px] font-black uppercase text-slate-500">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Pro (12%)</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Corp (3%)</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#30363d] rounded-full"></div> Free (85%)</div>
                     </div>
                  </div>
                  <div className="bg-indigo-600 p-8 rounded-sm text-white relative overflow-hidden flex flex-col justify-center">
                     <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Zap size={140}/></div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">Ad_Revenue_Sync</h4>
                     <div className="space-y-6">
                        <div>
                           <p className="text-3xl font-black italic tracking-tighter">UGX 8,420,000</p>
                           <p className="text-[8px] font-bold uppercase tracking-widest opacity-80">Accumulated from 42 Corporate Nodes</p>
                        </div>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">Generate_Ledger</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Audit' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="bg-[#161b22] border border-[#30363d] rounded-sm p-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                     <Terminal size={16}/> Active_System_Audit_Manifest
                  </h3>
                  <div className="space-y-3 font-mono text-[9px]">
                     {[
                       { time: '14:20:05', action: 'NODE_AUTH', user: 'root', target: 'COBAMS_WING', status: 'SUCCESS' },
                       { time: '14:21:12', action: 'SYNC_SIGNAL', user: 'ai_bot', target: 'PULSE_STREAM', status: 'COMMIT' },
                       { time: '14:22:45', action: 'DECRYPT_VAULT', user: 'admin', target: 'CEDAT_RES_04', status: 'SUCCESS' },
                       { time: '14:24:10', action: 'FILTER_SIGNAL', user: 'neural_guard', target: 'SPAM_029', status: 'DROPPED' },
                       { time: '14:26:30', action: 'GENERATE_REPORT', user: 'root', target: 'FISCAL_STATA', status: 'SUCCESS' },
                       { time: '14:28:15', action: 'REBOOT_NODE', user: 'sys_auto', target: 'MARKET_NODE_09', status: 'SUCCESS' },
                       { time: '14:30:55', action: 'VIOLATION_DROP', user: 'shield_bot', target: 'XSS_INJECT', status: 'BLOCKED' },
                     ].map((log, i) => (
                       <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 py-3 border-b border-[#30363d] last:border-0 hover:bg-white/5 transition-all px-4 group">
                          <span className="text-slate-500 shrink-0">[{log.time}]</span>
                          <span className="text-indigo-400 font-bold w-32 shrink-0">{log.action}</span>
                          <span className="text-slate-400 tracking-tight shrink-0 uppercase">NODE: {log.user}</span>
                          <span className="text-slate-500 truncate flex-1">TARGET: {log.target}</span>
                          <span className={`font-black tracking-widest shrink-0 ${log.status === 'DROPPED' || log.status === 'BLOCKED' ? 'text-rose-500' : 'text-emerald-500'}`}>[{log.status}]</span>
                          <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-white transition-all"><ChevronRight size={14}/></button>
                       </div>
                     ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-[#30363d] flex justify-between items-center">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Showing 7 of 14,205 entries in current stratum</span>
                     <div className="flex gap-2">
                        <button className="p-2 bg-slate-800 rounded-sm text-slate-400 hover:text-white transition-all"><ChevronLeft size={16}/></button>
                        <button className="p-2 bg-slate-800 rounded-sm text-slate-400 hover:text-white transition-all"><ChevronRight size={16}/></button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Academic_Integrity_Manifest', size: '2.4 MB', type: 'PDF' },
                    { title: 'College_Performance_Strata', size: '1.8 MB', type: 'CSV' },
                    { title: 'Fiscal_Ledger_Q1_2026', size: '4.2 MB', type: 'XLSX' },
                    { title: 'Neural_Filter_Safety_Report', size: '840 KB', type: 'JSON' },
                    { title: 'Node_Engagement_Telemetry', size: '5.6 MB', type: 'CSV' },
                  ].map(report => (
                    <div key={report.title} className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm group hover:border-indigo-600 transition-all flex flex-col justify-between">
                       <div className="space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="p-3 bg-indigo-600/10 text-indigo-600 rounded-sm"><FileJson size={20}/></div>
                             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{report.type}</span>
                          </div>
                          <h4 className="text-[11px] font-black uppercase text-white tracking-tight leading-tight group-hover:text-indigo-500 transition-colors">{report.title}</h4>
                       </div>
                       <div className="mt-8 pt-4 border-t border-[#30363d] flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{report.size}</span>
                          <button className="text-[9px] font-black uppercase text-indigo-500 hover:underline flex items-center gap-1">Download_Asset <Download size={10}/></button>
                       </div>
                    </div>
                  ))}
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
