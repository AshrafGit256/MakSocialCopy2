
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User, College } from '../types';
import { 
  Zap, Clock, Sparkles, Trash2, ArrowUpRight, 
  Radio, Cpu, Search, ShieldCheck, Star, 
  Filter, Calendar, ChevronRight, Info, Award,
  Terminal, ExternalLink, GitFork, Eye, 
  Hash, Layers, LayoutGrid, Box, Activity,
  Globe, Database, Command, ShieldAlert
} from 'lucide-react';

const OpportunityCard: React.FC<{ opp: Post; onDelete: (id: string) => void; isAdmin: boolean; }> = ({ opp, onDelete, isAdmin }) => {
  const type = opp.opportunityData?.type || 'Gig';
  const typeColors: Record<string, string> = {
    'Gig': 'text-amber-500 bg-amber-500/5 border-amber-500/20',
    'Internship': 'text-[var(--brand-color)] bg-[var(--brand-color)]/5 border-[var(--brand-color)]/20',
    'Grant': 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20',
    'Scholarship': 'text-rose-500 bg-rose-500/5 border-rose-500/20',
    'Workshop': 'text-cyan-500 bg-cyan-500/5 border-cyan-500/20'
  };
  const hasPoster = opp.images && opp.images.length > 0;
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none hover:border-[var(--brand-color)] transition-all flex flex-col shadow-sm overflow-hidden group font-sans">
      {hasPoster && (
        <div className="h-52 relative overflow-hidden border-b border-[var(--border-color)]">
          <img src={opp.images![0]} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt="Opportunity Asset" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute top-4 left-4">
             <span className={`px-3 py-1 rounded-none text-[8px] font-black uppercase border shadow-2xl backdrop-blur-md ${typeColors[type]}`}>{type}</span>
          </div>
          <div className="absolute bottom-4 right-4">
             <div className="flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10">
                <Clock size={10} className="text-white" />
                <span className="text-[7px] font-black text-white uppercase tracking-widest">{opp.timestamp}</span>
             </div>
          </div>
        </div>
      )}
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]/50">
        <div className="flex items-center gap-3 truncate">
          <div className="p-1.5 bg-[var(--bg-secondary)] rounded-md border border-[var(--border-color)]">
             <Box size={14} className="text-[var(--brand-color)]" />
          </div>
          <span className="text-[10px] font-black text-[var(--brand-color)] truncate uppercase tracking-widest">{opp.author}</span>
        </div>
        {opp.opportunityData?.isAIVerified && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
             <ShieldCheck size={10} className="text-emerald-500" />
             <span className="text-[7px] font-black text-emerald-500 uppercase">AI_VERIFIED</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 space-y-5">
        {!hasPoster && <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${typeColors[type]}`}>{type}</span>}
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--brand-color)] transition-colors leading-snug">
            {opp.content.replace(/<h1[^>]*>|<\/h1>/g, '').replace(/<[^>]*>/g, '').split('.')[0]}
          </h3>
          <p className="text-[12px] font-medium text-slate-500 leading-relaxed line-clamp-3">
            {opp.content.replace(/<[^>]*>/g, '')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           {opp.hashtags.slice(0, 3).map(tag => (
             <span key={tag} className="text-[8px] font-bold text-slate-400 uppercase border border-[var(--border-color)] px-2 py-0.5 rounded-sm">#{tag.replace('#','')}</span>
           ))}
        </div>
      </div>
      <div className="p-5 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/40">
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">STRATA_BENEFIT</span>
          <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">{opp.opportunityData?.detectedBenefit || 'Verified Participation'}</span>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--brand-color)] hover:brightness-110 text-white rounded-none text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
          Commit_Node <ArrowUpRight size={14}/>
        </button>
      </div>
    </div>
  );
};

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const sync = () => setOpps(db.getOpportunities());
    sync();
  }, []);
  const filtered = opps.filter(o => 
    o.content.toLowerCase().includes(search.toLowerCase()) || 
    o.author.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-40 animate-in fade-in duration-700 font-sans text-[var(--text-primary)]">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-[var(--brand-color)] rounded-none shadow-2xl shadow-[var(--brand-color)]/20 text-white">
            <Zap size={36} fill="white" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Opportunities_Manifest</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-3 flex items-gap-2">
               <Activity size={10} className="text-[var(--brand-color)] animate-pulse" /> Global_Signal_Registry // {opps.length} NODES_ACTIVE
            </p>
          </div>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
          <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none py-4 pl-12 pr-4 text-[11px] font-bold uppercase outline-none focus:border-[var(--brand-color)] shadow-inner transition-all" placeholder="Query Registry Stratum..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </header>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map(opp => <OpportunityCard key={opp.id} opp={opp} onDelete={() => {}} isAdmin={false} />)}
        </div>
      ) : (
        <div className="py-48 text-center space-y-8 bg-[var(--bg-secondary)]/50 border border-dashed border-[var(--border-color)] rounded-none animate-in zoom-in-95 duration-500">
           <div className="relative inline-block">
              <Database size={64} className="mx-auto text-slate-300 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center"><ShieldAlert size={24} className="text-rose-500 animate-pulse" /></div>
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Diagnostic: 404_SIGNAL_LOST</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] max-w-sm mx-auto leading-loose">No matching alphanumeric opportunities detected in the current academic strata. Reset protocol filters to retry.</p>
           </div>
           <button onClick={() => setSearch('')} className="px-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--brand-color)] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 rounded-none">Re-initialize Search</button>
        </div>
      )}
      <footer className="mt-20 p-8 bg-[var(--brand-color)]/5 border border-dashed border-[var(--brand-color)]/20 rounded-none flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-3 bg-white dark:bg-black/40 rounded border border-[var(--border-color)] shadow-sm"><Terminal size={24} className="text-[var(--brand-color)]" /></div>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">Verification Protocol</p>
               <p className="text-[11px] font-medium text-slate-500 max-w-2xl leading-relaxed">All opportunities listed are indexed via central registry nodes. AI verification checks for stipend validity, deadline precision, and academic relevance before broadcasting to the universal hub.</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[9px] font-black uppercase tracking-[0.3em] hover:text-[var(--brand-color)] transition-all whitespace-nowrap">Registry_Archive</button>
      </footer>
    </div>
  );
};

export default Opportunities;
