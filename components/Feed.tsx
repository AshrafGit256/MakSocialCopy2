
import React, { useState, useEffect } from 'react';
import { Post, User, College, Poll } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight, ArrowRight, CheckCircle2, Youtube,
  Calendar, MapPin, Clock
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
        <div key={i} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1.5 flex flex-col items-center min-w-[32px]">
           <span className="text-[12px] font-black text-white italic leading-tight">{item.v}</span>
           <span className="text-[6px] uppercase font-bold text-slate-400">{item.l}</span>
        </div>
      ))}
    </div>
  );
};

const CategoryTag: React.FC<{ category?: string, isAd?: boolean, isMakTV?: boolean, isEvent?: boolean }> = ({ category, isAd, isMakTV, isEvent }) => {
  if (isEvent) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-wider">
        <Calendar size={10} />
        Campus Event
      </div>
    );
  }
  if (isMakTV) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-wider">
        <Tv size={10} />
        MakTV
      </div>
    );
  }
  if (isAd) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-wider">
        <Sparkles size={10} />
        AD
      </div>
    );
  }

  const styles: Record<string, string> = {
    Urgent: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Academic: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    Career: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Social: "bg-slate-500/10 text-slate-500 border-slate-500/10"
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
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, [activeTab, collegeFilter]);

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

  const COLLEGES: (College | 'Global')[] = ['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-20 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-black italic tracking-tighter text-white">
              {collegeFilter ? `${collegeFilter} WING` : 'CAMPUS PULSE'}
            </h2>
            {!collegeFilter && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[380px] p-1 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {COLLEGES.map(c => (
                  <button key={c} onClick={() => setActiveTab(c)} className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[9px] font-black transition-all ${activeTab === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{c}</button>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-5 relative overflow-hidden border-white/10 bg-white/[0.03] shadow-2xl">
            {rejectionMessage && (
              <div className="absolute inset-0 bg-rose-950/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
                <ShieldAlert size={32} className="text-rose-500 mb-2" />
                <h3 className="text-[12px] font-black text-white uppercase italic tracking-widest">Protocol Breach</h3>
                <p className="text-rose-200 text-[10px] mt-1 leading-relaxed max-w-xs">{rejectionMessage}</p>
                <button onClick={() => setRejectionMessage(null)} className="mt-5 px-6 py-2.5 bg-white text-rose-950 font-black rounded-lg text-[9px] uppercase tracking-widest hover:scale-105 transition-transform">Dismiss</button>
              </div>
            )}
            <div className="flex items-start gap-4 mb-4">
               <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg" />
               <textarea className="flex-1 bg-transparent border-none focus:outline-none text-[15px] resize-none min-h-[60px] placeholder:text-slate-600 text-slate-200" placeholder={`What's happening at ${collegeFilter || 'the Hill'}?`} value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
            </div>
            {selectedMedia && (
              <div className="relative mt-2 inline-block shadow-2xl">
                <img src={selectedMedia.url} className="h-40 rounded-xl object-cover border border-white/10" />
                <button onClick={() => setSelectedMedia(null)} className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-lg hover:bg-rose-500 transition-colors"><X size={14}/></button>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-4 border-t border-white/5">
               <button onClick={() => {
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.onchange = (e: any) => {
                   const file = e.target.files[0];
                   if (file) setSelectedMedia({ url: URL.createObjectURL(file), file });
                 };
                 input.click();
               }} className="p-2.5 text-slate-500 hover:text-indigo-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><ImageIcon size={18}/> Asset</button>
               <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)} className="bg-indigo-600 px-8 py-3 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95">{isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>} Publish</button>
            </div>
          </div>

          {posts.map(post => (
            <article key={post.id} className={`glass-card p-5 space-y-4 hover:border-white/20 transition-all duration-300 border-white/5 shadow-xl ${post.isAd ? 'bg-amber-500/[0.04] border-amber-500/20' : post.isEventBroadcast ? 'bg-emerald-500/[0.02] border-emerald-500/20' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={post.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md" />
                  <div>
                    <h4 className={`text-[13px] font-black italic tracking-tight ${post.isAd ? 'text-amber-500' : post.isEventBroadcast ? 'text-emerald-400' : 'text-white'}`}>{post.author}</h4>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                  </div>
                </div>
                <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} isEvent={post.isEventBroadcast} />
              </div>
              
              <p className="text-[14px] leading-relaxed text-slate-300 font-medium">{post.content}</p>
              
              {post.isEventBroadcast && (
                <div className="rounded-[2rem] overflow-hidden border border-emerald-500/20 bg-emerald-950/20 p-6 space-y-6 relative group/event">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-1">
                         <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{post.eventTitle}</h3>
                         <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest"><MapPin size={12}/> {post.eventLocation}</div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest"><Clock size={12}/> {post.eventTime} • {post.eventDate}</div>
                         </div>
                      </div>
                      {post.eventDate && <Countdown targetDate={`${post.eventDate}T${post.eventTime || '00:00'}:00`} />}
                   </div>
                   
                   {post.images?.[0] && (
                     <div className="rounded-xl overflow-hidden border border-white/5 aspect-video shadow-2xl">
                        <img src={post.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover/event:scale-110" />
                     </div>
                   )}

                   <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-white text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-slate-200">
                         <CheckCircle2 size={14}/> Add to My Calendar
                      </button>
                      {post.eventRegistrationLink && (
                        <a href={post.eventRegistrationLink} target="_blank" className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 hover:bg-emerald-700">
                           Register Now <ExternalLink size={14}/>
                        </a>
                      )}
                   </div>
                </div>
              )}

              {post.images?.map((img, i) => !post.isEventBroadcast && (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <img src={img} className="w-full h-auto object-cover max-h-[350px] transition-transform duration-700 hover:scale-105" />
                </div>
              ))}

              {post.video && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group/video shadow-3xl">
                  <VideoPlayer src={post.video} />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <button onClick={() => db.likePost(post.id)} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                    <Heart size={18} /> <span className="text-[11px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <MessageCircle size={18} /> <span className="text-[11px] font-black">{post.commentsCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Eye size={18} /> <span className="text-[11px] font-black">{post.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
