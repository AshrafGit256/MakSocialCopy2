
import React, { useState, useEffect, useMemo } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Resource, College, ResourceType } from '../types';
import { 
  FileText, Search, Download, Plus, Database, 
  Shield, Fingerprint, Activity, Server,
  ArrowUpRight, FilterX, Gauge, TrendingUp,
  Zap, Clock, Layers, Eye, Globe, ExternalLink
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const KnowledgeStatCard: React.FC<{ label: string; value: string; trend: string; color: string }> = ({ label, value, trend, color }) => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-indigo-500/50 transition-all duration-500">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.2em]">{label}</span>
      <div className={`p-1.5 rounded-md ${color} bg-opacity-10 text-opacity-100`}>
        <Activity size={14} />
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-black italic tracking-tighter text-[var(--text-primary)]">{value}</h3>
      <div className="flex items-center gap-1.5 mt-1">
        <ArrowUpRight size={12} className="text-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-500">{trend}</span>
      </div>
    </div>
  </div>
);

const Resources: React.FC = () => {
  const [currentUser] = useState(db.getUser());
  const [currentCollege, setCurrentCollege] = useState<College | 'Global'>('Global');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setResources(db.getResources());
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesCollege = currentCollege === 'Global' || res.college === currentCollege;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCollege && matchesSearch;
    });
  }, [resources, currentCollege, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-10 pb-40 animate-in fade-in duration-700 font-mono">
      
      {/* 1. KNOWLEDGE MARKET OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KnowledgeStatCard label="Knowledge_TVL" value="4.2M" trend="+12.4%" color="text-indigo-500" />
        <KnowledgeStatCard label="Research_APR" value="84.2%" trend="+5.1%" color="text-emerald-500" />
        <KnowledgeStatCard label="Protocol_Nodes" value="1.2k" trend="+0.8%" color="text-amber-500" />
        <KnowledgeStatCard label="Active_Queries" value="24.5k" trend="+42.3%" color="text-rose-500" />
      </section>

      {/* 2. TRADING TERMINAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-8 border-b border-[var(--border-color)] pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-2xl glow-primary">
              <Database size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-[var(--text-primary)]">
                Vault.<span className="text-indigo-600">Assets</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mt-2">
                Unified Academic Registry / v4.2 Stable
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={20} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Query Asset Metadata..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-indigo-600 transition-all text-[var(--text-primary)]"
            />
          </div>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={18} /> Initialize_Asset
          </button>
        </div>
      </div>

      {/* 3. ASSET ORDER BOOK (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* WING SELECTOR SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest flex items-center gap-2">
              <Globe size={14}/> Registry_Sectors
            </h3>
            <div className="space-y-1">
              {['Global', ...Object.keys(COURSES_BY_COLLEGE)].map(c => (
                <button 
                  key={c}
                  onClick={() => { setCurrentCollege(c as any); setIsScanning(true); setTimeout(() => setIsScanning(false), 500); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${currentCollege === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  <span>{c} Hub</span>
                  {currentCollege === c && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-indigo-600 rounded-2xl text-white space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><Zap size={80}/></div>
            <h4 className="text-xs font-black uppercase tracking-widest">Yield_Farming</h4>
            <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase italic">
              "Commit high-quality assets to the registry to earn Node Authority XP and unlock Pro Strata access."
            </p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Start Upload</button>
          </div>
        </aside>

        {/* MAIN ASSET LIST */}
        <main className="lg:col-span-9 space-y-4">
          {isScanning ? (
            <div className="py-40 text-center space-y-4 glass-panel rounded-3xl">
              <Activity size={48} className="mx-auto text-indigo-500 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Synchronizing Wing Manifest...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map(res => (
                <div key={res.id} className="glass-panel p-8 rounded-3xl hover:border-indigo-500/50 transition-all duration-500 group relative flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={`p-4 rounded-2xl border ${res.category === 'Research' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'}`}>
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Yield</span>
                        <span className="text-sm font-black text-emerald-500">+8.4%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-none mb-2">{res.title}</h4>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{res.course} / STRATA: {res.year}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--bg-primary)] bg-slate-200" />)}
                       </div>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{res.downloads.toLocaleString()} PEERS SYNCED</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border-color)] pt-6">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase">Network_ID</span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-primary)]">SHA-256_{res.id.slice(-6)}</span>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2">
                      <Download size={14} /> Sync_Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-60 text-center space-y-6 glass-panel rounded-3xl">
              <FilterX size={64} className="mx-auto text-slate-300 opacity-20" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-400">Registry.Empty</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">No alphanumeric signals detected in this hub.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Resources;
