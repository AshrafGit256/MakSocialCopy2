
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Notification, Post } from '../types';
// Fix: Added Image (as ImageIcon) and MessageCircle to imports
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
    const current = db.getUser();
    setUser(current);
    setEditForm(current);
    // Get only user's posts
    const allPosts = db.getPosts();
    setPosts(allPosts.filter(p => p.authorId === current.id));
  }, []);

  const handleSave = () => {
    db.saveUser(editForm);
    setUser(editForm);
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    const newAvatar = prompt("Enter a direct URL to your new profile picture:", user.avatar);
    if (newAvatar) {
      setEditForm({...editForm, avatar: newAvatar});
    }
  };

  const unreadCount = (user.notifications || []).filter(n => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-10 pb-32">
      {/* Header Section */}
      <div className="relative group rounded-[3rem] overflow-hidden bg-[var(--bg-secondary)] shadow-2xl border border-white/5">
        {/* Banner */}
        <div className="h-72 w-full relative overflow-hidden">
          <img 
            src="https://cocis.mak.ac.ug/wp-content/uploads/2023/11/cropped-310964315_406158288372038_8724847734355824283_n.jpg" 
            className="w-full h-full object-cover brightness-75 transition-transform duration-1000 group-hover:scale-105"
            alt="University Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
          
          <div className="absolute top-6 right-6 flex gap-3">
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
               <Share2 size={20} />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
               <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Profile Info & Stats */}
        <div className="px-8 pb-8 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
              {/* Avatar */}
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 via-purple-500 to-rose-500 rounded-[2.5rem] blur opacity-75 group-hover/avatar:opacity-100 transition duration-1000 group-hover/avatar:duration-200 animate-gradient-xy"></div>
                <div className="relative">
                  <img 
                    src={isEditing ? editForm.avatar : user.avatar} 
                    className="w-48 h-48 rounded-[2.2rem] object-cover border-8 border-brand-dark shadow-2xl transition-all"
                    alt="Profile"
                  />
                  {isEditing && (
                    <button 
                      onClick={handleAvatarChange}
                      className="absolute inset-0 bg-black/60 rounded-[2.2rem] flex flex-col items-center justify-center text-white font-black text-xs opacity-0 group-hover/avatar:opacity-100 transition-opacity uppercase tracking-widest"
                    >
                      <Camera className="mb-2" size={24} />
                      Replace
                    </button>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-brand-dark rounded-full shadow-lg"></div>
                </div>
              </div>

              {/* Bio Details */}
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

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
                  >
                    <Save size={18} /> Sync Identity
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-4 rounded-2xl border border-white/10 transition-all font-black text-xs uppercase tracking-widest"
                  >
                    Abort
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setEditForm(user); setIsEditing(true); }}
                    className="bg-white text-brand-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:bg-slate-200 flex items-center gap-2 active:scale-95"
                  >
                    <Edit3 size={18} /> Edit node
                  </button>
                  <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                     <Plus size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white/5 rounded-3xl border border-white/5">
             {[
               { label: 'Broadcasts', val: posts.length || user.postsCount || 0, icon: <Layout size={16}/> },
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

          {isEditing ? (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Digital Signature (Bio)</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-slate-300 italic focus:ring-2 focus:ring-indigo-600 outline-none min-h-[150px] resize-none leading-relaxed"
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Write your story..."
              />
            </div>
          ) : (
            <div className="mt-10 px-4">
               <p className="text-lg text-slate-400 leading-relaxed italic max-w-4xl border-l-4 border-indigo-600 pl-8 py-2">
                 {user.bio || 'Node active. Awaiting biography sequence initialization from the hub master.'}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
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
                 activeTab === tab.id 
                 ? 'text-indigo-500 border-indigo-500' 
                 : 'text-slate-600 border-transparent hover:text-slate-400'
               }`}
             >
               {tab.icon}
               {tab.label}
               {tab.count !== undefined && tab.count > 0 && (
                 <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">{tab.count}</span>
               )}
             </button>
           ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="animate-in fade-in duration-700">
           {activeTab === 'posts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.length > 0 ? posts.map(post => (
                  <div key={post.id} className="glass-card overflow-hidden group/card bg-white/[0.02] border-white/5 hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full">
                     <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded">Broadcast</span>
                           <button className="text-slate-700 hover:text-white"><MoreVertical size={16}/></button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 font-medium italic">"{post.content}"</p>
                        {post.images && post.images.length > 0 && (
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
                )) : (
                  <div className="col-span-full py-32 text-center glass-card bg-white/[0.01] rounded-[3rem] border-dashed">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Layers size={32} className="text-slate-700" />
                     </div>
                     <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Zero Broadcasts Found</h4>
                     <p className="text-slate-600 mt-2 text-sm font-medium">Your identity has no active signals in the hub.</p>
                     <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">Publish Signal</button>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'media' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {posts.filter(p => p.images).map((p, i) => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group/media border border-white/10 shadow-lg cursor-pointer">
                       <img src={p.images![0]} className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110" />
                       <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                          <Bookmark className="text-white" size={24} />
                       </div>
                    </div>
                 ))}
                 {posts.every(p => !p.images) && (
                   <div className="col-span-full py-32 text-center text-slate-600 font-black uppercase italic tracking-widest text-xs">The media vault is currently offline.</div>
                 )}
              </div>
           )}

           {activeTab === 'notifs' && (
              <div className="space-y-4 max-w-4xl mx-auto">
                 {user.notifications?.length ? user.notifications.map(notif => (
                    <div key={notif.id} className={`p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-6 group/notif ${notif.type === 'moderation' ? 'border-rose-500/20 bg-rose-500/[0.02] hover:bg-rose-500/[0.04]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                       <div className={`p-4 rounded-2xl shadow-lg ${notif.type === 'moderation' ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-indigo-500/20 text-indigo-400'}`}>
                          {notif.type === 'moderation' ? <ShieldAlert size={22}/> : <Info size={22}/>}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover/notif:text-indigo-400 transition-colors">{notif.type} protocol • {notif.timestamp}</span>
                             {!notif.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>}
                          </div>
                          <p className="text-base font-bold text-slate-300 leading-relaxed italic">"{notif.message}"</p>
                       </div>
                    </div>
                 )) : (
                    <div className="py-32 text-center bg-white/[0.01] rounded-[3rem] border border-white/5 border-dashed">
                       <Bell className="mx-auto text-slate-800 mb-6" size={48} />
                       <p className="text-slate-600 font-black uppercase italic tracking-widest text-xs">No active signal fragments found in the stream.</p>
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Profile;