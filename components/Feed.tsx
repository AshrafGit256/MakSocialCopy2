
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, PollOption } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip
} from 'recharts';
import { 
  Heart, MessageCircle, X, Loader2, Eye, Zap, 
  Maximize2, Minimize2, Video, Type as LucideType, 
  Bold, Italic, Palette, Send, Underline, Eraser,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Link as LinkIcon,
  ImageIcon, HelpCircle, ChevronRight, TrendingUp, 
  Radio, Terminal, Sparkles, Star, ChevronDown, Type, Quote,
  BarChart2, PlusCircle, MinusCircle, CheckCircle, Image as LucideImage,
  Calendar, Trash2, Settings2, Activity, Info, Clock,
  Code, MoreHorizontal, FileText, LayoutGrid, Layers, Globe, ArrowUpRight, Cpu,
  TrendingDown, Gauge, MousePointer2, Command
} from 'lucide-react';

const NetworkIntensityIndex: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [sentiment, setSentiment] = useState<{ heat: number; label: string; brief: string }>({ heat: 50, label: 'STABLE', brief: 'Initializing telemetry...' });
  const [isLoading, setIsLoading] = useState(false);

  // Sparkline data mimicking price action
  const sparkData = [
    { v: 40 }, { v: 45 }, { v: 38 }, { v: 52 }, { v: 60 }, { v: 55 }, { v: 72 }, { v: 85 }, { v: 78 }, { v: 92 }
  ];

  useEffect(() => {
    const analyzeSentiment = async () => {
      if (posts.length === 0) return;
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const contentSample = posts.slice(0, 8).map(p => p.content.replace(/<[^>]*>/g, '')).join('\n');
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze student network heat. Return JSON: { "heat": number(0-100), "label": "BULLISH|BEARISH|STABLE", "summary": "1 sentence" }. Data: ${contentSample}`,
          config: { responseMimeType: "application/json" }
        });
        const res = JSON.parse(response.text || '{}');
        setSentiment({ heat: res.heat || 50, label: res.label || 'STABLE', brief: res.summary || 'Signals synchronized.' });
      } catch (e) {
        setSentiment({ heat: 72, label: 'BULLISH', brief: 'High signal velocity detected in research wings.' });
      } finally {
        setIsLoading(false);
      }
    };
    analyzeSentiment();
  }, [posts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Main Sentiment Gauge */}
      <div className="lg:col-span-2 bg-[#020617] border border-[#1e293b] rounded-md p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-5"><Gauge size={140} /></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Network_Intensity_Index</h4>
                 <div className="flex items-center gap-3">
                    <span className={`text-4xl font-black italic tracking-tighter ${sentiment.label === 'BEARISH' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {sentiment.heat.toFixed(1)}
                    </span>
                    <div className="flex flex-col">
                       <span className={`text-[10px] font-black uppercase ${sentiment.label === 'BEARISH' ? 'text-rose-500' : 'text-emerald-500'}`}>{sentiment.label}</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase">Vol: 1.2M SIGNALS</span>
                    </div>
                 </div>
              </div>
              <div className="w-24 h-12">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                       <Area type="monotone" dataKey="v" stroke={sentiment.label === 'BEARISH' ? '#f43f5e' : '#10b981'} fill={sentiment.label === 'BEARISH' ? '#f43f5e22' : '#10b98122'} strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <p className="mt-4 text-[11px] text-slate-400 font-medium italic border-l border-slate-700 pl-4 leading-relaxed">
             "{sentiment.brief}"
           </p>
        </div>
      </div>

      {/* 2. Top Movers (Tags as Assets) */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-md p-5 flex flex-col justify-between">
         <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Signal_Watchlist</h4>
         <div className="space-y-3">
            {[
              { t: '#COCIS', v: '+12.4%', c: 'text-emerald-500' },
              { t: '#CEDAT', v: '-2.1%', c: 'text-rose-500' },
              { t: '#GUILD', v: '+45.8%', c: 'text-emerald-500' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-1 rounded transition-all">
                 <span className="text-[11px] font-black text-slate-300 group-hover:text-indigo-400">{item.t}</span>
                 <span className={`text-[10px] font-mono font-bold ${item.c}`}>{item.v}</span>
              </div>
            ))}
         </div>
         <button className="mt-4 w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-600/20 rounded transition-all">View All Assets</button>
      </div>

      {/* 3. Global Liquidity (Opportunities Heat) */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-md p-5 flex flex-col justify-between relative overflow-hidden">
         <div className="absolute -bottom-4 -right-4 opacity-5 rotate-12"><Zap size={100} fill="white" /></div>
         <div className="relative z-10">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global_Liquidity</h4>
            <p className="text-2xl font-black text-white italic tracking-tighter mt-1">UGX 8.2M</p>
            <p className="text-[8px] font-bold text-emerald-500 uppercase mt-1 flex items-center gap-1"><ArrowUpRight size={10}/> 2.4% vs Last Session</p>
         </div>
         <div className="pt-4 space-y-1">
            <div className="flex justify-between text-[7px] font-black uppercase text-slate-500">
               <span>Registry_Fill</span>
               <span>84%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[84%] animate-pulse"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

const VelocityTicker: React.FC = () => {
  const trends = ['#COCISLabs', '#CEDATHack', '#GuildElection', '#MakerereAI', '#ResearchGrant', '#Hackathon', '#FinalistProjects'];
  return (
    <div className="w-full bg-[#020617] text-indigo-400 py-1.5 overflow-hidden whitespace-nowrap border-y border-[#1e293b] font-mono text-[9px] font-black uppercase tracking-[0.2em] relative">
      <div className="flex animate-marquee gap-10">
        {[...trends, ...trends].map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <Activity size={10} className="text-emerald-500"/> {t} <span className="text-slate-600 text-[8px]">@ 0.33481</span> <span className="text-emerald-500 font-bold">▲</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  const isInstitutional = role === 'Official' || role === 'Corporate' || role === 'Academic Council';
  const color = isInstitutional ? '#94a3b8' : '#6366f1';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block ml-1 align-text-bottom flex-shrink-0">
      <g><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill={color}/></g>
    </svg>
  );
};

const PostCreator: React.FC<{ onPost: (content: string, font: string, poll?: PollData) => void, isAnalyzing: boolean }> = ({ onPost, isAnalyzing }) => {
  const [content, setContent] = useState('');
  const [activeFont, setActiveFont] = useState('"JetBrains Mono"');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'fonts' | 'align' | null>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  
  const [isPollMode, setIsPollMode] = useState(false);
  const [pollOptions, setPollOptions] = useState<{ text: string, imageUrl?: string }[]>([
    { text: '' }, { text: '' }
  ]);
  const [pollDuration, setPollDuration] = useState('1'); 

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollOptionFileRef = useRef<HTMLInputElement>(null);
  const [currentPollOptionIdx, setCurrentPollOptionIdx] = useState<number | null>(null);

  const FONTS = [
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Inter UI', value: '"Inter", sans-serif' },
    { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  ];

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0));
  };

  const restoreSelection = () => {
    if (savedRange) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }
    }
    if (editorRef.current) editorRef.current.focus();
  };

  const exec = (cmd: string, val?: string) => {
    restoreSelection();
    document.execCommand(cmd, false, val);
    setOpenDropdown(null);
  };

  const handlePublish = () => {
    const html = editorRef.current ? editorRef.current.innerHTML : '';
    let pollData: PollData | undefined = undefined;

    if (isPollMode) {
      const validOptions = pollOptions.filter(o => o.text.trim());
      if (validOptions.length < 2) {
        alert("PROTOCOL ERROR: Poll requires at least 2 active nodes.");
        return;
      }
      pollData = {
        options: validOptions.map((o, idx) => ({
          id: `opt-${Date.now()}-${idx}`,
          text: o.text,
          imageUrl: o.imageUrl,
          votes: 0,
          voterIds: []
        })),
        totalVotes: 0,
        expiresAt: new Date(Date.now() + parseInt(pollDuration) * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    if (html.trim() && html !== '<br>') {
      onPost(html, activeFont, pollData);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setContent('');
      setIsPollMode(false);
      setPollOptions([{ text: '' }, { text: '' }]);
    }
  };

  return (
    <div className={`bg-[#020617] border border-[#1e293b] rounded-md shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none overflow-y-auto' : 'relative mb-10'}`}>
      
      <input type="file" ref={fileInputRef} className="hidden" />
      <input type="file" ref={pollOptionFileRef} className="hidden" />

      {/* TERMINAL HEADER */}
      <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between bg-[#0a0f1e]">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Broadcast_Terminal / ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
         </div>
         <div className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <button className="p-1 hover:bg-white/5 rounded text-slate-400"><MinusCircle size={14}/></button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:bg-white/5 rounded text-slate-400"><Maximize2 size={14}/></button>
            <button className="p-1 hover:bg-rose-500/10 rounded text-rose-500"><X size={14}/></button>
         </div>
      </div>

      <div className="px-2 py-2 border-b border-[#1e293b] bg-[#020617] flex flex-wrap items-center gap-1 overflow-x-auto no-scrollbar">
        <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-2 hover:bg-white/5 rounded text-slate-400 transition-all"><Bold size={14}/></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-2 hover:bg-white/5 rounded text-slate-400 transition-all"><Italic size={14}/></button>
        <div className="h-6 w-px bg-[#1e293b] mx-1"></div>
        <button onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} className="p-2 hover:bg-white/5 rounded text-slate-400"><List size={14}/></button>
        <div className="h-6 w-px bg-[#1e293b] mx-1"></div>
        <button 
          onMouseDown={(e) => { e.preventDefault(); setIsPollMode(!isPollMode); }} 
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 border text-[10px] font-black uppercase tracking-tight ${isPollMode ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' : 'bg-transparent border-[#1e293b] text-slate-500 hover:border-indigo-600'}`}
        >
          <BarChart2 size={14}/> Init_Poll
        </button>
      </div>

      <div className={`relative bg-[#020617] transition-all ${isFullscreen ? 'flex-1' : 'min-h-[160px] max-h-[500px] overflow-y-auto'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-auto min-h-[160px] p-8 text-[14px] outline-none leading-relaxed font-mono text-slate-300"
          style={{ fontFamily: activeFont }}
          data-placeholder="[Terminal] > Enter signal metadata..."
        />
        {!content && <div className="absolute top-8 left-8 text-slate-600 pointer-events-none text-sm opacity-40 font-mono italic">[Terminal] > Enter signal metadata...</div>}
      </div>

      <div className="px-8 py-4 border-t border-[#1e293b] bg-[#0a0f1e] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 bg-black/40 rounded border border-[#1e293b]">
             <Activity size={14} className="text-emerald-500 animate-pulse"/> Uplink_Stable
           </div>
        </div>
        <button 
          onClick={handlePublish}
          disabled={isAnalyzing || !content.trim()}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-3.5 rounded font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isAnalyzing ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />} Commit_Signal
        </button>
      </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[#1e293b] group-last:hidden"></div>
      <div className="flex gap-5">
         <div className="relative shrink-0 z-10">
            <img 
              src={post.authorAvatar} 
              onClick={() => onNavigateToProfile(post.authorId)} 
              className="w-11 h-11 rounded border border-[#1e293b] bg-[#020617] object-cover cursor-pointer hover:border-indigo-600 transition-all shadow-sm" 
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full"></div>
         </div>
         <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
               <div className="flex items-center gap-3 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-white hover:text-indigo-400 cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={15} />
                  <span className="text-slate-600 font-bold truncate">@ {post.college.toLowerCase()}</span>
               </div>
               <span className="text-slate-600 font-mono italic opacity-60 whitespace-nowrap ml-2">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && onOpenThread(post.id)} className={`bg-[#020617] border border-[#1e293b] rounded-md shadow-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/40 ${isComment ? 'cursor-default' : 'cursor-pointer hover:-translate-y-0.5'}`}>
               <div className="p-6 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-[14px] leading-relaxed font-mono text-slate-300" />
                  
                  {post.pollData && (
                    <PollNode poll={post.pollData} postId={post.id} currentUser={currentUser} />
                  )}
               </div>
               <div className="px-6 py-3 bg-[#0a0f1e] border-t border-[#1e293b] flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-all">
                       <TrendingUp size={16} />
                       <span className="text-[11px] font-black">{post.likes} SYNC</span>
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all">
                       <MessageCircle size={16} />
                       <span className="text-[11px] font-black">{post.commentsCount} LOG</span>
                     </button>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-3 py-1 bg-white/5 border border-[#1e293b] rounded text-[8px] font-black uppercase text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-transparent transition-all">Trade</button>
                     <button className="px-3 py-1 bg-white/5 border border-[#1e293b] rounded text-[8px] font-black uppercase text-slate-500 hover:text-white hover:bg-rose-600 hover:border-transparent transition-all">Short</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </article>
  );
};

const PollNode: React.FC<{ poll: PollData, postId: string, currentUser: User }> = ({ poll, postId, currentUser }) => {
  const [hasVoted, setHasVoted] = useState(poll.options.some(o => o.voterIds.includes(currentUser.id)));
  const [isExpired] = useState(new Date(poll.expiresAt) < new Date());
  
  const handleVote = (optionId: string) => {
    if (hasVoted || isExpired) return;
    const posts = db.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId && p.pollData) {
        const newOpts = p.pollData.options.map(o => {
          if (o.id === optionId) return { ...o, votes: o.votes + 1, voterIds: [...o.voterIds, currentUser.id] };
          return o;
        });
        return { ...p, pollData: { ...p.pollData, options: newOpts, totalVotes: p.pollData.totalVotes + 1 } };
      }
      return p;
    });
    db.savePosts(updated);
    setHasVoted(true);
  };

  return (
    <div className="space-y-3 font-mono">
       <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2"><Gauge size={12}/> VOTE_EXECUTION</h4>
          <span className="text-[9px] font-bold text-slate-600 uppercase">COMMITS: {poll.totalVotes}</span>
       </div>
       <div className="space-y-2">
          {poll.options.map(opt => {
             const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
             const myVote = opt.voterIds.includes(currentUser.id);

             return (
                <button 
                  key={opt.id}
                  disabled={hasVoted || isExpired}
                  onClick={() => handleVote(opt.id)}
                  className={`w-full relative h-10 overflow-hidden border transition-all ${
                    myVote ? 'border-indigo-500' : 'border-[#1e293b] hover:border-slate-500'
                  }`}
                >
                   {(hasVoted || isExpired) && (
                      <div className={`absolute inset-y-0 left-0 ${myVote ? 'bg-indigo-600/20' : 'bg-white/5'}`} style={{ width: `${percentage}%` }} />
                   )}
                   <div className="relative z-10 px-4 h-full flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-tight">{opt.text}</span>
                      {(hasVoted || isExpired) && <span className="text-[11px] font-black italic">{percentage}%</span>}
                   </div>
                </button>
             );
          })}
       </div>
    </div>
  );
};

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void, triggerSafetyError: (msg: string) => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack, triggerSafetyError }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    const sync = () => { 
      setUser(db.getUser()); 
      const p = db.getPosts();
      setPosts(Array.isArray(p) ? p : []); 
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = async (content: string, font: string, poll?: PollData) => {
    setIsAnalyzing(true);
    const newPost: Post = {
      id: Date.now().toString(),
      author: user.name,
      authorId: user.id,
      authorRole: user.role,
      authorAvatar: user.avatar,
      timestamp: 'Just now',
      content: content,
      customFont: font,
      hashtags: [],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 1,
      flags: [], 
      isOpportunity: false,
      college: collegeFilter as College | 'Global',
      pollData: poll
    };
    db.addPost(newPost);
    setIsAnalyzing(false);
  };

  const filteredPosts = (posts || []).filter((p) => {
    if (threadId) return p.parentId === threadId || p.id === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1440px] mx-auto pb-40 lg:px-12 lg:py-8 font-sans bg-[#020617] min-h-screen">
      <VelocityTicker />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 lg:px-0 mt-10">
         <div className="lg:col-span-8 space-y-10">
            {!threadId && (
              <>
                <NetworkIntensityIndex posts={posts} />
                <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />
              </>
            )}
            {threadId && onBack && (
               <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-500 transition-colors mb-6">
                  <ChevronRight className="rotate-180" size={16}/> Back_To_Term
               </button>
            )}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-2 border-b border-[#1e293b] pb-4">
                  <div className="flex items-center gap-4">
                     <Command size={18} className="text-indigo-500 animate-pulse" />
                     <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">Stream: {collegeFilter.toUpperCase()}</h3>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500">
                    <Activity size={12}/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Live_Signal</span>
                  </div>
               </div>
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-10">
            <div className="bg-[#020617] border border-[#1e293b] rounded-md p-8 shadow-2xl">
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-4 border-b border-[#1e293b] pb-6">
                 <MousePointer2 size={20} className="text-indigo-500" /> Hot_Signals
               </h3>
               <div className="space-y-8">
                  {['#Hackathon', '#Exams', '#Guild89', '#Research'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center transition-all hover:bg-white/5 p-2 rounded">
                       <div>
                         <p className="text-[15px] font-black text-indigo-400 group-hover:text-indigo-300 uppercase italic">{tag}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">VOL: {(Math.random() * 10).toFixed(1)}k SIGNALS</p>
                       </div>
                       <div className="text-right">
                          <span className="text-emerald-500 font-mono text-[10px] font-black">+{(Math.random() * 20).toFixed(1)}%</span>
                          <div className="w-12 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                             <div className="h-full bg-emerald-500 w-3/4"></div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 bg-indigo-600 rounded-md text-white shadow-2xl relative overflow-hidden group border border-white/10">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700"><Zap size={120} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <h4 className="text-[14px] font-black uppercase tracking-widest italic">Pro_Node_Sync</h4>
                  <p className="text-[11px] font-bold opacity-80 uppercase leading-relaxed italic border-l-2 border-white/40 pl-4">
                    Upgrade to Pro Strata for real-time market insights and high-priority vault access.
                  </p>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-all active:scale-95">Sync Global Now</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
