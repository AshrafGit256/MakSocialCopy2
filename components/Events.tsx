import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LiveEvent, CalendarEvent, User, College, Post } from '../types';
import { 
  Radio, Users, Share2, Youtube, Zap, CheckCircle2, 
  CalendarDays, Plus, X, Camera, MapPin, Clock, 
  ExternalLink, LayoutGrid 
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

interface EventsProps {
  isAdmin?: boolean;
}

const Events: React.FC<EventsProps> = ({ isAdmin }) => {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentUser] = useState<User>(db.getUser());
  const [isAdding, setIsAdding] = useState(false);
  const [repostTarget, setRepostTarget] = useState<College | 'Global'>('Global');

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: ''
  });

  useEffect(() => {
    const sync = () => {
      setLiveEvents(db.getEvents());
      setCalendarEvents(db.getCalendarEvents());
    };
    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setCalendarEvents(db.getCalendarEvents());
  };

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      ...form as CalendarEvent,
      id: Date.now().toString(),
      createdBy: 'admin',
      attendeeIds: []
    };
    db.saveCalendarEvent(newEvent);
    setIsAdding(false);
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: '' });
    setCalendarEvents(db.getCalendarEvents());
  };

  const pushToFeed = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: 'Campus Events Hub',
      authorId: 'admin',
      authorRole: 'Official Broadcast',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: event.description,
      images: event.image ? [event.image] : undefined,
      hashtags: ['#MakEvent', `#${event.category}`, '#Official'],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: repostTarget,
      isEventBroadcast: true,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventTitle: event.title,
      eventRegistrationLink: event.registrationLink
    };
    db.addPost(broadcast);
    alert(`Protocol Broadcast synchronized to ${repostTarget} wing. Public view will expire after ${event.date}.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-32">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
         <div>
            <h1 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase">
              <Radio className="text-red-500 animate-pulse" size={40}/> Events Hub
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 font-bold uppercase tracking-widest text-xs">Streaming ceremonies, workshops, and lectures.</p>
         </div>
         <div className="flex gap-4">
            {isAdmin && (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                <Plus size={16}/> Create Event
              </button>
            )}
            <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center gap-2">
               <Youtube size={16}/> Go Live
            </button>
         </div>
      </div>

      <section className="space-y-8">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
           <Zap className="text-amber-500"/> Live Signals
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {liveEvents.map(event => (
            <div key={event.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 group bg-[var(--sidebar-bg)] shadow-xl">
               <div className="aspect-video bg-black relative">
                  <iframe 
                    className="w-full h-full"
                    src={event.youtubeUrl}
                    title={event.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight">{event.title}</h3>
                     <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><Share2 size={20}/></button>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <Users size={14}/> 1.2k Active Nodes
                     </div>
                     <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Host: <span className="text-indigo-400">{event.organizer}</span></div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
         <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <CalendarDays className="text-indigo-500"/> Registry Hub
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarEvents.map(event => {
               const isRegistered = event.attendeeIds?.includes(currentUser.id);
               const isExpired = new Date(event.date) < new Date();
               
               return (
                  <div key={event.id} className={`glass-card p-6 bg-[var(--sidebar-bg)] border-white/10 transition-all group flex flex-col justify-between h-[28rem] shadow-lg ${isExpired ? 'opacity-50 grayscale' : 'hover:border-indigo-500'}`}>
                     <div>
                        <div className="h-32 rounded-2xl overflow-hidden mb-4 border border-white/10 relative">
                           <img src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{event.title}</h4>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{event.date} • {event.location}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-3 italic">"{event.description}"</p>
                     </div>
                     
                     <div className="space-y-3 mt-6">
                        <button 
                           onClick={() => !isRegistered && !isExpired && handleRegister(event.id)}
                           disabled={isRegistered || isExpired}
                           className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
                              isRegistered 
                              ? 'bg-emerald-500 text-white' 
                              : isExpired 
                                ? 'bg-slate-800 text-slate-500'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                           }`}
                        >
                           {isRegistered ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                           {isRegistered ? 'Proof Issued' : isExpired ? 'Closed' : 'Register'}
                        </button>

                        {isAdmin && !isExpired && (
                          <div className="pt-4 border-t border-white/5 space-y-3">
                             <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                <button onClick={() => setRepostTarget('Global')} className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase border transition-all ${repostTarget === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 border-white/10 text-slate-400'}`}>Global</button>
                                {COLLEGES.map(c => (
                                  <button key={c} onClick={() => setRepostTarget(c)} className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase border transition-all ${repostTarget === c ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 border-white/10 text-slate-400'}`}>{c}</button>
                                ))}
                             </div>
                             <button 
                                onClick={() => pushToFeed(event)}
                                className="w-full py-3 bg-rose-600/20 text-rose-500 border border-rose-500/30 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                             >
                                <ExternalLink size={12}/> Broadcast to {repostTarget}
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
           <div className="glass-card w-full max-w-xl p-8 border-white/10 shadow-2xl space-y-6 bg-[var(--sidebar-bg)]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Add Event Registry</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <input className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none" placeholder="Event Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    <input type="time" className="bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                 </div>
                 <input className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                 <input className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none" placeholder="Flyer Asset URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                 <textarea className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white text-sm outline-none h-24 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <button onClick={handleAddEvent} className="w-full bg-indigo-600 p-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all">Synchronize Hub</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Events;