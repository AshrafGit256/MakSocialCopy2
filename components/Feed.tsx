
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
  Maximize2, Volume2, Play, Pause, X, LayoutGrid, Image as ImageIcon
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
      <div className="bg-slate-900 border border-slate-700 rounded-[var(--radius-main)] overflow-hidden mb-6 group relative shadow-2xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          <div className="px-2 py-1 bg-rose-600 text-white text-[7px] font-black uppercase tracking-widest rounded shadow-lg animate-pulse flex items-center gap-1">
             <div className="w-1 h-1 bg-white rounded-full"></div> LIVE_BULLETIN
          </div>
        </div>
        
        <div className="aspect-video relative bg-black">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={togglePlay} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-1.5 bg-black/40 backdrop-blur-md text-white rounded hover:bg-indigo-600 transition-all"
              title="Expand Scan"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-white/5">
          <h4 className="text-[10px] font-black text-white uppercase tracking-tighter italic">Hill_Daily_Digest / Intelligence Sync</h4>
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Summarizing Campus Strata Activity</p>
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-lg animate-in fade-in">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[var(--radius-main)] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-600/20">
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <video 
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
            <div className="absolute bottom-10 left-10 space-y-2 pointer-events-none">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Protocol_Journalism / Expanded</h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Node: Central_Journalism_Wing // {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NetworkIntensityGraph: React.FC = () => {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 mb-4 relative overflow-hidden group rounded-[var(--radius-main)] shadow-sm">
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
          </div>
       </div>
    </div>
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
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-5 mb-4 shadow-sm">
       <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Hash size={12} className="text-slate-400" /> Hot_Signals
       </h4>
       <div className="space-y-4">
          {topTags.length > 0 ? topTags.map(([tag, count], i) => (
            <div 
              key={i} 
              onClick={() => onTagClick?.(tag)}
              className="flex justify-between items-center group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded transition-all border border-transparent hover:border-indigo-500/20"
            >
               <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-tight group-hover:underline">#{tag.replace('#','')}</span>
               <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{count} COMMITS</span>
            </div>
          )) : (
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">No signals indexed...</p>
          )}
       </div>
    </div>
  );
};

const Watchlist: React.FC = () => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-5 shadow-sm">
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
      className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden transition-all shadow-sm group ${!isThreadView ? 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 mb-12' : 'mb-14'}`}
    >
      <div className="flex">
          {/* Identity Rail */}
          <div className="w-16 sm:w-20 pt-6 flex flex-col items-center border-r border-[var(--border-color)] bg-slate-50/30 dark:bg-black/10 shrink-0">
            <img 
                src={post.authorAvatar} 
                onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border-color)] bg-white object-cover cursor-pointer transition-all" 
            />
            <div className="mt-4 flex flex-col items-center gap-3 flex-1 h-full">
                <div className="w-px flex-1 bg-gradient-to-b from-[var(--border-color)] via-[var(--border-color)] to-transparent"></div>
                <GitCommit size={14} className="text-slate-300 mb-6" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Post Header */}
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }}
                    className="flex flex-col cursor-pointer group/name"
                  >
                    <div className="flex items-center">
                      <span className="text-[14px] font-black text-slate-800 dark:text-slate-200 group-hover/name:underline uppercase tracking-tight">{post.author}</span>
                      <AuthoritySeal role={post.authorAuthority} size={14} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">{post.authorRole || 'Member'}</span>
                  </div>
                  <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
                  <span className="hidden sm:inline px-1.5 py-0.5 border border-slate-500/20 bg-slate-500/5 rounded-sm text-[8px] font-black uppercase text-slate-500 tracking-widest">{post.college} HUB</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{post.timestamp}</span>
                  <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded ${bookmarks.includes(post.id) ? 'text-orange-500' : 'text-slate-400'}`}>
                      <Bookmark size={16} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} />
                  </button>
                </div>
            </div>

            <div className="p-6">
                {post.isEventBroadcast && (
                   <div className="mb-8 rounded-[4px] border border-slate-500/20 overflow-hidden bg-slate-500/5">
                      <div className="h-48 relative overflow-hidden border-b border-slate-500/20">
                         <img src={post.eventFlyer} className="w-full h-full object-cover transition-all duration-700" />
                         <div className="absolute top-4 right-4 px-2 py-1 bg-slate-800 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-xl">Event_Broadcasting</div>
                      </div>
                      <div className="p-6 space-y-3">
                         <h3 className="text-xl font-black uppercase tracking-tighter text-slate-700 dark:text-slate-300 leading-tight">{post.eventTitle}</h3>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter"><Calendar size={12}/> {post.eventDate}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter"><MapPin size={12}/> {post.eventLocation}</div>
                         </div>
                      </div>
                   </div>
                )}

                <div className="text-[15px] leading-relaxed font-mono text-[var(--text-primary)] post-content-markdown mb-6" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {/* POST IMAGE GRID - GitHub Like Vibe */}
                {post.images && post.images.length > 0 && (
                  <div className={`mb-6 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {post.images.map((img, i) => (
                      <div key={i} className="group/img relative rounded-[4px] border border-[var(--border-color)] overflow-hidden bg-[var(--bg-primary)] aspect-video">
                        <img 
                          src={img} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 grayscale-[10%] group-hover/img:grayscale-0" 
                          alt={`Asset ${i}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors pointer-events-none"></div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[7px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            <ImageIcon size={10}/> VIEW_ASSET
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {post.pollData && (
                  <div className="my-8 space-y-3 bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 rounded-[var(--radius-main)] shadow-inner">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-4 flex items-center gap-2 tracking-widest"><BarChart3 size={12}/> ACTIVE_NODE_CENSUS</p>
                      {post.pollData.options.map(opt => {
                        const percentage = post.pollData?.totalVotes ? Math.round((opt.votes / post.pollData.totalVotes) * 100) : 0;
                        return (
                            <div key={opt.id} className="relative h-10 border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden flex items-center px-4 group/opt cursor-pointer hover:border-slate-500 transition-all mb-2">
                              <div className="absolute inset-y-0 left-0 bg-slate-500/10 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                              <span className="relative z-10 text-[11px] font-bold flex-1">{opt.text}</span>
                              <span className="relative z-10 text-[10px] font-black text-slate-400">{percentage}%</span>
                            </div>
                        );
                      })}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                   {(post.hashtags || []).map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-indigo-500 hover:underline cursor-pointer tracking-wider">#{tag.replace('#', '')}</span>
                   ))}
                </div>
            </div>

            {/* Post Interaction Footer */}
            <div className="px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
                <div className="flex items-center gap-8">
                  <button onClick={handleLike} className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isLiked ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}>
                      <Star size={16} fill={isLiked ? "currentColor" : "none"} /> <span className="ticker-text">{post.likes.toLocaleString()} Stars</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); !isThreadView && onOpenThread(post.id); }} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <MessageCircle size={16} /> <span className="ticker-text">{post.commentsCount.toLocaleString()} Commits</span>
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <GitFork size={14}/> {Math.floor(post.likes / 4)} Forks
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-2 px-2 py-0.5 bg-slate-500/10 text-slate-500 border border-slate-500/20 rounded-[2px] text-[8px] font-black uppercase tracking-widest">
                      <Terminal size={10}/> SHA_{SHA_GEN().slice(0,6)}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><ExternalLink size={16}/></button>
                </div>
            </div>
          </div>
      </div>

      {isThreadView && (
        <div className="border-t border-[var(--border-color)] bg-slate-50/20 dark:bg-black/10">
          <div className="px-6 py-3 bg-slate-100 dark:bg-white/5 border-b border-[var(--border-color)] flex items-center gap-2">
             <MessageSquare size={12} className="text-slate-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Signal_Deep_Scan / Manifest History</span>
          </div>

          <div className="space-y-0 relative">
             {post.comments && post.comments.length > 0 ? (
               <div className="divide-y divide-[var(--border-color)]">
                  {post.comments.map((comment, idx) => (
                    <div key={comment.id} className="flex gap-4 p-6 hover:bg-slate-100/30 dark:hover:bg-white/5 transition-colors">
                        <div className="w-10 shrink-0 flex flex-col items-center">
                           <img src={comment.authorAvatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-white object-cover" />
                           {idx !== post.comments.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-2"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{comment.author}</span>
                              <span className="text-[9px] font-mono text-slate-400">{comment.timestamp}</span>
                           </div>
                           <p className="text-[13px] font-medium text-[var(--text-primary)] leading-relaxed italic">"{comment.text}"</p>
                        </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-12 text-center space-y-2 opacity-40">
                  <MessageSquare size={32} className="mx-auto text-slate-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No peer comments detected in current branch.</p>
               </div>
             )}

             <div className="p-6 border-t border-[var(--border-color)] bg-white/50 dark:bg-black/30">
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                   <div className="flex items-center gap-2">
                      <GitCommit size={14} className="text-slate-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Append contribution to node branch...</span>
                   </div>
                   <textarea 
                     value={newComment}
                     onChange={e => setNewComment(e.target.value)}
                     placeholder="Type your peer contribution (feedback, report, or inquiry)..."
                     className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md p-4 text-[13px] font-medium min-h-[120px] focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400"
                   />
                   <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={!newComment.trim()}
                        className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-30 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-md"
                      >
                         Submit Commit <Send size={12}/>
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
    <div className="max-w-[1440px] mx-auto pb-40 lg:px-12 py-6 bg-[var(--bg-primary)] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 px-0 sm:px-4">
            {!threadId && <RichEditor onPost={handlePost} currentUser={user} />}
            
            {threadId && (
              <div className="mb-10 flex items-center justify-between px-4">
                <button onClick={onBack} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-3">
                   <ArrowLeft size={14}/> Back to Pulse
                </button>
                <div className="flex items-center gap-3">
                   <GitCommit size={14} className="text-slate-500 animate-pulse" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Signal_Deep_Scan_Active</h3>
                </div>
              </div>
            )}

            <div className="mb-12 px-4 flex items-center gap-4">
               <div className="h-px flex-1 bg-[var(--border-color)]"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  {threadId ? 'Branch Manifest' : collegeFilter === 'Global' ? 'Universal Pulse Stream' : `${collegeFilter} Wing Manifest`}
               </span>
               <div className="h-px flex-1 bg-[var(--border-color)]"></div>
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
                 <div className="py-40 text-center space-y-6 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)]">
                    <Database size={48} className="mx-auto text-slate-400" />
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Registry_Empty: No signals committed to this manifest.</p>
                 </div>
               )}
            </div>
         </div>
         
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-6">
            <NewsBulletin />
            <NetworkIntensityGraph />
            <TrendingHashtags posts={posts} onTagClick={onHashtagClick} />
            <Watchlist />
            
            <div className="bg-slate-900 dark:bg-black p-8 text-white relative overflow-hidden group border border-slate-800 rounded-[var(--radius-main)] shadow-xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-1000"><Globe size={120} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={24} className="text-slate-400"/>
                     <h4 className="text-[16px] font-black uppercase tracking-widest leading-none italic text-slate-100">Registry Elite</h4>
                  </div>
                  <p className="text-[10px] font-medium opacity-60 uppercase leading-relaxed tracking-tight">
                    Synchronize with high-frequency research nodes. Access unrestricted scholarly assets and prioritized wing indexing.
                  </p>
                  <button className="w-full py-3 bg-slate-100 text-slate-900 rounded-[var(--radius-main)] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95">Commit_Credentials</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
