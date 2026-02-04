
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  Search, MessageSquare, BookOpen, ChevronRight,
  Database, Terminal, Cpu, Activity, Lock,
  FileText, Star, GitFork, ExternalLink, Download,
  ArrowUpRight
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
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden selection:bg-slate-700 selection:text-white font-sans transition-colors duration-500">
      
      {/* BACKGROUND ELEMENTS - THEME AWARE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.4] dark:opacity-[0.1]" 
             style={{ backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--brand-color)]/5 blur-[100px] rounded-full"></div>
      </div>

      {/* REFINED NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 bg-[var(--brand-color)] rounded-[2px] flex items-center justify-center shadow-lg">
              <Users size={18} className="text-white fill-white/10" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-[var(--text-primary)]">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Pulse', 'Vault', 'Opportunities', 'Forge'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onStart} className="px-5 py-2 text-[var(--text-primary)] font-bold text-[10px] uppercase tracking-widest hover:text-[var(--brand-color)] transition-colors">Sign In</button>
            <button onClick={onStart} className="bg-[var(--brand-color)] hover:brightness-110 text-white px-5 py-2 rounded-[2px] font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg">Initialize Node</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-secondary)] rounded-[2px] border border-[var(--border-color)] mb-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Registry Protocol v4.2 Stable</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tight text-[var(--text-primary)] uppercase mb-8">
            Empowering <br />
            <span className="text-slate-400">The Hill's</span> <br />
            Digital DNA.
          </h1>
          
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            The exclusive intelligence registry for Makerere University. Synchronize nodes, broadcast research signals, and access the scholarly vault.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-32">
            <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-10 py-4 rounded-[2px] font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
              Access Terminal <ArrowRight size={18} />
            </button>
            <button className="px-10 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[2px] font-black text-xs uppercase tracking-widest hover:border-slate-400 transition-all active:scale-95 flex items-center justify-center gap-3">
              View Manifest <Database size={16} />
            </button>
          </div>

          {/* LIVE CONTENT PREVIEW GRID */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* 1. PULSE PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Activity size={14}/> Pulse_Stream
                </span>
                <span className="text-[8px] font-mono text-slate-400">LIVE_HANDSHAKE</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { author: 'vc_office', text: 'New research grants authorized for 2026 strata.', time: '2m' },
                  { author: 'guild_news', text: 'Handover ceremony initialized at Main Hall.', time: '12m' }
                ].map((post, i) => (
                  <div key={i} className="space-y-1 group cursor-pointer">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-[var(--text-primary)]">{post.author}</span>
                      <span className="text-slate-400 font-mono">{post.time} ago</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 group-hover:text-[var(--brand-color)] transition-colors">"{post.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VAULT PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <BookOpen size={14}/> The_Vault_Assets
                </span>
                <span className="text-[8px] font-mono text-slate-400">ENCRYPTED_STABLE</span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { title: 'Computer Architecture II', type: 'PDF', wing: 'COCIS' },
                  { title: 'Structural Analysis', type: 'ZIP', wing: 'CEDAT' }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-primary)] rounded-[2px] border border-[var(--border-color)] hover:border-slate-400 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={16} className="text-slate-400 group-hover:text-[var(--brand-color)]" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-black text-[var(--text-primary)] truncate">{file.title}</p>
                          <p className="text-[8px] text-slate-400 uppercase">{file.wing} WING</p>
                       </div>
                    </div>
                    <Download size={14} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. OPPORTUNITIES PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Database size={14}/> Opportunity_Nodes
                </span>
                <span className="text-[8px] font-mono text-slate-400">ACTIVE_RECRUIT</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { title: 'Neural Net Assistant', benefit: 'UGX 800k', type: 'Internship' },
                  { title: 'Constitutional Research', benefit: 'Verified Credential', type: 'Gig' }
                ].map((opp, i) => (
                  <div key={i} className="space-y-1.5 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[var(--text-primary)] group-hover:text-[var(--brand-color)] transition-colors">{opp.title}</span>
                      <span className="text-[8px] font-black uppercase text-slate-400 px-1.5 py-0.5 bg-[var(--bg-primary)] rounded-[2px] border border-[var(--border-color)]">{opp.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                       <span>{opp.benefit}</span>
                       <ArrowUpRight size={12}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE GRID */}
      <section id="vault" className="py-32 px-6 z-10 relative border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">Unified Academic Infrastructure.</h2>
            <p className="text-slate-500 font-medium max-w-xl">MakSocial synchronizes identity, data, and communication in a high-security strata across all 9 university wings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={24}/>, title: 'Verified Nodes', desc: 'Every account is synchronized with university credentials.' },
              { icon: <Globe size={24}/>, title: 'Universal Hub', desc: 'Broadcast signals across the entire university network.' },
              { icon: <MessageSquare size={24}/>, title: 'Encrypted Uplink', desc: 'Secure direct-link messaging for academic peer review.' },
              { icon: <Lock size={24}/>, title: 'Vault Security', desc: 'Highly secure repository for university research assets.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] group hover:border-slate-400 transition-all shadow-sm">
                <div className="text-slate-400 mb-6 group-hover:scale-110 transition-transform group-hover:text-[var(--brand-color)]">{feature.icon}</div>
                <h4 className="text-lg font-black text-[var(--text-primary)] uppercase mb-3">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="py-40 px-6 relative z-10 bg-gradient-to-b from-transparent to-[var(--bg-secondary)]/50">
        <div className="max-w-4xl mx-auto text-center space-y-10">
           <h2 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">
             Join The <br /> Registry.
           </h2>
           <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
             The Hill never sleeps. Establish your node within the most advanced digital ecosystem at Makerere.
           </p>
           <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-5 rounded-[2px] font-black text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-2xl active:scale-95">
              Initialize Enrollment
           </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <Users size={20} className="text-[var(--brand-color)]" />
             <span className="text-lg font-black uppercase text-[var(--text-primary)] tracking-tighter">MakSocial Protocol</span>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] text-center md:text-right">
            © 2026 MakSocial Registry. <br /> Authorized for Makerere University Node Sync.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
