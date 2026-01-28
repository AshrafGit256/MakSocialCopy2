
import React, { useState, useEffect } from "react";
import { ArrowRight, Zap, Globe, Users, ShieldCheck, Sparkles, GraduationCap, Radio, Search, MessageSquare, BookOpen, Terminal, Cpu, Activity } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [bootStep, setBootStep] = useState(0);
  const [isBooted, setIsBooted] = useState(false);

  const BOOT_LOGS = [
    "INITIALIZING_NEXUS_CORE...",
    "HANDSHAKE_ESTABLISHED: MAKERERE_GATEWAY_V4.2",
    "UPLINK_STATUS: STABLE (99.98% UPTIME)",
    "DECRYPTING_STUDENT_STRATA...",
    "AUTHORIZING_ACCESS_TERMINAL...",
    "READY."
  ];

  useEffect(() => {
    if (bootStep < BOOT_LOGS.length) {
      const timer = setTimeout(() => setBootStep(prev => prev + 1), 400 + Math.random() * 800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsBooted(true), 500);
    }
  }, [bootStep]);

  if (!isBooted) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
         <div className="w-full max-w-lg space-y-4">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white rounded">
                  <Cpu size={18} className="animate-pulse" />
               </div>
               <span className="text-indigo-500 font-black tracking-widest text-xs uppercase">MakSocial / Registry_Boot</span>
            </div>
            
            {BOOT_LOGS.slice(0, bootStep + 1).map((log, i) => (
              <div key={i} className={`flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest ${i === bootStep ? 'text-white' : 'text-slate-700'}`}>
                 <span className="opacity-40">[{i}]</span>
                 <span>{log}</span>
                 {i === bootStep && <div className="w-2 h-4 bg-indigo-600 animate-pulse"></div>}
              </div>
            ))}
         </div>
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-2">
            <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mx-auto">
               <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(bootStep / BOOT_LOGS.length) * 100}%` }}></div>
            </div>
            <p className="text-[8px] text-slate-800 uppercase tracking-[0.5em] font-black">Secure_Connection_Layer_Active</p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden selection:bg-indigo-500 selection:text-white animate-in fade-in duration-1000">
      
      {/* NAVIGATION BAR - BLURRED FLOATING */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl">
        <div className="bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl border border-[var(--border-color)] rounded-[2.5rem] px-8 py-5 flex justify-between items-center shadow-2xl shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase text-slate-800 dark:text-white">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Protocol</a>
            <a href="#network" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Nodes</a>
            <a href="#vault" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Vault</a>
          </div>

          <button
            onClick={onStart}
            className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* HERO SECTION - UNIVERSITY IMMERSION */}
      <section className="relative pt-60 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[150px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">The Official Hill Protocol / Active</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic">
              Digital <br />
              <span className="text-indigo-600">DNA.</span> <br />
              The Hill.
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed italic">
              "Synchronize with your college hub, access the academic vault, and broadcast opportunities across the most advanced student registry at Makerere."
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button
                onClick={onStart}
                className="bg-indigo-600 text-white px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-4 active:scale-95"
              >
                Initialize Profile <ArrowRight size={20} />
              </button>
              <button className="px-12 py-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white dark:hover:bg-white/5 transition-all active:scale-95">
                Scan Vault
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border-2 border-white/20 shadow-2xl transition-transform duration-700 group-hover:-rotate-1">
               <img 
                 src="https://github.com/AshrafGit256/MakSocialImages/blob/main/Public/makerere_at_night.webp" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt="Makerere Architecture" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
               
               <div className="absolute top-12 left-12 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Hub Live</span>
                  </div>
                  <p className="text-3xl font-black text-white mt-3 uppercase tracking-tighter italic">99.98% Uptime</p>
               </div>

               <div className="absolute bottom-12 left-12 right-12 bg-black/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="text-indigo-400" size={24} />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Latest_Node_Pulse</span>
                  </div>
                  <p className="text-white font-bold leading-relaxed italic text-lg">
                    "89th Guild Inauguration synchronized. Identity protocols verified for all student leaders."
                  </p>
               </div>
            </div>
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* METRIC STRIP */}
      <section className="bg-indigo-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {[
            { label: 'Active Nodes', val: '50k+', icon: <Users size={32}/> },
            { label: 'Academic Units', val: '9 Wings', icon: <GraduationCap size={32}/> },
            { label: 'Asset Scans', val: '1.2M+', icon: <Globe size={32}/> },
            { label: 'Security Guard', val: 'G-v3', icon: <ShieldCheck size={32}/> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 text-white group">
               <div className="p-4 bg-white/10 rounded-3xl group-hover:scale-110 transition-transform group-hover:bg-white/20 shadow-xl">
                  {item.icon}
               </div>
               <h3 className="text-5xl font-black tracking-tighter uppercase italic">{item.val}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-60 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-slate-950 -z-10">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
        </div>
        <div className="max-w-5xl mx-auto space-y-12">
           <h2 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none">
             Join The <br />
             <span className="text-indigo-600">Hill.</span> Protocol.
           </h2>
           <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed italic">
             Makerere's exclusive digital registry. Secure your node and contribute to the Hill's collective pulse.
           </p>
           <button
             onClick={onStart}
             className="bg-white text-indigo-900 px-20 py-8 rounded-[3rem] font-black text-sm uppercase tracking-[0.5em] hover:bg-slate-100 transition-all shadow-2xl active:scale-95 hover:shadow-indigo-500/20"
           >
             Initialize Registration
           </button>
        </div>
      </section>

      <footer className="py-24 px-6 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Zap size={32} className="text-indigo-600 fill-indigo-600" />
            <span className="text-2xl font-black italic tracking-tighter uppercase">MakSocial</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              © 2026 MakSocial Registry Protocol. Makerere University.
            </p>
            <p className="text-[8px] text-slate-400 font-mono uppercase tracking-[0.3em]">Build_4.2.0_STABLE // Gemini_Enhanced</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
