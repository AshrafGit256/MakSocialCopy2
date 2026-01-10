
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LiveEvent } from '../types';
import { Radio, Users, Share2, Youtube } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    setEvents(db.getEvents());
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 pb-24">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3"><Radio className="text-red-500 animate-pulse"/> University Live</h1>
            <p className="text-slate-500 mt-2">Streaming graduation ceremonies, hackathons, and guest lectures.</p>
         </div>
         <button className="bg-red-600/10 text-red-500 px-6 py-3 rounded-2xl font-black border border-red-500/20 hover:bg-red-600/20 transition-all flex items-center gap-2">
            <Youtube size={20}/> Broadcast Now
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map(event => (
          <div key={event.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 group">
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
             <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-white">{event.title}</h3>
                   <div className="flex gap-2">
                      <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white"><Share2 size={20}/></button>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <Users size={16}/> 1.2k Watching
                   </div>
                   <div className="text-slate-500 text-xs font-bold">Hosted by: <span className="text-blue-400">{event.organizer}</span></div>
                </div>
                <div className="pt-4 border-t border-white/5 flex gap-2">
                   <input type="text" placeholder="Chat with viewers..." className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-sm outline-none border border-white/5" />
                   <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold">Send</button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 rounded-[3rem] text-center space-y-6">
         <h2 className="text-3xl font-black text-white">Never miss a University Event</h2>
         <p className="text-slate-500 max-w-xl mx-auto">Sync your university calendar and get notified when your college starts a live broadcast.</p>
         <button className="bg-white text-black px-12 py-4 rounded-full font-black text-lg shadow-2xl hover:bg-slate-200 transition-all">Add to Calendar</button>
      </div>
    </div>
  );
};

export default Events;
