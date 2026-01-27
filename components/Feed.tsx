import React, { useState, useEffect, useRef } from 'react';
import { Post, User, College, AuthorityRole, PollData, PollOption } from '../types';
import { db } from '../db';
import { GoogleGenAI } from "@google/genai";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import { Heart, MessageCircle, X, Loader2, Zap, Maximize2, Radio, Send, Activity, Gauge, MousePointer2, ShieldCheck, Globe, ArrowUpRight, TrendingUp, BarChart3, Clock, Terminal, Fingerprint, Share2 } from 'lucide-react';

const SHA_GEN = () => Math.random().toString(16).substring(2, 6).toUpperCase();

const NetworkIntensityGraph: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const sparkData = Array.from({ length: 15 }, (_, i) => ({ v: 40 + Math.random() * 50 }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
      <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 relative overflow-hidden group scanning-line">
        <div className="relative z-10 flex flex-col h-full justify-between">
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity size={12} className="text-indigo-600" /> Network_Intensity_Index
                 </h4>
                 <div className="flex items-center gap-4">
                    <span className="text-4xl font-black italic tracking-tighter text-[var(--text-primary)] ticker-text">74.8</span>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1">
                          <TrendingUp size={10} /> BULLISH_SYNC
                       </span>
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live telemetry • v4.2</span>
                    </div>
                 </div>
              </div>
              <div className="w-32 h-16 opacity-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                       <Area type="monotone" dataKey="v" stroke="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-1">
              {['SYNC: STABLE', 'NODES: 52k', 'UPLINK: 98%'].map(stat => (
                <span key={stat} className="px-2 py-1 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded text-[8px] font-black uppercase whitespace-nowrap">{stat}</span>
              ))}
           </div>
        </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between">
         <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Radio size={12} className="text-rose-500" /> Sector_Watchlist
         </h4>
         <div className="space-y-3">
            {[{ t: '#COCIS', v: '+12.4%', c: 'text-emerald-500' }, { t: '#CEDAT', v: '-2.1%', c: 'text-rose-500' }, { t: '#LAW', v: '+45.8%', c: 'text-emerald-500' }].map((item, i) => (
              <div key={i} className="flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded transition-all cursor-crosshair">
                 <span className="text-[11px] font-black text-[var(--text-primary)]">{item.t}</span>
                 <span className={`text-[10px] font-mono font-bold ticker-text ${item.c}`}>{item.v}</span>
              </div>
            ))}
         </div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
         <div className="relative z-10">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset_Liquidity_Flow</h4>
            <p className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter mt-1 ticker-text">UGX 8.2M</p>
            <p className="text-[8px] font-bold text-emerald-500 uppercase mt-2 flex items-center gap-1"><ArrowUpRight size={12}/> VOL_UP_24H</p>
         </div>
         <div className="pt-4 space-y-1">
            <div className="h-1 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600 w-[84%] animate-pulse"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const AuthoritySeal: React.FC<{ role?: AuthorityRole, size?: number }> = ({ role, size = 16 }) => {
  if (!role) return null;
  const isInstitutional = role === 'Official' || role === 'Corporate' || role === 'Academic Council';
  const color = isInstitutional ? '#94a3b8' : 'var(--brand-primary)';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="inline-block ml-1 align-text-bottom flex-shrink-0">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34-2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.96-4.96 1.41 1.41-6.37 6.37z" fill={color}/>
    </svg>
  );
};

const PostItem: React.FC<{ post: Post, currentUser: User, onOpenThread: (id: string) => void, onNavigateToProfile: (id: string) => void }> = ({ post, currentUser, onOpenThread, onNavigateToProfile }) => (
  <article className="mb-6 group">
     <div className="flex items-start gap-4">
        {/* Profile column - tighter to save space */}
        <div className="shrink-0 pt-1">
           <img 
              src={post.authorAvatar} 
              onClick={() => onNavigateToProfile(post.authorId)} 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded border border-[var(--border-color)] cursor-pointer bg-white object-cover shadow-sm transition-transform hover:scale-105 active:scale-95" 
              alt="Node"
           />
        </div>
        {/* Content Area - Expanded to full width by removing the left line */}
        <div className="flex-1 min-w-0">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 overflow-hidden">
                 <span onClick={() => onNavigateToProfile(post.authorId)} className="text-[11px] font-black uppercase text-[var(--text-primary)] hover:text-indigo-600 cursor-pointer truncate tracking-tight">{post.author}</span>
                 <AuthoritySeal role={post.authorAuthority} size={14} />
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline opacity-60">@{post.college}</span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[9px] font-mono font-bold text-slate-400 opacity-50 italic ticker-text">{post.timestamp}</span>
                 <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"><Share2 size={12} className="text-slate-400"/></button>
              </div>
           </div>

           <div onClick={() => onOpenThread(post.id)} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-lg cursor-pointer hover:border-indigo-600/40 transition-all shadow-sm group-hover:shadow-md relative overflow-hidden trading-border">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    <Terminal size={10}/> ORDER_LOG_{SHA_GEN()}
                 </div>
                 <div className="px-2 py-0.5 bg-indigo-600/10 text-indigo-600 rounded text-[7px] font-black uppercase tracking-widest border border-indigo-600/20">VERIFIED_PROTOCOL</div>
              </div>
              
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-[14px] leading-relaxed font-mono text-[var(--text-primary)] mb-6" />
              
              <div className="flex items-center gap-8 pt-4 border-t border-[var(--border-color)]">
                 <button className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-rose-500 transition-colors active:scale-90">
                    <Heart size={16} /> <span className="ticker-text">{post.likes.toLocaleString()}</span>
                 </button>
                 <button className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-indigo-600 transition-colors active:scale-90">
                    <MessageCircle size={16} /> <span className="ticker-text">{post.commentsCount.toLocaleString()}</span>
                 </button>
                 <div className="ml-auto flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                       <span className="text-[7px] font-black text-slate-400 uppercase">SIGN_HASH</span>
                       <span className="text-[9px] font-mono text-slate-500">{SHA_GEN()}{SHA_GEN()}</span>
                    </div>
                    <div className="h-8 w-px bg-[var(--border-color)] hidden sm:block"></div>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-600/10 rounded transition-all">
                       <ArrowUpRight size={16}/>
                    </button>
                 </div>
              </div>
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
    <div className="max-w-[1440px] mx-auto pb-40 lg:px-12 py-8 bg-[var(--bg-primary)] min-h-screen font-sans">
      {/* SECTOR TERMINAL BANNER */}
      <div className="mb-10 px-8 py-8 bg-indigo-600 text-white rounded-xl shadow-2xl relative overflow-hidden group scanning-line">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe size={180}/></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-1">
               <div className="flex items-center gap-4">
                  <ShieldCheck size={28} className="text-white animate-pulse" />
                  <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">
                    {collegeFilter === 'Global' ? 'Universal.Registry' : `${collegeFilter}.Terminal`}
                  </h1>
               </div>
               <p className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-80 mt-2">Active Protocol: Node_Synchronization / Stratum_{collegeFilter}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className="px-5 py-2 bg-white/10 border border-white/20 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14}/> {filteredPosts.length} Active Node Commits detected
               </div>
               <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Sys_Status: NOMINAL [0.42ms]</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-2">
            {!threadId && <NetworkIntensityGraph posts={posts} />}
            
            {/* Header for the Feed List */}
            <div className="flex items-center justify-between mb-8 px-2 border-b border-[var(--border-color)] pb-4">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                  <Terminal size={14} /> Global_Signal_Manifest
               </h3>
               <div className="flex items-center gap-4">
                  <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Newest</button>
                  <span className="text-slate-300">/</span>
                  <button className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600">Top_Sync</button>
               </div>
            </div>

            <div className="space-y-4">
               {filteredPosts.map((post) => (
                 <PostItem key={post.id} post={post} currentUser={user} onOpenThread={onOpenThread} onNavigateToProfile={onNavigateToProfile} />
               ))}
            </div>
         </div>
         
         {/* Trading Watchlist Sidebar */}
         <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-8">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm overflow-hidden scanning-line">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                 <MousePointer2 size={16} className="text-indigo-600" /> Hot_Signal_Tags
               </h3>
               <div className="space-y-6">
                  {['Research', 'Hackathon', 'Guild89', 'Innovation'].map((tag) => (
                    <div key={tag} className="flex justify-between items-center group cursor-pointer p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                          <span className="text-[13px] font-black text-indigo-600 uppercase italic">#{tag}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-emerald-500 font-mono text-[10px] font-black ticker-text">+{(Math.random() * 20).toFixed(1)}%</span>
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Velocity</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 rotate-12"><Zap size={140} fill="white"/></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <BarChart3 size={24} className="text-white"/>
                     <h4 className="text-[16px] font-black uppercase tracking-widest leading-none italic">Elite_Strata</h4>
                  </div>
                  <p className="text-[12px] font-bold opacity-90 uppercase leading-relaxed tracking-tight">
                    Upgrade to high-frequency synchronization. Access prioritized asset indexing and unlimited scholarly vault logs.
                  </p>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-lg font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl transition-all active:scale-95">Commit_Uplink</button>
               </div>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-xl">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-loose italic">
                  "Registry protocol synchronization v4.2 stable. End-to-end signal encryption active for all nodes within the Hillstrata network."
               </p>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default Feed;