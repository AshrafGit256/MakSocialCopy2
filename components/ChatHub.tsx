
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { ChatConversation, ChatMessage } from '../types';
import { 
  MessageSquare, Users, Phone, Video, Settings, Search, 
  Send, Mic, Image as ImageIcon, Paperclip, Smile,
  Radio, Plus, Lock, ArrowLeft, MoreVertical
} from 'lucide-react';

const ChatHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Updates' | 'Contact'>('Chat');
  const [chatType, setChatType] = useState<'Private' | 'Group'>('Private');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState(db.getUser());
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const chats = db.getChats();
      setConversations(chats);
      if (chats.length > 0 && !activeChatId && window.innerWidth > 1024) {
        setActiveChatId(chats[0].id);
      }
    };
    sync();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeChatId, conversations]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChatId) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    const updated = conversations.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, lastTimestamp: msg.timestamp } : c);
    setConversations(updated);
    db.saveChats(updated);
    setNewMessage('');
  };

  const handleSelectConversation = (id: string) => {
    setActiveChatId(id);
    setMobileView('chat');
  };

  const filteredConversations = conversations.filter(c => 
    (chatType === 'Private' ? !c.isGroup : c.isGroup)
  );

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden text-[var(--text-primary)] font-sans border-t border-[var(--border-color)] relative">
      
      {/* SIDEBAR - Hides on mobile when chat is active */}
      <aside className={`
        ${mobileView === 'chat' ? 'hidden' : 'flex'} 
        lg:flex w-full lg:w-80 border-r border-[var(--border-color)] flex-col bg-[var(--bg-primary)] shrink-0 z-20
      `}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)]" alt="Me" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-[var(--text-primary)]">{currentUser.name}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase">{currentUser.role}</p>
              </div>
            </div>
            <button className="p-2 text-slate-500 hover:text-[var(--text-primary)] transition-colors"><Settings size={18}/></button>
          </div>

          <div className="flex items-center gap-6 border-b border-[var(--border-color)]">
            {[
              { id: 'Chat', icon: <MessageSquare size={16}/> },
              { id: 'Updates', icon: <Radio size={16}/> },
              { id: 'Contact', icon: <Phone size={16}/> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeTab === tab.id ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-slate-400'}`}
              >
                {tab.icon} {tab.id}
                {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--brand-color)]"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'Chat' && (
            <div className="flex gap-2 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-inner">
              <button 
                onClick={() => setChatType('Private')}
                className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${chatType === 'Private' ? 'bg-white text-[var(--brand-color)] border border-[var(--border-color)] shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
              >
                <Lock size={12}/> Private
              </button>
              <button 
                onClick={() => setChatType('Group')}
                className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${chatType === 'Group' ? 'bg-white text-[var(--brand-color)] border border-[var(--border-color)] shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
              >
                <Users size={12}/> Group
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'Chat' ? (
            filteredConversations.map(chat => (
              <button 
                key={chat.id} 
                onClick={() => handleSelectConversation(chat.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 border-b border-[var(--border-color)] transition-all text-left group ${activeChatId === chat.id ? 'bg-[var(--brand-color)]/5 border-l-4 border-l-[var(--brand-color)]' : 'hover:bg-[var(--bg-secondary)]'}`}
              >
                <div className="relative shrink-0">
                  <img src={chat.user.avatar} className="w-11 h-11 rounded-full border border-[var(--border-color)] object-cover bg-white" alt={chat.user.name} />
                  {chat.user.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{chat.user.name}</h4>
                    <span className="text-[8px] font-mono text-slate-400 uppercase">{chat.lastTimestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-medium">
                    {chat.unreadCount > 0 ? <span className="text-[var(--brand-color)] font-bold italic">transmitting...</span> : chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[8px] font-black">{chat.unreadCount}</span>}
              </button>
            ))
          ) : (
            <div className="py-20 text-center opacity-30 space-y-4">
              <Plus size={48} className="mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Manifest empty</p>
            </div>
          )}
        </div>
      </aside>

      {/* CHAT AREA - Full screen on mobile when mode is 'chat' */}
      <main className={`
        ${mobileView === 'list' ? 'hidden' : 'flex'} 
        lg:flex flex-1 flex flex-col min-w-0 h-full relative bg-[var(--bg-primary)]
      `}>
        {activeChat ? (
          <>
            <div className="h-16 md:h-20 border-b border-[var(--border-color)] px-4 md:px-8 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-md shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <button 
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-[var(--brand-color)] transition-colors"
                >
                  <ArrowLeft size={22} />
                </button>
                <div className="relative shrink-0">
                  <img src={activeChat.user.avatar} className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-[var(--border-color)] bg-white object-cover" alt={activeChat.user.name} />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                </div>
                <div className="truncate">
                  <h2 className="text-sm md:text-base font-black uppercase tracking-tight truncate">{activeChat.user.name}</h2>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Uplink Active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-3">
                <button className="p-2 md:p-3 text-slate-400 hover:text-[var(--brand-color)] transition-all"><Phone size={18}/></button>
                <button className="p-2 md:p-3 text-slate-400 hover:text-[var(--brand-color)] transition-all"><Video size={18}/></button>
                <button className="p-2 md:p-3 text-slate-400 hover:text-[var(--text-primary)] transition-all"><MoreVertical size={18}/></button>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar relative bg-[#fcfcfc] dark:bg-[#050505]"
              style={{
                backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            >
              <div className="flex items-center gap-4 mb-12 py-4">
                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Communication Log Start</span>
                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
              </div>

              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex gap-2 md:gap-3 max-w-[90%] md:max-w-[75%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={msg.isMe ? currentUser.avatar : activeChat.user.avatar} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-[var(--border-color)] self-end mb-1 shrink-0" alt="Avatar" />
                    <div className={`flex flex-col gap-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 md:p-4 rounded-xl shadow-sm text-sm font-medium leading-relaxed ${
                        msg.isMe 
                        ? 'bg-[var(--brand-color)] text-white rounded-br-none' 
                        : 'bg-white dark:bg-[#161b22] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[8px] font-mono text-slate-400 uppercase tracking-widest ${msg.isMe ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp} {msg.isMe && <span className="text-emerald-500 ml-1">✓</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-6 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1 md:p-2 flex items-center gap-1 md:gap-2 shadow-inner">
                <button className="p-2 md:p-3 text-slate-400 hover:text-[var(--brand-color)] transition-colors"><Smile size={20}/></button>
                <textarea 
                  rows={1}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Transmit signal..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-400 py-3 text-[var(--text-primary)] resize-none"
                />
                <div className="flex items-center gap-0.5 md:gap-1">
                  <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-[var(--brand-color)] text-white p-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-30">
                    <Send size={18}/>
                  </button>
                  <div className="hidden md:flex items-center gap-1">
                     <div className="w-px h-8 bg-[var(--border-color)] mx-1"></div>
                     <button className="p-3 text-slate-400 hover:text-[var(--brand-color)] transition-colors"><Mic size={20}/></button>
                     <button className="p-3 text-slate-400 hover:text-[var(--brand-color)] transition-colors"><Paperclip size={20}/></button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6">
            <MessageSquare size={120} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Node sync required</h2>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ticker-text { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
};

export default ChatHub;
