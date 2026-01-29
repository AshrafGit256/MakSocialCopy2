
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, Post } from '../types';
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
  Download, PieChart as PieChartIcon,
  MousePointer2, Clock, Globe, ShieldAlert,
  Search, Filter, CheckCircle, Ban, AlertTriangle, Terminal,
  UserCheck, Shield, Cpu, Binary, Radar,
  ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  Image as ImageIcon, Power, Sliders, Command, Radio, Target,
  Briefcase, Rocket, Gauge, Compass, Palette, MoreHorizontal,
  ChevronDown, ExternalLink, FilterX, Laptop, MousePointer, 
  Layout as LayoutIcon, AlignLeft, AlignRight, Maximize, Type,
  Moon, Minus, Settings2
} from 'lucide-react';

const ACCENT_PALETTES = [
  { name: 'Teal/Sand', primary: '#10918a', secondary: '#d1d5db' },
  { name: 'Purple/Slate', primary: '#7c3aed', secondary: '#334155' },
  { name: 'Earth/Gold', primary: '#92400e', secondary: '#fde68a' },
  { name: 'Emerald/Night', primary: '#059669', secondary: '#064e3b' },
  { name: 'Cobalt/Blue', primary: '#2563eb', secondary: '#1d4ed8' },
  { name: 'Maroon/Rose', primary: '#991b1b', secondary: '#f43f5e' },
];

type AdminTab = 'Dashboard' | 'Users' | 'Calendar' | 'Ads' | 'Treasury' | 'Reports' | 'Security';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  // Layout States
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Customizer Preferences
  const [sidebarOption, setSidebarOption] = useState<'vertical' | 'horizontal' | 'dark'>('vertical');
  const [layoutOption, setLayoutOption] = useState<'ltr' | 'rtl' | 'box'>('ltr');
  const [palette, setPalette] = useState(ACCENT_PALETTES[0]);
  const [textSize, setTextSize] = useState(14);

  // Data Sync
  const users = db.getUsers();
  const posts = db.getPosts();
  const events = db.getCalendarEvents();

  // Helper: Apply CSS variables for the palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--admin-primary', palette.primary);
    root.style.setProperty('--admin-secondary', palette.secondary);
    root.style.setProperty('--admin-text-base', `${textSize}px`);
  }, [palette, textSize]);

  const navItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'Users', icon: <Users size={18}/> },
    { id: 'Calendar', icon: <CalendarIcon size={18}/> },
    { id: 'Ads', icon: <Megaphone size={18}/> },
    { id: 'Treasury', icon: <DollarSign size={18}/> },
    { id: 'Reports', icon: <FileJson size={18}/> },
    { id: 'Security', icon: <Shield size={18}/> },
  ];

  const stats = [
    { label: 'Network Nodes', value: users.length, trend: '+14%', color: 'text-indigo-500' },
    { label: 'Active Signals', value: posts.length, trend: '+8%', color: 'text-emerald-500' },
    { label: 'Global Liquidity', value: '42.8M', trend: '-2%', color: 'text-amber-500' },
    { label: 'Security Uptime', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
  ];

  // Render Sidebar Content (used in both Vertical and Horizontal modes)
  const renderNavLinks = () => (
    <ul className={`flex ${sidebarOption === 'horizontal' ? 'flex-row gap-2' : 'flex-col space-y-1'}`}>
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <li key={item.id}>
            <button 
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all group whitespace-nowrap ${
                isActive 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { borderLeft: sidebarOption !== 'horizontal' ? `3px solid ${palette.primary}` : 'none', borderBottom: sidebarOption === 'horizontal' ? `3px solid ${palette.primary}` : 'none' } : {}}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {(isSidebarOpen || sidebarOption === 'horizontal') && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.id}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div 
      className={`min-h-screen w-full bg-[#f1f5f9] flex transition-all duration-500 ${layoutOption === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ fontSize: 'var(--admin-text-base)', direction: layoutOption === 'rtl' ? 'rtl' : 'ltr' }}
    >
      {/* 1. SIDEBAR (VERTICAL MODE) */}
      {sidebarOption !== 'horizontal' && (
        <aside className={`transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} ${sidebarOption === 'dark' ? 'bg-[#1e1e2d] text-white' : 'bg-[#2b3445] text-white shadow-2xl'}`}>
           <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-xl" style={{ backgroundColor: palette.primary }}>
                 <ShieldCheck size={18} className="text-white" />
              </div>
              {isSidebarOpen && <span className="font-black text-xs uppercase tracking-[0.2em] italic">Ki.Command</span>}
           </div>
           <nav className="flex-1 py-8 overflow-y-auto no-scrollbar px-3">
              {renderNavLinks()}
           </nav>
           <div className="p-4 border-t border-white/5">
              <button onClick={onLogout} className="w-full py-3 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                 <Power size={14}/> {isSidebarOpen && "Terminate"}
              </button>
           </div>
        </aside>
      )}

      {/* 2. MAIN VIEWPORT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${layoutOption === 'box' ? 'bg-[#e2e8f0] p-4 lg:p-8' : ''}`}>
        
        <div className={`flex flex-col h-full overflow-hidden shadow-2xl bg-white ${layoutOption === 'box' ? 'max-w-[1400px] mx-auto rounded-[2rem] border border-slate-200' : ''}`}>
          
          {/* TOP HEADER */}
          <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0 z-[90]">
             <div className="flex items-center gap-6">
                {sidebarOption !== 'horizontal' && (
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded text-slate-400"><Menu size={20}/></button>
                )}
                <div className="flex items-center text-[10px] font-bold text-slate-400 gap-2 uppercase tracking-widest">
                   <span className="hover:text-slate-800 cursor-pointer">Admin</span>
                   <ChevronRight size={12}/>
                   <span className="text-slate-800">{activeTab}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase text-slate-800">Super Administrator</span>
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Registry.Live</span>
                </div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border border-slate-100" />
             </div>
          </header>

          {/* HORIZONTAL NAV (IF ENABLED) */}
          {sidebarOption === 'horizontal' && (
            <div className="bg-[#1e1e2d] border-b border-white/5 py-2 px-6 overflow-x-auto no-scrollbar">
               {renderNavLinks()}
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8fafc] no-scrollbar">
            
            {activeTab === 'Dashboard' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                 {/* STATS */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(s => (
                      <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-slate-50 ${s.color} transition-colors group-hover:bg-slate-100`}><Activity size={20}/></div>
                            <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{s.trend}</span>
                         </div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</p>
                         <h3 className="text-3xl font-black text-slate-800 mt-1 italic tracking-tighter">{s.value}</h3>
                      </div>
                    ))}
                 </div>

                 {/* ANALYTICS CHARTS */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[450px]">
                       <div className="flex justify-between items-center mb-8">
                          <div>
                             <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Signal Traffic Analysis</h4>
                             <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Real-time network telemetry</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }}></div><span className="text-[9px] font-bold uppercase text-slate-500">Uplink</span></div>
                             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreHorizontal size={16}/></button>
                          </div>
                       </div>
                       <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={ANALYTICS}>
                                <defs>
                                   <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={palette.primary} stopOpacity={0.2}/>
                                      <stop offset="95%" stopColor={palette.primary} stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="posts" stroke={palette.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorPrimary)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="lg:col-span-4 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                       <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-8 flex items-center gap-2"><Trophy size={18} className="text-amber-500"/> Sector Ranking</h4>
                       <div className="space-y-6">
                          {['COCIS', 'CEDAT', 'LAW', 'COBAMS', 'CHUSS'].map((sector, i) => (
                            <div key={sector} className="flex items-center justify-between group cursor-pointer">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900 transition-colors">0{i+1}</div>
                                  <div>
                                     <p className="text-[11px] font-black uppercase text-slate-800 leading-none">{sector}_HUB</p>
                                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Active Segments</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[11px] font-black" style={{ color: palette.primary }}>{85 - (i*10)}%</p>
                                  <p className="text-[7px] text-slate-400 uppercase font-black">Sync.Rank</p>
                               </div>
                            </div>
                          ))}
                       </div>
                       <button className="w-full mt-10 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-[9px] font-black uppercase tracking-widest transition-all">Full Sector Manifest</button>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB PLACEHOLDER */}
            {activeTab !== 'Dashboard' && (
               <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
                  <Database size={64} style={{ color: palette.primary }} />
                  <div className="text-center">
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter">Syncing Manifest...</h3>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Loading sector {activeTab} Intelligence nodes</p>
                  </div>
               </div>
            )}

          </main>
        </div>
      </div>

      {/* 3. FLOATING CUSTOMIZER TRIGGER */}
      <button 
        onClick={() => setIsCustomizerOpen(true)}
        className="fixed bottom-10 right-10 z-[200] p-4 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
        style={{ backgroundColor: palette.primary }}
      >
        <Settings2 size={24} />
      </button>

      {/* 4. THE ADMIN CUSTOMIZER (KI DRAWER) */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCustomizerOpen(false)}></div>
           
           <div className="relative w-full max-w-sm h-full bg-[#1e1e2d] text-[#c9d1d9] shadow-2xl flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Customizer Header */}
              <div className="p-6 flex justify-between items-start border-b border-white/5" style={{ backgroundColor: palette.primary }}>
                 <div>
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Admin Customizer</h2>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1 italic">Style your terminal protocols</p>
                 </div>
                 <button onClick={() => setIsCustomizerOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar">
                 
                 {/* Sidebar Option */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Sidebar Option</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'vertical', label: 'Vertical', icon: <LayoutIcon size={18}/> },
                         { id: 'horizontal', label: 'Horizontal', icon: <MoreHorizontal size={18}/> },
                         { id: 'dark', label: 'Dark', icon: <Moon size={18}/> }
                       ].map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => setSidebarOption(opt.id as any)}
                            className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-2 relative ${sidebarOption === opt.id ? 'bg-white/5 border-emerald-500 text-white' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                          >
                             <div className={`p-3 rounded-lg ${sidebarOption === opt.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}>
                                {opt.icon}
                             </div>
                             <span className="text-[9px] font-black uppercase">{opt.label}</span>
                             {sidebarOption === opt.id && <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Layout Option */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Layout Option</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'ltr', label: 'LTR', icon: <AlignLeft size={18}/> },
                         { id: 'rtl', label: 'RTL', icon: <AlignRight size={18}/> },
                         { id: 'box', label: 'Boxed', icon: <Maximize size={18}/> }
                       ].map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => setLayoutOption(opt.id as any)}
                            className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-2 relative ${layoutOption === opt.id ? 'bg-white/5 border-emerald-500 text-white' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                          >
                             <div className={`p-3 rounded-lg ${layoutOption === opt.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}>
                                {opt.icon}
                             </div>
                             <span className="text-[9px] font-black uppercase">{opt.label}</span>
                             {layoutOption === opt.id && <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Color Hint */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Color Palette</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                       {ACCENT_PALETTES.map((pal, i) => (
                          <button 
                            key={i} 
                            onClick={() => setPalette(pal)}
                            className={`relative group w-12 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${palette.name === pal.name ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-2xl' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                          >
                             <div className="h-1/2 w-full" style={{ backgroundColor: pal.primary }}></div>
                             <div className="h-1/2 w-full" style={{ backgroundColor: pal.secondary }}></div>
                             {palette.name === pal.name && <div className="absolute top-1 left-1"><Check size={8} className="text-white"/></div>}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Text Size */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Font Intensity</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="flex items-center gap-6 bg-black/40 p-6 rounded-xl border border-white/5">
                       <button onClick={() => setTextSize(Math.max(10, textSize - 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-all text-white/40 hover:text-white"><Minus size={18}/></button>
                       <div className="flex-1 text-center">
                          <span className="text-3xl font-black italic tracking-tighter text-emerald-500">{textSize}px</span>
                          <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mt-1">Terminal.Scale</p>
                       </div>
                       <button onClick={() => setTextSize(Math.min(20, textSize + 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-all text-white/40 hover:text-white"><Plus size={18}/></button>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-white/5 grid grid-cols-2 gap-4">
                 <button className="py-4 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Default_OS</button>
                 <button onClick={() => setIsCustomizerOpen(false)} className="py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all active:scale-95">Commit_Sync</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        /* platform-wide palette application */
        :root {
          --admin-primary: #10918a;
          --admin-secondary: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Admin;
