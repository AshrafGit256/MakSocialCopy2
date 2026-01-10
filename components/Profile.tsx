
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User } from '../types';
import { Mail, MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Grid, Users, Layout, Award, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>(db.getUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>(db.getUser());

  const handleSave = () => {
    db.saveUser(editForm);
    setUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl overflow-hidden relative">
        <div className="h-64 relative">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" 
            className="w-full h-full object-cover brightness-50"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent"></div>
        </div>
        
        <div className="px-10 pb-10 relative -mt-32 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative">
               <img 
                src={user.avatar} 
                className="w-44 h-44 rounded-3xl object-cover border-8 border-[#0a0f18] shadow-2xl"
                alt="Profile"
              />
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-[#0a0f18] rounded-full"></div>
            </div>
            <div className="md:mb-4 w-full md:max-w-md">
              {isEditing ? (
                <div className="space-y-2 mt-4">
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl font-black text-white"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Full Name"
                  />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-blue-400"
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    placeholder="Role (e.g. CS Student)"
                  />
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-slate-400 mt-2 resize-none"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                  <p className="text-blue-400 font-medium text-lg">{user.role}, Makerere University</p>
                  <p className="mt-4 text-slate-400">{user.bio}</p>
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
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/5"
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
                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/5 transition-all">
                  <Share2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex space-x-2 bg-[#1a1f2e] p-1.5 rounded-2xl border border-white/5">
             {['Posts', 'Connections', 'Groups'].map((label, i) => (
               <button key={label} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
                 {label}
               </button>
             ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
             {[1, 2].map(i => (
               <div key={i} className="glass-card rounded-3xl overflow-hidden border border-white/5 p-6">
                  <p className="text-slate-300 mb-4">Sharing my journey as a student developer at Makerere. Collaborative projects are the best! #CS #Makerere</p>
                  <span className="text-xs text-slate-500">Shared 2 days ago</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
