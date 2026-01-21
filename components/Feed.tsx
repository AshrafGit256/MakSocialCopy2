
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
  FileText, ExternalLink, Type, Bold, Italic, Link as LinkIcon, List,
  Smile, MoreHorizontal
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  
  const config: Record<AuthorityRole, { 
    bg: string, 
    icon: React.ReactNode, 
    border: string,
    textColor: string
  }> = {
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
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('"Plus Jakarta Sans"');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
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
      setCalendarEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, user.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Categorize this student post and verify safety. Respond ONLY with JSON: {"category": "Academic"|"Social"|"Career", "isSafe": boolean}. Text: "${newPostContent}"`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{"isSafe": true, "category": "Social"}');
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, 
        authorId: user.id, 
        authorRole: user.role, 
        authorAvatar: user.avatar,
        timestamp: 'Just now', 
        content: newPostContent, 
        customFont: selectedFont,
        images: selectedImage ? [selectedImage] : undefined,
        hashtags: [], 
        likes: 0, 
        commentsCount: 0, 
        comments: [], 
        views: 1,
        flags: [], 
        isOpportunity: result.category === 'Career', 
        college: activeCollege || 'Global',
        aiMetadata: { category: result.category as any, isSafe: true }
      };
      db.addPost(newPost);
      setNewPostContent('');
      setSelectedImage(null);
      setIsAnalyzing(false);
    } catch (e) { setIsAnalyzing(false); }
  };

  const COLLEGES_LIST: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

  return (
    <div className="max-w-[1440px] mx-auto pb-32 lg:px-12 lg:py-8">
      {!collegeFilter && (
        <div className="sticky top-0 lg:top-[3.75rem] z-[75] bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3 px-4">
            <button onClick={() => setActiveTab('Global')} className={`px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}>Global Pulse</button>
            {COLLEGES_LIST.map(c => {
              const isLocked = !isSubscribed && c !== user.college;
              return (
                <button key={c} onClick={() => !isLocked && setActiveTab(c)} className={`flex items-center gap-2 px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === c ? 'bg-indigo-600 text-white border-transparent' : 'text-slate-500 bg-[var(--bg-secondary)] border-[var(--border-color)]'} ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  {c} {isLocked && <Lock size={12}/>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 mt-6">
         <div className="lg:col-span-8 space-y-6 p-4 lg:p-0">
            {/* GitHub Style Activity Composer (Summernote Inspired) */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-sm overflow-hidden">
               {/* Toolbar */}
               <div className="bg-slate-50 dark:bg-white/5 border-b border-[var(--border-color)] px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1">
                     <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"><Bold size={16}/></button>
                     <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"><Italic size={16}/></button>
                     <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"><LinkIcon size={16}/></button>
                     <div className="w-px h-6 bg-[var(--border-color)] mx-1" />
                     <div className="relative group">
                        <button className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                           <Type size={14}/> {fonts.find(f => f.value === selectedFont)?.name}
                        </button>
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[var(--border-color)] rounded shadow-xl z-[100] w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                           {fonts.map(f => (
                              <button 
                                key={f.value} 
                                onClick={() => setSelectedFont(f.value)}
                                className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase"
                                style={{ fontFamily: f.value }}
                              >
                                 {f.name}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"><ImageIcon size={18}/></button>
                     <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"><Smile size={18}/></button>
                  </div>
               </div>
               
               <div className="p-6">
                  <div className="flex gap-4">
                     <img src={user.avatar} className="w-10 h-10 rounded-md border border-[var(--border-color)] bg-white shrink-0" />
                     <div className="flex-1 space-y-4">
                       <textarea 
                        value={newPostContent} 
                        onChange={e => setNewPostContent(e.target.value)} 
                        className="w-full bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none min-h-[100px] placeholder:text-slate-400 text-[var(--text-primary)]" 
                        style={{ fontFamily: selectedFont }}
                        placeholder={`Broadcast intelligence to ${activeCollege || 'the Hill'}...`} 
                       />
                       {selectedImage && (
                         <div className="relative w-full max-h-64 rounded-md overflow-hidden group border border-[var(--border-color)]">
                           <img src={selectedImage} className="w-full h-full object-cover" />
                           <button onClick={() => setSelectedImage(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={24}/></button>
                         </div>
                       )}
                     </div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border-color)]">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Marked as: {activeCollege || 'Global Protocol'}</p>
                    <button onClick={handleCreatePost} disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95">
                       {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14}/>} Broadcast
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageSelect} accept="image/*" />
                  </div>
               </div>
            </div>

            {/* High-Density GitHub-Style Feed */}
            <div className="space-y-4">
               {posts.map(post => {
                 const isLongForm = post.content.length > 250;
                 return (
                  <article key={post.id} className="group relative">
                     {/* GitHub Activity Line */}
                     <div className="absolute left-[1.2rem] top-10 bottom-0 w-px bg-[var(--border-color)] group-last:hidden"></div>
                     
                     <div className="flex gap-3">
                        <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-white object-cover shrink-0 z-10" />
                        <div className="flex-1 min-w-0 space-y-2">
                           {/* GitHub Style Header: User / College */}
                           <div className="flex items-center justify-between text-[11px] font-black tracking-tighter uppercase">
                              <div className="flex items-center gap-1.5">
                                 <span className="text-[var(--text-primary)] hover:underline cursor-pointer">{post.author}</span>
                                 <span className="text-slate-400 font-bold">/</span>
                                 <span className="text-slate-500">{post.college} Hub</span>
                                 <AuthoritySeal role={post.authorAuthority} size="sm" />
                              </div>
                              <span className="text-slate-400 font-mono text-[9px] lowercase tracking-normal">{post.timestamp}</span>
                           </div>

                           {/* Content Box (GitHub Card) */}
                           <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-sm overflow-hidden transition-all hover:border-indigo-500/30">
                              <div className="p-5 lg:p-6 space-y-4">
                                 <p className={`text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap ${isLongForm ? 'text-[16px] italic border-l-2 border-indigo-600/20 pl-4' : 'text-[14px] font-medium'}`} style={{ fontFamily: post.customFont }}>
                                   {post.content}
                                 </p>
                                 
                                 {post.images?.[0] && (
                                   <div className="rounded-sm overflow-hidden border border-[var(--border-color)]">
                                      <img src={post.images[0]} className="w-full object-cover max-h-[450px]" alt="Protocol asset" />
                                   </div>
                                 )}
                              </div>

                              {/* GitHub Style Footer Actions */}
                              <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-white/5 border-t border-[var(--border-color)] flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                                       <Heart size={14} /><span className="text-[10px] font-bold font-mono">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                                       <MessageCircle size={14} /><span className="text-[10px] font-bold font-mono">{post.commentsCount}</span>
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
                                       <Eye size={12}/> {post.views} log scans
                                    </div>
                                    <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={14}/></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </article>
                 );
               })}
            </div>
         </div>

         <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-20 h-fit">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md p-6 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                 <TrendingUp size={16} className="text-indigo-600"/> Trending Intelligence
               </h3>
               <div className="space-y-4">
                  {['#ResearchProtocol', '#GuildInauguration', '#BlockchainMakerere'].map(tag => (
                    <div key={tag} className="group cursor-pointer">
                       <p className="text-sm font-black text-indigo-600 group-hover:underline">{tag}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">12.4k synchronization events</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-600 rounded-md p-6 shadow-lg shadow-indigo-600/20 text-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Network Status</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                     <span>Node Stratum</span>
                     <span className="text-indigo-200">{user.subscriptionTier}</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full">
                     <div className="h-full bg-white shadow-[0_0_10px_white]" style={{width: '75%'}}></div>
                  </div>
                  <button className="w-full py-3 bg-white text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Elevate Identity</button>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;
