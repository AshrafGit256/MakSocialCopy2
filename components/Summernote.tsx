
import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, ChevronDown, BarChart3, Plus, X, Terminal, AlignLeft, 
  AlignCenter, AlignRight, Heading, Type, Table as TableIcon,
  Code, Video as VideoIcon, Loader2, ShieldCheck
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

  const insert5x5Table = () => {
    let tableHtml = '<table class="w-full border-collapse border border-slate-700 my-4 text-[10px] uppercase font-mono"><tr><td class="border border-slate-700 p-2">...</td><td class="border border-slate-700 p-2">...</td></tr></table><p><br></p>';
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
          const imgHtml = `<img src="${ev.target?.result as string}" class="max-w-full rounded border border-slate-700 my-4 shadow-sm" />`;
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
    
    // Clear editor only if it wasn't a violation handled by parent (handled via state usually, but simplified for UX)
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setIsExpanded(false);
    setIsScanning(false);
  };

  return (
    <div className={`mb-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-xl' : 'shadow-sm'}`}>
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-[#0d1117]">
        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded"><Italic size={14}/></button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <button onClick={insertLink} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded"><LinkIcon size={14}/></button>
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded cursor-pointer">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImage} />
          </label>
          <button onClick={() => setShowPollBuilder(!showPollBuilder)} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded ${showPollBuilder ? 'text-slate-700 bg-slate-500/5' : 'text-slate-500'}`}><BarChart3 size={14}/></button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!isScanning}
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[120px] max-h-[600px] overflow-y-auto p-6 outline-none text-[13px] font-mono text-[var(--text-primary)] leading-relaxed post-editor-surface ${isExpanded ? 'min-h-[200px]' : ''} ${isScanning ? 'opacity-50 pointer-events-none' : ''}`}
        ></div>
        {!content && !isScanning && <div className="absolute top-6 left-6 pointer-events-none text-slate-400 text-[11px] font-mono flex items-center gap-2">
           <Terminal size={12}/> Initializing contribution buffer...
        </div>}

        {isScanning && (
          <div className="absolute inset-0 bg-[var(--bg-primary)]/40 backdrop-blur-[2px] flex items-center justify-center">
             <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-black border border-[var(--border-color)] rounded-[4px] shadow-2xl animate-in fade-in zoom-in-95">
                <Loader2 size={16} className="text-slate-600 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Scanning Signal Integrity...</span>
             </div>
          </div>
        )}
      </div>

      {showPollBuilder && (
        <div className="px-6 py-5 bg-slate-50 dark:bg-black/40 border-t border-[var(--border-color)]">
           <div className="space-y-2">
              {pollOptions.map((opt, i) => (
                <input 
                  key={i} value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Census Option ${i+1}`}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] px-3 py-2 text-[10px] font-bold outline-none"
                />
              ))}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{isScanning ? 'Uplink Processing' : 'Protocol Secure'}</span>
        </div>
        <div className="flex items-center gap-4">
           {isExpanded && !isScanning && <button onClick={() => setIsExpanded(false)} className="text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 transition-colors">Abort</button>}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>' || isScanning}
             className="px-6 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-30 text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all shadow-lg active:scale-95"
           >
             {isScanning ? <Loader2 size={12} className="animate-spin" /> : <Send size={12}/>}
             {isScanning ? 'Verifying' : 'Commit to Stream'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
