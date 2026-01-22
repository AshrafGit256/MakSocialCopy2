
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, Post, User, College } from '../types';
import { 
  CalendarDays, Clock, MapPin, Plus, Trash2, 
  ChevronLeft, ChevronRight, Zap, X, ExternalLink,
  CheckCircle2, LayoutGrid, Image as ImageIcon,
  Activity, ArrowUpRight, Calendar as CalendarIcon
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) { setTimeLeft(null); clearInterval(timer); return; }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-rose-500 font-black uppercase text-[9px] animate-pulse">Protocol Active</span>;

  return (
    <div className="flex gap-1.5">
      {[{ v: timeLeft.d, l: 'D' }, { v: timeLeft.h, l: 'H' }, { v: timeLeft.m, l: 'M' }, { v: timeLeft.s, l: 'S' }].map((item, i) => (
        <div key={i} className="bg-black/80 rounded-lg px-2 py-1.5 min-w-[32px] text-center">
           <p className="text-xs font-black text-white leading-none">{item.v}</p>
           <p className="text-[6px] font-bold text-slate-400 uppercase mt-0.5">{item.l}</p>
        </div>
      ))}
    </div>
  );
};

const Calendar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());
  const [repostTarget, setRepostTarget] = useState<College | 'Global'>('Global');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: ''
  });

  useEffect(() => {
    const sync = () => {
      setEvents(db.getCalendarEvents());
      setCurrentUser(db.getUser());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      ...form as CalendarEvent,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      attendeeIds: []
    };
    db.saveCalendarEvent(newEvent);
    setEvents(db.getCalendarEvents());
    setIsAdding(false);
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: '' });
  };

  const pushToFeed = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: 'Campus Events Hub',
      authorId: currentUser.id,
      authorRole: 'Official Broadcast',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: event.description,
      eventFlyer: event.image,
      hashtags: ['#MakEvent', `#${event.category}`],
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
    alert(`Protocol command synchronized to ${repostTarget} Hub.`);
  };

  const upcomingAgenda = events
    .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-[var(--border-color)] bg-[var(--bg-secondary)] opacity-10"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
          className={`h-24 md:h-32 border border-[var(--border-color)] p-2 flex flex-col cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${isToday ? 'border-indigo-600 border-2 z-10' : ''}`}
        >
          <span className={`text-[10px] font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar mt-2">
            {dayEvents.map(e => (
              <div key={e.id} className="p-1 rounded bg-indigo-600 text-white text-[7px] font-black uppercase truncate shadow-sm">
                 {e.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-40 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20"><CalendarDays size={32}/></div>
              <h1 className="text-4xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Universal Registry</h1>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Central Campus Protocol Calendar</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
           {isAdmin && (
             <button onClick={() => setIsAdding(true)} className="flex-1 lg:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
               <Plus size={18}/> New Signal
             </button>
           )}
           <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--border-color)]">
              <button onClick={handlePrevMonth} className="p-2 text-slate-500"><ChevronLeft size={20}/></button>
              <div className="px-6 flex items-center justify-center min-w-[140px] text-[10px] font-black uppercase tracking-widest">
                 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <button onClick={handleNextMonth} className="p-2 text-slate-500"><ChevronRight size={20}/></button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Calendar Wing */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-7 border-b border-[var(--border-color)] pb-4 text-center text-[9px] font-black uppercase text-slate-400 tracking-widest">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
           </div>
           <div className="grid grid-cols-7 rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-xl bg-white dark:bg-[#0d1117]">
              {renderCalendar()}
           </div>
        </div>

        {/* Upcoming Events Agenda */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <Activity className="text-indigo-600" size={24}/> Live Agenda
                 </h3>
                 <span className="bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase">Next 7 Days</span>
              </div>

              <div className="space-y-4">
                 {upcomingAgenda.length > 0 ? upcomingAgenda.map((event, i) => (
                   <div key={event.id} onClick={() => setSelectedEvent(event)} className="group relative p-6 bg-white dark:bg-[#161b22] border border-[var(--border-color)] rounded-[2rem] hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                      <div className="flex justify-between items-start mb-4">
                         <div className="space-y-1">
                            <span className="bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded text-[7px] font-black uppercase">{event.category}</span>
                            <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{event.time || 'TBD'}</p>
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                         <div className="flex items-center gap-2 text-slate-500 text-[8px] font-black uppercase">
                            <MapPin size={12}/> {event.location}
                         </div>
                         <Countdown targetDate={`${event.date}T${event.time || '00:00'}:00`} />
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] text-slate-400 font-black uppercase text-[10px] tracking-widest italic">
                      Registry Quiescent: No Upcoming Signals
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md animate-in fade-in">
           <div className="bg-[var(--sidebar-bg)] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[var(--border-color)]">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                 <img src={selectedEvent.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200'} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <div className="absolute bottom-10 left-10">
                    <Countdown targetDate={`${selectedEvent.date}T${selectedEvent.time || '00:00'}:00`} />
                 </div>
              </div>
              <div className="md:w-1/2 p-12 space-y-8 flex flex-col justify-center">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <span className="bg-indigo-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                       <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">{selectedEvent.title}</h2>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-rose-500 transition-colors p-2"><X size={32}/></button>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed italic border-l-4 border-indigo-600 pl-6">"{selectedEvent.description}"</p>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Date</p>
                       <p className="text-xs font-bold">{selectedEvent.date} @ {selectedEvent.time || 'TBD'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location Node</p>
                       <p className="text-xs font-bold">{selectedEvent.location}</p>
                    </div>
                 </div>
                 <div className="pt-6 space-y-4">
                    <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all">Confirm Attendance Protocol</button>
                    {isAdmin && (
                      <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                         <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Broadcast Control</h4>
                         <div className="flex gap-2">
                            <select className="flex-1 bg-[var(--bg-secondary)] rounded-xl px-4 py-3 text-[9px] font-black uppercase outline-none" value={repostTarget} onChange={e => setRepostTarget(e.target.value as any)}>
                               <option value="Global">Global Hub</option>
                               {COLLEGES.map(c => <option key={c} value={c}>{c} Wing</option>)}
                            </select>
                            <button onClick={() => pushToFeed(selectedEvent)} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all">Broadcast</button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-in zoom-in duration-300">
           <div className="bg-[var(--sidebar-bg)] w-full max-w-xl p-12 rounded-[3rem] shadow-2xl space-y-8 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">New Protocol</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={32}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Time</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Location Node</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Details</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-indigo-600 py-6 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">Commit Signal to Registry</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
