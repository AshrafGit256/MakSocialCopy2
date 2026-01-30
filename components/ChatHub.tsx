
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { ChatConversation, ChatMessage } from '../types';
import { 
  MessageSquare, Users, Phone, Video, Settings, Search, 
  Send, Mic, Image as ImageIcon, Paperclip, Smile,
  Radio, Plus, Lock
} from 'lucide-react';

const ChatHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Updates' | 'Contact'>('Chat');
  const [chatType, setChatType] = useState<'Private' | 'Group'>('Private');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState(db.getUser());

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const chats = db.getChats();
      setConversations(chats);
      if (chats.length > 0 && !activeChatId) setActiveChatId(chats[0].id);
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

  const filteredConversations = conversations.filter(c => 
    (chatType === 'Private' ? !c.isGroup : c.isGroup)
  );

  return (
    <div className="flex h-full bg-[var(--bg-primary)] overflow-hidden text-[var(--text-primary)] font-sans border-t border-[var(--border-color)]">
      <aside className="w-80 border-r border-[var(--border-color)] flex flex-col bg-[var(--bg-primary)] shrink-0 z-20">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={currentUser.avatar} className="w-12 h-12 rounded-full border border-[var(--border-color)]" alt="Me" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-[var(--text-primary)]">{currentUser.name}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{currentUser.role}</p>
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
                className={`pb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === tab.id ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-slate-400'}`}
              >
                {tab.icon} {tab.id}
                {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--brand-color)]"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'Chat' && (
            <div className="flex gap-2 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
              <button 
                onClick={() => setChatType('Private')}
                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${chatType === 'Private' ? 'bg-[var(--brand-color)] text-white border border-[var(--brand-color)] shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Lock size={12}/> Private
              </button>
              <button 
                onClick={() => setChatType('Group')}
                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${chatType === 'Group' ? 'bg-[var(--brand-color)] text-white border border-[var(--brand-color)] shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
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
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 border-b border-[var(--border-color)] transition-all text-left group ${activeChatId === chat.id ? 'bg-[var(--brand-color)]/10' : 'hover:bg-[var(--bg-secondary)]'}`}
              >
                <div className="relative shrink-0">
                  <img src={chat.user.avatar} className="w-12 h-12 rounded-full border border-[var(--border-color)]" alt={chat.user.name} />
                  {chat.user.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-[12px] font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{chat.user.name}</h4>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{chat.lastTimestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">
                    {chat.unreadCount > 0 ? <span className="text-[var(--brand-color)] font-bold">typing...</span> : chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && <span className="bg-[var(--brand-color)] text-white px-2 py-0.5 rounded-full text-[8px] font-black">{chat.unreadCount}+</span>}
              </button>
            ))
          ) : activeTab === 'Contact' ? (
             conversations.map(chat => (
              <div key={chat.id} className="w-full flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4 overflow-hidden">
                  <img src={chat.user.avatar} className="w-10 h-10 rounded-full" alt="avatar" />
                  <div className="truncate">
                    <p className="text-[11px] font-black uppercase text-[var(--text-primary)] truncate">{chat.user.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{chat.user.phone || '+256 78 000 0000'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-[var(--border-color)] text-[var(--brand-color)] hover:bg-[var(--brand-color)]/10"><Phone size={14}/></button>
                  <button className="p-2 rounded-full border border-[var(--border-color)] text-[var(--brand-color)] hover:bg-[var(--brand-color)]/10"><Video size={14}/></button>
                </div>
              </div>
             ))
          ) : (
            <div className="py-20 text-center opacity-30 space-y-4">
              <Plus size={48} className="mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Updates offline</p>
            </div>
          )}
        </div>

        <button className="m-6 p-4 bg-[var(--brand-color)] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all ml-auto hover:brightness-110">
          <Plus size={24} />
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative bg-[var(--bg-primary)]">
        {activeChat ? (
          <>
            <div className="h-20 border-b border-[var(--border-color)] px-8 flex items-center justify-between bg-[var(--bg-primary)]/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={activeChat.user.avatar} className="w-12 h-12 rounded-full border border-[var(--border-color)]" alt={activeChat.user.name} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight">{activeChat.user.name}</h2>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-[var(--brand-color)] text-white rounded-full shadow-lg shadow-[var(--brand-color)]/20 hover:scale-105 active:scale-95 transition-all"><Phone size={18}/></button>
                <button className="p-3 bg-[var(--brand-color)] text-white rounded-full shadow-lg shadow-[var(--brand-color)]/20 hover:scale-105 active:scale-95 transition-all"><Video size={18}/></button>
                <button className="p-3 bg-[var(--bg-secondary)] text-slate-500 rounded-full hover:text-[var(--text-primary)] transition-all"><Settings size={18}/></button>
              </div>
            </div>

            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar relative"
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png"), linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
                backgroundColor: 'var(--bg-secondary)',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Today</span>
                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
              </div>

              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={msg.isMe ? currentUser.avatar : activeChat.user.avatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] self-end mb-1" alt="Avatar" />
                    <div className="flex flex-col gap-1">
                      <div className={`p-4 rounded-2xl shadow-xl leading-relaxed text-sm font-medium ${
                        msg.isMe 
                        ? 'bg-[var(--brand-color)] text-white rounded-br-none' 
                        : 'bg-slate-200 dark:bg-[#d1a67d] text-slate-900 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] font-mono text-slate-500 uppercase tracking-widest ${msg.isMe ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp} {msg.isMe && <CheckCheck className="inline ml-1 text-emerald-500" size={10}/>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-2 flex items-center gap-2 shadow-inner">
                <button className="p-3 text-slate-500 hover:text-[var(--text-primary)] transition-colors"><Smile size={20}/></button>
                <input 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-600 py-3 text-[var(--text-primary)]"
                />
                <div className="flex items-center gap-1">
                  <button onClick={handleSend} className="bg-[var(--brand-color)] text-white px-6 py-3 rounded-xl shadow-lg shadow-[var(--brand-color)]/30 active:scale-95 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><Send size={16}/> Send</button>
                  <div className="w-px h-8 bg-[var(--border-color)] mx-2"></div>
                  <button className="p-3 text-slate-500 hover:text-[var(--brand-color)] transition-colors"><Mic size={20}/></button>
                  <button className="p-3 text-slate-500 hover:text-[var(--brand-color)] transition-colors"><ImageIcon size={20}/></button>
                  <button className="p-3 text-slate-500 hover:text-[var(--brand-color)] transition-colors"><Paperclip size={20}/></button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6">
            <MessageSquare size={120} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Awaiting Node Handshake</h2>
          </div>
        )}
      </main>
    </div>
  );
};

const CheckCheck: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);

export default ChatHub;
