
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post } from '../types';
import { Search as SearchIcon, Users, Hash, Clock, Plus, MessageCircle, Heart, Eye } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts'>('all');

  useEffect(() => {
    setAllUsers(db.getUsers());
    setAllPosts(db.getPosts());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredUsers([]);
      setFilteredPosts([]);
      return;
    }

    const q = query.toLowerCase();
    
    setFilteredUsers(
      allUsers.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.role.toLowerCase().includes(q) || 
        u.college.toLowerCase().includes(q)
      )
    );

    setFilteredPosts(
      allPosts.filter(p => 
        p.content.toLowerCase().includes(q) || 
        p.author.toLowerCase().includes(q) || 
        p.hashtags.some(h => h.toLowerCase().includes(q))
      )
    );
  }, [query, allUsers, allPosts]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-32">
      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tighter text-[var(--text-primary)] uppercase">The Hub Search</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Find nodes, signals, and assets across campus.</p>
        
        <div className="relative max-w-3xl">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium text-[var(--text-primary)] focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all placeholder:text-slate-400"
            placeholder="Search for students, posts, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {query.trim() && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border-color)] w-fit">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'people', label: 'People' },
              { id: 'posts', label: 'Posts' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === 'all' || activeTab === 'people') && filteredUsers.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <Users className="text-indigo-600" /> People Nodes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(u => (
                  <div key={u.id} className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-500 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} className="w-14 h-14 rounded-2xl object-cover border border-[var(--border-color)] group-hover:border-indigo-500 transition-colors" />
                      <div>
                        <h4 className="font-extrabold text-[var(--text-primary)] uppercase tracking-tight leading-none">{u.name}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5">{u.role} • {u.college}</p>
                      </div>
                    </div>
                    <button className="p-3 bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
                       <Plus size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'posts') && filteredPosts.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <Hash className="text-indigo-600" /> Signal Broadcasts
              </h3>
              <div className="space-y-6">
                {filteredPosts.map(p => (
                  <div key={p.id} className="glass-card p-8 border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-500 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={p.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)]" />
                      <div>
                        <h4 className="font-extrabold text-[var(--text-primary)] uppercase tracking-tight leading-none">{p.author}</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.timestamp} • {p.college}</p>
                      </div>
                    </div>
                    <p className="text-base text-[var(--text-primary)] font-medium italic leading-relaxed">"{p.content}"</p>
                    <div className="flex items-center gap-8 mt-6 pt-4 border-t border-[var(--border-color)]">
                      <span className="flex items-center gap-2 text-rose-500 text-xs font-black"><Heart size={16}/> {p.likes}</span>
                      <span className="flex items-center gap-2 text-indigo-600 text-xs font-black"><MessageCircle size={16}/> {p.commentsCount}</span>
                      <span className="flex items-center gap-2 text-slate-400 text-xs font-black"><Eye size={16}/> {p.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredUsers.length === 0 && filteredPosts.length === 0 && (
            <div className="py-20 text-center space-y-4 glass-card bg-transparent border-dashed border-[var(--border-color)]">
               <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon size={32} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter italic">No signals found for "{query}"</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adjust your scan parameters and try again.</p>
            </div>
          )}
        </div>
      )}

      {!query.trim() && (
        <div className="py-32 text-center opacity-40 select-none">
           <SearchIcon size={80} className="mx-auto text-slate-300 dark:text-slate-800" />
           <p className="text-lg font-black text-slate-400 uppercase tracking-[0.4em] mt-8 italic">Scan initialized. Awaiting input...</p>
        </div>
      )}
    </div>
  );
};

export default Search;
