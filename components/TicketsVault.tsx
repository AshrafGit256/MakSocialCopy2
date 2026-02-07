
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Ticket } from '../types';
import DigitalTicket from './DigitalTicket';
import { Database, Zap, ArrowLeft, ChevronRight, Search, ShieldCheck } from 'lucide-react';

const TicketsVault: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    setTickets(db.getTickets());
  }, []);

  if (selectedTicket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 space-y-10 animate-in slide-in-from-right-4 duration-300">
         <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={18} /> Back to Registry
         </button>
         <DigitalTicket ticket={selectedTicket} />
         <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-[11px] text-emerald-800 font-bold uppercase leading-relaxed">
               Show this pulsing screen to the gate official. The sync time must match the current time to be valid.
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 pb-40 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Registry Vault</h1>
           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 flex items-center gap-2">
              <Database size={14} className="text-[var(--brand-color)]" /> Your Verified Digital Assets
           </p>
        </div>
        <div className="relative group w-full md:w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-[var(--brand-color)] shadow-inner" placeholder="Search Assets..." />
        </div>
      </header>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="group bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--brand-color)] transition-all cursor-pointer shadow-sm hover:shadow-2xl"
              >
                 <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">{ticket.eventTitle}</h3>
                       <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">ID: {ticket.id.slice(-6)}</p>
                    </div>
                    <Zap size={20} className="text-amber-400 animate-pulse" />
                 </div>
                 <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                          <p className="text-xs font-black text-slate-900">{ticket.eventDate}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Venue</p>
                          <p className="text-xs font-black text-slate-900 truncate">{ticket.eventLocation}</p>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full">Status: {ticket.status}</span>
                       <span className="text-[10px] font-black uppercase text-[var(--brand-color)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Open Pass <ChevronRight size={14}/>
                       </span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 border-2 border-dashed border-slate-200 rounded-3xl bg-[var(--bg-secondary)]">
           <Zap size={48} className="mx-auto text-slate-300 opacity-20" />
           <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No active assets</h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                 Your purchased tickets and kits will appear here <br/> once verified in the registry.
              </p>
           </div>
           <button onClick={onBack} className="px-10 py-3 bg-[var(--brand-color)] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all">Go to Feed</button>
        </div>
      )}
    </div>
  );
};

export default TicketsVault;
