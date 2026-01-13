
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll, TimelineEvent } from '../types';
// Added Bell to the imports from lucide-react
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock,
  DollarSign, Briefcase, Calendar, Link as LinkIcon, Image as ImageIcon,
  Youtube, Mic2, Newspaper, Radio, History, Heart, User as UserIcon, Zap, X,
  Bell
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts());
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [polls, setPolls] = useState<Poll[]>(db.getPolls());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(db.getTimeline());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'registry' | 'maktv' | 'polls' | 'ads' | 'timeline'>('intelligence');
  
  // MakTV Creation State
  const [makType, setMakType] = useState<'News' | 'Interview'>('News');
  const [makGuest, setMakGuest] = useState('');
  const [makContent, setMakContent] = useState('');
  const [makVideoUrl, setMakVideoUrl] = useState('');
  const [isYoutube, setIsYoutube] = useState(false);

  // Ad Creation State
  const [adPartner, setAdPartner] = useState('');
  const [adContent, setAdContent] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adCta, setAdCta] = useState('Learn More');
  const [adPaid, setAdPaid] = useState('');
  const [adDuration, setAdDuration] = useState('24'); // hours

  useEffect(() => {
    const sync = () => {
      setViolations(db.getViolations());
      setPosts(db.getPosts());
      setUsers(db.getUsers());
      setTimeline(db.getTimeline());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateMakTV = () => {
    if (!makContent.trim() || !makVideoUrl.trim()) return;
    const newMedia: Post = {
      id: `maktv-${Date.now()}`,
      author: `MakTV ${makType}`,
      authorId: 'admin',
      authorRole: 'Official Broadcast',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: makContent,
      video: makVideoUrl,
      hashtags: ['#MakTV', `#${makType}`],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: 'Global' as any,
      isMakTV: true,
      makTVType: makType,
      makTVGuest: makType === 'Interview' ? makGuest : undefined
    };
    db.addPost(newMedia);
    setPosts(db.getPosts());
    setMakContent('');
    setMakVideoUrl('');
    setMakGuest('');
  };

  const totalAdRevenue = posts
    .filter(p => p.isAd && p.adAmountPaid)
    .reduce((acc, curr) => acc + (curr.adAmountPaid || 0), 0);

  // Group timeline by day
  const groupedTimeline = timeline.reduce((acc, event) => {
    const dateStr = new Date(event.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={14} className="text-rose-500" fill="currentColor" />;
      case 'comment': return <MessageCircle size={14} className="text-indigo-400" fill="currentColor" />;
      case 'profile_update': return <UserIcon size={14} className="text-amber-500" />;
      case 'new_post': return <Zap size={14} className="text-indigo-500" />;
      case 'ad_created': return <DollarSign size={14} className="text-emerald-500" />;
      case 'poll_created': return <CheckCircle2 size={14} className="text-sky-500" />;
      case 'event_scheduled': return <Calendar size={14} className="text-purple-500" />;
      case 'event_reminder': return <Bell size={14} className="text-amber-400" />;
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  const getEventColorClass = (type: string) => {
    switch (type) {
      case 'like': return 'bg-rose-500/10 border-rose-500/20';
      case 'comment': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'profile_update': return 'bg-amber-500/10 border-amber-500/20';
      case 'new_post': return 'bg-indigo-500/10 border-indigo-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30"><Monitor className="text-white" size={26}/></div>
             <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Forensic Intelligence & Governance</p>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'intelligence', label: 'Stats', icon: <TrendingUp size={16}/> },
            { id: 'registry', label: 'Feed', icon: <Activity size={16}/> },
            { id: 'maktv', label: 'MakTV', icon: <Tv size={16}/> },
            { id: 'ads', label: 'Ads', icon: <DollarSign size={16}/> },
            { id: 'timeline', label: 'Timeline', icon: <History size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
           {[
             { label: 'Total Engagement', val: posts.reduce((a,c) => a+c.views, 0).toLocaleString(), icon: <Activity/>, color: 'text-indigo-500' },
             { label: 'Ad Revenue', val: `UGX ${totalAdRevenue.toLocaleString()}`, icon: <DollarSign/>, color: 'text-emerald-500' },
             { label: 'Active Ads', val: posts.filter(p => p.isAd).length, icon: <Briefcase/>, color: 'text-amber-500' },
             { label: 'MakTV Assets', val: posts.filter(p => p.isMakTV).length, icon: <Tv/>, color: 'text-indigo-400' },
           ].map((s,i) => (
             <div key={i} className="glass-card p-8 shadow-2xl bg-gradient-to-br from-indigo-500/[0.02] to-transparent border-white/5">
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${s.color}`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <h3 className="text-4xl font-black italic mt-1 text-white">{s.val}</h3>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Activity Stream</h3>
              <button 
                onClick={() => { localStorage.removeItem('maksocial_timeline_v1'); setTimeline([]); }}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400"
              >
                Flush Logs
              </button>
           </div>

           <div className="relative pl-8 md:pl-0">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2"></div>

              {Object.entries(groupedTimeline).length > 0 ? Object.entries(groupedTimeline).map(([date, events]) => (
                <div key={date} className="relative mb-16 last:mb-0">
                   <div className="flex justify-start md:justify-center mb-10 relative z-10">
                      <span className="px-6 py-2 bg-[#020617] border border-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest shadow-2xl">
                         {date}
                      </span>
                   </div>

                   <div className="space-y-8">
                      {events.map((event, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <div key={event.id} className={`flex items-start md:items-center gap-8 md:gap-0 relative ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                             <div className={`w-full md:w-[45%] group`}>
                                <div className={`glass-card p-5 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                   <div className="flex items-center gap-3 mb-3">
                                      <img src={event.userAvatar} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                                      <div>
                                         <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-none">{event.userName}</h4>
                                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                   </div>
                                   <p className="text-[12px] text-slate-300 font-medium italic">"{event.description}"</p>
                                   {event.details && (
                                     <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5 text-[10px] text-slate-500 leading-relaxed font-mono">
                                        {event.details}
                                     </div>
                                   )}
                                </div>
                             </div>
                             <div className="absolute left-0 md:left-1/2 -translate-x-1/2 z-20">
                                <div className={`w-10 h-10 rounded-full border-2 border-[#020617] flex items-center justify-center shadow-xl ${getEventColorClass(event.type)}`}>
                                   {getEventIcon(event.type)}
                                </div>
                             </div>
                             <div className="hidden md:block w-[45%]"></div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              )) : (
                <div className="p-32 text-center glass-card border-dashed text-slate-600 font-black uppercase italic text-xs">
                   Awaiting platform signals...
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'maktv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-5">
           <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden">
                 <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                   <Radio size={24} className="text-indigo-500" /> Broadcast Studio
                 </h3>
                 <div className="space-y-4">
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                       <button onClick={() => setMakType('News')} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest ${makType === 'News' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>News Hour</button>
                       <button onClick={() => setMakType('Interview')} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest ${makType === 'Interview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Alumni Spotlight</button>
                    </div>
                    {makType === 'Interview' && (
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" placeholder="Guest Identity" value={makGuest} onChange={e => setMakGuest(e.target.value)} />
                    )}
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none h-24 resize-none" placeholder="Broadcast Headlines" value={makContent} onChange={e => setMakContent(e.target.value)} />
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" placeholder="Video URL" value={makVideoUrl} onChange={e => setMakVideoUrl(e.target.value)} />
                    <button onClick={handleCreateMakTV} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30">GO LIVE</button>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black italic text-white uppercase tracking-widest flex items-center gap-2"><Tv size={20} className="text-slate-500" /> Master Inventory</h3>
              <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto no-scrollbar">
                 {posts.filter(p => p.isMakTV).map(p => (
                   <div key={p.id} className="glass-card p-5 border-white/5 bg-white/[0.01] flex gap-5 items-center">
                      <div className="w-32 aspect-video rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                         <video src={p.video} className="w-full h-full object-cover" muted />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between">
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{p.makTVType}</span>
                            <button onClick={() => { db.deletePost(p.id, 'admin'); setPosts(db.getPosts()); }} className="text-rose-500"><Trash2 size={16}/></button>
                         </div>
                         <h4 className="text-white text-xs font-black mt-2">{p.makTVGuest || 'CAMPUS NEWS'}</h4>
                         <p className="text-[10px] text-slate-500 line-clamp-1">"{p.content}"</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
