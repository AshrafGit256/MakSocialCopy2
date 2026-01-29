
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { ANALYTICS } from '../constants';
import { User, PlatformEmail } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  Users, Activity, Trash2, Plus, 
  DollarSign, Calendar as CalendarIcon, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Settings, Menu, Bell, 
  LogOut, Megaphone, TrendingUp, BarChart3,
  Edit3, Eye, ChevronRight, ChevronLeft,
  Download, PieChart as PieChartIcon,
  MousePointer2, Clock, Globe, ShieldAlert,
  Search, Filter, CheckCircle, Ban, AlertTriangle, Terminal,
  UserCheck, Shield, Cpu, Binary, Radar,
  ArrowLeft, ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  Image as ImageIcon, Power, Sliders, Command, Radio, Target,
  Briefcase, Rocket, Gauge, Compass, Palette, MoreHorizontal, MoreVertical,
  ChevronDown, ExternalLink, FilterX, Laptop, MousePointer, 
  Layout as LayoutIcon, AlignLeft, AlignRight, Maximize, Type,
  Moon, Minus, Settings2, Facebook, Twitter, Instagram, Linkedin,
  PenTool, Code2, Megaphone as MarketingIcon, GraduationCap, BriefcaseIcon,
  Mail, Inbox, Send, Inbox as InboxIcon, Archive, Trash, Tag, Paperclip,
  UserPlus, UserMinus, AtSign, AlignJustify, SearchCode, Flag, MailPlus,
  BookOpen, Info, Star, AlertCircle, Bookmark, Folder, Tag as TagIcon,
  Maximize2, Bold, Italic, List as ListIcon, Underline, Strikethrough,
  Code, Smile, Paperclip as AttachmentIcon, Redo2, Undo2, AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon, AlignRight as AlignRightIcon, Square, CheckSquare
} from 'lucide-react';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [userCategory, setUserCategory] = useState<'All' | 'Student' | 'Lecturer' | 'Administrator' | 'Corporate'>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [emails, setEmails] = useState<PlatformEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<PlatformEmail | null>(null);
  const [emailFolder, setEmailFolder] = useState<PlatformEmail['folder']>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  const allUsers = db.getUsers();
  const posts = db.getPosts();

  useEffect(() => {
    setEmails(db.getEmails());
  }, [activeTab]);

  const filteredUsers = useMemo(() => {
    if (userCategory === 'All') return allUsers;
    return allUsers.filter(u => {
      if (userCategory === 'Administrator') return u.badges?.includes('Administrator') || u.badges?.includes('Super Admin');
      if (userCategory === 'Student') return u.status !== 'Graduate';
      if (userCategory === 'Lecturer') return u.role.toLowerCase().includes('lecturer');
      return true;
    });
  }, [allUsers, userCategory]);

  const stats = [
    { label: 'Active Nodes', value: allUsers.length, trend: '+12%', color: 'text-indigo-500' },
    { label: 'Signal Stream', value: posts.length, trend: '+5%', color: 'text-emerald-500' },
    { label: 'Treasury Cap', value: '42.8M', trend: '-2%', color: 'text-amber-500' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex font-sans text-[#c9d1d9]">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1e1e2d] border-r border-white/5`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 gap-3">
          <div className="w-8 h-8 rounded bg-[#10918a] flex items-center justify-center shadow-xl">
            <ShieldCheck size={18} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest italic text-white">Ki.Admin</span>}
        </div>
        <nav className="flex-1 py-8 overflow-y-auto no-scrollbar px-3 space-y-1">
          {[
            { id: 'Dashboard', icon: <LayoutDashboard size={18}/> },
            { id: 'Users', icon: <Users size={18}/> },
            { id: 'Email', icon: <Mail size={18}/> },
            { id: 'Calendar', icon: <CalendarIcon size={18}/> },
            { id: 'Security', icon: <Shield size={18}/> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-[#10918a]/20 text-[#10918a] shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-[11px] font-black uppercase tracking-widest">{item.id}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="w-full py-3 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
            <Power size={14}/> {isSidebarOpen && "Shutdown"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d1117] shrink-0 z-[90]">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-slate-400 transition-colors"><Menu size={20}/></button>
              <div className="flex items-center text-[10px] font-bold text-slate-500 gap-2 uppercase tracking-widest">
                 <span>Admin</span> <ChevronRight size={12}/> <span className="text-white">{activeTab}</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase text-white">Registry Architect</span>
                 <span className="text-[8px] font-bold text-[#10918a] uppercase tracking-widest">v1.0.0</span>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border border-white/10" alt="Admin" />
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {activeTab === 'Dashboard' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map(s => (
                    <div key={s.label} className="bg-[#1e1e2d] p-8 rounded-2xl border border-white/5 shadow-2xl group transition-all hover:-translate-y-1">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}><Activity size={20}/></div>
                          <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{s.trend}</span>
                       </div>
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</p>
                       <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">{s.value}</h3>
                    </div>
                  ))}
               </div>

               {/* Ki-Admin Styled Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#1e1e2d] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                           <TrendingUp size={16} className="text-[#10918a]"/> Signal Intensity
                        </h4>
                        <button className="text-[9px] font-black text-[#10918a] uppercase">Details</button>
                     </div>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={ANALYTICS}>
                              <defs>
                                 <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10918a" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10918a" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="posts" stroke="#10918a" strokeWidth={3} fillOpacity={1} fill="url(#colorIntensity)" />
                              <Area type="monotone" dataKey="engagement" stroke="#d1a67d" strokeWidth={3} fillOpacity={0.1} fill="#d1a67d" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-[#1e1e2d] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                           <Database size={16} className="text-[#10918a]"/> Strata Asset Distribution
                        </h4>
                     </div>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={ANALYTICS}>
                              <Bar dataKey="messages" fill="#10918a" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#1e1e2d] border border-white/5 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {['All', 'Student', 'Lecturer', 'Administrator', 'Corporate'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setUserCategory(cat as any)}
                      className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${userCategory === cat ? 'bg-white/5 text-[#10918a] border-[#10918a]' : 'text-slate-500 hover:text-white border-transparent'}`}
                    >
                       {cat}
                    </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUsers.map((user, idx) => (
                    <div key={user.id} className="bg-[#1e1e2d] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:scale-[1.02] transition-all flex flex-col shadow-2xl">
                       <div className={`h-32 w-full bg-gradient-to-br relative ${
                         idx % 3 === 0 ? 'from-teal-400 via-emerald-300 to-amber-200' :
                         idx % 3 === 1 ? 'from-purple-400 via-rose-300 to-indigo-400' :
                         'from-indigo-400 via-cyan-300 to-emerald-400'
                       }`}>
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                       </div>
                       <div className="px-8 -mt-12 relative z-10 flex justify-center">
                          <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#1e1e2d] bg-white object-cover shadow-2xl" alt={user.name} />
                       </div>
                       <div className="p-8 text-center flex-1">
                          <h3 className="text-xl font-black text-white uppercase italic">{user.name}</h3>
                          <p className="text-[10px] font-bold text-[#10918a] uppercase tracking-widest mt-1">{user.role}</p>
                          <div className="grid grid-cols-3 gap-0 py-6 border-y border-white/5 my-6">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Commits</p>
                                <p className="text-sm font-black text-white">{user.postsCount}</p>
                             </div>
                             <div className="space-y-1 border-x border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Links</p>
                                <p className="text-sm font-black text-white">{user.followersCount}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase">Status</p>
                                <p className="text-sm font-black text-white truncate px-1">{user.status.split(' ')[0]}</p>
                             </div>
                          </div>
                          <div className="mt-6 flex justify-center gap-3">
                             <button className="w-9 h-9 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"><Facebook size={14}/></button>
                             <button className="w-9 h-9 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"><Twitter size={14}/></button>
                             <button className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"><Mail size={14}/></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Email' && (
            <div className="h-full flex gap-8 animate-in fade-in duration-500">
               {/* Simplified Email View using Ki-Admin Patterns */}
               <aside className="w-64 flex flex-col gap-8 shrink-0">
                  <button 
                    onClick={() => { setIsComposing(true); setSelectedEmail(null); }}
                    className="w-full py-4 bg-[#d1a67d] hover:bg-[#c1966d] text-slate-900 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  >
                    Compose
                  </button>
                  <nav className="space-y-1">
                     {['Inbox', 'Sent', 'Draft', 'Starred', 'Spam', 'Trash'].map(item => (
                       <button key={item} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all text-slate-500 hover:text-white hover:bg-white/5">
                          <Bookmark size={18}/> {item}
                       </button>
                     ))}
                  </nav>
               </aside>
               <div className="flex-1 bg-[#1e1e2d] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative shadow-2xl p-8">
                  <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                     <Mail size={120} />
                     <h2 className="text-4xl font-black uppercase italic tracking-tighter">Stratum Empty</h2>
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
