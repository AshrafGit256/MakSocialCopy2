
import React, { useEffect, useState } from 'react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [status, setStatus] = useState("starting...");

  useEffect(() => {
    const messages = ["starting...", "syncing...", "almost there...", "ready"];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setStatus(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 30);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 800);
    }, 4000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) ${isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
      
      {/* 1. HERO LOGO AREA */}
      <div className="relative mb-8 flex flex-col items-center">
        {/* Animated Circular Loader */}
        <div className="absolute inset-0 -m-4">
          <svg className="w-24 h-24 sm:w-32 sm:h-32 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="transparent"
              stroke="#10918a"
              strokeWidth="2"
              strokeDasharray="300"
              style={{ 
                strokeDashoffset: 300 - (progress * 3),
                transition: 'stroke-dashoffset 0.1s linear'
              }}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* The Artistic "M" */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center animate-hero-in">
          <span className="text-5xl sm:text-7xl font-bold text-[#10918a] font-sans tracking-tighter">M</span>
        </div>
      </div>

      {/* 2. BRAND & MOTTO */}
      <div className="flex flex-col items-center gap-1 animate-text-reveal">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-[#10918a]">
          maksocial
        </h2>
        <p className="text-[9px] sm:text-[11px] font-medium text-slate-400 lowercase tracking-[0.15em]">
          let's connect
        </p>
      </div>

      {/* 3. STATUS LOG */}
      <div className="absolute bottom-20 flex flex-col items-center gap-4">
         <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.5em] animate-pulse">
            {status}
         </span>
      </div>

      {/* 4. COPYRIGHT FOOTER */}
      <div className="absolute bottom-10">
         <p className="text-[7px] font-bold text-slate-200 uppercase tracking-widest">Mak Dev Group</p>
      </div>

      <style>{`
        @keyframes heroIn {
          0% { opacity: 0; transform: scale(0.5) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(10px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }

        .animate-hero-in {
          animation: heroIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-text-reveal {
          opacity: 0;
          animation: textReveal 1s cubic-bezier(0.23, 1, 0.32, 1) 0.6s forwards;
        }

        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
};

export default Splash;
