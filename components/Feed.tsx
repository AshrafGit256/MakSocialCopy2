import React, { useState, useEffect } from 'react';
import { Post, User, College, AuthorityRole, PollData } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { 
  Heart, MessageCircle, Zap, Radio, Activity, Globe, 
  ArrowUpRight, TrendingUp, Terminal, Share2, Bookmark, 
  BarChart3, Clock, MoreHorizontal, ShieldCheck, 
  Database, Hash, ArrowLeft
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 6).toUpperCase();

const NetworkIntensityGraph: React.FC = () => {
  const sparkData = Array.from({ length: 12 }, (_, i) => ({ v: 40 + Math.random() * 50 }));
  return (
    <div className="pro-card p-5 mb-4 relative overflow-hidden group scanning-line">
       <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Activity size={12} /> Network_Intensity
                </h4>
                <div className="flex items-center gap-3">
                   <span className="text-3xl font-black italic tracking-tighter ticker-text text-slate-700 dark:text-slate-300">74.8</span>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-0.5">
                         <TrendingUp size={10} /> BULLISH
                      </span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">v4.2_STABLE</span>
                   </div>
                </div>
             </div>
             <div className="w-20 h-10 opacity-30">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={sparkData}>
                      <Area type="monotone" dataKey="v" stroke="#475569" fill="#475569" fillOpacity={0.2} strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};

const Watchlist: React.FC = () => (
  <div className="pro-card p-5">
     <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Radio size={12} className="text-slate-400" /> Sector_Watchlist
     </h4>
     <div className="space-y-5">
        {[{ t: '#COCIS', v: '+12.4%', c: 'text-emerald-500' }, { t: '#CEDAT', v: '-2.1%', c: 'text-rose-500' }, { t: '#LAW', v: '+45.8%', c: 'text-emerald-500' }].map((item, i) => (
          <div key={i} className="flex justify-between items-center group">
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
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block align-text-bottom opacity-80">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill="currentColor"/>
    </svg>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, bookmarks: string[], onBookmark: (id: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark }) => (
  <article className="pro-card mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-300 border-x-0 sm:border-x">
     {/* Centered Identity Header */}
     <div className="p-8 flex flex-col items-center justify-center border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20 relative">
        <div className="absolute top-6 right-6 flex gap-2">
           <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-2 rounded-full transition-all ${bookmarks.includes(post.id) ? 'text-orange-500 bg-orange-500/10' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'}`}>
              <Bookmark size={16} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} />
           </button>
           <button className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full transition-all"><MoreHorizontal size={16}/></button>
        </div>
        
        <div className="relative group/avatar cursor-pointer" onClick={() => onNavigateToProfile(post.authorId)}>
           <img 
              src={post.authorAvatar} 
              className="w-20 h-20 rounded-full border-2 border-[var(--border-color)] bg-white object-cover grayscale group-hover/avatar:grayscale-0 transition-all shadow-xl" 
           />
           <div className="absolute -bottom-1 -right-1 bg-[#475569] text-white rounded-full p-1.5 border-2 border-[var(--bg-primary)]">
              <AuthoritySeal role={post.authorAuthority} size={14} />
           </div>
        </div>

        <div className="mt-4 text-center space-y-1">
           <h4 onClick={() => onNavigateToProfile(post.authorId)} className="text-[15px] font-black uppercase tracking-tighter text-[var(--text-primary)] hover:underline cursor-pointer italic">{post.author}</h4>
           <div className="flex items-center justify-center gap-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.college} HUB</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{post.timestamp}</span>
           </div>
        </div>
     </div>

     {/* Content - Full Width Reclamation */}
     <div onClick={() => onOpenThread(post.id)} className="p-8 cursor-pointer hover:bg-slate-50/20 dark:hover:bg-white/5 transition-all">
        <div className="text-[14px] leading-relaxed font-mono text-[var(--text-primary)] mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {post.pollData && (
           <div className="my-6 space-y-3 bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded shadow-inner">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2"><BarChart3 size={12}/> Active Node Census</p>
              {post.pollData.options.map(opt => {
                 const percentage = post.pollData?.totalVotes ? Math.round((opt.votes / post.pollData.totalVotes) * 100) : 0;
                 return (
                    <div key={opt.id} className="relative h-10 border border-[var(--border-color)] rounded overflow-hidden flex items-center px-4 group/opt cursor-pointer hover:border-indigo-500 transition-all">
                       <div className="absolute inset-y-0 left-0 bg-[#475569]/10 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                       <span className="relative z-10 text-[11px] font-bold flex-1">{opt.text}</span>
                       <span className="relative z-10 text-[10px] font-black text-slate-400 group-hover/opt:text-slate-900 dark:group-hover/opt:text-white transition-colors">{percentage}%</span>
                    </div>
                 );
              })}
           </div>
        )}

        {post.images && post.images.length > 0 && (
           <div className="mt-8 border border-[var(--border-color)] p-1 bg-white/5">
              <img src={post.images[0]} className="w-full max-h-[600px] object-contain" />
           </div>
        )}
     </div>

     {/* Footer */}
     <div className="px-8 py-4 bg-slate-50/50 dark:bg-black/20 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-10">
           <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-rose-500 transition-colors">
              <Heart size={18} /> <span className="ticker-text">{post.likes.toLocaleString()}</span>
           </button>
           <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-500 transition-colors">
              <MessageCircle size={18} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span>
           </button>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter opacity-50 hidden sm:block">SHA_{SHA_GEN()}</span>
           <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Share2 size={16}/></button>
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

  const handlePost = (html: string, poll?: PollData) => {
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
      images: imgs,
      pollData: poll
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
      
      {/* Mobile HUD */}
      <div className="lg:hidden mb-6 px-4">
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[280px]"><NetworkIntensityGraph /></div>
            <div className="min-w-[200px] pro-card p-5">
               <span className="text-[9px] font-black uppercase text-slate-400 block mb-4 tracking-widest">Active Hubs</span>
               <div className="flex flex-wrap gap-3">
                  {['#COCIS', '#CEDAT', '#LAW'].map(t => <span key={t} className="text-[10px] font-black text-slate-500 uppercase">{t}</span>)}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Main Registry Column */}
         <div className="lg:col-span-8 px-0 sm:px-4">
            {!threadId && <RichEditor onPost={handlePost} currentUser={user} />}
            
            {threadId && (
              <div className="mb-10 flex items-center justify-between px-4">
                <button onClick={onBack} className="px-5 py-2 pro-card rounded text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-3">
                   <ArrowLeft size={14}/> Back_to_Registry
                </button>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Signal_Chain_Sequence</h3>
              </div>
            )}

            <div className="space-y-2">
               {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                 <PostItem 
                   key={post.id} 
                   post={post} 
                   currentUser={user} 
                   onOpenThread={onOpenThread} 
                   onNavigateToProfile={onNavigateToProfile}
                   bookmarks={bookmarks}
                   onBookmark={handleBookmark}
                 />
               )) : (
                 <div className="py-40 text-center space-y-6 pro-card border-dashed">
                    <Database size={48} className="mx-auto text-slate-700" />
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Registry_Empty: No signals committed to manifest.</p>
                 </div>
               )}
            </div>
         </div>
         
         {/* Telemetry Sidebar (Right) */}
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-6">
            <NetworkIntensityGraph />
            <Watchlist />
            
            {/* Strata Access */}
            <div className="bg-[#475569] p-8 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-1000"><Globe size={120} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={24} className="text-slate-300"/>
                     <h4 className="text-[16px] font-black uppercase tracking-widest leading-none italic">Elite_Strata</h4>
                  </div>
                  <p className="text-[10px] font-medium opacity-70 uppercase leading-relaxed tracking-tight">
                    Synchronize with high-frequency research nodes. Access unrestricted scholarly assets and prioritized wing indexing.
                  </p>
                  <button className="w-full py-4 bg-white text-slate-800 rounded-[2px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-100 transition-all active:scale-95">Commit_Credentials</button>
               </div>
            </div>

            <div className="p-6 border border-dashed border-slate-700 bg-slate-50 dark:bg-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <Terminal size={14} className="text-slate-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">System_Status</span>
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose italic">
                  "Registry protocol synchronization v4.2 stable. End-to-end signal encryption active for all nodes within the Hillstrata network."
               </p>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;