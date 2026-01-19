
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { Violation, User, Post, Poll, TimelineEvent, CalendarEvent } from '../types';
import { 
  TrendingUp, Monitor, Users, Activity, ShieldAlert, Tv, 
  Trash2, Play, MessageCircle, Eye, Plus, CheckCircle2, Clock,
  DollarSign, Briefcase, Calendar, Link as LinkIcon, Image as ImageIcon,
  Youtube, Mic2, Newspaper, Radio, History, Heart, User as UserIcon, Zap, X,
  Bell, FileText, Download, BarChart2, PieChart
} from 'lucide-react';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [posts, setPosts] = useState<Post[]>(db.getPosts(undefined, true)); // Admins see everything including expired
  const [violations, setViolations] = useState<Violation[]>(db.getViolations());
  const [polls, setPolls] = useState<Poll[]>(db.getPolls());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(db.getTimeline());
  const [events, setEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'registry' | 'maktv' | 'polls' | 'ads' | 'timeline' | 'events'>('intelligence');
  const [selectedEventReport, setSelectedEventReport] = useState<CalendarEvent | null>(null);
  
  // MakTV Creation State
  const [makType, setMakType] = useState<'News' | 'Interview'>('News');
  const [makGuest, setMakGuest] = useState('');
  const [makContent, setMakContent] = useState('');
  const [makVideoUrl, setMakVideoUrl] = useState('');

  useEffect(() => {
    const sync = () => {
      setViolations(db.getViolations());
      setPosts(db.getPosts(undefined, true));
      setUsers(db.getUsers());
      setTimeline(db.getTimeline());
      setEvents(db.getCalendarEvents());
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
    setPosts(db.getPosts(undefined, true));
    setMakContent('');
    setMakVideoUrl('');
    setMakGuest('');
  };

  const getEventDemographics = (attendeeIds: string[]) => {
    const registeredUsers = users.filter(u => attendeeIds.includes(u.id));
    const collegeCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};

    registeredUsers.forEach(u => {
      collegeCount[u.college] = (collegeCount[u.college] || 0) + 1;
      statusCount[u.status] = (statusCount[u.status] || 0) + 1;
    });

    return { collegeCount, statusCount, total: registeredUsers.length, users: registeredUsers };
  };

  const downloadReport = (event: CalendarEvent) => {
    const demo = getEventDemographics(event.attendeeIds || []);
    const reportContent = `
      MAKSOCIAL EVENT INTELLIGENCE REPORT
      ====================================
      Event: ${event.title}
      Date: ${event.date}
      Location: ${event.location}
      Total Registrations: ${demo.total}

      COLLEGE BREAKDOWN:
      ${Object.entries(demo.collegeCount).map(([col, count]) => `- ${col}: ${count} (${Math.round(count/demo.total*100)}%)`).join('\n')}

      YEAR/STATUS BREAKDOWN:
      ${Object.entries(demo.statusCount).map(([stat, count]) => `- ${stat}: ${count}`).join('\n')}

      ATTENDEE LIST:
      ${demo.users.map(u => `- ${u.name} (${u.email}) - ${u.college}`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}_Report.txt`;
    link.click();
  };

  const totalAdRevenue = posts
    .filter(p => p.isAd && p.adAmountPaid)
    .reduce((acc, curr) => acc + (curr.adAmountPaid || 0), 0);

  const groupedTimeline = timeline.reduce((acc, event) => {
    const dateStr = new Date(event.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventColorClass = (type: string) => {
    switch (type) {
      case 'like': return 'bg-rose-500/10';
      case 'comment': return 'bg-indigo-600/10';
      case 'profile_update': return 'bg-amber-500/10';
      case 'new_post': return 'bg-indigo-600/10';
      case 'ad_created': return 'bg-emerald-500/10';
      case 'poll_created': return 'bg-sky-500/10';
      case 'event_scheduled': return 'bg-purple-500/10';
      case 'event_reminder': return 'bg-amber-500/10';
      default: return 'bg-slate-500/10';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={14} className="text-rose-500" fill="currentColor" />;
      case 'comment': return <MessageCircle size={14} className="text-indigo-600 dark:text-indigo-400" fill="currentColor" />;
      case 'profile_update': return <UserIcon size={14} className="text-amber-500" />;
      case 'new_post': return <Zap size={14} className="text-indigo-600 dark:text-indigo-500" />;
      case 'ad_created': return <DollarSign size={14} className="text-emerald-500" />;
      case 'poll_created': return <CheckCircle2 size={14} className="text-sky-500" />;
      case 'event_scheduled': return <Calendar size={14} className="text-purple-500" />;
      case 'event_reminder': return <Bell size={14} className="text-amber-500 dark:text-amber-400" />;
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/30 transition-theme"><Monitor className="text-white" size={26}/></div>
             <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)] uppercase">Command</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">Forensic Intelligence & Governance</p>
        </div>
        
        <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-inner overflow-x-auto no-scrollbar transition-theme">
          {[
            { id: 'intelligence', label: 'Stats', icon: <TrendingUp size={16}/> },
            { id: 'registry', label: 'Feed', icon: <Activity size={16}/> },
            { id: 'events', label: 'Events Hub', icon: <Calendar size={16}/> },
            { id: 'maktv', label: 'MakTV', icon: <Tv size={16}/> },
            { id: 'timeline', label: 'Timeline', icon: <History size={16}/> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'
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
             { label: 'Total Engagement', val: posts.reduce((a,c) => a+c.views, 0).toLocaleString(), icon: <Activity/>, color: 'text-indigo-600 dark:text-indigo-500' },
             { label: 'Ad Revenue', val: `UGX ${totalAdRevenue.toLocaleString()}`, icon: <DollarSign/>, color: 'text-emerald-600 dark:text-emerald-500' },
             { label: 'Active Ads', val: posts.filter(p => p.isAd).length, icon: <Briefcase/>, color: 'text-amber-600 dark:text-amber-500' },
             { label: 'Total Events History', val: events.length, icon: <Calendar/>, color: 'text-rose-600 dark:text-rose-400' },
           ].map((s,i) => (
             <div key={i} className="glass-card p-8 shadow-sm bg-[var(--sidebar-bg)] border-[var(--border-color)] group hover:border-indigo-500 transition-all">
                <div className={`p-3 rounded-xl bg-[var(--bg-secondary)] w-fit mb-6 ${s.color}`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <h3 className="text-4xl font-black mt-1 text-[var(--text-primary)]">{s.val}</h3>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Event Node Registry (Master View)</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue Tracked Protocols: {events.length}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => {
                const attendees = event.attendeeIds || [];
                const isExpired = new Date(event.date) < new Date();
                return (
                  <div 
                    key={event.id} 
                    onClick={() => setSelectedEventReport(event)}
                    className={`glass-card p-6 border-[var(--border-color)] hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between h-64 ${isExpired ? 'bg-slate-50/50 dark:bg-white/[0.01]' : 'bg-[var(--sidebar-bg)] shadow-xl'}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`${isExpired ? 'bg-slate-400' : 'bg-indigo-600'} text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest`}>{event.category} {isExpired && '• EXPIRED'}</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                           <Users size={14}/> {attendees.length}
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight line-clamp-2">{event.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12}/> {event.date} • {event.time}
                      </p>
                    </div>
                    
                    <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[var(--bg-secondary)] rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       <BarChart2 size={14}/> Forensic Analytics
                    </button>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {/* Event Report Modal */}
      {selectedEventReport && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 dark:bg-brand-dark/95 backdrop-blur-md">
           <div className="glass-card w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col bg-[var(--sidebar-bg)] shadow-2xl border-[var(--border-color)]">
              <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg"><FileText size={24}/></div>
                    <div>
                       <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Identity Registry Analysis</h2>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol: {selectedEventReport.title}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => downloadReport(selectedEventReport)}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all"
                    >
                       <Download size={16}/> Export Report
                    </button>
                    <button onClick={() => setSelectedEventReport(null)} className="text-slate-500 hover:text-rose-500 transition-colors p-2"><X size={24}/></button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 {/* Stats Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(() => {
                       const demo = getEventDemographics(selectedEventReport.attendeeIds || []);
                       return (
                         <>
                           <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Participants</p>
                              <h3 className="text-5xl font-black text-indigo-600">{demo.total}</h3>
                           </div>
                           <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Leading College</p>
                              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                                {Object.entries(demo.collegeCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}
                              </h3>
                           </div>
                           <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Demographic Mix</p>
                              <div className="flex items-center gap-2">
                                 <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{width: '65%'}}></div>
                                 </div>
                              </div>
                           </div>
                         </>
                       );
                    })()}
                 </div>

                 {/* Detailed Demographics */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                         <BarChart2 size={14}/> College Distribution
                       </h4>
                       <div className="space-y-4">
                          {(() => {
                             const demo = getEventDemographics(selectedEventReport.attendeeIds || []);
                             return Object.entries(demo.collegeCount).sort((a,b) => b[1]-a[1]).map(([col, count]) => (
                                <div key={col} className="space-y-1.5">
                                   <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                                      <span className="text-[var(--text-primary)]">{col}</span>
                                      <span className="text-slate-500">{count} Signals</span>
                                   </div>
                                   <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                                      <div className="h-full bg-indigo-500" style={{width: `${(count/demo.total)*100}%`}}></div>
                                   </div>
                                </div>
                             ));
                          })()}
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                         <Users size={14}/> Node Year Distribution
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                          {(() => {
                             const demo = getEventDemographics(selectedEventReport.attendeeIds || []);
                             return Object.entries(demo.statusCount).map(([stat, count]) => (
                                <div key={stat} className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] text-center">
                                   <span className="text-xl font-black text-[var(--text-primary)] block leading-none">{count}</span>
                                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 block">{stat}</span>
                                </div>
                             ));
                          })()}
                       </div>
                    </div>
                 </div>

                 {/* Full Registry List */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <PieChart size={14}/> Participant Manifest
                    </h4>
                    <div className="border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-inner">
                       <table className="w-full text-left">
                          <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                             <tr>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">College Unit</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Email</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)] bg-[var(--sidebar-bg)]">
                             {getEventDemographics(selectedEventReport.attendeeIds || []).users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                         <img src={u.avatar} className="w-8 h-8 rounded-lg object-cover" />
                                         <span className="text-xs font-bold text-[var(--text-primary)]">{u.name}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-tight">{u.college}</td>
                                   <td className="px-6 py-4 text-xs font-bold text-indigo-500">{u.status}</td>
                                   <td className="px-6 py-4 text-xs text-slate-400">{u.email}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Activity Stream</h3>
              <button 
                onClick={() => { localStorage.removeItem('maksocial_timeline_v1'); setTimeline([]); }}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700"
              >
                Flush Logs
              </button>
           </div>

           <div className="relative pl-8 md:pl-0">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border-color)] -translate-x-1/2 transition-theme"></div>

              {Object.entries(groupedTimeline).length > 0 ? (Object.entries(groupedTimeline) as [string, TimelineEvent[]][]).map(([date, events]) => (
                <div key={date} className="relative mb-16 last:mb-0">
                   <div className="flex justify-start md:justify-center mb-10 relative z-10">
                      <span className="px-6 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest shadow-sm transition-theme">
                         {date}
                      </span>
                   </div>

                   <div className="space-y-8">
                      {events.map((event, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                          <div key={event.id} className={`flex items-start md:items-center gap-8 md:gap-0 relative ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                             <div className={`w-full md:w-[45%] group`}>
                                <div className={`glass-card p-6 border-[var(--border-color)] bg-[var(--sidebar-bg)] hover:bg-[var(--bg-secondary)] transition-theme relative shadow-sm ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                                   <div className="flex items-center gap-3 mb-3">
                                      <img src={event.userAvatar} className="w-8 h-8 rounded-lg object-cover border border-[var(--border-color)]" />
                                      <div>
                                         <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">{event.userName}</h4>
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                   </div>
                                   <p className="text-[13px] text-slate-600 dark:text-slate-300 font-medium">"{event.description}"</p>
                                </div>
                             </div>
                             <div className="absolute left-0 md:left-1/2 -translate-x-1/2 z-20">
                                <div className={`w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center shadow-lg transition-theme ${getEventColorClass(event.type)}`}>
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
                <div className="p-32 text-center glass-card border-dashed border-[var(--border-color)] text-slate-400 font-black uppercase text-xs tracking-widest">
                   Awaiting platform signals...
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'maktv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-5">
           <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/5 relative overflow-hidden shadow-sm">
                 <h3 className="text-2xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tight flex items-center gap-2">
                   <Radio size={24} className="text-indigo-600 dark:text-indigo-500" /> Broadcast Studio
                 </h3>
                 <div className="space-y-4">
                    <div className="flex p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] transition-theme">
                       <button onClick={() => setMakType('News')} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest ${makType === 'News' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>News Hour</button>
                       <button onClick={() => setMakType('Interview')} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest ${makType === 'Interview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Spotlight</button>
                    </div>
                    {makType === 'Interview' && (
                      <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-500 transition-theme" placeholder="Guest Identity" value={makGuest} onChange={e => setMakGuest(e.target.value)} />
                    )}
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm outline-none h-24 resize-none focus:border-indigo-500 transition-theme" placeholder="Broadcast Headlines" value={makContent} onChange={e => setMakContent(e.target.value)} />
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-500 transition-theme" placeholder="Video URL" value={makVideoUrl} onChange={e => setMakVideoUrl(e.target.value)} />
                    <button onClick={handleCreateMakTV} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">GO LIVE</button>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-2"><Tv size={20} className="text-slate-400" /> Assets</h3>
              <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                 {posts.filter(p => p.isMakTV).map(p => (
                   <div key={p.id} className="glass-card p-5 border-[var(--border-color)] bg-[var(--sidebar-bg)] hover:bg-[var(--bg-secondary)] transition-theme flex gap-5 items-center shadow-sm">
                      <div className="w-32 aspect-video rounded-xl bg-black border border-[var(--border-color)] overflow-hidden shrink-0 shadow-sm">
                         <video src={p.video} className="w-full h-full object-cover" muted />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">{p.makTVType}</span>
                            <button onClick={() => { db.deletePost(p.id, 'admin'); setPosts(db.getPosts(undefined, true)); }} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                         </div>
                         <h4 className="text-[var(--text-primary)] text-xs font-black mt-2 truncate uppercase tracking-tight">{p.makTVGuest || 'CAMPUS NEWS'}</h4>
                         <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">"{p.content}"</p>
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
