
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post, TimelineEvent as TimelineType, AuthorityRole } from '../types';
import { AuthoritySeal } from './Feed'; // Import modern tick component
import { 
  MapPin, Book, Edit3, Heart, MessageCircle, Settings, 
  User as UserIcon, GraduationCap, Briefcase, Camera, Save, 
  Plus, X, Clock, Trash2, ArrowLeft, CheckCircle, Activity
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'activity' | 'timeline' | 'settings'>('activity');
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

  if (!user) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400">Scanning Identity...</div>;

  const handleSaveSettings = () => {
    if (editForm) {
      db.saveUser(editForm);
      setUser(editForm);
      alert("System Registry Updated Successfully.");
    }
  };

  const timelineEvents: TimelineType[] = [
    { id: 't1', title: 'Achieved Finalist Status', description: 'Promoted to year stratum Finalist in the university registry.', timestamp: '2 days ago', type: 'achievement', color: 'bg-emerald-500' },
    { id: 't2', title: 'Shared Academic Asset', description: 'Uploaded COCIS Test Notes v2.1 to the repository.', timestamp: '1 week ago', type: 'post', color: 'bg-indigo-500' },
    { id: 't3', title: 'Profile Initialized', description: 'MakSocial identity node activated.', timestamp: '1 month ago', type: 'achievement', color: 'bg-rose-500' }
  ];

  // Logic for verification tick on profile
  const authorityRole: AuthorityRole | undefined = user.badges?.includes('Super Admin') ? 'Super Admin' : user.badges?.includes('Official') ? 'Official' : user.badges?.includes('Corporate') ? 'Corporate' : user.verified ? 'Administrator' : undefined;

  return (
    <div className="max-w-[1440px] mx-auto py-8 px-4 lg:px-12 pb-32 space-y-8 animate-in fade-in duration-500">
      {onNavigateBack && !isOwnProfile && (
        <button onClick={onNavigateBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all mb-4">
          <ArrowLeft size={16}/> Back to Scan
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: About Me */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card bg-[var(--sidebar-bg)] border-t-4 border-indigo-500 rounded-xl shadow-md overflow-hidden transition-theme">
             <div className="p-8 flex flex-col items-center border-b border-[var(--border-color)]">
                <div className="relative mb-6">
                   <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-white/10 object-cover shadow-xl" alt="Profile" />
                   {authorityRole && (
                     <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg border border-white/20">
                        <AuthoritySeal role={authorityRole} size={20} />
                     </div>
                   )}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                   <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">{user.name}</h2>
                   <AuthoritySeal role={authorityRole} size={18} />
                </div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">{user.role}</p>
                <div className="flex gap-4 text-center w-full">
                   <div className="flex-1">
                      <p className="text-sm font-black">{user.followersCount.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Followers</p>
                   </div>
                   <div className="flex-1 border-x border-[var(--border-color)]">
                      <p className="text-sm font-black">{user.postsCount.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Broadcasts</p>
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black">{user.connections.toLocaleString()}</p>
                      <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Connections</p>
                   </div>
                </div>
             </div>

             <div className="p-8 space-y-6">
                <section className="space-y-2">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                      <UserIcon size={14}/> About Me
                   </h3>
                   <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic">
                      {user.bio || 'Signal pending... Identity initialized but biography registry is empty.'}
                   </p>
                </section>

                <section className="space-y-3">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                      <GraduationCap size={14}/> Education
                   </h3>
                   <p className="text-xs font-bold text-[var(--text-primary)]">
                      {user.education || 'Makerere University'}
                   </p>
                </section>

                <section className="space-y-3">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                      <MapPin size={14}/> Location
                   </h3>
                   <p className="text-xs font-bold text-[var(--text-primary)]">
                      {user.location || 'Kampala, Uganda'}
                   </p>
                </section>

                <section className="space-y-3">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                      <Settings size={14}/> Skills
                   </h3>
                   <div className="flex flex-wrap gap-1.5">
                      {(user.skills || ['Communication', 'Leadership']).map(skill => (
                         <span key={skill} className="px-2 py-1 bg-indigo-600/10 text-indigo-600 text-[8px] font-black uppercase rounded border border-indigo-600/20">{skill}</span>
                      ))}
                   </div>
                </section>
             </div>
          </div>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-8">
           <div className="glass-card bg-[var(--sidebar-bg)] rounded-xl shadow-md border border-[var(--border-color)] transition-theme h-full flex flex-col">
              <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                 {[
                   { id: 'activity', label: 'Activity', icon: <Activity size={16}/> },
                   { id: 'timeline', label: 'Timeline', icon: <Clock size={16}/> },
                   ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: <Settings size={16}/> }] : []),
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-2 px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                        activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     {tab.icon} {tab.label}
                   </button>
                 ))}
              </div>

              <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
                 {activeTab === 'activity' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       {posts.map(post => (
                         <div key={post.id} className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-[var(--border-color)] rounded-2xl space-y-4">
                            <div className="flex items-center gap-3">
                               <img src={user.avatar} className="w-10 h-10 rounded-xl" />
                               <div>
                                  <div className="flex items-center gap-1">
                                     <h4 className="text-sm font-black uppercase">{user.name}</h4>
                                     <AuthoritySeal role={authorityRole} size={14} />
                                  </div>
                                  <p className="text-[9px] text-slate-500 font-bold">{post.timestamp}</p>
                               </div>
                            </div>
                            <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed italic">"{post.content}"</p>
                            {post.images?.[0] && <img src={post.images[0]} className="w-full rounded-xl max-h-80 object-cover shadow-lg" />}
                            <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-color)]">
                               <button className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black"><Heart size={16}/> {post.likes}</button>
                               <button className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black"><MessageCircle size={16}/> {post.commentsCount}</button>
                            </div>
                         </div>
                       ))}
                       {posts.length === 0 && <div className="py-20 text-center text-slate-400 italic text-xs uppercase font-black">No recent signals found for this node.</div>}
                    </div>
                 )}

                 {activeTab === 'timeline' && (
                    <div className="relative pl-8 space-y-12 animate-in slide-in-from-left-5 duration-500">
                       <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[var(--border-color)]"></div>
                       {timelineEvents.map((ev, i) => (
                          <div key={ev.id} className="relative">
                             <div className={`absolute -left-[27px] top-0 w-8 h-8 rounded-full ${ev.color} flex items-center justify-center text-white shadow-lg z-10`}>
                                {ev.type === 'achievement' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                             </div>
                             <div className="bg-slate-50 dark:bg-white/[0.02] border border-[var(--border-color)] p-5 rounded-2xl space-y-1">
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ev.timestamp}</span>
                                <h4 className="text-sm font-black uppercase text-[var(--text-primary)]">{ev.title}</h4>
                                <p className="text-xs text-slate-500 font-medium italic">{ev.description}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}

                 {activeTab === 'settings' && editForm && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                       <h3 className="text-xl font-black uppercase tracking-tight italic border-b border-[var(--border-color)] pb-4">Terminal Configuration</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Public Name</label>
                             <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Platform Rank (Role)</label>
                             <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">About Me (Bio)</label>
                             <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none h-24 resize-none" value={editForm.bio || ''} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Education Pathway</label>
                             <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none" value={editForm.education || ''} onChange={e => setEditForm({...editForm, education: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Physical Location</label>
                             <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none" value={editForm.location || ''} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Skills Matrix (Comma Separated)</label>
                             <input 
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none" 
                                value={editForm.skills?.join(', ') || ''} 
                                onChange={e => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})} 
                             />
                          </div>
                       </div>
                       <div className="flex justify-end pt-6">
                          <button onClick={handleSaveSettings} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                             <Save size={18}/> Commit Registry Changes
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
