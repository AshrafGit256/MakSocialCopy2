
import React from 'react';
import { MOCK_NEWS } from '../constants';
import { TrendingUp, MessageSquare, Newspaper, ExternalLink, Hash } from 'lucide-react';

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
          View All News <ExternalLink size={12}/>
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
            { tag: '#RegistrySync', posts: '2.4k posts' },
            { tag: '#GuildElections', posts: '1.8k posts' },
            { tag: '#MakerereAt100', posts: '1.2k posts' },
            { tag: '#TheHill', posts: '890 posts' },
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

      {/* SUGGESTED ACCOUNTS */}
      <section className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md p-5 shadow-sm space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Suggested Hubs</h3>
        <div className="space-y-4">
          {[
            { name: 'Mak Guild', role: 'Student Gov', img: 'https://api.dicebear.com/7.x/identicon/svg?seed=Guild' },
            { name: 'Mak Sports', role: 'Athletics', img: 'https://api.dicebear.com/7.x/identicon/svg?seed=Sports' }
          ].map((hub) => (
            <div key={hub.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={hub.img} className="w-10 h-10 rounded-full border border-[var(--border-color)]" alt={hub.name} />
                <div className="min-w-0">
                  <p className="text-[12px] font-black text-slate-900 truncate uppercase">{hub.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate uppercase">{hub.role}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] text-[9px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all">Follow</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-2 space-y-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <a href="#" className="hover:underline">About</a>
           <a href="#" className="hover:underline">Privacy</a>
           <a href="#" className="hover:underline">Terms</a>
           <a href="#" className="hover:underline">Cookies</a>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© 2026 MakSocial Corp.</p>
      </footer>
    </aside>
  );
};

export default RightSidebar;
