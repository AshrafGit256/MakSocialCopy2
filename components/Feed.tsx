
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, Comment, CalendarEvent } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import CampaignCard from './CampaignCard';
import { 
  Star, MessageCircle, Zap, Activity, Globe, 
  Terminal, Share2, Bookmark, 
  BadgeCheck, ArrowLeft, GitCommit,
  Calendar, MapPin, X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowUp, Send, Clock,
  MoreHorizontal,
  Check
} from 'lucide-react';

/* Restored: AuthoritySeal with brand teal background and white tick */
export const AuthoritySeal: React.FC<{ role?: AuthorityRole | string, size?: number }> = ({ size = 16 }) => {
  return (
    <div 
      className="flex items-center justify-center rounded-full bg-[var(--brand-color)] shadow-sm shrink-0" 
      style={{ width: size + 4, height: size + 4 }}
    >
      <Check size={size - 2} className="text-white stroke-[4]" />
    </div>
  );
};

const PostItem: React.FC<{ 
  post: Post, 
  currentUser: User, 
  onOpenThread: (id: string) => void, 
  onNavigateToProfile: (id: string) => void, 
  onNavigateToVault?: () => void, 
  bookmarks: string[], 
  onBookmark: (id: string) => void, 
  onUpdate: () => void, 
  isThreadView?: boolean, 
  isLiked?: boolean, 
  onLike: (id: string) => void
}> = ({ post, currentUser, onOpenThread, onNavigateToProfile, onNavigateToVault, bookmarks, onBookmark, onUpdate, isThreadView = false, isLiked = false, onLike }) => {
  
  if (post.isCampaign && !isThreadView) {
    return (
      <CampaignCard 
        post={post} 
        currentUser={currentUser} 
        onComplete={onUpdate} 
        isLiked={isLiked} 
        onLike={onLike}
        isBookmarked={bookmarks.includes(post.id)}
        onBookmark={onBookmark}
      />
    );
  }

  const isBookmarked = bookmarks.includes(post.id);

  return (
    <article 
      onClick={() => !isThreadView && onOpenThread(post.id)} 
      className={`bg-white border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden transition-all shadow-sm group mb-6 ${!isThreadView ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
       <div className="p-5">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
                <img 
                  src={post.authorAvatar} 
                  className="w-12 h-12 rounded-full border border-slate-100 object-cover cursor-pointer hover:brightness-90 transition-all shadow-sm" 
                  alt={post.author} 
                  onClick={(e) => { e.stopPropagation(); onNavigateToProfile(post.authorId); }}
                />
                <div>
                   <div className="flex items-center gap-1.5">
                      <h4 className="text-[14px] font-black uppercase tracking-tight text-slate-900">{post.author}</h4>
                      <AuthoritySeal role={post.authorAuthority} size={12} />
                   </div>
                   {/* Restored: Explicit Role display (e.g. Vice Chancellor) */}
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                     {post.authorRole} • {post.timestamp}
                   </p>
                </div>
             </div>
             <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
             </button>
          </div>

          {/* Restored: Visual Separation Line */}
          <div className="w-full h-px bg-slate-100 mb-5"></div>

          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="text-[16px] font-medium leading-relaxed text-slate-700 mb-6 post-content-markdown" 
          />

          {post.images && post.images.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-slate-100 mb-6 shadow-inner bg-slate-50">
               <img src={post.images[0]} className="w-full h-auto object-cover max-h-[550px]" alt="Post content" />
            </div>
          )}

          {/* Action Bar with full Star/Reply/Share/Bookmark set */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-4">
             <div className="flex items-center gap-4 sm:gap-8">
                <button 
                  onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                  className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all group/btn active:scale-125"
                >
                   <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-rose-50 text-rose-500 shadow-sm' : 'group-hover/btn:bg-rose-50'}`}>
                      <Star size={20} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                   </div>
                   <span className={`text-[12px] font-black tracking-widest ${isLiked ? 'text-rose-500' : ''}`}>
                     {post.likes > 0 ? post.likes.toLocaleString() : 'STAR'}
                   </span>
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }}
                  className="flex items-center gap-2 text-slate-400 hover:text-[var(--brand-color)] transition-all group/btn active:scale-110"
                >
                   <div className="p-2 rounded-full group-hover/btn:bg-teal-50">
                      <MessageCircle size={20} />
                   </div>
                   <span className="text-[12px] font-black tracking-widest">
                     {post.commentsCount > 0 ? post.commentsCount.toLocaleString() : 'REPLY'}
                   </span>
                </button>

                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-all group/btn active:scale-110">
                   <div className="p-2 rounded-full group-hover/btn:bg-indigo-50">
                      <Share2 size={20} />
                   </div>
                </button>
             </div>

             <button 
               onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
               className={`p-2 rounded-full transition-all active:scale-125 ${isBookmarked ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
             >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
             </button>
          </div>
       </div>
    </article>
  );
};

const Feed: React.FC<{ 
  collegeFilter?: College | 'Global', 
  threadId?: string, 
  onOpenThread: (id: string) => void, 
  onBack?: () => void, 
  onNavigateToProfile: (id: string) => void, 
  onNavigateToVault?: () => void,
  triggerSafetyError: () => void 
}> = ({ collegeFilter, threadId, onOpenThread, onBack, onNavigateToProfile, onNavigateToVault }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const currentUser = db.getUser();

  useEffect(() => {
    setPosts(db.getPosts());
    setBookmarks(db.getBookmarks());
    setLikedPosts(JSON.parse(localStorage.getItem('maksocial_user_likes') || '[]'));
  }, []);

  const filteredPosts = useMemo(() => {
    if (threadId) return posts.filter(p => p.id === threadId);
    if (!collegeFilter || collegeFilter === 'Global') return posts;
    return posts.filter(p => p.college === collegeFilter);
  }, [posts, collegeFilter, threadId]);

  const handleLike = (id: string) => {
    const isLiked = likedPosts.includes(id);
    const updatedLikes = isLiked 
      ? likedPosts.filter(l => l !== id) 
      : [...likedPosts, id];
    
    setLikedPosts(updatedLikes);
    localStorage.setItem('maksocial_user_likes', JSON.stringify(updatedLikes));

    const post = posts.find(p => p.id === id);
    if (post) {
      const updatedPost = { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 };
      db.updatePost(updatedPost);
      setPosts(db.getPosts());
    }
  };

  const handleBookmark = (id: string) => {
    const updated = db.toggleBookmark(id);
    setBookmarks(updated);
  };

  const handleCreatePost = async (content: string) => {
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
      college: collegeFilter && collegeFilter !== 'Global' ? collegeFilter : 'Global'
    };
    db.addPost(newPost);
    setPosts(db.getPosts());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-900 transition-all font-bold uppercase text-[10px] tracking-widest group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Back to Pulse
        </button>
      )}
      
      {!threadId && (
        <div className="mb-8">
           <RichEditor currentUser={currentUser} onPost={handleCreatePost} />
        </div>
      )}

      <div className="space-y-2">
        {filteredPosts.map(p => (
          <PostItem 
            key={p.id} 
            post={p} 
            currentUser={currentUser} 
            onOpenThread={onOpenThread} 
            onNavigateToProfile={onNavigateToProfile} 
            onNavigateToVault={onNavigateToVault}
            bookmarks={bookmarks} 
            onBookmark={handleBookmark} 
            onLike={handleLike}
            isLiked={likedPosts.includes(p.id)}
            onUpdate={() => setPosts(db.getPosts())}
          />
        ))}
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">No signals detected in this sector</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
