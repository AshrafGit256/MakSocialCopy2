
import React, { useState, useRef, useEffect } from 'react';
import { db } from '../db';
import { ChatConversation, User, College } from '../types';
import { 
  Send, Paperclip, Smile, Search, Edit3, 
  Terminal, ShieldCheck, Box, MoreVertical,
  FileText, Code, CheckCircle2, Lock, 
  Database, Activity, Zap, Info, X, Globe,
  ArrowLeft, MessageSquare, Target, Command
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

interface ChatProps {
  initialTargetUserId?: string;
}

const ASSET_PALETTE = [
  { icon: <Zap size={14}/>, label: 'Pulse' },
  { icon: <ShieldCheck size={14}/>, label: 'Secure' },
  { icon: <Activity size={14}/>, label: 'Sync' },
  { icon: <Terminal size={14}/>, label: 'Log' },
  { icon: <Database size={14}/>, label: 'Asset' },
  { icon: <Code size={14}/>, label: 'Logic' },
  { icon: <Globe size={14}/>, label: 'Wing' },
  { icon: <Target size={14}/>, label: 'Node' },
];

const Chat: React.FC<ChatProps> = ({ initialTargetUserId }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [currentUser] = useState(db.getUser());
  const [mobileMode, setMobileMode] = useState<'list' | 'chat'>('list');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => {
      import('../constants').then(m => {
        setConversations(m.MOCK_CHATS);
        
        if (initialTargetUserId) {
          const existingChat = m.MOCK_CHATS.find(c => 
            c.user.name.toLowerCase().includes(initialTargetUserId.toLowerCase()) || 
            c.id === initialTargetUserId
          );
          if (existingChat) {
            setActiveChatId(existingChat.id);
            setMobileMode('chat');
          } else {
            console.log("Initializing direct protocol with node...");
          }
        } else if (m.MOCK_CHATS.length > 0 && !activeChatId && window.innerWidth > 768) {
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
  }, [activeChatId, conversations, mobileMode]);

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
      handleSend(`Commit_Asset: [FILE: ${file.name}] (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden font-mono border-t border-[var(--border-color)] relative">
      
      {/* 1. CHANNEL SELECTOR - List View */}
      <aside className={`
        ${mobileMode === 'chat' ? 'hidden md:flex' : 'flex'}
        w-full md:w-80 border-r border-[var(--border-color)] flex-col bg-[var(--sidebar-bg)] shrink-0 z-20 transition-all duration-300
      `}>
        <div className="p-4 border-b border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
               <Database size={14}/> Node_Channels
            </h2>
            <button className="p-1.5 hover:bg-indigo-600/10 text-indigo-600 rounded transition-all">
              <Edit3 size={16} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 transition-all"
              placeholder="Filter manifests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-[var(--sidebar-bg)]">
          {conversations.length > 0 ? conversations.filter(c => c.user.name.toLowerCase().includes(search.toLowerCase())).map(chat => (
            <button 
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setMobileMode('chat');
              }}
              className={`w-full flex items-center gap-3 p-4 border-b border-[var(--border-color)] transition-all group text-left ${
                activeChatId === chat.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.user.avatar} className="w-12 h-12 rounded-[4px] border border-[var(--border-color)] grayscale group-hover:grayscale-0 transition-all object-cover bg-white" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--sidebar-bg)] rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{chat.user.name}</h4>
                  <span className="text-[8px] font-mono text-slate-400 opacity-60">ID_{SHA_GEN()}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate font-medium">
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          )) : (
            <div className="p-10 text-center space-y-4 opacity-30">
               <Terminal size={32} className="mx-auto" />
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">No active links found</p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. TERMINAL AREA - Chat Content View */}
      <main className={`
        ${mobileMode === 'list' ? 'hidden md:flex' : 'flex'}
        flex-1 flex flex-col bg-[var(--bg-primary)] min-w-0 h-full relative z-10
      `}>
        {activeChat ? (
          <>
            <div className="h-16 border-b border-[var(--border-color)] px-4 md:px-6 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setMobileMode('list')} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 transition-colors">
                   <ArrowLeft size={20} />
                </button>
                <div className="flex items-center text-[10px] md:text-xs font-bold gap-2 truncate">
                  <Box size={14} className="text-slate-400 hidden sm:block" />
                  <span className="text-indigo-600 hover:underline cursor-pointer hidden sm:inline">{currentUser?.name}</span>
                  <span className="text-slate-400 hidden sm:inline">/</span>
                  <span className="text-[var(--text-primary)] truncate">{activeChat.user.name.toLowerCase()}-sync</span>
                </div>
                <div className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[8px] font-black uppercase rounded-full flex items-center gap-1.5 whitespace-nowrap">
                   <Activity size={10} className="animate-pulse" /> Stable_Link
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-[var(--text-primary)] transition-colors"><MoreVertical size={18} /></button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar bg-[var(--bg-primary)]" style={{ backgroundImage: 'radial-gradient(var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
              <div className="py-10 text-center space-y-2 border-b border-dashed border-[var(--border-color)] mb-10 opacity-60">
                 <Lock size={18} className="mx-auto text-slate-400" />
                 <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Uplink Encrypted</h5>
                 <p className="text-[7px] text-slate-400 font-mono">Handshake successful @ {new Date().toLocaleDateString()}</p>
              </div>

              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex group ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col max-w-[95%] md:max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'} gap-1`}>
                    <div className="flex items-center gap-2 px-1">
                       <span className="text-[8px] font-mono text-slate-400 group-hover:text-indigo-600 transition-colors cursor-default">commit {SHA_GEN()}</span>
                       <span className="text-[8px] font-mono text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className={`p-3 md:p-4 border shadow-sm transition-all duration-200 ${
                      msg.isMe 
                      ? 'bg-indigo-600 border-indigo-600 text-white rounded-[4px] rounded-tr-none' 
                      : 'bg-white dark:bg-[#161b22] border-[var(--border-color)] text-[var(--text-primary)] rounded-[4px] rounded-tl-none'
                    }`}>
                      {msg.text.includes('[FILE:') ? (
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-black/10 rounded">
                              <FileText size={20} className={msg.isMe ? 'text-white' : 'text-indigo-600'} />
                           </div>
                           <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-black uppercase truncate max-w-[140px] md:max-w-[200px]">{msg.text.split('[FILE: ')[1].split(']')[0]}</span>
                              <span className="text-[8px] opacity-70 tracking-widest font-bold">ASSET_PAYLOAD_SYNCED</span>
                           </div>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">
                           {msg.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-[#0d1117] relative shrink-0">
              {showPalette && (
                <div className="absolute bottom-[calc(100%+12px)] left-4 right-4 md:left-6 md:right-auto mb-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[4px] shadow-2xl p-4 w-auto md:w-72 animate-in slide-in-from-bottom-2 z-[60]">
                   <div className="flex justify-between items-center mb-3 border-b border-[var(--border-color)] pb-2">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Asset_Registry</h3>
                      <button onClick={() => setShowPalette(false)}><X size={12} className="text-slate-400 hover:text-rose-500"/></button>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {ASSET_PALETTE.map((asset, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSend(`Signal_Asset: [${asset.label}]`)}
                          className="flex flex-col items-center justify-center p-2 rounded border border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all group"
                        >
                           <span className="text-slate-500 group-hover:text-indigo-600">{asset.icon}</span>
                           <span className="text-[6px] font-black uppercase text-slate-400 mt-1">{asset.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="px-4 py-2 border-b border-[var(--border-color)] bg-slate-50/30 dark:bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button onClick={() => fileRef.current?.click()} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"><Paperclip size={14}/></button>
                      <button onClick={() => setShowPalette(!showPalette)} className={`p-1 transition-colors ${showPalette ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}><Smile size={14}/></button>
                      <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>
                      <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Activity size={10} className="text-emerald-500"/> Stream Active
                     </div>
                   </div>
                </div>
                <div className="flex items-end gap-3 p-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-4">
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs px-2 py-1 resize-none h-10 no-scrollbar text-[var(--text-primary)] font-medium placeholder:text-slate-400"
                    placeholder="Enter commit message..."
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
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 text-center space-y-6">
             <div className="w-24 h-24 bg-indigo-600/5 rounded-full flex items-center justify-center border-2 border-dashed border-indigo-600/20 shadow-inner">
                <MessageSquare size={48} className="text-indigo-600/30" />
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Select a Network Node</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] max-w-xs leading-loose mx-auto">
                   Establish a secure protocol with university peers. Select a channel to begin synchronization.
                </p>
             </div>
             <button 
               onClick={() => setMobileMode('list')}
               className="md:hidden px-10 py-4 bg-indigo-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
             >
               View Node Manifest
             </button>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Chat;
