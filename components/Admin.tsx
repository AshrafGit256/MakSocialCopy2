
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog, College, Post } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
// Added Moon and Minus icons to fix compilation errors
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
  ChevronDown, ExternalLink, FilterX, Laptop, MousePointer, 
  Layout as LayoutIcon, AlignLeft, AlignRight, Maximize, Type,
  Moon, Minus
} from 'lucide-react';

const ACCENT_PALETTES = [
  { name: 'Teal/Sand', primary: '#0d9488', secondary: '#d4d4d8' },
  { name: 'Purple/Slate', primary: '#7c3aed', secondary: '#334155' },
  { name: 'Brown/Earth', primary: '#78350f', secondary: '#a8a29e' },
  { name: 'Emerald/Slate', primary: '#059669', secondary: '#334155' },
  { name: 'Blue/Navy', primary: '#1d4ed8', secondary: '#1e3a8a' },
  { name: 'Maroon/Dark', primary: '#7f1d1d', secondary: '#18181b' },
];

type AdminTab = 'Dashboard' | 'Users' | 'Content' | 'Ads' | 'Security' | 'Treasury' | 'Calendar' | 'Reports' | 'Config';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Customizer States
  const [sidebarOption, setSidebarOption] = useState<'vertical' | 'horizontal' | 'dark'>('vertical');
  const [layoutOption, setLayoutOption] = useState<'ltr' | 'rtl' | 'box'>('ltr');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [textSize, setTextSize] = useState(14);
  
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

    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="h-32 border-r border-b border-slate-100 bg-slate-50/30"></div>);
    }

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
        </div>
      );
    }
    return grid;
  };

  return (
    <div className={`flex h-screen w-full bg-[#f8fafc] text-slate-700 font-sans selection:bg-indigo-100 overflow-hidden ${layoutOption === 'rtl' ? 'flex-row-reverse' : ''}`}>
      
      {/* 1. SIDEBAR (K1 STYLE) */}
      <aside className={`transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} ${sidebarOption === 'dark' ? 'bg-[#181a1b] text-white border-r border-white/10' : 'bg-[#1e293b] text-white border-r border-slate-700'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-xl" style={{ backgroundColor: accentColor }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-black text-xs uppercase tracking-[0.2em] italic">Command.OS</span>}
        </div>

        <nav className="flex-1 py-8 overflow-y-auto no-scrollbar">
          <div className="px-6 mb-4">
             <p className={`text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] ${!isSidebarOpen && 'hidden'}`}>Core Terminal</p>
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
                  className={`w-full flex items-center px-6 py-3.5 transition-all group relative ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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
              { id: 'Config', icon: <Palette size={20}/> },
              { id: 'Security', icon: <Shield size={20}/> },
              { id: 'Reports', icon: <FileJson size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as AdminTab)} 
                  className={`w-full flex items-center px-6 py-3.5 transition-all group relative ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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

      {/* 2. MAIN CONTENT */}
      <div className={`flex-1 flex flex-col overflow-hidden ${layoutOption === 'box' ? 'max-w-[1200px] mx-auto border-x border-slate-200 shadow-2xl' : ''}`}>
        
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-[90]">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded text-slate-400 transition-colors"><Menu size={20}/></button>
              <div className="flex items-center text-[11px] font-bold text-slate-400 gap-2 uppercase tracking-widest">
                 <span>Command</span>
                 <ChevronRight size={12}/>
                 <span className="text-slate-800">{activeTab}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-800 uppercase">Super Admin</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">System Architect</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-full border border-slate-200" />
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#f1f5f9] pb-32">
          
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map(s => (
                    <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-lg bg-slate-50 ${s.color} transition-colors group-hover:bg-indigo-50`}>{s.icon}</div>
                          <span className={`text-[10px] font-bold ${s.trend === 'Stable' ? 'text-slate-400' : 'text-emerald-500'}`}>{s.trend}</span>
                       </div>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</p>
                       <h3 className="text-2xl font-black text-slate-800 mt-1">{s.value}</h3>
                    </div>
                  ))}
               </div>
               {/* Dashboard content */}
            </div>
          )}

          {activeTab === 'Config' && (
            <div className="max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-500">
               <div className="bg-[#1e1e2d] text-[#c9d1d9] rounded-xl shadow-2xl overflow-hidden border border-white/5">
                  
                  {/* Customizer Header */}
                  <div className="bg-[#10918a] p-6 flex justify-between items-start border-b border-black/20">
                     <div>
                        <h2 className="text-lg font-black text-white/90">Admin Customizer</h2>
                        <p className="text-xs text-white/60 font-medium italic mt-1">it's time to style according to your choice ..!</p>
                     </div>
                     <button onClick={() => setActiveTab('Dashboard')} className="p-2 text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-8 space-y-12">
                     
                     {/* 1. Sidebar Option */}
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <h3 className="text-sm font-black uppercase text-white tracking-widest">Sidebar option</h3>
                           <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                           {[
                             { id: 'vertical', label: 'Vertical', icon: <LayoutIcon size={24}/> },
                             { id: 'horizontal', label: 'Horizontal', icon: <MoreHorizontal size={24}/> },
                             { id: 'dark', label: 'Dark', icon: <Moon size={24}/> }
                           ].map(opt => (
                              <button 
                                key={opt.id} 
                                onClick={() => setSidebarOption(opt.id as any)}
                                className={`relative p-8 rounded-xl border transition-all flex flex-col items-center gap-3 group ${sidebarOption === opt.id ? 'bg-white/5 border-[#10918a] ring-1 ring-[#10918a]/50 shadow-[0_0_20px_rgba(16,145,138,0.1)]' : 'bg-black/20 border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                              >
                                 <div className={`p-4 rounded-full transition-colors ${sidebarOption === opt.id ? 'bg-[#10918a] text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                                    {opt.icon}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                 {sidebarOption === opt.id && (
                                    <div className="absolute top-2 left-2 bg-emerald-500 rounded-full p-0.5 text-white shadow-lg border border-white/20">
                                       <Check size={10} strokeWidth={4} />
                                    </div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* 2. Layout Option */}
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <h3 className="text-sm font-black uppercase text-white tracking-widest">Layout option</h3>
                           <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                           {[
                             { id: 'ltr', label: 'LTR', icon: <AlignLeft size={24}/> },
                             { id: 'rtl', label: 'RTL', icon: <AlignRight size={24}/> },
                             { id: 'box', label: 'Box', icon: <Maximize size={24}/> }
                           ].map(opt => (
                              <button 
                                key={opt.id} 
                                onClick={() => setLayoutOption(opt.id as any)}
                                className={`relative p-8 rounded-xl border transition-all flex flex-col items-center gap-3 group ${layoutOption === opt.id ? 'bg-white/5 border-[#10918a] ring-1 ring-[#10918a]/50 shadow-[0_0_20px_rgba(16,145,138,0.1)]' : 'bg-black/20 border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                              >
                                 <div className={`p-4 rounded-full transition-colors ${layoutOption === opt.id ? 'bg-[#10918a] text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                                    {opt.icon}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                 {layoutOption === opt.id && (
                                    <div className="absolute top-2 left-2 bg-emerald-500 rounded-full p-0.5 text-white shadow-lg border border-white/20">
                                       <Check size={10} strokeWidth={4} />
                                    </div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* 3. Color Hint (Palettes) */}
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <h3 className="text-sm font-black uppercase text-white tracking-widest">Color Hint</h3>
                           <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                           {ACCENT_PALETTES.map((pal, i) => (
                              <button 
                                key={i} 
                                onClick={() => setAccentColor(pal.primary)}
                                className={`relative group w-14 h-24 rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${accentColor === pal.primary ? 'border-emerald-500 shadow-xl' : 'border-white/10 hover:border-white/30'}`}
                              >
                                 <div className="h-1/2 w-full" style={{ backgroundColor: pal.primary }}></div>
                                 <div className="h-1/2 w-full" style={{ backgroundColor: pal.secondary }}></div>
                                 {accentColor === pal.primary && (
                                    <div className="absolute top-1 left-1 bg-emerald-500 rounded-full p-0.5 text-white border border-white/20 shadow-md">
                                       <Check size={8} strokeWidth={4} />
                                    </div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* 4. Text Size Slider */}
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <h3 className="text-sm font-black uppercase text-white tracking-widest">Text size</h3>
                           <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                        <div className="flex items-center gap-6 bg-black/20 p-6 rounded-xl border border-white/5">
                           <button onClick={() => setTextSize(Math.max(10, textSize - 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-all text-white/60 hover:text-white"><Minus size={20}/></button>
                           <div className="flex-1 text-center">
                              <span className="text-3xl font-black italic text-emerald-500">{textSize}px</span>
                              <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Terminal Scale</p>
                           </div>
                           <button onClick={() => setTextSize(Math.min(24, textSize + 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded transition-all text-white/60 hover:text-white"><Plus size={20}/></button>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
                        <button className="px-10 py-4 bg-white/5 text-white/40 hover:text-white transition-all rounded-lg text-[10px] font-black uppercase tracking-widest">Restore Defaults</button>
                        <button className="px-12 py-4 bg-[#10918a] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-[#10918a]/20 hover:bg-[#0c7a74] transition-all">Save Changes</button>
                     </div>

                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500 h-full">
               <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={18}/></button>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={18}/></button>
                     </div>
                  </div>
                  <div className="grid grid-cols-7 bg-slate-50 text-center text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-3 border-r border-slate-200 last:border-r-0">{d}</div>)}
                  </div>
                  <div className="flex-1 grid grid-cols-7 overflow-y-auto no-scrollbar">
                     {renderCalendarGrid()}
                  </div>
               </div>
               <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                     <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Plus size={18}/> New Schedule
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['Dashboard', 'Config', 'Calendar'].includes(activeTab) && (
            <div className="py-40 text-center space-y-6 opacity-30">
               <Database size={64} className="mx-auto" />
               <p className="text-sm font-black uppercase tracking-widest">Section Manifest Synchronizing...</p>
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
