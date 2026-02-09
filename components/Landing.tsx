import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Star, 
  MessageCircle, Zap, Image as ImageIcon, Camera,
  Shield, Database, Compass,
  Terminal, GitCommit, Box, Code, Binary,
  ArrowUpRight, Target, PlayCircle, Cpu, Radio,
  Sparkles, Layers, Search, Plus
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800', desc: 'Neural networks and logic strata' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800', desc: 'Structural logic and creative forge' },
  { id: 'CHUSS', name: 'Humanities & Soc Sci', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800', desc: 'Cultural analysis and social strata' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800', desc: 'Molecular synthesis and raw data' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800', desc: 'Medical nodes and biometrics' },
  { id: 'CAES', name: 'Agricultural & Env', img: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=800', desc: 'Ecological sync and field data' },
  { id: 'COBAMS', name: 'Business & Mgmt', img: 'https://images.unsplash.com/photo-1454165833767-02a6e30996d4?auto=format&fit=crop&w=800', desc: 'Economic flux and capital logic' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800', desc: 'Constitutional nodes and legal protocol' }
];

const SIGNALS = [
  { user: "Prof. Nawangwe", role: "Vice Chancellor", text: "Excellence is not an act, but a synchronized habit. Join the hill's elite strata.", avatar: "https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg" },
  { user: "Innovation.Pod", role: "Tech Wing", text: "New 3D printing nodes active in CEDAT. Book your prototyping sync now.", avatar: "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg" },
  { user: "Guild.Admin", role: "Student Govt", text: "Policy handshake successful. New student grants deployed to the registry.", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=guild" },
  { user: "Library.Node", role: "Registry Hub", text: "Digital archive committed. 42k new research assets now accessible in the Vault.", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=library" }
];

const DYNAMIC_WORDS = ["The Future", "Collaboration", "Innovation", "Excellence", "The Hill"];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [signalIndex, setSignalIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const wordInterval = setInterval(() => setWordIndex(p => (p + 1) % DYNAMIC_WORDS.length), 3000);
    const signalInterval = setInterval(() => setSignalIndex(p => (p + 1) % SIGNALS.length), 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(wordInterval);
      clearInterval(signalInterval);
    };
  }, []);

  return (
    <div className="bg-[#fcfcfc] text-[#1f2328] min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. DYNAMIC NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-700 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-2xl border-b border-slate-200' : 'py-8 bg-transparent border-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-[#1f2328] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Registry v5.2</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-10">
              {['Repositories', 'The Hill', 'Registry Hub', 'Handshake'].map(item => (
                <a key={item} href="#" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1f2328] transition-all relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-color)] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={onStart} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1f2328] hidden sm:block">Portal Login</button>
             <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(16,145,138,0.4)] hover:brightness-110 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95">Enroll Node</button>
          </div>
        </div>
      </nav>

      {/* 2. "BREATHING" HERO SECTION */}
      <section className="relative pt-64 pb-32 px-6 md:px-12 overflow-hidden bg-white border-b border-slate-100">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
           <div className="absolute top-1/4 left-10 w-96 h-96 bg-[var(--brand-color)]/5 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-10 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full animate-in slide-in-from-top-4 duration-1000">
              <Radio size={14} className="text-rose-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Live_Protocol_Streaming // 4.2k Active</span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-[8rem] font-black leading-[0.8] tracking-tighter text-[#1f2328] uppercase">
              Building <br />
              <span className="relative inline-block overflow-hidden h-[1.1em] w-full">
                {DYNAMIC_WORDS.map((word, i) => (
                  <span 
                    key={word}
                    className={`absolute left-0 top-0 transition-all duration-700 transform ${wordIndex === i ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-color)] to-indigo-600`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-slate-100 pl-8">
              Makerere's unified social strata. Synchronize your academic journey, access the hill's elite repository, and forge cross-college connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
              <button onClick={onStart} className="bg-[#1f2328] text-white px-14 py-6 rounded-full font-bold text-xs uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Begin Handshake <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-14 py-6 border border-slate-200 bg-white text-slate-500 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-sm group">
                Explore Vault <Database size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* SEQUENTIAL PULSING SIGNALS */}
          <div className="lg:col-span-5 h-[600px] relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[#fcfcfc] rounded-[4rem] border border-slate-100 shadow-inner"></div>
             
             <div className="relative w-full px-8 md:px-14">
                {SIGNALS.map((signal, i) => (
                  <div 
                    key={i} 
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${
                      signalIndex === i ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-full bg-white border border-slate-100 p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-8 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-1000">
                          <Zap size={140} fill="currentColor" />
                       </div>
                       
                       <div className="flex items-center gap-6 relative z-10">
                          <div className="relative">
                            <img src={signal.avatar} className="w-16 h-16 rounded-3xl border border-slate-50 object-cover shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                          </div>
                          <div>
                             <h4 className="text-base font-black uppercase text-[#1f2328] tracking-tight">{signal.user}</h4>
                             <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-[0.4em]">{signal.role}</p>
                          </div>
                       </div>
                       
                       <p className="text-[20px] font-medium leading-[1.6] text-slate-500 italic relative z-10">"{signal.text}"</p>
                       
                       <div className="flex items-center justify-between pt-8 border-t border-slate-50 relative z-10">
                          <div className="flex gap-6">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Star size={16} className="text-amber-400"/> Authenticated</div>
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><MessageCircle size={16} className="text-indigo-400"/> 42 Commits</div>
                          </div>
                          <span className="text-[8px] font-mono text-slate-300 uppercase tracking-[0.5em]">SIGNAL_SYNC_V5.2</span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* INDICATORS */}
             <div className="absolute bottom-10 flex gap-2">
                {[...Array(SIGNALS.length)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${signalIndex === i ? 'bg-[var(--brand-color)] w-8' : 'bg-slate-200 w-1.5'}`}></div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL COLLEGE MATRIX (REVEAL ON SCROLL) */}
      <section className="py-48 px-6 md:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto">
           <div className="max-w-4xl mb-32 space-y-10">
              <div className="flex items-center gap-4 text-[var(--brand-color)]">
                <Layers size={32} />
                <span className="text-[12px] font-black uppercase tracking-[0.5em]">Network_Topology</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1f2328] uppercase leading-[0.85]">Eight Wings. <br /> <span className="text-slate-200">One Strata.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl">Switching between colleges is seamless. Each wing represents a core intelligence sector of the Hill's registry.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {COLLEGES.map((college, i) => (
                <div 
                  key={college.id} 
                  className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-slate-100 bg-[#f8f9fa] hover:border-[var(--brand-color)] transition-all duration-700 cursor-pointer flex flex-col justify-end p-10 hover:shadow-[0_40px_80px_-20px_rgba(16,145,138,0.2)]"
                >
                   {/* High Fidelity College Background */}
                   <div className="absolute inset-0 overflow-hidden">
                      <img src={college.img} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={college.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-700"></div>
                   </div>
                   
                   <div className="relative z-10 transition-all duration-500 transform group-hover:-translate-y-4 space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="px-5 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20">
                            <span className="text-3xl font-black tracking-tighter text-[#1f2328] group-hover:text-white transition-colors">{college.id}</span>
                         </div>
                         <div className="w-3 h-3 rounded-full bg-[var(--brand-color)] animate-pulse shadow-[0_0_10px_#10918a]"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-400 group-hover:text-white uppercase tracking-widest">{college.name}</p>
                        <p className="text-[10px] font-medium text-slate-500 group-hover:text-white/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700">
                          {college.desc}
                        </p>
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] group-hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 pt-2">
                        Switch Sector <ChevronRight size={14}/>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. THE LIVE MOMENTUM MOSAIC */}
      <section className="py-40 px-6 md:px-12 bg-[#fcfcfc] border-y border-slate-100 relative">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
             <div className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400">
                   <Camera size={40} className="text-rose-500" />
                   <span className="text-[12px] font-black uppercase tracking-[0.6em]">Visual_History</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-[#1f2328] tracking-tighter uppercase leading-[0.85]">Moments from <br /> <span className="text-slate-300">The Global Feed.</span></h2>
             </div>
             <button onClick={onStart} className="px-14 py-5 bg-white border border-slate-200 rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:translate-y-[-5px] transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:translate-y-0 active:scale-95">Open Live Stream</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 auto-rows-[250px]">
             {[
               "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg",
               "https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg",
               "https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg",
               "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg",
               "https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png",
               "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg",
               "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw",
               "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg",
               "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg",
               "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg"
             ].map((url, i) => (
               <div key={i} className={`group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.03] hover:shadow-2xl z-10 ${i % 3 === 0 ? 'md:row-span-2' : ''} ${i % 4 === 0 ? 'md:col-span-2' : ''}`}>
                  <img src={url} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000" alt="Campus Life" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px] gap-4">
                     <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20"><ImageIcon size={32} className="text-white" /></div>
                     <span className="text-[10px] font-black uppercase text-white tracking-[0.4em]">View Artifact</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. BENTO VAULT FEATURE */}
      <section className="py-48 px-6 md:px-12 bg-white relative">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-[4rem] p-16 space-y-10 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12"><Shield size={300}/></div>
              <div className="space-y-8 relative z-10">
                 <div className="p-5 bg-white rounded-3xl w-fit shadow-xl border border-slate-100"><ShieldCheck size={48} className="text-[var(--brand-color)]" /></div>
                 <h3 className="text-5xl font-black uppercase tracking-tighter italic">The Vault.</h3>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                   Over 42,000 academic nodes committed to the central strata. Past papers, research logs, and peer-reviewed intelligence.
                 </p>
              </div>
              <button onClick={onStart} className="w-full py-6 bg-[#1f2328] text-white rounded-3xl font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-black hover:scale-[1.02] transition-all shadow-2xl active:scale-95 relative z-10">Open Repository</button>
           </div>

           <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-[var(--brand-color)] rounded-[4rem] p-16 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 group-hover:scale-125"><Zap size={250} fill="currentColor" /></div>
                 <div className="space-y-8 relative z-10">
                    <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/20">Accelerator_Node</span>
                    <h3 className="text-5xl font-black uppercase tracking-tighter leading-[0.85]">Skill Sync <br /> Matrix</h3>
                    <p className="text-white/60 text-lg font-medium leading-relaxed">Cross-college project logic and internship uplinks.</p>
                 </div>
                 <button onClick={onStart} className="w-fit mt-12 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] hover:text-white/70 transition-colors relative z-10">Sync Signals <ArrowUpRight size={18}/></button>
              </div>

              <div className="bg-[#fcfcfc] border border-slate-200 rounded-[4rem] p-16 flex flex-col justify-between shadow-sm group overflow-hidden">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Hub_Health: Nominal</span>
                    </div>
                    <h3 className="text-5xl font-black uppercase tracking-tighter text-[#1f2328] leading-[0.85]">Live <br />Pulse</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">Real-time student interaction strata. Shared intelligence for the whole campus.</p>
                 </div>
                 <div className="flex items-center gap-6 pt-12 border-t border-slate-100 mt-12">
                    <div className="flex -space-x-4">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} /></div>
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Joined by 18.4k nodes</span>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="pt-48 pb-20 px-6 md:px-12 bg-[#fcfcfc] border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-48">
            
            <div className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1f2328] rounded-full flex items-center justify-center shadow-2xl">
                    <Users size={28} className="text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter uppercase text-[#1f2328]">MakSocial</span>
               </div>
               <p className="text-lg text-slate-400 leading-[2] font-medium max-w-sm italic">
                  The definitive digital strata for the Makerere University ecosystem. Engineered for excellence, built for node synchronization.
               </p>
               <div className="flex gap-10 text-slate-300">
                  <Globe size={28} className="hover:text-[var(--brand-color)] transition-colors cursor-pointer" /> 
                  <Target size={28} className="hover:text-[var(--brand-color)] transition-colors cursor-pointer" /> 
                  <ShieldCheck size={28} className="hover:text-[var(--brand-color)] transition-colors cursor-pointer" /> 
                  <Database size={28} className="hover:text-[var(--brand-color)] transition-colors cursor-pointer" />
               </div>
            </div>

            <div className="space-y-12">
               <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 border-b border-slate-100 pb-8">Registry_Hubs</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  {COLLEGES.slice(0, 6).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-all flex items-center gap-4 group">
                       <ChevronRight size={14} className="text-slate-200 group-hover:translate-x-2 transition-transform" /> {c.name}
                    </li>
                  ))}
                  <li className="text-[var(--brand-color)] font-black cursor-pointer hover:underline pt-4 flex items-center gap-4 group">
                    {/* Fix: Added missing Plus icon import from lucide-react */}
                    <Plus size={14} /> View All Sectors
                  </li>
               </ul>
            </div>

            <div className="space-y-12">
               <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 border-b border-slate-100 pb-8">Portal_Services</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Vault Protocol</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Handshake Engine</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Identity Registry</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Live Pulse Hub</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">System Governance</li>
               </ul>
            </div>

            <div className="space-y-12">
               <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 border-b border-slate-100 pb-8">Handshake_Terms</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Code of Excellence</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Privacy Strata</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Security Logic</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Node Compliance</li>
                  <li className="flex items-center gap-4 text-rose-500 cursor-pointer font-black pt-4">
                     <Binary size={20}/> Report Signal Breach
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-20 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-12 opacity-40">
             <div className="flex flex-col lg:flex-row items-center gap-12">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry Core | Optimized for Hill Architecture</p>
                <div className="hidden xl:flex items-center gap-6">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol_Stable_v5.2.0</span>
                </div>
             </div>
             <div className="flex gap-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">
                <a href="#" className="hover:text-[#1f2328] transition-colors">Archive</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Telemetry</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Uplink</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;