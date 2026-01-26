
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
  Calendar, Trash2, Settings2, Activity,
  // Fix: Adding missing icons from lucide-react
  Info, Clock
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
  const [openDropdown, setOpenDropdown] = useState<'fonts' | null>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  
  // Poll State - Elevated Configuration
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
        alert("PROTOCOL ERROR: Poll requires at least 2 valid options to initialize node.");
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
    <div className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-md shadow-2xl overflow-visible mb-12 transition-all ${isFullscreen ? 'fixed inset-0 z-[3000] m-0 rounded-none' : 'relative animate-in slide-in-from-top-4 duration-500'}`}>
      
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

      {/* TACTICAL TOOLBAR */}
      <div className="px-3 py-1.5 border-b border-[var(--border-color)] bg-slate-50 dark:bg-white/5 flex flex-wrap items-center justify-between gap-2 relative z-[60]">
        <div className="flex items-center gap-1">
          <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-600 dark:text-slate-400" title="Bold"><Bold size={14}/></button>
          <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-600 dark:text-slate-400" title="Italic"><Italic size={14}/></button>
          <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>
          
          <div className="relative">
            <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpenDropdown(openDropdown === 'fonts' ? null : 'fonts'); }} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10">
              {FONTS.find(f => f.value === activeFont)?.name || 'Font'} <ChevronDown size={10} />
            </button>
            {openDropdown === 'fonts' && (
              <div className="absolute top-full left-0 mt-1 z-[3005] bg-white dark:bg-[#161b22] border border-[var(--border-color)] shadow-2xl rounded-md overflow-hidden w-56">
                {FONTS.map(f => (
                  <button key={f.name} onMouseDown={(e) => { e.preventDefault(); setActiveFont(f.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 hover:bg-indigo-600 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors" style={{ fontFamily: f.value }}>{f.name}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-600 dark:text-slate-400" title="Upload Media"><ImageIcon size={14}/></button>
          
          {/* POLL TRIGGER */}
          <button 
            onMouseDown={(e) => { e.preventDefault(); setIsPollMode(!isPollMode); }} 
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 border ${isPollMode ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-white/10'}`}
            title="Configure Poll Node"
          >
            <BarChart2 size={14}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Poll_Init</span>
          </button>

          <div className="h-4 w-px bg-[var(--border-color)] mx-1"></div>
          <button onMouseDown={(e) => { e.preventDefault(); setIsFullscreen(!isFullscreen); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-600 dark:text-slate-400">{isFullscreen ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}</button>
        </div>
      </div>

      <div className={`relative bg-white dark:bg-black/20 ${isFullscreen ? 'h-[calc(100vh-350px)]' : 'min-h-[120px] max-h-[500px] overflow-y-auto'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="w-full h-auto min-h-[120px] p-6 text-[15px] outline-none leading-relaxed rich-content-style font-mono"
          style={{ fontFamily: activeFont }}
          data-placeholder="Define signal parameters and context..."
        />
        {!content && <div className="absolute top-6 left-6 text-slate-400 pointer-events-none text-sm opacity-40 font-mono italic">Define signal parameters and context...</div>}
      </div>

      {/* ADVANCED POLL CONFIGURATION MATRIX */}
      {isPollMode && (
        <div className="p-6 border-t-2 border-dashed border-[var(--border-color)] bg-slate-50/80 dark:bg-white/5 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-600/20">
                <Settings2 size={18} />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]">Configuration_Stratum</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Define multiple-choice variables</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white dark:bg-black/20 px-4 py-2 rounded-xl border border-[var(--border-color)]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Window_Lapse</span>
              <div className="flex gap-1">
                {['1', '3', '7'].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setPollDuration(d)}
                    className={`px-3 py-1 rounded text-[10px] font-black transition-all ${pollDuration === d ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="relative group animate-in zoom-in-95 duration-300">
                <div className={`flex flex-col bg-white dark:bg-[#161b22] border rounded-xl overflow-hidden transition-all duration-300 ${opt.text.trim() ? 'border-indigo-600/30' : 'border-[var(--border-color)]'}`}>
                  <div className="flex items-center px-4 py-3 gap-3">
                    <span className="text-[9px] font-black text-indigo-600/60 uppercase">NODE_{idx + 1}</span>
                    <input 
                      className="flex-1 bg-transparent border-none text-[12px] font-bold text-[var(--text-primary)] outline-none placeholder:text-slate-400 placeholder:italic"
                      placeholder={`Enter variable ${idx + 1}...`}
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
                        className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${opt.imageUrl ? 'text-indigo-600' : 'text-slate-400'}`}
                        title="Attach Media Asset"
                      >
                        <LucideImage size={14} />
                      </button>
                      {idx > 1 && (
                        <button onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="p-1.5 rounded hover:bg-rose-500 hover:text-white text-slate-400 transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                  {opt.imageUrl && (
                    <div className="relative h-24 border-t border-[var(--border-color)] group/img">
                      <img src={opt.imageUrl} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => {
                            const newOpts = [...pollOptions];
                            newOpts[idx].imageUrl = undefined;
                            setPollOptions(newOpts);
                         }} className="p-2 bg-rose-600 text-white rounded-full shadow-2xl scale-75 group-hover/img:scale-100 transition-transform">
                            <X size={14} />
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {pollOptions.length < 4 && (
              <button 
                onClick={() => setPollOptions([...pollOptions, { text: '' }])}
                className="flex items-center justify-center gap-3 p-4 border border-dashed border-[var(--border-color)] rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600/5 transition-all group"
              >
                <PlusCircle size={20} className="group-hover:scale-110 transition-transform"/>
                <span className="text-[10px] font-black uppercase tracking-widest">Append_Option</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
             <Info size={16} className="text-amber-500 shrink-0" />
             <p className="text-[9px] font-bold text-amber-600/80 uppercase tracking-widest leading-relaxed italic">
               Note: Once committed to the central registry, poll parameters are immutable. Ensure alphanumeric integrity before uplink.
             </p>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="px-6 py-4 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isAnalyzing && (
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-lg text-indigo-600 border border-indigo-600/20">
               <Loader2 size={12} className="animate-spin" />
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">Neural_Assessment</span>
             </div>
          )}
          {!isAnalyzing && (
            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <Activity size={10} className="text-emerald-500"/> System_Nominal
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isPollMode && (
            <button onClick={() => setIsPollMode(false)} className="px-4 py-2.5 text-slate-500 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors">Discard_Poll</button>
          )}
          <button 
            onClick={handlePublish}
            disabled={isAnalyzing || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center gap-3"
          >
            <Send size={14} /> Commit_Signal
          </button>
        </div>
      </div>

      <style>{`
        .rich-content-style:empty:before { content: attr(data-placeholder); color: #64748b; opacity: 0.5; }
        .rich-content-style h1, .rich-content-style h2 { font-weight: 900; text-transform: uppercase; margin: 1rem 0; letter-spacing: -0.05em; }
        .content-image-wrapper { margin: 16px 0; display: flex; justify-content: center; }
        .responsive-doc-image { max-width: 100%; max-height: 400px; border-radius: 4px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
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
    <div className="space-y-6 font-mono p-6 border-2 border-indigo-600/20 bg-indigo-50/5 dark:bg-indigo-900/5 rounded-2xl shadow-xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
          <BarChart2 size={120} />
       </div>

       <div className="flex items-center justify-between border-b border-indigo-600/10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isExpired ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white shadow-lg'}`}>
                <BarChart2 size={18}/>
             </div>
             <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Synchronized_Poll</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isExpired ? 'Final Results Logged' : 'Live Data Collection Active'}</p>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-2 justify-end">
                <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                   {isExpired ? 'PROTOCOL_HALTED' : 'UPLINK_LIVE'}
                </span>
             </div>
             <p className="text-[10px] font-black text-indigo-600 mt-1">{poll.totalVotes.toLocaleString()} COMMITS</p>
          </div>
       </div>

       <div className={`grid gap-4 pt-2 relative z-10 ${hasImages ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {poll.options.map(opt => {
             const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
             const myVote = opt.voterIds.includes(currentUser.id);
             const isWinner = isExpired && opt.votes === Math.max(...poll.options.map(o => o.votes));

             return (
                <div key={opt.id} className="space-y-2 group/opt">
                   <button 
                     disabled={hasVoted || isExpired}
                     onClick={() => handleVote(opt.id)}
                     className={`w-full relative flex flex-col items-stretch overflow-hidden rounded-xl border-2 transition-all duration-500 ${
                        myVote ? 'border-indigo-600 bg-indigo-600/5' : 
                        isWinner ? 'border-emerald-500 bg-emerald-500/5' :
                        hasVoted || isExpired ? 'border-slate-200 dark:border-white/5 opacity-90' : 
                        'border-slate-200 dark:border-white/10 hover:border-indigo-600 hover:bg-indigo-600/5 group-hover:shadow-lg'
                     }`}
                   >
                      {/* Bar Visualization */}
                      {(hasVoted || isExpired) && (
                         <div 
                           className={`absolute inset-0 transition-all duration-1000 ease-out ${
                             myVote ? 'bg-indigo-600/10' : 
                             isWinner ? 'bg-emerald-500/10' : 
                             'bg-slate-100 dark:bg-white/5'
                           }`} 
                           style={{ width: `${percentage}%` }}
                         />
                      )}

                      <div className="relative z-10">
                         {opt.imageUrl && (
                            <div className="h-28 overflow-hidden border-b border-inherit">
                               <img src={opt.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover/opt:scale-110" />
                            </div>
                         )}
                         <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                               <span className={`text-[12px] font-black uppercase truncate tracking-tight transition-colors ${myVote ? 'text-indigo-600' : ''}`}>
                                 {opt.text}
                               </span>
                               {myVote && <CheckCircle size={12} className="text-indigo-600 shrink-0"/>}
                               {isWinner && <Star size={12} className="text-emerald-500 fill-emerald-500 shrink-0" />}
                            </div>
                            {(hasVoted || isExpired) && (
                               <div className="flex flex-col items-end">
                                  <span className="text-[12px] font-black text-indigo-600 leading-none">{percentage}%</span>
                                  <span className="text-[7px] font-bold text-slate-400 mt-1 uppercase">{opt.votes} v</span>
                               </div>
                            )}
                         </div>
                      </div>
                   </button>
                </div>
             );
          })}
       </div>

       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] pt-4 border-t border-indigo-600/10 relative z-10">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5"><Terminal size={12}/> SHA-256_{postId.slice(-8).toUpperCase()}</span>
             <span className="flex items-center gap-1.5"><Activity size={12}/> {poll.totalVotes > 50 ? 'HIGH_INTENSITY' : 'STABLE'}</span>
          </div>
          <div className="flex items-center gap-2">
             <Clock size={12}/>
             <span>{isExpired ? `DECOMMISSIONED: ${new Date(poll.expiresAt).toLocaleDateString()}` : `EXPIRY_SEQUENCE: ${new Date(poll.expiresAt).toLocaleDateString()}`}</span>
          </div>
       </div>
    </div>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, isComment?: boolean }> = ({ post, currentUser, onOpenThread, onNavigateToProfile, isComment }) => {
  return (
    <article className="group relative">
      <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
      <div className="flex gap-4">
         <img src={post.authorAvatar} alt={post.author} onClick={() => onNavigateToProfile(post.authorId)} className="w-12 h-12 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10 cursor-pointer hover:brightness-90 transition-all hover:scale-105 shadow-md" />
         <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase">
               <div className="flex items-center gap-2 overflow-hidden">
                  <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:text-indigo-600 hover:underline cursor-pointer truncate">{post.author}</span>
                  <AuthoritySeal role={post.authorAuthority} size={15} />
                  {post.isOpportunity && <div className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[7px] border border-amber-500/20 ml-1">Opportunity</div>}
                  <span className="text-slate-400 font-bold ml-2 truncate opacity-60">@{post.college.toLowerCase()}</span>
               </div>
               <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap ml-2 italic">{post.timestamp}</span>
            </div>
            <div onClick={() => !isComment && !post.pollData && onOpenThread(post.id)} className={`bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden transition-all hover:border-indigo-500/30 ${isComment || post.pollData ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'}`}>
               <div className="p-6 space-y-6" style={{ fontFamily: post.customFont }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content-style text-[15px] leading-relaxed font-mono" />
                  
                  {/* POLL RENDERING - TAKES PRECEDENCE */}
                  {post.pollData && (
                    <PollNode poll={post.pollData} postId={post.id} currentUser={currentUser} />
                  )}
               </div>
               <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center gap-8">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={16} />
                    <span className="text-11px font-black tracking-tighter">{post.likes.toLocaleString()}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenThread(post.id); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-11px font-black tracking-tighter">{post.commentsCount.toLocaleString()}</span>
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
         <div className="lg:col-span-8 space-y-10">
            {!threadId && <PostCreator onPost={handlePost} isAnalyzing={isAnalyzing} />}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                     <Radio size={16} className="text-indigo-600 animate-pulse" />
                     <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Sector_{collegeFilter.toUpperCase()}_Pulse</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/5 border border-indigo-600/10 rounded-full text-indigo-600">
                    <span className="text-[9px] font-black uppercase tracking-widest">Active_Telemetry</span>
                  </div>
               </div>
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-8">
            <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                 <TrendingUp size={18} className="text-indigo-600" /> Signal_Intensity
               </h3>
               <div className="space-y-6">
                  {['#ResearchWeek', '#Guild89', '#COCISLabs', '#HillProtocol'].map((tag) => (
                    <div key={tag} className="group cursor-pointer flex justify-between items-center transition-all hover:translate-x-1">
                       <div>
                         <p className="text-sm font-black text-indigo-600 group-hover:underline uppercase tracking-tighter italic">{tag}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">High_Frequency</p>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-indigo-600 rounded-2xl text-white shadow-2xl shadow-indigo-600/20 space-y-4">
               <div className="flex items-center gap-3">
                  <Zap size={20} fill="white"/>
                  <h4 className="text-xs font-black uppercase tracking-widest">Premium_Uplink</h4>
               </div>
               <p className="text-[11px] font-bold opacity-80 uppercase leading-loose">
                 Synchronize your node with the academic strata for enhanced research signals and vault prioritization.
               </p>
               <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all">Request_Pro_Strata</button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
