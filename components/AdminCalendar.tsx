
import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Clock, Globe, Activity, MoreVertical, Terminal, 
  ShieldCheck, Info, X, MapPin 
} from 'lucide-react';
import { AdminCalendarEvent } from '../types';

const ADMIN_COLORS = [
  { name: 'blue', bg: '#007bff', border: '#007bff' },
  { name: 'yellow', bg: '#ffc107', border: '#ffc107' },
  { name: 'green', bg: '#28a745', border: '#28a745' },
  { name: 'red', bg: '#dc3545', border: '#dc3545' },
  { name: 'gray', bg: '#6c757d', border: '#6c757d' },
];

const INITIAL_EVENTS: AdminCalendarEvent[] = [
  { id: '1', title: 'Lunch_Protocol', start: new Date(2026, 1, 4, 12, 0), allDay: false, backgroundColor: '#28a745', borderColor: '#28a745' },
  { id: '2', title: 'Board_Meeting', start: new Date(2026, 1, 4, 10, 30), allDay: false, backgroundColor: '#007bff', borderColor: '#007bff' },
  { id: '3', title: 'Campus_Gala', start: new Date(2026, 1, 5, 19, 0), allDay: false, backgroundColor: '#28a745', borderColor: '#28a745' },
  { id: '4', title: 'Research_Week', start: new Date(2026, 1, 1), end: new Date(2026, 1, 3), allDay: true, backgroundColor: '#f39c12', borderColor: '#f39c12' },
  { id: '5', title: 'System_Audit', start: new Date(2026, 1, 1), allDay: true, backgroundColor: '#f56954', borderColor: '#f56954' },
  { id: '6', title: 'Peace_Day', start: new Date(2026, 8, 21), allDay: true, backgroundColor: '#6c757d', borderColor: '#6c757d' },
  { id: '7', title: 'Women_Day', start: new Date(2026, 2, 8), allDay: true, backgroundColor: '#6c757d', borderColor: '#6c757d' },
  { id: '8', title: 'Book_Day', start: new Date(2026, 3, 23), allDay: true, backgroundColor: '#17a2b8', borderColor: '#17a2b8' },
];

const AdminCalendar: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 4));
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
    const today = new Date();
    setCurrentDate(today);
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

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`offset-${i}`} className="min-h-[70px] md:min-h-[120px] bg-slate-50/20 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 opacity-30"></div>);
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
          className={`min-h-[70px] md:min-h-[120px] p-1 border border-slate-200 dark:border-white/10 relative group hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer transition-all ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/5' : ''}`}
        >
          <span className={`text-[11px] md:text-[12px] font-black absolute top-1 left-2 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{d}</span>
          
          {/* Month Cell Content: Dots on mobile, full labels on desktop */}
          <div className="mt-6 flex flex-col gap-0.5 overflow-hidden">
            {/* Mobile View: High Contrast Dots */}
            <div className="flex flex-wrap gap-1 md:hidden px-1 justify-center">
              {dayEvents.map(e => (
                <div key={e.id} style={{ backgroundColor: e.backgroundColor }} className="w-2.5 h-2.5 rounded-full shadow-sm" />
              ))}
            </div>
            
            {/* Desktop View: Readable Labels */}
            <div className="hidden md:block space-y-0.5">
              {dayEvents.slice(0, 3).map(e => (
                <div 
                  key={e.id} 
                  style={{ backgroundColor: e.backgroundColor }} 
                  className="px-2 py-0.5 text-[9px] font-black text-white rounded-none truncate shadow-sm border-l-2 border-black/10 uppercase"
                >
                  {e.title}
                </div>
              ))}
              {dayEvents.length > 3 && <div className="text-[8px] text-center font-black text-slate-400">+{dayEvents.length - 3} MORE</div>}
            </div>
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
        cells.push(<div key={`end-${cells.length}`} className="min-h-[70px] md:min-h-[120px] bg-slate-50/20 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 opacity-30"></div>);
      }
      rows.push(<div key={`row-last`} className="grid grid-cols-7">{cells}</div>);
    }

    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] rounded-none overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          {weekDays.map(wd => (
            <div key={wd} className="py-4 text-center text-[10px] md:text-[12px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 dark:border-white/10 last:border-r-0">
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
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-x-auto no-scrollbar rounded-none animate-in slide-in-from-right-4 duration-300">
        <div className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-[80px_1fr]'} border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 sticky top-0 z-20`}>
          <div className="w-20 py-4 border-r border-slate-200 dark:border-white/10 shrink-0"></div>
          {weekDays.map((wd, i) => (
            <div key={i} className="py-4 text-center flex-1 border-r border-slate-200 dark:border-white/10 last:border-r-0 px-2">
               <span className="block text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{wd.toLocaleString('default', { weekday: 'short' })}</span>
               <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-black ${wd.toDateString() === new Date().toDateString() ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-700 dark:text-slate-200'}`}>{wd.getDate()}</span>
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map(h => (
            <div key={h} className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-[80px_1fr]'} border-b border-slate-200 dark:border-white/5 group`}>
              <div className="w-20 h-16 md:h-24 px-3 flex items-start justify-end text-[10px] md:text-[12px] text-slate-500 font-black uppercase tracking-tighter border-r border-slate-200 dark:border-white/5 pt-3">
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
                    className="flex-1 h-16 md:h-24 border-r border-slate-200 dark:border-white/5 last:border-r-0 relative hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {dayEvents.map(e => (
                      <div 
                        key={e.id} 
                        style={{ backgroundColor: e.backgroundColor }} 
                        className="absolute inset-x-1 top-1 bottom-1 p-2 md:p-4 z-10 border-l-4 border-black/20 shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer active:scale-95 transition-all group/ev"
                      >
                         <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[8px] md:text-[10px] font-black text-white/80 uppercase truncate">{e.start.getHours() % 12 || 12}:00 - {e.allDay ? 'FULL' : 'SYNC'}</span>
                            <Plus size={10} className="text-white/40 group-hover/ev:text-white transition-colors" />
                         </div>
                         <h4 className="text-[11px] md:text-[14px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 md:line-clamp-none">{e.title}</h4>
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
    <div className="p-4 md:p-10 font-sans bg-[#f8fafc] dark:bg-[#080808] min-h-full font-mono text-[var(--text-primary)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-indigo-600 rounded-none shadow-2xl text-white">
              <CalendarIcon size={32} />
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-none">Registry.Calendar</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                 <Activity size={12} className="text-emerald-500 animate-pulse"/> Temporal Synchronizer Protocol
              </p>
           </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-indigo-600">
           <span className="hover:underline cursor-pointer opacity-60">Terminal</span> 
           <ChevronRight size={14} className="opacity-40" /> 
           <span>Calendar_Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          
          {/* Manual Commit Box */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Manual Commit</h3>
              <Terminal size={16} className="text-slate-400"/>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between">
                {ADMIN_COLORS.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.bg }} 
                    className={`w-7 h-7 rounded-none transition-all ${selectedColor.name === c.name ? 'scale-125 ring-2 ring-indigo-500 ring-offset-4 ring-offset-white dark:ring-offset-[#121212] z-10' : 'opacity-40 grayscale-[50%]'}`}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="IDENITFY_SIGNAL..." 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-[#222] rounded-none p-4 text-[12px] font-black uppercase outline-none focus:border-indigo-600 transition-all placeholder:opacity-30" 
                />
                <button 
                  onClick={handleAddEvent}
                  className="w-full py-4 bg-indigo-600 text-white rounded-none text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                >
                  <Plus size={18}/> Commit Signal
                </button>
              </div>
            </div>
          </div>

          {/* Draggable Events Box */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-sm overflow-hidden hidden md:block">
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Signal Templates</h3>
              <Globe size={16} className="text-slate-400"/>
            </div>
            <div className="p-6 space-y-3">
              {[
                { title: 'Handshake_Link', color: ADMIN_COLORS[2] },
                { title: 'Terminal_Return', color: ADMIN_COLORS[1] },
                { title: 'Research_Audit', color: ADMIN_COLORS[0] },
                { title: 'Registry_Sync', color: ADMIN_COLORS[4] },
              ].map((ev, i) => (
                <div 
                  key={i}
                  draggable="true"
                  onDragStart={() => onDragStart(ev.title, ev.color)}
                  style={{ backgroundColor: ev.color.bg }}
                  className="text-white text-[10px] font-black uppercase p-3 rounded-none shadow-md cursor-grab active:cursor-grabbing hover:brightness-110 active:scale-[0.98] transition-all border-l-8 border-black/10 flex items-center justify-between"
                >
                  {ev.title}
                  <Plus size={14} className="opacity-40"/>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-[#222] mt-4">
                <input type="checkbox" id="remove-drop" className="w-5 h-5 rounded-none bg-transparent border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0" />
                <label htmlFor="remove-drop" className="text-[10px] text-slate-500 font-black uppercase tracking-widest cursor-pointer">Purge After Drop</label>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CALENDAR AREA */}
        <main className="lg:col-span-9 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-2xl p-4 md:p-10 flex flex-col min-w-0 order-1 lg:order-2">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-12">
            <div className="flex items-center gap-1 order-2 sm:order-1">
              <button onClick={handlePrev} className="p-4 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"><ChevronLeft size={24}/></button>
              <button onClick={handleNext} className="p-4 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 transition-colors shadow-lg active:scale-95 border-l border-indigo-700"><ChevronRight size={24}/></button>
              <button onClick={handleToday} className="ml-4 px-8 py-4 bg-[#17a2b8] text-white rounded-none text-[12px] font-black uppercase tracking-widest hover:bg-[#138496] transition-all shadow-lg active:scale-95">Jump_Today</button>
            </div>

            <div className="text-center order-1 sm:order-2">
              <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase leading-none">{monthYearLabel}</h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                 <div className="h-px w-8 bg-indigo-500 opacity-30"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Temporal Matrix</p>
                 <div className="h-px w-8 bg-indigo-500 opacity-30"></div>
              </div>
            </div>

            <div className="flex items-center order-3 w-full sm:w-auto">
              {[
                { id: 'month', label: 'Month' },
                { id: 'week', label: 'Week' },
                { id: 'day', label: 'Day' }
              ].map((v, i) => (
                <button 
                  key={v.id}
                  onClick={() => setView(v.id as any)} 
                  className={`flex-1 sm:flex-none px-6 py-4 border border-indigo-600 text-[11px] font-black uppercase tracking-widest transition-all ${
                    view === v.id ? 'bg-indigo-600 text-white shadow-xl scale-105 z-10' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                  } ${i === 0 ? '' : 'border-l-0'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Display Area */}
          <div className="flex-1 overflow-hidden min-h-[500px]">
            {view === 'month' ? renderMonth() : renderTimeGrid(view === 'week')}
          </div>
          
          {/* Mobile Drill-Down Hint */}
          <div className="lg:hidden mt-8 p-6 bg-slate-900 text-white border border-slate-700 flex items-start gap-4">
             <Info size={24} className="text-indigo-500 shrink-0 mt-1"/>
             <div>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Navigation Protocol</p>
                <p className="text-[11px] font-medium leading-relaxed opacity-80">Tap any day coordinate above to drill down into a dedicated high-density temporal view for that node.</p>
             </div>
          </div>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-[#222] flex flex-wrap gap-12 items-center">
             <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse"></div>
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Active Sync: {events.length} Signal Nodes</span>
             </div>
             <div className="hidden sm:flex items-center gap-4">
                <div className="w-4 h-4 bg-indigo-600"></div>
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Priority Protocols</span>
             </div>
             <div className="ml-auto flex items-center gap-4 text-slate-300 dark:text-slate-800">
                <ShieldCheck size={28} className="opacity-40" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Registry Authorized Access</span>
             </div>
          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminCalendar;
