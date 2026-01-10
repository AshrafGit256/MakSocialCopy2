
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment } from '../types';
import { db } from '../db';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Image as ImageIcon, Video, Heart, MessageCircle, Share2, 
  Sparkles, TrendingUp, AlertCircle, Briefcase, GraduationCap, X, 
  Link as LinkIcon, CheckCircle, ExternalLink, Banknote, Users, Loader2, 
  Eye, Trash2, Flag, MoreHorizontal, ShieldAlert, Send 
} from 'lucide-react';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [newPostContent, setNewPostContent] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video', file?: File} | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPosts(db.getPosts());
    setUser(db.getUser());
    
    const timer = setTimeout(() => {
      const currentPosts = db.getPosts();
      currentPosts.forEach(p => db.incrementView(p.id));
      setPosts(db.getPosts());
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia({ url, type: file.type.startsWith('video') ? 'video' : 'image', file });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia && !externalUrl) return;
    
    setIsAnalyzing(true);
    setRejectionMessage(null);
    let imageBase64;
    let mimeType;

    if (selectedMedia?.type === 'image' && selectedMedia.file) {
      imageBase64 = await fileToBase64(selectedMedia.file);
      mimeType = selectedMedia.file.type;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: `Post content: "${newPostContent}". Review for Academic/Social/Finance/Career/Urgent categories and check SAFETY for pornographic or highly suggestive material. Return JSON only {category, sentiment, isSafe, safetyReason}.` }];
      
      if (imageBase64) parts.push({ inlineData: { data: imageBase64, mimeType } });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              sentiment: { type: Type.STRING },
              isSafe: { type: Type.BOOLEAN },
              safetyReason: { type: Type.STRING }
            },
            required: ["category", "sentiment", "isSafe"]
          }
        }
      });
      
      const aiResult = JSON.parse(response.text);
      setIsAnalyzing(false);

      if (!aiResult.isSafe) {
        const reason = aiResult.safetyReason || 'Content violates safety guidelines regarding indecent imagery or text.';
        setRejectionMessage(reason);
        db.saveViolation({
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          content: newPostContent,
          media: imageBase64,
          mimeType: mimeType,
          reason: reason,
          timestamp: new Date().toLocaleString(),
          status: 'blocked'
        });
        return;
      }

      const newPost: Post = {
        id: Date.now().toString(),
        author: user.name,
        authorId: user.id,
        authorRole: user.role,
        authorAvatar: user.avatar,
        timestamp: 'Just now',
        content: newPostContent,
        images: selectedMedia?.type === 'image' ? [selectedMedia.url] : undefined,
        video: selectedMedia?.type === 'video' ? selectedMedia.url : undefined,
        externalLink: externalUrl || undefined,
        hashtags: [`#${user.college}`, '#MAK'],
        likes: 0,
        commentsCount: 0,
        comments: [],
        views: 0,
        flags: [],
        isOpportunity: aiResult.category === 'Career',
        college: user.college,
        aiMetadata: { category: aiResult.category as any, sentiment: aiResult.sentiment as any, isSafe: true }
      };

      const updated = [newPost, ...posts];
      setPosts(updated);
      db.savePosts(updated);
      setNewPostContent('');
      setSelectedMedia(null);
      setExternalUrl('');
      setShowUrlInput(false);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
      setRejectionMessage("A system error occurred during safety review. Please try again.");
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedPostForComments) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      authorAvatar: user.avatar,
      text: newCommentText,
      timestamp: 'Just now'
    };
    const updated = db.addComment(selectedPostForComments.id, newComment);
    setPosts(updated);
    setSelectedPostForComments(updated.find(p => p.id === selectedPostForComments.id) || null);
    setNewCommentText('');
  };

  const isAdmin = user.email?.endsWith('@admin.mak.ac.ug');

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 flex gap-8">
      <div className="flex-1 space-y-6 max-w-2xl">
        <div className="glass-card p-6 rounded-[2rem] border-blue-500/20 shadow-lg relative overflow-hidden">
          {rejectionMessage && (
            <div className="absolute inset-0 bg-red-900/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <ShieldAlert size={48} className="text-white mb-4" />
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest">Post Blocked</h3>
              <p className="text-red-200 mt-2 font-medium">{rejectionMessage}</p>
              <button onClick={() => setRejectionMessage(null)} className="mt-6 px-8 py-3 bg-white text-red-900 font-black rounded-full text-sm uppercase">Got it</button>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-blue-500/10 rounded-xl"><Sparkles className="text-blue-600" size={18} /></div>
             <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Connect with Makerere</h3>
          </div>
          <textarea 
            className="w-full bg-transparent border-none focus:outline-none text-[var(--text-primary)] resize-none min-h-[80px] text-lg placeholder:text-slate-400" 
            placeholder={`What's happening, ${user.name.split(' ')[0]}?`}
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
          />

          {showUrlInput && (
            <div className="mb-4 flex gap-2">
              <input className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none" placeholder="YouTube or X link..." value={externalUrl} onChange={e => setExternalUrl(e.target.value)} />
              <button onClick={() => { setExternalUrl(''); setShowUrlInput(false); }} className="text-slate-500"><X size={18}/></button>
            </div>
          )}

          {selectedMedia && (
            <div className="relative mb-4">
               <img src={selectedMedia.url} className="h-40 w-auto rounded-2xl object-cover shadow-lg" />
               <button onClick={() => setSelectedMedia(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5"><X size={14}/></button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 border-t border-black/5 dark:border-white/5 pt-4">
             <div className="flex gap-2">
               <button onClick={() => mediaInputRef.current?.click()} className="text-slate-500 hover:text-blue-600 bg-black/5 dark:bg-white/5 p-3 rounded-xl"><ImageIcon size={20}/></button>
               <button onClick={() => setShowUrlInput(!showUrlInput)} className="text-slate-500 hover:text-blue-600 bg-black/5 dark:bg-white/5 p-3 rounded-xl"><LinkIcon size={20}/></button>
               <input type="file" ref={mediaInputRef} className="hidden" accept="image/*" onChange={handleMediaUpload} />
             </div>
             <button 
                onClick={handleCreatePost} 
                disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)}
                className="bg-blue-600 px-8 py-3 rounded-full font-black text-sm text-white shadow-lg flex items-center gap-2"
             >
                {isAnalyzing ? <><Loader2 className="animate-spin" size={16}/> Safety Reviewing...</> : 'Publish'}
             </button>
          </div>
        </div>

        {posts.map(post => (
          <div key={post.id} className="glass-card p-6 rounded-[2rem] space-y-4 border shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{post.author}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{post.timestamp} • {post.college}</p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)} className="p-2 text-slate-400"><MoreHorizontal size={20} /></button>
                {activeMenuId === post.id && (
                  <div className="absolute right-0 top-10 w-48 glass-card border rounded-2xl p-2 z-30 shadow-2xl">
                    {(post.authorId === user.id || isAdmin) && <button onClick={() => { if(window.confirm("Delete?")) setPosts(db.deletePost(post.id, user.id)!); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-500/10 rounded-xl"><Trash2 size={16} /> Delete Post</button>}
                    {post.authorId !== user.id && <button onClick={() => { db.flagPost(post.id, user.id); setPosts(db.getPosts()); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold"><Flag size={16} /> Report</button>}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-[var(--text-primary)] leading-relaxed">{post.content}</p>
            {post.images && post.images.map((img, i) => <img key={i} src={img} className="rounded-2xl w-full h-auto shadow-xl" />)}
            
            <div className="flex items-center space-x-6 pt-4 border-t border-black/5 dark:border-white/5">
              <button onClick={() => setPosts(db.likePost(post.id))} className="flex items-center space-x-2 text-slate-500 hover:text-red-500"><Heart size={18} /><span className="text-xs font-bold">{post.likes}</span></button>
              <button onClick={() => setSelectedPostForComments(post)} className="flex items-center space-x-2 text-slate-500 hover:text-blue-500"><MessageCircle size={18} /><span className="text-xs font-bold">{post.commentsCount || 0}</span></button>
              <div className="flex items-center space-x-2 text-slate-400"><Eye size={18} /><span className="text-xs font-bold">{post.views || 0}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Drawer / Modal */}
      {selectedPostForComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPostForComments(null)}></div>
           <div className="glass-card w-full max-w-2xl h-[80vh] rounded-[3rem] relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-2xl font-black italic tracking-tighter">Post Discussion</h3>
                 <button onClick={() => setSelectedPostForComments(null)} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 <div className="pb-6 border-b border-white/5">
                    <p className="text-lg text-[var(--text-primary)] font-medium italic">"{selectedPostForComments.content}"</p>
                 </div>
                 {selectedPostForComments.comments?.map(c => (
                   <div key={c.id} className="flex gap-4 group">
                      <img src={c.authorAvatar} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-black text-blue-400">{c.author}</h4>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{c.timestamp}</span>
                         </div>
                         <p className="text-sm text-[var(--text-primary)] leading-relaxed">{c.text}</p>
                      </div>
                   </div>
                 ))}
                 {(!selectedPostForComments.comments || selectedPostForComments.comments.length === 0) && (
                   <p className="text-center text-slate-500 italic py-10">No comments yet. Be the first to start the conversation!</p>
                 )}
              </div>
              <div className="p-8 border-t border-white/5 bg-black/20">
                 <div className="flex gap-4 items-center bg-black/30 p-2 rounded-2xl border border-white/5 focus-within:border-blue-500/50 transition-all">
                    <input 
                      className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm" 
                      placeholder="Write your response..." 
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                    />
                    <button onClick={handleAddComment} className="bg-blue-600 p-3 rounded-xl text-white hover:scale-105 transition-all"><Send size={18}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
