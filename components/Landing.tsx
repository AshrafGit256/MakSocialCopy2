
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  ChevronRight, Activity, Star, 
  MessageCircle, Zap, Image as ImageIcon, Camera,
  Shield, Database, Compass,
  Terminal, GitCommit, Box, Code, Binary,
  ArrowUpRight, Radio, Sparkles, Layers, Search, Plus, Play
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
  { user: "Prof. Nawangwe", role: "Vice Chancellor", text: "Excellence is not a destination, but a synchronized continuous improvement strata. Join the logic.", avatar: "https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg" },
  { user: "Innovation.Pod", role: "Registry Node", text: "New academic logic blocks committed to the Study Vault. 42k files now synchronized.", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=admin" },
  { user: "Guild.Admin", role: "Student Govt", text: "Policy handshake finalized at the Main Hall. Student grants are now being deployed.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guild" }
];

const DYNAMIC_MISSIONS = ["The Future", "Your Network", "The Hill", "Innovation"];

// --- Typewriter Component ---
const TypewriterText = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}<span className="animate-pulse border-r-2 border-current ml-1">&nbsp;</span></span>;
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [signalIndex, setSignalIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const mInterval = setInterval(() => setMissionIndex(p => (p + 1) % DYNAMIC_MISSIONS.length), 4000);
    const sInterval = setInterval(() => setSignalIndex(p => (p + 1) % SIGNALS.length), 6000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(mInterval);
      clearInterval(sInterval);
    };
  }, []);

  return (
    <div className="bg-[#f6f8fa] text-[#1f2328] min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. DYNAMIC NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-700 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-2xl border-b border-slate-200' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-[#1f2328] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Registry v5.2</span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-10">
              {['Repositories', 'Study Vault', 'The Hill', 'Registry Hub'].map(item => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#1f2328] transition-all relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-color)] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#1f2328] hidden sm:block">Portal Login</button>
             <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 hover:-translate-y-1 transition-all active:translate-y-0 active:scale-95">Initialize Sync</button>
          </div>
        </div>
      </nav>

      {/* 2. CINEMATIC HERO (BREATHING BACKGROUND) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Dynamic Helper Video Background */}
        <div className="absolute inset-0 z-0">
           <video 
             autoPlay 
             muted 
             loop 
             playsInline
             className="w-full h-full object-cover opacity-10 grayscale contrast-125"
             src="https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-university-campus-4158-large.mp4"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center z-10 space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full animate-in slide-in-from-top-10 duration-1000">
             <Radio size={14} className="text-rose-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System_Status: Optimal // 4,281 Nodes Connected</span>
          </div>

          <h1 className="text-[14vw] sm:text-[10vw] lg:text-[8.5rem] font-black leading-[0.8] tracking-[ -0.05em] uppercase text-[#1f2328]">
            Syncing <br />
            <span className="relative inline-block h-[1.1em] overflow-hidden align-top w-full">
              {DYNAMIC_MISSIONS.map((word, i) => (
                <span 
                  key={word}
                  className={`absolute left-0 right-0 top-0 transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) transform ${
                    missionIndex === i ? 'translate-y-0 opacity-100' : missionIndex > i ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
                  } italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-color)] to-indigo-600`}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl md:text-3xl text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            Makerere's unified social strata. A digital core for collaboration, academic repository, and real-time student signaling.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
             <button onClick={onStart} className="px-16 py-7 bg-[#1f2328] text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:scale-105 hover:bg-black transition-all flex items-center gap-4 group">
                Establish Protocol <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
             </button>
             <button className="px-16 py-7 bg-white border border-slate-200 text-slate-500 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all shadow-sm flex items-center gap-4 group">
                Explore Vault <Database size={20} className="group-hover:rotate-12 transition-transform" />
             </button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute bottom-20 left-12 hidden lg:block animate-bounce-slow">
           <div className="p-6 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Zap size={24}/></div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Latency</p>
                 <p className="text-xl font-black tabular-nums">14ms</p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. TYPEWRITER SIGNAL FEED (LIVE STRATA) */}
      <section className="py-40 bg-[#fcfcfc] border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-indigo-600">
                <Terminal size={32} />
                <span className="text-[12px] font-black uppercase tracking-[0.6em]">Registry_Stream</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-[#1f2328] tracking-tighter uppercase leading-[0.85]">Live <br /> <span className="text-slate-200">Broadcast.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-lg italic">
                "Direct signals from the university administration and student nodes. Authenticated intelligence in real-time."
              </p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={onStart} className="px-10 py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 active:translate-y-0">
                 View Feed Archive <ChevronRight size={16}/>
              </button>
            </div>
          </div>

          {/* Sequential Typing Signals */}
          <div className="relative h-[450px] flex items-center justify-center">
             <div className="absolute inset-0 bg-white border border-slate-100 rounded-[4rem] shadow-inner"></div>
             
             {SIGNALS.map((signal, i) => (
               <div 
                 key={i} 
                 className={`absolute inset-0 flex items-center justify-center p-8 md:p-16 transition-all duration-1000 ${
                   signalIndex === i ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3 pointer-events-none'
                 }`}
               >
                 <div className="w-full space-y-10">
                    <div className="flex items-center gap-6">
                       <img src={signal.avatar} className="w-20 h-20 rounded-[2.5rem] border-4 border-slate-50 object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000" />
                       <div>
                          <h4 className="text-lg font-black uppercase text-[#1f2328] tracking-tight">{signal.user}</h4>
                          <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-[0.4em]">{signal.role}</p>
                       </div>
                    </div>
                    
                    <div className="min-h-[120px]">
                       <p className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-600 font-serif lowercase italic">
                          {signalIndex === i ? <TypewriterText text={signal.text} /> : null}
                       </p>
                    </div>

                    <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex gap-8">
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Star size={18} className="text-amber-400" /> Validated</div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest"><MessageCircle size={18} className="text-indigo-400" /> Protocol Logged</div>
                       </div>
                       <span className="text-[8px] font-mono text-slate-300 uppercase tracking-[0.5em]">SYNC_ID_{SHA_GEN()}</span>
                    </div>
                 </div>
               </div>
             ))}
             
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {SIGNALS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${signalIndex === i ? 'bg-[var(--brand-color)] w-12' : 'bg-slate-200 w-1.5'}`}></div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 4. VISUAL SECTOR MATRIX (HELP VIDEOS) */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mb-32 space-y-10">
             <div className="flex items-center gap-4 text-[var(--brand-color)]">
               <Layers size={32} />
               <span className="text-[12px] font-black uppercase tracking-[0.6em]">Network_Topology</span>
             </div>
             <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-[#1f2328] uppercase leading-[0.8] animate-pulse-slow">Eight Wings. <br /> <span className="text-slate-200 font-serif italic lowercase">One Strata.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {COLLEGES.map((college, i) => (
              <div 
                key={college.id} 
                className="group relative h-[600px] rounded-[3.5rem] overflow-hidden border border-slate-100 bg-slate-50 transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.3)] cursor-pointer"
              >
                {/* Looping Sector Background Video */}
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  src={college.vid}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-700"></div>

                <div className="absolute inset-0 p-12 flex flex-col justify-end z-10 transition-all duration-500 transform group-hover:-translate-y-4">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="px-6 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20">
                            <span className="text-4xl font-black tracking-tighter text-[#1f2328] group-hover:text-white transition-colors">{college.id}</span>
                         </div>
                         <div className="w-4 h-4 rounded-full bg-[var(--brand-color)] animate-pulse shadow-[0_0_15px_#10918a]"></div>
                      </div>
                      <p className="text-sm font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em] leading-tight">
                         {college.name} <br />
                         <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity mt-2 block">Protocol Node Active</span>
                      </p>
                      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                         <button className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                            Switch Sector <Plus size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC BENTO VAULT */}
      <section className="py-48 px-6 md:px-12 bg-[#fcfcfc] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 bg-[#1f2328] rounded-[4rem] p-16 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl animate-breathing">
             <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 group-hover:scale-150">
                <Zap size={300} fill="currentColor" />
             </div>
             <div className="space-y-10 relative z-10">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/20">
                   <Activity size={14} className="text-emerald-400" /> Accelerator_Sync
                </div>
                <h3 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">Skill <br /> Matrix.</h3>
                <p className="text-white/40 text-xl md:text-2xl font-medium max-w-md leading-relaxed">
                   Connect your research node with cross-college project logic. Over 1,200 active collaborations detected.
                </p>
             </div>
             <button onClick={onStart} className="w-fit mt-16 bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-[var(--brand-color)] hover:text-white transition-all shadow-2xl relative z-10 active:scale-95">
                Join Sync <ArrowUpRight size={20}/>
             </button>
          </div>

          <div className="lg:col-span-5 space-y-10">
             <div className="h-1/2 bg-white border border-slate-100 rounded-[4rem] p-16 shadow-xl flex flex-col justify-between group overflow-hidden relative transition-all hover:border-[var(--brand-color)]">
                <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12"><Shield size={300}/></div>
                <div className="space-y-6 relative z-10">
                   <ShieldCheck size={48} className="text-[var(--brand-color)] mb-4" />
                   <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">The <br />Vault.</h3>
                   <p className="text-slate-400 font-medium">42,000+ academic logic blocks. Past papers, research papers, and study strata.</p>
                </div>
                <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] flex items-center gap-3 group-hover:translate-x-2 transition-transform relative z-10">Access Repository <ChevronRight size={16}/></button>
             </div>

             <div className="h-1/2 bg-[var(--brand-color)] rounded-[4rem] p-16 shadow-2xl flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                   <video 
                     autoPlay 
                     muted 
                     loop 
                     playsInline
                     className="w-full h-full object-cover opacity-10 grayscale brightness-150"
                     src="https://assets.mixkit.co/videos/preview/mixkit-young-man-using-a-laptop-in-a-coffee-shop-4317-large.mp4"
                   />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--brand-color)] shadow-xl shadow-black/10"><Sparkles size={24}/></div>
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Pulse <br />Strata.</h3>
                   <p className="text-white/60 font-medium">Real-time student interaction across the whole campus strata.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="flex -space-x-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-[var(--brand-color)] bg-white/20 backdrop-blur-md" />
                      ))}
                   </div>
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">18.4k Active Nodes</span>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="pt-60 pb-20 px-6 md:px-12 bg-white border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-40">
            <div className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#1f2328] rounded-full flex items-center justify-center shadow-2xl">
                    <Users size={32} className="text-white" />
                  </div>
                  <span className="text-4xl font-black tracking-tighter uppercase text-[#1f2328]">MakSocial</span>
               </div>
               <p className="text-xl text-slate-400 leading-loose font-medium max-w-sm italic">
                  "The definitive digital strata for the Makerere University ecosystem. Built for node synchronization and excellence."
               </p>
            </div>
            {['Registry_Hubs', 'Portal_Services', 'System_Governance'].map(cat => (
              <div key={cat} className="space-y-12">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 border-b border-slate-100 pb-8">{cat}</h3>
                 <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    {['Strategic Sync', 'Node Verification', 'Vault Protocol', 'Strata Access'].map(item => (
                      <li key={item} className="hover:text-[var(--brand-color)] cursor-pointer transition-all flex items-center gap-4 group">
                         <ChevronRight size={14} className="text-slate-100 group-hover:translate-x-2 transition-transform" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
            ))}
          </div>
          <div className="pt-20 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-12">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry | Optimized for Hill Strata Architecture</p>
             <div className="flex gap-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-[#1f2328] transition-colors">Telemetry</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Audit_Log</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Handshake</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1); }
          50% { transform: scale(1.02); box-shadow: 0 60px 100px -30px rgba(0,0,0,0.2); }
        }
        .animate-breathing {
          animation: breathing 10s ease-in-out infinite;
        }
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// --- Helper Functions ---
const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

export default Landing;
