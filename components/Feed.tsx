
import React, { useState, useEffect } from 'react';
import { Post, User, College, Poll } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight, ArrowRight, CheckCircle2
} from 'lucide-react';

const CategoryTag: React.FC<{ category?: string, isAd?: boolean, isMakTV?: boolean }> = ({ category, isAd, isMakTV }) => {
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
        Ad
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
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  const [activePoll, setActivePoll] = useState<Poll | null>(null);

  const makTVPosts = posts.filter(p => p.isMakTV);
  const newsHour = makTVPosts.filter(p => p.makTVType === 'News' || p.makTVType === 'Brief');
  const interviews = makTVPosts.filter(p => p.makTVType === 'Interview');

  useEffect(() => {
    const sync = () => {
      let allPosts = db.getPosts();
      const currentFilter = collegeFilter || activeTab;
      if (currentFilter !== 'Global') {
        allPosts = allPosts.filter(p => p.college === currentFilter || p.isAd || p.isMakTV);
      }
      setPosts(allPosts);
      
      const polls = db.getPolls();
      setActivePoll(polls.find(p => p.isActive) || null);
    };
    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, [activeTab, collegeFilter]);

  const scrollToPost = (id: string) => {
    const element = document.getElementById(`post-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-black');
      setTimeout(() => element.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-black'), 4000);
    }
  };

  const handleVote = (optionId: string) => {
    if (!activePoll || activePoll.votedUserIds.includes(user.id)) return;
    const updatedPolls = db.voteInPoll(activePoll.id, optionId, user.id);
    setActivePoll(updatedPolls.find(p => p.id === activePoll.id) || null);
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

      db.savePosts([newPost, ...db.getPosts()]);
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
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white">
                {collegeFilter ? `${collegeFilter} WING` : 'CAMPUS PULSE'}
              </h2>
            </div>
            {!collegeFilter && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[380px] p-1 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {COLLEGES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveTab(c)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                      activeTab === c 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Creator */}
          <div className="glass-card p-5 relative overflow-hidden group border-white/10 bg-white/[0.03] shadow-2xl">
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
               <textarea 
                  className="flex-1 bg-transparent border-none focus:outline-none text-[15px] resize-none min-h-[60px] placeholder:text-slate-600 text-slate-200" 
                  placeholder={`What's happening at ${collegeFilter || 'the Hill'}?`}
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                />
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
               }} className="p-2.5 text-slate-500 hover:text-indigo-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                 <ImageIcon size={18}/> Asset
               </button>
               
               <button 
                  onClick={handleCreatePost}
                  disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)}
                  className="bg-indigo-600 px-8 py-3 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
               >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>}
                  Publish
               </button>
            </div>
          </div>

          {/* Posts Loop */}
          {posts.filter(p => !p.isMakTV || activeTab === 'Global').map(post => (
            <article 
              id={`post-${post.id}`}
              key={post.id} 
              className={`glass-card p-5 space-y-4 hover:border-white/20 transition-all duration-300 border-white/5 shadow-xl ${post.isAd ? 'bg-amber-500/[0.02]' : post.isMakTV ? 'bg-indigo-500/[0.02]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={post.authorAvatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md" />
                  <div>
                    <h4 className={`text-[13px] font-black italic tracking-tight ${post.isAd ? 'text-amber-400' : post.isMakTV ? 'text-indigo-400' : 'text-white'}`}>
                      {post.author}
                    </h4>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                  </div>
                </div>
                <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} />
              </div>
              
              <p className="text-[14px] leading-relaxed text-slate-300 font-medium">{post.content}</p>
              
              {post.images?.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <img src={img} className="w-full h-auto object-cover max-h-[350px] transition-transform duration-700 hover:scale-105" />
                </div>
              ))}

              {post.video && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group/video shadow-3xl">
                  <video 
                    src={post.video} 
                    className="w-full h-full"
                    controls
                    muted
                  />
                  {post.isMakTV && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 bg-indigo-600 text-white rounded font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-2xl">
                       <Play size={10} fill="currentColor" /> MakTV Official
                    </div>
                  )}
                </div>
              )}

              {post.isAd && post.adLink && (
                <div className="pt-2">
                  <a 
                    href={post.adLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/30 px-5 py-4 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-500/10"
                  >
                    {post.adCtaText || 'Explore'}
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <button onClick={() => { db.likePost(post.id); setPosts(db.getPosts()); }} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group">
                    <Heart size={18} className="group-active:scale-125 transition-transform" /> <span className="text-[11px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={() => setSelectedPostForComments(post)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <MessageCircle size={18} /> <span className="text-[11px] font-black">{post.commentsCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Eye size={18} /> <span className="text-[11px] font-black">{post.views.toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-slate-700 hover:text-white transition-colors p-1.5"><MoreHorizontal size={20}/></button>
              </div>
            </article>
          ))}
        </div>

        {/* MakTV & Poll Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Active Poll Widget */}
          {activePoll && (
            <div className="glass-card overflow-hidden border-emerald-500/20 bg-emerald-950/[0.03] shadow-2xl animate-in zoom-in-95">
               <div className="p-4 bg-emerald-600 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 size={16} className="text-white" />
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Campus Vote</h3>
                  </div>
                  <span className="px-1.5 py-0.5 bg-white/20 text-white text-[7px] font-black uppercase rounded animate-pulse">Live</span>
               </div>
               <div className="p-5 space-y-4">
                  <p className="text-[12px] font-black text-white leading-tight uppercase tracking-tight italic">"{activePoll.question}"</p>
                  
                  <div className="space-y-3">
                     {activePoll.options.map(opt => {
                        const totalVotes = activePoll.options.reduce((acc, curr) => acc + curr.votes, 0);
                        const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                        const hasVoted = activePoll.votedUserIds.includes(user.id);

                        return (
                          <div key={opt.id} className="space-y-1.5">
                             <button 
                               onClick={() => handleVote(opt.id)}
                               disabled={hasVoted}
                               className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                 hasVoted 
                                 ? 'bg-white/5 border-white/10 text-slate-400 cursor-default' 
                                 : 'bg-white/10 border-white/5 text-white hover:bg-emerald-600/20 hover:border-emerald-500/30'
                               }`}
                             >
                                <span>{opt.text}</span>
                                {hasVoted && <span>{pct.toFixed(0)}%</span>}
                             </button>
                             {hasVoted && (
                               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                               </div>
                             )}
                          </div>
                        );
                     })}
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-white/5">
                     <span>{activePoll.votedUserIds.length} Total Votes</span>
                     <span className="text-emerald-500">Vote now</span>
                  </div>
               </div>
            </div>
          )}

          {/* MakTV News Section */}
          <div className="glass-card overflow-hidden border-indigo-500/20 bg-indigo-950/[0.03] shadow-2xl">
            <div className="p-4 bg-indigo-600 flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-2">
                  <Newspaper size={16} className="text-white" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">News Hour</h3>
               </div>
            </div>
            
            <div className="p-4 space-y-4">
               {newsHour.length > 0 ? newsHour.map(news => (
                 <div key={news.id} className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden hover:bg-white/[0.08] transition-all group">
                    <div className="relative aspect-video">
                       <video 
                         src={news.video} 
                         className="w-full h-full object-cover" 
                         controls 
                         preload="metadata"
                       />
                       <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-600 text-[7px] font-black uppercase rounded text-white tracking-widest shadow-lg">MAK BRIEF</div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-[11px] font-black text-slate-200 uppercase leading-tight line-clamp-2 italic">
                        {news.content}
                      </h4>
                      <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Users size={10}/> {news.views.toLocaleString()}</span>
                         <span className="text-indigo-400">Interact <ChevronRight size={10}/></span>
                      </div>
                    </div>
                 </div>
               )) : (
                 <div className="p-10 text-center text-slate-600 italic text-[11px] font-black uppercase tracking-widest">Awaiting Updates</div>
               )}
            </div>
          </div>

          {/* Alumni Spotlight */}
          <div className="glass-card p-5 border-amber-500/10 bg-amber-950/[0.01] shadow-xl">
            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-2 text-amber-500">
                  <Mic2 size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Spotlight</h3>
               </div>
            </div>
            
            <div className="space-y-4">
               {interviews.length > 0 ? interviews.map(interview => (
                 <div key={interview.id} className="relative rounded-2xl overflow-hidden border border-white/5 p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-all group shadow-sm">
                    <div className="flex items-start gap-4">
                       <img src={interview.authorAvatar} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                       <div className="flex-1">
                          <h4 className="text-[11px] font-black text-white italic uppercase tracking-tighter">{interview.makTVGuest}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">MAK Alumni</p>
                          <p className="text-[12px] text-slate-400 line-clamp-2 italic leading-relaxed">
                            "{interview.content}"
                          </p>
                       </div>
                    </div>
                    <button 
                      onClick={() => scrollToPost(interview.id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md group-hover:shadow-indigo-500/20"
                    >
                      Watch Interview <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
               )) : (
                 <div className="text-center py-8 text-slate-600 text-[11px] font-black italic uppercase">No Scheduled Spotlights</div>
               )}
            </div>
          </div>
        </aside>

      </div>

      {/* Comment Modal */}
      {selectedPostForComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 animate-in fade-in">
          <div className="glass-card w-full max-w-xl max-h-[85vh] flex flex-col border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
             <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-[11px] font-black italic tracking-widest text-white uppercase">Engagement Thread</h3>
                <button onClick={() => setSelectedPostForComments(null)} className="p-2.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-xl transition-all"><X size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
                {selectedPostForComments.comments?.map(c => (
                  <div key={c.id} className="flex gap-4">
                     <img src={c.authorAvatar} className="w-9 h-9 rounded-xl border border-white/10" />
                     <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-1.5">
                           <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{c.author}</h5>
                           <span className="text-[9px] text-slate-600 font-bold">{c.timestamp}</span>
                        </div>
                        <p className="text-[12px] text-slate-300 leading-relaxed font-medium">{c.text}</p>
                     </div>
                  </div>
                ))}
                {(!selectedPostForComments.comments || selectedPostForComments.comments.length === 0) && (
                   <div className="p-20 text-center text-slate-700 italic font-black uppercase text-xs tracking-widest">Be the first to respond</div>
                )}
             </div>
             <div className="p-5 border-t border-white/10 bg-slate-900/90">
                <div className="flex gap-3">
                   <input 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-xs focus:ring-2 focus:ring-indigo-600/50 outline-none text-white transition-all placeholder:text-slate-700 shadow-inner" 
                    placeholder="Contribute your thought..."
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                  />
                   <button onClick={() => {
                     if (!newCommentText.trim()) return;
                     const updated = db.addComment(selectedPostForComments.id, {
                        id: Date.now().toString(), author: user.name, authorAvatar: user.avatar, text: newCommentText, timestamp: 'Just now'
                     });
                     setSelectedPostForComments(updated.find(p => p.id === selectedPostForComments.id) || null);
                     setNewCommentText('');
                   }} className="bg-indigo-600 px-6 rounded-xl text-white hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center active:scale-90"><Send size={18}/></button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
