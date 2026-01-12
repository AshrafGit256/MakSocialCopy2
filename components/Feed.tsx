
import React, { useState, useEffect } from 'react';
import { Post, User, College } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Send,
  GraduationCap, Briefcase, Zap, ExternalLink, Play, Tv,
  Mic2, Newspaper, ChevronRight
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
    <div className="max-w-[1250px] mx-auto px-4 py-4 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-xl font-black italic tracking-tighter text-white">
                {collegeFilter ? `${collegeFilter} Wing` : 'Main Pulse'}
              </h2>
            </div>
            {!collegeFilter && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[300px]">
                {COLLEGES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setActiveTab(c)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[7px] font-black transition-all border ${
                      activeTab === c 
                      ? 'bg-indigo-600 text-white border-indigo-500' 
                      : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Creator - Ultra Compact */}
          <div className="glass-card p-3 relative overflow-hidden group border-white/10 bg-white/[0.02]">
            {rejectionMessage && (
              <div className="absolute inset-0 bg-rose-950/90 z-50 flex flex-col items-center justify-center p-4 text-center">
                <ShieldAlert size={20} className="text-rose-500 mb-1" />
                <h3 className="text-[10px] font-black text-white uppercase italic">Access Denied</h3>
                <p className="text-rose-200 text-[8px] mt-1 leading-relaxed">{rejectionMessage}</p>
                <button onClick={() => setRejectionMessage(null)} className="mt-3 px-4 py-1.5 bg-white text-rose-950 font-black rounded text-[7px] uppercase tracking-widest">Retry</button>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-2">
               <img src={user.avatar} className="w-7 h-7 rounded object-cover border border-white/10 shadow-sm" />
               <textarea 
                  className="flex-1 bg-transparent border-none focus:outline-none text-[13px] resize-none min-h-[40px] placeholder:text-slate-600 text-slate-200 py-1" 
                  placeholder={`What's happening at ${collegeFilter || 'the hill'}?`}
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                />
            </div>

            {selectedMedia && (
              <div className="relative mt-2 inline-block">
                <img src={selectedMedia.url} className="h-24 rounded object-cover border border-white/10" />
                <button onClick={() => setSelectedMedia(null)} className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded hover:bg-rose-500 transition-colors"><X size={10}/></button>
              </div>
            )}

            <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
               <button onClick={() => {
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.onchange = (e: any) => {
                   const file = e.target.files[0];
                   if (file) setSelectedMedia({ url: URL.createObjectURL(file), file });
                 };
                 input.click();
               }} className="p-1.5 text-slate-500 hover:text-indigo-500 transition-all flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                 <ImageIcon size={14}/> Add Media
               </button>
               
               <button 
                  onClick={handleCreatePost}
                  disabled={isAnalyzing || (!newPostContent.trim() && !selectedMedia)}
                  className="bg-indigo-600 px-4 py-1.5 rounded-md font-black text-[8px] text-white uppercase tracking-widest flex items-center gap-1.5 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
               >
                  {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10}/>}
                  Publish
               </button>
            </div>
          </div>

          {/* Posts Loop - Optimized Size */}
          {posts.filter(p => !p.isMakTV || activeTab === 'Global').map(post => (
            <article 
              key={post.id} 
              className={`glass-card p-3.5 space-y-2.5 hover:border-white/20 transition-all border-white/5 ${post.isAd ? 'border-amber-500/20 bg-amber-500/[0.01]' : ''} ${post.isMakTV ? 'border-indigo-500/20 bg-indigo-500/[0.01]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={post.authorAvatar} className="w-8 h-8 rounded object-cover border border-white/5" />
                  <div>
                    <h4 className={`text-[11px] font-black italic tracking-tight leading-none ${post.isAd ? 'text-amber-400' : post.isMakTV ? 'text-indigo-400' : 'text-white'}`}>
                      {post.author}
                    </h4>
                    <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{post.timestamp} • {post.college}</p>
                  </div>
                </div>
                <CategoryTag category={post.aiMetadata?.category} isAd={post.isAd} isMakTV={post.isMakTV} />
              </div>
              
              <p className="text-[12px] leading-relaxed text-slate-300 font-medium">{post.content}</p>
              
              {post.images?.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-white/5 shadow-inner">
                  <img src={img} className="w-full h-auto object-cover max-h-[280px]" />
                </div>
              ))}

              {post.video && (
                <div className="rounded-lg overflow-hidden border border-white/10 bg-black aspect-video relative group/video max-h-[280px]">
                  <video 
                    src={post.video} 
                    className="w-full h-full"
                    controls
                    muted
                  />
                  {post.isMakTV && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-indigo-600/90 text-white rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                       <Play size={8} fill="currentColor" /> MakTV Official
                    </div>
                  )}
                </div>
              )}

              {post.isAd && post.adLink && (
                <div className="pt-0.5">
                  <a 
                    href={post.adLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/30 px-3 py-2 rounded-md flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all"
                  >
                    {post.adCtaText || 'Learn More'}
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button onClick={() => { db.likePost(post.id); setPosts(db.getPosts()); }} className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={14} /> <span className="text-[9px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={() => setSelectedPostForComments(post)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors">
                    <MessageCircle size={14} /> <span className="text-[9px] font-black">{post.commentsCount}</span>
                  </button>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Eye size={14} /> <span className="text-[9px] font-black">{post.views.toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-slate-800 hover:text-white transition-colors p-1"><MoreHorizontal size={16}/></button>
              </div>
            </article>
          ))}
        </div>

        {/* MakTV Sidebar - Natural Movement */}
        <aside className="lg:col-span-4 space-y-5">
          
          {/* MakTV News Section */}
          <div className="glass-card overflow-hidden border-indigo-500/10 bg-indigo-950/[0.02]">
            <div className="p-3 bg-indigo-600 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Newspaper size={14} className="text-white" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-widest">MakTV News Hour</h3>
               </div>
               <span className="px-1.5 py-0.5 bg-white/20 text-white text-[7px] font-black uppercase rounded animate-pulse">Live</span>
            </div>
            
            <div className="p-2 space-y-2.5">
               {newsHour.length > 0 ? newsHour.map(news => (
                 <div key={news.id} className="bg-white/5 rounded-lg border border-white/5 overflow-hidden hover:bg-white/[0.08] transition-all group">
                    <div className="relative aspect-video">
                       <video 
                         src={news.video} 
                         className="w-full h-full object-cover" 
                         controls 
                         preload="metadata"
                       />
                       <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-rose-600 text-[6px] font-black uppercase rounded text-white tracking-widest pointer-events-none shadow-lg">Student Brief</div>
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <h4 className="text-[9px] font-black text-slate-200 uppercase leading-tight line-clamp-2">
                        {news.content}
                      </h4>
                      <div className="flex items-center justify-between text-[7px] font-bold text-slate-500 uppercase tracking-tight">
                         <span className="flex items-center gap-1"><Users size={8}/> {news.views} watching</span>
                         <span className="text-indigo-400 flex items-center gap-0.5">Details <ChevronRight size={8}/></span>
                      </div>
                    </div>
                 </div>
               )) : (
                 <div className="p-6 text-center text-slate-600 italic text-[9px]">Check back for 6PM news hour.</div>
               )}
            </div>
          </div>

          {/* MakTV Interviews Section */}
          <div className="glass-card p-3 border-emerald-500/10 bg-emerald-950/[0.01]">
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-1.5 text-emerald-500">
                  <Mic2 size={14} />
                  <h3 className="text-[9px] font-black uppercase tracking-widest">Alumni Spotlight</h3>
               </div>
               <button className="text-[7px] font-black text-slate-600 uppercase hover:text-white transition-colors">See More</button>
            </div>
            
            <div className="space-y-2.5">
               {interviews.length > 0 ? interviews.map(interview => (
                 <div key={interview.id} className="relative rounded-lg overflow-hidden border border-white/5 p-2 bg-white/[0.01] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-start gap-2">
                       <img src={interview.authorAvatar} className="w-8 h-8 rounded object-cover border border-white/10" />
                       <div className="flex-1">
                          <h4 className="text-[9px] font-black text-white italic uppercase">{interview.makTVGuest}</h4>
                          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-tighter">{interview.college} Alumni</p>
                          <p className="text-[9px] text-slate-400 mt-1 line-clamp-3 italic leading-relaxed">
                            "{interview.content}"
                          </p>
                       </div>
                    </div>
                    {interview.video && (
                      <div className="mt-2 rounded overflow-hidden border border-white/10 aspect-video shadow-md">
                        <video src={interview.video} controls className="w-full h-full object-cover" preload="none" />
                      </div>
                    )}
                 </div>
               )) : (
                 <div className="text-center py-4 text-slate-600 text-[9px] italic uppercase tracking-widest">No spotlights scheduled.</div>
               )}
            </div>
          </div>

          {/* Sync Stats - Low Profile */}
          <div className="p-3 border border-white/5 rounded-xl bg-white/[0.01] opacity-60">
            <h3 className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Network Metadata</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                 <p className="text-[8px] text-slate-600 font-black uppercase">Core Sync</p>
                 <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Operational</p>
                 </div>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Comment Modal */}
      {selectedPostForComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="glass-card w-full max-w-lg max-h-[75vh] flex flex-col border-white/10 shadow-3xl">
             <div className="p-3.5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-xs font-black italic tracking-tighter text-white uppercase tracking-widest">Interaction Thread</h3>
                <button onClick={() => setSelectedPostForComments(null)} className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded transition-all"><X size={16}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-3.5 no-scrollbar">
                {selectedPostForComments.comments?.map(c => (
                  <div key={c.id} className="flex gap-2.5">
                     <img src={c.authorAvatar} className="w-7 h-7 rounded border border-white/10" />
                     <div className="flex-1 bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-0.5">
                           <h5 className="text-[9px] font-black text-indigo-400 uppercase">{c.author}</h5>
                           <span className="text-[7px] text-slate-600 font-bold">{c.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{c.text}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-3.5 border-t border-white/10 bg-slate-900/80">
                <div className="flex gap-2">
                   <input 
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-[11px] outline-none text-white focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-700" 
                    placeholder="Add to the pulse..."
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
                   }} className="bg-indigo-600 px-3.5 rounded-md text-white hover:bg-indigo-700 transition-all flex items-center justify-center"><Send size={14}/></button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
