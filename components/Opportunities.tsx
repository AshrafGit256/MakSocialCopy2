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
  <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-current shadow-sm ${color}`}>
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

  const hasImage = opp.images && opp.images.length > 0;

  return (
    <div className={`group relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded shadow-sm hover:border-indigo-500/50 hover:shadow-2xl transition-all flex flex-col ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}>
      {/* 1. Repository Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <Box size={16} className="text-slate-400 shrink-0" />
          <div className="flex items-center text-[11px] font-black uppercase tracking-tight truncate">
            <span className="text-indigo-600 hover:underline cursor-pointer">{opp.author}</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-[var(--text-primary)] truncate">{opp.opportunityData?.detectedBenefit || 'Signal_Log'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {opp.isOpportunity && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>}
        </div>
      </div>

      {/* 2. Intelligence Body */}
      {hasImage && (
        <div className={`relative overflow-hidden border-b border-[var(--border-color)] ${isLarge ? 'h-72' : 'h-48'}`}>
          <img src={opp.images![0]} alt="Flyer" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
             <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] bg-indigo-600 px-3 py-1.5 rounded shadow-xl">Visual_Manifest_Attached</span>
          </div>
        </div>
      )}
      
      <div className="p-8 flex-1 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <SignalLabel type={type} color={typeColors[type] || 'text-slate-500'} />
            <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-[var(--border-color)] text-slate-500">
               {opp.college} HUB
            </span>
          </div>
          <p className={`text-[var(--text-primary)] leading-relaxed font-black uppercase tracking-tight ${isLarge ? 'text-2xl' : 'text-[13px]'}`}>
            {opp.content.replace(/<[^>]*>/g, '').slice(0, isLarge ? 250 : 150)}{opp.content.length > 150 ? '...' : ''}
          </p>
        </div>

        {/* Technical Data Points */}
        <div className="grid grid-cols-2 gap-6 py-4 border-y border-[var(--border-color)]">
          <div className="space-y-1.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Signal Intensity</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (opp.likes > 100 ? 5 : 3) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
              ))}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Remainder</p>
            <p className={`text-[11px] font-mono font-black tracking-widest ${isUrgent ? 'text-rose-500 animate-pulse' : 'text-[var(--text-primary)]'}`}>
              {daysLeft !== null ? `${daysLeft}D_LEFT` : 'UNRESTRICTED'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Terminal Footer */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-black/30 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-6 text-[11px] font-mono font-black text-slate-500">
          <div className="flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer">
            <Star size={14} /> {opp.likes}
          </div>
          <div className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer">
            <GitFork size={14} /> {opp.commentsCount}
          </div>
        </div>
        <div className="flex items-center gap-3">
           {isAdmin && (
             <button onClick={() => onDelete(opp.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <Trash2 size={16}/>
             </button>
           )}
           <button className="flex items-center gap-2.5 px-5 py-2.5 bg-indigo-600 text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
             Execute <ArrowUpRight size={14}/>
           </button>
        </div>
      </div>
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
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-10 pb-40 animate-in fade-in duration-700 font-sans">
      
      {/* 1. REFINED COMMAND HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
        <div className="space-y-6">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-600 rounded text-white shadow-2xl shadow-indigo-600/30">
                 <Terminal size={40} />
              </div>
              <div>
                 <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-[var(--text-primary)]">
                    Signal.<span className="text-indigo-600">Manifest</span>
                 </h1>
                 <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                       <Activity size={12} className="animate-pulse" /> Protocol.Synchronized
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Sub-Registry: Opportunities / Global Feed</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-[500px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded py-5 pl-14 pr-6 text-[13px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/5 transition-all"
                placeholder="Query alphanumeric opportunity signal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                 <span className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-[10px] font-mono font-bold">/</span>
                 <Command size={14}/>
              </div>
           </div>
        </div>
      </header>

      {/* 2. REGISTRY TELEMETRY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Active_Nodes', val: opps.length, icon: <LayoutGrid size={20}/>, color: 'text-indigo-600' },
          { label: 'Asset_Liquidity', val: 'UGX 42.5M', icon: <Database size={20}/>, color: 'text-emerald-500' },
          { label: 'Transmission_Load', val: '98.2%', icon: <Activity size={20}/>, color: 'text-rose-500' },
          { label: 'Security_Audit', val: 'VERIFIED', icon: <ShieldCheck size={20}/>, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded flex flex-col gap-6 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default group">
            <div className={`p-4 bg-white dark:bg-black/20 rounded shadow-sm w-fit ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FILTER TABS */}
      <div className="flex items-center gap-3 mb-10 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
        {['All', 'Gig', 'Internship', 'Grant', 'Scholarship', 'Workshop'].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
              activeType === type ? 'border-orange-500 text-[var(--text-primary)] bg-indigo-50/50 dark:bg-indigo-600/5' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {type} {activeType === type && <span className="ml-2 bg-indigo-600 text-white px-2 py-0.5 rounded text-[8px]">{filtered.length}</span>}
          </button>
        ))}
      </div>

      {/* 4. THE DISCOVERY GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
          {filtered.map((opp, index) => (
            <OpportunityCard 
              key={opp.id} 
              opp={opp} 
              onDelete={handleDelete} 
              isAdmin={isAdmin}
              isLarge={index === 0 || (index > 0 && index % 9 === 0)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-10 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded">
           <div className="w-32 h-32 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto shadow-inner relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-10"></div>
              <Terminal size={56} className="text-slate-300 group-hover:text-indigo-600 transition-colors duration-700" />
           </div>
           <div className="space-y-4">
             <h3 className="text-4xl font-black text-slate-400 uppercase tracking-tighter leading-none">Manifest.Nullified</h3>
             <p className="text-[12px] font-black uppercase text-slate-500 tracking-[0.5em]">Sector signal mismatch / No Alpha nodes found</p>
           </div>
           <button onClick={() => {setSearch(''); setActiveType('All');}} className="px-12 py-4 bg-indigo-600 text-white rounded font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Re-initialize Registry</button>
        </div>
      )}

      {/* 5. AUDIT FOOTER */}
      <div className="mt-32 p-12 border border-indigo-600/20 rounded bg-indigo-600/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={180} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-10 text-center md:text-left">
               <div className="p-6 bg-white dark:bg-slate-900 border border-[var(--border-color)] rounded shadow-2xl">
                  <ShieldCheck size={64} className="text-emerald-500" />
               </div>
               <div className="space-y-3">
                  <h4 className="text-3xl font-black uppercase tracking-tight text-white leading-none">Protocol.Verification_Matrix</h4>
                  <p className="text-sm font-black uppercase text-slate-500 tracking-widest max-w-2xl leading-relaxed">
                    All synchronized signals are parsed via neural assessment to ensure academic integrity. Nodes failing verification are pruned automatically from the global registry.
                  </p>
               </div>
            </div>
            <div className="flex gap-6">
               <button className="px-12 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">View_Policy</button>
               <button className="px-12 py-5 bg-indigo-600 text-white rounded font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Force_Sync</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Opportunities;