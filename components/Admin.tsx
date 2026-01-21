
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, CalendarEvent } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, MessageCircle, Eye, Plus, 
  DollarSign, Calendar, Youtube, Zap, X, FileText, BarChart2, 
  ShieldCheck, UserMinus, LayoutDashboard, Settings, Database, 
  ChevronRight, Search, Menu, Bell, ArrowRight, LogOut, Globe, 
  CheckCircle2, Megaphone, Sliders, Lock, RefreshCcw, 
  Image as ImageIcon, Edit3, ChevronLeft, MoreVertical, Flag,
  RotateCcw, ShieldX, Monitor
} from 'lucide-react';

interface AdminProps {
  onToggleView?: () => void;
  onLogout?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onToggleView, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'ads' | 'moderation' | 'events' | 'explore' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Forced Admin Dark Theme (AdminLTE Classic Dark)
  const isAdminDark = true;

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePurgePost = (postId: string) => {
    if (confirm("Execute signal purge? This will remove the broadcast from all hub registries.")) {
      db.deletePost(postId, 'admin');
      setPosts(db.getPosts(undefined, true));
    }
  };

  const handleRestorePost = (post: Post) => {
    // In this mock, we just alert, but usually we'd toggle a 'hidden' flag
    alert("Post integrity verified. Signal restored to public stream.");
  };

  const allImages = posts.filter(p => p.images && p.images.length > 0);

  const chartData = [
    { name: 'Mon', visits: 400, posts: 240 },
    { name: 'Tue', visits: 300, posts: 139 },
    { name: 'Wed', visits: 200, posts: 980 },
    { name: 'Thu', visits: 278, posts: 390 },
    { name: 'Fri', visits: 189, posts: 480 },
    { name: 'Sat', visits: 239, posts: 380 },
    { name: 'Sun', visits: 349, posts: 430 },
  ];

  const collegeData = [
    { name: 'COCIS', value: 450 },
    { name: 'CEDAT', value: 300 },
    { name: 'CHUSS', value: 200 },
    { name: 'LAW', value: 150 },
  ];

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  return (
    <div className="flex h-screen w-full bg-[#454d55] text-white font-sans overflow-hidden">
      {/* AdminLTE Sidebar - Always Dark */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light text-xs opacity-50 ml-1">v3.5</span></span>}
        </div>

        <div className="p-4 flex items-center border-b border-[#4b545c] shrink-0">
          <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8 rounded-full bg-white p-1 mr-3 shrink-0" />
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate uppercase tracking-tighter">Identity: Admin-01</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] uppercase font-black text-[#c2c7d0] tracking-widest">Active Link</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'Node Registry', icon: <Users size={18}/> },
              { id: 'explore', label: 'Visual Audit', icon: <ImageIcon size={18}/> }, // User requested 'Explore' in admin
              { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone size={18}/> },
              { id: 'events', label: 'Calendar Sync', icon: <Calendar size={18}/> },
              { id: 'moderation', label: 'Signal Filter', icon: <Flag size={18}/> },
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
           <button onClick={onToggleView} className="w-full bg-[#6c757d] hover:bg-indigo-600 text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <Monitor size={14}/> {!isSidebarCollapsed && "Switch to Client"}
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#454d55]">
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b bg-[#343a40] border-[#4b545c]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-300 transition-colors"><Menu size={20}/></button>
            <nav className="hidden md:flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <button onClick={onToggleView} className="hover:text-white transition-colors">Home</button>
              <button className="hover:text-white transition-colors">Contact Hub</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-white/5 rounded text-slate-300">
              <Bell size={18}/>
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#ffc107] text-white text-[8px] flex items-center justify-center rounded-full font-bold">12</span>
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-rose-500/20 rounded text-rose-500 transition-all active:scale-95"><LogOut size={18}/></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 no-scrollbar bg-[#454d55]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light uppercase tracking-tighter">{activeTab} <span className="text-slate-500 font-black text-[10px] uppercase ml-2 tracking-[0.3em]">Authorized Session</span></h1>
            <nav className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-indigo-400">Admin</button>
              <ChevronRight size={12}/>
              <span className="text-slate-300">{activeTab}</span>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: 'Active Nodes', val: users.length, icon: <Users size={48}/>, bg: 'bg-[#17a2b8]', link: 'users' },
                  { label: 'Network Pulse', val: '92%', icon: <Activity size={48}/>, bg: 'bg-[#28a745]', link: 'moderation' },
                  { label: 'Pending Audits', val: allImages.length, icon: <ImageIcon size={48}/>, bg: 'bg-[#ffc107]', text: 'text-dark', link: 'explore' },
                  { label: 'Revenue (UGX)', val: '1.2M', icon: <DollarSign size={48}/>, bg: 'bg-[#dc3545]', link: 'ads' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.text === 'text-dark' ? 'text-[#212529]' : 'text-white'} rounded shadow-lg overflow-hidden flex flex-col justify-between h-32 lg:h-36 group relative transition-transform hover:translate-y-[-2px]`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl lg:text-4xl font-black leading-tight">{box.val}</h3>
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-80">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">{box.icon}</div>
                    </div>
                    <button 
                      onClick={() => box.link && setActiveTab(box.link as any)}
                      className="w-full py-1.5 bg-black/10 hover:bg-black/20 text-center text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      Inspect Data <ArrowRight size={12}/>
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded bg-[#343a40] shadow-md border-t-4 border-indigo-500 overflow-hidden">
                  <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><BarChart2 size={16}/> Protocol Engagement</h3>
                  </div>
                  <div className="p-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b545c" />
                        <XAxis dataKey="name" stroke="#c2c7d0" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#c2c7d0" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#343a40', border: '1px solid #4b545c', color: '#fff' }} />
                        <Area type="monotone" dataKey="visits" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded bg-[#343a40] shadow-md border-t-4 border-[#ffc107] overflow-hidden">
                   <div className="p-4 border-b border-[#4b545c]">
                     <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><Globe size={16}/> Wing Sync</h3>
                   </div>
                   <div className="p-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={collegeData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          {collegeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg"><ImageIcon size={24}/></div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight italic">Visual Asset Audit</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Found {allImages.length} Broadcast Signals containing Imagery</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="bg-[#28a745] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Verify All</button>
                    <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Purge Blocked</button>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allImages.map(post => (
                  <div key={post.id} className="group relative bg-[#343a40] rounded-2xl overflow-hidden border border-[#4b545c] shadow-lg transition-all hover:border-indigo-500 hover:shadow-indigo-500/10">
                    <div className="aspect-square overflow-hidden bg-black/20">
                      <img src={post.images?.[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                       <p className="text-[9px] font-black text-white uppercase tracking-widest mb-1">{post.author}</p>
                       <p className="text-[10px] font-medium text-slate-300 line-clamp-2 leading-tight italic">"{post.content}"</p>
                       <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handlePurgePost(post.id)}
                            className="flex-1 bg-rose-600 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-all"
                          >
                            <Trash2 size={12}/> Purge
                          </button>
                          <button 
                            onClick={() => handleRestorePost(post)}
                            className="flex-1 bg-[#28a745] py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-all"
                          >
                            <ShieldCheck size={12}/> Verify
                          </button>
                       </div>
                    </div>
                    
                    <div className="absolute top-2 right-2">
                       <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${post.isAd ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'}`}>
                         {post.isAd ? 'Campaign' : 'Pulse'}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {allImages.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <ShieldX size={64} className="text-slate-600 mx-auto" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Visual Registry Empty</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#343a40] rounded shadow-md border-t-4 border-indigo-500 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
               <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Global Node Directory</h3>
                  <div className="flex gap-2">
                     <div className="relative hidden sm:block">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                       <input className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded text-[11px] font-bold outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white" placeholder="Scan registry..."/>
                     </div>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="border-b bg-white/5 border-white/10 text-slate-500">
                      <tr>
                        <th className="p-4 font-black text-[9px]">Identity</th>
                        <th className="p-4 font-black text-[9px]">Wing</th>
                        <th className="p-4 font-black text-[9px]">Rank</th>
                        <th className="p-4 font-black text-[9px]">Authorization</th>
                        <th className="p-4 font-black text-[9px] text-center">Command</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-500/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-9 h-9 rounded border border-white/10" />
                              <div className="min-w-0">
                                <p className="text-white font-black">{u.name}</p>
                                <p className="text-[8px] text-slate-500 lowercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-400">{u.college}</td>
                          <td className="p-4 text-indigo-400">{u.role}</td>
                          <td className="p-4">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black ${u.badges.includes('Super Admin') ? 'bg-indigo-600 text-white' : 'bg-[#28a745]/20 text-[#28a745]'}`}>Authorized</span>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center justify-center gap-1.5">
                                <button className="p-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded transition-all"><ShieldCheck size={14}/></button>
                                <button className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded transition-all"><UserMinus size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-5 duration-500">
               <div className="bg-[#343a40] p-6 rounded-xl border-l-4 border-indigo-500 shadow-md">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2 mb-6">
                    <Sliders size={18} /> Global System Logic
                  </h4>
                  <div className="space-y-4">
                     {[
                       { label: 'Signal Encryption Protocol', status: true },
                       { label: 'Automated AI Moderation', status: true },
                       { label: 'Guest Node Access', status: false }
                     ].map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-xs font-bold uppercase">{s.label}</span>
                          <button className={`w-10 h-5 rounded-full relative ${s.status ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${s.status ? 'right-1' : 'left-1'}`}></div>
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="p-6 bg-[#343a40] border border-[#4b545c] rounded-xl hover:border-indigo-500 transition-all text-left group">
                    <RefreshCcw className="text-indigo-500 mb-4 group-hover:rotate-180 transition-transform duration-700" size={24}/>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Registry Resync</h5>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">Rebuild the global hub indices and clear cache.</p>
                  </button>
                  <button className="p-6 bg-[#343a40] border border-[#4b545c] rounded-xl hover:border-rose-500 transition-all text-left group">
                    <Database className="text-rose-500 mb-4 group-hover:scale-110 transition-transform" size={24}/>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Flush Signal Logs</h5>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">Clear all ephemeral interaction records older than 30d.</p>
                  </button>
               </div>
            </div>
          )}
        </main>

        <footer className="h-14 border-t px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-[#343a40] border-[#4b545c] text-slate-500">
           <div>
             Eng: <span className="text-indigo-500">MakSocial-Terminal</span>
           </div>
           <div className="hidden sm:block">
             System Status: <span className="text-emerald-500">Optimized</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Admin;
