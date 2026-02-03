
import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, ChevronDown, BarChart3, Plus, X, Terminal, AlignLeft, 
  AlignCenter, AlignRight, Heading, Type, Table as TableIcon,
  Code, Video as VideoIcon, Loader2, ShieldCheck, ChevronUp
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
      document.execCommand('formatBlock', false, value);
    } else {
      document.execCommand(command, false, value);
    }
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const label = prompt("Signal Label:", "Reference Signal");
    const url = prompt("Network Protocol Address (URL):", "https://");
    if (label && url) {
      const linkHtml = `<a href="${url}" class="text-slate-600 underline font-bold" target="_blank">${label}</a>`;
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, linkHtml);
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const insertTable = () => {
    const tableHtml = '<table class="w-full border-collapse border border-slate-300 my-4 text-[10px] uppercase font-mono"><tr><td class="border border-slate-300 p-2">...</td><td class="border border-slate-300 p-2">...</td></tr></table><p><br></p>';
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, tableHtml);
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files) as File[]) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const imgHtml = `<img src="${ev.target?.result as string}" class="max-w-full rounded border border-slate-300 my-4 shadow-sm" />`;
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
    
    // Clear editor if scan complete and successful (handled by state)
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setIsExpanded(false);
    setIsScanning(false);
  };

  return (
    <div className={`mb-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-2xl' : 'shadow-sm'}`}>
      {/* TACTICAL TOOLBAR - RESTORED FEATURES */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Header & Font Selectors */}
          <div className="flex items-center bg-white dark:bg-white/5 border border-[var(--border-color)] rounded-[2px] mr-1">
             <select 
               onChange={(e) => execCommand('formatBlock', e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase px-2 py-1 outline-none text-slate-500 border-r border-[var(--border-color)]"
             >
                <option value="p">Type</option>
                <option value="h1">Header 1</option>
                <option value="h2">Header 2</option>
                <option value="h3">Header 3</option>
                <option value="p">Paragraph</option>
             </select>
             <select 
               onChange={(e) => execCommand('fontName', e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase px-2 py-1 outline-none text-slate-500"
             >
                <option value="Source Sans Pro">Font</option>
                <option value="JetBrains Mono">Mono</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Serif</option>
             </select>
          </div>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1"></div>

          {/* Text Styling */}
          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><Italic size={14}/></button>
          <button onClick={() => execCommand('underline')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors font-serif font-black underline">U</button>
          
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1"></div>

          {/* Alignment Nodes */}
          <button onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><AlignLeft size={14}/></button>
          <button onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><AlignCenter size={14}/></button>
          <button onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><AlignRight size={14}/></button>
          
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-800 mx-1"></div>

          {/* Assets & Links */}
          <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><List size={14}/></button>
          <button onClick={insertLink} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><LinkIcon size={14}/></button>
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded cursor-pointer transition-colors">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImage} />
          </label>
          <button onClick={insertTable} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><TableIcon size={14}/></button>
          <button onClick={() => setShowPollBuilder(!showPollBuilder)} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-all ${showPollBuilder ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-600/5' : 'text-slate-500'}`}><BarChart3 size={14}/></button>
          <button onClick={() => execCommand('insertHorizontalRule')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded transition-colors"><ChevronDown size={14}/></button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!isScanning}
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[160px] max-h-[600px] overflow-y-auto p-8 outline-none text-[14px] font-mono text-[var(--text-primary)] leading-relaxed post-editor-surface transition-all ${isExpanded ? 'min-h-[250px]' : ''} ${isScanning ? 'opacity-40 pointer-events-none grayscale' : ''}`}
        ></div>
        {!content && !isScanning && <div className="absolute top-8 left-8 pointer-events-none text-slate-400 text-[11px] font-mono flex items-center gap-2 uppercase tracking-widest opacity-50">
           <Terminal size={14} className="text-slate-400"/> Initialize signal contribution...
        </div>}

        {/* SCANNING OVERLAY */}
        {isScanning && (
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
             <div className="flex flex-col items-center gap-4 px-10 py-6 bg-white dark:bg-[#0d0d0d] border border-[var(--border-color)] rounded-[2px] shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="relative">
                  <ShieldCheck size={32} className="text-slate-400 animate-pulse" />
                  <Loader2 size={44} className="text-[var(--brand-color)] animate-spin absolute -top-1.5 -left-1.5 opacity-30" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 dark:text-slate-400">Neural_Scan_Active</span>
                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Verifying university protocol safety</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {showPollBuilder && (
        <div className="px-8 py-6 bg-slate-50 dark:bg-black/40 border-t border-[var(--border-color)] space-y-4 animate-in slide-in-from-top-2">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><BarChart3 size={12}/> Census Protocol</h3>
              <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-[9px] font-black uppercase text-indigo-600 flex items-center gap-1 hover:underline"><Plus size={12}/> Add Option</button>
           </div>
           <div className="space-y-2">
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    placeholder={`Census Logic Option ${i+1}`}
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] px-4 py-2.5 text-[11px] font-bold outline-none focus:border-indigo-600 transition-all"
                  />
                  {pollOptions.length > 2 && <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-rose-500"><X size={14}/></button>}
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between px-8 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20">
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isScanning ? 'Syncing with Strata...' : 'Protocol: Secure_Handshake'}</span>
        </div>
        <div className="flex items-center gap-6">
           {isExpanded && !isScanning && (
             <button onClick={() => setIsExpanded(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors tracking-widest">Abort_Signal</button>
           )}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>' || isScanning}
             className="px-10 py-3 bg-slate-700 hover:bg-slate-800 disabled:opacity-30 text-white rounded-[2px] text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 transition-all shadow-xl active:scale-95 shadow-slate-900/10"
           >
             {isScanning ? <Loader2 size={14} className="animate-spin" /> : <Send size={14}/>}
             {isScanning ? 'Verifying...' : 'Commit to Pulse'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
