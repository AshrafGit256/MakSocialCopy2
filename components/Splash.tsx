
import React, { useEffect, useState } from 'react';
import { Users, Activity, ShieldCheck, Zap } from 'lucide-react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [terminalLine, setTerminalLine] = useState("INITIALIZING_UPLINK...");
  
  const word1 = "MAK";
  const word2 = "SOCIAL";

  useEffect(() => {
    const lines = [
      "SYNCHRONIZING_NODES...",
      "FETCHING_CAMPUS_STRATA...",
      "VERIFYING_REGISTRY_INTEGRITY...",
      "ESTABLISHING_SECURE_HANDSHAKE...",
      "UPLINK_STABLE_WELCOME_STUDENT"
    ];

    let lineIdx = 0;
    const terminalInterval = setInterval(() => {
      setTerminalLine(lines[lineIdx % lines.length]);
      lineIdx++;
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 30);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 800);
    }, 3800);

    return () => {
      clearInterval(terminalInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#10918a] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* 1. DIGITAL RAIN BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none select-none flex justify-around">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="text-[10px] font-mono text-white whitespace-pre animate-matrix-fall" style={{ animationDelay: `${i * 0.4}s` }}>
            {"101011001\n001011010\n110010101\n010110110\n101101001".repeat(10)}
          </div>
        ))}
      </div>

      {/* 2. SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-scanlines opacity-20"></div>

      <div className="relative flex flex-col items-center gap-12 z-20">
        
        {/* 3. CORE GEOMETRY LOADER */}
        <div className="relative w-24 h-24 flex items-center justify-center">
           <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping"></div>
           <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full animate-spin-slow"></div>
           <div className="w-16 h-16 bg-white rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-pulse-fast">
              <Users size={32} className="text-[#10918a] -rotate-45" />
           </div>
        </div>

        {/* 4. ANIMATED BRAND TEXT */}
        <div className="flex flex-col items-center gap-2">
           <div className="flex gap-2 md:gap-4 overflow-hidden">
              <div className="flex">
                {word1.split('').map((char, i) => (
                  <span 
                    key={`w1-${i}`} 
                    className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter animate-letter-in drop-shadow-2xl"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex">
                {word2.split('').map((char, i) => (
                  <span 
                    key={`w2-${i}`} 
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter animate-letter-in-color drop-shadow-2xl"
                    style={{ animationDelay: `${(word1.length + i) * 0.1}s` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
           </div>
           
           <div className="flex items-center gap-2 text-white/50">
              <div className="h-px w-8 bg-current"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Intelligence Registry</span>
              <div className="h-px w-8 bg-current"></div>
           </div>
        </div>

        {/* 5. TECHNICAL LOADBAR */}
        <div className="w-64 space-y-4">
           <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-white via-amber-200 to-white shadow-[0_0_15px_white] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           
           <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] font-mono font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                 <Zap size={10} className="text-amber-300 fill-amber-300" /> {terminalLine}
              </p>
              <p className="text-[7px] font-mono text-white/30">0x{progress.toString(16).toUpperCase()}_SYNC_ACTIVE</p>
           </div>
        </div>
      </div>

      {/* 6. SECURITY AUTH SIGNATURE */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4">
         <div className="flex items-center gap-8 text-white/30 grayscale">
            <ShieldCheck size={20} />
            <Activity size={20} />
            <Zap size={20} />
         </div>
         <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.6em]">Makerere Digital Infrastructure</p>
      </div>

      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-matrix-fall {
          animation: matrixFall 5s linear infinite;
        }
        .bg-scanlines {
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%);
          background-size: 100% 4px;
        }
        @keyframes letterIn {
          0% { transform: translateY(100px) scale(0.5); opacity: 0; filter: blur(10px); }
          60% { transform: translateY(-10px) scale(1.1); opacity: 1; filter: blur(0px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
        .animate-letter-in {
          opacity: 0;
          animation: letterIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes letterInColor {
          0% { transform: translateY(100px) scale(0.5); opacity: 0; filter: blur(10px); color: white; }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); color: #fbbf24; }
        }
        .animate-letter-in-color {
          opacity: 0;
          animation: letterInColor 1s cubic-bezier(0.23, 1, 0.32, 1) forwards, colorShift 4s linear infinite 1.5s;
        }
        @keyframes colorShift {
          0% { color: #fbbf24; }
          33% { color: #fff; }
          66% { color: #5eead4; }
          100% { color: #fbbf24; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-pulse-fast {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Splash;
