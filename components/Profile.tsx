import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { MapPin, Edit3, Heart, MessageCircle, ArrowLeft, Activity, Globe, Zap, Radio, Share2, MoreHorizontal, Database, Users, GitFork, Command, ChevronRight, Trophy, Bookmark, Terminal, Cpu, Award, Target } from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
  onMessageUser?: (id: string) => void;
}

const SignalContributionMesh: React.FC = () => {
  const contributionData = useMemo(() => Array.from({ length: 365 }, (_, i) => ({ intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0 })), []);
  const getIntensityColor = (level: number) => {
    if (level === 0) return 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    if (level < 4) return 'bg-emerald-500/20 border-emerald-500/10';
    if (level < 7) return 'bg-emerald-500/50 border-emerald-500/20';
    return 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
  };
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em] flex items-center gap-2"><Activity size={12} /> Network_Signal_Contribution</h4>
        <div className="flex gap-1">
          {[0, 3, 6, 10].map(l => <div key={l} className={`w-2.5 h-2.5 rounded-sm border ${getIntensityColor(l)}`}></div>)}
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 shrink-0">
          {contributionData.map((d, i) => <div key={i} className={`w-3 h-3 rounded-sm border transition-all hover:scale-125 cursor-crosshair ${getIntensityColor(d.intensity)}`} />)}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
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
  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.verified ? 'Administrator' : undefined;
  const skills = user.skills || ['Logic_Design', 'Protocol_Research', 'AI_Ethics', 'Fullstack_Sync'];

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono">
      <div className="relative h-48 lg:h-56 overflow-hidden border-b border-[var(--border-color)]">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600" className="w-full h-full object-cover dark:brightness-[0.4] grayscale opacity-40" />
        {onNavigateBack && <button onClick={onNavigateBack} className="absolute top-6 left-6 p-2 bg-[var(--bg-primary)]/40 backdrop-blur-xl border border-[var(--border-color)] rounded-lg"><ArrowLeft size={18}/></button>}
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <div className="relative inline-block">
                <img src={user.avatar} className="w-56 h-56 rounded-xl border border-[var(--border-color)] bg-white object-cover shadow-2xl" />
                <div className="absolute -bottom-3 -right-3 p-2 bg-indigo-600 text-white rounded-lg border-4 border-[var(--bg-primary)] shadow-lg"><AuthoritySeal role={authorityRole} size={28} /></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none">{user.name}</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.status} @ {user.college} Node</p>
                <p className="text-sm text-[var(--text-secondary)] italic border-l-2 border-indigo-600/30 pl-4 py-1">"{user.bio || 'Node biography synchronization pending...'}"</p>
              </div>
              {isOwnProfile ? (
                <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Edit3 size={14} /> Update Identity
                </button>
              ) : (
                <button onClick={() => onMessageUser?.(user.id)} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">Sync Direct</button>
              )}
              <div className="flex items-center gap-6 border-y border-[var(--border-color)] py-4 text-center">
                <div className="flex-1">
                  <span className="text-lg font-black block">{user.followersCount}</span>
                  <span className="text-[7px] font-black text-slate-500 uppercase">Peers</span>
                </div>
                <div className="flex-1">
                  <span className="text-lg font-black block">{user.totalLikesCount}</span>
                  <span className="text-[7px] font-black text-slate-500 uppercase">Stars</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Skill_Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => <span key={s} className="px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[8px] font-black uppercase text-[var(--text-primary)]">{s}</span>)}
                </div>
              </div>
            </div>
          </aside>
          <main className="lg:col-span-9 space-y-8">
            <nav className="flex gap-8 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
              {[
                { id: 'signals', label: 'Signals', icon: <Radio size={14}/> },
                { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={14}/> },
                { id: 'achievements', label: 'Honors', icon: <Trophy size={14}/> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
            {activeTab === 'signals' && (
              <div className="space-y-8 animate-in fade-in">
                <SignalContributionMesh />
                <div className="space-y-4">
                  {posts.map(p => (
                    <div key={p.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-xl group hover:border-indigo-600/30 transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded bg-indigo-600/10 flex items-center justify-center text-indigo-600"><GitFork size={18}/></div>
                             <div>
                                <p className="text-[10px] font-black uppercase">Sequence_{p.id.slice(-4)}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase">{p.timestamp}</p>
                             </div>
                          </div>
                       </div>
                       <div dangerouslySetInnerHTML={{ __html: p.content }} className="text-sm italic text-[var(--text-primary)] font-medium leading-relaxed" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'achievements' && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  {['Early Node', 'Top Sync', 'Asset Committer'].map(a => (
                     <div key={a} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg"><Award size={20}/></div>
                        <div>
                           <h5 className="text-[10px] font-black uppercase">{a}</h5>
                           <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Verified Protocol Badge</p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Profile;