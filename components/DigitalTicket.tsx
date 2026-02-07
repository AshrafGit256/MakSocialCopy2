
import React, { useEffect, useState } from 'react';
import { Ticket } from '../types';
import { Zap, ShieldCheck, MapPin, Cpu, Hexagon, Fingerprint, Code, Activity, Box, Database, Lock } from 'lucide-react';

const DigitalTicket: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
  const [ms, setMs] = useState('000');
  const [cipher, setCipher] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB'));
      setMs(now.getMilliseconds().toString().padStart(3, '0'));
      
      // Update cipher occasionally
      if (now.getMilliseconds() < 50) {
        setCipher(Math.random().toString(16).slice(2, 10).toUpperCase());
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Dynamic theme detection
  const isTechEvent = ticket.eventTitle.toLowerCase().includes('tech') || ticket.eventTitle.toLowerCase().includes('expo');
  const brandColor = isTechEvent ? '#4f46e5' : '#10918a';
  const accentColor = isTechEvent ? '#818cf8' : '#fbbf24';

  return (
    <div className="max-w-md mx-auto relative group perspective-1000">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute -inset-10 opacity-20 blur-[100px] rounded-full animate-pulse pointer-events-none" style={{ backgroundColor: brandColor }}></div>

      <div className="relative bg-[#0a0a0a] border-[1px] border-white/20 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] font-sans flex flex-col transition-all duration-700 group-hover:shadow-[0_60px_120px_-10px_rgba(0,0,0,0.8)]">
        
        {/* HOLOGRAPHIC SHIMMER OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] mix-blend-overlay bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3s] linear infinite animate-hologram"></div>

        {/* PERFORATION NOTCHES */}
        <div className="absolute top-[22%] -left-5 w-10 h-10 bg-[var(--bg-primary)] border-[1px] border-white/10 rounded-full z-30 shadow-inner"></div>
        <div className="absolute top-[22%] -right-5 w-10 h-10 bg-[var(--bg-primary)] border-[1px] border-white/10 rounded-full z-30 shadow-inner"></div>

        {/* HEADER: SECURE NODE IDENTITY */}
        <div className="p-8 pb-12 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 scale-[2] rotate-12 pointer-events-none">
            <Database size={120} />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-400/80">Protocol_Active</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-white">
                {ticket.eventTitle.split(' ').slice(0, -1).join(' ')} <br/>
                <span style={{ color: accentColor }}>{ticket.eventTitle.split(' ').pop()}</span>
              </h2>
            </div>
            <div className="flex flex-col items-end">
               <div className="p-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md mb-2">
                  <Lock size={16} className="text-white/40" />
               </div>
               <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest">#{ticket.id.slice(-6)}</span>
            </div>
          </div>
        </div>

        {/* MAIN BODY: THE FLUX MATRIX */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] -mt-6 p-8 space-y-8 relative z-10">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Node</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{ticket.ownerName}</h3>
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-[8px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-widest">Registry ID: {ticket.id.slice(0, 8)}</span>
              </div>
            </div>
            <div className="relative group/id">
               <div className="absolute inset-0 bg-brand-color opacity-20 blur-xl group-hover/id:opacity-40 transition-opacity"></div>
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm relative z-10 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${ticket.id}`} className="w-10 h-10 transition-transform group-hover/id:rotate-12" alt="Identity" />
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               </div>
            </div>
          </div>

          {/* THE NEW "FLUX CORE" PULSE */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            
            {/* BACKGROUND DATA STREAM */}
            <div className="absolute inset-0 flex justify-between px-12 pointer-events-none opacity-[0.03] font-mono text-[8px] overflow-hidden select-none">
               <div className="animate-scroll-up">{Array(10).fill('0x4F 0x2A 0x99 0xBC 0x12').join(' ')}</div>
               <div className="animate-scroll-down">{Array(10).fill('0x99 0xBC 0x12 0x4F 0x2A').join(' ')}</div>
            </div>

            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* ORBITAL LATTICE */}
              <div className="absolute inset-0 border-[1px] border-slate-100 rounded-full"></div>
              <div className="absolute inset-4 border-[1px] border-slate-50 rounded-full animate-spin-slow">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-color rounded-full shadow-[0_0_10px_var(--brand-color)]"></div>
              </div>
              <div className="absolute inset-10 border-[1px] border-slate-50 rounded-full animate-spin-reverse">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]"></div>
              </div>

              {/* THE CENTRAL NODE */}
              <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl z-20 group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-transparent"></div>
                <div className="absolute inset-0 animate-pulse-fast opacity-30" style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}></div>
                
                <div className="relative z-30 text-center space-y-1">
                  <ShieldCheck size={40} className="text-white mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-bounce-gentle" />
                  <p className="text-[10px] font-mono font-black text-emerald-400 tracking-[0.2em]">{cipher || 'SYNCING'}</p>
                </div>

                {/* SCAN LINE */}
                <div className="absolute left-0 right-0 h-[2px] bg-emerald-400/50 shadow-[0_0_10px_#34d399] animate-scan z-40"></div>
              </div>
            </div>

            {/* HIGH PRECISION TIME SYNC */}
            <div className="mt-8 text-center space-y-1">
               <div className="flex items-baseline justify-center font-mono gap-1">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{time}</p>
                  <p className="text-xl font-bold pb-1 tabular-nums animate-pulse" style={{ color: brandColor }}>.{ms}</p>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Atomic_Temporal_Handshake</p>
            </div>
          </div>

          {/* GEOSPATIAL LOGS */}
          <div className="grid grid-cols-2 gap-0 border border-slate-100 rounded-2xl overflow-hidden">
            <div className="p-4 border-r border-slate-100 bg-slate-50/30">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Sector</p>
               <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-rose-500" />
                  <span className="text-[11px] font-black text-slate-900 uppercase truncate">{ticket.eventLocation}</span>
               </div>
            </div>
            <div className="p-4 bg-slate-50/30">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Validation Strata</p>
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" />
                  <span className="text-[11px] font-black text-slate-900 uppercase">{ticket.eventDate}</span>
               </div>
            </div>
          </div>
        </div>

        {/* FOOTER: SECURITY PROTOCOL */}
        <div className="bg-[#0a0a0a] p-8 relative overflow-hidden">
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex items-center gap-3">
               <Fingerprint size={20} className="text-white/20" />
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Encrypted Registry Token v4.1
               </p>
            </div>
            <div className="w-full h-[1px] bg-white/5 relative">
               <div className="absolute inset-0 w-1/3 bg-emerald-500/50 animate-shimmer"></div>
            </div>
            <p className="text-[8px] text-white/30 font-bold uppercase text-center max-w-[240px] leading-relaxed tracking-widest">
               Handshake requires active visual flux. Verification failed if animation is static.
            </p>
          </div>
          
          {/* DECORATIVE CORNER ACCENTS */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-white/5 rounded-bl-[2rem]"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-white/5 rounded-br-[2rem]"></div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes scroll-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        @keyframes hologram {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-shimmer { animation: shimmer 3s infinite linear; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 12s linear infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-scroll-up { animation: scroll-up 20s linear infinite; }
        .animate-scroll-down { animation: scroll-down 20s linear infinite; }
        .animate-hologram { animation: hologram 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default DigitalTicket;
