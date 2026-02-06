
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User, College } from '../types';
import { 
  Briefcase, Clock, Search, ShieldCheck, 
  ArrowUpRight, Database, ShieldAlert, CheckCircle,
  Filter, Info, Star, Activity
} from 'lucide-react';

const OpportunityCard: React.FC<{ opp: Post; onDelete: (id: string) => void; isAdmin: boolean; }> = ({ opp, onDelete, isAdmin }) => {
  const type = opp.opportunityData?.type || 'Gig';
  const typeColors: Record<string, string> = {
    'Gig': 'text-amber-600 bg-amber-50 border-amber-200',
    'Internship': 'text-brand-primary bg-brand-accent border-brand-primary/20',
    'Grant': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Scholarship': 'text-rose-600 bg-rose-50 border-rose-200',
    'Workshop': 'text-cyan-600 bg-cyan-50 border-cyan-200'
  };
  
  const hasPoster = opp.images && opp.images.length > 0;
  
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:border-brand-primary transition-all flex flex-col shadow-sm hover:shadow-md overflow-hidden group font-sans">
      {hasPoster && (
        <div className="h-48 relative overflow-hidden">
          <img src={opp.images![0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Opportunity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute top-3 left-3">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${typeColors[type]}`}>{type}</span>
          </div>
          <div className="absolute bottom-3 right-3">
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/20">
                <Clock size={12} className="text-white" />
                <span className="text-[10px] font-bold text-white">{opp.timestamp}</span>
             </div>
          </div>
        </div>
      )}
      
      <div className="px-5 py-3 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 truncate">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-color)] bg-white shrink-0 shadow-sm">
             <img src={opp.authorAvatar} className="w-full h-full object-cover" alt="Author" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-slate-800 truncate">{opp.author}</span>
            <span className="text-[9px] text-slate-400 font-medium">{opp.college}</span>
          </div>
        </div>
        {opp.opportunityData?.isAIVerified && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
             <CheckCircle size={10} />
             <span className="text-[9px] font-bold">Verified</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {!hasPoster && <span className={`w-fit px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border mb-3 ${typeColors[type]}`}>{type}</span>}
        <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-brand-primary transition-colors leading-snug mb-2">
          {opp.eventTitle || opp.content.replace(/<[^>]*>/g, '').split('.')[0]}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 mb-4 font-sans">
          {opp.content.replace(/<[^>]*>/g, '')}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-2">
           {opp.hashtags.slice(0, 3).map(tag => (
             <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">#{tag.replace('#','')}</span>
           ))}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border-color)] flex justify-between items-center bg-white">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Benefit</span>
          <span className="text-[13px] font-black text-brand-primary">{opp.opportunityData?.detectedBenefit || 'Academic Credit'}</span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-md text-[11px] font-bold transition-all shadow-sm active:scale-95">
          Apply Now <ArrowUpRight size={14}/>
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
    <div className="max-w-[1200px] mx-auto px-6 py-10 pb-40 animate-in fade-in duration-700 font-sans text-[var(--text-primary)]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 flex items-center justify-center bg-brand-accent border border-brand-primary/20 rounded-xl text-brand-primary shadow-sm">
            <Briefcase size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-slate-900 uppercase">Student Opportunities</h1>
            <p className="text-[13px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {opps.length} jobs and internships currently available
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-[14px] font-medium outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm" 
            placeholder="Search by role or company..." 
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
        <div className="py-32 text-center space-y-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl animate-in zoom-in-95 duration-500">
           <div className="relative inline-block">
              <Database size={48} className="mx-auto text-slate-200" />
              <div className="absolute inset-0 flex items-center justify-center"><ShieldAlert size={20} className="text-rose-400 animate-pulse" /></div>
           </div>
           <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-600">No postings found</h3>
              <p className="text-[13px] text-slate-400 max-w-xs mx-auto leading-relaxed">Try searching for something else or clear your search to see all listings.</p>
           </div>
           <button onClick={() => setSearch('')} className="px-8 py-2.5 bg-white border border-slate-200 hover:border-brand-primary hover:text-brand-primary text-[12px] font-bold transition-all active:scale-95 rounded-lg shadow-sm">Clear Search</button>
        </div>
      )}

      <footer className="mt-20 p-8 bg-brand-accent/40 border border-dashed border-brand-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="p-3.5 bg-white border border-brand-primary/10 rounded-xl shadow-sm">
               <ShieldCheck size={28} className="text-brand-primary" />
            </div>
            <div className="space-y-1">
               <p className="text-[15px] font-bold text-brand-primary">Safe & Verified Postings</p>
               <p className="text-[13px] text-slate-500 max-w-xl leading-relaxed font-sans">Our team checks every opportunity to make sure it's legitimate and safe for Makerere students. We focus on academic relevance and real benefits.</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-white border border-slate-200 text-[12px] font-bold rounded-lg hover:text-brand-primary hover:border-brand-primary transition-all whitespace-nowrap shadow-sm">Report an Issue</button>
      </footer>
    </div>
  );
};

export default Opportunities;
