import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole, College } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  Search as SearchIcon, Users, Hash, 
  MessageCircle, Heart, Star, GitFork, 
  Book, FileCode, Clock, Filter, 
  ChevronDown, Terminal, Database,
  ArrowUpRight, Layout, Info, Share2, ArrowLeft
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
  const [activeType, setActiveType] = useState<'Signals' | 'Nodes'>('Signals');

  useEffect(() => {
    setAllUsers(db.getUsers());
    setAllPosts(db.getPosts());
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
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
      return textMatch;
    });

    setFilteredUsers(userMatches);
    setFilteredPosts(postMatches);
    
    if (isHashtagSearch && activeType !== 'Signals') {
      setActiveType('Signals');
    }
  }, [query, allUsers, allPosts]);

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen border-x border-[var(--border-color)]">
      <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md p-4 border-b border-[var(--border-color)]">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
          <input
            className="w-full bg-slate-100 border-none rounded-full py-3 pl-12 pr-4 text-[15px] font-medium outline-none focus:ring-2 focus:ring-[var(--brand-color)]/20 transition-all"
            placeholder="Search Signals or Nodes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex mt-4">
           {['Signals', 'Nodes'].map(type => (
             <button
               key={type}
               onClick={() => setActiveType(type as any)}
               className={`flex-1 py-3 text-[15px] font-bold transition-all relative ${
                 activeType === type ? 'text-slate-900' : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {type}
               {activeType === type && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[var(--brand-color)] rounded-full"></div>}
             </button>
           ))}
        </div>
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {activeType === 'Signals' ? (
          filteredPosts.length > 0 ? filteredPosts.map(post => (
            <div key={post.id} onClick={() => onNavigateToPost(post.id)} className="p-4 hover:bg-slate-50 cursor-pointer transition-all flex gap-3">
                <img src={post.authorAvatar} className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <span className="text-[15px] font-bold uppercase truncate">{post.author}</span>
                        <AuthoritySeal size={14} />
                        <span className="text-[14px] text-slate-500">@{post.authorId} · {post.timestamp}</span>
                    </div>
                    <p className="text-[16px] text-slate-900 leading-relaxed mt-1 line-clamp-3 post-body">
                      {post.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center gap-6 mt-3 text-slate-500 text-[13px]">
                        <span className="flex items-center gap-1"><MessageCircle size={16}/> {post.commentsCount}</span>
                        <span className="flex items-center gap-1"><Star size={16}/> {post.likes}</span>
                    </div>
                </div>
            </div>
          )) : <div className="py-40 text-center opacity-30 text-[16px] font-bold">No signals found</div>
        ) : (
          filteredUsers.length > 0 ? filteredUsers.map(user => (
            <div key={user.id} onClick={() => onNavigateToProfile(user.id)} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                <img src={user.avatar} className="w-14 h-14 rounded-full border border-[var(--border-color)] bg-white object-cover" />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-[16px] font-bold text-slate-900 uppercase">{user.name}</h4>
                    <AuthoritySeal size={16} />
                  </div>
                  <p className="text-[14px] text-slate-500 uppercase tracking-tight font-medium">{user.role} · {user.college} HUB</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-slate-900 text-white rounded-full text-[14px] font-bold hover:brightness-90 transition-all">View</button>
            </div>
          )) : <div className="py-40 text-center opacity-30 text-[16px] font-bold">No nodes found</div>
        )}
      </div>
    </div>
  );
};

export default Search;