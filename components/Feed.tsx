
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, MessageCircle, X, Loader2, Eye, Zap, 
  Maximize2, Minimize2, Video, Type as LucideType, 
  Bold, Italic, Palette, Send, Underline, Eraser,
  List, ListOrdered, AlignLeft, Table as TableIcon, Link as LinkIcon,
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
  const [openDropdown, setOpenDropdown] = useState<'headers' | 'fonts' | 'table' | 'colors' | 'help' | 'link' | null>(null);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  
  // Link State
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);

  const FONTS = [
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Inter UI', value: '"Inter", sans-serif' },
    { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
    { name: 'Scholar Serif', value: '"Playfair Display", serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
  ];

  const COLOR_PALETTE = [
    ['#000000', '#424242', '#636363', '#919191', '#bdbdbd', '#e0e0e0', '#eeeeee', '#ffffff'],
    ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'],
    ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
    ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
    ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
    ['#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
    ['#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'],
    ['#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130']
  ];

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    setOpenDropdown(null);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      const html = `<a href="${linkUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline;">${linkText || linkUrl}</a> `;
      exec('insertHTML', html);
      setLinkText('');
      setLinkUrl('');
    }
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
      onMouseDown={(e) => { e.preventDefault(); onClick(); }} 
      className={`p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-700 dark:text-slate-300 ${active ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-xl overflow-visible mb-10 transition-all ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none' : 'relative animate-in slide-in-from-top-4 duration-500'}`}>
      {/* SOPHISTICATED TOOLBAR */}
      <div className="px-2 py-1 border-b border-[var(--border-color)] bg-[#f8f9fa] dark:bg-white/5 flex flex-wrap items-center gap-x-1 gap-y-1 relative z-50">
        
        {/* Headers Dropdown */}
        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === 'headers' ? null : 'headers'); }}
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10"
          >
            Normal <ChevronDown size={10} />
          </button>
          {openDropdown === 'headers' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md overflow-hidden py-1">
              {[1,2,3,4,5,6].map(i => (
                <button 
                  key={i} 
                  onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', `H${i}`); }}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span style={{ fontSize: `${2.0 - (i*0.15)}rem` }} className="font-bold leading-none">Header {i}</span>
                </button>
              ))}
              <div className="h-px bg-[var(--border-color)] my-1"></div>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'blockquote'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white flex items-center gap-2">
                 <Quote size={12}/> <span className="text-xs italic font-medium">Blockquote</span>
              </button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'p'); }} className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white text-xs font-medium">Paragraph</button>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* Style Cluster */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => exec('bold')} icon={<Bold size={14}/>} title="Bold" />
          <ToolbarButton onClick={() => exec('underline')} icon={<Underline size={14}/>} title="Underline" />
          <ToolbarButton onClick={() => exec('removeFormat')} icon={<Eraser size={14}/>} title="Clear Formatting" />
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* Fonts Dropdown */}
        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }}
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 min-w-[100px] justify-between"
          >
            {FONTS.find(f => f.value === activeFont)?.name || 'Font'} <ChevronDown size={10} />
          </button>
          {openDropdown === 'fonts' && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md overflow-y-auto max-h-64 py-1">
              {FONTS.map(f => (
                <button 
                  key={f.name} 
                  onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors"
                  style={{ fontFamily: f.value }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* Color Dropdown (Advanced Tabs Mode) */}
        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === 'colors' ? null : 'colors'); }}
            className="px-2 py-1 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded border border-slate-300 dark:border-white/10"
            title="Color Picker"
          >
            <div className="flex flex-col items-center">
              <span className="text-[14px] leading-none font-black underline decoration-indigo-500 decoration-2">A</span>
            </div>
            <ChevronDown size={10} className="text-slate-400"/>
          </button>
          {openDropdown === 'colors' && (
            <div className="absolute top-full left-0 mt-1 p-4 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md min-w-[340px] flex gap-6 md:flex-row flex-col max-h-[80vh] overflow-y-auto">
              {/* Background Color Column */}
              <div className="flex-1 space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-500 text-center border-b pb-1 tracking-widest">Background Color</p>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); exec('hiliteColor', 'transparent'); }}
                  className="w-full py-1.5 border border-slate-300 dark:border-white/10 text-[9px] font-bold uppercase rounded hover:bg-slate-50 transition-colors"
                >
                  Transparent
                </button>
                <div className="grid grid-cols-8 gap-0.5">
                  {COLOR_PALETTE.map((row, rid) => row.map((c, cid) => (
                    <button key={`${rid}-${cid}`} onMouseDown={(e) => { e.preventDefault(); exec('hiliteColor', c); }} className="w-4 h-4 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                  )))}
                </div>
              </div>

              <div className="w-px bg-[var(--border-color)] md:block hidden"></div>

              {/* Text Color Column */}
              <div className="flex-1 space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-500 text-center border-b pb-1 tracking-widest">Text Color</p>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); exec('foreColor', '#1f2328'); }}
                  className="w-full py-1.5 border border-slate-300 dark:border-white/10 text-[9px] font-bold uppercase rounded hover:bg-slate-50 transition-colors"
                >
                  Reset to default
                </button>
                <div className="grid grid-cols-8 gap-0.5">
                  {COLOR_PALETTE.map((row, rid) => row.map((c, cid) => (
                    <button key={`t-${rid}-${cid}`} onMouseDown={(e) => { e.preventDefault(); exec('foreColor', c); }} className="w-4 h-4 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                  )))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* List Cluster */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => exec('insertUnorderedList')} icon={<List size={14}/>} title="Unordered List" />
          <ToolbarButton onClick={() => exec('insertOrderedList')} icon={<ListOrdered size={14}/>} title="Ordered List" />
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* Table Dropdown */}
        <div className="relative">
          <button 
            onMouseDown={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === 'table' ? null : 'table'); }}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-1"
            title="Insert Table"
          >
            <TableIcon size={14}/>
            <ChevronDown size={10} className="text-slate-400"/>
          </button>
          {openDropdown === 'table' && (
            <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md">
              <p className="text-[8px] font-black uppercase text-slate-400 mb-3 text-center tracking-widest">{tableHover.r} x {tableHover.c} Table</p>
              <div className="grid grid-cols-5 gap-1">
                {[1,2,3,4,5].map(r => (
                  [1,2,3,4,5].map(c => (
                    <div 
                      key={`${r}-${c}`}
                      onMouseEnter={() => setTableHover({r, c})}
                      onMouseDown={(e) => { e.preventDefault(); insertTable(r, c); }}
                      className={`w-4 h-4 border cursor-pointer transition-colors ${r <= tableHover.r && c <= tableHover.c ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10'}`}
                    />
                  ))
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* Link Pop-up */}
        <div className="relative">
          <ToolbarButton onClick={() => setOpenDropdown(openDropdown === 'link' ? null : 'link')} icon={<LinkIcon size={14}/>} title="Add Link" />
          {openDropdown === 'link' && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md p-4 space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b pb-2">Create Signal Link</h5>
              <div className="space-y-3">
                <input 
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded p-2 text-xs outline-none" 
                  placeholder="Text to display..."
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
                <input 
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded p-2 text-xs outline-none" 
                  placeholder="Link URL (https://...)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="flex gap-2 pt-2">
                  <button onMouseDown={handleInsertLink} className="flex-1 bg-indigo-600 text-white text-[9px] font-black uppercase py-2 rounded shadow-lg">Insert</button>
                  <button onMouseDown={() => setOpenDropdown(null)} className="px-3 bg-slate-100 text-slate-500 text-[9px] font-black uppercase py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Media Cluster */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => { const url = window.prompt("Enter image URL:"); if(url) exec('insertImage', url); }} icon={<ImageIcon size={14}/>} title="Image" />
          <ToolbarButton onClick={() => exec('insertHorizontalRule')} icon={<div className="w-4 h-px bg-slate-400" />} title="Horizontal Line" />
        </div>

        <div className="h-4 w-px bg-[var(--border-color)] mx-0.5"></div>

        {/* System Cluster */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => setIsFullscreen(!isFullscreen)} icon={isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>} title="Fullscreen" />
          
          <div className="relative">
            <ToolbarButton onClick={() => setOpenDropdown(openDropdown === 'help' ? null : 'help')} icon={<HelpCircle size={14}/>} title="Help" />
            {openDropdown === 'help' && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md p-4 overflow-y-auto max-h-96">
                <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-4 tracking-widest border-b border-indigo-600/20 pb-2">Keyboard Protocols</h4>
                <div className="space-y-1.5 text-[9px] font-mono">
                  {[
                    ['ESC', 'Escape'],
                    ['ENTER', 'Insert Paragraph'],
                    ['CTRL+Z', 'Undo last command'],
                    ['CTRL+Y', 'Redo last command'],
                    ['TAB', 'Tab'],
                    ['SHIFT+TAB', 'Untab'],
                    ['CTRL+B', 'Set bold style'],
                    ['CTRL+I', 'Set italic style'],
                    ['CTRL+U', 'Set underline style'],
                    ['CTRL+SHIFT+S', 'Set strikethrough style'],
                    ['CTRL+\\', 'Clean a style'],
                    ['CTRL+SHIFT+L', 'Set left align'],
                    ['CTRL+SHIFT+E', 'Set center align'],
                    ['CTRL+SHIFT+R', 'Set right align'],
                    ['CTRL+SHIFT+J', 'Set full align'],
                    ['CTRL+SHIFT+NUM7', 'Toggle unordered list'],
                    ['CTRL+SHIFT+NUM8', 'Toggle ordered list'],
                    ['CTRL+[', 'Outdent on current paragraph'],
                    ['CTRL+]', 'Indent on current paragraph'],
                    ['CTRL+NUM0', 'Format as Paragraph'],
                    ['CTRL+NUM1', 'Format as H1'],
                    ['CTRL+NUM2', 'Format as H2'],
                    ['CTRL+NUM3', 'Format as H3'],
                    ['CTRL+NUM4', 'Format as H4'],
                    ['CTRL+NUM5', 'Format as H5'],
                    ['CTRL+NUM6', 'Format as H6'],
                    ['CTRL+ENTER', 'Insert horizontal rule'],
                    ['CTRL+K', 'Show Link Dialog']
                  ].map(([k, d]) => (
                    <div key={k} className="flex justify-between items-center gap-4 py-0.5 border-b border-slate-50 dark:border-white/5 last:border-0">
                      <span className="bg-slate-100 dark:bg-white/5 px-1 rounded border border-slate-300 dark:border-white/10 text-indigo-600 font-bold whitespace-nowrap">{k}</span>
                      <span className="text-slate-500 text-right uppercase font-bold text-[8px]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDITOR AREA - MINIMIZED HEIGHT */}
      <div className={`relative bg-white dark:bg-black/20 ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[80px]'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-full p-4 text-sm outline-none leading-relaxed overflow-y-auto rich-content-editor"
          style={{ fontFamily: activeFont }}
          data-placeholder="Place some text here"
        />
        {!content && <div className="absolute top-4 left-4 text-slate-400 pointer-events-none text-sm font-sans opacity-70">Place some text here</div>}
      </div>

      {/* FOOTER BAR */}
      <div className="px-4 py-2 bg-[#f8f9fa] dark:bg-white/5 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
           {isAnalyzing && (
             <div className="flex items-center gap-2 px-2 py-0.5 bg-indigo-600/10 rounded-full text-indigo-600">
               <Loader2 size={10} className="animate-spin" />
               <span className="text-[7px] font-black uppercase tracking-widest">AI Matrix Syncing...</span>
             </div>
           )}
        </div>
        <button 
          onClick={handlePublish}
          disabled={isAnalyzing || !content.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-black text-[9px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={12} /> Broadcast
        </button>
      </div>

      <style>{`
        .rich-content-editor:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content-editor h1 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; }
        .rich-content-editor h2 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
        .rich-content-editor h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .rich-content-editor h4 { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.4rem; }
        .rich-content-editor h5 { font-size: 1.0rem; font-weight: 700; margin-bottom: 0.3rem; }
        .rich-content-editor h6 { font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; }
        .rich-content-editor p { margin-bottom: 1rem; }
        .rich-content-editor ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .rich-content-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .rich-content-editor table { border-collapse: collapse; width: 100%; border: 1px solid #ddd; }
        .rich-content-editor th, .rich-content-editor td { border: 1px solid #ddd; padding: 8px; }
        .rich-content-editor blockquote { border-left: 4px solid #4f46e5; padding-left: 1rem; font-style: italic; color: #64748b; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, onOpenThread, onNavigateToProfile, isComment }) => {
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
            <div onClick={() => !isComment && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-sm overflow-hidden transition-all hover:border-indigo-500/30 ${isComment ? 'cursor-default' : 'cursor-pointer'}`}>
               <div className="p-5 space-y-4" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content text-[14px] leading-relaxed" />
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
                 <PostItem key={post.id} post={post} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
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
