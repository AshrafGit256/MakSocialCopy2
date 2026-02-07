
import React, { useEffect, useState } from 'react';
import { Ticket } from '../types';
import { Zap, Clock, ShieldCheck, MapPin } from 'lucide-react';

const DigitalTicket: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-2xl font-sans relative group">
      {/* Security Animation Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10918a] via-transparent to-transparent animate-pulse-slow scale-150"></div>
      </div>

      <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={100} />
         </div>
         <div className="space-y-1 relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">MakRun 2025</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
               <ShieldCheck size={12}/> Verified Entry Permit
            </p>
         </div>
         <div className="text-right relative z-10">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Ticket ID</p>
            <p className="text-sm font-mono font-bold text-white tracking-widest">{ticket.id.slice(-6)}</p>
         </div>
      </div>

      <div className="p-8 space-y-10">
         <div className="flex justify-between items-center">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Entry Holder</p>
               <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{ticket.ownerName}</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
               <Zap size={32} className="text-[#10918a]" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Node</p>
               <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <MapPin size={14} className="text-rose-500"/> {ticket.eventLocation}
               </p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Date</p>
               <p className="text-sm font-black text-slate-900">{ticket.eventDate}</p>
            </div>
         </div>

         {/* THE VISUAL HANDSHAKE AREA */}
         <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
               {/* Pulsing Visual Security Ring */}
               <div className="absolute inset-[-15px] border-4 border-[#10918a]/20 rounded-full animate-ping"></div>
               <div className="absolute inset-[-10px] border-2 border-[#10918a] rounded-full animate-pulse-fast"></div>
               
               {/* "Dynamic QR" - Moves slightly to prevent simple screenshots */}
               <div className="w-40 h-40 bg-slate-900 p-4 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full opacity-40 animate-noise">
                     {[...Array(16)].map((_, i) => (
                        <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                     ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <p className="text-xs font-mono font-black text-emerald-400 tracking-widest bg-slate-900 px-2 py-1 border border-emerald-400/30">
                        {ticket.securityHash}
                     </p>
                  </div>
               </div>
            </div>
            
            <div className="text-center space-y-2">
               <p className="text-[10px] font-black text-[#10918a] uppercase tracking-[0.4em] animate-pulse">Syncing Time Protocol</p>
               <p className="text-3xl font-black font-mono text-slate-900 tracking-tighter">{time}</p>
            </div>
         </div>
      </div>

      <div className="p-8 bg-slate-50 border-t-2 border-dashed border-slate-200 text-center">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">
            Present this screen at the security node for rapid visual validation. <br/> 
            Valid for one individual entry.
         </p>
      </div>

      <style>{`
        @keyframes noise {
           0% { transform: translate(0, 0); }
           25% { transform: translate(1px, -1px); }
           50% { transform: translate(-1px, 1px); }
           75% { transform: translate(2px, 0); }
           100% { transform: translate(0, 0); }
        }
        .animate-noise { animation: noise 0.2s infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default DigitalTicket;
