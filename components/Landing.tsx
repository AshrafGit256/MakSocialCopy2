
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
  { url: 'https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg', title: 'The Main Building', desc: 'Our pride and joy since 1922.' },
  { url: 'https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg', title: 'Main Library', desc: 'Find every book you ever needed.' },
  { url: 'https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg', title: 'Freedom Square', desc: 'Where graduations and dreams happen.' }
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'Law School', img: 'https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
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
      
      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-4 lg:p-8 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-slate-100 lg:bg-transparent lg:backdrop-blur-none lg:border-none">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-[var(--brand-color)] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
          <span className="text-xl font-black tracking-tighter text-[var(--brand-color)]">MakSocial</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={onStart} className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] transition-colors">Login</button>
          <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-full font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
             Join Now
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH IMAGE BACKGROUND */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* striking background image */}
        <div className="absolute inset-0 -z-10">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]" 
             alt="Makerere Main Building" 
           />
           {/* Sophisticated gradient and glass overlay */}
           <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <Reveal>
            <span className="bg-[var(--brand-color)] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl inline-flex items-center gap-2">
              <Sparkles size={14} /> Official Makerere Social Hub
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-slate-900 drop-shadow-sm">
              Connect with <br />
              <span className="text-[var(--brand-color)]">Everyone on the Hill.</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-700 font-medium leading-relaxed">
              Find study partners, share past papers, and see what is happening in your college. Join the community that makes campus life easier.
            </p>
          </Reveal>

          <Reveal delay={600} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button onClick={onStart} className="w-full sm:w-auto bg-[var(--brand-color)] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(16,145,138,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
              Get Started Free <ArrowRight size={24} />
            </button>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-sm">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} className="w-10 h-10 rounded-full border-4 border-white shadow-lg" alt="User" />
                 ))}
               </div>
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">18,000+ Students</span>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden md:block">
           <ArrowDown size={32} className="text-[var(--brand-color)]" />
        </div>
      </section>

      {/* 3. COLLEGE CIRCLES (50% Border Radius) */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <Reveal className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">Find your <br/><span className="text-[var(--brand-color)]">College Community.</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Select your college and start connecting</p>
            </Reveal>
            <button onClick={onStart} className="text-[var(--brand-color)] font-black text-sm uppercase tracking-widest flex items-center gap-3 group px-8 py-3 bg-emerald-50 rounded-full hover:bg-[var(--brand-color)] hover:text-white transition-all">
              See all Hubs <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
            {COLLEGES.map((college, i) => (
              <Reveal key={college.id} delay={i * 100} className="flex flex-col items-center gap-6 group cursor-pointer" onClick={onStart}>
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-[6px] md:border-[10px] border-slate-50 shadow-2xl group-hover:border-[var(--brand-color)] transition-all duration-700 hover:scale-105">
                  <img src={college.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={college.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-color)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-center">
                   <h4 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-tighter">{college.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{college.id}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM FEATURE CARDS */}
      <section className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">Tools to <span className="text-[var(--brand-color)]">Make Life Better.</span></h2>
             <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">Everything a Makerere student needs, right at your fingertips.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Study Notes', desc: 'Find notes, past papers, and shared summaries from students who were here before you.', icon: <BookOpen className="text-blue-500" />, id: '01' },
              { title: 'Campus Chat', desc: 'Private messages and group chats for your class, college, or hostel friends.', icon: <MessageSquare className="text-rose-500" />, id: '02' },
              { title: 'Student Gigs', desc: 'Find part-time work, internships, or simple tasks to earn some extra cash.', icon: <Zap className="text-amber-500" />, id: '03' },
              { title: 'Digital Identity', desc: 'Your student profile, verified and always with you. Access campus services easily.', icon: <Fingerprint className="text-emerald-500" />, id: '04' },
              { title: 'Lost & Found', desc: 'Lost your ID or key? Post it here and let the community help you find it.', icon: <Search className="text-indigo-500" />, id: '05' },
              { title: 'What is On?', desc: 'Never miss a concert, sports match, or special lecture. Sync with the Hill rhythm.', icon: <Calendar className="text-[var(--brand-color)]" />, id: '06' }
            ].map((tool, i) => (
              <Reveal key={i} delay={i * 100} className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-[var(--brand-color)]/30 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="absolute -top-4 -right-4 text-slate-50 font-black text-[120px] leading-none group-hover:text-[var(--brand-color)]/5 transition-colors select-none">{tool.id}</div>
                <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[var(--brand-color)] group-hover:text-white transition-all duration-500 shadow-inner text-slate-400">
                  {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 40 })}
                </div>
                <div className="flex-1">
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-[var(--brand-color)] transition-colors">{tool.title}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed mb-10 text-sm md:text-base">{tool.desc}</p>
                </div>
                <button onClick={onStart} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-color)] group-hover:gap-5 transition-all mt-auto">
                   Start Using <MoveRight size={18} />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IMAGE REEL */}
      <section className="py-32 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MAK_GALLERY.map((img, i) => (
              <Reveal key={i} delay={i * 200} className="group relative rounded-[3rem] overflow-hidden aspect-[3/4] shadow-2xl border border-slate-100">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" alt={img.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{img.title}</h3>
                  <p className="text-sm text-white/60 font-medium italic">{img.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BIG EDITORIAL FOOTER */}
      <footer className="bg-slate-900 pt-32 pb-16 px-8 text-white relative overflow-hidden">
        {/* Background visual element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--brand-color)]/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            
            {/* Logo & About */}
            <div className="lg:col-span-5 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--brand-color)] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl">M</div>
                <div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter">MakSocial</h2>
                   <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-[0.4em] mt-1">Makerere University Hub</p>
                </div>
              </div>
              <p className="text-xl text-slate-400 font-medium leading-relaxed italic border-l-4 border-[var(--brand-color)] pl-8">
                Building a more connected Hill. We help students thrive by connecting talent with opportunity and knowledge with those who seek it.
              </p>
              <div className="flex gap-4">
                 {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                   <a key={i} href="#" className="p-4 bg-white/5 rounded-full hover:bg-[var(--brand-color)] hover:text-white transition-all border border-white/5">
                     <Icon size={20} />
                   </a>
                 ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-8">
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)]">Registry</h4>
                <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">Campus Pulse</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Study Vault</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">The Bazaar</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lost & Found</a></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Hubs</h4>
                <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-white transition-colors">COCIS Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CEDAT Wing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Law Faculty</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Medicine</a></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Contact</h4>
                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-bold text-slate-600 uppercase">Support Email</span>
                     <p className="text-[11px] font-black">support@maksocial.mak.ac.ug</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-bold text-slate-600 uppercase">Office Location</span>
                     <p className="text-[11px] font-black">Main Library, Room 402</p>
                  </div>
                  <button onClick={onStart} className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Submit Feedback</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 MakSocial. Built by Students for Students.</p>
            </div>
            <div className="flex items-center gap-8">
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Safety</a>
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
