
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
  Code, Quote, Trash2, Send, Strikethrough
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
  
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'style' | 'color' | 'table' | 'font' | 'align'>('none');
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
        case '[': e.preventDefault(); exec('outdent'); break;
        case ']': e.preventDefault(); exec('indent'); break;
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
        tableHtml += `<td style="border: 1px solid #ced4da; padding: 12px; min-height: 40px;">&nbsp;</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</table><p><br></p>";
    exec('insertHTML', tableHtml);
    setActiveDropdown('none');
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

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify safety for university post. Content: "${content.substring(0, 1000)}"`,
        config: { responseMimeType: "application/json" }
      });
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
        authorAuthority: (user as any).badges?.includes('Super Admin') ? 'Super Admin' : 'Administrator',
        timestamp: 'Just now', content: content, customFont: selectedFont,
        images: selectedImage ? [selectedImage] : undefined,
        hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
        isOpportunity: false, college: activeCollege || 'Global',
        aiMetadata: { category: 'Social', isSafe: true }
      };
      db.addPost(newPost);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setSelectedImage(null);
      setIsAnalyzing(false);
      setIsFullscreen(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  return (
    <div className={`max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 ${isFullscreen ? 'fixed inset-0 z-[1000] bg-white dark:bg-[#0d1117] overflow-hidden' : 'relative'}`}>
      
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
            
            <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] shadow-sm flex flex-col ${isFullscreen ? 'h-full border-none rounded-none' : ''}`}>
               
               {/* SUMMERNOTE-STYLE TOOLBAR */}
               <div className="bg-slate-50 dark:bg-white/5 border-b border-[var(--border-color)] px-2 py-1.5 flex flex-wrap items-center gap-0.5 z-[20]">
                  
                  {/* Style Presets */}
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

                  {/* Formatting Block */}
                  <div className="flex items-center gap-0.5 border-r border-[var(--border-color)] pr-1 mr-1">
                    <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Bold (Ctrl+B)"><Bold size={14}/></button>
                    <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Underline (Ctrl+U)"><Underline size={14}/></button>
                    <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Italic (Ctrl+I)"><Italic size={14}/></button>
                  </div>

                  {/* Alignment Dropdown */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button onClick={() => setActiveDropdown(activeDropdown === 'align' ? 'none' : 'align')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-1">
                       <AlignLeft size={14}/> <ChevronDown size={10}/>
                    </button>
                    {activeDropdown === 'align' && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-48 p-1 animate-in slide-in-from-top-1">
                        <button onClick={() => exec('justifyLeft')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignLeft size={14}/> Left Align</button>
                        <button onClick={() => exec('justifyCenter')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignCenter size={14}/> Center Align</button>
                        <button onClick={() => exec('justifyRight')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignRight size={14}/> Right Align</button>
                        <button onClick={() => exec('justifyFull')} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2 text-xs font-bold"><AlignJustify size={14}/> Full Align</button>
                      </div>
                    )}
                  </div>

                  {/* Lists */}
                  <div className="flex border-r border-[var(--border-color)] pr-1 mr-1 gap-0.5">
                    <button onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><List size={14}/></button>
                    <button onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><ListOrdered size={14}/></button>
                  </div>

                  {/* Dual Color Picker */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button onClick={() => { saveSelection(); setActiveDropdown(activeDropdown === 'color' ? 'none' : 'color'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex flex-col items-center">
                       <span className="font-serif font-black text-xs">A</span>
                       <div className="h-0.5 w-3 bg-indigo-500 rounded-full"></div>
                    </button>
                    {activeDropdown === 'color' && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-2xl z-[50] w-[450px] p-4 flex gap-6 animate-in zoom-in-95 duration-100">
                         <div className="flex-1 space-y-3">
                            <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Background Color</p>
                            <button onClick={() => exec('hiliteColor', 'transparent')} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Transparent</button>
                            <div className="grid grid-cols-8 gap-0.5">
                               {rainbowColors.map((c, i) => (
                                 <button key={i} onClick={() => exec('hiliteColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                               ))}
                            </div>
                            <input type="color" id="bg-pick" className="hidden" onChange={(e) => exec('hiliteColor', e.target.value)} />
                            <button onClick={() => document.getElementById('bg-pick')?.click()} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Select</button>
                         </div>
                         <div className="flex-1 space-y-3">
                            <p className="text-[10px] font-black uppercase text-center text-slate-500 border-b pb-2">Text Color</p>
                            <button onClick={() => exec('foreColor', '#000000')} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Reset to default</button>
                            <div className="grid grid-cols-8 gap-0.5">
                               {rainbowColors.map((c, i) => (
                                 <button key={i} onClick={() => exec('foreColor', c)} className="w-5 h-5 border border-black/5" style={{ backgroundColor: c }} />
                               ))}
                            </div>
                            <input type="color" id="text-pick" className="hidden" onChange={(e) => exec('foreColor', e.target.value)} />
                            <button onClick={() => document.getElementById('text-pick')?.click()} className="w-full py-1.5 border border-[#ced4da] rounded text-[9px] font-bold uppercase hover:bg-slate-50">Select</button>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Table Matrix Picker (Widened) */}
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

                  {/* Media */}
                  <div className="flex border-r border-[var(--border-color)] pr-1 mr-1 gap-0.5">
                    <button onClick={() => { saveSelection(); setShowLinkModal(true); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><LinkIcon size={14}/></button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><ImageIcon size={14}/></button>
                    <button onClick={() => setShowVideoModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded"><Video size={14}/></button>
                  </div>

                  {/* Font Dropdown */}
                  <div className="relative border-r border-[var(--border-color)] pr-1 mr-1">
                    <button onClick={() => setActiveDropdown(activeDropdown === 'font' ? 'none' : 'font')} className="px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <FontIcon size={14}/> {fonts.find(f => f.value === selectedFont)?.name} <ChevronDown size={10}/>
                    </button>
                    {activeDropdown === 'font' && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#ced4da] rounded shadow-xl z-[50] w-48 p-1 animate-in slide-in-from-top-1">
                        {fonts.map(f => (
                          <button key={f.value} onClick={() => { setSelectedFont(f.value); setActiveDropdown('none'); }} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase" style={{ fontFamily: f.value }}>{f.name}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen & Help */}
                  <div className="flex gap-0.5">
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Fullscreen">
                       {isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
                    </button>
                    <button onClick={() => setShowHelpModal(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Help"><HelpCircle size={14}/></button>
                  </div>
               </div>

               {/* SCROLLABLE COMPOSER AREA */}
               <div className={`flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] ${isFullscreen ? 'p-12' : 'p-6'}`}>
                  <div className={`${isFullscreen ? 'max-w-5xl mx-auto border border-[var(--border-color)] p-12 bg-white dark:bg-[#161b22] min-h-screen shadow-2xl rounded-sm mb-20' : 'flex gap-4'}`}>
                     {!isFullscreen && <img src={user.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white shrink-0" />}
                     <div className="flex-1 space-y-4">
                       <div 
                         ref={editorRef}
                         contentEditable
                         onKeyDown={handleKeyDown}
                         onBlur={saveSelection}
                         className={`w-full bg-transparent border-none focus:outline-none text-[14px] font-medium text-[var(--text-primary)] leading-relaxed rich-content outline-none ${isFullscreen ? 'min-h-[1000px]' : 'min-h-[400px]'}`}
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
               
               {/* COMPOSER FOOTER */}
               <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-[var(--border-color)] flex justify-between items-center z-[30]">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Target Hub: {activeCollege || 'Global Protocol'}</span>
                 </div>
                 <div className="flex gap-3">
                   {isFullscreen && (
                     <button onClick={() => setIsFullscreen(false)} className="px-6 py-2.5 bg-slate-200 dark:bg-white/10 rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Exit Fullscreen (ESC)</button>
                   )}
                   <button onClick={handleCreatePost} disabled={isAnalyzing} className="bg-indigo-600 text-white px-10 py-3 rounded-[4px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95">
                      {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>} Commit to Registry
                   </button>
                 </div>
               </div>
            </div>

            {/* FEED SECTION */}
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
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-md rounded-sm border border-[#ced4da] shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center border-b pb-4">
                 <h3 className="text-lg font-black uppercase italic">Insert Link Signal</h3>
                 <button onClick={() => setShowLinkModal(false)}><X size={20}/></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Text to Display</label>
                    <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.text} onChange={e => setLinkData({...linkData, text: e.target.value})} placeholder="e.g. Visit Repository" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">To what URL should this link go?</label>
                    <input className="w-full bg-slate-50 border border-[#ced4da] rounded-sm p-3 text-sm outline-none" value={linkData.url} onChange={e => setLinkData({...linkData, url: e.target.value})} placeholder="https://..." />
                 </div>
              </div>
              <button onClick={handleInsertLink} className="w-full bg-[#007bff] text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest shadow-lg">Commit Link Protocol</button>
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
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white dark:bg-[#161b22] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm border border-[#ced4da] shadow-2xl p-10 space-y-8 no-scrollbar">
              <div className="flex justify-between items-center border-b pb-6">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Composer Commands</h3>
                 <button onClick={() => setShowHelpModal(false)}><X size={28}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                 {[
                   ['ESC', 'Escape'],
                   ['ENTER', 'Insert Paragraph'],
                   ['CTRL+Z', 'Undo the last command'],
                   ['CTRL+Y', 'Redo the last command'],
                   ['TAB', 'Tab'],
                   ['SHIFT+TAB', 'Untab'],
                   ['CTRL+B', 'Set a bold style'],
                   ['CTRL+I', 'Set a italic style'],
                   ['CTRL+U', 'Set a underline style'],
                   ['CTRL+SHIFT+S', 'Set a strikethrough style'],
                   ['CTRL+BACKSLASH', 'Clean a style'],
                   ['CTRL+SHIFT+L', 'Set left align'],
                   ['CTRL+SHIFT+E', 'Set center align'],
                   ['CTRL+SHIFT+R', 'Set right align'],
                   ['CTRL+SHIFT+J', 'Set full align'],
                   ['CTRL+SHIFT+NUM7', 'Toggle unordered list'],
                   ['CTRL+SHIFT+NUM8', 'Toggle ordered list'],
                   ['CTRL+[', 'Outdent on current paragraph'],
                   ['CTRL+]', 'Indent on current paragraph'],
                   ['CTRL+NUM0', "Change to paragraph(P tag)"],
                   ['CTRL+NUM1', 'Change current block to H1'],
                   ['CTRL+NUM2', 'Change current block to H2'],
                   ['CTRL+NUM3', 'Change current block to H3'],
                   ['CTRL+NUM4', 'Change current block to H4'],
                   ['CTRL+NUM5', 'Change current block to H5'],
                   ['CTRL+NUM6', 'Change current block to H6'],
                   ['CTRL+ENTER', 'Insert horizontal rule'],
                   ['CTRL+K', 'Show Link Dialog']
                 ].map(([cmd, desc], i) => (
                   <div key={i} className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 py-2.5">
                      <span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded font-black text-[9px] uppercase">{cmd}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase text-right">{desc}</span>
                   </div>
                 ))}
              </div>
              <button onClick={() => setShowHelpModal(false)} className="w-full bg-slate-900 text-white py-5 rounded-sm font-black uppercase text-[11px] mt-6 shadow-xl">Close Terminal Help</button>
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
        .rich-content h1 { font-size: 2.8rem; font-weight: 900; margin: 1.5rem 0; line-height: 1.1; }
        .rich-content h2 { font-size: 2.2rem; font-weight: 800; margin: 1.2rem 0; }
        .rich-content h3 { font-size: 1.8rem; font-weight: 800; }
        .rich-content blockquote { border-left: 6px solid #6366f1; padding: 20px 25px; font-style: italic; background: rgba(99,102,241,0.05); color: #64748b; margin: 1.5rem 0; font-size: 1.1rem; }
        .rich-content pre { background: #1e293b; padding: 20px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; color: #f8fafc; border: 1px solid #334155; margin: 1rem 0; font-size: 0.9rem; }
        .rich-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .rich-content table td, .rich-content table th { border: 1px solid #ced4da; padding: 12px; min-width: 50px; }
        .rich-content hr { border: none; border-top: 2px dashed #e2e8f0; margin: 2.5rem 0; }
        .rich-content a { color: #6366f1; text-decoration: underline; font-weight: bold; pointer-events: auto; cursor: pointer; }
        .dark .rich-content table td, .dark .rich-content table th { border-color: #30363d; }
      `}</style>
    </div>
  );
};

export default Feed;
