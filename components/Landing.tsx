
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Star, 
  Share2, Zap, MessageCircle, MapPin, 
  Bell, Image as ImageIcon, Camera,
  CheckCircle2, Heart, ExternalLink,
  Target, Cpu, Layers, Shield, Mail, 
  Info, Smartphone, Database, Compass,
  Sparkles, GraduationCap, Briefcase,
  PlayCircle, MousePointer2
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & Information Sciences' },
  { id: 'CEDAT', name: 'Engineering & Tech' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences' },
  { id: 'CONAS', name: 'Natural Sciences' },
  { id: 'CHS', name: 'Health Sciences' },
  { id: 'CAES', name: 'Agricultural' },
  { id: 'COBAMS', name: 'Business' },
  { id: 'CEES', name: 'Education' },
  { id: 'LAW', name: 'Law' },
  { id: 'CoVAB', name: 'Veterinary' }
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-[#fafafa] text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. ARCHITECTURAL NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[300] transition-all duration-700 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'py-10 bg-transparent'}`}>
        <div className="max-w-[1800px] mx-auto px-10 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Users size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Registry v5.2</span>
            </div>
          </div>
          
          <div className="hidden xl:flex items-center gap-16">
            {['Intelligence', 'Academic Vault', 'Opportunities', 'The Hill'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-slate-900 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-8">
             <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors">Portal Access</button>
             <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:brightness-110 hover:translate-y-[-2px] active:translate-y-0 transition-all">Enroll Now</button>
          </div>
        </div>
      </nav>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-10 overflow-hidden bg-white">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-teal-50/50 rounded-full blur-[120px] pointer-events-none"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none transition-transform duration-300"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        >
          <div className="absolute top-20 left-20"><Database size={200} /></div>
          <div className="absolute bottom-20 right-20"><Globe size={300} /></div>
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-slate-50 border border-slate-200 rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">The Hill's Digital Nucleus is Live</span>
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-serif italic text-slate-900 tracking-tight leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Connected <br />
            <span className="font-sans not-italic font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-teal-700 to-slate-900 tracking-tighter">Excellence.</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
            The unified social strata for Makerere University. Sync your academic journey, discover global opportunities, and link with theHill’s elite community.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
             <button onClick={onStart} className="bg-slate-900 text-white px-20 py-8 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group flex items-center gap-6">
                Initialize Uplink <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
             </button>
             <button className="px-20 py-8 border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center gap-6">
                View Repository <Database size={22} />
             </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 animate-bounce">
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">Scroll to Explore</span>
           <div className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent"></div>
        </div>
      </section>

      {/* 3. THE BENTO MATRIX (Features) */}
      <section className="py-40 px-10 bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 grid-rows-2 gap-8 h-auto lg:h-[900px]">
            
            {/* Feature 1: The Vault (Large Vertical) */}
            <div className="lg:col-span-4 lg:row-span-2 bg-white rounded-[4rem] border border-slate-200 p-16 flex flex-col justify-between group overflow-hidden shadow-sm hover:shadow-2xl transition-all relative">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity -rotate-12 group-hover:rotate-0 duration-1000">
                  <BookOpen size={400} />
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                    <Database size={32} />
                  </div>
                  <h3 className="text-5xl font-black uppercase tracking-tighter leading-none italic">The Study <br /> Vault.</h3>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xs">Access 42k+ verified academic assets across all ten colleges. Encrypted. Secure. Universal.</p>
               </div>
               <button onClick={onStart} className="w-fit flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 group-hover:translate-x-4 transition-transform relative z-10">
                  Enter Strata <ChevronRight size={16}/>
               </button>
            </div>

            {/* Feature 2: Opportunities (Wide) */}
            <div className="lg:col-span-8 lg:row-span-1 bg-slate-900 rounded-[4rem] p-16 flex items-center justify-between group overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-r from-teal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="space-y-8 relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-3 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                     <Zap size={14} className="text-amber-400" /> Career Accelerator
                  </div>
                  <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Global <br /> Sync.</h3>
                  <p className="text-xl text-white/40 font-medium leading-relaxed">Direct links to internships, grants, and graduate schemes from university partners worldwide.</p>
                  <button onClick={onStart} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all active:scale-95">Open Jobs Board</button>
               </div>
               <div className="hidden xl:block relative z-10">
                  <div className="w-80 h-80 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                     <div className="w-60 h-60 border border-white/20 rounded-full flex items-center justify-center animate-spin-reverse">
                        <Globe size={80} className="text-white opacity-20" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature 3: Community (Small Square) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-white rounded-[4rem] border border-slate-200 p-12 flex flex-col justify-between group hover:border-indigo-600 transition-all shadow-sm">
               <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                    <Users size={24} />
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-black tracking-tighter">18.4k</p>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</p>
                  </div>
               </div>
               <div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Pulse Hub</h4>
                  <p className="text-sm text-slate-400 font-medium">Real-time student interaction across all campus wings.</p>
               </div>
            </div>

            {/* Feature 4: Events (Small Square) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-white rounded-[4rem] border border-slate-200 p-12 flex flex-col justify-between group hover:border-rose-600 transition-all shadow-sm">
               <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                  </div>
                  <div className="flex -space-x-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200"></div>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Live Temporals</h4>
                  <p className="text-sm text-slate-400 font-medium">Synced campus calendar and official broadcast streams.</p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE COLLEGE GRID - ARCHITECTURAL LAYOUT */}
      <section className="py-60 px-10 bg-white relative">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 sticky top-40 space-y-10">
             <div className="w-16 h-1 bg-slate-900"></div>
             <h2 className="text-7xl font-black tracking-tighter text-slate-900 uppercase leading-[0.85]">One <br /> Registry. <br /> <span className="text-slate-300">Ten Wings.</span></h2>
             <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-md italic">"Every faculty node is synchronized within the Hill's central intelligence network."</p>
             <div className="space-y-6 pt-10">
                {['Direct Student Messaging', 'Course-Specific Vaults', 'Official Faculty Signal Updates'].map(f => (
                  <div key={f} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 group cursor-default">
                     <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-150 transition-transform"></div> {f}
                  </div>
                ))}
             </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
             {COLLEGES.map((college, i) => (
                <div key={college.id} className="p-12 bg-[#fcfcfc] border border-slate-100 rounded-[3rem] hover:bg-white hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col justify-between aspect-square">
                   <div className="flex justify-between items-start">
                      <span className="text-4xl font-black tracking-tighter text-slate-900 group-hover:text-[var(--brand-color)] transition-colors">{college.id}</span>
                      <ChevronRight size={24} className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-2 transition-all" />
                   </div>
                   <div className="space-y-4">
                      <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em] leading-snug">{college.name}</p>
                      <div className="h-px w-full bg-slate-100"></div>
                      <div className="flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                         <span>Nodes Online: {Math.floor(Math.random()*5000)+100}</span>
                         <span className="text-emerald-500">Stable</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. ELITE TESTIMONIAL / CTA */}
      <section className="py-48 px-10 bg-slate-900 text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.03] scale-150 grayscale rotate-45 pointer-events-none">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <Sparkles size={64} className="mx-auto text-amber-400 animate-pulse" />
          <h2 className="text-5xl md:text-8xl font-serif italic tracking-tight leading-none">"The definitive digital asset for the Hill's next generation."</h2>
          <div className="space-y-4">
             <p className="text-xs font-black uppercase tracking-[0.6em] text-white/50">Office of the Guild President</p>
             <div className="w-20 h-px bg-white/20 mx-auto"></div>
          </div>
          <button onClick={onStart} className="bg-white text-black px-20 py-8 rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all">
             Begin Your Registry Login
          </button>
        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="pt-40 pb-20 px-10 bg-white border-t border-slate-200/50">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-32 mb-40">
            
            <div className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
               </div>
               <p className="text-[16px] text-slate-400 leading-loose font-medium max-w-sm">
                  The definitive digital stratum for the Makerere University ecosystem. Engineered for excellence, built for community.
               </p>
               <div className="flex gap-10 text-slate-300">
                  <Globe size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Target size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <ShieldCheck size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Database size={24} className="hover:text-slate-900 transition-colors cursor-pointer" />
               </div>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-8">Registry Hubs</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {COLLEGES.slice(0, 6).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-colors flex items-center gap-4">
                       <ChevronRight size={12} className="text-slate-200" /> {c.name}
                    </li>
                  ))}
                  <li className="text-[var(--brand-color)] font-black cursor-pointer hover:underline pt-4">+ All Hub Manifests</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-8">Portal Services</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Study Vault Protocol</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Career Sync Engine</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Digital Identity Registry</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Live Pulse Streams</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Community Governance</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-8">System Compliance</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Community Manifesto</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Stratum</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Handshake</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Developer Uplinks</li>
                  <li className="flex items-center gap-4 text-rose-500 cursor-pointer font-black pt-4">
                     <Info size={18}/> Report Signal Breach
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-20 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-12">
             <div className="flex flex-col lg:flex-row items-center gap-12">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry Core | Optimized for Hill Strata</p>
                <div className="hidden xl:flex items-center gap-6">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol_Stable_v5.2.0</span>
                </div>
             </div>
             <div className="flex gap-16 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-slate-900 transition-colors">Nodes</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Archive</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
