
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
    'Gig': 'text-amber-500 bg-amber-500/5 border-amber-500/20',
    'Internship': 'text-indigo-500 bg-indigo-500/5 border-indigo-500/20',
    'Grant': 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20',
    'Scholarship': 'text-rose-500 bg-rose-500/5 border-rose-500/20',
    'Workshop': 'text-cyan-500 bg-cyan-500/5 border-cyan-500/20'
  };

  const hasPoster = opp.images && opp.images.length > 0;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] hover:border-indigo-500 transition-all flex flex-col shadow-sm overflow-hidden group">
      {/* Poster Image if available */}
      {hasPoster && (
        <div className="h-48 relative overflow-hidden border-b border-[var(--border-color)]">
          <img 
            src={opp.images![0]} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
            alt="Opportunity Poster"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4">
             <span className={`px-2.5 py-1 rounded-[4px] text-[8px] font-black uppercase border shadow-xl backdrop-blur-md ${typeColors[type]}`}>{type}</span>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Box size={14} className="text-slate-400" />
          <span className="text-[11px] font-black text-indigo-600 truncate uppercase tracking-tighter">{opp.author}</span>
        </div>
        {opp.opportunityData?.isAIVerified && <ShieldCheck size={14} className="text-emerald-500" />}
      </div>

      <div className="p-6 flex-1 space-y-4">
        {!hasPoster && (
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${typeColors[type]}`}>{type}</span>
        )}
        <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">
          {opp.content.replace(/<h1[^>]*>|<\/h1>/g, '').replace(/<[^>]*>/g, '').split('.')[0]}
        </h3>
        <p className="text-xs font-medium italic text-slate-500 leading-relaxed line-clamp-3">
          "{opp.content.replace(/<[^>]*>/g, '')}"
        </p>
      </div>

      <div className="p-4 border-t border-[var(--border-color)] flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Detected Benefit</span>
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{opp.opportunityData?.detectedBenefit}</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white rounded-[4px] text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm active:scale-95">Commit <ArrowUpRight size={12}/></button>
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

  const filtered = opps.filter(o => o.content.toLowerCase().includes(search.toLowerCase()) || o.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 pb-40 animate-in fade-in duration-700 font-mono">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-[4px] shadow-xl text-white"><Zap size={32} /></div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Opportunities</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Active Signal Registry / {opps.length} NODES</p>
          </div>
        </div>
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] py-3.5 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-indigo-600 shadow-sm" 
            placeholder="Query Registry..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </header>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(opp => <OpportunityCard key={opp.id} opp={opp} onDelete={() => {}} isAdmin={false} />)}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)]">
           <Database size={48} className="mx-auto text-slate-300" />
           <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Signal_Lost</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No matching alphanumeric opportunities detected.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
