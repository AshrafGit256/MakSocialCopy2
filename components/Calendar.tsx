
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { CalendarEvent, Post } from '../types';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, 
  ChevronLeft, ChevronRight, Zap, Info, Camera,
  AlertCircle, Bell, ArrowRight, X, ExternalLink, CalendarDays
} from 'lucide-react';

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-rose-500 font-black animate-pulse uppercase tracking-widest text-[8px]">Protocol Active / Past</span>;

  return (
    <div className="flex gap-2">
      {[
        { v: timeLeft.d, l: 'd' },
        { v: timeLeft.h, l: 'h' },
        { v: timeLeft.m, l: 'm' },
        { v: timeLeft.s, l: 's' }
      ].map((item, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 flex flex-col items-center min-w-[45px]">
           <span className="text-xl font-black text-white italic">{item.v}</span>
           <span className="text-[7px] uppercase font-bold text-slate-300">{item.l}</span>
        </div>
      ))}
    </div>
  );
};

interface CalendarProps {
  isAdmin: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ isAdmin }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(db.getCalendarEvents());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: ''
  });

  useEffect(() => {
    const interval = setInterval(() => setEvents(db.getCalendarEvents()), 5000);
    return () => clearInterval(interval);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      ...form as CalendarEvent,
      id: Date.now().toString(),
      createdBy: 'admin'
    };
    db.saveCalendarEvent(newEvent);
    setIsAdding(false);
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '' });
  };

  const pushToFeed = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: 'Campus Events (Broadcaster)',
      authorId: 'admin',
      authorRole: 'Official Channel',
      authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: event.description,
      images: event.image ? [event.image] : undefined,
      hashtags: ['#MakEvent', `#${event.category}`, '#CampusPulse'],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: 'Global' as any,
      isEventBroadcast: true,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventTitle: event.title,
      eventRegistrationLink: event.registrationLink
    };
    db.addPost(broadcast);
    alert("Event broadcast successfully pushed to the main hub.");
    setSelectedEvent(null);
  };

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Empty spaces
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-[var(--border-color)] bg-slate-50 dark:bg-transparent opacity-20"></div>);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div 
          key={d} 
          onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
          className={`h-32 border border-[var(--border-color)] p-3 flex flex-col transition-all cursor-pointer group ${
            dayEvents.length > 0 ? 'bg-indigo-50/30 dark:bg-white/[0.02] hover:bg-indigo-100/50 dark:hover:bg-white/[0.08]' : 'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03]'
          } ${isToday ? 'border-indigo-500 border-2 z-10' : ''}`}
        >
          <span className={`text-[10px] font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'} group-hover:text-indigo-600 dark:group-hover:text-white mb-2`}>
            {String(d).padStart(2, '0')}
          </span>
          
          <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {dayEvents.map(e => (
              <div key={e.id} className="p-1.5 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 text-[7px] font-black uppercase text-indigo-700 dark:text-indigo-300 truncate tracking-wider animate-in fade-in slide-in-from-left-2">
                 {e.title}
              </div>
            ))}
            {dayEvents.length > 0 && (
              <div className="flex justify-center mt-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#6366f1]"></div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-6xl font-black italic tracking-tighter text-[var(--text-primary)] uppercase flex items-center gap-4">
             <CalendarDays className="text-indigo-500" size={48} /> Calendar
           </h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 ml-1">Universal Campus Registry Protocol</p>
        </div>

        <div className="flex items-center gap-4">
           {isAdmin && (
             <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 flex items-center gap-2">
               <Plus size={16} /> Broadcast Logic
             </button>
           )}
           <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--border-color)] shadow-sm">
              <button onClick={handlePrevMonth} className="p-3 text-slate-500 hover:text-indigo-600 transition-colors"><ChevronLeft size={20}/></button>
              <div className="px-6 flex items-center justify-center min-w-[180px]">
                 <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] italic">
                   {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </span>
              </div>
              <button onClick={handleNextMonth} className="p-3 text-slate-500 hover:text-indigo-600 transition-colors"><ChevronRight size={20}/></button>
           </div>
        </div>
      </header>

      {/* Grid Header */}
      <div className="grid grid-cols-7 border-b border-[var(--border-color)] pb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{day}</div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-7 rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm">
        {renderCalendar()}
      </div>

      {/* Selected Event Poster Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 dark:bg-brand-dark/95 animate-in fade-in duration-300 backdrop-blur-md">
           <div className="glass-card w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl border-[var(--border-color)]">
              <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
                 <img src={selectedEvent.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200'} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                    <Countdown targetDate={`${selectedEvent.date}T${selectedEvent.time || '00:00'}:00`} />
                 </div>
              </div>

              <div className="md:w-1/2 p-10 space-y-8 bg-[var(--sidebar-bg)]">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="bg-indigo-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                       <h2 className="text-4xl font-black text-[var(--text-primary)] italic uppercase tracking-tighter leading-none pt-2">{selectedEvent.title}</h2>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-slate-500 hover:text-rose-500 p-2"><X size={24}/></button>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-indigo-600"><Clock size={16}/></div>
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time Schedule</p>
                          <p className="text-xs text-[var(--text-primary)] font-bold">{selectedEvent.time} • {new Date(selectedEvent.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-indigo-600"><MapPin size={16}/></div>
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Node</p>
                          <p className="text-xs text-[var(--text-primary)] font-bold">{selectedEvent.location}</p>
                       </div>
                    </div>
                 </div>

                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                   "{selectedEvent.description}"
                 </p>

                 <div className="flex flex-col gap-3 pt-4">
                    {selectedEvent.registrationLink && (
                       <a 
                        href={selectedEvent.registrationLink} 
                        target="_blank" 
                        className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700"
                       >
                         Sync Registration <ExternalLink size={14}/>
                       </a>
                    )}
                    <button className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--border-color)] transition-all">
                       <Zap size={14}/> Add to My Calendar
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => pushToFeed(selectedEvent)}
                        className="w-full bg-rose-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-rose-700"
                      >
                         <Zap size={14}/> Push to Global Hub Feed
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 dark:bg-brand-dark/95 backdrop-blur-md">
           <div className="glass-card w-full max-w-xl p-8 border-[var(--border-color)] shadow-2xl space-y-6 bg-[var(--sidebar-bg)]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase">Initialize Logic</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-500" placeholder="e.g. Guild Debate" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    <input type="time" className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                 </div>
                 <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                 <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none" placeholder="Registration Link (Optional)" value={form.registrationLink} onChange={e => setForm({...form, registrationLink: e.target.value})} />
                 <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] text-sm outline-none h-24 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <button onClick={handleAddEvent} className="w-full bg-indigo-600 p-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all">Commit Event</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
