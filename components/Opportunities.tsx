
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post, User, College } from '../types';
import { 
  Zap, Clock, Sparkles, Trash2, ArrowUpRight, 
  Radio, Cpu, Search, ShieldCheck, Star, 
  Filter, Calendar, ChevronRight, Info, Award,
  Terminal, ExternalLink, GitFork, Eye, 
  Hash, Layers, LayoutGrid, Box, Activity,
  Globe, Database, Command, TrendingUp, DollarSign
} from 'lucide-react';

const Opportunities: React.FC = () => {
  const [opps, setOpps] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState(db.getUser());

  useEffect(() => {
    const sync = () => {
      const o = db.getOpportunities();
      setOpps(Array.isArray(o) ? o : []);
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-8 pb-40 font-mono bg-[#020617] min-h-screen">
      
      {/* TRADING HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12 border-b border-[#1e293b] pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-600 rounded-md shadow-2xl shadow-indigo-600/20 text-white">
                 <Database size={40} />
              </div>
              <div>
                 <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none text-white">
                    Market.<span className="text-indigo-500">Signals</span>
                 </h1>
                 <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm text-[10px] font-black uppercase">
                       <Activity size={12} className="animate-pulse" /> Registry_Stable
                    </div>
                    <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Sector: Global / Pair: UGX-ACAD</span>
                 </div>
              </div>
           </div>
        </div>
        <div className="w-full lg:w-96 relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500" size={20} />
           <input 
             className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-md py-4 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-indigo-600 transition-all text-white"
             placeholder="Query Asset Pair..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </header>

      {/* THE ORDER BOOK TABLE */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-md overflow-hidden shadow-2xl">
         <div className="px-6 py-4 border-b border-[#1e293b] bg-[#0a0f1e] flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em]">Live_Opportunity_Order_Book</h3>
            <div className="flex gap-10">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-600 uppercase">Spread</span>
                  <span className="text-[11px] font-black text-emerald-500">0.002%</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-600 uppercase">24h_Volume</span>
                  <span className="text-[11px] font-black text-white">42.5k SIGNALS</span>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-[#020617] text-[9px] font-black uppercase text-slate-600 tracking-widest border-b border-[#1e293b]">
                  <tr>
                     <th className="p-6">Asset_Identity</th>
                     <th className="p-6">Registry_Wing</th>
                     <th className="p-6">Type</th>
                     <th className="p-6 text-right">Liquidity (UGX)</th>
                     <th className="p-6 text-right">Intensity</th>
                     <th className="p-6 text-center">Execute</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#1e293b]">
                  {opps.length > 0 ? opps.map(opp => (
                     <tr key={opp.id} className="hover:bg-white/5 transition-all group">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded border border-[#1e293b] bg-[#0a0f1e] flex items-center justify-center text-indigo-500">
                                 <Command size={18} />
                              </div>
                              <div>
                                 <p className="text-[12px] font-black text-white uppercase truncate max-w-[200px] group-hover:text-indigo-400 transition-colors">{opp.author}</p>
                                 <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">ID: {opp.id.slice(-6)}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-[#1e293b] px-3 py-1 rounded-sm bg-white/5">{opp.college}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${opp.opportunityData?.type === 'Grant' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              <span className="text-[10px] font-black text-white uppercase">{opp.opportunityData?.type || 'Gig'}</span>
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <p className="text-[12px] font-black text-emerald-500 font-mono tracking-tighter">{(Math.random() * 1000000).toLocaleString()}</p>
                           <p className="text-[8px] font-bold text-slate-600 uppercase mt-0.5">Est_Net_Yield</p>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex flex-col items-end gap-1.5">
                              <span className="text-[10px] font-black text-white">{opp.likes}%</span>
                              <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${opp.likes}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="p-6 text-center">
                           <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all shadow-lg active:scale-95">Open_Position</button>
                        </td>
                     </tr>
                  )) : (
                    <tr>
                       <td colSpan={6} className="p-40 text-center space-y-4">
                          <Terminal size={40} className="mx-auto text-slate-700" />
                          <p className="text-[11px] font-black uppercase text-slate-600 tracking-[0.4em]">Registry_Buffer_Nullified</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* FOOTER TICKER STRAP */}
      <div className="mt-12 bg-[#0a0f1e] border border-[#1e293b] rounded-md p-6 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-500">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Execution_Protocol_Verified</h4>
               <p className="text-[10px] text-slate-500 font-medium italic max-w-xl">"All opportunity trades are logged to the university main chain. Identity synchronization required for settlement."</p>
            </div>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-10 py-4 bg-white/5 border border-[#1e293b] text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all rounded-sm">Audit_Chain</button>
            <button className="flex-1 md:flex-none px-10 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all rounded-sm">Quick_Sync</button>
         </div>
      </div>
    </div>
  );
};

export default Opportunities;
