
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User } from '../types';
import { 
  Zap, Clock, Sparkles, Trash2, ArrowUpRight, 
  Radio, Cpu, Search, ShieldCheck, Star, 
  Filter, Calendar, ChevronRight, Info
} from 'lucide-react';

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const isAdmin = currentUser.role === 'Super Admin';

  useEffect(() => {
    const sync = () => {
      setOpps(db.getOpportunities());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const getTimeLeft = (deadline?: string) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-40 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-[var(--brand-color)] rounded-xl shadow-2xl shadow-indigo-600/20 text-white">
                 <Zap size={36} fill="white"/>
              </div>
              <div>
                 <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Signal.Registry</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Intelligence Stream / Automated Opportunity Filter</p>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all"
                placeholder="Search active signals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <div className="px-6 py-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl text-indigo-600 text-[10px] font-black uppercase flex items-center gap-3">
              <Radio size={16} className="animate-pulse" /> {opps.length} Active Nodes
           </div>
        </div>
      </header>

      {/* 2. REGISTRY BOARD */}
      <div className="space-y-4">
         <div className="hidden lg:grid grid-cols-12 px-8 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Protocol Identity & Target</div>
            <div className="col-span-2">Wing Sector</div>
            <div className="col-span-2">TTL / Deadline</div>
            <div className="col-span-2 text-right">Uplink</div>
         </div>

         {filtered.length > 0 ? filtered.map((opp) => {
           const daysLeft = getTimeLeft(opp.opportunityData?.deadline);
           const isUrgent = daysLeft !== null && daysLeft <= 2;
           
           return (
             <div key={opp.id} className={`lg:grid grid-cols-12 items-center bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-2xl p-6 lg:p-8 hover:border-indigo-500/50 transition-all group relative overflow-hidden ${isUrgent ? 'border-l-4 border-l-rose-500' : ''}`}>
                
                {/* Status Column */}
                <div className="col-span-1 mb-4 lg:mb-0">
                   {isUrgent ? (
                      <div className="flex flex-col items-center">
                         <Clock size={18} className="text-rose-500 animate-pulse" />
                         <span className="text-[7px] font-black text-rose-500 uppercase mt-1">Critical</span>
                      </div>
                   ) : (
                      <div className="flex flex-col items-center">
                         <ShieldCheck size={18} className="text-emerald-500" />
                         <span className="text-[7px] font-black text-emerald-500 uppercase mt-1">Stable</span>
                      </div>
                   )}
                </div>

                {/* Identity Column */}
                <div className="col-span-5 flex items-center gap-5 mb-6 lg:mb-0">
                   <img src={opp.authorAvatar} className="w-12 h-12 rounded-xl border border-[var(--border-color)] grayscale group-hover:grayscale-0 transition-all" />
                   <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[11px] font-black uppercase text-[var(--text-primary)]">{opp.author}</h4>
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                      </div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-indigo-600 mt-1">{opp.opportunityData?.detectedBenefit}</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 line-clamp-1 opacity-70">"{opp.content.replace(/<[^>]*>/g, '')}"</p>
                   </div>
                </div>

                {/* Wing Column */}
                <div className="col-span-2 mb-4 lg:mb-0">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                      <Cpu size={12} className="text-slate-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{opp.college} Hub</span>
                   </div>
                </div>

                {/* Deadline Column */}
                <div className="col-span-2 mb-4 lg:mb-0 font-mono">
                   {daysLeft !== null ? (
                      <div className="flex flex-col">
                         <span className={`text-xs font-black ${isUrgent ? 'text-rose-500' : 'text-slate-400'}`}>{daysLeft} Days Remaining</span>
                         <span className="text-[8px] font-bold text-slate-500 uppercase">{opp.opportunityData?.deadline}</span>
                      </div>
                   ) : (
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Permanent Node</span>
                   )}
                </div>

                {/* Actions Column */}
                <div className="col-span-2 flex items-center justify-end gap-3">
                   {isAdmin && (
                      <button onClick={() => handleDelete(opp.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                         <Trash2 size={16}/>
                      </button>
                   )}
                   <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
                      Connect <ArrowUpRight size={14}/>
                   </button>
                </div>
             </div>
           );
         }) : (
           <div className="py-40 text-center space-y-6">
              <Radio size={64} className="mx-auto text-slate-200 animate-pulse" />
              <div className="space-y-1">
                 <h3 className="text-3xl font-black text-slate-300 uppercase italic">Registry Silence</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">No active signals identified in this sector.</p>
              </div>
           </div>
         )}
      </div>

      {/* Advisory Node */}
      <div className="mt-20 p-10 border border-dashed border-[var(--border-color)] rounded-[3rem] bg-indigo-600/5 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-8 text-center lg:text-left">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-[var(--border-color)]">
               <Info size={40} className="text-indigo-600" />
            </div>
            <div className="space-y-1">
               <h4 className="text-2xl font-black uppercase tracking-tight italic">Protocol Disclaimer</h4>
               <p className="text-xs text-slate-500 font-medium italic max-w-xl leading-relaxed">
                  "Registry nodes are AI-extracted for maximum academic utility. Critical signals are prioritized. Verify all external sync links before establishing coordinate connection."
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-10 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">Registry Logs</button>
            <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">Audit Signal</button>
         </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Opportunities;
