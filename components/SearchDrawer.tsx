
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
    <div className="fixed inset-0 z-[3000] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside className="relative w-full max-w-sm h-full bg-[var(--bg-primary)] border-r border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 font-mono">
        <div className="p-6 border-b border-[var(--border-color)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-[var(--brand-color)]" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Search Registry</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query node name..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] shadow-inner transition-all"
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
                  className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-secondary)] rounded-xl transition-all group text-left"
                >
                  <div className="relative shrink-0">
                    <img 
                      src={user.avatar} 
                      className="w-12 h-12 rounded-full border border-[var(--border-color)] bg-white object-cover group-hover:scale-105 transition-transform" 
                      alt={user.name} 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] truncate">{user.name}</h4>
                      <AuthoritySeal size={14} />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{user.role} • {user.college} HUB</p>
                  </div>
                </button>
              )) : (
                <div className="py-20 text-center space-y-4 opacity-40">
                  <Activity size={32} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No node matches detected</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center space-y-6 opacity-30">
              <UserIcon size={48} className="mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-loose">
                Synchronize with <br /> University peers
              </p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest text-center">Hill Registry Scan Protocol v4.2</p>
        </div>
      </aside>
    </div>
  );
};

export default SearchDrawer;
