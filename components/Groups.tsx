
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
  Check, CheckCheck
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
      const prompt = `Act as a Cluster Intelligence Architect. Analyze this university group chat transcript:
      Group Name: ${activeGroup.name}
      Wing: ${activeGroup.category}
      Transcript:
      ${historyText}
      
      Generate a "Neural Sync Snapshot". 
      Format as follows:
      - CLUSTER_VIBE: (Current atmosphere)
      - CORE_INTEL: (Key knowledge shared)
      - ACTION_ITEMS: (Next steps for the nodes)
      - INTEGRITY_SCORE: (0-100% based on academic relevance)
      Keep it strictly technical and under 100 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setNeuralSnapshot(response.text);
    } catch (e) {
      setNeuralSnapshot("INTELLIGENCE_FAILURE: Link unstable. Data packets dropped.");
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
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans text-[var(--text-primary)]">
      
      {/* 1. CLUSTER NAVIGATOR (Left Sidebar) */}
      <aside className="hidden lg:flex w-80 border-r border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] shrink-0 z-20">
        <div className="p-6 border-b border-[var(--border-color)] space-y-5 bg-white/50 dark:bg-black/20">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Binary size={14}/> Active_Clusters
            </h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1.5 bg-indigo-600/10 text-indigo-600 border border-indigo-600/20 rounded-md hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2.5 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all shadow-inner"
              placeholder="Query Hubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {filteredGroups.map(g => (
            <button 
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 border-b border-[var(--border-color)] transition-all text-left relative group ${
                activeGroupId === g.id ? 'bg-white dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {activeGroupId === g.id && <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-600 animate-pulse"></div>}
              <div className="relative shrink-0">
                <img src={g.image} className="w-11 h-11 rounded-xl border border-[var(--border-color)] object-cover bg-white shadow-sm transition-all" />
                {g.isOfficial && (
                   <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5 border-2 border-[var(--sidebar-bg)]">
                      <ShieldCheck size={10} className="text-white" />
                   </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                   <h4 className="text-[11px] font-black uppercase tracking-tight truncate group-hover:text-indigo-600 transition-colors">{g.name}</h4>
                   <span className="text-[8px] font-mono text-slate-400">ID_{g.id.slice(-3)}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase text-indigo-500 px-1.5 py-0.5 bg-indigo-500/10 rounded">{g.category}</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{g.messages[g.messages.length-1]?.text.slice(0, 20)}...</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20 space-y-4">
           <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-500 tracking-widest">
              <span>Registry_Indexing</span>
              <span className="text-indigo-600">92%</span>
           </div>
           <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[92%] animate-pulse"></div>
           </div>
        </div>
      </aside>

      {/* 2. MAIN CLUSTER WORKSPACE */}
      <main className="flex-1 flex flex-col bg-[var(--bg-primary)] min-w-0 h-full relative">
        {activeGroup ? (
          <>
            {/* WORKSPACE HEADER */}
            <div className="border-b border-[var(--border-color)] bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex items-center text-lg sm:text-2xl font-black gap-2 truncate">
                      <Layers size={24} className="text-slate-400 hidden sm:block" />
                      <span className="text-indigo-600 hover:underline cursor-pointer lowercase">{activeGroup.category.toLowerCase()}</span>
                      <span className="text-slate-400">/</span>
                      <span className="truncate italic tracking-tighter uppercase">{activeGroup.name}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)] flex shadow-inner">
                       <button onClick={() => setViewMode('terminal')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'terminal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                          <MessageSquare size={12}/> Terminal
                       </button>
                       <button onClick={() => setViewMode('architecture')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'architecture' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}>
                          <Layout size={12}/> Architecture
                       </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Settings size={18}/></button>
                 </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* CENTRAL VIEW AREA */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#0b0f1a]">
                {viewMode === 'terminal' ? (
                  <>
                    {/* CHAT STREAM (WHATSAPP STYLE) */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar" style={{ backgroundImage: 'linear-gradient(var(--border-color) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}>
                      
                      {/* Neural Snapshot Banner */}
                      {neuralSnapshot && (
                        <div className="bg-indigo-600 text-white rounded-2xl p-8 mb-10 animate-in slide-in-from-top-4 relative overflow-hidden group shadow-2xl">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu size={100}/></div>
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 flex items-center gap-3">
                                 <Sparkles size={16}/> Intelligence_Snapshot
                              </h3>
                              <button onClick={() => setNeuralSnapshot(null)} className="text-white/40 hover:text-white"><X size={14}/></button>
                           </div>
                           <div className="text-[12px] italic whitespace-pre-wrap font-medium leading-relaxed border-l-2 border-white/20 pl-6">
                              {neuralSnapshot}
                           </div>
                        </div>
                      )}

                      {activeGroup.messages.map(msg => {
                        const isMe = msg.authorId === currentUser.id;
                        return (
                          <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`flex max-w-[85%] sm:max-w-[70%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              
                              {!isMe && (
                                <img src={msg.authorAvatar} className="w-8 h-8 rounded-lg border border-[var(--border-color)] object-cover bg-white mt-1 shrink-0" />
                              )}

                              <div className="flex flex-col">
                                {!isMe && (
                                  <span className="text-[9px] font-black uppercase text-slate-500 mb-1 ml-1 tracking-widest">{msg.author}</span>
                                )}
                                
                                <div className={`p-4 rounded-2xl shadow-sm relative group ${
                                  isMe 
                                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                                  : 'bg-white dark:bg-[#161b22] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'
                                }`}>
                                  
                                  {msg.attachment && (
                                    <div className="mb-3">
                                      {msg.attachment.type === 'image' ? (
                                        <div className="relative group/img cursor-pointer overflow-hidden rounded-xl border border-black/10">
                                          <img src={msg.attachment.data} className="max-w-full h-auto transition-transform group-hover/img:scale-105" />
                                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Download size={24} className="text-white" />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? 'bg-indigo-700/50 border-white/10' : 'bg-slate-50 dark:bg-black/20 border-[var(--border-color)]'}`}>
                                          <FileText size={24} className={isMe ? 'text-white' : 'text-indigo-600'} />
                                          <div className="min-w-0">
                                            <p className="text-[11px] font-black uppercase truncate">{msg.attachment.name}</p>
                                            <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Secured_Asset</p>
                                          </div>
                                          <Download size={14} className="ml-auto opacity-40 hover:opacity-100 cursor-pointer" />
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">
                                    {msg.text}
                                  </p>

                                  <div className={`flex items-center gap-2 mt-2 justify-end ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    <span className="text-[8px] font-mono uppercase tracking-widest">{msg.timestamp}</span>
                                    {isMe && <CheckCheck size={12} className="text-emerald-300" />}
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
                         <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl transition-all overflow-hidden">
                            {attachment && (
                              <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3">
                                  {attachment.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase truncate max-w-md">{attachment.name}</p>
                                    <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Ready for Uplink</p>
                                  </div>
                                </div>
                                <button onClick={() => setAttachment(null)} className="p-1 hover:bg-white/10 rounded-full transition-all"><X size={20}/></button>
                              </div>
                            )}

                            <div className="px-6 py-3 border-b border-[var(--border-color)] bg-slate-50/80 dark:bg-white/5 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md text-slate-500 hover:text-indigo-600 transition-all"><Paperclip size={18}/></button>
                                  <div className="w-px h-6 bg-[var(--border-color)]"></div>
                                  <button onClick={handleNeuralSync} disabled={isSummarizing} className="px-4 py-1.5 hover:bg-indigo-600/10 rounded-md text-indigo-600 transition-all flex items-center gap-2 disabled:opacity-30">
                                     {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                                     <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Initialize_Neural_Sync</span>
                                  </button>
                               </div>
                               <div className="hidden sm:flex items-center gap-3">
                                  <div className="flex items-center gap-1.5">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                     <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Link_Stable</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex items-end gap-3 p-4">
                               <textarea 
                                 value={newMessage}
                                 onChange={e => setNewMessage(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                 placeholder="Enter message signal..."
                                 className="flex-1 bg-transparent p-2 text-[14px] font-medium outline-none h-10 max-h-40 resize-none placeholder:italic placeholder:text-slate-400 no-scrollbar"
                               />
                               <button 
                                 onClick={handleSendMessage}
                                 disabled={!newMessage.trim() && !attachment}
                                 className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white p-3 rounded-xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all shrink-0"
                               >
                                  <Send size={20}/>
                                </button>
                            </div>
                         </div>
                       ) : (
                         <div className="p-12 border border-dashed border-amber-600/40 bg-amber-500/5 rounded-3xl flex flex-col items-center gap-6 text-center shadow-inner">
                            <Lock size={48} className="text-amber-500 opacity-40" />
                            <div className="space-y-2">
                               <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-600">Protocol_Access_Denied</h3>
                               <p className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] leading-relaxed max-w-md mx-auto">
                                  Identity not indexed in cluster manifest. Initialize enrollment protocol to establish uplink.
                               </p>
                            </div>
                            <button onClick={() => handleJoin(activeGroup.id)} className="px-12 py-4 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-amber-600/20 active:scale-95 transition-all">Synchronize Node</button>
                         </div>
                       )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar animate-in fade-in zoom-in-98 duration-500">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Activity Heatmap */}
                        <div className="bg-white dark:bg-[#0b0f1a] border border-[var(--border-color)] p-10 rounded-[2.5rem] space-y-10 shadow-2xl">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                                    <BarChart3 size={18} className="text-indigo-600"/> Cluster_Temporal_Flux
                                 </h3>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Signals per coordinate period</p>
                              </div>
                              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase text-emerald-500">High Frequency</div>
                           </div>
                           <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={activityData}>
                                    <defs>
                                       <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="intensity" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorInt)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="grid grid-cols-3 gap-6">
                              <div className="text-center p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-[var(--border-color)] group hover:border-indigo-600 transition-colors">
                                 <p className="text-2xl font-black text-indigo-600">{activeGroup.memberIds.length}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Indexed_Nodes</p>
                              </div>
                              <div className="text-center p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-[var(--border-color)] group hover:border-indigo-600 transition-colors">
                                 <p className="text-2xl font-black text-indigo-600">{activeGroup.messages.length}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Data_Packets</p>
                              </div>
                              <div className="text-center p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-[var(--border-color)] group hover:border-indigo-600 transition-colors">
                                 <p className="text-2xl font-black text-indigo-600">92%</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Log_Integrity</p>
                              </div>
                           </div>
                        </div>

                        {/* Recent Assets Index */}
                        <div className="bg-white dark:bg-[#0b0f1a] border border-[var(--border-color)] p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                                    <Database size={18} className="text-indigo-600"/> Shared_Asset_Vault
                                 </h3>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">Verified academic assets</p>
                              </div>
                           </div>
                           <div className="space-y-5">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-black/20 border border-[var(--border-color)] rounded-2xl hover:border-indigo-600 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-5">
                                       <div className="p-3 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                          <FileText size={20} />
                                       </div>
                                       <div>
                                          <p className="text-[12px] font-black uppercase tracking-tight">Academic_Log_v{i}.log</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Strata: {activeGroup.category} / 4.2 MB</p>
                                       </div>
                                    </div>
                                    <Download size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                 </div>
                              ))}
                           </div>
                           <button className="w-full py-5 border-2 border-dashed border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3 shadow-inner">
                              <GitFork size={16}/> Fork Global Assets to Cluster
                           </button>
                        </div>
                     </div>

                     {/* Strategic Brief */}
                     <div className="p-12 bg-indigo-600 rounded-[3rem] text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.5)]">
                        <div className="absolute top-0 right-0 p-12 opacity-10"><Binary size={200} /></div>
                        <div className="relative z-10 space-y-8">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                                 <ShieldCheck size={32}/>
                              </div>
                              <h3 className="text-3xl font-black uppercase tracking-tighter italic">Operational_Charter</h3>
                           </div>
                           <p className="text-lg font-medium leading-relaxed italic text-indigo-100 max-w-3xl border-l-4 border-white/20 pl-8">
                              "{activeGroup.description}"
                           </p>
                           <div className="flex flex-wrap gap-4 pt-4">
                              <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl active:scale-95">Verify Hub Security</button>
                              <button className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/20 transition-all">Export Manifest</button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              {/* RIGHT TELEMETRY BAR (Member List) */}
              <aside className="hidden xl:flex w-80 border-l border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] p-8 space-y-12 z-20">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                       <Target size={16} className="text-indigo-600"/> Top_Pulse_Nodes
                    </h4>
                    <div className="space-y-4">
                       {activeGroup.memberIds.slice(0, 6).map(id => {
                          const u = db.getUsers().find(user => user.id === id) || currentUser;
                          return (
                             <div key={id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                   <img src={u.avatar} className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white object-cover group-hover:scale-110 transition-transform" />
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-black uppercase truncate w-28 group-hover:text-indigo-600 transition-colors">{u.name}</span>
                                      <span className="text-[8px] text-slate-400 font-bold">NODE_ID: {id.slice(0,4)}</span>
                                   </div>
                                </div>
                                <div className="w-10 h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500 w-[85%]"></div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 <div className="pt-10 border-t border-[var(--border-color)] space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                       <History size={16} className="text-indigo-600"/> Cluster_Activity_Log
                    </h4>
                    <div className="space-y-6">
                       {[1, 2, 3].map(i => (
                          <div key={i} className="relative pl-6 border-l-2 border-indigo-600/20 space-y-2 group">
                             <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform shadow-[0_0_8px_#6366f1]"></div>
                             <p className="text-[10px] font-black uppercase text-indigo-600 leading-none">COMMIT_SEQ_{SHA_GEN()}</p>
                             <p className="text-[9px] text-slate-500 font-medium italic">Asset indexed to global strata successfully.</p>
                             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{i * 15}m ago</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="mt-auto p-6 bg-slate-900 dark:bg-black rounded-[2rem] border border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={60} /></div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural_Sentiment</span>
                       <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 w-[94%] animate-pulse"></div>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium italic text-center">"Node behavior suggests high academic throughput."</p>
                 </div>
              </aside>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12">
             <div className="relative group">
                <div className="absolute -inset-8 bg-indigo-600/10 blur-[60px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>
                <div className="w-40 h-40 bg-indigo-600/5 rounded-[4rem] flex items-center justify-center border-2 border-dashed border-indigo-600/30 shadow-inner transition-all group-hover:border-indigo-600 group-hover:scale-105">
                   <Users size={80} className="text-indigo-600/20 group-hover:text-indigo-600 transition-colors" />
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-5xl font-black uppercase tracking-tighter italic text-[var(--text-primary)]">Select Strategic Cluster</h3>
                <p className="text-[12px] text-slate-500 font-bold uppercase tracking-[0.5em] max-w-md mx-auto leading-loose">
                   Join high-frequency research environments, synchronize wing intelligence, and collaborate with peer-nodes in encrypted hubs.
                </p>
             </div>
             <div className="flex gap-6">
                <button onClick={() => setIsCreating(true)} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-4 hover:bg-indigo-700"><Plus size={20}/> Initialize_Hub</button>
                <button className="px-12 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm active:scale-95">Explore_Registry</button>
             </div>
          </div>
        )}
      </main>

      {/* CREATE HUB MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-xl p-12 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-10 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-8">
                 <div className="flex items-center gap-4 text-indigo-600">
                    <Target size={32} />
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Initialize_Cluster</h2>
                 </div>
                 <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-rose-500 transition-colors active:scale-90"><X size={40}/></button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Cluster_Identity (Name)</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all shadow-inner placeholder:opacity-30" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="e.g. COCIS_Neural_Net_v4" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational_Sector</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 text-sm font-bold outline-none cursor-pointer hover:border-indigo-600 transition-all appearance-none" value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}>
                       <option value="General">Universal Wing</option>
                       {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c} Hub</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol_Directives</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 text-sm font-bold outline-none h-32 resize-none focus:border-indigo-600 transition-all shadow-inner placeholder:italic placeholder:opacity-30" value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} placeholder="Define strategic cluster objectives..." />
                 </div>
                 <button onClick={handleCreateGroup} className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-2xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Commit Cluster to Registry</button>
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
      `}</style>
    </div>
  );
};

export default Groups;
