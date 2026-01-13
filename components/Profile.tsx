
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Notification, Post } from '../types';
import { 
  Mail, MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Grid, 
  Users, Layout, Award, Save, X, Camera, Bell, ShieldAlert, 
  Info, Heart, Plus, MoreVertical, Layers, Bookmark, Settings,
  Image as ImageIcon, MessageCircle
} from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>(db.getUser());
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'notifs'>('posts');

  useEffect(() => {
    const sync = () => {
        const current = db.getUser();
        setUser(current);
        setEditForm(current);
        const allPosts = db.getPosts();
        setPosts(allPosts.filter(p => p.authorId === current.id));
    };
    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    db.saveUser(editForm);
    setUser(editForm);
    setIsEditing(false);
  };

  const unreadCount = (user.notifications || []).filter(n => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-10 pb-32">
      <div className="relative group rounded-[3rem] overflow-hidden bg-[var(--bg-secondary)] shadow-2xl border border-white/5">
        <div className="h-72 w-full relative overflow-hidden">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" 
            className="w-full h-full object-cover brightness-75 transition-transform duration-1000 group-hover:scale-105"
            alt="University Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
        </div>

        <div className="px-8 pb-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-500 rounded-[2.5rem] blur opacity-40 group-hover/avatar:opacity-100 transition duration-1000 group-hover/avatar:duration-200"></div>
                <div className="relative">
                  <img 
                    src={isEditing ? editForm.avatar : user.avatar} 
                    className="w-48 h-48 rounded-[2.2rem] object-cover border-8 border-brand-dark shadow-2xl transition-all"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-brand-dark rounded-full shadow-lg"></div>
                </div>
              </div>

              <div className="text-center lg:text-left space-y-3 pb-2">
                {isEditing ? (
                  <div className="space-y-3 min-w-[300px]">
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-2xl font-black text-white focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Name"
                    />
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-2 text-indigo-400 font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      placeholder="Role"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                       <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">{user.name}</h1>
                       <Award className="text-indigo-500" size={24} />
                    </div>
                    <p className="text-xl text-indigo-400 font-bold italic tracking-wide">{user.role}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 justify-center lg:justify-start">
                       <span className="flex items-center gap-2"><MapPin size={14}/> {user.college}</span>
                       <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                       <span className="flex items-center gap-2"><Calendar size={14}/> {user.status}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 active:scale-95"><Save size={18} /> Sync Identity</button>
                  <button onClick={() => setIsEditing(false)} className="bg-white/5 text-slate-400 px-6 py-4 rounded-2xl border border-white/10 transition-all font-black text-xs uppercase tracking-widest">Abort</button>
                </>
              ) : (
                <button onClick={() => { setEditForm(user); setIsEditing(true); }} className="bg-white text-brand-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:bg-slate-200 flex items-center gap-2 active:scale-95"><Edit3 size={18} /> Edit node</button>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white/5 rounded-3xl border border-white/5">
             {[
               { label: 'Broadcasts', val: user.postsCount || 0, icon: <Layout size={16}/> },
               { label: 'Followers', val: user.followersCount || 0, icon: <Users size={16}/> },
               { label: 'Following', val: user.followingCount || 0, icon: <Users size={16}/> },
               { label: 'Impact Score', val: user.totalLikesCount || 0, icon: <Heart size={16}/> },
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center justify-center p-6 bg-brand-dark/40 rounded-2xl border border-white/5 hover:bg-white/5 transition-all group">
                  <div className="text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors">{stat.icon}</div>
                  <span className="text-2xl font-black text-white italic">{stat.val.toLocaleString()}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">{stat.label}</span>
               </div>
             ))}
          </div>

          {!isEditing && (
            <div className="mt-10 px-4">
               <p className="text-lg text-slate-400 leading-relaxed italic max-w-4xl border-l-4 border-indigo-600 pl-8 py-2">
                 {user.bio || 'Node active. Awaiting biography sequence initialization from the hub master.'}
               </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-10 border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
           {[
             { id: 'posts', label: 'Identity Feed', icon: <Grid size={18}/> },
             { id: 'media', label: 'Media Vault', icon: <ImageIcon size={18}/> },
             { id: 'notifs', label: 'Signal Stream', icon: <Bell size={18}/>, count: unreadCount },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 pb-5 transition-all border-b-2 font-black text-[11px] uppercase tracking-[0.2em] relative whitespace-nowrap ${
                 activeTab === tab.id ? 'text-indigo-500 border-indigo-500' : 'text-slate-600 border-transparent'
               }`}
             >
               {tab.icon} {tab.label}
               {tab.count !== undefined && tab.count > 0 && (
                 <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">{tab.count}</span>
               )}
             </button>
           ))}
        </div>

        <div className="animate-in fade-in duration-700">
           {activeTab === 'posts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="glass-card overflow-hidden group/card bg-white/[0.02] border-white/5 hover:border-indigo-500/30 transition-all flex flex-col h-full">
                     <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded">Broadcast</span>
                           <button className="text-slate-700 hover:text-white"><MoreVertical size={16}/></button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 font-medium italic">"{post.content}"</p>
                        {post.images?.[0] && (
                           <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video mt-4 shadow-xl">
                              <img src={post.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                           </div>
                        )}
                     </div>
                     <div className="p-5 border-t border-white/5 flex items-center justify-between bg-black/20">
                        <div className="flex gap-4">
                           <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black italic"><Heart size={14} fill="currentColor"/> {post.likes}</span>
                           <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black italic"><MessageCircle size={14}/> {post.commentsCount}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-700 uppercase">{post.timestamp}</span>
                     </div>
                  </div>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-700 italic font-black text-xs uppercase">No active signals found.</div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
