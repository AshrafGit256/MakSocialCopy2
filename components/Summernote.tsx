
import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, ChevronDown, BarChart3, Plus, X, Terminal, AlignLeft, 
  AlignCenter, AlignRight, Heading, Type, Table as TableIcon,
  Code, Video as VideoIcon
} from 'lucide-react';
import { PollData } from '../types';

interface RichEditorProps {
  onPost: (content: string, poll?: PollData) => void;
  currentUser: any;
}

const RichEditor: React.FC<RichEditorProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
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
    const label = prompt("Signal Label (e.g. Research Proposal):", "Reference Signal");
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
    let tableHtml = '<table class="w-full border-collapse border border-slate-700 my-4 text-[10px] uppercase font-mono">';
    for (let i = 0; i < 5; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < 5; j++) {
        tableHtml += `<td class="border border-slate-700 p-2 text-center text-slate-500 font-bold">${i===0 && j===0 ? 'ID' : '...'}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table><p><br></p>';
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, tableHtml);
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files
    // Explicitly cast Array.from(files) to File[] to avoid unknown type error on iteration
    for (const file of Array.from(files) as File[]) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          // Cast ev.target.result to string to satisfy template literal expectations
          const imgHtml = `<img src="${ev.target?.result as string}" class="max-w-full rounded border border-slate-700 my-4 shadow-sm" />`;
          if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, imgHtml);
            setContent(editorRef.current.innerHTML);
          }
          resolve();
        };
        // Explicitly ensuring file is treated as a Blob/File
        reader.readAsDataURL(file);
      });
    }
    // Reset file input value to allow selecting same images again if needed
    e.target.value = '';
  };

  const handleSubmit = () => {
    const rawContent = editorRef.current?.innerHTML || '';
    if (!rawContent.trim() || rawContent === '<br>') return;
    
    let pollData: PollData | undefined;
    if (showPollBuilder && pollOptions.every(o => o.trim() !== '')) {
      pollData = {
        totalVotes: 0,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        options: pollOptions.map((opt, i) => ({
          id: `opt-${i}`,
          text: opt,
          votes: 0,
          voterIds: []
        }))
      };
    }

    onPost(rawContent, pollData);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setIsExpanded(false);
  };

  return (
    <div className={`mb-12 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-xl ring-1 ring-slate-500/20' : 'shadow-sm'}`}>
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-[#0d1117] gap-y-2">
        <div className="flex items-center gap-1 flex-wrap">
          <select 
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="h-7 bg-transparent border border-slate-300 dark:border-slate-700 rounded text-[9px] font-black uppercase px-1 text-slate-500 outline-none hover:border-slate-500 transition-colors"
          >
            <option value="p">Paragraph</option>
            <option value="h1">H1 Manifest</option>
            <option value="h2">H2 Sector</option>
            <option value="h3">H3 Node</option>
          </select>

          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Bold"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Italic"><Italic size={14}/></button>
          
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          
          <button onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Align Left"><AlignLeft size={14}/></button>
          <button onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Align Center"><AlignCenter size={14}/></button>
          
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

          <button onClick={insertLink} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Add Link"><LinkIcon size={14}/></button>
          <button onClick={insert5x5Table} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded" title="Insert Table"><TableIcon size={14}/></button>
          
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 rounded cursor-pointer" title="Attach Multiple Images">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImage} />
          </label>
          <button onClick={() => setShowPollBuilder(!showPollBuilder)} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors ${showPollBuilder ? 'text-slate-700 bg-slate-500/5' : 'text-slate-500'}`} title="Census Build"><BarChart3 size={14}/></button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[120px] max-h-[600px] overflow-y-auto p-6 outline-none text-[13px] font-mono text-[var(--text-primary)] leading-relaxed post-editor-surface ${isExpanded ? 'min-h-[260px]' : ''}`}
        ></div>
        {!content && <div className="absolute top-6 left-6 pointer-events-none text-slate-400 text-[11px] font-mono flex items-center gap-2">
           <Terminal size={12}/> Initializing contribution buffer...
        </div>}
      </div>

      {showPollBuilder && (
        <div className="px-6 py-5 bg-slate-50 dark:bg-black/40 border-t border-[var(--border-color)] animate-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2"><BarChart3 size={14}/> Census_Config</span>
              <button onClick={() => setShowPollBuilder(false)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
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
                     placeholder={`Censurable Option ${i+1}`}
                     className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] px-3 py-2 text-[10px] font-bold outline-none focus:border-slate-600"
                   />
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-[9px] font-black uppercase text-slate-600 hover:underline flex items-center gap-1.5"><Plus size={12}/> Add Option</button>
              )}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol_Secure</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-10px font-black uppercase text-slate-500 hover:text-rose-500 transition-colors">Abort</button>}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>'}
             className="px-6 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-30 text-white rounded-[4px] text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 transition-all shadow-lg active:scale-95"
           >
             Commit to Stream <Send size={12}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
