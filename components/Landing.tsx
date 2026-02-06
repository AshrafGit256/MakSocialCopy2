
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  Search, MessageSquare, BookOpen, ChevronRight,
  Database, Terminal, Cpu, Activity, Lock,
  FileText, Star, GitFork, ExternalLink, Download,
  ArrowUpRight, Zap
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden selection:bg-[var(--brand-color)] selection:text-white font-sans transition-colors duration-500">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.2] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[var(--brand-color)] rounded-sm flex items-center justify-center shadow-xl shadow-[var(--brand-color)]/20">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">MakSocial</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onStart} className="px-5 py-2 text-[var(--text-primary)] font-black text-[10px] uppercase tracking-widest hover:text-[var(--brand-color)] transition-colors">Log In</button>
            <button onClick={onStart} className="bg-[var(--brand-color)] hover:brightness-110 text-white px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Join Now</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 z-10">
        <div className="max-w-7xl auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)] mb-10 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Student Community</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter text-[var(--text-primary)] uppercase mb-10">
            Connecting <br />
            <span className="text-slate-400">Makerere</span> <br />
            Students.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            The social network built for The Hill. Connect with classmates, share study notes, and discover opportunities on campus.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-32">
            <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl">
              Get Started <ArrowRight size={18} />
            </button>
            <button className="px-12 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-sm font-black text-xs uppercase tracking-[0.3em] hover:border-slate-400 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-sm">
              Explore Campus <BookOpen size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="community" className="py-32 px-6 z-10 relative border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6 leading-none">Built for <br /> You.</h2>
            <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed">Everything you need to succeed at university in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={32}/>, title: 'Verified Students', desc: 'Connect safely with verified members of the university community.' },
              { icon: <Globe size={32}/>, title: 'Campus News', desc: 'Stay updated with live news and announcements from every college.' },
              { icon: <MessageSquare size={32}/>, title: 'Easy Messaging', desc: 'Talk to your friends and project partners in private chat groups.' },
              { icon: <Lock size={32}/>, title: 'Study Vault', desc: 'Access past papers, notes, and shared books from other students.' }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm group hover:border-[var(--brand-color)] transition-all shadow-sm">
                <div className="text-slate-400 mb-8 group-hover:text-[var(--brand-color)] transition-colors">{feature.icon}</div>
                <h4 className="text-xl font-black text-[var(--text-primary)] uppercase mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded">
                <Users size={24} className="text-[var(--brand-color)]" />
             </div>
             <span className="text-xl font-black uppercase text-[var(--text-primary)] tracking-tighter">MakSocial</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 Makerere Social Network.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
