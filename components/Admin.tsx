import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY, COURSES_BY_COLLEGE } from '../db';
import { ANALYTICS } from '../constants';
import { User, Post, Resource, Ad, CalendarEvent, SubscriptionTier, College, ResourceType } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Users, Activity, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Settings, Menu, Bell, 
  LogOut, Image as ImageIcon, Edit3, CheckCircle, 
  HardDrive, Search, Megaphone, TrendingUp, Download, 
  PieChart as PieChartIcon, CreditCard, UserPlus, Share2, 
  ChevronRight, MapPin, CalendarDays, Rocket, ChevronLeft, 
  Filter, RefreshCcw, FilePlus, Eye, Clock, List, BarChart3
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

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscribers' | 'events' | 'ads' | 'revenue' | 'calendar' | 'academic'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

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

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report... PDF compilation initialized. Download starting shortly.`);
  };

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');

  const renderRoadmapCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`pad-${i}`} className="h-16 md:h-24 bg-slate-50 dark:bg-black/5 border dark:border-[#4b545c] opacity-50"></div>);
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = calendarEvents.filter(e => e.date === dateStr);
      const dayAds = ads.filter(a => a.deadline === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} className={`h-16 md:h-24 border dark:border-[#4b545c] p-1 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${isToday ? 'bg-indigo-100/30 dark:bg-indigo-900/20' : ''}`}>
          <span className={`text-[8px] md:text-[10px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5">
            {dayEvents.map(e => (
              <div key={e.id} className="bg-emerald-500 text-white text-[5px] md:text-[6px] font-black p-0.5 rounded uppercase truncate">EVT</div>
            ))}
            {dayAds.map(a => (
              <div key={a.id} className="bg-rose-500 text-white text-[5px] md:text-[6px] font-black p-0.5 rounded uppercase truncate">AD</div>
            ))}
          </div>
        </div>
      );
    }
    return days;
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
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
              { id: 'subscribers', label: 'Subscriber Rev.', icon: <Users size={20}/> },
              { id: 'events', label: 'Event Mgmt.', icon: <Calendar size={20}/> },
              { id: 'ads', label: 'ADs Mgmt.', icon: <Megaphone size={20}/> },
              { id: 'revenue', label: 'Financials', icon: <DollarSign size={20}/> },
              { id: 'calendar', label: 'Roadmap', icon: <CalendarDays size={20}/> },
              { id: 'academic', label: 'Vault Control', icon: <HardDrive size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button onClick={() => { setActiveTab(item.id as any); if(window.innerWidth < 1024) setIsSidebarCollapsed(true); }} className={`w-full flex items-center px-3 py-3 rounded transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}>
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onLogout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all">
              <LogOut size={16}/> {!isSidebarCollapsed && "Terminate Session"}
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#343a40] dark:border-[#4b545c] border-b shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Control Panel / <span className="text-indigo-600">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="relative">
                <Bell size={18} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">4</span>
             </div>
             <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full border dark:border-white/10" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar pb-20">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Platform Users', val: users.length, icon: <Users size={24}/>, bg: 'bg-[#17a2b8]' },
                    { label: 'Subscribed', val: subscribers.length, icon: <Zap size={24}/>, bg: 'bg-[#28a745]' },
                    { label: 'Monthly Growth', val: '+12.5%', icon: <TrendingUp size={24}/>, bg: 'bg-[#ffc107]' },
                    { label: 'System Health', val: '99.9%', icon: <Activity size={24}/>, bg: 'bg-[#dc3545]' },
                  ].map((box, i) => (
                    <div key={i} className="bg-white dark:bg-[#343a40] shadow rounded flex items-stretch overflow-hidden h-24 border border-black/5 transition-transform hover:translate-y-[-2px] cursor-pointer">
                      <div className={`${box.bg} w-16 md:w-24 flex items-center justify-center text-white shrink-0`}>{box.icon}</div>
                      <div className="flex-1 p-3 md:p-4 flex flex-col justify-center min-w-0">
                         <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] truncate">{box.label}</span>
                         <span className="text-xl md:text-2xl font-black tracking-tight">{box.val}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[350px]">
                    <AdminLTECard title="Platform Usage Report" icon={<BarChart3 size={16}/>} headerColor="border-indigo-500">
                       <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={ANALYTICS}>
                             <XAxis dataKey="day" fontSize={10} axisLine={false} />
                             <YAxis fontSize={10} axisLine={false} />
                             <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                             <Bar dataKey="posts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                             <Line type="monotone" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={3} />
                          </ComposedChart>
                       </ResponsiveContainer>
                    </AdminLTECard>
                  </div>
                  <div className="h-[350px]">
                    <AdminLTECard title="Engagement Metrics" icon={<TrendingUp size={16}/>} headerColor="border-emerald-500">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={ANALYTICS}>
                             <XAxis dataKey="day" fontSize={10} axisLine={false} />
                             <YAxis fontSize={10} axisLine={false} />
                             <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                             <Line type="step" dataKey="messages" stroke="#10b981" strokeWidth={2} dot={false} />
                             <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2} />
                          </LineChart>
                       </ResponsiveContainer>
                    </AdminLTECard>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                     <AdminLTECard title="Subscription Registry" icon={<Users size={16}/>} headerColor="border-indigo-500">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left text-[11px] font-bold min-w-[500px]">
                              <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                                 <tr>
                                    <th className="p-4">Subscriber</th>
                                    <th className="p-4">Wing</th>
                                    <th className="p-4">Tier</th>
                                    <th className="p-4">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y dark:divide-[#4b545c]">
                                 {subscribers.map(u => (
                                    <tr key={u.id}>
                                       <td className="p-4 flex items-center gap-3">
                                          <img src={u.avatar} className="w-8 h-8 rounded border dark:border-white/10" />
                                          <span>{u.name}</span>
                                       </td>
                                       <td className="p-4">{u.college}</td>
                                       <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[9px] uppercase">{u.subscriptionTier}</span></td>
                                       <td className="p-4"><span className="text-emerald-500">● Active</span></td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </AdminLTECard>
                  </div>
                  <div className="lg:col-span-4 h-[350px]">
                     <AdminLTECard title="Revenue Distribution" icon={<PieChartIcon size={16}/>} headerColor="border-amber-500">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[
                                    { name: 'Pro', value: subscribers.filter(s => s.subscriptionTier === 'Pro').length },
                                    { name: 'Enterprise', value: subscribers.filter(s => s.subscriptionTier === 'Enterprise').length },
                                 ]}
                                 innerRadius="50%"
                                 outerRadius="80%"
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                              </Pie>
                              <Tooltip />
                              <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                     </AdminLTECard>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in">
               <AdminLTECard title="Event Management Console" icon={<Calendar size={16}/>} headerColor="border-rose-500" tools={<button onClick={() => alert('Add Event Initialized')} className="bg-emerald-500 text-white px-3 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1"><Plus size={14}/> Add New</button>}>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-[11px] font-bold min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                           <tr>
                              <th className="p-4">Title</th>
                              <th className="p-4">Date</th>
                              <th className="p-4">Category</th>
                              <th className="p-4">Attendees</th>
                              <th className="p-4 text-center">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-[#4b545c]">
                           {calendarEvents.map(e => (
                              <tr key={e.id}>
                                 <td className="p-4">{e.title}</td>
                                 <td className="p-4">{e.date}</td>
                                 <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] uppercase">{e.category}</span></td>
                                 <td className="p-4">{e.attendeeIds?.length || 0}</td>
                                 <td className="p-4 flex items-center justify-center gap-2">
                                    <button className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded"><Edit3 size={14}/></button>
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

          {activeTab === 'ads' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="Ad Engine Control" icon={<Megaphone size={16}/>} headerColor="border-amber-500">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold min-w-[700px]">
                         <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                            <tr>
                               <th className="p-4">Client</th>
                               <th className="p-4">Reach</th>
                               <th className="p-4">Budget</th>
                               <th className="p-4">Spent</th>
                               <th className="p-4">Status</th>
                               <th className="p-4 text-center">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y dark:divide-[#4b545c]">
                            {ads.map(ad => (
                               <tr key={ad.id}>
                                  <td className="p-4">{ad.clientName}</td>
                                  <td className="p-4 text-indigo-600">{(ad.reach / 1000).toFixed(1)}k</td>
                                  <td className="p-4">UGX {ad.budget.toLocaleString()}</td>
                                  <td className="p-4 text-rose-500">UGX {ad.spent.toLocaleString()}</td>
                                  <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[9px] uppercase ${ad.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span></td>
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

          {activeTab === 'revenue' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-8 h-[400px]">
                      <AdminLTECard title="Revenue vs Expenses Matrix" icon={<DollarSign size={16}/>} headerColor="border-emerald-500">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_HISTORY}>
                               <XAxis dataKey="month" fontSize={10} axisLine={false} />
                               <YAxis fontSize={10} axisLine={false} />
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
                      <div className="bg-emerald-500 p-6 rounded shadow text-white flex flex-col justify-between h-[190px]">
                         <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest">Total Net Profit</span>
                            <DollarSign size={20}/>
                         </div>
                         <h2 className="text-3xl font-black tracking-tighter">UGX 12.4M</h2>
                         <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest">+18% Growth this month</p>
                      </div>
                      <div className="bg-[#343a40] p-6 rounded shadow text-white flex flex-col justify-between h-[190px]">
                         <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest">Subscriber Conversion</span>
                            <Users size={20}/>
                         </div>
                         <h2 className="text-3xl font-black tracking-tighter">42.8%</h2>
                         <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Freemium to Pro conversion rate</p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'academic' && (
             <div className="space-y-6 animate-in fade-in">
                <AdminLTECard title="The Vault: Asset Control" icon={<HardDrive size={16}/>} headerColor="border-indigo-500">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] font-bold min-w-[600px]">
                         <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c] uppercase">
                            <tr>
                               <th className="p-4">Resource</th>
                               <th className="p-4">Type</th>
                               <th className="p-4">Wing</th>
                               <th className="p-4">Scans</th>
                               <th className="p-4 text-center">Audit</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y dark:divide-[#4b545c]">
                            {resources.map(res => (
                               <tr key={res.id}>
                                  <td className="p-4 font-black">{res.title}</td>
                                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] uppercase">{res.category}</span></td>
                                  <td className="p-4 text-indigo-600">{res.college}</td>
                                  <td className="p-4">{res.downloads.toLocaleString()}</td>
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

          {activeTab === 'calendar' && (
             <AdminLTECard title="System Roadmap Control" icon={<CalendarDays size={16}/>} headerColor="border-amber-500" tools={
                <div className="flex items-center gap-2">
                   <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"><ChevronLeft size={14}/></button>
                   <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{currentCalendarDate.toLocaleString('default', { month: 'short' })} '{currentCalendarDate.getFullYear().toString().slice(2)}</span>
                   <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"><ChevronRight size={14}/></button>
                </div>
             }>
                <div className="grid grid-cols-7 text-center text-[7px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 border-l border-t dark:border-[#4b545c]">
                   {renderRoadmapCalendar()}
                </div>
             </AdminLTECard>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;