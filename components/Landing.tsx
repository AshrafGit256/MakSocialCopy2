
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  Calendar, BookOpen, Star, 
  Camera, Zap, Layout, 
  Laptop, ArrowUpRight, CheckCircle,
  ChevronRight, Globe, ShieldCheck,
  Search, Bell, Command, Play, Target
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const LIVE_POSTS = [
  { author: "Opio Eric", text: "CS Study guide is live! 📚", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400" },
  { author: "Guild Office", text: "Bazaar setup starts Monday.", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400" },
  { author: "Namusoke J.", text: "Lost charger at Library F2.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400" },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800', size: 'wide' },
  { id: 'CEDAT', name: 'Engineering', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800', size: 'tall' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800', size: 'small' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800', size: 'small' },
];

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }> = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directions = {
    up: 'translate-y-12',
    left: '-translate-x-12',
    right: 'translate-x-12'
  };

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1200px] cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directions[direction]}`
      }`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date("2026-06-20T10:00:00").getTime() - new Date().getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    const scroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", scroll);
    return () => { clearInterval(timer); window.removeEventListener("scroll", scroll); };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. ARCHITECTURAL NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 md:px-12 ${scrolled ? 'py-4' : 'py-10'}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border border-slate-200/50 p-4 rounded-full shadow-2xl' : ''}`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-[360deg] transition-transform duration-1000">M</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)]">Registry Protocol</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <a href="#pulse" className="hover:text-slate-900 transition-colors">Pulse</a>
               <a href="#hubs" className="hover:text-slate-900 transition-colors">Hubs</a>
               <a href="#gala" className="hover:text-slate-900 transition-colors">Gala</a>
            </div>
            <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95">
               Authenticate
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: EDITORIAL LAYOUT */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50/30">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-60 grayscale-[40%] contrast-125" 
             alt="Makerere Main Hall"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/80 to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <Reveal direction="left">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full">
                  <div className="w-2 h-2 bg-[var(--brand-color)] rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Campus Registry</span>
                </div>
                <h1 className="text-[4.5rem] md:text-[8rem] font-black leading-[0.75] tracking-[-0.06em] uppercase text-slate-900">
                  Life on <br /> 
                  <span className="text-[var(--brand-color)] italic font-serif normal-case tracking-tight">The Hill.</span>
                </h1>
                <p className="max-w-md text-xl md:text-2xl text-slate-600 font-medium leading-tight border-l-4 border-slate-900 pl-8 italic">
                  A high-fidelity social strata for the Makerere community. Find signals, sync notes, and build the future.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} direction="left">
              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={onStart} className="px-14 py-6 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 active:scale-95 group">
                  Initialize Sync <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-6 text-slate-400">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-md"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} /></div>)}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">18k Nodes Joined</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FLOATING IDENTITY ASSET */}
          <div className="hidden lg:block relative h-[600px]">
             <Reveal delay={400} direction="right">
                <div className="absolute top-0 right-0 w-[400px] bg-white border border-slate-200 rounded-[3rem] p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rotate-[3deg] hover:rotate-0 transition-transform duration-700 overflow-hidden">
                   <div className="bg-slate-900 p-8 text-white flex justify-between items-start rounded-t-[2.5rem]">
                      <div>
                         <h4 className="text-2xl font-black tracking-tighter uppercase leading-none">Ninfa A.</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Identity v5.0</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-2xl"><Globe size={24}/></div>
                   </div>
                   <div className="p-8 space-y-8 bg-white">
                      <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                         <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Sector</p>
                            <p className="text-sm font-black uppercase">COCIS / SOFTWARE ENG</p>
                         </div>
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100"><Target className="text-[var(--brand-color)]" size={24}/></div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visual Pulse Feed</p>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="h-20 bg-slate-100 rounded-2xl overflow-hidden grayscale"><img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400" className="w-full h-full object-cover" /></div>
                            <div className="h-20 bg-slate-100 rounded-2xl overflow-hidden grayscale"><img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400" className="w-full h-full object-cover" /></div>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-center gap-3">
                         <ShieldCheck size={16} /> Encrypted Node
                      </button>
                   </div>
                </div>
             </Reveal>

             {/* CHAT OVERLAY: Sophisticated & Non-Obstructive */}
             <div className="absolute -bottom-10 -left-20 w-[320px] bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-6 shadow-2xl animate-float z-20">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/30 pb-4">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Comms</span>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col items-start gap-1">
                      <div className="px-4 py-2.5 bg-slate-100 rounded-2xl rounded-bl-none text-xs font-medium">Coming to Freedom Square?</div>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest ml-1">Brian K.</span>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <div className="px-4 py-2.5 bg-[var(--brand-color)] text-white rounded-2xl rounded-br-none text-xs font-medium shadow-lg">Confirming protocol. See ya.</div>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mr-1">You</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO HUB GRID */}
      <section id="hubs" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
           <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-l-8 border-slate-900 pl-10">
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Explore <br /> <span className="text-slate-300 italic font-serif normal-case tracking-tight">The Wings.</span></h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Sector synchronization in progress</p>
                 </div>
                 <div className="hidden md:flex items-center gap-4 text-slate-300">
                    <Command size={24}/>
                    <div className="h-px w-32 bg-slate-100"></div>
                 </div>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 h-auto md:h-[650px]">
              {COLLEGES.map((college, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <div className={`h-full relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl transition-all hover:scale-[1.02] border border-slate-100 ${
                    college.size === 'wide' ? 'md:col-span-2' : 
                    college.size === 'tall' ? 'md:row-span-2' : ''
                  }`}>
                    <img src={college.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                       <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                          <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.name}</p>
                          <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest">
                                Sync Hub <ChevronRight size={16}/>
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="bg-slate-50 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center space-y-6 border border-dashed border-slate-300">
                 <div className="p-5 bg-white rounded-full shadow-lg text-slate-300"><Plus size={32}/></div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">More Wings being Synchronized</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. THE SIGNATURE EVENT: GALA 2026 */}
      <section id="gala" className="py-40 bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-color)] opacity-5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6 space-y-12 order-2 lg:order-1">
               <Reveal direction="left">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4 text-rose-500">
                        <Star size={32} className="animate-pulse" />
                        <span className="text-[12px] font-black uppercase tracking-[0.6em]">Premium Event Protocol</span>
                     </div>
                     <h2 className="text-7xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.8] text-white">The <br /> <span className="text-slate-600 italic font-serif normal-case tracking-tight">Gala.</span></h2>
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
                       <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center backdrop-blur-md group hover:bg-[var(--brand-color)] transition-all">
                          <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{u.val.toString().padStart(2, '0')}</p>
                          <p className="text-[8px] font-black uppercase text-slate-500 group-hover:text-white/80 tracking-widest mt-1">{u.label}</p>
                       </div>
                    </Reveal>
                  ))}
               </div>

               <Reveal delay={600}>
                  <button onClick={onStart} className="w-full md:w-auto px-16 py-8 bg-rose-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] shadow-[0_25px_60px_rgba(225,29,72,0.3)] hover:bg-rose-700 transition-all flex items-center justify-center gap-6 active:scale-95 group">
                    Secure Entry Pass <ArrowUpRight size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"/>
                  </button>
               </Reveal>
            </div>

            <div className="lg:col-span-6 relative order-1 lg:order-2">
               <Reveal direction="right">
                  <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative group">
                     <img src="https://campusbee.ug/wp-content/uploads/2022/10/MAK-Gala.jpg" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                     <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Confirmed Venue</p>
                           <p className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3"><Globe size={20} className="text-rose-500"/> Freedom Square</p>
                        </div>
                        <button className="p-5 bg-white rounded-2xl shadow-2xl hover:scale-110 transition-transform"><Play size={24} fill="currentColor"/></button>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* 5. TOOLS ASSET LIST */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          <Reveal>
             <div className="text-center space-y-6">
                <h2 className="text-7xl md:text-[9rem] font-black tracking-[-0.06em] uppercase leading-[0.8] text-slate-900">Digital <br /> <span className="text-[var(--brand-color)]">Toolkit.</span></h2>
                <p className="max-w-xl mx-auto text-slate-500 text-xl font-medium italic mt-8 leading-relaxed">
                   "Everything you need to navigate the university landscape is engineered into one platform."
                </p>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
             {[
               { title: 'Academic Vault', desc: 'Secure repository for lecture notes and shared logic.', icon: <BookOpen className="text-indigo-600"/> },
               { title: 'Sector Chat', desc: 'Encrypted peer-to-peer communication channels.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'Campus Bazaar', desc: 'The internal student marketplace for assets.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital ID', desc: 'Verified university-wide identification node.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Sync Calendar', direction: 'left', desc: 'Universal scheduler for assessments and events.', icon: <Layout className="text-slate-400"/> },
               { title: 'Asset Recovery', desc: 'The official campus lost & found synchronization.', icon: <Laptop className="text-[var(--brand-color)]"/> }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-16 hover:bg-slate-50 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                  <div className="space-y-8 relative z-10">
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500 shadow-sm group-hover:shadow-xl">
                        {feat.icon}
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
      <footer className="bg-slate-900 py-40 px-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 pointer-events-none">
           <Users size={700} fill="currentColor" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-24">
          <Reveal>
             <div className="space-y-10">
               <div className="flex items-center justify-center gap-6 mb-16">
                  <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl rotate-12 transition-transform duration-1000 hover:rotate-0">
                     <span className="text-slate-900 font-black text-6xl">M</span>
                  </div>
               </div>
               <h2 className="text-7xl md:text-[11rem] font-black uppercase tracking-tighter leading-[0.75] italic">Join the <br /> <span className="text-[var(--brand-color)]">Network.</span></h2>
               <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-4xl mx-auto italic leading-relaxed opacity-80">
                 "18,000+ nodes already synchronized. Establish your link today and define your campus experience."
               </p>
             </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-10">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_70px_rgba(255,255,255,0.2)] hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
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

        <div className="mt-60 pt-20 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <span className="text-3xl font-black tracking-tighter uppercase text-[var(--brand-color)]">MakSocial</span>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Built for Makerere by Mak Dev Group</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-all">Rules of Conduct</a>
              <a href="#" className="hover:text-white transition-all">Privacy Strata</a>
              <a href="#" className="hover:text-white transition-all">Node Support</a>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Landing;
