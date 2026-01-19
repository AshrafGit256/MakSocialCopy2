
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, CollegeStats, LeadershipMember, AuthorityRole, CalendarEvent } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { COLLEGE_BANNERS } from '../constants';
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Zap, 
  GraduationCap, Briefcase, Tv, CheckCircle2, Calendar, 
  MapPin, Clock, TrendingUp, Plus, FileText, Lock,
  ShieldCheck, Trash2, Edit3, UserPlus, ShieldAlert as Shield,
  Star, Verified, Shield as ShieldIcon, ExternalLink, CalendarPlus,
  Bookmark, Share2
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
  const [collegeStats, setCollegeStats] = useState<CollegeStats[]>(db.getCollegeStats());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identity logic
  const isSuperAdmin = user.email?.toLowerCase().endsWith('@admin.mak.ac.ug');
  const userCollegeAdminMatch = user.email?.toLowerCase().match(/^admin\.([a-z]+)@mak\.ac\.ug$/);
  const userCollegeAdminId = userCollegeAdminMatch ? userCollegeAdminMatch[1].toUpperCase() as College : null;
  const isCollegeAdmin = !!userCollegeAdminId;

  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  
  useEffect(() => {
    if (isCollegeAdmin && activeTab === 'Global' && !collegeFilter) {
      setActiveTab(userCollegeAdminId as College);
    }
  }, [isCollegeAdmin, userCollegeAdminId, activeTab, collegeFilter]);

  const currentStats = activeCollege ? collegeStats.find(s => s.id === activeCollege) : null;
  const hasJoined = activeCollege ? (user.joinedColleges || []).includes(activeCollege) : true;
  const isAdminOfActiveCollege = isCollegeAdmin && activeCollege === userCollegeAdminId;

  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts(activeCollege || undefined));
      setCollegeStats(db.getCollegeStats());
      setCalendarEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, collegeFilter, user.id]);

  const handleJoin = (col: College) => {
    db.joinCollege(user.id, col);
    setUser(db.getUser());
    setCollegeStats(db.getCollegeStats());
  };

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, user.id);
    setCalendarEvents(db.getCalendarEvents());
    alert("Identity Validated: Registration successfully logged to the university registry.");
  };

  const addToCalendar = (event: Post) => {
    const title = encodeURIComponent(event.eventTitle || 'University Event');
    const details = encodeURIComponent(event.content || '');
    const location = encodeURIComponent(event.eventLocation || 'Makerere University');
    const dateStr = (event.eventDate || '').replace(/-/g, '');
    const startTime = `${dateStr}T${(event.eventTime || '00:00').replace(':', '')}00Z`;
    const endTime = startTime; // Assume 1 hour if not specified? Google link needs both.
    
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${startTime}`;
    window.open(googleUrl, '_blank');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
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

  const handleDelete = (pid: string) => {
    if (confirm("Remove content?")) {
      db.deletePost(pid, user.id);
      setPosts(db.getPosts(activeCollege || undefined));
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-32">
      {!collegeFilter && !isCollegeAdmin && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
          {['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map((c: any) => (
            <button key={c} onClick={() => setActiveTab(c)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            {(!isCollegeAdmin || activeCollege) && (
              <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
                 <div className="flex gap-4">
                    <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]" />
                    <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none h-24 placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast to ${activeCollege || 'the Hill'}...`} />
                 </div>
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex gap-4">
                      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest"><ImageIcon size={18}/> Asset</button>
                    </div>
                    <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} className="bg-indigo-600 text-white px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                       {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16}/>} Broadcast
                    </button>
                 </div>
              </div>
            )}

            <div className="space-y-8">
               {posts.map(post => {
                 const linkedEvent = calendarEvents.find(e => e.id === post.eventId);
                 const isRegistered = linkedEvent?.attendeeIds?.includes(user.id);
                 
                 return (
                  <article key={post.id} className={`glass-card p-0 overflow-hidden border-[var(--border-color)] shadow-sm hover:shadow-md transition-all ${post.isEventBroadcast ? 'ring-1 ring-indigo-500/30' : ''}`}>
                     {/* Header */}
                     <div className="p-8 pb-4">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <img src={post.authorAvatar} className="w-12 h-12 rounded-xl border border-[var(--border-color)] object-cover" />
                             <div>
                                <div className="flex items-center">
                                   <h4 className="font-extrabold text-[var(--text-primary)] text-sm uppercase tracking-tight">{post.author}</h4>
                                   <AuthoritySeal role={post.authorAuthority} />
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             {post.isEventBroadcast && (
                               <span className="text-[8px] font-black uppercase tracking-widest bg-amber-500 text-white px-2.5 py-1 rounded shadow-lg shadow-amber-500/20 flex items-center gap-1.5 animate-pulse">
                                  <Star size={10} fill="currentColor"/> MakEvent
                               </span>
                             )}
                             <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2 py-1 rounded text-slate-500 border border-[var(--border-color)]">
                               {post.isEventBroadcast ? 'Global Protocol' : (post.aiMetadata?.category || 'Signal')}
                             </span>
                          </div>
                       </div>
                       <p className="text-[var(--text-primary)] text-base font-medium leading-relaxed italic border-l-2 border-indigo-600/30 pl-6 py-1 mb-4">"{post.content}"</p>
                     </div>

                     {/* Event Flyer / Assets */}
                     {post.isEventBroadcast ? (
                       <div className="px-8 pb-8 space-y-6">
                          {post.eventFlyer && (
                            <div className="rounded-[2rem] overflow-hidden border border-[var(--border-color)] shadow-xl relative group/flyer">
                               <img src={post.eventFlyer} className="w-full h-80 object-cover transition-transform duration-700 group-hover/flyer:scale-105" alt="Event Flyer" />
                               <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent"></div>
                               <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                  <div>
                                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{post.eventTitle}</h3>
                                     <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1 text-[9px] font-black text-white/80 uppercase"><Calendar size={12}/> {post.eventDate}</div>
                                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                                        <div className="flex items-center gap-1 text-[9px] font-black text-white/80 uppercase"><Clock size={12}/> {post.eventTime}</div>
                                     </div>
                                  </div>
                                  <button onClick={() => addToCalendar(post)} className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all" title="Add to Calendar">
                                     <CalendarPlus size={20}/>
                                  </button>
                               </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="p-5 bg-indigo-600/5 rounded-2xl border border-indigo-600/10 flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-xl text-white"><MapPin size={20}/></div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Node</p>
                                   <p className="text-xs font-bold text-[var(--text-primary)]">{post.eventLocation}</p>
                                </div>
                             </div>
                             <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center gap-4">
                                <div className="p-3 bg-amber-500 rounded-xl text-white"><Users size={20}/></div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Engagement</p>
                                   <p className="text-xs font-bold text-[var(--text-primary)]">{linkedEvent?.attendeeIds?.length || 0} Registered</p>
                                </div>
                             </div>
                          </div>

                          <button 
                            onClick={() => post.eventId && handleRegister(post.eventId)}
                            disabled={isRegistered}
                            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all ${
                              isRegistered 
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 active:scale-[0.98]'
                            }`}
                          >
                             {isRegistered ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
                             {isRegistered ? 'Identity Validated & Logged' : 'Initialize Registration'}
                          </button>
                       </div>
                     ) : post.images && post.images.length > 0 && (
                       <div className="px-8 pb-8">
                          <div className="rounded-3xl overflow-hidden border border-[var(--border-color)]">
                            <img src={post.images[0]} className="w-full object-cover max-h-[600px]" alt="Post Asset" />
                          </div>
                       </div>
                     )}

                     {/* Footer Actions */}
                     <div className="px-8 py-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors"><Heart size={18}/> <span className="text-[10px] font-black">{post.likes}</span></button>
                           <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={18}/> <span className="text-[10px] font-black">{post.commentsCount}</span></button>
                           <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"><Share2 size={18}/></button>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                           <Eye size={16}/> <span className="text-[9px] font-black">{post.views?.toLocaleString() || 0} Nodes Scan</span>
                        </div>
                     </div>
                  </article>
                 );
               })}
            </div>
         </div>

         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-8">
            <div className="glass-card p-8 border-[var(--border-color)] shadow-sm bg-[var(--sidebar-bg)]">
               <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6"><TrendingUp size={16} className="text-indigo-600"/> High Density Nodes</h3>
               <div className="space-y-6">
                  {calendarEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className="flex gap-4 group cursor-pointer">
                       <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex flex-col items-center justify-center border border-indigo-600/20">
                          <span className="text-[10px] font-black text-indigo-600 leading-none">{ev.date.split('-')[2]}</span>
                          <span className="text-[7px] font-black uppercase text-indigo-400 mt-1">{new Date(ev.date).toLocaleString('default', {month: 'short'})}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{ev.title}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{ev.location}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all">View Full Registry</button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
