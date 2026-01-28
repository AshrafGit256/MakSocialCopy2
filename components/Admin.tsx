
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart,
  ScatterChart, Scatter, ErrorBar
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
  UserCheck, Shield, Cpu, Binary, Radar, CandlestickChart
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Custom Candlestick implementation for Recharts
const UsageCandlestickChart = ({ data }: { data: any[] }) => {
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
        <XAxis dataKey="time" fontSize={8} axisLine={false} tickLine={false} />
        <YAxis 
          domain={[minValue - 5, maxValue + 5]} 
          fontSize={8} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={(v) => `${v}req/s`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', fontSize: '10px', borderRadius: '4px' }}
          itemStyle={{ color: '#fff' }}
        />
        {/* The Wick (High/Low) */}
        <Bar dataKey="high" fill="none">
          {data.map((entry, index) => (
            <Cell key={`wick-${index}`} stroke={entry.open > entry.close ? '#ef4444' : '#10b981'} strokeWidth={1} />
          ))}
        </Bar>
        {/* The Body (Open/Close) */}
        <Bar dataKey="open" fill="none">
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

const AdminLTECard: React.FC<{ 
  title: string, 
  icon: React.ReactNode, 
  headerColor?: string, 
  children: React.ReactNode,
  tools?: React.ReactNode
}> = ({ title, icon, headerColor = 'border-indigo-500', children, tools }) => (
  <div className={`bg-white dark:bg-[#1a1c1e] shadow-lg border-t-4 ${headerColor} rounded-sm overflow-hidden flex flex-col h-full`}>
    <div className="px-4 py-3 border-b dark:border-[#2d333b] flex justify-between items-center bg-slate-50/5 shrink-0">
      <h3 className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
        {icon} {title}
      </h3>
      <div className="flex items-center gap-2">
        {tools}
      </div>
    </div>
    <div className="p-4 flex-1">
      {children}
    </div>
  </div>
);

type AdminTab = 'Overview' | 'User Management' | 'Moderation' | 'Event Management' | 'ADs Management' | 'Subscribers Revenue' | 'Platform Usage Reports' | 'System Logs';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Overview');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(db.getAuditLogs());
  const [flagged, setFlagged] = useState<FlaggedContent[]>(db.getFlagged());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time site usage (candlestick simulation)
  const [usageData, setUsageData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize data
    const initialData = [];
    let base = 60;
    for (let i = 0; i < 24; i++) {
      const open = base + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 15;
      initialData.push({
        time: `${i}:00`,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 5,
        low: Math.min(open, close) - Math.random() * 5
      });
      base = close;
    }
    setUsageData(initialData);

    const interval = setInterval(() => {
      setUsageData(prev => {
        const last = prev[prev.length - 1];
        const nextOpen = last.close;
        const nextClose = nextOpen + (Math.random() - 0.5) * 10;
        const next = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          open: nextOpen,
          close: nextClose,
          high: Math.max(nextOpen, nextClose) + Math.random() * 4,
          low: Math.min(nextOpen, nextClose) - Math.random() * 4
        };
        return [...prev.slice(1), next];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] dark:bg-[#0d1117] text-slate-800 dark:text-[#c9d1d9] font-mono overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[#161b22] text-[#8b949e] border-r border-[#30363d] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-14 flex items-center px-6 border-b border-[#30363d] shrink-0 bg-[#161b22] justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center mr-3 shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            {!isSidebarCollapsed && <span className="font-black text-sm text-white uppercase tracking-tighter italic">MakAdmin.v4</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-3">
            {[
              { id: 'Overview', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'User Management', label: 'Nodes', icon: <Users size={18}/> },
              { id: 'Moderation', label: 'Safety', icon: <ShieldAlert size={18}/> },
              { id: 'Event Management', label: 'Calendar', icon: <Calendar size={18}/> },
              { id: 'ADs Management', label: 'Revenue', icon: <Megaphone size={18}/> },
              { id: 'System Logs', label: 'Audit', icon: <Terminal size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-4 py-3 rounded-sm transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#30363d]">
           <button onClick={onLogout} className="w-full bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white py-3 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={16}/> {!isSidebarCollapsed && "Terminate Signal"}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-14 flex items-center justify-between px-6 bg-[#0d1117] border-b border-[#30363d] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={18}/></button>
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Registry_Stable
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node: Localhost // Port: 4200</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase text-slate-500">Security:</span>
                <span className="text-[9px] font-black uppercase text-emerald-500">AES-256 Validated</span>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-8 h-8 rounded-full border border-[#30363d] bg-[#161b22]" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-24">
          
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-in fade-in">
               {/* Top Stats Strip */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Active_Nodes', val: users.length, trend: '+4.2%', icon: <Users size={20}/>, color: 'border-indigo-500' },
                    { label: 'Signal_Velocity', val: '1.2k/hr', trend: '+12.8%', icon: <Activity size={20}/>, color: 'border-emerald-500' },
                    { label: 'Protocol_Latency', val: '42ms', trend: '-2ms', icon: <Cpu size={20}/>, color: 'border-amber-500' },
                    { label: 'Entropy_Risk', val: 'Low', trend: 'Stable', icon: <ShieldAlert size={20}/>, color: 'border-rose-500' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-[#161b22] border-l-4 ${stat.color} border border-[#30363d] p-5 rounded-sm shadow-sm`}>
                       <div className="flex justify-between items-start mb-4">
                          <div className="text-slate-500">{stat.icon}</div>
                          <span className={`text-[8px] font-black uppercase ${stat.trend.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{stat.trend}</span>
                       </div>
                       <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{stat.label}</p>
                       <p className="text-2xl font-black text-white mt-1 italic tracking-tighter">{stat.val}</p>
                    </div>
                  ))}
               </div>

               {/* Candlestick Module */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 h-[450px]">
                    <AdminLTECard 
                      title="Real-Time Network Intensity (Candlestick)" 
                      icon={<Activity size={16}/>}
                      tools={<span className="text-[8px] font-black text-slate-500 animate-pulse">POLLING_LIVE_DATA</span>}
                    >
                       <UsageCandlestickChart data={usageData} />
                       <div className="mt-4 flex items-center justify-between px-4 border-t border-[#30363d] pt-4">
                          <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[8px] font-black uppercase text-slate-500">Bullish_Signal</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                <span className="text-[8px] font-black uppercase text-slate-500">Bearish_Signal</span>
                             </div>
                          </div>
                          <span className="text-[8px] font-mono text-slate-500 tracking-widest italic">Node: Registry_Scan_Active</span>
                       </div>
                    </AdminLTECard>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-sm shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Radar size={80}/></div>
                       <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                          <Binary size={14} className="text-indigo-500"/> Neural_Integrity
                       </h4>
                       <div className="space-y-6">
                          {[
                            { label: 'Registry_Sync', val: 99.8, color: 'bg-emerald-500' },
                            { label: 'Credential_Auth', val: 94.2, color: 'bg-indigo-500' },
                            { label: 'Signal_Safety', val: 88.5, color: 'bg-amber-500' }
                          ].map(bar => (
                            <div key={bar.label} className="space-y-2">
                               <div className="flex justify-between text-[8px] font-black uppercase">
                                  <span className="text-slate-500">{bar.label}</span>
                                  <span className="text-white">{bar.val}%</span>
                               </div>
                               <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <div className={`h-full ${bar.color}`} style={{ width: `${bar.val}%` }}></div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-sm text-white relative overflow-hidden shadow-xl">
                       <div className="absolute top-[-20%] right-[-10%] opacity-20"><Zap size={140} /></div>
                       <div className="relative z-10 space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em]">Aggregated_Revenue</p>
                          <h2 className="text-4xl font-black italic tracking-tighter">UGX 14.8M</h2>
                          <div className="flex items-center gap-2 pt-4">
                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                             <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Updating live manifest...</span>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* System Logs Preview */}
               <AdminLTECard title="Active Protocol Audit" icon={<Terminal size={16}/>} headerColor="border-slate-500">
                  <div className="space-y-3 font-mono text-[9px]">
                     {[
                       { time: '14:20:05', action: 'NODE_AUTH', user: 'root', target: 'COBAMS_WING', status: 'SUCCESS' },
                       { time: '14:21:12', action: 'SYNC_SIGNAL', user: 'ai_bot', target: 'PULSE_STREAM', status: 'COMMIT' },
                       { time: '14:22:45', action: 'DECRYPT_VAULT', user: 'admin', target: 'CEDAT_RES_04', status: 'SUCCESS' },
                       { time: '14:24:10', action: 'FILTER_SIGNAL', user: 'neural_guard', target: 'SPAM_029', status: 'DROPPED' },
                     ].map((log, i) => (
                       <div key={i} className="flex gap-6 py-2 border-b border-[#30363d] last:border-0 hover:bg-white/5 transition-colors">
                          <span className="text-slate-500">[{log.time}]</span>
                          <span className="text-indigo-400 font-bold">{log.action}</span>
                          <span className="text-slate-400 tracking-tight">BY: {log.user}</span>
                          <span className="text-slate-500 truncate">TARGET: {log.target}</span>
                          <span className={`ml-auto font-black ${log.status === 'DROPPED' ? 'text-rose-500' : 'text-emerald-500'}`}>[{log.status}]</span>
                       </div>
                     ))}
                  </div>
               </AdminLTECard>
            </div>
          )}

          {activeTab === 'User Management' && (
            <div className="space-y-6 animate-in fade-in">
               <AdminLTECard 
                  title="Registry: Node Directory" 
                  icon={<Users size={16}/>}
                  tools={
                    <div className="relative group">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12}/>
                       <input 
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         placeholder="Query Node ID..." 
                         className="bg-[#161b22] border border-[#30363d] rounded px-8 py-2 text-[10px] outline-none focus:border-indigo-600 transition-all w-64" 
                       />
                    </div>
                  }
               >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                      <thead className="bg-[#161b22] border-b border-[#30363d] uppercase text-slate-500">
                        <tr>
                          <th className="p-4 tracking-widest">Identity_Protocol</th>
                          <th className="p-4 tracking-widest">Wing</th>
                          <th className="p-4 tracking-widest">Strata</th>
                          <th className="p-4 tracking-widest">Signal_Status</th>
                          <th className="p-4 text-center tracking-widest">Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-4">
                               <img src={u.avatar} className="w-10 h-10 rounded-sm border border-[#30363d] grayscale hover:grayscale-0 transition-all" />
                               <div>
                                  <p className="font-black uppercase text-white tracking-tight flex items-center gap-2">
                                     {u.name}
                                     {u.verified && <CheckCircle size={10} className="text-indigo-500" />}
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-mono">NODE_{u.id.slice(-4)}</p>
                               </div>
                            </td>
                            <td className="p-4 text-indigo-400 font-black">{u.college}</td>
                            <td className="p-4">
                               <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest border ${u.subscriptionTier === 'Pro' ? 'border-indigo-500 text-indigo-500' : u.subscriptionTier === 'Enterprise' ? 'border-amber-500 text-amber-500' : 'border-slate-700 text-slate-500'}`}>
                                  {u.subscriptionTier}
                               </span>
                            </td>
                            <td className="p-4">
                               <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.accountStatus === 'Suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                  <span className="text-[10px] font-black uppercase text-slate-400">{u.accountStatus || 'Stable'}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
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
               </AdminLTECard>
            </div>
          )}

          {/* ... Other tabs ... */}

        </main>
      </div>
    </div>
  );
};

export default Admin;
