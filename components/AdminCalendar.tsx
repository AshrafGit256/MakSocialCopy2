
import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Clock, Globe, Activity, MoreVertical, Terminal, 
  ShieldCheck, Info, X, MapPin, Target, Command
} from 'lucide-react';
import { AdminCalendarEvent } from '../types';

const ADMIN_COLORS = [
  { name: 'brand', bg: 'var(--brand-color)', border: 'var(--brand-color)' },
  { name: 'yellow', bg: '#ffc107', border: '#ffc107' },
  { name: 'green', bg: '#28a745', border: '#28a745' },
  { name: 'red', bg: '#dc3545', border: '#dc3545' },
  { name: 'gray', bg: '#6c757d', border: '#6c757d' },
];

const INITIAL_EVENTS: AdminCalendarEvent[] = [
  { id: '1', title: 'Lunch_Protocol', start: new Date(2026, 1, 4, 12, 0), allDay: false, backgroundColor: '#28a745', borderColor: '#28a745' },
  { id: '2', title: 'Board_Meeting', start: new Date(2026, 1, 4, 10, 30), allDay: false, backgroundColor: 'var(--brand-color)', borderColor: 'var(--brand-color)' },
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
      cells.push(<div key={`offset-${i}`} className="min-h-[60px] md:min-h-[120px] bg-slate-50/20 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 opacity-30"></div>);
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
          className={`min-h-[60px] md:min-h-[120px] p-1 border border-slate-200 dark:border-white/10 relative group hover:bg-[var(--brand-color)]/5 cursor-pointer transition-all ${isToday ? 'bg-[var(--brand-color)]/5' : ''}`}
        >
          <span className={`text-[10px] md:text-[12px] font-black absolute top-1 left-2 ${isToday ? 'text-[var(--brand-color)]' : 'text-slate-400'}`}>{d}</span>
          
          <div className="mt-6 flex flex-col gap-0.5 overflow-hidden">
            {/* Mobile View Indicators: Dots for clean matrix */}
            <div className="flex flex-wrap gap-0.5 md:hidden px-0.5 justify-center">
              {dayEvents.map(e => (
                <div key={e.id} style={{ backgroundColor: e.backgroundColor }} className="w-1.5 h-1.5 rounded-full shadow-sm" />
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
        cells.push(<div key={`end-${cells.length}`} className="min-h-[60px] md:min-h-[120px] bg-slate-50/20 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 opacity-30"></div>);
      }
      rows.push(<div key={`row-last`} className="grid grid-cols-7">{cells}</div>);
    }

    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] rounded-none overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          {weekDays.map(wd => (
            <div key={wd} className="py-3 md:py-4 text-center text-[9px] md:text-[12px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 dark:border-white/10 last:border-r-0">
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
               <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-black ${wd.toDateString() === new Date().toDateString() ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-700 dark:text-slate-200'}`}>{wd.getDate()}</span>
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
                        className="absolute inset-x-1 top-1 bottom-1 p-2 md:p-4 z-10 border-l-4 border-black/20 shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98] transition-all group/ev"
                      >
                         <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[8px] md:text-[10px] font-black text-white/80 uppercase truncate">{e.start.getHours() % 12 || 12}:00</span>
                            <Target size={10} className="text-white/40 group-hover/ev:text-white transition-colors" />
                         </div>
                         <h4 className="text-[10px] md:text-[13px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2">{e.title}</h4>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-[var(--brand-color)] rounded-none shadow-2xl text-white">
              <CalendarIcon size={32} />
           </div>
           <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-none">Registry.Calendar</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                 <Activity size={12} className="text-emerald-500 animate-pulse"/> Temporal Synchronizer Protocol
              </p>
           </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)]">
           <span className="opacity-60 cursor-default">Home</span> 
           <ChevronRight size={12} className="opacity-40" /> 
           <span>Calendar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          
          {/* Manual Commit Box */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Signal Entry</h3>
              <Terminal size={16} className="text-slate-400"/>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center gap-2">
                {ADMIN_COLORS.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.bg }} 
                    className={`w-7 h-7 rounded-none transition-all ${selectedColor.name === c.name ? 'scale-125 ring-2 ring-[var(--brand-color)] ring-offset-4 ring-offset-white dark:ring-offset-[#121212] z-10' : 'opacity-40 grayscale-[50%]'}`}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="IDENTIFY_LOG..." 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-[#222] rounded-none p-4 text-[11px] font-black uppercase outline-none focus:border-[var(--brand-color)] transition-all placeholder:opacity-30" 
                />
                <button 
                  onClick={handleAddEvent}
                  className="w-full py-4 bg-[var(--brand-color)] text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[var(--brand-color)]/20 flex items-center justify-center gap-3"
                >
                  <Plus size={18}/> Commit Protocol
                </button>
              </div>
            </div>
          </div>

          {/* Draggable Templates Box */}
          <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#222] flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Templates</h3>
              <Globe size={16} className="text-slate-400"/>
            </div>
            <div className="p-6 space-y-3">
              {[
                { title: 'Handshake_Sync', color: ADMIN_COLORS[0] },
                { title: 'Data_Harvest', color: ADMIN_COLORS[2] },
                { title: 'Security_Audit', color: ADMIN_COLORS[3] },
                { title: 'Network_Maintenance', color: ADMIN_COLORS[4] },
              ].map((ev, i) => (
                <div 
                  key={i}
                  draggable="true"
                  onDragStart={() => onDragStart(ev.title, ev.color)}
                  style={{ backgroundColor: ev.color.bg }}
                  className="text-white text-[10px] font-black uppercase p-3 rounded-none shadow-md cursor-grab active:cursor-grabbing hover:brightness-110 active:scale-[0.98] transition-all border-l-4 border-black/20 flex items-center justify-between"
                >
                  {ev.title}
                  <Command size={14} className="opacity-40"/>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-[#222] mt-4">
                <input type="checkbox" id="remove-drop" className="w-4 h-4 rounded-none bg-transparent border-slate-300 dark:border-slate-700 text-[var(--brand-color)] focus:ring-0" />
                <label htmlFor="remove-drop" className="text-[9px] text-slate-500 font-black uppercase tracking-widest cursor-pointer">Purge on Commit</label>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CALENDAR AREA */}
        <main className="lg:col-span-9 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-none shadow-2xl p-4 md:p-10 flex flex-col min-w-0 order-1 lg:order-2">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-1 order-2 sm:order-1">
              <button onClick={handlePrev} className="p-3 bg-[var(--brand-color)] text-white rounded-none hover:brightness-110 transition-all active:scale-95"><ChevronLeft size={20}/></button>
              <button onClick={handleNext} className="p-3 bg-[var(--brand-color)] text-white rounded-none hover:brightness-110 transition-all active:scale-95 border-l border-white/10"><ChevronRight size={20}/></button>
              <button onClick={handleToday} className="ml-4 px-6 py-3 bg-[#17a2b8] text-white rounded-none text-[11px] font-black uppercase tracking-widest hover:bg-[#138496] transition-all shadow-lg active:scale-95">Jump_Today</button>
            </div>

            <div className="text-center order-1 sm:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase leading-none">{monthYearLabel}</h2>
            </div>

            <div className="flex items-center order-3 w-full sm:w-auto overflow-hidden">
              {[
                { id: 'month', label: 'Month' },
                { id: 'week', label: 'Week' },
                { id: 'day', label: 'Day' }
              ].map((v, i) => (
                <button 
                  key={v.id}
                  onClick={() => setView(v.id as any)} 
                  className={`flex-1 sm:flex-none px-5 py-3 border border-[var(--brand-color)] text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === v.id ? 'bg-[var(--brand-color)] text-white shadow-lg scale-105 z-10' : 'text-[var(--brand-color)] hover:bg-[var(--brand-color)]/5'
                  } ${i === 0 ? '' : 'border-l-0'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Display Area */}
          <div className="flex-1 overflow-hidden min-h-[450px]">
            {view === 'month' ? renderMonth() : renderTimeGrid(view === 'week')}
          </div>
          
          {/* Mobile Drill-Down Hint */}
          <div className="lg:hidden mt-8 p-6 bg-slate-900 text-white border border-slate-800 flex items-start gap-4">
             <Info size={24} className="text-[var(--brand-color)] shrink-0 mt-1"/>
             <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--brand-color)] mb-1">Matrix Protocol</p>
                <p className="text-[10px] font-medium leading-relaxed opacity-80">Tap any day coordinate to initialize a dedicated high-density temporal view for that specific node.</p>
             </div>
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-[#222] flex flex-wrap gap-10 items-center">
             <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nodes_Synced: {events.length}</span>
             </div>
             <div className="hidden sm:flex items-center gap-4">
                <div className="w-3 h-3 bg-[var(--brand-color)]"></div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol Priority: Alpha</span>
             </div>
             <div className="ml-auto flex items-center gap-4 text-slate-300 dark:text-slate-800">
                <ShieldCheck size={24} className="opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Access Validated</span>
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
