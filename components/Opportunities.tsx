
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User, College } from '../types';
import { 
  Zap, Clock, Sparkles, Trash2, ArrowUpRight, 
  Radio, Cpu, Search, ShieldCheck, Star, 
  Filter, Calendar, ChevronRight, Info, Award,
  Terminal, ExternalLink, GitFork, Eye, 
  Hash, Layers, LayoutGrid, Box, Activity,
  Globe, Database, Command
} from 'lucide-react';

const OpportunityCard: React.FC<{ opp: Post; onDelete: (id: string) => void; isAdmin: boolean; }> = ({ opp, onDelete, isAdmin }) => {
  const type = opp.opportunityData?.type || 'Gig';
  const typeColors: Record<string, string> = {
    'Gig': 'text-amber-500 bg-amber-500/5',
    'Internship': 'text-indigo-500 bg-indigo-500/5',
    'Grant': 'text-emerald-500 bg-emerald-500/5',
    'Scholarship': 'text-rose-500 bg-rose-500/5',
    'Workshop': 'text-cyan-500 bg-cyan-500/5'
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] hover:border-indigo-500/50 transition-all flex flex-col shadow-sm">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Box size={14} className="text-slate-400" />
          <span className="text-[11px] font-bold text-indigo-600 truncate">{opp.author}</span>
        </div>
        {opp.opportunityData?.isAIVerified && <ShieldCheck size={14} className="text-emerald-500" />}
      </div>
      <div className="p-6 flex-1 space-y-4">
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-current ${typeColors[type]}`}>{type}</span>
        <p className="text-xs font-medium italic text-[var(--text-primary)] leading-relaxed">"{opp.content.replace(/<[^>]*>/g, '').slice(0, 150)}..."</p>
      </div>
      <div className="p-4 border-t border-[var(--border-color)] flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opp.opportunityData?.detectedBenefit}</span>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-[4px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm">Commit <ArrowUpRight size={12}/></button>
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

  const filtered = opps.filter(o => o.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 pb-40 animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded shadow-xl text-white"><Zap size={32} /></div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Opportunities</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Signal Registry</p>
          </div>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-xs font-bold" placeholder="Search signals..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(opp => <OpportunityCard key={opp.id} opp={opp} onDelete={() => {}} isAdmin={false} />)}
      </div>
    </div>
  );
};

export default Opportunities;
