
import React from 'react';
import { MOCK_NEWS } from '../constants';
import { Newspaper, TrendingUp, Hash, ExternalLink, Activity, Users } from 'lucide-react';

const RightSidebar: React.FC = () => {
  return (
    <aside className="hidden xl:flex w-80 flex-col gap-6 p-6 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-y-auto no-scrollbar shrink-0">
      
      {/* NEWS BULLETIN */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-[var(--brand-color)]" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">News Bulletin</h3>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {MOCK_NEWS.map((news) => (
            <div key={news.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-[var(--brand-color)]/10 text-[var(--brand-color)] rounded">{news.category}</span>
                <span className="text-[9px] font-bold text-slate-400">{news.time}</span>
              </div>
              <h4 className="text-[12px] font-bold text-slate-900 group-hover:text-[var(--brand-color)] transition-colors leading-snug">
                {news.title}
              </h4>
            </div>
          ))}
        </div>
        <button className="w-full py-3 bg-[var(--bg-secondary)] text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] transition-all flex items-center justify-center gap-2 border-t border-[var(--border-color)]">
          See All News <ExternalLink size={12}/>
        </button>
      </section>

      {/* CAMPUS TRENDS */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md p-5 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-amber-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Campus Trends</h3>
        </div>
        <div className="space-y-4">
          {[
            { tag: '#Homecoming2026', posts: '2.4k posts' },
            { tag: '#COCISSync', posts: '1.8k posts' },
            { tag: '#TheHill', posts: '1.2k posts' },
            { tag: '#MakerereAt100', posts: '890 posts' },
          ].map((trend) => (
            <div key={trend.tag} className="flex justify-between items-center group cursor-pointer">
              <div className="space-y-0.5">
                 <p className="text-[12px] font-black text-slate-900 group-hover:text-[var(--brand-color)] transition-colors">{trend.tag}</p>
                 <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{trend.posts}</p>
              </div>
              <Hash size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEM INTEGRITY */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md p-5 shadow-sm space-y-4">
         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
            <span className="flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> Sync Stable</span>
            <span>v4.2.1</span>
         </div>
         <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--brand-color)] w-full animate-pulse"></div>
         </div>
      </section>

      <footer className="px-2 space-y-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <a href="#" className="hover:underline">About</a>
           <a href="#" className="hover:underline">Privacy</a>
           <a href="#" className="hover:underline">Terms</a>
           <a href="#" className="hover:underline">Cookies</a>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Makerere Social Network.</p>
      </footer>
    </aside>
  );
};

export default RightSidebar;
