
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User } from '../types';
import { 
  Zap, Clock, Sparkles, Trash2, ArrowUpRight, 
  Radio, Cpu, Search, ShieldCheck, Star, 
  Filter, Calendar, ChevronRight, Info, Award,
  Terminal, ExternalLink
} from 'lucide-react';

const OpportunityCard: React.FC<{ opp: Post, onDelete?: (id: string) => void, isAdmin?: boolean }> = ({ opp, onDelete, isAdmin }) => {
  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft(opp.opportunityData?.deadline);
  const isUrgent = daysLeft !== null && daysLeft <= 2;

  return (
    <div className={`bg-white dark:bg-[#0d1117] border ${isUrgent ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-[var(--border-color)]'} rounded-xl p-6 flex flex-col transition-all hover:border-indigo-500/50 group`}>
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <img src={opp.authorAvatar} className="w-10 h-10 rounded-lg border border-[var(--border-color)] bg-slate-50" />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase text-[var(--text-primary)]">{opp.author}</span>
              <Star size={10} className="text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{opp.college} Hub</span>
          </div>
        </div>
        {isUrgent && (
          <div className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[7px] font-black uppercase tracking-widest rounded flex items-center gap-1 animate-pulse">
            <Clock size={8}/> Critical Path
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none text-indigo-600 mb-2">
            {opp.opportunityData?.detectedBenefit || 'High-Value Opportunity'}
          </h3>
          <div dangerouslySetInnerHTML={{ __html: opp.content }} className="text-[11px] text-slate-500 font-medium italic leading-relaxed line-clamp-3 opacity-80" />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-[var(--border-color)] text-[8px] font-black uppercase tracking-widest rounded-md text-slate-500">
            Type: {opp.opportunityData?.type}
          </span>
          {daysLeft !== null && (
            <span className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest rounded-md ${isUrgent ? 'border-amber-500 text-amber-500' : 'border-[var(--border-color)] text-slate-500'}`}>
              TTL: {daysLeft} Days
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex gap-2">
           {isAdmin && (
             <button onClick={() => onDelete?.(opp.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                <Trash2 size={16}/>
             </button>
           )}
           <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all">
              <ExternalLink size={16}/>
           </button>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
          Connect Signal <ArrowUpRight size={14}/>
        </button>
      </div>
    </div>
  );
};

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [isSyncing, setIsSyncing] = useState(false);
  const isAdmin = currentUser.role === 'Super Admin';

  useEffect(() => {
    const sync = () => {
      setOpps(db.getOpportunities());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 400);
  };

  const filtered = opps.filter(o => {
    const contentText = o.content.toLowerCase();
    const benefitText = o.opportunityData?.detectedBenefit.toLowerCase() || '';
    const query = search.toLowerCase();
    return contentText.includes(query) || benefitText.includes(query);
  });

  const handleDelete = (id: string) => {
    if (confirm("Log: Confirm protocol removal of this opportunity signal?")) {
      db.deletePost(id);
      setOpps(db.getOpportunities());
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-40 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      {/* 1. REFINED HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-600/20 text-white">
                 <Zap size={32} fill="white"/>
              </div>
              <div>
                 <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Intelligence.Registry</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Authenticated Opportunity Path / Node v4.2.0</p>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 transition-all placeholder:text-slate-500"
                placeholder="Query signal manifest..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
           </div>
           <div className="px-6 py-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl text-indigo-600 text-[10px] font-black uppercase flex items-center gap-3">
              <Radio size={16} className="animate-pulse" /> {opps.length} Active Nodes
           </div>
        </div>
      </header>

      {/* 2. SIGNAL GRID */}
      <div className="relative">
         {isSyncing && (
           <div className="absolute inset-0 z-10 bg-[var(--bg-primary)]/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-3 text-indigo-600">
                <Terminal size={18} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Rescanning registry...</span>
              </div>
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filtered.length > 0 ? filtered.map((opp) => (
             <OpportunityCard 
                key={opp.id} 
                opp={opp} 
                onDelete={handleDelete} 
                isAdmin={isAdmin} 
             />
           )) : (
             <div className="col-span-full py-40 text-center space-y-6">
                <Radio size={64} className="mx-auto text-slate-200 animate-pulse" />
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter leading-none">Registry.Null_Signal</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">No active signals identified in this sector.</p>
                </div>
             </div>
           )}
         </div>
      </div>

      {/* 3. ADVISORY PANEL */}
      <div className="mt-20 p-10 border border-dashed border-[var(--border-color)] rounded-[2.5rem] bg-indigo-600/5 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-8 text-center lg:text-left">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-[var(--border-color)]">
               <Info size={40} className="text-indigo-600" />
            </div>
            <div className="space-y-1">
               <h4 className="text-2xl font-black uppercase tracking-tight italic">Protocol Advisory</h4>
               <p className="text-xs text-slate-500 font-medium italic max-w-xl leading-relaxed">
                  "Registry nodes are prioritized by TTL (Time-To-Live). Critical path signals expire within 48 hours. Verify all external sync links before establishing coordinate connection."
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-10 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">Audit Trail</button>
            <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">Sync Registry</button>
         </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Opportunities;
