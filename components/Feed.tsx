
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
  BarChart2, PlusCircle, MinusCircle, CheckCircle, Image as LucideImage,
  Calendar, Trash2, Settings2, Activity, Info, Clock,
  Code, MoreHorizontal, FileText, LayoutGrid, Layers, Globe
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  const isInstitutional = role === 'Official' || role === 'Corporate' || role === 'Academic Council';
  const color = isInstitutional ? '#829aab' : '#0969da';
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
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-sm transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none overflow-y-auto' : 'relative mb-10'}`}>
      
      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            restoreSelection();
            document.execCommand('insertHTML', false, `<div class="content-image-wrapper"><img src="${base64}" class="responsive-doc-image" /></div><br>`);
          };
          reader.readAsDataURL(file);
        }
        e.target.value = '';
      }} accept="image/*" className="hidden" />

      <input type="file" ref={pollOptionFileRef} onChange={handlePollOptionImage} accept="image/*" className="hidden" />

      {/* SUMMERNOTE-STYLE TOOLBAR */}
      <div className="px-2 py-2 border-b border-[var(--border-color)] bg-[#f6f8fa] dark:bg-[#161b22] flex flex-wrap items-center gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-0.5">
          <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all"><Bold size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all"><Italic size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all"><Underline size={14}/></button>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] mx-1"></div>

        <div className="flex items-center gap-0.5">
          <button onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400"><List size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400"><ListOrdered size={14}/></button>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] mx-1 hidden sm:block"></div>

        <div className="relative group/align">
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'align' ? null : 'align'); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all flex items-center gap-1">
            <AlignLeft size={14}/> <ChevronDown size={10}/>
          </button>
          {openDropdown === 'align' && (
            <div className="absolute top-full left-0 mt-1 z-[3010] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-xl rounded p-1 flex gap-1 animate-in fade-in zoom-in-95">
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }} className="p-2 hover:bg-[#0969da] hover:text-white rounded"><AlignLeft size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }} className="p-2 hover:bg-[#0969da] hover:text-white rounded"><AlignCenter size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }} className="p-2 hover:bg-[#0969da] hover:text-white rounded"><AlignRight size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyFull'); }} className="p-2 hover:bg-[#0969da] hover:text-white rounded"><AlignJustify size={14}/></button>
            </div>
          )}
        </div>

        <div className="relative">
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }} className="px-3 py-1.5 bg-white dark:bg-black/20 border border-[var(--border-color)] rounded text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-[#0969da] transition-all flex items-center gap-2">
            {FONTS.find(f => f.value === activeFont)?.name || 'Font'} <ChevronDown size={10} />
          </button>
          {openDropdown === 'fonts' && (
            <div className="absolute top-full left-0 mt-1 z-[3010] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded overflow-hidden w-48">
              {FONTS.map(f => (
                <button key={f.name} onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 hover:bg-[#0969da] hover:text-white text-[10px] font-bold uppercase transition-colors" style={{ fontFamily: f.value }}>{f.name}</button>
              ))}
            </div>
          )}
        </div>

        <button onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all" title="Add Image"><ImageIcon size={14}/></button>
        
        <button 
          onMouseDown={(e) => { e.preventDefault(); setIsPollMode(!isPollMode); }} 
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 border text-[10px] font-bold uppercase tracking-tight ${isPollMode ? 'bg-[#0969da] text-white border-transparent' : 'bg-transparent border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
        >
          <BarChart2 size={14}/> <span className="hidden sm:inline">Initialize Poll</span>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button onMouseDown={(e) => { e.preventDefault(); setIsFullscreen(!isFullscreen); }} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-400 transition-all">{isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}</button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className={`relative bg-white dark:bg-[#0d1117] transition-all ${isFullscreen ? 'flex-1' : 'min-h-[160px] max-h-[500px] overflow-y-auto'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-auto min-h-[160px] p-5 text-[15px] outline-none leading-relaxed rich-content-style font-mono"
          style={{ fontFamily: activeFont }}
          data-placeholder="Define telemetry parameters and signal context..."
        />
        {!content && <div className="absolute top-5 left-5 text-slate-400 pointer-events-none text-sm opacity-40 font-mono italic">Define telemetry parameters and signal context...</div>}
      </div>

      {/* POLL CONFIGURATION MATRIX - GITHUB STYLE */}
      {isPollMode && (
        <div className="p-5 border-t border-[var(--border-color)] bg-[#f6f8fa] dark:bg-[#161b22] space-y-5 animate-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0969da] rounded-md text-white">
                <Settings2 size={16} />
              </div>
              <h4 className="text-[11px] font-black uppercase text-[var(--text-primary)] tracking-widest">
                Poll_Configuration_Strata
              </h4>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-[#0d1117] px-3 py-1.5 border border-[var(--border-color)] rounded">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Window_Lapse</span>
              <div className="flex gap-1">
                {['1', '3', '7'].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setPollDuration(d)}
                    className={`px-3 py-0.5 rounded text-[10px] font-black transition-all ${pollDuration === d ? 'bg-[#0969da] text-white' : 'text-slate-400 hover:text-[#0969da]'}`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className={`relative group bg-white dark:bg-[#0d1117] border rounded transition-all ${opt.text ? 'border-[#0969da]/40 shadow-sm' : 'border-[var(--border-color)]'}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-[9px] font-black text-[#0969da]/60">NODE_0{idx + 1}</span>
                  <input 
                    className="flex-1 bg-transparent border-none text-[13px] font-bold text-[var(--text-primary)] outline-none placeholder:text-slate-400 placeholder:italic"
                    placeholder="Identify node..."
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[idx].text = e.target.value;
                      setPollOptions(newOpts);
                    }}
                  />
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentPollOptionIdx(idx);
                        pollOptionFileRef.current?.click();
                      }}
                      className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${opt.imageUrl ? 'text-[#0969da]' : 'text-slate-400'}`}
                      title="Attach Visual Asset"
                    >
                      <LucideImage size={16} />
                    </button>
                    {idx > 1 && (
                      <button onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="p-1.5 rounded hover:bg-rose-600 hover:text-white text-slate-400 transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                </div>
                {opt.imageUrl && (
                  <div className="relative h-24 border-t border-[var(--border-color)] group/img overflow-hidden">
                    <img src={opt.imageUrl} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => {
                          const newOpts = [...pollOptions];
                          newOpts[idx].imageUrl = undefined;
                          setPollOptions(newOpts);
                       }} className="p-2 bg-rose-600 text-white rounded-full shadow-lg">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {pollOptions.length < 4 && (
              <button 
                onClick={() => setPollOptions([...pollOptions, { text: '' }])}
                className="flex items-center justify-center gap-3 p-4 border border-dashed border-[var(--border-color)] rounded text-slate-400 hover:text-[#0969da] hover:border-[#0969da] transition-all group min-h-[60px]"
              >
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300"/>
                <span className="text-[10px] font-black uppercase tracking-widest">Append_Identity_Node</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="px-5 py-4 border-t border-[var(--border-color)] bg-[#f6f8fa] dark:bg-[#161b22] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isAnalyzing ? (
             <div className="flex items-center gap-3 px-4 py-1.5 bg-[#0969da]/10 rounded border border-[#0969da]/20 text-[#0969da]">
               <Loader2 size={14} className="animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-widest">Neural_Scanning...</span>
             </div>
          ) : (
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-white dark:bg-[#0d1117] rounded border border-[var(--border-color)]">
              <Activity size={14} className="text-emerald-500 animate-pulse"/> Uplink_Stable
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isPollMode && (
            <button onClick={() => setIsPollMode(false)} className="flex-1 sm:flex-none px-6 py-3 text-slate-500 hover:text-rose-500 text-[11px] font-bold uppercase tracking-widest transition-colors">Discard_Poll</button>
          )}
          <button 
            onClick={handlePublish}
            disabled={isAnalyzing || !content.trim()}
            className="flex-1 sm:flex-none bg-[#0969da] hover:bg-[#0861c5] text-white px-10 py-3 rounded font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Send size={16} /> Commit_Signal
          </button>
        </div>
      </div>

      <style>{`
        .rich-content-style:empty:before { content: attr(data-placeholder); color: #656d76; opacity: 0.5; }
        .rich-content-style h1, .rich-content-style h2 { font-weight: 800; text-transform: uppercase; margin: 1rem 0; letter-spacing: -0.02em; line-height: 1.1; }
        .rich-content-style ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .rich-content-style ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .content-image-wrapper { margin: 16px 0; display: flex; justify-content: center; }
        .responsive-doc-image { max-width: 100%; max-height: 450px; border-radius: 4px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
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

  const hasImages = poll.options.some(o => o.imageUrl);

  return (
    <div className="space-y-6 font-mono p-6 border border-[var(--border-color)] bg-[#f6f8fa] dark:bg-[#161b22]/40 rounded relative overflow-hidden group shadow-sm">
       <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 relative z-10">
          <div className="flex items-center gap-4">
             <div className={`p-2.5 rounded ${isExpired ? 'bg-slate-200 text-slate-500' : 'bg-[#0969da] text-white shadow-sm'}`}>
                <BarChart2 size={18}/>
             </div>
             <div>
                <h4 className="text-[12px] font-black uppercase tracking-widest text-[var(--text-primary)]">Sync_Poll_Protocol</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                   {isExpired ? 'Registry_Manifest_Locked' : 'Synchronizing_Identity_Signals...'}
                </p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[11px] font-black text-[#0969da] uppercase leading-none">{poll.totalVotes.toLocaleString()} COMMITS</p>
             <div className="flex items-center gap-1.5 justify-end mt-1.5">
                <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {isExpired ? 'OFFLINE' : 'LIVE'}
                </span>
             </div>
          </div>
       </div>

       <div className={`grid gap-4 pt-2 relative z-10 ${hasImages ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {poll.options.map(opt => {
             const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
             const myVote = opt.voterIds.includes(currentUser.id);

             return (
                <div key={opt.id} className="group/opt">
                   <button 
                     disabled={hasVoted || isExpired}
                     onClick={() => handleVote(opt.id)}
                     className={`w-full relative flex flex-col items-stretch overflow-hidden rounded-md border transition-all duration-300 ${
                        myVote ? 'border-[#0969da] bg-[#0969da]/5 shadow-sm' : 
                        hasVoted || isExpired ? 'border-[var(--border-color)] opacity-90' : 
                        'border-[var(--border-color)] bg-white dark:bg-[#0d1117] hover:border-[#0969da] hover:bg-[#0969da]/5'
                     }`}
                   >
                      {/* GITHUB STYLE PROGRESS BAR */}
                      {(hasVoted || isExpired) && (
                         <div 
                           className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
                             myVote ? 'bg-[#0969da]/10' : 'bg-slate-200 dark:bg-white/10'
                           }`} 
                           style={{ width: `${percentage}%` }}
                         />
                      )}

                      <div className="relative z-10">
                         {opt.imageUrl && (
                            <div className="h-40 overflow-hidden border-b border-inherit">
                               <img src={opt.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover/opt:scale-105" />
                            </div>
                         )}
                         <div className="px-5 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                               {myVote && <CheckCircle size={16} className="text-[#0969da] shrink-0 animate-in zoom-in"/>}
                               <span className={`text-[13px] font-black uppercase truncate tracking-tight transition-colors ${myVote ? 'text-[#0969da]' : ''}`}>
                                 {opt.text}
                               </span>
                            </div>
                            {(hasVoted || isExpired) && (
                               <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-black text-[#0969da]">{percentage}%</span>
                               </div>
                            )}
                         </div>
                      </div>
                   </button>
                </div>
             );
          })}
       </div>

       <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] pt-6 border-t border-[var(--border-color)] relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-6">
             <span className="flex items-center gap-2 pr-6 border-r border-[var(--border-color)]"><Terminal size={14}/> SHA-256_{postId.slice(-6).toUpperCase()}</span>
             <span className="flex items-center gap-2"><Activity size={14}/> {poll.totalVotes > 100 ? 'HIGH_SIGNAL_INTENSITY' : 'STABLE_NODE_SYNC'}</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-3 py-1.5 rounded-full border border-[var(--border-color)]">
             <Clock size={14} className="text-[#0969da]"/>
             <span>{isExpired ? `DECOMMISSIONED: ${new Date(poll.expiresAt).toLocaleDateString()}` : `AUTO_PURGE: ${new Date(poll.expiresAt).toLocaleDateString()}`}</span>
          </div>
       </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
      <div className="flex gap-5">
         <img 
           src={post.authorAvatar} 
           alt={post.author} 
           onClick={() => onNavigateToProfile(post.authorId)} 
           className="w-11 h-11 rounded border border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-95 transition-all shadow-sm" 
         />
         <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase">
               <div className="flex items-center gap-3 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:text-[#0969da] hover:underline cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={15} />
                  {post.isOpportunity && <div className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[7px] border border-amber-500/20 ml-1">OPPORTUNITY_SIGNAL</div>}
                  <span className="text-slate-400 font-bold ml-2 truncate opacity-60">@{post.college.toLowerCase()}</span>
               </div>
               <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap ml-2 opacity-50 italic">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && !post.pollData && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-sm overflow-hidden transition-all duration-300 hover:border-[#0969da]/40 ${isComment || post.pollData ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}>
               <div className="p-6 space-y-6" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content-style text-[15px] leading-relaxed font-mono" />
                  
                  {/* POLL RENDERING */}
                  {post.pollData && (
                    <PollNode poll={post.pollData} postId={post.id} currentUser={currentUser} />
                  )}
               </div>
               <div className="px-6 py-3 bg-[#f6f8fa] dark:bg-black/20 border-t border-[var(--border-color)] flex items-center gap-10">
                  <button className="flex items-center gap-2.5 text-slate-500 hover:text-rose-500 transition-all active:scale-90">
                    <Heart size={18} />
                    <span className="text-[12px] font-black">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-2.5 text-slate-500 hover:text-[#0969da] transition-all active:scale-90">
                    <MessageCircle size={18} />
                    <span className="text-[12px] font-black">{post.commentsCount.toLocaleString()}</span>
                  </button>
                  <div className="ml-auto text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] hidden sm:block">Log_{post.id.slice(-6).toUpperCase()}</div>
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
      const prompt = `Analyze this signal for academic consumption. Return JSON: { "isSafe": boolean, "unsafeReason": "string|null", "isOpportunity": boolean, "oppType": "Internship|Gig|Grant|Workshop|null", "benefit": "string(3 words)|null" } Text: "${plainText}"`;
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
        triggerSafetyError(`BLOCK: ${analysis.unsafeReason || "Indecent signal detected."}`);
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
          detectedBenefit: analysis.benefit || 'Verified Signal'
        } : undefined,
        pollData: poll,
        college: collegeFilter as College | 'Global'
      };
      
      db.addPost(newPost);
      setIsAnalyzing(false);
    } catch (e) { 
      setIsAnalyzing(false);
      const newPost: Post = { id: Date.now().toString(), author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar, timestamp: 'Just now', content, customFont: font, hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], isOpportunity: false, pollData: poll, college: collegeFilter as College | 'Global' };
      db.addPost(newPost);
    }
  };

  const filteredPosts = (posts || []).filter((p) => {
    if (threadId) return p.parentId === threadId || p.id === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 lg:px-0">
         <div className="lg:col-span-8 space-y-10">
            {!threadId && <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />}
            {threadId && onBack && (
               <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#0969da] transition-colors mb-6">
                  <ChevronRight className="rotate-180" size={16}/> Return_To_Feed
               </button>
            )}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                     <Radio size={20} className="text-[#0969da] animate-pulse" />
                     <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500">Sector_{collegeFilter.toUpperCase()}_Telemetry</h3>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-600/5 border border-indigo-600/10 rounded-full text-[#0969da]">
                    <Activity size={12}/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Feed_Live</span>
                  </div>
               </div>
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-10">
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md p-8 shadow-sm">
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-4 border-b border-[var(--border-color)] pb-6">
                 <TrendingUp size={22} className="text-[#0969da]" /> Trending_Signals
               </h3>
               <div className="space-y-6">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs', '#HillProtocol'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center transition-all hover:translate-x-2">
                       <div>
                         <p className="text-[15px] font-black text-[#0969da] group-hover:underline uppercase tracking-tighter italic">{tag}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2"><Zap size={10} className="fill-current"/> High_Intensity</p>
                       </div>
                       <ChevronRight size={20} className="text-slate-300 group-hover:text-[#0969da] transition-all" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 bg-[#0969da] rounded-md text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700"><Zap size={120} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <LayoutGrid size={24} fill="white"/>
                     <h4 className="text-[14px] font-black uppercase tracking-widest leading-none">Pro_Strata_Sync</h4>
                  </div>
                  <p className="text-[12px] font-bold opacity-80 uppercase leading-relaxed italic">
                    Synchronize your node with the elite academic strata for prioritized signal indexing and unlimited vault access.
                  </p>
                  <button className="w-full py-4 bg-white text-[#0969da] rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-50 transition-all active:scale-95">Request_Synchronization</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
