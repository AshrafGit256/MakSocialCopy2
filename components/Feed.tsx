
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, CalendarEvent } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, X, 
  Loader2, Eye, ShieldAlert, Zap, 
  GraduationCap, CheckCircle2, Calendar, 
  MapPin, Clock, TrendingUp, Plus, ShieldCheck, Trash2, Edit3, 
  Star, Verified, Share2, Shield as ShieldIcon, Users, Lock, ChevronRight, Hash
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

  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8">
      {/* Sticky GitHub-style Navigator */}
      {!collegeFilter && !isCollegeAdmin && (
        <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 px-4">
            <button 
                onClick={() => setActiveTab('Global')} 
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 border ${
                  activeTab === 'Global' 
                  ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'
                }`}
              >
                Global Pulse
            </button>
            {COLLEGES_LIST.map((c) => {
              const isLocked = !isSubscribed && c !== user.college;
              return (
                <button 
                  key={c} 
                  onClick={() => !isLocked && setActiveTab(c)} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeTab === c 
                    ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-500/30'
                  } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {c}
                  {isLocked && <Lock size={12} className="text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 mt-6 lg:mt-4">
         <div className="lg:col-span-8 space-y-6 p-4 lg:p-0">
            {/* Modern Activity Composer */}
            {(!isCollegeAdmin || activeCollege) && (
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[1.5rem] p-6 shadow-sm">
                 <div className="flex gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white shrink-0" />
                    <div className="flex-1 space-y-4">
                      <textarea 
                        value={newPostContent} 
                        onChange={e => setNewPostContent(e.target.value)} 
                        className="w-full bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none min-h-[80px] placeholder:text-slate-400 text-[var(--text-primary)]" 
                        placeholder={`Broadcast signal to ${activeCollege || 'the Hill'}...`} 
                      />
                      {selectedImage && (
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden group border border-[var(--border-color)]">
                          <img src={selectedImage} className="w-full h-full object-cover" />
                          <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={20}/></button>
                        </div>
                      )}
                    </div>
                 </div>
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex gap-4">
                      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors"><ImageIcon size={18}/> Image</button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors"><Hash size={18}/> Hashtag</button>
                    </div>
                    <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-indigo-600/20">
                       {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>} Broadcast
                    </button>
                 </div>
              </div>
            )}

            {/* High-Density GitHub-Style Feed */}
            <div className="space-y-6">
               {posts.map(post => {
                 const linkedEvent = calendarEvents.find(e => e.id === post.eventId);
                 const isRegistered = linkedEvent?.attendeeIds?.includes(user.id);
                 const isAuthor = post.authorId === user.id;
                 const isEditing = editingPostId === post.id;
                 
                 return (
                  <article key={post.id} className="group relative">
                     {/* Vertical Connective Line (GitHub Style) */}
                     <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-[var(--border-color)] group-last:hidden"></div>
                     
                     <div className="flex gap-4">
                        <img src={post.authorAvatar} className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white object-cover shrink-0 z-10" />
                        
                        <div className="flex-1 min-w-0 space-y-3">
                           {/* Activity Header */}
                           <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter">
                              <span className="text-indigo-600 hover:underline cursor-pointer">{post.author}</span>
                              <span className="text-slate-400 font-bold">/</span>
                              <span className="text-slate-500">{post.college}</span>
                              <AuthoritySeal role={post.authorAuthority} size="sm" />
                              <span className="text-slate-400 font-medium ml-2 font-mono text-[9px] lowercase tracking-normal">{post.timestamp}</span>
                           </div>

                           {/* Content Card (GitHub Style Box) */}
                           <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[1.25rem] shadow-sm overflow-hidden transition-all hover:border-indigo-500/40">
                              <div className="p-5 lg:p-6 space-y-4">
                                 {isEditing ? (
                                   <div className="space-y-3">
                                     <textarea 
                                       value={editContent} 
                                       onChange={e => setEditContent(e.target.value)} 
                                       className="w-full bg-[var(--bg-secondary)] border border-indigo-600/30 rounded-xl p-4 text-[var(--text-primary)] text-sm font-medium outline-none h-24"
                                     />
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingPostId(null)} className="text-[10px] font-black uppercase text-slate-500 px-4 py-2">Cancel</button>
                                        <button onClick={() => saveEdit(post)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest">Update</button>
                                     </div>
                                   </div>
                                 ) : (
                                   <p className="text-[var(--text-primary)] text-[14px] leading-relaxed font-medium">
                                     {post.content}
                                   </p>
                                 )}

                                 {post.images && post.images.length > 0 && (
                                   <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-50 dark:bg-black/20">
                                      <img src={post.images[0]} className="w-full object-cover max-h-[450px]" alt="Activity visual" />
                                   </div>
                                 )}

                                 {post.isEventBroadcast && (
                                    <div className="p-6 bg-indigo-600 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-600/20">
                                       <div className="space-y-2 text-center md:text-left">
                                          <h3 className="text-lg font-black uppercase tracking-tight leading-none">{post.eventTitle}</h3>
                                          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest opacity-80">
                                             <span className="flex items-center gap-1.5"><Clock size={12}/> {post.eventTime}</span>
                                             <span className="flex items-center gap-1.5"><MapPin size={12}/> {post.eventLocation}</span>
                                          </div>
                                       </div>
                                       <button 
                                         onClick={() => post.eventId && handleRegister(post.eventId)}
                                         className={`px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${isRegistered ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 hover:bg-slate-100'}`}
                                       >
                                         {isRegistered ? 'Registered' : 'Initialize Entrance'}
                                       </button>
                                    </div>
                                 )}
                              </div>

                              {/* Footer Stats / Actions (GitHub Style) */}
                              <div className="px-6 py-3 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                                       <Heart size={16} />
                                       <span className="text-[10px] font-bold font-mono">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                                       <MessageCircle size={16} />
                                       <span className="text-[10px] font-bold font-mono">{post.commentsCount}</span>
                                    </button>
                                    <button className="text-slate-400 hover:text-indigo-600">
                                       <Share2 size={16} />
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
                                       <Eye size={12}/> {post.views} scans
                                    </div>
                                    {isAuthor && (
                                       <button onClick={() => setEditingPostId(post.id)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={14}/></button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </article>
                 );
               })}
            </div>
         </div>

         {/* Right Sidebar - Trends & Activity */}
         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-20 h-fit">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[1.5rem] p-8 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                 <TrendingUp size={16} className="text-indigo-600"/> Featured Events
               </h3>
               <div className="space-y-6">
                  {calendarEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className="group cursor-pointer flex gap-4">
                       <div className="w-12 h-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                          <span className="text-[10px] font-black text-indigo-600 group-hover:text-white leading-none">{ev.date.split('-')[2]}</span>
                          <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-indigo-200">{new Date(ev.date).toLocaleString('default', {month: 'short'})}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight truncate group-hover:text-indigo-600">{ev.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{ev.location}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-all">
                 Browse Universal Registry
               </button>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[1.5rem] p-8 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Network Strata</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                     <span className="text-slate-500">Node Stratum</span>
                     <span className="text-indigo-600">{user.subscriptionTier}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600" style={{width: user.subscriptionTier === 'Free' ? '30%' : '100%'}}></div>
                  </div>
                  {user.subscriptionTier === 'Free' && (
                     <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Upgrade Identity</button>
                  )}
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
