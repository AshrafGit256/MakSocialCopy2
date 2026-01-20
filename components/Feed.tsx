
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, CalendarEvent, AuthorityRole } from '../types';
import { db } from '../db';
import { COLLEGE_BANNERS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, Verified, Zap, Calendar, 
  MapPin, Clock, Plus, Share2, CalendarPlus,
  Bookmark, CalendarCheck, Save, Brain, Edit3, ArrowLeft, Search as SearchIcon, Filter
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ isVerified?: boolean, role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ isVerified, role, size = 'sm' }) => {
  const isAuthorized = isVerified || role === 'Super Admin' || role === 'Lecturer' || role === 'Student Leader' || role === 'Administrator';
  if (!isAuthorized) return null;
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className={`inline-flex items-center justify-center ml-1.5 select-none relative group ${dim}`} title={`Verified ${role || 'Student'}`}>
       <div className="absolute inset-0 bg-blue-500 blur-[3px] opacity-40 rounded-full group-hover:opacity-70 transition-opacity"></div>
       <svg viewBox="0 0 24 24" className={`${dim} text-blue-500 fill-current drop-shadow-md z-10`} xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
       </svg>
    </div>
  );
};

const Feed: React.FC<{ collegeFilter?: College, targetPostId?: string | null, onClearTarget?: () => void }> = ({ collegeFilter, targetPostId, onClearTarget }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const isSuperAdmin = user.email?.toLowerCase().endsWith('@admin.mak.ac.ug');
  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  
  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      let fetchedPosts = db.getPosts(activeCollege || undefined);
      if (postSearchQuery.trim()) {
        const q = postSearchQuery.toLowerCase();
        fetchedPosts = fetchedPosts.filter(p => 
          p.content.toLowerCase().includes(q) || 
          p.author.toLowerCase().includes(q) ||
          p.hashtags.some(h => h.toLowerCase().includes(q))
        );
      }
      setPosts(fetchedPosts);
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, collegeFilter, user.id, postSearchQuery]);

  const handleBookmark = (postId: string) => {
    db.bookmarkPost(user.id, postId);
    setUser(db.getUser());
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    setRejectionMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];
      let moderationPrompt = `Respond ONLY with JSON: {"category": string, "isSafe": boolean, "reason": string}`;
      if (newPostContent.trim()) parts.push({ text: `Text: "${newPostContent}"\n\n${moderationPrompt}` });
      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
      }
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": false, "reason": "Moderation error"}');
      if (!result.isSafe) {
        setRejectionMessage(result.reason || "Content block.");
        setIsAnalyzing(false);
        return;
      }
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, 
        authorId: user.id, 
        authorRole: user.role, 
        authorAvatar: user.avatar,
        authorAuthority: isSuperAdmin ? 'Super Admin' : undefined,
        timestamp: 'Just now', 
        content: newPostContent, 
        images: selectedImage ? [selectedImage] : undefined,
        hashtags: [], 
        likes: 0, 
        commentsCount: 0, 
        comments: [], 
        views: 1,
        flags: [], 
        isOpportunity: result.category === 'Career', 
        college: activeCollege || 'Global',
        aiMetadata: { category: result.category as any, isSafe: true }
      };
      db.addPost(newPost);
      setNewPostContent('');
      setSelectedImage(null);
      setPosts(db.getPosts(activeCollege || undefined));
      setIsAnalyzing(false);
    } catch (e) { 
      setIsAnalyzing(false); 
      setRejectionMessage("Security error.");
    }
  };

  const handleEdit = async (post: Post) => {
    if (editingPostId === post.id) {
       setIsSavingEdit(true);
       const updatedPost = { ...post, content: editContent };
       db.updatePost(updatedPost);
       setEditingPostId(null);
       setIsSavingEdit(false);
       setPosts(db.getPosts(activeCollege || undefined));
    } else {
       setEditingPostId(post.id);
       setEditContent(post.content);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-32">
      {/* College Banner for filtered view */}
      {activeCollege && activeCollege !== 'Global' && (
        <div className="relative h-64 mb-10 rounded-[3rem] overflow-hidden group shadow-2xl border border-[var(--border-color)]">
          <img src={COLLEGE_BANNERS[activeCollege as College]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10 flex items-center gap-6">
             <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl border border-white/20">
                {activeCollege[0]}
             </div>
             <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{activeCollege} Community Hub</h2>
                <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                   <Users size={12}/> {db.getUsers().filter(u => u.college === activeCollege).length} Members Synchronized
                </p>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
         {!collegeFilter && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex-shrink-0">
               {['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map((c: any) => (
                  <button key={c} onClick={() => setActiveTab(c)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}>
                  {c}
                  </button>
               ))}
            </div>
         )}
         
         {/* Post-specific Search Bar */}
         <div className="relative flex-1 w-full group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
               value={postSearchQuery}
               onChange={e => setPostSearchQuery(e.target.value)}
               placeholder={`Search for content in ${activeCollege || 'Global Hub'}...`}
               className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all shadow-inner"
            />
            {postSearchQuery && (
               <button onClick={() => setPostSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"><X size={16}/></button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
               <div className="flex gap-4">
                  <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-[var(--border-color)] shadow-sm" />
                  <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none h-24 placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast signal to ${activeCollege || 'the Hub'}...`} />
               </div>
               <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="flex gap-4">
                    <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors"><ImageIcon size={18}/> Asset</button>
                  </div>
                  <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} className="bg-indigo-600 text-white px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all">
                     {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16}/>} Broadcast
                  </button>
               </div>
            </div>

            <div className="space-y-8">
               {posts.map(post => {
                 const postUser = db.getUsers().find(u => u.id === post.authorId);
                 const isBookmarked = user.bookmarkedPosts.includes(post.id);
                 const isAuthor = user.id === post.authorId;
                 const isEditing = editingPostId === post.id;
                 return (
                  <article key={post.id} className="glass-card p-0 overflow-hidden border-[var(--border-color)] shadow-sm hover:shadow-md transition-all">
                     <div className="p-8 pb-4">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <img src={post.authorAvatar} className="w-12 h-12 rounded-full border border-[var(--border-color)] object-cover shadow-sm" />
                             <div>
                                <div className="flex items-center">
                                   <h4 className="font-extrabold text-[var(--text-primary)] text-sm uppercase tracking-tight">{post.author}</h4>
                                   <AuthoritySeal isVerified={postUser?.isVerified} role={post.authorAuthority} />
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             {isAuthor && (
                               <button onClick={() => handleEdit(post)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/5 rounded-lg transition-all">
                                  {isSavingEdit ? <Loader2 size={14} className="animate-spin"/> : <Edit3 size={16}/>}
                               </button>
                             )}
                             <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded-lg text-slate-500 border border-[var(--border-color)]">
                               {post.isEventBroadcast ? 'Official' : (post.aiMetadata?.category || 'Pulse')}
                             </span>
                          </div>
                       </div>
                       {isEditing ? (
                         <textarea className="w-full bg-[var(--bg-secondary)] border border-indigo-600/20 rounded-xl p-4 text-sm font-medium outline-none h-32 mb-4" value={editContent} onChange={e => setEditContent(e.target.value)} />
                       ) : (
                         <p className="text-[var(--text-primary)] text-base font-normal leading-relaxed border-l-4 border-indigo-600/40 pl-6 py-2 mb-4 bg-indigo-600/5 rounded-r-2xl font-sans">{post.content}</p>
                       )}
                     </div>
                     {post.images && post.images.length > 0 && (
                       <div className="px-8 pb-8">
                          <div className="rounded-[2rem] overflow-hidden border border-[var(--border-color)] group/img shadow-xl">
                            <img src={post.images[0]} className="w-full object-cover max-h-[600px] hover:scale-[1.03] transition-transform duration-700" alt="Asset" />
                          </div>
                       </div>
                     )}
                     <div className="px-8 py-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-10">
                           <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                             <Heart size={20} className="group-hover:fill-rose-500 transition-all" /> 
                             <span className="text-[11px] font-black">{post.likes}</span>
                           </button>
                           <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                             <MessageCircle size={20}/> 
                             <span className="text-[11px] font-black">{post.commentsCount}</span>
                           </button>
                           <button onClick={() => handleBookmark(post.id)} className={`flex items-center gap-2 transition-all ${isBookmarked ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`} >
                             <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                             <span className="text-[11px] font-black">{isBookmarked ? 'Archived' : 'Archive'}</span>
                           </button>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-400">
                           <Eye size={18}/> 
                           <span className="text-[9px] font-black tracking-widest uppercase">{post.views?.toLocaleString() || 0} Scans</span>
                        </div>
                     </div>
                  </article>
                 );
               })}
               {posts.length === 0 && (
                  <div className="py-20 text-center space-y-4 bg-[var(--bg-secondary)]/30 rounded-[3rem] border-2 border-dashed border-[var(--border-color)]">
                     <AlertCircle size={48} className="mx-auto text-slate-300"/>
                     <p className="text-xs font-black uppercase text-slate-500 tracking-widest">No matching broadcasts detected.</p>
                  </div>
               )}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-8">
            <div className="glass-card p-8 bg-indigo-600 text-white border-indigo-500 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70">Intelligence</h3>
                    <p className="text-4xl font-black mt-2">{user.iqCredits || 0} IQ-C</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Brain size={24}/></div>
               </div>
            </div>
            <div className="glass-card p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)]">
               <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Verified className="text-indigo-600" size={18}/> Prominent Nodes
               </h3>
               <div className="space-y-6">
                  {db.getUsers().filter(u => u.isVerified && u.id !== user.id).slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-4 group cursor-pointer">
                       <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] group-hover:border-indigo-600 transition-colors" />
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase leading-none">{u.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase truncate">{u.role} • {u.college}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
