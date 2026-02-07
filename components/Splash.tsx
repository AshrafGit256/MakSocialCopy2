
import React, { useEffect, useState } from 'react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState("Welcome...");
  
  const letters = "MAKSOCIAL".split("");

  useEffect(() => {
    // Simple status messages
    const messages = [
      "Welcome...",
      "Connecting to campus...",
      "Getting things ready...",
      "Almost there..."
    ];

    let msgIdx = 0;
    const statusInterval = setInterval(() => {
      setStatusText(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 900);

    // Smooth progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 30);

    // Time to show the app
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 800);
    }, 4000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#10918a] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-8">
        
        {/* THE WORD "MAK SOCIAL" */}
        <div className="flex gap-1 md:gap-2">
          {letters.map((char, i) => (
            <span 
              key={i} 
              className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter animate-letter-flow"
              style={{ 
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* MODERN LOADER */}
        <div className="w-48 md:w-64 space-y-4">
           <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           
           <p className="text-center text-[10px] font-bold text-white/80 uppercase tracking-[0.3em] animate-pulse">
              {statusText}
           </p>
        </div>
      </div>

      {/* FOOTER TEXT */}
      <div className="absolute bottom-12">
         <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Makerere University</p>
      </div>

      <style>{`
        @keyframes letterFlow {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
            color: #ffffff;
            filter: blur(10px);
          }
          20% { 
            opacity: 1; 
            transform: translateY(0);
            filter: blur(0px);
          }
          40% {
            color: #fbbf24; /* Soft Gold */
          }
          60% {
            color: #5eead4; /* Bright Teal */
          }
          80% {
            color: #ffffff; /* Back to White */
          }
          100% {
            opacity: 0.5; /* Dimming out */
            transform: scale(0.98);
          }
        }

        .animate-letter-flow {
          opacity: 0;
          animation: 
            letterFlow 3s ease-in-out forwards,
            breath 2s ease-in-out infinite 3.2s;
        }

        @keyframes breath {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Splash;
