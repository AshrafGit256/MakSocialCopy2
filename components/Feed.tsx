
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, CalendarEvent } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, X, 
  Loader2, Eye, ShieldAlert, Zap, 
  GraduationCap, CheckCircle2, Calendar, 
  MapPin, Clock, TrendingUp, Plus, ShieldCheck, Trash2, Edit3, 
  Star, Verified, Share2, Shield as ShieldIcon, Users, Lock
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  
  const config: Record<AuthorityRole, { 
    bg: string, 
    icon: React.ReactNode, 
    glow: string,
    border: string,
    textColor: string
  }> = {
    'Super Admin': { 
      bg: 'bg-rose-600', 
      glow: 'shadow-rose-500/40',
      border: 'border-rose-400/50',
      textColor: 'text-white',
      icon: <ShieldAlert size={size === 'sm' ? 10 : 12} /> 
    },
    'Administrator': { 
      bg: 'bg-indigo-600', 
      glow: 'shadow-indigo-500/40',
      border: 'border-indigo-400/50',
      textColor: 'text-white',
      icon: <ShieldCheck size={size === 'sm' ? 10 : 12} /> 
    },
    'Lecturer': { 
      bg: 'bg-slate-800', 
      glow: 'shadow-slate-500/40',
      border: 'border-slate-400/50',
      textColor: 'text-white',
      icon: <GraduationCap size={size === 'sm' ? 10 : 12} /> 
    },
    'Chairperson': { 
      bg: 'bg-emerald-600', 
      glow: 'shadow-emerald-500/40',
      border: 'border-emerald-400/50',
      textColor: 'text-white',
      icon: <CheckCircle2 size={size === 'sm' ? 10 : 12} /> 
    },
    'GRC': { 
      bg: 'bg-sky-500', 
      glow: 'shadow-sky-500/40',
      border: 'border-sky-400/50',
      textColor: 'text-white',
      icon: <Star size={size === 'sm' ? 10 : 12} fill="currentColor" /> 
    },
    'Student Leader': { 
      bg: 'bg-amber-500', 
      glow: 'shadow-amber-500/40',
      border: 'border-amber-400/50',
      textColor: 'text-white',
      icon: <Verified size={size === 'sm' ? 10 : 12} /> 
    },
    'Graduate': { 
      bg: 'bg-slate-500', 
      glow: 'shadow-slate-500/40',
      border: 'border-slate-400/50',
      textColor: 'text-white',
      icon: <GraduationCap size={size === 'sm' ? 10 : 12} /> 
    },
    'Alumni': { 
      bg: 'bg-slate-400', 
      glow: 'shadow-slate-400/40',
      border: 'border-slate-300/50',
      textColor: 'text-white',
      icon: <Users size={size === 'sm' ? 10 : 12} /> 
    },
    'Staff': { 
      bg: 'bg-slate-600', 
      glow: 'shadow-slate-600/40',
      border: 'border-slate-500/50',
      textColor: 'text-white',
      icon: <ShieldCheck size={size === 'sm' ? 10 : 12} /> 
    }
  };
  
  const current = config[role] || config['Administrator'];
  const sizeClasses = size === 'sm' ? 'h-4 px-1.5' : 'h-5 px-2';
  
  return (
    <div className={`
      inline-flex items-center gap-1 rounded-full ${sizeClasses} ${current.bg} ${current.textColor} 
      border ${current.border} shadow-sm transition-all hover:brightness-110 ml-1 select-none
    `} title={`Verified ${role}`}>
       {current.icon}
       <span className="text-[7px] font-black uppercase tracking-widest">{role}</span>
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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const isSuperAdmin = user.email?.toLowerCase().endsWith('@admin.mak.ac.ug');
  const userCollegeAdminMatch = user.email?.toLowerCase().match(/^admin\.([a-z]+)@mak\.ac\.ug$/);
  const userCollegeAdminId = userCollegeAdminMatch ? userCollegeAdminMatch[1].toUpperCase() as College : null;
  const isCollegeAdmin = !!userCollegeAdminId;

  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  const isAdminOfActiveCollege = isCollegeAdmin && activeCollege === userCollegeAdminId;

  const isSubscribed = user.subscriptionTier !== 'Free';

  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts(activeCollege || undefined));
      setCalendarEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, collegeFilter, user.id]);

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, user.id);
    setCalendarEvents(db.getCalendarEvents());
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
        authorAuthority: isSuperAdmin ? 'Super Admin' : (isAdminOfActiveCollege ? 'Administrator' : undefined),
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

  const saveEdit = async (post: Post) => {
    if (!editContent.trim()) return;
    setIsSavingEdit(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Respond ONLY with JSON: {"isSafe": boolean, "reason": string}. Check safety: "${editContent}"`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": false}');
      if (!result.isSafe) {
        alert("Rejected: " + (result.reason || "Content policy."));
        setIsSavingEdit(false);
        return;
      }
      const updatedPost: Post = { ...post, content: editContent, timestamp: `${post.timestamp} (Edited)` };
      db.updatePost(updatedPost);
      setPosts(db.getPosts(activeCollege || undefined));
      setEditingPostId(null);
      setIsSavingEdit(false);
    } catch (e) {
      alert("System Error.");
      setIsSavingEdit(false);
    }
  };

  const COLLEGES_LIST: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

  const handleTabClick = (c: College | 'Global') => {
    if (c === 'Global' || c === user.college || isSubscribed) {
      setActiveTab(c);
    } else {
      alert("UPGRADE REQUIRED: Joining multiple college nodes requires a PRO or ENTERPRISE subscription stratum.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8">
      {/* Native-style Sticky Tab Header - FotMob Inspired */}
      {!collegeFilter && !isCollegeAdmin && (
        <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] transition-theme">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 px-4">
            <button 
                onClick={() => handleTabClick('Global')} 
                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 border ${
                  activeTab === 'Global' 
                  ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'
                }`}
              >
                Global
            </button>
            {COLLEGES_LIST.map((c) => {
              const isLocked = !isSubscribed && c !== user.college;
              return (
                <button 
                  key={c} 
                  onClick={() => handleTabClick(c)} 
                  className={`flex items-center gap-2 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 border ${
                    activeTab === c 
                    ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'
                  } ${isLocked ? 'opacity-70' : ''}`}
                >
                  {c}
                  {isLocked && <Lock size={12} className="text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 mt-4 lg:mt-0">
         <div className="lg:col-span-8 space-y-4 lg:space-y-8 p-3 lg:p-0">
            {/* Native Post Composer */}
            {(!isCollegeAdmin || activeCollege) && (
              <div className="glass-card p-4 lg:p-6 rounded-[2rem] lg:rounded-4xl border-[var(--border-color)] shadow-sm bg-[var(--card-bg)]">
                 <div className="flex gap-3 lg:gap-4">
                    <img src={user.avatar} className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl object-cover border border-[var(--border-color)] bg-white" />
                    <textarea 
                      value={newPostContent} 
                      onChange={e => setNewPostContent(e.target.value)} 
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm lg:text-[15px] font-medium resize-none h-16 lg:h-20 placeholder:text-slate-400 text-[var(--text-primary)]" 
                      placeholder={`Post to ${activeCollege || 'the Hill'}...`} 
                    />
                 </div>
                 {rejectionMessage && (
                   <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase">
                      <ShieldAlert size={14}/> {rejectionMessage}
                   </div>
                 )}
                 {selectedImage && (
                    <div className="mt-3 relative w-20 h-20 rounded-xl overflow-hidden group">
                       <img src={selectedImage} className="w-full h-full object-cover" />
                       <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={20}/></button>
                    </div>
                 )}
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-color)]">
                    <div className="flex gap-4">
                      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[9px] font-black uppercase tracking-widest active:scale-95"><ImageIcon size={18}/> Photo</button>
                    </div>
                    <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-indigo-600/20">
                       {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>} Broadcast
                    </button>
                 </div>
              </div>
            )}

            {/* Content Stream */}
            <div className="space-y-4 lg:space-y-8">
               {posts.map(post => {
                 const linkedEvent = calendarEvents.find(e => e.id === post.eventId);
                 const isRegistered = linkedEvent?.attendeeIds?.includes(user.id);
                 const isAuthor = post.authorId === user.id;
                 const isEditing = editingPostId === post.id;
                 
                 return (
                  <article key={post.id} className={`glass-card p-0 overflow-hidden border-[var(--border-color)] shadow-sm rounded-[2rem] lg:rounded-4xl transition-all ${post.isEventBroadcast ? 'ring-2 ring-indigo-500/10' : ''}`}>
                     <div className="p-4 lg:p-8">
                       <div className="flex justify-between items-start mb-4 lg:mb-6">
                          <div className="flex items-center gap-3 lg:gap-4">
                             <img src={post.authorAvatar} className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl border border-[var(--border-color)] object-cover bg-white" />
                             <div>
                                <div className="flex items-center">
                                   <h4 className="font-extrabold text-[var(--text-primary)] text-[13px] lg:text-sm uppercase tracking-tight leading-none">{post.author}</h4>
                                   <AuthoritySeal role={post.authorAuthority} />
                                </div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{post.timestamp} • {post.college}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {isAuthor && !isEditing && (
                               <button onClick={() => {setEditingPostId(post.id); setEditContent(post.content);}} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-90">
                                  <Edit3 size={16}/>
                               </button>
                             )}
                             <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2 py-1 rounded-lg text-slate-500 border border-[var(--border-color)]">
                               {post.aiMetadata?.category || 'Pulse'}
                             </span>
                          </div>
                       </div>
                       
                       {isEditing ? (
                         <div className="space-y-4">
                           <textarea 
                             value={editContent} 
                             onChange={e => setEditContent(e.target.value)} 
                             className="w-full bg-[var(--bg-secondary)] border border-indigo-600/30 rounded-2xl p-4 text-[var(--text-primary)] text-sm font-medium outline-none h-24"
                           />
                           <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingPostId(null)} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase text-slate-500">Cancel</button>
                              <button onClick={() => saveEdit(post)} disabled={isSavingEdit} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest">
                                {isSavingEdit ? 'Saving...' : 'Update'}
                              </button>
                           </div>
                         </div>
                       ) : (
                         <p className="text-[var(--text-primary)] text-[15px] lg:text-base font-medium leading-relaxed mb-4 whitespace-pre-wrap">
                           {post.content}
                         </p>
                       )}
                     </div>

                     {post.images && post.images.length > 0 && (
                       <div className="px-0 lg:px-8 pb-4 lg:pb-8">
                          <div className="lg:rounded-[2rem] overflow-hidden border-y lg:border border-[var(--border-color)] bg-slate-100 dark:bg-black/40">
                            <img src={post.images[0]} className="w-full object-cover max-h-[500px]" alt="Visual Asset" />
                          </div>
                       </div>
                     )}

                     {post.isEventBroadcast && (
                        <div className="px-4 lg:px-8 pb-4 lg:pb-8">
                           <div className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Calendar size={100}/></div>
                              <h3 className="text-xl font-black uppercase tracking-tight leading-tight">{post.eventTitle}</h3>
                              <div className="flex flex-wrap gap-4 mt-4">
                                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><Clock size={14}/> {post.eventTime}</div>
                                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><MapPin size={14}/> {post.eventLocation}</div>
                              </div>
                              <button 
                                onClick={() => post.eventId && handleRegister(post.eventId)}
                                disabled={isRegistered}
                                className={`mt-6 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 ${isRegistered ? 'bg-emerald-500' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                              >
                                {isRegistered ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                                {isRegistered ? 'IDENTITY LOGGED' : 'REGISTER NOW'}
                              </button>
                           </div>
                        </div>
                     )}

                     <div className="px-4 lg:px-8 py-4 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-6 lg:gap-10">
                           <button className="flex items-center gap-1.5 text-slate-500 active:scale-125 transition-all group">
                             <Heart size={20} className="group-hover:fill-rose-500" /> 
                             <span className="text-[11px] font-black">{post.likes}</span>
                           </button>
                           <button className="flex items-center gap-1.5 text-slate-500 active:scale-110 transition-all">
                             <MessageCircle size={20}/> 
                             <span className="text-[11px] font-black">{post.commentsCount}</span>
                           </button>
                           <button className="flex items-center gap-2 text-slate-500 active:scale-110 transition-all">
                             <Share2 size={18}/>
                           </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Eye size={16}/> 
                           <span className="text-[9px] font-black tracking-widest uppercase">{post.views || 0} Scans</span>
                        </div>
                     </div>
                  </article>
                 );
               })}
            </div>
         </div>

         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-20">
            <div className="glass-card p-8 border-[var(--border-color)] shadow-xl bg-[var(--sidebar-bg)] rounded-[2.5rem] overflow-hidden">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-8 border-b border-[var(--border-color)] pb-4">
                 <TrendingUp size={18} className="text-indigo-600"/> Featured Registry
               </h3>
               <div className="space-y-6">
                  {calendarEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex flex-col items-center justify-center border border-indigo-600/20 group-hover:bg-indigo-600 transition-colors">
                          <span className="text-xs font-black text-indigo-600 group-hover:text-white leading-none">{ev.date.split('-')[2]}</span>
                          <span className="text-[7px] font-black uppercase text-indigo-400 group-hover:text-indigo-200 mt-0.5">{new Date(ev.date).toLocaleString('default', {month: 'short'})}</span>
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{ev.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{ev.location}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all">
                 View Full Calendar
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
