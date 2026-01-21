
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, CalendarEvent } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, X, 
  Loader2, Eye, ShieldAlert, Zap, 
  GraduationCap, CheckCircle2, Calendar, 
  MapPin, Clock, TrendingUp, Plus, ShieldCheck, Trash2, Edit3, 
  Star, Verified, Share2, Shield as ShieldIcon, Users, Lock, ChevronRight, Hash,
  FileText, ExternalLink, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Heading3, Quote, Table, Link as LinkIcon,
  Palette, Type, Highlighter, Smile, MoreHorizontal
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  const config: Record<AuthorityRole, { bg: string, icon: React.ReactNode, border: string, textColor: string }> = {
    'Super Admin': { bg: 'bg-rose-600', border: 'border-rose-400/50', textColor: 'text-white', icon: <ShieldAlert size={size === 'sm' ? 10 : 12} /> },
    'Administrator': { bg: 'bg-indigo-600', border: 'border-indigo-400/50', textColor: 'text-white', icon: <ShieldCheck size={size === 'sm' ? 10 : 12} /> },
    'Lecturer': { bg: 'bg-slate-800', border: 'border-slate-400/50', textColor: 'text-white', icon: <GraduationCap size={size === 'sm' ? 10 : 12} /> },
    'Chairperson': { bg: 'bg-emerald-600', border: 'border-emerald-400/50', textColor: 'text-white', icon: <CheckCircle2 size={size === 'sm' ? 10 : 12} /> },
    'GRC': { bg: 'bg-sky-500', border: 'border-sky-400/50', textColor: 'text-white', icon: <Star size={size === 'sm' ? 10 : 12} fill="currentColor" /> },
    'Student Leader': { bg: 'bg-amber-500', border: 'border-amber-400/50', textColor: 'text-white', icon: <Verified size={size === 'sm' ? 10 : 12} /> },
    'Graduate': { bg: 'bg-slate-500', border: 'border-slate-400/50', textColor: 'text-white', icon: <GraduationCap size={size === 'sm' ? 10 : 12} /> },
    'Alumni': { bg: 'bg-slate-400', border: 'border-slate-300/50', textColor: 'text-white', icon: <Users size={size === 'sm' ? 10 : 12} /> },
    'Staff': { bg: 'bg-slate-600', border: 'border-slate-500/50', textColor: 'text-white', icon: <ShieldCheck size={size === 'sm' ? 10 : 12} /> }
  };
  const current = config[role] || config['Administrator'];
  const sizeClasses = size === 'sm' ? 'h-4 px-1.5' : 'h-5 px-2';
  return (
    <div className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${current.bg} ${current.textColor} border ${current.border} shadow-sm ml-1 select-none`}>
       {current.icon}
       <span className="text-[7px] font-black uppercase tracking-widest">{role}</span>
    </div>
  );
};

const Feed: React.FC<{ collegeFilter?: College, targetPostId?: string | null, onClearTarget?: () => void }> = ({ collegeFilter, targetPostId, onClearTarget }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('"Plus Jakarta Sans"');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  const isSubscribed = user.subscriptionTier !== 'Free';

  const fonts = [
    { name: 'Default', value: '"Plus Jakarta Sans"' },
    { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
    { name: 'Monospace', value: '"JetBrains Mono", monospace' },
    { name: 'Serif', value: '"Playfair Display", serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Montserrat', value: '"Montserrat", sans-serif' }
  ];

  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts(activeCollege || undefined));
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, user.id]);

  const exec = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleTableInsert = () => {
    const rows = prompt("Enter number of rows:", "2");
    const cols = prompt("Enter number of columns:", "2");
    if (rows && cols) {
      let tableHtml = `<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid var(--border-color);">`;
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += `<td style="border: 1px solid var(--border-color); padding: 8px;">Cell</td>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table>";
      exec('insertHTML', tableHtml);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter Protocol URL (e.g., https://mak.ac.ug):", "https://");
    if (url) {
      exec('createLink', url);
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify safety and category for this rich-text post. Respond ONLY with JSON: {"category": "Academic"|"Social"|"Career", "isSafe": boolean}. Content: "${content.replace(/<[^>]*>?/gm, '')}"`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": true, "category": "Social"}');
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, authorId: user.id, authorRole: user.role, authorAvatar: user.avatar,
        authorAuthority: (user as any).badges?.includes('Super Admin') ? 'Super Admin' : (user as any).role === 'Lecturer' ? 'Lecturer' : 'Administrator',
        timestamp: 'Just now', content: content, customFont: selectedFont,
        images: selectedImage ? [selectedImage] : undefined,
        hashtags: [], likes: 0, commentsCount: 0, comments: [], views: 1, flags: [], 
        isOpportunity: result.category === 'Career', college: activeCollege || 'Global',
        aiMetadata: { category: result.category as any, isSafe: true }
      };
      db.addPost(newPost);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setSelectedImage(null);
      setIsAnalyzing(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8">
      {!collegeFilter && (
        <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 px-4">
            <button onClick={() => setActiveTab('Global')} className={`px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>Global Hub</button>
            {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
              <button key={c} onClick={() => setActiveTab(c as College)} className={`flex items-center gap-2 px-5 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === c ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
         <div className="lg:col-span-8 space-y-6 px-4 lg:px-0">
            {/* RICH TEXT CREATIVE COMPOSER (AdminLTE Style) */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] shadow-sm overflow-hidden transition-all">
               {/* Advanced Toolbar */}
               <div className="bg-slate-50 dark:bg-white/5 border-b border-[var(--border-color)] px-4 py-2 flex flex-wrap items-center gap-1">
                  <div className="flex border-r border-[var(--border-color)] pr-2 mr-2 gap-0.5">
                    <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Bold"><Bold size={15}/></button>
                    <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Italic"><Italic size={15}/></button>
                    <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Underline"><Underline size={15}/></button>
                  </div>
                  <div className="flex border-r border-[var(--border-color)] pr-2 mr-2 gap-0.5">
                    <button onClick={() => exec('formatBlock', 'h1')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="H1"><Heading1 size={15}/></button>
                    <button onClick={() => exec('formatBlock', 'h2')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="H2"><Heading2 size={15}/></button>
                    <button onClick={() => exec('formatBlock', 'blockquote')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Quote"><Quote size={15}/></button>
                  </div>
                  <div className="flex border-r border-[var(--border-color)] pr-2 mr-2 gap-0.5">
                    <button onClick={() => exec('justifyLeft')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Left"><AlignLeft size={15}/></button>
                    <button onClick={() => exec('justifyCenter')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Center"><AlignCenter size={15}/></button>
                    <button onClick={() => exec('justifyRight')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Right"><AlignRight size={15}/></button>
                  </div>
                  <div className="flex border-r border-[var(--border-color)] pr-2 mr-2 gap-0.5">
                    <button onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="List"><List size={15}/></button>
                    <button onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Ordered"><ListOrdered size={15}/></button>
                  </div>
                  <div className="flex border-r border-[var(--border-color)] pr-2 mr-2 gap-0.5">
                    <button onClick={handleLinkInsert} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Link"><LinkIcon size={15}/></button>
                    <button onClick={handleTableInsert} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded" title="Table"><Table size={15}/></button>
                    <button onClick={() => exec('backColor', '#fef08a')} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-amber-500" title="Highlight"><Highlighter size={15}/></button>
                  </div>
                  <div className="relative group">
                    <button className="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <Type size={14}/> {fonts.find(f => f.value === selectedFont)?.name}
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[var(--border-color)] rounded shadow-xl z-[100] w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                      {fonts.map(f => (
                        <button key={f.value} onClick={() => setSelectedFont(f.value)} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase" style={{ fontFamily: f.value }}>{f.name}</button>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="p-6">
                  <div className="flex gap-4">
                     <img src={user.avatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white shrink-0" />
                     <div className="flex-1 space-y-4">
                       <div 
                         ref={editorRef}
                         contentEditable
                         className="w-full bg-transparent border-none focus:outline-none text-[14px] font-medium min-h-[150px] text-[var(--text-primary)] leading-relaxed"
                         style={{ fontFamily: selectedFont }}
                         data-placeholder={`What's on your mind at ${activeCollege || 'Makerere'}?`}
                       />
                       {selectedImage && (
                         <div className="relative rounded-[6px] overflow-hidden group border border-[var(--border-color)]">
                           <img src={selectedImage} className="w-full object-cover max-h-64" />
                           <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"><X size={24}/></button>
                         </div>
                       )}
                     </div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border-color)]">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest"><ImageIcon size={18}/> Image Asset</button>
                    <button onClick={handleCreatePost} disabled={isAnalyzing} className="bg-indigo-600 text-white px-10 py-3 rounded-[6px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95">
                       {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>} Broadcast Protocol
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSelectedImage(reader.result as string);
                          reader.readAsDataURL(file);
                       }
                    }} accept="image/*" />
                  </div>
               </div>
            </div>

            {/* GITHUB STYLE FEED */}
            <div className="space-y-4">
               {posts.map(post => (
                  <article key={post.id} className="group relative">
                     {/* The Activity Pulse Line */}
                     <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
                     
                     <div className="flex gap-3">
                        <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10" />
                        <div className="flex-1 min-w-0 space-y-2">
                           <div className="flex items-center justify-between text-[11px] font-black tracking-tighter uppercase">
                              <div className="flex items-center gap-1.5">
                                 <span className="text-[var(--text-primary)] hover:underline cursor-pointer">{post.author}</span>
                                 <span className="text-slate-500 font-bold">/</span>
                                 <span className="text-slate-500">{post.college}</span>
                                 <AuthoritySeal role={post.authorAuthority} size="sm" />
                              </div>
                              <span className="text-slate-500 font-mono text-[9px] lowercase tracking-normal">{post.timestamp}</span>
                           </div>

                           <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] shadow-sm overflow-hidden transition-all hover:border-indigo-500/30">
                              <div className="p-5 lg:p-6 space-y-4" style={{ fontFamily: post.customFont }}>
                                 <div dangerouslySetInnerHTML={{ __html: post.content }} className="rich-content text-[14px] leading-relaxed" />
                                 {post.images?.[0] && (
                                   <div className="rounded-[4px] overflow-hidden border border-[var(--border-color)]">
                                     <img src={post.images[0]} className="w-full object-cover max-h-[500px]" alt="Asset" />
                                   </div>
                                 )}
                              </div>

                              <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors"><Heart size={14} /><span className="text-[10px] font-bold font-mono">{post.likes}</span></button>
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={14} /><span className="text-[10px] font-bold font-mono">{post.commentsCount}</span></button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                                       <Eye size={12}/> {post.views} logs
                                    </div>
                                    <button className="text-slate-500 hover:text-indigo-600"><MoreHorizontal size={14}/></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </article>
               ))}
            </div>
         </div>

         <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20 h-fit">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[6px] p-6 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-600"/> Trending Intelligence</h3>
               <div className="space-y-5">
                  {[
                    { tag: '#ResearchWeek', label: '12.4k interactions' },
                    { tag: '#Guild89', label: '8.2k interactions' },
                    { tag: '#COCISHack', label: '5.1k interactions' },
                    { tag: '#FreedomSquare', label: '3.9k interactions' }
                  ].map(item => (
                    <div key={item.tag} className="group cursor-pointer">
                       <p className="text-sm font-black text-indigo-600 group-hover:underline">{item.tag}</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[6px] p-6 shadow-lg shadow-indigo-600/20 text-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Node Stratum</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                     <span>Subscription</span>
                     <span className="text-indigo-200">{user.subscriptionTier}</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full">
                     <div className="h-full bg-white" style={{width: '65%'}}></div>
                  </div>
                  <button className="w-full py-3 bg-white text-indigo-600 rounded-[6px] text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Elevate Identity</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
