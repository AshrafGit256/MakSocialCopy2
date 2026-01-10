
import React, { useState } from 'react';
import { ANALYTICS } from '../constants';
import { db } from '../db';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie, ComposedChart, Line
} from 'recharts';
import { Users, FileText, Download, ShieldCheck, AlertTriangle, UserMinus, UserCheck, Star, Activity, PieChart as PieIcon, TrendingUp, Briefcase, Eye, Printer, X, Flag, Trash2, CheckCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState(db.getUsers());
  const [posts, setPosts] = useState(db.getPosts());
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'intelligence'>('overview');
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  const opportunities = posts.filter(p => p.isOpportunity);
  const flaggedPosts = posts.filter(p => (p.flags || []).length > 0).sort((a, b) => (b.flags?.length || 0) - (a.flags?.length || 0));

  const handleDownloadReport = () => {
    const data = JSON.stringify({ users, analytics: ANALYTICS, opportunities, posts }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MakSocial_Intelligence_Full_Report.json';
    a.click();
  };

  const toggleSuspend = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isSuspended: !u.isSuspended } : u);
    setUsers(updated);
    db.saveUsers(updated);
  };

  const handleModeratePost = (postId: string, action: 'delete' | 'ignore') => {
    if (action === 'delete') {
      if (window.confirm("Confirm deletion of this reported content? The user will be notified.")) {
        const adminUser = db.getUser();
        const updated = db.deletePost(postId, adminUser.id);
        if (updated) setPosts(updated);
      }
    } else {
      // Clear flags
      const updated = posts.map(p => p.id === postId ? { ...p, flags: [] } : p);
      setPosts(updated);
      db.savePosts(updated);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32 transition-theme">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">System Intelligence</h1>
          <p className="text-slate-500 font-medium">Safety moderation and strategic analytics.</p>
        </div>
        <button onClick={handleDownloadReport} className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-105 transition-all">
          <Download size={20}/> Database Dump
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-black/5 dark:bg-white/5 p-2 rounded-[2.5rem] w-fit border border-black/5 dark:border-white/5">
        {['overview', 'users', 'reports', 'intelligence'].map((tab: any) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'reports' && flaggedPosts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] animate-pulse">
                {flaggedPosts.length}
              </span>
            )}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Total Members', value: users.length, icon: <Users />, color: 'text-blue-500' },
             { label: 'Active Reports', value: flaggedPosts.length, icon: <Flag />, color: 'text-red-500' },
             { label: 'Platform Views', value: posts.reduce((acc, p) => acc + (p.views || 0), 0), icon: <Activity />, color: 'text-indigo-500' },
             { label: 'Safety Score', value: '98.2%', icon: <ShieldCheck />, color: 'text-purple-500' },
           ].map((stat, i) => (
             <div key={i} className="glass-card p-8 rounded-[2.5rem]">
               <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 ${stat.color} mb-6 w-fit`}>{stat.icon}</div>
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 italic">{stat.value}</h3>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white italic">Content Reports Queue</h3>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{flaggedPosts.length} items pending review</p>
          </div>
          
          {flaggedPosts.length === 0 ? (
            <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2 border-black/10 dark:border-white/10">
               <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-6" />
               <h4 className="text-xl font-black text-slate-900 dark:text-white">Clean Platform</h4>
               <p className="text-slate-500 mt-2">No content reports currently requiring attention.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
               {flaggedPosts.map(post => (
                 <div key={post.id} className="glass-card p-8 rounded-[2.5rem] border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-6 flex-1">
                       <img src={post.authorAvatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <p className="font-black text-slate-900 dark:text-white italic">{post.author}</p>
                             <span className="px-2 py-0.5 bg-red-500/10 text-red-600 text-[10px] font-black rounded uppercase tracking-tighter">
                                {post.flags?.length} Reports
                             </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">"{post.content}"</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{post.college} • {post.timestamp}</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => handleModeratePost(post.id, 'ignore')}
                         className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all flex items-center gap-2"
                       >
                         <CheckCircle size={14}/> Keep Post
                       </button>
                       <button 
                         onClick={() => handleModeratePost(post.id, 'delete')}
                         className="px-6 py-3 bg-red-500/10 text-red-600 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-500/10 flex items-center gap-2"
                       >
                         <Trash2 size={14}/> Delete & Notify
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5">
          <table className="w-full text-left">
            <thead className="bg-black/5 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="p-8">Member Identity</th>
                <th className="p-8">College</th>
                <th className="p-8">Activity</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-base italic">{u.name}</p>
                        <p className="text-xs text-slate-500 font-bold">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase">{u.college}</span>
                  </td>
                  <td className="p-8">
                    <span className="text-xs font-bold text-slate-500">{u.appliedTo?.length || 0} Apps</span>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => toggleSuspend(u.id)} className={`p-3 rounded-xl transition-all ${u.isSuspended ? 'bg-emerald-500/20 text-emerald-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                      {u.isSuspended ? <UserCheck size={18}/> : <AlertTriangle size={18}/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'intelligence' && (
        <div className="glass-card p-12 rounded-[3.5rem] h-[500px]">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white italic mb-10">Network Velocity</h3>
           <ResponsiveContainer width="100%" height="80%">
             <AreaChart data={ANALYTICS}>
               <defs>
                 <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip contentStyle={{borderRadius: '20px', border: 'none', background: '#1a1f2e'}} />
               <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={5} fill="url(#engagementGrad)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Admin;
