
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, ChevronDown, BarChart3, Plus, X, Terminal, AlignLeft, 
  AlignCenter, AlignRight, Heading, Type, Table as TableIcon,
  Code, Video as VideoIcon, Loader2, ShieldCheck, Smile, Paperclip
} from 'lucide-react';
import { PollData } from '../types';

interface RichEditorProps {
  onPost: (content: string, poll?: PollData) => Promise<void>;
  currentUser: any;
}

const RichEditor: React.FC<RichEditorProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isScanning, setIsScanning] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, `<${value}>`);
    } else {
      document.execCommand(command, false, value);
    }
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const label = prompt("Link Text:", "Click here");
    const url = prompt("URL Address:", "https://");
    if (label && url) {
      const linkHtml = `<a href="${url}" class="text-[var(--brand-color)] font-bold hover:underline" target="_blank">${label}</a>`;
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, linkHtml);
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files) as File[]) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const imgHtml = `<img src="${ev.target?.result as string}" class="max-w-full rounded-xl border border-[var(--border-color)] my-4 shadow-md" />`;
          if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, imgHtml);
            setContent(editorRef.current.innerHTML);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const handleSubmit = async () => {
    const rawContent = editorRef.current?.innerHTML || '';
    if (!rawContent.trim() || rawContent === '<br>') return;
    
    let pollData: PollData | undefined;
    if (showPollBuilder && pollOptions.every(o => o.trim() !== '')) {
      pollData = {
        totalVotes: 0,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        options: pollOptions.map((opt, i) => ({
          id: `opt-${i}`, text: opt, votes: 0, voterIds: []
        }))
      };
    }

    setIsScanning(true);
    await onPost(rawContent, pollData);
    
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setIsExpanded(false);
    setIsScanning(false);
  };

  return (
    <div className={`mb-10 bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-2xl ring-4 ring-[var(--brand-color)]/5 border-[var(--brand-color)]/30' : 'shadow-sm'}`}>
      {/* TOOLBAR - Increased element size and improved spacing */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => execCommand('bold')} 
            className="p-2.5 hover:bg-[var(--brand-color)]/10 text-slate-600 hover:text-[var(--brand-color)] rounded-lg transition-colors"
            title="Bold"
          >
            <Bold size={18}/>
          </button>
          <button 
            onClick={() => execCommand('italic')} 
            className="p-2.5 hover:bg-[var(--brand-color)]/10 text-slate-600 hover:text-[var(--brand-color)] rounded-lg transition-colors"
            title="Italic"
          >
            <Italic size={18}/>
          </button>
          <div className="w-px h-6 bg-[var(--border-color)] mx-2"></div>
          
          <button 
            onClick={insertLink} 
            className="p-2.5 hover:bg-[var(--brand-color)]/10 text-slate-600 hover:text-[var(--brand-color)] rounded-lg transition-colors"
            title="Insert Link"
          >
            <LinkIcon size={18}/>
          </button>
          
          <label className="p-2.5 hover:bg-[var(--brand-color)]/10 text-slate-600 hover:text-[var(--brand-color)] rounded-lg transition-colors cursor-pointer" title="Add Images">
            <ImageIcon size={18}/>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImage} />
          </label>

          <button 
            onClick={() => setShowPollBuilder(!showPollBuilder)} 
            className={`p-2.5 rounded-lg transition-colors ${showPollBuilder ? 'text-white bg-[var(--brand-color)] shadow-md' : 'text-slate-600 hover:bg-[var(--brand-color)]/10 hover:text-[var(--brand-color)]'}`}
            title="Create Poll"
          >
            <BarChart3 size={18}/>
          </button>

          <button 
            className="p-2.5 hover:bg-[var(--brand-color)]/10 text-slate-600 hover:text-[var(--brand-color)] rounded-lg transition-colors hidden sm:block"
            title="Emojis"
          >
            <Smile size={18}/>
          </button>
        </div>
      </div>

      {/* EDITOR SURFACE - Chirp Font, 16px, Improved padding */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!isScanning}
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[140px] max-h-[600px] overflow-y-auto p-6 md:p-8 outline-none text-[16px] leading-relaxed font-sans text-[var(--text-primary)] post-editor-surface transition-all ${isExpanded ? 'min-h-[220px]' : ''} ${isScanning ? 'opacity-40 cursor-wait' : ''}`}
          style={{ fontStyle: 'normal' }}
        ></div>
        
        {!content && !isScanning && (
          <div className="absolute top-6 md:top-8 left-6 md:left-8 pointer-events-none text-slate-400 text-[16px] font-sans flex items-center gap-3">
             <Type size={18} className="text-slate-300"/> What's happening?
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
             <div className="flex flex-col items-center gap-4 px-10 py-6 bg-white border border-[var(--border-color)] rounded-3xl shadow-2xl animate-in fade-in zoom-in-95">
                <Loader2 size={32} className="text-[var(--brand-color)] animate-spin" />
                <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--brand-color)]">Publishing...</span>
             </div>
          </div>
        )}
      </div>

      {/* POLL BUILDER - Improved input appearance */}
      {showPollBuilder && (
        <div className="px-6 md:px-8 py-6 bg-slate-50 border-t border-[var(--border-color)] space-y-4 animate-in slide-in-from-top-2">
           <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Poll Options</h4>
              <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-[10px] font-bold text-[var(--brand-color)] hover:underline uppercase flex items-center gap-1"><Plus size={12}/> Add Option</button>
           </div>
           <div className="space-y-3">
              {pollOptions.map((opt, i) => (
                <div key={i} className="relative group">
                  <input 
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    placeholder={`Option ${i+1}`}
                    className="w-full bg-white border border-[var(--border-color)] rounded-xl py-3 px-4 text-[14px] font-medium outline-none focus:border-[var(--brand-color)] focus:ring-2 focus:ring-[var(--brand-color)]/10 transition-all"
                  />
                  {pollOptions.length > 2 && (
                    <button 
                      onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={16}/>
                    </button>
                  )}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* FOOTER ACTIONS - Larger and more prominent */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)] bg-white">
        <div className="flex items-center gap-3">
           <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{isScanning ? 'Network Sync' : 'Ready'}</span>
        </div>
        <div className="flex items-center gap-6">
           {isExpanded && !isScanning && (
             <button 
               onClick={() => setIsExpanded(false)} 
               className="text-[12px] font-bold uppercase text-slate-500 hover:text-rose-500 transition-colors tracking-widest"
             >
               Discard
             </button>
           )}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>' || isScanning}
             className="px-10 py-3 bg-[var(--brand-color)] hover:brightness-95 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full text-[15px] font-black tracking-tight flex items-center gap-3 transition-all shadow-lg hover:shadow-[var(--brand-color)]/20 active:scale-95"
           >
             {isScanning ? (
               <Loader2 size={20} className="animate-spin" />
             ) : (
               <>Post <Send size={18}/></>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
