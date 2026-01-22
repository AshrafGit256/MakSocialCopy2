
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, Post, User, College } from '../types';
import { 
  CalendarDays, Clock, MapPin, Plus, Trash2, 
  ChevronLeft, ChevronRight, Zap, X, ExternalLink,
  CheckCircle2, LayoutGrid, Image as ImageIcon,
  Activity, ArrowUpRight, Calendar as CalendarIcon,
  Bell, Info, Target, Sparkles, Send, Radio
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

  if (!timeLeft) return <span className="text-rose-500 font-black uppercase text-[8px] animate-pulse">Live Now</span>;

  return (
    <div className="flex gap-1">
      {[{ v: timeLeft.d, l: 'd' }, { v: timeLeft.h, l: 'h' }, { v: timeLeft.m, l: 'm' }].map((item, i) => (
        <div key={i} className="bg-black/40 rounded px-1.5 py-0.5 text-center min-w-[24px]">
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

  const upcomingAgenda = events
    .filter(e => {
      if (selectedDate) return e.date === selectedDate;
      return new Date(e.date) >= new Date(new Date().setHours(0,0,0,0));
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextSignal = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-[var(--border-color)] bg-[var(--bg-secondary)]/30"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasEvents = events.some(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDate === dateStr;

      days.push(
        <div key={d} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
          className={`h-12 border border-[var(--border-color)] flex items-center justify-center cursor-pointer transition-all relative ${
            isSelected ? 'bg-indigo-600 text-white z-10' : 
            isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 
            'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <span className={`text-[10px] font-black ${isSelected ? 'text-white' : ''}`}>{d}</span>
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
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-6 space-y-8 pb-40 animate-in fade-in duration-500">
      
      {/* 1. Protocol Status Bar */}
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-indigo-600 rounded-[2rem] p-6 lg:p-10 text-white shadow-2xl shadow-indigo-600/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Target size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-5 bg-white/20 backdrop-blur-xl rounded-[1.5rem] shadow-inner border border-white/20">
            {/* Added Radio to lucide-react imports to resolve the missing name error */}
            <Radio size={40} className="animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">Campus Pulse Registry</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Active Signal Synchronization in Progress</p>
          </div>
        </div>
        
        {nextSignal && (
          <div className="relative z-10 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-6">
            <div className="hidden sm:block">
              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200">Next Immediate Signal</p>
              <h4 className="text-sm font-black uppercase tracking-tight truncate max-w-[150px]">{nextSignal.title}</h4>
            </div>
            <Countdown targetDate={`${nextSignal.date}T${nextSignal.time || '00:00'}:00`} />
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Micro Registry (Calendar Grid) */}
        <aside className="lg:col-span-3 space-y-6">
           <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Grid</h3>
                 <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"><ChevronLeft size={16}/></button>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"><ChevronRight size={16}/></button>
                 </div>
              </div>
              <p className="text-xs font-black text-[var(--text-primary)] uppercase mb-4 text-center tracking-tighter italic">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <div className="grid grid-cols-7 text-center text-[8px] font-black uppercase text-slate-400 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-[var(--border-color)] rounded-lg overflow-hidden">
                {renderCalendar()}
              </div>
              <button 
                onClick={() => setSelectedDate(null)} 
                className={`w-full mt-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!selectedDate ? 'text-slate-300' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5'}`}
              >
                Clear Selection
              </button>
           </div>

           <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-[2rem] p-6 space-y-4">
              <h4 className="text-[9px] font-black uppercase text-indigo-600 flex items-center gap-2">
                 <Bell size={14} /> Quick Settings
              </h4>
              <button onClick={() => setIsAdding(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20">
                Post New Signal
              </button>
           </div>
        </aside>

        {/* 3. Protocol Flyer Stream (Main Agenda) */}
        <main className="lg:col-span-9 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                 <Activity className="text-indigo-600" size={24}/> 
                 {selectedDate ? `Signals for ${selectedDate}` : 'Upcoming Protocol Stream'}
              </h3>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                 <Sparkles size={14} className="text-amber-500" /> Synchronization High Fidelity
              </div>
           </div>

           <div ref={scrollRef} className="space-y-6">
              {upcomingAgenda.length > 0 ? upcomingAgenda.map((event) => {
                const isRegistered = event.attendeeIds?.includes(currentUser.id);
                return (
                  <div key={event.id} className="group relative bg-white dark:bg-[#161b22] border border-[var(--border-color)] rounded-[2.5rem] overflow-hidden hover:border-indigo-500 transition-all shadow-sm hover:shadow-2xl flex flex-col md:flex-row">
                    <div className="md:w-64 lg:w-80 h-48 md:h-auto relative overflow-hidden shrink-0">
                       <img 
                        src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                       <div className="absolute bottom-4 left-4">
                          <Countdown targetDate={`${event.date}T${event.time || '00:00'}:00`} />
                       </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start mb-4">
                             <div className="space-y-1">
                                <span className="bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-600/20">
                                   {event.category}
                                </span>
                                <h4 className="text-2xl font-black uppercase tracking-tighter leading-none pt-2 group-hover:text-indigo-600 transition-colors">
                                  {event.title}
                                </h4>
                             </div>
                             <div className="text-right flex flex-col items-end">
                                <p className="text-lg font-black tracking-tighter italic leading-none">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.time || 'TBD'}</p>
                             </div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2 border-l-2 border-indigo-600/30 pl-4 mb-6">
                            "{event.description}"
                          </p>
                          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500"/> {event.location}</span>
                             <span className="flex items-center gap-2"><LayoutGrid size={14}/> Node verified</span>
                          </div>
                       </div>
                       
                       <div className="pt-8 flex items-center gap-4">
                          <button 
                            onClick={() => !isRegistered && handleRegister(event.id)}
                            disabled={isRegistered}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3 ${
                               isRegistered 
                               ? 'bg-emerald-600 text-white' 
                               : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 active:scale-95'
                            }`}
                          >
                             {isRegistered ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
                             {isRegistered ? 'Identity Synchronized' : 'Confirm Attendance Protocol'}
                          </button>
                          <button className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-slate-500 hover:text-indigo-600 transition-all hover:bg-white dark:hover:bg-white/5">
                             <Send size={20}/>
                          </button>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-40 text-center border-2 border-dashed border-[var(--border-color)] rounded-[3rem] space-y-6">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <CalendarIcon size={40} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase tracking-tighter italic text-slate-400">Registry Quiescent</h4>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">No Upcoming Signals Detected in this sector</p>
                   </div>
                   <button onClick={() => {setSelectedDate(null); setCurrentDate(new Date());}} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Flush Registry Filter</button>
                </div>
              )}
           </div>
        </main>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-in zoom-in duration-300">
           <div className="bg-[var(--sidebar-bg)] w-full max-w-xl p-10 rounded-[3rem] shadow-2xl space-y-8 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Initialize Signal</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={32}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Research Gala" />
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
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Freedom Square" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Signal Asset (Flyer Image)</label>
                    <div className="flex gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-2 group">
                          {form.image ? <img src={form.image} className="h-20 w-full object-cover rounded-xl" /> : <ImageIcon size={24} className="text-slate-400 group-hover:text-indigo-600" />}
                          <span className="text-[8px] font-black uppercase text-slate-500">Pick Flyer</span>
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
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Log</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mission details..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-indigo-600 py-6 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">Broadcast Signal to Hub</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Calendar;
