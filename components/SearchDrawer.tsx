
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { User } from '../types';
import { AuthoritySeal } from './Feed';
import { Search, X, User as UserIcon, Terminal, Activity } from 'lucide-react';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (id: string) => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose, onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const users = db.getUsers();
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.college.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 z-[3005] flex pointer-events-none">
      {/* Search Drawer content */}
      <aside className="relative w-full h-full bg-[var(--bg-primary)] border-r border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 font-sans pointer-events-auto">
        <div className="p-6 border-b border-[var(--border-color)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-[var(--brand-color)]" />
              <h2 className="text-sm font-black uppercase tracking-tighter">Search People</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-[var(--bg-secondary)] rounded-md text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={16} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for someone..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-3 pl-10 pr-4 text-[13px] font-bold outline-none focus:border-[var(--brand-color)] shadow-inner transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
          {query.trim().length > 0 ? (
            <div className="space-y-1">
              {results.length > 0 ? results.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-secondary)] rounded-xl transition-all group text-left"
                >
                  <div className="relative shrink-0">
                    <img 
                      src={user.avatar} 
                      className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover group-hover:scale-105 transition-transform" 
                      alt={user.name} 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[12px] font-black text-[var(--text-primary)] truncate">{user.name}</h4>
                      <AuthoritySeal size={12} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.college} Hub</p>
                  </div>
                </button>
              )) : (
                <div className="py-20 text-center space-y-4 opacity-40">
                  <Activity size={24} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No matches found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center space-y-6 opacity-30">
              <UserIcon size={40} className="mx-auto text-slate-400" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                Find your classmates and friends
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)] bg-slate-50/50">
          <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest text-center">MakSocial Search Online</p>
        </div>
      </aside>
    </div>
  );
};

export default SearchDrawer;
