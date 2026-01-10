
import React, { useState, useEffect } from 'react';
import { ANALYTICS } from '../constants';
import { db } from '../db';
import { Violation } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { Users, ShieldCheck, AlertTriangle, UserCheck, Activity, Flag, Trash2, CheckCircle, ShieldAlert, Eye, MessageSquareWarning, Ban } from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState(db.getUsers());
  const [posts, setPosts] = useState(db.getPosts());
  const [violations, setViolations] = useState(db.getViolations());
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'security'>('overview');

  useEffect(() => {
    setViolations(db.getViolations());
  }, []);

  const flaggedPosts = posts.filter(p => (p.flags || []).length > 0);
  
  // Calculate analytics for violations
  const violationStats = violations.reduce((acc: any, v) => {
    acc[v.userName] = (acc[v.userName] || 0) + 1;
    return acc;
  }, {});
  const violationChartData = Object.entries(violationStats).map(([name, count]) => ({ name, count }));

  const handleViolationAction = (vId: string, action: 'ok' | 'confirm', userId: string) => {
    if (action === 'confirm') {
      if (window.confirm("Confirm this violation? User will receive an official warning.")) {
        db.sendWarning(userId, "System detected highly suggestive/pornographic content in your attempts to post.");
        db.updateViolationStatus(vId, 'reviewed_confirmed');
      }
    } else {
      db.updateViolationStatus(vId, 'reviewed_ok');
    }
    setViolations(db.getViolations());
    setUsers(db.getUsers());
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32 transition-theme">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">Platform Guard</h1>
          <p className="text-slate-500 font-medium">Moderation, Security, and Compliance.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 bg-black/5 dark:bg-white/5 p-2 rounded-[2.5rem] w-fit border border-black/5">
        {['overview', 'users', 'reports', 'security'].map((tab: any) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'security' && violations.filter(v => v.status === 'blocked').length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]">{violations.filter(v => v.status === 'blocked').length}</span>
            )}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Platform Users', value: users.length, icon: <Users />, color: 'text-blue-500' },
             { label: 'User Reports', value: flaggedPosts.length, icon: <Flag />, color: 'text-orange-500' },
             { label: 'Blocked NSFW', value: violations.length, icon: <ShieldAlert />, color: 'text-red-500' },
             { label: 'Safety Integrity', value: '99.8%', icon: <ShieldCheck />, color: 'text-emerald-500' },
           ].map((stat, i) => (
             <div key={i} className="glass-card p-8 rounded-[2.5rem]">
               <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 ${stat.color} mb-6 w-fit`}>{stat.icon}</div>
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 italic">{stat.value}</h3>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <h3 className="text-2xl font-black italic">Blocked Content Review</h3>
               {violations.length === 0 ? (
                 <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2">
                    <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                    <p className="text-slate-500">No blocked content pending review.</p>
                 </div>
               ) : (
                 violations.map(v => (
                   <div key={v.id} className={`glass-card p-8 rounded-[2.5rem] border flex flex-col md:flex-row gap-8 ${v.status === 'reviewed_confirmed' ? 'border-red-500/20 grayscale opacity-60' : 'border-red-500/10'}`}>
                      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-black flex items-center justify-center relative group">
                        {v.media ? <img src={`data:${v.mimeType};base64,${v.media}`} className="w-full h-full object-cover" /> : <ShieldAlert size={40} className="text-red-500"/>}
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                           <p className="text-[10px] font-black text-red-500 uppercase">Hidden for Review</p>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                               <h4 className="font-black text-xl italic">{v.userName}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.timestamp}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${v.status === 'blocked' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{v.status}</span>
                         </div>
                         <p className="text-sm text-slate-400 italic">"{(v.content || 'Media only post')}"</p>
                         <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14}/> AI Rejection Reason</p>
                            <p className="text-xs text-slate-500 mt-1">{v.reason}</p>
                         </div>
                         {v.status === 'blocked' && (
                           <div className="flex gap-3 pt-2">
                              <button onClick={() => handleViolationAction(v.id, 'ok', v.userId)} className="flex-1 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all">Not Harmful</button>
                              <button onClick={() => handleViolationAction(v.id, 'confirm', v.userId)} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-500/20">Confirm Violation</button>
                           </div>
                         )}
                      </div>
                   </div>
                 ))
               )}
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-black italic">Violation Analytics</h3>
               <div className="glass-card p-8 rounded-[2.5rem] h-[300px]">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Attempts per User</p>
                  <ResponsiveContainer width="100%" height="80%">
                     <BarChart data={violationChartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="glass-card p-8 rounded-[2.5rem] border-red-500/10">
                  <h4 className="font-black text-sm uppercase tracking-widest text-red-500 mb-6">User Risk Watchlist</h4>
                  <div className="space-y-4">
                     {users.filter(u => (u.warningsCount || 0) > 0).map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/5">
                           <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-8 h-8 rounded-full" />
                              <p className="text-xs font-bold">{u.name}</p>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded">{u.warningsCount}/3 Warnings</span>
                              {u.isSuspended ? <Ban size={14} className="text-red-500"/> : <button onClick={() => db.suspendUser(u.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500"><Ban size={14}/></button>}
                           </div>
                        </div>
                     ))}
                     {users.filter(u => (u.warningsCount || 0) > 0).length === 0 && <p className="text-xs text-slate-500 italic">No users currently on watchlist.</p>}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card rounded-[3rem] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-8">Identity</th>
                <th className="p-8">College</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-black/5 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-base italic">{u.name}</p>
                        <p className="text-xs text-slate-500 font-bold">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8"><span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded-full uppercase">{u.college}</span></td>
                  <td className="p-8">
                    {u.isSuspended ? <span className="text-red-500 font-black text-[10px] uppercase">Suspended</span> : <span className="text-emerald-500 font-black text-[10px] uppercase">Active</span>}
                  </td>
                  <td className="p-8 text-right space-x-2">
                    <button onClick={() => db.sendWarning(u.id, "Administrative warning for general misconduct.")} title="Send Warning" className="p-3 bg-orange-500/10 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all"><MessageSquareWarning size={18}/></button>
                    <button onClick={() => db.suspendUser(u.id)} title="Suspend User" className={`p-3 rounded-xl transition-all ${u.isSuspended ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'}`}>
                      {u.isSuspended ? <UserCheck size={18}/> : <Ban size={18}/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
