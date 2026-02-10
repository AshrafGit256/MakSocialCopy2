
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
  Maximize2, Radar, GraduationCap,
  Calendar
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const MAK_GALLERY = [
  { url: 'https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg', title: 'Main Campus', desc: 'The heart of our university.' },
  { url: 'https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg', title: 'Main Library', desc: 'Where the brightest minds meet.' },
  { url: 'https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg', title: 'Freedom Square', desc: 'Our home for big moments.' }
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'Law', img: 'https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg' },
  { id: 'CHS', name: 'Medicine', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'CAES', name: 'Agriculture', img: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=800' },
];

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; onClick?: () => void }> = ({ children, delay = 0, className = '', onClick }) => {
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
      onClick={onClick}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-chirp selection:bg-[var(--brand-color)] selection:text-white overflow-x-hidden">
      
      {/* 1. SIMPLE NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-6 lg:p-10 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-[var(--brand-color)] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
          <span className="text-2xl font-black tracking-tighter text-[var(--brand-color)] hidden sm:block">MakSocial</span>
        </div>
        
        <div className="pointer-events-auto">
          <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-10 py-3.5 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
             Join Now
          </button>
        </div>
      </nav>

      {/* 2. HERO: IMMERSIVE BACKGROUND */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* BACKGROUND IMAGE WITH PARALLAX VIBE */}
        <div className="absolute inset-0 -z-10">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]" 
             alt="Makerere Hero" 
           />
           {/* ELEGANT MASK OVERLAY */}
           <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white via-white/10 to-white"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <Reveal>
            <span className="bg-[var(--brand-color)] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
              Official Campus Registry
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl md:text-9xl font-black leading-[0.85] tracking-tight text-slate-900 drop-shadow-sm">
              The heart of <br />
              <span className="text-[var(--brand-color)]">Makerere.</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="max-w-2xl mx-auto text-xl md:text-3xl text-slate-700 font-medium leading-tight">
              Connect with classmates, share study notes, and stay current with everything on the Hill.
            </p>
          </Reveal>

          <Reveal delay={600} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button onClick={onStart} className="w-full sm:w-auto bg-[var(--brand-color)] text-white px-14 py-6 rounded-3xl font-black text-xl shadow-[0_30px_60px_rgba(16,145,138,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
              Get Started <ArrowRight size={28} />
            </button>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/40 shadow-sm">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-10 h-10 rounded-full border-4 border-white shadow-lg" alt="User" />
                 ))}
               </div>
               <span className="text-xs font-black text-slate-600 uppercase tracking-widest">18k+ Nodes Active</span>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
           <ArrowDown size={32} />
        </div>
      </section>

      {/* 3. COLLEGE HUB: CIRCULAR DESIGN (50% RADIUS) */}
      <section className="py-32 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <Reveal className="space-y-4 border-l-8 border-[var(--brand-color)] pl-10">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tight leading-none">Find your <br/><span className="text-[var(--brand-color)]">College Hub.</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Access your specific wing of the registry</p>
            </Reveal>
            <button onClick={onStart} className="text-[var(--brand-color)] font-black text-sm uppercase tracking-widest flex items-center gap-3 group px-8 py-3 bg-slate-50 rounded-full hover:bg-[var(--brand-color)] hover:text-white transition-all shadow-sm">
              See All Hubs <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
            {COLLEGES.map((college, i) => (
              <Reveal key={college.id} delay={i * 100} className="flex flex-col items-center gap-6 group cursor-pointer" onClick={onStart}>
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-[12px] border-slate-50 shadow-2xl group-hover:border-[var(--brand-color)]/20 transition-all duration-700 hover:scale-110">
                  <img src={college.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" alt={college.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-color)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                     <span className="bg-white text-black p-3 rounded-full shadow-2xl"><ArrowUpRight size={24}/></span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                   <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{college.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{college.id}_SECTOR</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM LOGIC TILES (Six Sections) */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.02] text-slate-900 select-none pointer-events-none tracking-tighter font-black text-[30vw]">DATA</div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-24 space-y-6">
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">Tools for <span className="text-[var(--brand-color)]">Success.</span></h2>
             <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto">Everything you need to navigate university life, unified in one platform.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'Study Notes', desc: 'The collective intelligence vault. Access papers and summaries shared by your peers.', icon: <BookOpen className="text-indigo-500" />, id: '01' },
              { title: 'Campus Chat', desc: 'Secure encryption for your wing. Talk to friends or join college-wide strategy groups.', icon: <MessageSquare className="text-rose-500" />, id: '02' },
              { title: 'Jobs & Gigs', desc: 'Fuel your future. Find internships, part-time work, and student skill-match opportunities.', icon: <Zap className="text-amber-500" />, id: '03' },
              { title: 'Digital ID', desc: 'Your verified university strata. Access labs, halls, and services with your digital twin.', icon: <Fingerprint className="text-emerald-500" />, id: '04' },
              { title: 'Lost & Found', desc: 'Central recovery registry. Reclaim missing assets or log found items in real-time.', icon: <Search className="text-[var(--brand-color)]" />, id: '05' },
              { title: 'Event Hub', desc: 'Sync with the Hill rhythm. From football matches to academic symposiums, never miss a signal.', icon: <Calendar className="text-blue-500" />, id: '06' }
            ].map((tool, i) => (
              <Reveal key={i} delay={i * 100} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-[var(--brand-color)]/30 transition-all group relative overflow-hidden">
                <div className="absolute top-8 right-8 text-slate-100 font-black text-5xl group-hover:text-[var(--brand-color)]/5 transition-colors">{tool.id}</div>
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[var(--brand-color)] group-hover:text-white transition-all duration-500 shadow-inner">
                  {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 40 })}
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-[var(--brand-color)] transition-colors">{tool.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">{tool.desc}</p>
                <button onClick={onStart} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-[var(--brand-color)] transition-all">
                  Access Protocol <MoveRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMPUS REEL: WIDE SCALE */}
      <section className="py-40 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MAK_GALLERY.map((img, i) => (
              <Reveal key={i} delay={i * 200} className="group relative rounded-[4rem] overflow-hidden aspect-[3/4] shadow-2xl">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={img.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-12 text-white space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Registry_Visual_{i+1}</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{img.title}</h3>
                  <p className="text-lg text-white/70 font-medium italic">"{img.desc}"</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL MONOLITH FOOTER */}
      <footer className="bg-slate-950 pt-40 pb-16 px-8 text-white relative overflow-hidden selection:bg-white selection:text-black">
        {/* Background Emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] pointer-events-none rotate-12">
           <Layers size={500} fill="currentColor" />
        </div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-5 space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[var(--brand-color)] rounded-full flex items-center justify-center text-white font-black text-4xl shadow-2xl">M</div>
                <div>
                   <h2 className="text-5xl font-black uppercase tracking-tighter leading-none italic">MakSocial.</h2>
                   <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-[0.5em] mt-2">Established_2026</p>
                </div>
              </div>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-8 border-[var(--brand-color)]/20 pl-12">
                "The definitive digital strata for the Makerere community. Bridging the gap between engineering, art, and medicine through synchronized student intelligence."
              </p>
              <div className="flex gap-4 pt-4">
                 {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                   <a key={i} href="#" className="p-4 bg-white/5 rounded-full hover:bg-[var(--brand-color)] hover:text-white transition-all border border-white/5">
                     <Icon size={20} />
                   </a>
                 ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] border-b border-white/10 pb-3">Registry_Nodes</h4>
                <ul className="space-y-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <li><a href="#" className="hover:text-white transition-colors">Global Pulse</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Study Vault</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Market Bazaar</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Visual Registry</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lost_Manifesto</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white border-b border-white/10 pb-3">Sector_Hubs</h4>
                <ul className="space-y-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <li><a href="#" className="hover:text-white transition-colors">COCIS Sector</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CEDAT Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Law Faculty</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Medical Node</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Agriculture Wing</a></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white border-b border-white/10 pb-3">Support_Line</h4>
                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-bold text-slate-600 uppercase">Registry_Endpoint</span>
                     <p className="text-[11px] font-black truncate">registry@maksocial.mak.ac.ug</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-bold text-slate-600 uppercase">Physical_Node</span>
                     <p className="text-[11px] font-black">Main Library Wing, Suite 4A</p>
                  </div>
                  <button onClick={onStart} className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Report Signal_Error</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-2">
               <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.8em]">© 2026 MakSocial Registry. All Rights Reserved.</p>
               <p className="text-[9px] font-medium text-slate-800 uppercase tracking-[0.3em]">Engineered with pride in Sector COCIS Wing II • Cluster Alpha</p>
            </div>
            <div className="flex items-center gap-10">
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy_Strata</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">System_Uptime</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Charter_v5.2</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .font-chirp {
          font-family: 'Chirp', 'Inter', sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;
