import React, { useState } from 'react';
import { db } from '../db';
import { MarketService, College } from '../types';
import { 
  ShoppingBag, Star, Zap, Search, Plus, 
  ArrowUpRight, Filter, ShieldCheck, 
  MessageCircle, CreditCard, Tag, TrendingUp,
  Cpu, Box, Database, Activity, Terminal
} from 'lucide-react';

const MOCK_SERVICES: MarketService[] = [
  {
    id: 's-1',
    providerId: 'u1',
    providerName: 'Sarah CEDAT',
    providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'Professional CAD Design & Prototyping',
    description: 'Specialized in AutoCAD and SolidWorks for engineering nodes. Fast turnaround for project defense assets.',
    price: 'UGX 50,000',
    category: 'Design',
    college: 'CEDAT',
    rating: 4.9,
    reviewsCount: 24,
    isPromoted: true
  },
  {
    id: 's-2',
    providerId: 'u2',
    providerName: 'John COCIS',
    providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    title: 'Fullstack Web App Deployment',
    description: 'React, Node.js and Firebase integration. I build complete project nodes for startup prototypes.',
    price: 'UGX 120,000',
    category: 'Coding',
    college: 'COCIS',
    rating: 4.8,
    reviewsCount: 15,
    isPromoted: false
  },
  {
    id: 's-3',
    providerId: 'u3',
    providerName: 'Grace LAW',
    providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    title: 'Legal Briefing & Editing Stratum',
    description: 'Proofreading and formatting legal research papers. Ensuring compliance with Hill registry standards.',
    price: 'UGX 25,000',
    category: 'Writing',
    college: 'LAW',
    rating: 5.0,
    reviewsCount: 8,
    isPromoted: false
  }
];

const Market: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [services] = useState<MarketService[]>(MOCK_SERVICES);

  const filtered = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-40 animate-in fade-in duration-500 font-mono">
      
      {/* 1. Bazaar Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/20">
                <ShoppingBag size={32} />
             </div>
             <div>
                <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none italic">The Bazaar</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Transactional Intelligence / Peer-to-Peer Economy</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
                placeholder="Query service manifest..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95">
              <Plus size={16}/> Register Service
           </button>
        </div>
      </header>

      {/* 2. Registry Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Services', val: '248', icon: <Database size={18}/>, color: 'text-indigo-600' },
           { label: 'Transactions (24h)', val: '42', icon: <TrendingUp size={18} />, color: 'text-emerald-500' },
           { label: 'Verified Nodes', val: '186', icon: <ShieldCheck size={18}/>, color: 'text-amber-500' },
           { label: 'Liquidity Matrix', val: 'UGX 4.2M', icon: <CreditCard size={18}/>, color: 'text-rose-500' }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm group hover:border-indigo-500 transition-all cursor-default">
              <div className={`p-3 bg-[var(--bg-secondary)] rounded-xl group-hover:scale-110 transition-transform ${stat.color}`}>{stat.icon}</div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-black">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 3. Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[var(--border-color)]">
         {['All', 'Coding', 'Design', 'Tutoring', 'Writing', 'Laundry/Errand'].map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* 4. Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(service => (
          <div key={service.id} className="group relative bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-indigo-500/30 transition-all p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-2xl">
            {service.isPromoted && (
               <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase rounded flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Promoted_Node
               </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <img src={service.providerAvatar} className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white object-cover" />
                 <div>
                    <h4 className="text-[11px] font-black uppercase tracking-tight">{service.providerName}</h4>
                    <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">{service.college} HUB</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <h3 className="text-xl font-black uppercase tracking-tighter group-hover:text-indigo-600 transition-colors leading-none italic">{service.title}</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{service.description}"</p>
              </div>

              <div className="flex items-center gap-4 py-2">
                 <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black">{service.rating}</span>
                 </div>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">({service.reviewsCount} SYNC_LOGS)</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Node_Price</span>
                  <span className="text-lg font-black text-emerald-600">{service.price}</span>
               </div>
               <div className="flex gap-2">
                  <button className="p-3 bg-[var(--bg-secondary)] text-slate-500 rounded-xl hover:text-indigo-600 transition-all border border-[var(--border-color)]">
                    <MessageCircle size={16}/>
                  </button>
                  <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                    Initiate_Deal <ArrowUpRight size={14}/>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Trust Matrix Footer */}
      <div className="mt-20 p-8 border border-dashed border-emerald-600/20 rounded-3xl bg-emerald-600/5 flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[var(--border-color)]">
               <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <div className="space-y-1">
               <h4 className="text-lg font-black uppercase tracking-tight italic text-emerald-600">Secure Protocol Escrow</h4>
               <p className="text-xs text-slate-500 font-medium italic max-w-xl">"Funds are held within the Hill Registry until the service node validates successful delivery. All peer-to-peer exchanges are encrypted and logged."</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-3.5 bg-white border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Audit_Log</button>
            <button className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all">View Analytics</button>
         </div>
      </div>

    </div>
  );
};

export default Market;