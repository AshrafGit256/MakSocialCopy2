
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll, TimelineEvent } from '../types';
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock,
  DollarSign, Briefcase, Calendar, Link as LinkIcon, Image as ImageIcon,
  Youtube, Mic2, Newspaper, Radio, History, Heart, User as UserIcon, Zap
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
      const saved = localStorage.getItem('maksocial_posts_v8');
      setPosts(saved ? JSON.parse(saved) : []);
      setUsers(db.getUsers());
      setPolls(db.getPolls());
      setTimeline(db.getTimeline());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateMakTV = () => {
    if (!makContent.trim() || !makVideoUrl.trim()) return;
    if (makType === 'Interview' && !makGuest.trim()) return;

    let finalUrl = makVideoUrl;
    if (isYoutube && makVideoUrl.includes('watch?v=')) {
      finalUrl = makVideoUrl.replace('watch?v=', 'embed/');
    }

    const newMedia: Post = {
      id: `maktv-${Date.now()}`,
      author: `MakTV ${makType}`,
      authorId: 'admin-media',
      authorRole: 'Official Broadcast',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: makContent,
      video: finalUrl,
      hashtags: ['#MakTV', `#${makType}`, '#Makerere'],
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

    const updated = [newMedia, ...posts];
    db.savePosts(updated);
    setPosts(updated);
    
    db.logTimelineEvent({
      type: 'new_post',
      userId: 'admin',
      userName: 'MakTV Studio',
      userAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      description: `Broadcasted a new ${makType}: "${makContent.substring(0, 30)}..."`,
      targetId: newMedia.id
    });

    setMakContent('');
    setMakVideoUrl('');
    setMakGuest('');
  };

  const handleCreateAd = () => {
    if (!adPartner.trim() || !adContent.trim()) return;

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + parseInt(adDuration));

    const newAd: Post = {
      id: `ad-${Date.now()}`,
      author: adPartner,
      authorId: 'ad-partner',
      authorRole: 'Brand Partner',
      authorAvatar: `https://ui-avatars.com/api/?name=${adPartner}&background=random`,
      timestamp: 'Sponsored',
      content: adContent,
      images: adImageUrl ? [adImageUrl] : undefined,
      hashtags: ['#Sponsored', '#MakSocial'],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: 'Global' as any,
      isAd: true,
      adPartnerName: adPartner,
      adLink: adLink.trim() || undefined,
      adCtaText: adCta,
      adAmountPaid: parseFloat(adPaid) || 0,
      adExpiryDate: expiryDate.toISOString()
    };

    const currentPosts = [newAd, ...posts];
    db.savePosts(currentPosts);
    setPosts(currentPosts);
    
    db.logTimelineEvent({
      type: 'ad_created',
      userId: 'admin',
      userName: 'Brand Manager',
      userAvatar: 'https://ui-avatars.com/api/?name=AD&background=random',
      description: `Approved new campaign for ${adPartner}`,
      details: `UGX ${adPaid} paid for ${adDuration}h visibility.`
    });

    setAdPartner('');
    setAdContent('');
    setAdImageUrl('');
    setAdLink('');
    setAdPaid('');
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
      // Fix: Replaced missing UserEdit icon with User icon (aliased as UserIcon)
      case 'profile_update': return <UserIcon size={14} className="text-amber-500" />;
      case 'new_post': return <Zap size={14} className="text-indigo-500" />;
      case 'ad_created': return <DollarSign size={14} className="text-emerald-500" />;
      case 'poll_created': return <CheckCircle2 size={14} className="text-sky-500" />;
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  const getEventColorClass = (type: string) => {
    switch (type) {
      case 'like': return 'bg-rose-500/10 border-rose-500/20';
      case 'comment': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'profile_update': return 'bg-amber-500/10 border-amber-500/20';
      case 'new_post': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'ad_created': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'poll_created': return 'bg-sky-500/10 border-sky-500/20';
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
            { id: 'polls', label: 'Polls', icon: <CheckCircle2 size={16}/> },
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
             { label: 'Active Ads', val: posts.filter(p => p.isAd && new Date(p.adExpiryDate || '').getTime() > Date.now()).length, icon: <Briefcase/>, color: 'text-amber-500' },
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
              {/* Central Vertical Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2"></div>

              {Object.entries(groupedTimeline).map(([date, events]) => (
                <div key={date} className="relative mb-16 last:mb-0">
                   {/* Day Header Badge */}
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
                             {/* Content Card */}
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

                             {/* Timeline Node Bubble */}
                             <div className="absolute left-0 md:left-1/2 -translate-x-1/2 z-20">
                                <div className={`w-10 h-10 rounded-full border-2 border-[#020617] flex items-center justify-center shadow-xl ${getEventColorClass(event.type)}`}>
                                   {getEventIcon(event.type)}
                                </div>
                             </div>

                             {/* Spacer for other side on desktop */}
                             <div className="hidden md:block w-[45%]"></div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              ))}

              {timeline.length === 0 && (
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
                 <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Studio Link Active</span>
                 </div>
                 <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                   <Radio size={24} className="text-indigo-500" /> Broadcast Studio
                 </h3>
                 
                 <div className="space-y-4">
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                       <button 
                         onClick={() => setMakType('News')}
                         className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${makType === 'News' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                       >
                         <Newspaper size={14}/> News Hour
                       </button>
                       <button 
                         onClick={() => setMakType('Interview')}
                         className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${makType === 'Interview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                       >
                         <Mic2 size={14}/> Alumni Spotlight
                       </button>
                    </div>

                    {makType === 'Interview' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Guest Identity</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50" 
                          placeholder="e.g. Hon. Gerald Karuhanga"
                          value={makGuest}
                          onChange={e => setMakGuest(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Content / Headlines</label>
                       <textarea 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none h-24 resize-none" 
                         placeholder="What's this broadcast about?"
                         value={makContent}
                         onChange={e => setMakContent(e.target.value)}
                       />
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Video Asset Source</label>
                          <button 
                            onClick={() => setIsYoutube(!isYoutube)}
                            className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border transition-all ${isYoutube ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}
                          >
                             {isYoutube ? <Youtube size={10}/> : <LinkIcon size={10}/>}
                             {isYoutube ? 'YouTube Mode' : 'Direct Link Mode'}
                          </button>
                       </div>
                       <input 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50" 
                         placeholder={isYoutube ? "Paste YouTube Video Link..." : "Direct MP4 Asset Link..."}
                         value={makVideoUrl}
                         onChange={e => setMakVideoUrl(e.target.value)}
                       />
                    </div>

                    <button 
                      onClick={handleCreateMakTV}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 mt-4 flex items-center justify-center gap-3"
                    >
                      <Play size={16} fill="currentColor" /> GO LIVE
                    </button>
                 </div>
              </div>
           </div>

           {/* Active Broadcast Inventory */}
           <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black italic text-white uppercase tracking-widest flex items-center gap-2">
                <Tv size={20} className="text-slate-500" /> Active Master Tapes
              </h3>
              <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
                 {posts.filter(p => p.isMakTV).map(p => (
                   <div key={p.id} className="glass-card p-5 border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex gap-5 items-center">
                      <div className="w-32 aspect-video rounded-xl bg-black border border-white/10 overflow-hidden relative shrink-0">
                         {p.video?.includes('youtube.com') || p.video?.includes('embed/') ? (
                           <div className="w-full h-full flex items-center justify-center bg-rose-500/10">
                              <Youtube size={24} className="text-rose-500" />
                           </div>
                         ) : (
                           <video src={p.video} className="w-full h-full object-cover" muted />
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Master Feed</span>
                         </div>
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${p.makTVType === 'Interview' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                               {p.makTVType}
                            </span>
                            <button onClick={() => { db.deletePost(p.id, 'admin'); setPosts(db.getPosts()); }} className="text-rose-500 hover:text-rose-400"><Trash2 size={16}/></button>
                         </div>
                         <h4 className="text-white text-xs font-black mt-2 line-clamp-1 italic uppercase tracking-tight">{p.makTVGuest || 'CAMPUS NEWS'}</h4>
                         <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">"{p.content}"</p>
                      </div>
                   </div>
                 ))}
                 {posts.filter(p => p.isMakTV).length === 0 && (
                   <div className="p-20 text-center glass-card text-slate-700 italic font-black text-xs uppercase">No active master tapes.</div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-5">
           <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 border-indigo-500/20 bg-indigo-950/5">
                 <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight">Post New Ad</h3>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Advertiser</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" 
                            placeholder="e.g. MTN Uganda"
                            value={adPartner}
                            onChange={e => setAdPartner(e.target.value)}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paid (UGX)</label>
                          <input 
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" 
                            placeholder="50000"
                            value={adPaid}
                            onChange={e => setAdPaid(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ad Content</label>
                       <textarea 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none h-24 resize-none" 
                         placeholder="Enter ad campaign text..."
                         value={adContent}
                         onChange={e => setAdContent(e.target.value)}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Image URL (Optional)</label>
                       <div className="flex gap-2">
                          <div className="bg-white/5 p-3 rounded-xl"><ImageIcon size={18} className="text-slate-500" /></div>
                          <input 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" 
                            placeholder="https://..."
                            value={adImageUrl}
                            onChange={e => setAdImageUrl(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CTA Link (Optional)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" 
                            placeholder="https://..."
                            value={adLink}
                            onChange={e => setAdLink(e.target.value)}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Button Text</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none" 
                            placeholder="Shop Now"
                            value={adCta}
                            onChange={e => setAdCta(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visibility Period</label>
                       <select 
                         className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white text-sm outline-none"
                         value={adDuration}
                         onChange={e => setAdDuration(e.target.value)}
                       >
                          <option value="6">6 Hours</option>
                          <option value="24">24 Hours</option>
                          <option value="168">1 Week</option>
                          <option value="720">1 Month</option>
                       </select>
                    </div>

                    <button 
                      onClick={handleCreateAd}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg mt-2"
                    >
                      Broadcast Ad
                    </button>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black italic text-white uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={20} className="text-slate-500" /> Commercial Inventory
              </h3>
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
                 {posts.filter(p => p.isAd).reverse().map(ad => (
                   <div key={ad.id} className="glass-card p-6 border-white/5 bg-white/[0.01] hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center font-black text-indigo-400">
                               {ad.adPartnerName?.[0]}
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white">{ad.adPartnerName}</h4>
                               <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[8px] font-black text-emerald-500 uppercase">Paid: UGX {ad.adAmountPaid?.toLocaleString()}</span>
                                  <span className="text-[8px] text-slate-500">•</span>
                                  <span className={`text-[8px] font-black uppercase ${new Date(ad.adExpiryDate || '').getTime() > Date.now() ? 'text-blue-400' : 'text-rose-500'}`}>
                                     {new Date(ad.adExpiryDate || '').getTime() > Date.now() ? 'Active' : 'Expired'}
                                  </span>
                               </div>
                            </div>
                         </div>
                         <button onClick={() => { db.deletePost(ad.id, 'admin'); setPosts(db.getPosts()); }} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 italic">"{ad.content}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-5">
           <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 border-indigo-500/20 bg-indigo-900/5">
                 <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight">Setup New Poll</h3>
                 {/* Existing Poll Logic... */}
                 <p className="text-slate-500 text-xs italic">Governance system active.</p>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'intelligence' && (
        <div className="glass-card p-10 mt-12 border-white/5 bg-gradient-to-r from-indigo-900/10 to-transparent">
           <h3 className="text-2xl font-black italic text-white mb-6 uppercase tracking-tight">System Integrity</h3>
           <div className="space-y-4">
              {violations.length > 0 ? violations.map(v => (
                 <div key={v.id} className="p-4 bg-white/5 border border-rose-500/20 rounded-xl flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{v.reason}</p>
                       <p className="text-xs text-white mt-1">Blocked node: {v.userName}</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{v.timestamp}</span>
                 </div>
              )) : (
                <div className="text-center py-10 text-slate-600 font-black uppercase text-xs">No active breaches detected.</div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
