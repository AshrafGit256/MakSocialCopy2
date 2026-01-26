
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
  Code, MoreHorizontal, FileText, LayoutGrid, Layers
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
  const [openDropdown, setOpenDropdown] = useState<'fonts' | 'align' | null>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  
  // Advanced Poll State
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
    { name: 'Scholar Serif', value: '"Playfair Display", serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
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
        alert("PROTOCOL ERROR: Poll requires minimum 2 defined nodes for synchronization.");
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
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none overflow-y-auto' : 'relative mb-12 animate-in slide-in-from-top-4'}`}>
      
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

      {/* SUMMERNOTE-INSPIRED RICH TEXT TOOLBAR */}
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-white/5 flex flex-wrap items-center gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center bg-white dark:bg-black/20 rounded-lg p-0.5 border border-[var(--border-color)]">
          <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-600 dark:text-slate-400" title="Bold"><Bold size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-600 dark:text-slate-400" title="Italic"><Italic size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-600 dark:text-slate-400" title="Underline"><Underline size={14}/></button>
        </div>

        <div className="flex items-center bg-white dark:bg-black/20 rounded-lg p-0.5 border border-[var(--border-color)]">
          <button onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-600 dark:text-slate-400"><List size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded transition-all text-slate-600 dark:text-slate-400"><ListOrdered size={14}/></button>
        </div>

        <div className="relative group/align">
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'align' ? null : 'align'); }} className="p-2.5 bg-white dark:bg-black/20 rounded-lg border border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:border-indigo-600 transition-all flex items-center gap-2">
            <AlignLeft size={14}/> <ChevronDown size={10}/>
          </button>
          {openDropdown === 'align' && (
            <div className="absolute top-full left-0 mt-2 z-[3010] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-lg p-1 flex gap-1">
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded"><AlignLeft size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded"><AlignCenter size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded"><AlignRight size={14}/></button>
              <button onMouseDown={(e) => { e.preventDefault(); exec('justifyFull'); }} className="p-2 hover:bg-indigo-600 hover:text-white rounded"><AlignJustify size={14}/></button>
            </div>
          )}
        </div>

        <div className="relative">
          <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }} className="px-3 py-2 bg-white dark:bg-black/20 rounded-lg border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-indigo-600 transition-all flex items-center gap-2">
            {FONTS.find(f => f.value === activeFont)?.name.split(' ')[0] || 'Font'} <ChevronDown size={10} />
          </button>
          {openDropdown === 'fonts' && (
            <div className="absolute top-full left-0 mt-2 z-[3010] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-lg overflow-hidden w-48">
              {FONTS.map(f => (
                <button key={f.name} onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 hover:bg-indigo-600 hover:text-white text-[11px] font-bold uppercase transition-colors" style={{ fontFamily: f.value }}>{f.name}</button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] mx-1 hidden sm:block"></div>

        <button onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="p-2.5 bg-white dark:bg-black/20 border border-[var(--border-color)] rounded-lg hover:border-indigo-600 text-slate-600 dark:text-slate-400 transition-all" title="Attach Signal Asset"><ImageIcon size={14}/></button>
        
        <button 
          onMouseDown={(e) => { e.preventDefault(); setIsPollMode(!isPollMode); }} 
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 border font-black text-[10px] uppercase tracking-widest ${isPollMode ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-black/20 border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:border-indigo-600'}`}
        >
          <BarChart2 size={14}/> <span className="hidden lg:inline">Poll_Init</span>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button onMouseDown={(e) => { e.preventDefault(); setIsFullscreen(!isFullscreen); }} className="p-2.5 bg-white dark:bg-black/20 border border-[var(--border-color)] rounded-lg text-slate-600 dark:text-slate-400 hover:border-indigo-600 transition-all">{isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}</button>
        </div>
      </div>

      <div className={`relative bg-white dark:bg-black/10 transition-all ${isFullscreen ? 'flex-1' : 'min-h-[150px] max-h-[500px] overflow-y-auto'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-auto min-h-[150px] p-6 text-[16px] outline-none leading-relaxed rich-content-style font-mono"
          style={{ fontFamily: activeFont }}
          data-placeholder="Define telemetry parameters and academic context..."
        />
        {!content && <div className="absolute top-6 left-6 text-slate-400 pointer-events-none text-sm opacity-40 font-mono italic">Define telemetry parameters and academic context...</div>}
      </div>

      {/* FULLY RESPONSIVE IMAGE-POLL CONFIGURATION MATRIX */}
      {isPollMode && (
        <div className="p-6 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5 space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/20">
                <Settings2 size={20} />
              </div>
              <div>
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]">Configuration_Strata</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Construct multi-node variables</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white dark:bg-black/20 px-4 py-2.5 rounded-xl border border-[var(--border-color)]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Window_Lapse</span>
              <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
                {['1', '3', '7'].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setPollDuration(d)}
                    className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${pollDuration === d ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="relative group animate-in zoom-in-95">
                <div className={`flex flex-col bg-white dark:bg-[#161b22] border-2 rounded-2xl overflow-hidden transition-all duration-300 ${opt.text.trim() ? 'border-indigo-600/40 shadow-xl' : 'border-[var(--border-color)]'}`}>
                  <div className="flex items-center px-5 py-4 gap-4">
                    <span className="text-[10px] font-black text-indigo-600/60 uppercase">VAR_{idx + 1}</span>
                    <input 
                      className="flex-1 bg-transparent border-none text-[13px] font-black text-[var(--text-primary)] outline-none placeholder:text-slate-400 placeholder:font-normal placeholder:italic uppercase tracking-tight"
                      placeholder={`Identity Node ${idx + 1}...`}
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[idx].text = e.target.value;
                        setPollOptions(newOpts);
                      }}
                    />
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => {
                          setCurrentPollOptionIdx(idx);
                          pollOptionFileRef.current?.click();
                        }}
                        className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${opt.imageUrl ? 'text-indigo-600' : 'text-slate-400'}`}
                        title="Upload Visual Payload"
                      >
                        <LucideImage size={18} />
                      </button>
                      {idx > 1 && (
                        <button onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="p-2 rounded-lg hover:bg-rose-600 hover:text-white text-slate-400 transition-colors">
                          <Trash2 size={18}/>
                        </button>
                      )}
                    </div>
                  </div>
                  {opt.imageUrl && (
                    <div className="relative h-32 md:h-40 border-t border-[var(--border-color)] group/img">
                      <img src={opt.imageUrl} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => {
                            const newOpts = [...pollOptions];
                            newOpts[idx].imageUrl = undefined;
                            setPollOptions(newOpts);
                         }} className="p-3 bg-rose-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
                            <Trash2 size={16} />
                         </button>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[7px] text-white font-black uppercase tracking-widest">
                         Visual_Asset_0{idx+1}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {pollOptions.length < 4 && (
              <button 
                onClick={() => setPollOptions([...pollOptions, { text: '' }])}
                className="flex items-center justify-center gap-4 p-8 border-2 border-dashed border-[var(--border-color)] rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600/5 transition-all group min-h-[100px]"
              >
                <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-500"/>
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Append_Identity_Node</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="px-6 py-5 border-t border-[var(--border-color)] bg-slate-50 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {isAnalyzing ? (
             <div className="flex items-center gap-3 px-4 py-2 bg-indigo-600/10 rounded-xl text-indigo-600 border border-indigo-600/20">
               <Loader2 size={14} className="animate-spin" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural_Assessment_Active</span>
             </div>
          ) : (
            <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-white dark:bg-black/20 rounded-xl border border-[var(--border-color)]">
              <Activity size={12} className="text-emerald-500 animate-pulse"/> Uplink_Stable
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isPollMode && (
            <button onClick={() => setIsPollMode(false)} className="flex-1 sm:flex-none px-6 py-4 text-slate-500 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors">Abort_Poll</button>
          )}
          <button 
            onClick={handlePublish}
            disabled={isAnalyzing || !content.trim()}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
          >
            <Send size={16} /> Commit_Signal
          </button>
        </div>
      </div>

      <style>{`
        .rich-content-style:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content-style h1, .rich-content-style h2 { font-weight: 900; text-transform: uppercase; margin: 1.5rem 0 1rem; letter-spacing: -0.05em; line-height: 1; }
        .rich-content-style ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .rich-content-style ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .content-image-wrapper { margin: 20px 0; display: flex; justify-content: center; }
        .responsive-doc-image { max-width: 100%; max-height: 500px; border-radius: 8px; border: 2px solid var(--border-color); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
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
    <div className="space-y-8 font-mono p-8 border-2 border-indigo-600/20 bg-indigo-50/5 dark:bg-indigo-900/5 rounded-3xl shadow-2xl relative overflow-hidden group">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
          <BarChart2 size={150} />
       </div>

       <div className="flex items-center justify-between border-b border-indigo-600/10 pb-6 relative z-10">
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-xl ${isExpired ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30'}`}>
                <Radio size={24} className={isExpired ? '' : 'animate-pulse'}/>
             </div>
             <div>
                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]">Signal_Poll_Matrix</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                   {isExpired ? 'Manifest Finalized' : 'Uplink Stream: Active'}
                </p>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-3 justify-end">
                <div className={`w-2.5 h-2.5 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {isExpired ? 'LOG_CLOSED' : 'LIVE_SYNC'}
                </span>
             </div>
             <p className="text-[12px] font-black text-indigo-600 mt-2">{poll.totalVotes.toLocaleString()} COMMITS</p>
          </div>
       </div>

       <div className={`grid gap-6 pt-2 relative z-10 ${hasImages ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {poll.options.map(opt => {
             const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
             const myVote = opt.voterIds.includes(currentUser.id);
             const isWinner = isExpired && opt.votes === Math.max(...poll.options.map(o => o.votes));

             return (
                <div key={opt.id} className="space-y-3 group/opt">
                   <button 
                     disabled={hasVoted || isExpired}
                     onClick={() => handleVote(opt.id)}
                     className={`w-full relative flex flex-col items-stretch overflow-hidden rounded-2xl border-2 transition-all duration-700 ease-out ${
                        myVote ? 'border-indigo-600 bg-indigo-600/5 shadow-2xl' : 
                        isWinner ? 'border-emerald-500 bg-emerald-500/5' :
                        hasVoted || isExpired ? 'border-slate-200 dark:border-white/5 opacity-80' : 
                        'border-slate-200 dark:border-white/10 hover:border-indigo-600 hover:bg-indigo-600/5 hover:shadow-xl'
                     }`}
                   >
                      {/* Animated Progress Bar */}
                      {(hasVoted || isExpired) && (
                         <div 
                           className={`absolute inset-0 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                             myVote ? 'bg-indigo-600/10' : 
                             isWinner ? 'bg-emerald-500/10' : 
                             'bg-slate-100 dark:bg-white/5'
                           }`} 
                           style={{ width: `${percentage}%` }}
                         />
                      )}

                      <div className="relative z-10">
                         {opt.imageUrl && (
                            <div className="h-40 md:h-48 overflow-hidden border-b border-inherit">
                               <img src={opt.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover/opt:scale-110" />
                            </div>
                         )}
                         <div className="px-6 py-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                               {myVote && <CheckCircle size={16} className="text-indigo-600 shrink-0 animate-in zoom-in duration-500"/>}
                               <span className={`text-[14px] font-black uppercase truncate tracking-tight transition-colors ${myVote ? 'text-indigo-600' : ''}`}>
                                 {opt.text}
                               </span>
                               {isWinner && <Star size={16} className="text-emerald-500 fill-emerald-500 shrink-0" />}
                            </div>
                            {(hasVoted || isExpired) && (
                               <div className="flex flex-col items-end">
                                  <span className="text-[16px] font-black text-indigo-600 leading-none">{percentage}%</span>
                                  <span className="text-[8px] font-bold text-slate-400 mt-2 uppercase">{opt.votes} COMMITS</span>
                               </div>
                            )}
                         </div>
                      </div>
                   </button>
                </div>
             );
          })}
       </div>

       <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] pt-8 border-t border-indigo-600/10 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-6">
             <span className="flex items-center gap-2 border-r border-indigo-600/10 pr-6"><Terminal size={14}/> SHA-256_{postId.slice(-8).toUpperCase()}</span>
             <span className="flex items-center gap-2"><Activity size={14}/> {poll.totalVotes > 100 ? 'CRITICAL_LOAD' : 'NOMINAL_SYNC'}</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-4 py-2 rounded-full border border-indigo-600/10">
             <Clock size={14} className="text-indigo-600"/>
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
           className="w-12 h-12 rounded-xl border-2 border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-90 hover:scale-105 transition-all shadow-md" 
         />
         <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase">
               <div className="flex items-center gap-3 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:text-indigo-600 hover:underline cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={15} />
                  {post.isOpportunity && <div className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 rounded-full text-[7px] border border-amber-500/20 ml-1">Opportunity_Asset</div>}
                  <span className="text-slate-400 font-bold ml-2 truncate opacity-60">HUB_{post.college.toUpperCase()}</span>
               </div>
               <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap ml-2 opacity-50">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && !post.pollData && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-indigo-500/40 ${isComment || post.pollData ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-0.5'}`}>
               <div className="p-8 space-y-8" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content-style text-[16px] leading-relaxed font-mono" />
                  
                  {/* POLL RENDERING */}
                  {post.pollData && (
                    <PollNode poll={post.pollData} postId={post.id} currentUser={currentUser} />
                  )}
               </div>
               <div className="px-8 py-4 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center gap-10">
                  <button className="flex items-center gap-2.5 text-slate-500 hover:text-rose-500 transition-all active:scale-90">
                    <Heart size={18} />
                    <span className="text-[12px] font-black tracking-tighter">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 transition-all active:scale-90">
                    <MessageCircle size={18} />
                    <span className="text-[12px] font-black tracking-tighter">{post.commentsCount.toLocaleString()}</span>
                  </button>
                  <div className="ml-auto text-[9px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">SHA-256: {post.id.slice(-6).toUpperCase()}</div>
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
    if (threadId) return p.parentId === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4 lg:px-0">
         <div className="lg:col-span-8 space-y-12">
            {!threadId && <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />}
            <div className="space-y-10">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                     <Radio size={20} className="text-indigo-600 animate-pulse" />
                     <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500">Sector_{collegeFilter.toUpperCase()}_Telemetry</h3>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-600/5 border border-indigo-600/10 rounded-full text-indigo-600">
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
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-3xl p-10 shadow-2xl">
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-4 border-b border-[var(--border-color)] pb-6">
                 <TrendingUp size={22} className="text-indigo-600" /> Hot_Signals
               </h3>
               <div className="space-y-8">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs', '#HillProtocol'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center transition-all hover:translate-x-2">
                       <div>
                         <p className="text-[15px] font-black text-indigo-600 group-hover:underline uppercase tracking-tighter italic">{tag}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2"><Zap size={10} className="fill-current"/> High_Intensity</p>
                       </div>
                       <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700"><Zap size={120} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <LayoutGrid size={24} fill="white"/>
                     <h4 className="text-[14px] font-black uppercase tracking-widest leading-none">Pro_Strata_Uplink</h4>
                  </div>
                  <p className="text-[12px] font-bold opacity-80 uppercase leading-relaxed italic">
                    Synchronize your node with the elite academic strata for prioritized signal indexing and unlimited vault access.
                  </p>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 transition-all active:scale-95">Request_Synchronization</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
