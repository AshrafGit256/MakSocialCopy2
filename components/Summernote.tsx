import React, { useState, useRef } from 'react';
import { Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, Send, Code, Terminal, FileText, ChevronDown, X } from 'lucide-react';

interface RichEditorProps {
  onPost: (content: string) => void;
  currentUser: any;
}

const RichEditor: React.FC<RichEditorProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'Standard' | 'Academic' | 'Alert'>('Standard');
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
        const img = `<img src="${ev.target?.result}" class="max-w-full rounded-md my-4 border border-[var(--border-color)]" />`;
        if (editorRef.current) {
          editorRef.current.innerHTML += img;
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

  return (
    <div className={`mb-8 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-2xl' : 'shadow-sm'}`}>
      {/* Editor Toolbar (Summernote Style) */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-black/20">
        <div className="flex items-center gap-3">
          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500" title="Bold"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500" title="Italic"><Italic size={14}/></button>
          <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500" title="List"><List size={14}/></button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-1"></div>
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500 cursor-pointer" title="Insert Image">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
          </label>
          <button onClick={() => execCommand('createLink', prompt('URL:') || '')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-500" title="Link"><LinkIcon size={14}/></button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-white/5 border border-[var(--border-color)] rounded text-[9px] font-black uppercase tracking-widest text-slate-500">
               {mode}_Mode <ChevronDown size={10}/>
            </button>
            <div className="absolute top-full right-0 mt-1 w-32 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded shadow-xl hidden group-hover:block z-50 overflow-hidden">
               {['Standard', 'Academic', 'Alert'].map(m => (
                 <button key={m} onClick={() => setMode(m as any)} className="w-full px-4 py-2 text-left text-[9px] font-bold uppercase hover:bg-indigo-600 hover:text-white">{m}</button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[100px] max-h-[400px] overflow-y-auto p-5 outline-none text-sm font-mono text-[var(--text-primary)] leading-relaxed ${isExpanded ? 'min-h-[180px]' : ''}`}
          data-placeholder="Initialize signal sequence..."
        ></div>
        {!content && <div className="absolute top-5 left-5 pointer-events-none text-slate-400 text-sm font-mono italic">Start typing signal content...</div>}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <img src={currentUser.avatar} className="w-5 h-5 rounded-sm grayscale" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentUser.name}</span>
           </div>
           <span className="text-[8px] font-mono text-slate-400 opacity-50">UTF-8_UPLINK</span>
        </div>
        <div className="flex items-center gap-4">
           {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-[9px] font-black uppercase text-slate-400 hover:text-rose-500">Cancel</button>}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>'}
             className="px-6 py-2 bg-slate-600 hover:bg-slate-700 disabled:opacity-30 text-white rounded text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 transition-all"
           >
             Commit <Send size={12}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;