
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, PollOption } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, MessageCircle, X, Loader2, Eye, Zap, 
  Maximize2, Minimize2, Video, Type as LucideType, 
  Bold, Italic, Palette, Send, Underline, Eraser,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Link as LinkIcon,
  ImageIcon, HelpCircle, ChevronRight, TrendingUp, 
  Radio, Terminal, Sparkles, Star, ChevronDown, Type, Quote,
  BarChart2, PlusCircle, MinusCircle, CheckCircle, Image as LucideImage
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

const PostCreator: React.FC<{ onPost: (content: string, font: string, poll?: PollData) => void, isAnalyzing: boolean }> = ({ onPost, isAnalyzing }) => {
  const [content, setContent] = useState('');
  const [activeFont, setActiveFont] = useState('"JetBrains Mono"');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'headers' | 'fonts' | 'table' | 'colors' | 'help' | 'link' | 'align' | null>(null);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  
  // Poll State
  const [isPollMode, setIsPollMode] = useState(false);
  const [pollOptions, setPollOptions] = useState<{ text: string, imageUrl?: string }[]>([
    { text: '' }, { text: '' }
  ]);
  const [pollDuration, setPollDuration] = useState('1'); // Days

  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollOptionFileRef = useRef<HTMLInputElement>(null);
  const [currentPollOptionIdx, setCurrentPollOptionIdx] = useState<number | null>(null);

  const FONTS = [
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Inter UI', value: '"Inter", sans-serif' },
    { name: 'Scholar Serif', value: '"Playfair Display", serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  ];

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
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
        alert("PROTOCOL ERROR: Poll requires at least 2 valid options.");
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

  const handlePollOptionImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentPollOptionIdx !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newOpts = [...pollOptions];
        newOpts[currentPollOptionIdx].imageUrl = base64;
        setPollOptions(newOpts);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
    setCurrentPollOptionIdx(null);
  };

  return (
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-xl overflow-visible mb-10 transition-all ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none' : 'relative animate-in slide-in-from-top-4 duration-500'}`}>
      
      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            restoreSelection();
            document.execCommand('insertHTML', false, `<div class="content-image-wrapper"><img src="${base64}" class="responsive-doc-image" alt="User Document" /></div><br>`);
          };
          reader.readAsDataURL(file);
        }
        e.target.value = '';
      }} accept="image/*" className="hidden" />

      <input type="file" ref={pollOptionFileRef} onChange={handlePollOptionImage} accept="image/*" className="hidden" />

      <div className="px-1.5 py-0.5 border-b border-[var(--border-color)] bg-[#f8f9fa] dark:bg-white/5 flex flex-wrap items-center gap-x-0.5 gap-y-0.5 relative z-[60]">
        <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300"><Bold size={12}/></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300"><Italic size={12}/></button>
        <div className="h-3 w-px bg-[var(--border-color)] mx-0.5"></div>
        
        <div className="relative">
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }} className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[9px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
            {FONTS.find(f => f.value === activeFont)?.name || 'Font'} <ChevronDown size={8} />
          </button>
          {openDropdown === 'fonts' && (
            <div className="absolute top-full left-0 mt-1 z-[3005] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md overflow-hidden w-56 max-h-64 overflow-y-auto">
              {FONTS.map(f => (
                <button key={f.name} onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white text-xs" style={{ fontFamily: f.value }}>{f.name}</button>
              ))}
            </div>
          )}
        </div>

        <div className="h-3 w-px bg-[var(--border-color)] mx-0.5"></div>
        
        <button onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300" title="Upload Image"><ImageIcon size={12}/></button>
        
        {/* POLL TOGGLE BUTTON */}
        <button 
          onMouseDown={(e) => { e.preventDefault(); setIsPollMode(!isPollMode); }} 
          className={`p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors flex items-center gap-1.5 ${isPollMode ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}
          title="Poll Node"
        >
          <BarChart2 size={12}/>
          <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Poll</span>
        </button>

        <div className="h-3 w-px bg-[var(--border-color)] mx-0.5"></div>
        <button onMouseDown={(e) => { e.preventDefault(); setIsFullscreen(!isFullscreen); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300">{isFullscreen ? <Minimize2 size={12}/> : <Maximize2 size={12}/>}</button>
      </div>

      <div className={`relative bg-white dark:bg-black/20 ${isFullscreen ? 'h-[calc(100vh-250px)]' : 'min-h-[100px] max-h-[400px] overflow-y-auto'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-auto min-h-[100px] p-4 text-sm outline-none leading-tight rich-content-style font-mono"
          style={{ fontFamily: activeFont }}
          data-placeholder="Define signal parameters..."
        />
        {!content && <div className="absolute top-4 left-4 text-slate-400 pointer-events-none text-sm opacity-40 font-mono italic">Define signal parameters...</div>}
      </div>

      {/* TACTICAL POLL MODULE */}
      {isPollMode && (
        <div className="p-4 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5 space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
              <Radio size={14} className="text-indigo-600" /> Configuration_Matrix
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration_Lapse (Days)</span>
              <select 
                value={pollDuration} 
                onChange={(e) => setPollDuration(e.target.value)}
                className="bg-white dark:bg-[#161b22] border border-[var(--border-color)] rounded px-2 py-0.5 text-[9px] font-black uppercase outline-none focus:border-indigo-600"
              >
                <option value="1">01D</option>
                <option value="3">03D</option>
                <option value="7">07D</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-3 items-center group">
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-3 text-[9px] font-black text-indigo-600/40 uppercase">OPT_{idx + 1}</span>
                  <input 
                    className="w-full bg-white dark:bg-[#161b22] border border-[var(--border-color)] rounded py-2.5 pl-12 pr-10 text-[11px] font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
                    placeholder="Enter alphanumeric value..."
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[idx].text = e.target.value;
                      setPollOptions(newOpts);
                    }}
                  />
                  <button 
                    onClick={() => {
                      setCurrentPollOptionIdx(idx);
                      pollOptionFileRef.current?.click();
                    }}
                    className={`absolute right-3 hover:text-indigo-600 transition-colors ${opt.imageUrl ? 'text-indigo-600' : 'text-slate-400'}`}
                    title="Add Image Node"
                  >
                    <LucideImage size={14} />
                  </button>
                </div>
                {idx > 1 && (
                  <button onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 transition-colors">
                    <MinusCircle size={16}/>
                  </button>
                )}
                {idx === pollOptions.length - 1 && pollOptions.length < 4 && (
                  <button onClick={() => setPollOptions([...pollOptions, { text: '' }])} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                    <PlusCircle size={16}/>
                  </button>
                )}
              </div>
            ))}
            
            {/* Poll Images Preview */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
              {pollOptions.map((opt, idx) => opt.imageUrl && (
                <div key={`prev-${idx}`} className="relative shrink-0">
                  <img src={opt.imageUrl} className="w-12 h-12 object-cover rounded border border-indigo-600/30" />
                  <button 
                    onClick={() => {
                      const newOpts = [...pollOptions];
                      newOpts[idx].imageUrl = undefined;
                      setPollOptions(newOpts);
                    }}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-lg"
                  >
                    <X size={8} />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[6px] font-black text-center py-0.5 rounded-b">OPT_{idx+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[#f8f9fa] dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isAnalyzing && (
             <div className="flex items-center gap-2 px-2 py-0.5 bg-indigo-600/10 rounded-full text-indigo-600">
               <Loader2 size={10} className="animate-spin" />
               <span className="text-[7px] font-black uppercase tracking-widest">Neural_Scanning</span>
             </div>
          )}
        </div>
        <button 
          onClick={handlePublish}
          disabled={isAnalyzing || !content.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-black text-[9px] uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={12} /> Commit Signal
        </button>
      </div>

      <style>{`
        .rich-content-style:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content-style h2 { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin: 0.5rem 0; }
        .content-image-wrapper { margin: 12px 0; display: flex; justify-content: center; }
        .responsive-doc-image { max-width: 100%; max-height: 300px; border-radius: 2px; border: 1px solid var(--border-color); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
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
    <div className="space-y-4 font-mono p-4 border border-indigo-600/20 bg-indigo-50/10 dark:bg-indigo-900/5 rounded-md">
       <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-500 tracking-widest border-b border-indigo-600/10 pb-2">
          <div className="flex items-center gap-2"><BarChart2 size={12} className="text-indigo-600"/> Synchronized_Poll</div>
          <div className="flex items-center gap-3">
             <span>{poll.totalVotes} COMMITS</span>
             <span className={isExpired ? 'text-rose-500' : 'text-emerald-500'}>{isExpired ? '[HALTED]' : '[ACTIVE]'}</span>
          </div>
       </div>

       <div className="space-y-3 pt-2">
          {poll.options.map(opt => {
             const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
             const myVote = opt.voterIds.includes(currentUser.id);

             return (
                <div key={opt.id} className="space-y-1.5">
                   <button 
                     disabled={hasVoted || isExpired}
                     onClick={() => handleVote(opt.id)}
                     className={`w-full group relative flex flex-col items-stretch overflow-hidden rounded border transition-all ${
                        myVote ? 'border-indigo-600 shadow-indigo-600/20' : 
                        hasVoted || isExpired ? 'border-[var(--border-color)] opacity-80 cursor-default' : 
                        'border-[var(--border-color)] hover:border-indigo-600'
                     }`}
                   >
                      {/* Bar Background */}
                      {(hasVoted || isExpired) && (
                         <div 
                           className={`absolute inset-0 transition-all duration-1000 ${myVote ? 'bg-indigo-600/15' : 'bg-slate-100 dark:bg-white/5'}`} 
                           style={{ width: `${percentage}%` }}
                         />
                      )}

                      <div className="relative z-10 px-4 py-3 flex items-center justify-between">
                         <div className="flex items-center gap-3 flex-1 min-w-0">
                            {opt.imageUrl && (
                               <img src={opt.imageUrl} className="w-8 h-8 rounded-sm object-cover border border-indigo-600/20" />
                            )}
                            <span className="text-[11px] font-black uppercase truncate tracking-tight">{opt.text}</span>
                            {myVote && <CheckCircle size={10} className="text-indigo-600 shrink-0"/>}
                         </div>
                         {(hasVoted || isExpired) && (
                            <span className="text-[10px] font-black text-indigo-600 ml-4">{percentage}%</span>
                         )}
                      </div>
                   </button>
                </div>
             );
          })}
       </div>

       <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400 tracking-[0.2em] pt-2">
          <span>SHA-256 Protocol Hash: {postId.slice(-8)}</span>
          <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
       </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
      <div className="flex gap-3">
         <img src={post.authorAvatar} alt={post.author} onClick={() => onNavigateToProfile(post.authorId)} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-90 transition-all" />
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
            <div onClick={() => !isComment && !post.pollData && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-sm overflow-hidden transition-all hover:border-indigo-500/30 ${isComment || post.pollData ? 'cursor-default' : 'cursor-pointer'}`}>
               <div className="p-5 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content-style text-[14px] leading-relaxed font-mono" />
                  
                  {/* POLL RENDERING */}
                  {post.pollData && (
                    <PollNode poll={post.pollData} postId={post.id} currentUser={currentUser} />
                  )}
               </div>
               <div className="px-5 py-2 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={14} />
                    <span className="text-[9px] font-bold">{post.likes}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={14} />
                    <span className="text-[9px] font-bold">{post.commentsCount}</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </article>
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
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const images: { data: string, mimeType: string }[] = [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const imgTags = tempDiv.querySelectorAll('img');
    imgTags.forEach(img => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:')) {
        const [meta, data] = src.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        images.push({ data, mimeType });
      }
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this signal for public consumption. Flag "unsafe" if it contains sexually explicit content, abuse, or indecency. Return JSON: { "isSafe": boolean, "unsafeReason": "string|null", "isOpportunity": boolean, "oppType": "Internship|Gig|Grant|Workshop|null", "benefit": "string(3 words)|null" } Text: "${plainText}"`;
      const contents: any[] = [{ text: prompt }];
      images.forEach(img => contents.push({ inlineData: { data: img.data, mimeType: img.mimeType } }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: contents },
        config: { responseMimeType: "application/json" }
      });

      const analysis = JSON.parse(response.text || '{}');
      if (analysis.isSafe === false) {
        setIsAnalyzing(false);
        triggerSafetyError(`BLOCK: ${analysis.unsafeReason || "Indecent or harmful content detected."}`);
        return;
      }

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
        isOpportunity: !!analysis.isOpportunity,
        opportunityData: analysis.isOpportunity ? {
          type: analysis.oppType || 'Gig',
          isAIVerified: true,
          detectedBenefit: analysis.benefit || 'Detected Benefit'
        } : undefined,
        pollData: poll,
        college: collegeFilter as College | 'Global'
      };
      
      db.addPost(newPost);
      setIsAnalyzing(false);
    } catch (e) { 
      setIsAnalyzing(false);
      // Fallback for demo if API fails
      const newPost: Post = { id: Date.now().toString(), author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar, timestamp: 'Just now', content, customFont: font, hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], isOpportunity: false, pollData: poll, college: collegeFilter as College | 'Global' };
      db.addPost(newPost);
    }
  };

  const filteredPosts = (posts || []).filter((p) => {
    if (threadId) return p.parentId === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
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
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit">
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                 <TrendingUp size={14} className="text-indigo-600" /> Hot Signals
               </h3>
               <div className="space-y-5">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center">
                       <div>
                         <p className="text-sm font-black text-indigo-600 group-hover:underline">{tag}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">High Intensity</p>
                       </div>
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
