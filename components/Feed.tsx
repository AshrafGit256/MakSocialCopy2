import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, Comment, CalendarEvent } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import { 
  Star, MessageCircle, Zap, Activity, Globe, 
  Terminal, Share2, Bookmark, 
  BadgeCheck, ArrowLeft, GitCommit,
  Calendar, MapPin, X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowUp, Send
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

// --- TOAST COMPONENT ---
interface ToastMsg {
  id: string;
  type: 'success' | 'error' | 'warning';
  text: string;
}

const Toast: React.FC<{ toast: ToastMsg; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const config = {
    success: { icon: <CheckCircle2 size={24} className="text-[#10b981]" fill="#d1fae5" />, border: 'border-[#e2e8f0]', iconBg: '' },
    error: { icon: <X size={18} className="text-white" />, iconBg: 'bg-[#ef4444]', border: 'border-[#e2e8f0]' },
    warning: { icon: <AlertCircle size={24} className="text-[#f59e0b]" />, border: 'border-[#e2e8f0]', iconBg: '' }
  };

  const c = config[toast.type];

  return (
    <div className={`flex items-start gap-4 p-4 bg-white dark:bg-white/[0.02] border ${c.border} rounded-none shadow-lg min-w-[320px] max-w-[450px] animate-in slide-in-from-right-4 duration-300 font-mono`}>
       <div className="shrink-0 pt-0.5">
          {toast.type === 'error' ? (
            <div className={`${c.iconBg} rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-black shadow-sm`}>
               {c.icon}
            </div>
          ) : c.icon}
       </div>
       <p className="text-[13px] font-black text-slate-600 dark:text-slate-400 leading-tight pr-4">
          {toast.text}
       </p>
       <button onClick={() => onDismiss(toast.id)} className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"><X size={12}/></button>
    </div>
  );
};

// --- LIGHTBOX COMPONENT ---
const Lightbox: React.FC<{ images: string[], initialIndex: number, onClose: () => void }> = ({ images, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); };
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); };
  return (
    <div className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-rose-600 text-white rounded-full transition-all z-[5001] shadow-2xl"><X size={24} /></button>
      {images.length > 1 && (
        <><button onClick={prev} className="absolute left-6 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all z-[5001] backdrop-blur-md"><ChevronLeft size={32} /></button>
          <button onClick={next} className="absolute right-6 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all z-[5001] backdrop-blur-md"><ChevronRight size={32} /></button></>
      )}
      <div className="relative w-full h-full p-4 flex flex-col items-center justify-center pointer-events-none">
        <img src={images[index]} className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl rounded-none pointer-events-auto transition-transform duration-300" alt="Expanded view" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
};

// --- IMAGE GRID ---
const PostImageGrid: React.FC<{ images: string[] }> = ({ images }) => {
  const [lightbox, setLightbox] = useState<{ open: boolean, index: number }>({ open: false, index: 0 });
  if (!images || images.length === 0) return null;
  const count = images.length;
  const renderGrid = () => {
    switch (count) {
      case 1: return (<div className="w-full rounded-none overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]"><img src={images[0]} className="w-full h-auto max-h-[700px] object-cover cursor-pointer hover:brightness-95 transition-all" onClick={() => setLightbox({ open: true, index: 0 })} /></div>);
      case 2: return (<div className="grid grid-cols-2 gap-0.5 rounded-none overflow-hidden border border-[var(--border-color)] aspect-[16/9] sm:aspect-[2/1]">{images.map((img, i) => (<img key={i} src={img} className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all border-r border-[var(--border-color)] last:border-r-0" onClick={() => setLightbox({ open: true, index: i })} />))}</div>);
      default: return (<div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-none overflow-hidden border border-[var(--border-color)] aspect-[16/9]">{images.slice(0, 4).map((img, i) => (<div key={i} className="relative w-full h-full overflow-hidden group"><img src={img} className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all border-r border-b border-[var(--border-color)]" onClick={() => setLightbox({ open: true, index: i })} />{i === 3 && count > 4 && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer group-hover:bg-black/40 transition-all" onClick={() => setLightbox({ open: true, index: 3 })}><span className="text-3xl font-black text-white drop-shadow-lg">+{count - 4}</span></div>)}</div>))}</div>);
    }
  };
  return (<div className="my-5 select-none">{renderGrid()}{lightbox.open && (<Lightbox images={images} initialIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />)}</div>);
};

export const AuthoritySeal: React.FC<{ role?: string, size?: number, verified?: boolean }> = ({ role, size = 16, verified = true }) => (<div className="inline-flex items-center ml-1 text-[var(--brand-color)]" title={role ? `Verified ${role}` : 'Verified Node'}><BadgeCheck size={size} fill="currentColor" stroke="white" strokeWidth={1.5} /></div>);

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, bookmarks: string[], onBookmark: (id: string) => void, onUpdate: () => void, isThreadView?: boolean, isLiked?: boolean, onLike: (id: string) => void, onAddToast: (type: ToastMsg['type'], text: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark, onUpdate, isThreadView = false, isLiked = false, onLike, onAddToast }) => {
  const [newComment, setNewComment] = useState('');
  
  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventData: CalendarEvent = {
      id: `ev-post-${post.id}-${Date.now()}`,
      title: post.isEventBroadcast ? (post.eventTitle || 'University Protocol') : `Signal Ref: ${post.author}`,
      description: post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...',
      date: post.eventDate || new Date().toISOString().split('T')[0],
      time: post.eventTime || '09:00',
      location: post.eventLocation || 'Universal Wing',
      category: 'Academic',
      createdBy: post.authorId,
      attendeeIds: [currentUser.id]
    };
    db.saveCalendarEvent(eventData);
    onAddToast('success', "Signal logged to personal roadmap registry.");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    db.addComment(post.id, { id: `c-${Date.now()}`, author: currentUser.name, authorAvatar: currentUser.avatar, text: newComment, timestamp: 'Just now' });
    setNewComment('');
    onUpdate();
  };

  return (
    <article onClick={() => !isThreadView && onOpenThread(post.id)} className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none overflow-hidden transition-all shadow-sm group ${!isThreadView ? 'cursor-pointer hover:border-slate-400 mb-12' : 'mb-14'}`}>
      <div className="flex">
          <div className="w-16 sm:w-20 pt-6 flex flex-col items-center border-r border-[var(--border-color)] bg-slate-50/30 dark:bg-black/10 shrink-0">
            <img src={post.authorAvatar} onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border-color)] bg-white object-cover cursor-pointer transition-all hover:scale-105" />
            <div className="mt-4 flex flex-col items-center gap-3 flex-1 h-full"><div className="w-px flex-1 bg-gradient-to-b from-[var(--border-color)] via-[var(--border-color)] to-transparent"></div><GitCommit size={14} className="text-slate-300 mb-6" /></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} className="flex flex-col cursor-pointer group/name">
                    <div className="flex items-center"><span className="text-[14px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{post.author}</span><AuthoritySeal role={post.authorAuthority} size={15} /></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">{post.authorRole || 'Verified Node'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{post.timestamp}</span>
                  <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-1 rounded transition-all ${bookmarks.includes(post.id) ? 'text-orange-500 scale-110' : 'text-slate-400'}`}><Bookmark size={16} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} /></button>
                </div>
            </div>
            <div className="p-6">
                <div className="text-[15px] leading-relaxed font-mono text-[var(--text-primary)] post-content-markdown mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.images && post.images.length > 0 && <PostImageGrid images={post.images} />}
                <div className="flex flex-wrap gap-2 mt-4">{(post.hashtags || []).map(tag => (<span key={tag} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">#{tag.replace('#', '')}</span>))}</div>
            </div>
            <div className="px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
                <div className="flex items-center gap-8">
                  <button onClick={(e) => { e.stopPropagation(); onLike(post.id); }} className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isLiked ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}><Star size={18} fill={isLiked ? "currentColor" : "none"} /> <span className="ticker-text">{post.likes.toLocaleString()}</span></button>
                  <button onClick={(e) => { e.stopPropagation(); !isThreadView && onOpenThread(post.id); }} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"><MessageCircle size={18} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span></button>
                  <button onClick={handleAddToCalendar} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[var(--brand-color)] transition-all active:scale-110" title="Add to Registry Roadmap"><Calendar size={18} /> <span className="hidden sm:inline uppercase tracking-widest text-[8px]">Sync roadmap</span></button>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-2 py-0.5 bg-slate-500/10 text-slate-500 border border-slate-500/20 rounded-[2px] text-[8px] font-black uppercase tracking-widest"><Terminal size={10}/> SHA_{SHA_GEN().slice(0,6)}</div>
            </div>
          </div>
      </div>
      {isThreadView && (
        <div className="border-t border-[var(--border-color)] bg-slate-50/20 dark:bg-black/10">
           <div className="divide-y divide-[var(--border-color)]">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-6 hover:bg-slate-100/30 transition-colors">
                    <img src={comment.authorAvatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-white object-cover" />
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1"><span className="text-[12px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{comment.author}</span><span className="text-[9px] font-mono text-slate-400">{comment.timestamp}</span></div>
                       <p className="text-[13px] font-medium text-[var(--text-primary)] leading-relaxed">"{comment.text}"</p>
                    </div>
                </div>
              ))}
           </div>
           <div className="p-6 border-t border-[var(--border-color)] bg-white/50">
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                 <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type contribution..." className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-none p-4 text-[13px] font-medium min-h-[100px] outline-none transition-all" />
                 <div className="flex justify-end"><button type="submit" disabled={!newComment.trim()} className="px-6 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md">Submit Commit <Send size={12}/></button></div>
              </form>
           </div>
        </div>
      )}
    </article>
  );
};

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void, triggerSafetyError: (msg: string) => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack, triggerSafetyError }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [bookmarks, setBookmarks] = useState<string[]>(db.getBookmarks());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newPostsAvailable, setNewPostsAvailable] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  
  const lastKnownPostCount = useRef(0);

  useEffect(() => {
    const sync = () => { 
      const currentPosts = db.getPosts();
      const filteredCurrent = currentPosts.filter(p => !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter));
      
      if (lastKnownPostCount.current > 0 && filteredCurrent.length > lastKnownPostCount.current && !threadId) {
        setNewPostsAvailable(filteredCurrent.length - lastKnownPostCount.current);
      }
      
      if (lastKnownPostCount.current === 0 || updateTrigger > 0) {
        setPosts(currentPosts);
        lastKnownPostCount.current = filteredCurrent.length;
        setNewPostsAvailable(0);
      }
      
      setUser(db.getUser()); 
      setBookmarks(db.getBookmarks()); 
    };

    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, [updateTrigger, collegeFilter, threadId]);

  const refreshFeed = () => {
    const currentPosts = db.getPosts();
    const filteredCurrent = currentPosts.filter(p => !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter));
    setPosts(currentPosts);
    lastKnownPostCount.current = filteredCurrent.length;
    setNewPostsAvailable(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (type: ToastMsg['type'], text: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const handlePost = async (html: string, poll?: PollData) => {
    const imgRegex = /<img[^+]+src="([^">]+)"/g;
    const foundImages: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) foundImages.push(match[1]);

    const hashtagRegex = /#(\w+)/g;
    const foundTags = html.match(hashtagRegex) || [];
    const cleanedHtml = html.replace(/<img[^>]*>/g, '');

    const newPost: Post = { 
      id: `p-${Date.now()}`, 
      author: user.name, 
      authorId: user.id, 
      authorRole: user.role, 
      authorAvatar: user.avatar, 
      timestamp: 'Just now', 
      content: cleanedHtml, 
      images: foundImages, 
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
    addToast('success', "Signal synchronized successfully with the universal hub strata.");
  };

  const filteredPosts = posts.filter(p => threadId ? p.id === threadId : !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter));
  
  return (
    <div className="max-w-[1440px] mx-auto pb-40 lg:px-12 py-6 bg-[var(--bg-primary)] min-h-screen relative">
      <div className="fixed bottom-10 right-10 z-[7000] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>

      {!threadId && newPostsAvailable > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
           <button 
             onClick={refreshFeed}
             className="px-6 py-2.5 bg-[var(--brand-color)] text-white rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
           >
             <ArrowUp size={16}/> See {newPostsAvailable} new signals
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 px-0 sm:px-4">
            {!threadId && <RichEditor onPost={handlePost} currentUser={user} />}
            {threadId && (
              <div className="mb-10 flex items-center justify-between px-4">
                <button onClick={onBack} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3"><ArrowLeft size={14}/> Back</button>
              </div>
            )}
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
                   onLike={(id) => { 
                     if(!likedPosts.has(id)){ 
                       db.likePost(id); 
                       setLikedPosts(new Set([...likedPosts, id])); 
                       setUpdateTrigger(p=>p+1); 
                     } 
                   }} 
                   onAddToast={addToast} 
                 />
               )) : <div className="py-40 text-center opacity-30 uppercase text-[10px] font-black">Registry_Empty</div>}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-none shadow-sm">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Globe size={14}/> Global Sync Status</h4>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">Signal integrity scanner is active. All multi-modal uploads are verified against university strata protocols.</p>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
