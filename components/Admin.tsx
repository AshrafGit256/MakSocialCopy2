
import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { User, Post, Resource, AuthorityRole, Ad, CalendarEvent, SubscriptionTier } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, BarChart2, 
  ShieldCheck, LayoutDashboard, Settings, Database, 
  Menu, Bell, LogOut, Globe, Sliders, RefreshCcw, 
  Image as ImageIcon, Edit3, Flag, CheckCircle, 
  Ban, UserCheck, GraduationCap, HardDrive, Search,
  Megaphone, TrendingUp, Download, PieChart as PieChartIcon,
  CreditCard, UserPlus, Briefcase, ExternalLink, Filter,
  Share2, ChevronRight, MapPin, Clock, CalendarDays, Rocket
} from 'lucide-react';

interface AdminProps {
  onLogout?: () => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscribers' | 'events' | 'ads' | 'revenue' | 'calendar' | 'academic' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
      setResources(db.getResources());
      setAds(db.getAds());
      setCalendarEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    alert("Encrypted System Performance Report compiled successfully. Exporting to PDF...");
  };

  const handlePromoteEvent = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `promo-${Date.now()}`,
      author: 'ADMIN BROADCAST',
      authorId: 'super_admin',
      authorRole: 'System Administrator',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      authorAuthority: 'Super Admin',
      timestamp: 'Just now',
      content: `[REPOST] ${event.description}`,
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
      hashtags: ['#AdminPromoted', '#MustAttend']
    };
    db.addPost(broadcast);
    alert("Event pushed to global feed as Promoted Broadcast.");
  };

  const handleUpgradeSubscriber = (userId: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, subscriptionTier: 'Pro' as SubscriptionTier } : u);
    db.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    alert("User access stratum elevated to PRO.");
  };

  const subscribers = users.filter(u => u.subscriptionTier !== 'Free');

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] text-slate-800 font-sans overflow-hidden dark:bg-[#454d55] dark:text-white">
      {/* AdminLTE Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0 bg-[#343a40]">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakSocial <span className="font-light text-xs opacity-50 ml-1">ADMIN</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'subscribers', label: 'Subscribers', icon: <UserPlus size={18}/> },
              { id: 'events', label: 'Event Registry', icon: <Calendar size={18}/> },
              { id: 'ads', label: 'Ads Management', icon: <Megaphone size={18}/> },
              { id: 'revenue', label: 'Finance Center', icon: <DollarSign size={18}/> },
              { id: 'calendar', label: 'Admin Roadmap', icon: <CalendarDays size={18}/> },
              { id: 'academic', label: 'Academic Vault', icon: <HardDrive size={18}/> },
              { id: 'settings', label: 'System Logic', icon: <Settings size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-3 rounded transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-[11px] font-black uppercase tracking-widest">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onLogout} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={14}/> {!isSidebarCollapsed && "Logout Terminal"}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b bg-white dark:bg-[#343a40] dark:border-[#4b545c] shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-500 dark:text-slate-300 transition-colors"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Control Panel / <span className="text-indigo-500">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={handleGenerateReport} className="bg-emerald-600 text-white px-4 py-1.5 rounded text-[9px] font-black uppercase hover:bg-emerald-700 transition-all flex items-center gap-2">
                <Download size={12}/> Generate Report
             </button>
             <div className="relative">
                <Bell size={18} className="text-slate-400"/>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">12</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 no-scrollbar">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Dashboard Small-Boxes */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Platform Users', val: users.length, icon: <Users size={40}/>, bg: 'bg-[#17a2b8]', trend: '8% Up' },
                    { label: 'Subscribers', val: subscribers.length, icon: <UserPlus size={40}/>, bg: 'bg-[#28a745]', trend: '12% Up' },
                    { label: 'Monthly Revenue', val: 'UGX 8.9M', icon: <DollarSign size={40}/>, bg: 'bg-[#ffc107]', trend: '5% Up', color: 'text-slate-900' },
                    { label: 'Active Ads', val: ads.filter(a => a.status === 'Active').length, icon: <Megaphone size={40}/>, bg: 'bg-[#dc3545]', trend: '2% Down' },
                  ].map((box, i) => (
                    <div key={i} className={`${box.bg} ${box.color || 'text-white'} rounded-lg shadow flex flex-col relative overflow-hidden h-32 hover:translate-y-[-2px] transition-transform cursor-pointer`}>
                      <div className="p-4 flex-1">
                         <h3 className="text-3xl font-black">{box.val}</h3>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-20">{box.icon}</div>
                      <div className="bg-black/10 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest flex items-center justify-between">
                         More Info <ChevronRight size={10}/>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white dark:bg-[#343a40] rounded shadow overflow-hidden border-t-4 border-indigo-500">
                     <div className="p-4 border-b border-slate-100 dark:border-[#4b545c] flex justify-between items-center">
                        <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16}/> Revenue Stream (UGX)</h3>
                        <div className="flex gap-1">
                           <button className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded"><RefreshCcw size={12}/></button>
                        </div>
                     </div>
                     <div className="p-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={REVENUE_HISTORY}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" opacity={0.2} />
                              <XAxis dataKey="month" fontSize={10} axisLine={false} />
                              <YAxis fontSize={10} axisLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Legend />
                              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Revenue" />
                              <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" name="Expenses" />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Interaction Pie Chart */}
                  <div className="bg-white dark:bg-[#343a40] rounded shadow overflow-hidden border-t-4 border-emerald-500">
                     <div className="p-4 border-b border-slate-100 dark:border-[#4b545c]">
                        <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><PieChartIcon size={16}/> Audience Strata</h3>
                     </div>
                     <div className="p-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[
                                    { name: 'Free Users', value: users.length - subscribers.length },
                                    { name: 'Pro Users', value: subscribers.filter(s => s.subscriptionTier === 'Pro').length },
                                    { name: 'Enterprise', value: subscribers.filter(s => s.subscriptionTier === 'Enterprise').length },
                                 ]}
                                 innerRadius={60}
                                 outerRadius={90}
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                              </Pie>
                              <Tooltip />
                              <Legend iconType="circle" />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="bg-white dark:bg-[#343a40] rounded shadow overflow-hidden border-t-4 border-indigo-500 animate-in slide-in-from-bottom-5">
               <div className="p-6 border-b border-slate-100 dark:border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[12px] font-black uppercase tracking-widest">Subscriber Registry</h3>
                  <div className="flex gap-2">
                     <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold">Total LTV: UGX 125M</span>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b dark:border-white/10 text-slate-400">
                      <tr>
                        <th className="p-5">User</th>
                        <th className="p-5">College</th>
                        <th className="p-5">Tier</th>
                        <th className="p-5">Joined</th>
                        <th className="p-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors">
                          <td className="p-5 flex items-center gap-3">
                             <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10" />
                             <div>
                                <p className="font-black dark:text-white">{u.name}</p>
                                <p className="text-[9px] text-slate-400 lowercase">{u.email}</p>
                             </div>
                          </td>
                          <td className="p-5 text-indigo-500">{u.college}</td>
                          <td className="p-5">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                               u.subscriptionTier === 'Pro' ? 'bg-indigo-500 text-white' : 
                               u.subscriptionTier === 'Enterprise' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                             }`}>
                               {u.subscriptionTier}
                             </span>
                          </td>
                          <td className="p-5 text-slate-400">12 Feb 2025</td>
                          <td className="p-5">
                             <div className="flex items-center justify-center gap-2">
                                {u.subscriptionTier === 'Free' && (
                                   <button onClick={() => handleUpgradeSubscriber(u.id)} className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 shadow-sm" title="Upgrade"><Rocket size={14}/></button>
                                )}
                                <button className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500 hover:text-white"><Trash2 size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-5">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Campus Events Control</h3>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded shadow-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Plus size={16}/> New Entry
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calendarEvents.map(ev => (
                    <div key={ev.id} className="bg-white dark:bg-[#343a40] rounded shadow overflow-hidden group flex flex-col">
                       <div className="h-40 relative overflow-hidden">
                          <img src={ev.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button onClick={() => handlePromoteEvent(ev)} className="p-3 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700" title="Repost to Global Feed"><Share2 size={20}/></button>
                          </div>
                       </div>
                       <div className="p-5 flex-1 space-y-4">
                          <div>
                             <h4 className="font-black text-lg uppercase tracking-tight line-clamp-1">{ev.title}</h4>
                             <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ev.category}</p>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Calendar size={12}/> {ev.date}</span>
                             <span className="flex items-center gap-1"><MapPin size={12}/> {ev.location}</span>
                          </div>
                          <p className="text-xs text-slate-400 italic line-clamp-2">"{ev.description}"</p>
                       </div>
                       <div className="bg-slate-50 dark:bg-black/10 p-4 border-t dark:border-white/5 flex gap-2">
                          <button className="flex-1 bg-indigo-500/10 text-indigo-500 py-2 rounded text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Edit Registry</button>
                          <button onClick={() => { if(confirm("Purge event?")) db.deleteCalendarEvent(ev.id); setCalendarEvents(db.getCalendarEvents()); }} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'calendar' && (
             <div className="space-y-6 animate-in slide-in-from-bottom-5">
                <div className="bg-white dark:bg-[#343a40] rounded shadow border-t-4 border-amber-500 overflow-hidden">
                   <div className="p-6 border-b border-slate-100 dark:border-[#4b545c]">
                      <h3 className="text-[12px] font-black uppercase tracking-widest">Admin Roadmap & Deadlines</h3>
                   </div>
                   <div className="p-8 space-y-8">
                      {/* Roadmap List View (Optimized for Admin Tracking) */}
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Critical Protocol Dates</h4>
                         {calendarEvents.sort((a,b) => a.date.localeCompare(b.date)).map(ev => (
                            <div key={ev.id} className="flex gap-4 items-center bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                               <div className="w-12 h-12 bg-indigo-600 rounded-lg flex flex-col items-center justify-center text-white shadow-lg">
                                  <span className="text-xs font-black leading-none">{ev.date.split('-')[2]}</span>
                                  <span className="text-[7px] font-black uppercase">{new Date(ev.date).toLocaleString('default',{month:'short'})}</span>
                               </div>
                               <div className="flex-1">
                                  <p className="font-black text-sm uppercase leading-none">{ev.title}</p>
                                  <p className="text-[9px] text-slate-400 uppercase font-black mt-1">Campus Event @ {ev.location}</p>
                               </div>
                               <div className="text-right">
                                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full text-[8px] font-black uppercase">Event Node</span>
                               </div>
                            </div>
                         ))}
                         {ads.map(ad => (
                            <div key={ad.id} className="flex gap-4 items-center bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-xl border border-amber-100 dark:border-amber-500/10">
                               <div className="w-12 h-12 bg-amber-500 rounded-lg flex flex-col items-center justify-center text-white shadow-lg">
                                  <span className="text-xs font-black leading-none">{ad.deadline.split('-')[2]}</span>
                                  <span className="text-[7px] font-black uppercase">{new Date(ad.deadline).toLocaleString('default',{month:'short'})}</span>
                               </div>
                               <div className="flex-1">
                                  <p className="font-black text-sm uppercase leading-none">Campaign Deadline: {ad.clientName}</p>
                                  <p className="text-[9px] text-amber-600 uppercase font-black mt-1">Marketing Termination Protocol</p>
                               </div>
                               <div className="text-right">
                                  <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-full text-[8px] font-black uppercase">Ad Protocol</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-5">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-[#343a40] p-6 rounded shadow border-l-4 border-emerald-500 space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Platform Margin</p>
                     <h3 className="text-3xl font-black">UGX 1.2B</h3>
                     <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1"><TrendingUp size={10}/> 15% increase from last quarter</p>
                  </div>
                  <div className="bg-white dark:bg-[#343a40] p-6 rounded shadow border-l-4 border-rose-500 space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Burn Rate</p>
                     <h3 className="text-3xl font-black">UGX 4.5M</h3>
                     <p className="text-[9px] text-rose-500 font-bold">Stable server-node maintenance costs</p>
                  </div>
                  <div className="bg-white dark:bg-[#343a40] p-6 rounded shadow border-l-4 border-indigo-500 space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Sub Revenue (ARPU)</p>
                     <h3 className="text-3xl font-black">UGX 45K</h3>
                     <p className="text-[9px] text-indigo-500 font-bold">Based on Pro-tier population density</p>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#343a40] rounded shadow overflow-hidden">
                  <div className="p-6 border-b dark:border-white/5">
                     <h3 className="text-[12px] font-black uppercase tracking-widest">Subscription Growth Matrix</h3>
                  </div>
                  <div className="p-8 h-96">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_HISTORY}>
                           <defs>
                              <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                           <XAxis dataKey="month" fontSize={10} axisLine={false} />
                           <YAxis fontSize={10} axisLine={false} />
                           <Tooltip />
                           <Area type="monotone" dataKey="subscribers" stroke="#6366f1" fillOpacity={1} fill="url(#colorSub)" name="Subscribers Count" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
