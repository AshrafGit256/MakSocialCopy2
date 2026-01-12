
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll } from '../types';
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts());
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [polls, setPolls] = useState<Poll[]>(db.getPolls());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'registry' | 'maktv' | 'polls' | 'security'>('intelligence');
  const [searchQuery, setSearchQuery] = useState('');

  // Poll Creation State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24'); // hours

  useEffect(() => {
    const sync = () => {
      setViolations(db.getViolations());
      setPosts(db.getPosts());
      setUsers(db.getUsers());
      setPolls(db.getPolls());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(pollDuration));

    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions.map((o, i) => ({ id: `opt-${i}`, text: o, votes: 0 })),
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdBy: 'Admin',
      isActive: true,
      votedUserIds: []
    };

    db.savePoll(newPoll);
    setPolls(db.getPolls());
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30"><Monitor className="text-white" size={26}/></div>
             <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Forensic Intelligence & Governance</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'intelligence', label: 'Stats', icon: <TrendingUp size={16}/> },
            { id: 'registry', label: 'Feed', icon: <Activity size={16}/> },
            { id: 'maktv', label: 'MakTV', icon: <Tv size={16}/> },
            { id: 'polls', label: 'Polls', icon: <CheckCircle2 size={16}/> },
            { id: 'security', label: 'Safety', icon: <ShieldAlert size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
           {[
             { label: 'Platform Activity', val: posts.length, icon: <Activity/>, color: 'text-indigo-500' },
             { label: 'Audited Users', val: users.length, icon: <Users/>, color: 'text-blue-500' },
             { label: 'Media Assets', val: posts.filter(p => p.isMakTV).length, icon: <Tv/>, color: 'text-amber-500' },
             { label: 'Active Polls', val: polls.filter(p => p.isActive).length, icon: <CheckCircle2/>, color: 'text-emerald-500' },
           ].map((s,i) => (
             <div key={i} className="glass-card p-8 shadow-2xl bg-gradient-to-br from-indigo-500/[0.02] to-transparent border-white/5">
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${s.color}`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <h3 className="text-4xl font-black italic mt-1 text-white">{s.val}</h3>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-5">
           {/* Poll Creator */}
           <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 border-indigo-500/20 bg-indigo-900/5">
                 <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight">Setup New Poll</h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question</label>
                       <input 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-indigo-500/50" 
                         placeholder="What should be our next campus theme?"
                         value={pollQuestion}
                         onChange={e => setPollQuestion(e.target.value)}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Options</label>
                       {pollOptions.map((opt, i) => (
                         <div key={i} className="flex gap-2">
                            <input 
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/30" 
                              placeholder={`Option ${i+1}`}
                              value={opt}
                              onChange={e => {
                                const newOpts = [...pollOptions];
                                newOpts[i] = e.target.value;
                                setPollOptions(newOpts);
                              }}
                            />
                            {pollOptions.length > 2 && (
                              <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                            )}
                         </div>
                       ))}
                       <button onClick={() => setPollOptions([...pollOptions, ''])} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"><Plus size={14}/> Add Option</button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</label>
                       <select 
                         className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-sm outline-none appearance-none cursor-pointer"
                         value={pollDuration}
                         onChange={e => setPollDuration(e.target.value)}
                       >
                          <option value="1">1 Hour</option>
                          <option value="24">24 Hours</option>
                          <option value="72">3 Days</option>
                          <option value="168">1 Week</option>
                       </select>
                    </div>
                    <button onClick={handleCreatePoll} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 mt-4">Broadcast Poll</button>
                 </div>
              </div>
           </div>

           {/* Poll Management List */}
           <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black italic text-white uppercase tracking-widest flex items-center gap-2">
                <Clock size={20} className="text-slate-500" /> Active Governance Threads
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                 {polls.map(poll => (
                   <div key={poll.id} className="glass-card p-6 border-white/5 bg-white/[0.01] hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${poll.isActive ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' : 'bg-rose-500/10 text-rose-500'}`}>
                               {poll.isActive ? 'Live' : 'Expired'}
                            </span>
                            <h4 className="text-lg font-black text-white mt-2 leading-tight">{poll.question}</h4>
                         </div>
                         <button onClick={() => { db.deletePoll(poll.id); setPolls(db.getPolls()); }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={18}/></button>
                      </div>
                      <div className="space-y-2">
                         {poll.options.map(opt => {
                           const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
                           const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                           return (
                             <div key={opt.id} className="space-y-1">
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                   <span>{opt.text}</span>
                                   <span>{opt.votes} votes ({pct.toFixed(0)}%)</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                                </div>
                             </div>
                           );
                         })}
                      </div>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-4">Expires: {new Date(poll.expiresAt).toLocaleString()}</p>
                   </div>
                 ))}
                 {polls.length === 0 && <div className="p-10 text-center glass-card text-slate-600 italic uppercase font-black text-xs">No polls initialized.</div>}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'maktv' && (
        <div className="space-y-10 animate-in slide-in-from-right-5">
           <div className="glass-card p-10 border-indigo-500/20 bg-indigo-950/[0.02]">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tight">MakTV Studio</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage Official Media Assets</p>
                 </div>
                 <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30">Upload Asset</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {posts.filter(p => p.isMakTV).map(p => (
                   <div key={p.id} className="glass-card p-6 border-white/5 bg-white/[0.01] flex gap-6">
                      <div className="w-40 aspect-video rounded-xl overflow-hidden bg-black border border-white/10 relative group">
                         <video src={p.video} className="w-full h-full object-cover" muted />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
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
                         <h4 className="text-sm font-bold text-white line-clamp-1">{p.makTVGuest || 'Official News Broadcast'}</h4>
                         <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">"{p.content}"</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
