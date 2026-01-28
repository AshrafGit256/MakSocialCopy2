
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, Comment } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { 
  Star, MessageCircle, Zap, Radio, Activity, Globe, 
  TrendingUp, Terminal, Share2, Bookmark, 
  BarChart3, MoreHorizontal, ShieldCheck, 
  Database, ArrowLeft, GitCommit, GitFork, Box, Link as LinkIcon,
  Video as VideoIcon, Send, MessageSquare, ExternalLink, Calendar, MapPin, Hash,
  Maximize2, Volume2, Play, Pause, X, ChevronRight, Cpu, Target, Circle
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const NewsBulletin: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = "https://github.com/AshrafGit256/MakSocialImages/raw/main/Public/journalism2.mp4";

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden mb-8 group relative shadow-2xl transition-all hover:scale-[1.02]">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1 bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE_SATELLITE
          </div>
        </div>
        
        <div className="aspect-video relative bg-black">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={togglePlay} className="p-5 bg-white/10 backdrop-blur-3xl rounded-full text-white hover:bg-white/30 transition-all border border-white/20">
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
            </button>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-2 bg-black/40 backdrop-blur-md text-white rounded-xl hover:bg-indigo-600 transition-all"
              title="Expand Feed"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-5 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
          <h4 className="text-[12px] font-black text-white uppercase tracking-tighter italic">Hill_Intel / Central Command</h4>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Active: Real-time Strata Synchronization</p>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-black/98 backdrop-blur-2xl animate-in fade-in">
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all"
            >
              <X size={28} />
            </button>
            <video 
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
            <div className="absolute bottom-12 left-12 space-y-3 pointer-events-none">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Hill_Broadcasting / v4.2</h2>
              <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Node: Main_Registry_Wing // LIVE_UPLINK</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarModule: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] overflow-hidden shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-700">
    <div className="px-6 py-4 border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">{title}</h4>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const NetworkIntensityGraph: React.FC = () => {
  return (
    <SidebarModule title="Pulse_Intensity" icon={<Activity size={14} />}>
       <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black italic tracking-tighter ticker-text text-slate-800 dark:text-slate-100">89.4</span>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1">
                         <TrendingUp size={12} /> BULLISH
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Sys_Status: STABLE</span>
                   </div>
                </div>
             </div>
             <div className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-600/30 flex items-center justify-center relative">
                <Cpu size={24} className="text-indigo-600 animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-indigo-600/10 animate-ping"></div>
             </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
             <div className="h-full bg-indigo-600 w-[89.4%] shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000"></div>
          </div>
       </div>
    </SidebarModule>
  );
};

const TrendingHashtags: React.FC<{ posts: Post[], onTagClick?: (tag: string) => void }> = ({ posts, onTagClick }) => {
  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      (p.hashtags || []).forEach(tag => {
        const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
        counts[cleanTag] = (counts[cleanTag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [posts]);

  return (
    <SidebarModule title="Registry_Signals" icon={<Hash size={14} />}>
       <div className="space-y-1">
          {topTags.length > 0 ? topTags.map(([tag, count], i) => (
            <button 
              key={i} 
              onClick={() => onTagClick?.(tag)}
              className="w-full flex justify-between items-center group hover:bg-white dark:hover:bg-white/5 p-3 rounded-2xl transition-all border border-transparent hover:border-[var(--border-color)]"
            >
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(79,70,229,0.3)]"></div>
                  <span className="text-[13px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight">#{tag.replace('#','')}</span>
               </div>
               <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{count} COMMITS</span>
            </button>
          )) : (
            <div className="text-center py-6 opacity-30">
               <Database size={32} className="mx-auto mb-2"/>
               <p className="text-[9px] font-bold uppercase tracking-widest italic">Awaiting Signals...</p>
            </div>
          )}
       </div>
    </SidebarModule>
  );
};

const SectorWatch: React.FC = () => (
  <SidebarModule title="Strata_Watch" icon={<Target size={14} />}>
     <div className="space-y-4">
        {[
          { t: '#COCIS', v: '+14.2%', trend: 'up' }, 
          { t: '#CEDAT', v: '-1.8%', trend: 'down' }, 
          { t: '#LAW', v: '+38.5%', trend: 'up' }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center group bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all">
             <span className="text-[12px] font-black uppercase text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{item.t}_WING</span>
             <div className="flex items-center gap-3">
                <div className={`w-1 h-5 rounded-full ${item.trend === 'up' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></div>
                <span className={`text-[12px] font-mono font-black ticker-text ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{item.v}</span>
             </div>
          </div>
        ))}
     </div>
  </SidebarModule>
);

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block align-text-bottom text-slate-500 ml-1">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill="currentColor"/>
    </svg>
  );
};

const PostItem: React.FC<{ 
  post: Post, 
  currentUser: User, 
  onOpenThread: (id: string) => void, 
  onNavigateToProfile: (id: string) => void, 
  bookmarks: string[], 
  onBookmark: (id: string) => void, 
  onUpdate: () => void,
  isThreadView?: boolean,
  isLiked?: boolean,
  onLike: (id: string) => void
}> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark, onUpdate, isThreadView = false, isLiked = false, onLike }) => {
  const [newComment, setNewComment] = useState('');
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: newComment,
      timestamp: 'Just now'
    };
    db.addComment(post.id, comment);
    setNewComment('');
    onUpdate();
  };

  return (
    <article 
      onClick={() => !isThreadView && onOpenThread(post.id)}
      className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden transition-all shadow-sm group ${!isThreadView ? 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 mb-12' : 'mb-14'}`}
    >
      <div className="flex">
          <div className="w-16 sm:w-20 pt-8 flex flex-col items-center border-r border-[var(--border-color)] bg-slate-50/30 dark:bg-white/5 shrink-0">
            <img 
                src={post.authorAvatar} 
                onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-[var(--border-color)] bg-white object-cover cursor-pointer transition-all hover:scale-110" 
            />
            <div className="mt-6 flex flex-col items-center gap-4 flex-1 h-full">
                <div className="w-px flex-1 bg-gradient-to-b from-[var(--border-color)] via-[var(--border-color)] to-transparent opacity-40"></div>
                <GitCommit size={14} className="text-slate-300 mb-8" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }}
                    className="flex flex-col cursor-pointer group/name"
                  >
                    <div className="flex items-center">
                      <span className="text-[14px] font-black text-slate-800 dark:text-slate-200 group-hover/name:underline uppercase tracking-tight">{post.author}</span>
                      <AuthoritySeal role={post.authorAuthority} size={14} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1.5">{post.authorRole || 'Contributor'}</span>
                  </div>
                  {post.isAd && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[7px] font-black uppercase tracking-widest">AD</span>
                  )}
                  <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
                  <span className="hidden sm:inline px-2 py-0.5 bg-slate-500/10 rounded text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">{post.college} HUB</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">{post.timestamp}</span>
                  <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all ${bookmarks.includes(post.id) ? 'text-orange-500' : 'text-slate-400'}`}>
                      <Bookmark size={18} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} />
                  </button>
                </div>
            </div>

            <div className="p-8">
                {post.isEventBroadcast && (
                   <div className="mb-10 rounded-3xl border border-slate-500/20 overflow-hidden bg-slate-500/5 shadow-inner">
                      <div className="h-56 relative overflow-hidden">
                         <img src={post.eventFlyer} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
                         <div className="absolute top-6 right-6 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl">Signal_Transmission</div>
                      </div>
                      <div className="p-8 space-y-4">
                         <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-700 dark:text-slate-300 leading-tight italic">{post.eventTitle}</h3>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tighter"><Calendar size={14} className="text-indigo-600"/> {post.eventDate}</div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tighter"><MapPin size={14} className="text-rose-600"/> {post.eventLocation}</div>
                         </div>
                      </div>
                   </div>
                )}

                <div className="text-[16px] leading-relaxed font-sans text-[var(--text-primary)] post-content-markdown mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {post.video && (
                  <div className="mb-6 rounded-[2rem] overflow-hidden border border-[var(--border-color)] bg-black shadow-xl aspect-video group/video relative">
                    <video src={post.video} controls className="w-full h-full object-contain" />
                    {post.isAd && (
                       <div className="absolute top-4 left-4 z-10 pointer-events-none">
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded border border-white/10">Partnered Intelligence</span>
                       </div>
                    )}
                  </div>
                )}

                {post.pollData && (
                  <div className="my-10 space-y-4 bg-[var(--bg-primary)] border border-[var(--border-color)] p-8 rounded-[2rem] shadow-inner">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-6 flex items-center gap-3 tracking-[0.4em]"><BarChart3 size={16} className="text-indigo-600"/> NETWORK_CENSUS_v1.0</p>
                      {post.pollData.options.map(opt => {
                        const percentage = post.pollData?.totalVotes ? Math.round((opt.votes / post.pollData.totalVotes) * 100) : 0;
                        return (
                            <div key={opt.id} className="relative h-12 border border-[var(--border-color)] rounded-2xl overflow-hidden flex items-center px-6 group/opt cursor-pointer hover:border-slate-500 transition-all mb-3">
                              <div className="absolute inset-y-0 left-0 bg-indigo-600/10 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                              <span className="relative z-10 text-[12px] font-bold flex-1 uppercase tracking-tight">{opt.text}</span>
                              <span className="relative z-10 text-[11px] font-black text-slate-500 ticker-text">{percentage}%</span>
                            </div>
                        );
                      })}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                   {(post.hashtags || []).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-indigo-600/5 text-indigo-600 border border-indigo-600/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">#{tag.replace('#', '')}</span>
                   ))}
                </div>
            </div>

            <div className="px-8 py-5 border-t border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-10">
                  <button onClick={handleLike} className={`flex items-center gap-2 text-[12px] font-black uppercase transition-all ${isLiked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}>
                      <Star size={18} fill={isLiked ? "currentColor" : "none"} /> <span className="ticker-text">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); !isThreadView && onOpenThread(post.id); }} className="flex items-center gap-2 text-[12px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all">
                      <MessageCircle size={18} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span>
                  </button>
                  <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                    <GitFork size={16}/> {Math.floor(post.likes / 4)}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono">
                      <Terminal size={12}/> {SHA_GEN()}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18}/></button>
                </div>
            </div>
          </div>
      </div>

      {isThreadView && (
        <div className="border-t border-[var(--border-color)] bg-slate-50/20 dark:bg-white/2">
          <div className="px-8 py-4 bg-slate-100/50 dark:bg-white/5 border-b border-[var(--border-color)] flex items-center gap-3">
             <MessageSquare size={16} className="text-slate-400" />
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Node_Trace / Commits Archive</span>
          </div>

          <div className="space-y-0 relative">
             {post.comments && post.comments.length > 0 ? (
               <div className="divide-y divide-[var(--border-color)]">
                  {post.comments.map((comment, idx) => (
                    <div key={comment.id} className="flex gap-6 p-8 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                        <div className="w-12 shrink-0 flex flex-col items-center">
                           <img src={comment.authorAvatar} className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white object-cover shadow-sm" />
                           {idx !== post.comments.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-4 opacity-50"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{comment.author}</span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">{comment.timestamp}</span>
                           </div>
                           <p className="text-[14px] font-medium text-[var(--text-primary)] leading-relaxed italic opacity-80">"{comment.text}"</p>
                        </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-20 text-center space-y-4 opacity-20">
                  <MessageSquare size={48} className="mx-auto text-slate-500" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Manifest_Empty: Awaiting Peer Commit</p>
               </div>
             )}

             <div className="p-8 border-t border-[var(--border-color)] bg-white/40 dark:bg-white/2 backdrop-blur-xl">
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-indigo-600 rounded text-white shadow-lg"><GitCommit size={14} /></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Initialize Peer Contribution...</span>
                   </div>
                   <textarea 
                     value={newComment}
                     onChange={e => setNewComment(e.target.value)}
                     placeholder="Broadcast your insight, peer review, or technical feedback..."
                     className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-6 text-[14px] font-medium min-h-[160px] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                   />
                   <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={!newComment.trim()}
                        className="px-10 py-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-30 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-2xl active:scale-95"
                      >
                         Push Commit <Send size={14}/>
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </article>
  );
};

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void, triggerSafetyError: (msg: string) => void, onHashtagClick?: (tag: string) => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack, triggerSafetyError, onHashtagClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [bookmarks, setBookmarks] = useState<string[]>(db.getBookmarks());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  useEffect(() => {
    const sync = () => { 
      setPosts(db.getPosts()); 
      setUser(db.getUser()); 
      setBookmarks(db.getBookmarks()); 
    };
    sync();
    const interval = setInterval(sync, 10000);
    return () => clearInterval(interval);
  }, [updateTrigger, collegeFilter, threadId]);

  const handlePost = (html: string, poll?: PollData) => {
    const hashtagRegex = /#(\w+)/g;
    const foundTags = html.match(hashtagRegex) || [];

    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      authorRole: user.role,
      authorAvatar: user.avatar,
      timestamp: 'Just now',
      content: html,
      hashtags: foundTags,
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 1,
      flags: [],
      isOpportunity: false,
      college: collegeFilter === 'Global' ? user.college : collegeFilter,
      pollData: poll
    };
    db.addPost(newPost);
    setUpdateTrigger(prev => prev + 1);
  };

  const handleLike = (id: string) => {
    if (!likedPosts.has(id)) {
      db.likePost(id);
      setLikedPosts(new Set([...likedPosts, id]));
      setUpdateTrigger(prev => prev + 1);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (threadId) return p.id === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1600px] mx-auto pb-40 lg:px-12 py-8 bg-[var(--bg-primary)] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 px-0 sm:px-4">
            {!threadId && <RichEditor onPost={handlePost} currentUser={user} />}
            
            {threadId && (
              <div className="mb-12 flex items-center justify-between px-6">
                <button onClick={onBack} className="px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all flex items-center gap-4 shadow-sm active:scale-95">
                   <ArrowLeft size={16}/> Back to Pulse
                </button>
                <div className="flex items-center gap-4">
                   <GitCommit size={20} className="text-slate-400 animate-pulse" />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Signal_Isolation_Active</h3>
                </div>
              </div>
            )}

            <div className="mb-14 px-6 flex items-center gap-6">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent"></div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
                  {threadId ? 'Branch Manifest' : collegeFilter === 'Global' ? 'Universal Pulse Stream' : `${collegeFilter} Wing Hub`}
               </span>
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent"></div>
            </div>

            <div className="space-y-0">
               {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                 <PostItem 
                   key={post.id} 
                   post={post} 
                   currentUser={user} 
                   onOpenThread={onOpenThread} 
                   onNavigateToProfile={onNavigateToProfile}
                   bookmarks={bookmarks}
                   onBookmark={(id) => setBookmarks(db.toggleBookmark(id))}
                   onUpdate={() => setUpdateTrigger(prev => prev + 1)}
                   isThreadView={!!threadId}
                   isLiked={likedPosts.has(post.id)}
                   onLike={handleLike}
                 />
               )) : (
                 <div className="py-60 text-center space-y-8 bg-slate-50/50 dark:bg-white/2 border-4 border-dashed border-[var(--border-color)] rounded-[4rem]">
                    <Database size={64} className="mx-auto text-slate-300 opacity-40 animate-bounce" />
                    <div className="space-y-2">
                       <p className="text-[18px] font-black uppercase tracking-widest text-slate-500 italic">Registry_Empty</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-400">No signals currently indexed in this stratum.</p>
                    </div>
                 </div>
               )}
            </div>
         </div>
         
         <aside className="hidden lg:flex lg:col-span-4 flex-col gap-10 sticky top-28 h-fit pb-20 overflow-y-auto no-scrollbar max-h-[calc(100vh-140px)]">
            <NewsBulletin />
            <NetworkIntensityGraph />
            <TrendingHashtags posts={posts} onTagClick={onHashtagClick} />
            <SectorWatch />
            
            <div className="bg-slate-900 dark:bg-black p-10 text-white relative overflow-hidden group border border-slate-800 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-[2s] rotate-12"><Globe size={240} fill="white"/></div>
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-5">
                     <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.5)]"><ShieldCheck size={32} className="text-white"/></div>
                     <h4 className="text-2xl font-black uppercase tracking-widest italic text-slate-100 leading-none">Tier: Registry Elite</h4>
                  </div>
                  <p className="text-[12px] font-medium opacity-60 uppercase leading-relaxed tracking-tighter max-w-[280px]">
                    Unrestricted access to research strata, global asset tracking, and prioritized node indexing. Join the upper manifest.
                  </p>
                  <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/30 group/btn">
                    Authorize Upgrade <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform"/>
                  </button>
               </div>
               <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full"></div>
            </div>

            <div className="px-8 space-y-6">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Network Integrity</span>
                 <span className="text-[10px] font-black text-indigo-500 tracking-tighter">99.98% / OPTIMAL</span>
              </div>
              <div className="flex gap-2 h-1.5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`h-full flex-1 rounded-full ${i < 11 ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                ))}
              </div>
              <div className="flex items-center justify-between py-4 border-t border-[var(--border-color)] opacity-40">
                 <p className="text-[8px] font-black uppercase tracking-widest italic">Hill_Link Protocol v4.2 Stable</p>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
