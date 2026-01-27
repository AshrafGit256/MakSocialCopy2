
import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, FlaggedContent, AuditLog } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
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
  UserCheck, Shield
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminLTECard: React.FC<{ 
  title: string, 
  icon: React.ReactNode, 
  headerColor?: string, 
  children: React.ReactNode,
  tools?: React.ReactNode
}> = ({ title, icon, headerColor = 'border-indigo-500', children, tools }) => (
  <div className={`bg-white dark:bg-[#343a40] shadow-md border-t-4 ${headerColor} rounded overflow-hidden flex flex-col h-full`}>
    <div className="px-4 py-3 border-b dark:border-[#4b545c] flex justify-between items-center bg-slate-50/10 shrink-0">
      <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-tight">
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
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(db.getAuditLogs());
  const [flagged, setFlagged] = useState<FlaggedContent[]>(db.getFlagged());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setAds(db.getAds());
      setCalendarEvents(db.getCalendarEvents());
      setResources(db.getResources());
      setAuditLogs(db.getAuditLogs());
      setFlagged(db.getFlagged());
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVerification = (userId: string) => {
    db.toggleVerification(userId);
    setUsers(db.getUsers());
    const user = db.getUsers().find(u => u.id === userId);
    // Add audit log for verification toggle
    console.debug(`Node ${userId} verification status shifted: ${user?.verified}`);
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] dark:bg-[#454d55] text-slate-800 dark:text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64 fixed lg:relative h-full shadow-2xl lg:shadow-none'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0 bg-[#343a40] justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded flex items-center justify-center mr-3 shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            {!isSidebarCollapsed && <span className="font-bold text-base md:text-lg text-white uppercase tracking-tight">MakAdmin</span>}
          </div>
          {!isSidebarCollapsed && (
            <button onClick={() => setIsSidebarCollapsed(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
               <X size={20}/>
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'Overview', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
              { id: 'User Management', label: 'User Node Control', icon: <Users size={20}/> },
              { id: 'Moderation', label: 'Safety Desk', icon: <ShieldAlert size={20}/> },
              { id: 'Event Management', label: 'Events Registry', icon: <Calendar size={20}/> },
              { id: 'ADs Management', label: 'Ad Intelligence', icon: <Megaphone size={20}/> },
              { id: 'Subscribers Revenue', label: 'Financial Flow', icon: <DollarSign size={20}/> },
              { id: 'Platform Usage Reports', label: 'Traffic Analysis', icon: <BarChart3 size={20}/> },
              { id: 'System Logs', label: 'Audit Trail', icon: <Terminal size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { setActiveTab(item.id as AdminTab); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} 
                  className={`w-full flex items-center px-3 py-3 rounded transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onLogout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all">
              <LogOut size={16}/> {!isSidebarCollapsed && "Terminate Signal"}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#343a40] dark:border-[#4b545c] border-b shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">MakSocial Command / <span className="text-indigo-600">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="relative">
                <Bell size={18} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">12</span>
             </div>
             <div className="flex items-center gap-2 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Super Administrator</p>
                  <p className="text-[11px] font-black uppercase">Root.Authority</p>
                </div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-8 h-8 rounded-full border dark:border-white/10" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar pb-20">
          
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Network Nodes', val: users.length, icon: <Users size={24}/>, bg: 'bg-[#17a2b8]' },
                    { label: 'Stable Subscriptions', val: subscribers.length, icon: <Zap size={24}/>, bg: 'bg-[#28a745]' },
                    { label: 'Weekly Velocity', val: '+24.1%', icon: <TrendingUp size={24}/>, bg: 'bg-[#ffc107]' },
                    { label: 'Flagged Entropy', val: flagged.length, icon: <AlertTriangle size={24}/>, bg: 'bg-[#dc3545]' },
                  ].map((box, i) => (
                    <div key={i} className="bg-white dark:bg-[#343a40] shadow rounded flex items-stretch overflow-hidden h-24 border border-black/5">
                      <div className={`${box.bg} w-20 flex items-center justify-center text-white shrink-0`}>{box.icon}</div>
                      <div className="flex-1 p-4 flex flex-col justify-center">
                         <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{box.label}</span>
                         <span className="text-2xl font-black">{box.val}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 h-[400px]">
                    <AdminLTECard title="Network Traffic & Signal Intensity" icon={<Activity size={16}/>}>
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ANALYTICS}>
                             <defs>
                               {/* Fix: removed duplicate x1 attribute */}
                               <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                             <Area type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                             <Area type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={2} fill="transparent" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </AdminLTECard>
                  </div>
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white dark:bg-[#343a40] p-6 rounded shadow flex-1 flex flex-col justify-between">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-500" /> Platform Integrity
                       </h4>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-bold text-slate-500">SYSTEM UPTIME</span>
                             <span className="text-sm font-black text-emerald-500">99.98%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[99.98%]"></div>
                          </div>
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-bold text-slate-500">LATENCY (GLOBAL)</span>
                             <span className="text-sm font-black text-indigo-500">42ms</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 w-[12%]"></div>
                          </div>
                       </div>
                    </div>
                    <div className="bg-indigo-600 p-6 rounded shadow text-white flex flex-col justify-between h-[150px] relative overflow-hidden">
                       <div className="absolute top-[-20%] right-[-10%] opacity-20"><DollarSign size={120} /></div>
                       <div className="relative z-10">
                          <p className="text-[9px] font-black uppercase tracking-widest">Calculated Gross Revenue</p>
                          <h2 className="text-3xl font-black mt-1">UGX 12.4M</h2>
                          <p className="text-[8px] font-bold uppercase mt-4 opacity-75">+18% Monthly Growth Velocity</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'User Management' && (
            <div className="space-y-6 animate-in fade-in">
               <AdminLTECard 
                  title="User Node Directory" 
                  icon={<Users size={16}/>}
                  tools={
                    <div className="relative">
                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12}/>
                       <input 
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         placeholder="Query Node..." 
                         className="bg-black/5 dark:bg-white/5 border dark:border-[#4b545c] rounded px-6 py-1 text-[10px] outline-none" 
                       />
                    </div>
                  }
               >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase text-slate-500">
                        <tr>
                          <th className="p-4">Identity</th>
                          <th className="p-4">Wing</th>
                          <th className="p-4">Tier</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#4b545c]">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                               <div className="relative">
                                  <img src={u.avatar} className="w-8 h-8 rounded-full border dark:border-white/10" />
                                  {u.verified && (
                                     <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#343a40] rounded-full p-0.5">
                                        <AuthoritySeal role="Official" size={10} />
                                     </div>
                                  )}
                               </div>
                               <div>
                                  <p className="font-black uppercase flex items-center gap-1.5">
                                     {u.name}
                                     {u.verified && <CheckCircle size={10} className="text-indigo-500" />}
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-bold">{u.email || 'node@unverified.net'}</p>
                               </div>
                            </td>
                            <td className="p-4 font-bold">{u.college}</td>
                            <td className="p-4">
                               <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${u.subscriptionTier === 'Pro' ? 'bg-indigo-100 text-indigo-600' : u.subscriptionTier === 'Enterprise' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {u.subscriptionTier}
                               </span>
                            </td>
                            <td className="p-4">
                               <div className="flex items-center gap-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${u.accountStatus === 'Suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                  <span className="text-[10px]">{u.accountStatus || 'Stable'}</span>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-2">
                                  <button 
                                     onClick={() => handleToggleVerification(u.id)}
                                     className={`p-1.5 rounded transition-all ${u.verified ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-400'}`} 
                                     title={u.verified ? "Verified Identity" : "Initialize Verification Protocol"}
                                  >
                                     <ShieldCheck size={14}/>
                                  </button>
                                  <button className="p-1.5 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-400" title="Modify Permissions"><Edit3 size={14}/></button>
                                  <button className="p-1.5 hover:bg-rose-600 hover:text-white rounded transition-all text-slate-400" title="Decommission Node"><Ban size={14}/></button>
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

          {activeTab === 'Moderation' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AdminLTECard title="Flagged Content Queue" icon={<ShieldAlert size={16}/>} headerColor="border-rose-500">
                     <div className="space-y-4">
                        {flagged.map(item => (
                          <div key={item.id} className="p-4 bg-[var(--bg-secondary)] border dark:border-[#4b545c] rounded space-y-3">
                             <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                   <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-rose-500 text-white rounded">{item.contentType}</span>
                                   <span className="text-[10px] font-bold text-slate-400">{item.timestamp}</span>
                                </div>
                                <span className="text-[9px] font-black text-rose-500 uppercase">{item.reason}</span>
                             </div>
                             <p className="text-xs text-slate-500 italic">"{item.contentPreview}"</p>
                             <div className="flex justify-between items-center pt-2 border-t dark:border-white/5">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Reported By: {item.reportedBy}</span>
                                <div className="flex gap-2">
                                   <button className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase rounded">Dismiss</button>
                                   <button className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase rounded">Purge</button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </AdminLTECard>

                  <AdminLTECard title="Safety Trends" icon={<BarChart3 size={16}/>} headerColor="border-amber-500">
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={ANALYTICS}>
                           <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                           <YAxis fontSize={10} axisLine={false} tickLine={false} />
                           <Tooltip />
                           <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} />
                        </LineChart>
                     </ResponsiveContainer>
                     <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded">
                        <h5 className="text-[10px] font-black uppercase flex items-center gap-2 mb-2">
                           <AlertTriangle size={14} className="text-amber-500"/> Neural Guard Insights
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                           "Automated sentiment analysis detected a 12% rise in aggressive nodes within the CEDAT wing. Enhanced scanning protocol recommended."
                        </p>
                     </div>
                  </AdminLTECard>
               </div>
            </div>
          )}

          {activeTab === 'ADs Management' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {ads.map(ad => (
                      <div key={ad.id} className="bg-white dark:bg-[#343a40] p-6 rounded shadow border dark:border-[#4b545c] space-y-4">
                         <div className="flex justify-between items-start">
                            <h4 className="text-sm font-black uppercase tracking-tight">{ad.clientName}</h4>
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded">{ad.status}</span>
                         </div>
                         <p className="text-xs text-slate-500 font-bold">{ad.title}</p>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[8px] font-black text-slate-400 uppercase">REACH</p>
                               <p className="text-sm font-black">{(ad.reach / 1000).toFixed(1)}k</p>
                            </div>
                            <div>
                               <p className="text-[8px] font-black text-slate-400 uppercase">CLICKS</p>
                               <p className="text-sm font-black">{ad.clicks}</p>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-black">
                               <span className="text-slate-400">BUDGET CONSUMPTION</span>
                               <span>{Math.round((ad.spent/ad.budget)*100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600" style={{ width: `${(ad.spent/ad.budget)*100}%` }}></div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <AdminLTECard title="Global Ad Performance Manifest" icon={<TrendingUp size={16}/>}>
                   <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ads}>
                         <XAxis dataKey="clientName" fontSize={10} axisLine={false} tickLine={false}/>
                         <YAxis fontSize={10} axisLine={false} tickLine={false}/>
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="reach" fill="#6366f1" radius={[4,4,0,0]} name="Network Reach" />
                         <Bar dataKey="clicks" fill="#10b981" radius={[4,4,0,0]} name="Interaction Clicks" />
                      </BarChart>
                   </ResponsiveContainer>
                </AdminLTECard>
             </div>
          )}

          {activeTab === 'Subscribers Revenue' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-8 h-[400px]">
                      <AdminLTECard title="Financial Flow Matrix (UGX)" icon={<DollarSign size={16}/>} headerColor="border-emerald-500">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={REVENUE_HISTORY}>
                               <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                               <YAxis fontSize={10} axisLine={false} tickLine={false} />
                               <Tooltip />
                               <Legend />
                               <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} />
                               <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                            </LineChart>
                         </ResponsiveContainer>
                      </AdminLTECard>
                   </div>
                   <div className="lg:col-span-4 h-[400px]">
                      <AdminLTECard title="Revenue Distribution by Tier" icon={<PieChartIcon size={16}/>}>
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                 data={[
                                    { name: 'Pro Strata', value: subscribers.filter(s => s.subscriptionTier === 'Pro').length },
                                    { name: 'Enterprise Strata', value: subscribers.filter(s => s.subscriptionTier === 'Enterprise').length },
                                 ]}
                                 innerRadius="60%"
                                 outerRadius="90%"
                                 paddingAngle={5}
                                 dataKey="value"
                               >
                                  {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                               </Pie>
                               <Tooltip />
                               <Legend verticalAlign="bottom"/>
                            </PieChart>
                         </ResponsiveContainer>
                      </AdminLTECard>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'System Logs' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="bg-[#1e1e1e] text-[#d4d4d4] font-mono p-6 rounded shadow-xl border border-[#333] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                   <div className="flex items-center gap-3 mb-6 text-indigo-400">
                      <Terminal size={20}/>
                      <h3 className="text-xs font-black uppercase tracking-widest">Administrative Audit Trail / v4.2 Stable</h3>
                   </div>
                   <div className="space-y-2 text-[10px] overflow-x-auto">
                      {auditLogs.map(log => (
                        <div key={log.id} className="flex gap-4 py-1 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                           <span className="text-slate-500">[{log.timestamp}]</span>
                           <span className={`font-bold ${log.severity === 'danger' ? 'text-rose-500' : log.severity === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {log.action.toUpperCase()}
                           </span>
                           <span className="text-indigo-400">BY: {log.admin}</span>
                           <span className="text-slate-400">TARGET: {log.target}</span>
                           <span className="ml-auto text-slate-600">AUTH: VERIFIED_TOKEN</span>
                        </div>
                      ))}
                      <div className="pt-4 flex items-center gap-2 animate-pulse">
                         <span className="w-1 h-3 bg-indigo-600"></span>
                         <span className="text-slate-500 uppercase tracking-widest">Listening for system hooks...</span>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Platform Usage Reports' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="Active Network Velocity" icon={<BarChart3 size={16}/>}>
                   <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={ANALYTICS}>
                         <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                         <YAxis fontSize={10} axisLine={false} tickLine={false} />
                         <Tooltip />
                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                         <Bar dataKey="posts" fill="#6366f1" radius={[4, 4, 0, 0]} name="Broadcasting Frequency" />
                         <Line type="monotone" dataKey="messages" stroke="#f59e0b" strokeWidth={3} name="Direct Link Syncs" />
                         <Area type="monotone" dataKey="engagement" fill="#10b981" fillOpacity={0.1} stroke="#10b981" name="User Interaction" />
                      </ComposedChart>
                   </ResponsiveContainer>
                </AdminLTECard>
             </div>
          )}

          {activeTab === 'Event Management' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="Campus Protocol Schedule" icon={<Calendar size={16}/>} headerColor="border-rose-500">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold border-collapse">
                         <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase text-slate-500">
                            <tr>
                               <th className="p-4">Protocol Identity</th>
                               <th className="p-4">Coordinate (Date)</th>
                               <th className="p-4">Synchronized Nodes</th>
                               <th className="p-4">Category</th>
                               <th className="p-4 text-center">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y dark:divide-[#4b545c]">
                            {calendarEvents.map(e => (
                               <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                  <td className="p-4 font-black uppercase text-indigo-600">{e.title}</td>
                                  <td className="p-4 font-mono text-slate-500">{e.date} @ {e.time}</td>
                                  <td className="p-4">
                                     <div className="flex items-center gap-2">
                                        <Users size={12} className="text-slate-400"/>
                                        <span>{e.attendeeIds?.length || 0} Nodes</span>
                                     </div>
                                  </td>
                                  <td className="p-4">
                                     <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded uppercase text-[9px]">
                                        {e.category}
                                     </span>
                                  </td>
                                  <td className="p-4 text-center">
                                     <button className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase rounded shadow-sm">View Manifest</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </AdminLTECard>
             </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
