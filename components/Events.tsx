
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LiveEvent, CalendarEvent, User } from '../types';
import { Radio, Users, Share2, Youtube, Zap, CheckCircle2, CalendarDays } from 'lucide-react';

const Events: React.FC = () => {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentUser] = useState<User>(db.getUser());

  useEffect(() => {
    setLiveEvents(db.getEvents());
    setCalendarEvents(db.getCalendarEvents());
  }, []);

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setCalendarEvents(db.getCalendarEvents());
    alert("Registration confirmed!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-32">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
         <div>
            <h1 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase"><Radio className="text-red-500 animate-pulse" size={40}/> University Hub</h1>
            <p className="text-[var(--text-secondary)] mt-2 font-bold uppercase tracking-widest text-xs">Streaming ceremonies, workshops, and lectures.</p>
         </div>
         <div className="flex gap-4">
            <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center gap-2">
               <Youtube size={16}/> Go Live
            </button>
         </div>
      </div>

      {/* Live Section */}
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
                  {event.isLive && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                       <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                       Live Now
                    </div>
                  )}
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
                  <div className="pt-4 border-t border-white/5 flex gap-2">
                     <input type="text" placeholder="Connect with peers..." className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none border border-white/5 text-white" />
                     <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">Sync</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Registry Section */}
      <section className="space-y-8">
         <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <CalendarDays className="text-indigo-500"/> Registry Hub
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarEvents.slice(0, 6).map(event => {
               const isRegistered = event.attendeeIds?.includes(currentUser.id);
               return (
                  <div key={event.id} className="glass-card p-6 bg-[var(--sidebar-bg)] border-white/10 hover:border-indigo-500 transition-all group flex flex-col justify-between h-80 shadow-lg">
                     <div>
                        <div className="h-32 rounded-2xl overflow-hidden mb-4 border border-white/10">
                           <img src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{event.title}</h4>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{event.date} • {event.location}</p>
                     </div>
                     
                     <button 
                        onClick={() => !isRegistered && handleRegister(event.id)}
                        disabled={isRegistered}
                        className={`mt-6 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
                           isRegistered 
                           ? 'bg-emerald-500 text-white' 
                           : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                        }`}
                     >
                        {isRegistered ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                        {isRegistered ? 'Identity Synced' : 'Register Node'}
                     </button>
                  </div>
               );
            })}
         </div>
      </section>

      <div className="glass-card p-12 rounded-[3.5rem] text-center space-y-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border-white/10 shadow-2xl">
         <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Synchronize Your Calendar</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto font-bold uppercase tracking-widest text-xs leading-relaxed">Automatic protocol detection for all upcoming university and college broadcasts.</p>
         </div>
         <button className="bg-white text-black px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-200 transition-all active:scale-95">Link Device Calendar</button>
      </div>
    </div>
  );
};

export default Events;
