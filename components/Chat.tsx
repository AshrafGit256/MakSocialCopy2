
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { User, ChatConversation, ChatMessage } from '../types';
import { 
  Search, Phone, Video, Paperclip, Smile, Send, 
  ImageIcon, FileText, X, Check, UserPlus, Zap, 
  Orbit, Download, MoreVertical, Activity, ShieldCheck,
  Lock, ArrowLeft, MessageSquare, Clock
} from 'lucide-react';

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());
  const [allUsers, setAllUsers] = useState<User[]>(db.getUsers());
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const chats = db.getConversations().filter(c => c.participants.includes(currentUser.id));
      setConversations(chats);
      setCurrentUser(db.getUser());
      setAllUsers(db.getUsers());
    };
    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, conversations]);

  const activeChat = conversations.find(c => c.id === activeChatId);
  const otherUserId = activeChat?.participants.find(id => id !== currentUser.id);
  const otherUser = allUsers.find(u => u.id === otherUserId);

  const handleSend = (msgType: ChatMessage['type'] = 'text', content?: any) => {
    if (!activeChatId) return;
    if (msgType === 'text' && !inputText.trim()) return;

    const payload: Partial<ChatMessage> = {
      type: msgType,
      text: msgType === 'text' ? inputText : '',
      ...content
    };

    db.sendMessage(activeChatId, payload, currentUser.id);
    if (msgType === 'text') setInputText('');
    setShowEmoji(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        handleSend(type, { 
          attachmentUrl: reader.result as string, 
          fileName: file.name 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccept = (senderId: string) => {
    db.acceptRequest(currentUser.id, senderId);
  };

  const emojis = ['🚀', '🧠', '⚡', '🤖', '🎓', '🔥', '✨', '💎', '💻', '📡', '🙌', '💯', '✅'];

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden">
      {/* 1. Conversations List */}
      <div className="w-80 border-r border-[var(--border-color)] flex flex-col bg-[var(--sidebar-bg)] transition-theme">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Nodes</h2>
            <button className="text-indigo-600 bg-indigo-600/10 p-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
               <UserPlus size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-indigo-600 transition-all"
              placeholder="Search registry..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar pb-10">
          {conversations.map(chat => {
            const uId = chat.participants.find(id => id !== currentUser.id);
            const user = allUsers.find(u => u.id === uId);
            const isPending = chat.connectionStatus === 'pending';
            const isSentByMe = chat.requestedBy === currentUser.id;

            return (
              <button 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center p-4 rounded-2xl transition-all relative group ${
                  activeChatId === chat.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'hover:bg-indigo-600/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={user?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-color)] group-hover:border-white/20 shadow-sm" />
                  {user?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--sidebar-bg)] rounded-full"></div>
                  )}
                </div>
                <div className="ml-4 flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-black uppercase truncate tracking-tight ${activeChatId === chat.id ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {user?.name}
                    </h4>
                    <span className={`text-[8px] font-black uppercase ${activeChatId === chat.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {chat.lastTimestamp}
                    </span>
                  </div>
                  <p className={`text-[10px] font-medium truncate mt-1 ${activeChatId === chat.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {isPending ? (isSentByMe ? 'Awaiting handshake...' : 'Neural Link Request') : chat.lastMessage}
                  </p>
                </div>
                {isPending && !isSentByMe && (
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)]">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-24 border-b border-[var(--border-color)] px-8 flex items-center justify-between bg-[var(--sidebar-bg)] shadow-sm shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={otherUser?.avatar} className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-color)]" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${otherUser?.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <div>
                  <h4 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-2">
                    {otherUser?.name} <ShieldCheck size={16} className="text-indigo-600" />
                  </h4>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${otherUser?.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {otherUser?.isOnline ? 'Active Pulse detected' : `Last Pulse: ${otherUser?.lastSeen || 'Offline'}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/5 rounded-xl transition-all"><Phone size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/5 rounded-xl transition-all"><Video size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/5 rounded-xl transition-all"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Content / Handshake View */}
            {activeChat.connectionStatus === 'pending' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-[var(--bg-secondary)]/30">
                 <div className="w-32 h-32 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20 relative">
                    <Orbit className="text-indigo-600 animate-spin-slow" size={64} />
                    <Zap className="absolute top-0 right-0 text-amber-500 animate-pulse" size={32} />
                 </div>
                 <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Handshake Required</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Security protocol: established nodes must bilateralize their neural signals before open channel transmission.
                    </p>
                    {activeChat.requestedBy === currentUser.id ? (
                      <div className="p-5 bg-indigo-600/5 rounded-2xl border border-indigo-600/10">
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Awaiting synchronization from {otherUser?.name}...</p>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => otherUser && handleAccept(otherUser.id)}
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          <Check size={18}/> Accept Signal
                        </button>
                        <button className="px-8 bg-[var(--bg-secondary)] text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-[var(--border-color)]">
                          <X size={18}/> Reject
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-dots-pattern">
                  {activeChat.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`flex max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 group`}>
                        <div className={`space-y-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`p-4 rounded-[1.5rem] shadow-sm relative overflow-hidden transition-all hover:shadow-md ${
                            msg.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[var(--sidebar-bg)] text-[var(--text-primary)] rounded-bl-none border border-[var(--border-color)]'
                          }`}>
                            {msg.type === 'text' && <p className="text-sm font-medium leading-relaxed">{msg.text}</p>}
                            {msg.type === 'image' && (
                              <div className="rounded-xl overflow-hidden border border-white/10">
                                <img src={msg.attachmentUrl} className="max-w-[300px] h-auto object-cover" alt="Asset" />
                              </div>
                            )}
                            {msg.type === 'file' && (
                              <div className="flex items-center gap-4 min-w-[200px] bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="p-3 bg-white/20 rounded-xl"><FileText size={20}/></div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-black truncate uppercase tracking-tight">{msg.fileName}</p>
                                   <p className="text-[8px] font-bold opacity-60 uppercase mt-0.5">Asset Protocol Payload</p>
                                </div>
                                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Download size={16}/></button>
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest px-1 block opacity-0 group-hover:opacity-60 transition-opacity">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-8 bg-[var(--sidebar-bg)] border-t border-[var(--border-color)] space-y-4">
                  {showEmoji && (
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl flex flex-wrap gap-3 animate-in slide-in-from-bottom-2">
                       {emojis.map(e => (
                         <button key={e} onClick={() => { setInputText(t => t + e); setShowEmoji(false); }} className="text-xl p-2 hover:bg-indigo-600/10 rounded-xl transition-all">{e}</button>
                       ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowEmoji(!showEmoji)} className={`p-4 rounded-2xl transition-all ${showEmoji ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-600'}`}>
                         <Smile size={22} />
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:text-indigo-600 transition-all">
                         <Paperclip size={22} />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    </div>

                    <div className="flex-1">
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border-2 border-transparent focus:border-indigo-600/30 rounded-3xl py-5 px-8 text-sm font-bold text-[var(--text-primary)] outline-none transition-all placeholder:text-slate-400"
                         placeholder="Synthesize neural message..."
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                       />
                    </div>

                    <button 
                      onClick={() => handleSend()}
                      disabled={!inputText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[1.8rem] transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50 active:scale-95"
                    >
                      <Send size={22} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center relative group">
                <MessageSquare size={64} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
             </div>
             <div className="max-w-xs space-y-2">
                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter italic">Awaiting Signal</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Select a node to initialize synchronization registry</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
