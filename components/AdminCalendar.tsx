
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
];

const AdminCalendar: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [events, setEvents] = useState<AdminCalendarEvent[]>(INITIAL_EVENTS);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(ADMIN_COLORS[0]);

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const event: AdminCalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15), // Default to middle of month for demo
      allDay: true,
      backgroundColor: selectedColor.bg,
      borderColor: selectedColor.border
    };
    setEvents([...events, event]);
    setNewEventTitle('');
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

    // Header
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fill empty offset
    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`offset-${i}`} className="min-h-[120px] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const dayEvents = events.filter(e => 
        e.start.getFullYear() === year && 
        e.start.getMonth() === month && 
        e.start.getDate() === d
      );

      cells.push(
        <div key={d} className="min-h-[120px] p-1 border border-slate-200 dark:border-white/10 relative group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <span className="text-[11px] font-bold text-slate-400 absolute top-1 right-2">{d}</span>
          <div className="mt-5 space-y-1 overflow-hidden">
            {dayEvents.map(e => (
              <div 
                key={e.id} 
                style={{ backgroundColor: e.backgroundColor, borderColor: e.borderColor }} 
                className="px-2 py-0.5 text-[9px] font-bold text-white rounded-[2px] truncate cursor-pointer shadow-sm active:scale-95 transition-transform"
              >
                {!e.allDay && <span className="mr-1 opacity-70">{e.start.getHours() % 12 || 12}{e.start.getHours() >= 12 ? 'p' : 'a'}</span>}
                {e.title}
              </div>
            ))}
          </div>
        </div>
      );

      if ((cells.length) % 7 === 0) {
        rows.push(<div key={`row-${d}`} className="grid grid-cols-7">{cells}</div>);
        cells = [];
      }
    }

    // Fill end
    if (cells.length > 0) {
      while (cells.length < 7) {
        cells.push(<div key={`end-${cells.length}`} className="min-h-[120px] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10"></div>);
      }
      rows.push(<div key={`row-last`} className="grid grid-cols-7">{cells}</div>);
    }

    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          {weekDays.map(wd => (
            <div key={wd} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 dark:border-white/10 last:border-r-0">
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
    const weekDays = isWeek ? ['Sun 2/1', 'Mon 2/2', 'Tue 2/3', 'Wed 2/4', 'Thu 2/5', 'Fri 2/6', 'Sat 2/7'] : ['Wednesday'];
    
    return (
      <div className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 overflow-x-auto">
        <div className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-2'} border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 sticky top-0 z-10`}>
          <div className="w-16 py-2 border-r border-slate-200 dark:border-white/10"></div>
          {weekDays.map(wd => (
            <div key={wd} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200 dark:border-white/10 last:border-r-0 flex-1">
              {wd}
            </div>
          ))}
        </div>
        <div className="relative">
          {/* all day row */}
          <div className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-2'} border-b border-slate-200 dark:border-white/10 bg-amber-50/20`}>
            <div className="w-16 py-1 px-2 text-[10px] text-slate-400 font-bold border-r border-slate-200 dark:border-white/10">all day</div>
            {weekDays.map((_, i) => (
              <div key={i} className="flex-1 min-h-[30px] border-r border-slate-200 dark:border-white/10 p-1 last:border-r-0">
                {isWeek && i === 0 && (
                   <div className="bg-[#dc3545] text-white text-[9px] font-bold px-2 py-0.5 rounded-[2px] truncate">All Day Event</div>
                )}
              </div>
            ))}
          </div>

          {hours.map(h => (
            <div key={h} className={`grid ${isWeek ? 'grid-cols-8' : 'grid-cols-2'} border-b border-slate-200 dark:border-white/10 group`}>
              <div className="w-16 h-10 px-2 flex items-start justify-end text-[10px] text-slate-400 font-bold border-r border-slate-200 dark:border-white/10">
                {h % 12 || 12}{h >= 12 ? 'pm' : 'am'}
              </div>
              {weekDays.map((_, i) => (
                <div key={i} className="flex-1 h-10 border-r border-slate-200 dark:border-white/10 last:border-r-0 relative hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  {/* Mock events in specific slots matching screenshot */}
                  {isWeek && i === 0 && h === 0 && (
                    <div className="absolute inset-0 bg-[#f39c12] text-white p-1 z-[2] border-l-4 border-[#e08e0b] shadow-lg">
                      <div className="text-[8px] opacity-70">12:00</div>
                      <div className="text-[9px] font-black uppercase">Long Event</div>
                    </div>
                  )}
                   {isWeek && i === 3 && h === 10 && (
                    <div className="absolute inset-0 bg-[#007bff] text-white p-1 z-[2] border-l-4 border-[#0069d9] shadow-lg">
                      <div className="text-[8px] opacity-70">10:30</div>
                      <div className="text-[9px] font-black uppercase">Meeting</div>
                    </div>
                  )}
                   {isWeek && i === 3 && h === 12 && (
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-[#17a2b8] text-white p-1 z-[2] border-l-4 border-[#138496] shadow-lg">
                      <div className="text-[8px] opacity-70">12:00 - 2:00</div>
                      <div className="text-[9px] font-black uppercase">Lunch</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 font-sans bg-[#f4f6f9] dark:bg-[#0d1117] min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold">
           <span>Home</span> / <span className="text-slate-400">Calendar</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 space-y-6 shrink-0">
          {/* Draggable Events Box */}
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-[2px] shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-[13px] font-bold text-slate-600 dark:text-slate-300">Draggable Events</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="bg-[#28a745] text-white text-[11px] font-bold p-2 rounded-[2px] shadow-sm cursor-move hover:brightness-110">Lunch</div>
              <div className="bg-[#ffc107] text-white text-[11px] font-bold p-2 rounded-[2px] shadow-sm cursor-move hover:brightness-110">Go home</div>
              <div className="bg-[#17a2b8] text-white text-[11px] font-bold p-2 rounded-[2px] shadow-sm cursor-move hover:brightness-110">Do homework</div>
              <div className="bg-[#007bff] text-white text-[11px] font-bold p-2 rounded-[2px] shadow-sm cursor-move hover:brightness-110">Work on UI design</div>
              <div className="bg-[#dc3545] text-white text-[11px] font-bold p-2 rounded-[2px] shadow-sm cursor-move hover:brightness-110">Sleep tight</div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="remove-drop" className="w-4 h-4 rounded-[2px]" />
                <label htmlFor="remove-drop" className="text-[11px] text-slate-500 font-bold">remove after drop</label>
              </div>
            </div>
          </div>

          {/* Create Event Box */}
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-[2px] shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-[13px] font-bold text-slate-600 dark:text-slate-300">Create Event</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                {ADMIN_COLORS.map(c => (
                  <button 
                    key={c.name} 
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.bg }} 
                    className={`w-4 h-4 rounded-sm transition-transform ${selectedColor.name === c.name ? 'scale-125 ring-2 ring-indigo-600 ring-offset-2' : ''}`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <input 
                  type="text" 
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="Event Title" 
                  className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[2px] px-3 py-2 text-xs outline-none focus:border-indigo-600" 
                />
                <button 
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-[2px] text-[11px] font-bold hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CALENDAR AREA */}
        <main className="flex-1 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-[2px] shadow-lg p-6 flex flex-col min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-1">
              <button className="p-2 bg-indigo-600 text-white rounded-l-[4px] hover:bg-indigo-700"><ChevronLeft size={16}/></button>
              <button className="p-2 bg-indigo-600 text-white rounded-r-[4px] hover:bg-indigo-700 border-l border-indigo-700"><ChevronRight size={16}/></button>
              <button className="ml-2 px-4 py-2 bg-[#6cb2eb] text-white rounded-[4px] text-[12px] font-bold hover:bg-[#52a0e0]">today</button>
            </div>

            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300 tracking-tight uppercase">{monthYearLabel}</h2>

            <div className="flex items-center">
              <button onClick={() => setView('month')} className={`px-4 py-2 border border-indigo-600 rounded-l-[4px] text-[12px] font-bold transition-all ${view === 'month' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}>month</button>
              <button onClick={() => setView('week')} className={`px-4 py-2 border-y border-indigo-600 text-[12px] font-bold transition-all ${view === 'week' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}>week</button>
              <button onClick={() => setView('day')} className={`px-4 py-2 border border-indigo-600 rounded-r-[4px] text-[12px] font-bold transition-all ${view === 'day' ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}>day</button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {view === 'month' ? renderMonth() : renderTimeGrid(view === 'week')}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCalendar;
