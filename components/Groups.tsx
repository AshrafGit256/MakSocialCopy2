
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { Group, GroupMessage, User, College } from '../types';
import { 
  Users, Plus, Search, MessageSquare, Star, 
  ShieldCheck, ArrowUpRight, Send, Image as ImageIcon, 
  FileText, X, Globe, Terminal, Fingerprint, 
  GitCommit, Activity, Database, Lock, MoreVertical,
  CheckCircle2, Box, Info, Layout, Sparkles, 
  Cpu, BarChart3, Download, GitFork, Share2, 
  Settings, Loader2, Zap, History, Target, 
  TrendingUp, ShieldAlert, Binary, Layers, Paperclip,
  Check, CheckCheck, Signal, Command, ArrowLeft,
  ChevronRight, Radar
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUser] = useState<User>(db.getUser());
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<{name: string, type: 'image' | 'document', data: string} | null>(null);
  const [viewMode, setViewMode] = useState<'terminal' | 'architecture'>('terminal');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [neuralSnapshot, setNeuralSnapshot] = useState<string | null>(null);
  
  // Mobile view state: 'list' or 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + Date.now(),
    category: 'General'
  });

  useEffect(() => {
    const sync = () => {
      const g = db.getGroups();
      setGroups(g);
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current && viewMode === 'terminal') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeGroupId, groups, viewMode, mobileView]);

  // Handle auto-expanding textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [newMessage]);

  const activeGroup = groups.find(g => g.id === activeGroupId);
  const isMember = activeGroup?.memberIds.includes(currentUser.id);

  const handleSelectGroup = (id: string) => {
    setActiveGroupId(id);
    setMobileView('chat');
    setNeuralSnapshot(null);
  };

  const handleNeuralSync = async () => {
    if (!activeGroup || activeGroup.messages.length === 0) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyText = activeGroup.messages.slice(-20).map(m => `${m.author}: ${m.text}`).join('\n');
      const prompt = `Act as a Cluster Intelligence Architect. Generate a tactical snapshot for this group: ${activeGroup.name}. Transcript: ${historyText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setNeuralSnapshot(response.text);
    } catch (e) {
      setNeuralSnapshot("SIGNAL_FAILURE: Could not parse logic nodes.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;
    if (!activeGroupId) return;

    const msg: GroupMessage = {
      id: `gm-${Date.now()}`,
      author: currentUser.name,
      authorId: currentUser.id,
      authorAvatar: currentUser.avatar,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachment || undefined
    };

    db.addGroupMessage(activeGroupId, msg);
    setGroups(db.getGroups());
    setNewMessage('');
    setAttachment(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          data: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = () => {
    if (!createForm.name.trim()) return;
    
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: createForm.name,
      description: createForm.description,
      image: createForm.image,
      isOfficial: false,
      creatorId: currentUser.id,
      memberIds: [currentUser.id],
      messages: [],
      category: createForm.category
    };

    const currentGroups = db.getGroups();
    db.saveGroups([...currentGroups, newGroup]);
    setGroups([...currentGroups, newGroup]);
    setIsCreating(false);
    setCreateForm({
      name: '',
      description: '',
      image: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + Date.now(),
      category: 'General'
    });
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  const activityData = [
    { time: '08:00', intensity: 30 }, { time: '10:00', intensity: 55 },
    { time: '12:00', intensity: 92 }, { time: '14:00', intensity: 68 },
    { time: '16:00', intensity: 100 }, { time: '18:00', intensity: 45 },
  ];

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden font-mono text-[var(--text-primary)]">
      
      {/* 1. CLUSTER NAVIGATOR (Visible on desktop or when list is active on mobile) */}
      <aside className={`
        ${mobileView === 'chat' && activeGroupId ? 'hidden lg:flex' : 'flex'}
        w-full lg:w-80 border-r border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] shrink-0 z-20 transition-all duration-300
      `}>
        <div className="p-6 border-b border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Binary size={14}/> Registry_Nodes
            </h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1.5 bg-slate-600/10 text-slate-600 border border-slate-600/20 rounded hover:bg-slate-600 hover:text-white transition-all active:scale-90"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={14} />
            <input 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded py-3 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-slate-600 transition-all shadow-inner"
              placeholder="Query Hubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredGroups.map(g => (
            <button 
              key={g.id}
              onClick={() => handleSelectGroup(g.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 border-b border-[var(--border-color)] transition-all text-left relative group ${
                activeGroupId === g.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-slate-600' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={g.image} className="w-12 h-12 rounded border border-[var(--border-color)] object-cover bg-white grayscale group-hover:grayscale-0 transition-all" />
                {g.isOfficial && (
                   <div className="absolute -top-1 -right-1 bg-slate-600 rounded-full p-0.5 border-2 border-[var(--sidebar-bg)] shadow-sm">
                      <ShieldCheck size={10} className="text-white" />
                   </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                   <h4 className="text-[11px] font-black uppercase tracking-tight truncate group-hover:text-slate-600 transition-colors">{g.name}</h4>
                   <span className="text-[8px] font-mono text-slate-400">ID_{g.id.slice(-3)}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase text-slate-500 px-1.5 py-0.5 bg-slate-500/10 rounded">{g.category}</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {g.messages.length > 0 ? g.messages[g.messages.length-1].text : 'Awaiting sync...'}
                   </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20 space-y-4 mb-20 lg:mb-0">
           <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <span>Sync_Status</span>
              <span className="text-slate-600">LIVE</span>
           </div>
           <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 w-full animate-pulse"></div>
           </div>
        </div>
      </aside>

      {/* 2. MAIN CLUSTER WORKSPACE */}
      <main className={`
        ${mobileView === 'list' && !activeGroupId ? 'hidden lg:flex' : 'flex'}
        flex-1 flex flex-col bg-[var(--bg-primary)] min-w-0 h-full relative z-10
      `}>
        {activeGroup ? (
          <>
            {/* WORKSPACE HEADER */}
            <div className="border-b border-[var(--border-color)] bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 z-10 shrink-0">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                      onClick={() => setMobileView('list')}
                      className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center text-sm md:text-xl font-black gap-2 truncate uppercase italic tracking-tighter">
                      <Layers size={18} className="text-slate-400 hidden sm:block" />
                      <span className="text-slate-600 hover:underline cursor-pointer lowercase hidden sm:inline">{activeGroup.category}</span>
                      <span className="text-slate-400 hidden sm:inline">/</span>
                      <span className="truncate">{activeGroup.name}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="hidden sm:flex bg-[var(--bg-secondary)] p-1 rounded border border-[var(--border-color)] shadow-inner">
                       <button onClick={() => setViewMode('terminal')} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'terminal' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                          <Terminal size={12}/> Terminal
                       </button>
                       <button onClick={() => setViewMode('architecture')} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'architecture' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                          <Layout size={12}/> Architecture
                       </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Settings size={18}/></button>
                 </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* CHAT AREA */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#050505]">
                {viewMode === 'terminal' ? (
                  <>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 no-scrollbar pb-32 lg:pb-10" style={{ backgroundImage: 'radial-gradient(var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}>
                      
                      {neuralSnapshot && (
                        <div className="bg-slate-700 text-white rounded-xl p-6 mb-8 animate-in slide-in-from-top-4 relative overflow-hidden group shadow-2xl border border-white/10">
                           <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity rotate-12"><Sparkles size={80}/></div>
                           <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-2 mb-4">
                              <Cpu size={14} className="animate-pulse" /> Neural_Sync_Protocol
                           </h3>
                           <div className="text-[11px] italic whitespace-pre-wrap font-medium leading-relaxed border-l-2 border-white/20 pl-4">
                              {neuralSnapshot}
                           </div>
                           <button onClick={() => setNeuralSnapshot(null)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={14}/></button>
                        </div>
                      )}

                      {activeGroup.messages.map(msg => {
                        const isMe = msg.authorId === currentUser.id;
                        return (
                          <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              {!isMe && <img src={msg.authorAvatar} className="w-8 h-8 rounded border border-[var(--border-color)] object-cover bg-white mt-1 shrink-0" />}
                              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                                {!isMe && <span className="text-[8px] font-black uppercase text-slate-500 ml-1 tracking-widest">{msg.author}</span>}
                                <div className={`p-4 rounded shadow-sm relative group transition-all ${
                                  isMe 
                                  ? 'bg-[#475569] text-white rounded-tr-none border border-slate-500/30' 
                                  : 'bg-white dark:bg-[#111] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'
                                }`}>
                                  {msg.attachment && (
                                    <div className="mb-3">
                                      {msg.attachment.type === 'image' ? (
                                        <img src={msg.attachment.data} className="max-w-full rounded border border-black/10" />
                                      ) : (
                                        <div className={`flex items-center gap-3 p-3 rounded border ${isMe ? 'bg-black/20 border-white/10' : 'bg-slate-50 dark:bg-black/40 border-[var(--border-color)]'}`}>
                                          <FileText size={20} className={isMe ? 'text-white' : 'text-slate-600'} />
                                          <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase truncate">{msg.attachment.name}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                  <div className={`flex items-center gap-2 mt-2 justify-end border-t ${isMe ? 'border-white/10 text-slate-300' : 'border-slate-100 dark:border-white/5 text-slate-400'} pt-1.5`}>
                                    <span className="text-[7px] font-mono uppercase tracking-widest">{msg.timestamp}</span>
                                    {isMe && <CheckCheck size={10} className="text-emerald-400" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* INPUT TERMINAL */}
                    <div className="fixed lg:relative bottom-16 lg:bottom-0 left-0 right-0 p-4 md:p-6 border-t border-[var(--border-color)] bg-white/95 dark:bg-black/90 backdrop-blur-xl shrink-0 z-50">
                       {isMember ? (
                         <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded shadow-2xl overflow-hidden max-w-5xl mx-auto">
                            {attachment && (
                              <div className="px-4 py-2 bg-slate-700 text-white flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="truncate">Ready: {attachment.name}</span>
                                <button onClick={() => setAttachment(null)}><X size={14}/></button>
                              </div>
                            )}
                            <div className="px-4 py-2 border-b border-[var(--border-color)] flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-slate-700 p-1"><Paperclip size={18}/></button>
                                  <button onClick={handleNeuralSync} disabled={isSummarizing} className="text-slate-600 hover:text-indigo-600 disabled:opacity-30 p-1"><Sparkles size={18}/></button>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Link_Stable</span>
                               </div>
                            </div>
                            <div className="flex items-end gap-3 p-3">
                               <textarea 
                                 ref={textareaRef}
                                 value={newMessage}
                                 onChange={e => setNewMessage(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                 placeholder="Broadcast logic..."
                                 className="flex-1 bg-transparent p-1 text-[14px] font-medium outline-none min-h-[40px] max-h-40 resize-none no-scrollbar leading-relaxed overflow-y-auto"
                               />
                               <button 
                                 onClick={handleSendMessage}
                                 disabled={!newMessage.trim() && !attachment}
                                 className="bg-[#475569] hover:bg-slate-700 disabled:opacity-30 text-white p-3 rounded shadow-xl active:scale-95 transition-all shrink-0"
                               >
                                  <Send size={18}/>
                                </button>
                            </div>
                         </div>
                       ) : (
                         <div className="p-8 border border-dashed border-amber-600/40 bg-amber-500/5 rounded text-center">
                            <Lock size={32} className="text-amber-500 opacity-30 mx-auto mb-3" />
                            <h3 className="text-sm font-black uppercase text-amber-600 mb-4 tracking-widest">Join Cluster to Synchronize</h3>
                            <button onClick={() => db.joinGroup(activeGroup.id, currentUser.id)} className="w-full py-3 bg-amber-600 text-white rounded font-black text-[10px] uppercase tracking-widest">Initialize Enrollment</button>
                         </div>
                       )}
                    </div>
                  </>
                ) : (
                  /* ARCHITECTURE VIEW */
                  <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 no-scrollbar pb-32">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-[#0b0b0b] border border-[var(--border-color)] p-8 rounded shadow-2xl space-y-8">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                              <TrendingUp size={16} className="text-slate-600"/> Temporal_Flux
                           </h3>
                           <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={activityData}>
                                    <Area type="monotone" dataKey="intensity" stroke="#475569" strokeWidth={3} fill="#47556922" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                        <div className="bg-white dark:bg-[#0b0b0b] border border-[var(--border-color)] p-8 rounded shadow-2xl space-y-6">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                              <Database size={16} className="text-slate-600"/> Shared_Assets
                           </h3>
                           <div className="space-y-3">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/40 border border-[var(--border-color)] rounded group">
                                    <div className="flex items-center gap-3">
                                       <FileText size={16} className="text-slate-400 group-hover:text-slate-700" />
                                       <span className="text-[11px] font-black uppercase">Academic_Log_v{i}</span>
                                    </div>
                                    <Download size={14} className="text-slate-300" />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              {/* DESKTOP TELEMETRY BAR */}
              <aside className="hidden xl:flex w-72 border-l border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] p-6 space-y-8 z-20 overflow-y-auto no-scrollbar">
                 <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Signal size={14} className="text-slate-600"/> Pulse_Nodes
                 </h4>
                 <div className="space-y-4">
                    {activeGroup.memberIds.slice(0, 8).map(id => {
                       const u = db.getUsers().find(user => user.id === id) || currentUser;
                       return (
                          <div key={id} className="flex items-center gap-3">
                             <img src={u.avatar} className="w-8 h-8 rounded border border-[var(--border-color)]" />
                             <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase truncate">{u.name}</p>
                                <div className="h-0.5 w-full bg-slate-100 dark:bg-white/5 mt-1">
                                   <div className="h-full bg-emerald-500 w-[90%]"></div>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </aside>
            </div>
          </>
        ) : (
          /* 3. LANDING DASHBOARD (EMPTY STATE) */
          <div className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto no-scrollbar pb-32">
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-12">
                <div className="relative">
                   <div className="absolute inset-0 bg-slate-600/10 blur-[50px] rounded-full animate-pulse"></div>
                   <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                      <Radar size={64} className="text-slate-400 animate-spin-slow" />
                   </div>
                </div>
                <div className="space-y-4 max-w-lg">
                   <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Initialize <span className="text-slate-600">Cluster</span></h2>
                   <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.5em] leading-loose">
                      Synchronize with university strata, broadcast sector intelligence, and collaborate within encrypted hub manifests.
                   </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                   <button onClick={() => setIsCreating(true)} className="px-10 py-5 bg-slate-700 text-white rounded font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/40 active:scale-95 transition-all flex items-center justify-center gap-3">
                      <Plus size={18} fill="currentColor" /> Initialize Hub
                   </button>
                   <button className="px-10 py-5 bg-white border border-[var(--border-color)] text-slate-500 rounded font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                      Registry Explorer <ArrowUpRight size={18}/>
                   </button>
                </div>
             </div>

             {/* Global Metrics Strip */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto pt-12 border-t border-[var(--border-color)]">
                {[
                  { label: 'Active_Clusters', val: groups.length, icon: <Database size={14} fill="currentColor"/> },
                  { label: 'Pulse_Intensity', val: '98.4%', icon: <Zap size={14} fill="currentColor"/> },
                  { label: 'Registry_Uptime', val: '99.9%', icon: <Activity size={14}/> },
                  { label: 'Global_Sync', val: 'STABLE', icon: <Globe size={14}/> },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        {stat.icon} {stat.label}
                     </p>
                     <p className="text-sm font-black uppercase italic">{stat.val}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* CREATE HUB MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 md:p-12 rounded shadow-2xl space-y-10 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-8">
                 <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-600">Initialize_Cluster</h2>
                 <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-rose-500"><X size={32}/></button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cluster_Name</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4 text-sm font-bold outline-none focus:border-slate-600 transition-all shadow-inner" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="e.g. COCIS_Neural_Net" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector_Allocation</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4 text-sm font-bold outline-none" value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}>
                       <option value="General">Universal Wing</option>
                       {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c} Hub</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission_Directives</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4 text-sm font-bold outline-none h-32 resize-none" value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} placeholder="Define strategic objectives..." />
                 </div>
                 <button onClick={handleCreateGroup} className="w-full bg-slate-700 hover:bg-slate-800 py-5 rounded text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Commit Cluster to Registry</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
    </div>
  );
};

export default Groups;
