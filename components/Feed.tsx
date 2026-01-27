import React, { useState, useEffect } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Heart, MessageCircle, Zap, Radio, Activity, Globe, ArrowUpRight, TrendingUp, Terminal, Share2, Bookmark, BarChart3, Clock, MoreHorizontal, User as UserIcon } from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 6).toUpperCase();

const NetworkIntensityGraph: React.FC = () => {
  const sparkData = Array.from({ length: 15 }, (_, i) => ({ v: 30 + Math.random() * 60 }));
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-5 mb-4 relative overflow-hidden group scanning-line">
       <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Activity size={12} className="text-slate-500" /> Network_Intensity
                </h4>
                <div className="flex items-center gap-3">
                   <span className="text-3xl font-black italic tracking-tighter ticker-text">74.8</span>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1">
                         <TrendingUp size={10} /> BULLISH
                      </span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Live v4.2</span>
                   </div>
                </div>
             </div>
             <div className="w-24 h-10">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={sparkData}>
                      <Area type="monotone" dataKey="v" stroke="#475569" fill="#475569" fillOpacity={0.1} strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};

const Watchlist: React.FC = () => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-5">
     <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Radio size={12} className="text-slate-400" /> Sector_Watchlist
     </h4>
     <div className="space-y-4">
        {[{ t: '#COCIS', v: '+12.4%', c: 'text-emerald-500' }, { t: '#CEDAT', v: '-2.1%', c: 'text-rose-500' }, { t: '#LAW', v: '+45.8%', c: 'text-emerald-500' }, { t: '#CHS', v: '+4.2%', c: 'text-emerald-500' }].map((item, i) => (
          <div key={i} className="flex justify-between items-center group cursor-crosshair">
             <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.t}</span>
             <span className={`text-[10px] font-mono font-bold ticker-text ${item.c}`}>{item.v}</span>
          </div>
        ))}
     </div>
  </div>
);

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block ml-1 align-text-bottom flex-shrink-0 opacity-80">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill="currentColor"/>
    </svg>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, bookmarks: string[], onBookmark: (id: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark }) => (
  <article className="post-card mb-4 rounded-lg group animate-in fade-in slide-in-from-bottom-2 duration-300">
     {/* Post Header - Centered Layout */}
     <div className="p-4 flex items-center justify-between border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
           <img 
              src={post.authorAvatar} 
              onClick={() => onNavigateToProfile(post.authorId)} 
              className="w-8 h-8 rounded border border-[var(--border-color)] cursor-pointer bg-white object-cover grayscale hover:grayscale-0 transition-all" 
           />
           <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                 <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[11px] font-black uppercase text-[var(--text-primary)] hover:underline cursor-pointer">{post.author}</span>
                 <AuthoritySeal role={post.authorAuthority} size={12} />
              </div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-60">{post.college} // {post.timestamp}</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => onBookmark(post.id)} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors ${bookmarks.includes(post.id) ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
              <Bookmark size={14} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} />
           </button>
           <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-400"><MoreHorizontal size={14}/></button>
        </div>
     </div>

     {/* Content Area */}
     <div onClick={() => onOpenThread(post.id)} className="p-6 cursor-pointer group-hover:bg-slate-50/30 dark:group-hover:bg-white/5 transition-all">
        <div className="text-[13px] leading-relaxed font-mono text-[var(--text-primary)] mb-2" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.images && post.images.length > 0 && (
           <div className="mt-4 rounded-md overflow-hidden border border-[var(--border-color)]">
              <img src={post.images[0]} className="w-full max-h-[400px] object-cover" />
           </div>
        )}
     </div>

     {/* Footer */}
     <div className="px-4 py-3 bg-slate-50/30 dark:bg-black/20 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Heart size={14} /> <span className="ticker-text">{post.likes.toLocaleString()}</span>
           </button>
           <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <MessageCircle size={14} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span>
           </button>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">SIGN_ID_{SHA_GEN()}</span>
           <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Share2 size={14}/></button>
        </div>
     </div>
  </article>
);

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void, triggerSafetyError: (msg: string) => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack, triggerSafetyError }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [bookmarks, setBookmarks] = useState<string[]>(db.getBookmarks());
  
  useEffect(() => {
    const sync = () => { setPosts(db.getPosts()); setUser(db.getUser()); setBookmarks(db.getBookmarks()); };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = (html: string) => {
    // Basic image extraction from HTML if present
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const imgs = Array.from(doc.querySelectorAll('img')).map(img => img.src);
    
    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorRole: user.role,
      authorAvatar: user.avatar,
      timestamp: 'Just now',
      content: html,
      hashtags: [],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: collegeFilter === 'Global' ? user.college : collegeFilter,
      images: imgs
    };
    db.addPost(newPost);
    setPosts(db.getPosts());
  };

  const handleBookmark = (id: string) => {
    setBookmarks(db.toggleBookmark(id));
  };

  const filteredPosts = posts.filter(p => {
    if (threadId) return p.parentId === threadId || p.id === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1440px] mx-auto pb-40 lg:px-12 py-6 bg-[var(--bg-primary)] min-h-screen">
      
      {/* Mobile Top Widgets (Intensity & Watchlist) */}
      <div className="lg:hidden mb-6 px-4 space-y-4">
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[280px]"><NetworkIntensityGraph /></div>
            <div className="min-w-[200px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-4">
               <span className="text-[8px] font-black uppercase text-slate-400 block mb-2">Watchlist Pulse</span>
               <div className="flex gap-4">
                  {['#COCIS', '#CEDAT'].map(t => <span key={t} className="text-[10px] font-black text-slate-800 dark:text-white uppercase">{t}</span>)}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Feed Content */}
         <div className="lg:col-span-8 px-4 md:px-0">
            {!threadId && <RichEditor onPost={handlePost} currentUser={user} />}
            
            {/* Thread Header if viewing thread */}
            {threadId && (
              <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500 font-black uppercase text-[10px]">Back_to_Global</button>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Signal_Thread</h3>
              </div>
            )}

            <div className="space-y-4">
               {filteredPosts.map((post) => (
                 <PostItem 
                   key={post.id} 
                   post={post} 
                   currentUser={user} 
                   onOpenThread={onOpenThread} 
                   onNavigateToProfile={onNavigateToProfile}
                   bookmarks={bookmarks}
                   onBookmark={handleBookmark}
                 />
               ))}
            </div>
         </div>
         
         {/* TACTICAL RIGHT SIDEBAR (Telemetry) */}
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-6">
            <NetworkIntensityGraph />
            <Watchlist />
            
            <div className="bg-slate-900 dark:bg-black rounded-lg p-6 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 rotate-12"><Globe size={100} fill="white"/></div>
               <div className="relative z-10 space-y-4">
                  <h4 className="text-[14px] font-black uppercase tracking-widest leading-none italic">Verified_Strata</h4>
                  <p className="text-[10px] font-bold opacity-70 uppercase leading-relaxed tracking-tight">
                    Upgrade to high-frequency synchronization. Access prioritized asset indexing and limitless scholarly vault logs.
                  </p>
                  <button className="w-full py-3 bg-white text-slate-900 rounded font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-100 transition-all active:scale-95">Commit_Uplink</button>
               </div>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-lg">
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-loose italic">
                  "Registry protocol synchronization v4.2 stable. End-to-end signal encryption active for all nodes within the Hillstrata network."
               </p>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;