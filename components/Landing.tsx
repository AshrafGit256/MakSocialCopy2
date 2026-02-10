
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
  Fingerprint, ArrowDown
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const SECTORS = [
  { id: '01', code: 'COCIS', name: 'Computing_IT', color: 'bg-teal-500', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: '02', code: 'CEDAT', name: 'Engineering_Art', color: 'bg-orange-500', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: '03', code: 'LAW', name: 'Jurisprudence', color: 'bg-rose-500', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: '04', code: 'CHS', name: 'Health_Science', color: 'bg-emerald-500', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(winScroll / height);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5), y: (e.clientY / window.innerHeight - 0.5) });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-white text-[#1a1a1a] min-h-screen selection:bg-black selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 0. PROGRESS THREAD */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-slate-100 z-[2000]">
        <div className="h-full bg-black transition-all duration-100" style={{ width: `${scrollProgress * 100}%` }}></div>
      </div>

      {/* 1. STARK NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 md:p-12 mix-blend-difference pointer-events-none">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col gap-1 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="text-3xl font-black tracking-tighter leading-none">MAKSOCIAL.</span>
            <span className="text-[9px] font-bold tracking-[0.5em] text-slate-400">EST_1922 / REV_2026</span>
          </div>
          
          <div className="flex flex-col items-end gap-12">
            <button onClick={onStart} className="bg-black text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
               Get_Started
            </button>
            <div className="hidden lg:flex flex-col items-end gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
               <a href="#about" className="hover:text-black transition-colors">Architecture</a>
               <a href="#sectors" className="hover:text-black transition-colors">Sectors</a>
               <a href="#directives" className="hover:text-black transition-colors">Directives</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE MONOLITH */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#fcfcfc]">
        {/* Subtle Background Markings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[80vw] h-[80vw] border-[1px] border-slate-100 rounded-full opacity-50 scale-[1.2]"></div>
           <div className="w-[60vw] h-[60vw] border-[1px] border-slate-100 rounded-full opacity-50"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-8 w-full relative z-10">
          <div className="flex flex-col items-center text-center space-y-12">
            <Reveal>
              <div className="inline-flex items-center gap-4 px-6 py-2 border border-slate-200 rounded-full bg-white shadow-sm mb-4">
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Central_Registry_Uplink</span>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="text-[12vw] font-black leading-[0.85] tracking-[-0.07em] uppercase text-black">
                AURA OF <br />
                <span className="italic font-serif normal-case tracking-tighter text-slate-200">Intelligence.</span>
              </h1>
            </Reveal>

            <Reveal delay={400} className="w-full">
               <div className="flex flex-col md:flex-row items-center justify-center gap-20 pt-10">
                  <p className="max-w-sm text-lg md:text-xl text-slate-500 font-medium leading-relaxed text-left md:text-right">
                    The definitive social stratagem for the elite student body of Makerere University. 
                  </p>
                  <div className="w-px h-24 bg-slate-200 hidden md:block"></div>
                  <div className="flex flex-col items-start gap-4">
                     <button onClick={onStart} className="flex items-center gap-8 group">
                        <span className="text-4xl font-black uppercase tracking-tighter hover:italic transition-all">Initialize.</span>
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-2xl">
                           <ArrowRight size={24} />
                        </div>
                     </button>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">Sync Identity Protocol</p>
                  </div>
               </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-20">
           <span className="text-[9px] font-black uppercase tracking-[0.5em] vertical-text">Scroll</span>
           <ArrowDown size={14} />
        </div>
      </section>

      {/* 3. FOCUS STACK SECTORS */}
      <section id="sectors" className="py-60 bg-white">
        <div className="max-w-screen-2xl mx-auto px-8 space-y-32">
          <Reveal className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Registry_Catalog</span>
              <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none">The <span className="text-slate-200">Sectors.</span></h2>
            </div>
            <div className="max-w-sm">
               <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                 "Every college synchronized into a singular high-fidelity logic node. Navigate the university strata with precision."
               </p>
            </div>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[700px]">
            {SECTORS.map((sector, i) => (
              <div 
                key={sector.id}
                className="flex-1 group relative overflow-hidden transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) hover:flex-[3] cursor-pointer border border-slate-100 first:rounded-l-[3rem] last:rounded-r-[3rem] h-[500px] lg:h-full"
              >
                <img src={sector.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1.5s] scale-110 group-hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent group-hover:from-black/60 group-hover:via-transparent transition-all"></div>
                
                <div className="absolute top-12 left-12 flex flex-col gap-2">
                   <span className="text-6xl font-black text-slate-100 group-hover:text-white/20 transition-colors duration-500">{sector.id}</span>
                   <div className="h-px w-12 bg-slate-200 group-hover:bg-white/20 transition-all"></div>
                </div>

                <div className="absolute bottom-12 left-12 right-12">
                   <div className="space-y-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-white/60">{sector.code} NODE</span>
                      <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:text-white transition-colors">{sector.name}</h3>
                      <div className="pt-8 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                         <button onClick={onStart} className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                           Open Hub <ArrowRight size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TYPOGRAPHIC BLUEPRINT */}
      <section id="about" className="py-60 bg-[#f9f9f9] border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[30vw] font-black text-black opacity-[0.01] leading-none select-none tracking-tighter">DATA</div>
        
        <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-20">
            <Reveal>
              <h2 className="text-[6vw] font-black leading-[0.9] tracking-tighter uppercase">
                A Unified <br />
                <span className="text-slate-300">Architecture</span> for <br />
                Campus Logic.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               {[
                 { title: 'Peer_Sync', desc: 'Real-time encrypted communication layers across all college wings and residential clusters.' },
                 { title: 'Asset_Vault', desc: 'Secure repository for peer-validated lecture logic, academic logs, and research artifacts.' },
                 { title: 'Node_Identity', desc: 'Verified university-wide digital ID for secure strata access and institutional validation.' },
                 { title: 'Geo_Stratum', desc: 'A real-time geospatial guide for every wing, hall, and assessment terminal on the Hill.' }
               ].map((item, i) => (
                 <Reveal key={i} delay={i * 100} className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-black px-2 py-1 bg-slate-200 rounded">0{i+1}</span>
                       <h4 className="text-xl font-black uppercase tracking-tighter">{item.title}</h4>
                    </div>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed border-l-2 border-slate-200 pl-6">
                      {item.desc}
                    </p>
                 </Reveal>
               ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
             <Reveal className="sticky top-40">
                <div className="bg-white p-12 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.08)] border border-slate-100 space-y-12 overflow-hidden group">
                   <div className="flex justify-between items-center">
                      <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-12 transition-transform duration-500">M</div>
                      <div className="text-right">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">System_Status</span>
                         <div className="flex items-center gap-2 justify-end mt-1">
                            <span className="text-xs font-black text-emerald-500 uppercase">Synchronized</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Digital_Pulse.</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Node Network Activity Monitor</p>
                   </div>

                   <div className="space-y-6">
                      {[
                        { label: 'Network Intensity', val: '98.4%' },
                        { label: 'Active Signals', val: '18,421' },
                        { label: 'Strata Uptime', val: '99.9%' }
                      ].map(s => (
                        <div key={s.label} className="space-y-2">
                           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                              <span>{s.label}</span>
                              <span className="text-black">{s.val}</span>
                           </div>
                           <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-black w-[90%] transition-all duration-1000 group-hover:w-full"></div>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button onClick={onStart} className="w-full py-6 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] transition-all">Launch_Interface</button>
                </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* 5. MONOLITHIC INDEX FOOTER */}
      <footer id="directives" className="bg-[#050505] pt-60 pb-20 px-8 text-white relative overflow-hidden font-sans selection:bg-white selection:text-black">
        
        {/* Typographic Architecture Background */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] scale-[2.5] rotate-12 pointer-events-none transition-transform duration-[60s] hover:scale-[3]">
           <Layers size={900} fill="currentColor" />
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          
          {/* Top Section: Identity & Manifesto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-60">
            <div className="lg:col-span-5 space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center text-black font-black text-4xl shadow-2xl">M</div>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">MakSocial.</h2>
              </div>
              <div className="space-y-10 max-w-lg">
                 <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-[12px] border-white/10 pl-10">
                   Established as the definitive digital strata for the Makerere University community. 
                   We facilitate high-fidelity student collaboration by bridging logic nodes across all colleges, 
                   ensuring a synchronized, secure, and intelligent campus experience.
                 </p>
                 <div className="flex gap-4 pt-10">
                   <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"><Instagram size={20}/></a>
                   <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"><Twitter size={20}/></a>
                   <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"><Facebook size={20}/></a>
                   <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"><Github size={20}/></a>
                 </div>
              </div>
            </div>

            {/* MONOLITHIC INDEX COLUMNS */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">The_Architecture</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">Global Pulse</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Logic Vault</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sector Hub</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Visual Sync</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Bazaar Log</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lost_Registry</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Wing_Manifest</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">COCIS Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CEDAT Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LAW Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CHS Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CONAS Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ALL Wings</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Directives</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">Identity Ver</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Strata</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security Code</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Usage Logs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Charter v5.0</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partner Sync</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">Governance</h4>
                <ul className="space-y-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  <li><a href="#" className="hover:text-white transition-colors">The Guild</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Mak_Dev_Group</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Library Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Admin Hub</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Alumni Node</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Integrity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 pt-32 border-t border-white/5 items-start">
             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Registry_Oversight</h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed uppercase tracking-widest">
                  Maintenance and synchronization are provided by the Mak Dev Group and authorized 
                  representatives of the University Registry. All client-node connections are encrypted 
                  via the Hill Integrity Protocol v5.2.
                </p>
                <div className="flex gap-4 opacity-20">
                   <div className="w-12 h-0.5 bg-white"></div>
                   <div className="w-8 h-0.5 bg-white"></div>
                   <div className="w-4 h-0.5 bg-white"></div>
                </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Node_Endpoints</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-5 text-slate-500 hover:text-white transition-all cursor-pointer group">
                      <Mail size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">registry@maksocial.mak.ac.ug</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-500">
                      <MapPin size={18} className="opacity-40" />
                      <span className="text-[11px] font-black tracking-widest uppercase leading-loose">Main Library Wing, Floor 4, Suite 4A, Kampala, UG</span>
                   </div>
                   <div className="flex items-center gap-5 text-slate-500 hover:text-white transition-all cursor-pointer group">
                      <Phone size={18} className="opacity-40 group-hover:opacity-100" />
                      <span className="text-[11px] font-black tracking-widest uppercase">+256 414 531234</span>
                   </div>
                </div>
             </div>

             <div className="lg:text-right space-y-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Infrastructure</h4>
                <div className="flex flex-wrap lg:justify-end gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 items-center">
                   <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="h-10 w-auto invert" alt="Logo" />
                   <div className="h-12 w-px bg-white/10"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Mak Dev Node</span>
                   <div className="h-12 w-px bg-white/10"></div>
                   <span className="font-black text-xs uppercase tracking-tighter italic">Hill Authority</span>
                </div>
             </div>
          </div>

          <div className="mt-60 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
             <div className="flex flex-col gap-3">
                <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.8em]">© 2026 Mak Social Group. All Rights Reserved.</p>
                <p className="text-[9px] font-medium text-white/10 uppercase tracking-[0.4em]">Designed & Engineered in Sector COCIS Wing II • Cluster A</p>
             </div>
             
             <div className="flex items-center gap-10">
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacy_Charter</a>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">System_Status</a>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Support_Node</a>
             </div>
          </div>
          
          <div className="mt-20 w-full h-[1px] bg-white/5"></div>
        </div>
      </footer>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;
