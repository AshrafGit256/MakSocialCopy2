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
  Cpu, Activity, Triangle, Layers
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'CAES', name: 'Agriculture', img: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=800' },
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
      className={`transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;
      setMousePos({ x, y });
    };
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 0. GLOBAL GRAIN OVERLAY - High-end texture */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* 1. KINETIC NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-1000 px-6 md:px-12 ${scrolled ? 'py-4' : 'py-12'}`}>
        <div className={`max-w-screen-2xl mx-auto flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-white/70 backdrop-blur-2xl border border-slate-200/50 p-4 rounded-full shadow-2xl px-10' : ''}`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-[360deg] transition-all duration-1000 shadow-2xl">M</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none italic">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Registry v5.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <a href="#hubs" className="hover:text-slate-950 transition-colors">Wing_Strata</a>
               <a href="#toolkit" className="hover:text-slate-950 transition-colors">Logic_Vault</a>
               <a href="#footer" className="hover:text-slate-950 transition-colors">Directives</a>
            </div>
            <button onClick={onStart} className="bg-slate-950 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95 magnetic-btn">
               Initialize
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: HYPER-EDITORIAL STRATA */}
      <section className="relative min-h-screen flex items-center pt-20 bg-[#fafafa] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-[0.15] grayscale scale-110 blur-sm" 
             alt="Makerere"
           />
           <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[var(--brand-color)] opacity-[0.03] blur-[120px] rounded-full"></div>
           <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-rose-500 opacity-[0.03] blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-8 space-y-16">
            <Reveal className="space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Registry Synchronization Active</span>
              </div>
              
              <div className="relative">
                <h1 className="text-[6rem] md:text-[13rem] font-black leading-[0.75] tracking-[-0.06em] uppercase text-slate-950">
                  Campus <br /> 
                  <span className="text-[var(--brand-color)] italic font-serif normal-case tracking-tight bg-gradient-to-r from-[var(--brand-color)] via-teal-500 to-emerald-500 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">Intelligence.</span>
                </h1>
                {/* Secondary Large Lettering Behind */}
                <div className="absolute -top-10 -left-10 text-[20rem] font-black text-slate-900 opacity-[0.02] pointer-events-none uppercase italic">Sync</div>
              </div>

              <p className="max-w-xl text-xl md:text-3xl text-slate-600 font-medium leading-tight border-l-[12px] border-slate-950 pl-10 py-2">
                A high-fidelity social strata for the elite student body. Connect nodes, sync logic, and lead the future.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <button onClick={onStart} className="w-full sm:w-auto px-16 py-9 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-8 active:scale-95 group">
                  Secure Uplink <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                </button>
                <div className="flex items-center gap-8 px-4">
                   <div className="flex -space-x-5">
                      {[1,2,3,4].map(i => <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-2xl transition-transform hover:scale-110 hover:z-20"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+100}`} /></div>)}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-2xl font-black tracking-tighter">18,400+</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Authenticated Nodes</span>
                   </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FLOATING 3D IDENTITY ASSET */}
          <div className="hidden lg:block lg:col-span-4 relative h-[700px] perspective-1000">
             <Reveal delay={600} className="h-full">
                <div 
                  className="absolute top-0 right-0 w-[440px] bg-white p-1 rounded-[4rem] shadow-[0_100px_200px_-40px_rgba(0,0,0,0.15)] transition-all duration-300 border border-slate-100 overflow-hidden group hover:scale-[1.02]"
                  style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
                >
                   <div className="bg-slate-950 p-12 text-white rounded-t-[3.8rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150"><Cpu size={250}/></div>
                      <div className="relative z-10 space-y-8">
                         <div className="flex justify-between items-start">
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-950 font-black text-3xl shadow-2xl">M</div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><ShieldCheck size={28}/></div>
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Sarah M.</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">Classified Registry Access</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-12 space-y-12 bg-white">
                      <div className="flex justify-between items-center pb-8 border-b border-slate-50">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Hub</p>
                            <p className="text-lg font-black uppercase tracking-tight">Software Engineering / Yr 3</p>
                         </div>
                         <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
                           <CheckCircle size={32}/>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Sync Count</p>
                            <p className="text-2xl font-black tracking-tighter">1,242</p>
                         </div>
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Temporal_Pulse</p>
                            <p className="text-2xl font-black tracking-tighter text-emerald-500 flex items-center gap-3">Online <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div></p>
                         </div>
                      </div>
                      <button onClick={onStart} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.5em] shadow-xl group-hover:bg-[var(--brand-color)] transition-colors active:scale-[0.98]">Manage Identity Node</button>
                   </div>
                </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* 3. THE HUB MARQUEE - Rapid Scanning Hubs */}
      <section id="hubs" className="py-40 bg-white overflow-hidden border-y border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-6 mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
           <Reveal className="space-y-4 border-l-[12px] border-slate-950 pl-10">
              <h2 className="text-8xl font-black uppercase tracking-tighter leading-none">The <br /><span className="text-slate-200 italic font-serif normal-case">Strata.</span></h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] flex items-center gap-3">
                <Radio size={16} className="text-[var(--brand-color)] animate-pulse" /> Live Sector Telemetry
              </p>
           </Reveal>
           <Reveal delay={200} className="hidden md:flex items-center gap-6 text-slate-300">
              <Command size={32} />
              <div className="w-48 h-px bg-slate-100"></div>
           </Reveal>
        </div>

        <div className="relative flex overflow-hidden">
           <div className="flex gap-8 py-10 animate-marquee-horizontal hover:pause transition-all">
              {[...COLLEGES, ...COLLEGES].map((college, i) => (
                <div key={i} className="flex-shrink-0 w-[450px] h-[350px] relative rounded-[3rem] overflow-hidden group shadow-2xl border border-white/20 transition-all hover:scale-[1.03]">
                   <img src={college.img} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                   <div className="absolute inset-0 p-12 flex flex-col justify-end">
                      <div className="space-y-4">
                         <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white text-[9px] font-black uppercase tracking-widest w-fit block">Sector_ID: {college.id}</span>
                         <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{college.name}</h3>
                         <button onClick={onStart} className="flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            Initialize Sync <ChevronRight size={16}/>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. THE TOOLKIT: BENTO GRID LOGIC */}
      <section id="toolkit" className="py-60 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-40">
           <Reveal className="text-center space-y-10">
              <h2 className="text-[8rem] md:text-[14rem] font-black tracking-[-0.08em] uppercase leading-[0.75] text-slate-950">Logic <br /><span className="text-[var(--brand-color)]">Vault.</span></h2>
              <p className="max-w-xl mx-auto text-slate-500 text-3xl font-medium italic leading-relaxed">
                 "Every asset required for academic victory engineered into a single neural interface."
              </p>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-[4rem] overflow-hidden shadow-2xl">
              {[
                { title: 'Study Hub', desc: 'Secure repository for peer-validated lecture logic and academic logs.', icon: <BookOpen />, color: 'text-indigo-600' },
                { title: 'Sector Chat', desc: 'Encrypted peer-to-peer communication within college and hall wings.', icon: <MessageSquare />, color: 'text-rose-500' },
                { title: 'Digital Bazaar', desc: 'Internal student-led economy for services, gear, and essentials.', icon: <Zap />, color: 'text-amber-500' },
                { title: 'Node Identity', desc: 'Verified university-wide digital ID for secure strata access.', icon: <ShieldCheck />, color: 'text-emerald-500' },
                { title: 'Geo Navigation', desc: 'Real-time geospatial guide for every wing, hall, and lecture room.', icon: <Compass />, color: 'text-slate-400' },
                { title: 'Asset Recovery', desc: 'Centralized lost & found synchronization for student belongings.', icon: <Search />, color: 'text-[var(--brand-color)]' }
              ].map((feat, i) => (
                <div key={i} className="bg-white p-20 hover:bg-slate-50 transition-all group relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity scale-[3] group-hover:rotate-12 duration-1000">
                      {/* Fix: Cast feat.icon to React.ReactElement<any> to resolve type errors for 'size' property */}
                      {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 100 })}
                   </div>
                   <div className="space-y-12 relative z-10">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-sm">
                         {/* Fix: Cast feat.icon to React.ReactElement<any> to resolve type errors for 'size' and 'className' properties */}
                         {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 40, className: feat.color })}
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{feat.title}</h3>
                         <p className="text-slate-400 text-xl font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                   </div>
                   <button onClick={onStart} className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.5em] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      Sync Interface <ArrowRight size={14}/>
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. WORDY INDEX FOOTER - Comprehensive Mission & Architecture */}
      <footer id="footer" className="bg-[#05080c] pt-60 pb-20 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] scale-[2.5] rotate-45 pointer-events-none transition-transform duration-[40s] hover:scale-[3]">
           <Layers size={800} fill="currentColor" />
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-60">
            
            {/* Mission Directive */}
            <div className="lg:col-span-6 space-y-12">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[var(--brand-color)] rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl">M</div>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">MakSocial</h2>
              </div>
              <div className="space-y-8 max-w-2xl">
                 <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-[12px] border-white/5 pl-10">
                   MakSocial is established as the definitive digital strata for the Makerere University community. 
                   We facilitate high-fidelity student collaboration by bridging logic nodes across all colleges, 
                   ensuring a synchronized, secure, and intelligent campus experience for the next century of leadership.
                 </p>
                 <div className="flex flex-wrap gap-5 pt-8">
                   <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                      <ShieldCheck className="text-emerald-500" size={24}/>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Integrity Protocol</span>
                         <span className="text-[9px] font-bold text-white/40 uppercase">v5.0 Active</span>
                      </div>
                   </div>
                   <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                      <Target className="text-rose-500" size={24}/>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Range</span>
                         <span className="text-[9px] font-bold text-white/40 uppercase">18,421 Nodes</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Navigation Clusters */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Platform_Nodes</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Home Pulse <ArrowUpRight size={12} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Logic Vault <ArrowUpRight size={12} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Cluster Hub <ArrowUpRight size={12} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Visual Sync <ArrowUpRight size={12} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Bazaar Log <ArrowUpRight size={12} className="opacity-40" /></a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Wing_Sectors</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <li><a href="#" className="hover:text-white transition-colors">COCIS Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CEDAT Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LAW Faculty</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CHS Medical</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CONAS Science</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ALL Sectors</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Registry_Log</h4>
                <ul className="space-y-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <li><a href="#" className="hover:text-white transition-colors">Support Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Strata</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Governance</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner Sync</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Credits & Meta Info */}
          <div className="pt-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-4 flex items-center gap-8">
                <div className="p-6 bg-emerald-500/10 text-emerald-500 rounded-3xl border border-emerald-500/20 shadow-2xl">
                   <Activity size={40}/>
                </div>
                <div>
                   <p className="text-xl font-black uppercase tracking-tighter">Network Authority</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Official Registry of the Makerere Guild</p>
                </div>
             </div>

             <div className="lg:col-span-4 flex flex-col gap-5">
                <div className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors cursor-pointer group">
                   <Mail size={20} className="text-[var(--brand-color)]"/>
                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">registry@maksocial.mak.ac.ug</span>
                   <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all"/>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <MapPin size={20} className="text-[var(--brand-color)]"/>
                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">Main Library Wing, Floor 4, Suite 402</span>
                </div>
             </div>

             <div className="lg:col-span-4 lg:text-right space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 mb-4">Official Infrastructure Partner</p>
                <div className="flex flex-wrap lg:justify-end gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
                   <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="h-8 w-auto" alt="Logo" />
                   <div className="h-8 w-px bg-white/20"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Mak Dev Group</span>
                   <div className="h-8 w-px bg-white/20"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">UniPod Forge</span>
                </div>
             </div>
          </div>

          <div className="mt-60 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.6em]">© 2026 Mak Social Group. Distributed Registry Protocol.</p>
                <p className="text-[9px] font-medium text-white/10 uppercase tracking-[0.4em]">Engineered with pride at COCIS Wing II • Laboratory Alpha</p>
             </div>
             <div className="flex gap-8">
                {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                  <a key={i} href="#" className="p-4 bg-white/5 rounded-full hover:bg-[var(--brand-color)] transition-all hover:-translate-y-2">
                    <Icon size={24} />
                  </a>
                ))}
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes text-shimmer {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }
        .animate-text-shimmer {
          animation: text-shimmer 12s linear infinite;
        }
        @keyframes marqueeHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-horizontal {
          animation: marqueeHorizontal 50s linear infinite;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .magnetic-btn:hover {
          transform: scale(1.1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;