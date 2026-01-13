import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post } from '../types';
import { 
  Search as SearchIcon, Users, Hash, Plus, 
  MessageCircle, Heart, Eye, ArrowRight, Sparkles, 
  Zap, Command, FileText, ImageIcon 
} from 'lucide-react';

interface SearchProps {
  onNavigateToProfile: (userId: string) => void;
  onNavigateToPost: (postId: string) => void;
}

const Search: React.FC<SearchProps> = ({ onNavigateToProfile, onNavigateToPost }) => {
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

  const isArticle = (p: Post) => p.content.length > 150 && !p.images?.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12 pb-32">
      <div className="relative group max-w-4xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-full px-6 py-4 focus-within:border-indigo-500 transition-colors">
            
            <SearchIcon size={20} className="text-slate-400" />

            <input
              className="flex-1 bg-transparent text-base font-medium text-[var(--text-primary)] outline-none placeholder:text-slate-500"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      query.trim() ? 
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-[1.5rem] border border-[var(--border-color)] w-fit">
            {[
              { id: 'all', label: 'Universal' },
              { id: 'people', label: 'People' },
              { id: 'posts', label: 'Broadcasts' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Result Panel */}
            <div className="lg:col-span-12 space-y-12">
              {(activeTab === 'all' || activeTab === 'people') && filteredUsers.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <Users size={16} className="text-indigo-600" /> Population Cluster ({filteredUsers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => onNavigateToProfile(u.id)}
                        className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={u.avatar} className="w-16 h-16 rounded-[1.25rem] object-cover border-2 border-[var(--border-color)] group-hover:border-indigo-500 transition-colors" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[var(--text-primary)] text-lg leading-none">{u.name}</h4>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{u.college} • {u.role}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-600/5 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <ArrowRight size={20}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'posts') && filteredPosts.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <Hash size={16} className="text-indigo-600" /> Active Signal Stream ({filteredPosts.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {filteredPosts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => onNavigateToPost(p.id)}
                        className="glass-card p-8 border-[var(--border-color)] bg-[var(--card-bg)] hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all cursor-pointer group flex flex-col md:flex-row gap-8"
                      >
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <img src={p.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)]" />
                            <div>
                              <h4 className="font-extrabold text-[var(--text-primary)] uppercase tracking-tight leading-none text-sm">{p.author}</h4>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.timestamp} • {p.college}</p>
                            </div>
                            <div className="ml-auto">
                              {isArticle(p) ? (
                                <div className="flex items-center gap-2 text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">
                                  <FileText size={10}/> Long Form
                                </div>
                              ) : p.images?.length ? (
                                <div className="flex items-center gap-2 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">
                                  <ImageIcon size={10}/> Visual Asset
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <p className={`text-[var(--text-primary)] ${isArticle(p) ? 'text-lg font-serif italic' : 'text-base font-medium'} leading-relaxed line-clamp-3`}>
                            "{p.content}"
                          </p>
                          <div className="flex items-center gap-8 pt-4 border-t border-[var(--border-color)]">
                            <span className="flex items-center gap-2 text-rose-500 text-[10px] font-black"><Heart size={16}/> {p.likes.toLocaleString()}</span>
                            <span className="flex items-center gap-2 text-indigo-600 text-[10px] font-black"><MessageCircle size={16}/> {p.commentsCount}</span>
                            <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black"><Eye size={16}/> {p.views.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {p.images?.[0] && (
                          <div className="w-full md:w-64 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-[var(--border-color)] shrink-0">
                            <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default Search;
