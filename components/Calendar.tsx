
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, Post, User, College } from '../types';
import { 
  CalendarDays, Clock, MapPin, Plus, Trash2, 
  ChevronLeft, ChevronRight, Zap, X, ExternalLink,
  CheckCircle2, LayoutGrid, Image as ImageIcon,
  Activity, ArrowUpRight, Calendar as CalendarIcon,
  Bell, Info, Target, Sparkles, Send, Radio, Target as TargetIcon
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

  if (!timeLeft) return <span className="text-rose-500 font-black uppercase text-[9px] animate-pulse">Live Now</span>;

  return (
    <div className="flex gap-1.5">
      {[{ v: timeLeft.d, l: 'D' }, { v: timeLeft.h, l: 'H' }, { v: timeLeft.m, l: 'M' }, { v: timeLeft.s, l: 'S' }].map((item, i) => (
        <div key={i} className="bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 min-w-[32px] text-center border border-white/10">
           <p className="text-xs font-black text-white leading-none">{item.v}</p>
           <p className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">{item.l}</p>
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
    alert("Protocol Synchronized: Identity logged for this campus node.");
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
      days.push(<div key={`empty-${i}`} className="h-14 lg:h-20 border border-[var(--border-color)] bg-[var(--bg-secondary)]/30 opacity-50"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDate === dateStr;

      days.push(
        <div key={d} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
          className={`h-14 lg:h-20 border border-[var(--border-color)] flex flex-col items-center justify-center cursor-pointer transition-all relative group ${
            isSelected ? 'bg-indigo-600 text-white z-10' : 
            isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 
            'bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <span className={`text-[11px] lg:text-[13px] font-black ${isSelected ? 'text-white' : ''}`}>{d}</span>
          <div className="flex gap-0.5 mt-1">
             {dayEvents.slice(0, 3).map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}></div>
             ))}
             {dayEvents.length > 3 && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`}></div>}
          </div>
          {isToday && !isSelected && (
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
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
    <div className="max-w-[1600px] mx-auto px-4 lg:px-12 py-8 lg:py-10 space-y-12 pb-40 animate-in fade-in duration-700">
      
      {/* Tactical Status Bar */}
      <header className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-indigo-600 rounded-[3rem] p-8 lg:p-12 text-white shadow-2xl shadow-indigo-600/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150">
          <TargetIcon size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-6 bg-white/20 backdrop-blur-2xl rounded-[2rem] shadow-inner border border-white/20">
            <Radio size={48} className="animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter italic leading-[0.85]">Campus Pulse <br/><span className="text-white/80">Registry</span></h1>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-70 mt-4 ml-1">Universal Network Synchronization Node: ACTIVE</p>
          </div>
        </div>
        
        {nextSignal && (
          <div className="relative z-10 bg-black/30 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 flex items-center gap-8 shadow-2xl">
            <div className="hidden lg:block space-y-1">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Next Priority Signal</p>
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter truncate max-w-[200px] italic">{nextSignal.title}</h4>
              <p className="text-[10px] font-bold text-white/60 uppercase">{nextSignal.location}</p>
            </div>
            <Countdown targetDate={`${nextSignal.date}T${nextSignal.time || '00:00'}:00`} />
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Enhanced Registry Grid */}
        <aside className="lg:col-span-5 space-y-8">
           <div className="bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[3rem] p-8 lg:p-10 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-10">
                 <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Registry Grid</h3>
                    <p className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">
                       {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-[var(--border-color)]"><ChevronLeft size={20}/></button>
                    <button onClick={handleNextMonth} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all border border-[var(--border-color)]"><ChevronRight size={20}/></button>
                 </div>
              </div>
              
              <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-[var(--border-color)] rounded-3xl overflow-hidden shadow-inner">
                {renderCalendar()}
              </div>
              
              <div className="flex gap-3 mt-8">
                 <button 
                   onClick={() => setSelectedDate(null)} 
                   className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!selectedDate ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20'}`}
                 >
                   <RefreshCcw size={14} className={selectedDate ? 'animate-spin-slow' : ''} /> Reset Filter
                 </button>
                 {isAdmin && (
                   <button onClick={() => setIsAdding(true)} className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                      <Plus size={24}/>
                   </button>
                 )}
              </div>
           </div>
        </aside>

        {/* Right: Immersive Protocol Stream */}
        <main className="lg:col-span-7 space-y-10">
           <div className="flex items-center justify-between px-4">
              <div className="space-y-1">
                 <h3 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                    <Activity className="text-indigo-600" size={32}/> 
                    {selectedDate ? `Targeted Signals` : 'Universal Agenda Stream'}
                 </h3>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Decrypted Campus Registry Events</p>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600">
                    <Sparkles size={16} className="text-amber-500 animate-pulse" /> High Fidelity Mode
                 </div>
                 <p className="text-[8px] font-bold text-slate-500 uppercase">Latency: 4.2ms</p>
              </div>
           </div>

           <div ref={scrollRef} className="space-y-10">
              {upcomingAgenda.length > 0 ? upcomingAgenda.map((event) => {
                const isRegistered = event.attendeeIds?.includes(currentUser.id);
                return (
                  <div key={event.id} className="group relative bg-white dark:bg-[#0d1117] border border-[var(--border-color)] rounded-[3.5rem] overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] flex flex-col">
                    <div className="w-full h-80 lg:h-[450px] relative overflow-hidden">
                       <img 
                        src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200'} 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/10 to-transparent"></div>
                       
                       <div className="absolute top-8 left-8 flex gap-3">
                          <span className="bg-white/20 backdrop-blur-xl text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-2xl">
                             {event.category}
                          </span>
                       </div>

                       <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-indigo-400"/>
                                <span className="text-sm font-black text-white/90 uppercase tracking-widest">{event.location}</span>
                             </div>
                             <h4 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] italic">
                               {event.title}
                             </h4>
                          </div>
                          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                             <Countdown targetDate={`${event.date}T${event.time || '00:00'}:00`} />
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-10 lg:p-14 space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                          <div className="md:col-span-8 space-y-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                                   <Info size={24}/>
                                </div>
                                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Mission Briefing</h5>
                             </div>
                             <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-indigo-600/20 pl-8">
                               "{event.description}"
                             </p>
                          </div>
                          
                          <div className="md:col-span-4 space-y-6">
                             <div className="bg-slate-50 dark:bg-white/[0.02] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Signal</p>
                                   <p className="text-2xl font-black italic tracking-tighter uppercase">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synchronized Time</p>
                                   <p className="text-xl font-black italic tracking-tighter uppercase">{event.time || 'TBD'}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="pt-10 flex items-center gap-6 border-t border-[var(--border-color)]">
                          <button 
                            onClick={() => !isRegistered && handleRegister(event.id)}
                            disabled={isRegistered}
                            className={`flex-1 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                               isRegistered 
                               ? 'bg-emerald-600 text-white' 
                               : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/40 active:scale-95'
                            }`}
                          >
                             {isRegistered ? <CheckCircle2 size={24}/> : <Zap size={24}/>}
                             {isRegistered ? 'Identity Validated' : 'Confirm Attendance Protocol'}
                          </button>
                          <button className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] text-slate-500 hover:text-indigo-600 transition-all hover:bg-white dark:hover:bg-white/5 active:scale-90">
                             <Send size={28}/>
                          </button>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-60 text-center border-4 border-dashed border-[var(--border-color)] rounded-[4rem] space-y-8 group hover:border-indigo-600/30 transition-all">
                   <div className="w-32 h-32 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-700">
                      <CalendarIcon size={64} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-3xl font-black uppercase tracking-tighter italic text-slate-400 group-hover:text-indigo-600 transition-colors">Registry Quiescent</h4>
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Awaiting Incoming Protocol Signals...</p>
                   </div>
                   <button onClick={() => {setSelectedDate(null); setCurrentDate(new Date());}} className="bg-indigo-600/10 text-indigo-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Flush Hub Filter</button>
                </div>
              )}
           </div>
        </main>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-2xl animate-in zoom-in duration-300">
           <div className="bg-[var(--sidebar-bg)] w-full max-w-2xl p-12 rounded-[4rem] shadow-2xl space-y-10 border border-[var(--border-color)] max-h-[95vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center">
                 <div>
                   <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">Initialize Signal</h2>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Authorized Hub Registry Entry</p>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-3 bg-slate-100 dark:bg-white/5 rounded-2xl"><X size={32}/></button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Registry Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-base font-bold outline-none focus:border-indigo-600 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Research Gala 2025" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Synchronization Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Time</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Location Node</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-base font-bold outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Main Hall Auditorium" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">High-Fidelity Asset (Flyer)</label>
                    <div className="flex gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-8 rounded-3xl border-4 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-3 group">
                          {form.image ? <img src={form.image} className="h-32 w-full object-cover rounded-2xl" /> : <ImageIcon size={32} className="text-slate-400 group-hover:text-indigo-600" />}
                          <span className="text-[10px] font-black uppercase text-slate-500">Pick Flyer Asset</span>
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
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Log Brief</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 text-base font-bold outline-none h-32 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Enter event mission parameters..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-indigo-600 py-8 rounded-[2.5rem] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Broadcast Protocol Signal</button>
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

// Internal icon helper
const RefreshCcw = ({size, className}: {size: number, className: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);

export default Calendar;
