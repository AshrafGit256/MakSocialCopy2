
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ArrowUpRight, ArrowDownRight, Layers, FileJson, Share2,
  Lock, RefreshCcw, Database, Server, Flame, Trophy, Grid, List, Check,
  Image as ImageIcon, Power, Sliders, Command, Radio, Target,
  Briefcase, Rocket, Gauge, Compass, Palette, MoreHorizontal,
  ChevronDown, ExternalLink, FilterX, Laptop, MousePointer, 
  Layout as LayoutIcon, AlignLeft, AlignRight, Maximize, Type,
  Moon, Minus, Settings2, Facebook, Twitter, Instagram, Linkedin,
  PenTool, Code2, Megaphone as MarketingIcon, GraduationCap, BriefcaseIcon,
  Mail, Inbox, Send, Inbox as InboxIcon, Archive, Trash, Tag, Paperclip,
  UserPlus, UserMinus, AtSign, AlignJustify, SearchCode, Flag, MailPlus,
  // Fix: Add missing imports identified by errors
  BookOpen, Info
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
  const [currentDate, setCurrentDate] = useState(new Date());

  // Email States
  const [emails, setEmails] = useState<PlatformEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<PlatformEmail | null>(null);
  const [emailFolder, setEmailFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
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

  // Helper: Apply CSS variables for the palette
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
      to: composeData.to.split(',').map(s => s.trim()),
      cc: composeData.cc.split(',').map(s => s.trim()).filter(Boolean),
      bcc: composeData.bcc.split(',').map(s => s.trim()).filter(Boolean),
      subject: composeData.subject,
      body: composeData.body,
      timestamp: 'Just now',
      isRead: true,
      folder: 'sent'
    };
    db.sendEmail(newEmail);
    
    // Simulate internal delivery for other admins
    const recipientEmails = [...newEmail.to, ...(newEmail.cc || []), ...(newEmail.bcc || [])];
    const internalAdmins = allUsers.filter(u => 
      u.badges?.includes('Administrator') && 
      recipientEmails.some(re => re.toLowerCase() === u.email?.toLowerCase())
    );

    if (internalAdmins.length > 0) {
      const deliveredEmail = { ...newEmail, folder: 'inbox' as const, isRead: false };
      db.sendEmail(deliveredEmail);
    }

    setEmails(db.getEmails());
    setIsComposing(false);
    setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
    alert("Protocol Broadcast: Signal sent to external SMTP and internal strata.");
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
              {isSidebarOpen && <span className="font-black text-xs uppercase tracking-[0.2em] italic">Ki.Command</span>}
           </div>
           <nav className="flex-1 py-8 overflow-y-auto no-scrollbar px-3">
              {renderNavLinks()}
           </nav>
           <div className="p-4 border-t border-white/5">
              <button onClick={onLogout} className="w-full py-3 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                 <Power size={14}/> {isSidebarOpen && "Terminate"}
              </button>
           </div>
        </aside>
      )}

      {/* 2. MAIN VIEWPORT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${layoutOption === 'box' ? 'bg-[#000] p-4 lg:p-10' : ''}`}>
        
        <div className={`flex flex-col h-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0d1117] ${layoutOption === 'box' ? 'max-w-[1440px] mx-auto rounded-[2.5rem] border border-white/10' : ''}`}>
          
          {/* TOP HEADER */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0d1117] shrink-0 z-[90]">
             <div className="flex items-center gap-6">
                {sidebarOption !== 'horizontal' && (
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
                )}
                <div className="flex items-center text-[10px] font-bold text-slate-500 gap-2 uppercase tracking-widest">
                   <span className="hover:text-white cursor-pointer">Admin</span>
                   <ChevronRight size={12}/>
                   <span className="text-white">{activeTab}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase text-white">Registry Architect</span>
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Root_Access</span>
                </div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border border-white/10" />
             </div>
          </header>

          {/* HORIZONTAL NAV (IF ENABLED) */}
          {sidebarOption === 'horizontal' && (
            <div className="bg-[#1e1e2d] border-b border-white/5 py-2 px-6 overflow-x-auto no-scrollbar">
               {renderNavLinks()}
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0d1117] no-scrollbar">
            
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

            {/* USERS SECTION (KI ADMIN STYLE) */}
            {activeTab === 'Users' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                 {/* KI TABS Arrangement */}
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

                 {/* USER GRID MATCHING REFERENCE */}
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                      <div key={user.id} className="bg-[#1e1e2d] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:scale-[1.02] transition-all flex flex-col shadow-2xl">
                         {/* Card Header Abstract Gradient */}
                         <div className={`h-32 w-full bg-gradient-to-br relative ${
                           idx % 3 === 0 ? 'from-indigo-400 via-rose-300 to-amber-200' :
                           idx % 3 === 1 ? 'from-purple-300 via-emerald-300 to-teal-400' :
                           'from-lime-300 via-emerald-200 to-cyan-400'
                         }`}>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                         </div>
                         
                         {/* Avatar Overlap */}
                         <div className="px-8 -mt-12 relative z-10 flex justify-center">
                            <div className="relative">
                               <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#1e1e2d] bg-white object-cover shadow-2xl" />
                            </div>
                         </div>

                         <div className="p-8 text-center flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h3>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.1em] mt-1">{user.role}</p>
                            
                            {/* Metrics Grid */}
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
                               <p className="text-xs text-slate-400 font-medium italic leading-relaxed line-clamp-2 px-4">
                                  "{user.bio || 'Node active in the hill strata. Identity protocols validated and synchronized.'}"
                                </p>
                                {/* Direct Email Visibility */}
                                <div className="pt-4 border-t border-white/2 space-y-1">
                                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Direct Intelligence Channels</p>
                                   <div className="flex flex-col gap-1 items-center">
                                      <span className="text-[10px] font-bold text-indigo-400 font-mono">{user.email}</span>
                                      {user.altEmail && <span className="text-[10px] font-bold text-rose-400 font-mono italic">{user.altEmail}</span>}
                                   </div>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="mt-auto flex justify-center gap-3">
                               <button className="w-9 h-9 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-[#3b5998]/20"><Facebook size={14} /></button>
                               <button className="w-9 h-9 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-[#1da1f2]/20"><Twitter size={14} /></button>
                               <button 
                                 onClick={() => {
                                   setActiveTab('Email');
                                   setComposeData({ ...composeData, to: user.altEmail || user.email || '' });
                                   setIsComposing(true);
                                 }}
                                 className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-rose-500/20"
                               >
                                 <MailPlus size={14} />
                               </button>
                               <button className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-emerald-500/20"><Radio size={14} /></button>
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-40 text-center space-y-6 opacity-30">
                         <Users size={64} className="mx-auto" />
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Strata contains no nodes.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* EMAIL STRATA - K1 ADMIN STYLE */}
            {activeTab === 'Email' && (
              <div className="h-[calc(100vh-140px)] flex flex-col bg-[#0d1117] rounded-3xl border border-white/5 overflow-hidden animate-in fade-in duration-500">
                 <div className="flex h-full">
                    {/* Folder Sidebar */}
                    <aside className="w-64 border-r border-white/5 bg-[#161b22] p-6 space-y-6 shrink-0 flex flex-col">
                       <button 
                         onClick={() => setIsComposing(true)}
                         className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                       >
                          <Plus size={16}/> Compose Protocol
                       </button>
                       <nav className="space-y-1 flex-1">
                          {[
                            { id: 'inbox', label: 'Inbox Registry', icon: <InboxIcon size={16}/>, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
                            { id: 'sent', label: 'Sent Signals', icon: <Send size={16}/> },
                            { id: 'drafts', label: 'Draft Manifests', icon: <FileText size={16}/> },
                            { id: 'trash', label: 'Terminated Logs', icon: <Trash size={16}/> },
                          ].map(item => (
                            <button 
                              key={item.id}
                              onClick={() => { setEmailFolder(item.id as any); setSelectedEmail(null); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${emailFolder === item.id ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                               <span className="flex items-center gap-3">{item.icon} {item.label}</span>
                               {item.count ? <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px]">{item.count}</span> : null}
                            </button>
                          ))}
                       </nav>
                       <div className="p-4 bg-white/2 border border-white/5 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
                             <Server size={10}/> Registry Capacity
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 w-[24%]"></div>
                          </div>
                          <p className="text-[7px] text-slate-500 text-right">1.2GB / 5.0GB</p>
                       </div>
                    </aside>

                    {/* Email Selection Strata */}
                    <div className="flex-1 flex flex-col min-w-0">
                       <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#161b22]/50">
                          <div className="relative w-64">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                             <input className="w-full bg-[#0d1117] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all" placeholder="Query strata signals..." />
                          </div>
                          <div className="flex items-center gap-2">
                             <button className="p-2 text-slate-500 hover:text-white" title="Refresh Registry"><RefreshCcw size={16}/></button>
                             <button className="p-2 text-slate-500 hover:text-white"><MoreHorizontal size={16}/></button>
                          </div>
                       </div>

                       <div className="flex-1 overflow-y-auto no-scrollbar">
                          {emails.filter(e => e.folder === emailFolder).length > 0 ? (
                            emails.filter(e => e.folder === emailFolder).map(email => (
                              <div 
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={`flex items-center gap-6 p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group ${!email.isRead && email.folder === 'inbox' ? 'bg-white/2' : ''} ${selectedEmail?.id === email.id ? 'bg-indigo-600/10' : ''}`}
                              >
                                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {email.fromName.charAt(0)}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                       <h4 className={`text-[11px] font-black uppercase tracking-tight ${!email.isRead && email.folder === 'inbox' ? 'text-white' : 'text-slate-400'}`}>{email.fromName}</h4>
                                       <span className="text-[9px] font-mono text-slate-500">{email.timestamp}</span>
                                    </div>
                                    <p className={`text-[11px] font-bold uppercase tracking-widest truncate ${!email.isRead && email.folder === 'inbox' ? 'text-indigo-400' : 'text-slate-500'}`}>{email.subject}</p>
                                    <p className="text-[10px] text-slate-500 italic truncate mt-1">{email.body.substring(0, 100)}...</p>
                                 </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                               <Inbox size={48} />
                               <p className="text-[10px] font-black uppercase tracking-widest">Registry Stratum Empty.</p>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Content Viewer */}
                    {selectedEmail ? (
                      <div className="w-[600px] border-l border-white/5 bg-[#161b22] flex flex-col animate-in slide-in-from-right duration-300">
                         <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-500 hover:text-white"><ChevronLeft size={20}/></button>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signal_Deep_Scan</span>
                            </div>
                            <div className="flex gap-2">
                               <button className="p-2 text-slate-500 hover:text-indigo-500"><Archive size={16}/></button>
                               <button className="p-2 text-slate-500 hover:text-rose-500"><Trash size={16}/></button>
                               <button className="p-2 text-slate-500 hover:text-amber-500"><Flag size={16}/></button>
                            </div>
                         </div>
                         <div className="p-8 flex-1 overflow-y-auto no-scrollbar space-y-8">
                            <div className="space-y-6">
                               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">{selectedEmail.subject}</h2>
                               <div className="flex items-center gap-4 p-4 bg-white/2 rounded-2xl border border-white/5">
                                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-600/20">{selectedEmail.fromName.charAt(0)}</div>
                                  <div className="flex-1">
                                     <p className="text-xs font-black text-white uppercase">{selectedEmail.fromName}</p>
                                     <p className="text-[10px] text-slate-500 font-bold">{selectedEmail.from}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[8px] font-black text-slate-500 uppercase">Comm_ID</p>
                                     <p className="text-[10px] font-mono text-indigo-400">#{selectedEmail.id.slice(-4)}</p>
                                  </div>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                  {selectedEmail.to.map((t, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] text-slate-400 font-bold uppercase">To: {t}</span>
                                  ))}
                                  {selectedEmail.cc?.map((t, i) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-md text-[9px] text-indigo-400 font-bold uppercase">CC: {t}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="p-8 bg-[#0d1117] rounded-3xl border border-white/5 text-sm text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap shadow-inner min-h-[300px]">
                               {selectedEmail.body}
                            </div>
                            {selectedEmail.folder === 'inbox' && (
                               <div className="p-6 border border-dashed border-white/10 rounded-2xl flex items-center gap-4 bg-white/2">
                                  <Info size={20} className="text-indigo-400" />
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">This signal was intercepted via the encrypted Hill registry. Reply directly to sync with the target node.</p>
                               </div>
                            )}
                         </div>
                         <div className="p-6 border-t border-white/5 flex gap-3">
                            <button onClick={() => setIsComposing(true)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Reply Stratum</button>
                            <button className="flex-1 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Forward Protocol</button>
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6">
                         <Radar size={120} className="animate-pulse" />
                         <h3 className="text-3xl font-black uppercase italic tracking-tighter">Awaiting Signal Select</h3>
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

      {/* EMAIL COMPOSE MODAL (K1 STYLE) */}
      {isComposing && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#1e1e2d] w-full max-w-3xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="p-8 bg-indigo-600 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                       <PenTool size={24} className="text-white" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Compose Protocol</h2>
                       <p className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Signal Authorization Module</p>
                    </div>
                 </div>
                 <button onClick={() => setIsComposing(false)} className="text-white/60 hover:text-white transition-colors p-2"><X size={32}/></button>
              </div>
              <div className="p-10 space-y-8 flex-1 overflow-y-auto no-scrollbar">
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Registry (To)</label>
                          <div className="relative group">
                             <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                             <input 
                               className="w-full bg-black/20 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-indigo-600 transition-all" 
                               value={composeData.to}
                               onChange={e => setComposeData({...composeData, to: e.target.value})}
                               placeholder="NODE_ADDRESS@MAK.AC.UG" 
                             />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Visible Strata (CC)</label>
                          <input 
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-6 text-sm font-bold text-slate-400 outline-none focus:border-indigo-600 transition-all" 
                            value={composeData.cc}
                            onChange={e => setComposeData({...composeData, cc: e.target.value})}
                            placeholder="PEER_NODES_STRATA"
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Hidden Strata (BCC)</label>
                       <input 
                         className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-6 text-sm font-bold text-slate-400 outline-none focus:border-indigo-600 transition-all" 
                         value={composeData.bcc}
                         onChange={e => setComposeData({...composeData, bcc: e.target.value})}
                         placeholder="AUTHORITY_SHADOW_NODES (Secret recipients)"
                       />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Signal Manifest (Subject)</label>
                       <input 
                         className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-6 text-base font-black text-indigo-400 uppercase tracking-tighter outline-none focus:border-indigo-600 transition-all" 
                         value={composeData.subject}
                         onChange={e => setComposeData({...composeData, subject: e.target.value})}
                         placeholder="MANIFEST_PROTOCOL_NAME"
                       />
                    </div>
                 </div>

                 {/* Premium Toolbar */}
                 <div className="flex items-center gap-6 py-4 border-y border-white/5">
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"><Type size={18}/></button>
                       <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"><AlignJustify size={18}/></button>
                       <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"><Paperclip size={18}/></button>
                    </div>
                    <div className="w-px h-6 bg-white/5"></div>
                    <div className="flex items-center gap-2">
                       <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-lg"><Code2 size={18}/></button>
                       <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-lg"><SearchCode size={18}/></button>
                    </div>
                 </div>

                 <textarea 
                   className="w-full bg-black/30 border border-white/5 rounded-[2rem] p-10 text-base text-slate-300 font-medium italic outline-none focus:border-indigo-600 min-h-[300px] resize-none shadow-inner"
                   value={composeData.body}
                   onChange={e => setComposeData({...composeData, body: e.target.value})}
                   placeholder="INITIALIZE LOG PAYLOAD..."
                 />
              </div>
              <div className="p-10 border-t border-white/5 flex justify-end items-center gap-6 bg-[#161b22]">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck size={14}/> AES_ENCRYPTION_ACTIVE
                 </span>
                 <div className="flex gap-4">
                    <button onClick={() => setIsComposing(false)} className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Abort_Signal</button>
                    <button 
                      onClick={handleSendEmail}
                      className="px-16 py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                       Authorize Broadcast
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* FLOATING CUSTOMIZER TRIGGER */}
      <button 
        onClick={() => setIsCustomizerOpen(true)}
        className="fixed bottom-10 right-10 z-[200] p-4 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
        style={{ backgroundColor: palette.primary }}
      >
        <Settings2 size={24} />
      </button>

      {/* THE ADMIN CUSTOMIZER (KI DRAWER) */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCustomizerOpen(false)}></div>
           
           <div className="relative w-full max-w-sm max-sm:w-full h-full bg-[#1e1e2d] text-[#c9d1d9] shadow-2xl flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Customizer Header */}
              <div className="p-6 flex justify-between items-start border-b border-white/5" style={{ backgroundColor: palette.primary }}>
                 <div>
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Admin Customizer</h2>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1 italic">Style your terminal protocols</p>
                 </div>
                 <button onClick={() => setIsCustomizerOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar">
                 
                 {/* Sidebar Option */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Sidebar Option</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'vertical', label: 'Vertical', icon: <LayoutIcon size={18}/> },
                         { id: 'horizontal', label: 'Horizontal', icon: <MoreHorizontal size={18}/> },
                         { id: 'dark', label: 'Dark', icon: <Moon size={18}/> }
                       ].map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => setSidebarOption(opt.id as any)}
                            className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-2 relative ${sidebarOption === opt.id ? 'bg-white/5 border-emerald-500 text-white' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                          >
                             <div className={`p-3 rounded-lg ${sidebarOption === opt.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40'}`}>
                                {opt.icon}
                             </div>
                             <span className="text-[9px] font-black uppercase">{opt.label}</span>
                             {sidebarOption === opt.id && <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Layout Option */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Layout Option</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'ltr', label: 'LTR', icon: <AlignLeft size={18}/> },
                         { id: 'rtl', label: 'RTL', icon: <AlignRight size={18}/> },
                         { id: 'box', label: 'Boxed', icon: <Maximize size={18}/> }
                       ].map(opt => (
                          <button 
                            key={opt.id} 
                            onClick={() => setLayoutOption(opt.id as any)}
                            className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-2 relative ${layoutOption === opt.id ? 'bg-white/5 border-emerald-500 text-white' : 'bg-black/20 border-white/5 opacity-50 hover:opacity-100'}`}
                          >
                             <div className={`p-3 rounded-lg ${layoutOption === opt.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40'}`}>
                                {opt.icon}
                             </div>
                             <span className="text-[9px] font-black uppercase">{opt.label}</span>
                             {layoutOption === opt.id && <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Color Hint */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Color Palette</h3>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                       {ACCENT_PALETTES.map((pal, i) => (
                          <button 
                            key={i} 
                            onClick={() => setPalette(pal)}
                            className={`relative group w-12 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${palette.name === pal.name ? 'border-indigo-600 ring-4 ring-indigo-600/10 shadow-2xl' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                          >
                             <div className="h-1/2 w-full" style={{ backgroundColor: pal.primary }}></div>
                             <div className="h-1/2 w-full" style={{ backgroundColor: pal.secondary }}></div>
                             {palette.name === pal.name && <div className="absolute top-1 left-1"><Check size={8} className="text-white"/></div>}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-white/5 grid grid-cols-2 gap-4">
                 <button className="py-4 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Default_OS</button>
                 <button onClick={() => setIsCustomizerOpen(false)} className="py-4 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">Commit_Sync</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        /* platform-wide palette application */
        :root {
          --admin-primary: #10918a;
          --admin-secondary: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Admin;
