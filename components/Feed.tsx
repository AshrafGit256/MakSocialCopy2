
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, Comment, CalendarEvent } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import { 
  Star, MessageCircle, Zap, Activity, Globe, 
  Terminal, Share2, Bookmark, 
  BadgeCheck, ArrowLeft, GitCommit,
  Calendar, MapPin, X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowUp, Send, Clock
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

// --- COUNTDOWN COMPONENT ---
const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Event Started');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
    };

    calculate();
    const timer = setInterval(calculate, 60000); 
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[2px] shadow-sm">
      <Clock size={10} className="animate-pulse" />
      <span className="text-[9px] font-black uppercase tracking-widest">{timeLeft}</span>
    </div>
  );
};

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
    <div className={`flex items-start gap-4 p-4 bg-white border ${c.border} rounded-md shadow-lg min-w-[320px] max-w-[450px] animate-in slide-in-from-right-4 duration-300 font-sans`}>
       <div className="shrink-0 pt-0.5">
          {toast.type === 'error' ? (
            <div className={`${c.iconBg} rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm`}>
               {c.icon}
            </div>
          ) : c.icon}
       </div>
       <p className="text-[14px] font-bold text-slate-700 leading-tight pr-4">
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
      case 1: return (<div className="w-full rounded-md overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]"><img src={images[0]} className="w-full h-auto max-h-[700px] object-cover cursor-pointer hover:brightness-95 transition-all" onClick={() => setLightbox({ open: true, index: 0 })} /></div>);
      case 2: return (<div className="grid grid-cols-2 gap-0.5 rounded-md overflow-hidden border border-[var(--border-color)] aspect-[16/9] sm:aspect-[2/1]">{images.map((img, i) => (<img key={i} src={img} className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all border-r border-[var(--border-color)] last:border-r-0" onClick={() => setLightbox({ open: true, index: i })} />))}</div>);
      default: return (<div className="grid grid-cols-2 grid-rows-2 gap-0.5 rounded-md overflow-hidden border border-[var(--border-color)] aspect-[16/9]">{images.slice(0, 4).map((img, i) => (<div key={i} className="relative w-full h-full overflow-hidden group"><img src={img} className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all border-r border-b border-[var(--border-color)]" onClick={() => setLightbox({ open: true, index: i })} />{i === 3 && count > 4 && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer group-hover:bg-black/40 transition-all" onClick={() => setLightbox({ open: true, index: 3 })}><span className="text-3xl font-black text-white drop-shadow-lg">+{count - 4}</span></div>)}</div>))}</div>);
    }
  };
  return (<div className="my-5 select-none">{renderGrid()}{lightbox.open && (<Lightbox images={images} initialIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />)}</div>);
};

export const AuthoritySeal: React.FC<{ role?: string, size?: number, verified?: boolean }> = ({ role, size = 16, verified = true }) => (<div className="inline-flex items-center ml-1 text-[var(--brand-color)]" title={role ? `Verified ${role}` : 'Verified Account'}><BadgeCheck size={size} fill="currentColor" stroke="white" strokeWidth={1.5} /></div>);

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, bookmarks: string[], onBookmark: (id: string) => void, onUpdate: () => void, isThreadView?: boolean, isLiked?: boolean, onLike: (id: string) => void, onAddToast: (type: ToastMsg['type'], text: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark, onUpdate, isThreadView = false, isLiked = false, onLike, onAddToast }) => {
  const [newComment, setNewComment] = useState('');
  
  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventData: CalendarEvent = {
      id: `ev-post-${post.id}-${Date.now()}`,
      title: post.isEventBroadcast ? (post.eventTitle || 'University Protocol') : `Event: ${post.author}`,
      description: post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...',
      date: post.eventDate || new Date().toISOString().split('T')[0],
      time: post.eventTime || '09:00',
      location: post.eventLocation || 'Main Campus',
      category: 'Academic',
      createdBy: post.authorId,
      attendeeIds: [currentUser.id]
    };
    db.saveCalendarEvent(eventData);
    onAddToast('success', "Event added to your personal calendar.");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    db.addComment(post.id, { id: `c-${Date.now()}`, author: currentUser.name, authorAvatar: currentUser.avatar, text: newComment, timestamp: 'Just now' });
    setNewComment('');
    onUpdate();
  };

  const isShowSaveButton = post.isEventBroadcast || post.isOpportunity;

  return (
    <article onClick={() => !isThreadView && onOpenThread(post.id)} className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md overflow-hidden transition-all shadow-sm group ${!isThreadView ? 'cursor-pointer hover:border-slate-300 mb-8' : 'mb-10'}`}>
      
      {/* MOBILE HEADER - Removed the vertical gutter layout for mobile to increase space */}
      <div className="sm:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-white/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <img 
            src={post.authorAvatar} 
            onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} 
            className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover cursor-pointer" 
          />
          <div onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} className="flex flex-col cursor-pointer group/name truncate">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-bold text-slate-900 truncate">{post.author}</span>
              <AuthoritySeal role={post.authorAuthority} size={13} />
            </div>
            <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">{post.authorRole || 'Student'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {post.isEventBroadcast && post.eventDate && <Countdown targetDate={post.eventDate} />}
           <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-1.5 transition-all ${bookmarks.includes(post.id) ? 'text-orange-500' : 'text-slate-400'}`}><Bookmark size={16} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} /></button>
        </div>
      </div>

      <div className="flex">
          {/* DESKTOP AVATAR GUTTER - Hidden on Mobile */}
          <div className="hidden sm:flex w-20 pt-6 flex-col items-center border-r border-[var(--border-color)] bg-slate-50/20 shrink-0">
            <img src={post.authorAvatar} onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} className="w-12 h-12 rounded-full border border-[var(--border-color)] bg-white object-cover cursor-pointer transition-all hover:scale-105 shadow-sm" />
            <div className="mt-4 flex flex-col items-center gap-3 flex-1 h-full">
              <div className="w-px flex-1 bg-gradient-to-b from-[var(--border-color)] via-[var(--border-color)] to-transparent"></div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* DESKTOP HEADER INFO - Hidden on Mobile */}
            <div className="hidden sm:flex px-6 py-4 border-b border-[var(--border-color)] items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }} className="flex flex-col cursor-pointer group/name">
                    <div className="flex items-center"><span className="text-[15px] font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{post.author}</span><AuthoritySeal role={post.authorAuthority} size={15} /></div>
                    <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">{post.authorRole || 'Student'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {post.isEventBroadcast && post.eventDate && (
                    <Countdown targetDate={post.eventDate} />
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">{post.timestamp}</span>
                  <button onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }} className={`p-1 rounded transition-all ${bookmarks.includes(post.id) ? 'text-orange-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}><Bookmark size={16} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} /></button>
                </div>
            </div>

            {/* MAIN CONTENT - Full width on Mobile */}
            <div className="p-5 sm:p-6">
                <div className="text-[15px] sm:text-[16px] leading-relaxed font-sans text-[var(--text-primary)] post-content-markdown mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.images && post.images.length > 0 && <PostImageGrid images={post.images} />}
                <div className="flex flex-wrap gap-2 mt-4">{(post.hashtags || []).map(tag => (<span key={tag} className="text-[11px] font-bold text-slate-400 tracking-wide">#{tag.replace('#', '')}</span>))}</div>
            </div>

            <div className="px-5 sm:px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-6 sm:gap-8">
                  <button onClick={(e) => { e.stopPropagation(); onLike(post.id); }} className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors ${isLiked ? 'text-brand-primary' : 'text-slate-500 hover:text-brand-primary'}`}><Star size={18} fill={isLiked ? "currentColor" : "none"} /> <span className="ticker-text">{post.likes.toLocaleString()}</span></button>
                  <button onClick={(e) => { e.stopPropagation(); !isThreadView && onOpenThread(post.id); }} className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 transition-colors"><MessageCircle size={18} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span></button>
                  {isShowSaveButton && (
                    <button onClick={handleAddToCalendar} className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-brand-primary transition-all" title="Add to Calendar"><Calendar size={18} /> <span className="hidden sm:inline font-bold">Save Event</span></button>
                  )}
                </div>
                <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-100 text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-widest"><Globe size={10}/> Public Post</div>
                <div className="sm:hidden text-[10px] text-slate-400 font-medium">{post.timestamp}</div>
            </div>
          </div>
      </div>
      {isThreadView && (
        <div className="border-t border-[var(--border-color)] bg-slate-50/30">
           <div className="divide-y divide-[var(--border-color)]">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-5 sm:p-6 hover:bg-white/50 transition-colors">
                    <img src={comment.authorAvatar} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--border-color)] bg-white object-cover" />
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1.5"><span className="text-[13px] font-bold text-slate-800">{comment.author}</span><span className="text-[11px] text-slate-400">{comment.timestamp}</span></div>
                       <p className="text-[14px] font-medium text-slate-600 leading-relaxed comment-text">{comment.text}</p>
                    </div>
                </div>
              ))}
           </div>
           <div className="p-5 sm:p-6 border-t border-[var(--border-color)] bg-white">
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                 <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full bg-[var(--bg-secondary)] border border-slate-200 rounded-lg p-4 text-[14px] font-medium min-h-[100px] outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner" />
                 <div className="flex justify-end"><button type="submit" disabled={!newComment.trim()} className="px-8 py-2.5 bg-slate-800 hover:bg-black text-white rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95">Post Comment <Send size={14}/></button></div>
              </form>
           </div>
        </div>
      )}
    </article>
  );
};

// --- FEED COMPONENT ---
interface FeedProps {
  collegeFilter?: College | 'Global';
  threadId?: string;
  onOpenThread: (id: string) => void;
  onNavigateToProfile: (id: string) => void;
  triggerSafetyError: () => void;
  onBack?: () => void;
}

const Feed: React.FC<FeedProps> = ({ 
  collegeFilter = 'Global', 
  threadId, 
  onOpenThread, 
  onNavigateToProfile, 
  triggerSafetyError, 
  onBack 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser] = useState<User>(db.getUser());
  const [bookmarks, setBookmarks] = useState<string[]>(db.getBookmarks());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    const sync = () => {
      const allPosts = db.getPosts();
      setPosts(allPosts);
      setBookmarks(db.getBookmarks());
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (type: ToastMsg['type'], text: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handlePost = async (content: string, pollData?: PollData) => {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: currentUser.name,
      authorId: currentUser.id,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      content,
      hashtags: [],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: collegeFilter === 'Global' ? currentUser.college : collegeFilter,
      pollData
    };
    db.addPost(newPost);
    setPosts(db.getPosts());
  };

  const handleLike = (id: string) => {
    db.likePost(id);
    setPosts(db.getPosts());
  };

  const handleBookmark = (id: string) => {
    const newBookmarks = db.toggleBookmark(id);
    setBookmarks(newBookmarks);
    addToast('success', newBookmarks.includes(id) ? 'Added to registry vault.' : 'Removed from registry vault.');
  };

  const displayedPosts = useMemo(() => {
    if (threadId) {
      return posts.filter(p => p.id === threadId);
    }
    // Filter logic: Show specific college posts AND Global university announcements
    if (collegeFilter === 'Global') {
      return posts;
    }
    return posts.filter(p => p.college === collegeFilter || p.college === 'Global');
  }, [posts, threadId, collegeFilter]);

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 relative">
      {/* TOAST CONTAINER */}
      <div className="fixed top-6 right-6 z-[6000] flex flex-col gap-3">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>

      {threadId && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] transition-all">
          <ArrowLeft size={16}/> Back to Pulse
        </button>
      )}

      {!threadId && <RichEditor onPost={handlePost} currentUser={currentUser} />}

      <div className="space-y-2">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => (
            <PostItem 
              key={post.id} 
              post={post} 
              currentUser={currentUser} 
              onOpenThread={onOpenThread} 
              onNavigateToProfile={onNavigateToProfile} 
              bookmarks={bookmarks}
              onBookmark={handleBookmark}
              onUpdate={() => setPosts(db.getPosts())}
              isThreadView={!!threadId}
              isLiked={false}
              onLike={handleLike}
              onAddToast={addToast}
            />
          ))
        ) : (
          <div className="py-40 text-center opacity-20">
             <GitCommit size={48} className="mx-auto mb-4" />
             <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Signals...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
