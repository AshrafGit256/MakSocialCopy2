
import React from 'react';
import { db } from '../db';
import { ChatConversation } from '../types';
import { MessageSquare, Star, Clock, ChevronRight, User, Terminal } from 'lucide-react';

interface MessageDropdownProps {
  onClose: () => void;
  onViewAll: () => void;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({ onClose, onViewAll }) => {
  const conversations = db.getChats().slice(0, 3);
  const SHA_GEN = () => Math.random().toString(16).substring(2, 6).toUpperCase();

  return (
    <div className="absolute top-full right-0 mt-3 w-80 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md shadow-2xl z-[1000] overflow-hidden animate-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active_Uplinks</span>
        <div className="px-1.5 py-0.5 bg-[var(--brand-color)] text-white text-[8px] font-black rounded-sm">{conversations.length}</div>
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
            className="p-4 flex gap-4 hover:bg-[var(--bg-secondary)] transition-all cursor-pointer group"
            onClick={() => { onViewAll(); onClose(); }}
          >
            <div className="relative shrink-0">
              <img src={chat.user.avatar} className="w-12 h-12 rounded-full border border-[var(--border-color)] bg-white object-cover grayscale group-hover:grayscale-0 transition-all" alt="Node" />
              {chat.user.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-[12px] font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{chat.user.name}</h4>
                <Star size={12} className={chat.unreadCount > 0 ? "text-amber-500" : "text-slate-300"} fill={chat.unreadCount > 0 ? "currentColor" : "none"} />
              </div>
              <p className="text-[10px] text-slate-500 truncate font-medium mb-1.5">
                {chat.lastMessage}
              </p>
              <div className="flex items-center gap-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                 <div className="flex items-center gap-1"><Clock size={10}/> {chat.lastTimestamp}</div>
                 <div className="text-indigo-500 opacity-60">ID_{SHA_GEN()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => { onViewAll(); onClose(); }}
        className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--brand-color)] hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-t border-[var(--border-color)] flex items-center justify-center gap-2"
      >
        See All Messages <ChevronRight size={12}/>
      </button>
    </div>
  );
};

export default MessageDropdown;
