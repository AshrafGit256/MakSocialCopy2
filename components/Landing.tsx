import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  ChevronRight, Activity, Star, 
  MessageCircle, Zap, Image as ImageIcon,
  Shield, Database, Compass,
  Terminal, GitCommit, Box, Code, Binary,
  ArrowUpRight, Radio, Sparkles, Layers,
  Cpu, Command, Radar, Signal, Bot, Lock
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800', vid: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800', vid: 'https://assets.mixkit.co/videos/preview/mixkit-robot-arm-in-a-factory-4416-large.mp4' },
  { id: 'CHUSS', name: 'Humanities & Soc Sci', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800', vid: 'https://assets.mixkit.co/videos/preview/mixkit-man-writing-on-a-notebook-with-a-pen-4318-large.mp4' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800', vid: 'https://assets.mixkit.co/videos/preview/mixkit-microscope-view-of-cells-1122-large.mp4' }
];

const SIGNALS = [
  { user: "Registry.Node_01", role: "Logic Gate", text: "DECRYPTING SEMESTER PARAMETERS... PROTOCOL STABLE.", time: "1.2ms" },
  { user: "Central.Vault", role: "Storage Strata", text: "SYNCING 4,200 ACADEMIC BLOCKS FROM CEDAT HUB.", time: "0.8ms" },
  { user: "Guild.Uplink", role: "Policy Hub", text: "HANDSHAKE SUCCESSFUL: STUDENT ALLOWANCE COMMITTED.", time: "2.4ms" },
  { user: "Library.Core", role: "Intelligence Hub", text: "EXTENDING UPTIME TO 22:00 HRS. ACCESS GRANTED.", time: "1.1ms" }
];

const SHA_GEN = () => Math.random().toString(16).substring(2, 10).toUpperCase();

const TelemetryItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1 border-l-2 border-[var(--brand-color)]/20 pl-4">
    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</span>
    <span className="text-sm font-mono font-bold tracking-tighter text-slate-800">{value}</span>
  </div>
);

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeSignal, setActiveSignal] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const terminalData = [
      "> INITIALIZING_REGISTRY_HANDSHAKE...",
      "> AUTHENTICATING_HILL_STRATA...",
      "> SYNCING_NODE_MANIFESTS...",
      "> UPLINK_STABLE_@_14ms",
      "> ACCESSING_STUDY_VAULT...",
      "> 42,000_ASSETS_DETECTED",
      "> WELCOME_TO_MAKSOCIAL_v5.2"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < terminalData.length) {
        setTerminalLines(prev => [...prev, terminalData[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    const sigInterval = setInterval(() => {
      setActiveSignal(prev => (prev + 1) % SIGNALS.length);
    }, 4000);

    const progressInterval = setInterval(() => {
      setSyncProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 50);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      clearInterval(sigInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. TOP STATUS BAR (GEOMETRIC) */}
      <div className="fixed top-0 left-0 right-0 z-[600] h-1.5 bg-slate-100 overflow-hidden">
        <div 
          className="h-full bg-[var(--brand-color)] transition-all duration-300" 
          style={{ width: `${syncProgress}%` }}
        ></div>
      </div>

      {/* 2. DYNAMIC NAVIGATION */}
      <nav className={`fixed top-1.5 left-0 right-0 z-[500] transition-all duration-700 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-2xl border-b border-slate-200' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-slate-900 rounded-[2px] flex items-center justify-center shadow-2xl group-hover:rotate-90 transition-transform duration-500">
                <Box size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] mt-1">Intelligence Registry</span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-8">
              {['Repositories', 'Study_Vault', 'The_Hill', 'Node_Registry'].map(item => (
                <a key={item} href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-all relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-color)] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={onStart} className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 hidden sm:block">Diagnostic Login</button>
             <button onClick={onStart} className="bg-slate-900 text-white px-10 py-4 rounded-[2px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95 flex items-center gap-3">
                Initialize Sync <ChevronRight size={14}/>
             </button>
          </div>
        </div>
      </nav>

      {/* 3. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#fcfcfc]">
        {/* Background Visual Artifacts */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 border-l border-slate-100 flex items-center justify-center">
              <div className="relative w-full h-full">
                 <img 
                   src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" 
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-[0.03] grayscale pointer-events-none"
                 />
                 {/* Live Terminal Overlay */}
                 <div className="absolute bottom-20 right-12 w-80 p-8 bg-slate-900 rounded-[2px] shadow-2xl space-y-3 font-mono border-t-4 border-[var(--brand-color)] animate-in slide-in-from-right-10 duration-1000 hidden lg:block">
                    {terminalLines.map((line, idx) => (
                      <p key={idx} className="text-[10px] text-emerald-500/80 leading-relaxed font-bold">
                        {line}
                      </p>
                    ))}
                    <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block"></div>
                 </div>
              </div>
           </div>
           {/* Grid Pattern */}
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--border-color) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-4 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <Activity size={14} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Central_Registry: Active // 4,281 Nodes</span>
              </div>
              <h1 className="text-[4rem] md:text-[6rem] xl:text-[7.5rem] font-black leading-[0.85] tracking-[-0.04em] uppercase text-slate-900">
                Registry <br /> 
                <span className="text-[var(--brand-color)]">Protocol.</span>
              </h1>
              <p className="max-w-xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-200 pl-8">
                "Makerere's unified intelligence hub. Synchronize academic assets, broadcast campus signals, and access the Study Vault."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button onClick={onStart} className="px-12 py-7 bg-slate-900 text-white rounded-[2px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                Establish Uplink <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-7 bg-white border border-slate-200 text-slate-500 rounded-[2px] font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group shadow-sm">
                Explore Vault <Database size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-12 pt-8">
              <TelemetryItem label="System_ID" value={`STRATA_${SHA_GEN().slice(0,4)}`} />
              <TelemetryItem label="Nodes_Online" value="18.4K" />
              <TelemetryItem label="Lat_Status" value="14ms" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE SIGNAL FEED (TERMINAL STYLE) */}
      <section className="py-32 bg-slate-900 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none">
           <Radio size={400} className="text-white" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[var(--brand-color)]">
                <Radar size={32} className="animate-pulse" />
                <span className="text-[12px] font-black uppercase tracking-[0.6em]">Registry_Monitor</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">Live <br /> <span className="text-slate-600">Signals.</span></h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
                Real-time data packets originating from the Guild office, faculty wings, and student research nodes. 
              </p>
            </div>
            <button onClick={onStart} className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2px] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3">
               Access Signal Archive <ArrowUpRight size={16}/>
            </button>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2px] p-8 md:p-12 space-y-12 relative shadow-2xl">
                <div className="absolute top-4 right-8 flex gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>

                <div className="space-y-10 animate-in fade-in duration-1000">
                   <div className="flex items-start gap-8">
                      <div className="w-16 h-16 rounded-[2px] bg-[var(--brand-color)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--brand-color)]/20">
                         <Signal size={32} className="text-white" />
                      </div>
                      <div className="space-y-4 flex-1">
                         <div className="flex justify-between items-center">
                            <h4 className="text-xl font-black uppercase text-white tracking-tighter">{SIGNALS[activeSignal].user}</h4>
                            <span className="text-[9px] font-mono text-[var(--brand-color)] font-bold">{SIGNALS[activeSignal].time}</span>
                         </div>
                         <p className="text-2xl font-mono font-bold text-emerald-400/90 leading-tight tracking-tighter">
                            {SIGNALS[activeSignal].text}
                         </p>
                         <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{SIGNALS[activeSignal].role}</span>
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">ID_{SHA_GEN()}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex justify-center gap-4">
                   {SIGNALS.map((_, idx) => (
                     <div 
                       key={idx} 
                       className={`h-1 rounded-full transition-all duration-500 ${activeSignal === idx ? 'bg-[var(--brand-color)] w-12' : 'bg-slate-800 w-2'}`}
                     ></div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. SECTOR EXPLORATION MATRIX */}
      <section className="py-40 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24">
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-400">
                  <Layers size={32} />
                  <span className="text-[12px] font-black uppercase tracking-[0.6em]">Sector_Strata</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase leading-[0.8]">The <span className="text-slate-300">Wings.</span></h2>
             </div>
             <p className="max-w-sm text-slate-500 font-medium leading-relaxed border-r-4 border-slate-100 pr-8 text-right hidden lg:block uppercase text-[10px] tracking-widest">
               Each college hub operates as a specialized intelligence node within the unified registry strata.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {COLLEGES.map((college) => (
               <div key={college.id} className="group relative h-[550px] overflow-hidden bg-slate-900 rounded-[2px] transition-all duration-700 hover:shadow-2xl">
                  <video 
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60 group-hover:grayscale-0"
                    src={college.vid}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-4">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                           <Layers size={24} className="text-white" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                        <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-[0.2em]">{college.name}</p>
                        <div className="pt-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                           <button onClick={onStart} className="w-full py-3 bg-white text-slate-900 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                              Sync Sector <ChevronRight size={14}/>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. SYSTEM CAPABILITIES (BENTO) */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           <div className="lg:col-span-7 bg-slate-900 rounded-[2px] p-16 text-white flex flex-col justify-between relative overflow-hidden group min-h-[600px] shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 group-hover:scale-150">
                 <Cpu size={300} fill="currentColor" />
              </div>
              <div className="space-y-12 relative z-10">
                 <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10">
                    <Activity size={14} className="text-[var(--brand-color)]" /> Registry_Assistant_Node
                 </div>
                 <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">Neural <br /> <span className="text-[var(--brand-color)]">Search.</span></h3>
                 <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-md leading-relaxed italic">
                    "Leverage our integrated AI assistant to navigate campus logic and synchronize with the study strata."
                 </p>
              </div>
              <button onClick={onStart} className="w-fit mt-16 bg-white text-slate-900 px-12 py-5 rounded-[2px] font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[var(--brand-color)] hover:text-white transition-all shadow-2xl relative z-10">
                 Initialize Assistant <Bot size={20}/>
              </button>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <div className="h-1/2 bg-white border border-slate-200 rounded-[2px] p-12 shadow-sm flex flex-col justify-between group overflow-hidden relative transition-all hover:border-[var(--brand-color)]">
                 <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12"><Shield size={300}/></div>
                 <div className="space-y-6 relative z-10">
                    <ShieldCheck size={48} className="text-[var(--brand-color)] mb-4" />
                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Registry <br /> Vault.</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">Secure academic repository featuring 42k+ logic blocks, past papers, and research strata.</p>
                 </div>
                 <button onClick={onStart} className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] flex items-center gap-3 group-hover:translate-x-2 transition-transform relative z-10">Access Manifest <ChevronRight size={16}/></button>
              </div>

              <div className="h-1/2 bg-[var(--brand-color)] rounded-[2px] p-12 shadow-2xl flex flex-col justify-between group relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="space-y-6 relative z-10">
                    <div className="w-12 h-12 bg-white flex items-center justify-center text-[var(--brand-color)] shadow-xl"><Sparkles size={24}/></div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Hill <br /> Pulse.</h3>
                    <p className="text-white/80 font-medium text-sm leading-relaxed">Direct peer-to-peer signal exchange across the university strata.</p>
                 </div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="flex -space-x-3">
                       {[...Array(4)].map((_, i) => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--brand-color)] bg-white/30" />
                       ))}
                    </div>
                    <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">18.4K Active Nodes</span>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* 7. INSTITUTIONAL FOOTER */}
      <footer className="pt-40 pb-16 px-6 md:px-12 bg-white border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-[2px] flex items-center justify-center shadow-xl">
                    <Box size={24} className="text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
               </div>
               <p className="text-sm text-slate-400 leading-loose font-medium italic border-l-2 border-slate-100 pl-6">
                  "The primary intelligence strata for the Makerere ecosystem. Built for node synchronization and strategic collaboration."
               </p>
            </div>
            {['System_Hubs', 'Node_Registry', 'Governance'].map(cat => (
              <div key={cat} className="space-y-10">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 border-b border-slate-100 pb-6">{cat}</h3>
                 <ul className="space-y-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    {['Strategic Sync', 'Node Verification', 'Vault Protocol', 'Strata Access'].map(item => (
                      <li key={item} className="hover:text-[var(--brand-color)] cursor-pointer transition-all flex items-center gap-4 group">
                         <GitCommit size={14} className="text-slate-100 group-hover:text-[var(--brand-color)] transition-colors" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
          </div>
          <div className="pt-16 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry | Hill Strata Architecture v5.2</p>
             <div className="flex gap-12 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2"><Activity size={12}/> Telemetry</a>
                <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2"><ShieldCheck size={12}/> Audit_Log</a>
                {/* Fix: Added missing Lock icon to lucide-react imports */}
                <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2"><Lock size={12}/> Handshake</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </div>
  );
};

export default Landing;