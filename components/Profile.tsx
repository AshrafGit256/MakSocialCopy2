
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Notification, Post } from '../types';
import { AuthoritySeal } from './Feed';
import { 
  Mail, MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Grid, 
  Users, Layout, Award, Save, X, Camera, Bell, ShieldAlert, 
  Info, Heart, Plus, MoreVertical, Layers, Bookmark, Settings,
  Image as ImageIcon, MessageCircle, ArrowLeft, Send, Zap, Orbit, Link2,
  ShieldCheck, Brain
} from 'lucide-react';

interface ProfileProps {
  userId?: string;
  onNavigateBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, onNavigateBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'notifs'>('posts');
  const [isRequesting, setIsRequesting] = useState(false);
  
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const sync = () => {
        const targetId = userId || currentUser.id;
        const users = db.getUsers();
        const profileUser = users.find(u => u.id === targetId) || currentUser;
        
        setUser(profileUser);
        setEditForm(profileUser);
        
        const allPosts = db.getPosts();
        setPosts(allPosts.filter(p => p.authorId === targetId));
    };
    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, [userId, currentUser.id]);

  const handleConnect = () => {
    if (!user) return;
    setIsRequesting(true);
    db.sendRequest(currentUser.id, user.id);
    setTimeout(() => {
      setIsRequesting(false);
    }, 1000);
  };

  if (!user) return <div className="p-20 text-center font-black uppercase italic tracking-widest text-slate-400">Loading Node...</div>;

  const handleSave = () => {
    if (editForm) {
      db.saveUser(editForm);
      setUser(editForm);
      setIsEditing(false);
    }
  };

  const isConnected = currentUser.connectionsList.includes(user.id);
  const hasPending = user.pendingRequests.includes(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-10 pb-32">
      {onNavigateBack && !isOwnProfile && (
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all mb-4"
        >
          <ArrowLeft size={16}/> Return to Scan
        </button>
      )}

      {user.isSuspended && (
        <div className="bg-rose-500 text-white p-4 rounded-2xl flex items-center gap-4 shadow-xl shadow-rose-500/20 border border-rose-400">
           <ShieldAlert size={24} className="animate-pulse"/>
           <div>
              <p className="text-xs font-black uppercase tracking-widest">Protocol Halted by Command</p>
              <p className="text-[10px] font-bold opacity-80 uppercase">This node is currently suspended from the synchronization grid.</p>
           </div>
        </div>
      )}

      <div className="relative group rounded-[3rem] overflow-hidden bg-[var(--sidebar-bg)] shadow-xl border border-[var(--border-color)] transition-theme">
        <div className="h-72 w-full relative overflow-hidden">
          <img 
            src="https://cocis.mak.ac.ug/wp-content/uploads/2023/11/cropped-310964315_406158288372038_8724847734355824283_n.jpg" 
            className="w-full h-full object-cover brightness-90 dark:brightness-75 transition-transform duration-1000 group-hover:scale-105"
            alt="University Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="px-8 pb-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-500 rounded-full blur opacity-40 group-hover/avatar:opacity-100 transition duration-1000 group-hover/avatar:duration-200"></div>
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    className="w-48 h-48 rounded-full object-cover border-8 border-[var(--sidebar-bg)] shadow-2xl transition-all"
                    alt="Profile"
                  />
                  <div className="absolute bottom-2 right-2 scale-150">
                     <AuthoritySeal isVerified={user.isVerified} role={user.badges.includes('Super Admin') ? 'Super Admin' : undefined} size="md" />
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left space-y-3 pb-2">
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                       <h1 className="text-5xl font-extrabold text-[var(--text-primary)] dark:text-white tracking-tighter uppercase leading-none">{user.name}</h1>
                       <div className="flex items-center gap-2">
                          {user.medals.map(m => (
                             <span key={m.id} title={m.name} className="text-2xl cursor-help drop-shadow-lg">{m.icon}</span>
                          ))}
                       </div>
                  </div>
                  <p className="text-xl text-indigo-600 dark:text-indigo-400 font-bold tracking-wide uppercase flex items-center justify-center lg:justify-start gap-3">
                    {user.role} 
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-400">{user.courseAbbr}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 justify-center lg:justify-start">
                       <span className="flex items-center gap-2"><MapPin size={14}/> {user.college}</span>
                       <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                       <span className="flex items-center gap-2"><ShieldCheck size={14}/> {user.academicLevel}</span>
                       <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                       <span className="flex items-center gap-2"><Zap size={14}/> {user.status}</span>
                  </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <button onClick={() => { setEditForm(user); setIsEditing(true); }} className="bg-white dark:bg-white/10 text-slate-900 dark:text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-white/20 flex items-center gap-2 active:scale-95"><Edit3 size={18} /> Edit node</button>
              ) : (
                <>
                  <button 
                    onClick={handleConnect}
                    disabled={isConnected || hasPending || isRequesting}
                    className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 active:scale-95 ${
                      isConnected 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                      : hasPending || isRequesting ? 'bg-slate-100 text-slate-400 border border-[var(--border-color)]' : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700'
                    }`}
                  >
                    {isConnected ? <Link2 size={18}/> : <Zap size={18}/>}
                    {isConnected ? 'Linked Node' : hasPending || isRequesting ? 'Signal Transmitting...' : 'Initialize Neural Link'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] shadow-inner">
             {[
               { label: 'Broadcasts', val: user.postsCount || 0, icon: <Layout size={16}/> },
               { label: 'Connections', val: user.connectionsList.length || 0, icon: <Orbit size={16}/> },
               { label: 'Followers', val: user.followersCount || 0, icon: <Users size={16}/> },
               { label: 'Impact Score', val: user.totalLikesCount || 0, icon: <Heart size={16}/> },
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center justify-center p-6 bg-[var(--sidebar-bg)] rounded-2xl border border-[var(--border-color)] hover:shadow-md transition-all group">
                  <div className="text-slate-400 mb-2 group-hover:text-indigo-600 transition-colors">{stat.icon}</div>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stat.val.toLocaleString()}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{stat.label}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-10 border-b border-[var(--border-color)] px-4 overflow-x-auto no-scrollbar">
           {[
             { id: 'posts', label: 'Identity Feed', icon: <Grid size={18}/> },
             { id: 'media', label: 'Media Vault', icon: <ImageIcon size={18}/> },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 pb-5 transition-all border-b-2 font-black text-[11px] uppercase tracking-[0.2em] relative whitespace-nowrap ${
                 activeTab === tab.id ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'
               }`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        <div className="animate-in fade-in duration-700">
           {activeTab === 'posts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="glass-card overflow-hidden group/card bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500 transition-all flex flex-col h-full shadow-sm">
                     <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded">Broadcast</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 font-normal font-sans">{post.content}</p>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
