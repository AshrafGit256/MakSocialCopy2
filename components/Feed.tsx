
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, CollegeStats, LeadershipMember, AuthorityRole } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { COLLEGE_BANNERS } from '../constants';
import { 
  Image as ImageIcon, Heart, MessageCircle, Sparkles, AlertCircle, X, 
  Users, Loader2, Eye, MoreHorizontal, ShieldAlert, Zap, 
  GraduationCap, Briefcase, Tv, CheckCircle2, Calendar, 
  MapPin, Clock, TrendingUp, Plus, FileText, Lock,
  ShieldCheck, Trash2, Edit3, UserPlus, ShieldAlert as Shield,
  Star, Verified, Shield as ShieldIcon
} from 'lucide-react';

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: 'sm' | 'md' }> = ({ role, size = 'sm' }) => {
  if (!role) return null;
  
  const config: Record<AuthorityRole, { 
    bg: string, 
    icon: React.ReactNode, 
    glow: string,
    border: string
  }> = {
    'Super Admin': { 
      bg: 'bg-rose-600', 
      glow: 'shadow-rose-500/40',
      border: 'border-rose-400/50',
      icon: <ShieldAlert size={size === 'sm' ? 10 : 14} /> 
    },
    'Administrator': { 
      bg: 'bg-indigo-600', 
      glow: 'shadow-indigo-500/40',
      border: 'border-indigo-400/50',
      icon: <ShieldCheck size={size === 'sm' ? 10 : 14} /> 
    },
    'Lecturer': { 
      bg: 'bg-slate-900', 
      glow: 'shadow-slate-500/40',
      border: 'border-slate-400/50',
      icon: <GraduationCap size={size === 'sm' ? 10 : 14} /> 
    },
    'Chairperson': { 
      bg: 'bg-emerald-600', 
      glow: 'shadow-emerald-500/40',
      border: 'border-emerald-400/50',
      icon: <CheckCircle2 size={size === 'sm' ? 10 : 14} /> 
    },
    'GRC': { 
      bg: 'bg-sky-500', 
      glow: 'shadow-sky-500/40',
      border: 'border-sky-400/50',
      icon: <Star size={size === 'sm' ? 10 : 14} fill="currentColor" /> 
    },
    'Student Leader': { 
      bg: 'bg-amber-500', 
      glow: 'shadow-amber-500/40',
      border: 'border-amber-400/50',
      icon: <Verified size={size === 'sm' ? 10 : 14} /> 
    }
  };
  
  const current = config[role] || config['Administrator'];
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  
  return (
    <div className={`
      relative ${sizeClasses} rounded-full flex items-center justify-center text-white 
      ${current.bg} ${current.glow} ${current.border} border shadow-lg
      transition-transform hover:scale-110 cursor-help
    `} title={`Verified ${role}`}>
       {current.icon}
       <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-white"></div>
    </div>
  );
};

const Feed: React.FC<{ collegeFilter?: College, targetPostId?: string | null, onClearTarget?: () => void }> = ({ collegeFilter, targetPostId, onClearTarget }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  const [collegeStats, setCollegeStats] = useState<CollegeStats[]>(db.getCollegeStats());
  const [activeTab, setActiveTab] = useState<College | 'Global'>(collegeFilter || 'Global');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identity logic
  const isSuperAdmin = user.email?.toLowerCase().endsWith('@admin.mak.ac.ug');
  const userCollegeAdminMatch = user.email?.toLowerCase().match(/^admin\.([a-z]+)@mak\.ac\.ug$/);
  const userCollegeAdminId = userCollegeAdminMatch ? userCollegeAdminMatch[1].toUpperCase() as College : null;
  const isCollegeAdmin = !!userCollegeAdminId;

  const activeCollege = collegeFilter || (activeTab === 'Global' ? null : activeTab as College);
  
  useEffect(() => {
    if (isCollegeAdmin && activeTab === 'Global' && !collegeFilter) {
      setActiveTab(userCollegeAdminId as College);
    }
  }, [isCollegeAdmin, userCollegeAdminId, activeTab, collegeFilter]);

  const currentStats = activeCollege ? collegeStats.find(s => s.id === activeCollege) : null;
  const hasJoined = activeCollege ? (user.joinedColleges || []).includes(activeCollege) : true;
  const isAdminOfActiveCollege = isCollegeAdmin && activeCollege === userCollegeAdminId;

  useEffect(() => {
    const sync = () => {
      setUser(db.getUser());
      setPosts(db.getPosts(activeCollege || undefined));
      setCollegeStats(db.getCollegeStats());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [activeTab, activeCollege, collegeFilter, user.id]);

  const handleJoin = (col: College) => {
    db.joinCollege(user.id, col);
    setUser(db.getUser());
    setCollegeStats(db.getCollegeStats());
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    setRejectionMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      
      // Strict Moderation Prompt
      let moderationPrompt = `You are the strict automated content moderator for MakSocial, the official social network of Makerere University. 
      Analyze the provided content (text and/or image) for safety violations.
      
      CRITICAL RULES:
      1. Zero tolerance for NUDITY or sexually explicit content in images.
      2. No hate speech, harassment, or violent imagery.
      3. Content must be relevant to university life (Academic, Social, Career, Urgent).
      
      Respond ONLY with a JSON object in this format:
      {
        "category": "Academic" | "Social" | "Finance" | "Career" | "Urgent",
        "isSafe": boolean,
        "reason": "Clear explanation if unsafe, otherwise empty"
      }`;

      if (newPostContent.trim()) {
        parts.push({ text: `Text Content: "${newPostContent}"\n\n${moderationPrompt}` });
      } else {
        parts.push({ text: moderationPrompt });
      }

      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        const mimeType = selectedImage.split(';')[0].split(':')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: { 
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{"isSafe": false, "reason": "Moderation error"}');

      if (!result.isSafe) {
        setRejectionMessage(result.reason || "Content violates community standards (Nudity/Safety).");
        setIsAnalyzing(false);
        return;
      }
      
      const newPost: Post = {
        id: Date.now().toString(), 
        author: user.name, 
        authorId: user.id, 
        authorRole: user.role, 
        authorAvatar: user.avatar,
        authorAuthority: isSuperAdmin ? 'Super Admin' : (isAdminOfActiveCollege ? 'Administrator' : undefined),
        timestamp: 'Just now', 
        content: newPostContent, 
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
      setPosts(db.getPosts(activeCollege || undefined));
      setIsAnalyzing(false);

    } catch (e) { 
      console.error("Moderation Failure:", e);
      setIsAnalyzing(false); 
      setRejectionMessage("Security Protocol Offline: Content cannot be validated at this time. Please check your network or try again later.");
    }
  };

  const handleDelete = (pid: string) => {
    if (confirm("Execute Veto: Remove this content from the node?")) {
      db.deletePost(pid, user.id);
      setPosts(db.getPosts(activeCollege || undefined));
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-32">
      {!collegeFilter && !isCollegeAdmin && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
          {['Global', 'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map((c: any) => (
            <button key={c} onClick={() => setActiveTab(c)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {activeCollege && (
        <div className="relative rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] bg-[var(--sidebar-bg)] mb-10 shadow-xl group">
           <div className="h-64 sm:h-80 relative overflow-hidden">
              <img src={activeCollege ? COLLEGE_BANNERS[activeCollege] : ""} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
           </div>
           <div className="p-8 -mt-24 relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] border-8 border-[var(--sidebar-bg)] flex items-center justify-center font-black text-4xl text-indigo-600 shadow-2xl transition-theme">
                       {activeCollege[0]}
                    </div>
                    <div className="pt-8">
                       <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{activeCollege}</h1>
                       <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Dean: {currentStats?.dean || "Awaiting Update"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="flex gap-6 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 mr-4">
                       <div className="text-center"><p className="text-xl font-black text-white">{currentStats?.followers?.toLocaleString() || 0}</p><p className="text-[7px] font-black text-white/40 uppercase">Nodes</p></div>
                       <div className="text-center"><p className="text-xl font-black text-white">{currentStats?.postCount?.toLocaleString() || 0}</p><p className="text-[7px] font-black text-white/40 uppercase">Signals</p></div>
                    </div>
                    {isAdminOfActiveCollege && (
                       <button onClick={() => setShowManageModal(true)} className="p-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-[var(--border-color)] rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                          <Edit3 size={20}/>
                       </button>
                    )}
                    <button onClick={() => !hasJoined && handleJoin(activeCollege)} disabled={hasJoined} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${hasJoined ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}>
                       {hasJoined ? <CheckCircle2 size={16}/> : <Plus size={16}/>}
                       {hasJoined ? 'Signal Synced' : 'Join Node'}
                    </button>
                 </div>
              </div>

              <div className="pt-8 border-t border-[var(--border-color)]">
                 <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-600"/> Node Authority Registry</h3>
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {currentStats?.leadership.map(m => (
                       <div key={m.id} className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-5 py-3 rounded-2xl shrink-0">
                          <div className="relative">
                            <img src={m.avatar} className="w-10 h-10 rounded-xl object-cover" />
                            <div className="absolute -bottom-1 -right-1">
                               <AuthoritySeal role={m.role} />
                            </div>
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-[var(--text-primary)] leading-none">{m.name}</p>
                             <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1.5">{m.role}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {!hasJoined ? (
        <div className="glass-card py-40 flex flex-col items-center justify-center text-center space-y-8 bg-transparent border-dashed border-2 border-[var(--border-color)]">
           <div className="p-10 bg-indigo-600/10 rounded-full text-indigo-600 animate-pulse"><Lock size={64}/></div>
           <div className="space-y-3 px-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Identity Validation Required</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                 You are attempting to access the <span className="text-indigo-600">{activeCollege}</span> encrypted signal wing. Validation is mandatory for node members.
              </p>
           </div>
           <button onClick={() => handleJoin(activeCollege!)} className="bg-indigo-600 text-white px-16 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center gap-3">
              <ShieldCheck size={20}/> Synchronize & Enter
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-8">
              {(!isCollegeAdmin || activeCollege) && (
                <div className="glass-card p-6 border-[var(--border-color)] relative overflow-hidden bg-[var(--card-bg)] shadow-sm">
                   {rejectionMessage && (
                     <div className="absolute inset-0 bg-rose-950/95 z-50 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 backdrop-blur-md">
                        <ShieldAlert size={48} className="text-rose-500 mb-4" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Signal Blocked</h3>
                        <p className="text-rose-200 text-xs mt-2 max-w-xs">{rejectionMessage}</p>
                        <button onClick={() => setRejectionMessage(null)} className="mt-6 px-8 py-3 bg-white text-rose-900 rounded-xl font-black text-[10px] uppercase tracking-widest">Acknowledge</button>
                     </div>
                   )}
                   <div className="flex gap-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]" />
                      <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none text-[15px] font-medium resize-none h-24 placeholder:text-slate-400 text-[var(--text-primary)]" placeholder={`Broadcast to ${activeCollege || 'the Hill'}...`} />
                   </div>
                   
                   {/* Image Preview */}
                   {selectedImage && (
                     <div className="mt-4 relative inline-block">
                        <img src={selectedImage} className="max-h-48 rounded-xl border border-[var(--border-color)] shadow-lg" />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                        >
                          <X size={14}/>
                        </button>
                     </div>
                   )}

                   <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                      <div className="flex gap-4">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageSelect} 
                          accept="image/*" 
                          className="hidden" 
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          <ImageIcon size={18}/> Asset
                        </button>
                      </div>
                      <button 
                        onClick={handleCreatePost} 
                        disabled={isAnalyzing || (!newPostContent.trim() && !selectedImage)} 
                        className="bg-indigo-600 text-white px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                      >
                         {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16}/>} Broadcast
                      </button>
                   </div>
                </div>
              )}

              <div className="space-y-6">
                 {posts.map(post => (
                    <article key={post.id} className={`glass-card p-8 border-[var(--border-color)] shadow-sm hover:shadow-md transition-all ${post.isAd ? 'bg-amber-500/[0.04]' : ''}`}>
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className="relative">
                                <img src={post.authorAvatar} className="w-12 h-12 rounded-xl border border-[var(--border-color)] object-cover" />
                                <div className="absolute -bottom-1 -right-1">
                                   <AuthoritySeal role={post.authorAuthority} />
                                </div>
                             </div>
                             <div>
                                <h4 className="font-extrabold text-[var(--text-primary)] text-sm uppercase tracking-tight">{post.author}</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{post.timestamp} • {post.college}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2 py-1 rounded text-slate-500 border border-[var(--border-color)]">{post.aiMetadata?.category || 'Social'}</span>
                             {(isSuperAdmin || (isAdminOfActiveCollege && post.college === activeCollege)) && (
                                <button onClick={() => handleDelete(post.id)} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                             )}
                          </div>
                       </div>
                       
                       <p className="text-[var(--text-primary)] text-base font-medium leading-relaxed italic border-l-2 border-indigo-600/30 pl-6 py-1">"{post.content}"</p>
                       
                       {post.images && post.images.length > 0 && (
                         <div className="mt-6 rounded-2xl overflow-hidden border border-[var(--border-color)]">
                            <img src={post.images[0]} className="w-full object-cover max-h-[600px] hover:scale-[1.02] transition-transform duration-700" alt="Signal Asset" />
                         </div>
                       )}

                       <div className="flex items-center gap-10 pt-6 mt-6 border-t border-[var(--border-color)]">
                          <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors"><Heart size={20}/> <span className="text-xs font-black">{post.likes}</span></button>
                          <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"><MessageCircle size={20}/> <span className="text-xs font-black">{post.commentsCount}</span></button>
                          <div className="flex items-center gap-2 text-slate-400 ml-auto"><Eye size={18}/> <span className="text-[10px] font-black">{post.views?.toLocaleString() || 0}</span></div>
                       </div>
                    </article>
                 ))}
                 {posts.length === 0 && (
                   <div className="py-20 text-center text-slate-500 font-black uppercase tracking-widest italic border border-dashed border-[var(--border-color)] rounded-3xl">No signals detected in this wing.</div>
                 )}
              </div>
           </div>

           <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-8">
              <div className="glass-card p-8 border-[var(--border-color)] shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6"><TrendingUp size={16} className="text-indigo-600"/> Signal Density</h3>
                 <div className="space-y-6">
                    {['#GuildElections', '#InnovateMAK', '#ResearchWing'].map(tag => (
                       <div key={tag} className="flex justify-between items-center group cursor-pointer">
                          <p className="text-sm font-black text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">{tag}</p>
                          <span className="text-[9px] font-black text-slate-400 bg-[var(--bg-secondary)] px-2 py-1 rounded">2.4k</span>
                       </div>
                    ))}
                 </div>
              </div>
           </aside>
        </div>
      )}

      {showManageModal && activeCollege && isAdminOfActiveCollege && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-lg">
           <div className="glass-card w-full max-w-2xl bg-[var(--sidebar-bg)] border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                 <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Registry Control</h2>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">College Unit: {activeCollege}</p>
                 </div>
                 <button onClick={() => setShowManageModal(false)} className="text-slate-500 hover:text-rose-500 p-2"><X size={28}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                       onClick={() => {
                          const name = prompt("Official Full Name:");
                          const roleInput = prompt("Authority Role (Lecturer / GRC / Chairperson / Student Leader):");
                          const role = (roleInput || 'Lecturer') as AuthorityRole;
                          const email = prompt("Email (identity@mak.ac.ug):");
                          if (name && role && email) {
                             const newMember = { id: Date.now().toString(), name, role, email, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` };
                             const newList = [...(currentStats?.leadership || []), newMember];
                             db.updateCollegeLeadership(activeCollege, newList);
                             setCollegeStats(db.getCollegeStats());
                          }
                       }}
                       className="flex items-center justify-center gap-3 p-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
                    >
                       <UserPlus size={20}/> Register New Member
                    </button>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-[2rem] flex flex-col items-center justify-center text-center">
                       <ShieldCheck size={24} className="text-emerald-500 mb-2"/>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Governance</p>
                       <p className="text-[10px] font-bold text-[var(--text-primary)]">Node Authority Validated</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Node Leadership Directory</h4>
                    <div className="space-y-3">
                       {currentStats?.leadership.map(m => (
                          <div key={m.id} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-indigo-500/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                   <img src={m.avatar} className="w-12 h-12 rounded-xl" />
                                   <div className="absolute -bottom-1 -right-1">
                                      <AuthoritySeal role={m.role} />
                                   </div>
                                </div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <p className="text-[13px] font-black text-[var(--text-primary)]">{m.name}</p>
                                   </div>
                                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.role} • {m.email}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => {
                                   if(confirm(`Revoke authority for ${m.name}?`)) {
                                      const newList = currentStats.leadership.filter(item => item.id !== m.id);
                                      db.updateCollegeLeadership(activeCollege, newList);
                                      setCollegeStats(db.getCollegeStats());
                                   }
                                }} 
                                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                             >
                                <Trash2 size={18}/>
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
