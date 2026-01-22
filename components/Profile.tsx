
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, TimelineEvent as TimelineType, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, Book, Edit3, Heart, MessageCircle, Settings, 
  User as UserIcon, GraduationCap, Briefcase, Camera, Save, 
  Plus, X, Clock, Trash2, ArrowLeft, CheckCircle, Activity,
  Globe, Building2, ShieldCheck, Zap, Info, Calendar, Radio
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
  onNavigateToProfile?: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack, onNavigateToProfile }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'activity' | 'timeline' | 'settings' | 'about'>('activity');
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

  if (!user) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400">Scanning Identity Node...</div>;

  const handleSaveSettings = () => {
    if (editForm) {
      db.saveUser(editForm);
      setUser(editForm);
      alert("System Registry Updated Successfully.");
    }
  };

  const timelineEvents: TimelineType[] = [
    { id: 't1', title: 'Operational Milestone', description: 'Node status verified for current academic cycle.', timestamp: '2 days ago', type: 'achievement', color: 'bg-emerald-500' },
    { id: 't2', title: 'Broadcast Shared', description: 'Global signal transmitted across all active college wings.', timestamp: '1 week ago', type: 'post', color: 'bg-indigo-500' },
    { id: 't3', title: 'Registry Initialized', description: 'MakSocial identity matrix synchronized.', timestamp: '1 month ago', type: 'achievement', color: 'bg-rose-500' }
  ];

  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.badges?.includes('Official') ? 'Official' : user.badges?.includes('Corporate') ? 'Corporate' : user.verified ? 'Administrator' : undefined;
  const isInstitution = authorityRole === 'Official' || authorityRole === 'Corporate' || authorityRole === 'Super Admin';

  const banners: Record<string, string> = {
    'mak_unipod': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400',
    'mak_ailab': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400',
    'mak_library': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400',
    'vc_office': 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1400',
    'centenary_bank': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=1400',
    'stanbic_bank': 'https://images.unsplash.com/photo-1454165833767-02a6e30996d4?auto=format&fit=crop&w=1400',
    'covab_agro': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400'
  };
  const bannerImg = banners[user.id] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400';

  return (
    <div className={`max-w-[1600px] mx-auto pb-40 space-y-8 animate-in fade-in duration-700 ${isInstitution ? 'pt-0' : 'pt-8 px-4 lg:px-12'}`}>
      
      {/* 1. PROFILE HEADER SECTION */}
      {isInstitution ? (
        <header className="relative w-full overflow-hidden">
           {/* Cinematic Banner */}
           <div className="h-[350px] lg:h-[450px] w-full relative">
              <img src={bannerImg} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Back Button */}
              {onNavigateBack && (
                <button onClick={onNavigateBack} className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white/20 transition-all z-20">
                  <ArrowLeft size={24}/>
                </button>
              )}
           </div>

           {/* Brand Overlap */}
           <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative -mt-32 z-10">
              <div className="flex flex-col lg:flex-row items-end gap-8 pb-10">
                 <div className="relative shrink-0">
                    <img src={user.avatar} className="w-48 h-48 rounded-3xl border-8 border-[var(--bg-primary)] bg-white object-cover shadow-2xl" alt="Logo" />
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-2 shadow-2xl border-4 border-[var(--bg-primary)]">
                       <AuthoritySeal role={authorityRole} size={32} />
                    </div>
                 </div>
                 
                 <div className="flex-1 space-y-4 text-center lg:text-left mb-4">
                    <div className="flex flex-col lg:flex-row items-center gap-3">
                       <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h1>
                       <AuthoritySeal role={authorityRole} size={28} />
                    </div>
                    <div className="flex wrap items-center justify-center lg:justify-start gap-4">
                       <span className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                          <Building2 size={14}/> {user.role}
                       </span>
                       <span className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
                          <MapPin size={14} className="text-rose-500" /> {user.location || 'Makerere Main Hill'}
                       </span>
                       <span className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
                          <Globe size={14} className="text-sky-400" /> Verified Node
                       </span>
                    </div>
                 </div>

                 <div className="flex gap-3 mb-4">
                    <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Synchronize Hub</button>
                    <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all"><MessageCircle size={24}/></button>
                 </div>
              </div>
           </div>
        </header>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
             <div className="relative">
                <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-white/10 object-cover shadow-xl" alt="Profile" />
                {authorityRole && (
                  <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg border border-white/20">
                     <AuthoritySeal role={authorityRole} size={20} />
                  </div>
                )}
             </div>
             <div className="text-center lg:text-left space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                   <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">{user.name}</h2>
                   <AuthoritySeal role={authorityRole} size={24} />
                </div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">{user.role} • {user.college} Wing</p>
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                   <div className="text-center">
                      <p className="text-xl font-black">{user.followersCount.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Followers</p>
                   </div>
                   <div className="text-center">
                      <p className="text-xl font-black">{user.postsCount.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Broadcasts</p>
                   </div>
                   <div className="text-center">
                      <p className="text-xl font-black">{user.connections.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Nodes</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
             {isOwnProfile ? (
               <button onClick={() => setActiveTab('settings')} className="flex-1 lg:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">Edit Identity</button>
             ) : (
               <>
                 <button className="flex-1 lg:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">Connect Node</button>
                 <button className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-2xl hover:bg-indigo-600/5 hover:text-indigo-600 transition-all"><MessageCircle size={20}/></button>
               </>
             )}
          </div>
        </div>
      )}

      {/* 2. TABBED NAVIGATION */}
      <div className={`${isInstitution ? 'max-w-[1440px] mx-auto px-6 lg:px-12' : ''}`}>
         <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar gap-10">
            {[
               { id: 'activity', label: 'Feed Signals', icon: <Activity size={18}/> },
               { id: 'timeline', label: 'Registry Logs', icon: <Clock size={18}/> },
               { id: 'about', label: isInstitution ? 'Node Intelligence' : 'About User', icon: <Info size={18}/> },
               ...(isOwnProfile ? [{ id: 'settings', label: 'Terminal Settings', icon: <Settings size={18}/> }] : []),
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                     activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
               >
                  {tab.icon} {tab.label}
               </button>
            ))}
         </div>

         {/* 3. CONTENT AREA */}
         <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* Left Context Column */}
               <div className="lg:col-span-4 space-y-10">
                  {/* About Block */}
                  <div className="glass-card p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] space-y-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
                        {isInstitution ? <Building2 size={14}/> : <UserIcon size={14}/>} 
                        {isInstitution ? 'Registry Summary' : 'Identity Node'}
                     </h3>
                     <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                        "{user.bio || 'Initial signal state: No biography registry found for this identity node.'}"
                     </p>
                     
                     <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-600/5 text-indigo-600 rounded-lg"><MapPin size={16}/></div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase">Sector Location</p>
                              <p className="text-xs font-bold">{user.location || 'Makerere Main Campus'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-600/5 text-indigo-600 rounded-lg"><GraduationCap size={16}/></div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase">{isInstitution ? 'Primary Hub' : 'Education Pathway'}</p>
                              <p className="text-xs font-bold">{user.education || user.college + ' Wing'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-600/5 text-indigo-600 rounded-lg"><Calendar size={16}/></div>
                           <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase">Synchronization Date</p>
                              <p className="text-xs font-bold">Jan 12, 2025</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Skills/Services Block */}
                  <div className="glass-card p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] space-y-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-[var(--border-color)] pb-3">
                        {isInstitution ? 'Official Services' : 'Technical Skills'}
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {(user.skills || (isInstitution ? ['Information', 'Events', 'Inquiry'] : ['Communication', 'Leadership'])).map(skill => (
                           <span key={skill} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 text-[9px] font-black uppercase rounded-lg border border-[var(--border-color)] text-slate-500">{skill}</span>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Main Content */}
               <div className="lg:col-span-8 space-y-8">
                  {activeTab === 'activity' && (
                     <div className="space-y-8 animate-in fade-in duration-500">
                        {posts.length > 0 ? posts.map(post => (
                           <div key={post.id} className="p-8 bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-3xl shadow-sm space-y-6 group hover:border-indigo-500/50 transition-all">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <img src={user.avatar} className="w-12 h-12 rounded-2xl border border-[var(--border-color)]" />
                                    <div>
                                       <div className="flex items-center gap-2">
                                          <h4 className="text-sm font-black uppercase tracking-tight">{user.name}</h4>
                                          <AuthoritySeal role={authorityRole} size={14} />
                                       </div>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{post.timestamp} • SIGNAL TRANSMITTED</p>
                                    </div>
                                 </div>
                                 <button className="text-slate-300 hover:text-indigo-600"><Zap size={18}/></button>
                              </div>
                              <p className="text-base text-[var(--text-primary)] font-medium leading-relaxed italic">"{post.content}"</p>
                              {post.images?.[0] && <img src={post.images[0]} className="w-full rounded-2xl border border-[var(--border-color)] shadow-xl" />}
                              <div className="flex items-center gap-8 pt-6 border-t border-[var(--border-color)]">
                                 <button className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest"><Heart size={20}/> {post.likes.toLocaleString()}</button>
                                 <button className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest"><MessageCircle size={20}/> {post.commentsCount}</button>
                              </div>
                           </div>
                        )) : (
                           <div className="py-40 text-center space-y-6 border border-dashed border-[var(--border-color)] rounded-3xl">
                              <Radio size={48} className="mx-auto text-slate-300 animate-pulse" />
                              <div>
                                 <h4 className="text-xl font-black text-slate-400 uppercase tracking-tighter italic">Signal Silence</h4>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">No active broadcasts found in this node.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'timeline' && (
                     <div className="relative pl-12 space-y-12 animate-in slide-in-from-left-5">
                        <div className="absolute left-[23px] top-2 bottom-2 w-px bg-[var(--border-color)]"></div>
                        {timelineEvents.map((ev, i) => (
                           <div key={ev.id} className="relative group">
                              <div className={`absolute -left-[32px] top-0 w-10 h-10 rounded-2xl ${ev.color} flex items-center justify-center text-white shadow-xl z-10 transition-transform group-hover:scale-110`}>
                                 {ev.type === 'achievement' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                              </div>
                              <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] p-8 rounded-3xl space-y-2 group-hover:border-indigo-500/30 transition-all shadow-sm">
                                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ev.timestamp} • REGISTRY ENTRY</span>
                                 <h4 className="text-xl font-black uppercase text-[var(--text-primary)] tracking-tight">{ev.title}</h4>
                                 <p className="text-sm text-slate-500 font-medium italic leading-relaxed">"{ev.description}"</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}

                  {activeTab === 'settings' && isOwnProfile && editForm && (
                     <div className="glass-card p-10 space-y-12 animate-in fade-in">
                        <div className="space-y-1">
                           <h3 className="text-3xl font-black uppercase tracking-tighter italic">Terminal Configuration</h3>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Modify Identity registry logic</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alias/Node Name</label>
                              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registry Rank (Role)</label>
                              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Bio</label>
                              <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none h-32 resize-none focus:border-indigo-600 transition-all" value={editForm.bio || ''} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector Pathway</label>
                              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.education || ''} onChange={e => setEditForm({...editForm, education: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registry Location</label>
                              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={editForm.location || ''} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                           </div>
                        </div>
                        <div className="flex justify-end pt-8">
                           <button onClick={handleSaveSettings} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 flex items-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all">
                              <Save size={20}/> Commit registry changes
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
