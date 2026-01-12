
import React, { useState, useEffect } from 'react';
import { Post, User, College } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Globe, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight
} from 'lucide-react';

const CategoryTag: React.FC<{ category?: string, isAd?: boolean, isMakTV?: boolean }> = ({ category, isAd, isMakTV }) => {
  if (isMakTV) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
        <Tv size={10} />
        MakTV Exclusive
      </div>
    );
  }
  if (isAd) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
        <Sparkles size={10} />
        Sponsored
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
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${styles[category || 'Social']}`}>
      <Icon size={12} className={category === 'Urgent' ? 'animate-pulse' : ''} />
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
    };
    sync();
    const interval = setInterval(sync, 2000);
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

      db.savePosts([newPost, ...db.getPosts()]);
      setNewPostContent('');
      setSelectedMedia(null);
    } catch (e) {
      setIsAnalyzing(false);
      setRejectionMessage("Security bypass failure.");
    }
  };

  const COLLEGES: (College | 'Global')[] = ['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white">
                {collegeFilter ? `${collegeFilter} Community` : 'Main Pulse'}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                Verified updates from Makerere University
              </p>
            </div>
            {!collegeFilter && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[400px]">
                {COLLEGES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveTab(c)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-bold transition-all border ${
                      activeTab === c 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Creator */}
          <div className="glass-card p-5 relative overflow-hidden group">
            {rejectionMessage && (
              <div className="absolute inset-0 bg-rose-950/90 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <ShieldAlert size={28} className="text-rose-500 mb-3" />
                <h3 className="text-sm font-black text-white uppercase italic">Policy Breach</h3>
                <p className="text-rose-200 text-[10px] mt-1 leading-relaxed">{rejectionMessage}</p>
                <button onClick={() => setRejectionMessage(null)} className="mt-4 px-6 py-2 bg-white text-rose-950 font-black rounded-md text-[9px] uppercase">Acknowledge</button>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
               <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg" />
               <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{user.name}</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Post to {collegeFilter || user.college}</p>
               </div>
            </div>

            <textarea 
              className="w-full bg-transparent border-none focus:outline-none text-[15px] resize-none min-h-[100px] placeholder:text-slate-600 text-slate-200" 
              placeholder={`Share an opportunity or update...`}
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
            />

            {selectedMedia && (
              <div className="relative mt-2 inline-block">
                <img src={selectedMedia.url} className="h-40 rounded-xl object-cover border border-white/10" />
                <button onClick={() => setSelectedMedia(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-rose-500 transition-colors"><X size={14}/></button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
               <button onClick={() => {
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.onchange = (e: any) => {
                   const file = e.target.files[0];
                   if (file) setSelectedMedia({ url: URL.createObjectURL(file), file });
                 };
                 input.click();
               }} className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                 <ImageIcon size={18}/> Attach Media
               </button>
               
               <button 
                  onClick={handleCreatePost}
                  disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)}
                  className="bg-indigo-600 px-8 py-3 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
               >
                  {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12}/>}
                  Publish Update
               </button>
            </div>
          </div>

          {/* Posts Loop */}
          {posts.filter(p => !p.isMakTV || activeTab === 'Global').map(post => (
            <article 
              key={post.id} 
              className={`glass-card p-6 space-y-4 hover:border-white/20 transition-all ${post.isAd ? 'border-amber-500/20 bg-amber-500/[0.01]' : ''} ${post.isMakTV ? 'border-indigo-500/20 bg-indigo-500/[0.01]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} className="w-11 h-11 rounded-xl object-cover border border-white/10 shadow-lg" />
                  <div>
                    <h4 className={`text-sm font-black italic tracking-tight ${post.isAd ? 'text-amber-400' : post.isMakTV ? 'text-indigo-400' : 'text-white'}`}>
                      {post.author}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                  </div>
                </div>
                <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} />
              </div>
              
              <p className="text-[14px] leading-relaxed text-slate-300 font-medium">{post.content}</p>
              
              {post.images?.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <img src={img} className="w-full h-auto object-cover max-h-[450px]" />
                </div>
              ))}

              {post.video && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group/video shadow-2xl">
                  <video 
                    src={post.video} 
                    className="w-full h-full"
                    controls
                    muted
                  />
                  {post.isMakTV && (
                    <div className="absolute top-4 left-4 p-2 bg-indigo-600/90 text-white rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
                       <Play size={10} fill="currentColor" /> MakTV Official Player
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
                    className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/30 px-5 py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                  >
                    {post.adCtaText || 'Learn More'}
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <button onClick={() => { db.likePost(post.id); setPosts(db.getPosts()); }} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={18} /> <span className="text-[11px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={() => setSelectedPostForComments(post)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <MessageCircle size={18} /> <span className="text-[11px] font-black">{post.commentsCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Eye size={18} /> <span className="text-[11px] font-black">{post.views.toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-slate-700 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"><MoreHorizontal size={20}/></button>
              </div>
            </article>
          ))}
        </div>

        {/* MakTV Sidebar (Right Side) */}
        <aside className="lg:col-span-4 space-y-6 sticky top-8">
          
          {/* MakTV News Section */}
          <div className="glass-card overflow-hidden border-indigo-500/20">
            <div className="p-5 bg-indigo-600 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Newspaper size={18} className="text-white" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest">MakTV News Hour</h3>
               </div>
               <span className="px-2 py-0.5 bg-white/20 text-white text-[8px] font-black uppercase rounded animate-pulse">Live Ticker</span>
            </div>
            
            <div className="p-2 space-y-2">
               {newsHour.length > 0 ? newsHour.map(news => (
                 <div key={news.id} className="p-3 bg-white/5 rounded-xl border border-white/5 group cursor-pointer hover:bg-white/10 transition-all">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                       <video src={news.video} className="w-full h-full object-cover" muted />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={24} className="text-white" fill="currentColor" />
                       </div>
                       <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-[8px] font-black uppercase rounded text-white tracking-widest">Journalism Daily</div>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight mb-2 uppercase tracking-wide">
                      {news.content}
                    </h4>
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                       <span className="flex items-center gap-1 uppercase"><Users size={10}/> {news.views} watching</span>
                       <span className="text-indigo-400">Watch Full Brief <ChevronRight size={10} className="inline"/></span>
                    </div>
                 </div>
               )) : (
                 <div className="p-8 text-center text-slate-600 italic text-xs">No news hours scheduled.</div>
               )}
            </div>
          </div>

          {/* MakTV Interviews Section */}
          <div className="glass-card p-5 border-emerald-500/10">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-emerald-500">
                  <Mic2 size={18} />
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Alumni Spotlight</h3>
               </div>
               <button className="text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
               {interviews.length > 0 ? interviews.map(interview => (
                 <div key={interview.id} className="relative group rounded-2xl overflow-hidden border border-white/5 p-4 bg-gradient-to-br from-emerald-500/[0.05] to-transparent">
                    <div className="flex items-start gap-3">
                       <div className="relative">
                          <img src={interview.authorAvatar} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                          <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-lg shadow-lg">
                             <Play size={8} className="text-white" fill="currentColor" />
                          </div>
                       </div>
                       <div className="flex-1">
                          <h4 className="text-[11px] font-black text-white italic uppercase tracking-tight">{interview.makTVGuest}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{interview.college} Alumni</p>
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 italic leading-relaxed">
                            " {interview.content} "
                          </p>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-6 text-slate-600 text-xs italic">No interviews available.</div>
               )}
            </div>
          </div>

          {/* Network Snapshot Section */}
          <div className="glass-card p-5 bg-indigo-500/[0.02] border-indigo-500/10">
            <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Zap size={14} className="animate-pulse" /> Network Health
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Traffic</p>
                 <p className="text-[10px] font-black text-emerald-500 uppercase">+18.4%</p>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sync Status</p>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Active</p>
                 </div>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Comment Modal */}
      {selectedPostForComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] flex flex-col border-white/10 shadow-3xl">
             <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                   <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">Interaction Thread</h3>
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Participate in university dialogue</p>
                </div>
                <button onClick={() => setSelectedPostForComments(null)} className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {selectedPostForComments.comments?.map(c => (
                  <div key={c.id} className="flex gap-4 group">
                     <img src={c.authorAvatar} className="w-10 h-10 rounded-xl border border-white/10 group-hover:scale-105 transition-transform" />
                     <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                           <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{c.author}</h5>
                           <span className="text-[9px] text-slate-600 font-bold">{c.timestamp}</span>
                        </div>
                        <p className="text-[12px] text-slate-300 leading-relaxed">{c.text}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-6 border-t border-white/10 bg-slate-900/80">
                <div className="flex gap-3">
                   <input 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600" 
                    placeholder="Contribute your perspective..."
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
                   }} className="bg-indigo-600 px-6 rounded-xl text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center"><Send size={18}/></button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
