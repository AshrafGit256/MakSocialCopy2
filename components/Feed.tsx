
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { db } from '../db';
import { Search, Image as ImageIcon, Video, Smile, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, Send } from 'lucide-react';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setPosts(db.getPosts());
  }, []);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const user = db.getUser();
    const newPost: Post = {
      id: Date.now().toString(),
      author: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      timestamp: 'Just now',
      content: newPostContent,
      hashtags: ['#NewPost'],
      likes: 0,
      comments: 0,
      isOpportunity: newPostContent.toLowerCase().includes('opportunity')
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    db.savePosts(updated);
    setNewPostContent('');
  };

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) return;
    const updated = db.likePost(postId);
    setPosts(updated);
    setLikedPosts(new Set([...likedPosts, postId]));
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    const updated = db.addComment(postId, commentText);
    setPosts(updated);
    setCommentText('');
    setCommentingOn(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6 h-full overflow-y-auto">
      <div className="flex-1 space-y-6 max-w-2xl">
        {/* Banner Section */}
        <div className="relative h-48 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" 
            className="w-full h-full object-cover brightness-50"
            alt="Makerere Main Building"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center shadow-xl">
                <img src="https://picsum.photos/seed/ccis/100" alt="CCIS" className="w-full h-full rounded-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">College of Computing and Information Sciences</h1>
                <button className="mt-2 bg-white text-black px-6 py-1.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">Join</button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Post */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0">
               <img src={db.getUser().avatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <textarea 
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-300 placeholder:text-slate-600 resize-none min-h-[60px]" 
              placeholder="Post to College... use 'opportunity' to tag as one."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-blue-400 hover:bg-blue-400/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                <ImageIcon size={20} />
                <span>Media</span>
              </button>
            </div>
            <button 
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-6 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Post
            </button>
          </div>
        </div>

        {/* Feed Posts */}
        {posts.map(post => (
          <div key={post.id} className="glass-card rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} alt={post.author} className="w-11 h-11 rounded-full object-cover border-2 border-white/10" />
                <div>
                  <h4 className="font-bold text-white text-sm">{post.author} ({post.authorRole})</h4>
                  <p className="text-xs text-slate-500">{post.timestamp}</p>
                </div>
              </div>
              <button className="text-slate-500 hover:text-white p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <p className={`text-slate-300 ${post.isOpportunity ? 'bg-blue-500/10 p-4 border-l-4 border-blue-500 rounded-xl' : ''}`}>
                {post.content}
              </p>
              {post.image && (
                <div className="rounded-2xl overflow-hidden border border-white/5">
                  <img src={post.image} alt="Post content" className="w-full object-cover max-h-96" />
                </div>
              )}
            </div>
            <div className="flex flex-col pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart size={20} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                    className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-slate-400 hover:text-green-500 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>

              {commentingOn === post.id && (
                <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2">
                  <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Side Widgets (Static) */}
      <div className="w-80 space-y-6 hidden lg:block">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center justify-between">
            Top Contributors
            <span className="text-xs font-normal text-blue-400 cursor-pointer">View all</span>
          </h3>
          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center group cursor-pointer">
                <div className="w-14 h-14 rounded-full p-0.5 border-2 border-blue-500 mb-1 group-hover:scale-110 transition-transform">
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-[10px] text-slate-400 truncate w-14 text-center">Student {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
