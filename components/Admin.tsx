import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource } from '../types';
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
  MousePointer2, Clock, Globe
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

type AdminTab = 'Event Management' | 'ADs Management' | 'Subscribers Revenue' | 'Platform Usage Reports' | 'Vault Control';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Platform Usage Reports');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setAds(db.getAds());
      setCalendarEvents(db.getCalendarEvents());
      setResources(db.getResources());
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] dark:bg-[#454d55] text-slate-800 dark:text-white font-sans overflow-hidden">
      {/* Sidebar - AdminLTE v3 Style */}
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
              { id: 'Platform Usage Reports', label: 'Usage Reports', icon: <BarChart3 size={20}/> },
              { id: 'Event Management', label: 'Event Mgmt', icon: <Calendar size={20}/> },
              { id: 'ADs Management', label: 'ADs Mgmt', icon: <Megaphone size={20}/> },
              { id: 'Subscribers Revenue', label: 'Sub Revenue', icon: <Users size={20}/> },
              { id: 'Vault Control', label: 'Vault Control', icon: <HardDrive size={20}/> },
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
              <LogOut size={16}/> {!isSidebarCollapsed && "Logout Terminal"}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#343a40] dark:border-[#4b545c] border-b shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Control Panel / <span className="text-indigo-600">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="relative">
                <Bell size={18} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">7</span>
             </div>
             <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full border dark:border-white/10" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar pb-20 bg-[#f4f6f9] dark:bg-[#454d55]">
          
          {activeTab === 'Platform Usage Reports' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Users', val: users.length, icon: <Users size={20}/>, bg: 'bg-[#17a2b8]' },
                    { label: 'Total Posts', val: db.getPosts().length, icon: <Activity size={20}/>, bg: 'bg-[#28a745]' },
                    { label: 'Total Downloads', val: resources.reduce((acc, r) => acc + r.downloads, 0), icon: <Download size={20}/>, bg: 'bg-[#ffc107]' },
                    { label: 'System Uptime', val: '99.98%', icon: <Clock size={20}/>, bg: 'bg-[#dc3545]' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#343a40] shadow rounded flex items-stretch overflow-hidden h-20 border border-black/5">
                      <div className={`${stat.bg} w-16 flex items-center justify-center text-white shrink-0`}>{stat.icon}</div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                         <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</span>
                         <span className="text-lg font-black">{stat.val}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[350px]">
                    <AdminLTECard title="Traffic Engagement Trends" icon={<BarChart3 size={16}/>} headerColor="border-indigo-500">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ANALYTICS}>
                             <defs>
                               <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                             <Area type="monotone" dataKey="engagement" stroke="#6366f1" fillOpacity={1} fill="url(#colorEngagement)" strokeWidth={3} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </AdminLTECard>
                  </div>
                  <div className="h-[350px]">
                    <AdminLTECard title="Active Session Metrics" icon={<TrendingUp size={16}/>} headerColor="border-emerald-500">
                       <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={ANALYTICS}>
                             <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                             <YAxis fontSize={10} axisLine={false} tickLine={false} />
                             <Tooltip />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                             <Bar dataKey="activeUsers" fill="#10b981" radius={[4, 4, 0, 0]} />
                             <Line type="monotone" dataKey="posts" stroke="#f59e0b" strokeWidth={3} />
                          </ComposedChart>
                       </ResponsiveContainer>
                    </AdminLTECard>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Event Management' && (
            <div className="space-y-6 animate-in fade-in">
               <AdminLTECard 
                  title="Campus Event Registry" 
                  icon={<Calendar size={16}/>} 
                  headerColor="border-rose-500" 
                  tools={<button onClick={() => alert('Init Event UI')} className="bg-emerald-500 text-white px-3 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1"><Plus size={14}/> Create</button>}
               >
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-[11px] font-bold min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                           <tr>
                              <th className="p-4">Title</th>
                              <th className="p-4">Schedule</th>
                              <th className="p-4">Type</th>
                              <th className="p-4">Attendees</th>
                              <th className="p-4 text-center">Protocol</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-[#4b545c]">
                           {calendarEvents.map(e => (
                              <tr key={e.id}>
                                 <td className="p-4">{e.title}</td>
                                 <td className="p-4 text-slate-500">{e.date}</td>
                                 <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[9px] uppercase">{e.category}</span></td>
                                 <td className="p-4">{e.attendeeIds?.length || 0}</td>
                                 <td className="p-4 flex items-center justify-center gap-2">
                                    <button className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/5 rounded"><Edit3 size={14}/></button>
                                    <button className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded"><Trash2 size={14}/></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </AdminLTECard>
            </div>
          )}

          {activeTab === 'ADs Management' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="Ad Intelligence Engine" icon={<Megaphone size={16}/>} headerColor="border-amber-500">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold min-w-[700px]">
                         <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                            <tr>
                               <th className="p-4">Client Node</th>
                               <th className="p-4">Total Reach</th>
                               <th className="p-4">Budget</th>
                               <th className="p-4">Consumption</th>
                               <th className="p-4">Status</th>
                               <th className="p-4 text-center">Config</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y dark:divide-[#4b545c]">
                            {ads.map(ad => (
                               <tr key={ad.id}>
                                  <td className="p-4 font-black">{ad.clientName}</td>
                                  <td className="p-4 text-indigo-600">{(ad.reach / 1000).toFixed(1)}k Nodes</td>
                                  <td className="p-4">UGX {ad.budget.toLocaleString()}</td>
                                  <td className="p-4 text-rose-500">UGX {ad.spent.toLocaleString()}</td>
                                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] uppercase ${ad.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span></td>
                                  <td className="p-4 flex items-center justify-center gap-2">
                                     <button className="p-1.5 text-slate-500 hover:text-indigo-600"><Settings size={14}/></button>
                                     <button className="p-1.5 text-slate-500 hover:text-rose-500"><Trash2 size={14}/></button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </AdminLTECard>
             </div>
          )}

          {activeTab === 'Subscribers Revenue' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-8 h-[400px]">
                      <AdminLTECard title="Financial Flow Matrix" icon={<DollarSign size={16}/>} headerColor="border-emerald-500">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_HISTORY}>
                               <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                               <YAxis fontSize={10} axisLine={false} tickLine={false} />
                               <Tooltip />
                               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                               <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                               <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                               <Legend />
                            </AreaChart>
                         </ResponsiveContainer>
                      </AdminLTECard>
                   </div>
                   <div className="lg:col-span-4 space-y-4">
                      <div className="bg-emerald-600 p-6 rounded shadow text-white flex flex-col justify-between h-[190px] relative overflow-hidden">
                         <div className="absolute top-[-20%] right-[-10%] opacity-20"><DollarSign size={150} /></div>
                         <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest">Calculated Net Profit</span>
                            <h2 className="text-3xl font-black tracking-tighter mt-2">UGX 12.4M</h2>
                            <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-4">+18.2% Since Sequence Alpha</p>
                         </div>
                      </div>
                      <div className="bg-[#343a40] p-6 rounded shadow text-white flex flex-col justify-between h-[190px]">
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Subscribers</span>
                            <h2 className="text-3xl font-black tracking-tighter mt-2">{subscribers.length} Nodes</h2>
                            <div className="flex -space-x-2 mt-4">
                               {subscribers.slice(0, 5).map(s => <img key={s.id} src={s.avatar} className="w-6 h-6 rounded-full border-2 border-[#343a40]" />)}
                               {subscribers.length > 5 && <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-[#343a40] flex items-center justify-center text-[8px]">+{subscribers.length - 5}</div>}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Vault Control' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="Academic Resource Repository" icon={<HardDrive size={16}/>} headerColor="border-indigo-500">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold min-w-[600px]">
                         <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                            <tr>
                               <th className="p-4">Resource Log</th>
                               <th className="p-4">Sector</th>
                               <th className="p-4">Uplinks</th>
                               <th className="p-4 text-center">Audit</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y dark:divide-[#4b545c]">
                            {resources.map(res => (
                               <tr key={res.id}>
                                  <td className="p-4">
                                     <p className="font-black uppercase">{res.title}</p>
                                     <p className="text-[9px] text-slate-500 uppercase">{res.course}</p>
                                  </td>
                                  <td className="p-4 text-indigo-600 uppercase">{res.college}</td>
                                  <td className="p-4">{res.downloads.toLocaleString()} Syncs</td>
                                  <td className="p-4 flex items-center justify-center gap-2">
                                     <button className="p-1.5 text-slate-500 hover:text-indigo-600"><Eye size={14}/></button>
                                     <button className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded"><Trash2 size={14}/></button>
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