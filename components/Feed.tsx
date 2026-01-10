
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment } from '../types';
import { db } from '../db';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Share2, 
  Sparkles, TrendingUp, AlertCircle, X, 
  Link as LinkIcon, Users, Loader2, 
  Eye, Trash2, Flag, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap
} from 'lucide-react';

const CategoryBadge: React.FC<{ category?: string }> = ({ category }) => {
  switch (category) {
    case 'Urgent':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">
          <AlertCircle size={12} /> Urgent
        </span>
      );
    case 'Academic':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
          <GraduationCap size={12} /> Academic
        </span>
      );
    case 'Career':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          <Briefcase size={12} /> Career
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-500/10">
          <Users size={12} /> Social
        </span>
      );
  }
};

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
    
    const timer = setInterval(() => {
      setPosts(db.getPosts());
    }, 3000);
    
    return () => clearInterval(timer);
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
      const parts: any[] = [{ text: `Post analysis: "${newPostContent}". Categories: Academic/Social/Finance/Career/Urgent. Check SAFETY (pornography/suggestive). Return JSON {category, isSafe, safetyReason}.` }];
      
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
              isSafe: { type: Type.BOOLEAN },
              safetyReason: { type: Type.STRING }
            },
            required: ["category", "isSafe"]
          }
        }
      });
      
      const aiResult = JSON.parse(response.text);
      setIsAnalyzing(false);

      if (!aiResult.isSafe) {
        setRejectionMessage(aiResult.safetyReason || 'Content violates university decency guidelines.');
        db.saveViolation({
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          content: newPostContent,
          media: imageBase64,
          mimeType: mimeType,
          reason: aiResult.safetyReason || 'AI Rejection',
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
        hashtags: [`#${user.college}`, '#MAK'],
        likes: 0,
        commentsCount: 0,
        comments: [],
        views: 0,
        flags: [],
        isOpportunity: aiResult.category === 'Career',
        college: user.college,
        aiMetadata: { category: aiResult.category as any, sentiment: 'Neutral', isSafe: true }
      };

      const updated = [newPost, ...posts];
      setPosts(updated);
      db.savePosts(updated);
      setNewPostContent('');
      setSelectedMedia(null);
    } catch (e) {
      setIsAnalyzing(false);
      setRejectionMessage("Security analysis failure. Retry later.");
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 flex gap-8">
      <div className="flex-1 space-y-6 max-w-2xl">
        <div className="glass-card p-6 rounded-[2rem] border-blue-500/20 shadow-lg relative overflow-hidden">
          {rejectionMessage && (
            <div className="absolute inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <ShieldAlert size={40} className="text-red-500 mb-6" />
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Blocked</h3>
              <p className="text-red-200 mt-2 font-medium max-w-md">{rejectionMessage}</p>
              <button onClick={() => setRejectionMessage(null)} className="mt-8 px-10 py-4 bg-white text-red-900 font-black rounded-full text-sm uppercase tracking-widest shadow-xl">Close</button>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-blue-500/10 rounded-xl"><Sparkles className="text-blue-600" size={18} /></div>
             <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Share with {user.college}</h3>
          </div>
          <textarea 
            className="w-full bg-transparent border-none focus:outline-none text-[var(--text-primary)] resize-none min-h-[80px] text-lg placeholder:text-slate-500" 
            placeholder={`Say something, ${user.name.split(' ')[0]}...`}
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
          />

          {selectedMedia && (
            <div className="relative mb-4 inline-block">
               <img src={selectedMedia.url} className="h-40 rounded-2xl object-cover border border-white/5 shadow-2xl" />
               <button onClick={() => setSelectedMedia(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2"><X size={14}/></button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 border-t border-black/5 dark:border-white/5 pt-4">
             <button onClick={() => mediaInputRef.current?.click()} className="text-slate-400 hover:text-blue-500 p-3 rounded-xl hover:bg-white/5 transition-colors"><ImageIcon size={22}/></button>
             <input type="file" ref={mediaInputRef} className="hidden" accept="image/*" onChange={handleMediaUpload} />
             <button 
                onClick={handleCreatePost} 
                disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)}
                className="bg-blue-600 px-10 py-3 rounded-full font-black text-sm text-white shadow-xl shadow-blue-600/20 flex items-center gap-2 transition-all hover:bg-blue-700 disabled:opacity-50"
             >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18}/> : 'Publish'}
             </button>
          </div>
        </div>

        {posts.map(post => (
          <div key={post.id} className="glass-card p-6 rounded-[2.5rem] space-y-4 border shadow-sm group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} className="w-12 h-12 rounded-full object-cover border border-white/5" />
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{post.author}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{post.timestamp} • {post.college}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <CategoryBadge category={post.aiMetadata?.category} />
                 <button onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)} className="p-2 text-slate-500"><MoreHorizontal size={20}/></button>
              </div>
            </div>
            <p className="text-base leading-relaxed text-[var(--text-primary)]">{post.content}</p>
            {post.images?.map((img, i) => <img key={i} src={img} className="rounded-3xl w-full h-auto shadow-2xl border border-white/5" />)}
            <div className="flex items-center space-x-6 pt-4 border-t border-black/5 dark:border-white/10">
              <button onClick={() => db.likePost(post.id)} className="flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors"><Heart size={18}/><span className="text-xs font-bold">{post.likes}</span></button>
              <button onClick={() => setSelectedPostForComments(post)} className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 transition-colors"><MessageCircle size={18}/><span className="text-xs font-bold">{post.commentsCount || 0}</span></button>
              <div className="flex items-center space-x-2 text-slate-400"><Eye size={18}/><span className="text-xs font-bold">{post.views || 0}</span></div>
            </div>
          </div>
        ))}
      </div>

      {selectedPostForComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-2xl h-[85vh] rounded-[3rem] relative flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black italic tracking-tighter text-[var(--text-primary)]">Post Discussion</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Community Input</p>
                 </div>
                 <button onClick={() => setSelectedPostForComments(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 mb-10">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={selectedPostForComments.authorAvatar} className="w-6 h-6 rounded-full" />
                      <span className="text-[10px] font-black uppercase text-blue-500">{selectedPostForComments.author}</span>
                    </div>
                    <p className="text-lg font-medium italic text-[var(--text-primary)]">"{selectedPostForComments.content}"</p>
                 </div>
                 {selectedPostForComments.comments?.map(c => (
                   <div key={c.id} className="flex gap-4">
                      <img src={c.authorAvatar} className="w-10 h-10 rounded-2xl object-cover" />
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-black text-blue-500">{c.author}</h4>
                            <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                         </div>
                         <p className="text-sm text-[var(--text-primary)] leading-relaxed">{c.text}</p>
                      </div>
                   </div>
                 ))}
                 {(!selectedPostForComments.comments?.length) && <p className="text-center py-20 text-slate-500 font-medium italic">Join the conversation...</p>}
              </div>
              <div className="p-8 bg-black/30 border-t border-white/5">
                 <div className="flex gap-4 items-center bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-blue-500 transition-all">
                    <input 
                      className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-white" 
                      placeholder="Type your response..." 
                      value={newCommentText} 
                      onChange={e => setNewCommentText(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()} 
                    />
                    <button onClick={handleAddComment} className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"><Send size={18}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
