
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../db';
import { ChatConversation, User, College } from '../types';
import { 
  Send, Paperclip, Smile, Search, Edit3, 
  Terminal, ShieldCheck, Cpu, Box, Hash, 
  Filter, MoreVertical, Paperclip as FileIcon, 
  ExternalLink, ChevronRight, MessageSquare, 
  Database, Activity, Zap, Info, X, Globe,
  FileText, Code, CheckCircle2, Lock, Star, 
  Github, GitPullRequest, Laptop, Radio, 
  Layers, HardDrive, Cpu as CpuIcon, Shield,
  Command, Coffee, FlaskConical, Target
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

interface ChatProps {
  initialTargetUserId?: string;
}

const ASSET_PALETTE = [
  { icon: <Zap size={14}/>, label: 'Pulse' },
  { icon: <Shield size={14}/>, label: 'Secure' },
  { icon: <Activity size={14}/>, label: 'Sync' },
  { icon: <Terminal size={14}/>, label: 'Log' },
  { icon: <Database size={14}/>, label: 'Asset' },
  { icon: <Code size={14}/>, label: 'Logic' },
  { icon: <Coffee size={14}/>, label: 'Idle' },
  { icon: <Target size={14}/>, label: 'Node' },
  { icon: <FlaskConical size={14}/>, label: 'Research' },
  { icon: <Command size={14}/>, label: 'Commit' },
  { icon: <Globe size={14}/>, label: 'Wing' },
  { icon: <Box size={14}/>, label: 'Pack' },
];

const Chat: React.FC<ChatProps> = ({ initialTargetUserId }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [wingFilter, setWingFilter] = useState<College | 'Global'>('Global');
  const [isInitializing, setIsInitializing] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [currentUser] = useState(db.getUser());

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => {
      import('../constants').then(m => {
        setConversations(m.MOCK_CHATS);
        
        // Handle navigation from profile
        if (initialTargetUserId) {
          const existingChat = m.MOCK_CHATS.find(c => c.user.name.toLowerCase().includes(initialTargetUserId.toLowerCase()) || c.id === initialTargetUserId);
          if (existingChat) {
            setActiveChatId(existingChat.id);
          } else {
            // New handshake logic
            setIsInitializing(true);
          }
        } else if (m.MOCK_CHATS.length > 0 && !activeChatId) {
          setActiveChatId(m.MOCK_CHATS[0].id);
        }
      });
    };
    sync();
  }, [initialTargetUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatId, conversations]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText || message;
    if (!textToSend.trim() || !activeChatId) return;
    
    const newMessage = {
      id: `m-${Date.now()}`,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const updated = conversations.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: textToSend.length > 30 ? textToSend.slice(0, 30) + '...' : textToSend,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setConversations(updated);
    if (!overrideText) setMessage('');
    setShowPalette(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChatId) {
      handleSend(`Commit Asset Uplink: [FILE: ${file.name}] (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden font-mono border-t border-[var(--border-color)]">
      
      {/* 1. CHANNEL SELECTOR (Left Sidebar) */}
      <aside className="w-80 border-r border-[var(--border-color)] flex flex-col bg-[var(--sidebar-bg)] shrink-0">
        <div className="p-4 border-b border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Database size={14}/> Node_Channels
            </h2>
            <button 
              onClick={() => setIsInitializing(true)}
              className="p-1.5 hover:bg-indigo-600/10 text-indigo-600 rounded transition-all"
              title="Initialize New Signal"
            >
              <Edit3 size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[4px] py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all"
              placeholder="Filter manifests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
             {['Global', 'COCIS', 'CEDAT', 'LAW', 'CHS'].map(w => (
               <button 
                 key={w}
                 onClick={() => setWingFilter(w as any)}
                 className={`px-3 py-1 rounded-full text-[8px] font-black uppercase whitespace-nowrap border transition-all ${
                   wingFilter === w ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-white/5 border-[var(--border-color)] text-slate-400 hover:text-indigo-600'
                 }`}
               >
                 {w}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.length > 0 ? conversations.filter(c => c.user.name.toLowerCase().includes(search.toLowerCase())).map(chat => (
            <button 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full flex items-center gap-3 p-4 border-b border-[var(--border-color)] transition-all group text-left ${
                activeChatId === chat.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.user.avatar} className="w-10 h-10 rounded-[4px] border border-[var(--border-color)] grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[var(--sidebar-bg)] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{chat.user.name}</h4>
                  <span className="text-[8px] font-mono text-slate-400">{SHA_GEN()}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate italic font-medium">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 rounded">Wing Source</span>
                   {chat.unreadCount > 0 && (
                     <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span>
                   )}
                </div>
              </div>
            </button>
          )) : (
            <div className="p-10 text-center space-y-4 opacity-30">
               <Terminal size={32} className="mx-auto" />
               <p className="text-[9px] font-black uppercase tracking-widest">No Active Links</p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. TERMINAL AREA (Chat View) */}
      <main className="flex-1 flex flex-col bg-[var(--bg-primary)] min-w-0">
        {activeChat ? (
          <>
            {/* Header / Repository Info */}
            <div className="h-16 border-b border-[var(--border-color)] px-6 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-xs font-bold gap-2">
                  <Box size={14} className="text-slate-400" />
                  <span className="text-indigo-600 hover:underline cursor-pointer">{currentUser?.name}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-[var(--text-primary)]">{activeChat.user.name.toLowerCase()}-sync</span>
                </div>
                <div className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[8px] font-black uppercase rounded-full flex items-center gap-1.5">
                   <Activity size={10} className="animate-pulse" /> Stable_Link
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer"><Zap size={12}/> 4.2k ops</div>
                  <div className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer"><ShieldCheck size={12}/> Verified</div>
                </div>
                <button className="p-2 text-slate-400 hover:text-[var(--text-primary)] transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Logs / Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[var(--bg-primary)]" style={{ backgroundImage: 'radial-gradient(var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
              <div className="py-10 text-center space-y-2 border-b border-dashed border-[var(--border-color)] mb-10">
                 <Lock size={20} className="mx-auto text-slate-300" />
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">End-to-End Encryption Sequence Verified</h5>
                 <p className="text-[8px] text-slate-400 font-mono italic">Protocol initialized on {new Date().toLocaleDateString()}</p>
              </div>

              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex group ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : 'items-start'} gap-1`}>
                    <div className="flex items-center gap-2 px-1">
                       <span className="text-[8px] font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">commit {SHA_GEN()}</span>
                       <span className="text-[8px] font-mono text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className={`p-4 border shadow-sm transition-all ${
                      msg.isMe 
                      ? 'bg-indigo-600 border-indigo-600 text-white rounded-[4px] rounded-tr-none' 
                      : 'bg-white dark:bg-[#161b22] border-[var(--border-color)] text-[var(--text-primary)] rounded-[4px] rounded-tl-none'
                    }`}>
                      {msg.text.includes('[FILE:') ? (
                        <div className="flex items-center gap-3">
                           <FileText size={20} className="text-white/70" />
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black uppercase truncate">{msg.text.split('[FILE: ')[1].split(']')[0]}</span>
                              <span className="text-[8px] opacity-70">Asset Upload Complete</span>
                           </div>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed font-medium">
                           {msg.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5 relative">
              
              {/* ASSET PALETTE POPOVER */}
              {showPalette && (
                <div className="absolute bottom-full left-6 mb-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[4px] shadow-2xl p-4 w-72 animate-in slide-in-from-bottom-2">
                   <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">Technical.Asset_Registry</h3>
                   <div className="grid grid-cols-4 gap-2">
                      {ASSET_PALETTE.map((asset, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSend(`Signal Asset Logged: [${asset.label}]`)}
                          className="flex flex-col items-center justify-center p-2 rounded border border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all group"
                          title={asset.label}
                        >
                           <span className="text-slate-500 group-hover:text-indigo-600">{asset.icon}</span>
                           <span className="text-[6px] font-black uppercase text-slate-400 mt-1">{asset.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[4px] focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                <div className="px-4 py-2 border-b border-[var(--border-color)] bg-slate-50/30 dark:bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <button onClick={() => fileRef.current?.click()} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Attach Asset"><Paperclip size={14}/></button>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Code Block"><Code size={14}/></button>
                      <button onClick={() => setShowPalette(!showPalette)} className={`p-1.5 transition-colors ${showPalette ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`} title="Asset Palette"><Smile size={14}/></button>
                   </div>
                   <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Terminal Active</div>
                </div>
                <div className="flex items-end gap-3 p-3">
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs px-2 py-2 resize-none h-10 no-scrollbar text-[var(--text-primary)] font-medium"
                    placeholder="Write a message or attach log asset..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!message.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-[4px] transition-all shadow-lg active:scale-95 shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} />
              <div className="mt-3 flex items-center gap-4">
                 <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
                    <CheckCircle2 size={10} className="text-emerald-500" /> Auto-sync active
                 </div>
                 <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400">
                    <Info size={10} /> Shift+Enter for new line
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <div className="w-24 h-24 bg-indigo-600/5 rounded-full flex items-center justify-center border-2 border-dashed border-indigo-600/20">
                <MessageSquare size={48} className="text-indigo-600/30" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Select a Signal Node</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] max-w-xs leading-loose">
                   Operational links required for data transmission. Initiate a new handshake to begin cross-wing comms.
                </p>
             </div>
             <button 
               onClick={() => setIsInitializing(true)}
               className="px-10 py-4 bg-indigo-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
             >
               Initialize Handshake
             </button>
          </div>
        )}
      </main>

      {/* 3. SIGNAL INITIALIZATION MODAL (The Handshake Protocol) */}
      {isInitializing && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg rounded-[4px] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <div className="flex items-center gap-3">
                    <Zap size={20} className="text-indigo-600 fill-indigo-600" />
                    <h3 className="text-sm font-black uppercase tracking-widest italic text-[var(--text-primary)]">Signal_Handshake Protocol</h3>
                 </div>
                 <button onClick={() => setIsInitializing(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="p-4 bg-indigo-600/5 border border-indigo-600/20 rounded-[4px] flex gap-4 items-start">
                    <Info size={18} className="text-indigo-600 shrink-0" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                      Handshake Protocol: You must provide a clear context and target node. Signal will be prunned if context is deemed "Low Integrity."
                    </p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Node (User ID/Name)</label>
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 pl-10 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" placeholder="Search global registry..." defaultValue={initialTargetUserId || ''} />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Context (Subject)</label>
                       <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" placeholder="e.g. Research Sync: CEDAT Robotics" />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Data Packet</label>
                       <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all h-24 resize-none" placeholder="Provide clear technical intent..." />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsInitializing(false)}
                      className="flex-1 bg-indigo-600 py-4 rounded-[4px] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Transmit Signal
                    </button>
                    <button 
                      onClick={() => setIsInitializing(false)}
                      className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                    >
                      Abort
                    </button>
                 </div>
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

export default Chat;
