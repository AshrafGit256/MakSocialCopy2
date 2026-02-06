import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, User } from '../types';
import { 
  Plus, ChevronLeft, ChevronRight, Zap, X, 
  CheckCircle2, Activity, Radio, Clock,
  /* Fixed: Changed FilterX to Filter to match its usage in the component */
  Filter, Terminal, Hash, Target,
  Cpu, Share2, Box, GitCommit, Link as LinkIcon,
  Server, Shield, AlertTriangle, MapPin, Users,
  Bookmark, Calendar as CalendarIcon, Info, Eye, Image as ImageIcon,
  Globe
} from 'lucide-react';

const SystemStatus: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB')), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] mb-8 font-sans text-[10px] shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-500 font-bold uppercase">Live Updates</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-[var(--border-color)]"></div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <CalendarIcon size={12} />
          <span>Makerere Schedule</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={12} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-500">
          <Activity size={12} />
          <span>Syncing...</span>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [manifestFilter, setManifestFilter] = useState<'universal' | 'personal'>('universal');
  const [currentUser] = useState<User>(db.getUser());
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', image: ''
  });

  useEffect(() => {
    const sync = () => setEvents(db.getCalendarEvents());
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (manifestFilter === 'personal') {
      list = list.filter(e => e.attendeeIds?.includes(currentUser.id));
    }
    return list
      .filter(e => e.date === selectedDate)
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  }, [events, selectedDate, manifestFilter, currentUser.id]);

  const handleRegister = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    db.registerForEvent(eventId, currentUser.id);
    setEvents(db.getCalendarEvents());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const renderMatrix = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-full aspect-square bg-transparent"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const count = events.filter(e => e.date === dateStr).length;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      const intensityClasses = 
        count === 0 ? 'bg-[var(--bg-secondary)] border-[var(--border-color)]' :
        count === 1 ? 'bg-emerald-100 dark:bg-[#0e4429] border-emerald-200 dark:border-[#0e4429]' :
        count === 2 ? 'bg-emerald-300 dark:bg-[#006d32] border-emerald-400 dark:border-[#006d32]' :
        'bg-emerald-500 dark:bg-[#39d353] border-emerald-600 dark:border-[#39d353]';

      days.push(
        <button 
          key={d} 
          onClick={() => setSelectedDate(dateStr)}
          className={`w-full aspect-square rounded-sm border transition-all relative flex items-center justify-center ${intensityClasses} ${
            isSelected ? 'ring-2 ring-orange-500 z-10 scale-105 shadow-md' : 
            isToday ? 'ring-1 ring-slate-400 dark:ring-slate-500' : ''
          }`}
        >
          <span className={`text-[10px] font-bold ${count > 1 || isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{d}</span>
        </button>
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
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-8 pb-32 animate-in fade-in duration-500 font-sans text-[var(--text-primary)]">
      
      <SystemStatus />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded text-white"><CalendarIcon size={16} /></div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Schedule</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md transition-all"><ChevronLeft size={14}/></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md transition-all"><ChevronRight size={14}/></button>
              </div>
            </div>

            <div className="text-[15px] font-bold text-[var(--text-primary)] uppercase mb-6 px-1 flex items-center justify-between">
              {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {renderMatrix()}
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Selected Date</span>
                <span className="text-brand-primary">{selectedDate}</span>
              </div>
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="w-full py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-slate-500 rounded-md text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all active:scale-[0.98]"
              >
                Go to Today
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-6 space-y-6">
            <h4 className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest flex items-center gap-2">
              <Filter size={14}/> View Options
            </h4>
            <div className="flex flex-col gap-2">
               <button 
                 onClick={() => setManifestFilter('universal')}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded border transition-all ${manifestFilter === 'universal' ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-slate-500'}`}
               >
                  <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> All Events</span>
               </button>
               <button 
                 onClick={() => setManifestFilter('personal')}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded border transition-all ${manifestFilter === 'personal' ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-slate-500'}`}
               >
                  <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Bookmark size={14}/> My Saved Events</span>
               </button>
            </div>
          </div>

          {isAdmin && (
             <button onClick={() => setIsAdding(true)} className="w-full py-4 bg-brand-primary hover:brightness-110 text-white rounded-md flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95">
                <Plus size={18}/>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Create New Event</span>
             </button>
          )}
        </aside>

        <main className="lg:col-span-8 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#161b22]/50 gap-4">
              <div className="flex items-center gap-4">
                <Clock size={18} className="text-indigo-500" />
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-primary)]">Events for {selectedDate}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-widest">{currentUser.college} Hub</div>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-[#30363d] rounded-md text-slate-400 transition-colors"><Share2 size={16}/></button>
              </div>
            </div>

            <div className="p-0">
              {filteredEvents.length > 0 ? (
                <div className="divide-y divide-[var(--border-color)]">
                  {filteredEvents.map((event) => {
                    const isRegistered = event.attendeeIds?.includes(currentUser.id);
                    return (
                      <div key={event.id} className="flex flex-col md:flex-row group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden relative shrink-0">
                           <img 
                             src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                           />
                           <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold uppercase rounded">{event.category}</span>
                           </div>
                        </div>

                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                             <div className="space-y-1">
                                <div className="flex items-center gap-3 mb-1">
                                   <div className="flex items-center gap-1.5 text-slate-500">
                                      <Clock size={12}/>
                                      <span className="text-[11px] font-bold tracking-widest">{event.time || '00:00'}</span>
                                   </div>
                                   <div className="flex items-center gap-1.5 text-slate-500">
                                      <MapPin size={12}/>
                                      <span className="text-[11px] font-bold truncate max-w-[120px]">{event.location}</span>
                                   </div>
                                </div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-brand-primary transition-colors leading-tight">
                                  {event.title}
                                </h4>
                             </div>
                             <button 
                               onClick={(e) => handleRegister(e, event.id)}
                               className={`px-6 py-2.5 rounded-md text-[10px] font-bold uppercase transition-all border shadow-sm flex items-center gap-2 active:scale-95 ${
                                 isRegistered 
                                 ? 'bg-emerald-500 border-emerald-500 text-white' 
                                 : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-slate-500 hover:border-indigo-600 hover:text-indigo-600'
                               }`}
                             >
                               {isRegistered ? <CheckCircle2 size={14}/> : <Plus size={14}/>}
                               {isRegistered ? 'Saved' : 'Save to My List'}
                             </button>
                          </div>
                          
                          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-5 text-[10px] font-bold text-slate-400">
                                <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-300"/> {event.attendeeIds?.length || 0} Students attending</span>
                             </div>
                             <button className="p-1 text-slate-300 hover:text-brand-primary transition-colors"><LinkIcon size={14}/></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-40 text-center space-y-6">
                   <div className="w-20 h-20 bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto">
                      <CalendarIcon size={32} className="text-slate-300" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[16px] font-bold text-slate-400">No events found</p>
                      <p className="text-[11px] text-slate-500 uppercase font-bold">There are no activities scheduled for this date.</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-amber-50 border border-dashed border-amber-200 rounded-md flex items-center gap-5">
             <div className="p-3 bg-white text-amber-500 rounded-md shadow-sm">
                <Info size={24} />
             </div>
             <div className="space-y-1">
                <h5 className="text-[11px] font-bold uppercase text-amber-700">Notice</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                   Campus schedules can change. Always check the venue details before attending an event.
                </p>
             </div>
          </div>
        </main>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 rounded-md shadow-2xl space-y-8 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3">
                    <Plus size={20} className="text-brand-primary" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Create New Event</h2>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Event Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-brand-primary transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Science Fair 2026" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 text-sm font-bold text-[var(--text-primary)] outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Time</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 text-sm font-bold text-[var(--text-primary)] outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-brand-primary transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Main Hall" />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 text-sm font-bold text-[var(--text-primary)] outline-none h-24 resize-none focus:border-brand-primary transition-all" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the event..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-brand-primary hover:brightness-110 py-5 rounded-md text-white font-bold text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Save Event</button>
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