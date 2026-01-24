import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole, College } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  Search as SearchIcon, Users, Hash, 
  MessageCircle, Heart, Star, GitFork, 
  Book, FileCode, Clock, Filter, 
  ChevronDown, Terminal, Database,
  ArrowUpRight, Layout, Info, Share2
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
  const [activeType, setActiveType] = useState<'Repositories' | 'Users'>('Repositories');
  const [selectedWing, setSelectedWing] = useState<College | 'All'>('All');

  useEffect(() => {
    setAllUsers(db.getUsers());
    setAllPosts(db.getPosts());
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    
    const userMatches = (allUsers || []).filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.role.toLowerCase().includes(q) || 
      u.college.toLowerCase().includes(q)
    );

    const postMatches = (allPosts || []).filter(p => {
      const textMatch = p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
      const wingMatch = selectedWing === 'All' || p.college === selectedWing;
      return textMatch && wingMatch;
    });

    setFilteredUsers(userMatches);
    setFilteredPosts(postMatches);
  }, [query, allUsers, allPosts, selectedWing]);

  const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-32 font-mono">
      {/* 1. TOP SEARCH BAR - GitHub Vibe */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
            placeholder="Search Registry for nodes, signals, or academic assets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none opacity-30">
            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-[9px] font-bold">/</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase rounded-md flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Registry_Online
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. SIDEBAR FILTERS */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase text-slate-500 tracking-widest mb-3">Filter by Type</h3>
            {[
              { id: 'Repositories', label: 'Broadcast Signals', count: filteredPosts.length },
              { id: 'Users', label: 'Network Nodes', count: filteredUsers.length }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  activeType === type.id ? 'bg-[var(--bg-secondary)] border-l-4 border-orange-500 text-[var(--text-primary)]' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span>{type.label}</span>
                <span className="bg-slate-200 dark:bg-white/5 px-1.5 py-0.5 rounded-full text-[9px]">{type.count}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--border-color)]">
            <h3 className="px-3 text-[11px] font-bold uppercase text-slate-500 tracking-widest mb-3">Languages (Hubs)</h3>
            {['All', 'COCIS', 'CEDAT', 'LAW', 'CHS', 'COBAMS'].map(wing => (
              <button
                key={wing}
                onClick={() => setSelectedWing(wing as any)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-[10px] font-black uppercase transition-all ${
                  selectedWing === wing ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-600/5' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  wing === 'COCIS' ? 'bg-indigo-500' : 
                  wing === 'CEDAT' ? 'bg-orange-500' : 
                  wing === 'LAW' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}></div>
                {wing}
              </button>
            ))}
          </div>
        </aside>

        {/* 3. RESULTS LIST - GitHub Repo List Style */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              {activeType === 'Repositories' 
                ? `${filteredPosts.length} signal results found` 
                : `${filteredUsers.length} network node results found`
              }
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
               Sort: <span className="text-[var(--text-primary)] flex items-center gap-1 cursor-pointer">Best match <ChevronDown size={14}/></span>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {activeType === 'Repositories' ? (
              filteredPosts.map(post => (
                <div key={post.id} className="py-6 space-y-4 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                       <Book size={16} className="text-slate-400" />
                       <h4 onClick={() => onNavigateToPost(post.id)} className="text-base font-black text-indigo-600 hover:underline cursor-pointer tracking-tight">
                         {post.author.toLowerCase()} / signal_{post.id.slice(-4)}
                       </h4>
                       <span className="px-2 py-0.5 border border-[var(--border-color)] rounded-full text-[9px] text-slate-500 font-bold uppercase">Public</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2 italic">
                        "{post.content.replace(/<[^>]*>/g, '')}"
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400">
                        <div className="flex items-center gap-1.5">
                           <div className={`w-2.5 h-2.5 rounded-full ${post.college === 'COCIS' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                           <span className="uppercase">{post.college} Hub</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer">
                           <Star size={14}/> {post.likes}
                        </div>
                        <div className="flex items-center gap-1 hover:text-emerald-500 transition-colors cursor-pointer">
                           <GitFork size={14}/> {post.commentsCount}
                        </div>
                        <div className="flex items-center gap-1">
                           Updated {post.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Technical Metadata Box */}
                    <div className="hidden md:block w-48 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                       <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                          <span>SHA_SUM</span>
                          <span>{SHA_GEN()}</span>
                       </div>
                       <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 w-3/4"></div>
                       </div>
                       <p className="text-[7px] font-bold text-slate-400 leading-none">INTEGRITY: VERIFIED</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="py-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <img src={user.avatar} className="w-12 h-12 rounded-[4px] border border-[var(--border-color)] bg-white object-cover" />
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 onClick={() => onNavigateToProfile(user.id)} className="text-sm font-black text-[var(--text-primary)] hover:text-indigo-600 transition-colors cursor-pointer uppercase">{user.name}</h4>
                        <AuthoritySeal role={user.badges?.includes('Official') ? 'Official' : undefined} size={14} />
                      </div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{user.role} • {user.college} HUB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase">Commits</p>
                       <p className="text-sm font-black text-indigo-600">{user.postsCount}</p>
                    </div>
                    <button onClick={() => onNavigateToProfile(user.id)} className="px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest transition-all">View Node</button>
                  </div>
                </div>
              ))
            )}

            {(filteredPosts.length === 0 && filteredUsers.length === 0) && (
              <div className="py-40 text-center space-y-6">
                <Terminal size={48} className="mx-auto text-slate-300" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Registry Error: 404</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No alphanumeric signals detected for current query parameters.</p>
                </div>
                <button onClick={() => setQuery('')} className="px-8 py-3 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Clear Protocol</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;