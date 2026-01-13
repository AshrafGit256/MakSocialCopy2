import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, Poll, CalendarEvent, CollegeStats } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { COLLEGE_BANNERS } from '../constants';
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight, ArrowRight, CheckCircle2, Youtube,
  Calendar, MapPin, Clock, TrendingUp, Hash, Plus, FileText, Lock
} from 'lucide-react';

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-rose-500 font-black animate-pulse uppercase tracking-widest text-[8px]">Event Live / Past</span>;

  return (
    <div className="flex gap-2">
      {[
        { v: timeLeft.d, l: 'd' },
        { v: timeLeft.h, l: 'h' },
        { v: timeLeft.m, l: 'm' },
        { v: timeLeft.s, l: 's' }
      ].map((item, i) => (
        <div key={i} className="bg-black/5 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-lg px-2 py-1.5 flex flex-col items-center min-w-[32px]">
           <span className="text-[12px] font-black text-indigo-600 dark:text-white leading-tight">{item.v}</span>
           <span className="text-[6px] uppercase font-bold text-slate-500 dark:text-slate-400">{item.l}</span>
        </div>
      ))}
    </div>
  );
};

const CategoryTag: React.FC<{ category?: string, isAd?: boolean, isMakTV?: boolean, isEvent?: boolean }> = ({ category, isAd, isMakTV, isEvent }) => {
  if (isEvent) return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider">
      <Calendar size={10} /> Campus Event
    </div>
  );
  if (isMakTV) return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">
      <Tv size={10} /> MakTV
    </div>
  );
  if (isAd) return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[8px] font-black uppercase tracking-wider">
      <Sparkles size={10} /> AD
    </div>
  );

  const styles: Record<string, string> = {
    Urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20",
    Academic: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border-indigo-500/20",
    Career: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20",
    Social: "bg-slate-500/10 text-slate-600 dark:text-slate-500 border-slate-500/10"
  };
  const Icons: Record<string, any> = { Urgent: AlertCircle, Academic: GraduationCap, Career: Briefcase, Social: Users };
  const Icon = Icons[category || 'Social'] || Users;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider ${styles[category || 'Social']}`}>
      <Icon size={10} className={category === 'Urgent' ? 'animate-pulse' : ''} />
      {category || 'Social'}
    </div>
  );
};

const VideoPlayer: React.FC<{ src?: string, isAutoPlay?: boolean }> = ({ src, isAutoPlay = false }) => {
  if (!src) return null;
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be') || src.includes('embed/');
  if (isYoutube) return (
    <div className="w-full h-full">
      <iframe className="w-full h-full border-none" src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
  return <video src={src} className="w-full h-full object-cover" controls={!isAutoPlay} autoPlay={isAutoPlay} muted={isAutoPlay} loop={isAutoPlay} />;
};

interface FeedProps {
  collegeFilter?: College;
  targetPostId?: string | null;
  onClearTarget?: () => void;
}

const Feed: React.FC<FeedProps> = ({ collegeFilter, targetPostId, onClearTarget }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [collegeStats, setCollegeStats] = useState<CollegeStats[]>(db.getCollegeStats());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{url: string, file: File} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  
  const postRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const sync = () => {
      const currentUser = db.getUser();
      setUser(currentUser);
      
      const currentFilter = collegeFilter || activeTab;
      // Strict feed isolation: College wings only show college content. Global Pulse only shows global content + ads/tv.
      const allPosts = db.getPosts(currentFilter as any);
      setPosts(allPosts);
      
      setCollegeStats(db.getCollegeStats());
      setActivePoll(db.getPolls().find(p => p.isActive) || null);
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, [activeTab, collegeFilter, user.id]);

  useEffect(() => {
    if (targetPostId && postRefs.current[targetPostId]) {
      postRefs.current[targetPostId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => {
        if (onClearTarget) onClearTarget();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [targetPostId, posts]);

  const handleJoinCollege = (collegeId: College) => {
    db.joinCollege(user.id, collegeId);
    setUser(db.getUser());
    setCollegeStats(db.getCollegeStats());
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia) return;
    setIsAnalyzing(true);
    setRejectionMessage(null);

    let imageBase64, mimeType;
    if (selectedMedia) {
      const reader = new FileReader();
      imageBase64 = await new Promise<string>((res) => {
        reader.onload = () => res((reader.result as string).split(',')[1]);
        reader.readAsDataURL(selectedMedia.file);
      });
      mimeType = selectedMedia.file.type;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: `Evaluate this content. Return JSON {category: Academic/Social/Career/Urgent, isSafe: boolean, safetyReason: string}. Content: "${newPostContent}"` }];
      if (imageBase64) parts.push({ inlineData: { data: imageBase64, mimeType } });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: { responseMimeType: "application/json" }
      });
      
      const aiResult = JSON.parse(response.text);
      setIsAnalyzing(false);

      if (!aiResult.isSafe) {
        setRejectionMessage(aiResult.safetyReason || 'Policy violation.');
        return;
      }

      const currentFilter = collegeFilter || activeTab;
      const newPost: Post = {
        id: Date.now().toString(), author: user.name, authorId: user.id,
        authorRole: user.role, authorAvatar: user.avatar, timestamp: 'Just now',
        content: newPostContent, images: selectedMedia ? [selectedMedia.url] : undefined,
        hashtags: [`#${currentFilter}`], likes: 0, commentsCount: 0, comments: [], views: 1,
        flags: [], isOpportunity: aiResult.category === 'Career', college: currentFilter as any,
        aiMetadata: { category: aiResult.category, isSafe: true, sentiment: 'Neutral' }
      };

      db.addPost(newPost);
      setNewPostContent('');
      setSelectedMedia(null);
      setPosts(db.getPosts(currentFilter as any));
    } catch (e) {
      setIsAnalyzing(false);
      setRejectionMessage("Security protocol failure.");
    }
  };

  const COLLEGES: (College | 'Global')[] = ['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  const collegeBanner = activeCollege ? COLLEGE_BANNERS[activeCollege] : null;
  const currentCollegeStats = activeCollege ? collegeStats.find(s => s.id === activeCollege) : null;
  const hasJoined = activeCollege ? user.joinedColleges.includes(activeCollege) : true;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
            <h2 className="text-3xl font-extrabold tracking-tighter text-[var(--text-primary)] uppercase">
              {activeCollege ? `${activeCollege} WING` : 'GLOBAL PULSE'}
            </h2>
            {!collegeFilter && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full sm:max-w-[420px] p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-inner transition-theme">
                {COLLEGES.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setActiveTab(c)} 
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${
                      activeTab === c 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* College Profile Header (Gated Logic) */}
          {activeCollege && (
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-xl mb-10 group bg-[var(--sidebar-bg)]">
               <div className="h-64 sm:h-80 relative">
                  <img src={collegeBanner!} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={`${activeCollege} Banner`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
               </div>
               
               <div className="p-8 -mt-24 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[1.5rem] border-4 border-white dark:border-slate-900 shadow-2xl flex items-center justify-center font-black text-3xl text-indigo-600">
                           {activeCollege[0]}
                        </div>
                        <div className="pt-8">
                           <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{activeCollege}</h1>
                           <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">{currentCollegeStats?.dean || 'Head of Department'}</p>
                        </div>
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 text-sm italic font-medium max-w-md">"{currentCollegeStats?.description}"</p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                     <div className="flex gap-8 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="text-center">
                           <p className="text-xl font-black text-white leading-none">{currentCollegeStats?.followers.toLocaleString()}</p>
                           <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Followers</p>
                        </div>
                        <div className="text-center">
                           <p className="text-xl font-black text-white leading-none">{currentCollegeStats?.postCount.toLocaleString()}</p>
                           <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Posts</p>
                        </div>
                     </div>
                     
                     <button 
                        onClick={() => !hasJoined && handleJoinCollege(activeCollege)}
                        disabled={hasJoined}
                        className={`px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-2 active:scale-95 ${
                           hasJoined 
                           ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                           : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                        }`}
                     >
                        {hasJoined ? <CheckCircle2 size={16}/> : <Plus size={16}/>}
                        {hasJoined ? 'Identity Synced' : 'Join Community Node'}
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Conditional Content Gating */}
          {!hasJoined ? (
            <div className="glass-card py-32 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-[var(--border-color)] bg-transparent opacity-60">
               <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-full"><Lock size={48} className="text-slate-400" /></div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tighter">Encrypted Signal Channel</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">You must join this community node to decrypt and access local broadcasts.</p>
               </div>
               <button 
                 onClick={() => handleJoinCollege(activeCollege!)}
                 className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
               >
                 Authorize Connection Now
               </button>
            </div>
          ) : (
            <>
              {/* New Post Box */}
              <div className="glass-card p-6 relative overflow-hidden bg-[var(--card-bg)] shadow-sm border-[var(--border-color)] transition-theme">
                {rejectionMessage && (
                  <div className="absolute inset-0 bg-rose-950/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
                    <ShieldAlert size={32} className="text-rose-500 mb-2" />
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Protocol Breach</h3>
                    <p className="text-rose-200 text-[10px] mt-1 leading-relaxed max-w-xs">{rejectionMessage}</p>
                    <button onClick={() => setRejectionMessage(null)} className="mt-5 px-6 py-2.5 bg-white text-rose-950 font-black rounded-lg text-[9px] uppercase tracking-widest hover:scale-105 transition-transform">Dismiss</button>
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                   <img src={user.avatar} className="w-11 h-11 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" />
                   <textarea className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none min-h-[80px] placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast what's happening at ${activeCollege || 'the Hill'}...`} value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
                </div>
                <div className="flex items-center justify-between mt-3 pt-4 border-t border-[var(--border-color)]">
                   <button onClick={() => {
                     const input = document.createElement('input');
                     input.type = 'file';
                     input.onchange = (e: any) => {
                       const file = e.target.files[0];
                       if (file) setSelectedMedia({ url: URL.createObjectURL(file), file });
                     };
                     input.click();
                   }} className="p-2.5 text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><ImageIcon size={18}/> Asset</button>
                   <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)} className="bg-indigo-600 px-10 py-3.5 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95">
                     {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16}/>} 
                     Publish Signal
                   </button>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map(post => {
                  const isArticle = post.content.length > 200 && !post.images?.length;
                  const hasImages = (post.images?.length || 0) > 0;
                  const isTargeted = targetPostId === post.id;

                  return (
                    <article 
                      key={post.id} 
                      ref={el => { postRefs.current[post.id] = el; }}
                      className={`glass-card overflow-hidden transition-all duration-700 shadow-sm border-[var(--border-color)] ${
                        isTargeted ? 'ring-2 ring-indigo-600 shadow-2xl scale-[1.02] z-10' : ''
                      } ${post.isAd ? 'bg-amber-500/[0.04] border-amber-500/20' : post.isEventBroadcast ? 'bg-emerald-500/[0.02] border-emerald-500/20' : ''}`}
                    >
                      {hasImages && (
                        <div className="relative aspect-video overflow-hidden group/img-post">
                           <img src={post.images![0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img-post:scale-105" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                           <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <img src={post.authorAvatar} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20" />
                                 <div className="text-white">
                                    <h4 className="text-[12px] font-black uppercase tracking-tight">{post.author}</h4>
                                    <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                                 </div>
                              </div>
                              <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} isEvent={post.isEventBroadcast} />
                           </div>
                        </div>
                      )}

                      <div className="p-8 space-y-4">
                        {!hasImages && (
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <img src={post.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" />
                              <div>
                                <h4 className={`text-[13px] font-extrabold tracking-tight ${post.isAd ? 'text-amber-600' : post.isEventBroadcast ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>{post.author}</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                              </div>
                            </div>
                            <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} isEvent={post.isEventBroadcast} />
                          </div>
                        )}

                        <div className={`${isArticle ? 'bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-inner' : ''}`}>
                          {isArticle && (
                            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                               <FileText size={14}/> Long Form Insight
                            </div>
                          )}
                          <p className={`text-[var(--text-primary)] leading-relaxed ${
                            isArticle ? 'text-xl font-serif italic' : 'text-base font-medium'
                          }`}>
                            "{post.content}"
                          </p>
                        </div>
                        
                        {post.isEventBroadcast && (
                          <div className="rounded-[2.5rem] overflow-hidden border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 p-8 space-y-6 relative group/event mt-4">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-1">
                                   <h3 className="text-2xl font-black text-emerald-900 dark:text-white uppercase tracking-tighter leading-tight">{post.eventTitle}</h3>
                                   <div className="flex flex-wrap gap-5 mt-2">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest"><MapPin size={14}/> {post.eventLocation}</div>
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Clock size={14}/> {post.eventTime} • {post.eventDate}</div>
                                   </div>
                                </div>
                                {post.eventDate && <Countdown targetDate={`${post.eventDate}T${post.eventTime || '00:00'}:00`} />}
                             </div>
                          </div>
                        )}

                        {post.video && (
                          <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black aspect-video relative group/video shadow-lg mt-4">
                            <VideoPlayer src={post.video} />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                          <div className="flex items-center gap-10">
                            <button onClick={() => db.likePost(post.id)} className="flex items-center gap-3 text-slate-500 hover:text-rose-500 transition-colors group">
                              <Heart size={22} className="group-active:scale-125 transition-transform" /> <span className="text-[13px] font-black">{post.likes.toLocaleString()}</span>
                            </button>
                            <button className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors">
                              <MessageCircle size={22} /> <span className="text-[13px] font-black">{post.commentsCount}</span>
                            </button>
                            <div className="flex items-center gap-3 text-slate-400">
                              <Eye size={22} /> <span className="text-[13px] font-black">{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-indigo-600 p-2 bg-[var(--bg-secondary)] rounded-xl"><MoreHorizontal size={20}/></button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-8 sticky top-8 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
           {activePoll && (
             <div className="glass-card p-6 border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-sm transition-theme">
                <div className="flex items-center gap-3 mb-5">
                   <div className="p-2 bg-indigo-600 rounded-lg text-white"><CheckCircle2 size={16}/></div>
                   <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Campus Pulse Poll</h3>
                </div>
                <p className="text-sm font-black text-[var(--text-primary)] mb-6 leading-snug">"{activePoll.question}"</p>
             </div>
           )}
           <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <TrendingUp size={14} className="text-indigo-600"/> High Density Signals
              </h3>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default Feed;
