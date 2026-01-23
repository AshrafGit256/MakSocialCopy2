
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, MessageCircle, X, Loader2, Eye, Zap, 
  Maximize2, Minimize2, Video, Type as FontIcon, 
  ChevronDown, Bold, Italic, Palette, Send, 
  ArrowLeft, ChevronRight, TrendingUp, Sparkles, Star, Radio,
  Terminal, Code, Command
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  const isInstitutional = role === 'Official' || role === 'Corporate';
  const color = isInstitutional ? '#829aab' : '#1d9bf0';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block ml-1 align-text-bottom flex-shrink-0">
      <g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill={color}/></g>
    </svg>
  );
};

const PostCreator: React.FC<{ onPost: (content: string, font: string) => void, isAnalyzing: boolean }> = ({ onPost, isAnalyzing }) => {
  const [content, setContent] = useState('');
  const [activeFont, setActiveFont] = useState('"JetBrains Mono"');
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const handlePublish = () => {
    const html = editorRef.current?.innerHTML || '';
    if (html.trim() && html !== '<br>') {
      onPost(html, activeFont);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setContent('');
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden mb-10 animate-in slide-in-from-top-4 duration-500">
      <div className="px-5 py-3 border-b border-[var(--border-color)] bg-slate-50 dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Terminal size={14} className="text-indigo-600" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Signal.Editor v2.4</span>
        </div>
        <div className="flex items-center gap-1">
           <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors" title="Bold"><Bold size={14}/></button>
           <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors" title="Italic"><Italic size={14}/></button>
           <div className="h-4 w-px bg-[var(--border-color)] mx-2"></div>
           <select 
             onChange={(e) => setActiveFont(e.target.value)}
             className="bg-transparent text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer"
           >
              <option value='"JetBrains Mono"'>Tactical Mono</option>
              <option value='"Inter"'>Inter UI</option>
              <option value='"Playfair Display"'>Scholar Serif</option>
           </select>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="min-h-[160px] p-8 text-sm outline-none leading-relaxed"
          style={{ fontFamily: activeFont }}
          data-placeholder="Initialize new signal transmission..."
        />
        {!content && <div className="absolute top-8 left-8 text-slate-400 pointer-events-none text-xs italic opacity-50 font-mono">_awaiting_input...</div>}
      </div>

      <div className="px-5 py-4 bg-slate-50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
           {isAnalyzing && (
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-full text-indigo-600">
               <Loader2 size={12} className="animate-spin" />
               <span className="text-[8px] font-black uppercase tracking-widest">AI Categorization Active</span>
             </div>
           )}
        </div>
        <button 
          onClick={handlePublish}
          disabled={isAnalyzing || !content.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={14} /> Broadcast Signal
        </button>
      </div>
      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content h1 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; italic; }
        .rich-content h2 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
        .rich-content p { margin-bottom: 1rem; }
        .rich-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className={`absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden`}></div>
      <div className="flex gap-3">
         <img src={post.authorAvatar} onClick={() => onNavigateToProfile(post.authorId)} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-90 transition-all" />
         <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
               <div className="flex items-center gap-1.5 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:underline cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={14} />
                  {post.isOpportunity && <Star size={12} className="text-amber-500 ml-1 fill-amber-500" />}
                  <span className="text-slate-500 ml-2 truncate">{post.college}</span>
               </div>
               <span className="text-slate-500 font-mono text-[9px] whitespace-nowrap ml-2">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[var(--radius-main)] shadow-sm overflow-hidden transition-all hover:border-indigo-500/30 ${isComment ? 'cursor-default' : 'cursor-pointer'}`}>
               <div className="p-5 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content text-[14px] leading-relaxed" />
               </div>
               <div className="px-5 py-2 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors"><Heart size={14} /><span className="text-[9px] font-bold">{post.likes}</span></button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={14} /><span className="text-[9px] font-bold">{post.commentsCount}</span></button>
               </div>
            </div>
         </div>
      </div>
    </article>
  );
};

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    const sync = () => { setUser(db.getUser()); setPosts(db.getPosts()); };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = async (content: string, font: string) => {
    setIsAnalyzing(true);
    let opportunityData: Post['opportunityData'] | undefined = undefined;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Determine if this post is a student opportunity. If yes, return JSON: { "isOpportunity": true, "type": "Gig|Internship|Grant|Scholarship|Workshop", "detectedBenefit": "string(3words)", "deadline": "YYYY-MM-DD|null" }. Post: "${content.replace(/<[^>]*>/g, '')}"`,
        config: { responseMimeType: "application/json" }
      });
      const analysis = JSON.parse(response.text);
      if (analysis.isOpportunity) {
        opportunityData = { ...analysis, isAIVerified: true };
      }
    } catch (e) { console.warn("AI Sync Refused"); }

    const newPost: Post = {
      id: Date.now().toString(), author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
      timestamp: 'Just now', content, customFont: font, hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
      isOpportunity: !!opportunityData, opportunityData, college: collegeFilter as College | 'Global'
    };
    db.addPost(newPost);
    setIsAnalyzing(false);
  };

  const filteredPosts = threadId ? posts.filter(p => p.parentId === threadId) : posts.filter(p => !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter));
  
  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 lg:px-0">
         <div className="lg:col-span-8 space-y-8">
            {!threadId && <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Signal Cluster: {collegeFilter}</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/5 border border-indigo-600/10 rounded-full text-indigo-600">
                    <Radio size={10} className="animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Active Sink</span>
                  </div>
               </div>
               {filteredPosts.map(post => <PostItem key={post.id} post={post} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />)}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit">
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-600" /> Hot Signals</h3>
               <div className="space-y-5">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs'].map(tag => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center">
                       <div><p className="text-sm font-black text-indigo-600 group-hover:underline">{tag}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">High Intensity</p></div>
                       <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </div>
                  ))}
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
