
import React, { useState, useEffect } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { User, Post, CalendarEvent, Resource, UserStatus, College } from '../types';
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
  RotateCcw, ShieldX, Monitor, CheckCircle, Ban, UserCheck, 
  GraduationCap, Upload, Download, Save, HardDrive
} from 'lucide-react';

interface AdminProps {
  onToggleView?: () => void;
  onLogout?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onToggleView, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'academic' | 'ads' | 'moderation' | 'events' | 'explore' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // States for Modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isAddingResource, setIsAddingResource] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUsers(db.getUsers());
      setPosts(db.getPosts(undefined, true));
      setResources(db.getResources());
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

  const handleUpdateUser = () => {
    if (editingUser) {
      db.saveUser(editingUser);
      setUsers(db.getUsers());
      setEditingUser(null);
    }
  };

  const handleUpdateResource = () => {
    if (editingResource) {
      db.updateResource(editingResource);
      setResources(db.getResources());
      setEditingResource(null);
    }
  };

  const handleDeleteResource = (id: string) => {
    if (confirm("Delete this academic asset permanently?")) {
      db.deleteResource(id);
      setResources(db.getResources());
    }
  };

  const handleAddResource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRes: Resource = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      category: formData.get('category') as any,
      college: formData.get('college') as any,
      course: formData.get('course') as string,
      year: formData.get('year') as any,
      author: 'Admin',
      downloads: 0,
      fileType: 'PDF',
      timestamp: new Date().toISOString().split('T')[0]
    };
    db.addResource(newRes);
    setResources(db.getResources());
    setIsAddingResource(false);
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

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  return (
    <div className="flex h-screen w-full bg-[#454d55] text-white font-sans overflow-hidden">
      {/* AdminLTE Sidebar */}
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakAdmin <span className="font-light text-xs opacity-50 ml-1">v4.0</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'Nodes & Identity', icon: <Users size={18}/> },
              { id: 'academic', label: 'Academic Assets', icon: <HardDrive size={18}/> },
              { id: 'explore', label: 'Visual Audit', icon: <ImageIcon size={18}/> },
              { id: 'ads', label: 'Ad Campaigns', icon: <Megaphone size={18}/> },
              { id: 'events', label: 'Calendar Sync', icon: <Calendar size={18}/> },
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
           <button onClick={onLogout} className="w-full bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={14}/> {!isSidebarCollapsed && "Terminate Session"}
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#454d55]">
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b bg-[#343a40] border-[#4b545c]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-300 transition-colors"><Menu size={20}/></button>
            <h2 className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal Control / <span className="text-indigo-400">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Nominal</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 no-scrollbar bg-[#454d55]">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: 'Registered Nodes', val: users.length, icon: <Users size={48}/>, bg: 'bg-[#17a2b8]' },
                  { label: 'Academic Assets', val: resources.length, icon: <HardDrive size={48}/>, bg: 'bg-[#28a745]' },
                  { label: 'Audit Required', val: allImages.length, icon: <ImageIcon size={48}/>, bg: 'bg-[#ffc107]', text: 'text-dark' },
                  { label: 'Campaign Reach', val: '1.2M', icon: <Zap size={48}/>, bg: 'bg-[#dc3545]' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.text === 'text-dark' ? 'text-[#212529]' : 'text-white'} rounded shadow-lg overflow-hidden flex flex-col justify-between h-32 group relative transition-transform hover:translate-y-[-2px]`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-black leading-tight">{box.val}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">{box.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="rounded bg-[#343a40] shadow-md border-t-4 border-indigo-500 overflow-hidden">
                  <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><BarChart2 size={16}/> Interaction Density</h3>
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
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#343a40] rounded shadow-md border-t-4 border-indigo-500 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
               <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Global Node Directory</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="border-b bg-white/5 border-white/10 text-slate-500">
                      <tr>
                        <th className="p-4 font-black text-[9px]">Node Identity</th>
                        <th className="p-4 font-black text-[9px]">Rank/Role</th>
                        <th className="p-4 font-black text-[9px]">Status</th>
                        <th className="p-4 font-black text-[9px]">Authorization</th>
                        <th className="p-4 font-black text-[9px] text-center">Protocol Command</th>
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
                          <td className="p-4">
                             <p className="text-indigo-400 font-black">{u.role}</p>
                             <p className="text-[8px] text-slate-500">{u.status}</p>
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               u.accountStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                               u.accountStatus === 'Suspended' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                             }`}>
                               {u.accountStatus || 'Active'}
                             </span>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-wrap gap-1">
                                {u.badges.includes('Super Admin') && <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[7px] font-black">ROOT</span>}
                                {u.accountStatus === 'Active' ? <CheckCircle size={14} className="text-emerald-500"/> : <Ban size={14} className="text-rose-500"/>}
                             </div>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => setEditingUser(u)} className="p-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded transition-all" title="Edit Identity"><Edit3 size={14}/></button>
                                <button className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded transition-all" title="Verify Node"><UserCheck size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
               <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Central Academic Asset Vault</h3>
                  <button onClick={() => setIsAddingResource(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Plus size={14}/> Add New Asset
                  </button>
               </div>
               <div className="bg-[#343a40] rounded shadow-md border-t-4 border-emerald-500 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                      <thead className="border-b bg-white/5 border-white/10 text-slate-500">
                        <tr>
                          <th className="p-4 font-black text-[9px]">Asset Protocol</th>
                          <th className="p-4 font-black text-[9px]">Classification</th>
                          <th className="p-4 font-black text-[9px]">Wing/Unit</th>
                          <th className="p-4 font-black text-[9px]">Logs</th>
                          <th className="p-4 font-black text-[9px] text-center">Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {resources.map(res => (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded"><FileText size={18}/></div>
                                  <div>
                                     <p className="text-white font-black">{res.title}</p>
                                     <p className="text-[8px] text-slate-500">{res.author}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4">
                               <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[8px] font-black">{res.category}</span>
                            </td>
                            <td className="p-4">
                               <p className="text-slate-300">{res.college}</p>
                               <p className="text-[8px] text-slate-500">{res.course}</p>
                            </td>
                            <td className="p-4 text-slate-400">{res.downloads} Scans</td>
                            <td className="p-4">
                               <div className="flex items-center justify-center gap-1.5">
                                  <button onClick={() => setEditingResource(res)} className="p-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded transition-all"><Edit3 size={14}/></button>
                                  <button onClick={() => handleDeleteResource(res.id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded transition-all"><Trash2 size={14}/></button>
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

          {activeTab === 'explore' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Visual Asset Audit</h3>
                  <div className="flex gap-2">
                    <button className="bg-rose-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Mass Purge Blocked</button>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allImages.map(post => (
                  <div key={post.id} className="group relative bg-[#343a40] rounded-2xl overflow-hidden border border-[#4b545c] shadow-lg transition-all hover:border-indigo-500">
                    <div className="aspect-square overflow-hidden bg-black/20">
                      <img src={post.images?.[0]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                       <p className="text-[9px] font-black text-white uppercase tracking-widest mb-1">{post.author}</p>
                       <div className="flex gap-2 mt-4">
                          <button onClick={() => handlePurgePost(post.id)} className="flex-1 bg-rose-600 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-all"><Trash2 size={12}/> Purge</button>
                          <button className="flex-1 bg-[#28a745] py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-all"><ShieldCheck size={12}/> Verify</button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Identity Management Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-[#343a40] w-full max-w-lg rounded-xl shadow-2xl border border-[#4b545c] overflow-hidden">
              <div className="p-6 border-b border-[#4b545c] flex justify-between items-center">
                 <h3 className="text-[12px] font-black uppercase tracking-widest">Identity Override: {editingUser.name}</h3>
                 <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Status</label>
                    <select 
                      className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm outline-none font-bold"
                      value={editingUser.accountStatus || 'Active'}
                      onChange={e => setEditingUser({...editingUser, accountStatus: e.target.value as any})}
                    >
                       <option value="Active">Active Pulse</option>
                       <option value="Inactive">Signal Terminated (Inactive)</option>
                       <option value="Suspended">Node Suspended</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rank / Academic Level</label>
                    <select 
                      className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm outline-none font-bold"
                      value={editingUser.status}
                      onChange={e => setEditingUser({...editingUser, status: e.target.value as UserStatus})}
                    >
                       {['Year 1', 'Year 2', 'Finalist', 'Masters', 'Graduate'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Permissions (Role)</label>
                    <input 
                       className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm outline-none font-bold"
                       value={editingUser.role}
                       onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                    />
                 </div>
              </div>
              <div className="p-6 bg-[#2a2e33] flex justify-end gap-3">
                 <button onClick={() => setEditingUser(null)} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                 <button onClick={handleUpdateUser} className="px-6 py-2 bg-indigo-600 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">Commit Identity Changes</button>
              </div>
           </div>
        </div>
      )}

      {/* Academic Asset Modal */}
      {(editingResource || isAddingResource) && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-[#343a40] w-full max-w-lg rounded-xl shadow-2xl border border-[#4b545c] overflow-hidden">
              <form onSubmit={isAddingResource ? handleAddResource : (e) => { e.preventDefault(); handleUpdateResource(); }}>
                <div className="p-6 border-b border-[#4b545c] flex justify-between items-center">
                   <h3 className="text-[12px] font-black uppercase tracking-widest">{isAddingResource ? 'Initialize Academic Asset' : 'Modify Asset Registry'}</h3>
                   <button type="button" onClick={() => { setEditingResource(null); setIsAddingResource(false); }} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Protocol Title</label>
                      <input name="title" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm outline-none font-bold" value={editingResource?.title || ''} onChange={e => editingResource && setEditingResource({...editingResource, title: e.target.value})} placeholder="e.g. Past Paper 2024" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Classification</label>
                        <select name="category" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-xs outline-none font-bold" value={editingResource?.category || 'Test'} onChange={e => editingResource && setEditingResource({...editingResource, category: e.target.value as any})}>
                          {['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Wing Unit</label>
                        <select name="college" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-xs outline-none font-bold" value={editingResource?.college || 'COCIS'} onChange={e => editingResource && setEditingResource({...editingResource, college: e.target.value as any})}>
                          {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Course Registry Code</label>
                      <input name="course" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm outline-none font-bold" value={editingResource?.course || ''} onChange={e => editingResource && setEditingResource({...editingResource, course: e.target.value})} placeholder="e.g. BSCS" />
                   </div>
                </div>
                <div className="p-6 bg-[#2a2e33] flex justify-end gap-3">
                   <button type="button" onClick={() => { setEditingResource(null); setIsAddingResource(false); }} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                   <button type="submit" className="px-6 py-2 bg-emerald-600 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">Synchronize Asset</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
