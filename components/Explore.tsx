
import React, { useState } from 'react';
import { 
  Search, TrendingUp, Users, MapPin, Sparkles, Hash, 
  Globe, Zap, ArrowUpRight, Radio, Cpu, Fingerprint,
  Mic2, BookOpen, Trophy, Palette, Code, ChevronRight
} from 'lucide-react';
import { COLLEGE_BANNERS } from '../constants';

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
      {/* Global Pulse Header */}
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

      {/* Category Intelligence Bar */}
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
        {/* Primary Intelligence Feed */}
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
                <TrendingUp size={24} className="text-indigo-600" /> Hot Signals
              </h3>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
              <Sparkles size={24} className="text-amber-500" /> Discover Wings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(COLLEGE_BANNERS).slice(0, 4).map(([name, url]) => (
                <div key={name} className="group relative h-64 rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-xl transition-all hover:scale-[1.02]">
                  <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{name} Wing</h4>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-1">Initialize Hub Scan</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Node Scanner Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <section className="glass-card p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] shadow-sm relative overflow-hidden transition-theme">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <h3 className="text-lg font-black text-[var(--text-primary)] mb-8 uppercase tracking-widest flex items-center gap-3">
              <Zap size={20} className="text-indigo-600" /> Node Activity
            </h3>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] transition-theme" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-[var(--sidebar-bg)] rounded-full transition-theme"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--text-primary)] font-bold truncate leading-none uppercase tracking-tight">Active Node {i}</p>
                    <p className="text-[9px] text-[var(--text-secondary)] font-medium mt-1 line-clamp-1">"Broadcasting from {['Library', 'Hall', 'Lab'][i%3]} stratum..."</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Explore;
