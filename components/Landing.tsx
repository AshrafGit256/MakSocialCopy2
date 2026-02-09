
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  BookOpen, Star, Camera, Zap, Layout, 
  Laptop, ArrowUpRight, ChevronRight, 
  Globe, ShieldCheck, Target, Command, 
  Play, MousePointer2, Sparkles, Radio,
  CheckCircle, Plus, Search, Compass,
  Database, Terminal, Share2
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800', size: 'wide' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800', size: 'tall' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800', size: 'small' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800', size: 'small' },
];

const CHAT_LOG = [
  { sender: "Sarah", text: "Has the CS workshop started?" },
  { sender: "Eric", text: "Yeah, room B102. Hurry up! 🏃‍♂️" },
  { sender: "Sarah", text: "On my way! Save me a seat." },
];

/* Fix: Added className?: string to props and merged it into the returned div's className string */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; type?: 'slide' | 'zoom' | 'fade'; className?: string }> = ({ children, delay = 0, type = 'slide', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animations = {
    slide: 'translate-y-16 opacity-0',
    zoom: 'scale-90 opacity-0',
    fade: 'opacity-0'
  };

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : animations[type]
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [chatIdx, setChatIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, mins: 45, secs: 12 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    const chatTimer = setInterval(() => {
      setChatIdx(prev => (prev + 1) % (CHAT_LOG.length + 1));
    }, 3500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(chatTimer);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 0. GRAIN OVERLAY - High-end texture */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* 1. ARCHITECTURAL NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 px-6 md:px-12 ${scrolled ? 'py-4' : 'py-12'}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border border-slate-200/50 p-4 rounded-3xl shadow-2xl' : ''}`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-[360deg] transition-all duration-1000 shadow-lg">M</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Registry Protocol</span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <a href="#hubs" className="hover:text-slate-900 transition-colors cursor-pointer">Wings_Strata</a>
               <a href="#gala" className="hover:text-slate-900 transition-colors cursor-pointer">Event_Node</a>
               <a href="#toolkit" className="hover:text-slate-900 transition-colors cursor-pointer">Log_Assets</a>
            </div>
            <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95">
               Initialize
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: LAYERED DEPTH EDITORIAL */}
      <section className="relative min-h-screen flex items-center pt-20 bg-white overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0 overflow-hidden">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-80 grayscale-[20%] transition-transform duration-[20s] hover:scale-105" 
             alt="Makerere"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-8 space-y-12">
            <Reveal type="fade">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur shadow-sm rounded-full border border-slate-200">
                  <Sparkles size={14} className="text-[var(--brand-color)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Established 1922 • Registry v5.0</span>
                </div>
                <h1 className="text-[5.5rem] md:text-[11.5rem] font-black leading-[0.75] tracking-[-0.07em] uppercase text-slate-900">
                  Campus <br /> 
                  <span className="text-[var(--brand-color)] italic font-serif normal-case tracking-tight pr-4 animate-text-shimmer bg-gradient-to-r from-[var(--brand-color)] via-emerald-500 to-[var(--brand-color)] bg-[length:200%_auto] bg-clip-text text-transparent">Intelligence.</span>
                </h1>
                <p className="max-w-xl text-xl md:text-3xl text-slate-700 font-medium leading-tight border-l-8 border-slate-900 pl-10 py-2">
                  A high-fidelity social strata for the student body. <br />
                  Connect nodes, sync logic, and lead the future.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button onClick={onStart} className="px-16 py-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-6 active:scale-95 group">
                  Authenticate Node <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center gap-6 px-4">
                   <div className="flex -space-x-4">
                      {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-xl"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} /></div>)}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tighter">18.4k+</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nodes Synced</span>
                   </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FLOATING IDENTITY ASSET - Reactive Parallax */}
          <div className="hidden lg:block lg:col-span-4 relative h-[600px] perspective-1000">
             <Reveal type="zoom" delay={500}>
                <div 
                  className="absolute top-0 right-0 w-[420px] bg-white p-1 rounded-[3.5rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.2)] transition-transform duration-200 border border-slate-100 overflow-hidden group"
                  style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
                >
                   <div className="bg-slate-950 p-10 text-white rounded-t-[3rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150"><Users size={200}/></div>
                      <div className="relative z-10 space-y-6">
                         <div className="flex justify-between items-start">
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl">M</div>
                            <div className="p-3 bg-white/10 rounded-xl"><Globe size={24}/></div>
                         </div>
                         <div>
                            <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">Brian K.</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Certified Registry Identity</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-10 space-y-10 bg-white">
                      <div className="flex justify-between items-center pb-8 border-b border-slate-50">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Stratum</p>
                            <p className="text-base font-black uppercase tracking-tight">Software Engineering / Yr 3</p>
                         </div>
                         <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                           <CheckCircle size={28}/>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Signal Count</p>
                            <p className="text-xl font-black tracking-tighter">142</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Uplink Status</p>
                            <p className="text-xl font-black tracking-tighter text-emerald-500 flex items-center gap-2">Live <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div></p>
                         </div>
                      </div>
                      <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl group-hover:bg-[var(--brand-color)] transition-colors">Initialize Sync</button>
                   </div>
                </div>
             </Reveal>

             {/* FLOATING CHAT OVERLAY */}
             <div className="absolute -bottom-10 -left-10 w-[320px] bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-6 shadow-2xl animate-float-slow z-20 transition-transform duration-500" style={{ transform: `translateX(${mousePos.x * -0.5}px) translateY(${mousePos.y * -0.5}px)` }}>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/30 pb-4">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Comms</span>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col items-start gap-1">
                      <div className="px-4 py-2.5 bg-slate-100 rounded-2xl rounded-bl-none text-xs font-medium">Coming to Freedom Square?</div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <div className="px-4 py-2.5 bg-[var(--brand-color)] text-white rounded-2xl rounded-br-none text-xs font-medium shadow-lg">Confirming protocol.</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO HUB GRID - High Impact Arrangement */}
      <section id="hubs" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
           <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-l-8 border-slate-900 pl-10">
                 <div className="space-y-4">
                    <h2 className="text-7xl font-black uppercase tracking-tighter leading-none">Explore <br /> <span className="text-slate-300 italic font-serif normal-case tracking-tight">The Wings.</span></h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3"><Radio size={16} className="text-[var(--brand-color)] animate-pulse" /> Global Sector Synchronization Active</p>
                 </div>
                 <div className="hidden md:flex items-center gap-4 text-slate-300">
                    <Command size={24}/>
                    <div className="h-px w-32 bg-slate-100"></div>
                 </div>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 h-auto md:h-[750px]">
              {COLLEGES.map((college, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <div className={`h-full relative rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-xl transition-all hover:scale-[1.01] border border-slate-100 ${
                    college.size === 'wide' ? 'md:col-span-2' : 
                    college.size === 'tall' ? 'md:row-span-2' : ''
                  }`}>
                    <img src={college.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                       <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                          <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.name}</p>
                          <div className="pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
                                Sync Hub <ChevronRight size={16}/>
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="bg-slate-50 rounded-[3.5rem] p-12 flex flex-col justify-center items-center text-center space-y-6 border border-dashed border-slate-300">
                 <div className="p-6 bg-white rounded-full shadow-2xl text-slate-300 animate-bounce-slow"><Plus size={32}/></div>
                 <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Sector expansion pending</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. THE SIGNATURE EVENT: GALA 2026 */}
      <section id="gala" className="py-40 bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-color)] opacity-5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6 space-y-12 order-2 lg:order-1">
               <Reveal delay={200}>
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 text-rose-500">
                        <Star size={32} fill="currentColor" className="animate-pulse" />
                        <span className="text-[12px] font-black uppercase tracking-[0.6em]">Premium Event Protocol</span>
                     </div>
                     <h2 className="text-[6rem] md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] text-white">The <br /> <span className="text-slate-600 italic font-serif normal-case tracking-tight">Gala.</span></h2>
                     <p className="text-2xl text-slate-400 font-medium italic border-l-4 border-rose-500 pl-10 py-2 leading-relaxed">
                        "A century of legacy, one night of celebration. Reconnect with the hill at Freedom Square."
                     </p>
                  </div>
               </Reveal>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { val: timeLeft.days, label: 'DAYS' },
                    { val: timeLeft.hours, label: 'HOURS' },
                    { val: timeLeft.mins, label: 'MINS' },
                    { val: timeLeft.secs, label: 'SECS' }
                  ].map(u => (
                    <Reveal key={u.label} delay={400}>
                       <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center backdrop-blur-md group hover:bg-rose-600 transition-all">
                          <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{u.val.toString().padStart(2, '0')}</p>
                          <p className="text-[8px] font-black uppercase text-slate-500 group-hover:text-white/80 tracking-widest mt-1">{u.label}</p>
                       </div>
                    </Reveal>
                  ))}
               </div>

               <Reveal delay={600}>
                  <button onClick={onStart} className="w-full md:w-auto px-16 py-8 bg-rose-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-[0_25px_60px_rgba(225,29,72,0.3)] hover:bg-rose-700 transition-all flex items-center justify-center gap-6 active:scale-95 group">
                    Secure Entry Pass <ArrowUpRight size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"/>
                  </button>
               </Reveal>
            </div>

            <div className="lg:col-span-6 relative order-1 lg:order-2">
               <Reveal type="zoom">
                  <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative group">
                     <img src="https://campusbee.ug/wp-content/uploads/2022/10/MAK-Gala.jpg" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                     <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Confirmed Venue</p>
                           <p className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3"><Globe size={24} className="text-rose-500"/> Freedom Square</p>
                        </div>
                        <button className="p-6 bg-white rounded-[2rem] shadow-2xl hover:scale-110 transition-transform"><Play size={28} fill="currentColor"/></button>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* 5. TOOLS ASSET LIST */}
      <section id="toolkit" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          <Reveal>
             <div className="text-center space-y-10">
                <h2 className="text-[7rem] md:text-[10rem] font-black tracking-[-0.07em] uppercase leading-[0.8] text-slate-900">Digital <br /> <span className="text-[var(--brand-color)]">Toolkit.</span></h2>
                <p className="max-w-xl mx-auto text-slate-500 text-2xl font-medium italic mt-8 leading-relaxed">
                   "Everything you need to navigate the university landscape is engineered into one platform."
                </p>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
             {[
               { title: 'Academic Vault', desc: 'Secure repository for lecture notes and shared academic logic.', icon: <BookOpen className="text-indigo-600"/> },
               { title: 'Sector Chat', desc: 'Encrypted peer-to-peer communication channels.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'Campus Bazaar', desc: 'The internal student marketplace for assets and gear.', icon: <Zap className="text-amber-500"/> },
               { title: 'Registry ID', desc: 'Verified university-wide digital identification node.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Sync Calendar', desc: 'Universal scheduler for assessments and events.', icon: <Layout className="text-slate-400"/> },
               { title: 'Asset Recovery', desc: 'Official campus lost & found synchronization.', icon: <Laptop className="text-[var(--brand-color)]"/> }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-16 hover:bg-slate-50 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[450px]">
                  <div className="space-y-10 relative z-10">
                     <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500 shadow-sm group-hover:shadow-xl">
                        {React.cloneElement(feat.icon as React.ReactElement<any>, { size: 36 })}
                     </div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{feat.title}</h3>
                     <p className="text-slate-400 font-medium text-lg leading-relaxed">{feat.desc}</p>
                  </div>
                  <button onClick={onStart} className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    Explore Protocol <ArrowRight size={14}/>
                  </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE CTAS FOOTER */}
      <footer className="bg-slate-900 py-60 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 pointer-events-none">
           <Users size={700} fill="currentColor" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-24">
          <Reveal type="zoom">
             <div className="space-y-10">
               <div className="flex items-center justify-center gap-6 mb-20">
                  <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-1000">
                     <span className="text-slate-900 font-black text-7xl tracking-tighter">M</span>
                  </div>
               </div>
               <h2 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-[0.75] italic">Join the <br /> <span className="text-[var(--brand-color)]">Network.</span></h2>
               <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-4xl mx-auto italic leading-relaxed opacity-80">
                 "18,000+ nodes already synchronized. Establish your link today and define your campus experience."
               </p>
             </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-10">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_70px_rgba(255,255,255,0.15)] hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Create Node Profile
            </button>
            <div className="flex items-center gap-8 text-slate-500">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-16 h-16 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+70}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-3xl font-black text-white tracking-tighter tabular-nums">18,421</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Active Students</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-80 pt-24 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <span className="text-3xl font-black tracking-tighter uppercase text-[var(--brand-color)]">MakSocial</span>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.5em]">Built for Makerere by Mak Dev Group</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-all">Rules of Conduct</a>
              <a href="#" className="hover:text-white transition-all">Privacy Strata</a>
              <a href="#" className="hover:text-white transition-all">Node Support</a>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-30px) rotate(1deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        @keyframes marqueeHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-horizontal {
          animation: marqueeHorizontal 45s linear infinite;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        .animate-text-shimmer {
          animation: text-shimmer 8s linear infinite;
        }
        @keyframes text-shimmer {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;
