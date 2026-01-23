
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, TimelineEvent as TimelineType, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
// Added Users to lucide-react imports to fix 'Cannot find name Users' error
import { 
  MapPin, Book, Edit3, Heart, MessageCircle, Settings, 
  User as UserIcon, GraduationCap, Briefcase, Camera, Save, 
  Plus, X, Clock, Trash2, ArrowLeft, CheckCircle, Activity,
  Globe, Building2, ShieldCheck, Zap, Info, Calendar, Radio,
  Link as LinkIcon, Share2, MoreHorizontal, Database, Terminal, Users
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  // Fix: onNavigateBack should be a function type () => void, not just void to be assignable and testable for truthiness.
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'registry' | 'intelligence' | 'settings'>('broadcasts');
  const [editForm, setEditForm] = useState<User | null>(null);
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const sync = () => {
        const targetId = userId || currentUser.id;
        const users = db.getUsers();
        const profileUser = users.find(u => u.id === targetId) || currentUser;
        setUser(profileUser);
        setEditForm(profileUser);
        setPosts(db.getPosts().filter(p => p.authorId === targetId));
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, [userId]);

  if (!user) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400">Synchronizing Node Data...</div>;

  const handleSaveSettings = () => {
    if (editForm) {
      db.saveUser(editForm);
      setUser(editForm);
      alert("Local Registry Updated.");
    }
  };

  const timelineEvents: TimelineType[] = [
    { id: 't1', title: 'Registry Sync', description: 'Node verified for current academic sequence.', timestamp: '2 days ago', type: 'achievement', color: 'bg-emerald-500' },
    { id: 't2', title: 'Signal Transmission', description: 'Broadcast shared across wing hub.', timestamp: '1 week ago', type: 'post', color: 'bg-indigo-500' },
    { id: 't3', title: 'Initialization', description: 'MakSocial identity matrix activated.', timestamp: '1 month ago', type: 'achievement', color: 'bg-slate-500' }
  ];

  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.badges?.includes('Official') ? 'Official' : user.badges?.includes('Corporate') ? 'Corporate' : user.verified ? 'Administrator' : undefined;
  const isInstitution = authorityRole === 'Official' || authorityRole === 'Corporate' || authorityRole === 'Super Admin';

  const banners: Record<string, string> = {
    'mak_unipod': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400',
    'mak_ailab': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400',
    'mak_library': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400',
    'vc_office': 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1400',
    'centenary_bank': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=1400',
    'stanbic_bank': 'https://www.intelligentcio.com/africa/wp-content/uploads/sites/5/2023/08/STANBIC-BANK_1000X450.jpg',
    'covab_agro': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400'
  };
  const bannerImg = banners[user.id] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400';

  return (
    <div className="max-w-[1440px] mx-auto pb-40 animate-in fade-in duration-500 bg-[var(--bg-primary)]">
      
      {/* 1. PROFESSIONAL HEADER (Standardized GitHub Style) */}
      <div className="relative">
        <div className="h-48 lg:h-64 w-full relative overflow-hidden border-b border-[var(--border-color)]">
          <img src={bannerImg} className="w-full h-full object-cover opacity-80" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent"></div>
          {onNavigateBack && (
            <button onClick={onNavigateBack} className="absolute top-6 left-6 p-2 bg-[var(--bg-primary)]/40 backdrop-blur-md rounded-lg text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-all z-20 shadow-xl">
              <ArrowLeft size={18}/>
            </button>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative flex flex-col md:flex-row gap-6 -mt-16 pb-8">
          {/* Avatar / Logo Offset */}
          <div className="relative shrink-0 mx-auto md:mx-0">
             <div className="bg-[var(--bg-primary)] p-1 rounded-2xl shadow-2xl">
                <img 
                  src={user.avatar} 
                  className={`w-32 h-32 lg:w-40 lg:h-40 object-cover border border-[var(--border-color)] shadow-inner ${isInstitution ? 'rounded-xl' : 'rounded-full'}`} 
                  alt="Identity" 
                />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-[var(--bg-primary)] rounded-full p-1 shadow-lg border border-[var(--border-color)]">
                <AuthoritySeal role={authorityRole} size={28} />
             </div>
          </div>

          {/* Profile Basic Info */}
          <div className="flex-1 flex flex-col justify-end text-center md:text-left space-y-2 mb-2">
             <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <AuthoritySeal role={authorityRole} size={20} />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest border border-[var(--border-color)] px-2 py-0.5 rounded-full">{user.role}</span>
                </div>
             </div>
             <p className="text-xs text-slate-500 font-medium max-w-2xl line-clamp-1 italic">"{user.bio || 'Signal pending synchronization...'}"</p>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> {user.location || 'The Hill'}</span>
                <span className="flex items-center gap-1.5"><Globe size={12} className="text-indigo-500" /> {isInstitution ? 'Verified Hub' : 'Standard Node'}</span>
                <span className="flex items-center gap-1.5"><LinkIcon size={12}/> mak.ac.ug</span>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 self-center md:self-end">
             {isOwnProfile ? (
               <button onClick={() => setActiveTab('settings')} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[var(--border-color)] transition-all">
                  <Settings size={14}/> Edit Identity
               </button>
             ) : (
               <>
                 <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Follow Signal</button>
                 <button className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all"><MessageCircle size={18}/></button>
                 <button className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all"><MoreHorizontal size={18}/></button>
               </>
             )}
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (GitHub Inspired) */}
      <div className="border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl z-[40]">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 flex gap-8 overflow-x-auto no-scrollbar">
            {[
               { id: 'broadcasts', label: 'Broadcasts', icon: <Radio size={16}/>, count: user.postsCount },
               { id: 'intelligence', label: isInstitution ? 'Intelligence' : 'Repository', icon: <Database size={16}/> },
               { id: 'registry', label: 'Registry Logs', icon: <Clock size={16}/> },
               ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: <Settings size={16}/> }] : []),
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 relative ${
                     activeTab === tab.id ? 'border-orange-500 text-[var(--text-primary)]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
               >
                  {tab.icon} {tab.label}
                  {tab.count !== undefined && <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full text-[9px] ml-1">{tab.count}</span>}
               </button>
            ))}
         </div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Sidebar Column: Identity Metadata */}
            <div className="lg:col-span-4 space-y-10">
               <div className="space-y-6">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-4">Node Profile</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {user.bio || 'This node identity has not yet synchronized a personal bibliography to the central registry.'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                     <div className="flex items-center gap-3 text-slate-500">
                        <Users size={16}/>
                        <div className="text-[11px] font-medium">
                           <span className="text-[var(--text-primary)] font-black">{user.followersCount.toLocaleString()}</span> followers • <span className="text-[var(--text-primary)] font-black">{user.followingCount.toLocaleString()}</span> signals
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500">
                        <MapPin size={16}/>
                        <span className="text-[11px] font-medium">{user.location || 'Main Hill Node'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500">
                        <LinkIcon size={16}/>
                        <span className="text-[11px] font-medium text-indigo-600 hover:underline cursor-pointer">mak.ac.ug/registry/{user.id}</span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)]">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-4">Operational Sector</h3>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[9px] font-bold text-slate-600 rounded-lg">{user.college} HUB</span>
                       <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[9px] font-bold text-slate-600 rounded-lg">{user.status}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)]">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-4">{isInstitution ? 'Technical Services' : 'Competency Matrix'}</h3>
                    <div className="flex flex-wrap gap-2">
                       {(user.skills || (isInstitution ? ['Inquiry', 'Protocols', 'Sync'] : ['Logic', 'Analysis'])).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 text-[9px] font-black uppercase rounded border border-indigo-200 dark:border-indigo-500/20">{skill}</span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Main Column: Feed / Content */}
            <div className="lg:col-span-8">
               {activeTab === 'broadcasts' && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                     <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronized Signals</h4>
                        <div className="flex gap-2">
                           <button className="text-[9px] font-black uppercase bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Sort: Recent</button>
                        </div>
                     </div>
                     {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="p-6 bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-xl hover:border-indigo-500/30 transition-all space-y-4 group">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <img src={user.avatar} className="w-8 h-8 rounded-lg border border-[var(--border-color)]" />
                                 <div>
                                    <h5 className="text-[11px] font-black uppercase tracking-tight">{user.name} <span className="text-slate-400 font-normal lowercase ml-2">{post.timestamp}</span></h5>
                                 </div>
                              </div>
                              <Share2 size={14} className="text-slate-300 group-hover:text-slate-500 cursor-pointer" />
                           </div>
                           <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-sm text-[var(--text-primary)] leading-relaxed italic rich-content" />
                           {post.images?.[0] && <img src={post.images[0]} className="w-full rounded-lg border border-[var(--border-color)] max-h-96 object-cover" />}
                           <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-color)]">
                              <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 text-[10px] font-bold"><Heart size={14}/> {post.likes}</button>
                              <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-[10px] font-bold"><MessageCircle size={14}/> {post.commentsCount}</button>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center border border-dashed border-[var(--border-color)] rounded-xl space-y-4">
                           <Terminal size={32} className="mx-auto text-slate-300" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node has no active signal broadcasts.</p>
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'intelligence' && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2">
                     <div className="flex items-center gap-2 mb-4">
                        <Database size={18} className="text-indigo-600" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Metadata Registry</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                           { label: 'Network Alias', val: user.name },
                           { label: 'Authority Stratum', val: authorityRole || 'Standard Node' },
                           { label: 'Uplink Sector', val: user.college + ' Wing' },
                           { label: 'Status Code', val: user.status },
                           { label: 'Verified Integrity', val: user.verified ? 'VALIDATED' : 'PENDING' },
                           { label: 'Sync Date', val: 'JAN 2025' }
                        ].map((item, i) => (
                           <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex flex-col gap-1">
                              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{item.label}</span>
                              <span className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">{item.val}</span>
                           </div>
                        ))}
                     </div>
                     <div className="mt-10 p-8 border border-[var(--border-color)] rounded-xl bg-slate-50 dark:bg-black/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2"><Info size={14}/> Node README.md</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                           <p className="mb-4">This profile represents a verified node within the MakSocial Network. All signals transmitted from this node are subject to standard university protocol validation.</p>
                           <ul className="list-disc pl-5 space-y-2">
                              <li>Automated synchronization: ACTIVE</li>
                              <li>Security stratification: LEVEL 4</li>
                              <li>Identity hash: MD5_{user.id.slice(0,8)}</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'registry' && (
                  <div className="relative pl-8 space-y-10 animate-in slide-in-from-left-2">
                     <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--border-color)]"></div>
                     {timelineEvents.map((ev) => (
                        <div key={ev.id} className="relative group">
                           <div className={`absolute -left-[23px] top-0 w-4 h-4 rounded-full border-4 border-[var(--bg-primary)] ${ev.color} shadow-sm z-10`}></div>
                           <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] p-5 rounded-xl space-y-1 group-hover:border-indigo-500/30 transition-all shadow-sm">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ev.timestamp} • LOG</span>
                              <h4 className="text-sm font-black uppercase tracking-tight">{ev.title}</h4>
                              <p className="text-xs text-slate-500 italic font-medium">"{ev.description}"</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeTab === 'settings' && isOwnProfile && editForm && (
                  <div className="space-y-8 animate-in fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Alias Name</label>
                           <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector Pathway</label>
                           <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.education || ''} onChange={e => setEditForm({...editForm, education: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Bio</label>
                           <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none h-24 resize-none focus:border-indigo-600 transition-all" value={editForm.bio || ''} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                        </div>
                     </div>
                     <button onClick={handleSaveSettings} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
                        Commit registry updates
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
