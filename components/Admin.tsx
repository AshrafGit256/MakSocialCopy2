
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, CalendarEvent, Violation } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, MessageCircle, Eye, Plus, Clock,
  DollarSign, Calendar, Youtube, History, Heart, User as UserIcon, Zap, X,
  FileText, BarChart2, AlertTriangle, ShieldCheck, UserMinus, 
  LayoutDashboard, Settings, Database, Server, Terminal,
  ChevronRight, Search, Menu, Bell, ArrowRight, UserPlus, Download,
  Sun, Moon, LogOut, Globe, CheckCircle2, Megaphone, Sliders, Lock, 
  RefreshCcw, Image as ImageIcon, Edit3, ChevronLeft, MoreVertical, Flag
} from 'lucide-react';

interface AdminProps {
  onToggleView?: () => void;
  onLogout?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onToggleView, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'ads' | 'moderation' | 'events' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdminDark, setIsAdminDark] = useState(false);

  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Mon', visits: 400, posts: 240, revenue: 120 },
    { name: 'Tue', visits: 300, posts: 139, revenue: 210 },
    { name: 'Wed', visits: 200, posts: 980, revenue: 150 },
    { name: 'Thu', visits: 278, posts: 390, revenue: 300 },
    { name: 'Fri', visits: 189, posts: 480, revenue: 450 },
    { name: 'Sat', visits: 239, posts: 380, revenue: 200 },
    { name: 'Sun', visits: 349, posts: 430, revenue: 180 },
  ];

  const collegeData = [
    { name: 'COCIS', value: 450 },
    { name: 'CEDAT', value: 300 },
    { name: 'CHUSS', value: 200 },
    { name: 'LAW', value: 150 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleVerify = (uid: string) => {
    // Mock logic: toggle a badge or verification state
    const updated = users.map(u => u.id === uid ? { ...u, badges: [...u.badges, 'Verified'] } : u);
    db.saveUsers(updated);
    setUsers(updated);
  };

  const handleSuspend = (uid: string) => {
    if(confirm("Confirm temporary node deactivation?")) {
      // Suspension logic simulation
      alert(`Identity ${uid} quarantined.`);
    }
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 font-sans ${isAdminDark ? 'bg-[#454d55] text-white dark' : 'bg-[#f4f6f9] text-[#212529]'}`}>
      {/* AdminLTE Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c]">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light">v3.5</span></span>}
        </div>

        <div className="p-4 flex items-center border-b border-[#4b545c]">
          <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full bg-white p-1 mr-3 shrink-0" />
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">SysArch-01</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-[#c2c7d0]">Online</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'Node Registry', icon: <Users size={18}/> },
              { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone size={18}/> },
              { id: 'events', label: 'Campus Calendar', icon: <Calendar size={18}/> },
              { id: 'moderation', label: 'Moderation Hub', icon: <Flag size={18}/> },
              { id: 'settings', label: 'System Settings', icon: <Settings size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-2.5 rounded transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                  {!isSidebarCollapsed && item.id === 'moderation' && <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black">9+</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-[#4b545c]">
           <button onClick={onToggleView} className="w-full bg-[#6c757d] hover:bg-[#5a6268] text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={14} className="rotate-180"/> {!isSidebarCollapsed && "Exit Admin"}
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className={`h-14 flex items-center justify-between px-4 shrink-0 border-b ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 rounded text-[#495057] dark:text-slate-300"><Menu size={20}/></button>
            <nav className="hidden md:flex gap-4 text-sm font-medium text-[#495057] dark:text-slate-300">
              <button onClick={onToggleView} className="hover:text-indigo-600">Home</button>
              <button className="hover:text-indigo-600">Contact</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAdminDark(!isAdminDark)} className="p-2 hover:bg-black/5 rounded text-[#495057] dark:text-slate-300 transition-transform active:rotate-45">
               {isAdminDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button className="relative p-2 hover:bg-black/5 rounded dark:text-slate-300">
              <Bell size={20}/>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ffc107] text-white text-[9px] flex items-center justify-center rounded-full font-bold">12</span>
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-rose-500/10 rounded text-rose-500 transition-all"><LogOut size={20}/></button>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-light capitalize ${isAdminDark ? 'text-white' : 'text-[#212529]'}`}>{activeTab} <span className="text-slate-400 font-extralight text-sm">Terminal Control</span></h1>
            <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-indigo-600">Admin</button>
              <ChevronRight size={12}/>
              <span className={isAdminDark ? 'text-slate-300' : 'text-[#6c757d]'}>{activeTab}</span>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Small Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Nodes', val: users.length, icon: <Users size={48}/>, bg: 'bg-[#17a2b8]', link: 'users' },
                  { label: 'Network Pulse', val: '92%', icon: <Activity size={48}/>, bg: 'bg-[#28a745]', link: 'moderation' },
                  { label: 'Pending Checks', val: '24', icon: <ShieldAlert size={48}/>, bg: 'bg-[#ffc107]', text: 'text-dark' },
                  { label: 'Revenue (UGX)', val: '1.2M', icon: <DollarSign size={48}/>, bg: 'bg-[#dc3545]', link: 'ads' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.text === 'text-dark' ? 'text-[#212529]' : 'text-white'} rounded shadow-lg overflow-hidden flex flex-col justify-between h-36 group relative`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-4xl font-black">{box.val}</h3>
                        <p className="text-sm font-bold opacity-80 uppercase tracking-wider">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">{box.icon}</div>
                    </div>
                    <button 
                      onClick={() => box.link && setActiveTab(box.link as any)}
                      className="w-full py-1.5 bg-black/10 hover:bg-black/20 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      Audit Records <ArrowRight size={12}/>
                    </button>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 rounded shadow-md border-t-4 border-indigo-500 overflow-hidden ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
                  <div className="p-4 border-b border-[#dee2e6] dark:border-[#4b545c] flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2"><BarChart2 size={18}/> Registry Interactions</h3>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-indigo-500 text-white rounded text-[10px] font-bold uppercase shadow-sm">Signals</button>
                      <button className="px-2 py-1 bg-[#f8f9fa] dark:bg-white/5 border border-[#ced4da] dark:border-white/10 rounded text-[10px] font-bold uppercase">Traffic</button>
                    </div>
                  </div>
                  <div className="p-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isAdminDark ? "#4b545c" : "#eee"} />
                        <XAxis dataKey="name" stroke={isAdminDark ? "#c2c7d0" : "#6c757d"} fontSize={10} />
                        <YAxis stroke={isAdminDark ? "#c2c7d0" : "#6c757d"} fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: isAdminDark ? '#343a40' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`rounded shadow-md border-t-4 border-[#ffc107] overflow-hidden ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
                   <div className="p-4 border-b border-[#dee2e6] dark:border-[#4b545c]">
                     <h3 className="font-bold flex items-center gap-2"><Globe size={18}/> Wing Distribution</h3>
                   </div>
                   <div className="p-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={collegeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {collegeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                       {collegeData.map((c, i) => (
                         <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            {c.name}
                         </div>
                       ))}
                    </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={`rounded shadow-md border-t-4 border-indigo-500 overflow-hidden animate-in slide-in-from-bottom-5 duration-500 ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
               <div className="p-4 border-b border-[#dee2e6] dark:border-[#4b545c] flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-tight">Full Node Directory</h3>
                  <div className="flex gap-4">
                     <button className="px-4 py-1.5 bg-[#28a745] text-white rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:brightness-110">Add Node</button>
                     <div className="relative">
                       <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                       <input className={`pl-9 pr-4 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${isAdminDark ? 'bg-white/5 border-white/10' : 'border-[#ced4da]'}`} placeholder="Filter registry..."/>
                     </div>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={`border-b ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                      <tr>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px]">Registry Entity</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px]">Network Wing</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px]">Rank</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px]">Clearance</th>
                        <th className="p-4 font-black uppercase tracking-widest text-[10px] text-center">Protocol Cmd</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isAdminDark ? 'divide-white/5' : 'divide-[#dee2e6]'}`}>
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-500/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-10 h-10 rounded-lg border border-slate-200" />
                              <div className="min-w-0">
                                <p className="font-bold">{u.name}</p>
                                <p className="text-[10px] opacity-60 uppercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                             <p className="font-bold">{u.college}</p>
                             <p className="text-[10px] uppercase opacity-50">{u.status}</p>
                          </td>
                          <td className="p-4">
                             <span className="text-xs font-bold text-indigo-500 uppercase">{u.role}</span>
                          </td>
                          <td className="p-4">
                             <span className={`bg-[#28a745] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.badges.includes('Super Admin') ? 'bg-indigo-600' : ''}`}>Authorized</span>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleVerify(u.id)} className="p-2 bg-[#007bff]/10 text-[#007bff] hover:bg-[#007bff] hover:text-white rounded transition-colors" title="Toggle Authorization"><ShieldCheck size={16}/></button>
                                <button onClick={() => handleSuspend(u.id)} className="p-2 bg-[#dc3545]/10 text-[#dc3545] hover:bg-[#dc3545] hover:text-white rounded transition-colors" title="Emergency Lock"><UserMinus size={16}/></button>
                                <button className="p-2 bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white rounded transition-colors"><Settings size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-8 animate-in zoom-in duration-500">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Campaign Intelligence</h3>
                  <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                     <Plus size={16}/> New Campaign
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className={`p-8 rounded-3xl shadow-md border-l-8 border-indigo-600 ${isAdminDark ? 'bg-[#343a40]' : 'bg-white border border-[#dee2e6]'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <DollarSign className="text-indigo-600" size={32}/>
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-[10px] font-black uppercase">Revenue</span>
                     </div>
                     <p className="text-4xl font-black tracking-tighter">UGX 1,240,000</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Fiscal Cycle 2025</p>
                  </div>
                  <div className={`p-8 rounded-3xl shadow-md border-l-8 border-emerald-600 ${isAdminDark ? 'bg-[#343a40]' : 'bg-white border border-[#dee2e6]'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <Eye className="text-emerald-600" size={32}/>
                        <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase">Visibility</span>
                     </div>
                     <p className="text-4xl font-black tracking-tighter">84.2k</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Network Impression Hits</p>
                  </div>
                  <div className={`p-8 rounded-3xl shadow-md border-l-8 border-rose-600 ${isAdminDark ? 'bg-[#343a40]' : 'bg-white border border-[#dee2e6]'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <Zap className="text-rose-600" size={32}/>
                        <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded text-[10px] font-black uppercase">Engagement</span>
                     </div>
                     <p className="text-4xl font-black tracking-tighter">3.2%</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Conversion CTR Signal</p>
                  </div>
               </div>

               <div className={`rounded shadow-md border-t-4 border-indigo-500 ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
                  <div className="p-4 border-b border-[#dee2e6] dark:border-[#4b545c]">
                     <h4 className="font-bold uppercase tracking-widest text-sm">Active Broadcast Campaigns</h4>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead className={`border-b ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-[#f8f9fa] border-[#dee2e6]'}`}>
                           <tr>
                              <th className="p-4 font-black uppercase text-[10px]">Partner Node</th>
                              <th className="p-4 font-black uppercase text-[10px]">Asset Payload</th>
                              <th className="p-4 font-black uppercase text-[10px]">Investment</th>
                              <th className="p-4 font-black uppercase text-[10px]">Status</th>
                              <th className="p-4 font-black uppercase text-[10px] text-center">Command</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dee2e6] dark:divide-white/5">
                           {[
                             { client: 'MTN Pulse', asset: 'Summer Gigabytes', spent: '450k', status: 'Active', target: 'COCIS' },
                             { client: 'Stanbic Bank', asset: 'Student Savings', spent: '800k', status: 'Paused', target: 'Global' },
                             { client: 'Jumia Food', asset: 'Campus Discounts', spent: '120k', status: 'Completed', target: 'Global' },
                           ].map((ad, i) => (
                             <tr key={i} className="hover:bg-slate-500/5 transition-colors">
                                <td className="p-4 font-bold">{ad.client}</td>
                                <td className="p-4 text-xs opacity-70">{ad.asset} <br/> <span className="text-[10px] text-indigo-500 font-black uppercase">T: {ad.target}</span></td>
                                <td className="p-4 font-bold text-emerald-600">UGX {ad.spent}</td>
                                <td className="p-4">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                     ad.status === 'Active' ? 'bg-[#28a745] text-white' : 
                                     ad.status === 'Paused' ? 'bg-[#ffc107] text-[#212529]' : 'bg-[#6c757d] text-white'
                                   }`}>{ad.status}</span>
                                </td>
                                <td className="p-4">
                                   <div className="flex items-center justify-center gap-2">
                                      <button className="p-2 hover:bg-indigo-600/10 text-indigo-600 rounded"><Edit3 size={16}/></button>
                                      <button className="p-2 hover:bg-rose-600/10 text-rose-500 rounded"><Trash2 size={16}/></button>
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold uppercase tracking-tight">University Calendar Sync</h3>
                  <button onClick={() => setShowEventModal(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-2">
                     <Plus size={16}/> Initialize Ceremony
                  </button>
               </div>
               
               <div className={`rounded shadow-md border-t-4 border-rose-500 ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-[#dee2e6] dark:divide-white/5">
                     <div className="p-8 space-y-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Scheduled Signals</h4>
                        <div className="space-y-4">
                           {db.getCalendarEvents().slice(0, 4).map(ev => (
                             <div key={ev.id} className="p-4 bg-[var(--bg-secondary)] dark:bg-white/5 rounded-2xl border border-[var(--border-color)] dark:border-white/10 group hover:border-indigo-500 transition-all cursor-pointer shadow-sm">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{ev.date} @ {ev.time}</p>
                                <h5 className="font-bold text-sm leading-tight">{ev.title}</h5>
                                <p className="text-[10px] text-slate-400 mt-2 uppercase">{ev.location}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="md:col-span-2 p-8">
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Monthly Registry</h4>
                           <div className="flex gap-2">
                              <button className="p-2 hover:bg-black/5 rounded dark:hover:bg-white/5"><ChevronLeft size={16}/></button>
                              <span className="text-sm font-bold">April 2025</span>
                              <button className="p-2 hover:bg-black/5 rounded dark:hover:bg-white/5"><ChevronRight size={16}/></button>
                           </div>
                        </div>
                        <div className="grid grid-cols-7 gap-px bg-[#dee2e6] dark:bg-white/10 border border-[#dee2e6] dark:border-white/10 rounded-xl overflow-hidden shadow-inner">
                           {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                             <div key={d} className={`h-8 flex items-center justify-center text-[10px] font-black text-slate-500 ${isAdminDark ? 'bg-[#343a40]' : 'bg-[#f8f9fa]'}`}>{d}</div>
                           ))}
                           {Array.from({ length: 35 }).map((_, i) => (
                             <div key={i} className={`h-16 p-1 flex flex-col justify-between ${isAdminDark ? 'bg-[#343a40]' : 'bg-white'} hover:bg-indigo-500/5 transition-colors`}>
                                <span className="text-[9px] text-slate-400 font-bold">{i % 31 + 1}</span>
                                {i === 12 && <div className="w-full h-1.5 bg-indigo-500 rounded-full shadow-sm"></div>}
                                {i === 24 && <div className="w-full h-1.5 bg-rose-500 rounded-full shadow-sm"></div>}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
                     <ShieldAlert size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Signal Quarantine</h3>
                    <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest mt-1">Pending Compliance Review: 9 Detected</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {posts.slice(0, 5).map(p => (
                    <div key={p.id} className={`rounded-3xl shadow-md border-t-4 border-rose-600 overflow-hidden ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border border-[#dee2e6]'}`}>
                       <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
                          <div className="flex-1 space-y-4">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <img src={p.authorAvatar} className="w-10 h-10 rounded-full border border-slate-200" />
                                   <div>
                                      <p className="text-sm font-bold uppercase tracking-tight">{p.author}</p>
                                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol ID: {p.id}</p>
                                   </div>
                                </div>
                                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest">Flagged by AI</span>
                             </div>
                             <p className={`text-sm leading-relaxed p-4 rounded-2xl border-2 border-dashed ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} font-medium`}>
                                "{p.content}"
                             </p>
                             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-2"><Eye size={14}/> {p.views} Scans</span>
                                <span className="flex items-center gap-2 text-rose-500"><AlertTriangle size={14}/> Policy Violation-X4</span>
                             </div>
                          </div>
                          <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
                             <button className="w-full bg-[#dc3545] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                <Trash2 size={16}/> Purge Signal
                             </button>
                             <button className="w-full bg-[#28a745] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110">
                                <CheckCircle2 size={16}/> Verify Compliance
                             </button>
                             <button onClick={() => handleSuspend(p.authorId)} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${isAdminDark ? 'border-white/10 hover:bg-white/5' : 'border-[#dee2e6] hover:bg-slate-50'}`}>
                                Suspend Node
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-12 animate-in slide-in-from-bottom-5 duration-500">
               <section className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                     <Sliders size={18} className="text-indigo-600" /> Infrastructure Toggles
                  </h4>
                  <div className={`rounded-3xl shadow-sm border ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'} overflow-hidden`}>
                     {[
                       { label: 'Public Registration Registry', desc: 'Allows new student nodes to established synchronization.', status: true },
                       { label: 'AI Signal Moderation Protocol', desc: 'Auto-scans all broadcasts for policy compliance.', status: true },
                       { label: 'Global Messaging Handshake', desc: 'Requires mutual connection before transmission.', status: false },
                     ].map((set, i) => (
                       <div key={i} className={`p-6 flex items-center justify-between border-b last:border-0 ${isAdminDark ? 'border-white/5' : 'border-[#dee2e6]'}`}>
                          <div>
                             <p className="font-bold text-sm tracking-tight">{set.label}</p>
                             <p className="text-[10px] font-medium opacity-60 uppercase mt-1">{set.desc}</p>
                          </div>
                          <button className={`w-12 h-6 rounded-full relative transition-all ${set.status ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${set.status ? 'right-1' : 'left-1'}`}></div>
                          </button>
                       </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                     <Lock size={18} className="text-rose-500" /> Core Security Protocols
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <button className={`p-6 rounded-3xl border text-left space-y-2 hover:border-indigo-600 transition-all ${isAdminDark ? 'bg-[#343a40] border-white/10' : 'bg-white border-[#dee2e6]'}`}>
                        <RefreshCcw className="text-indigo-600" size={24}/>
                        <p className="font-black text-[10px] uppercase tracking-widest">Force Global Sync</p>
                        <p className="text-[10px] opacity-60">Refresh all platform sessions and clear temporary caches.</p>
                     </button>
                     <button className={`p-6 rounded-3xl border text-left space-y-2 hover:border-rose-600 transition-all ${isAdminDark ? 'bg-[#343a40] border-white/10' : 'bg-white border-[#dee2e6]'}`}>
                        <Database className="text-rose-600" size={24}/>
                        <p className="font-black text-[10px] uppercase tracking-widest">Prune Orphan Nodes</p>
                        <p className="text-[10px] opacity-60">Remove identities that have not established signals in 12 months.</p>
                     </button>
                  </div>
               </section>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`h-14 border-t px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest transition-colors shrink-0 ${isAdminDark ? 'bg-[#343a40] border-[#4b545c] text-slate-400' : 'bg-white border-[#dee2e6] text-[#6c757d]'}`}>
           <div>
             Copyright &copy; 2025 <span className="text-indigo-600">MakSocial Engineering</span>.
           </div>
           <div className="hidden sm:block">
             System v3.5.0-STABLE / Build 29402
           </div>
        </footer>
      </div>

      {/* Admin Modals */}
      {showEventModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-xl p-10 rounded-[3rem] shadow-2xl border ${isAdminDark ? 'bg-[#343a40] border-[#4b545c]' : 'bg-white border-[#dee2e6]'}`}>
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black uppercase tracking-tighter italic">Initialize Global Signal</h2>
                 <button onClick={() => setShowEventModal(false)} className="p-2 hover:text-rose-500 transition-colors"><X size={28}/></button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500">Signal Title</label>
                    <input className={`w-full p-4 rounded-2xl outline-none focus:ring-1 focus:ring-indigo-600 border transition-all ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#dee2e6]'}`} placeholder="e.g. 89th Guild Inauguration"/>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase text-slate-500">Sync Date</label>
                       <input type="date" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#dee2e6]'}`}/>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase text-slate-500">Sync Time</label>
                       <input type="time" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isAdminDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-[#dee2e6]'}`}/>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500">Visual Asset</label>
                    <div className="flex gap-4">
                       <button className={`flex-1 p-6 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 hover:bg-indigo-600/5 hover:border-indigo-600 transition-all ${isAdminDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                          <ImageIcon size={24}/>
                          <span className="text-[9px] font-black uppercase">Ingest Flyer Signal</span>
                       </button>
                    </div>
                 </div>
                 <button className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition-all mt-6">Broadcast Ceremony to Hub</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
