
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
  // Added missing Calendar import
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
  { id: 'LAW', name: 'School of Law', img: 'https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg' },
  { id: 'CHS', name: 'Medicine', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'CAES', name: 'Agriculture', img: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=800' },
];

// Updated Reveal component to accept onClick prop
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
      // Added onClick handler to Reveal's container
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
          <div className="w-10 h-10 bg-[var(--brand-color)] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
          <span className="text-2xl font-black tracking-tighter text-[var(--brand-color)] hidden sm:block">MakSocial</span>
        </div>
        
        <div className="pointer-events-auto">
          <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
             Join Now
          </button>
        </div>
      </nav>

      {/* 2. HERO: SIMPLE & BIG */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Reveal>
            <span className="bg-emerald-50 text-[var(--brand-color)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
              Your Campus Community
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tight text-slate-900">
              The heart of <br />
              <span className="text-[var(--brand-color)]">Makerere.</span>
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-500 font-medium leading-relaxed">
              Connect with your classmates, share study notes, and stay up to date with everything happening on the Hill.
            </p>
          </Reveal>

          <Reveal delay={600} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button onClick={onStart} className="w-full sm:w-auto bg-[var(--brand-color)] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(16,145,138,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              Get Started <ArrowRight size={24} />
            </button>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-lg" alt="User" />
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">18k+</div>
            </div>
          </Reveal>
        </div>

        {/* HERO BACKGROUND IMAGE */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 -z-10 opacity-10">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover grayscale" alt="Makerere" />
        </div>
      </section>

      {/* 3. CAMPUS REEL: BIG IMAGES */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-screen-2xl mx-auto px-6">
          <Reveal className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Our <span className="text-[var(--brand-color)]">Campus</span> Life</h2>
            <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Explore the beauty of the Hill</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MAK_GALLERY.map((img, i) => (
              <Reveal key={i} delay={i * 200} className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={img.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{img.title}</h3>
                  <p className="text-sm text-white/70 font-medium">{img.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COLLEGE HUB: CIRCULAR DESIGN */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Select your <span className="text-[var(--brand-color)]">College</span></h2>
              <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">Find your specific hub and community</p>
            </Reveal>
            <button onClick={onStart} className="text-[var(--brand-color)] font-black text-sm uppercase tracking-widest flex items-center gap-2 group">
              See All Hubs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {COLLEGES.map((college, i) => (
              <Reveal key={college.id} delay={i * 100} className="flex flex-col items-center gap-4 group cursor-pointer" onClick={onStart}>
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-slate-50 shadow-xl group-hover:border-[var(--brand-color)] transition-all duration-500">
                  <img src={college.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={college.name} />
                  <div className="absolute inset-0 bg-[var(--brand-color)]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-center">
                   <span className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.id}</span>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mt-1">{college.name}</h4>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TOOLS FOR SUCCESS: SIMPLE BENTO */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Study Notes', desc: 'Find and share past papers and notes from other students.', icon: <BookOpen className="text-indigo-500" /> },
              { title: 'Campus Chat', desc: 'Talk to your friends and join groups in your college.', icon: <MessageSquare className="text-rose-500" /> },
              { title: 'Jobs & Gigs', desc: 'Find internships and part-time work for students.', icon: <Zap className="text-amber-500" /> },
              { title: 'Digital ID', desc: 'Your student identity, verified and always with you.', icon: <Fingerprint className="text-emerald-500" /> },
              { title: 'Lost & Found', desc: 'Did you lose something? Post it here and get it back.', icon: <Search className="text-[var(--brand-color)]" /> },
              { title: 'Event Hub', desc: 'Never miss a concert, sports match, or workshop.', icon: <Calendar size={24} className="text-indigo-600" /> }
            ].map((tool, i) => (
              <Reveal key={i} delay={i * 100} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {/* Cast tool.icon to React.ReactElement<any> to allow size prop injection via cloneElement */}
                  {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">{tool.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BIG CALL TO ACTION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[var(--brand-color)] rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <GraduationCap size={120} />
            </div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Ready to join your friends?</h2>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg mx-auto">
                Join thousands of other Makerere students and make the most of your university life.
              </p>
              <button onClick={onStart} className="bg-white text-[var(--brand-color)] px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER: SIMPLE & CLEAN */}
      <footer className="bg-slate-900 pt-24 pb-12 px-6 text-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--brand-color)] rounded-xl flex items-center justify-center text-white font-black text-xl">M</div>
                <span className="text-2xl font-black tracking-tighter">MakSocial</span>
              </div>
              <p className="max-w-md text-slate-400 font-medium leading-relaxed">
                The leading social platform for the Makerere University community. Built for students, by students.
              </p>
              <div className="flex gap-4">
                 {[Instagram, Twitter, Facebook, Github].map((Icon, i) => (
                   <a key={i} href="#" className="p-3 bg-white/5 rounded-full hover:bg-[var(--brand-color)] transition-all">
                     <Icon size={20} />
                   </a>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--brand-color)]">Quick Links</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Study Vault</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Campus News</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Jobs Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--brand-color)]">Contact</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li className="flex items-center gap-3"><Mail size={16}/> support@maksocial.mak.ac.ug</li>
                <li className="flex items-center gap-3"><Phone size={16}/> +256 414 531234</li>
                <li className="flex items-center gap-3"><MapPin size={16}/> Main Library Wing, Makerere</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 Mak Social Group. All Rights Reserved.</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
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
