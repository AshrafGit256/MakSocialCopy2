
import React from 'react';
import { MOCK_NEWS } from '../constants';
import { Newspaper, TrendingUp, Hash, ExternalLink, Activity, Radio, PlayCircle, Globe, Zap } from 'lucide-react';

const RightSidebar: React.FC = () => {
  // Direct raw link for HTML video element:
  const NEWS_VIDEO_URL = "https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/journalism4.mp4";

  return (
    <aside className="hidden xl:flex xl:w-[420px] 2xl:w-[480px] flex-col gap-8 p-8 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-y-auto no-scrollbar shrink-0">
      
      {/* LIVE BROADCAST HEADER */}
      <section className="bg-black rounded-[20px] overflow-hidden shadow-2xl relative aspect-video group">
        <video 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          autoPlay 
          muted 
          loop 
          playsInline
          src={NEWS_VIDEO_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Pulse Broadcast</span>
           </div>
           <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">Journalism & Media Wing</h3>
           <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Real-time updates from Freedom Square</p>
        </div>
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
           <PlayCircle size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
      </section>

      {/* NEWS BULLETIN */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio size={18} className="text-indigo-600 animate-pulse" />
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">Campus Bulletin</h3>
          </div>
          <button className="text-[10px] font-bold text-indigo-600 hover:underline">Customize</button>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {MOCK_NEWS.map((news) => (
            <div key={news.id} className="p-6 hover:bg-slate-50 transition-all cursor-pointer group relative">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                   news.category === 'Academic' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                   news.category === 'Sports' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                   'bg-amber-50 text-amber-600 border-amber-100'
                }`}>{news.category}</span>
                <span className="text-[10px] font-bold text-slate-400">{news.time}</span>
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-relaxed">
                {news.title}
              </h4>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Globe size={12}/> {news.source || 'MakMediaHub'}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-4 bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 border-t border-[var(--border-color)]">
          Open News Archive <ExternalLink size={14}/>
        </button>
      </section>

      {/* CAMPUS TRENDS */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp size={18} className="text-amber-500" />
          <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">Trending Hubs</h3>
        </div>
        <div className="space-y-5">
          {[
            { tag: '#MakConvocation', posts: '4.2k nodes', trend: 'up' },
            { tag: '#CEDATExpo2026', posts: '2.1k nodes', trend: 'up' },
            { tag: '#TheHillSync', posts: '1.8k nodes', trend: 'down' },
            { tag: '#FreedomSquareLive', posts: '940 nodes', trend: 'up' },
          ].map((trend) => (
            <div key={trend.tag} className="flex justify-between items-center group cursor-pointer">
              <div className="space-y-1">
                 <p className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight uppercase">{trend.tag}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{trend.posts}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <Hash size={14} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                 {trend.trend === 'up' && <div className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce"></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEM INTEGRITY */}
      <section className="bg-slate-900 text-white rounded-xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
            <Zap size={80} fill="currentColor" />
         </div>
         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="flex items-center gap-3"><Activity size={14} className="text-emerald-400 shadow-[0_0_8px_#10b981]" /> Registry Online</span>
            <span className="text-white/40">v5.0.0</span>
         </div>
         <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black text-white/50 tracking-widest">
               <span>NETWORK INTENSITY</span>
               <span>98.4%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
            </div>
         </div>
      </section>

      <footer className="px-2 space-y-3">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <a href="#" className="hover:text-indigo-600 transition-colors">Nodes</a>
           <a href="#" className="hover:text-indigo-600 transition-colors">Manifesto</a>
           <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
           <a href="#" className="hover:text-indigo-600 transition-colors">Governance</a>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 MakSocial Registry.</p>
      </footer>
    </aside>
  );
};

export default RightSidebar;
