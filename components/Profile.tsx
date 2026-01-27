
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { MapPin, Edit3, Heart, MessageCircle, ArrowLeft, Activity, Globe, Zap, Radio, Share2, MoreHorizontal, Database, Users, GitFork, Command, ChevronRight, Trophy, Bookmark, Terminal, Cpu, Award, Target, Hash, ShieldCheck, Mail } from 'lucide-react';

// Helper to generate a random hex string for UI telemetry simulation
const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
  onMessageUser?: (id: string) => void;
}

const SignalContributionMesh: React.FC = () => {
  const contributionData = useMemo(() => Array.from({ length: 280 }, (_, i) => ({ intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0 })), []);
  const getIntensityColor = (level: number) => {
    if (level === 0) return 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    if (level < 4) return 'bg-indigo-500/20 border-indigo-500/10';
    if (level < 7) return 'bg-indigo-500/50 border-indigo-500/20';
    return 'bg-indigo-500 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]';
  };
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 space-y-6 scanning-line">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
           <Activity size={12} /> Node_Signal_Contribution_Map
        </h4>
        <div className="flex gap-1.5 items-center">
          <span className="text-[8px] font-black text-slate-400 uppercase mr-1">Intensity</span>
          {[0, 3, 6, 10].map(l => <div key={l} className={`w-3 h-3 rounded-sm border ${getIntensityColor(l)}`}></div>)}
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 shrink-0">
          {contributionData.map((d, i) => <div key={i} className={`w-3 h-3 rounded-[1px] border transition-all hover:scale-150 hover:z-20 cursor-crosshair ${getIntensityColor(d.intensity)}`} />)}
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
    <div className="max-w-[1440px] mx-auto pb-40 font-sans">
      {/* Trading Dashboard Header */}
      <div className="relative h-48 lg:h-64 overflow-hidden border-b border-[var(--border-color)] bg-slate-950">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600" className="w-full h-full object-cover dark:brightness-[0.4] grayscale opacity-30" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        {onNavigateBack && <button onClick={onNavigateBack} className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all shadow-2xl z-20"><ArrowLeft size={20}/></button>}
        
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end px-8 lg:px-12 pb-6 max-w-7xl mx-auto">
           <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> NODE_STABLE</div>
              <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-6"><Mail size={12}/> {user.email || 'node_encrypted'}</div>
              <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-6"><MapPin size={12}/> THE_HILL_SECTOR</div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Identity Column */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img src={user.avatar} className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-xl border-4 border-[var(--bg-primary)] bg-white object-cover shadow-2xl" alt="Identity" />
                <div className="absolute -bottom-4 -right-4 p-3 bg-indigo-600 text-white rounded-xl border-4 border-[var(--bg-primary)] shadow-2xl scale-110"><AuthoritySeal role={authorityRole} size={32} /></div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                   <h1 className="text-4xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none">{user.name}</h1>
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em]">{user.status} // {user.college} Node</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)] italic border-l-4 border-indigo-600/30 pl-6 py-2 leading-relaxed">
                  "{user.bio || 'Identity synchronization with the central registry is currently in progress. Full bibliography pending.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {isOwnProfile ? (
                  <button className="col-span-2 py-4 bg-indigo-600 text-white rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
                    <Edit3 size={16} /> Edit_Parameters
                  </button>
                ) : (
                  <button onClick={() => onMessageUser?.(user.id)} className="col-span-2 py-4 bg-indigo-600 text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Initialize_Direct_Sync</button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[var(--bg-secondary)] p-5 text-center">
                  <span className="text-2xl font-black block ticker-text leading-none">{user.followersCount.toLocaleString()}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Network_Peers</span>
                </div>
                <div className="bg-[var(--bg-secondary)] p-5 text-center">
                  <span className="text-2xl font-black block ticker-text leading-none">{user.totalLikesCount.toLocaleString()}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry_Stars</span>
                </div>
              </div>

              <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> Active_Skill_Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[9px] font-black uppercase text-indigo-600 hover:border-indigo-600 transition-colors cursor-default tracking-tighter">
                       {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Activity Column */}
          <main className="lg:col-span-8 space-y-8">
            <nav className="flex gap-10 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
              {[
                { id: 'signals', label: 'Signal_History', icon: <Radio size={16}/> },
                { id: 'bookmarks', label: 'Stored_Assets', icon: <Bookmark size={16}/> },
                { id: 'achievements', label: 'Verified_Honors', icon: <Trophy size={16}/> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === 'signals' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SignalContributionMesh />
                <div className="space-y-4">
                  {posts.length > 0 ? posts.map(p => (
                    <div key={p.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-xl group hover:border-indigo-600/40 transition-all trading-border shadow-sm">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-600/20 group-hover:scale-110 transition-transform"><GitFork size={22}/></div>
                             <div>
                                <p className="text-[11px] font-black uppercase tracking-widest ticker-text leading-none">ORDER_{p.id.slice(-6).toUpperCase()}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">UPLINK: {p.timestamp}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">EXECUTED</p>
                             <p className="text-[10px] font-mono text-slate-400 mt-0.5">0.00{SHA_GEN()} SEC</p>
                          </div>
                       </div>
                       <div dangerouslySetInnerHTML={{ __html: p.content }} className="text-[14px] italic text-[var(--text-primary)] font-medium leading-relaxed mb-6 border-l-2 border-[var(--border-color)] pl-6" />
                       <div className="flex gap-6 text-[10px] font-black text-slate-400">
                          <span className="flex items-center gap-2 hover:text-rose-500"><Heart size={14}/> {p.likes}</span>
                          <span className="flex items-center gap-2 hover:text-indigo-600"><MessageCircle size={14}/> {p.commentsCount}</span>
                          <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[8px] font-black uppercase">Technical Manifest</span>
                             <ChevronRight size={14} className="text-indigo-600"/>
                          </div>
                       </div>
                    </div>
                  )) : (
                    <div className="py-32 text-center space-y-6 border border-dashed border-[var(--border-color)] rounded-xl bg-slate-50 dark:bg-white/5">
                       <Terminal size={48} className="mx-auto text-slate-300 opacity-50" />
                       <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Registry_Empty: No signals committed to manifest.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {[
                    { t: 'Early Node', d: 'Genesis stratum identification active.', i: <Cpu size={24}/>, c: 'text-indigo-600' },
                    { t: 'Top Sync', d: 'Node activity in upper 5th percentile.', i: <Zap size={24}/>, c: 'text-amber-500' },
                    { t: 'Asset Committer', d: 'High scholarly contribution index.', i: <Database size={24}/>, c: 'text-emerald-500' },
                    { t: 'Safety Guard', d: 'Verified moderator protocol.', i: <ShieldCheck size={24}/>, c: 'text-rose-600' }
                  ].map(a => (
                     <div key={a.t} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center gap-5 hover:border-indigo-600/30 transition-all group">
                        <div className={`p-4 bg-white dark:bg-white/5 rounded-xl shadow-inner group-hover:scale-110 transition-transform ${a.c}`}>{a.i}</div>
                        <div>
                           <h5 className="text-[12px] font-black uppercase tracking-widest leading-none">{a.t}</h5>
                           <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 leading-relaxed">{a.d}</p>
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
