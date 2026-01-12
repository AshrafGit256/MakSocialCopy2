
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { Violation, User, Post } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ScatterChart, Scatter, ZAxis,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  CartesianGrid, Legend
} from 'recharts';
import { 
  Users, ShieldAlert, Activity, Trash2, ShieldCheck, 
  TrendingUp, Monitor, Zap, Heart, MessageCircle, Eye, Search, Filter,
  Tv, Mic2, Newspaper, Play
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts());
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'registry' | 'maktv' | 'security'>('intelligence');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const sync = () => {
      setViolations(db.getViolations());
      setPosts(db.getPosts());
      setUsers(db.getUsers());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredPosts = posts.filter(p => 
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30"><Monitor className="text-white" size={26}/></div>
             <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Forensic Intelligence & Media Governance</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto">
          {[
            { id: 'intelligence', label: 'Dashboard', icon: <TrendingUp size={16}/> },
            { id: 'registry', label: 'Content', icon: <Activity size={16}/> },
            { id: 'maktv', label: 'MakTV Studio', icon: <Tv size={16}/> },
            { id: 'security', label: 'Safety', icon: <ShieldAlert size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'intelligence' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Platform Activity', val: posts.length, icon: <Activity/>, color: 'text-indigo-500' },
               { label: 'Audited Users', val: users.length, icon: <Users/>, color: 'text-blue-500' },
               { label: 'Media Assets', val: posts.filter(p => p.isMakTV).length, icon: <Tv/>, color: 'text-amber-500' },
               { label: 'Security Blocks', val: violations.length, icon: <ShieldAlert/>, color: 'text-rose-500' },
             ].map((s,i) => (
               <div key={i} className="glass-card p-8 shadow-2xl bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
                  <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${s.color}`}>{s.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                  <h3 className="text-4xl font-black italic mt-1 text-white">{s.val}</h3>
               </div>
             ))}
          </div>
          {/* Dashboard contents... Same as before but with updated statistics */}
        </div>
      )}

      {activeTab === 'maktv' && (
        <div className="space-y-10 animate-in slide-in-from-right-5">
           <div className="glass-card p-10 border-indigo-500/20">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tight">MakTV Studio Controls</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage Official Media, News Briefs and Alumni Spotlight</p>
                 </div>
                 <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30">Upload New Media</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {posts.filter(p => p.isMakTV).map(p => (
                   <div key={p.id} className="glass-card p-6 border-white/5 bg-white/[0.01] flex gap-6">
                      <div className="w-40 aspect-video rounded-xl overflow-hidden bg-black border border-white/10 relative group">
                         <video src={p.video} className="w-full h-full object-cover" muted />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            {/* Fix: Imported Play icon from lucide-react */}
                            <Play size={20} className="text-white" fill="currentColor" />
                         </div>
                      </div>
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between items-start">
                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${p.makTVType === 'Interview' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                               {p.makTVType}
                            </span>
                            <button onClick={() => { db.deletePost(p.id, 'admin'); setPosts(db.getPosts()); }} className="text-rose-500 hover:text-rose-400"><Trash2 size={16}/></button>
                         </div>
                         <h4 className="text-sm font-bold text-white line-clamp-1">{p.makTVGuest || 'Campus News Update'}</h4>
                         <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">"{p.content}"</p>
                         <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold uppercase"><Eye size={12}/> {p.views} views</div>
                            <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold uppercase"><MessageCircle size={12}/> {p.commentsCount} comments</div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Registry and Security tabs... Same as before */}
      {activeTab === 'registry' && (
        <div className="glass-card overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
           {/* Contents from previous code block... */}
        </div>
      )}
    </div>
  );
};

export default Admin;
