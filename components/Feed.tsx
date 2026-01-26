import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, PollOption } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import { Heart, MessageCircle, X, Loader2, Zap, Maximize2, Radio, Send, Activity, Gauge, MousePointer2, ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';

const NetworkIntensityGraph: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const sparkData = [{ v: 40 }, { v: 45 }, { v: 38 }, { v: 52 }, { v: 60 }, { v: 55 }, { v: 72 }, { v: 85 }, { v: 78 }, { v: 92 }];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-5"><Gauge size={140} /></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Network_Intensity_Index</h4>
                 <div className="flex items-center gap-3">
                    <span className="text-4xl font-black italic tracking-tighter text-emerald-500">74.8</span>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase text-emerald-500">BULLISH</span>
                       <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Live telemetry</span>
                    </div>
                 </div>
              </div>
              <div className="w-24 h-12">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                       <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b98122" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <p className="mt-4 text-[10px] text-[var(--text-secondary)] font-medium italic border-l border-[var(--border-color)] pl-4 leading-relaxed">
             "Signal velocity increased in COCIS and CEDAT sectors. Academic asset commitment at 24-hour high."
           </p>
        </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between">
         <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Node_Watchlist</h4>
         <div className="space-y-3">
            {[{ t: '#COCIS', v: '+12.4%', c: 'text-emerald-500' }, { t: '#CEDAT', v: '-2.1%', c: 'text-rose-500' }, { t: '#LAW', v: '+45.8%', c: 'text-emerald-500' }].map((item, i) => (
              <div key={i} className="flex justify-between items-center hover:bg-black/5 p-1 rounded transition-all">
                 <span className="text-[10px] font-black text-[var(--text-primary)]">{item.t}</span>
                 <span className={`text-[9px] font-mono font-bold ${item.c}`}>{item.v}</span>
              </div>
            ))}
         </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
         <div className="relative z-10">
            <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Registry_Flow</h4>
            <p className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter mt-1">UGX 8.2M</p>
            <p className="text-[7px] font-bold text-emerald-500 uppercase mt-1 flex items-center gap-1"><ArrowUpRight size={10}/> UP_CYCLE</p>
         </div>
         <div className="pt-4 space-y-1">
            <div className="h-1 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600 w-[84%]"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  const isInstitutional = role === 'Official' || role === 'Corporate';
  const color = isInstitutional ? '#94a3b8' : 'var(--brand-primary)';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block ml-1 align-text-bottom flex-shrink-0">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill={color}/>
    </svg>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile }) => (
  <article className="flex gap-4 mb-8">
     <img src={post.authorAvatar} onClick={() => onNavigateToProfile(post.authorId)} className="w-10 h-10 rounded-lg border border-[var(--border-color)] cursor-pointer bg-[var(--bg-primary)] object-cover" />
     <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[var(--text-primary)] hover:text-indigo-600 cursor-pointer">{post.author}</span>
              <AuthoritySeal role={post.authorAuthority} size={14} />
              <span className="text-slate-400">@ {post.college}</span>
           </div>
           <span className="text-slate-400 font-mono italic opacity-50">{post.timestamp}</span>
        </div>
        <div onClick={() => onOpenThread(post.id)} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl cursor-pointer hover:border-indigo-600/30 transition-all">
           <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-[13px] leading-relaxed font-mono text-[var(--text-primary)]" />
           <div className="mt-4 flex gap-6 text-[10px] font-black text-slate-400">
              <span className="flex items-center gap-1.5 hover:text-rose-500"><Heart size={14}/> {post.likes}</span>
              <span className="flex items-center gap-1.5 hover:text-indigo-600"><MessageCircle size={14}/> {post.commentsCount}</span>
           </div>
        </div>
     </div>
  </article>
);

const Feed: React.FC<{ collegeFilter?: College | 'Global', threadId?: string, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void, onBack?: () => void, triggerSafetyError: (msg: string) => void }> = ({ collegeFilter = 'Global', threadId, onOpenThread, onNavigateToProfile, onBack, triggerSafetyError }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>(db.getUser());
  
  useEffect(() => {
    const sync = () => { setPosts(db.getPosts()); setUser(db.getUser()); };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredPosts = posts.filter(p => {
    if (threadId) return p.parentId === threadId || p.id === threadId;
    return !p.parentId && (collegeFilter === 'Global' || p.college === collegeFilter);
  });
  
  return (
    <div className="max-w-[1200px] mx-auto pb-40 lg:px-12 py-8 bg-[var(--bg-primary)] min-h-screen">
      {/* SECTOR IDENTITY BANNER */}
      <div className="mb-10 px-8 py-8 bg-indigo-600 text-white rounded-xl shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe size={160}/></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-white animate-pulse" />
                  <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter italic leading-none">
                    {collegeFilter === 'Global' ? 'Universal.Global' : `${collegeFilter}.Sector`}
                  </h1>
               </div>
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">Synchronized Environment / {collegeFilter} Wing Hub</p>
            </div>
            <div className="flex items-center gap-3 px-5 py-2 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">
               <Activity size={12}/> {filteredPosts.length} Active Nodes detected
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-8">
            {!threadId && <NetworkIntensityGraph posts={posts} />}
            <div className="space-y-2">
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-8">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                 <MousePointer2 size={16} className="text-indigo-600" /> Hot_Sector_Tags
               </h3>
               <div className="space-y-6">
                  {['#Research', '#Hackathon', '#Guild89', '#Innovation'].map((tag) => (
                    <div key={tag} className="flex justify-between items-center group cursor-pointer p-1">
                       <span className="text-[12px] font-black text-indigo-600 uppercase italic">#{tag}</span>
                       <span className="text-emerald-500 font-mono text-[9px] font-black">+{(Math.random() * 20).toFixed(1)}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;