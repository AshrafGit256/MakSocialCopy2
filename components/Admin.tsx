
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { User, PlatformEmail } from '../types';
import { 
  AreaChart, Area, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { ANALYTICS } from '../constants';
import { 
  Users, Activity, Trash2, Plus, 
  Calendar as CalendarIcon, Zap, X, FileText, 
  ShieldCheck, LayoutDashboard, Menu, Bell, 
  LogOut, TrendingUp, ChevronRight, ChevronLeft,
  Database, Search, Filter, Shield, Cpu,
  ArrowLeft, Layers, Lock, Inbox, Send, Archive, 
  Star, Bookmark, Folder, Tag, Maximize2, Bold, 
  Italic, List, Code, Smile, Paperclip, Redo2, 
  Undo2, AlignLeft, AlignCenter, AlignRight, 
  Settings, Check, CheckSquare, MoreVertical, Layout, 
  Eye, Download, Palette, Type, Globe, Sun, Moon,
  AlertCircle, Clock, ChevronDown, Reply, ReplyAll, Forward,
  File, Image as ImageIcon, RotateCw, Trash, MoreHorizontal,
  ChevronUp, ExternalLink, Printer
} from 'lucide-react';

const Admin: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Email');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  
  // Customization State
  const [sidebarOpt, setSidebarOpt] = useState<'vertical' | 'horizontal' | 'dark'>('vertical');
  const [layoutOpt, setLayoutOpt] = useState<'ltr' | 'rtl' | 'box'>('ltr');
  const [activeColor, setActiveColor] = useState('#10918a');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('sm');

  // Email State
  const [emailView, setEmailView] = useState<'list' | 'read' | 'compose'>('list');
  const [emails, setEmails] = useState<PlatformEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<PlatformEmail | null>(null);
  const [emailFolder, setEmailFolder] = useState<PlatformEmail['folder']>('inbox');

  useEffect(() => {
    setEmails(db.getEmails());
  }, []);

  const handleReadEmail = (email: PlatformEmail) => {
    setSelectedEmail(email);
    setEmailView('read');
  };

  const stats = [
    { label: 'Total Nodes', value: db.getUsers().length, trend: '+12%', color: 'text-indigo-500' },
    { label: 'Active Signals', value: db.getPosts().length, trend: '+5%', color: 'text-emerald-500' },
    { label: 'Protocol Uptime', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
    { label: 'Network Latency', value: '14ms', trend: '-2ms', color: 'text-amber-500' },
  ];

  const EmailSidebar = () => (
    <aside className="w-full lg:w-64 flex flex-col shrink-0 gap-6">
      <button 
        onClick={() => setEmailView('compose')}
        className="w-full py-3.5 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-[2px] font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Plus size={16}/> Compose
      </button>

      <div className="bg-white dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] overflow-hidden">
        <div className="px-4 py-3 bg-[#f8fafc] dark:bg-[#0d1117] border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Folders</span>
          <ChevronUp size={14} className="text-slate-400" />
        </div>
        <nav className="p-1">
          {[
            { id: 'inbox', icon: <Inbox size={14}/>, count: '12', color: 'text-[#007bff]' },
            { id: 'sent', icon: <Send size={14}/> },
            { id: 'draft', icon: <FileText size={14}/> },
            { id: 'junk', icon: <Filter size={14}/>, count: '65', badgeColor: 'bg-[#ffc107] text-black' },
            { id: 'trash', icon: <Trash size={14}/> }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => {setEmailFolder(item.id as any); setEmailView('list');}}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-[11px] font-bold uppercase tracking-widest transition-all ${emailFolder === item.id ? 'bg-[#007bff] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">{item.icon} <span className="capitalize">{item.id}</span></div>
              {item.count && <span className={`px-1.5 py-0.5 rounded-[2px] text-[9px] font-black ${item.badgeColor || 'bg-[#007bff] text-white'}`}>{item.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] overflow-hidden">
        <div className="px-4 py-3 bg-[#f8fafc] dark:bg-[#0d1117] border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Labels</span>
          <ChevronUp size={14} className="text-slate-400" />
        </div>
        <div className="p-2 space-y-1">
          {[
            { id: 'Important', color: 'border-rose-500' },
            { id: 'Promotions', color: 'border-amber-500' },
            { id: 'Social', color: 'border-blue-500' }
          ].map(label => (
            <button key={label.id} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <div className={`w-3 h-3 rounded-full border-2 ${label.color}`}></div>
              <span>{label.id}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen w-full bg-[#f4f6f9] dark:bg-[#0d1117] flex font-sans text-[#1e293b] dark:text-[#c9d1d9] transition-all duration-500 ${layoutOpt === 'box' ? 'p-4 lg:p-10' : ''}`}>
      <div className={`flex-1 flex overflow-hidden ${layoutOpt === 'box' ? 'rounded-[4px] border border-[#e2e8f0] dark:border-[#30363d] shadow-2xl bg-white dark:bg-[#0d1117]' : ''} ${layoutOpt === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* SIDEBAR */}
        <aside className={`transition-all duration-300 flex flex-col shrink-0 z-[100] ${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#343a40] border-r border-white/5`}>
          <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0 gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xl">
              <ShieldCheck size={18} className="text-[#343a40]" />
            </div>
            {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest text-white">Admin Terminal</span>}
          </div>
          <nav className="flex-1 py-8 overflow-y-auto no-scrollbar px-3 space-y-1">
            {[
              { id: 'Dashboard', icon: <LayoutDashboard size={18}/> },
              { id: 'Users', icon: <Users size={18}/> },
              { id: 'Email', icon: <Inbox size={18}/> },
              { id: 'Security', icon: <Shield size={18}/> },
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-[2px] transition-all ${activeTab === item.id ? 'bg-white/10 text-white border-l-4 border-[#007bff]' : 'text-[#c2c7d0] hover:text-white hover:bg-white/5'}`}
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-4 text-[11px] font-black uppercase tracking-widest">{item.id}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between px-8 bg-white dark:bg-[#0d1117] shrink-0 z-[90]">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-500"><Menu size={20}/></button>
              <div className="relative group w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input className="w-full bg-[#f1f5f9] dark:bg-[#161b22] border border-transparent dark:border-[#30363d] rounded-[2px] py-2 pl-10 pr-4 text-xs dark:text-white focus:border-[#007bff] outline-none" placeholder="Search..." />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><Globe size={18}/></button>
              <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white relative"><Bell size={18}/><span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0d1117]"></span></button>
              <button onClick={() => setCustomizerOpen(true)} className="p-2 bg-[#007bff]/10 text-[#007bff] rounded-[2px] animate-spin-slow"><Settings size={18}/></button>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10" alt="Admin" />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar relative p-4 lg:p-8">
            {activeTab === 'Email' && (
              <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl font-black uppercase text-[var(--text-primary)]">
                    {emailView === 'list' ? 'Inbox' : emailView === 'read' ? 'Read Email' : 'Compose'}
                  </h1>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="text-[#007bff]">Home</span> <ChevronRight size={10}/> <span>Email</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <EmailSidebar />

                  <div className="flex-1 bg-white dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] shadow-sm flex flex-col relative min-h-[700px]">
                    {emailView === 'list' ? (
                      <>
                        <div className="p-4 border-b border-[#e2e8f0] dark:border-[#30363d] flex flex-wrap items-center justify-between gap-4 bg-[#f8fafc] dark:bg-[#0d1117]">
                          <div className="flex items-center gap-1">
                            <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500 hover:text-rose-500"><Trash size={14}/></button>
                            <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500"><RotateCw size={14}/></button>
                            <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500"><MoreHorizontal size={14}/></button>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                              <span>1-50/200</span>
                              <div className="flex ml-2">
                                <button className="p-1 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px]"><ChevronLeft size={14}/></button>
                                <button className="p-1 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px]"><ChevronRight size={14}/></button>
                              </div>
                            </div>
                            <div className="relative">
                              <input className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] py-1.5 pl-3 pr-10 text-[11px] w-48 font-bold outline-none" placeholder="Search Mail" />
                              <button className="absolute right-0 top-0 bottom-0 px-3 bg-[#007bff] text-white"><Search size={14}/></button>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                          {emails.map((email, i) => (
                            <div 
                              key={email.id} 
                              onClick={() => handleReadEmail(email)}
                              className="px-4 py-3.5 border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center gap-6 hover:bg-[#f8fafc] dark:hover:bg-white/[0.02] cursor-pointer group transition-colors"
                            >
                              <div className="flex items-center gap-4 shrink-0">
                                <input type="checkbox" className="w-4 h-4 rounded-[2px] bg-white dark:bg-black/20 border-[#e2e8f0] dark:border-[#30363d]" onClick={e => e.stopPropagation()}/>
                                <button className={`hover:text-amber-500 ${email.isStarred ? 'text-amber-500' : 'text-slate-300'}`}><Star size={16} fill={email.isStarred ? "currentColor" : "none"}/></button>
                              </div>
                              <div className="w-48 shrink-0 flex items-center gap-3">
                                <img src={email.fromAvatar} className="w-8 h-8 rounded-full border border-slate-100 dark:border-[#30363d]" />
                                <span className="text-[12px] font-black text-[#007bff] truncate uppercase">{email.fromName}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-slate-800 dark:text-slate-300 truncate">
                                  {email.subject} <span className="text-slate-400 font-normal"> - {email.body.slice(0, 80)}...</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                {email.attachments && <Paperclip size={14} className="text-slate-400"/>}
                                <span className="text-[10px] font-mono text-slate-500 uppercase">{email.timestamp} ago</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : emailView === 'read' ? (
                      /* READ EMAIL VIEW - High Fidelity matching screenshot */
                      <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-4">
                        <div className="p-4 border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between bg-[#f8fafc] dark:bg-[#0d1117]">
                           <div className="flex items-center gap-1">
                              <button onClick={() => setEmailView('list')} className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500 hover:text-[#007bff]"><ArrowLeft size={14}/></button>
                              <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500"><Trash size={14}/></button>
                              <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500"><Reply className="rotate-180" size={14}/></button>
                              <button className="p-2 border border-[#e2e8f0] dark:border-[#30363d] bg-white dark:bg-[#161b22] rounded-[2px] text-slate-500"><Forward size={14}/></button>
                           </div>
                           <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold uppercase">
                              <span>2 to 10</span>
                              <div className="flex gap-1">
                                 <button className="p-1 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px]"><ChevronLeft size={14}/></button>
                                 <button className="p-1 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px]"><ChevronRight size={14}/></button>
                              </div>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-8">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedEmail?.subject || 'Message Subject Is Placed Here'}</h2>
                                 <div className="flex items-center gap-3 mt-4">
                                    <img src={selectedEmail?.fromAvatar} className="w-10 h-10 rounded-full border border-[#e2e8f0] dark:border-[#30363d]" />
                                    <div>
                                       <h3 className="text-[13px] font-black text-[#007bff]">{selectedEmail?.from}</h3>
                                       <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">to me <ChevronDown size={10}/></p>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[11px] font-bold text-slate-400 uppercase">{selectedEmail?.fullDate || '15 Feb. 2025 11:03 PM'}</p>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Hello John,</p>
                              <div className="text-[14px] text-slate-600 dark:text-slate-400 leading-[1.8] font-medium whitespace-pre-line">
                                {selectedEmail?.body}
                              </div>
                              <div className="pt-8">
                                 <p className="text-sm text-slate-500 font-bold italic">Thanks,</p>
                                 <p className="text-sm font-black text-slate-800 dark:text-white mt-1 uppercase tracking-tight">{selectedEmail?.fromName}</p>
                              </div>
                           </div>

                           {/* ATTACHMENT CARDS - Matching Screenshot */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 border-t border-[#e2e8f0] dark:border-[#30363d]">
                              {[
                                { id: 1, name: 'Sep2014-report.pdf', size: '1,245 KB', type: 'pdf' },
                                { id: 2, name: 'App Description.docx', size: '1,245 KB', type: 'docx' },
                                { id: 3, name: 'photo1.png', size: '2.67 MB', type: 'image', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300' },
                                { id: 4, name: 'photo2.png', size: '1.9 MB', type: 'image', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300' }
                              ].map(att => (
                                <div key={att.id} className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] overflow-hidden group shadow-sm">
                                  <div className="h-24 bg-slate-50 dark:bg-black/20 flex items-center justify-center relative">
                                    {att.type === 'image' ? (
                                      <img src={att.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    ) : att.type === 'pdf' ? (
                                      <FileText size={40} className="text-rose-500" />
                                    ) : (
                                      <FileText size={40} className="text-blue-500" />
                                    )}
                                  </div>
                                  <div className="p-3 space-y-3">
                                    <p className="text-[11px] font-black text-slate-800 dark:text-slate-300 truncate flex items-center gap-2 uppercase">
                                      {att.type === 'pdf' ? <FileText size={12}/> : att.type === 'image' ? <ImageIcon size={12}/> : <File size={12}/>}
                                      {att.name}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">{att.size}</span>
                                      <button className="p-1.5 bg-[#f8fafc] dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] text-slate-500 hover:text-[#007bff]"><Download size={12}/></button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                           </div>

                           <div className="flex gap-2 pt-10">
                              <button className="px-6 py-2 border border-[#e2e8f0] dark:border-[#30363d] bg-[#f8fafc] dark:bg-[#161b22] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-all"><Trash size={14}/> Delete</button>
                              <button className="px-6 py-2 border border-[#e2e8f0] dark:border-[#30363d] bg-[#f8fafc] dark:bg-[#161b22] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-all"><Printer size={14}/> Print</button>
                              <div className="flex-1"></div>
                              <button className="px-8 py-2 border border-[#e2e8f0] dark:border-[#30363d] bg-[#f8fafc] dark:bg-[#161b22] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-all"><Reply className="rotate-180" size={14}/> Reply</button>
                              <button className="px-8 py-2 border border-[#e2e8f0] dark:border-[#30363d] bg-[#f8fafc] dark:bg-[#161b22] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-all">Forward <Forward size={14}/></button>
                           </div>
                        </div>
                      </div>
                    ) : (
                      /* COMPOSE NEW MESSAGE VIEW - Matching Screenshot */
                      <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
                        <div className="px-6 py-4 border-b border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between bg-[#f8fafc] dark:bg-[#0d1117]">
                           <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Compose New Message</h2>
                           <button onClick={() => setEmailView('list')} className="p-2 text-slate-400 hover:text-rose-500"><X size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-white dark:bg-[#0d1117]">
                           <div className="relative group">
                             <input className="w-full bg-white dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] py-3 px-4 text-xs font-bold dark:text-white outline-none focus:border-[#007bff]" placeholder="To:" />
                           </div>
                           <div className="relative group">
                             <input className="w-full bg-white dark:bg-[#161b22] border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] py-3 px-4 text-xs font-bold dark:text-white outline-none focus:border-[#007bff]" placeholder="Subject:" />
                           </div>

                           <div className="border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] overflow-hidden flex flex-col h-[500px]">
                              {/* Rich Text Toolbar - High Density */}
                              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f8fafc] dark:bg-[#161b22] border-b border-[#e2e8f0] dark:border-[#30363d]">
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><Redo2 className="rotate-180" size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><Bold size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><Italic size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500 font-serif font-black italic underline">U</button>
                                 <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#30363d] mx-1"></div>
                                 <select className="bg-white dark:bg-black/20 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] text-[10px] px-2 py-1 outline-none text-slate-500 font-bold uppercase">
                                    <option>Source Sans Pro</option>
                                    <option>JetBrains Mono</option>
                                 </select>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500 font-black">A</button>
                                 <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#30363d] mx-1"></div>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><AlignLeft size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><AlignCenter size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><AlignRight size={14}/></button>
                                 <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#30363d] mx-1"></div>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><List size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><Plus size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><ImageIcon size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><MoreHorizontal size={14}/></button>
                                 <div className="w-px h-5 bg-[#e2e8f0] dark:bg-[#30363d] mx-1"></div>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500"><Code size={14}/></button>
                                 <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-[2px] text-slate-500 text-[10px] font-black">?</button>
                              </div>
                              <textarea className="flex-1 p-8 bg-white dark:bg-[#0d1117] outline-none text-[15px] dark:text-white font-medium leading-loose resize-none" placeholder="Type message..."></textarea>
                           </div>

                           <div className="space-y-4">
                              <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] dark:border-[#30363d] bg-[#f8fafc] dark:bg-[#161b22] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"><Paperclip size={14}/> Attachment</button>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max. 32MB</p>
                           </div>

                           <div className="flex items-center justify-between pt-8 border-t border-[#e2e8f0] dark:border-[#30363d]">
                              <button className="px-6 py-2 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:text-rose-500 hover:border-rose-500 transition-all"><X size={14}/> Discard</button>
                              <div className="flex gap-3">
                                 <button className="px-8 py-2 border border-[#e2e8f0] dark:border-[#30363d] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"><FileText size={14}/> Draft</button>
                                 <button className="px-10 py-2.5 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-[2px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95"><Send size={16}/> Send</button>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Dashboard' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(s => (
                      <div key={s.label} className="bg-white dark:bg-[#161b22] p-6 rounded-[2px] border border-[#e2e8f0] dark:border-[#30363d] shadow-sm relative overflow-hidden group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-slate-50 dark:bg-black/20 rounded-[2px] border border-[#e2e8f0] dark:border-[#30363d] text-[#007bff]">
                              {s.label.includes('Nodes') ? <Users size={20}/> : <Activity size={20}/>}
                            </div>
                            <span className={`text-[10px] font-black uppercase ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{s.trend}</span>
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 italic tracking-tighter ticker-text">{s.value}</h3>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{s.label}</p>
                         <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#007bff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-[#161b22] p-8 rounded-[2px] border border-[#e2e8f0] dark:border-[#30363d] shadow-sm space-y-8">
                       <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-[#007bff]"/> Signal Intensity</h4>
                       <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ANALYTICS}><Area type="monotone" dataKey="posts" stroke="#007bff" strokeWidth={3} fill="#007bff11" /></AreaChart></ResponsiveContainer></div>
                    </div>
                    <div className="bg-white dark:bg-[#161b22] p-8 rounded-[2px] border border-[#e2e8f0] dark:border-[#30363d] shadow-sm space-y-8">
                       <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Database size={16} className="text-[#007bff]"/> Node Manifests</h4>
                       <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={ANALYTICS}><Bar dataKey="messages" fill="#007bff" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div>
                    </div>
                 </div>
              </div>
            )}
          </main>

          <footer className="h-14 border-t border-[#e2e8f0] dark:border-[#30363d] flex items-center justify-between px-8 bg-white dark:bg-[#0d1117] shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="hidden sm:block">Copyright © 2025 <span className="text-[#007bff]">ki-admin</span>. All rights reserved ❤️ V1.0.0</div>
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Need Help?</button>
            </div>
          </footer>
        </div>

        {/* ADMIN CUSTOMIZER DRAWER */}
        {customizerOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCustomizerOpen(false)}></div>
            <aside className="relative w-full max-w-sm h-full bg-white dark:bg-[#1e1e2d] border-l border-[#e2e8f0] dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar">
              <div className="p-8 border-b border-[#e2e8f0] dark:border-white/10 bg-[#f8fafc] dark:bg-[#007bff]/10 flex justify-between items-start">
                 <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">Admin Customizer</h2>
                    <p className="text-[10px] text-[#007bff] font-bold uppercase tracking-widest">Style synchronization sequence</p>
                 </div>
                 <button onClick={() => setCustomizerOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-12">
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-[#e2e8f0] dark:border-white/5 pb-2">Sidebar option</h3>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { id: 'vertical', label: 'Vertical' },
                         { id: 'horizontal', label: 'Horizontal' },
                         { id: 'dark', label: 'Dark' }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setSidebarOpt(opt.id as any)} className={`relative p-1 rounded-[2px] border-2 transition-all overflow-hidden ${sidebarOpt === opt.id ? 'border-[#007bff]' : 'border-slate-200 dark:border-white/5 hover:border-[#007bff]/40'}`}>
                            {sidebarOpt === opt.id && <div className="absolute top-1 left-1 bg-[#007bff] rounded-full p-0.5"><Check size={10} className="text-white"/></div>}
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-white/5 rounded-sm flex flex-col p-2 space-y-1">
                               <div className="h-1 w-1/2 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                               <div className="h-1 w-3/4 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                               <div className={`mt-2 flex-1 rounded border-dashed border border-slate-300 dark:border-white/10 flex items-center justify-center`}>
                                  <span className="text-[7px] font-black uppercase text-slate-400">{opt.label}</span>
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-[#e2e8f0] dark:border-white/5 pb-2">Layout option</h3>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { id: 'ltr', label: 'LTR' },
                         { id: 'rtl', label: 'RTL' },
                         { id: 'box', label: 'Box' }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setLayoutOpt(opt.id as any)} className={`relative p-1 rounded-[2px] border-2 transition-all overflow-hidden ${layoutOpt === opt.id ? 'border-[#007bff]' : 'border-slate-200 dark:border-white/5 hover:border-[#007bff]/40'}`}>
                            {layoutOpt === opt.id && <div className="absolute top-1 left-1 bg-[#007bff] rounded-full p-0.5"><Check size={10} className="text-white"/></div>}
                            <div className={`aspect-[4/5] ${opt.id === 'box' ? 'bg-[#007bff]/10 border-2 border-[#007bff]' : 'bg-slate-100 dark:bg-white/5'} rounded-sm flex items-center justify-center`}>
                               <span className={`text-[8px] font-black uppercase ${opt.id === 'box' ? 'text-[#007bff]' : 'text-slate-400'}`}>{opt.label}</span>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-[#e2e8f0] dark:border-white/5 pb-2">Color Hint</h3>
                    <div className="flex flex-wrap gap-3">
                       {[
                         { c1: '#007bff', c2: '#cbd5e1' },
                         { c1: '#10918a', c2: '#cbd5e1' },
                         { c1: '#7e57c2', c2: '#3f51b5' },
                         { c1: '#f43f5e', c2: '#cbd5e1' },
                         { c1: '#1e293b', c2: '#cbd5e1' }
                       ].map((c, i) => (
                         <button 
                           key={i} 
                           onClick={() => setActiveColor(c.c1)} 
                           className={`w-10 h-16 rounded-[4px] border-2 overflow-hidden transition-all relative ${activeColor === c.c1 ? 'border-[#007bff] scale-110 shadow-lg' : 'border-slate-200 dark:border-white/5 hover:border-[#007bff]/40'}`}
                         >
                            {activeColor === c.c1 && <div className="absolute top-1 left-1 bg-[#007bff] rounded-full p-0.5 z-10"><Check size={10} className="text-white"/></div>}
                            <div className="h-1/2 w-full" style={{ backgroundColor: c.c1 }}></div>
                            <div className="h-1/2 w-full" style={{ backgroundColor: c.c2 }}></div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6 pb-20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-[#e2e8f0] dark:border-white/5 pb-2">Text size</h3>
                    <div className="flex gap-2">
                       {['sm', 'md', 'lg'].map(sz => (
                         <button 
                           key={sz} 
                           onClick={() => setTextSize(sz as any)}
                           className={`px-6 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest border transition-all ${textSize === sz ? 'bg-[#007bff] border-transparent text-white' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                         >
                            {textSize === sz && <Check size={12} className="inline mr-2"/>}
                            {sz}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ticker-text { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
};

export default Admin;
