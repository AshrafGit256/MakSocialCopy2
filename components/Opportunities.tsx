
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User } from '../types';
import { 
  Zap, Clock, Briefcase, GraduationCap, 
  Sparkles, Trash2, ArrowUpRight, Radio,
  Filter, CheckCircle, AlertTriangle, Cpu,
  Search, ShieldCheck
} from 'lucide-react';

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'All' | 'Internship' | 'Grant' | 'Gig' | 'Scholarship' | 'Workshop'>('All');
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const isAdmin = currentUser.role === 'Super Admin';

  useEffect(() => {
    const sync = () => {
      setOpps(db.getOpportunities());
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = opps.filter(o => {
    const matchesFilter = filter === 'All' || o.opportunityData?.type === filter;
    const matchesSearch = o.content.toLowerCase().includes(search.toLowerCase()) || 
                          o.opportunityData?.detectedBenefit.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm("Log: Confirm protocol removal of this opportunity signal?")) {
      db.deletePost(id);
      setOpps(db.getOpportunities());
    }
  };

  const getUrgency = (deadline?: string) => {
    if (!deadline) return 'Low';
    const days = Math.floor((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 3) return 'Critical';
    if (days < 7) return 'Moderate';
    return 'Stable';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 pb-40 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-amber-500 rounded-xl shadow-2xl shadow-amber-500/20 text-white">
                 <Zap size={36} fill="white"/>
              </div>
              <div>
                 <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Opportunity.Registry</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-2">AI.Signal_Scrutiny / Verified Student Gigs</p>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-amber-500 transition-all"
                placeholder="Search active bids..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase flex items-center gap-3">
              <Radio size={16} className="animate-pulse" /> 124 Signals Active
           </div>
        </div>
      </header>

      {/* 2. FILTER MATRIX */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 border-b border-[var(--border-color)] mb-12">
         {(['All', 'Internship', 'Grant', 'Gig', 'Scholarship', 'Workshop'] as const).map(f => (
           <button 
             key={f}
             onClick={() => setFilter(f)}
             className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-amber-500 text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-slate-500 hover:text-amber-500'}`}
           >
             {f === 'All' ? 'Full Manifest' : f}
           </button>
         ))}
      </div>

      {/* 3. OPPORTUNITY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.length > 0 ? filtered.map(opp => {
           const urgency = getUrgency(opp.opportunityData?.deadline);
           return (
             <div key={opp.id} className="group bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden flex flex-col hover:border-amber-500/50 hover:shadow-2xl transition-all relative">
                
                {/* Urgency Badge */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10 ${
                  urgency === 'Critical' ? 'bg-rose-500 text-white animate-pulse' : 
                  urgency === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                   <Clock size={10}/> {urgency} Priority
                </div>

                <div className="p-8 space-y-6 flex-1">
                   <div className="flex items-center gap-4">
                      <img src={opp.authorAvatar} className="w-12 h-12 rounded-xl border border-[var(--border-color)] object-cover" />
                      <div>
                         <h4 className="text-[11px] font-black uppercase text-[var(--text-primary)]">{opp.author}</h4>
                         <div className="flex items-center gap-1.5 text-[8px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
                            <Cpu size={10}/> AI_Coded: {opp.opportunityData?.type}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none italic text-amber-600">
                        {opp.opportunityData?.detectedBenefit}
                      </h3>
                      <div className="text-xs text-slate-500 leading-relaxed font-medium italic line-clamp-3 rich-content" dangerouslySetInnerHTML={{ __html: opp.content }} />
                   </div>

                   <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex flex-col gap-1">
                         <span className="text-[7px] font-black text-slate-400 uppercase">Sector Hub</span>
                         <span className="text-[10px] font-black uppercase">{opp.college}</span>
                      </div>
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] flex flex-col gap-1">
                         <span className="text-[7px] font-black text-slate-400 uppercase">Deadline Node</span>
                         <span className="text-[10px] font-black uppercase">{opp.opportunityData?.deadline || 'Undefined'}</span>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-[var(--border-color)] flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[9px] font-black uppercase text-slate-400">Verified Opportunity</span>
                   </div>
                   <div className="flex gap-2">
                      {isAdmin && (
                        <button onClick={() => handleDelete(opp.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                           <Trash2 size={16}/>
                        </button>
                      )}
                      <button className="px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/30 hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-2">
                         Synchronize <ArrowUpRight size={14}/>
                      </button>
                   </div>
                </div>
             </div>
           );
         }) : (
           <div className="col-span-full py-40 text-center space-y-6">
              <Radio size={64} className="mx-auto text-slate-200 animate-pulse" />
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-slate-300 uppercase italic">Signal Silence</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Awaiting AI-detected opportunity triggers...</p>
              </div>
           </div>
         )}
      </div>

      {/* 4. ADVISORY HUB */}
      <div className="mt-20 p-10 border border-dashed border-[var(--border-color)] rounded-[3rem] bg-amber-500/5 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-8 text-center lg:text-left">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-[var(--border-color)] shrink-0">
               <AlertTriangle size={48} className="text-amber-500" />
            </div>
            <div className="space-y-2">
               <h4 className="text-2xl font-black uppercase tracking-tight italic">Protocol Disclaimer</h4>
               <p className="text-xs text-slate-500 font-medium italic max-w-xl leading-relaxed">
                  "All signals in this strata are AI-filtered but not individually university-verified unless marked. Node operators are advised to maintain security integrity during external synchronization."
               </p>
            </div>
         </div>
         <button className="px-12 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-md">Signal Audit Logs</button>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .rich-content img { display: none !important; }
      `}</style>
    </div>
  );
};

export default Opportunities;
