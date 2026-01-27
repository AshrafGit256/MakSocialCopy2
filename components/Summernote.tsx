import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, 
  Send, Code, FileText, ChevronDown, Trash2, Zap, 
  Search, Terminal, Database, Shield, Radio, BarChart3, Plus, X
} from 'lucide-react';
import { PollData, PollOption } from '../types';

interface RichEditorProps {
  onPost: (content: string, poll?: PollData) => void;
  currentUser: any;
}

const RichEditor: React.FC<RichEditorProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'Standard' | 'Research' | 'Broadcast' | 'Draft'>('Standard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
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
        const imgHtml = `<div class="mt-4"><img src="${ev.target?.result}" class="max-w-full rounded border border-slate-700 shadow-xl" /><p class="text-[8px] mt-1 text-slate-500 uppercase">Binary_Sync_Complete</p></div>`;
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

    onPost(content, pollData);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setContent('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setIsExpanded(false);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  };

  return (
    <div className={`mb-8 pro-card overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-slate-500 shadow-2xl' : 'shadow-sm'}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-slate-50 dark:bg-[#111]">
        <div className="flex items-center gap-1">
          <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="Bold"><Bold size={14}/></button>
          <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="Italic"><Italic size={14}/></button>
          <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500" title="List"><List size={14}/></button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-2"></div>
          <label className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer" title="Image Uplink">
            <ImageIcon size={14}/>
            <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
          </label>
          <button onClick={() => setShowPollBuilder(!showPollBuilder)} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${showPollBuilder ? 'text-indigo-500' : 'text-slate-500'}`} title="Poll Component"><BarChart3 size={14}/></button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-1.5 px-2 py-1 border border-slate-700 rounded text-[8px] font-black uppercase tracking-widest text-slate-400`}>
             {mode}_LOGIC <ChevronDown size={10}/>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onFocus={() => setIsExpanded(true)}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className={`w-full min-h-[100px] max-h-[500px] overflow-y-auto p-6 outline-none text-sm font-mono text-[var(--text-primary)] leading-relaxed ${isExpanded ? 'min-h-[180px]' : ''}`}
        ></div>
        {!content && <div className="absolute top-6 left-6 pointer-events-none text-slate-500 text-xs italic font-mono">Initialize signal sequence...</div>}
      </div>

      {/* Poll Builder Overlay */}
      {showPollBuilder && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-black/40 border-t border-[var(--border-color)] animate-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><BarChart3 size={12}/> Poll_Configuration</span>
              <button onClick={() => setShowPollBuilder(false)} className="text-slate-500 hover:text-rose-500"><X size={14}/></button>
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
                     placeholder={`Node Option ${i+1}`}
                     className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded px-3 py-1.5 text-[10px] font-bold outline-none focus:border-indigo-500"
                   />
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="text-[8px] font-black uppercase text-indigo-500 hover:underline flex items-center gap-1"><Plus size={10}/> Add Stratum</button>
              )}
           </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-black/20">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Uplink: Active</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
           {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-[9px] font-black uppercase text-slate-500 hover:text-rose-500">Abort</button>}
           <button 
             onClick={handleSubmit}
             disabled={!content.trim() || content === '<br>'}
             className="px-6 py-2 bg-[#475569] hover:bg-slate-700 disabled:opacity-30 text-white rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 transition-all active:scale-95"
           >
             Commit Signal <Send size={12}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;