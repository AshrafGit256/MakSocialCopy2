
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
  initialQuery?: string;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToPost: (postId: string) => void;
}

const Search: React.FC<SearchProps> = ({ initialQuery = '', onNavigateToProfile, onNavigateToPost }) => {
  const [query, setQuery] = useState(initialQuery);
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
    
    // Check if query is a hashtag
    const isHashtagSearch = q.startsWith('#');

    const userMatches = (allUsers || []).filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.role.toLowerCase().includes(q) || 
      u.college.toLowerCase().includes(q)
    );

    const postMatches = (allPosts || []).filter(p => {
      let textMatch = false;
      if (isHashtagSearch) {
        textMatch = (p.hashtags || []).some(tag => tag.toLowerCase() === q);
      } else {
        textMatch = p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
      }
      
      const wingMatch = selectedWing === 'All' || p.college === selectedWing;
      return textMatch && wingMatch;
    });

    setFilteredUsers(userMatches);
    setFilteredPosts(postMatches);
    
    if (isHashtagSearch && activeType !== 'Repositories') {
      setActiveType('Repositories');
    }
  }, [query, allUsers, allPosts, selectedWing]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-32 font-sans">
      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
          <input
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-sm"
            placeholder="Search for people, #hashtags, or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg flex items-center gap-2 border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Search Online
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Show</h3>
            {[
              { id: 'Repositories', label: 'Campus Posts', count: filteredPosts.length },
              { id: 'Users', label: 'People', count: filteredUsers.length }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeType === type.id ? 'bg-slate-100 text-slate-900 border-l-4 border-[var(--brand-color)]' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>{type.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeType === type.id ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{type.count}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--border-color)]">
            <h3 className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Colleges (Hubs)</h3>
            {['All', 'COCIS', 'CEDAT', 'LAW', 'CHS', 'COBAMS'].map(wing => (
              <button
                key={wing}
                onClick={() => setSelectedWing(wing as any)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  selectedWing === wing ? 'text-[var(--brand-color)] bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'
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

        {/* RESULTS LIST */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-400">
              {activeType === 'Repositories' 
                ? `${filteredPosts.length} posts found` 
                : `${filteredUsers.length} people found`
              }
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
               Sort: <span className="text-slate-900 flex items-center gap-1 cursor-pointer">Best match <ChevronDown size={14}/></span>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {activeType === 'Repositories' ? (
              filteredPosts.map(post => (
                <div key={post.id} className="py-6 space-y-3 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                       <Book size={16} className="text-slate-400" />
                       <h4 onClick={() => onNavigateToPost(post.id)} className="text-base font-black text-[var(--brand-color)] hover:underline cursor-pointer tracking-tight">
                         {post.author} / post_{post.id.slice(-4)}
                       </h4>
                       <AuthoritySeal size={14} />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, '')}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                           <div className={`w-2 h-2 rounded-full ${post.college === 'COCIS' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                           <span>{post.college} Hub</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-[var(--brand-color)] transition-colors cursor-pointer">
                           <Star size={14}/> {post.likes}
                        </div>
                        <div className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer">
                           <MessageCircle size={14}/> {post.commentsCount}
                        </div>
                        <div className="flex items-center gap-1">
                           {post.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
              filteredUsers.map(user => (
                <div key={user.id} className="py-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <img src={user.avatar} className="w-12 h-12 rounded-full border border-[var(--border-color)] bg-white object-cover shadow-sm" />
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--bg-primary)] rounded-full"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 onClick={() => onNavigateToProfile(user.id)} className="text-[15px] font-black text-slate-900 hover:text-[var(--brand-color)] transition-colors cursor-pointer">{user.name}</h4>
                        <AuthoritySeal size={14} />
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.role} • {user.college} Hub</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Posts</p>
                       <p className="text-sm font-black text-slate-900">{user.postsCount}</p>
                    </div>
                    <button onClick={() => onNavigateToProfile(user.id)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">View Profile</button>
                  </div>
                </div>
              ))
            )}

            {(filteredPosts.length === 0 && filteredUsers.length === 0) && (
              <div className="py-40 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                   <SearchIcon size={32} className="text-slate-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">No results found</h3>
                  <p className="text-[13px] font-medium text-slate-400">We couldn't find anything matching your search. Try different keywords.</p>
                </div>
                <button onClick={() => setQuery('')} className="px-10 py-2.5 bg-[var(--brand-color)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Clear Search</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
