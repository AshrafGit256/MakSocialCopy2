
import React from 'react';
import { Search, TrendingUp, Users, MapPin, Sparkles, Hash } from 'lucide-react';

const Explore: React.FC = () => {
  const trendingTags = [
    { name: 'ResearchWeek', count: '5.2k', college: 'MAK' },
    { name: 'Finalists2025', count: '3.1k', college: 'ALL' },
    { name: 'CodingChallenge', count: '1.8k', college: 'COCIS' },
    { name: 'DesignMak', count: '1.2k', college: 'CEDAT' },
  ];

  const colleges = [
    { name: 'COCIS', members: '4.5k', color: 'bg-blue-500' },
    { name: 'CEDAT', members: '3.2k', color: 'bg-emerald-500' },
    { name: 'CHUSS', members: '2.8k', color: 'bg-indigo-500' },
    { name: 'CHS', members: '5.1k', color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-12 pb-32">
      <div className="relative">
        <h1 className="text-5xl font-black text-white italic tracking-tighter">Explore the Hub</h1>
        <p className="text-slate-500 text-lg mt-2">Discover what's trending across all Makerere colleges.</p>
        
        <div className="mt-8 relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            className="w-full bg-[#1a1f2e] border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-white focus:ring-2 focus:ring-blue-600/30 outline-none transition-all placeholder:text-slate-600"
            placeholder="Search for students, projects, or hashtags..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> Trending Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTags.map((tag, i) => (
                <div key={i} className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/10 transition-colors">
                      <Hash className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">#{tag.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{tag.college} • {tag.count} Posts</p>
                    </div>
                  </div>
                  <TrendingUp size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-3 text-white">
              <Sparkles className="text-yellow-500" /> Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map(i => (
                 <div key={i} className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 group cursor-pointer">
                    <div className="h-48 relative">
                       <img src={`https://picsum.photos/seed/${i+50}/600/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                       <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase">Project of the week</span>
                       </div>
                    </div>
                    <div className="p-6">
                       <h4 className="text-lg font-black text-white">Makerere Blockchain Hub</h4>
                       <p className="text-sm text-slate-400 mt-2 line-clamp-2">A student-led initiative to bring decentralized tech to the campus curriculum.</p>
                       <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase">
                          <span className="flex items-center gap-1"><Users size={12}/> 24 Collaborators</span>
                          <span className="flex items-center gap-1"><MapPin size={12}/> COCIS Lab 4</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-black text-white">College Communities</h3>
            <div className="space-y-4">
              {colleges.map((c, i) => (
                <div key={i} className="glass-card p-5 rounded-[2rem] border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${c.color} rounded-2xl flex items-center justify-center font-black text-white shadow-lg`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase">{c.members} Members</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white">Visit</button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/20 to-transparent border-indigo-500/10 border">
             <h3 className="text-lg font-black text-white mb-6">Top Members</h3>
             <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-blue-500 transition-colors" />
                        <div>
                           <p className="text-sm font-bold text-slate-200">Alex Student {i}</p>
                           <p className="text-[10px] text-slate-500 font-medium">COCIS • 4th Year</p>
                        </div>
                     </div>
                     <div className="text-yellow-500 text-sm">⭐</div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 transition-all">View Leaderboard</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Explore;
