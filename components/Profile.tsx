
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post } from '../types';
import { AuthoritySeal } from './Feed'; 
import Gallery from './Gallery';
import { 
  MapPin, ArrowLeft, Globe, Zap, Radio, Share2, Database, 
  Terminal, Award, Trophy, Bookmark, Mail, Link as LinkIcon, Edit2, Calendar,
  GitCommit, Star, MessageCircle, FileVideo, Box, GitFork, LayoutGrid
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Profile: React.FC<{ userId?: string, onNavigateBack?: () => void, onNavigateToProfile?: (id: string) => void, onMessageUser?: (id: string) => void }> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'bookmarks' | 'gallery' | 'achievements'>('signals');
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

  if (!user) return (
    <div className="flex items-center justify-center h-screen font-mono text-slate-400 uppercase tracking-[0.5em] animate-pulse">
       Target_Node_Nullified
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono text-[var(--text-primary)] bg-[var(--bg-primary)]">
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-white/80 dark:bg-black/80 sticky top-0 z-[100] backdrop-blur-md">
         <div className="flex items-center gap-6">
            <button onClick={onNavigateBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-all text-slate-500"><ArrowLeft size={20}/></button>
            <div className="flex flex-col">
               <h2 className="text-[14px] font-black uppercase tracking-tighter leading-none">{user.name.toLowerCase()}</h2>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry_ID: {SHA_GEN()}</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[9px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all flex items-center gap-2 rounded-[var(--radius-main)]">
               <Share2 size={12}/> Signal_Identity
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <img src={user.avatar} className="w-full aspect-square rounded-full border border-[var(--border-color)] bg-white object-cover shadow-sm transition-all duration-500" />
                <div className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-black rounded-full border border-[var(--border-color)] shadow-xl">
                   <AuthoritySeal role="Official" size={24} />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">{user.name}</h1>
                <p className="text-lg text-slate-400 font-bold tracking-tight">@{user.name.toLowerCase().replace(/\s/g, '')}</p>
              </div>

              {isOwnProfile ? (
                 <button className="w-full py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] font-black text-[11px] uppercase tracking-widest hover:border-[var(--brand-color)] transition-all">Edit Parameters</button>
              ) : (
                 <div className="flex gap-2">
                   <button onClick={() => onMessageUser?.(user.id)} className="flex-1 py-2 bg-[var(--brand-color)] text-white rounded-[var(--radius-main)] font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-sm">Sync Protocol</button>
                   <button className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] text-slate-400 hover:text-[var(--brand-color)] transition-all"><Zap size={14}/></button>
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
                       <span>{user.followersCount}</span> <span className="text-slate-400 font-medium lowercase">links</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold hover:text-amber-500 cursor-pointer transition-colors">
                       <Star size={14} className="text-slate-400"/>
                       <span>{user.totalLikesCount}</span> <span className="text-slate-400 font-medium lowercase">stars</span>
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
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.id ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>{tab.count}</span>
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
                <div key={p.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden hover:border-[var(--brand-color)] transition-all group">
                   <div className="px-6 py-3 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
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

                   <div className="px-6 py-3 border-t border-[var(--border-color)] flex items-center justify-between bg-slate-50/30 dark:bg-black/10">
                      <div className="flex items-center gap-8">
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[var(--brand-color)] transition-colors cursor-pointer">
                            <Star size={14} /> <span className="ticker-text">{p.likes.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[var(--brand-color)] transition-colors cursor-pointer">
                            <MessageCircle size={14} /> <span className="ticker-text">{p.commentsCount.toLocaleString()}</span>
                         </div>
                      </div>
                      <span className="text-[8px] font-mono text-slate-300 uppercase tracking-widest">SYNCHRONIZED_STABLE</span>
                   </div>
                </div>
              )) : (
                <div className="py-32 text-center space-y-6 border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)] bg-slate-50/50 dark:bg-black/5">
                   <Database size={48} className="mx-auto text-slate-200" />
                   <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tighter">Manifest_Empty</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching signals found in this stratum.</p>
                   </div>
                   <button onClick={() => setActiveTab('signals')} className="px-8 py-2 bg-[var(--brand-color)] text-white rounded-[var(--radius-main)] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reset Sequence</button>
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
