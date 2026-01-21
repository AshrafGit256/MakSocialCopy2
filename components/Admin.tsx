
import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY, COURSES_BY_COLLEGE } from '../db';
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
  Filter, RefreshCcw, FilePlus, Eye, Clock
} from 'lucide-react';

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

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscribers' | 'events' | 'ads' | 'revenue' | 'calendar' | 'academic'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Modal States
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddAd, setShowAddAd] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);

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
      content: `[OFFICIAL REPOST] ${event.title}: ${event.description}`,
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
    alert(`Generating ${type} report... PDF compilation initialized. Download starting in 5 seconds.`);
  };

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');

  // Calendar Grid Logic
  const renderRoadmapCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`pad-${i}`} className="h-24 bg-slate-50 dark:bg-black/5 border dark:border-[#4b545c] opacity-50"></div>);
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = calendarEvents.filter(e => e.date === dateStr);
      const dayAds = ads.filter(a => a.deadline === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} className={`h-24 border dark:border-[#4b545c] p-1 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${isToday ? 'bg-indigo-100/30 dark:bg-indigo-900/20' : ''}`}>
          <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5">
            {dayEvents.map(e => (
              <div key={e.id} className="bg-emerald-500 text-white text-[6px] font-black p-0.5 rounded uppercase truncate">EVT: {e.title}</div>
            ))}
            {dayAds.map(a => (
              <div key={a.id} className="bg-rose-500 text-white text-[6px] font-black p-0.5 rounded uppercase truncate">AD: {a.clientName}</div>
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
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-20' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0 bg-[#343a40]">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light text-xs opacity-50">v3.2</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
              { id: 'subscribers', label: 'Subscribers', icon: <UserPlus size={20}/> },
              { id: 'events', label: 'Events Hub', icon: <Calendar size={20}/> },
              { id: 'ads', label: 'Ad Engine', icon: <Megaphone size={20}/> },
              { id: 'revenue', label: 'Commercials', icon: <DollarSign size={20}/> },
              { id: 'calendar', label: 'System Roadmap', icon: <CalendarDays size={20}/> },
              { id: 'academic', label: 'The Vault', icon: <HardDrive size={20}/> },
            ].map(item => (
              <li key={item.id}>
                <button onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center px-3 py-3 rounded transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}>
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onLogout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all">
              <LogOut size={16}/> {!isSidebarCollapsed && "Logout Registry"}
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-[#343a40] dark:border-[#4b545c] border-b shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:block">University Control / <span className="text-indigo-600">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => handleGenerateReport(activeTab)} className="bg-[#17a2b8] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 hover:brightness-110 shadow-sm transition-all">
                <Download size={14}/> Generate {activeTab} Report
             </button>
             <div className="relative">
                <Bell size={20} className="text-slate-400" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">7</span>
             </div>
             <div className="flex items-center gap-2 ml-2">
                <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full border dark:border-white/10" />
                <span className="text-xs font-bold hidden lg:block uppercase tracking-widest">Super User</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Platform Users', val: users.length, icon: <Users size={24}/>, bg: 'bg-[#17a2b8]' },
                    { label: 'Subscribed Nodes', val: subscribers.length, icon: <Zap size={24}/>, bg: 'bg-[#28a745]' },
                    { label: 'Monthly Margin', val: 'UGX 8.92M', icon: <DollarSign size={24}/>, bg: 'bg-[#ffc107]', text: 'text-slate-900' },
                    { label: 'Ad Impressions', val: '124.5k', icon: <TrendingUp size={24}/>, bg: 'bg-[#dc3545]' },
                  ].map((box, i) => (
                    <div key={i} className="bg-white dark:bg-[#343a40] shadow rounded flex items-stretch overflow-hidden h-24 border border-black/5 transition-transform hover:translate-y-[-2px] cursor-pointer">
                      <div className={`${box.bg} w-24 flex items-center justify-center text-white`}>{box.icon}</div>
                      <div className="flex-1 p-4 flex flex-col justify-center">
                         <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{box.label}</span>
                         <span className="text-2xl font-black tracking-tight">{box.val}</span>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AdminLTECard title="Monthly Subscription Curve" icon={<TrendingUp size={16}/>} headerColor="border-indigo-500">
                     <div className="h-72">
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
                              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                              <Area type="monotone" dataKey="subscribers" stroke="#6366f1" fillOpacity={1} fill="url(#colorSub)" strokeWidth={4} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </AdminLTECard>

                  <AdminLTECard title="Revenue Distribution Matrix" icon={<PieChartIcon size={16}/>} headerColor="border-emerald-500">
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[
                                    { name: 'Ad Revenue', value: 45 },
                                    { name: 'Pro Subscriptions', value: 35 },
                                    { name: 'Enterprise Deals', value: 15 },
                                    { name: 'Marketplace Fees', value: 5 },
                                 ]}
                                 innerRadius={70}
                                 outerRadius={100}
                                 paddingAngle={8}
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
             <AdminLTECard title="Global Subscriber Directory" icon={<Users size={16}/>} headerColor="border-indigo-500">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c]">
                         <tr>
                            <th className="p-5">Node Identity</th>
                            <th className="p-5">College Wing</th>
                            <th className="p-5">Subscription Stratum</th>
                            <th className="p-5 text-center">Protocol Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#4b545c]">
                         {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                               <td className="p-5 flex items-center gap-3">
                                  <img src={u.avatar} className="w-10 h-10 rounded border dark:border-white/10" />
                                  <div>
                                     <p className="text-sm font-black">{u.name}</p>
                                     <p className="text-[9px] text-slate-400 lowercase font-medium">{u.email}</p>
                                  </div>
                               </td>
                               <td className="p-5 text-indigo-500">{u.college} Hub</td>
                               <td className="p-5">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black text-white ${u.subscriptionTier === 'Free' ? 'bg-slate-400' : u.subscriptionTier === 'Pro' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-emerald-600 shadow-lg shadow-emerald-600/20'}`}>
                                     {u.subscriptionTier} TIER
                                  </span>
                               </td>
                               <td className="p-5">
                                  <div className="flex items-center justify-center gap-2">
                                     <button className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={14}/></button>
                                     <button className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </AdminLTECard>
          )}

          {activeTab === 'calendar' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-5">
                <AdminLTECard 
                  title="System Termination & Deadline Roadmap" 
                  icon={<CalendarDays size={16}/>} 
                  headerColor="border-amber-500"
                  tools={
                    <div className="flex items-center gap-3">
                      <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={18}/></button>
                      <span className="text-[11px] font-black uppercase tracking-widest">{currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={18}/></button>
                    </div>
                  }
                >
                   <div className="grid grid-cols-7 text-center text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                   </div>
                   <div className="grid grid-cols-7 border-l border-t dark:border-[#4b545c]">
                      {renderRoadmapCalendar()}
                   </div>
                   <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-slate-50 dark:bg-black/10 rounded-2xl border dark:border-[#4b545c]">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-4 h-4 bg-emerald-500 rounded shadow-md shadow-emerald-500/20"></div> Campus Events</div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-4 h-4 bg-rose-500 rounded shadow-md shadow-rose-500/20"></div> Campaign Deadlines</div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-4 h-4 bg-indigo-500 rounded shadow-md shadow-indigo-500/20"></div> Server Maintenance</div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"><div className="w-4 h-4 bg-amber-500 rounded shadow-md shadow-amber-500/20"></div> University Exams</div>
                   </div>
                </AdminLTECard>
             </div>
          )}

          {activeTab === 'events' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black uppercase tracking-tighter">University Event Hub</h3>
                   <button onClick={() => setShowAddEvent(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                      <Plus size={18}/> Initialize Protocol
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {calendarEvents.map(ev => (
                      <div key={ev.id} className="bg-white dark:bg-[#343a40] rounded-2xl shadow-sm border border-black/5 dark:border-[#4b545c] flex flex-col group transition-all hover:shadow-2xl overflow-hidden">
                         <div className="h-40 relative">
                            <img src={ev.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="absolute top-4 right-4 flex gap-2">
                               <button onClick={() => handleRepostEvent(ev)} className="p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform" title="Broadcast to Feed"><Share2 size={16}/></button>
                            </div>
                         </div>
                         <div className="p-6 flex-1 space-y-4">
                            <h4 className="font-black text-lg uppercase tracking-tight line-clamp-1">{ev.title}</h4>
                            <div className="flex items-center gap-4 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Calendar size={12}/> {ev.date}</span>
                               <span className="flex items-center gap-1.5"><MapPin size={12}/> {ev.location}</span>
                            </div>
                            <p className="text-xs text-slate-500 italic font-medium line-clamp-2 leading-relaxed">"{ev.description}"</p>
                         </div>
                         <div className="bg-slate-50 dark:bg-black/10 p-4 border-t dark:border-[#4b545c] flex gap-2">
                            <button className="flex-1 py-2.5 bg-indigo-600/5 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Edit Registry</button>
                            <button className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'ads' && (
             <AdminLTECard 
               title="Marketing Campaign Console" 
               icon={<Megaphone size={16}/>} 
               headerColor="border-rose-500" 
               tools={<button onClick={() => setShowAddAd(true)} className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-rose-600/20">Add Campaign</button>}
             >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {ads.map(ad => (
                      <div key={ad.id} className="p-6 border dark:border-[#4b545c] rounded-2xl space-y-5 bg-slate-50/50 dark:bg-white/5 transition-all hover:border-rose-500/50">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-xl font-black leading-none uppercase tracking-tighter">{ad.clientName}</h4>
                               <p className="text-[10px] text-slate-400 font-black uppercase mt-1.5 tracking-widest">{ad.title}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${ad.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{ad.status}</span>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                               <span className="text-slate-400">Target Reach</span>
                               <span>{ad.reach.toLocaleString()} Nodes</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-rose-600 shadow-lg shadow-rose-500/40" style={{ width: `${(ad.spent / ad.budget) * 100}%` }}></div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase pt-4 border-t dark:border-[#4b545c]">
                            <span className="text-slate-500 flex items-center gap-1.5"><Clock size={12}/> Ends: {ad.deadline}</span>
                            <button className="text-indigo-600 hover:underline">Full Analytics</button>
                         </div>
                      </div>
                   ))}
                </div>
             </AdminLTECard>
          )}

          {activeTab === 'academic' && (
             <AdminLTECard 
               title="Global Resource Vault Management" 
               icon={<HardDrive size={16}/>} 
               headerColor="border-emerald-500"
               tools={<button onClick={() => setShowAddResource(true)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-emerald-600/20"><FilePlus size={14}/> Synchronize Asset</button>}
             >
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                      <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-[#4b545c]">
                         <tr>
                            <th className="p-5">Asset Identifier</th>
                            <th className="p-5">Classification</th>
                            <th className="p-5">Hub Node</th>
                            <th className="p-5">Interaction Logs</th>
                            <th className="p-5 text-center">Audit</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#4b545c]">
                         {resources.map(res => (
                            <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                               <td className="p-5 flex items-center gap-4">
                                  <div className="p-3 bg-indigo-600/10 text-indigo-600 rounded-xl"><FileText size={20}/></div>
                                  <div>
                                     <p className="text-sm font-black uppercase tracking-tight">{res.title}</p>
                                     <p className="text-[9px] text-slate-400 lowercase font-medium">{res.course}</p>
                                  </div>
                               </td>
                               <td className="p-5"><span className="text-amber-500 font-black">{res.category}</span></td>
                               <td className="p-5 font-black text-slate-500">{res.college} WING</td>
                               <td className="p-5 text-slate-400">{res.downloads} SCAN OPS</td>
                               <td className="p-5">
                                  <div className="flex items-center justify-center gap-2">
                                     <button className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Eye size={14}/></button>
                                     <button className="p-2.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14}/></button>
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

      {/* --- ADD RESOURCE MODAL --- */}
      {showAddResource && (
         <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="bg-white dark:bg-[#343a40] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
               <div className="p-8 border-b dark:border-[#4b545c] flex justify-between items-center bg-black/5">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Vault Synchronization</h3>
                  <button onClick={() => setShowAddResource(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Document Protocol Title</label>
                     <input className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. COCIS Year 2 Networks Lab" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">College Hub</label>
                        <select className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none appearance-none">
                           {Object.keys(COURSES_BY_COLLEGE).map(c => <option key={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                        <select className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none appearance-none">
                           <option>Notes/Books</option>
                           <option>Past Paper</option>
                           <option>Research</option>
                           <option>Career</option>
                        </select>
                     </div>
                  </div>
                  <button onClick={() => setShowAddResource(false)} className="w-full bg-indigo-600 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95">Commit Asset to Vault</button>
               </div>
            </div>
         </div>
      )}

      {/* --- ADD EVENT MODAL --- */}
      {showAddEvent && (
         <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="bg-white dark:bg-[#343a40] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
               <div className="p-8 border-b dark:border-[#4b545c] flex justify-between items-center bg-black/5">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Protocol Initialization</h3>
                  <button onClick={() => setShowAddEvent(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Registry Title</label>
                     <input className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. 89th Guild Inauguration" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Date</label>
                        <input type="date" className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue Target</label>
                        <input className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none" placeholder="e.g. Freedom Square" />
                     </div>
                  </div>
                  <button onClick={() => setShowAddEvent(false)} className="w-full bg-emerald-600 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95">Save Entry to Registry</button>
               </div>
            </div>
         </div>
      )}

      {/* --- ADD AD MODAL --- */}
      {showAddAd && (
         <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="bg-white dark:bg-[#343a40] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
               <div className="p-8 border-b dark:border-[#4b545c] flex justify-between items-center bg-black/5">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Campaign Deployment</h3>
                  <button onClick={() => setShowAddAd(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Commercial Client Name</label>
                     <input className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" placeholder="e.g. MTN Pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Budget (UGX)</label>
                        <input type="number" className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none" placeholder="1200000" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Termination Date</label>
                        <input type="date" className="w-full bg-slate-50 dark:bg-black/20 border dark:border-[#4b545c] rounded-2xl p-4 text-xs font-bold outline-none" />
                     </div>
                  </div>
                  <button onClick={() => setShowAddAd(false)} className="w-full bg-rose-600 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95">Deploy Commercial Signal</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Admin;
