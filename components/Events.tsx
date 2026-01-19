
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { LiveEvent, CalendarEvent, User, College, Post } from '../types';
import {
  Radio, Users, Share2, Youtube, Zap, CheckCircle2,
  CalendarDays, Plus, X, ExternalLink, Image as ImageIcon,
  Loader2, MapPin, Clock, Star
} from 'lucide-react';

const COLLEGES: College[] = [
  'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS',
  'CAES', 'COBAMS', 'CEES', 'LAW'
];

interface EventsProps {
  isAdmin?: boolean;
}

const Events: React.FC<EventsProps> = ({ isAdmin }) => {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [repostTarget, setRepostTarget] = useState<College | 'Global'>('Global');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social' as any,
    registrationLink: '',
    image: ''
  });

  useEffect(() => {
    const sync = () => {
      const user = db.getUser();
      if (user) setCurrentUser(user);
      setLiveEvents(db.getEvents());
      setCalendarEvents(db.getCalendarEvents());
    };

    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (eventId: string) => {
    if (!currentUser) return;
    db.registerForEvent(eventId, currentUser.id);
    setCalendarEvents(db.getCalendarEvents());
    alert("Identity Validated: Registration logged to university registry.");
  };

  const handleAddEvent = () => {
    if (!form.title || !form.date || !form.location) {
      alert('Required Protocol Fields Missing: Title, Date, Location.');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      category: form.category,
      registrationLink: form.registrationLink,
      image: form.image,
      createdBy: currentUser?.id || 'admin',
      attendeeIds: []
    };

    db.saveCalendarEvent(newEvent);
    setCalendarEvents(db.getCalendarEvents());
    setIsAdding(false);

    setForm({
      title: '', description: '', date: '', time: '', location: '',
      category: 'Social', registrationLink: '', image: ''
    });
  };

  const pushToFeed = (event: CalendarEvent) => {
    if (!currentUser) return;
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: 'Campus Events Hub',
      authorId: currentUser.id,
      authorRole: 'Official Broadcast',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: event.description,
      eventFlyer: event.image,
      hashtags: ['#MakEvent', `#${event.category}`, '#Official'],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 1,
      flags: [],
      isOpportunity: false,
      college: repostTarget,
      isEventBroadcast: true,
      eventId: event.id,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventTitle: event.title,
      eventRegistrationLink: event.registrationLink
    };

    db.addPost(broadcast);
    alert(`Protocol Broadcast: Event pushed to ${repostTarget} Hub.`);
  };

  if (!currentUser) return <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest animate-pulse">Initializing Identity Hub...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 space-y-16 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl lg:text-7xl font-black text-[var(--text-primary)] flex items-center gap-4 uppercase tracking-tighter">
            <Radio className="text-rose-500 animate-pulse" size={48} />
            Events Hub
          </h1>
          <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.4em] text-[10px] ml-1">
            Validated Ceremonies, Workshops, and Academic Signals
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {isAdmin && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex-1 md:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus size={18} /> Initialize Event
            </button>
          )}

          <button className="flex-1 md:flex-none bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95">
            <Youtube size={18} /> Broadcast Live
          </button>
        </div>
      </div>

      {/* Live Signals Grid */}
      <section className="space-y-8">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
          <Zap className="text-amber-500" fill="currentColor" size={18} />
          Active Live Nodes
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {liveEvents.map(event => (
            <div key={event.id} className="rounded-[2.5rem] overflow-hidden bg-black border border-[var(--border-color)] shadow-2xl relative group">
              <iframe
                className="w-full aspect-video opacity-90 group-hover:opacity-100 transition-opacity"
                src={event.youtubeUrl}
                title={event.title}
                allowFullScreen
              />
              <div className="p-8 bg-gradient-to-b from-transparent to-black/80">
                <div className="flex justify-between items-end">
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {event.title}
                      </h3>
                      <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mt-1">
                        PROTOCOL HOST: {event.organizer}
                      </p>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 rounded-lg text-white text-[8px] font-black uppercase animate-pulse">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE SIGNAL
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registry Hub Grid */}
      <section className="space-y-8">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
          <CalendarDays className="text-indigo-600" size={18} />
          Protocol Registry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calendarEvents.map(event => {
            const isRegistered = event.attendeeIds?.includes(currentUser.id);
            const eventDate = new Date(event.date);
            const isExpired = !isNaN(eventDate.getTime()) && eventDate < new Date();

            return (
              <div key={event.id} className={`glass-card p-0 rounded-[2.5rem] overflow-hidden border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-xl transition-all hover:border-indigo-500/50 group flex flex-col ${isExpired ? 'grayscale opacity-60' : ''}`}>
                <div className="h-48 relative overflow-hidden">
                   <img src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                   <div className="absolute bottom-4 left-6">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">{event.category}</span>
                   </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter line-clamp-2 leading-none mb-4">
                    {event.title}
                  </h4>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500">
                       <CalendarDays size={14}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                       <MapPin size={14}/>
                       <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium italic line-clamp-3 mb-8 border-l-2 border-indigo-600/30 pl-4">
                    "{event.description}"
                  </p>

                  <div className="mt-auto space-y-3">
                    <button
                      disabled={isExpired || isRegistered}
                      onClick={() => handleRegister(event.id)}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isRegistered 
                        ? 'bg-emerald-600 text-white' 
                        : isExpired ? 'bg-slate-200 text-slate-400 dark:bg-white/5' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 active:scale-95'
                      }`}
                    >
                      {isRegistered ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                      {isRegistered ? 'Logged & Validated' : isExpired ? 'Protocol Closed' : 'Register for Event'}
                    </button>

                    {isAdmin && !isExpired && (
                      <div className="flex gap-2">
                        <select 
                          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 text-[8px] font-black uppercase tracking-widest outline-none text-slate-500 flex-1"
                          value={repostTarget}
                          onChange={(e) => setRepostTarget(e.target.value as any)}
                        >
                           <option value="Global">Global Pulse</option>
                           {COLLEGES.map(c => <option key={c} value={c}>{c} Wing</option>)}
                        </select>
                        <button
                          onClick={() => pushToFeed(event)}
                          className="bg-rose-600/10 text-rose-600 p-4 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20"
                          title="Broadcast protocol"
                        >
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Creation Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-2xl bg-[var(--sidebar-bg)] p-10 rounded-[3rem] shadow-2xl border-[var(--border-color)] overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">
                Initialize Protocol
              </h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors p-2">
                <X size={28}/>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                <input
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold"
                  placeholder="e.g., 89th Guild Inauguration"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Date</label>
                  <input
                    type="date"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Time</label>
                  <input
                    type="time"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue Target</label>
                <input
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold"
                  placeholder="e.g., Main Hall"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Flyer (Device Upload)</label>
                 <div className="flex gap-4 items-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 p-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                       {form.image ? (
                          <img src={form.image} className="h-20 w-full object-cover rounded-xl" />
                       ) : (
                          <>
                             <ImageIcon size={24} className="text-slate-400 group-hover:text-indigo-600" />
                             <span className="text-[9px] font-black uppercase text-slate-500">Pick from PC/Device</span>
                          </>
                       )}
                    </button>
                    {form.image && (
                       <button onClick={() => setForm({...form, image: ''})} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                          <X size={20}/>
                       </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Description</label>
                <textarea
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 h-32 resize-none transition-all font-bold"
                  placeholder="Briefly describe the ceremony or workshop mission..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Engagement Category</label>
                <select 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none appearance-none font-bold"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as any })}
                >
                  <option value="Social">Social / Ceremony</option>
                  <option value="Academic">Academic / Research</option>
                  <option value="Sports">Sports / Athletics</option>
                  <option value="Exams">Exams / Assessment</option>
                  <option value="Other">Custom Signal</option>
                </select>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full bg-indigo-600 py-6 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-[0.98]"
              >
                Log Protocol to Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
