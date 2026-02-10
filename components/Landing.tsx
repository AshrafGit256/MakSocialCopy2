
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  BookOpen, Star, Camera, Zap, Layout, 
  Laptop, ArrowUpRight, ChevronRight, 
  Globe, ShieldCheck, Target, Command, 
  Play, MousePointer2, Sparkles, Radio,
  CheckCircle, Plus, Search, Compass,
  Database, Terminal, Share2, Heart,
  Instagram, Twitter, Facebook, Github,
  Mail, Phone, MapPin, ExternalLink,
  Cpu, Activity, Triangle, Layers,
  Boxes, GitBranch, Scan, Binary,
  Fingerprint, ArrowDown, MoveRight,
  Maximize2, Radar
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const MAK_IMAGES = [
  { url: 'https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg', label: 'Main Administration Node', id: 'ADMIN-01' },
  { url: 'https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg', label: 'The Vault: Main Library', id: 'LIB-02' },
  { url: 'https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg', label: 'Freedom Square Assembly', id: 'SQ-03' },
  { url: 'https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg', label: 'Innovation Forge (UniPod)', id: 'FORGE-04' },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'School of Law', img: 'https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
];

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 15, y: (e.clientY / window.innerHeight - 0.5) * 15 });
    };
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(winScroll / height);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-slate-900 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 0. TECHNICAL OVERLAY & GRAIN */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed top-0 left-0 w-full h-[2px] bg-slate-100 z-[2000]">
        <div className="h-full bg-[var(--brand-color)] transition-all duration-100" style={{ width: `${scrollProgress * 100}%` }}></div>
      </div>

      {/* 1. STARK NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-6 lg:p-12 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1 group cursor-pointer pointer-events-auto" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <span className="text-3xl font-black tracking-tighter leading-none italic">MAKSOCIAL.</span>
          <span className="text-[8px] font-bold tracking-[0.6em] text-slate-400">REGISTRY_v5.0_ALPHA</span>
        </div>
        
        <div className="flex flex-col items-end gap-10 pointer-events-auto">
          <button onClick={onStart} className="bg-slate-950 text-white px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95">
             Initialize_Uplink
          </button>
          <div className="hidden lg:flex flex-col items-end gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
             <a href="#strata" className="hover:text-slate-950 transition-colors">The_Strata</a>
             <a href="#logic" className="hover:text-slate-950 transition-colors">Logic_Vault</a>
             <a href="#directives" className="hover:text-slate-950 transition-colors">Directives</a>
          </div>
        </div>
      </nav>

      {/* 2. HERO: CINEMATIC HILL STRATA */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover grayscale opacity-[0.08] transition-all duration-[3s] hover:grayscale-0 hover:opacity-20 scale-110" 
             alt="Makerere Main"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 w-full relative z-10 text-center">
          <Reveal className="space-y-12">
            <div className="inline-flex items-center gap-4 px-5 py-2 border border-slate-200 rounded-full bg-white/50 backdrop-blur shadow-sm">
               <Radar size={14} className="text-rose-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Scanning Campus Sectors...</span>
            </div>

            <div className="relative">
              <h1 className="text-[8vw] md:text-[14vw] font-black leading-[0.75] tracking-[-0.05em] uppercase text-slate-950">
                Nexus of <br />
                <span className="italic font-serif normal-case tracking-tight text-slate-200" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>The Hill.</span>
              </h1>
              <div className="absolute -top-10 -left-10 text-[20vw] font-black text-slate-900 opacity-[0.01] pointer-events-none italic select-none">MAK</div>
            </div>

            <div className="flex flex-col items-center gap-12 pt-10">
              <p className="max-w-xl text-xl md:text-3xl text-slate-500 font-medium leading-tight italic border-l-[12px] border-slate-900 pl-8">
                The definitive high-fidelity strata for the student body. Synchronize logic, build nodes, and lead.
              </p>
              
              <button onClick={onStart} className="flex items-center gap-10 group bg-slate-950 px-12 py-8 rounded-[2rem] text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all">
                 <span className="text-2xl font-black uppercase tracking-widest group-hover:italic transition-all">Enter Protocol</span>
                 <div className="w-12 h-12 bg-[var(--brand-color)] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform shadow-2xl">
                    <ArrowRight size={24} />
                 </div>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-12 hidden lg:flex items-center gap-6">
           <div className="w-px h-24 bg-slate-200"></div>
           <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Network Intensity</span>
              <span className="text-xl font-black tabular-nums">18,421 NODES</span>
           </div>
        </div>
      </section>

      {/* 3. ASYMMETRICAL ARCHITECTURAL GALLERY */}
      <section id="strata" className="py-40 bg-[#fafafa] overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 mb-32 space-y-4">
           <Reveal className="border-l-[16px] border-slate-950 pl-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">The_Strata_Catalog</span>
              <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none">Sector <br /><span className="text-slate-200 italic font-serif normal-case">Architecture.</span></h2>
           </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 lg:px-12 max-w-[1800px] mx-auto">
          {/* Main Visual Node */}
          <Reveal className="lg:col-span-8 group relative h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100">
             <img src={MAK_IMAGES[0].url} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
             <div className="absolute bottom-12 left-12 space-y-4">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-[10px] font-black uppercase tracking-widest w-fit block italic">Node_ID: {MAK_IMAGES[0].id}</span>
                <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">{MAK_IMAGES[0].label}</h3>
                <button onClick={onStart} className="flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-all">
                  Initialize Scan <ChevronRight size={16}/>
                </button>
             </div>
          </Reveal>

          {/* Secondary Stack */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {MAK_IMAGES.slice(1, 3).map((img, i) => (
              <Reveal key={i} delay={i * 200} className="group relative flex-1 min-h-[340px] rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 bg-white">
                <img src={img.url} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent group-hover:from-slate-950/40 transition-all"></div>
                <div className="absolute bottom-8 left-8">
                   <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-800 group-hover:text-white transition-colors">{img.label}</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-white/60">Registry Sync v5.0</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE HUB STRATA: EXPANDING CARDS */}
      <section className="py-60 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 opacity-50"></div>
        
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10 items-center">
           <div className="lg:col-span-4 space-y-12">
              <Reveal className="space-y-6">
                 <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.85]">College <br /><span className="text-[var(--brand-color)]">Logic.</span></h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed italic pr-12">
                   "Every college is a synchronized logic node. Bridging the gap between engineering, art, and medicine."
                 </p>
              </Reveal>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Uptime', val: '99.9%' },
                   { label: 'Latency', val: '14ms' },
                   { label: 'Security', val: 'Alpha' },
                   { label: 'Verified', val: '100%' }
                 ].map((stat, i) => (
                   <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                      <span className="text-lg font-black">{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 h-[500px]">
              {COLLEGES.map((college, i) => (
                <Reveal key={college.id} delay={i * 100} className="h-full">
                  <div className="group h-full relative rounded-[3rem] overflow-hidden border border-slate-200 transition-all hover:flex-[2] cursor-pointer shadow-2xl">
                     <img src={college.img} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-100"></div>
                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">{college.id}</span>
                        <h4 className="text-lg font-black text-white text-center uppercase tracking-tight leading-none group-hover:scale-110 transition-transform">{college.name}</h4>
                     </div>
                  </div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* 5. LOGIC VAULT: BENTO SYSTEM */}
      <section id="logic" className="py-60 bg-[#05080c] text-white">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-40">
           <Reveal className="text-center space-y-12">
              <h2 className="text-[10vw] font-black tracking-[-0.08em] uppercase leading-[0.75]">Digital <br /><span className="text-slate-800 italic">Vault.</span></h2>
              <div className="flex items-center justify-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
                 <div className="h-px w-20 bg-slate-800"></div>
                 Protocol Execution Modules
                 <div className="h-px w-20 bg-slate-800"></div>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              {[
                { title: 'Study Hub', desc: 'Secure repository for peer-validated lecture logic and academic logs.', icon: <BookOpen />, color: 'text-indigo-400' },
                { title: 'Sector Chat', desc: 'Encrypted peer-to-peer communication within college and hall wings.', icon: <MessageSquare />, color: 'text-rose-400' },
                { title: 'Market Bazaar', desc: 'The internal student-led economy for services, gear, and essentials.', icon: <Zap />, color: 'text-amber-400' },
                { title: 'Node Identity', desc: 'Verified university-wide digital ID for secure strata access.', icon: <ShieldCheck />, color: 'text-emerald-400' },
                { title: 'Geo Nav', desc: 'Real-time geospatial guide for every wing, hall, and lecture room.', icon: <Compass />, color: 'text-slate-400' },
                { title: 'Registry Log', desc: 'Centralized lost & found synchronization for student belongings.', icon: <Search />, color: 'text-[var(--brand-color)]' }
              ].map((feat, i) => (
                <div key={i} className="bg-slate-900 p-24 hover:bg-slate-950 transition-all group relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity scale-[4] group-hover:rotate-12 duration-1000">
                      {feat.icon}
                   </div>
                   <div className="space-y-12 relative z-10">
                      <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl">
                         {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 40, className: feat.color })}
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{feat.title}</h3>
                         <p className="text-slate-500 text-xl font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                   </div>
                   <button onClick={onStart} className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.6em] text-white/30 group-hover:text-white transition-all translate-y-4 group-hover:translate-y-0">
                      Deploy Interface <ArrowRight size={14}/>
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. WORDY INSTITUTIONAL FOOTER: THE SUPERSTRUCTURE */}
      <footer id="directives" className="bg-white pt-60 pb-20 px-6 border-t border-slate-100 relative overflow-hidden font-sans">
        
        {/* Massive Background Typography */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] scale-[2.5] rotate-12 pointer-events-none transition-transform duration-[60s] hover:scale-[3]">
           <Layers size={900} fill="currentColor" />
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          
          {/* Manifesto Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-60">
            <div className="lg:col-span-6 space-y-16">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-950 rounded-none flex items-center justify-center text-white font-black text-4xl shadow-2xl">M</div>
                <h2 className="text-6xl font-black uppercase tracking-tighter italic">MakSocial.</h2>
              </div>
              <div className="space-y-12 max-w-2xl">
                 <p className="text-3xl text-slate-400 font-medium leading-tight italic border-l-[16px] border-slate-100 pl-12">
                   MakSocial is established as the definitive digital strata for the Makerere University community. 
                   Our directive is to foster a more connected, collaborative, and intelligent campus experience 
                   through secure synchronization and shared student logic.
                 </p>
                 <div className="grid grid-cols-2 gap-10 pt-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="text-emerald-500" size={24}/>
                         <span className="text-[11px] font-black uppercase tracking-widest">Integrity Protocol</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                         End-to-end encryption for all academic exchanges. Identity validation required for node entry.
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Target className="text-rose-500" size={24}/>
                         <span className="text-[11px] font-black uppercase tracking-widest">Target Alignment</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                         Optimizing student workflow through centralized asset recovery and real-time navigation logic.
                      </p>
                   </div>
                 </div>
              </div>
            </div>

            {/* MONOLITHIC INDEX COLUMNS */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-950 border-b border-slate-900 pb-2 w-fit">Registry_Nodes</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">Home Pulse <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">The Study Vault <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">Digital Bazaar <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">Visual Sync <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">Alumni Uplink <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors flex items-center gap-3">Career Strata <ArrowUpRight size={10} className="opacity-40" /></a></li>
                </ul>
              </div>

              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-950 border-b border-slate-900 pb-2 w-fit">Wing_Sectors</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-slate-950 transition-colors">COCIS Wing B</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">CEDAT Art Node</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Law Faculty Hub</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">CHS Medical Wing</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">CONAS Research</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">COBAMS Finance</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">CAES Agri-Strata</a></li>
                </ul>
              </div>

              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-950 border-b border-slate-900 pb-2 w-fit">Directives</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Support Node</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Privacy Strata</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Usage Rules</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">System Uptime</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Identity Verifier</a></li>
                  <li><a href="#" className="hover:text-slate-950 transition-colors">Partner Sync</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Integrity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 pt-32 border-t border-slate-100 items-start">
             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950">Platform Governance</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                  The MakSocial platform is managed under the Hill Digital Charter 2026. 
                  Maintenance and synchronization are provided by the Mak Dev Group and authorized 
                  Student Guild representatives. All connections are encrypted via the Hill Integrity Protocol.
                </p>
                <div className="flex gap-4">
                   <div className="w-12 h-0.5 bg-slate-950"></div>
                   <div className="w-8 h-0.5 bg-slate-400"></div>
                   <div className="w-4 h-0.5 bg-slate-200"></div>
                </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950">Node_Endpoints</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-5 text-slate-500 hover:text-slate-950 transition-all cursor-pointer group">
                      <Mail size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">registry@maksocial.mak.ac.ug</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-500">
                      <MapPin size={18} className="opacity-40" />
                      <span className="text-[11px] font-black tracking-widest uppercase leading-loose">Main Library Wing, Floor 4, Suite 4A, Kampala, UG</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-500 hover:text-slate-950 transition-all cursor-pointer group">
                      <Phone size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">+256 414 531234</span>
                   </div>
                </div>
             </div>

             <div className="lg:text-right space-y-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950">Infrastructure</h4>
                <div className="flex flex-wrap lg:justify-end gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
                   <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="h-10 w-auto" alt="Official Logo" />
                   <div className="h-12 w-px bg-slate-200"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Mak Dev Group</span>
                   <div className="h-12 w-px bg-slate-200"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Hill Authority</span>
                </div>
             </div>
          </div>

          <div className="mt-60 pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
             <div className="flex flex-col gap-3">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.8em]">© 2026 Mak Social Group. All Rights Reserved.</p>
                <p className="text-[9px] font-medium text-slate-200 uppercase tracking-[0.4em]">Engineered with pride in Sector COCIS Wing II • Cluster A</p>
             </div>
             
             <div className="flex items-center gap-10">
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">Privacy_Charter</a>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">System_Status</a>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">Support_Node</a>
             </div>
          </div>
          
          <div className="mt-20 w-full h-[1px] bg-slate-100"></div>
        </div>
      </footer>

      <style>{`
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;
