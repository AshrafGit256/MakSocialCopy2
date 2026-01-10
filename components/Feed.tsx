
import React, { useState, useEffect, useRef } from 'react';
import { Post, User } from '../types';
import { db } from '../db';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Search, Image as ImageIcon, Video, Heart, MessageCircle, Share2, 
  Sparkles, TrendingUp, AlertCircle, Briefcase, GraduationCap, X, 
  Link as LinkIcon, CheckCircle, ExternalLink, Banknote, Users, Loader2, 
  Eye, Trash2, Flag, MoreHorizontal, ShieldAlert 
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
  
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPosts(db.getPosts());
    setUser(db.getUser());
    
    // Simulate tracking views for currently visible posts
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
      setSelectedMedia({ 
        url, 
        type: file.type.startsWith('video') ? 'video' : 'image',
        file: file
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const categorizeAndSafetyCheck = async (content: string, imageBase64?: string, mimeType?: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [
        { text: `Analyze this university student post for safety and categorization. 
          Rules:
          1. CATEGORY: Must be one of Academic, Social, Finance, Career, or Urgent.
          2. SENTIMENT: Must be Positive, Neutral, or Critical.
          3. SAFETY: Is this content pornographic, indecent, sexually explicit, highly suggestive (e.g. transparent clothing, exposed intimate parts), or violent? (isSafe: true/false).
          4. REASON: If isSafe is false, provide a polite but firm explanation of why it was rejected (e.g., "Image contains indecent attire").
          
          Text content: "${content}"
          
          Return as valid JSON only.` }
      ];

      if (imageBase64 && mimeType) {
        parts.push({
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        });
      }

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
      
      const result = JSON.parse(response.text);
      return result;
    } catch (error) {
      console.error("AI Analysis failed:", error);
      // If AI fails completely (including safety block at API level), assume unsafe for platform protection if images are involved
      if (imageBase64) return { sentiment: 'Neutral', category: 'Social', isSafe: false, safetyReason: "Our automated systems detected a potential safety violation in the media provided." };
      return { ...db.analyzeContent(content), isSafe: true };
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia && !externalUrl) return;
    
    setIsAnalyzing(true);
    let imageBase64;
    let mimeType;

    if (selectedMedia?.type === 'image' && selectedMedia.file) {
      imageBase64 = await fileToBase64(selectedMedia.file);
      mimeType = selectedMedia.file.type;
    }

    const aiResult = await categorizeAndSafetyCheck(newPostContent, imageBase64, mimeType);
    setIsAnalyzing(false);

    if (aiResult.isSafe === false) {
      alert(`⚠️ Content Rejected: ${aiResult.safetyReason || 'This content violates our community safety guidelines regarding indecent or harmful material.'}`);
      return;
    }

    const isOpp = aiResult.category === 'Career';

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
      comments: 0,
      views: 0,
      flags: [],
      isOpportunity: isOpp,
      applicants: isOpp ? [] : undefined,
      college: user.college,
      aiMetadata: {
        category: aiResult.category as any,
        sentiment: aiResult.sentiment as any,
        isSafe: true
      }
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    db.savePosts(updated);
    
    setNewPostContent('');
    setSelectedMedia(null);
    setExternalUrl('');
    setShowUrlInput(false);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updated = db.deletePost(postId, user.id);
      if (updated) setPosts(updated);
      setActiveMenuId(null);
    }
  };

  const handleFlag = (postId: string) => {
    const updated = db.flagPost(postId, user.id);
    setPosts(updated);
    setActiveMenuId(null);
    alert("Post reported to administrators. Thank you for keeping our community safe.");
  };

  const isAdmin = user.email?.endsWith('@admin.mak.ac.ug');
  const isApplied = (postId: string) => user.appliedTo?.includes(postId);

  const getYouTubeId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return (match && match[1]) ? match[1] : null;
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const youtubeId = getYouTubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`;
    }
    return null;
  };

  const isYouTube = (url?: string) => !!getYouTubeId(url || '');

  const renderCategoryBadge = (category?: string) => {
    if (!category || category === 'Social') return (
      <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20 flex items-center gap-2">
        <Users size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">Social</span>
      </div>
    );

    switch (category) {
      case 'Urgent':
        return (
          <div className="bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2 animate-pulse">
            <AlertCircle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Urgent</span>
          </div>
        );
      case 'Academic':
        return (
          <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2">
            <GraduationCap size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Academic</span>
          </div>
        );
      case 'Career':
        return (
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
            <Briefcase size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Career</span>
          </div>
        );
      case 'Finance':
        return (
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-2">
            <Banknote size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Finance</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 flex gap-8">
      <div className="flex-1 space-y-6 max-w-2xl">
        {/* Post Creator */}
        <div className="glass-card p-6 rounded-[2rem] border-blue-500/20 dark:border-blue-500/20 border transition-theme shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-blue-500/10 rounded-xl"><Sparkles className="text-blue-600 dark:text-blue-400" size={18} /></div>
             <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Share with your college</h3>
          </div>
          <textarea 
            className="w-full bg-transparent border-none focus:outline-none text-[var(--text-primary)] resize-none min-h-[80px] text-lg placeholder:text-slate-400" 
            placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
          />

          {showUrlInput && (
            <div className="mb-4 flex gap-2 animate-in slide-in-from-top-2 duration-300">
              <input 
                className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-blue-500 transition-colors"
                placeholder="Paste YouTube or X link here..."
                value={externalUrl}
                onChange={e => setExternalUrl(e.target.value)}
              />
              <button onClick={() => { setExternalUrl(''); setShowUrlInput(false); }} className="text-slate-500 hover:text-red-500"><X size={18}/></button>
            </div>
          )}

          {selectedMedia && (
            <div className="relative mb-4 group inline-block animate-in zoom-in-95 duration-300">
               {selectedMedia.type === 'image' ? (
                 <img src={selectedMedia.url} className="h-40 w-auto rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-lg" />
               ) : (
                 <div className="h-40 w-64 bg-black rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-lg">
                    <Video className="text-white/50" size={32} />
                    <span className="absolute bottom-2 right-2 text-[10px] text-white/50 font-bold bg-black/40 px-2 py-1 rounded-lg">Video Preview</span>
                 </div>
               )}
               <button onClick={() => setSelectedMedia(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 border-t border-black/5 dark:border-white/5 pt-4">
             <div className="flex gap-2">
               <button onClick={() => mediaInputRef.current?.click()} title="Upload Local Media" className="text-slate-500 hover:text-blue-600 bg-black/5 dark:bg-white/5 p-3 rounded-xl transition-all border border-transparent hover:border-blue-500/30"><ImageIcon size={20}/></button>
               <button onClick={() => setShowUrlInput(!showUrlInput)} title="Embed External Link" className="text-slate-500 hover:text-blue-600 bg-black/5 dark:bg-white/5 p-3 rounded-xl transition-all border border-transparent hover:border-blue-500/30"><LinkIcon size={20}/></button>
               <input type="file" ref={mediaInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} />
             </div>
             <button 
                onClick={handleCreatePost} 
                disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia && !externalUrl)}
                className="bg-blue-600 px-8 py-3 rounded-full font-black text-sm text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
                {isAnalyzing ? (
                  <><Loader2 className="animate-spin" size={16}/> Safety Reviewing...</>
                ) : 'Publish Post'}
             </button>
          </div>
        </div>

        {/* Feed List */}
        {posts.map(post => (
          <div key={post.id} className={`glass-card p-6 rounded-[2rem] space-y-4 border transition-theme ${post.aiMetadata?.category === 'Urgent' ? 'border-red-500/40 bg-red-500/[0.04]' : 'border-black/5 dark:border-white/5 shadow-md'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-white/10" />
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    {post.author}
                    {post.authorRole.includes('Admin') && <span className="bg-blue-600 text-[8px] px-1.5 py-0.5 rounded uppercase text-white font-black tracking-tighter shadow-sm">Staff</span>}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{post.timestamp}</p>
                    <span className="text-[10px] text-slate-300">•</span>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{post.college}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderCategoryBadge(post.aiMetadata?.category)}
                
                {/* Actions Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  
                  {activeMenuId === post.id && (
                    <div className="absolute right-0 top-10 w-48 glass-card border-black/10 dark:border-white/10 rounded-2xl p-2 z-30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      {(post.authorId === user.id || isAdmin) && (
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} /> Delete Post
                        </button>
                      )}
                      {post.authorId !== user.id && (
                        <button 
                          onClick={() => handleFlag(post.id)}
                          disabled={post.flags?.includes(user.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                            post.flags?.includes(user.id) ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <Flag size={16} /> {post.flags?.includes(user.id) ? 'Reported' : 'Report Post'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-[var(--text-primary)] leading-relaxed text-[15px]">{post.content}</p>
            
            {post.images && post.images.length > 0 && <img src={post.images[0]} className="rounded-2xl w-full h-auto max-h-[500px] object-cover shadow-xl border border-black/5 dark:border-white/5" />}
            {post.video && <video controls className="rounded-2xl w-full h-auto max-h-[500px] shadow-xl border border-black/5 dark:border-white/5 bg-black" src={post.video} />}
            
            {post.externalLink && (
              <div className="space-y-3">
                {isYouTube(post.externalLink) ? (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-black/10 dark:border-white/10 shadow-2xl bg-black">
                     <iframe 
                       className="w-full h-full" 
                       src={getEmbedUrl(post.externalLink)!} 
                       frameBorder="0" 
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                       allowFullScreen
                     ></iframe>
                  </div>
                ) : (
                  <a 
                    href={post.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                  >
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600"><ExternalLink size={22}/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{post.externalLink}</p>
                      <p className="text-xs text-slate-500 font-medium">External link content</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            <div className="flex items-center space-x-6 pt-4 border-t border-black/5 dark:border-white/5">
              <button onClick={() => setPosts(db.likePost(post.id))} className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors group">
                <Heart size={18} className="group-hover:fill-current" />
                <span className="text-xs font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-500 transition-colors">
                <MessageCircle size={18} />
                <span className="text-xs font-bold">{post.comments}</span>
              </button>
              <div className="flex items-center space-x-2 text-slate-400" title="Total Views">
                <Eye size={18} />
                <span className="text-xs font-bold">{post.views || 0}</span>
              </div>
              <button className="flex items-center space-x-2 text-slate-500 hover:text-indigo-500 transition-colors">
                <Share2 size={18} />
              </button>
              
              {post.flags && post.flags.length > 0 && isAdmin && (
                <div className="flex items-center gap-2 text-red-500 ml-auto animate-pulse">
                   <ShieldAlert size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{post.flags.length} Reports</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-80 space-y-6 hidden lg:block">
        <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border-blue-500/10 border relative overflow-hidden group transition-theme">
           <h3 className="font-black text-[10px] uppercase text-blue-600 dark:text-blue-400 mb-6 tracking-[0.2em] flex items-center gap-2"><TrendingUp size={14}/> Networking Tip</h3>
           <p className="text-sm font-black text-[var(--text-primary)] mb-3 italic leading-tight">Your Profile is your Resume.</p>
           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Adding your College and Year helps other students find your skills for collaboration.</p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] transition-theme shadow-sm">
           <h3 className="font-black text-[10px] uppercase text-slate-400 mb-8 tracking-[0.2em]">Trending Tags</h3>
           <div className="space-y-8">
              {[
                { tag: '#MakHacks2025', count: '3.2k', trend: 'up' },
                { tag: '#COCIS_Alumni', count: '1.4k', trend: 'up' },
                { tag: '#Makerere100', count: '12.1k', trend: 'up' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-blue-600 transition-colors">{item.tag}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{item.count} posts</span>
                   </div>
                   <TrendingUp size={14} className="text-slate-300 group-hover:text-blue-500" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
