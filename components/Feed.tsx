
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, X, 
  Loader2, Eye, Zap, 
  Maximize2, Minimize2, HelpCircle, 
  Video, Type as FontIcon, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Table, Link as LinkIcon, Eraser,
  Send, Strikethrough, ArrowLeft, ChevronRight
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  const config: Record<AuthorityRole, { bg: string, icon: React.ReactNode, border: string, textColor: string }> = {
    'Super Admin': { bg: 'bg-rose-600', border: 'border-rose-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Administrator': { bg: 'bg-indigo-600', border: 'border-indigo-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Lecturer': { bg: 'bg-slate-800', border: 'border-slate-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Chairperson': { bg: 'bg-emerald-600', border: 'border-emerald-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'GRC': { bg: 'bg-sky-500', border: 'border-sky-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Student Leader': { bg: 'bg-amber-500', border: 'border-amber-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Graduate': { bg: 'bg-slate-500', border: 'border-slate-400/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Alumni': { bg: 'bg-slate-400', border: 'border-slate-300/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> },
    'Staff': { bg: 'bg-slate-600', border: 'border-slate-500/50', textColor: 'text-white', icon: <Zap size={size === 'sm' ? 10 : 12} /> }
  };
  const current = config[role] || config['Administrator'];
  const sizeClasses = size === 'sm' ? 'h-4 px-1.5' : 'h-5 px-2';
  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${current.bg} ${current.textColor} border ${current.border} shadow-sm ml-1 select-none`}>
       <span className="text-[7px] font-black uppercase tracking-widest">{role}</span>
    </div>
  );
};

interface ComposerProps {
  user: User;
  placeholder?: string;
  onPost: (content: string, font: string, image: string | null) => void;
  isAnalyzing: boolean;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  autoFocus?: boolean;
}

const Composer: React.FC<ComposerProps> = ({ user, placeholder, onPost, isAnalyzing, isFullscreen, setIsFullscreen }) => {
  const [selectedFont, setSelectedFont] = useState('"Plus Jakarta Sans"');
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'style' | 'color' | 'table' | 'font' | 'align'>('none');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rainbowColors = [
    '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
    '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
  ];

  const fonts = [
    { name: 'Default', value: '"Plus Jakarta Sans"' },
    { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
    { name: 'Monospace', value: '"JetBrains Mono", monospace' },
    { name: 'Serif', value: '"Playfair Display", serif' }
  ];

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0));
  };

  const restoreSelection = () => {
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
  };

  const exec = (command: string, value: string = '') => {
    restoreSelection();
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setActiveDropdown('none');
  };

  const handleInsertTable = (r: number, c: number) => {
    let tableHtml = `<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #ced4da;">`;
    for (let i = 0; i < r; i++) {
      tableHtml += "<tr>";
      for (let j = 0; j < c; j++) tableHtml += `<td style="border: 1px solid #ced4da; padding: 12px; min-height: 40px;">&nbsp;</td>`;
      tableHtml += "</tr>";
    }
    tableHtml += "</table><p><br></p>";
    exec('insertHTML', tableHtml);
  };

  const submitPost = () => {
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !selectedImage) return;
    onPost(content, selectedFont, selectedImage);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setSelectedImage(null);
  };

  return (
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] shadow-sm flex flex-col ${isFullscreen ? 'fixed inset-0 z-[1000] h-screen border-none rounded-none' : ''}`}>
       <div className="bg-slate-50 dark:bg-white/5 border-b border-[var(--border-color)] px-2 py-1.5 flex flex-wrap items-center gap-0.5 z-[20]">
          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => setActiveDropdown(activeDropdown === 'style' ? 'none' : 'style')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-1">
               <Eraser size={14} className="rotate-180" /> <ChevronDown size={10}/>
            </button>
            {activeDropdown === 'style' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-64 p-1">
                 {[{ n: 'Normal', cmd: 'p' }, { n: 'Blockquote', cmd: 'blockquote' }, { n: 'Code', cmd: 'pre' }, { n: 'Header 1', cmd: 'h1' }, { n: 'Header 2', cmd: 'h2' }].map((s, i) => (
                   <button key={i} onClick={() => exec('formatBlock', s.cmd)} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold">{s.n}</button>
                 ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Bold size={14}/></button>
            <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Italic size={14}/></button>
            <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Underline size={14}/></button>
          </div>

          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => { saveSelection(); setActiveDropdown(activeDropdown === 'color' ? 'none' : 'color'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex flex-col items-center">
               <span className="font-serif font-black text-xs">A</span>
               <div className="h-0.5 w-3 bg-indigo-500 rounded-full"></div>
            </button>
            {activeDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-[200px] p-2 grid grid-cols-4 gap-1">
                {rainbowColors.map((c, i) => (
                   <button key={i} onClick={() => exec('foreColor', c)} className="w-full aspect-square rounded" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setActiveDropdown(activeDropdown === 'table' ? 'none' : 'table')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded border-r border-[var(--border-color)] pr-1 mr-1"><ImageIcon size={14}/></button>
          
          <div className="flex gap-0.5 ml-auto">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded">
               {isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
            </button>
          </div>
       </div>

       <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] ${isFullscreen ? 'p-12' : 'p-6'}`}>
          <div className={`${isFullscreen ? 'max-w-4xl mx-auto' : 'flex gap-4'}`}>
             {!isFullscreen && <img src={user.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white shrink-0" />}
             <div className="flex-1 space-y-4">
               <div ref={editorRef} contentEditable onBlur={saveSelection} className={`w-full bg-transparent border-none focus:outline-none text-[14px] font-medium text-[var(--text-primary)] leading-relaxed rich-content outline-none min-h-[120px]`} style={{ fontFamily: selectedFont }} data-placeholder={placeholder || "Start crafting your signal..."} />
               {selectedImage && (
                 <div className="relative rounded-[6px] overflow-hidden group border border-[var(--border-color)] max-w-sm">
                   <img src={selectedImage} className="w-full object-cover" />
                   <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"><X size={14}/></button>
                 </div>
               )}
             </div>
          </div>
       </div>
       
       <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-[var(--border-color)] flex justify-between items-center z-[30]">
         <div className="flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-indigo-600 transition-colors"><ImageIcon size={18}/></button>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Video size={18}/></button>
         </div>
         <button onClick={submitPost} disabled={isAnalyzing} className="bg-indigo-600 text-white px-8 py-2.5 rounded-[4px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md">
            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>} Commit Signal
         </button>
       </div>

       <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
         const file = e.target.files?.[0];
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
         }
       }} accept="image/*" />
    </div>
  );
};

const PostItem: React.FC<{ post: Post, onOpenThread: (id: string) => void, isComment?: boolean }> = ({ post, onOpenThread, isComment }) => {
  return (
    <article className="group relative">
      <div className={`absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden`}></div>
      <div className="flex gap-3">
         <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10" />
         <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase">
               <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-primary)] hover:underline cursor-pointer">{post.author}</span>
                  <span className="text-slate-500">{post.college}</span>
                  <AuthoritySeal role={post.authorAuthority} size="sm" />
               </div>
               <span className="text-slate-500 font-mono text-[9px]">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] shadow-sm overflow-hidden transition-all hover:border-indigo-500/30 ${isComment ? 'cursor-default' : 'cursor-pointer'}`}>
               <div className="p-5 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content text-[14px] leading-relaxed" />
                  {post.images?.[0] && <img src={post.images[0]} className="w-full object-cover max-h-[400px] rounded-[4px] border border-[var(--border-color)] mt-2" alt="Asset" />}
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

const Feed: React.FC<{ collegeFilter?: College, threadId?: string, onOpenThread: (id: string) => void, onBack?: () => void }> = ({ collegeFilter, threadId, onOpenThread, onBack }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePost = async (content: string, font: string, image: string | null, parentId?: string) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify safety for university post: "${content.substring(0, 200)}"`,
        config: { responseMimeType: "application/json" }
      });
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
        authorAuthority: (user as any).badges?.includes('Super Admin') ? 'Super Admin' : 'Administrator',
        timestamp: 'Just now', content: content, customFont: font,
        images: image ? [image] : undefined,
        hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
        isOpportunity: false, college: activeTab === 'Global' ? 'Global' : activeTab as College,
        parentId: parentId
      };
      
      if (parentId) {
         const all = db.getPosts();
         const updated = all.map(p => p.id === parentId ? {...p, commentsCount: p.commentsCount + 1} : p);
         db.savePosts([newPost, ...updated]);
      } else {
         db.addPost(newPost);
      }
      setIsAnalyzing(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  const filteredPosts = threadId 
    ? posts.filter(p => p.parentId === threadId)
    : posts.filter(p => !p.parentId && (activeTab === 'Global' || p.college === activeTab));

  const threadParent = threadId ? posts.find(p => p.id === threadId) : null;
  const ancestorId = threadParent?.parentId;
  const ancestor = ancestorId ? posts.find(p => p.id === ancestorId) : null;

  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8">
      {threadId ? (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6 px-4 lg:px-0">
               <div className="flex items-center gap-4 mb-6">
                  <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"><ArrowLeft size={20}/></button>
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">Signal Terminal</h2>
               </div>

               {ancestor && (
                 <div className="opacity-40 hover:opacity-100 transition-opacity mb-2">
                    <button onClick={() => onOpenThread(ancestor.id)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                       <ArrowLeft size={12}/> Parent Signal
                    </button>
                    <PostItem post={ancestor} onOpenThread={onOpenThread} isComment />
                 </div>
               )}

               {threadParent && (
                 <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="scale-105 origin-top mb-10">
                      <PostItem post={threadParent} onOpenThread={() => {}} />
                   </div>
                   <div className="pl-6 md:pl-12 border-l-2 border-indigo-600/20">
                     <Composer 
                       user={user} 
                       placeholder={`Signal your reply to ${threadParent.author}...`} 
                       onPost={(c, f, i) => handlePost(c, f, i, threadId)} 
                       isAnalyzing={isAnalyzing} 
                       isFullscreen={isFullscreen} 
                       setIsFullscreen={setIsFullscreen} 
                     />
                     <div className="mt-12 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-[var(--border-color)] pb-3">Decrypted Replies</h3>
                        {filteredPosts.map(p => (
                          <div key={p.id} className="hover:translate-x-1 transition-transform">
                            <PostItem post={p} onOpenThread={onOpenThread} />
                          </div>
                        ))}
                     </div>
                   </div>
                 </div>
               )}
            </div>
            <aside className="hidden lg:block lg:col-span-4 sticky top-20 h-fit space-y-6">
               <div className="bg-indigo-600 rounded-3xl p-8 text-white space-y-4">
                  <Zap size={32} fill="white"/>
                  <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">Context Node</h4>
                  <p className="text-xs font-medium text-white/80 italic">"You are currently scanning a deep-nested signal. All replies are anchored to this node."</p>
               </div>
            </aside>
         </div>
      ) : (
         <>
            {!collegeFilter && (
              <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-4">
                  <button onClick={() => setActiveTab('Global')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Global' ? 'bg-indigo-600 text-white' : 'text-slate-500 bg-[var(--bg-secondary)]'}`}>Global Hub</button>
                  {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
                    <button key={c} onClick={() => setActiveTab(c as College)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === c ? 'bg-indigo-600 text-white' : 'text-slate-500 bg-[var(--bg-secondary)]'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 px-4 lg:px-0">
               <div className="lg:col-span-8 space-y-8">
                  <Composer user={user} onPost={handlePost} isAnalyzing={isAnalyzing} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
                  <div className="space-y-6">
                     {filteredPosts.map(post => <PostItem key={post.id} post={post} onOpenThread={onOpenThread} />)}
                  </div>
               </div>
               <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20 h-fit">
                  <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Trending Analytics</h3>
                     <div className="space-y-4">
                        {['#ResearchWeek', '#Guild89', '#COCISLabs'].map(tag => (
                          <div key={tag} className="group cursor-pointer">
                             <p className="text-sm font-black text-indigo-600 group-hover:underline">{tag}</p>
                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Signal</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </aside>
            </div>
         </>
      )}
    </div>
  );
};

export default Feed;
