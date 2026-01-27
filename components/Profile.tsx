import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, Edit3, Heart, MessageCircle, ArrowLeft, 
  Activity, Globe, Zap, Radio, Share2, Database, 
  Terminal, ShieldCheck, Mail, Target, Award, Trophy, Bookmark
} from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Profile: React.FC<{ userId?: string, onNavigateBack?: () => void, onNavigateToProfile?: (id: string) => void, onMessageUser?: (id: string) => void }> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'bookmarks' | 'achievements'>('signals');
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const targetId = userId || currentUser.id;
    const profileUser = db.getUsers().find(u => u.id === targetId) || currentUser;
    setUser(profileUser);
    setPosts(db.getPosts().filter(p => p.authorId === targetId));
  }, [userId]);

  if (!user) return null;

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono">
      {/* Tactical Banner */}
      <div className="relative h-48 lg:h-64 overflow-hidden border-b border-[var(--border-color)] bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        {onNavigateBack && <button onClick={onNavigateBack} className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-white hover:bg-white/20 transition-all z-20"><ArrowLeft size={18}/></button>}
        <div className="absolute bottom-6 left-12 right-12 flex justify-between items-end">
           <div className="flex gap-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> NODE_STABLE</div>
              <div className="flex items-center gap-2"><MapPin size={12}/> THE_HILL_SECTOR</div>
           </div>
           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">REG_ID: {SHA_GEN()}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Node Identity Column */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <div className="relative inline-block">
                <img src={user.avatar} className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full border-8 border-[var(--bg-primary)] bg-white object-cover shadow-2xl grayscale hover:grayscale-0 transition-all" />
                <div className="absolute bottom-2 right-2 p-3 bg-[#475569] text-white rounded-full border-4 border-[var(--bg-primary)] shadow-2xl"><AuthoritySeal role="Official" size={28} /></div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">{user.name}</h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em]">{user.college} Node // {user.status}</p>
                <p className="text-xs text-slate-500 italic border-l-4 border-slate-700/30 pl-6 leading-relaxed">
                  "{user.bio || 'Identity synchronization with the central registry in progress.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] overflow-hidden shadow-inner">
                <div className="bg-[var(--bg-secondary)] p-6 text-center">
                  <span className="text-2xl font-black block leading-none">{user.followersCount}</span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Nodes_Linked</span>
                </div>
                <div className="bg-[var(--bg-secondary)] p-6 text-center">
                  <span className="text-2xl font-black block leading-none">{user.totalLikesCount}</span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Registry_Stars</span>
                </div>
              </div>

              {isOwnProfile ? (
                 <button className="w-full py-4 bg-[#475569] text-white rounded-[2px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-700 transition-all active:scale-95">Edit_Parameters</button>
              ) : (
                 <button onClick={() => onMessageUser?.(user.id)} className="w-full py-4 bg-[#475569] text-white rounded-[2px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95">Direct_Sync</button>
              )}
            </div>
          </aside>

          {/* Activity Manifest Column */}
          <main className="lg:col-span-8 space-y-10">
            <nav className="flex gap-12 border-b border-[var(--border-color)]">
              {[
                { id: 'signals', label: 'Signal_History', icon: <Radio size={16}/> },
                { id: 'bookmarks', label: 'Vault_Saves', icon: <Bookmark size={16}/> },
                { id: 'achievements', label: 'Credentials', icon: <Trophy size={16}/> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.id ? 'border-[#475569] text-[#475569]' : 'border-transparent text-slate-400 hover:text-slate-800'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>

            <div className="space-y-6">
              {posts.length > 0 ? posts.map(p => (
                <div key={p.id} className="pro-card p-8 group hover:border-slate-500 transition-all shadow-sm flex flex-col items-center text-center">
                   <div className="text-[9px] font-black uppercase text-slate-400 mb-6 tracking-widest flex items-center gap-2">
                      <Terminal size={12}/> ORDER_{SHA_GEN()} / {p.timestamp}
                   </div>
                   <div dangerouslySetInnerHTML={{ __html: p.content }} className="text-sm font-medium leading-relaxed italic text-slate-700 dark:text-slate-300 max-w-xl" />
                   <div className="mt-8 pt-6 border-t border-[var(--border-color)] w-full flex justify-center gap-12">
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-rose-500"><Heart size={14}/> {p.likes}</span>
                      <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-500"><MessageCircle size={14}/> {p.commentsCount}</span>
                   </div>
                </div>
              )) : (
                <div className="py-40 text-center space-y-4 border border-dashed border-[var(--border-color)]">
                   <Database size={48} className="mx-auto text-slate-300 opacity-30" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry_Log_Empty</p>
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