import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, Code, FileText, ChevronDown, Trash2, Zap, 
  Search, Terminal, Database, Shield, Radio
} from 'lucide-react';

interface RichEditorProps {
  onPost: (content: string) => void;
  currentUser: any;
}

const RichEditor: React.FC<RichEditorProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'Standard' | 'Research' | 'Broadcast' | 'Draft'>('Standard');
  const [isExpanded, setIsExpanded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgHtml = `<div class="embedded-asset mt-4"><img src="${ev.target?.result}" class="max-w-full rounded border border-[#475569]/30 shadow-lg" /><p class="text-[8px] mt-1 text-slate-500 italic uppercase">Asset_Binary_Sync_Complete</p></div>`;
        if (editorRef.current) {
          editorRef.current.innerHTML += imgHtml;
          setContent(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() || content === '<br>') return;
    onPost(content);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setIsExpanded(false);
  };

  const modeColors = {
    Standard: 'border-slate-500 text-slate-500',
    Research: 'border-indigo-500 text-indigo-500',
    Broadcast: 'border-rose-500 text-rose-500',
    Draft: 'border-amber-500 text-amber-500'
  };

  return (
    <div className={`mb-6 pro-card overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-1 ring-slate-400 shadow-2xl' : 'shadow-sm'}`}>
      {/* Summernote Tactical Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-[#111]">
        <div className="flex items-center gap-1">
          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="Bold"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="Italic"><Italic size={14}/></button>
          <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="List"><List size={14}/></button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-2"></div>
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
          </label>
          <button onClick={() => execCommand('createLink', prompt('Target Node URL:') || '')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500"><LinkIcon size={14}/></button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className={`flex items-center gap-1.5 px-2 py-1 border rounded text-[8px] font-black uppercase tracking-widest ${modeColors[mode]}`}>
               {mode}_Logic <ChevronDown size={10}/>
            </button>
            <div className="absolute top-full right-0 mt-1 w-32 bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-2xl hidden group-hover:block z-[100]">
               {['Standard', 'Research', 'Broadcast', 'Draft'].map(m => (
                 <button key={m} onClick={() => setMode(m as any)} className="w-full px-3 py-2 text-left text-[9px] font-bold uppercase hover:bg-slate-100 dark:hover:bg-white/5">{m}</button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[120px] max-h-[500px] overflow-y-auto p-6 outline-none text-sm font-mono text-[var(--text-primary)] leading-relaxed ${isExpanded ? 'min-h-[220px]' : ''}`}
          style={{ backgroundImage: isExpanded ? 'radial-gradient(#475569 0.5px, transparent 0.5px)' : 'none', backgroundSize: '30px 30px', backgroundAlpha: 0.05 }}
        ></div>
        {!content && <div className="absolute top-6 left-6 pointer-events-none text-slate-400 text-xs italic font-mono">Initialize signal sequence... [Mode: {mode}]</div>}
      </div>

      {/* Terminal Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-[#080808]">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 opacity-60">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Uplink: Synchronized</span>
           </div>
           <span className="text-[8px] font-mono text-slate-400 opacity-40 hidden sm:inline">UTF-8_ENCODING_STABLE</span>
        </div>
        <div className="flex items-center gap-3">
           {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-[9px] font-black uppercase text-slate-400 hover:text-rose-500">Abort</button>}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>'}
             className="px-6 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-30 text-white rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 transition-all active:scale-95"
           >
             Commit <Send size={12}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;