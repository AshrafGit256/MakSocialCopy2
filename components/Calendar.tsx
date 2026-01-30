
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../db';
import { CalendarEvent, User } from '../types';
import { 
  Plus, ChevronLeft, ChevronRight, Zap, X, 
  CheckCircle2, Activity, Radio, Clock,
  FilterX, Terminal, Hash, Target,
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
    <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] mb-8 font-mono text-[10px] shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-500 font-bold uppercase">System.Live</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-[var(--border-color)]"></div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500">
          <Server size={12} />
          <span>REGISTRY_CORE_v4.2</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={12} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-500">
          <Hash size={12} />
          <span>UPLINK: ACTIVE</span>
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

      // Theme-responsive intensity mapping
      const intensityClasses = 
        count === 0 ? 'bg-[var(--bg-secondary)] border-[var(--border-color)]' :
        count === 1 ? 'bg-emerald-100 dark:bg-[#0e4429] border-emerald-200 dark:border-[#0e4429]' :
        count === 2 ? 'bg-emerald-300 dark:bg-[#006d32] border-emerald-400 dark:border-[#006d32]' :
        'bg-emerald-500 dark:bg-[#39d353] border-emerald-600 dark:border-[#39d353]';

      days.push(
        <button 
          key={d} 
          onClick={() => setSelectedDate(dateStr)}
          className={`w-full aspect-square rounded-[2px] border transition-all relative flex items-center justify-center ${intensityClasses} ${
            isSelected ? 'ring-2 ring-orange-500 z-10 scale-105 shadow-md' : 
            isToday ? 'ring-1 ring-slate-400 dark:ring-slate-500' : ''
          }`}
          title={`${count} Protocols on ${dateStr}`}
        >
          <span className={`text-[8px] font-mono font-black ${count > 1 || isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{d}</span>
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
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-8 pb-32 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      <SystemStatus />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: MATRIX & NAVIGATION */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded text-white"><CalendarIcon size={16} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registry.Roadmap</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md transition-all"><ChevronLeft size={14}/></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md transition-all"><ChevronRight size={14}/></button>
              </div>
            </div>

            <div className="text-[14px] font-black text-[var(--text-primary)] uppercase mb-6 px-1 flex items-center justify-between">
              {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              <span className="text-[8px] font-bold text-slate-400">V4.2.0</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {renderMatrix()}
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Coordinate_Target</span>
                <span className="text-orange-500">{selectedDate}</span>
              </div>
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="w-full py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-slate-500 rounded-[var(--radius-main)] text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all active:scale-[0.98]"
              >
                Jump to Sys.Today
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-6 space-y-6">
            <h4 className="text-[9px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2">
              <FilterX size={14}/> Manifest_Filter
            </h4>
            <div className="flex flex-col gap-2">
               <button 
                 onClick={() => setManifestFilter('universal')}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded border transition-all ${manifestFilter === 'universal' ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-slate-500'}`}
               >
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> Universal Pulse</span>
                  <span className="text-[8px] opacity-70 font-mono">ALL_NODES</span>
               </button>
               <button 
                 onClick={() => setManifestFilter('personal')}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded border transition-all ${manifestFilter === 'personal' ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-slate-500'}`}
               >
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Bookmark size={14}/> My Manifest</span>
                  <span className="text-[8px] opacity-70 font-mono">SAVED_{events.filter(e => e.attendeeIds?.includes(currentUser.id)).length}</span>
               </button>
            </div>
          </div>

          {isAdmin && (
             <button onClick={() => setIsAdding(true)} className="w-full py-4 bg-[#238636] hover:bg-[#2ea043] text-white rounded-[var(--radius-main)] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/10 active:scale-95">
                <Plus size={18}/>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Log Protocol</span>
             </button>
          )}
        </aside>

        {/* RIGHT: PROTOCOL STREAM */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#161b22]/50 gap-4">
              <div className="flex items-center gap-4">
                <Terminal size={18} className="text-indigo-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]">Stream / Seq_{selectedDate}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest">WING: {currentUser.college} HUB</div>
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
                        {/* Flyer Column */}
                        <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden relative shrink-0">
                           <img 
                             src={event.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800'} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <button onClick={(e) => { e.stopPropagation(); }} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><Eye size={16}/></button>
                           </div>
                           <div className="absolute top-2 left-2 flex gap-1">
                              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[7px] font-black uppercase rounded tracking-widest">{event.category}</span>
                           </div>
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                             <div className="space-y-1">
                                <div className="flex items-center gap-3 mb-1">
                                   <div className="flex items-center gap-1.5 text-slate-500">
                                      <Clock size={12}/>
                                      <span className="text-[10px] font-black uppercase tracking-widest">{event.time || '00:00'}</span>
                                   </div>
                                   <div className="flex items-center gap-1.5 text-slate-500">
                                      <MapPin size={12}/>
                                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{event.location}</span>
                                   </div>
                                </div>
                                <h4 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                                  {event.title}
                                </h4>
                             </div>
                             <button 
                               onClick={(e) => handleRegister(e, event.id)}
                               className={`px-6 py-2.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm flex items-center gap-2 active:scale-95 ${
                                 isRegistered 
                                 ? 'bg-emerald-500 border-emerald-500 text-white' 
                                 : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-slate-500 hover:border-indigo-600 hover:text-indigo-600'
                               }`}
                             >
                               {isRegistered ? <CheckCircle2 size={14}/> : <Plus size={14}/>}
                               {isRegistered ? 'LOGGED' : 'SAVE_SYNC'}
                             </button>
                          </div>
                          
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium opacity-90 line-clamp-2">
                            "{event.description}"
                          </p>

                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-300"/> {event.attendeeIds?.length || 0} Nodes Synced</span>
                                <span className="hidden sm:flex items-center gap-1.5 text-indigo-500/50"><Target size={14}/> Priority_Strata</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[8px] font-mono text-slate-300">ID_{event.id.slice(-4)}</span>
                               <button className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"><LinkIcon size={14}/></button>
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-40 text-center space-y-6">
                   <div className="w-20 h-20 bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto">
                      <FilterX size={32} className="text-slate-300" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol.Silence</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">No active logs for coordinate {selectedDate}</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* SYSTEM ADVISORY */}
          <div className="p-6 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-[var(--radius-main)] flex items-center gap-5">
             <div className="p-3 bg-white dark:bg-slate-900 text-amber-500 rounded-md shadow-sm">
                <AlertTriangle size={24} />
             </div>
             <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Administrative Advisory</h5>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                   University operational schedules are subject to strata shifts. Verify coordinates with central hub before physical deployment.
                </p>
             </div>
          </div>
        </main>
      </div>

      {/* MODAL (THEME RESPONSIVE) */}
      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 rounded-[4px] shadow-2xl space-y-8 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3">
                    <Zap size={20} className="text-indigo-600" />
                    <h2 className="text-xl font-black uppercase tracking-tighter">Log.Signal</h2>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol_Title</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. COCIS Alpha Node Assembly" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Coordinate_Date</label>
                       <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold text-[var(--text-primary)] outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Time_Log</label>
                       <input type="time" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold text-[var(--text-primary)] outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Location_Hub</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Main Wing Hall" />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual_Manifest (Flyer)</label>
                    <div className="flex gap-4">
                       <button onClick={() => fileRef.current?.click()} className="flex-1 py-4 border-2 border-dashed border-[var(--border-color)] rounded-[2px] hover:border-indigo-600 transition-all flex flex-col items-center justify-center gap-2 group">
                          {form.image ? <img src={form.image} className="h-16 object-contain" /> : <><ImageIcon size={20} className="text-slate-300 group-hover:text-indigo-600" /><span className="text-[8px] font-black uppercase text-slate-400">Pick Asset</span></>}
                       </button>
                       {form.image && <button onClick={() => setForm({...form, image: ''})} className="p-4 bg-rose-500/10 text-rose-500 rounded"><X size={16}/></button>}
                    </div>
                    <input type="file" ref={fileRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission_Metadata</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] p-4 text-xs font-bold text-[var(--text-primary)] outline-none h-24 resize-none focus:border-indigo-600 transition-all" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe signal parameters..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-[var(--radius-main)] text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Commit Signal to Pulse</button>
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
