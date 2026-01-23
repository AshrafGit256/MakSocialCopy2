
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { CalendarEvent, User } from '../types';
import { 
  Plus, ChevronLeft, ChevronRight, Zap, X, 
  CheckCircle2, Activity, Radio, Clock,
  FilterX, Terminal, Hash, Target,
  Cpu, Share2, Box, GitCommit, Link as LinkIcon,
  Server, Shield, AlertTriangle, MapPin, Users
} from 'lucide-react';

const SystemStatus: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB')), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-8 font-mono text-[10px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-500 font-bold uppercase">System.Live</span>
        </div>
        <div className="h-4 w-px bg-[#30363d]"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <Server size={12} />
          <span>MAKSOCIAL_CORE_v4.2</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock size={12} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-400">
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
  const [currentUser] = useState<User>(db.getUser());

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', date: '', time: '', location: '', category: 'Social', image: ''
  });

  useEffect(() => {
    const sync = () => setEvents(db.getCalendarEvents());
    sync();
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, []);

  const dailyEvents = useMemo(() => {
    return events
      .filter(e => e.date === selectedDate)
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  }, [events, selectedDate]);

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setEvents(db.getCalendarEvents());
  };

  const renderMatrix = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-7 h-7 rounded-sm bg-transparent border border-transparent"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const count = events.filter(e => e.date === dateStr).length;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      const bgClass = 
        count === 0 ? 'bg-[#161b22] border-[#30363d]' :
        count === 1 ? 'bg-[#0e4429] border-[#0e4429]' :
        count === 2 ? 'bg-[#006d32] border-[#006d32]' :
        'bg-[#39d353] border-[#39d353]';

      days.push(
        <button 
          key={d} 
          onClick={() => setSelectedDate(dateStr)}
          className={`w-7 h-7 rounded-sm border transition-all relative flex items-center justify-center ${bgClass} ${
            isSelected ? 'ring-2 ring-orange-500 z-10 scale-110' : 
            isToday ? 'ring-1 ring-slate-400' : ''
          }`}
          title={`${count} Protocols on ${dateStr}`}
        >
          <span className={`text-[8px] font-mono font-bold ${count > 1 || isSelected ? 'text-white' : 'text-slate-500'}`}>{d}</span>
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
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 pb-32 animate-in fade-in duration-500 font-mono">
      
      <SystemStatus />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: MATRIX & NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Roadmap.Matrix</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-[#161b22] border border-[#30363d] rounded-sm"><ChevronLeft size={12}/></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-[#161b22] border border-[#30363d] rounded-sm"><ChevronRight size={12}/></button>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-300 uppercase mb-4 px-1 italic">
              {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[7px] font-bold text-slate-500 uppercase">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderMatrix()}
            </div>

            <div className="mt-8 pt-6 border-t border-[#30363d] space-y-4">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 uppercase font-bold">Selected Coordinate</span>
                <span className="text-orange-500 font-bold">{selectedDate}</span>
              </div>
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="w-full py-2 bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] rounded-md text-[9px] font-bold uppercase text-slate-300 transition-all"
              >
                Jump to Sys.Today
              </button>
            </div>
          </div>

          <div className="p-5 bg-[#0d1117] border border-[#30363d] rounded-md space-y-4">
            <h4 className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest flex items-center gap-2">
              <Shield size={12}/> Protocol Legend
            </h4>
            <div className="space-y-2">
              {[
                { l: 'Null Signal', c: 'bg-[#161b22]' },
                { l: 'Stable Patch', c: 'bg-[#0e4429]' },
                { l: 'Critical Load', c: 'bg-[#39d353]' }
              ].map(item => (
                <div key={item.l} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-sm border border-black/20 ${item.c}`}></div>
                  <span className="text-[8px] font-bold uppercase text-slate-500">{item.l}</span>
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
             <button onClick={() => setIsAdding(true)} className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-sm">
                <Plus size={14}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Init Protocol</span>
             </button>
          )}
        </aside>

        {/* RIGHT: PROTOCOL STREAM */}
        <main className="lg:col-span-9 space-y-6">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md">
            <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]/50">
              <div className="flex items-center gap-4">
                <Terminal size={16} className="text-indigo-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">Operational.Log / Sequence_{selectedDate}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-[#30363d] rounded-md text-slate-500"><Share2 size={14}/></button>
                <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-sm text-indigo-400 text-[8px] font-bold">BRANCH: {currentUser.college}</div>
              </div>
            </div>

            <div className="p-0">
              {dailyEvents.length > 0 ? (
                <div className="divide-y divide-[#30363d]">
                  {dailyEvents.map((event) => {
                    const isRegistered = event.attendeeIds?.includes(currentUser.id);
                    return (
                      <div key={event.id} className="flex group hover:bg-[#161b22]/30 transition-all">
                        {/* Time Column */}
                        <div className="w-24 px-4 py-6 border-r border-[#30363d] flex flex-col items-center justify-start shrink-0">
                           <span className="text-[10px] font-bold text-slate-300">{event.time || '00:00'}</span>
                           <div className="mt-2 w-px flex-1 bg-[#30363d]"></div>
                           <GitCommit size={14} className={`mt-2 ${isRegistered ? 'text-emerald-500' : 'text-slate-600'}`} />
                        </div>
                        
                        {/* Content Column */}
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                   <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm border ${
                                      event.category === 'Academic' ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/5' :
                                      event.category === 'Social' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5' :
                                      'border-slate-500/50 text-slate-400 bg-slate-500/5'
                                   }`}>
                                      {event.category === 'Academic' ? '[STABLE]' : '[PATCH]'}
                                   </span>
                                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                      <MapPin size={10}/> {event.location}
                                   </span>
                                </div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                                  {event.title}
                                </h4>
                             </div>
                             <div className="flex gap-2">
                               <button 
                                 onClick={() => !isRegistered && handleRegister(event.id)}
                                 disabled={isRegistered}
                                 className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all border ${
                                   isRegistered ? 'bg-transparent border-emerald-500/50 text-emerald-500 cursor-default' : 'bg-[#21262d] border-[#30363d] text-slate-300 hover:border-[#8b949e]'
                                 }`}
                               >
                                 {isRegistered ? 'Verified_Sync' : 'Initialize_Uplink'}
                               </button>
                             </div>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium font-sans italic opacity-80">
                            "{event.description}"
                          </p>

                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase">
                                <span className="flex items-center gap-1.5"><Users size={12}/> {event.attendeeIds?.length || 0} Nodes</span>
                                <span className="flex items-center gap-1.5"><AlertTriangle size={12}/> Low Entropy</span>
                             </div>
                             <button className="flex items-center gap-1 text-[9px] text-indigo-400 hover:underline">
                               <LinkIcon size={12}/> View_Source
                             </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-40 text-center space-y-4">
                   <FilterX size={32} className="mx-auto text-slate-700" />
                   <div className="space-y-1">
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Protocol.Silence</p>
                      <p className="text-[9px] text-slate-600 uppercase font-mono">No active logs for coordinate {selectedDate}</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* SYSTEM ADVISORY */}
          <div className="p-4 bg-[#161b22] border border-dashed border-[#30363d] rounded-md flex items-center gap-4">
             <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                <AlertTriangle size={16} />
             </div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                Warning: Operational schedules are subject to university protocol shifts. 
                Always verify coordinates with the central hub before deployment.
             </p>
          </div>
        </main>
      </div>

      {/* MODAL (REDUCED RADIUS) */}
      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#0d1117] w-full max-w-lg p-8 rounded-md shadow-2xl space-y-6 border border-[#30363d] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
                 <h2 className="text-lg font-bold text-white uppercase tracking-tighter italic">Initialize.Protocol</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Event_Title</label>
                    <input className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. COCIS Alpha Node Assembly" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Coordinate_Date</label>
                       <input type="date" className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs font-bold text-white outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Time_Log</label>
                       <input type="time" className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs font-bold text-white outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location_Hub</label>
                    <input className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Main Wing Hall" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mission_Metadata</label>
                    <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs font-bold text-white outline-none h-20 resize-none focus:border-indigo-500 transition-all" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Enter event parameters..." />
                 </div>
                 <button onClick={handleAddEvent} className="w-full bg-[#238636] py-4 rounded-md text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-md active:scale-95 transition-all">Commit Protocol Log</button>
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
