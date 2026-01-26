
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { User, Post, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, Edit3, Heart, MessageCircle, 
  ArrowLeft, Activity, Globe, Zap, Radio, 
  Share2, MoreHorizontal, Database, Users,
  Target, GitFork, Command, ChevronRight, 
  Trophy, Bookmark, Grid, Terminal, Cpu, Award
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
  onMessageUser?: (id: string) => void;
}

const SignalContributionMesh: React.FC = () => {
  const contributionData = useMemo(() => {
    return Array.from({ length: 365 }, (_, i) => ({
      day: i,
      intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
    }));
  }, []);

  const getIntensityColor = (level: number) => {
    if (level === 0) return 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    if (level < 3) return 'bg-emerald-500/20 border-emerald-500/10';
    if (level < 6) return 'bg-emerald-500/50 border-emerald-500/20';
    if (level < 9) return 'bg-emerald-500 border-emerald-400';
    return 'bg-emerald-300 border-white shadow-[0_0_10px_rgba(110,231,183,0.5)]';
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em] flex items-center gap-2">
            <Activity size={12} className="text-brand-accent" /> Network_Signal_Mesh
          </h4>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol participation history</p>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
          <span>Signal Strength</span>
          <div className="flex gap-1">
            {[0, 3, 6, 10].map(l => (
              <div key={l} className={`w-2.5 h-2.5 rounded-sm border ${getIntensityColor(l)}`}></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 shrink-0">
          {contributionData.map((d, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-sm border transition-all hover:scale-125 hover:z-20 cursor-crosshair ${getIntensityColor(d.intensity)}`}
              title={`STRENGTH: ${d.intensity} | PROTOCOL_ID: 0x${i.toString(16).toUpperCase()}`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)] text-[8px] font-black uppercase text-slate-500 tracking-widest">
        <div className="flex gap-6">
          <span>CURR_STREAK: 14 DAYS</span>
          <span>TOTAL_SYNCS: 2,142</span>
        </div>
        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-400">
          Full_Log <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

const AchievementBento: React.FC<{ badges: string[] }> = ({ badges }) => {
  const achievements = [
    { id: '1', title: 'Early Node', icon: <Zap size={18}/>, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: '2', title: 'High Logic', icon: <Cpu size={18}/>, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: '3', title: 'Top Contributor', icon: <Trophy size={18}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: '4', title: 'Official Authority', icon: <Award size={18}/>, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ].filter(a => badges.includes(a.title) || Math.random() > 0.5); // Randomly show for mock purpose

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {achievements.map(a => (
        <div key={a.id} className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] p-5 rounded-xl flex items-center gap-4 group hover:border-indigo-500 transition-all">
          <div className={`p-3 rounded-lg ${a.bg} ${a.color} group-hover:scale-110 transition-transform`}>
            {a.icon}
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase text-[var(--text-primary)]">{a.title}</h5>
            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Verified_Protocol</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'bookmarks' | 'achievements' | 'assets'>('signals');
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const targetId = userId || currentUser.id;
    const profileUser = db.getUsers().find(u => u.id === targetId) || currentUser;
    setUser(profileUser);
    setPosts(db.getPosts().filter(p => p.authorId === targetId));
  }, [userId]);

  if (!user) return null;

  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.badges?.includes('Official') ? 'Official' : user.verified ? 'Administrator' : undefined;

  // Mock skills if none exist
  const skills = user.skills || ['Blockchain', 'AI Ethics', 'Protocol Design', 'Full-Stack', 'Research Logic'];

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono">
      {/* 1. COMPACT HERO HEADER */}
      <div className="relative h-48 lg:h-56 overflow-hidden border-b border-[var(--border-color)]">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600" 
          className="w-full h-full object-cover dark:brightness-[0.4] grayscale opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-60"></div>
        {onNavigateBack && (
          <button onClick={onNavigateBack} className="absolute top-6 left-6 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-lg text-white border border-white/20 hover:scale-105 transition-all z-50">
            <ArrowLeft size={18}/>
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 2. SIDEBAR - GITHUB STYLE IDENTITY */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <div className="relative inline-block">
                <div className="p-1 bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden">
                  <img src={user.avatar} className="w-full aspect-square max-w-[280px] rounded-lg object-cover bg-white" />
                </div>
                <div className="absolute -bottom-3 -right-3 p-2 bg-indigo-600 text-white rounded-lg glow-primary border-4 border-[var(--bg-primary)]">
                  <AuthoritySeal role={authorityRole} size={28} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none">{user.name}</h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.status} @ {user.college} Node</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed italic border-l-2 border-indigo-600/30 pl-4 py-1">
                  "{user.bio || 'Synchronizing node biography...'}"
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Edit3 size={14} /> Update Identity
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => onMessageUser?.(user.id)} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                      Sync Direct
                    </button>
                    <button className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-slate-500"><MoreHorizontal size={16}/></button>
                  </div>
                )}
              </div>

              {/* STATS */}
              <div className="flex items-center gap-6 border-y border-[var(--border-color)] py-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black italic tracking-tighter">{user.followersCount}</span>
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Peers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black italic tracking-tighter">{user.totalLikesCount}</span>
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Stars</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-lg font-black italic tracking-tighter">LVL_{user.nodeAuthorityLevel}</span>
                   <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Authority</span>
                </div>
              </div>

              {/* SKILLS */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Target size={12}/> Technical_Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[8px] font-black uppercase text-[var(--text-primary)] hover:border-indigo-500 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* METADATA */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                  <Globe size={14} className="text-indigo-600" /> Sector_{user.college} Hub
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                  <MapPin size={14} className="text-rose-500" /> Coord: 0.3348 / 32.5684
                </div>
              </div>
            </div>
          </aside>

          {/* 3. MAIN CONTENT - TABS & STREAM */}
          <main className="lg:col-span-9 space-y-8">
            <nav className="flex gap-8 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
              {[
                { id: 'signals', label: 'Signals', icon: <Radio size={14}/> },
                { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={14}/> },
                { id: 'achievements', label: 'Achievements', icon: <Trophy size={14}/> },
                { id: 'assets', label: 'Assets', icon: <Database size={14}/> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.icon} {tab.label}
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full text-[8px]">{tab.id === 'signals' ? posts.length : tab.id === 'bookmarks' ? 12 : 0}</span>
                </button>
              ))}
            </nav>

            {activeTab === 'signals' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <SignalContributionMesh />
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] p-6 rounded-xl hover:border-indigo-500/30 transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-600">
                                <GitFork size={18} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase text-[var(--text-primary)]">Sequence_{post.id.slice(-6)}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{post.timestamp}</p>
                             </div>
                          </div>
                          <Share2 size={14} className="text-slate-300 hover:text-indigo-600 cursor-pointer" />
                       </div>
                       <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-sm italic leading-relaxed text-[var(--text-primary)] mb-6 font-medium" />
                       <div className="flex gap-8 pt-4 border-t border-[var(--border-color)]">
                          <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                            <Heart size={16}/> <span className="text-[9px] font-black">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                            <MessageCircle size={16}/> <span className="text-[9px] font-black">{post.commentsCount}</span>
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 <div className="p-10 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl opacity-40">
                    <Bookmark size={40} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No bookmarked signals detected.</p>
                 </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="p-8 bg-indigo-600 rounded-xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Trophy size={100}/></div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Official Registry Honors</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-2">Earned through network participation and asset committing</p>
                </div>
                <AchievementBento badges={user.badges} />
              </div>
            )}

            {activeTab === 'assets' && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
                 {[1,2].map(i => (
                   <div key={i} className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] p-6 rounded-xl space-y-4 group hover:border-emerald-500/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500">
                          <Database size={18} />
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol_Asset</span>
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] italic">Final_Thesis_Node_0{i}.pdf</h4>
                      <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest pt-2 border-t border-[var(--border-color)]">
                         <span>SHA_256: 0x82...{i}f</span>
                         <button className="text-indigo-600">SYNC_VAL</button>
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
