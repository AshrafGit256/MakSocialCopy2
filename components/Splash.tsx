
import React, { useEffect, useState } from 'react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [status, setStatus] = useState("Hi there...");
  
  const letters = "MAKSOCIAL".split("");

  useEffect(() => {
    const messages = ["Hi there...", "Getting ready...", "Almost set...", "Enjoy!"];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setStatus(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 35);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 800);
    }, 4500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* 1. ARTISTIC CENTRAL LOGO (The "M") */}
      <div className="relative mb-20">
         {/* Circular Loader Ring */}
         <svg className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              stroke="#10918a"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="300"
              className="animate-ring-draw opacity-20"
            />
         </svg>
         
         {/* Large Artistic M */}
         <div className="w-24 h-24 flex items-center justify-center bg-white rounded-3xl shadow-[0_20px_50px_rgba(16,145,138,0.1)] border border-slate-50 animate-main-logo">
            <span className="text-6xl font-black text-[#10918a] font-artistic tracking-tighter">M</span>
         </div>
      </div>

      {/* 2. STAGGERED WORD ANIMATION */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-1 md:gap-3 overflow-hidden px-4">
          {letters.map((char, i) => (
            <span 
              key={i} 
              className="text-4xl md:text-7xl font-black uppercase tracking-tighter animate-art-reveal"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                fontFamily: "'Syne', sans-serif"
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* 3. SIMPLE STATUS */}
        <div className="flex flex-col items-center gap-4 mt-4">
           <p className="text-[10px] font-bold text-[#10918a]/60 uppercase tracking-[0.5em] animate-pulse">
              {status}
           </p>
           {/* Minimal Slim Progress Bar */}
           <div className="w-32 h-[2px] bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#10918a] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
         <div className="w-1 h-1 bg-[#10918a] rounded-full animate-bounce"></div>
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">Makerere University</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');
        
        .font-artistic {
          font-family: 'Syne', sans-serif;
        }

        @keyframes artReveal {
          0% { 
            opacity: 0; 
            transform: translateY(40px) scale(0.9);
            color: #10918a;
            filter: blur(15px);
          }
          30% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0px);
            color: #10918a;
          }
          50% {
            color: #94a3b8; /* Elegant Silver */
          }
          70% {
            color: #0d7a74; /* Deep Brand */
          }
          100% {
            opacity: 0.3; /* Subtle Dim */
            color: #10918a;
            transform: scale(0.95);
          }
        }

        @keyframes mainLogo {
          0%, 100% { transform: scale(1); box-shadow: 0 20px 50px rgba(16,145,138,0.1); }
          50% { transform: scale(1.05); box-shadow: 0 30px 60px rgba(16,145,138,0.2); }
        }

        @keyframes ringDraw {
          0% { stroke-dashoffset: 300; opacity: 0; }
          50% { opacity: 0.5; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        .animate-art-reveal {
          opacity: 0;
          animation: artReveal 3.5s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }

        .animate-main-logo {
          animation: mainLogo 3s ease-in-out infinite;
        }

        .animate-ring-draw {
          animation: ringDraw 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash;
