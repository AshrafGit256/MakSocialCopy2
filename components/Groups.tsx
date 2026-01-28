
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Check, CheckCheck, Signal, Command
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      if (g.length > 0 && !activeGroupId && window.innerWidth > 768) {
        setActiveGroupId(g[0].id);
      }
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current && viewMode === 'terminal') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeGroupId, groups, viewMode]);

  const activeGroup = groups.find(g => g.id === activeGroupId);
  const isMember = activeGroup?.memberIds.includes(currentUser.id);

  const handleNeuralSync = async () => {
    if (!activeGroup || activeGroup.messages.length === 0) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyText = activeGroup.messages.slice(-20).map(m => `${m.author}: ${m.text}`).join('\n');
      const prompt = `Analyze this university group chat transcript:
      Group: ${activeGroup.name}
      Transcript: ${historyText}
      
      Generate a tactical "Neural Sync Snapshot":
      - CURRENT_STATUS: (Status word)
      - KEY_DIRECTIVES: (3 bullet points)
      - ACTION_ITEMS: (2 tasks)
      Keep it strictly professional and tactical.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setNeuralSnapshot(response.text);
    } catch (e) {
      setNeuralSnapshot("SIGNAL_ERROR: Intelligence handshake failed.");
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
    setNeuralSnapshot(null);
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

  const handleJoin = (id: string) => {
    db.joinGroup(id, currentUser.id);
    setGroups(db.getGroups());
  };

  const handleCreateGroup = () => {
    if (!createForm.name || !createForm.description) return;
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
    db.saveGroups([...groups, newGroup]);
    setGroups(db.getGroups());
    setIsCreating(false);
    setActiveGroupId(newGroup.id);
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
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-mono text-[var(--text-primary)]">
      
      {/* 1. CLUSTER SELECTOR (Left) */}
      <aside className="hidden lg:flex w-80 border-r border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] shrink-0 z-20">
        <div className="p-6 border-b border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Binary size={14}/> Node_Clusters
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
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-slate-600 transition-all shadow-inner"
              placeholder="Query Manifests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {filteredGroups.map(g => (
            <button 
              key={g.id}
              onClick={() => {
                setActiveGroupId(g.id);
                setNeuralSnapshot(null);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 border-b border-[var(--border-color)] transition-all text-left relative group ${
                activeGroupId === g.id ? 'bg-white dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {activeGroupId === g.id && <div className="absolute inset-y-0 left-0 w-1 bg-slate-600 animate-pulse"></div>}
              <div className="relative shrink-0">
                <img src={g.image} className="w-11 h-11 rounded border border-[var(--border-color)] object-cover bg-white grayscale group-hover:grayscale-0 transition-all" />
                {g.isOfficial && (
                   <div className="absolute -top-1 -right-1 bg-slate-600 rounded-full p-0.5 border-2 border-[var(--sidebar-bg)]">
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
                   <span className="text-[8px] font-black uppercase text-slate-500 px-1.5 py-0.5 bg-slate-500/10 rounded">{g.category} Hub</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase truncate">
                      {g.messages.length > 0 ? g.messages[g.messages.length-1].text : 'Awaiting signals...'}
                   </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20 space-y-4">
           <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <span>Registry_Indexing</span>
              <span className="text-slate-600">96.4%</span>
           </div>
           <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-slate-600 w-[96.4%] animate-pulse"></div>
           </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col bg-[var(--bg-primary)] min-w-0 h-full relative">
        {activeGroup ? (
          <>
            {/* WORKSPACE HEADER */}
            <div className="border-b border-[var(--border-color)] bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex items-center text-lg sm:text-xl font-black gap-2 truncate uppercase italic tracking-tighter">
                      <Layers size={20} className="text-slate-400 hidden sm:block" />
                      <span className="text-slate-600 hover:underline cursor-pointer lowercase">{activeGroup.category}</span>
                      <span className="text-slate-400">/</span>
                      <span className="truncate">{activeGroup.name}</span>
                    </div>
                    <div className="hidden md:flex gap-1.5">
                       <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-600 bg-emerald-500/5 rounded-full text-[8px] font-black uppercase flex items-center gap-1"><Activity size={10}/> Link_Stable</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="bg-[var(--bg-secondary)] p-1 rounded border border-[var(--border-color)] flex shadow-inner">
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
              
              {/* CENTRAL VIEW AREA */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#080808]">
                {viewMode === 'terminal' ? (
                  <>
                    {/* CHAT STREAM (TAACTICAL ALIGNMENT) */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar" style={{ backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                      
                      {/* Neural Snapshot Banner */}
                      {neuralSnapshot && (
                        <div className="bg-slate-700 text-white rounded-xl p-8 mb-12 animate-in slide-in-from-top-4 relative overflow-hidden group shadow-2xl border border-white/10">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12"><Sparkles size={120}/></div>
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-3">
                                 <Cpu size={16} className="animate-pulse" /> Neural_Sync_Protocol
                              </h3>
                              <button onClick={() => setNeuralSnapshot(null)} className="text-white/40 hover:text-white"><X size={16}/></button>
                           </div>
                           <div className="text-[12px] italic whitespace-pre-wrap font-medium leading-relaxed border-l-4 border-white/20 pl-8">
                              {neuralSnapshot}
                           </div>
                           <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[7px] font-black uppercase text-white/50 tracking-widest">
                              <span>PARSED BY HILL_INTELLIGENCE v5.1</span>
                              <span>CHECKSUM: {SHA_GEN()}</span>
                           </div>
                        </div>
                      )}

                      {activeGroup.messages.map(msg => {
                        const isMe = msg.authorId === currentUser.id;
                        return (
                          <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              
                              {!isMe && (
                                <div className="shrink-0">
                                   <img src={msg.authorAvatar} className="w-10 h-10 rounded border border-[var(--border-color)] object-cover bg-white mt-2" />
                                </div>
                              )}

                              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                                {!isMe && (
                                  <span className="text-[9px] font-black uppercase text-slate-500 ml-1 tracking-widest flex items-center gap-1">
                                     <Fingerprint size={10}/> {msg.author}
                                  </span>
                                )}
                                
                                <div className={`p-5 rounded shadow-sm relative group transition-all hover:shadow-md ${
                                  isMe 
                                  ? 'bg-[#475569] text-white rounded-tr-none border border-slate-500/30' 
                                  : 'bg-white dark:bg-[#111] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'
                                }`}>
                                  
                                  {msg.attachment && (
                                    <div className="mb-4">
                                      {msg.attachment.type === 'image' ? (
                                        <div className="relative group/img cursor-pointer overflow-hidden rounded border border-black/10">
                                          <img src={msg.attachment.data} className="max-w-full h-auto grayscale-[20%] group-hover/img:grayscale-0 transition-all duration-500" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Download size={24} className="text-white" />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`flex items-center gap-4 p-4 rounded border ${isMe ? 'bg-black/20 border-white/10' : 'bg-slate-50 dark:bg-black/40 border-[var(--border-color)]'}`}>
                                          <FileText size={24} className={isMe ? 'text-white' : 'text-slate-600'} />
                                          <div className="min-w-0">
                                            <p className="text-[11px] font-black uppercase truncate">{msg.attachment.name}</p>
                                            <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Protocol_Asset_v1.0</p>
                                          </div>
                                          <Download size={14} className="ml-auto opacity-40 hover:opacity-100 cursor-pointer" />
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap selection:bg-slate-300">
                                    {msg.text}
                                  </p>

                                  <div className={`flex items-center gap-3 mt-4 justify-end border-t ${isMe ? 'border-white/10 text-slate-300' : 'border-slate-100 dark:border-white/5 text-slate-400'} pt-2`}>
                                    <span className="text-[8px] font-mono uppercase tracking-[0.2em]">{msg.timestamp}</span>
                                    {isMe && <CheckCheck size={12} className="text-emerald-400" />}
                                    <span className="text-[7px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">commit_{SHA_GEN().slice(0,6)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* INPUT TERMINAL */}
                    <div className="p-6 border-t border-[var(--border-color)] bg-white/50 dark:bg-black/20">
                       {isMember ? (
                         <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded shadow-2xl transition-all overflow-hidden">
                            {attachment && (
                              <div className="px-6 py-4 bg-slate-700 text-white flex items-center justify-between animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3">
                                  {attachment.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase truncate max-w-md">{attachment.name}</p>
                                    <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Asset_Staging_Ready</p>
                                  </div>
                                </div>
                                <button onClick={() => setAttachment(null)} className="p-1 hover:bg-white/10 rounded-full transition-all"><X size={20}/></button>
                              </div>
                            )}

                            <div className="px-6 py-3 border-b border-[var(--border-color)] bg-slate-50/80 dark:bg-black/40 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-400 hover:text-slate-700 transition-all"><Paperclip size={18}/></button>
                                  <div className="w-px h-6 bg-[var(--border-color)]"></div>
                                  <button onClick={handleNeuralSync} disabled={isSummarizing} className="px-4 py-1.5 hover:bg-slate-600/10 rounded text-slate-600 transition-all flex items-center gap-2 disabled:opacity-30">
                                     {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                                     <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sync_Snapshot</span>
                                  </button>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol_Uplink_Active</span>
                               </div>
                            </div>
                            
                            <div className="flex items-end gap-4 p-5">
                               <textarea 
                                 value={newMessage}
                                 onChange={e => setNewMessage(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                 placeholder="Execute logic commit..."
                                 className="flex-1 bg-transparent p-2 text-[14px] font-medium outline-none h-12 max-h-48 resize-none placeholder:italic placeholder:text-slate-400 no-scrollbar leading-relaxed"
                               />
                               <button 
                                 onClick={handleSendMessage}
                                 disabled={!newMessage.trim() && !attachment}
                                 className="bg-[#475569] hover:bg-slate-700 disabled:opacity-30 text-white px-8 py-3 rounded text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-600/20 active:scale-95 transition-all flex items-center gap-2"
                               >
                                  Broadcast <Send size={16}/>
                                </button>
                            </div>
                         </div>
                       ) : (
                         <div className="p-16 border border-dashed border-amber-600/40 bg-amber-500/5 rounded flex flex-col items-center gap-8 text-center shadow-inner">
                            <Lock size={64} className="text-amber-500 opacity-30" />
                            <div className="space-y-3">
                               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-amber-600">Access_Control_Violation</h3>
                               <p className="text-[11px] font-bold uppercase text-slate-500 tracking-[0.3em] leading-relaxed max-w-md mx-auto">
                                  Identity node not detected in cluster strata. Join manifest to synchronize logic.
                               </p>
                            </div>
                            <button onClick={() => handleJoin(activeGroup.id)} className="px-16 py-5 bg-amber-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-amber-600/20 active:scale-95 transition-all">Initialize Enrollment</button>
                         </div>
                       )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar animate-in fade-in zoom-in-98 duration-500">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Activity Heatmap */}
                        <div className="bg-white dark:bg-[#0b0b0b] border border-[var(--border-color)] p-10 rounded shadow-2xl space-y-10">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                                    <TrendingUp size={18} className="text-slate-600"/> Temporal_Flux_Analysis
                                 </h3>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Signal frequency per coordinate period</p>
                              </div>
                              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black uppercase text-emerald-500">High Density</div>
                           </div>
                           <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={activityData}>
                                    <defs>
                                       <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#475569" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="intensity" stroke="#475569" strokeWidth={4} fillOpacity={1} fill="url(#colorInt)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="grid grid-cols-3 gap-8">
                              <div className="text-center p-6 bg-slate-50 dark:bg-black/40 rounded border border-[var(--border-color)]">
                                 <p className="text-3xl font-black text-slate-700 dark:text-white">{activeGroup.memberIds.length}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Nodes</p>
                              </div>
                              <div className="text-center p-6 bg-slate-50 dark:bg-black/40 rounded border border-[var(--border-color)]">
                                 <p className="text-3xl font-black text-slate-700 dark:text-white">{activeGroup.messages.length}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Signals</p>
                              </div>
                              <div className="text-center p-6 bg-slate-50 dark:bg-black/40 rounded border border-[var(--border-color)]">
                                 <p className="text-3xl font-black text-emerald-600">92%</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Integrity</p>
                              </div>
                           </div>
                        </div>

                        {/* Recent Assets Index */}
                        <div className="bg-white dark:bg-[#0b0b0b] border border-[var(--border-color)] p-10 rounded shadow-2xl space-y-10">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                                    <Database size={18} className="text-slate-600"/> Shared_Intelligence_Vault
                                 </h3>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Verified academic assets indexed</p>
                              </div>
                           </div>
                           <div className="space-y-6">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/40 border border-[var(--border-color)] rounded hover:border-slate-600 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                       <div className="p-4 bg-white dark:bg-black rounded border border-[var(--border-color)] text-slate-400 group-hover:text-slate-700 transition-colors">
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <p className="text-[13px] font-black uppercase">Academic_Log_v{i}.log</p>
                                          <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Strata: {activeGroup.category} / 4.2 MB</p>
                                       </div>
                                    </div>
                                    <Download size={18} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                                 </div>
                              ))}
                           </div>
                           <button className="w-full py-5 border-2 border-dashed border-[var(--border-color)] rounded text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:border-slate-600 hover:text-slate-600 transition-all flex items-center justify-center gap-4">
                              <GitFork size={18}/> Fork Assets from Global Vault
                           </button>
                        </div>
                     </div>

                     {/* Strategic Brief */}
                     <div className="p-12 bg-slate-700 rounded text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ShieldCheck size={240} /></div>
                        <div className="relative z-10 space-y-10">
                           <div className="flex items-center gap-4">
                              <div className="p-4 bg-white/10 rounded backdrop-blur-md border border-white/20">
                                 <Command size={32}/>
                              </div>
                              <h3 className="text-3xl font-black uppercase tracking-tighter italic">Operational_Charter</h3>
                           </div>
                           <p className="text-xl font-medium leading-relaxed italic text-slate-200 max-w-4xl border-l-4 border-white/20 pl-10">
                              "{activeGroup.description}"
                           </p>
                           <div className="flex flex-wrap gap-6 pt-6">
                              <button className="px-12 py-5 bg-white text-slate-700 rounded font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-100 transition-all active:scale-95 shadow-2xl">Verify Security</button>
                              <button className="px-12 py-5 bg-white/10 border border-white/20 text-white rounded font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/20 transition-all">Export Manifest</button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              {/* 3. RIGHT TELEMETRY BAR (COMMMAND CENTER FEEL) */}
              <aside className="hidden xl:flex w-80 border-l border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] p-8 space-y-12 z-20 overflow-y-auto no-scrollbar">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                       <Signal size={16} className="text-slate-600"/> Cluster_Pulse_Nodes
                    </h4>
                    <div className="space-y-5">
                       {activeGroup.memberIds.slice(0, 8).map(id => {
                          const u = db.getUsers().find(user => user.id === id) || currentUser;
                          return (
                             <div key={id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded transition-all">
                                <div className="flex items-center gap-4">
                                   <img src={u.avatar} className="w-10 h-10 rounded border border-[var(--border-color)] bg-white object-cover" />
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-black uppercase truncate w-28 group-hover:text-slate-700 transition-colors">{u.name}</span>
                                      <span className="text-[8px] text-slate-400 font-bold">NODE_STABILITY: HIGH</span>
                                   </div>
                                </div>
                                <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500 w-[94%]"></div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 <div className="pt-10 border-t border-[var(--border-color)] space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                       <History size={16} className="text-slate-600"/> Commit_Archive
                    </h4>
                    <div className="space-y-6">
                       {[1, 2, 3, 4].map(i => (
                          <div key={i} className="relative pl-6 border-l-2 border-slate-300 dark:border-slate-800 space-y-2 group hover:border-slate-600 transition-all">
                             <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-400 group-hover:bg-slate-700 transition-colors"></div>
                             <p className="text-[10px] font-black uppercase text-slate-600 leading-none">SEQ_{SHA_GEN()}</p>
                             <p className="text-[9px] text-slate-500 font-medium italic leading-none">Logic indexed @ {i * 2}h ago</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="mt-auto p-6 bg-slate-900 dark:bg-black rounded-xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-45"><TrendingUp size={100} /></div>
                    <div className="flex items-center justify-between relative z-10">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural_Sentiment</span>
                       <span className="text-[10px] font-black text-emerald-500">PEAK</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                       <div className="h-full bg-slate-600 w-[94%] animate-pulse"></div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold italic text-center leading-relaxed">
                       "Communication bandwidth suggests collaborative academic excellence."
                    </p>
                 </div>
              </aside>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12">
             <div className="relative group">
                <div className="absolute -inset-10 bg-slate-600/10 blur-[60px] rounded-full group-hover:bg-slate-600/20 transition-all duration-1000"></div>
                <div className="w-48 h-48 bg-slate-600/5 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600/30 shadow-inner transition-all group-hover:border-slate-600 group-hover:scale-110">
                   <Users size={100} className="text-slate-600/20 group-hover:text-slate-600/50 transition-colors" />
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-5xl font-black uppercase tracking-tighter italic text-[var(--text-primary)]">Select Strategic Cluster</h3>
                <p className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.5em] max-w-lg mx-auto leading-loose">
                   Access localized research environments, broadcast sector-specific signals, and synchronize intelligence with peer-nodes.
                </p>
             </div>
             <div className="flex gap-8">
                <button onClick={() => setIsCreating(true)} className="px-14 py-6 bg-slate-700 text-white rounded font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl shadow-slate-600/30 active:scale-95 transition-all flex items-center gap-4 hover:bg-slate-800"><Plus size={24}/> Initialize Hub</button>
                <button className="px-14 py-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded font-black text-[12px] uppercase tracking-[0.5em] hover:bg-white transition-all shadow-sm active:scale-95">Registry Explorer</button>
             </div>
          </div>
        )}
      </main>

      {/* CREATE HUB MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-xl p-12 rounded shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] space-y-12 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-10">
                 <div className="flex items-center gap-4 text-slate-600">
                    <Target size={32} />
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Initialize_Cluster</h2>
                 </div>
                 <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-rose-500 transition-colors active:scale-90"><X size={48}/></button>
              </div>
              <div className="space-y-10">
                 <div className="space-y-4 group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 group-focus-within:text-slate-600 transition-colors">Cluster_Identifier (Name)</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-6 text-sm font-bold outline-none focus:border-slate-600 transition-all shadow-inner uppercase tracking-tighter" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="e.g. COCIS_Neural_Net" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Sector_Allocation</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-6 text-sm font-bold outline-none cursor-pointer hover:border-slate-600 transition-all appearance-none uppercase tracking-tighter" value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}>
                       <option value="General">Universal Registry</option>
                       {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c} Wing</option>)}
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Protocol_Directives</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-6 text-sm font-bold outline-none h-32 resize-none focus:border-slate-600 transition-all shadow-inner placeholder:italic italic leading-relaxed" value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} placeholder="Define strategic objectives and mission logic..." />
                 </div>
                 <button onClick={handleCreateGroup} className="w-full bg-slate-700 hover:bg-slate-800 py-6 rounded text-white font-black text-xs uppercase tracking-[0.6em] shadow-2xl shadow-slate-600/30 active:scale-95 transition-all">Commit Cluster to Registry</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
           0%, 100% { opacity: 1; }
           50% { opacity: .5; }
        }
        ::selection {
          background: #475569;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Groups;
