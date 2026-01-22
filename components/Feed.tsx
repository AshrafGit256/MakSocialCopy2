
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
  Code, Quote, Trash2, Send
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

const Feed: React.FC<{ collegeFilter?: College, targetPostId?: string | null, onClearTarget?: () => void }> = ({ collegeFilter, targetPostId, onClearTarget }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('"Plus Jakarta Sans"');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Editor Modals & Dropdowns
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'style' | 'color' | 'table' | 'font'>('none');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);

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

  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts(activeCollege || undefined));
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, user.id]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); exec('bold'); break;
        case 'i': e.preventDefault(); exec('italic'); break;
        case 'u': e.preventDefault(); exec('underline'); break;
        case 'z': e.preventDefault(); exec('undo'); break;
        case 'y': e.preventDefault(); exec('redo'); break;
        case 'k': e.preventDefault(); saveSelection(); setShowLinkModal(true); break;
        case '0': e.preventDefault(); exec('formatBlock', 'p'); break;
        case '1': e.preventDefault(); exec('formatBlock', 'h1'); break;
        case '2': e.preventDefault(); exec('formatBlock', 'h2'); break;
        case '3': e.preventDefault(); exec('formatBlock', 'h3'); break;
        case '4': e.preventDefault(); exec('formatBlock', 'h4'); break;
        case '5': e.preventDefault(); exec('formatBlock', 'h5'); break;
        case '6': e.preventDefault(); exec('formatBlock', 'h6'); break;
        case 'enter': e.preventDefault(); exec('insertHorizontalRule'); break;
        case '\\': e.preventDefault(); exec('removeFormat'); break;
      }
      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 's': e.preventDefault(); exec('strikeThrough'); break;
          case 'l': e.preventDefault(); exec('justifyLeft'); break;
          case 'e': e.preventDefault(); exec('justifyCenter'); break;
          case 'r': e.preventDefault(); exec('justifyRight'); break;
          case 'j': e.preventDefault(); exec('justifyFull'); break;
          case '7': e.preventDefault(); exec('insertUnorderedList'); break;
          case '8': e.preventDefault(); exec('insertOrderedList'); break;
        }
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      exec(e.shiftKey ? 'outdent' : 'indent');
    }
    if (e.key === 'Escape') {
      setIsFullscreen(false);
    }
  };

  const handleInsertTable = (r: number, c: number) => {
    let tableHtml = `<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #ced4da;">`;
    for (let i = 0; i < r; i++) {
      tableHtml += "<tr>";
      for (let j = 0; j < c; j++) {
        tableHtml += `<td style="border: 1px solid #ced4da; padding: 8px; min-height: 30px;">Cell</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</table>";
    exec('insertHTML', tableHtml);
    setActiveDropdown('none');
  };

  const handleInsertLink = () => {
    if (!linkData.url) return;
    const linkHtml = `<a href="${linkData.url}" target="_blank" style="color: #6366f1; text-decoration: underline;">${linkData.text || linkData.url}</a>`;
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

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify safety for university post. JSON: {"category": "Academic"|"Social", "isSafe": true}. Content: "${content.substring(0, 1000)}"`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": true, "category": "Social"}');
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
        authorAuthority: (user as any).badges?.includes('Super Admin') ? 'Super Admin' : 'Administrator',
        timestamp: 'Just now', content: content, customFont: selectedFont,
        images: selectedImage ? [selectedImage] : undefined,
        hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
        isOpportunity: result.category === 'Career', college: activeCollege || 'Global',
        aiMetadata: { category: result.category as any, isSafe: true }
      };
      db.addPost(newPost);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setSelectedImage(null);
      setIsAnalyzing(false);
      setIsFullscreen(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  return (
    <div className={`max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 ${isFullscreen ? 'fixed inset-0 z-[1000] bg-[var(--bg-primary)] overflow-hidden lg:px-0 lg:py-0' : 'relative'}`}>
      
      {/* Platform Navigation Hider for Fullscreen */}
      {!collegeFilter && !isFullscreen && (
        <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 px-4">
            <button onClick={() => setActiveTab('Global')} className={`px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>Global Hub</button>
            {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
              <button key={c} onClick={() => setActiveTab(c as College)} className={`flex items-center gap-2 px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === c ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isFullscreen ? 'h-full m-0' : 'mt-6'}`}>
         <div className={`lg:col-span-8 space-y-6 ${isFullscreen ? 'col-span-12 p-0 flex flex-col h-full bg-white dark:bg-[#0d1117]' : 'px-4 lg:px-0'}`}>
            
            {/* --- CREATIVE COMPOSER CORE --- */}
            <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] shadow-sm flex flex-col ${isFullscreen ? 'h-full border-none rounded-none' : ''}`}>
               
               {/* SUMMERNOTE-STYLE TOOLBAR */}
               <div className="bg-slate-50 dark:bg-white/5 border-b border-[var(--border-color)] px-2 py-1 flex flex-wrap items-center gap-0.5 z-[20]">
                  
                  {/* Style Presets Dropdown */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'style' ? 'none' : 'style')}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-300" title="Style"
                    >
                       <Eraser size={14} className="rotate-180" />
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

                  {/* Formatting Block */}
                  <div className="flex items-center gap-0.5 border-r border-[var(--border-color)] pr-1 mr-1">
                    <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Bold (Ctrl+B)"><Bold size={14}/></button>
                    <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Underline (Ctrl+U)"><Underline size={14}/></button>
                    <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Italic (Ctrl+I)"><Italic size={14}/></button>
                  </div>

                  {/* Alignment & Lists */}
                  <div className="flex border-r border-[var(--border-color)] pr-1 mr-1 gap-0.5">
                    <button onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><List size={14}/></button>
                    <button onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><ListOrdered size={14}/></button>
                    <button onClick={() => exec('justifyLeft')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><AlignLeft size={14}/></button>
                  </div>

                  {/* Dual Color Dropdown (AdminLTE V3 Replica) */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button 
                      onClick={() => { saveSelection(); setActiveDropdown(activeDropdown === 'color' ? 'none' : 'color'); }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex flex-col items-center"
                    >
                       <span className="font-serif font-black text-xs text-amber-600">A</span>
                       <div className="h-0.5 w-3 bg-indigo-500 rounded-full"></div>
                    </button>
                    {activeDropdown === 'color' && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-[450px] p-4 flex gap-6 animate-in zoom-in-95 duration-100">
                         {/* Background Color Panel */}
                         <div className="flex-1 space-y-3">
                            <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Background Color</p>
                            <button onClick={() => exec('hiliteColor', 'transparent')} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Transparent</button>
                            <div className="grid grid-cols-8 gap-0.5">
                               {rainbowColors.map((c, i) => (
                                 <button key={i} onClick={() => exec('hiliteColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                               ))}
                            </div>
                            <div className="pt-2 flex flex-col gap-2">
                               <input type="color" id="bg-pick" className="hidden" onChange={(e) => exec('hiliteColor', e.target.value)} />
                               <button onClick={() => document.getElementById('bg-pick')?.click()} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Select</button>
                               <div className="flex gap-1">
                                  {['#808000','#948A54','#B5B08B','#C8C4AF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'].map((c,i) => <div key={i} className="w-5 h-5 border border-black/5" style={{backgroundColor: c}} />)}
                               </div>
                            </div>
                         </div>
                         {/* Text Color Panel */}
                         <div className="flex-1 space-y-3">
                            <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Text Color</p>
                            <button onClick={() => exec('foreColor', '#000000')} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Reset to Default</button>
                            <div className="grid grid-cols-8 gap-0.5">
                               {rainbowColors.map((c, i) => (
                                 <button key={i} onClick={() => exec('foreColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                               ))}
                            </div>
                            <div className="pt-2">
                               <input type="color" id="text-pick" className="hidden" onChange={(e) => exec('foreColor', e.target.value)} />
                               <button onClick={() => document.getElementById('text-pick')?.click()} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Select</button>
                               <div className="flex gap-1 pt-2">
                                  {Array(8).fill(0).map((_,i) => <div key={i} className="w-5 h-5 border border-black/5 bg-white" />)}
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Table Grid Picker */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'table' ? 'none' : 'table')}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Insert Table"
                    >
                       <Table size={14}/>
                    </button>
                    {activeDropdown === 'table' && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] p-4 animate-in zoom-in-95 duration-100">
                        <div className="grid grid-cols-10 gap-0.5 mb-3">
                           {Array.from({length: 10}).map((_, r) => (
                             Array.from({length: 10}).map((_, c) => (
                               <div 
                                 key={`${r}-${c}`} 
                                 onMouseEnter={() => setTableHover({r: r+1, c: c+1})}
                                 onClick={() => handleInsertTable(r+1, c+1)}
                                 className={`w-4 h-4 border transition-colors cursor-pointer ${
                                   r < tableHover.r && c < tableHover.c ? 'bg-[#cce5ff] border-[#b8daff]' : 'bg-white border-[#dee2e6]'
                                 }`}
                               />
                             ))
                           ))}
                        </div>
                        <p className="text-xs font-bold text-center text-slate-600">{tableHover.r} x {tableHover.c}</p>
                      </div>
                    )}
                  </div>

                  {/* Media Insertion */}
                  <div className="flex border-r border-[var(--border-color)] pr-1 mr-1 gap-0.5">
                    <button onClick={() => { saveSelection(); setShowLinkModal(true); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><LinkIcon size={14}/></button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><ImageIcon size={14}/></button>
                    <button onClick={() => setShowVideoModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Video size={14}/></button>
                  </div>

                  {/* Screen & Utils */}
                  <div className="flex gap-0.5">
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Fullscreen">
                       {isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
                    </button>
                    <button onClick={() => setShowHelpModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Help"><HelpCircle size={14}/></button>
                  </div>
               </div>

               {/* COMPOSER BODY (SCROLLABLE) */}
               <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] ${isFullscreen ? 'p-10' : 'p-6'}`}>
                  <div className={`${isFullscreen ? 'max-w-4xl mx-auto border border-[var(--border-color)] p-12 bg-white dark:bg-[#161b22] min-h-screen shadow-2xl rounded-sm' : 'flex gap-4'}`}>
                     {!isFullscreen && <img src={user.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white shrink-0" />}
                     <div className="flex-1 space-y-4">
                       <div 
                         ref={editorRef}
                         contentEditable
                         onKeyDown={handleKeyDown}
                         onBlur={saveSelection}
                         className={`w-full bg-transparent border-none focus:outline-none text-[14px] font-medium text-[var(--text-primary)] leading-relaxed rich-content outline-none ${isFullscreen ? 'min-h-[800px]' : 'min-h-[400px]'}`}
                         style={{ fontFamily: selectedFont }}
                         data-placeholder="Start crafting your university article..."
                       />
                       {selectedImage && (
                         <div className="relative rounded-[6px] overflow-hidden group border border-[var(--border-color)]">
                           <img src={selectedImage} className="w-full object-cover max-h-96" />
                           <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={32}/></button>
                         </div>
                       )}
                     </div>
                  </div>
               </div>
               
               {/* TOOLBAR FOOTER */}
               <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-[var(--border-color)] flex justify-between items-center z-[30]">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Wing: {activeCollege || 'Global Protocol'}</span>
                 </div>
                 <div className="flex gap-3">
                   {isFullscreen && (
                     <button onClick={() => setIsFullscreen(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-white/10 rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Exit Fullscreen</button>
                   )}
                   <button onClick={handleCreatePost} disabled={isAnalyzing} className="bg-indigo-600 text-white px-10 py-3 rounded-[4px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95">
                      {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>} Commit to Registry
                   </button>
                 </div>
               </div>
            </div>

            {/* FEED SECTION (HIDDEN IN FULLSCREEN) */}
            {!isFullscreen && (
               <div className="space-y-4 mt-6">
                  {posts.map(post => (
                     <article key={post.id} className="group relative">
                        <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
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
                                       <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={14} /><span className="text-[10px] font-bold font-mono">{post.commentsCount}</span></button>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[9px] uppercase tracking-widest"><Eye size={12}/> {post.views} logs</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
            )}
         </div>

         {/* SIDEBAR (HIDDEN IN FULLSCREEN) */}
         {!isFullscreen && (
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
         )}
      </div>

      {/* --- MODALS --- */}
      
      {showLinkModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-md rounded-sm border border-[#ced4da] shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                 <h3 className="text-lg font-black uppercase">Insert Link</h3>
                 <button onClick={() => setShowLinkModal(false)}><X size={20}/></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Text to Display</label>
                    <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.text} onChange={e => setLinkData({...linkData, text: e.target.value})} placeholder="e.g. My Website" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">To what URL should this link go?</label>
                    <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.url} onChange={e => setLinkData({...linkData, url: e.target.value})} placeholder="https://..." />
                 </div>
              </div>
              <button onClick={handleInsertLink} className="w-full bg-[#007bff] text-white py-3 rounded-sm font-bold text-sm">Commit Link</button>
           </div>
        </div>
      )}

      {showVideoModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-md rounded-sm border border-[#ced4da] shadow-2xl p-8 space-y-6">
              <h3 className="text-lg font-black uppercase">Insert Video URL</h3>
              <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="YouTube/Vimeo URL" />
              <button onClick={handleInsertVideo} className="w-full bg-[#007bff] text-white py-3 rounded-sm font-bold text-sm">Commit Video</button>
              <button onClick={() => setShowVideoModal(false)} className="w-full text-slate-400 text-xs uppercase font-bold">Cancel</button>
           </div>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm border border-[#ced4da] shadow-2xl p-8 space-y-4">
              <h3 className="text-xl font-black uppercase border-b pb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-x-10 text-[11px] font-bold text-slate-500">
                 {['ESC:Escape', 'ENTER:Insert Paragraph', 'CTRL+Z:Undo', 'CTRL+Y:Redo', 'CTRL+B:Bold Style', 'CTRL+I:Italic Style', 'CTRL+U:Underline Style', 'CTRL+K:Show Link Dialog', 'CTRL+NUM1-6:Header 1-6'].map((s,i) => (
                   <div key={i} className="flex justify-between border-b py-2"><span>{s.split(':')[0]}</span><span className="text-indigo-600">{s.split(':')[1]}</span></div>
                 ))}
              </div>
              <button onClick={() => setShowHelpModal(false)} className="w-full bg-slate-100 py-3 rounded-sm font-bold uppercase text-xs mt-6">Close</button>
           </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
         const file = e.target.files?.[0];
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
         }
      }} accept="image/*" />

      <style>{`
        [contentEditable]:empty:before { content: attr(data-placeholder); color: #8b949e; cursor: text; }
        .rich-content h1 { font-size: 2.5rem; font-weight: 900; margin: 1.5rem 0; color: #333; }
        .rich-content h2 { font-size: 2rem; font-weight: 800; margin: 1.2rem 0; }
        .rich-content blockquote { border-left: 5px solid #007bff; padding: 15px 20px; font-style: italic; background: #f8f9fa; color: #555; margin: 1.5rem 0; }
        .rich-content pre { background: #f4f4f4; padding: 15px; border-radius: 4px; font-family: monospace; border: 1px solid #ddd; }
        .rich-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .rich-content table td, .rich-content table th { border: 1px solid #ced4da; padding: 10px; min-width: 50px; }
        .rich-content hr { border: none; border-top: 1px solid #eee; margin: 2rem 0; }
        .rich-content a { color: #007bff; text-decoration: underline; font-weight: bold; }
        .dark .rich-content h1, .dark .rich-content h2 { color: #c9d1d9; }
        .dark .rich-content blockquote { background: #161b22; color: #8b949e; }
        .dark .rich-content pre { background: #010409; color: #d1d5db; border-color: #30363d; }
      `}</style>
    </div>
  );
};

export default Feed;
