
import React, { useState, useEffect } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { User, Post, Resource, UserStatus, College, AuthorityRole, Ad, CalendarEvent } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, BarChart2, 
  ShieldCheck, LayoutDashboard, Settings, Database, 
  Menu, Bell, LogOut, Globe, Sliders, RefreshCcw, 
  Image as ImageIcon, Edit3, Flag, CheckCircle, 
  Ban, UserCheck, GraduationCap, HardDrive, Search,
  Megaphone, TrendingUp, Download, PieChart as PieChartIcon,
  CreditCard, UserPlus, Briefcase, ExternalLink, Filter
} from 'lucide-react';

interface AdminProps {
  onToggleView?: () => void;
  onLogout?: () => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'academic' | 'events' | 'ads' | 'revenue' | 'explore' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [ads, setAds] = useState<Ad[]>(db.getAds());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modal States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

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
    alert("Generating encrypted system report... PDF compilation initialized. Please wait for signal completion.");
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Purge event from global registry?")) {
      db.deleteCalendarEvent(id);
      setCalendarEvents(db.getCalendarEvents());
    }
  };

  const handleToggleAdStatus = (id: string) => {
    const updated = ads.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Completed' : 'Active' } as Ad : a);
    db.saveAds(updated);
    setAds(updated);
  };

  const allImages = posts.filter(p => p.images && p.images.length > 0);

  return (
    <div className="flex h-screen w-full bg-[#454d55] text-white font-sans overflow-hidden">
      {/* AdminLTE Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakTerminal <span className="font-light text-xs opacity-50 ml-1">v5.2</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'User Registry', icon: <Users size={18}/> },
              { id: 'academic', label: 'Academic Vault', icon: <HardDrive size={18}/> },
              { id: 'events', label: 'Event Control', icon: <Calendar size={18}/> },
              { id: 'ads', label: 'Ads Management', icon: <Megaphone size={18}/> },
              { id: 'revenue', label: 'Revenue & Subs', icon: <DollarSign size={18}/> },
              { id: 'explore', label: 'Visual Audit', icon: <ImageIcon size={18}/> },
              { id: 'settings', label: 'System Logic', icon: <Settings size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-2.5 rounded transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}
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
              <LogOut size={14}/> {!isSidebarCollapsed && "Terminal Logout"}
           </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#454d55]">
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b bg-[#343a40] border-[#4b545c]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-300 transition-colors"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">MakTerminal Protocol / <span className="text-indigo-400">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleGenerateReport} className="bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded text-[9px] font-black uppercase border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2">
                <Download size={12}/> Generate Report
             </button>
             <div className="w-px h-6 bg-white/10"></div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Node Sync: 100%</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 no-scrollbar">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Platform Users', val: users.length, icon: <Users size={40}/>, bg: 'bg-[#17a2b8]', trend: '+12%' },
                  { label: 'Active Ads', val: ads.filter(a => a.status === 'Active').length, icon: <Megaphone size={40}/>, bg: 'bg-[#28a745]', trend: '+5%' },
                  { label: 'Monthly Revenue', val: 'UGX 8.9M', icon: <DollarSign size={40}/>, bg: 'bg-[#ffc107]', trend: '+14%', text: 'text-dark' },
                  { label: 'Subscribers', val: '3,500', icon: <UserPlus size={40}/>, bg: 'bg-[#dc3545]', trend: '+22%' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.text === 'text-dark' ? 'text-[#212529]' : 'text-white'} rounded shadow-lg overflow-hidden flex flex-col justify-between h-32 group relative transition-transform hover:translate-y-[-2px]`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-black leading-tight">{box.val}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-15 transition-transform">{box.icon}</div>
                    </div>
                    <div className="px-4 py-1.5 bg-black/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-between">
                       <span>Growth Trend</span>
                       <span className="flex items-center gap-1"><TrendingUp size={10}/> {box.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="rounded bg-[#343a40] shadow-md border-t-4 border-indigo-500 overflow-hidden">
                    <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                      <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><TrendingUp size={16}/> Subscription Growth</h3>
                    </div>
                    <div className="p-6 h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_HISTORY}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b545c" />
                          <XAxis dataKey="month" stroke="#c2c7d0" fontSize={10} />
                          <YAxis stroke="#c2c7d0" fontSize={10} />
                          <Tooltip contentStyle={{backgroundColor: '#343a40', border: '1px solid #4b545c'}} />
                          <Area type="monotone" dataKey="subscribers" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="rounded bg-[#343a40] shadow-md border-t-4 border-emerald-500 overflow-hidden">
                    <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                      <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><PieChartIcon size={16}/> Asset Classification</h3>
                    </div>
                    <div className="p-6 h-72">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Notes', value: 400 },
                                { name: 'Papers', value: 300 },
                                { name: 'Tests', value: 200 },
                                { name: 'Other', value: 100 },
                              ]}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
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

          {/* User Registry Tab */}
          {activeTab === 'users' && (
            <div className="bg-[#343a40] rounded shadow-md border-t-4 border-indigo-500 overflow-hidden animate-in slide-in-from-bottom-5">
               <div className="p-6 border-b border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[12px] font-black uppercase tracking-widest">Global Node Directory</h3>
                  <div className="relative">
                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input className="bg-[#454d55] border border-[#4b545c] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none w-64" placeholder="Filter Registry..." />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400">
                      <tr>
                        <th className="p-5">User Identity</th>
                        <th className="p-5">Platform Role</th>
                        <th className="p-5">Strata Status</th>
                        <th className="p-5">Auth</th>
                        <th className="p-5 text-center">Protocol Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-500/5 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <img src={u.avatar} className="w-10 h-10 rounded-xl border border-white/10" />
                              <div>
                                <p className="text-white font-black">{u.name}</p>
                                <p className="text-[9px] text-slate-500 lowercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-indigo-400 font-black">{u.role}</td>
                          <td className="p-5">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                               u.accountStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                               u.accountStatus === 'Suspended' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                             }`}>
                               {u.accountStatus || 'Active'}
                             </span>
                          </td>
                          <td className="p-5">
                             {u.verified ? <CheckCircle size={16} className="text-emerald-500"/> : <Ban size={16} className="text-slate-500"/>}
                          </td>
                          <td className="p-5">
                             <div className="flex items-center justify-center gap-2">
                                <button onClick={() => setEditingUser(u)} className="p-2.5 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-lg transition-all"><Edit3 size={14}/></button>
                                <button className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"><UserCheck size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5">
               <div className="flex justify-between items-center">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400">Marketing & Campaign Control</h3>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all">
                     <Plus size={16}/> Create Ad Protocol
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ads.map(ad => (
                    <div key={ad.id} className="bg-[#343a40] rounded-xl shadow-md border-t-4 border-indigo-500 overflow-hidden flex flex-col">
                       <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-lg font-black uppercase tracking-tight text-white">{ad.clientName}</h4>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{ad.title}</p>
                             </div>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black ${ad.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{ad.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                             <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Reach</p>
                                <p className="text-sm font-black text-white">{ad.reach.toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Interactions</p>
                                <p className="text-sm font-black text-white">{ad.clicks.toLocaleString()}</p>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="flex justify-between text-[8px] font-black uppercase">
                                <span className="text-slate-500">Budget Spent</span>
                                <span className="text-indigo-400">UGX {ad.spent.toLocaleString()} / {ad.budget.toLocaleString()}</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600" style={{ width: `${(ad.spent/ad.budget)*100}%` }}></div>
                             </div>
                          </div>
                       </div>
                       <div className="mt-auto p-4 bg-black/10 flex gap-2">
                          <button onClick={() => handleToggleAdStatus(ad.id)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all">Toggle State</button>
                          <button className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Revenue & Finance Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-5">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#343a40] p-8 rounded-xl shadow-md border-t-4 border-emerald-500 space-y-4">
                     <div className="flex items-center gap-4 text-emerald-500">
                        <CreditCard size={32}/>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Net Profit</p>
                           <h3 className="text-3xl font-black text-white">UGX 42.4M</h3>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#343a40] p-8 rounded-xl shadow-md border-t-4 border-amber-500 space-y-4">
                     <div className="flex items-center gap-4 text-amber-500">
                        <Activity size={32}/>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operating Burn Rate</p>
                           <h3 className="text-3xl font-black text-white">UGX 3.4M/mo</h3>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#343a40] p-8 rounded-xl shadow-md border-t-4 border-indigo-500 space-y-4">
                     <div className="flex items-center gap-4 text-indigo-500">
                        <UserPlus size={32}/>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subscription LTV</p>
                           <h3 className="text-3xl font-black text-white">UGX 125K</h3>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#343a40] rounded-xl shadow-md border-t-4 border-white/20 overflow-hidden">
                  <div className="p-6 border-b border-[#4b545c]">
                     <h3 className="text-[12px] font-black uppercase tracking-widest">Financial Performance Index</h3>
                  </div>
                  <div className="p-8 h-96">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={REVENUE_HISTORY}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b545c" />
                          <XAxis dataKey="month" stroke="#c2c7d0" fontSize={10} />
                          <YAxis stroke="#c2c7d0" fontSize={10} />
                          <Tooltip contentStyle={{backgroundColor: '#343a40', border: '1px solid #4b545c'}} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Gross Revenue" />
                          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="System Costs" />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {/* Events Management Tab */}
          {activeTab === 'events' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5">
               <div className="flex justify-between items-center">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400">Global Campus Events Registry</h3>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all">
                     <Plus size={16}/> Register External Event
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calendarEvents.map(ev => (
                    <div key={ev.id} className="bg-[#343a40] rounded-xl shadow-md border-t-4 border-rose-500 overflow-hidden group">
                       <div className="h-40 relative">
                          <img src={ev.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 right-4 flex gap-2">
                             <button className="p-2 bg-indigo-600 rounded text-white shadow-lg"><Edit3 size={14}/></button>
                             <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 bg-rose-600 rounded text-white shadow-lg"><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <div className="p-6 space-y-4">
                          <h4 className="text-lg font-black uppercase tracking-tight text-white leading-none truncate">{ev.title}</h4>
                          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                             <span className="flex items-center gap-1"><Calendar size={12}/> {ev.date}</span>
                             <span className="flex items-center gap-1"><Users size={12}/> {ev.attendeeIds?.length || 0} Registrations</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium italic line-clamp-2">"{ev.description}"</p>
                          <button className="w-full py-2 bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 rounded text-[9px] font-black uppercase tracking-widest transition-all">Broadcast Update</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Academic Vault Tab */}
          {activeTab === 'academic' && (
            <div className="bg-[#343a40] rounded shadow-md border-t-4 border-emerald-500 overflow-hidden animate-in slide-in-from-bottom-5">
               <div className="p-6 border-b border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[12px] font-black uppercase tracking-widest">Asset Management Protocol</h3>
                  <button onClick={() => setIsAddingResource(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Plus size={16}/> Synchronize New Asset
                  </button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400">
                      <tr>
                        <th className="p-5">Asset Identifier</th>
                        <th className="p-5">Category</th>
                        <th className="p-5">College Wing</th>
                        <th className="p-5">Logs</th>
                        <th className="p-5 text-center">Audit Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {resources.map(res => (
                        <tr key={res.id} className="hover:bg-emerald-500/5 transition-colors">
                          <td className="p-5">
                             <div className="flex items-center gap-4">
                                <FileText size={20} className="text-emerald-500"/>
                                <div>
                                   <p className="text-white font-black">{res.title}</p>
                                   <p className="text-[9px] text-slate-500">{res.course}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-5 text-amber-500 font-black">{res.category}</td>
                          <td className="p-5 text-slate-300">{res.college}</td>
                          <td className="p-5 text-slate-500">{res.downloads} Scans</td>
                          <td className="p-5">
                             <div className="flex items-center justify-center gap-2">
                                <button className="p-2.5 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-lg transition-all"><Edit3 size={14}/></button>
                                <button className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"><Trash2 size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* Visual Audit Tab */}
          {activeTab === 'explore' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5">
               <div className="flex justify-between items-center">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400">High-Fidelity Media Audit</h3>
                  <div className="flex gap-4">
                     <button className="bg-rose-600/20 text-rose-400 px-4 py-2 rounded text-[9px] font-black uppercase border border-rose-500/20">Purge Flagged</button>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                 {allImages.map(post => (
                   <div key={post.id} className="group relative bg-[#343a40] rounded-xl overflow-hidden border border-white/5 shadow-lg">
                      <img src={post.images?.[0]} className="w-full aspect-square object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
                         <p className="text-[8px] font-black text-white uppercase tracking-widest truncate">{post.author}</p>
                         <div className="flex gap-1.5">
                            <button onClick={() => db.deletePost(post.id, 'admin')} className="flex-1 bg-rose-600 text-white py-1.5 rounded text-[8px] font-black uppercase">Purge</button>
                            <button className="flex-1 bg-emerald-600 text-white py-1.5 rounded text-[8px] font-black uppercase">WhiteList</button>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </main>
      </div>

      {/* Identity Override Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="bg-[#343a40] w-full max-w-lg rounded-2xl shadow-2xl border border-[#4b545c] overflow-hidden">
              <div className="p-6 border-b border-[#4b545c] flex justify-between items-center bg-black/10">
                 <h3 className="text-[12px] font-black uppercase tracking-widest">Protocol Overide: {editingUser.name}</h3>
                 <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operational Status</label>
                    <select 
                      className="w-full bg-[#454d55] border border-[#4b545c] rounded-xl p-4 text-sm outline-none font-black uppercase tracking-widest"
                      value={editingUser.accountStatus || 'Active'}
                      onChange={e => setEditingUser({...editingUser, accountStatus: e.target.value as any})}
                    >
                       <option value="Active">Pulse Active</option>
                       <option value="Inactive">Signal Dead</option>
                       <option value="Suspended">Node Quarantined</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strata Rank (Role)</label>
                    <input 
                       className="w-full bg-[#454d55] border border-[#4b545c] rounded-xl p-4 text-sm outline-none font-bold"
                       value={editingUser.role}
                       onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                    />
                 </div>
                 <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className={editingUser.verified ? 'text-emerald-500' : 'text-slate-500'} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Identity Validated</span>
                    </div>
                    <button 
                      onClick={() => setEditingUser({...editingUser, verified: !editingUser.verified})}
                      className={`w-12 h-6 rounded-full relative transition-all ${editingUser.verified ? 'bg-emerald-600' : 'bg-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingUser.verified ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
              <div className="p-6 bg-black/10 flex justify-end gap-3 border-t border-[#4b545c]">
                 <button onClick={() => setEditingUser(null)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                 <button onClick={() => { db.saveUser(editingUser); setUsers(db.getUsers()); setEditingUser(null); }} className="px-8 py-2.5 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30">Commit Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
