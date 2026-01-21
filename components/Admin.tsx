
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, Resource, UserStatus, College, AuthorityRole } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, Activity, ShieldAlert, Trash2, Plus, 
  DollarSign, Calendar, Zap, X, FileText, BarChart2, 
  ShieldCheck, LayoutDashboard, Settings, Database, 
  Menu, Bell, LogOut, Globe, Sliders, RefreshCcw, 
  Image as ImageIcon, Edit3, Flag, CheckCircle, 
  Ban, UserCheck, GraduationCap, HardDrive, Search
} from 'lucide-react';

interface AdminProps {
  onToggleView?: () => void;
  onLogout?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'academic' | 'explore' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true));
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const handleUpdateUser = () => {
    if (editingUser) {
      db.saveUser(editingUser);
      setUsers(db.getUsers());
      setEditingUser(null);
    }
  };

  const handleDeleteResource = (id: string) => {
    if (confirm("Permanently delete this academic asset?")) {
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
    { name: 'Mon', visits: 400 }, { name: 'Tue', visits: 300 }, { name: 'Wed', visits: 200 },
    { name: 'Thu', visits: 278 }, { name: 'Fri', visits: 189 }, { name: 'Sat', visits: 239 },
    { name: 'Sun', visits: 349 }
  ];

  return (
    <div className="flex h-screen w-full bg-[#454d55] text-white font-sans overflow-hidden">
      <aside className={`bg-[#343a40] text-[#c2c7d0] transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center px-4 border-b border-[#4b545c] shrink-0">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {!isSidebarCollapsed && <span className="font-bold text-lg text-white uppercase tracking-tight">MakTerminal <span className="font-light text-xs opacity-50 ml-1">v4.5</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="space-y-1 px-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'users', label: 'User Registry', icon: <Users size={18}/> },
              { id: 'academic', label: 'Academic Vault', icon: <HardDrive size={18}/> },
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
              <LogOut size={14}/> {!isSidebarCollapsed && "Logout Terminal"}
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#454d55]">
        <header className="h-14 flex items-center justify-between px-4 shrink-0 border-b bg-[#343a40] border-[#4b545c]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-white/5 rounded text-slate-300 transition-colors"><Menu size={20}/></button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Root Access / <span className="text-indigo-400">{activeTab}</span></h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status: Nominal</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 no-scrollbar bg-[#454d55]">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Nodes', val: users.length, icon: <Users size={48}/>, bg: 'bg-[#17a2b8]' },
                  { label: 'Academic Assets', val: resources.length, icon: <HardDrive size={48}/>, bg: 'bg-[#28a745]' },
                  { label: 'Media Flags', val: allImages.length, icon: <ImageIcon size={48}/>, bg: 'bg-[#ffc107]', text: 'text-dark' },
                  { label: 'Network Pulse', val: 'Active', icon: <Activity size={48}/>, bg: 'bg-[#dc3545]' },
                ].map((box, i) => (
                  <div key={i} className={`${box.bg} ${box.text === 'text-dark' ? 'text-[#212529]' : 'text-white'} rounded shadow-lg overflow-hidden flex flex-col justify-between h-32 group relative transition-transform hover:translate-y-[-2px]`}>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-black leading-tight">{box.val}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{box.label}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-10 transition-transform">{box.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="rounded bg-[#343a40] shadow-md border-t-4 border-indigo-500 overflow-hidden">
                <div className="p-4 border-b border-[#4b545c]">
                  <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><BarChart2 size={16}/> Traffic Density</h3>
                </div>
                <div className="p-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b545c" />
                      <XAxis dataKey="name" stroke="#c2c7d0" fontSize={10} />
                      <YAxis stroke="#c2c7d0" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="visits" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-[#343a40] rounded shadow-md border-t-4 border-indigo-500 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
               <div className="p-4 border-b border-[#4b545c] flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Global Identity Registry</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                    <thead className="border-b bg-white/5 border-white/10 text-slate-500">
                      <tr>
                        <th className="p-4 font-black text-[9px]">Node</th>
                        <th className="p-4 font-black text-[9px]">Rank</th>
                        <th className="p-4 font-black text-[9px]">Account Status</th>
                        <th className="p-4 font-black text-[9px]">Auth</th>
                        <th className="p-4 font-black text-[9px] text-center">Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-500/5">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-9 h-9 rounded" />
                              <div className="min-w-0">
                                <p className="text-white font-black">{u.name}</p>
                                <p className="text-[8px] text-slate-500 lowercase">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-indigo-400 font-black">{u.role}</td>
                          <td className="p-4">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               u.accountStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                               u.accountStatus === 'Suspended' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                             }`}>
                               {u.accountStatus || 'Active'}
                             </span>
                          </td>
                          <td className="p-4">
                             {u.verified ? <CheckCircle size={14} className="text-emerald-500"/> : <Ban size={14} className="text-slate-500"/>}
                          </td>
                          <td className="p-4">
                             <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => setEditingUser(u)} className="p-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded transition-all"><Edit3 size={14}/></button>
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
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Academic Asset Repository</h3>
                  <button onClick={() => setIsAddingResource(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                    <Plus size={14}/> Add New Asset
                  </button>
               </div>
               <div className="bg-[#343a40] rounded shadow-md border-t-4 border-emerald-500 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                      <thead className="border-b bg-white/5 border-white/10 text-slate-500">
                        <tr>
                          <th className="p-4 font-black text-[9px]">Asset</th>
                          <th className="p-4 font-black text-[9px]">Category</th>
                          <th className="p-4 font-black text-[9px]">Wing</th>
                          <th className="p-4 font-black text-[9px] text-center">Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {resources.map(res => (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <FileText size={18} className="text-emerald-500"/>
                                  <div>
                                     <p className="text-white font-black">{res.title}</p>
                                     <p className="text-[8px] text-slate-500">{res.course}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4 text-amber-500 font-black">{res.category}</td>
                            <td className="p-4 text-slate-300">{res.college}</td>
                            <td className="p-4">
                               <div className="flex items-center justify-center gap-1.5">
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
              <h3 className="text-xl font-black uppercase tracking-tight italic">Visual Signal Audit</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allImages.map(post => (
                  <div key={post.id} className="group relative bg-[#343a40] rounded-xl overflow-hidden border border-[#4b545c]">
                    <img src={post.images?.[0]} className="w-full aspect-square object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                       <button onClick={() => db.deletePost(post.id, 'admin')} className="w-full bg-rose-600 py-2 rounded text-[9px] font-black uppercase">Purge Signal</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-[#343a40] w-full max-w-lg rounded-xl shadow-2xl border border-[#4b545c] overflow-hidden">
              <div className="p-6 border-b border-[#4b545c] flex justify-between items-center">
                 <h3 className="text-[12px] font-black uppercase tracking-widest">Protocol Override: {editingUser.name}</h3>
                 <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operational Status</label>
                    <select className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm font-bold" value={editingUser.accountStatus || 'Active'} onChange={e => setEditingUser({...editingUser, accountStatus: e.target.value as any})}>
                       <option value="Active">Active</option>
                       <option value="Inactive">Inactive</option>
                       <option value="Suspended">Suspended</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rank Assignment</label>
                    <select className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm font-bold" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as AuthorityRole})}>
                       {['Student', 'Graduate', 'Alumni', 'Lecturer', 'Staff', 'Super Admin'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Academic Stratum</label>
                    <select className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm font-bold" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as UserStatus})}>
                       {['Year 1', 'Year 2', 'Finalist', 'Masters', 'Graduate'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded">
                    <span className="text-xs font-bold uppercase">Identity Verified</span>
                    <button onClick={() => setEditingUser({...editingUser, verified: !editingUser.verified})} className={`w-12 h-6 rounded-full relative transition-all ${editingUser.verified ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingUser.verified ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>
              <div className="p-6 bg-[#2a2e33] flex justify-end gap-3">
                 <button onClick={() => setEditingUser(null)} className="px-6 py-2 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                 <button onClick={handleUpdateUser} className="px-6 py-2 bg-indigo-600 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">Commit Changes</button>
              </div>
           </div>
        </div>
      )}

      {isAddingResource && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-[#343a40] w-full max-w-lg rounded-xl shadow-2xl border border-[#4b545c] overflow-hidden">
              <form onSubmit={handleAddResource}>
                <div className="p-6 border-b border-[#4b545c] flex justify-between items-center">
                   <h3 className="text-[12px] font-black uppercase tracking-widest">Initialize Academic Asset</h3>
                   <button type="button" onClick={() => setIsAddingResource(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                      <input name="title" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm font-bold" required />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                        <select name="category" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-xs font-bold">
                          {['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">College Wing</label>
                        <select name="college" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-xs font-bold">
                          {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Course Registry Code</label>
                      <input name="course" className="w-full bg-[#454d55] border border-[#4b545c] rounded p-3 text-sm font-bold" placeholder="e.g. BSCS" required />
                   </div>
                </div>
                <div className="p-6 bg-[#2a2e33] flex justify-end gap-3">
                   <button type="button" onClick={() => setIsAddingResource(false)} className="px-6 py-2 text-[10px] font-black uppercase text-slate-400">Cancel</button>
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
