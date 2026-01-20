
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, Post, User, College, Notification } from '../types';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, 
  ChevronLeft, ChevronRight, Zap, Info, Camera,
  AlertCircle, Bell, ArrowRight, X, ExternalLink, CalendarDays,
  CheckCircle2, Users, LayoutGrid, Image as ImageIcon, CalendarCheck,
  Lock, Unlock, ShieldCheck, User as UserIcon
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

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
        <div key={i} className="bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 flex flex-col items-center min-w-[45px]">
           <span className="text-xl font-black text-white">{item.v}</span>
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
  const [currentUser, setCurrentUser] = useState<User>(db.getUser());
  const [repostTarget, setRepostTarget] = useState<College | 'Global'>('Global');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: ''
  });

  useEffect(() => {
    const sync = () => {
      const allEvents = db.getCalendarEvents();
      // Filter logic: show official events AND my personal events
      const myEvents = allEvents.filter(e => e.createdBy === 'super_admin' || e.createdBy === 'admin' || e.createdBy === currentUser.id);
      setEvents(myEvents);
      setCurrentUser(db.getUser());
      
      // Auto-Reminder Logic
      checkReminders(myEvents);
    };
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const checkReminders = (currentEvents: CalendarEvent[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysEvents = currentEvents.filter(e => e.date === today && e.createdBy === currentUser.id);
    
    todaysEvents.forEach(ev => {
      const reminderId = `reminder-${ev.id}`;
      const hasNotified = localStorage.getItem(reminderId);
      
      if (!hasNotified) {
        const newNotif: Notification = {
          id: Date.now().toString() + Math.random(),
          type: 'synapse',
          text: `Neural Alert: Your personal protocol "${ev.title}" is scheduled for today at ${ev.time}.`,
          timestamp: 'Just now',
          isRead: false
        };
        const updatedUser = { ...currentUser, notifications: [newNotif, ...(currentUser.notifications || [])] };
        db.saveUser(updatedUser);
        localStorage.setItem(reminderId, 'true');
      }
    });
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

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

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      ...form as CalendarEvent,
      id: Date.now().toString(),
      createdBy: currentUser.id, // Log current user as creator
      attendeeIds: [currentUser.id]
    };
    db.saveCalendarEvent(newEvent);
    setEvents(db.getCalendarEvents());
    setIsAdding(false);
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'Social', registrationLink: '', image: '' });
    alert("Personal Protocol Synchronized: Reminders initialized.");
  };

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setEvents(db.getCalendarEvents());
    const updatedEvent = db.getCalendarEvents().find(e => e.id === eventId);
    if (updatedEvent) setSelectedEvent(updatedEvent);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Terminate this personal protocol?")) {
      db.deleteCalendarEvent(eventId);
      setEvents(db.getCalendarEvents());
      setSelectedEvent(null);
    }
  };

  const pushToFeed = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: currentUser.name,
      authorId: currentUser.id,
      authorRole: 'Official Channel',
      authorAvatar: currentUser.avatar,
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
    alert(`Protocol Broadcast pushed to ${repostTarget} Hub Registry.`);
    setSelectedEvent(null);
  };

  const isRegistered = selectedEvent?.attendeeIds?.includes(currentUser.id);
  const isPersonal = selectedEvent?.createdBy === currentUser.id;

  const renderCalendar = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-[var(--border-color)] bg-[var(--bg-secondary)] opacity-10"></div>);
    }

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
            {dayEvents.map(e => {
              const myPersonal = e.createdBy === currentUser.id;
              return (
                <div key={e.id} className={`p-1.5 rounded-lg border text-[7px] font-black uppercase truncate tracking-wider ${
                  myPersonal 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-indigo-600/10 dark:bg-indigo-600/20 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                }`}>
                   {e.title}
                </div>
              );
            })}
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
           <h1 className="text-6xl font-black tracking-tighter text-[var(--text-primary)] uppercase flex items-center gap-4">
             <CalendarDays className="text-indigo-500" size={48} /> Registry
           </h1>
           <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em] text-[10px] mt-2 ml-1">Universal Campus Registry Protocol</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <button 
             onClick={() => setIsAdding(true)} 
             className="flex-1 md:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 flex items-center justify-center gap-2"
           >
             <Plus size={16} /> {isAdmin ? 'Global Event' : 'Personal Protocol'}
           </button>
           
           <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--border-color)] shadow-sm">
              <button onClick={handlePrevMonth} className="p-3 text-slate-500 hover:text-indigo-600 transition-colors"><ChevronLeft size={20}/></button>
              <div className="px-6 flex items-center justify-center min-w-[150px]">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                   {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </span>
              </div>
              <button onClick={handleNextMonth} className="p-3 text-slate-500 hover:text-indigo-600 transition-colors"><ChevronRight size={20}/></button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-7 border-b border-[var(--border-color)] pb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm">
        {renderCalendar()}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 dark:bg-brand-dark/95 animate-in fade-in duration-300 backdrop-blur-md">
           <div className="glass-card w-full max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl border-[var(--border-color)] bg-[var(--sidebar-bg)]">
              <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
                 <img src={selectedEvent.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200'} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                    <Countdown targetDate={`${selectedEvent.date}T${selectedEvent.time || '00:00'}:00`} />
                 </div>
              </div>

              <div className="md:w-1/2 p-10 space-y-8 bg-[var(--sidebar-bg)] overflow-y-auto no-scrollbar">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className={`${isPersonal ? 'bg-emerald-600' : 'bg-indigo-600'} text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                         {isPersonal ? <Lock size={10}/> : <ShieldCheck size={10}/>}
                         {isPersonal ? 'Private Protocol' : 'Official Registry'}
                       </span>
                       <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none pt-2">{selectedEvent.title}</h2>
                    </div>
                    <div className="flex gap-2">
                       {isPersonal && (
                         <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={20}/></button>
                       )}
                       <button onClick={() => setSelectedEvent(null)} className="text-slate-500 hover:text-rose-500 p-2"><X size={24}/></button>
                    </div>
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
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                          <p className="text-xs text-[var(--text-primary)] font-bold">{selectedEvent.location}</p>
                       </div>
                    </div>
                 </div>

                 <p className="text-sm text-[var(--text-secondary)] leading-relaxed border-l-2 border-indigo-500 pl-4 font-medium italic">
                   "{selectedEvent.description}"
                 </p>

                 <div className="flex flex-col gap-3 pt-4">
                    {!isPersonal && (
                      <button 
                        onClick={() => !isRegistered && handleRegister(selectedEvent.id)}
                        disabled={isRegistered}
                        className={`w-full p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                          isRegistered 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                        }`}
                      >
                        {isRegistered ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                        {isRegistered ? 'Identity Logged (Validated)' : 'Register for Event'}
                      </button>
                    )}
                    
                    {(isAdmin || isPersonal) && (
                      <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={14}/> {isPersonal ? 'Broadcast Personal Milestone' : 'Repost to Hub Wing'}</h4>
                         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            <button 
                               onClick={() => setRepostTarget('Global')}
                               className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${repostTarget === 'Global' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-white/5 border-[var(--border-color)] text-slate-500'}`}
                            >
                               Global Hub
                            </button>
                            {COLLEGES.map(c => (
                               <button 
                                  key={c}
                                  onClick={() => setRepostTarget(c)}
                                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${repostTarget === c ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-white/5 border-[var(--border-color)] text-slate-500'}`}
                               >
                                  {c} Wing
                               </button>
                            ))}
                         </div>
                         <button 
                            onClick={() => pushToFeed(selectedEvent)}
                            className="w-full bg-rose-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-rose-700 shadow-rose-600/20"
                         >
                            <ExternalLink size={14}/> {isPersonal ? 'Initialize Public Pulse' : `Push Command to ${repostTarget}`}
                         </button>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/90 dark:bg-brand-dark/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-xl p-10 border-[var(--border-color)] shadow-2xl space-y-6 bg-[var(--sidebar-bg)] rounded-[3rem] overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">
                    {isAdmin ? 'Initialize Registry' : 'Neural Protocol'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {isAdmin ? 'Global Campus Synchronization' : 'Personal Intellectual Timeline'}
                  </p>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 p-2 transition-colors"><X size={28}/></button>
              </div>
              <div className="space-y-5">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold focus:border-indigo-500 transition-all" placeholder={isAdmin ? "e.g. Research Seminar" : "e.g. Logic Study Session"} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold focus:border-indigo-500 transition-all" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Time</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold focus:border-indigo-500 transition-all" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue Protocol</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold focus:border-indigo-500 transition-all" placeholder="e.g. Library Level 4 / Online" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Flyer (Optional)</label>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="flex-1 p-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-2 group"
                       >
                          {form.image ? (
                             <img src={form.image} className="h-16 w-full object-cover rounded-xl" />
                          ) : (
                             <>
                                <ImageIcon size={24} className="text-slate-400 group-hover:text-indigo-600" />
                                <span className="text-[9px] font-black uppercase text-slate-500">Pick Signal from Device</span>
                             </>
                          )}
                       </button>
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Details</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none h-24 resize-none font-bold focus:border-indigo-500 transition-all" placeholder="Enter session objectives..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Category Logic</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none appearance-none font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}>
                       <option>Academic</option>
                       <option>Social</option>
                       <option>Exams</option>
                       <option>Milestone</option>
                    </select>
                 </div>
              </div>
              <button 
                onClick={handleAddEvent} 
                className={`w-full p-6 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-[0.98] ${
                  isAdmin ? 'bg-indigo-600 shadow-indigo-600/30 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-600/30 hover:bg-emerald-700'
                }`}
              >
                Sync Protocol to Registry
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
