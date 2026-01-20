
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
  Bookmark, Share2, CalendarCheck, Save, Orbit, Brain
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  
  // Simplified to a blue checkmark badge per user request
  return (
    <div className="inline-flex items-center justify-center text-blue-500 ml-1 select-none" title={`Verified ${role}`}>
       <Verified size={size === 'sm' ? 14 : 18} fill="currentColor" className="text-blue-500" />
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
  
  useEffect(() => {
    if (isCollegeAdmin && activeTab === 'Global' && !collegeFilter) {
      setActiveTab(userCollegeAdminId as College);
    }
  }, [isCollegeAdmin, userCollegeAdminId, activeTab, collegeFilter]);

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

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, user.id);
    setCalendarEvents(db.getCalendarEvents());
  };

  const syncToInternalCalendar = (event: Post) => {
    const exists = calendarEvents.some(e => e.title === event.eventTitle && e.date === event.eventDate);
    if (exists) {
      alert("This event is already synchronized with your MakSocial Calendar.");
      return;
    }

    // Fixed property names mapping from Post type to CalendarEvent type
    const newCalendarEvent: CalendarEvent = {
      id: event.eventId || `post-ev-${Date.now()}`,
      title: event.eventTitle || 'University Event',
      description: event.content || '',
      date: event.eventDate || '',
      time: event.eventTime || '',
      location: event.eventLocation || 'Makerere University',
      image: event.eventFlyer,
      category: 'Social',
      createdBy: event.authorId,
      attendeeIds: []
    };

    db.saveCalendarEvent(newCalendarEvent);
    setCalendarEvents(db.getCalendarEvents());
    alert("Protocol Synchronized: Event added to your MakSocial Calendar registry.");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const startEditing = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditContent('');
  };

  const saveEdit = async (post: Post) => {
    if (!editContent.trim()) return;
    setIsSavingEdit(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let moderationPrompt = `Respond ONLY with JSON: {"isSafe": boolean, "reason": string}. Check if this edited text is safe: "${editContent}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: moderationPrompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{"isSafe": false, "reason": "Moderation error"}');
      if (!result.isSafe) {
        alert(`Content Moderation Rejection: ${result.reason}`);
        setIsSavingEdit(false);
        return;
      }

      const updatedPost: Post = {
        ...post,
        content: editContent,
        timestamp: `${post.timestamp} (Edited)`
      };

      db.updatePost(updatedPost);
      setPosts(db.getPosts(activeCollege || undefined));
      setEditingPostId(null);
      setEditContent('');
      setIsSavingEdit(false);
    } catch (e) {
      alert("System Error during broadcast modification.");
      setIsSavingEdit(false);
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
                    <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-[var(--border-color)] shadow-sm" />
                    <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none h-24 placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast to ${activeCollege || 'the Hill'}...`} />
                 </div>
                 {rejectionMessage && (
                   <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-bold uppercase tracking-tight">
                      <Shield size={16}/> {rejectionMessage}
                   </div>
                 )}
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
            )}

            <div className="space-y-8">
               {posts.map(post => {
                 const linkedEvent = calendarEvents.find(e => e.id === post.eventId);
                 const isRegistered = linkedEvent?.attendeeIds?.includes(user.id);
                 const isSynced = calendarEvents.some(e => e.title === post.eventTitle && e.date === post.eventDate);
                 const isAuthor = post.authorId === user.id;
                 const isEditing = editingPostId === post.id;
                 
                 return (
                  <article key={post.id} className={`glass-card p-0 overflow-hidden border-[var(--border-color)] shadow-sm hover:shadow-md transition-all ${post.isEventBroadcast ? 'ring-2 ring-indigo-500/20' : ''}`}>
                     <div className="p-8 pb-4">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <img src={post.authorAvatar} className="w-12 h-12 rounded-full border border-[var(--border-color)] object-cover shadow-sm" />
                             <div>
                                <div className="flex items-center">
                                   <h4 className="font-extrabold text-[var(--text-primary)] text-sm uppercase tracking-tight">{post.author}</h4>
                                   <AuthoritySeal role={post.authorAuthority} />
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             {isAuthor && !isEditing && (
                               <button onClick={() => startEditing(post)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/5 rounded-lg transition-all" title="Modify broadcast">
                                  <Edit3 size={16}/>
                               </button>
                             )}
                             {post.isEventBroadcast && (
                               <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-amber-500/30 animate-pulse border border-amber-400/50">
                                  <Star size={10} fill="currentColor"/>
                                  <span className="text-[8px] font-black uppercase tracking-widest">MakEvent</span>
                               </div>
                             )}
                             <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2.5 py-1.5 rounded-lg text-slate-500 border border-[var(--border-color)]">
                               {post.isEventBroadcast ? 'Official Command' : (post.aiMetadata?.category || 'Pulse Signal')}
                             </span>
                          </div>
                       </div>
                       
                       {isEditing ? (
                         <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                           <textarea 
                             value={editContent} 
                             onChange={e => setEditContent(e.target.value)} 
                             className="w-full bg-[var(--bg-secondary)] border border-indigo-600/30 rounded-2xl p-6 text-[var(--text-primary)] text-base font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 min-h-[120px] transition-all"
                           />
                           <div className="flex justify-end gap-3">
                              <button onClick={cancelEditing} className="px-6 py-2.5 rounded-xl border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                              <button onClick={() => saveEdit(post)} disabled={isSavingEdit || !editContent.trim()} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20">
                                 {isSavingEdit ? <Loader2 size={14} className="animate-spin" /> : <Save size={14}/>} Save Changes
                              </button>
                           </div>
                         </div>
                       ) : (
                         <p className="text-[var(--text-primary)] text-base font-normal leading-relaxed border-l-4 border-indigo-600/40 pl-6 py-2 mb-4 bg-indigo-600/5 rounded-r-2xl font-sans">
                           {post.content}
                         </p>
                       )}
                     </div>

                     {post.isEventBroadcast ? (
                       <div className="px-8 pb-8 space-y-6">
                          {post.eventFlyer && (
                            <div className="rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-2xl relative group/flyer">
                               <img src={post.eventFlyer} className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover/flyer:scale-105" alt="Event Flyer" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                               <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                                  <div>
                                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{post.eventTitle}</h3>
                                     <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20"><Calendar size={14}/> {post.eventDate}</div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20"><Clock size={14}/> {post.eventTime}</div>
                                     </div>
                                  </div>
                                  <button 
                                    onClick={() => syncToInternalCalendar(post)} 
                                    className={`p-4 rounded-2xl border backdrop-blur-xl transition-all group/cal shadow-xl ${
                                      isSynced 
                                      ? 'bg-emerald-500/80 text-white border-emerald-400' 
                                      : 'bg-white/10 text-white border-white/20 hover:bg-white/30 active:scale-95'
                                    }`}
                                    title={isSynced ? "Event Synchronized" : "Add to MakSocial Calendar"}
                                  >
                                     {isSynced ? <CalendarCheck size={24} /> : <CalendarPlus size={24} className="group-hover/cal:scale-110 transition-transform" />}
                                  </button>
                               </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="p-5 bg-indigo-600/5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 hover:border-indigo-500/30 transition-colors">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20"><MapPin size={20}/></div>
                                <div className="min-w-0">
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Venue Protocol</p>
                                   <p className="text-sm font-bold text-[var(--text-primary)] truncate">{post.eventLocation}</p>
                                </div>
                             </div>
                             <div className="p-5 bg-amber-500/5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 hover:border-amber-500/30 transition-colors">
                                <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20"><Users size={20}/></div>
                                <div className="min-w-0">
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Engagement</p>
                                   <p className="text-sm font-bold text-[var(--text-primary)]">{linkedEvent?.attendeeIds?.length || 0} Identities Validated</p>
                                </div>
                             </div>
                          </div>

                          <button 
                            onClick={() => post.eventId && handleRegister(post.eventId)}
                            disabled={isRegistered}
                            className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl transition-all ${
                              isRegistered 
                              ? 'bg-emerald-600 text-white shadow-emerald-500/30 cursor-default' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/40 active:scale-[0.98]'
                            }`}
                          >
                             {isRegistered ? <CheckCircle2 size={20} className="animate-in zoom-in duration-300" /> : <Zap size={20} />}
                             {isRegistered ? 'Registration Sequence Complete' : 'Initialize Event Registration'}
                          </button>
                       </div>
                     ) : post.images && post.images.length > 0 && (
                       <div className="px-8 pb-8">
                          <div className="rounded-[2rem] overflow-hidden border border-[var(--border-color)] group/img shadow-xl">
                            <img src={post.images[0]} className="w-full object-cover max-h-[600px] hover:scale-[1.03] transition-transform duration-700" alt="Broadcast Content" />
                          </div>
                       </div>
                     )}

                     <div className="px-8 py-6 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-10">
                           <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                             <Heart size={20} className="group-hover:fill-rose-500 group-active:scale-125 transition-all" /> 
                             <span className="text-11px] font-black">{post.likes}</span>
                           </button>
                           <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                             <MessageCircle size={20}/> 
                             <span className="text-[11px] font-black">{post.commentsCount}</span>
                           </button>
                           <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                             <Share2 size={20}/>
                           </button>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-400">
                           <Eye size={18}/> 
                           <span className="text-[9px] font-black tracking-widest">{post.views?.toLocaleString() || 0} NETWORK SCANS</span>
                        </div>
                     </div>
                  </article>
                 );
               })}
            </div>
         </div>

         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-8">
            {/* New Innovation Score Card */}
            <div className="glass-card p-8 bg-indigo-600 text-white border-indigo-500 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70">Intelligence Velocity</h3>
                    <p className="text-4xl font-black mt-2">{user.iqCredits || 0} IQ-C</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl">
                    <Brain size={24}/>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-80">
                     <span>Platform Capacity</span>
                     <span>Elite Node</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white w-3/4 animate-pulse"></div>
                  </div>
               </div>
               <button className="w-full mt-6 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                 <Orbit size={14}/> Re-Sync Synapse
               </button>
            </div>

            <div className="glass-card p-8 border-[var(--border-color)] shadow-xl bg-[var(--sidebar-bg)] overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar size={80}/></div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-8 border-b border-[var(--border-color)] pb-4">
                 <TrendingUp size={18} className="text-indigo-600"/> High Fidelity Nodes
               </h3>
               <div className="space-y-8">
                  {calendarEvents.slice(0, 4).map(ev => (
                    <div key={ev.id} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform relative">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex flex-col items-center justify-center border border-indigo-600/20 group-hover:bg-indigo-600 transition-colors shadow-sm">
                          <span className="text-xs font-black text-indigo-600 group-hover:text-white leading-none">{ev.date.split('-')[2]}</span>
                          <span className="text-[8px] font-black uppercase text-indigo-400 group-hover:text-indigo-200 mt-1">{new Date(ev.date).toLocaleString('default', {month: 'short'})}</span>
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-xs font-black text-[var(--text-primary)] truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{ev.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <MapPin size={10} className="text-slate-400"/>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{ev.location}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-transparent transition-all shadow-inner">
                 Access Full University Registry
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
