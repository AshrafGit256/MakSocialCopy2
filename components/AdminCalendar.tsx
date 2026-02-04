
import React, { useState, useMemo, useEffect, useRef } from 'react';
// Added missing icon imports: MoreVertical, Terminal, ShieldCheck, Info
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Search, Filter, Globe, Activity, History, MoreVertical, Terminal, ShieldCheck, Info } from 'lucide-react';
import { AdminCalendarEvent } from '../types';

const ADMIN_COLORS = [
  { name: 'blue', bg: '#007bff', border: '#007bff' },
  { name: 'yellow', bg: '#ffc107', border: '#ffc107' },
  { name: 'green', bg: '#28a745', border: '#28a745' },
  { name: 'red', bg: '#dc3545', border: '#dc3545' },
  { name: 'gray', bg: '#6c757d', border: '#6c757d' },
];

const INITIAL_EVENTS: AdminCalendarEvent[] = [
  { id: '1', title: 'Lunch', start: new Date(2026, 1, 4, 12, 0), allDay: false, backgroundColor: '#28a745', borderColor: '#28a745' },
  { id: '2', title: 'Meeting', start: new Date(2026, 1, 4, 10, 30), allDay: false, backgroundColor: '#007bff', borderColor: '#007bff' },
  { id: '3', title: 'Birthday Party', start: new Date(2026, 1, 5, 19, 0), allDay: false, backgroundColor: '#28a745', borderColor: '#28a745' },
  { id: '4', title: 'Long Event', start: new Date(2026, 1, 1), end: new Date(2026, 1, 3), allDay: true, backgroundColor: '#f39c12', borderColor: '#f39c12' },
  { id: '5', title: 'All Day Event', start: new Date(2026, 1, 1), allDay: true, backgroundColor: '#f56954', borderColor: '#f56954' },
  { id: '6', title: 'International Day of Peace', start: new Date(2026, 8, 21), allDay: true, backgroundColor: '#6c757d', borderColor: '#6c757d' },
  { id: '7', title: 'International Women\'s Day', start: new Date(2026, 2, 8), allDay: true, backgroundColor: '#6c757d', borderColor: '#6c757d' },
  { id: '8', title: 'World Book Day', start: new Date(2026, 3, 23), allDay: true, backgroundColor: '#17a2b8', borderColor: '#17a2b8' },
];

const EventsUpdateList: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const newsEvents = [
    { title: 'International Day of Peace', desc: 'World Braille Day is an international day on 4 January.', date: '21 sep 2024', color: 'border-slate-500' },
    { title: "International Women's Day", desc: 'Celebrated to recognize the social and political achievements of women.', date: '08 Mar 2024', color: 'border-slate-500' },
    { title: 'World Book Day', desc: 'Celebrated to promote reading, publishing, and copyright, although in the US', date: '23 apr 2024', color: 'border-cyan-500 text-cyan-500' },
    { title: 'World Refugee Day', desc: 'Honoring the courage and resilience of people forced to flee their home.', date: '20 jun 2024', color: 'border-slate-500' },
    { title: 'Pulse Fest 2026', desc: 'The biggest student synchronization event in CEDAT.', date: '15 Feb 2026', color: 'border-indigo-500 text-indigo-500' },
  ];

  return (
    <div className="bg-[#1a1c23] border border-slate-700 rounded-none shadow-xl overflow-hidden flex flex-col h-[400px]">
      <div className="px-5 py-4 border-b border-slate-700 bg-[#1e2128]">
        <h3 className="text-sm font-black uppercase text-slate-300 tracking-widest flex items-center gap-2">
           Events Update List
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {newsEvents.map((ev, i) => (
          <div key={i} className={`p-4 border-l-4 border-dashed rounded-none bg-white/[0.03] transition-all hover:bg-white/[0.05] relative ${ev.color}`}>
            <h4 className="text-[12px] font-black uppercase tracking-tight mb-1">{ev.title}</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{ev.desc}</p>
            <div className="flex items-center justify-end gap-2 text-[9px] font-bold text-slate-400 opacity-60">
              <CalendarIcon size={10}/> {ev.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminCalendar: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 4)); // Starts on Feb 4, 2026
  const [events, setEvents] = useState<AdminCalendarEvent[]>(INITIAL_EVENTS);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(ADMIN_COLORS[0]);
  const [draggedTemplate, setDraggedTemplate] = useState<string | null>(null);

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setView('day');
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const event: AdminCalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0),
      allDay: true,
      backgroundColor: selectedColor.bg,
      borderColor: selectedColor.border
    };
    setEvents([...events, event]);
    setNewEventTitle('');
  };

  // Drag & Drop logic
  const onDragStart = (title: string, color: any) => {
    setDraggedTemplate(JSON.stringify({ title, color }));
  };

  const onDrop = (date: Date) => {
    if (!draggedTemplate) return;
    const { title, color } = JSON.parse(draggedTemplate);
    const newEv: AdminCalendarEvent = {
      id: Date.now().toString(),
      title,
      start: date,
      allDay: true,
      backgroundColor: color.bg,
      borderColor: color.border
    };
    setEvents([...events, newEv]);
    setDraggedTemplate(null);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const offset = startDayOfMonth(year, month);
    const rows = [];
    let cells = [];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`offset-${i}`} className="min-h-[80px] md:min-h-[120px] bg-slate-50/30 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const isToday = new Date().toDateString() === date.toDateString();
      const dayEvents = events.filter(e => 
        e.start.getFullYear() === year && 
        e.start.getMonth() === month && 
        e.start.getDate() === d
      );

      cells.push(
        <div 
          key={d} 
          onClick={() => { setCurrentDate(date); setView('day'); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(date)}
          className={`min-h-[80px] md:min-h-[120px] p-1 border border-slate-200 dark:border-white/10 relative group hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer transition-all ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/5' : ''}`}
        >
          <span className={`text-[10px] md:text-[11px] font-black absolute top-1 right-2 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          <div className="mt-5 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 3).map(e => (
              <div 
                key={e.id} 
                style={{ backgroundColor: e.backgroundColor }} 
                className="px-1.5 py-0.5 text-[8px] md:text-[9px] font-black text-white rounded-none truncate shadow-sm border-l-2 border-black/10"
              >
                {e.title}
              </div>
            ))}
            {dayEvents.length > 3 && <div className="text-[7px] text-center font-black text-slate-400 mt-1">+{dayEvents.length - 3} MORE</div>}
          </div>
        </div>
      );

      if ((cells.length) % 7 === 0) {
        rows.push(<div key={`row-${d}`} className="grid grid-cols-7">{cells}</div>);
        cells = [];
      }
    }

    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(<div key={`end-${cells.length}`} className="min-h-[80px] md:min-h-[120px] bg-slate-50/30 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5"></div>);
      }
      rows.push(<div key={`row-last`} className="grid grid-cols-7">{cells}</div>);
    }

    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 rounded-none overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          {weekDays.map(wd => (
            <div key={wd} className="py-3 text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-r border-slate-200 dark:border-white/10 last:border-r-0">
              {wd}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
  };

  const renderTimeGrid = (isWeek: boolean) => {
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    const weekDays = [];
    if (isWeek) {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        weekDays.push(d);
      }
    } else {
      weekDays.push(currentDate);
    }
    
    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 overflow-x-auto no-scrollbar rounded-none animate-in slide-in-from-right-4 duration-300">
        <div className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-[64px_1fr]'} border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 sticky top-0 z-20`}>
          <div className="w-16 py-3 border-r border-slate-200 dark:border-white/10 shrink-0"></div>
          {weekDays.map((wd, i) => (
            <div key={i} className="py-3 text-center flex-1 border-r border-slate-200 dark:border-white/10 last:border-r-0">
               <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">{wd.toLocaleString('default', { weekday: 'short' })}</span>
               <span className={`block text-sm font-black ${wd.toDateString() === new Date().toDateString() ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-300'}`}>{wd.getDate()}</span>
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map(h => (
            <div key={h} className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-[64px_1fr]'} border-b border-slate-200 dark:border-white/5 group`}>
              <div className="w-16 h-14 md:h-20 px-2 flex items-start justify-end text-[9px] text-slate-400 font-black uppercase tracking-tighter border-r border-slate-200 dark:border-white/5 pt-2">
                {h % 12 || 12}{h >= 12 ? 'pm' : 'am'}
              </div>
              {weekDays.map((wd, i) => {
                const dayEvents = events.filter(e => 
                  e.start.getFullYear() === wd.getFullYear() && 
                  e.start.getMonth() === wd.getMonth() && 
                  e.start.getDate() === wd.getDate() &&
                  e.start.getHours() === h
                );
                return (
                  <div 
                    key={i} 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                       const dropDate = new Date(wd);
                       dropDate.setHours(h);
                       onDrop(dropDate);
                    }}
                    className="flex-1 h-14 md:h-20 border-r border-slate-200 dark:border-white/5 last:border-r-0 relative hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        style={{ backgroundColor: e.backgroundColor }} 
                        className="absolute inset-x-0.5 top-0.5 bottom-0.5 p-1.5 md:p-3 z-10 border-l-4 border-black/10 shadow-lg shadow-black/5 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-95 transition-all"
                      >
                         <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[7px] md:text-[8px] font-black text-white/70 uppercase truncate">{e.start.getHours() % 12 || 12}:00</span>
                            <MoreVertical size={10} className="text-white/40"/>
                         </div>
                         <h4 className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2">{e.title}</h4>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 font-sans bg-[#f4f6f9] dark:bg-[#0d0d0d] min-h-full font-mono text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-indigo-600 rounded-none shadow-lg text-white">
              <CalendarIcon size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter leading-none">Registry.Calendar</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                 <Activity size={10} className="text-emerald-500 animate-pulse"/> Temporal Synchronizer / V4.2
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
           <span className="hover:underline cursor-pointer">Terminal</span> / <span className="text-slate-400">Calendar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Draggable Events Box */}
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] rounded-none shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Draggable Signals</h3>
              <Globe size={14} className="text-slate-400"/>
            </div>
            <div className="p-5 space-y-2">
              {[
                { title: 'Lunch_Handshake', color: ADMIN_COLORS[2] },
                { title: 'Terminal_Return', color: ADMIN_COLORS[1] },
                { title: 'Research_Log', color: ADMIN_COLORS[0] },
                { title: 'System_Maintenance', color: ADMIN_COLORS[3] },
                { title: 'Registry_Sync', color: ADMIN_COLORS[4] },
              ].map((ev, i) => (
                <div 
                  key={i}
                  draggable="true"
                  onDragStart={() => onDragStart(ev.title, ev.color)}
                  style={{ backgroundColor: ev.color.bg }}
                  className="text-white text-[10px] font-black uppercase p-2.5 rounded-none shadow-sm cursor-grab active:cursor-grabbing hover:brightness-110 active:scale-95 transition-all border-l-4 border-black/10 flex items-center justify-between"
                >
                  {ev.title}
                  <Plus size={12} className="opacity-40"/>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#2a2a2a] mt-2">
                <input type="checkbox" id="remove-drop" className="w-4 h-4 rounded-none bg-transparent border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0" />
                <label htmlFor="remove-drop" className="text-[9px] text-slate-500 font-black uppercase tracking-widest cursor-pointer">purge after commit</label>
              </div>
            </div>
          </div>

          {/* Create Event Box */}
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] rounded-none shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Manual Commit</h3>
              <Terminal size={14} className="text-slate-400"/>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex gap-2.5">
                {ADMIN_COLORS.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.bg }} 
                    className={`w-5 h-5 rounded-none transition-all ${selectedColor.name === c.name ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#161616]' : 'opacity-60'}`}
                  />
                ))}
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="IDENITFY_SIGNAL" 
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-[#2a2a2a] rounded-none p-3 text-[10px] font-black uppercase outline-none focus:border-indigo-600 transition-all" 
                />
                <button 
                  onClick={handleAddEvent}
                  className="w-full py-3 bg-indigo-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Plus size={14}/> COMMIT_SIGNAL
                </button>
              </div>
            </div>
          </div>

          <EventsUpdateList />
        </aside>

        {/* MAIN CALENDAR AREA */}
        <main className="lg:col-span-9 bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] rounded-none shadow-2xl p-4 md:p-8 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-1.5 order-2 sm:order-1">
              <button onClick={handlePrev} className="p-3 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"><ChevronLeft size={18}/></button>
              <button onClick={handleNext} className="p-3 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 transition-colors shadow-lg active:scale-95 border-l border-indigo-700"><ChevronRight size={18}/></button>
              <button onClick={handleToday} className="ml-3 px-6 py-3 bg-cyan-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/10 active:scale-95">jump_today</button>
            </div>

            <div className="text-center order-1 sm:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase leading-none drop-shadow-sm">{monthYearLabel}</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2 hidden sm:block">Temporal Registry Map</p>
            </div>

            <div className="flex items-center order-3">
              {[
                { id: 'month', label: 'Month' },
                { id: 'week', label: 'Week' },
                { id: 'day', label: 'Day' }
              ].map((v, i) => (
                <button 
                  key={v.id}
                  onClick={() => setView(v.id as any)} 
                  className={`px-5 py-3 border border-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === v.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                  } ${i === 0 ? 'rounded-none' : i === 2 ? 'rounded-none border-l-0' : 'border-l-0'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-[600px]">
            {view === 'month' ? renderMonth() : renderTimeGrid(view === 'week')}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-[#2a2a2a] flex flex-wrap gap-10">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Sync: {events.length} NODES</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-600"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Priority Protocols</span>
             </div>
             <div className="ml-auto flex items-center gap-3 text-slate-300 dark:text-slate-700">
                <ShieldCheck size={20}/>
                <span className="text-[10px] font-black uppercase tracking-widest">Authorized registry terminal</span>
             </div>
          </div>
        </main>
      </div>
      
      {/* MOBILE DRILL-DOWN ADVISORY */}
      <div className="lg:hidden mt-8 p-6 bg-indigo-600 text-white rounded-none shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-2">
         <Info size={24} className="shrink-0"/>
         <div>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1">Navigation Tip</p>
            <p className="text-[10px] font-medium leading-relaxed">Tap any day coordinate in the registry matrix to view high-density temporal logs for that node.</p>
         </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
