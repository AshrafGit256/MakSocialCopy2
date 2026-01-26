
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, TimelineEvent as TimelineType, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, Book, Edit3, Heart, MessageCircle, Settings, 
  User as UserIcon, GraduationCap, Briefcase, Camera, Save, 
  Plus, X, Clock, Trash2, ArrowLeft, CheckCircle, Activity,
  Globe, Building2, ShieldCheck, Zap, Info, Calendar, Radio,
  Link as LinkIcon, Share2, MoreHorizontal, Database, Terminal, Users,
  Target, GitFork, Command
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
  onMessageUser?: (id: string) => void;
}

const ConnectionProximity: React.FC = () => (
  <div className="glass-panel p-6 rounded-3xl space-y-6">
    <div className="flex justify-between items-center">
      <h4 className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest flex items-center gap-2">
        <Target size={14} className="text-rose-500" /> Neural_Proximity
      </h4>
      <span className="text-[8px] font-black text-emerald-500">LIVE_SYNC</span>
    </div>
    <div className="space-y-4">
      {[
        { hub: 'COCIS Wing', proximity: '84%', color: 'bg-indigo-500' },
        { hub: 'CEDAT Studio', proximity: '32%', color: 'bg-orange-500' },
        { hub: 'Academic Vault', proximity: '92%', color: 'bg-emerald-500' }
      ].map(item => (
        <div key={item.hub} className="space-y-1.5">
          <div className="flex justify-between text-[8px] font-black uppercase">
            <span className="text-[var(--text-secondary)]">{item.hub}</span>
            <span className="text-[var(--text-primary)]">{item.proximity}</span>
          </div>
          <div className="h-1 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div className={`h-full ${item.color}`} style={{ width: item.proximity }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'registry' | 'intelligence' | 'settings'>('broadcasts');
  const [editForm, setEditForm] = useState<User | null>(null);
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const targetId = userId || currentUser.id;
    const profileUser = db.getUsers().find(u => u.id === targetId) || currentUser;
    setUser(profileUser);
    setEditForm(profileUser);
    setPosts(db.getPosts().filter(p => p.authorId === targetId));
  }, [userId]);

  if (!user) return null;

  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.badges?.includes('Official') ? 'Official' : user.verified ? 'Administrator' : undefined;

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono">
      
      {/* 1. FLUID HEADER */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600" 
          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        {onNavigateBack && (
          <button onClick={onNavigateBack} className="absolute top-8 left-8 p-3 glass-panel rounded-2xl text-[var(--text-primary)] hover:scale-110 transition-all z-50">
            <ArrowLeft size={20}/>
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-10 items-end">
          <div className="relative">
            <div className="p-1.5 glass-panel rounded-[2.5rem]">
              <img src={user.avatar} className="w-44 h-44 rounded-[2.2rem] border border-[var(--border-color)] object-cover bg-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 glass-panel rounded-full glow-primary">
              <AuthoritySeal role={authorityRole} size={32} />
            </div>
          </div>
          
          <div className="flex-1 space-y-3 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none">{user.name}</h1>
              <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 text-[10px] font-black uppercase rounded-lg">LVL_{user.nodeAuthorityLevel}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium max-w-xl italic leading-relaxed">
              "{user.bio || 'Signal pending synchronization with global hub...'}"
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--text-secondary)]">
                <Globe size={14} className="text-indigo-600" /> {user.college} Sector
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--text-secondary)]">
                <MapPin size={14} className="text-rose-500" /> The Hill
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            {isOwnProfile ? (
              <button onClick={() => setActiveTab('settings')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                Update_Identity
              </button>
            ) : (
              <>
                <button onClick={() => onMessageUser?.(user.id)} className="px-8 py-4 glass-panel rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-primary)] hover:bg-indigo-600 hover:text-white transition-all">
                  Initialize_Direct
                </button>
                <button className="p-4 glass-panel rounded-2xl text-[var(--text-primary)]"><MoreHorizontal size={20}/></button>
              </>
            )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-8">
            <ConnectionProximity />
            
            <div className="glass-panel p-8 rounded-3xl space-y-6">
              <h4 className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest">Global_Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Commits</span>
                  <p className="text-2xl font-black italic">{user.postsCount}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Syncs</span>
                  <p className="text-2xl font-black italic">{user.followersCount}</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="flex gap-10 border-b border-[var(--border-color)] mb-10">
               {['broadcasts', 'registry', 'intelligence'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="glass-panel p-8 rounded-3xl hover:border-indigo-500/50 transition-all duration-500 group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                            <Radio size={18} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-[var(--text-primary)]">Sequence_{post.id.slice(-6)}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase">{post.timestamp}</p>
                         </div>
                      </div>
                      <GitFork size={16} className="text-slate-300" />
                   </div>
                   <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-sm leading-relaxed italic text-[var(--text-primary)] mb-8" />
                   <div className="flex gap-10">
                      <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                        <Heart size={16}/> <span className="text-[10px] font-black">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                        <MessageCircle size={16}/> <span className="text-[10px] font-black">{post.commentsCount}</span>
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
