
import React, { useEffect, useState } from 'react';
import { Ticket } from '../types';
import { Zap, Clock, ShieldCheck, MapPin, Activity, Cpu } from 'lucide-react';

const DigitalTicket: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [ms, setMs] = useState('000');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setMs(now.getMilliseconds().toString().padStart(3, '0'));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white border-2 border-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(16,145,138,0.3)] font-sans relative group">
      
      {/* HIGH INTENSITY PULSE AURA */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#10918a22_0%,_transparent_50%)] animate-pulse-intense"></div>
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden z-10">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
            <Cpu size={120} />
         </div>
         <div className="space-y-1 relative">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Zap className="text-amber-400 animate-bounce" size={24} fill="currentColor"/> 
              MakRun 2025
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Registry Status: Synchronized</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest">Log Node</p>
            <p className="text-sm font-mono font-bold text-white tracking-widest bg-white/10 px-2 py-1 rounded">#{ticket.id.slice(-6)}</p>
         </div>
      </div>

      <div className="p-8 space-y-8 relative z-10">
         <div className="flex justify-between items-center">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Entry Holder</p>
               <p className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{ticket.ownerName}</p>
            </div>
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 shadow-inner group-hover:rotate-12 transition-transform">
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${ticket.id}`} className="w-12 h-12 opacity-80" alt="Unique Asset" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-6">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Sector</p>
               <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <MapPin size={14} className="text-rose-500"/> {ticket.eventLocation}
               </p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validation Cycle</p>
               <p className="text-sm font-black text-slate-900">{ticket.eventDate}</p>
            </div>
         </div>

         {/* THE "VISUAL PULSE" CORE - MUST BE ACTIVE AND OBVIOUS */}
         <div className="flex flex-col items-center gap-6 py-4 relative">
            <div className="relative">
               {/* Pulsing Visual Security Rings */}
               <div className="absolute inset-[-40px] border-[1px] border-[#10918a33] rounded-full animate-ping-slow"></div>
               <div className="absolute inset-[-25px] border-4 border-[#10918a11] rounded-full animate-pulse-fast"></div>
               <div className="absolute inset-[-10px] border-2 border-[#10918a] rounded-full animate-pulse-intense shadow-[0_0_20px_#10918a]"></div>
               
               {/* THE DYNAMIC NODE GRID */}
               <div className="w-44 h-44 bg-slate-900 p-6 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border-4 border-slate-800 group-hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 opacity-40 animate-noise grid grid-cols-8 gap-1 p-2">
                     {[...Array(64)].map((_, i) => (
                        <div key={i} className={`h-full w-full rounded-[1px] ${Math.random() > 0.5 ? 'bg-emerald-400' : 'bg-transparent'}`}></div>
                     ))}
                  </div>
                  <div className="relative z-20 text-center space-y-1">
                     <p className="text-[10px] font-mono font-black text-emerald-400 tracking-[0.4em] mb-2">{ticket.securityHash}</p>
                     <ShieldCheck size={48} className="text-white mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                     <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-2">Verified_Link</p>
                  </div>
                  
                  {/* Validation Overlay Drift */}
                  <div className="absolute bottom-0 left-0 right-0 py-1 bg-emerald-500 text-black text-[7px] font-black uppercase tracking-[0.5em] -rotate-12 translate-y-8 group-hover:translate-y-4 transition-transform">
                     VALID ENTRY ACCESS
                  </div>
               </div>
            </div>
            
            <div className="text-center space-y-2 mt-4 relative">
               <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="h-[2px] w-8 bg-[#10918a22]"></div>
                  <p className="text-[10px] font-black text-[#10918a] uppercase tracking-[0.4em] animate-pulse">Syncing Log</p>
                  <div className="h-[2px] w-8 bg-[#10918a22]"></div>
               </div>
               <div className="flex items-end gap-2 justify-center font-mono">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{time}</p>
                  <p className="text-lg font-black text-emerald-500 pb-1.5 tabular-nums">.{ms}</p>
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active System Time Protocol</p>
            </div>
         </div>
      </div>

      <div className="p-8 bg-slate-50 border-t-2 border-dashed border-slate-200 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10918a33] to-transparent animate-shimmer"></div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-loose">
            Validation requires active animation visibility. <br/> 
            <span className="text-rose-500">Static screenshots are rejected by security nodes.</span>
         </p>
      </div>

      <style>{`
        @keyframes noise {
           0% { transform: scale(1.1) translate(0, 0); }
           25% { transform: scale(1.1) translate(2px, -2px); }
           50% { transform: scale(1.1) translate(-2px, 2px); }
           100% { transform: scale(1.1) translate(0, 0); }
        }
        @keyframes shimmer {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(100%); }
        }
        @keyframes pulse-intense {
           0%, 100% { opacity: 0.1; transform: scale(1); }
           50% { opacity: 0.3; transform: scale(1.2); }
        }
        .animate-noise { animation: noise 0.15s infinite linear; }
        .animate-pulse-intense { animation: pulse-intense 2s infinite ease-in-out; }
        .animate-pulse-fast { animation: pulse 0.8s infinite cubic-bezier(0.4, 0, 0.6, 1); }
        .animate-ping-slow { animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
      `}</style>
    </div>
  );
};

export default DigitalTicket;
