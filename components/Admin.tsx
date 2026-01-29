
import React, { useState, useEffect, useMemo } from 'react';
import { db, REVENUE_HISTORY } from '../db';
import { ANALYTICS } from '../constants';
import { User, Ad, CalendarEvent, Resource, Post, AuthorityRole, PlatformEmail } from '../types';
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

const ACCENT_PALETTES = [
  { name: 'Teal/Sand', primary: '#10918a', secondary: '#d1d5db' },
  { name: 'Purple/Slate', primary: '#7c3aed', secondary: '#334155' },
  { name: 'Earth/Gold', primary: '#92400e', secondary: '#fde68a' },
  { name: 'Emerald/Night', primary: '#059669', secondary: '#064e3b' },
];

type AdminTab = 'Dashboard' | 'Users' | 'Email' | 'Calendar' | 'Ads' | 'Treasury' | 'Security';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [userCategory, setUserCategory] = useState<'All' | 'Student' | 'Lecturer' | 'Administrator' | 'Corporate'>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Email States (matching Screenshot 5/6)
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

  const handleSendEmail = () => {
    const newEmail: PlatformEmail = {
      id: `em-${Date.now()}`,
      from: 'admin@mak.ac.ug',
      fromName: 'Super Admin',
      fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      to: [composeData.to],
      subject: composeData.subject,
      body: composeData.body,
      timestamp: 'Just now',
      fullDate: new Date().toLocaleString(),
      isRead: true,
      isStarred: false,
      folder: 'sent'
    };
    db.sendEmail(newEmail);
    setEmails(db.getEmails());
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  const stats = [
    { label: 'Active Nodes', value: allUsers.length, trend: '+12%', color: 'text-indigo-500' },
    { label: 'Signal Stream', value: posts.length, trend: '+5%', color: 'text-emerald-500' },
    { label: 'Treasury Cap', value: '42.8M', trend: '-2%', color: 'text-amber-500' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d1117] flex font-sans text-[#c9d1d9]">
      {/* 1. Admin Sidebar */}
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
              onClick={() => setActiveTab(item.id as AdminTab)}
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

      {/* 2. Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d1117] shrink-0 z-[90]">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
              <div className="flex items-center text-[10px] font-bold text-slate-500 gap-2 uppercase tracking-widest">
                 <span>Admin</span> <ChevronRight size={12}/> <span className="text-white">{activeTab}</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase text-white">Registry Architect</span>
                 <span className="text-[8px] font-bold text-[#10918a] uppercase tracking-widest">v1.0.0</span>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border border-white/10" />
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

               {/* New Chart Implementation based on Ki-Admin Style */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#1e1e2d] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                     <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                           <TrendingUp size={16} className="text-[#10918a]"/> Signal Intensity Over Time
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
                          <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#1e1e2d] bg-white object-cover shadow-2xl" />
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
                             <button className="w-9 h-9 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-110 transition-all"><Facebook size={14}/></button>
                             <button className="w-9 h-9 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-all"><Twitter size={14}/></button>
                             <button className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-all"><Mail size={14}/></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Email' && (
            <div className="h-full flex gap-8 animate-in fade-in duration-500">
               {/* Gmail-style Sidebar Navigation */}
               <aside className="w-64 flex flex-col gap-8 shrink-0">
                  <button 
                    onClick={() => { setIsComposing(true); setSelectedEmail(null); }}
                    className="w-full py-4 bg-[#d1a67d] hover:bg-[#c1966d] text-slate-900 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  >
                    Compose
                  </button>

                  <nav className="space-y-1">
                     {[
                       { id: 'inbox', label: 'Inbox', icon: <InboxIcon size={18}/>, count: '10+' },
                       { id: 'sent', label: 'Sent', icon: <Send size={18}/> },
                       { id: 'draft', label: 'Draft', icon: <FileText size={18}/> },
                       { id: 'starred', label: 'Starred', icon: <Star size={18}/>, count: '2+' },
                       { id: 'spam', label: 'Spam', icon: <AlertCircle size={18}/> },
                       { id: 'trash', label: 'Trash', icon: <Trash size={18}/> },
                     ].map(item => (
                       <button 
                         key={item.id}
                         onClick={() => { setEmailFolder(item.id as any); setSelectedEmail(null); }}
                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${emailFolder === item.id ? 'bg-[#d1a67d]/10 text-[#d1a67d]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                       >
                          <span className="flex items-center gap-4">{item.icon} {item.label}</span>
                          {item.count && <span className="text-[10px] opacity-60">{item.count}</span>}
                       </button>
                     ))}
                  </nav>

                  <div className="space-y-4">
                     <h3 className="text-[11px] font-black text-white uppercase tracking-widest px-4 pt-4 border-t border-white/5">Labels</h3>
                     <div className="space-y-1">
                        {[
                          { id: 'Social', color: 'bg-rose-500' },
                          { id: 'Company', color: 'bg-amber-500' },
                          { id: 'Important', color: 'bg-emerald-500' },
                          { id: 'Private', color: 'bg-indigo-500' },
                        ].map(tag => (
                          <button key={tag.id} className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                             <div className={`w-3 h-3 rounded-full ${tag.color}`}></div> {tag.id}
                          </button>
                        ))}
                     </div>
                  </div>
               </aside>

               {/* Main Email Strata */}
               <div className="flex-1 bg-[#1e1e2d] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative shadow-2xl">
                  {isComposing ? (
                    <div className="flex-1 flex flex-col">
                       <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                          <h2 className="text-xl font-black text-white uppercase italic">Compose Protocol</h2>
                          <button onClick={() => setIsComposing(false)} className="p-2 text-slate-500 hover:text-white"><X size={24}/></button>
                       </div>
                       <div className="p-10 flex-1 space-y-6">
                          <div className="space-y-4">
                             <input 
                               className="w-full bg-transparent border-b border-white/5 py-4 text-sm font-bold outline-none focus:border-[#d1a67d] transition-all" 
                               placeholder="Target node (To:)" 
                               value={composeData.to} 
                               onChange={e => setComposeData({...composeData, to: e.target.value})} 
                             />
                             <input 
                               className="w-full bg-transparent border-b border-white/5 py-4 text-sm font-bold text-[#d1a67d] outline-none" 
                               placeholder="Signal Manifest (Subject:)" 
                               value={composeData.subject} 
                               onChange={e => setComposeData({...composeData, subject: e.target.value})} 
                             />
                          </div>
                          <textarea 
                             className="w-full flex-1 bg-transparent py-4 text-sm font-medium italic outline-none resize-none min-h-[300px]" 
                             placeholder="Initialize data payload..." 
                             value={composeData.body} 
                             onChange={e => setComposeData({...composeData, body: e.target.value})} 
                          />
                       </div>
                       <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-black/10">
                          <button onClick={() => setIsComposing(false)} className="px-8 py-3 text-slate-500 font-bold uppercase text-[11px]">Abort</button>
                          <button onClick={handleSendEmail} className="px-12 py-3 bg-[#10918a] text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Authorize Broadcast</button>
                       </div>
                    </div>
                  ) : selectedEmail ? (
                    <div className="flex-1 flex flex-col">
                       <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
                          <div className="flex items-center gap-2">
                             <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:text-white transition-all"><ArrowLeft size={20}/></button>
                             <div className="h-4 w-px bg-white/10 mx-2"></div>
                             <button className="p-2 text-slate-500 hover:text-white"><Archive size={18}/></button>
                             <button className="p-2 text-slate-500 hover:text-white"><Info size={18}/></button>
                             <button className="p-2 text-slate-500 hover:text-rose-500"><Trash size={18}/></button>
                             <button className="p-2 text-slate-500 hover:text-white ml-2"><Folder size={18}/></button>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                             2 to 10 <ChevronLeft size={16}/> <ChevronRight size={16}/>
                          </div>
                       </div>
                       <div className="p-10 flex-1 overflow-y-auto no-scrollbar space-y-12">
                          <div className="flex items-start justify-between">
                             <div className="flex items-center gap-5">
                                <img src={selectedEmail.fromAvatar} className="w-14 h-14 rounded-full border border-white/10" />
                                <div>
                                   <h3 className="text-sm font-black text-white">{selectedEmail.from}</h3>
                                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                      to: Registry <ChevronDown size={14}/>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedEmail.fullDate}</p>
                                <div className="mt-2"><span className="px-3 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-slate-500">{selectedEmail.label}</span></div>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <p className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedEmail.subject}</p>
                             <div className="text-sm text-slate-400 leading-relaxed font-medium italic whitespace-pre-wrap max-w-4xl p-10 bg-black/20 rounded-[2rem] border border-white/5 shadow-inner">
                                {selectedEmail.body}
                             </div>
                          </div>
                          {selectedEmail.attachments && (
                            <div className="pt-8 space-y-4">
                               <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Paperclip size={14}/> Attached Manifests</h4>
                               <div className="flex flex-wrap gap-4">
                                  {selectedEmail.attachments.map(att => (
                                    <div key={att.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between min-w-[240px] group hover:border-[#d1a67d] transition-all cursor-pointer">
                                       <div className="flex items-center gap-4">
                                          {att.type === 'file' ? <FileText className="text-indigo-400"/> : <Folder className="text-amber-400"/>}
                                          <div>
                                             <p className="text-[10px] font-black text-white uppercase">{att.name}</p>
                                             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{att.size}</p>
                                          </div>
                                       </div>
                                       <Download size={14} className="text-slate-500 group-hover:text-white" />
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}
                          <div className="pt-12 border-t border-white/5 space-y-4">
                             <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden p-6">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Reply to node...</p>
                                <div className="h-32 bg-transparent outline-none"></div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                   <div className="flex gap-4 text-slate-500"><Bold size={16}/><Italic size={16}/><Underline size={16}/><Code size={16}/></div>
                                   <button className="px-8 py-2 bg-[#d1a67d] text-slate-900 rounded-lg text-[10px] font-black uppercase shadow-lg">Send</button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                       <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/10">
                          <div className="relative w-full max-w-md group">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d1a67d] transition-all" size={18} />
                             <input className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#d1a67d] transition-all" placeholder="Search manifest..." />
                          </div>
                          <button className="p-2 text-slate-500 hover:text-white transition-all"><MoreVertical size={20}/></button>
                       </div>
                       <div className="flex-1 overflow-y-auto no-scrollbar">
                          {emails.filter(e => e.folder === emailFolder).length > 0 ? (
                            emails.filter(e => e.folder === emailFolder).map(email => (
                              <div 
                                key={email.id} 
                                onClick={() => setSelectedEmail(email)}
                                className={`p-6 flex items-center gap-6 cursor-pointer group transition-all relative ${!email.isRead ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05] border-b border-white/5 mx-6`}
                              >
                                 <div className="flex items-center gap-4 shrink-0">
                                    <div className="w-5 h-5 rounded border border-white/10 group-hover:border-[#d1a67d] transition-all flex items-center justify-center">
                                       <div className="hidden group-hover:block w-2.5 h-2.5 bg-[#d1a67d] rounded-sm"></div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); }} className={`${email.isStarred ? 'text-amber-500' : 'text-slate-600 hover:text-amber-500'}`}><Star size={20} fill={email.isStarred ? "currentColor" : "none"} /></button>
                                 </div>
                                 <img src={email.fromAvatar} className="w-10 h-10 rounded-full border border-white/10" />
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                       <h4 className={`text-[12px] font-black uppercase tracking-tight ${!email.isRead ? 'text-white' : 'text-slate-400'}`}>{email.fromName}</h4>
                                       <span className="text-[9px] font-bold text-slate-500 uppercase">{email.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <p className="text-[11px] text-slate-500 italic truncate max-w-xl">{email.subject} - {email.body.substring(0, 100)}...</p>
                                    </div>
                                 </div>
                                 {email.label && <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase border border-current opacity-60 ${email.label === 'Important' ? 'text-emerald-500' : 'text-amber-500'}`}>{email.label}</span>}
                                 {/* Abstract dashed border like K1 screenshot */}
                                 <div className="absolute inset-2 border border-dashed border-white/5 rounded-2xl pointer-events-none group-hover:border-white/10"></div>
                              </div>
                            ))
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                               <InboxIcon size={120} />
                               <h2 className="text-4xl font-black uppercase italic tracking-tighter">Stratum Empty</h2>
                            </div>
                          )}
                       </div>
                       <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/10">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">© 2025 ki-admin. All rights reserved ❤️ V1.0.0</p>
                          <button className="text-[9px] font-bold text-slate-500 uppercase hover:text-white transition-all">Need Help?</button>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {!['Dashboard', 'Users', 'Email'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
                <Database size={64} className="text-[#10918a]" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Syncing Manifest...</h3>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
