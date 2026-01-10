
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Notification } from '../types';
import { Mail, MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Grid, Users, Layout, Award, Save, X, Camera, Bell, ShieldAlert, Info } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>(db.getUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>(db.getUser());
  const [activeTab, setActiveTab] = useState<'posts' | 'notifs'>('posts');

  useEffect(() => {
    setUser(db.getUser());
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
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      <div className="glass-card rounded-3xl overflow-hidden relative">
        <div className="h-64 relative">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" 
            className="w-full h-full object-cover brightness-50"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>
        
        <div className="px-10 pb-10 relative -mt-32 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full max-w-4xl">
            <div className="relative group">
               <img 
                src={isEditing ? editForm.avatar : user.avatar} 
                className={`w-44 h-44 rounded-3xl object-cover border-8 border-[var(--bg-primary)] shadow-2xl transition-all ${isEditing ? 'brightness-50' : ''}`}
                alt="Profile"
              />
              {isEditing && (
                <button 
                  onClick={handleAvatarChange}
                  className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold text-xs"
                >
                  <Camera className="mb-2" />
                  Change Photo
                </button>
              )}
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-[var(--bg-primary)] rounded-full"></div>
            </div>
            <div className="md:mb-4 w-full">
              {isEditing ? (
                <div className="space-y-4 mt-4 w-full">
                  <input 
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-2xl font-black text-[var(--text-primary)]"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Full Name"
                  />
                  <input 
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-blue-400"
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    placeholder="Role (e.g. CS Student)"
                  />
                  <textarea 
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-slate-400 resize-none"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">{user.name}</h1>
                  <p className="text-blue-400 font-medium text-lg">{user.role}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{user.email || 'student@mak.ac.ug'}</p>
                    <span className="text-slate-300">•</span>
                    <p className="text-xs text-blue-500 font-black uppercase tracking-widest">{user.college}</p>
                  </div>
                  <p className="mt-4 text-slate-400 leading-relaxed max-w-2xl">{user.bio || 'No bio provided yet.'}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mb-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Save size={18} /> Save
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-black/5 hover:bg-black/10 text-slate-400 px-4 py-3 rounded-2xl border border-black/10"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setEditForm(user); setIsEditing(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-4 border-b border-black/5 dark:border-white/5 pb-4">
               <button 
                 onClick={() => setActiveTab('posts')}
                 className={`px-6 py-2 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 My Activity
               </button>
               <button 
                 onClick={() => setActiveTab('notifs')}
                 className={`px-6 py-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'notifs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Notifications
                 {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center animate-pulse">{unreadCount}</span>}
               </button>
            </div>

            {activeTab === 'posts' && (
              <div className="glass-card p-12 rounded-[2.5rem] text-center">
                 <Grid className="mx-auto text-slate-300 mb-4" size={40} />
                 <h4 className="text-xl font-black text-[var(--text-primary)]">Post History</h4>
                 <p className="text-slate-500 mt-2">Browse through your previous interactions and shared content.</p>
              </div>
            )}

            {activeTab === 'notifs' && (
              <div className="space-y-4">
                 {(!user.notifications || user.notifications.length === 0) ? (
                   <div className="glass-card p-12 rounded-[2.5rem] text-center">
                      <Bell className="mx-auto text-slate-300 mb-4" size={40} />
                      <p className="text-slate-500 font-bold italic">No notifications yet.</p>
                   </div>
                 ) : (
                   user.notifications.map(notif => (
                     <div key={notif.id} className={`glass-card p-6 rounded-2xl border flex items-start gap-4 ${notif.type === 'moderation' ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-black/5 dark:border-white/5'}`}>
                        <div className={`p-3 rounded-xl ${notif.type === 'moderation' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                           {notif.type === 'moderation' ? <ShieldAlert size={20}/> : <Info size={20}/>}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{notif.type} • {notif.timestamp}</p>
                              {!notif.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                           </div>
                           <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">{notif.message}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="glass-card p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/10 border">
               <h3 className="font-black text-xs uppercase tracking-widest text-indigo-500 mb-6 flex items-center gap-2">
                  <Award size={16}/> Badges & Achievements
               </h3>
               <div className="flex flex-wrap gap-2">
                  {(user.badges || []).length > 0 ? user.badges.map(b => (
                    <div key={b.id} className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex items-center gap-2 shadow-sm">
                       <span className="text-lg">{b.icon}</span>
                       <span className={`text-[10px] font-black uppercase tracking-tight ${b.color}`}>{b.name}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 font-medium italic">Participate more to earn badges.</p>
                  )}
               </div>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border-black/5 dark:border-white/5">
               <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Network Insights</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Connections</p>
                     <p className="text-xl font-black italic">{user.connections}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Applications</p>
                     <p className="text-xl font-black italic">{user.appliedTo?.length || 0}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
