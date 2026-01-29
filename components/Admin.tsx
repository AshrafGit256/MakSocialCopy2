
import React, { useState, useEffect, useMemo } from 'react';
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
  Settings, CheckSquare, MoreVertical, Layout, 
  Eye, Download, Palette, Type, Globe, Sun, Moon,
  // Added missing icons AlertCircle, Clock, ChevronDown to fix build errors
  AlertCircle, Clock, ChevronDown
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
    { label: 'Active Nodes', value: db.getUsers().length, trend: '+12%', color: 'text-indigo-500' },
    { label: 'Signal Stream', value: db.getPosts().length, trend: '+5%', color: 'text-emerald-500' },
    { label: 'Treasury Cap', value: '42.8M', trend: '-2%', color: 'text-amber-500' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', color: 'text-rose-500' },
  ];

  return (
    <div className={`min-h-screen w-full bg-[#0d1117] flex font-sans text-[#c9d1d9] transition-all duration-500 ${layoutOpt === 'box' ? 'p-10' : ''}`}>
      <div className={`flex-1 flex overflow-hidden ${layoutOpt === 'box' ? 'rounded-[2rem] border border-white/5 shadow-2xl bg-[#0d1117]' : ''} ${layoutOpt === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* SIDEBAR */}
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
              { id: 'Email', icon: <Inbox size={18}/> },
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
              <LogOut size={14}/> {isSidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] overflow-hidden">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d1117] shrink-0 z-[90]">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-slate-400"><Menu size={20}/></button>
              <div className="relative group w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input className="w-full bg-white/5 border-none rounded-full py-2 pl-10 pr-4 text-xs text-white focus:ring-1 focus:ring-[#10918a] outline-none" placeholder="Search..." />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <button className="text-slate-500 hover:text-white"><Globe size={18}/></button>
              <button className="text-slate-500 hover:text-white"><Maximize2 size={18}/></button>
              <button className="text-slate-500 hover:text-white relative"><Bell size={18}/><span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#0d1117]"></span></button>
              <button onClick={() => setCustomizerOpen(true)} className="p-2 bg-[#10918a]/10 text-[#10918a] rounded-lg animate-spin-slow"><Settings size={18}/></button>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-9 h-9 rounded-full border border-white/10" alt="Admin" />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar relative p-8">
            {activeTab === 'Email' && (
              <div className="h-full flex flex-col animate-in fade-in duration-500">
                <div className="mb-6 flex flex-col">
                  <h1 className="text-2xl font-black text-white">Email</h1>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    <span className="text-[#10918a]">Apps</span> <ChevronRight size={10}/> <span>Email</span>
                  </div>
                </div>

                <div className="flex-1 flex gap-8">
                  {/* EMAIL SIDEBAR */}
                  <aside className="w-64 flex flex-col shrink-0 space-y-8">
                    <button className="w-full py-4 bg-[#10918a] text-white rounded-lg font-black text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95">Compose</button>
                    <nav className="flex flex-col gap-1">
                      {[
                        { id: 'inbox', icon: <Inbox size={18}/>, count: '10+' },
                        { id: 'sent', icon: <Send size={18}/> },
                        { id: 'draft', icon: <FileText size={18}/> },
                        { id: 'starred', icon: <Star size={18}/>, count: '2+' },
                        { id: 'spam', icon: <AlertCircle size={18}/> },
                        { id: 'trash', icon: <Trash2 size={18}/> }
                      ].map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => {setEmailFolder(item.id as any); setEmailView('list');}}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${emailFolder === item.id ? 'bg-[#10918a]/10 text-[#10918a]' : 'text-slate-500 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-4">{item.icon} <span className="capitalize">{item.id}</span></div>
                          {item.count && <span className="text-[10px] opacity-70">{item.count}</span>}
                        </button>
                      ))}
                    </nav>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white px-4">Labels</h4>
                      {[
                        { id: 'Social', color: 'bg-rose-500' },
                        { id: 'Company', color: 'bg-amber-500' },
                        { id: 'Important', color: 'bg-emerald-500' },
                        { id: 'Private', color: 'bg-indigo-500' }
                      ].map(label => (
                        <button key={label.id} className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold text-slate-500 hover:text-white transition-colors">
                          <div className={`w-2 h-2 rounded-full ${label.color}`}></div>
                          <span>{label.id}</span>
                        </button>
                      ))}
                    </div>
                  </aside>

                  {/* EMAIL CONTENT AREA */}
                  <div className="flex-1 bg-[#1e1e2d] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                    {emailView === 'list' ? (
                      <>
                        <div className="p-6 border-b border-white/5 flex items-center gap-4">
                          <div className="bg-[#10918a]/20 p-3 rounded-xl text-[#10918a]"><Search size={18}/></div>
                          <input className="flex-1 bg-transparent border-none outline-none text-sm text-white font-bold" placeholder="Search..." />
                          <button className="p-2 text-slate-500"><MoreVertical size={18}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                          {emails.map((email, i) => (
                            <div 
                              key={email.id} 
                              onClick={() => handleReadEmail(email)}
                              className="px-8 py-6 border-b border-white/5 border-dashed flex items-center gap-6 hover:bg-white/[0.02] cursor-pointer group"
                            >
                              <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10" onClick={e => e.stopPropagation()}/>
                              <button className="text-slate-600 hover:text-amber-500"><Star size={16} fill={email.isStarred ? "currentColor" : "none"}/></button>
                              <img src={email.fromAvatar} className="w-10 h-10 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] font-black text-white uppercase">{email.fromName}</h4>
                                <p className="text-[11px] text-slate-500 truncate mt-1">{email.body}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">{email.timestamp}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                  email.label === 'Important' ? 'bg-emerald-500/10 text-emerald-500' :
                                  email.label === 'Social' ? 'bg-rose-500/10 text-rose-500' :
                                  'bg-indigo-500/10 text-indigo-500'
                                }`}>{email.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* READ EMAIL VIEW */
                      <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-4">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                           <div className="flex items-center gap-4">
                              <button onClick={() => setEmailView('list')} className="p-2 hover:bg-white/5 rounded"><ArrowLeft size={18}/></button>
                              <div className="flex items-center gap-3">
                                 <button className="text-slate-500 hover:text-amber-500"><Star size={18}/></button>
                                 <button className="text-slate-500 hover:text-white"><Clock size={18}/></button>
                                 <button className="text-slate-500 hover:text-rose-500"><Trash2 size={18}/></button>
                                 <button className="text-slate-500 hover:text-white"><Folder size={18}/></button>
                                 <button className="text-slate-500 hover:text-white"><Tag size={18}/></button>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold uppercase">
                              <span>2 to 10</span>
                              <div className="flex gap-1">
                                 <button className="p-1 hover:bg-white/5 rounded"><ChevronLeft size={16}/></button>
                                 <button className="p-1 hover:bg-white/5 rounded"><ChevronRight size={16}/></button>
                              </div>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 no-scrollbar space-y-10">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                 <img src={selectedEmail?.fromAvatar} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                 <div>
                                    <h3 className="text-[13px] font-black text-white">{selectedEmail?.from}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">to <ChevronDown size={10}/></p>
                                 </div>
                              </div>
                              <div className="text-right space-y-1">
                                 <p className="text-[11px] font-bold text-slate-400">{selectedEmail?.fullDate}</p>
                                 <p className="text-[9px] font-black uppercase text-indigo-500">Company</p>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h2 className="text-xl font-black text-white">Hello! Bette</h2>
                              <p className="text-[13px] text-slate-400 leading-loose font-medium">
                                {selectedEmail?.body}
                              </p>
                              <div className="pt-10 border-t border-white/5 border-dashed">
                                 <p className="text-xs text-slate-500 font-bold">Best,</p>
                                 <p className="text-sm font-black text-white mt-1">AR team</p>
                              </div>
                           </div>

                           {/* ATTACHED SECTION */}
                           <div className="space-y-4">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Paperclip size={14}/> Attached
                              </h4>
                              <div className="flex flex-wrap gap-4">
                                 <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-[#10918a] transition-all cursor-pointer">
                                    <div className="p-3 bg-[#10918a]/20 text-[#10918a] rounded-lg"><FileText size={24}/></div>
                                    <div>
                                       <p className="text-[11px] font-black text-white">Meeting Paper's</p>
                                       <p className="text-[9px] text-slate-500 font-bold">1MB</p>
                                    </div>
                                    <Download size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4"/>
                                 </div>
                                 <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-[#d1a67d] transition-all cursor-pointer">
                                    <div className="p-3 bg-[#d1a67d]/20 text-[#d1a67d] rounded-lg"><Folder size={24}/></div>
                                    <div>
                                       <p className="text-[11px] font-black text-white">Project Details</p>
                                       <p className="text-[9px] text-slate-500 font-bold">18 Files</p>
                                    </div>
                                    <Download size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4"/>
                                 </div>
                              </div>
                           </div>

                           {/* REPLY BOX */}
                           <div className="pt-10">
                              <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                                 <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/5 bg-white/[0.02]">
                                    <button className="p-2 text-slate-500 hover:text-white"><Code size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><Undo2 size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><Redo2 size={16}/></button>
                                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                                    <button className="p-2 text-slate-500 hover:text-white"><Bold size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white font-serif font-black">I</button>
                                    <button className="p-2 text-slate-500 hover:text-white"><AlignLeft size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><AlignCenter size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><AlignRight size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><List size={16}/></button>
                                    <button className="p-2 text-slate-500 hover:text-white"><Paperclip size={16}/></button>
                                 </div>
                                 <textarea className="w-full bg-transparent p-6 outline-none text-sm text-white placeholder:text-slate-600 h-40 resize-none font-medium" placeholder="Type Message..."></textarea>
                              </div>
                              <div className="flex gap-3 mt-6">
                                 <button className="px-8 py-3 bg-[#10918a] text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><Redo2 className="rotate-180" size={14}/> Reply</button>
                                 <button className="px-8 py-3 bg-[#10918a]/10 text-[#10918a] rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#10918a]/20">Reply All</button>
                                 <button className="px-8 py-3 bg-[#10918a]/10 text-[#10918a] rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-[#10918a]/20">Forward <Send size={14}/></button>
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
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#1e1e2d] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                       <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><TrendingUp size={16} className="text-[#10918a]"/> Signal Intensity</h4>
                       <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={ANALYTICS}><Area type="monotone" dataKey="posts" stroke="#10918a" strokeWidth={3} fill="#10918a33" /></AreaChart></ResponsiveContainer></div>
                    </div>
                    <div className="bg-[#1e1e2d] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                       <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Database size={16} className="text-[#10918a]"/> Asset distribution</h4>
                       <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={ANALYTICS}><Bar dataKey="messages" fill="#10918a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                    </div>
                 </div>
              </div>
            )}
          </main>

          <footer className="h-14 border-t border-white/5 flex items-center justify-between px-8 bg-[#0d1117] shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div>Copyright © 2025 <span className="text-white">ki-admin</span>. All rights reserved ❤️ V1.0.0</div>
            <div className="flex items-center gap-4">
              <button className="hover:text-white transition-colors">Need Help?</button>
            </div>
          </footer>
        </div>

        {/* ADMIN CUSTOMIZER DRAWER */}
        {customizerOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCustomizerOpen(false)}></div>
            <aside className="relative w-full max-w-sm h-full bg-[#1e1e2d] border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar">
              <div className="p-8 border-b border-white/10 bg-[#10918a]/10 flex justify-between items-start">
                 <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">Admin Customizer</h2>
                    <p className="text-[10px] text-[#10918a] font-bold">it's time to style according to your choice ..!</p>
                 </div>
                 <button onClick={() => setCustomizerOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors"><X size={24}/></button>
              </div>

              <div className="p-8 space-y-12">
                 {/* Sidebar Option */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Sidebar option</h3>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { id: 'vertical', label: 'Vertical' },
                         { id: 'horizontal', label: 'Horizontal' },
                         { id: 'dark', label: 'Dark' }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setSidebarOpt(opt.id as any)} className={`relative p-1 rounded-lg border-2 transition-all overflow-hidden ${sidebarOpt === opt.id ? 'border-[#10918a]' : 'border-white/5 hover:border-white/20'}`}>
                            {sidebarOpt === opt.id && <div className="absolute top-1 left-1 bg-emerald-500 rounded-full p-0.5"><CheckSquare size={10} className="text-white"/></div>}
                            <div className="aspect-[4/5] bg-white/5 rounded-md flex flex-col p-2 space-y-1">
                               <div className="h-1 w-1/2 bg-white/10 rounded"></div>
                               <div className="h-1 w-3/4 bg-white/10 rounded"></div>
                               <div className={`mt-2 flex-1 rounded border-dashed border border-white/10 flex items-center justify-center`}>
                                  <span className="text-[7px] font-black uppercase text-white/40">{opt.label}</span>
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Layout Option */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Layout option</h3>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { id: 'ltr', label: 'LTR' },
                         { id: 'rtl', label: 'RTL' },
                         { id: 'box', label: 'Box' }
                       ].map(opt => (
                         <button key={opt.id} onClick={() => setLayoutOpt(opt.id as any)} className={`relative p-1 rounded-lg border-2 transition-all overflow-hidden ${layoutOpt === opt.id ? 'border-[#10918a]' : 'border-white/5 hover:border-white/20'}`}>
                            {layoutOpt === opt.id && <div className="absolute top-1 left-1 bg-emerald-500 rounded-full p-0.5"><CheckSquare size={10} className="text-white"/></div>}
                            <div className={`aspect-[4/5] ${opt.id === 'box' ? 'bg-white text-slate-900 shadow-xl' : 'bg-white/5'} rounded-md flex items-center justify-center`}>
                               <span className={`text-[8px] font-black uppercase ${opt.id === 'box' ? 'text-slate-900' : 'text-white/40'}`}>{opt.label}</span>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Color Hint */}
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Color Hint</h3>
                    <div className="flex flex-wrap gap-3">
                       {[
                         { c1: '#10918a', c2: '#d1a67d' },
                         { c1: '#7e57c2', c2: '#3f51b5' },
                         { c1: '#a1887f', c2: '#795548' },
                         { c1: '#4db6ac', c2: '#26a69a' },
                         { c1: '#1e88e5', c2: '#0d47a1' },
                         { c1: '#880e4f', c2: '#4a148c' }
                       ].map((c, i) => (
                         <button 
                           key={i} 
                           onClick={() => setActiveColor(c.c1)} 
                           className={`w-10 h-16 rounded-xl border-2 overflow-hidden transition-all relative ${activeColor === c.c1 ? 'border-[#10918a] scale-110' : 'border-white/5 hover:border-white/20'}`}
                         >
                            {activeColor === c.c1 && <div className="absolute top-1 left-1 bg-emerald-500 rounded-full p-0.5 z-10"><CheckSquare size={8} className="text-white"/></div>}
                            <div className="h-1/2 w-full" style={{ backgroundColor: c.c1 }}></div>
                            <div className="h-1/2 w-full" style={{ backgroundColor: c.c2 }}></div>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Text Size */}
                 <div className="space-y-6 pb-20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">Text size</h3>
                    <div className="flex gap-2">
                       {['sm', 'md', 'lg'].map(sz => (
                         <button 
                           key={sz} 
                           onClick={() => setTextSize(sz as any)}
                           className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${textSize === sz ? 'bg-[#10918a] border-transparent text-white' : 'border-white/10 text-slate-500 hover:text-white'}`}
                         >
                            {textSize === sz && <CheckSquare size={10} className="inline mr-2"/>}
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
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
