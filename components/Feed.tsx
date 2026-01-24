import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, MessageCircle, X, Loader2, Eye, Zap, 
  Maximize2, Minimize2, Video, Type as LucideType, 
  Bold, Italic, Palette, Send, Underline, Eraser,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Link as LinkIcon,
  ImageIcon, HelpCircle, ChevronRight, TrendingUp, 
  Radio, Terminal, Sparkles, Star, ChevronDown, Type, Quote
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'headers' | 'fonts' | 'table' | 'colors' | 'help' | 'link' | 'align' | null>(null);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FONTS = [
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Inter UI', value: '"Inter", sans-serif' },
    { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  ];

  const COLOR_PALETTE = [
    ['#000000', '#424242', '#636363', '#919191', '#bdbdbd', '#e0e0e0', '#eeeeee', '#ffffff'],
    ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff']
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

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      restoreSelection();
      const html = `<a href="${linkUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: 700;">${linkText || linkUrl}</a> `;
      document.execCommand('insertHTML', false, html);
      setLinkText('');
      setLinkUrl('');
      setOpenDropdown(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        restoreSelection();
        const html = `<div class="content-image-wrapper"><img src="${base64}" class="responsive-doc-image" alt="User Document" /></div><br>`;
        document.execCommand('insertHTML', false, html);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const insertTable = (rows: number, cols: number) => {
    let html = '<table style="width:100%; border-collapse: collapse; border: 1px solid #ddd; margin: 10px 0;">';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) {
        html += '<td style="border: 1px solid #ddd; padding: 8px; min-width: 20px;">&nbsp;</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    exec('insertHTML', html);
  };

  const handlePublish = () => {
    const html = editorRef.current ? editorRef.current.innerHTML : '';
    if (html.trim() && html !== '<br>') {
      onPost(html, activeFont);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setContent('');
    }
  };

  const ToolbarButton: React.FC<{ onClick: () => void, icon: React.ReactNode, title?: string, active?: boolean }> = ({ onClick, icon, title, active }) => (
    <button 
      onMouseDown={(e) => { e.preventDefault(); saveSelection(); onClick(); }} 
      className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300 ${active ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );

  const dropdownBaseClass = "z-[3005] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded overflow-hidden animate-in fade-in slide-in-from-top-1";
  const mobileCenterClass = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:top-full md:left-0 md:translate-x-0 md:translate-y-0 md:mt-1 md:origin-top-left";

  return (
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded shadow-xl overflow-visible mb-10 transition-all ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none' : 'relative animate-in slide-in-from-top-4 duration-500'}`}>
      
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* COMPACT TOOLBAR */}
      <div className="px-2 py-1.5 border-b border-[var(--border-color)] bg-[#f8f9fa] dark:bg-white/5 flex flex-wrap items-center gap-x-1 gap-y-1 relative z-[60]">
        
        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'headers' ? null : 'headers'); }}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10"
          >
            Format <ChevronDown size={10} />
          </button>
          {openDropdown === 'headers' && (
            <div className={`${dropdownBaseClass} ${mobileCenterClass} w-48 py-1`}>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'H2'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white font-black text-sm uppercase">Heading</button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'H3'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white font-bold text-xs uppercase">Sub-heading</button>
              <div className="h-px bg-[var(--border-color)] my-1"></div>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'blockquote'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2">
                 <Quote size={12}/> <span className="text-xs font-bold uppercase">Quote Block</span>
              </button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'p'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white text-xs font-bold uppercase">Paragraph</button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => exec('bold')} icon={<Bold size={14}/>} title="Bold" />
          <ToolbarButton onClick={() => exec('underline')} icon={<Underline size={14}/>} title="Underline" />
          <ToolbarButton onClick={() => exec('removeFormat')} icon={<Eraser size={14}/>} title="Clean Styles" />
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>

        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 min-w-[100px] justify-between"
          >
            <span className="truncate">{FONTS.find(f => f.value === activeFont)?.name || 'Font'}</span> <ChevronDown size={10} />
          </button>
          {openDropdown === 'fonts' && (
            <div className={`${dropdownBaseClass} ${mobileCenterClass} w-56 max-h-64 overflow-y-auto py-1`}>
              {FONTS.map(f => (
                <button 
                  key={f.name} 
                  onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); if (editorRef.current) editorRef.current.focus(); }}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors text-xs font-bold uppercase"
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>

        <ToolbarButton onClick={() => setIsFullscreen(!isFullscreen)} icon={isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>} title="Toggle Fullscreen" />
        
        <ToolbarButton onClick={() => fileInputRef.current?.click()} icon={<ImageIcon size={14}/>} title="Upload Assets" />

        <button 
          onClick={handlePublish}
          disabled={isAnalyzing || !content.trim()}
          className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded font-black text-[9px] uppercase tracking-widest transition-all shadow active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />} Commit Signal
        </button>
      </div>

      {/* COMPACT TYPING AREA */}
      <div className={`relative bg-white dark:bg-black/20 ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'min-h-[100px] max-h-[400px]'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          onFocus={saveSelection}
          onBlur={saveSelection}
          className="w-full h-full p-6 text-sm outline-none leading-relaxed overflow-y-auto rich-content-style"
          style={{ fontFamily: activeFont }}
          data-placeholder="Initialize alphanumeric broadcast..."
        />
        {!content && <div className="absolute top-6 left-6 text-slate-400 pointer-events-none text-sm font-black uppercase tracking-tight opacity-40">Initialize alphanumeric broadcast...</div>}
      </div>

      <style>{`
        .rich-content-style:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content-style h2 { font-size: 1.5rem; font-weight: 900; margin: 0.5rem 0; text-transform: uppercase; line-height: 1; display: block; font-style: normal; }
        .rich-content-style h3 { font-size: 1.25rem; font-weight: 900; margin: 0.4rem 0; text-transform: uppercase; font-style: normal; }
        .rich-content-style p { margin-bottom: 0.5rem; font-weight: 500; font-style: normal; }
        .content-image-wrapper { margin: 12px 0; text-align: center; width: 100%; display: flex; justify-content: center; }
        .responsive-doc-image { max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid #30363d; }
        .rich-content-style blockquote { border-left: 4px solid #4f46e5; padding-left: 1rem; font-weight: 700; color: #64748b; margin: 1rem 0; text-transform: uppercase; font-style: normal; }
        .rich-content-style a { color: #4f46e5; text-decoration: underline; font-weight: 900; font-style: normal; }
      `}</style>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
      <div className="flex gap-4">
         <img src={post.authorAvatar} alt={post.author} onClick={() => onNavigateToProfile(post.authorId)} className="w-10 h-10 rounded border border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-90 transition-all" />
         <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
               <div className="flex items-center gap-2 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:text-indigo-600 transition-colors cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={14} />
                  {post.isOpportunity && <Star size={12} className="text-amber-500 fill-amber-500" />}
                  <span className="text-slate-500 truncate ml-1">/{post.college} Hub</span>
               </div>
               <span className="text-slate-500 font-mono text-[9px] ml-2 opacity-60">commit {post.id.slice(-6)}</span>
            </div>
            <div onClick={() => !isComment && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded overflow-hidden transition-all hover:border-indigo-500/50 shadow-sm ${isComment ? 'cursor-default' : 'cursor-pointer'}`}>
               <div className="p-6 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content-style text-[14px] leading-relaxed font-bold uppercase tracking-tight" />
               </div>
               <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center gap-8">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{post.likes} Ups</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{post.commentsCount} Syncs</span>
                  </button>
                  <div className="ml-auto text-[9px] font-black uppercase text-slate-400 tracking-widest">{post.timestamp}</div>
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
    const sync = () => { 
      setUser(db.getUser()); 
      const p = db.getPosts();
      setPosts(Array.isArray(p) ? p : []); 
    };
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
      const text = response.text || '{}';
      const analysis = JSON.parse(text);
      if (analysis.isOpportunity) {
        opportunityData = {
          type: analysis.type,
          deadline: analysis.deadline,
          isAIVerified: true,
          detectedBenefit: analysis.detectedBenefit
        };
      }
    } catch (e) { 
      console.warn("AI Sync Refused"); 
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
      isOpportunity: !!opportunityData,
      opportunityData: opportunityData,
      college: collegeFilter as College | 'Global'
    };
    db.addPost(newPost);
    setIsAnalyzing(false);
  };

  const filteredPosts = (posts || []).filter((p) => {
    if (threadId) return p.parentId === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 lg:px-0">
         <div className="lg:col-span-8 space-y-10">
            {!threadId && <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Signal Cluster: {collegeFilter} HUB</h3>
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-600/5 border border-indigo-600/10 rounded">
                    <Radio size={12} className="animate-pulse text-indigo-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">Live Synchronous Stream</span>
                  </div>
               </div>
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit">
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded p-8 shadow-sm space-y-8">
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                 <TrendingUp size={16} className="text-indigo-600" /> Critical Signals
               </h3>
               <div className="space-y-6">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs', '#FinTechMak'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center">
                       <div>
                         <p className="text-sm font-black text-indigo-600 group-hover:underline uppercase tracking-tight">{tag}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">High Intensity Pulse</p>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
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