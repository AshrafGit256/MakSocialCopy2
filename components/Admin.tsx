
import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { User, Post, Resource, Ad, CalendarEvent, SubscriptionTier, College } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Settings, Menu, Bell, 
  LogOut, Image as ImageIcon, Edit3, CheckCircle, 
  Ban, UserCheck, HardDrive, Search,
  Megaphone, TrendingUp, Download, PieChart as PieChartIcon,
  CreditCard, UserPlus, Share2, ChevronRight, MapPin, 
  CalendarDays, Rocket, ChevronLeft, Filter, RefreshCcw
} from 'lucide-react';

interface AdminProps {
  onLogout?: () => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminLTECard: React.FC<{ 
  title: string, 
  icon: React.ReactNode, 
  headerColor?: string, 
  children: React.ReactNode,
  tools?: React.ReactNode
}> = ({ title, icon, headerColor = 'border-indigo-500', children, tools }) => (
  <div className={`bg-white dark:bg-[#343a40] shadow-md border-t-4 ${headerColor} rounded overflow-hidden`}>
    <div className="px-4 py-3 border-b dark:border-[#4b545c] flex justify-between items-center">
      <h3 className="text-sm font-bold flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="flex items-center gap-2">
        {tools}
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
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

  const handleRepostEvent = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `promo-${Date.now()}`,
      author: 'ADMIN BROADCAST',
      authorId: 'super_admin',
      authorRole: 'System Administrator',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      authorAuthority: 'Super Admin',
      timestamp: 'Just now',
      content: `[REPOSTED EVENT] ${event.title}: ${event.description}`,
      isEventBroadcast: true,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventId: event.id,
      college: 'Global',
      isAd: true,
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 1,
      flags: [],
      isOpportunity: false,
      hashtags: ['#AdminPromo', '#MakerereEvents']
    };
    db.addPost(broadcast);
    alert("Event synchronized to global feed successfully.");
  };

  const handleGenerateReport = (type: string) => {
    alert(`Initializing ${type} report generation protocol... PDF compiling.`);
  };

  const handleTierUpgrade = (userId: string, tier: SubscriptionTier) => {
    const updated = users.map(u => u.id === userId ? { ...u, subscriptionTier: tier } : u);
    db.saveUsers(updated);
    setUsers(updated);
    alert(`User access level modified to ${tier}.`);
  };

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');

  // Calendar Logic for "Admin Roadmap"
  const renderRoadmapCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`pad-${i}`} className="h-24 bg-slate-50 dark:bg-black/10 border dark:border-[#4b545c] opacity-50"></div>);
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = calendarEvents.filter(e => e.date === dateStr);
      const dayAds = ads.filter(a => a.deadline === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} className={`h-24 border dark:border-[#4b545c] p-1 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${isToday ? 'bg-indigo-100/50 dark:bg-indigo-900/20' : ''}`}>
          <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
            {dayEvents.map(e => (
              <div key={e.id} className="bg-emerald-500 text-white text-[7px] font-black p-1 rounded uppercase truncate" title={e.title}>Event: {e.title}</div>
            ))}
            {dayAds.map(a => (
              <div key={a.id} className="bg-rose-500 text-white text-[7px] font-black p-1 rounded uppercase truncate" title={a.title}>Ad End: {a.clientName}</div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] dark:bg-[#454d55] text-slate-800 dark:text-white font-sans overflow-hidden">
      {/* AdminLTE Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0 bg-[#343a40]">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light text-xs opacity-50">v3.1</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
              { id: 'subscribers', label: 'Subscribers', icon: <UserPlus size={20}/> },
              { id: 'events', label: 'Event Registry', icon: <Calendar size={20}/> },
              { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone size={20}/> },
              { id: 'revenue', label: 'Financials', icon: <DollarSign size={20}/> },
              { id: 'calendar', label: 'Admin Roadmap', icon: <CalendarDays size={20}/> },
              { id: 'academic', label: 'Resource Vault', icon: <HardDrive size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-3 rounded transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onLogout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2">
              <LogOut size={16}/> {!isSidebarCollapsed && "Terminal Exit"}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#343a40] dark:border-[#4b545c] border-b shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:block">Main Registry / <span className="text-indigo-600">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => handleGenerateReport('System')} className="bg-[#17a2b8] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 hover:brightness-110">
                   <Download size={14}/> Report
                </button>
             </div>
             <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>
             <div className="relative cursor-pointer">
                <Bell size={20} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">4</span>
             </div>
             <div className="flex items-center gap-2 ml-2">
                <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full border dark:border-white/10" />
                <span className="text-xs font-bold hidden lg:block">Admin User</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* AdminLTE Info-Boxes */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Platform Population', val: users.length, icon: <Users size={24}/>, bg: 'bg-[#17a2b8]' },
                    { label: 'Total Subscribers', val: subscribers.length, icon: <UserPlus size={24}/>, bg: 'bg-[#28a745]' },
                    { label: 'Revenue (UGX)', val: '8.9M', icon: <DollarSign size={24}/>, bg: 'bg-[#ffc107]', text: 'text-slate-900' },
                    { label: 'Pending Ad Logs', val: ads.filter(a => a.status === 'Pending').length, icon: <Activity size={24}/>, bg: 'bg-[#dc3545]' },
                  ].map((box, i) => (
                    <div key={i} className="bg-white dark:bg-[#343a40] shadow rounded flex items-stretch overflow-hidden h-20">
                      <div className={`${box.bg} w-1/3 flex items-center justify-center text-white`}>{box.icon}</div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                         <span className="text-[10px] font-bold uppercase text-slate-400">{box.label}</span>
                         <span className="text-xl font-black">{box.val}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AdminLTECard title="Monthly Subscription Growth" icon={<TrendingUp size={16}/>} headerColor="border-indigo-500">
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={REVENUE_HISTORY}>
                              <defs>
                                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                              <XAxis dataKey="month" fontSize={10} axisLine={false} />
                              <YAxis fontSize={10} axisLine={false} />
                              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                              <Area type="monotone" dataKey="subscribers" stroke="#6366f1" fillOpacity={1} fill="url(#colorSub)" strokeWidth={3} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </AdminLTECard>

                  <AdminLTECard title="Global Content Distribution" icon={<PieChartIcon size={16}/>} headerColor="border-emerald-500">
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[
                                    { name: 'Research', value: resources.filter(r => r.category === 'Research').length + 5 },
                                    { name: 'Exams', value: resources.filter(r => r.category === 'Past Paper').length + 12 },
                                    { name: 'Social', value: calendarEvents.length + 8 },
                                    { name: 'Other', value: 4 },
                                 ]}
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" iconType="circle" />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </AdminLTECard>
               </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
             <AdminLTECard title="Platform Subscriber Base" icon={<UserPlus size={16}/>} headerColor="border-indigo-500">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] uppercase tracking-wider">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c]">
                         <tr>
                            <th className="p-4">Subscriber</th>
                            <th className="p-4">Wing</th>
                            <th className="p-4">Access Tier</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Modify Level</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#4b545c]">
                         {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                               <td className="p-4 flex items-center gap-3">
                                  <img src={u.avatar} className="w-10 h-10 rounded border dark:border-white/10" />
                                  <div>
                                     <p className="font-bold">{u.name}</p>
                                     <p className="text-[9px] text-slate-400 lowercase">{u.email}</p>
                                  </div>
                               </td>
                               <td className="p-4 font-bold text-indigo-500">{u.college}</td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[8px] font-black text-white ${u.subscriptionTier === 'Free' ? 'bg-slate-400' : u.subscriptionTier === 'Pro' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                                     {u.subscriptionTier}
                                  </span>
                               </td>
                               <td className="p-4">
                                  <span className="text-emerald-500 flex items-center gap-1 font-bold"><CheckCircle size={12}/> Online</span>
                               </td>
                               <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                     <button onClick={() => handleTierUpgrade(u.id, 'Pro')} className="p-2 bg-indigo-500/10 text-indigo-500 rounded hover:bg-indigo-600 hover:text-white transition-all"><Rocket size={14}/></button>
                                     <button onClick={() => handleTierUpgrade(u.id, 'Free')} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-600 hover:text-white transition-all"><X size={14}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </AdminLTECard>
          )}

          {activeTab === 'events' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black uppercase tracking-tight">University Event Registry</h3>
                   <button className="bg-indigo-600 text-white px-5 py-2 rounded text-[10px] font-bold uppercase shadow-lg shadow-indigo-600/20 hover:brightness-110 flex items-center gap-2">
                      <Plus size={16}/> Register External Event
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {calendarEvents.map(ev => (
                      <div key={ev.id} className="bg-white dark:bg-[#343a40] rounded shadow-sm border dark:border-[#4b545c] flex flex-col group transition-all hover:shadow-xl">
                         <div className="h-32 relative overflow-hidden">
                            <img src={ev.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="absolute top-2 right-2 flex gap-1">
                               <button onClick={() => handleRepostEvent(ev)} className="p-2 bg-indigo-600 text-white rounded shadow-xl" title="Repost to Global Feed"><Share2 size={12}/></button>
                            </div>
                         </div>
                         <div className="p-4 flex-1">
                            <h4 className="font-black text-sm uppercase truncate">{ev.title}</h4>
                            <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase mt-2">
                               <span className="flex items-center gap-1"><Calendar size={12}/> {ev.date}</span>
                               <span className="flex items-center gap-1"><MapPin size={12}/> {ev.location}</span>
                            </div>
                         </div>
                         <div className="bg-slate-50 dark:bg-white/5 p-3 flex gap-2">
                            <button className="flex-1 py-1.5 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-bold uppercase">Modify</button>
                            <button onClick={() => {if(confirm("Purge Event?")) db.deleteCalendarEvent(ev.id); setCalendarEvents(db.getCalendarEvents()); }} className="p-1.5 bg-rose-500/10 text-rose-500 rounded"><Trash2 size={12}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'ads' && (
             <AdminLTECard title="Marketing Campaign Manager" icon={<Megaphone size={16}/>} headerColor="border-rose-500" tools={<button className="bg-rose-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase">Create Add</button>}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {ads.map(ad => (
                      <div key={ad.id} className="p-5 border dark:border-[#4b545c] rounded-xl space-y-4 bg-slate-50/50 dark:bg-white/5">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-lg font-black leading-none uppercase">{ad.clientName}</h4>
                               <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{ad.title}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${ad.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{ad.status}</span>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-bold uppercase">
                               <span className="text-slate-400">Campaign Reach</span>
                               <span>{ad.reach.toLocaleString()} Impressions</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-rose-500" style={{ width: `${(ad.spent / ad.budget) * 100}%` }}></div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase pt-2 border-t dark:border-white/5">
                            <span className="text-slate-400">Ends: {ad.deadline}</span>
                            <button className="text-indigo-600">Audit Logs</button>
                         </div>
                      </div>
                   ))}
                </div>
             </AdminLTECard>
          )}

          {activeTab === 'calendar' && (
             <AdminLTECard 
                title="System Roadmap & Termination Logic" 
                icon={<CalendarDays size={16}/>} 
                headerColor="border-amber-500"
                tools={
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded"><ChevronLeft size={16}/></button>
                    <span className="text-[10px] font-black uppercase">{currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded"><ChevronRight size={16}/></button>
                  </div>
                }
             >
                <div className="grid grid-cols-7 text-center text-[9px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 border-l border-t dark:border-[#4b545c]">
                   {renderRoadmapCalendar()}
                </div>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-emerald-500 rounded"></div> Global Events</div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-rose-500 rounded"></div> Ad Deadlines</div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Node Maintenance</div>
                </div>
             </AdminLTECard>
          )}

          {activeTab === 'revenue' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-[#28a745] p-5 rounded text-white shadow relative overflow-hidden group">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Net Operating Margin</p>
                      <h3 className="text-3xl font-black mt-2">UGX 8.92M</h3>
                      <div className="absolute top-2 right-2 opacity-20"><CreditCard size={48}/></div>
                   </div>
                   <div className="bg-[#17a2b8] p-5 rounded text-white shadow relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Burn Rate (Logistics)</p>
                      <h3 className="text-3xl font-black mt-2">UGX 2.4M</h3>
                      <div className="absolute top-2 right-2 opacity-20"><Activity size={48}/></div>
                   </div>
                   <div className="bg-[#ffc107] p-5 rounded text-slate-900 shadow relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Subscriber ARPU</p>
                      <h3 className="text-3xl font-black mt-2">UGX 32.5K</h3>
                      <div className="absolute top-2 right-2 opacity-20"><TrendingUp size={48}/></div>
                   </div>
                </div>

                <AdminLTECard title="Consolidated Financial Matrix" icon={<BarChart2 size={16}/>}>
                   <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={REVENUE_HISTORY}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                            <XAxis dataKey="month" fontSize={10} axisLine={false} />
                            <YAxis fontSize={10} axisLine={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" barSize={30} fill="#6366f1" name="Gross Revenue" radius={[4,4,0,0]} />
                            <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} name="Operating Costs" dot={{r: 4}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </AdminLTECard>
             </div>
          )}

          {activeTab === 'academic' && (
             <AdminLTECard title="Global Academic Resource Lab" icon={<HardDrive size={16}/>} tools={<button onClick={() => handleGenerateReport('Inventory')} className="bg-emerald-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase flex items-center gap-1"><Download size={10}/> Inventory Report</button>}>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] uppercase tracking-wider">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c]">
                         <tr>
                            <th className="p-4">Resource Identity</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Source Hub</th>
                            <th className="p-4">Usage Logs</th>
                            <th className="p-4 text-center">Audit</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#4b545c]">
                         {resources.map(res => (
                            <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                               <td className="p-4 flex items-center gap-3">
                                  <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded"><FileText size={18}/></div>
                                  <div>
                                     <p className="font-bold">{res.title}</p>
                                     <p className="text-[9px] text-slate-400 lowercase">{res.course}</p>
                                  </div>
                               </td>
                               <td className="p-4"><span className="text-amber-500 font-bold">{res.category}</span></td>
                               <td className="p-4 font-bold">{res.college}</td>
                               <td className="p-4 text-slate-400">{res.downloads} Scans</td>
                               <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                     <button className="p-2 bg-indigo-500/10 text-indigo-500 rounded hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={14}/></button>
                                     <button onClick={() => {if(confirm("Purge Asset?")) db.deleteResource(res.id); setResources(db.getResources()); }} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </AdminLTECard>
          )}

        </main>
      </div>
    </div>
  );
};

const BarChart2 = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

export default Admin;
