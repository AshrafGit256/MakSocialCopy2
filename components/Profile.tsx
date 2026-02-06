
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { User, Post } from '../types';
import { AuthoritySeal } from './Feed'; 
import Gallery from './Gallery';
import { 
  MapPin, ArrowLeft, Globe, Zap, Radio, Share2, Database, 
  Terminal, Award, Trophy, Bookmark, Mail, Link as LinkIcon, Edit2, Calendar,
  GitCommit, Star, MessageCircle, FileVideo, Box, GitFork, LayoutGrid,
  UserPlus, CheckCircle2, Camera, Upload, Loader2, X
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Profile: React.FC<{ 
  userId?: string, 
  onNavigateBack?: () => void, 
  onNavigateToProfile?: (id: string) => void, 
  onMessageUser?: (id: string) => void,
  onUpdateCurrentUser?: (user: User) => void
}> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser, onUpdateCurrentUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'bookmarks' | 'gallery' | 'achievements'>('signals');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const targetId = userId || currentUser.id;
    const profileUser = db.getUsers().find(u => u.id === targetId) || (isOwnProfile ? currentUser : null);
    
    if (profileUser) {
      setUser(profileUser);
      const allPosts = db.getPosts();
      
      if (activeTab === 'signals') {
        setDisplayedPosts(allPosts.filter(p => p.authorId === targetId));
      } else if (activeTab === 'bookmarks') {
        const bookmarks = db.getBookmarks();
        setDisplayedPosts(allPosts.filter(p => bookmarks.includes(p.id)));
      } else {
        setDisplayedPosts([]);
      }
    }
  }, [userId, currentUser.id, isOwnProfile, activeTab]);

  const handleEmail = () => {
    if (user?.email) {
      // Use the 'fs=1' flag for full-screen and ensure URL encoding is strict
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent("Hill Registry Signal")}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("Diagnostic: Node identity lacks a valid email endpoint in the registry.");
    }
  };

  const handleAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user && isOwnProfile) {
      setIsUpdatingAvatar(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updatedUser = { ...user, avatar: base64 };
        setUser(updatedUser);
        db.saveUser(updatedUser);
        onUpdateCurrentUser?.(updatedUser);
        setIsUpdatingAvatar(false);
        alert("Signal Integrity Check: Identity asset updated in central registry.");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-screen font-sans text-slate-400 uppercase tracking-[0.5em] animate-pulse">
       Target_Node_Nullified
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-sans text-[var(--text-primary)] bg-[var(--bg-primary)]">
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]/80 sticky top-0 z-[100] backdrop-blur-md">
         <div className="flex items-center gap-6">
            <button onClick={onNavigateBack} className="p-2 hover:bg-[var(--bg-secondary)] rounded transition-all text-slate-500"><ArrowLeft size={20}/></button>
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5">
                  <h2 className="text-[14px] font-black uppercase tracking-tighter leading-none">{user.name.toLowerCase()}</h2>
                  <AuthoritySeal size={14} />
               </div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry_ID: {SHA_GEN()}</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[9px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all flex items-center gap-2 rounded-none">
               <Share2 size={12}/> Signal_Identity
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <div className="relative group overflow-hidden rounded-full aspect-square shadow-sm">
                <img src={user.avatar} className="w-full h-full rounded-full border border-[var(--border-color)] bg-white object-cover transition-all duration-500" />
                {isOwnProfile && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all backdrop-blur-sm cursor-pointer"
                  >
                    {isUpdatingAvatar ? <Loader2 size={32} className="animate-spin"/> : <Camera size={32} />}
                    <span className="text-[8px] font-black uppercase mt-2">Update Asset</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpdate} />
                
                <div className="absolute -bottom-2 -right-2 p-2 bg-[var(--bg-primary)] rounded-full border border-[var(--border-color)] shadow-xl z-10">
                   <AuthoritySeal role="Official" size={24} />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">{user.name}</h1>
                  <AuthoritySeal size={28} />
                </div>
                <p className="text-lg text-slate-400 font-bold tracking-tight">@{user.name.toLowerCase().replace(/\s/g, '')}</p>
              </div>

              {isOwnProfile ? (
                 <button className="w-full py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none font-black text-[11px] uppercase tracking-widest hover:border-[var(--brand-color)] transition-all">Edit Parameters</button>
              ) : (
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`w-full py-3 rounded-none font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${isFollowing ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[var(--brand-color)] text-white hover:brightness-110'}`}
                    >
                      {isFollowing ? <><CheckCircle2 size={14}/> Linked</> : <><UserPlus size={14}/> Initialize Link</>}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => onMessageUser?.(user.id)} className="flex-1 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-none font-black text-[11px] uppercase tracking-widest hover:border-[var(--brand-color)] transition-all active:scale-95 flex items-center justify-center gap-2">
                        <MessageCircle size={14}/> Message
                      </button>
                      <button onClick={handleEmail} className="flex-1 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-none font-black text-[11px] uppercase tracking-widest hover:border-[var(--brand-color)] transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Mail size={14}/> Email
                      </button>
                    </div>
                 </div>
              )}

              <p className="text-sm font-medium text-slate-500 leading-relaxed border-l-2 border-[var(--brand-color)]/30 pl-4 py-2">
                "{user.bio || 'Identity synchronization with the central registry in progress. Node parameters pending update.'}"
              </p>

              <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <MapPin size={14}/> {user.college} HUB
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <Calendar size={14}/> Committed {user.status}
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <Mail size={14}/> {user.email || 'node@hidden.net'}
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest truncate">
                   <LinkIcon size={14}/> hillstrata.mak.ac.ug/n/{user.id}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)]">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Registry Metrics</h4>
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold hover:text-[var(--brand-color)] cursor-pointer transition-colors">
                       <Database size={14} className="text-slate-400"/>
                       <span>{user.followersCount.toLocaleString()}</span> <span className="text-slate-400 font-medium lowercase">links</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold hover:text-amber-500 cursor-pointer transition-colors">
                       <Star size={14} className="text-slate-400"/>
                       <span>{user.totalLikesCount.toLocaleString()}</span> <span className="text-slate-400 font-medium lowercase">stars</span>
                    </div>
                 </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-8">
            <nav className="flex items-center gap-8 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
              {[
                { id: 'signals', label: 'Signals', icon: <Radio size={14}/>, count: db.getPosts().filter(p => p.authorId === (userId || currentUser.id)).length },
                { id: 'gallery', label: 'Visual Vault', icon: <LayoutGrid size={14}/>, count: db.getPosts().filter(p => p.authorId === (userId || currentUser.id)).reduce((acc, p) => acc + (p.images?.length || 0), 0) },
                { id: 'bookmarks', label: 'Registry Vault', icon: <Bookmark size={14}/>, count: db.getBookmarks().length },
                { id: 'achievements', label: 'Credentials', icon: <Trophy size={14}/>, count: 12 }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-[var(--text-primary)]' : 'text-slate-400 hover:text-[var(--brand-color)]'}`}>
                  {tab.icon} {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.id ? 'bg-[var(--brand-color)] text-white' : 'bg-[var(--bg-secondary)] text-slate-500'}`}>{tab.count}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-color)] animate-in fade-in zoom-in-x"></div>}
                </button>
              ))}
            </nav>

            <div className="space-y-12">
              {activeTab === 'gallery' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <Gallery userId={userId || currentUser.id} onSelectPost={(id) => { }} />
                </div>
              ) : displayedPosts.length > 0 ? displayedPosts.map(p => (
                <div key={p.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none overflow-hidden hover:border-[var(--brand-color)] transition-all group">
                   <div className="px-6 py-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]/50">
                      <div className="flex items-center gap-2">
                        <Box size={14} className="text-slate-400" />
                        <span className="text-[11px] font-black uppercase text-slate-600 tracking-widest">COMMIT_{SHA_GEN().slice(0, 4)}</span>
                        <span className="text-slate-300 mx-2">/</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.timestamp}</span>
                      </div>
                      <span className="px-2 py-0.5 border border-[var(--border-color)] rounded-full text-[8px] font-black uppercase text-slate-500">Public</span>
                   </div>

                   <div className="p-6">
                      <div dangerouslySetInnerHTML={{ __html: p.content }} className="text-sm font-medium leading-relaxed text-[var(--text-primary)] post-content-markdown" />
                   </div>

                   <div className="px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]/30">
                      <div className="flex items-center gap-8">
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[var(--brand-color)] transition-colors cursor-pointer">
                            <Star size={14} /> <span className="ticker-text">{p.likes.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[var(--brand-color)] transition-colors cursor-pointer">
                            <MessageCircle size={14} /> <span className="ticker-text">{p.commentsCount.toLocaleString()}</span>
                         </div>
                      </div>
                      <span className="text-[8px] font-sans text-slate-300 uppercase tracking-widest">SYNCHRONIZED_STABLE</span>
                   </div>
                </div>
              )) : (
                <div className="py-32 text-center space-y-6 border border-dashed border-[var(--border-color)] rounded-none bg-[var(--bg-secondary)]">
                   <Database size={48} className="mx-auto text-slate-200" />
                   <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tighter">Manifest_Empty</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching signals found in this stratum.</p>
                   </div>
                   <button onClick={() => setActiveTab('signals')} className="px-8 py-2 bg-[var(--brand-color)] text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reset Sequence</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
