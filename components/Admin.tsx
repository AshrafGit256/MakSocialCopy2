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
  // Fix: Added missing ArrowLeft icon from lucide-react
  ArrowLeft, ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  ImageIcon, Power, Sliders, Command, Radio, Target,
  // Fix: Added missing MoreVertical icon from lucide-react
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
  { name: 'Cobalt/Blue', primary: '#2563eb', secondary: '#1d4ed8' },
  { name: 'Maroon/Rose', primary: '#991b1b', secondary: '#f43f5e' },
];

type AdminTab = 'Dashboard' | 'Users' | 'Email' | 'Calendar' | 'Ads' | 'Treasury' | 'Security';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  // Layout States
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [userCategory, setUserCategory] = useState<'All' | 'Student' | 'Lecturer' | 'Administrator' | 'Corporate'>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Email States
  const [emails, setEmails] = useState<PlatformEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<PlatformEmail | null>(null);
  const [emailFolder, setEmailFolder] = useState<PlatformEmail['folder']>('inbox');
  const [activeLabel, setActiveLabel] = useState<PlatformEmail['label'] | 'All' | 'Starred'>('All');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', cc: '', bcc: '', subject: '', body: '' });

  // Customizer Preferences
  const [sidebarOption, setSidebarOption] = useState<'vertical' | 'horizontal' | 'dark'>('vertical');
  const [layoutOption, setLayoutOption] = useState<'ltr' | 'rtl' | 'box'>('ltr');
  const [palette, setPalette] = useState(ACCENT_PALETTES[0]);
  const [textSize, setTextSize] = useState(14);

  // Data Sync
  const allUsers = db.getUsers();
  const posts = db.getPosts();

  useEffect(() => {
    setEmails(db.getEmails());
  }, [activeTab]);

  // Filtered Users Logic
  const filteredUsers = useMemo(() => {
    if (userCategory === 'All') return allUsers;
    return allUsers.filter(u => {
      if (userCategory === 'Administrator') return u.badges?.includes('Administrator') || u.badges?.includes('Super Admin');
      if (userCategory === 'Student') return u.status !== 'Graduate' && !u.badges?.includes('Official') && !u.badges?.includes('Administrator');
      if (userCategory === 'Lecturer') return u.role.toLowerCase().includes('lecturer');
      if (userCategory === 'Corporate') return u.badges?.includes('Corporate');
      return true;
    });
  }, [allUsers, userCategory]);

  const filteredEmails = useMemo(() => {
    let result = emails;
    if (activeLabel === 'Starred') {
      result = result.filter(e => e.isStarred);
    } else if (activeLabel !== 'All') {
      result = result.filter(e => e.label === activeLabel);
    } else {
      result = result.filter(e => e.folder === emailFolder);
    }
    return result;
  }, [emails, emailFolder, activeLabel]);

  // Apply CSS variables for the palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--admin-primary', palette.primary);
    root.style.setProperty('--admin-secondary', palette.secondary);
    root.style.setProperty('--admin-text-base', `${textSize}px`);
  }, [palette, textSize]);

  const handleSendEmail = () => {
    const newEmail: PlatformEmail = {
      id: `em-${Date.now()}`,
      from: 'admin@mak.ac.ug',
      fromName: 'Super Admin',
      fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      to: composeData.to.split(',').map(s => s.trim()),
      cc: composeData.cc.split(',').map(s => s.trim()).filter(Boolean),
      bcc: composeData.bcc.split(',').map(s => s.trim()).filter(Boolean),
      subject: composeData.subject,
      body: composeData.body,
      timestamp: 'Just now',
      fullDate: new Date().toLocaleString(),
      isRead: true,
      isStarred: false,
      folder: 'sent'
    };
    db.sendEmail(newEmail);
    
    // Simulate internal delivery for other admins if they are recipients
    const internalAdminEmails = allUsers.filter(u => u.badges?.includes('Administrator')).map(u => u.email?.toLowerCase());
    const recipientEmails = [...newEmail.to, ...(newEmail.cc || []), ...(newEmail.bcc || [])].map(e => e.toLowerCase());
    
    if (recipientEmails.some(re => internalAdminEmails.includes(re))) {
      db.sendEmail({ ...newEmail, folder: 'inbox', isRead: false });
    }

    setEmails(db.getEmails());
    setIsComposing(false);
    setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
    alert("Broadcast Authorized: Signals synchronized with target nodes.");
  };

  const navItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { id: 'Users', icon: <Users size={18}/> },
    { id: 'Email', icon: <Mail size={18}/> },
    { id: 'Calendar', icon: <CalendarIcon size={18}/> },
    { id: 'Ads', icon: <Megaphone size={18}/> },
    { id: 'Treasury', icon: <DollarSign size={18}/> },
    { id: 'Security', icon: <Shield size={18}/> },
  ];

  const stats = [
    { label: 'Network Nodes', value: allUsers.length, trend: '+14%', color: 'text-indigo-500' },
    { label: 'Active Signals', value: posts.length, trend: '+8%', color: 'text-emerald-500' },
    { label: 'Global Liquidity', value: '42.8M', trend: '-2%', color: 'text-amber-500' },
    { label: 'Security Uptime', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
  ];

  const renderNavLinks = () => (
    <ul className={`flex ${sidebarOption === 'horizontal' ? 'flex-row gap-2' : 'flex-col space-y-1'}`}>
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <li key={item.id}>
            <button 
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all group whitespace-nowrap ${
                isActive 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { borderLeft: sidebarOption !== 'horizontal' ? `3px solid ${palette.primary}` : 'none', borderBottom: sidebarOption === 'horizontal' ? `3px solid ${palette.primary}` : 'none' } : {}}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {(isSidebarOpen || sidebarOption === 'horizontal') && <span className="ml-3 text-[11px] font-bold uppercase tracking-widest">{item.id}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div 
      className={`min-h-screen w-full bg-[#0d1117] flex transition-all duration-500 ${layoutOption === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ fontSize: 'var(--admin-text-base)', direction: layoutOption === 'rtl' ? 'rtl' : 'ltr' }}
    >
      {/* 1. SIDEBAR */}
      {sidebarOption !== 'horizontal' && (
        <aside className={`transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} ${sidebarOption === 'dark' ? 'bg-[#181a1b] text-white' : 'bg-[#1e1e2d] text-white border-r border-white/5'}`}>
           <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-xl" style={{ backgroundColor: palette.primary }}>
                 <ShieldCheck size={18} className="text-white" />
              </div>
              {isSidebarOpen && <span className="font-black text-xs uppercase tracking-[0.2em] italic">Ki.Admin</span>}
           </div>
           <nav className="flex-1 py-8 overflow-y-auto no-scrollbar px-3">
              {renderNavLinks()}
           </nav>
           <div className="p-4 border-t border-white/5">
              <button onClick={onLogout} className="w-full py-3 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                 <Power size={14}/> {isSidebarOpen && "LogOut"}
              </button>
           </div>
        </aside>
      )}

      {/* 2. MAIN VIEWPORT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${layoutOption === 'box' ? 'bg-[#000] p-4 lg:p-10' : ''}`}>
        <div className={`flex flex-col h-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0d1117] ${layoutOption === 'box' ? 'max-w-[1440px] mx-auto rounded-[2.5rem] border border-white/10' : ''}`}>
          
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0d1117] shrink-0 z-[90]">
             <div className="flex items-center gap-6">
                {sidebarOption !== 'horizontal' && (
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
                )}
                <div className="flex items-center text-[10px] font-bold text-slate-500 gap-2 uppercase tracking-widest">
                   <span className="text-white">{activeTab}</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase text-white">Registry Architect</span>
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">v1.0.0</span>
                </div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border border-white/10" />
             </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0d1117] no-scrollbar">
            
            {activeTab === 'Dashboard' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(s => (
                      <div key={s.label} className="bg-[#161b22] p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-md transition-shadow group">
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}><Activity size={20}/></div>
                            <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{s.trend}</span>
                         </div>
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</p>
                         <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">{s.value}</h3>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* USERS SECTION */}
            {activeTab === 'Users' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-[#161b22] border border-white/5 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'All', label: 'Universal Nodes', icon: <PenTool size={14}/> },
                      { id: 'Student', label: 'Students', icon: <GraduationCap size={14}/> },
                      { id: 'Lecturer', label: 'Lecturers', icon: <BookOpen size={14}/> },
                      { id: 'Administrator', label: 'Registry Admin', icon: <ShieldCheck size={14}/> },
                      { id: 'Corporate', label: 'External Partners', icon: <MarketingIcon size={14}/> },
                    ].map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setUserCategory(cat.id as any)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${userCategory === cat.id ? 'bg-white/5 text-white border-orange-500 shadow-xl' : 'text-slate-500 hover:text-white border-transparent'}`}
                      >
                         <span style={{ color: userCategory === cat.id ? palette.primary : 'inherit' }}>{cat.icon}</span>
                         {cat.label}
                      </button>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                      <div key={user.id} className="bg-[#1e1e2d] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:scale-[1.02] transition-all flex flex-col shadow-2xl">
                         <div className={`h-32 w-full bg-gradient-to-br relative ${
                           idx % 3 === 0 ? 'from-indigo-400 via-rose-300 to-amber-200' :
                           idx % 3 === 1 ? 'from-purple-300 via-emerald-300 to-teal-400' :
                           'from-lime-300 via-emerald-200 to-cyan-400'
                         }`}>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                         </div>
                         <div className="px-8 -mt-12 relative z-10 flex justify-center">
                            <div className="relative">
                               <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#1e1e2d] bg-white object-cover shadow-2xl" />
                            </div>
                         </div>
                         <div className="p-8 text-center flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h3>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.1em] mt-1">{user.role}</p>
                            <div className="grid grid-cols-3 gap-0 py-6 border-y border-white/5 my-6">
                               <div className="space-y-1">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Projects</p>
                                  <p className="text-sm font-black text-white">{user.postsCount + 20}</p>
                               </div>
                               <div className="space-y-1 border-x border-white/5">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tasks</p>
                                  <p className="text-sm font-black text-white">15</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Position</p>
                                  <p className="text-sm font-black text-white truncate px-1">{user.status.split(' ')[0] || 'Member'}</p>
                               </div>
                            </div>
                            <div className="space-y-3 mb-8">
                               <p className="text-xs text-slate-400 font-medium italic leading-relaxed line-clamp-2 px-4">"{user.bio}"</p>
                               <div className="pt-4 border-t border-white/2 space-y-1">
                                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Direct Intelligence Channels</p>
                                   <div className="flex flex-col gap-1 items-center">
                                      <span className="text-[10px] font-bold text-indigo-400 font-mono">{user.email}</span>
                                      {user.socials?.gmail && <span className="text-[10px] font-bold text-rose-400 font-mono italic">{user.socials.gmail}</span>}
                                   </div>
                                </div>
                            </div>
                            <div className="mt-auto flex justify-center gap-3">
                               <button className="w-9 h-9 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-110 transition-all"><Facebook size={14} /></button>
                               <button className="w-9 h-9 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-all"><Twitter size={14} /></button>
                               <button 
                                 onClick={() => {
                                   setActiveTab('Email');
                                   setComposeData({ ...composeData, to: user.socials?.gmail || user.email || '' });
                                   setIsComposing(true);
                                 }}
                                 className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-all"
                               ><MailPlus size={14} /></button>
                            </div>
                         </div>
                      </div>
                    )) : null}
                 </div>
              </div>
            )}

            {/* EMAIL SECTION - FULL K1 ADMIN RE-DESIGN */}
            {activeTab === 'Email' && (
              <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 overflow-hidden">
                 
                 {/* 1. Left Sidebar Navigation */}
                 <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
                    <button 
                      onClick={() => { setIsComposing(true); setSelectedEmail(null); }}
                      className="w-full py-4 bg-[#7a5b3d] hover:bg-[#8b6a4a] text-white rounded-xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95"
                    >
                      Compose
                    </button>

                    <nav className="space-y-1">
                       {[
                         { id: 'inbox', label: 'Inbox', icon: <Inbox size={18}/>, count: '10+' },
                         { id: 'sent', label: 'Sent', icon: <Send size={18}/> },
                         { id: 'draft', label: 'Draft', icon: <FileText size={18}/> },
                         { id: 'starred', label: 'Starred', icon: <Star size={18}/>, count: '2+' },
                         { id: 'spam', label: 'Spam', icon: <AlertCircle size={18}/> },
                         { id: 'trash', label: 'Trash', icon: <Trash size={18}/> },
                       ].map(item => (
                         <button 
                           key={item.id}
                           onClick={() => { setEmailFolder(item.id as any); setActiveLabel('All'); setSelectedEmail(null); }}
                           className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${emailFolder === item.id && activeLabel === 'All' ? 'bg-[#3b2a1a] text-[#8b6a4a]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                         >
                            <span className="flex items-center gap-4">{item.icon} {item.label}</span>
                            {item.count && <span className="text-[10px] text-slate-500">{item.count}</span>}
                         </button>
                       ))}
                    </nav>

                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-white uppercase tracking-widest px-4 border-t border-white/5 pt-8">Labels</h3>
                       <div className="space-y-1">
                          {[
                            { id: 'Social', color: 'bg-rose-500' },
                            { id: 'Company', color: 'bg-amber-500' },
                            { id: 'Important', color: 'bg-emerald-500' },
                            { id: 'Private', color: 'bg-indigo-500' },
                          ].map(tag => (
                            <button 
                              key={tag.id}
                              onClick={() => { setActiveLabel(tag.id as any); setSelectedEmail(null); }}
                              className={`w-full flex items-center gap-4 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-white/5 rounded-lg ${activeLabel === tag.id ? 'text-white' : 'text-slate-500'}`}
                            >
                               <div className={`w-3 h-3 rounded-full ${tag.color}`}></div> {tag.id}
                            </button>
                          ))}
                       </div>
                    </div>

                    <nav className="space-y-1 pt-8 border-t border-white/5">
                       {[
                         { id: 'all', label: 'All Mail', icon: <Bookmark size={18}/> },
                         { id: 'primary', label: 'Primary', icon: <Grid size={18}/> },
                         { id: 'promotions', label: 'Promotions', icon: <TagIcon size={18}/> },
                         { id: 'social-nav', label: 'Social', icon: <Users size={18}/> },
                       ].map(item => (
                         <button key={item.id} className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 rounded-lg">
                            {item.icon} {item.label}
                         </button>
                       ))}
                    </nav>
                 </aside>

                 {/* 2. Main Content Area */}
                 <div className="flex-1 bg-[#161b22] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative">
                    
                    {isComposing ? (
                      /* COMPOSE VIEW */
                      <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4">
                         <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#161b22]/50">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Compose Protocol</h2>
                            <button onClick={() => setIsComposing(false)} className="p-2 text-slate-500 hover:text-white"><X size={24}/></button>
                         </div>
                         <div className="p-8 flex-1 overflow-y-auto no-scrollbar space-y-6">
                            <div className="space-y-4">
                               <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-12">To:</span>
                                  <input className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-white" value={composeData.to} onChange={e => setComposeData({...composeData, to: e.target.value})} placeholder="Enter node address..."/>
                               </div>
                               <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-12">CC:</span>
                                  <input className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-400" value={composeData.cc} onChange={e => setComposeData({...composeData, cc: e.target.value})} />
                               </div>
                               <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-12">BCC:</span>
                                  <input className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-400" value={composeData.bcc} onChange={e => setComposeData({...composeData, bcc: e.target.value})} />
                               </div>
                               <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-12">Subject:</span>
                                  <input className="flex-1 bg-transparent border-none outline-none text-sm font-black text-[#8b6a4a]" value={composeData.subject} onChange={e => setComposeData({...composeData, subject: e.target.value})} />
                               </div>
                            </div>
                            
                            {/* Rich Editor Toolbar Simulation */}
                            <div className="bg-[#0d1117] border border-white/5 rounded-t-xl p-2 flex flex-wrap gap-1">
                               {[
                                 { icon: <Undo2 size={14}/> }, { icon: <Redo2 size={14}/> }, { icon: <Bold size={14}/> }, 
                                 { icon: <Italic size={14}/> }, { icon: <Underline size={14}/> }, { icon: <Strikethrough size={14}/> },
                                 { icon: <Type size={14}/> }, { icon: <AlignCenterIcon size={14}/> }, { icon: <ListIcon size={14}/> },
                                 { icon: <AttachmentIcon size={14}/> }
                               ].map((btn, i) => (
                                 <button key={i} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-all">{btn.icon}</button>
                               ))}
                            </div>
                            <textarea 
                               className="w-full bg-[#0d1117] border-x border-b border-white/5 rounded-b-xl p-6 text-sm text-slate-300 font-medium italic min-h-[300px] outline-none resize-none"
                               value={composeData.body}
                               onChange={e => setComposeData({...composeData, body: e.target.value})}
                               placeholder="Type message..."
                            />
                         </div>
                         <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-[#161b22]">
                            <button onClick={() => setIsComposing(false)} className="px-8 py-3 text-slate-500 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all">Discard</button>
                            <button onClick={handleSendEmail} className="px-10 py-3 bg-[#7a5b3d] text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl transition-all active:scale-95">Send Protocol</button>
                         </div>
                      </div>
                    ) : selectedEmail ? (
                      /* READ EMAIL VIEW */
                      <div className="flex-1 flex flex-col animate-in slide-in-from-right-4">
                         <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#161b22]/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                               <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:text-white transition-all"><ArrowLeft size={20}/></button>
                               <div className="flex items-center gap-2">
                                  <button className="p-2 text-slate-500 hover:text-white"><Archive size={18}/></button>
                                  <button className="p-2 text-slate-500 hover:text-white"><Info size={18}/></button>
                                  <button className="p-2 text-slate-500 hover:text-rose-500"><Trash size={18}/></button>
                                  <div className="w-px h-6 bg-white/5 mx-1"></div>
                                  <button className="p-2 text-slate-500 hover:text-white"><Folder size={18}/></button>
                                  <button className="p-2 text-slate-500 hover:text-white"><TagIcon size={18}/></button>
                               </div>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-black text-slate-500">
                               <span>2 to 10</span>
                               <div className="flex gap-1">
                                  <button className="p-1.5 hover:bg-white/5 rounded transition-all"><ChevronLeft size={16}/></button>
                                  <button className="p-1.5 hover:bg-white/5 rounded transition-all"><ChevronRight size={16}/></button>
                               </div>
                            </div>
                         </div>
                         <div className="p-8 md:p-12 flex-1 overflow-y-auto no-scrollbar space-y-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                               <div className="flex items-center gap-4">
                                  <img src={selectedEmail.fromAvatar} className="w-14 h-14 rounded-full border border-white/10" />
                                  <div>
                                     <h3 className="text-sm font-black text-white">{selectedEmail.from}</h3>
                                     <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                        to <ChevronDown size={14}/>
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{selectedEmail.fullDate}</p>
                                  <div className="flex justify-end gap-2 mt-2">
                                     <span className="px-3 py-1 bg-white/5 rounded text-[9px] font-black uppercase text-slate-500">{selectedEmail.label || 'Personal'}</span>
                                     <button className="text-slate-500 hover:text-white"><MoreVertical size={16}/></button>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-6">
                               <p className="text-[18px] font-black text-white italic tracking-tighter uppercase leading-none">Hello! {selectedEmail.fromName.split(' ')[0]}</p>
                               <div className="text-sm text-slate-400 leading-relaxed font-medium italic whitespace-pre-wrap max-w-4xl">
                                  {selectedEmail.body}
                               </div>
                            </div>

                            {/* Attachments Section */}
                            {selectedEmail.attachments && (
                              <div className="pt-12 space-y-6">
                                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <AttachmentIcon size={14}/> Attached
                                 </h4>
                                 <div className="flex flex-wrap gap-4">
                                    {selectedEmail.attachments.map(att => (
                                      <div key={att.id} className="p-5 bg-[#0d1117] border border-white/5 rounded-2xl flex items-center justify-between min-w-[280px] group hover:border-[#8b6a4a] transition-all cursor-pointer shadow-xl">
                                         <div className="flex items-center gap-4">
                                            {att.type === 'file' ? (
                                              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl"><FileText size={20}/></div>
                                            ) : (
                                              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><Folder size={20}/></div>
                                            )}
                                            <div>
                                               <p className="text-[11px] font-black text-white uppercase">{att.name}</p>
                                               <p className="text-[9px] font-bold text-slate-500">{att.size}</p>
                                            </div>
                                         </div>
                                         <button className="p-2 text-slate-500 group-hover:text-white"><Download size={18}/></button>
                                      </div>
                                    ))}
                                 </div>
                              </div>
                            )}

                            {/* Reply Box Simulation */}
                            <div className="pt-12 space-y-4">
                               <div className="bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-1 opacity-50">
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Code size={14}/></button>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Undo2 size={14}/></button>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Redo2 size={14}/></button>
                                     <div className="w-px h-4 bg-white/10 mx-1"></div>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Bold size={14}/></button>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Italic size={14}/></button>
                                     <div className="w-px h-4 bg-white/10 mx-1"></div>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Type size={14}/></button>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><AlignCenterIcon size={14}/></button>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><ListIcon size={14}/></button>
                                     <div className="w-px h-4 bg-white/10 mx-1"></div>
                                     <button className="p-2 hover:bg-white/5 rounded transition-all"><Maximize2 size={14}/></button>
                                  </div>
                                  <textarea className="w-full bg-transparent p-6 text-sm italic font-medium text-slate-400 outline-none resize-none h-40" placeholder="Type Message..."></textarea>
                               </div>
                            </div>
                         </div>
                      </div>
                    ) : (
                      /* EMAIL LIST VIEW */
                      <div className="flex-1 flex flex-col animate-in fade-in">
                         <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#161b22]/50 backdrop-blur-md">
                            <div className="relative w-full max-w-md group">
                               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#8b6a4a] transition-all" size={18} />
                               <input className="w-full bg-[#0d1117] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#8b6a4a] transition-all" placeholder="Search..." />
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="p-2 text-slate-500 hover:text-white transition-all"><MoreVertical size={20}/></button>
                            </div>
                         </div>

                         <div className="flex-1 overflow-y-auto no-scrollbar">
                            {filteredEmails.length > 0 ? (
                              <div className="divide-y divide-white/5">
                                 {filteredEmails.map(email => (
                                   <div 
                                     key={email.id} 
                                     onClick={() => setSelectedEmail(email)}
                                     className={`p-6 md:px-10 flex items-center gap-6 cursor-pointer group transition-all relative ${!email.isRead ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05]`}
                                   >
                                      {/* Selection Box & Star */}
                                      <div className="flex items-center gap-4 shrink-0">
                                         <div className="w-5 h-5 rounded border border-white/10 group-hover:border-white/20 flex items-center justify-center transition-all">
                                            <div className="hidden group-hover:block w-3 h-3 bg-[#8b6a4a] rounded-sm"></div>
                                         </div>
                                         <button onClick={(e) => { e.stopPropagation(); }} className={`${email.isStarred ? 'text-amber-500' : 'text-slate-600 hover:text-amber-500'} transition-all`}><Star size={20} fill={email.isStarred ? "currentColor" : "none"} /></button>
                                      </div>

                                      {/* Avatar */}
                                      <img src={email.fromAvatar} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />

                                      {/* Details */}
                                      <div className="flex-1 min-w-0">
                                         <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-[12px] font-black uppercase tracking-tight ${!email.isRead ? 'text-white' : 'text-slate-400'}`}>{email.fromName}</h4>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{email.timestamp}</span>
                                         </div>
                                         <p className="text-[11px] text-slate-500 italic truncate max-w-2xl">{email.body.substring(0, 120)}...</p>
                                      </div>

                                      {/* Label Badge */}
                                      {email.label && (
                                        <div className="shrink-0">
                                           <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] border border-opacity-30 ${
                                             email.label === 'Important' ? 'text-emerald-500 border-emerald-500' :
                                             email.label === 'Social' ? 'text-rose-500 border-rose-500' :
                                             email.label === 'Company' ? 'text-amber-500 border-amber-500' : 'text-indigo-500 border-indigo-500'
                                           }`}>{email.label}</span>
                                        </div>
                                      )}

                                      {/* Dash Border Visual */}
                                      <div className="absolute inset-x-6 inset-y-2 border border-dashed border-white/5 rounded-2xl pointer-events-none transition-all group-hover:border-white/10"></div>
                                   </div>
                                 ))}
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                                 <InboxIcon size={64} />
                                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">Registry Stratum Empty</p>
                              </div>
                            )}
                         </div>

                         {/* Footer Copy */}
                         <div className="p-8 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Copyright © 2025 ki-admin. All rights reserved ❤️ V1.0.0</p>
                            <button className="text-[10px] font-bold text-slate-600 uppercase hover:text-white transition-all flex items-center gap-1">Need Help <ChevronRight size={14}/></button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* TAB PLACEHOLDERS */}
            {!['Dashboard', 'Users', 'Email'].includes(activeTab) && (
               <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
                  <Database size={64} style={{ color: palette.primary }} />
                  <div className="text-center">
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter">Syncing Manifest...</h3>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Loading sector {activeTab} Intelligence nodes</p>
                  </div>
               </div>
            )}

          </main>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        :root {
          --admin-primary: #10918a;
          --admin-secondary: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Admin;