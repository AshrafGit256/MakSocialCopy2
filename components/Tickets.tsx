
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Ticket } from '../types';
import DigitalTicket from './DigitalTicket';
import { Ticket as TicketIcon, Search, Filter, History, Database, Activity, Terminal, ChevronRight } from 'lucide-react';

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTickets(db.getTickets());
  }, []);

  const filtered = tickets.filter(t => 
    t.eventTitle.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-10 pb-40 font-sans text-[var(--text-primary)]">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-[var(--brand-color)] rounded-2xl text-white shadow-2xl shadow-[var(--brand-color)]/20">
            <TicketIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Registry_Vault / Tickets</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
               <Activity size={10} className="text-emerald-500 animate-pulse" /> {tickets.length} Valid Passes Synced
            </p>
          </div>
        </div>

        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] shadow-sm transition-all"
            placeholder="Search passes..."
          />
        </div>
      </header>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 items-start">
          {filtered.map(ticket => (
            <div key={ticket.id} className="animate-in fade-in slide-in-from-bottom-4">
               <DigitalTicket ticket={ticket} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] bg-[var(--bg-secondary)]">
          <Database size={48} className="mx-auto text-slate-200" />
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase">Vault_Empty</h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">No valid event passes detected in your registry node.</p>
          </div>
          <button onClick={() => setSearch('')} className="px-10 py-3 bg-[var(--brand-color)] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Synchronize Registry</button>
        </div>
      )}

      <footer className="mt-20 p-10 border border-dashed border-[var(--border-color)] rounded-[3rem] bg-slate-50/50 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-[var(--border-color)]">
               <History size={32} className="text-slate-400" />
            </div>
            <div className="space-y-1">
               <h4 className="text-lg font-black uppercase tracking-tight">Temporal Registry Logs</h4>
               <p className="text-xs text-slate-500 font-medium max-w-xl">
                 Tickets are cryptographically tied to your student profile. Expired passes are automatically archived after 30 standard sync cycles.
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-3.5 bg-white border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">Audit_History</button>
            <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Export_Certificates</button>
         </div>
      </footer>
    </div>
  );
};

export default Tickets;
