
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { User, Post, TimelineEvent as TimelineType, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, Book, Edit3, Heart, MessageCircle, Settings, 
  User as UserIcon, GraduationCap, Briefcase, Camera, Save, 
  Plus, X, Clock, Trash2, ArrowLeft, CheckCircle, Activity,
  Globe, Building2, ShieldCheck, Zap, Info, Calendar, Radio,
  Link as LinkIcon, Share2, MoreHorizontal, Database, Terminal, Users,
  Target, GitFork, Command, ChevronRight, Star, Layers, Activity as PulseIcon
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
    return 'bg-emerald-300 border-white shadow-[0_0_12px_rgba(110,231,183,0.8)] animate-pulse';
  };

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] space-y-8 bg-white/50 dark:bg-slate-950/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase text-brand-accent tracking-[0.3em] flex items-center gap-2">
            <PulseIcon size={14} className="text-brand-accent" /> Neural_Signal_Mesh
          </h4>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Historical node activity across the academic chain</p>
        </div>
        <div className="flex items-center gap-3 text-[8px] font-black text-slate-500 uppercase">
          <span>Signal Strength</span>
          <div className="flex gap-1.5">
            {[0, 2, 5, 8, 10].map(l => (
              <div key={l} className={`w-3 h-3 rounded-full border ${getIntensityColor(l)} transition-all duration-500`}></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative group overflow-hidden">
        {/* Signal Lines - Visual Decoration */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-2 opacity-5">
          {[1,2,3,4].map(i => <div key={i} className="h-px w-full bg-emerald-500"></div>)}
        </div>
        
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-4 px-2">
          <div className="grid grid-rows-7 grid-flow-col gap-2 shrink-0">
            {contributionData.map((d, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-full border transition-all hover:scale-150 hover:z-20 cursor-crosshair ${getIntensityColor(d.intensity)}`}
                title={`INTENSITY: ${d.intensity} | NODE: 0x${i.toString(16).toUpperCase()}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[var(--border-color)]">
        <div className="flex gap-10">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Current_Streak</span>
            <p className="text-xl font-black italic tracking-tighter text-brand-accent">128 Days</p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total_Synchronizations</span>
            <p className="text-xl font-black italic tracking-tighter text-[var(--text-primary)]">2,402</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-400 transition-all group">
          Synchronize_Manifest <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'assets' | 'nodes'>('signals');
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

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono">
      
      {/* 1. ELITE HERO HEADER */}
      <div className="relative h-72 lg:h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600" 
          className="w-full h-full object-cover grayscale opacity-50 contrast-125 dark:brightness-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/10 to-transparent"></div>
        {onNavigateBack && (
          <button onClick={onNavigateBack} className="absolute top-8 left-8 p-4 glass-panel rounded-2xl text-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all z-50">
            <ArrowLeft size={22}/>
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 2. SIDEBAR - GITHUB STYLE IDENTITY */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="space-y-8 relative">
              <div className="relative inline-block group">
                <div className="p-1.5 glass-panel rounded-[3rem] shadow-2xl">
                  <img src={user.avatar} className="w-56 h-56 rounded-[2.8rem] border border-[var(--border-color)] object-cover bg-white group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-4 -right-4 p-3 bg-brand-primary text-white rounded-full glow-primary border-4 border-[var(--bg-primary)]">
                  <AuthoritySeal role={authorityRole} size={38} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none">{user.name}</h1>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Node_Status: {user.college} / {user.status}</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed italic border-l-2 border-brand-primary/30 pl-6">
                  "{user.bio || 'Waiting for protocol initialization...'}"
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {isOwnProfile ? (
                  <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <Edit3 size={18} /> Update Identity
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => onMessageUser?.(user.id)} className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                      Sync Direct
                    </button>
                    <button className="p-4 glass-panel rounded-2xl text-[var(--text-primary)]"><MoreHorizontal size={20}/></button>
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter">{user.followersCount}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Followers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter">{user.followingCount}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Following</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter">{user.totalLikesCount}</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stars</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                    <Globe size={16} className="text-brand-primary" /> Sector_{user.college} Hub
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                    <MapPin size={16} className="text-rose-500" /> Coordinate: The Hill
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* 3. MAIN CONTENT - GITHUB STYLE TABS & STREAM */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* TABS */}
            <nav className="flex gap-10 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
              {[
                { id: 'signals', label: 'Signals', icon: <Radio size={16}/> },
                { id: 'assets', label: 'Registry Assets', icon: <Database size={16}/> },
                { id: 'nodes', label: 'Network Graph', icon: <Users size={16}/> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.icon} {tab.label}
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full text-[9px]">{tab.id === 'signals' ? posts.length : 0}</span>
                </button>
              ))}
            </nav>

            {/* NEURAL SIGNAL MESH - Prominent on main profile */}
            <SignalContributionMesh />

            {/* BROADCAST STREAM */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Latest Broadcasts</h4>
              {posts.length > 0 ? posts.map(post => (
                <div key={post.id} className="glass-panel p-8 rounded-[2rem] hover:border-brand-primary/30 transition-all duration-500 group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <GitFork size={20} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black uppercase text-[var(--text-primary)] tracking-tight">Sequence_{post.id.slice(-6)}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{post.timestamp}</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-white/5 border border-[var(--border-color)] rounded-lg text-[8px] font-black uppercase text-slate-400">Public Protocol</div>
                   </div>
                   <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-sm leading-relaxed font-medium italic text-[var(--text-primary)] mb-8 line-clamp-4" />
                   <div className="flex gap-10 border-t border-[var(--border-color)] pt-6">
                      <button className="flex items-center gap-2 text-slate-500 hover:text-brand-accent transition-colors">
                        <Heart size={18}/> <span className="text-[11px] font-black tracking-widest">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors">
                        <MessageCircle size={18}/> <span className="text-[11px] font-black tracking-widest">{post.commentsCount}</span>
                      </button>
                      <button className="ml-auto text-slate-400 hover:text-[var(--text-primary)] transition-colors">
                        <Share2 size={18}/>
                      </button>
                   </div>
                </div>
              )) : (
                <div className="py-32 text-center space-y-6 glass-panel rounded-[2rem] border-dashed">
                   <Layers size={48} className="mx-auto text-slate-300 opacity-20" />
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">No broadcast logs detected for this node.</p>
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
