
import React, { useState } from 'react';
import { 
  Search, TrendingUp, Users, MapPin, Sparkles, Hash, 
  Globe, Zap, ArrowUpRight, Radio, Cpu, Fingerprint,
  Mic2, BookOpen, Trophy, Palette, Code, ChevronRight
} from 'lucide-react';

const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const trendingTags = [
    { name: 'ResearchWeek', count: '5.2k', trend: '+12%', color: 'text-indigo-500' },
    { name: 'GuildElections', count: '8.4k', trend: '+45%', color: 'text-rose-500' },
    { name: 'InnovateMak', count: '2.1k', trend: '+8%', color: 'text-emerald-500' },
    { name: 'CampusCup', count: '1.8k', trend: '+5%', color: 'text-amber-500' },
  ];

  const collegeNodes = [
    { id: 'COCIS', name: 'Computing & IT', members: '4.5k', color: 'from-blue-600/20 to-blue-500/5', glow: 'group-hover:shadow-blue-500/20' },
    { id: 'CEDAT', name: 'Engineering & Art', members: '3.2k', color: 'from-emerald-600/20 to-emerald-500/5', glow: 'group-hover:shadow-emerald-500/20' },
    { id: 'CHS', name: 'Health Sciences', members: '5.1k', color: 'from-rose-600/20 to-rose-500/5', glow: 'group-hover:shadow-rose-500/20' },
    { id: 'LAW', name: 'School of Law', members: '1.8k', color: 'from-amber-600/20 to-amber-500/5', glow: 'group-hover:shadow-amber-500/20' },
  ];

  const categories = [
    { name: 'All', icon: <Globe size={14}/> },
    { name: 'Academia', icon: <BookOpen size={14}/> },
    { name: 'Tech', icon: <Code size={14}/> },
    { name: 'Arts', icon: <Palette size={14}/> },
    { name: 'Sports', icon: <Trophy size={14}/> }
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 space-y-16 pb-40">
      {/* 1. Global Pulse Header */}
      <section className="relative flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/40">
              <Cpu className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-none">
                Signal Scanner
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em] text-[10px]">Live Campus Pulse Registry</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-xl space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center gap-4 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-[2.2rem] px-8 py-5 transition-theme">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                className="flex-1 bg-transparent border-none focus:outline-none text-base font-medium placeholder:text-slate-500 text-[var(--text-primary)]"
                placeholder="Search encrypted node directory..."
              />
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest transition-theme">
                <Fingerprint size={12} /> SCAN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Intelligence Bar */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 border-b border-[var(--border-color)] transition-theme">
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeCategory === cat.name 
              ? 'bg-indigo-600 text-white border-transparent shadow-xl shadow-indigo-600/20 scale-105' 
              : 'bg-[var(--bg-secondary)] text-slate-500 border-[var(--border-color)] hover:border-indigo-500 hover:text-indigo-500'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 3. Primary Intelligence Feed */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Signal Intensity Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
                <TrendingUp size={24} className="text-indigo-600" /> Hot Signals
              </h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Updated 2m ago</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trendingTags.map((tag) => (
                <div key={tag.name} className="glass-card group p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10">
                    <Hash size={64} className={tag.color} />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h4 className={`text-xl font-black uppercase tracking-tighter ${tag.color}`}>#{tag.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{tag.count} ACTIVE SIGNALS</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                        <ArrowUpRight size={14} /> {tag.trend}
                      </div>
                      <div className="w-16 h-1 bg-slate-100 dark:bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-indigo-600 w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Intelligence Reports */}
          <section className="space-y-8">
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
              <Sparkles size={24} className="text-amber-500" /> Intelligence Reports
            </h3>
            <div className="grid grid-cols-1 gap-10">
              {[
                { title: 'The Makerere Blockchain Initiative', author: 'COCIS Lab Alpha', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200', tag: 'High Density' },
                { title: 'New Art: The Sculptures of CEDAT', author: 'Arts & Design Wing', img: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1200', tag: 'Visual Asset' }
              ].map((report, i) => (
                <div key={i} className="group relative rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-xl transition-theme">
                  <div className="h-96 relative overflow-hidden">
                    <img src={report.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={report.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute top-8 left-8">
                      <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                        {report.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
                      <div className="space-y-2">
                        <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight max-w-lg">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-4 text-white/60 text-xs font-black uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Fingerprint size={14}/> ID: {report.author}</span>
                          <span className="flex items-center gap-2"><Radio size={14}/> 4.2k READS</span>
                        </div>
                      </div>
                      <button className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 shadow-2xl active:scale-95">
                        Initialize Scan <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. Peripheral Node Scanner (Sidebar) */}
        <div className="lg:col-span-4 space-y-12">
          {/* College Community Nodes */}
          <section className="space-y-6">
            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest">Active Hub Nodes</h3>
            <div className="grid grid-cols-1 gap-4">
              {collegeNodes.map((node) => (
                <div key={node.id} className={`group glass-card p-6 bg-gradient-to-br ${node.color} border-[var(--border-color)] hover:border-indigo-500/50 transition-all cursor-pointer relative shadow-sm ${node.glow}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl shadow-lg border border-[var(--border-color)] transition-theme">
                        {node.id[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-tight">{node.name}</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{node.members} NODES CONNECTED</p>
                      </div>
                    </div>
                    <div className="p-2 bg-[var(--bg-secondary)] rounded-xl text-slate-400 group-hover:text-indigo-600 transition-all">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all shadow-inner">
              Browse All College Units
            </button>
          </section>

          {/* Real-time Activity Cluster */}
          <section className="glass-card p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] shadow-sm relative overflow-hidden transition-theme">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <h3 className="text-lg font-black text-[var(--text-primary)] mb-8 uppercase tracking-widest flex items-center gap-3">
              <Zap size={20} className="text-indigo-600" /> Real-time Cluster
            </h3>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] transition-theme" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-[var(--sidebar-bg)] rounded-full transition-theme"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--text-primary)] font-bold truncate leading-none uppercase tracking-tight">Node User_{i}82</p>
                    <p className="text-[9px] text-[var(--text-secondary)] font-medium mt-1 line-clamp-1 group-hover:text-indigo-500 transition-colors">"Just synchronized a new asset to the #Research node..."</p>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-2 block">{i * 3}m ago</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--border-color)] transition-theme">
               <div className="flex items-center justify-between text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  <span>Network Load</span>
                  <span>92% Nominal</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full mt-2 overflow-hidden transition-theme">
                  <div className="h-full bg-indigo-600 w-11/12"></div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Explore;
