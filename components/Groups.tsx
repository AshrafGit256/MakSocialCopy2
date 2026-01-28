import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { Group, GroupMessage, User, College } from '../types';
import { 
  Users, Plus, Search, MessageSquare, Star, 
  ShieldCheck, ArrowUpRight, Send, Image as ImageIcon, 
  FileText, X, Globe, Terminal, Fingerprint, 
  GitCommit, Activity, Database, Lock, MoreVertical,
  CheckCircle2, Box, Info, Layout
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUser] = useState<User>(db.getUser());
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<{name: string, type: 'image' | 'document', data: string} | null>(null);
  const [mobileMode, setMobileMode] = useState<'list' | 'chat'>('list');

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
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeGroupId, groups, mobileMode]);

  const activeGroup = groups.find(g => g.id === activeGroupId);
  const isMember = activeGroup?.memberIds.includes(currentUser.id);

  const handleJoin = (id: string) => {
    db.joinGroup(id, currentUser.id);
    setGroups(db.getGroups());
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
      timestamp: 'Just now',
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
        const type = file.type.startsWith('image/') ? 'image' : 'document';
        setAttachment({
          name: file.name,
          type: type as 'image' | 'document',
          data: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = () => {
    if (!createForm.name) return;
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
    const updated = [newGroup, ...db.getGroups()];
    db.saveGroups(updated);
    setGroups(updated);
    setIsCreating(false);
    setActiveGroupId(newGroup.id);
    setCreateForm({ name: '', description: '', image: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + Date.now(), category: 'General' });
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden font-mono text-[var(--text-primary)]">
      
      {/* 1. HUB SELECTOR SIDEBAR (GitHub Style) */}
      <aside className={`${mobileMode === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] shrink-0 z-20`}>
        <div className="p-4 border-b border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Database size={14}/> Registry_Hubs
            </h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1.5 bg-indigo-600/10 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all"
              placeholder="Scan for clusters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredGroups.map(g => (
            <button 
              key={g.id}
              onClick={() => { setActiveGroupId(g.id); setMobileMode('chat'); }}
              className={`w-full flex items-center gap-3 p-4 border-b border-[var(--border-color)] transition-all text-left group ${
                activeGroupId === g.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={g.image} className="w-12 h-12 rounded-[var(--radius-main)] border border-[var(--border-color)] object-cover bg-white" />
                {g.isOfficial && (
                   <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5 border-2 border-[var(--sidebar-bg)]">
                      <Star size={8} fill="white" className="text-white" />
                   </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                   <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{g.name}</h4>
                   <span className="text-[8px] font-mono text-slate-400">ID_{g.id.slice(-3)}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black uppercase text-indigo-500">{g.category}</span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{g.memberIds.length} Nodes</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. MAIN TERMINAL (GitHub Repo Style) */}
      <main className={`${mobileMode === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[var(--bg-primary)] min-w-0 h-full relative`}>
        {activeGroup ? (
          <>
            {/* Group Header */}
            <div className="border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-[#161b22]/50 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <button onClick={() => setMobileMode('list')} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600">
                       <X size={20}/>
                    </button>
                    <div className="flex items-center text-base sm:text-lg font-black gap-2 truncate">
                      <Box size={20} className="text-slate-400 hidden sm:block" />
                      <span className="text-indigo-600 hover:underline cursor-pointer">{activeGroup.category.toLowerCase()}</span>
                      <span className="text-slate-400">/</span>
                      <span className="truncate">{activeGroup.name.toLowerCase()}</span>
                      {activeGroup.isOfficial && <CheckCircle2 size={16} className="text-indigo-500 shrink-0" />}
                    </div>
                    <span className="px-2 py-0.5 border border-[var(--border-color)] rounded-full text-[9px] font-black uppercase text-slate-500">Public</span>
                 </div>
                 {!isMember ? (
                   <button 
                     onClick={() => handleJoin(activeGroup.id)}
                     className="px-6 py-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                   >
                     <Plus size={14}/> Join Protocol
                   </button>
                 ) : (
                   <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase rounded-md flex items-center gap-2">
                        <Activity size={10} className="animate-pulse" /> Synchronized
                      </div>
                      <button className="p-2 text-slate-400 hover:text-[var(--text-primary)]"><MoreVertical size={18}/></button>
                   </div>
                 )}
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md space-y-2">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <Info size={12}/> Operational_Instructions
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed italic">"{activeGroup.description}"</p>
              </div>
            </div>

            {/* Message Stream */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" style={{ backgroundImage: 'radial-gradient(var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
              {activeGroup.messages.length > 0 ? activeGroup.messages.map(msg => (
                <div key={msg.id} className="flex gap-4 group">
                  <img src={msg.authorAvatar} className="w-10 h-10 rounded-[var(--radius-main)] border border-[var(--border-color)] object-cover shrink-0 bg-white" />
                  <div className="flex-1 min-w-0 space-y-1">
                     <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black uppercase tracking-tight">{msg.author}</span>
                        <span className="text-[9px] font-mono text-slate-400 opacity-60">commit {SHA_GEN().slice(0,6)}</span>
                        <span className="text-[9px] font-mono text-slate-400">{msg.timestamp}</span>
                     </div>
                     <div className="text-[13px] text-slate-500 leading-relaxed font-medium">
                        {msg.text}
                     </div>
                     {msg.attachment && (
                        <div className="mt-3 inline-block">
                           {msg.attachment.type === 'image' ? (
                             <img src={msg.attachment.data} className="max-w-md rounded-md border border-[var(--border-color)] shadow-sm" />
                           ) : (
                             <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md hover:border-indigo-600 transition-all cursor-pointer">
                                <FileText size={18} className="text-indigo-600" />
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-black uppercase truncate max-w-[200px]">{msg.attachment.name}</span>
                                   <span className="text-[7px] text-slate-400 font-bold tracking-widest">DOWNLOAD_ASSET_READY</span>
                                </div>
                             </div>
                           )}
                        </div>
                     )}
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center space-y-6 opacity-30">
                   <Terminal size={48} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No protocol activity detected.</p>
                </div>
              )}
            </div>

            {/* Input Buffer */}
            {isMember ? (
              <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-[#0d1117]/50">
                 <div className="relative group">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 transition-all">
                       <div className="px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-black/5 rounded text-slate-400 hover:text-indigo-600" title="Attach Asset"><ImageIcon size={16}/></button>
                             <div className="h-4 w-px bg-[var(--border-color)]"></div>
                             <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Commit_Buffer_Active</span>
                          </div>
                       </div>
                       
                       {attachment && (
                          <div className="p-3 bg-indigo-600/5 border-b border-[var(--border-color)] flex items-center justify-between animate-in slide-in-from-top-2">
                             <div className="flex items-center gap-2">
                                {attachment.type === 'image' ? <ImageIcon size={14}/> : <FileText size={14}/>}
                                <span className="text-[10px] font-bold uppercase truncate max-w-xs">{attachment.name}</span>
                             </div>
                             <button onClick={() => setAttachment(null)} className="p-1 hover:text-rose-500"><X size={14}/></button>
                          </div>
                       )}

                       <textarea 
                         value={newMessage}
                         onChange={e => setNewMessage(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                         placeholder="Enter commit message (Shift+Enter for newline)..."
                         className="w-full bg-transparent p-4 text-[13px] font-medium outline-none h-24 resize-none placeholder:italic placeholder:text-slate-400"
                       />
                       
                       <div className="px-3 py-2 flex justify-end">
                          <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() && !attachment}
                            className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-30 text-white px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
                          >
                             BroadCast <Send size={12}/>
                          </button>
                       </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                 </div>
              </div>
            ) : (
              <div className="p-6 border-t border-[var(--border-color)] bg-amber-500/5 flex items-center justify-center">
                 <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">
                    <Lock size={14}/> Protocol Locked. Join Hub to Broadcast Intelligence.
                 </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <div className="w-24 h-24 bg-indigo-600/5 rounded-full flex items-center justify-center border-2 border-dashed border-indigo-600/20">
                <Users size={48} className="text-indigo-600/30" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Select Cluster Node</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] max-w-xs mx-auto leading-loose">
                   Join academic hubs, share research, and collaborate on the hill.
                </p>
             </div>
             <button onClick={() => setMobileMode('list')} className="md:hidden px-8 py-3 bg-indigo-600 text-white rounded-[var(--radius-main)] text-[10px] font-black uppercase">View Hub Registry</button>
          </div>
        )}
      </main>

      {/* 3. CREATE HUB MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 rounded-[var(--radius-main)] shadow-2xl space-y-8 border border-[var(--border-color)]">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <Plus size={20} />
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Initialize_Hub</h2>
                 </div>
                 <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-rose-500"><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hub_Identity (Name)</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold outline-none focus:border-indigo-600 transition-all" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="e.g. COCIS Alpha Sync" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Wing_Sector</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold outline-none" value={createForm.category} onChange={e => setCreateForm({...createForm, category: e.target.value})}>
                       <option value="General">Universal</option>
                       {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => <option key={c} value={c}>{c} Wing</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational_Instructions</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold outline-none h-24 resize-none focus:border-indigo-600 transition-all" value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} placeholder="Define hub parameters and goals..." />
                 </div>
                 <button onClick={handleCreateGroup} className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-[var(--radius-main)] text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">Register Cluster in Registry</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Groups;