
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog, College, Post } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Users, Activity, Trash2, Plus, 
  DollarSign, Calendar as CalendarIcon, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Settings, Menu, Bell, 
  LogOut, Megaphone, TrendingUp, BarChart3,
  Edit3, Eye, ChevronRight, ChevronLeft,
  CalendarDays, Download, PieChart as PieChartIcon,
  MousePointer2, Clock, Globe, ShieldAlert,
  Search, Filter, CheckCircle, Ban, AlertTriangle, Terminal,
  UserCheck, Shield, Cpu, Binary, Radar, CandlestickChart,
  ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  Image as ImageIcon, Maximize2, Power, Sliders, Command, Radio, Target,
  Briefcase, Rocket, Gauge, Compass, Palette, MoreHorizontal,
  ChevronDown, ExternalLink, FilterX
} from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Indigo Pulse', hex: '#6366f1' },
  { name: 'Emerald Logic', hex: '#10b981' },
  { name: 'Rose Violation', hex: '#f43f5e' },
  { name: 'Amber Signal', hex: '#f59e0b' },
  { name: 'Cyan Strata', hex: '#06b6d4' },
  { name: 'Slate Core', hex: '#64748b' },
];

type AdminTab = 'Dashboard' | 'Users' | 'Content' | 'Ads' | 'Security' | 'Treasury' | 'Calendar' | 'Reports' | 'Config';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingAd, setIsAddingAd] = useState(false);
  
  // Data
  const users = db.getUsers();
  const posts = db.getPosts();
  const events = db.getCalendarEvents();

  // Simulated Stats
  const stats = [
    { label: 'Total Nodes', value: users.length, trend: '+12.5%', icon: <Users size={20}/>, color: 'text-indigo-500' },
    { label: 'Active Signals', value: posts.length, trend: '+4.2%', icon: <Activity size={20}/>, color: 'text-emerald-500' },
    { label: 'Total Revenue', value: 'UGX 24.8M', trend: '+8.1%', icon: <DollarSign size={20}/>, color: 'text-amber-500' },
    { label: 'System Uptime', value: '99.9%', trend: 'Stable', icon: <Zap size={20}/>, color: 'text-rose-500' },
  ];

  // Calendar Helper
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const grid = [];

    // Fill empty start
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="h-32 border-r border-b border-slate-100 bg-slate-50/30"></div>);
    }

    // Fill days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      grid.push(
        <div key={d} className={`h-32 border-r border-b border-slate-100 p-2 relative group hover:bg-slate-50/50 transition-colors ${isToday ? 'bg-indigo-50/30' : ''}`}>
          <span className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
            {dayEvents.map(e => (
              <div key={e.id} className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[8px] font-bold uppercase truncate border border-indigo-200">
                {e.title}
              </div>
            ))}
          </div>
          <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white border border-slate-200 rounded shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
            <Plus size={10}/>
          </button>
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-700 font-sans selection:bg-indigo-100 overflow-hidden">
      
      {/* 1. PROFESSIONAL SIDEBAR (K1 STYLE) */}
      <aside className={`bg-[#1e293b] text-white transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-xl" style={{ backgroundColor: accentColor }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-black text-xs uppercase tracking-[0.2em] italic">Command.OS</span>}
        </div>

        <nav className="flex-1 py-8 overflow-y-auto no-scrollbar">
          <div className="px-6 mb-4">
             <p className={`text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ${!isSidebarOpen && 'hidden'}`}>General Management</p>
          </div>
          <ul className="space-y-1">
            {[
              { id: 'Dashboard', icon: <LayoutDashboard size={20}/> },
              { id: 'Users', icon: <Users size={20}/> },
              { id: 'Calendar', icon: <CalendarIcon size={20}/> },
              { id: 'Content', icon: <Layers size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as AdminTab)} 
                  className={`w-full flex items-center px-6 py-3.5 transition-all group relative ${activeTab === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }} />}
                  <div className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</div>
                  {isSidebarOpen && <span className="ml-4 text-xs font-bold uppercase tracking-widest">{item.id}</span>}
                </button>
              </li>
            ))}
          </ul>

          <div className="px-6 mt-10 mb-4">
             <p className={`text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ${!isSidebarOpen && 'hidden'}`}>Revenue & Growth</p>
          </div>
          <ul className="space-y-1">
            {[
              { id: 'Ads', icon: <Megaphone size={20}/> },
              { id: 'Treasury', icon: <DollarSign size={20}/> },
              { id: 'Reports', icon: <FileJson size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as AdminTab)} 
                  className={`w-full flex items-center px-6 py-3.5 transition-all group relative ${activeTab === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }} />}
                  <div className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</div>
                  {isSidebarOpen && <span className="ml-4 text-xs font-bold uppercase tracking-widest">{item.id}</span>}
                </button>
              </li>
            ))}
          </ul>

          <div className="px-6 mt-10 mb-4">
             <p className={`text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ${!isSidebarOpen && 'hidden'}`}>System Protocol</p>
          </div>
          <ul className="space-y-1">
            {[
              { id: 'Security', icon: <Shield size={20}/> },
              { id: 'Config', icon: <Sliders size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as AdminTab)} 
                  className={`w-full flex items-center px-6 py-3.5 transition-all group relative ${activeTab === item.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accentColor }} />}
                  <div className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</div>
                  {isSidebarOpen && <span className="ml-4 text-xs font-bold uppercase tracking-widest">{item.id}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
           <button onClick={onLogout} className="w-full flex items-center justify-center p-3 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest gap-3">
              <Power size={16}/> {isSidebarOpen && "Sign Out"}
           </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP NAV BAR */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-[90]">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded text-slate-400 transition-colors"><Menu size={20}/></button>
              <div className="flex items-center text-[11px] font-bold text-slate-400 gap-2 uppercase tracking-widest">
                 <span>Command</span>
                 <ChevronRight size={12}/>
                 <span className="text-slate-800">{activeTab}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Node Validated
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Super Admin</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">System Architect</p>
                 </div>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
              </div>
           </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#f1f5f9] pb-32">
          
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Stat Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map(s => (
                    <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-lg bg-slate-50 ${s.color} transition-colors group-hover:bg-indigo-50`}>{s.icon}</div>
                          <span className={`text-[10px] font-bold ${s.trend === 'Stable' ? 'text-slate-400' : 'text-emerald-500'}`}>{s.trend}</span>
                       </div>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</p>
                       <h3 className="text-2xl font-black text-slate-800 mt-1">{s.value.toLocaleString()}</h3>
                    </div>
                  ))}
               </div>

               {/* Charts Row */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Signal Frequency (24h)</h3>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Network Activity Strata</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[9px] font-bold uppercase text-slate-500">Uplink</span></div>
                           <button className="p-2 hover:bg-slate-100 rounded text-slate-400"><MoreHorizontal size={16}/></button>
                        </div>
                     </div>
                     <div className="flex-1 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={ANALYTICS}>
                              <defs>
                                 <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Area type="monotone" dataKey="posts" stroke={accentColor} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="lg:col-span-4 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Trophy size={140} className="text-amber-500"/></div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-8 flex items-center gap-2"><Trophy size={18} className="text-amber-500"/> Contributor Hub</h3>
                     <div className="space-y-6">
                        {users.slice(0, 5).map((u, i) => (
                          <div key={u.id} className="flex items-center justify-between group cursor-pointer">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                   <img src={u.avatar} className="w-10 h-10 rounded-lg border border-slate-100 grayscale group-hover:grayscale-0 transition-all" />
                                   <div className="absolute -top-1 -left-1 w-4 h-4 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[8px] font-black text-indigo-600">{i+1}</div>
                                </div>
                                <div>
                                   <p className="text-[11px] font-black uppercase text-slate-800 leading-none">{u.name}</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{u.college} HUB</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[11px] font-black text-indigo-600">{u.postsCount}</p>
                                <p className="text-[7px] text-slate-400 uppercase font-black">Signals</p>
                             </div>
                          </div>
                        ))}
                     </div>
                     <button className="w-full mt-10 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all">View All Nodes</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 h-full">
               {/* Side Signal Panel */}
               <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                     <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                        <Plus size={18}/> Initialize Protocol
                     </button>
                     
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocol Categories</p>
                        <div className="space-y-2">
                           {['Academic', 'Social', 'Workshop', 'Assessment'].map(c => (
                              <div key={c} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white transition-all group">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${c === 'Academic' ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                                    <span className="text-[11px] font-bold uppercase">{c}</span>
                                 </div>
                                 <MoreHorizontal size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h4 className="text-[10px] font-black uppercase text-slate-800 mb-6 flex items-center gap-2"><Activity size={14} className="text-emerald-500"/> Node Peak Strata</h4>
                     <div className="space-y-4">
                        {[
                          { hub: 'COCIS', status: 'High Volume', color: 'text-amber-500' },
                          { hub: 'CEDAT', status: 'Optimal', color: 'text-emerald-500' },
                          { hub: 'CHUSS', status: 'Assessment Peak', color: 'text-rose-500' }
                        ].map(h => (
                          <div key={h.hub} className="flex justify-between items-center text-[10px] font-bold uppercase">
                             <span className="text-slate-500">{h.hub} Hub</span>
                             <span className={h.color}>{h.status}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Main Calendar Grid */}
               <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-400"><ChevronLeft size={18}/></button>
                           <h2 className="text-xl font-black uppercase italic tracking-tighter w-48 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                           <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-400"><ChevronRight size={18}/></button>
                        </div>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50">Sys.Today</button>
                     </div>
                     <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                        {['Month', 'Week', 'Day'].map(view => (
                           <button key={view} className={`px-5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${view === 'Month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{view}</button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-7 bg-slate-50 text-center text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-3 border-r border-slate-200 last:border-r-0">{d}</div>)}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-7 overflow-y-auto no-scrollbar">
                     {renderCalendarGrid()}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Ads' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Campaign Builder */}
                  <div className="lg:col-span-4 bg-white p-10 rounded-xl border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Rocket size={100} className="text-indigo-600"/></div>
                     <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Campaign Console</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Broadcast promotional content across all nodes</p>
                     </div>

                     <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Propaganda Identity</label>
                           <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. Campus_Bazaar_Launch" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sector Targeting</label>
                           <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-bold outline-none">
                              <option>Universal Registry (All)</option>
                              <option>Tech Wings (COCIS/CEDAT)</option>
                              <option>Business Wings (COBAMS)</option>
                           </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">TTL Duration (Days)</label>
                              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-bold outline-none" defaultValue={7} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Budget Allocation</label>
                              <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-bold outline-none" placeholder="UGX" />
                           </div>
                        </div>
                        <div className="p-6 bg-indigo-50 border border-dashed border-indigo-200 rounded-xl space-y-3">
                           <p className="text-[9px] font-black uppercase text-indigo-600 text-center">Drag Visual Payload Here</p>
                           <div className="flex justify-center"><ImageIcon size={24} className="text-indigo-300"/></div>
                        </div>
                        <button className="w-full py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-xl shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Broadcast Propaganda</button>
                     </div>
                  </div>

                  {/* Active Campaigns List */}
                  <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                     <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-3"><Rocket size={20} className="text-indigo-600"/> Signal Manifest</h3>
                        <div className="flex items-center gap-3">
                           <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[65%] animate-pulse"></div></div>
                           <span className="text-[10px] font-black text-slate-400">Registry Saturation: 65%</span>
                        </div>
                     </div>
                     <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                              <tr>
                                 <th className="p-6">Campaign_Node</th>
                                 <th className="p-6">Performance (CTR)</th>
                                 <th className="p-6">Fiscal_Sync</th>
                                 <th className="p-6 text-right">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {[
                                { name: 'MTN_Node_Uplink', reach: '42.1k', ctr: '12.4%', burn: 'UGX 1.2M', status: 'Broadcasting' },
                                { name: 'Centenary_Node', reach: '18.4k', ctr: '4.8%', burn: 'UGX 450k', status: 'Broadcasting' },
                                { name: 'SafeBoda_Protocol', reach: '8.2k', ctr: '2.1%', burn: 'UGX 120k', status: 'Paused' },
                                { name: 'Stanbic_Node', reach: '52.9k', ctr: '18.5%', burn: 'UGX 2.8M', status: 'Broadcasting' }
                              ].map(ad => (
                                <tr key={ad.name} className="hover:bg-slate-50 transition-colors group">
                                   <td className="p-6">
                                      <div className="flex items-center gap-4">
                                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg transition-transform group-hover:scale-110"><Zap size={16}/></div>
                                         <div>
                                            <p className="text-[11px] font-black uppercase text-slate-800">{ad.name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{ad.reach} Nodes Scanned</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-6">
                                      <div className="flex items-center gap-3">
                                         <span className="text-[11px] font-black text-slate-700">{ad.ctr}</span>
                                         <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: ad.ctr }}></div></div>
                                      </div>
                                   </td>
                                   <td className="p-6 text-[11px] font-bold text-slate-600">{ad.burn}</td>
                                   <td className="p-6 text-right">
                                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${ad.status === 'Broadcasting' ? 'border-emerald-500/20 bg-emerald-50 text-emerald-600' : 'border-rose-500/20 bg-rose-50 text-rose-600'}`}>{ad.status}</span>
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

          {activeTab === 'Reports' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end mb-4">
                  <div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-800">Intelligence Manifests</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Generate and synchronize fiscal and operational assets</p>
                  </div>
                  <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-3">
                     <Download size={16}/> Export Full Registry
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { title: 'Fiscal_Audit_Q1_2026', type: 'PDF_MANIFEST', size: '2.4MB', color: 'text-indigo-500', icon: <DollarSign size={24}/> },
                    { title: 'Sector_Performance_Logs', type: 'CSV_STREAM', size: '1.8MB', color: 'text-emerald-500', icon: <Binary size={24}/> },
                    { title: 'Node_Identity_Snapshots', type: 'JSON_OBJECT', size: '12.4MB', color: 'text-rose-500', icon: <Users size={24}/> },
                    { title: 'Signal_Integrity_Report', type: 'PDF_MANIFEST', size: '4.2MB', color: 'text-amber-500', icon: <Shield size={24}/> },
                    { title: 'Propaganda_CTR_Sync', type: 'XLS_DATA', size: '890KB', color: 'text-cyan-500', icon: <Rocket size={24}/> },
                    { title: 'System_Entropy_Trace', type: 'LOG_BUFFER', size: '15.1MB', color: 'text-slate-600', icon: <Activity size={24}/> }
                  ].map(doc => (
                    <div key={doc.title} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">{doc.icon}</div>
                       <div className="space-y-6">
                          <div className={`p-4 bg-slate-50 ${doc.color} rounded-lg w-fit transition-colors group-hover:bg-indigo-50`}>{doc.icon}</div>
                          <div>
                             <h4 className="text-sm font-black uppercase text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{doc.type}</p>
                          </div>
                          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-400 uppercase">{doc.size}</span>
                             <button className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-600 hover:underline">Download Signal <ChevronRight size={14}/></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Config' && (
             <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-500">
                <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm space-y-14 relative overflow-hidden">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/30"><Sliders size={32}/></div>
                      <div>
                         <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-800 leading-none">Command Parameters</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Personalize OS Terminal & Global Registry Protocols</p>
                      </div>
                   </div>

                   <div className="space-y-12">
                      <div className="space-y-6">
                         <label className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
                            <Palette size={20} style={{ color: accentColor }}/> Terminal Accent Logic
                         </label>
                         <div className="flex flex-wrap gap-5 p-8 bg-slate-50 rounded-xl border border-slate-100">
                            {ACCENT_COLORS.map(c => (
                               <button 
                                 key={c.hex} 
                                 onClick={() => setAccentColor(c.hex)} 
                                 className={`group relative w-16 h-16 rounded-xl border-4 transition-all ${accentColor === c.hex ? 'border-white scale-110 shadow-2xl shadow-slate-400' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                                 style={{ backgroundColor: c.hex }}
                               >
                                  {accentColor === c.hex && (
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/10"><Check size={28} className="text-white"/></div>
                                  )}
                                  <div className="absolute bottom-[-28px] left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <span className="text-[8px] font-black uppercase text-slate-500">{c.name}</span>
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                           { id: 'maintenance', label: 'Universal Lockdown', desc: 'Lock universal feed and broadcast maintenance signal', icon: <Lock size={20}/> },
                           { id: 'firewall', label: 'Node Registration Firewall', desc: 'Prevent new identity enrollment in the Registry', icon: <Shield size={20}/> }
                         ].map(p => (
                            <div key={p.id} className="p-8 rounded-xl border border-slate-200 bg-white flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                               <div className="p-4 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{p.icon}</div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-800">{p.label}</span>
                                     <div className="w-12 h-6 rounded-full bg-slate-200 relative"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                                  </div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">{p.desc}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-10 border-t border-slate-100 flex justify-end">
                      <button className="px-14 py-6 bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-xl shadow-2xl active:scale-95 transition-all">Commit Protocol Shifts</button>
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
