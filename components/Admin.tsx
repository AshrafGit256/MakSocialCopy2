
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, College, CalendarEvent } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, 
  MessageCircle, Eye, Plus, Clock,
  DollarSign, Calendar, Youtube, History, Heart, User as UserIcon, Zap, X,
  FileText, BarChart2, AlertTriangle, ShieldCheck, UserMinus, 
  LayoutDashboard, List, Settings, Database, Server, Terminal,
  ChevronRight, Search, Menu, Bell, ArrowRight, UserPlus, Download
} from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'timeline' | 'reports'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock Chart Data
  const chartData = [
    { name: 'Mon', visits: 400, posts: 240 },
    { name: 'Tue', visits: 300, posts: 139 },
    { name: 'Wed', visits: 200, posts: 980 },
    { name: 'Thu', visits: 278, posts: 390 },
    { name: 'Fri', visits: 189, posts: 480 },
    { name: 'Sat', visits: 239, posts: 380 },
    { name: 'Sun', visits: 349, posts: 430 },
  ];

  const handleVerify = (uid: string) => {
    db.toggleVerification(uid);
    setUsers(db.getUsers());
  };

  const handleSuspend = (uid: string) => {
    if(confirm("Confirm temporary node deactivation?")) {
      db.suspendUser(uid, 7);
      setUsers(db.getUsers());
    }
  };

  return (
    <div className="flex h-full bg-[#f4f6f9] text-[#212529] font-sans">
      {/* AdminLTE Dark Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c]">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <Terminal size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light">v3.2</span></span>}
        </div>

        <div className="p-4 flex items-center border-b border-[#4b545c]">
          <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full bg-white p-1 mr-3 shrink-0" />
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Platform Architect</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] uppercase font-bold text-[#c2c7d0]">Online</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'User Management', icon: <Users size={18}/> },
              { id: 'timeline', label: 'System Timeline', icon: <History size={18}/> },
              { id: 'reports', label: 'Analytics Reports', icon: <BarChart2 size={18}/> },
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-3 py-2.5 rounded transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {!isSidebarCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-14 bg-white border-b border-[#dee2e6] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-black/5 rounded text-[#495057]"><Menu size={20}/></button>
            <nav className="hidden md:flex gap-4 text-sm font-medium text-[#495057]">
              <button className="hover:text-indigo-600">Home</button>
              <button className="hover:text-indigo-600">Contact</button>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[#495057]">
            <button className="relative p-2 hover:bg-black/5 rounded"><Search size={20}/></button>
            <button className="relative p-2 hover:bg-black/5 rounded">
              <MessageCircle size={20}/>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#dc3545] text-white text-[9px] flex items-center justify-center rounded-full font-bold">3</span>
            </button>
            <button className="relative p-2 hover:bg-black/5 rounded">
              <Bell size={20}/>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ffc107] text-white text-[9px] flex items-center justify-center rounded-full font-bold">15</span>
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-normal text-[#212529] capitalize">{activeTab}</h1>
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
              <span className="hover:text-indigo-600 cursor-pointer">Admin</span>
              <ChevronRight size={12}/>
              <span className="text-[#6c757d]">{activeTab}</span>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Info Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'New Nodes', val: users.length, icon: <Users size={32}/>, bg: 'bg-[#17a2b8]', labelColor: 'text-white' },
                  { label: 'Total Broadcasts', val: posts.length, icon: <Activity size={32}/>, bg: 'bg-[#28a745]', labelColor: 'text-white' },
                  { label: 'Node Registry', val: '44', icon: <UserIcon size={32}/>, bg: 'bg-[#ffc107]', labelColor: 'text-[#212529]' },
                  { label: 'System Alerts', val: '65', icon: <ShieldAlert size={32}/>, bg: 'bg-[#dc3545]', labelColor: 'text-white' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.labelColor} rounded shadow-md relative overflow-hidden flex flex-col justify-between h-32`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold">{box.val}</h3>
                        <p className="text-sm opacity-90">{box.label}</p>
                      </div>
                      <div className="opacity-20 translate-x-4 -translate-y-2">{box.icon}</div>
                    </div>
                    <button className="w-full py-1 bg-black/10 hover:bg-black/20 text-center text-xs font-medium flex items-center justify-center gap-2">
                      More info <ArrowRight size={12}/>
                    </button>
                  </div>
                ))}
              </div>

              {/* Charts & Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Graph Card */}
                <div className="bg-white border-t-4 border-indigo-500 rounded shadow-md overflow-hidden">
                  <div className="p-4 border-b border-[#dee2e6] flex items-center justify-between">
                    <h3 className="text-lg font-medium flex items-center gap-2"><BarChart2 size={18}/> Engagement Signals</h3>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-[#f8f9fa] border border-[#ced4da] rounded text-[10px] uppercase font-bold text-[#6c757d]">Week</button>
                      <button className="px-2 py-1 bg-[#f8f9fa] border border-[#ced4da] rounded text-[10px] uppercase font-bold text-[#6c757d]">Month</button>
                    </div>
                  </div>
                  <div className="p-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Signal Traffic Card */}
                <div className="bg-white border-t-4 border-[#28a745] rounded shadow-md overflow-hidden">
                   <div className="p-4 border-b border-[#dee2e6]">
                     <h3 className="text-lg font-medium flex items-center gap-2"><Server size={18}/> Node Traffic</h3>
                   </div>
                   <div className="p-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="posts" fill="#28a745" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                   </div>
                </div>
              </div>

              {/* Recent Nodes Card */}
              <div className="bg-white border-t-4 border-indigo-500 rounded shadow-md overflow-hidden">
                 <div className="p-4 border-b border-[#dee2e6]">
                   <h3 className="text-lg font-medium flex items-center gap-2"><Database size={18}/> Latest Node Registrations</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-[#f8f9fa] border-b border-[#dee2e6]">
                          <tr>
                             <th className="p-4 font-bold text-[#495057]">ID</th>
                             <th className="p-4 font-bold text-[#495057]">Node</th>
                             <th className="p-4 font-bold text-[#495057]">Status</th>
                             <th className="p-4 font-bold text-[#495057]">Intelligence</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#dee2e6]">
                          {users.slice(0, 5).map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 text-[#007bff] font-medium">{u.id.substring(0, 8)}</td>
                               <td className="p-4 flex items-center gap-3">
                                  <img src={u.avatar} className="w-8 h-8 rounded-full border border-slate-200" />
                                  <div>
                                    <p className="font-bold">{u.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{u.college}</p>
                                  </div>
                               </td>
                               <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.isVerified ? 'bg-[#28a745] text-white' : 'bg-[#6c757d] text-white'}`}>
                                    {u.isVerified ? 'Verified' : 'Pending'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                     <div className="flex-1 bg-slate-100 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(u.iqCredits / 10000) * 100}%` }}></div>
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-500">{u.iqCredits} IQ</span>
                                  </div>
                                </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-4 border-t border-[#dee2e6] bg-[#f8f9fa] text-center">
                    <button className="text-sm font-bold text-indigo-600 hover:underline">View All Users</button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white border-t-4 border-indigo-500 rounded shadow-md overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
               <div className="p-4 border-b border-[#dee2e6] flex items-center justify-between">
                  <h3 className="text-lg font-medium">Node Registry Management</h3>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input className="pl-9 pr-4 py-1.5 border border-[#ced4da] rounded text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Search registry..."/>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8f9fa] border-b border-[#dee2e6]">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">College</th>
                        <th className="p-4">Rank</th>
                        <th className="p-4">Protocol Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dee2e6]">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-10 h-10 rounded-lg border border-slate-200" />
                              <div className="min-w-0">
                                <p className="font-bold text-[#212529]">{u.name}</p>
                                <p className="text-[10px] text-[#6c757d] uppercase truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                             <p className="font-bold text-[#495057]">{u.college}</p>
                             <p className="text-[10px] uppercase text-slate-500">{u.courseAbbr}</p>
                          </td>
                          <td className="p-4">
                             <span className="text-xs font-bold text-indigo-600 uppercase">{u.role}</span>
                          </td>
                          <td className="p-4">
                             {u.isSuspended ? (
                               <span className="bg-[#dc3545] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Deactivated</span>
                             ) : (
                               <span className="bg-[#28a745] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active</span>
                             )}
                          </td>
                          <td className="p-4">
                             <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleVerify(u.id)} className="p-2 bg-[#007bff]/10 text-[#007bff] hover:bg-[#007bff] hover:text-white rounded transition-colors" title="Verify Node"><ShieldCheck size={16}/></button>
                                <button onClick={() => handleSuspend(u.id)} className="p-2 bg-[#dc3545]/10 text-[#dc3545] hover:bg-[#dc3545] hover:text-white rounded transition-colors" title="Deactivate"><UserMinus size={16}/></button>
                                <button className="p-2 bg-[#6c757d]/10 text-[#6c757d] hover:bg-[#6c757d] hover:text-white rounded transition-colors" title="Edit Properties"><Settings size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-5 duration-500">
               <h3 className="text-xl font-bold border-b border-[#dee2e6] pb-4">Global System Events</h3>
               
               <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#dee2e6]">
                  {[
                    { type: 'user', time: '5 mins ago', title: 'New Peer Node Registered', content: 'Ashraf Guru synchronized with the COCIS wing.', icon: <UserPlus size={14}/>, color: 'bg-[#17a2b8]' },
                    { type: 'post', time: '12 mins ago', title: 'Official Broadcast Decrypted', content: 'Guild EC published 89th Inauguration protocol.', icon: <Zap size={14}/>, color: 'bg-[#ffc107]' },
                    { type: 'alert', time: '1 hour ago', title: 'Content Security Filter Triggered', content: 'AI model blocked a non-compliant broadcast in the Global hub.', icon: <AlertTriangle size={14}/>, color: 'bg-[#dc3545]' },
                    { type: 'admin', time: '2 hours ago', title: 'Registry Backup Verified', content: 'System state archived to University central servers.', icon: <Database size={14}/>, color: 'bg-[#6c757d]' },
                    { type: 'stat', time: '3 hours ago', title: 'Engagement Threshold Reached', content: 'Platform traffic exceeded 15,000 active pulses today.', icon: <Activity size={14}/>, color: 'bg-[#28a745]' },
                  ].map((evt, i) => (
                    <div key={i} className="relative">
                       <div className={`absolute -left-11 top-0 w-8 h-8 ${evt.color} text-white rounded-full flex items-center justify-center shadow z-10`}>
                          {evt.icon}
                       </div>
                       <div className="bg-white rounded shadow-sm border border-[#dee2e6] overflow-hidden">
                          <div className="p-3 border-b border-[#dee2e6] flex items-center justify-between">
                             <h4 className="text-sm font-bold text-[#212529]">{evt.title}</h4>
                             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10}/> {evt.time}</span>
                          </div>
                          <div className="p-4 text-sm text-[#495057]">
                             {evt.content}
                          </div>
                          <div className="p-2 bg-[#f8f9fa] border-t border-[#dee2e6] flex gap-2">
                             <button className="text-[10px] font-bold text-indigo-600 bg-white border border-[#ced4da] px-2 py-1 rounded hover:bg-slate-50 transition-colors">Inspect Signal</button>
                             <button className="text-[10px] font-bold text-rose-500 bg-white border border-[#ced4da] px-2 py-1 rounded hover:bg-slate-50 transition-colors">Dismiss</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="text-center py-10">
                  <button className="bg-[#6c757d] text-white px-8 py-2.5 rounded text-sm font-bold shadow-md hover:bg-[#5a6268] transition-colors">Load Archive Events</button>
               </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="py-20 text-center space-y-8 animate-in zoom-in duration-700">
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#dee2e6] text-slate-300">
                  <BarChart2 size={56} className="animate-pulse" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-[#6c757d]">Module Registry Under Sync</h3>
                  <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm mx-auto">Analytical reports and automated forensic outputs are currently being generated for the weekly governance audit.</p>
                  <button className="mt-8 bg-indigo-600 text-white px-10 py-3 rounded text-sm font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto">
                    <Download size={16}/> Force Signal Export
                  </button>
               </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="h-14 bg-white border-t border-[#dee2e6] px-6 flex items-center justify-between text-sm text-[#495057] shrink-0">
           <div>
             <span className="font-bold">Copyright &copy; 2025 <span className="text-indigo-600">MakSocial</span>.</span> All nodes secured.
           </div>
           <div className="hidden sm:block">
             <span className="font-bold">Version</span> 3.2.0-stable
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Admin;
