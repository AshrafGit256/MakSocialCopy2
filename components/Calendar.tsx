
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, User, College } from '../types';
import { 
  CalendarDays, MapPin, Plus, ChevronLeft, ChevronRight, Zap, X, 
  CheckCircle2, Image as ImageIcon, Activity, Users, 
  Bell, Target, Sparkles, Send, Radio, Target as TargetIcon, Clock,
  Calendar as CalendarIcon
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

  if (!timeLeft) return <span className="text-rose-500 font-bold uppercase text-[9px] animate-pulse">SIGNAL ACTIVE</span>;

  return (
    <div className="flex gap-1">
      {[{ v: timeLeft.d, l: 'd' }, { v: timeLeft.h, l: 'h' }, { v: timeLeft.m, l: 'm' }].map((item, i) => (
        <div key={i} className="bg-black/60 backdrop-blur-sm rounded-[4px] px-1.5 py-0.5 text-center border border-white/10">
           <p className="text-[10px] font-black text-white leading-none">{item.v}{item.l}</p>
        </div>
      ))}
    </div>
  );
};

const Calendar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());
  
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setEvents(db.getCalendarEvents());
  };

  // Logic: Closest upcoming events on top. Expired events at the bottom.
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    const now = Date.now();
    
    const isPastA = dateA < now;
    const isPastB = dateB < now;

    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    
    return isPastA ? dateB - dateA : dateA - dateB;
  });

  const filteredEvents = sortedEvents.filter(e => {
    if (selectedDate) return e.date === selectedDate;
    return true; 
  });

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 border border-[var(--border-color)] bg-[var(--bg-secondary)]/30"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasEvents = events.some(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDate === dateStr;

      days.push(
        <div key={d} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
          className={`h-10 border border-[var(--border-color)] flex flex-col items-center justify-center cursor-pointer transition-all relative ${
            isSelected ? 'bg-indigo-600 text-white z-10' : 
            isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 
            'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : ''}`}>{d}</span>
          {hasEvents && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></div>
          )}
        </div>
      );
    }
    return days;
  };

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
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Social', image: '' });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-6 pb-40 animate-in fade-in duration-500">
      
      {/* Header section with technical styling */}
      <header className="flex items-center justify-between bg-white dark:bg-[#161b22] border border-[var(--border-color)] p-6 rounded-[6px] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-[6px] text-white">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight italic leading-none text-indigo-600">Campus Registry Hub</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">Synchronization: ACTIVE / Priority Signal Sorting</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-[6px] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={14}/> Post Signal
            </button>
          )}
        </div>
      </header>

      {/* Main Grid: Mobile - Grid on top, Stream below. Desktop - Stream left, Grid right. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT (Moved to Top on Mobile): Calendar Grid & Quick Control */}
        <aside className="lg:col-span-4 order-1 lg:order-2 space-y-4 lg:sticky lg:top-20">
           <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Grid</h3>
                 <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-[4px] border border-[var(--border-color)]"><ChevronLeft size={14}/></button>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-[4px] border border-[var(--border-color)]"><ChevronRight size={14}/></button>
                 </div>
              </div>
              <p className="text-[11px] font-black text-[var(--text-primary)] uppercase mb-3 text-center tracking-tighter italic">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <div className="grid grid-cols-7 text-center text-[8px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-[var(--border-color)]">
                {renderCalendar()}
              </div>
           </div>

           <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] p-5 space-y-4 hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                 <Bell size={14} className="text-indigo-600" />
                 <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Registry Summary</h4>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-b border-[var(--border-color)] pb-2">
                    <span className="uppercase tracking-widest">Global Signals</span>
                    <span className="text-indigo-600 font-black">{events.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-b border-[var(--border-color)] pb-2">
                    <span className="uppercase tracking-widest">Verified Participants</span>
                    <span className="text-emerald-500 font-black">{events.reduce((acc, ev) => acc + (ev.attendeeIds?.length || 0), 0)}</span>
                 </div>
              </div>
              <button onClick={() => setSelectedDate(null)} className="w-full py-2 bg-slate-50 dark:bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-[4px] border border-[var(--border-color)] hover:border-indigo-500/50 hover:text-indigo-600 transition-all">
                Reset Stream Filter
              </button>
           </div>
        </aside>

        {/* LEFT (Moved below Grid on Mobile): Event Poster Stream (The "Main Feed") */}
        <main className="lg:col-span-8 order-2 lg:order-1 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                 <Activity size={14} className="text-indigo-600" />
                 Signal Feed: {selectedDate ? `Date Match [${selectedDate}]` : 'Auto-Sorted by Priority'}
              </h3>
           </div>

           <div ref={scrollRef} className="space-y-4">
              {filteredEvents.length > 0 ? filteredEvents.map((event) => {
                const isRegistered = event.attendeeIds?.includes(currentUser.id);
                const regCount = event.attendeeIds?.length || 0;
                const isPast = new Date(event.date).getTime() < new Date().setHours(0,0,0,0);

                return (
                  <div key={event.id} className={`group bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[6px] overflow-hidden transition-all hover:border-indigo-500/50 shadow-sm flex flex-col md:flex-row ${isPast ? 'opacity-60 grayscale' : ''}`}>
                    {/* Poster section - slightly reduced size */}
                    <div className="md:w-52 h-36 md:h-auto relative shrink-0 overflow-hidden">
                       <img 
                        src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                       <div className="absolute bottom-3 left-3">
                          <Countdown targetDate={`${event.date}T${event.time || '00:00'}:00`} />
                       </div>
                    </div>
                    {/* Content section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                       <div className="space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <span className="bg-indigo-600/10 text-indigo-600 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase border border-indigo-600/20">
                                   {event.category}
                                </span>
                                <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight pt-1">
                                  {event.title}
                                </h4>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black italic tracking-tighter">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{event.time || 'TBD'}</p>
                             </div>
                          </div>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 border-l-2 border-indigo-600/30 pl-3 italic">
                            "{event.description}"
                          </p>

                          <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                             <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-500"/> {event.location}</span>
                             <span className="flex items-center gap-1.5"><Users size={12} className="text-emerald-500"/> {regCount} Nodes Registered</span>
                          </div>
                       </div>
                       
                       <div className="pt-5 flex items-center gap-3">
                          <button 
                            onClick={() => !isRegistered && !isPast && handleRegister(event.id)}
                            disabled={isRegistered || isPast}
                            className={`flex-1 py-2.5 rounded-[4px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                               isRegistered 
                               ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                               : isPast ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 active:scale-[0.98]'
                            }`}
                          >
                             {isRegistered ? <CheckCircle2 size={14}/> : <Zap size={14}/>}
                             {isRegistered ? 'Identity Logged' : isPast ? 'Protocol Closed' : 'Confirm Registration'}
                          </button>
                          <button className="p-2.5 bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-[4px] text-slate-500 hover:text-indigo-600 transition-all active:scale-95">
                             <Send size={16}/>
                          </button>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-center border border-dashed border-[var(--border-color)] rounded-[6px] space-y-4">
                   <CalendarIcon size={32} className="mx-auto text-slate-300" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No signals detected in this range.</p>
                   <button onClick={() => setSelectedDate(null)} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Clear Search Logic</button>
                </div>
              )}
           </div>
        </main>

      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in zoom-in duration-300">
           <div className="bg-[var(--sidebar-bg)] w-full max-w-lg p-8 rounded-[6px] shadow-2xl space-y-6 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
                 <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Initialize Protocol Signal</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Registry Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Research Gala 2025" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Threshold Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-sm font-bold outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Time</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-sm font-bold outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Location Node</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Main Hall Auditorium" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">High-Fidelity Flyer</label>
                    <div className="flex gap-2">
                       <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-4 rounded-[4px] border border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-1 group">
                          {form.image ? <img src={form.image} className="h-16 w-full object-cover rounded-[4px]" /> : <ImageIcon size={20} className="text-slate-400 group-hover:text-indigo-600" />}
                          <span className="text-[8px] font-black uppercase text-slate-500">Pick Flyer Asset</span>
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => setForm({...form, image: reader.result as string});
                             reader.readAsDataURL(file);
                          }
                       }} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Log Brief</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[4px] p-3 text-sm font-bold outline-none h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Enter event mission parameters..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-indigo-600 py-4 rounded-[6px] text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all">Broadcast Protocol Signal</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Calendar;
