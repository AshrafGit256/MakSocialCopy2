
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
  /* Fix: Added missing Fingerprint icon import */
  Fingerprint
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

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; type?: 'slide' | 'zoom' | 'fade' }> = ({ children, delay = 0, className = '', type = 'slide' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const variants = {
    slide: 'translate-y-12 opacity-0',
    zoom: 'scale-95 opacity-0',
    fade: 'opacity-0'
  };

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : variants[type]
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
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
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
    <div className="bg-white text-slate-950 min-h-screen selection:bg-slate-950 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 0. TEXTURE & SCHEMATICS */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 1. MINIMALIST NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-1000 px-6 lg:px-12 ${scrolled ? 'py-4' : 'py-12'}`}>
        <div className={`max-w-screen-2xl mx-auto flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border border-slate-200 p-4 rounded-full shadow-2xl px-10' : ''}`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center text-white font-black text-xl group-hover:rotate-[360deg] transition-all duration-1000 shadow-2xl">M</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none italic">MakSocial</span>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Hill Registry Protocol</span>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="hidden lg:flex items-center gap-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
               <a href="#sectors" className="hover:text-slate-950 transition-colors">Sectors</a>
               <a href="#blueprint" className="hover:text-slate-950 transition-colors">Blueprint</a>
               <a href="#directives" className="hover:text-slate-950 transition-colors">Directives</a>
            </div>
            <button onClick={onStart} className="bg-slate-950 text-white px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95 group">
               Sync Identity <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE BRAIN OF THE HILL */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-16">
            <Reveal type="fade" className="space-y-12">
              <div className="inline-flex items-center gap-4 px-4 py-1.5 border border-slate-200 rounded-full bg-white/50 backdrop-blur shadow-sm">
                 <Scan size={14} className="text-slate-400 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Global Pulse synchronization active</span>
              </div>

              <div className="relative">
                <h1 className="text-[5rem] md:text-[12rem] font-black leading-[0.75] tracking-[-0.05em] uppercase">
                  Connected <br />
                  <span className="italic font-serif normal-case tracking-tight bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer">Excellence.</span>
                </h1>
                <div className="absolute -top-10 -left-10 text-[20rem] font-black text-slate-900 opacity-[0.02] pointer-events-none italic select-none">HILL</div>
              </div>

              <div className="flex gap-10 items-start border-l-[12px] border-slate-950 pl-10">
                <p className="max-w-md text-xl md:text-2xl text-slate-600 font-medium leading-tight">
                  The definitive digital layer for the Makerere elite. Your academic nodes, synchronized in real-time.
                </p>
                <div className="hidden md:block pt-2">
                   <Boxes size={48} className="text-slate-200" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={300} className="flex flex-col sm:flex-row gap-10 items-center">
              <button onClick={onStart} className="w-full sm:w-auto px-20 py-10 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-8 active:scale-95 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Initialize Uplink <Binary size={24} />
              </button>
              
              <div className="flex flex-col items-start gap-4">
                 <div className="flex -space-x-4">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-2xl hover:z-20 hover:scale-125 transition-transform cursor-pointer"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`} /></div>)}
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-2xl font-black tracking-tighter">18.4K</span>
                    <span className="w-px h-6 bg-slate-200"></span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Nodes Active</span>
                 </div>
              </div>
            </Reveal>
          </div>

          {/* 3D GLASS CARD ASSET */}
          <div className="hidden lg:block lg:col-span-5 relative h-[700px] perspective-1000">
             <Reveal type="zoom" delay={600} className="h-full">
                <div 
                  className="absolute right-0 w-[460px] bg-white/40 backdrop-blur-3xl p-1 rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.2)] transition-all duration-300 border border-white/50 overflow-hidden group hover:bg-white/60"
                  style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
                >
                   <div className="bg-slate-950 p-12 text-white rounded-t-[3.8rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-150"><Binary size={200}/></div>
                      <div className="relative z-10 space-y-10">
                         <div className="flex justify-between items-start">
                            <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-slate-950 font-black text-4xl shadow-2xl">M</div>
                            <div className="flex flex-col items-end gap-1">
                               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Security Class</span>
                               <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/10 rounded-full border border-white/20">Alpha Node</span>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-5xl font-black uppercase tracking-tighter leading-none italic">Opio Eric</h4>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.6em]">Registry ID: #882-991-MAK</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-12 space-y-12">
                      <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-12">
                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Sector</p>
                            <p className="text-lg font-black uppercase tracking-tight text-slate-800">Comp. Science</p>
                         </div>
                         <div className="space-y-2 text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment</p>
                            <p className="text-lg font-black uppercase tracking-tight text-slate-800">Finalist_v5</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Status Protocol</p>
                            <p className="text-2xl font-black text-emerald-500 flex items-center gap-3">Synchronized <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div></p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <Fingerprint size={32} className="text-slate-300" />
                         </div>
                      </div>

                      <button onClick={onStart} className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.5em] shadow-2xl hover:bg-slate-800 transition-colors active:scale-95">Access Terminal</button>
                   </div>
                </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* 3. RAPID SECTOR SCANNER */}
      <section id="sectors" className="py-60 bg-[#05080c] text-white overflow-hidden relative border-y border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-100 opacity-[0.02] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-screen-2xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
           <Reveal className="space-y-4">
              <h2 className="text-[6rem] md:text-[10rem] font-black uppercase tracking-tighter leading-none">The <br /><span className="text-slate-800 italic font-serif normal-case">Strata.</span></h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] flex items-center gap-4">
                <Activity size={20} className="text-emerald-500 animate-pulse" /> Live Telemetry From All Wings
              </p>
           </Reveal>
           <Reveal delay={200} className="hidden md:flex flex-col items-end gap-2 text-slate-600">
              <span className="text-[9px] font-black uppercase tracking-widest">Scanning sequence: ALPHA-9</span>
              <div className="w-64 h-px bg-slate-800"></div>
           </Reveal>
        </div>

        <div className="flex overflow-hidden">
           <div className="flex gap-10 py-10 animate-marquee-horizontal hover:pause transition-all duration-[60s]">
              {[...COLLEGES, ...COLLEGES].map((college, i) => (
                <div key={i} className="flex-shrink-0 w-[500px] h-[400px] relative rounded-[3rem] overflow-hidden group shadow-2xl border border-white/10 bg-slate-900 transition-all hover:scale-105 active:scale-95">
                   <img src={college.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-transparent"></div>
                   <div className="absolute inset-0 p-16 flex flex-col justify-end">
                      <div className="space-y-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                         <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg text-white text-[10px] font-black uppercase tracking-widest w-fit block italic">Sector: {college.id}</span>
                         <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{college.name}</h3>
                         <button onClick={onStart} className="flex items-center gap-5 text-white text-[10px] font-black uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            Initialize Sync <ArrowRight size={18}/>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. BLUEPRINT LOGIC: THE BENTO SYSTEM */}
      <section id="blueprint" className="py-60 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-40">
           <Reveal className="text-center space-y-10">
              <h2 className="text-[7rem] md:text-[14rem] font-black tracking-[-0.08em] uppercase leading-[0.75]">Logic <br /><span className="text-slate-200">Vault.</span></h2>
              <p className="max-w-2xl mx-auto text-slate-500 text-3xl font-medium italic leading-relaxed">
                 "Advanced tools for student intelligence, engineered into a singular high-fidelity strata."
              </p>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
              {[
                { title: 'Study Hub', desc: 'Secure repository for peer-validated lecture logic and academic logs.', icon: <BookOpen />, color: 'text-indigo-600' },
                { title: 'Sector Chat', desc: 'Encrypted peer-to-peer communication within college and hall wings.', icon: <MessageSquare />, color: 'text-rose-600' },
                { title: 'Market Strata', desc: 'The internal student-led economy for services, gear, and essentials.', icon: <Zap />, color: 'text-amber-500' },
                { title: 'Node Identity', desc: 'Verified university-wide digital ID for secure strata access.', icon: <ShieldCheck />, color: 'text-emerald-600' },
                { title: 'Geo Nav', desc: 'Real-time geospatial guide for every wing, hall, and lecture room.', icon: <Compass />, color: 'text-slate-400' },
                { title: 'Recovery Log', desc: 'Centralized lost & found synchronization for student belongings.', icon: <Search />, color: 'text-slate-900' }
              ].map((feat, i) => (
                <div key={i} className="bg-white p-24 hover:bg-slate-50 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[550px]">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity scale-[4] group-hover:rotate-12 duration-1000 pointer-events-none">
                      {feat.icon}
                   </div>
                   <div className="space-y-12 relative z-10">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700 shadow-inner border border-slate-100">
                         {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 40, className: feat.color })}
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{feat.title}</h3>
                         <p className="text-slate-400 text-xl font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                   </div>
                   <button onClick={onStart} className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.6em] text-slate-950 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      Deploy Interface <ArrowRight size={14}/>
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. MASSIVE INDEXED FOOTER - WORDY & AUTHORITATIVE */}
      <footer id="directives" className="bg-[#05080c] pt-60 pb-20 px-6 text-white relative overflow-hidden font-sans selection:bg-white selection:text-black">
        
        {/* Large stylized background logo */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.01] scale-[2] rotate-12 pointer-events-none transition-transform duration-[60s] hover:scale-[2.5]">
           <Boxes size={900} fill="currentColor" />
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          
          {/* Top Section: Identity & Mission Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-60">
            <div className="lg:col-span-6 space-y-12">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center text-slate-950 font-black text-4xl shadow-2xl">M</div>
                <h2 className="text-6xl font-black uppercase tracking-tighter italic">MakSocial</h2>
              </div>
              <div className="space-y-10 max-w-2xl">
                 <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-[16px] border-white/10 pl-12">
                   MakSocial is the definitive digital strata for the Makerere University community. 
                   Our directive is to foster a more connected, collaborative, and intelligent campus experience 
                   through secure synchronization and shared student logic. By bridging the gap between colleges 
                   and halls, we create a singular high-fidelity network for the Hill’s future leaders.
                 </p>
                 <div className="grid grid-cols-2 gap-8 pt-10">
                   <div className="p-8 bg-white/5 rounded-none border border-white/5 flex items-center gap-6 group hover:border-white/20 transition-all">
                      <ShieldCheck className="text-emerald-500" size={32}/>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Integrity Check</span>
                         <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">System v5.2 Active</span>
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 rounded-none border border-white/5 flex items-center gap-6 group hover:border-white/20 transition-all">
                      <Binary className="text-slate-400" size={32}/>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Data Stratum</span>
                         <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">128-bit Encryption</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Navigation Clusters - Wordy Columns */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-100">Strata_Nodes</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">Central Pulse <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">The Study Vault <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">Digital Bazaar <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">Recovery Registry <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">Alumni Uplink <ArrowUpRight size={10} className="opacity-40" /></a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center gap-3">Career Strata <ArrowUpRight size={10} className="opacity-40" /></a></li>
                </ul>
              </div>

              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-100">Wing_Sectors</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">COCIS Wing B</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CEDAT Art Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Law Faculty Hub</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CHS Medical Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CONAS Research</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">COBAMS Finance</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CAES Agri-Strata</a></li>
                </ul>
              </div>

              <div className="space-y-12">
                <h4 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-100">Registry_Log</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">Support Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Charter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Usage Directives</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">System Uptime</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Identity Verifier</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner Sync</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Integrity & Regional Sync */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 pt-32 border-t border-white/5 items-start">
             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-100">Platform Governance</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-widest">
                  The MakSocial platform is managed under the Hill Digital Charter 2026. 
                  Maintenance and oversight are provided by the Mak Dev Group and authorized 
                  Student Guild representatives. All synchronizations are logged.
                </p>
                <div className="flex gap-4">
                   <div className="w-12 h-1 bg-white/20"></div>
                   <div className="w-8 h-1 bg-white/10"></div>
                   <div className="w-4 h-1 bg-white/5"></div>
                </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-100">Endpoint Directives</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-5 text-slate-400 group cursor-pointer hover:text-white transition-all">
                      <Mail size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">registry@maksocial.mak.ac.ug</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-400">
                      <MapPin size={18} className="opacity-40" />
                      <span className="text-[11px] font-black tracking-widest uppercase leading-loose">Main Library Wing, Floor 4, Suite 4A, Kampala, UG</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-400 group cursor-pointer hover:text-white transition-all">
                      <Phone size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">+256 414 531234</span>
                   </div>
                </div>
             </div>

             <div className="lg:text-right space-y-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-100">Authorized Infrastructure</h4>
                <div className="flex flex-wrap lg:justify-end gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
                   <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="h-10 w-auto invert" alt="Official Logo" />
                   <div className="h-12 w-px bg-white/10"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Mak Dev Node</span>
                   <div className="h-12 w-px bg-white/10"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Hill Authority</span>
                </div>
             </div>
          </div>

          {/* Absolute Bottom: Final System Logs */}
          <div className="mt-60 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
             <div className="flex flex-col gap-3">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.8em]">© 2026 Mak Social Group. All Protocols Reserved.</p>
                <p className="text-[9px] font-medium text-white/10 uppercase tracking-[0.4em]">Engineered with intentionality in Sector COCIS Wing II • Cluster A</p>
             </div>
             
             <div className="flex gap-8">
                {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                  <a key={i} href="#" className="p-5 bg-white/5 rounded-none border border-white/5 hover:bg-white hover:text-slate-950 transition-all hover:-translate-y-2">
                    <Icon size={24} />
                  </a>
                ))}
             </div>
          </div>
          
          {/* Visual Divider / Technical Barcode */}
          <div className="mt-20 w-full h-10 flex gap-1 opacity-5 overflow-hidden">
             {[...Array(100)].map((_, i) => (
               <div key={i} className="bg-white shrink-0" style={{ width: `${Math.random() * 5 + 1}px` }}></div>
             ))}
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
          animation: marqueeHorizontal 80s linear infinite;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
};

export default Landing;
