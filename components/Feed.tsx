
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, Comment, CalendarEvent } from '../types';
import { db } from '../db';
import RichEditor from './Summernote';
import CampaignCard from './CampaignCard';
import { 
  Star, MessageCircle, Zap, Activity, Globe, 
  Terminal, Share2, Bookmark, 
  BadgeCheck, ArrowLeft, GitCommit,
  Calendar, MapPin, X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowUp, Send, Clock
} from 'lucide-react';

/* Fix: Added missing AuthoritySeal component export */
export const AuthoritySeal: React.FC<{ role?: AuthorityRole | string, size?: number }> = ({ size = 16 }) => {
  return <BadgeCheck size={size} className="text-indigo-500" />;
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, bookmarks: string[], onBookmark: (id: string) => void, onUpdate: () => void, isThreadView?: boolean, isLiked?: boolean, onLike: (id: string) => void, onAddToast: (type: any, text: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, bookmarks, onBookmark, onUpdate, isThreadView = false, isLiked = false, onLike, onAddToast }) => {
  
  // Use specialized card for campaigns
  if (post.isCampaign && !isThreadView) {
    return <CampaignCard post={post} currentUser={currentUser} onComplete={onUpdate} />;
  }

  return (
    <article onClick={() => !isThreadView && onOpenThread(post.id)} className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md overflow-hidden transition-all shadow-sm group ${!isThreadView ? 'cursor-pointer hover:border-slate-300 mb-8' : 'mb-10'}`}>
       <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
             <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] object-cover" alt={post.author} />
             <div>
                <div className="flex items-center gap-1.5">
                   <h4 className="text-[14px] font-black uppercase tracking-tight">{post.author}</h4>
                   <AuthoritySeal role={post.authorAuthority} size={14} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.timestamp} • {post.college} HUB</p>
             </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-sm font-medium leading-relaxed mb-4 post-content-markdown" />
       </div>
    </article>
  );
};

/* Fix: Added missing Feed component implementation and default export */
const Feed: React.FC<{ 
  collegeFilter?: College | 'Global', 
  threadId?: string, 
  onOpenThread: (id: string) => void, 
  onBack?: () => void, 
  onNavigateToProfile: (id: string) => void, 
  triggerSafetyError: () => void 
}> = ({ collegeFilter, threadId, onOpenThread, onBack, onNavigateToProfile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const currentUser = db.getUser();

  useEffect(() => {
    setPosts(db.getPosts());
  }, []);

  const filteredPosts = useMemo(() => {
    if (threadId) return posts.filter(p => p.id === threadId);
    if (!collegeFilter || collegeFilter === 'Global') return posts;
    return posts.filter(p => p.college === collegeFilter);
  }, [posts, collegeFilter, threadId]);

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-900 transition-all font-bold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={18} /> Back
        </button>
      )}
      
      {!threadId && (
        <RichEditor currentUser={currentUser} onPost={handleCreatePost} />
      )}

      <div className="space-y-4">
        {filteredPosts.map(p => (
          <PostItem 
            key={p.id} 
            post={p} 
            currentUser={currentUser} 
            onOpenThread={onOpenThread} 
            onNavigateToProfile={onNavigateToProfile} 
            bookmarks={[]} 
            onBookmark={() => {}} 
            onUpdate={() => setPosts(db.getPosts())}
            onLike={() => {}}
            onAddToast={() => {}}
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
