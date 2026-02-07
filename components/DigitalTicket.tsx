
import React, { useEffect, useState } from 'react';
import { Ticket } from '../types';
import { Zap, ShieldCheck, MapPin, Cpu, Hexagon, Fingerprint, Box, Database, Lock, Command, Triangle } from 'lucide-react';

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
  const accentColor = isTechEvent ? '#818cf8' : '#fbbf24';

  return (
    <div className="max-w-md mx-auto relative group">
      {/* RADIANT AMBIENCE */}
      <div className="absolute -inset-10 opacity-30 blur-[80px] rounded-full animate-pulse pointer-events-none" style={{ backgroundColor: brandColor }}></div>

      <div className="relative bg-[#0d0d0d] border-[1px] border-white/20 rounded-[2.5rem] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.7)] font-sans flex flex-col transition-all duration-700">
        
        {/* PHYSICAL PERFORATION CUTOUTS */}
        <div className="absolute top-[25%] -left-6 w-12 h-12 bg-[var(--bg-primary)] border-[1px] border-white/10 rounded-full z-30 shadow-[inset_-10px_0_15px_rgba(0,0,0,0.1)]"></div>
        <div className="absolute top-[25%] -right-6 w-12 h-12 bg-[var(--bg-primary)] border-[1px] border-white/10 rounded-full z-30 shadow-[inset_10px_0_15px_rgba(0,0,0,0.1)]"></div>

        {/* TOP SECTION: SECURITY LOGO */}
        <div className="p-8 pb-10 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 scale-[2.5] rotate-45 pointer-events-none text-white">
            <Triangle size={150} fill="currentColor" />
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">Registry_Verified</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-white">
                {ticket.eventTitle.split(' ').slice(0, -1).join(' ')} <br/>
                <span style={{ color: accentColor }}>{ticket.eventTitle.split(' ').pop()}</span>
              </h2>
            </div>
            <div className="text-right">
               <div className="bg-white/5 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md mb-2">
                  <span className="text-[10px] font-mono font-bold text-white/60 tracking-[0.2em]">{ticket.id.slice(-8).toUpperCase()}</span>
               </div>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Entry Protocol</p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: PRISM VECTOR HANDSHAKE */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] -mt-6 p-8 relative z-10 flex flex-col gap-8">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Bearer</p>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{ticket.ownerName}</h3>
              <div className="flex items-center gap-2 mt-2">
                 <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">Tier: Official Student</div>
              </div>
            </div>
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner group-hover:rotate-3 transition-transform relative overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${ticket.id}`} className="w-10 h-10 relative z-10" alt="ID" />
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
          </div>

          {/* THE "PRISM VECTOR" PULSE */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* VIRTUAL DEPTH RINGS */}
              <div className="absolute inset-0 border-[1px] border-slate-100 rounded-full scale-[1.1] animate-pulse"></div>
              <div className="absolute inset-0 border-[1px] border-slate-50 rounded-full scale-[1.2]"></div>

              {/* PRISM WIREFRAME (Simulated 3D with Multiple Triangles) */}
              <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 animate-spin-prism opacity-20" style={{ color: brandColor }}>
                    <Triangle size={160} strokeWidth={0.5} />
                 </div>
                 <div className="absolute inset-0 animate-spin-prism-reverse opacity-40" style={{ color: brandColor, animationDelay: '-1.5s' }}>
                    <Triangle size={160} strokeWidth={1} />
                 </div>
                 
                 {/* CENTER CORE */}
                 <div className="w-24 h-24 bg-[#0d0d0d] rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl z-20 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20"></div>
                    <ShieldCheck size={32} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse" />
                    <p className="text-[10px] font-mono font-black text-emerald-400 tracking-[0.2em] mt-2">{ticket.securityHash.toUpperCase()}</p>
                    
                    {/* DYNAMIC CIPHER OVERLAY */}
                    <div className="absolute bottom-0 w-full h-1 bg-emerald-500/50 animate-shimmer"></div>
                 </div>
              </div>

              {/* FLOATING DATA NODES */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`absolute w-1.5 h-1.5 rounded-full animate-prism-float`} style={{ 
                  backgroundColor: brandColor,
                  animationDelay: `${i * 1.2}s`,
                  top: i % 2 === 0 ? '10%' : '80%',
                  left: i < 2 ? '10%' : '80%'
                }}></div>
              ))}
            </div>

            {/* ATOMIC CLOCK SYNC */}
            <div className="mt-6 text-center">
               <div className="flex items-baseline justify-center font-mono gap-1">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{time}</p>
                  <p className="text-xl font-bold pb-1 tabular-nums animate-pulse" style={{ color: brandColor }}>.{ms}</p>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Registry_Temporal_Sync</p>
            </div>
          </div>

          {/* GEOSPATIAL DATA */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div className="space-y-1">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Sector</p>
               <p className="text-[12px] font-black text-slate-900 flex items-center gap-2 uppercase truncate">
                  <MapPin size={14} className="text-rose-500"/> {ticket.eventLocation}
               </p>
            </div>
            <div className="space-y-1 text-right">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Handshake Date</p>
               <p className="text-[12px] font-black text-slate-900 uppercase">{ticket.eventDate}</p>
            </div>
          </div>
        </div>

        {/* FOOTER: SECURITY BARCODE AREA */}
        <div className="bg-[#0d0d0d] p-8 pt-4 pb-10 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="w-full flex justify-center opacity-40 overflow-hidden h-8">
             <div className="flex gap-1 animate-barcode-scroll">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="bg-white" style={{ width: `${1 + Math.random() * 3}px`, height: '100%' }}></div>
                ))}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Fingerprint size={18} className="text-white/20" />
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Encrypted_Registry_Token_v5.2
             </p>
          </div>
          
          <p className="text-[8px] text-white/20 font-bold uppercase text-center max-w-[240px] leading-relaxed tracking-widest">
             Validation engine requires active Prism Vector synchronization. Static captures will be rejected.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-prism {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes spin-prism-reverse {
          0% { transform: rotate(360deg) scale(1.3); }
          50% { transform: rotate(180deg) scale(1); }
          100% { transform: rotate(0deg) scale(1.3); }
        }
        @keyframes prism-float {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          50% { transform: translate(10px, -10px); opacity: 1; }
        }
        @keyframes barcode-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-spin-prism { animation: spin-prism 6s ease-in-out infinite; }
        .animate-spin-prism-reverse { animation: spin-prism-reverse 8s ease-in-out infinite; }
        .animate-prism-float { animation: prism-float 4s ease-in-out infinite; }
        .animate-barcode-scroll { animation: barcode-scroll 10s linear infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default DigitalTicket;
