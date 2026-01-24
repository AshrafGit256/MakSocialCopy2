
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

const SignalLabel: React.FC<{ type: string; color: string }> = ({ type, color }) => (
  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-current ${color}`}>
    {type}
  </span>
);

const OpportunityCard: React.FC<{ 
  opp: Post; 
  onDelete: (id: string) => void; 
  isAdmin: boolean;
  isLarge?: boolean;
}> = ({ opp, onDelete, isAdmin, isLarge }) => {
  const daysLeft = opp.opportunityData?.deadline ? 
    Math.floor((new Date(opp.opportunityData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
    null;
  
  const isUrgent = daysLeft !== null && daysLeft <= 2;
  const type = opp.opportunityData?.type || 'Gig';

  const typeColors: Record<string, string> = {
    'Gig': 'text-amber-500 bg-amber-500/5',
    'Internship': 'text-indigo-500 bg-indigo-500/5',
    'Grant': 'text-emerald-500 bg-emerald-500/5',
    'Scholarship': 'text-rose-500 bg-rose-500/5',
    'Workshop': 'text-cyan-500 bg-cyan-500/5'
  };

  return (
    <div className={`group relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[4px] hover:border-indigo-500/50 transition-all flex flex-col shadow-sm hover:shadow-xl ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}>
      {/* 1. Repository Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-white/20">
        <div className="flex items-center gap-2 overflow-hidden">
          <Box size={14} className="text-slate-400 shrink-0" />
          <div className="flex items-center text-[11px] font-bold truncate">
            <span className="text-indigo-600 hover:underline cursor-pointer">{opp.author}</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-[var(--text-primary)] truncate">{opp.opportunityData?.detectedBenefit || 'Signal'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {opp.isOpportunity && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>}
          <div className="text-[8px] font-black uppercase text-slate-400 font-mono">v1.0</div>
        </div>
      </div>

      {/* 2. Intelligence Body */}
      <div className="p-6 flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <SignalLabel type={type} color={typeColors[type] || 'text-slate-500'} />
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-[var(--border-color)] text-slate-400">
               {opp.college} Hub
            </span>
          </div>
          <p className={`text-[var(--text-primary)] leading-relaxed italic ${isLarge ? 'text-lg font-black' : 'text-xs font-medium'}`}>
            "{opp.content.replace(/<[^>]*>/g, '').slice(0, isLarge ? 200 : 120)}{opp.content.length > 120 ? '...' : ''}"
          </p>
        </div>

        {/* Technical Data Points */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-0.5">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Signal_Intensity</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < (opp.likes > 100 ? 5 : 3) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-white/5'}`}></div>
              ))}
            </div>
          </div>
          <div className="space-y-0.5 text-right">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Time_To_Live</p>
            <p className={`text-[10px] font-mono font-bold ${isUrgent ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
              {daysLeft !== null ? `${daysLeft}D_REMAINING` : 'PERMANENT'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Terminal Footer */}
      <div className="px-4 py-3 bg-slate-50/30 dark:bg-black/20 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 hover:text-indigo-500 cursor-pointer transition-colors">
            <Star size={12} /> {opp.likes}
          </div>
          <div className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer transition-colors">
            <GitFork size={12} /> {opp.commentsCount}
          </div>
        </div>
        <div className="flex items-center gap-2">
           {isAdmin && (
             <button onClick={() => onDelete(opp.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                <Trash2 size={14}/>
             </button>
           )}
           <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-[4px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm">
             Commit <ArrowUpRight size={12}/>
           </button>
        </div>
      </div>

      {/* Masonry-style abstract background for large tiles */}
      {isLarge && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-[60px] font-black select-none">
          {type.toUpperCase()}
        </div>
      )}
    </div>
  );
};

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  const [currentUser] = useState(db.getUser());
  const isAdmin = currentUser?.badges?.includes('Super Admin');

  useEffect(() => {
    const sync = () => {
      const o = db.getOpportunities();
      setOpps(Array.isArray(o) ? o : []);
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = (opps || []).filter((o) => {
    const matchesSearch = o.content.toLowerCase().includes(search.toLowerCase()) || 
                         (o.opportunityData?.detectedBenefit || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'All' || o.opportunityData?.type === activeType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    if (confirm("Log: Confirm protocol removal of this opportunity signal?")) {
      db.deletePost(id);
      setOpps(db.getOpportunities());
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-8 pb-40 animate-in fade-in duration-700 font-sans">
      
      {/* 1. REFINED COMMAND HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-[var(--radius-main)] shadow-2xl shadow-indigo-600/30 text-white">
                 <Terminal size={32} />
              </div>
              <div>
                 <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-[var(--text-primary)]">
                    Intelligence.<span className="text-indigo-600">Registry</span>
                 </h1>
                 <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                       <Activity size={10} className="animate-pulse" /> Network.Stable
                    </div>
                    <p className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.4em]">Sector: Opportunities / Wing: Global</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                placeholder="Query alphanumeric signal manifest..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-30 group-focus-within:opacity-100 transition-opacity">
                 <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-[9px] font-mono">/</span>
                 <Command size={12}/>
              </div>
           </div>
        </div>
      </header>

      {/* 2. REGISTRY TELEMETRY (Mini dashboard) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Active_Nodes', val: opps.length, icon: <LayoutGrid size={16}/>, color: 'text-indigo-600' },
          { label: 'Global_Liquidity', val: 'UGX 42.5M', icon: <Database size={16}/>, color: 'text-emerald-500' },
          { label: 'Uplink_Intensity', val: '98.2%', icon: <Activity size={16}/>, color: 'text-rose-500' },
          { label: 'Verified_Assets', val: opps.filter(o => o.opportunityData?.isAIVerified).length, icon: <ShieldCheck size={16}/>, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-default group">
            <div className={`p-3 bg-white dark:bg-black/20 rounded shadow-sm ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
              <p className="text-lg font-black tracking-tighter text-[var(--text-primary)]">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FILTER TABS (GitHub style) */}
      <div className="flex items-center gap-2 mb-8 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
        {['All', 'Gig', 'Internship', 'Grant', 'Scholarship', 'Workshop'].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeType === type ? 'border-orange-500 text-[var(--text-primary)] bg-indigo-50/50 dark:bg-indigo-600/5' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {type} {activeType === type && `(${filtered.length})`}
          </button>
        ))}
      </div>

      {/* 4. THE DISCOVERY GRID (Instagram Explore Layout) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filtered.map((opp, index) => (
            <OpportunityCard 
              key={opp.id} 
              opp={opp} 
              onDelete={handleDelete} 
              isAdmin={isAdmin}
              isLarge={index === 0 || (index > 0 && index % 7 === 0)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-8 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-[4px]">
           <div className="w-24 h-24 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto shadow-inner relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10"></div>
              <Terminal size={40} className="text-slate-300 group-hover:text-indigo-600 transition-colors duration-500" />
           </div>
           <div className="space-y-2">
             <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter italic leading-none">Manifest.Nullified</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No alphanumeric signals match your current query.</p>
           </div>
           <button onClick={() => {setSearch(''); setActiveType('All');}} className="px-8 py-3 bg-indigo-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reset Sync</button>
        </div>
      )}

      {/* 5. AUDIT FOOTER */}
      <div className="mt-20 p-10 border border-indigo-600/20 rounded-[4px] bg-indigo-600/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={120} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6 text-center md:text-left">
               <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded shadow-xl">
                  <ShieldCheck size={48} className="text-emerald-500" />
               </div>
               <div className="space-y-1">
                  <h4 className="text-2xl font-black uppercase tracking-tight italic">Protocol.Verification_Matrix</h4>
                  <p className="text-xs text-slate-500 font-medium italic max-w-xl leading-relaxed">
                    "All synchronized signals are parsed via neural assessment to ensure academic integrity. Nodes failing verification are pruned automatically from the global registry."
                  </p>
               </div>
            </div>
            <div className="flex gap-4">
               <button className="px-10 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">View_Policy</button>
               <button className="px-10 py-4 bg-indigo-600 text-white rounded-[4px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Sync.Force</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Opportunities;
