
import React, { useEffect, useState } from 'react';
import { Ticket } from '../types';
import { Zap, Clock, ShieldCheck, MapPin, Activity, Cpu, Hexagon, Fingerprint, Code, Activity as ActivityIcon } from 'lucide-react';

const DigitalTicket: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
  const [ms, setMs] = useState('000');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB'));
      setMs(now.getMilliseconds().toString().padStart(3, '0'));
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Dynamic theme detection
  const isTechEvent = ticket.eventTitle.toLowerCase().includes('tech') || ticket.eventTitle.toLowerCase().includes('expo');
  const brandColor = isTechEvent ? '#4f46e5' : '#10918a';
  const accentColor = isTechEvent ? '#6366f1' : '#fbbf24';

  return (
    <div className="max-w-md mx-auto relative group">
      {/* BACKGROUND GLOW */}
      <div className="absolute -inset-4 opacity-10 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: brandColor }}></div>

      <div className="relative bg-white border-[3px] border-slate-900 rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] font-sans flex flex-col">
        
        {/* TOP CUTOUT NOTCHES */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[var(--bg-primary)] border-[3px] border-slate-900 rounded-full z-30"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[var(--bg-primary)] border-[3px] border-slate-900 rounded-full z-30"></div>

        {/* HEADER SECTION - PREMIUM DARK */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 scale-150 rotate-12 pointer-events-none">
            {isTechEvent ? <Code size={120} fill="currentColor" /> : <Hexagon size={120} fill="currentColor" />}
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Registry Verified</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-2">
                {ticket.eventTitle.split(' ').slice(0, -1).join(' ')} <span style={{ color: accentColor }}>{ticket.eventTitle.split(' ').pop()}</span>
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Auth Code</p>
              <div className="bg-white/10 px-3 py-1 rounded-sm border border-white/10 backdrop-blur-md">
                <span className="text-xs font-mono font-bold text-white tracking-widest">{ticket.id.slice(-6)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TICKET BODY */}
        <div className="p-8 space-y-10 relative z-10 bg-white">
          
          {/* USER INFO */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Bearer</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none truncate max-w-[200px]">{ticket.ownerName}</h3>
              <p className="text-[10px] font-bold mt-1" style={{ color: brandColor }}>Tier: Official {isTechEvent ? 'Delegate' : 'Student'} Entry</p>
            </div>
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-inner group-hover:rotate-6 transition-transform relative overflow-hidden">
               <Fingerprint size={32} className="text-slate-300 absolute -bottom-2 -right-2 rotate-12 opacity-50" />
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${ticket.id}`} className="w-10 h-10 relative z-10" alt="Identity" />
            </div>
          </div>

          {/* DYNAMIC SECURE PULSE - THE NEW VISUAL HANDSHAKE */}
          <div className="relative py-12 flex flex-col items-center justify-center">
            {/* Pulsing Concentric Rings */}
            <div className="absolute w-48 h-48 border rounded-full animate-nexus-ring-1" style={{ borderColor: `${brandColor}33` }}></div>
            <div className="absolute w-48 h-48 border rounded-full animate-nexus-ring-2" style={{ borderColor: `${brandColor}1a` }}></div>
            <div className="absolute w-48 h-48 border-2 rounded-full animate-nexus-ring-3" style={{ borderColor: `${brandColor}0d` }}></div>

            {/* THE NEXUS HUB */}
            <div className="w-40 h-40 bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border-[4px] border-slate-800 z-10">
              <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle_at_center, ${brandColor}33 0%, transparent 70%)` }}></div>
              
              {/* Dynamic Waveform Simulation */}
              <div className="flex gap-1 h-12 items-center mb-4">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 rounded-full animate-waveform-bounce" style={{ backgroundColor: isTechEvent ? '#818cf8' : '#34d399', height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }}></div>
                 ))}
              </div>

              <div className="relative z-20 text-center">
                <p className="text-[10px] font-mono font-black text-white tracking-[0.4em] mb-1">{ticket.securityHash.toUpperCase()}</p>
                <div className="flex items-center justify-center gap-2">
                   <ShieldCheck size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Active_Node</span>
                </div>
              </div>

              {/* Security Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-fast pointer-events-none"></div>
            </div>

            {/* SYSTEM CLOCK SYNC */}
            <div className="mt-12 text-center space-y-1 relative z-20">
               <div className="flex items-end justify-center font-mono gap-1">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{time}</p>
                  <p className="text-xl font-bold pb-1 tabular-nums animate-pulse" style={{ color: brandColor }}>.{ms}</p>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Registry Temporal Sync</p>
            </div>
          </div>

          {/* VENUE & DATE */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-dashed border-slate-100 pt-8">
            <div className="space-y-1 border-r border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sector Venue</p>
               <p className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase">
                  <MapPin size={12} className="text-rose-500"/> {ticket.eventLocation}
               </p>
            </div>
            <div className="space-y-1 pl-4">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Strata</p>
               <p className="text-xs font-black text-slate-900 uppercase">{ticket.eventDate}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM VALIDATION BAR */}
        <div className="bg-slate-50 p-6 flex flex-col items-center gap-4 relative overflow-hidden border-t border-slate-100">
          <div className="flex items-center gap-3">
             {isTechEvent ? <ActivityIcon size={16} className="text-slate-400" /> : <Cpu size={16} className="text-slate-400" />}
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">
                Encrypted Visual Protocol v2.4
             </p>
          </div>
          
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden relative">
             <div className="absolute inset-0 w-1/2 animate-shimmer" style={{ background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)` }}></div>
          </div>
          
          <p className="text-[9px] text-slate-400 font-bold uppercase text-center max-w-[280px] leading-relaxed">
            Gate check requires active pulse animation. <br/> 
            <span className="text-rose-500">Security logic rejects all static imagery.</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes nexus-ring-1 {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes nexus-ring-2 {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes nexus-ring-3 {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes waveform-bounce {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(1.4); }
        }
        @keyframes shimmer-fast {
          0% { transform: translateX(-200%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        .animate-nexus-ring-1 { animation: nexus-ring-1 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-nexus-ring-2 { animation: nexus-ring-2 3s cubic-bezier(0, 0, 0.2, 1) infinite 1s; }
        .animate-nexus-ring-3 { animation: nexus-ring-3 3s cubic-bezier(0, 0, 0.2, 1) infinite 2s; }
        .animate-waveform-bounce { animation: waveform-bounce 0.8s ease-in-out infinite; }
        .animate-shimmer-fast { animation: shimmer-fast 2s linear infinite; }
        .animate-shimmer { animation: shimmer 2.5s infinite linear; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default DigitalTicket;
