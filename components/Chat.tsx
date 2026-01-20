
import React, { useState } from 'react';
import { MOCK_CHATS } from '../constants';
import { Search, Edit3, Phone, Video, Info, Paperclip, Smile, Send, FileText, ImageIcon } from 'lucide-react';

const Chat: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState(MOCK_CHATS[0].id);
  const activeChat = MOCK_CHATS.find(c => c.id === activeChatId) || MOCK_CHATS[0];

  return (
    <div className="flex h-full bg-[#05080c]">
      {/* Chat List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-[#0a0f18]/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Chats</h2>
            <button className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-lg transition-colors">
              <Edit3 size={18} />
            </button>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              className="w-full bg-[#1a1f2e] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none"
              placeholder="Search conversations..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {MOCK_CHATS.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full flex items-center p-3 rounded-2xl transition-all ${
                activeChatId === chat.id ? 'bg-blue-600/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <img src={chat.user.avatar} className="w-12 h-12 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0f18] rounded-full"></div>
              </div>
              <div className="ml-3 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${activeChatId === chat.id ? 'text-blue-400' : 'text-slate-200'}`}>{chat.user.name}</h4>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-600 text-[10px] text-white font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-1">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#05080c]">
        {/* Chat Header */}
        <div className="h-20 border-b border-white/5 px-6 flex items-center justify-between bg-[#0a0f18]/30">
          <div className="flex items-center space-x-3">
            <img src={activeChat.user.avatar} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h4 className="text-sm font-bold text-white">{activeChat.user.name}</h4>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white"><Phone size={20} /></button>
            <button className="text-slate-400 hover:text-white"><Video size={20} /></button>
            <button className="text-slate-400 hover:text-white"><Info size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeChat.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                {!msg.isMe && <img src={activeChat.user.avatar} className="w-8 h-8 rounded-full" />}
                <div className={`p-4 rounded-2xl text-sm ${
                  msg.isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1a1f2e] text-slate-200 rounded-bl-none border border-white/5'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block mt-2 opacity-60 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-6">
          <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 p-2 flex items-center gap-3">
            <button className="text-slate-500 hover:text-blue-400 p-2"><Paperclip size={22} /></button>
            <input 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
              placeholder="Type a message..."
            />
            <button className="text-slate-500 hover:text-yellow-400 p-2"><Smile size={22} /></button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
