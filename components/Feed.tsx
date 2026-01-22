
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, X, 
  Loader2, Eye, Zap, 
  Maximize2, Minimize2, HelpCircle, 
  Video, Type as FontIcon, AlignJustify, Minus, Eraser, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Table, Link as LinkIcon, Highlighter,
  Code, Quote, Trash2, Send, Strikethrough, ArrowLeft
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

const Composer: React.FC<ComposerProps> = ({ user, placeholder, onPost, isAnalyzing, isFullscreen, setIsFullscreen, autoFocus }) => {
  const [selectedFont, setSelectedFont] = useState('"Plus Jakarta Sans"');
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'style' | 'color' | 'table' | 'font' | 'align'>('none');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rainbowColors = [
    '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
    '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
    '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'
  ];

  const fonts = [
    { name: 'Default', value: '"Plus Jakarta Sans"' },
    { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
    { name: 'Monospace', value: '"JetBrains Mono", monospace' },
    { name: 'Serif', value: '"Playfair Display", serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Montserrat', value: '"Montserrat", sans-serif' }
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

  const handleInsertLink = () => {
    if (!linkData.url) return;
    const linkHtml = `<a href="${linkData.url}" target="_blank" style="color: #6366f1; text-decoration: underline; font-weight: bold;">${linkData.text || linkData.url}</a>`;
    exec('insertHTML', linkHtml);
    setShowLinkModal(false);
    setLinkData({ text: '', url: '' });
  };

  const handleInsertVideo = () => {
    if (!videoUrl) return;
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) embedUrl = videoUrl.replace('watch?v=', 'embed/');
    const videoHtml = `<div class="aspect-video my-4"><iframe src="${embedUrl}" class="w-full h-full rounded-md" frameborder="0" allowfullscreen></iframe></div><p><br></p>`;
    exec('insertHTML', videoHtml);
    setShowVideoModal(false);
    setVideoUrl('');
  };

  const submitPost = () => {
    const content = editorRef.current?.innerHTML || '';
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
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-64 p-1 animate-in slide-in-from-top-1">
                 {[
                   { n: 'Normal', cmd: 'p', style: 'text-sm' },
                   { n: 'Blockquote', cmd: 'blockquote', style: 'text-sm italic border-l-4 border-blue-500 pl-4 py-2' },
                   { n: 'Code', cmd: 'pre', style: 'text-xs font-mono bg-slate-100 p-1 rounded' },
                   { n: 'Header 1', cmd: 'h1', style: 'text-3xl font-black' },
                   { n: 'Header 2', cmd: 'h2', style: 'text-2xl font-extrabold' },
                   { n: 'Header 3', cmd: 'h3', style: 'text-xl font-bold' },
                   { n: 'Header 4', cmd: 'h4', style: 'text-lg font-bold' },
                   { n: 'Header 5', cmd: 'h5', style: 'text-base font-bold' },
                   { n: 'Header 6', cmd: 'h6', style: 'text-sm font-bold uppercase tracking-widest opacity-60' }
                 ].map((s, i) => (
                   <button key={i} onClick={() => exec('formatBlock', s.cmd)} className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 border-b last:border-none border-slate-100 dark:border-white/5">
                      <span className={s.style}>{s.n}</span>
                   </button>
                 ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Bold size={14}/></button>
            <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Underline size={14}/></button>
            <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Italic size={14}/></button>
          </div>

          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => setActiveDropdown(activeDropdown === 'align' ? 'none' : 'align')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-1">
               <AlignLeft size={14}/> <ChevronDown size={10}/>
            </button>
            {activeDropdown === 'align' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-48 p-1 animate-in slide-in-from-top-1">
                <button onClick={() => exec('justifyLeft')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignLeft size={14}/> Left</button>
                <button onClick={() => exec('justifyCenter')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignCenter size={14}/> Center</button>
                <button onClick={() => exec('justifyRight')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignRight size={14}/> Right</button>
              </div>
            )}
          </div>

          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => { saveSelection(); setActiveDropdown(activeDropdown === 'color' ? 'none' : 'color'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex flex-col items-center">
               <span className="font-serif font-black text-xs">A</span>
               <div className="h-0.5 w-3 bg-indigo-500 rounded-full"></div>
            </button>
            {activeDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-[450px] p-4 flex gap-6 animate-in zoom-in-95 duration-100">
                 <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Background</p>
                    <div className="grid grid-cols-8 gap-0.5 mt-2">
                       {rainbowColors.map((c, i) => (
                         <button key={i} onClick={() => exec('hiliteColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                       ))}
                    </div>
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Text Color</p>
                    <div className="grid grid-cols-8 gap-0.5 mt-2">
                       {rainbowColors.map((c, i) => (
                         <button key={i} onClick={() => exec('foreColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => setActiveDropdown(activeDropdown === 'table' ? 'none' : 'table')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded">
               <Table size={14}/>
            </button>
            {activeDropdown === 'table' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] p-6 animate-in zoom-in-95 duration-100">
                <div className="grid grid-cols-10 gap-1 mb-4">
                   {Array.from({length: 10}).map((_, r) => (
                     Array.from({length: 10}).map((_, c) => (
                       <div key={`${r}-${c}`} onMouseEnter={() => setTableHover({r: r+1, c: c+1})} onClick={() => handleInsertTable(r+1, c+1)}
                         className={`w-6 h-6 border transition-colors cursor-pointer ${r < tableHover.r && c < tableHover.c ? 'bg-[#cce5ff] border-[#b8daff]' : 'bg-white border-[#dee2e6]'}`}
                       />
                     ))
                   ))}
                </div>
                <p className="text-sm font-black text-center text-indigo-600">{tableHover.r} x {tableHover.c}</p>
              </div>
            )}
          </div>

          <div className="flex border-r border-[var(--border-color)] pr-1 mr-1 gap-0.5">
            <button onClick={() => { saveSelection(); setShowLinkModal(true); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><LinkIcon size={14}/></button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><ImageIcon size={14}/></button>
            <button onClick={() => setShowVideoModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Video size={14}/></button>
          </div>

          <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
            <button onClick={() => setActiveDropdown(activeDropdown === 'font' ? 'none' : 'font')} className="px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <FontIcon size={14}/> {fonts.find(f => f.value === selectedFont)?.name} <ChevronDown size={10}/>
            </button>
            {activeDropdown === 'font' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-xl z-[50] w-48 p-1 animate-in slide-in-from-top-1">
                {fonts.map(f => (
                  <button key={f.value} onClick={() => { setSelectedFont(f.value); setActiveDropdown('none'); }} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-indigo-600 hover:text-white uppercase" style={{ fontFamily: f.value }}>{f.name}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-0.5">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded">
               {isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
            </button>
            <button onClick={() => setShowHelpModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><HelpCircle size={14}/></button>
          </div>
       </div>

       <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] ${isFullscreen ? 'p-12' : 'p-6'}`}>
          <div className={`${isFullscreen ? 'max-w-5xl mx-auto border border-[var(--border-color)] p-12 bg-white dark:bg-[#161b22] min-h-screen shadow-2xl rounded-sm mb-20' : 'flex gap-4'}`}>
             {!isFullscreen && <img src={user.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white shrink-0" />}
             <div className="flex-1 space-y-4">
               <div ref={editorRef} contentEditable onBlur={saveSelection} className={`w-full bg-transparent border-none focus:outline-none text-[14px] font-medium text-[var(--text-primary)] leading-relaxed rich-content outline-none ${isFullscreen ? 'min-h-[1000px]' : 'min-h-[150px]'}`} style={{ fontFamily: selectedFont }} data-placeholder={placeholder || "Start crafting your signal..."} />
               {selectedImage && (
                 <div className="relative rounded-[6px] overflow-hidden group border border-[var(--border-color)]">
                   <img src={selectedImage} className="w-full object-cover max-h-96" />
                   <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={32}/></button>
                 </div>
               )}
             </div>
          </div>
       </div>
       
       <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-[var(--border-color)] flex justify-between items-center z-[30]">
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Signal Node: {user.name}</span>
         </div>
         <div className="flex gap-3">
           {isFullscreen && (
             <button onClick={() => setIsFullscreen(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-white/10 rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Close Editor (ESC)</button>
           )}
           <button onClick={submitPost} disabled={isAnalyzing} className="bg-indigo-600 text-white px-10 py-3 rounded-[4px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md">
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>} Commit Signal
           </button>
         </div>
       </div>

       <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
         const file = e.target.files?.[0];
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
         }
       }} accept="image/*" />

       {showLinkModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-md rounded-sm border border-[#ced4da] shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
              <h3 className="text-lg font-black uppercase italic">Insert Link Signal</h3>
              <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.text} onChange={e => setLinkData({...linkData, text: e.target.value})} placeholder="Display Text" />
              <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.url} onChange={e => setLinkData({...linkData, url: e.target.value})} placeholder="URL (https://...)" />
              <button onClick={handleInsertLink} className="w-full bg-[#007bff] text-white py-4 rounded-sm font-black text-sm uppercase">Commit Link</button>
           </div>
        </div>
       )}
    </div>
  );
};

const PostItem: React.FC<{ post: Post, onOpenThread: (id: string) => void, isComment?: boolean }> = ({ post, onOpenThread, isComment }) => {
  return (
    <article className="group relative">
      <div className={`absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden ${isComment ? 'top-0' : ''}`}></div>
      <div className="flex gap-3">
         <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10" />
         <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black tracking-tighter uppercase">
               <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-primary)] hover:underline cursor-pointer">{post.author}</span>
                  <span className="text-slate-500 font-bold">/</span>
                  <span className="text-slate-500">{post.college}</span>
                  <AuthoritySeal role={post.authorAuthority} size="sm" />
               </div>
               <span className="text-slate-500 font-mono text-[9px] lowercase tracking-normal">{post.timestamp}</span>
            </div>
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] shadow-sm overflow-hidden transition-all hover:border-indigo-500/30">
               <div className="p-6 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content text-[14px] leading-relaxed" />
                  {post.images?.[0] && <img src={post.images[0]} className="w-full object-cover max-h-[500px] rounded-[4px] border border-[var(--border-color)] mt-4" alt="Asset" />}
               </div>
               <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors"><Heart size={14} /><span className="text-[10px] font-bold font-mono">{post.likes}</span></button>
                     <button onClick={() => onOpenThread(post.id)} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={14} /><span className="text-[10px] font-bold font-mono">{post.commentsCount}</span></button>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[9px] uppercase tracking-widest"><Eye size={12}/> {post.views} logs</div>
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
    if (!content.trim() && !image) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify safety for post. Content: "${content.substring(0, 500)}"`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": true}');
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
        authorAuthority: (user as any).badges?.includes('Super Admin') ? 'Super Admin' : 'Administrator',
        timestamp: 'Just now', content: content, customFont: font,
        images: image ? [image] : undefined,
        hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
        isOpportunity: false, college: activeTab === 'Global' ? 'Global' : activeTab as College,
        parentId: parentId,
        aiMetadata: { category: 'Social', isSafe: true }
      };
      
      // If replying, increment comment count of parent
      if (parentId) {
         const all = db.getPosts();
         const updated = all.map(p => p.id === parentId ? {...p, commentsCount: p.commentsCount + 1} : p);
         db.savePosts([newPost, ...updated]);
      } else {
         db.addPost(newPost);
      }
      
      setIsAnalyzing(false);
      setIsFullscreen(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  const filteredPosts = threadId 
    ? posts.filter(p => p.parentId === threadId)
    : posts.filter(p => !p.parentId && (activeTab === 'Global' || p.college === activeTab));

  const threadParent = threadId ? posts.find(p => p.id === threadId) : null;

  return (
    <div className={`max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 ${isFullscreen ? 'fixed inset-0 z-[1000] bg-white dark:bg-[#0d1117] overflow-hidden' : ''}`}>
      {threadId ? (
         <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all mb-4 px-4 lg:px-0">
               <ArrowLeft size={16}/> Back to Hub Protocol
            </button>
            <div className="px-4 lg:px-0">
               {threadParent && (
                 <div className="space-y-6">
                   <PostItem post={threadParent} onOpenThread={() => {}} />
                   <div className="pl-12">
                     <Composer 
                       user={user} 
                       placeholder="Compose a high-fidelity reply..." 
                       onPost={(c, f, i) => handlePost(c, f, i, threadId)} 
                       isAnalyzing={isAnalyzing} 
                       isFullscreen={isFullscreen} 
                       setIsFullscreen={setIsFullscreen} 
                       autoFocus 
                     />
                   </div>
                   <div className="space-y-4 pt-10">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4">Decryption Logs: Replies</h3>
                      {filteredPosts.map(p => <PostItem key={p.id} post={p} onOpenThread={onOpenThread} isComment />)}
                   </div>
                 </div>
               )}
            </div>
         </div>
      ) : (
         <>
            {!collegeFilter && (
              <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 px-4">
                  <button onClick={() => setActiveTab('Global')} className={`px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>Global Hub</button>
                  {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
                    <button key={c} onClick={() => setActiveTab(c as College)} className={`flex items-center gap-2 px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === c ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 px-4 lg:px-0">
               <div className="lg:col-span-8 space-y-6">
                  <Composer 
                    user={user} 
                    onPost={handlePost} 
                    isAnalyzing={isAnalyzing} 
                    isFullscreen={isFullscreen} 
                    setIsFullscreen={setIsFullscreen} 
                  />
                  <div className="space-y-4">
                     {filteredPosts.map(post => <PostItem key={post.id} post={post} onOpenThread={onOpenThread} />)}
                  </div>
               </div>
               <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20 h-fit">
                  <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] p-6 shadow-sm">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">Trending Analytics</h3>
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

      <style>{`
        [contentEditable]:empty:before { content: attr(data-placeholder); color: #8b949e; cursor: text; }
        .rich-content h1 { font-size: 2.8rem; font-weight: 900; margin: 1.5rem 0; line-height: 1.1; }
        .rich-content blockquote { border-left: 6px solid #6366f1; padding: 20px 25px; font-style: italic; background: rgba(99,102,241,0.05); color: #64748b; margin: 1.5rem 0; }
        .rich-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .rich-content table td { border: 1px solid #ced4da; padding: 12px; min-width: 50px; }
        .rich-content a { color: #6366f1; text-decoration: underline; font-weight: bold; pointer-events: auto; }
      `}</style>
    </div>
  );
};

export default Feed;
