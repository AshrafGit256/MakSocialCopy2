
import React, { useState } from 'react';
import { 
  GitPullRequest, Users, Zap, Search, Filter, 
  ArrowUpRight, Clock, ShieldCheck, Code, Palette, 
  Book, Briefcase, Plus, Terminal, Database, Globe
} from 'lucide-react';
import { College } from '../types';

interface ForgeProject {
  id: string;
  title: string;
  initiatorWing: College;
  initiatorName: string;
  initiatorAvatar: string;
  description: string;
  needs: College[];
  contributors: number;
  status: 'Recruiting' | 'Building' | 'Alpha' | 'Beta';
  complexity: 'High' | 'Mid' | 'Low';
  tags: string[];
}

const MOCK_FORGE: ForgeProject[] = [
  {
    id: 'f-1',
    title: 'University Smart Logistics Protocol',
    initiatorWing: 'COCIS',
    initiatorName: 'Dr. John S.',
    initiatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    description: 'Developing a blockchain-based courier synchronization node for university documents and assets. High-security stratification required.',
    needs: ['LAW', 'CEDAT', 'COBAMS'],
    contributors: 5,
    status: 'Recruiting',
    complexity: 'High',
    tags: ['Blockchain', 'Cryptography', 'Legal Compliance']
  },
  {
    id: 'f-2',
    title: 'Precision Agri-Drone Cluster',
    initiatorWing: 'CEDAT',
    initiatorName: 'Sarah M.',
    initiatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    description: 'Engineering low-cost telemetry nodes for aerial crop monitoring at the CoVAB farm wing. Interfacing with satellite logic.',
    needs: ['CAES', 'CONAS', 'COCIS'],
    contributors: 8,
    status: 'Building',
    complexity: 'High',
    tags: ['Aerospace', 'Agriculture', 'Embedded Systems']
  },
  {
    id: 'f-3',
    title: 'Constitutional Literacy Bot',
    initiatorWing: 'LAW',
    initiatorName: 'Counsel Peter',
    initiatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
    description: 'An AI-powered legal assistant to help first-year students understand their rights and the guild constitution.',
    needs: ['COCIS', 'CHUSS'],
    contributors: 3,
    status: 'Alpha',
    complexity: 'Mid',
    tags: ['NLP', 'Legal Tech', 'Education']
  },
  {
    id: 'f-4',
    title: 'Campus Health Pulse Matrix',
    initiatorWing: 'CHS',
    initiatorName: 'Dr. Nalule',
    initiatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nalule',
    description: 'Synchronizing student health data for real-time epidemic tracking and wellness advisory signals across all halls.',
    needs: ['COCIS', 'COBAMS'],
    contributors: 12,
    status: 'Beta',
    complexity: 'High',
    tags: ['Medicine', 'Big Data', 'Public Health']
  }
];

const Forge: React.FC<{ onNavigateToProfile: (id: string) => void }> = ({ onNavigateToProfile }) => {
  const [filter, setFilter] = useState<College | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_FORGE.filter(p => {
    const matchesWing = filter === 'All' || p.initiatorWing === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesWing && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-40 animate-in fade-in duration-500">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/20">
                <GitPullRequest size={32} />
             </div>
             <div>
                <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">The Forge</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Collaboration Matrix / Active Skill Sync</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
                placeholder="Search project nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
              <Plus size={16}/> Initialize Project
           </button>
        </div>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[var(--border-color)]">
         <button 
           onClick={() => setFilter('All')}
           className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'All' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
         >
           Universal
         </button>
         {['COCIS', 'CEDAT', 'CHS', 'LAW', 'CAES', 'COBAMS', 'CHUSS', 'CONAS', 'CEES'].map(wing => (
           <button 
             key={wing}
             onClick={() => setFilter(wing as College)}
             className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === wing ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
           >
             {wing} HUB
           </button>
         ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Initiatives', val: '124', icon: <Terminal size={18}/> },
           { label: 'Skill Requests', val: '458', icon: <Zap size={18} className="text-amber-500"/> },
           { label: 'Wing Synchronizations', val: '890', icon: <Globe size={18} className="text-emerald-500"/> },
           { label: 'Contributors Online', val: '2.1k', icon: <Users size={18} className="text-indigo-600"/> }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-[var(--bg-secondary)] rounded-xl">{stat.icon}</div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-black">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(project => (
          <div key={project.id} className="group glass-card bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-indigo-600/30 transition-all p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <img 
                      src={project.initiatorAvatar} 
                      className="w-10 h-10 rounded-xl border border-[var(--border-color)] object-cover cursor-pointer hover:brightness-90 transition-all" 
                    />
                    <div>
                       <h4 className="text-[11px] font-black uppercase tracking-tight">{project.initiatorName}</h4>
                       <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">{project.initiatorWing} LEAD</p>
                    </div>
                 </div>
                 <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                   project.status === 'Recruiting' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                   project.status === 'Building' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                   'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                 }`}>
                    {project.status}
                 </span>
              </div>

              <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-indigo-600 transition-colors leading-none">{project.title}</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">"{project.description}"</p>
              </div>

              <div className="pt-4 space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-black uppercase px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded">#{tag}</span>
                    ))}
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Filter size={12}/> Needs Intelligence From:
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {project.needs.map(wing => (
                         <span key={wing} className="text-[9px] font-black uppercase px-3 py-1.5 bg-rose-500/5 text-rose-500 border border-rose-500/20 rounded-lg">{wing} WING</span>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--sidebar-bg)] bg-slate-200" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--sidebar-bg)] bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black">+{project.contributors}</div>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{project.complexity} Complexity</span>
               </div>
               <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                  Request Uplink <ArrowUpRight size={14}/>
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 border border-dashed border-[var(--border-color)] rounded-3xl bg-slate-50 dark:bg-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[var(--border-color)]">
               <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <div>
               <h4 className="text-lg font-black uppercase tracking-tight">Collaboration Integrity</h4>
               <p className="text-xs text-slate-500 font-medium">"All forge synchronizations are logged to your academic profile. Build responsibly."</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-sm">View Archive</button>
      </div>
    </div>
  );
};

export default Forge;
