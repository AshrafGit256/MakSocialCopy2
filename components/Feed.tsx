
import React, { useState, useEffect } from 'react';
import { Post, User, College, Poll, CalendarEvent } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight, ArrowRight, CheckCircle2, Youtube,
  Calendar, MapPin, Clock, TrendingUp, Hash, Plus
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
  if (isEvent) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider">
        <Calendar size={10} />
        Campus Event
      </div>
    );
  }
  if (isMakTV) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider">
        <Tv size={10} />
        MakTV
      </div>
    );
  }
  if (isAd) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[8px] font-black uppercase tracking-wider">
        <Sparkles size={10} />
        AD
      </div>
    );
  }

  const styles: Record<string, string> = {
    Urgent: "bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20",
    Academic: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border-indigo-500/20",
    Career: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20",
    Social: "bg-slate-500/10 text-slate-600 dark:text-slate-500 border-slate-500/10"
  };
  const Icons: Record<string, any> = {
    Urgent: AlertCircle,
    Academic: GraduationCap,
    Career: Briefcase,
    Social: Users
  };
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
  if (isYoutube) {
    return (
      <div className="w-full h-full">
        <iframe className="w-full h-full border-none" src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return <video src={src} className="w-full h-full object-cover" controls={!isAutoPlay} autoPlay={isAutoPlay} muted={isAutoPlay} loop={isAutoPlay} />;
};

interface FeedProps {
  collegeFilter?: College;
}

const Feed: React.FC<FeedProps> = ({ collegeFilter }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{url: string, file: File} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const sync = () => {
      let allPosts = db.getPosts();
      const currentFilter = collegeFilter || activeTab;
      if (currentFilter !== 'Global') {
        allPosts = allPosts.filter(p => p.college === currentFilter || p.isAd || p.isMakTV || p.isEventBroadcast);
      }
      setPosts(allPosts);
      
      const polls = db.getPolls();
      setActivePoll(polls.find(p => p.isActive) || null);
      
      const events = db.getCalendarEvents();
      setUpcomingEvents(events.slice(0, 3));

      const users = db.getUsers();
      setSuggestedUsers(users.filter(u => u.id !== user.id).slice(0, 3));
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, [activeTab, collegeFilter, user.id]);

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
      const parts: any[] = [{ text: `Evaluate this university content. Return JSON {category: Academic/Social/Career/Urgent, isSafe: boolean, safetyReason: string}. Content: "${newPostContent}"` }];
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
        db.saveViolation({
          id: Date.now().toString(), userId: user.id, userName: user.name,
          content: newPostContent, media: imageBase64, mimeType,
          reason: aiResult.safetyReason, timestamp: new Date().toLocaleString(), status: 'blocked'
        });
        return;
      }

      const newPost: Post = {
        id: Date.now().toString(), author: user.name, authorId: user.id,
        authorRole: user.role, authorAvatar: user.avatar, timestamp: 'Just now',
        content: newPostContent, images: selectedMedia ? [selectedMedia.url] : undefined,
        hashtags: [`#${user.college}`], likes: 0, commentsCount: 0, comments: [], views: 1,
        flags: [], isOpportunity: aiResult.category === 'Career', college: user.college,
        aiMetadata: { category: aiResult.category, isSafe: true, sentiment: 'Neutral' }
      };

      db.addPost(newPost);
      setNewPostContent('');
      setSelectedMedia(null);
    } catch (e) {
      setIsAnalyzing(false);
      setRejectionMessage("Security protocol failure.");
    }
  };

  const handleVote = (pollId: string, optionId: string) => {
    db.voteInPoll(pollId, optionId, user.id);
  };

  const COLLEGES: (College | 'Global')[] = ['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
            <h2 className="text-3xl font-extrabold tracking-tighter text-[var(--text-primary)] uppercase">
              {collegeFilter ? `${collegeFilter} WING` : 'CAMPUS PULSE'}
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
               <textarea className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none min-h-[80px] placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast what's happening at ${collegeFilter || 'the Hill'}...`} value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
            </div>
            {selectedMedia && (
              <div className="relative mt-2 inline-block shadow-lg">
                <img src={selectedMedia.url} className="h-48 rounded-xl object-cover border border-[var(--border-color)]" />
                <button onClick={() => setSelectedMedia(null)} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-lg hover:bg-rose-500 transition-colors"><X size={14}/></button>
              </div>
            )}
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
          {posts.map(post => (
            <article key={post.id} className={`glass-card p-6 space-y-4 hover:border-indigo-500 transition-all duration-300 shadow-sm border-[var(--border-color)] ${post.isAd ? 'bg-amber-500/[0.04] border-amber-500/20' : post.isEventBroadcast ? 'bg-emerald-500/[0.02] border-emerald-500/20' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={post.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] shadow-sm" />
                  <div>
                    <h4 className={`text-[13px] font-extrabold tracking-tight ${post.isAd ? 'text-amber-600' : post.isEventBroadcast ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>{post.author}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                  </div>
                </div>
                <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} isEvent={post.isEventBroadcast} />
              </div>
              
              <p className="text-[14px] leading-relaxed text-[var(--text-primary)] font-medium italic">"{post.content}"</p>
              
              {post.isEventBroadcast && (
                <div className="rounded-[2.5rem] overflow-hidden border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 p-8 space-y-6 relative group/event">
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
                   
                   {post.images?.[0] && (
                     <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] aspect-video shadow-xl">
                        <img src={post.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover/event:scale-105" />
                     </div>
                   )}

                   <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-white dark:bg-white/10 text-slate-900 dark:text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm border border-[var(--border-color)] hover:bg-slate-50 transition-all">
                         <CheckCircle2 size={16}/> Sync to Device
                      </button>
                      {post.eventRegistrationLink && (
                        <a href={post.eventRegistrationLink} target="_blank" className="flex-1 bg-emerald-600 text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                           Register Protocol <ExternalLink size={16}/>
                        </a>
                      )}
                   </div>
                </div>
              )}

              {post.images?.map((img, i) => !post.isEventBroadcast && (
                <div key={i} className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm">
                  <img src={img} className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 hover:scale-105" />
                </div>
              ))}

              {post.video && (
                <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black aspect-video relative group/video shadow-lg">
                  <VideoPlayer src={post.video} />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-8">
                  <button onClick={() => db.likePost(post.id)} className="flex items-center gap-2.5 text-slate-500 hover:text-rose-500 transition-colors group">
                    <Heart size={20} className="group-active:scale-125 transition-transform" /> <span className="text-[12px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={20} /> <span className="text-[12px] font-black">{post.commentsCount}</span>
                  </button>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Eye size={20} /> <span className="text-[12px] font-black">{post.views.toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={20}/></button>
              </div>
            </article>
          ))}
        </div>

        {/* Right Sidebar Column - Only on laptops/desktops */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-8 sticky top-8 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
           
           {/* Active Poll Widget */}
           {activePoll && (
             <div className="glass-card p-6 border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-sm transition-theme">
                <div className="flex items-center gap-3 mb-5">
                   <div className="p-2 bg-indigo-600 rounded-lg text-white"><CheckCircle2 size={16}/></div>
                   <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Campus Pulse Poll</h3>
                </div>
                <p className="text-sm font-black text-[var(--text-primary)] mb-6 leading-snug">"{activePoll.question}"</p>
                <div className="space-y-3">
                   {activePoll.options.map(opt => {
                     const isVoted = activePoll.votedUserIds.includes(user.id);
                     const percentage = activePoll.votedUserIds.length > 0 ? Math.round((opt.votes / activePoll.votedUserIds.length) * 100) : 0;
                     return (
                       <button 
                        key={opt.id} 
                        disabled={isVoted}
                        onClick={() => handleVote(activePoll.id, opt.id)}
                        className={`w-full group relative overflow-hidden p-4 rounded-xl border text-left transition-all ${
                          isVoted ? 'bg-[var(--bg-secondary)] border-[var(--border-color)]' : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-indigo-500'
                        }`}
                       >
                         {isVoted && <div className="absolute inset-0 bg-indigo-600/10" style={{ width: `${percentage}%` }}></div>}
                         <div className="relative flex justify-between items-center">
                            <span className="text-[11px] font-bold text-[var(--text-primary)]">{opt.text}</span>
                            {isVoted && <span className="text-[10px] font-black text-indigo-600">{percentage}%</span>}
                         </div>
                       </button>
                     );
                   })}
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center">
                  {activePoll.votedUserIds.length} Total Voices Recorded
                </p>
             </div>
           )}

           {/* Trending Section */}
           <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm transition-theme">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <TrendingUp size={14} className="text-indigo-600"/> High Density Signals
              </h3>
              <div className="space-y-6">
                 {[
                   { tag: '#MakResearch25', count: '12.4k', growth: '+24%' },
                   { tag: '#GuildElections', count: '8.1k', growth: '+112%' },
                   { tag: '#COCISLabB', count: '3.2k', growth: '+12%' },
                   { tag: '#Freshers2025', count: '24.9k', growth: '+8%' }
                 ].map((trend, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="space-y-0.5">
                         <h4 className="text-xs font-black text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">{trend.tag}</h4>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{trend.count} signals transmitted</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{trend.growth}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all">Analyze Hub</button>
           </div>

           {/* Upcoming Registry Section */}
           <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm transition-theme">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Calendar size={14} className="text-rose-600"/> Registry Timeline
              </h3>
              <div className="space-y-5">
                 {upcomingEvents.map(event => (
                   <div key={event.id} className="flex gap-4 group cursor-pointer">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                         <span className="text-[8px] font-black text-slate-400 group-hover:text-white/80 uppercase tracking-widest">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                         <span className="text-sm font-black text-[var(--text-primary)] group-hover:text-white">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase tracking-tight">{event.title}</h4>
                         <p className="text-[9px] text-slate-500 font-bold truncate tracking-widest mt-0.5 uppercase">{event.location} • {event.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Open Full Registry</button>
           </div>

           {/* Recommended Nodes */}
           <div className="glass-card p-6 border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm transition-theme">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Users size={14} className="text-emerald-600"/> Sync Suggestions
              </h3>
              <div className="space-y-6">
                 {suggestedUsers.map(u => (
                   <div key={u.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] group-hover:border-indigo-500 transition-colors" />
                         <div className="space-y-0.5">
                            <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">{u.name}</h4>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{u.college}</p>
                         </div>
                      </div>
                      <button className="p-2 bg-[var(--bg-secondary)] hover:bg-indigo-600 hover:text-white text-slate-500 rounded-lg transition-all">
                         <Plus size={16}/>
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="px-6 text-center space-y-4 pb-10">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Mak Social Ecosystem v8.2</p>
              <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                 <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default Feed;
