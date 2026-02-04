
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
      
      {/* BACKGROUND ELEMENTS - THEME AWARE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.2] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--brand-color)]/5 dark:bg-[var(--brand-color)]/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* REFINED NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[var(--brand-color)] rounded-[var(--radius-main)] flex items-center justify-center shadow-xl shadow-[var(--brand-color)]/20">
              <Users size={20} className="text-white fill-white/10" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Pulse', 'Vault', 'Opportunities', 'Forge'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[var(--brand-color)] transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onStart} className="px-5 py-2 text-[var(--text-primary)] font-black text-[10px] uppercase tracking-widest hover:text-[var(--brand-color)] transition-colors">Sign In</button>
            <button onClick={onStart} className="bg-[var(--brand-color)] hover:brightness-110 text-white px-6 py-2.5 rounded-[var(--radius-main)] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Initialize Node</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)] mb-10 shadow-sm animate-in slide-in-from-top-4 duration-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registry Protocol v4.2 Stable</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter text-[var(--text-primary)] uppercase mb-10 animate-in fade-in duration-1000">
            Empowering <br />
            <span className="text-slate-400 dark:text-slate-600">The Hill's</span> <br />
            Digital DNA.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16 animate-in slide-in-from-bottom-2 duration-700 delay-200">
            The exclusive intelligence registry for Makerere University. Synchronize academic nodes, broadcast research signals, and access the secure scholarly vault.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-32 animate-in fade-in duration-1000 delay-500">
            <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-5 rounded-[var(--radius-main)] font-black text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl">
              Access Terminal <ArrowRight size={18} />
            </button>
            <button className="px-12 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-main)] font-black text-xs uppercase tracking-[0.3em] hover:border-slate-400 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-sm">
              View Manifest <Database size={16} />
            </button>
          </div>

          {/* LIVE CONTENT PREVIEW GRID */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-left animate-in slide-in-from-bottom-8 duration-1000 delay-700">
            
            {/* 1. PULSE PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden flex flex-col shadow-xl hover:border-[var(--brand-color)]/30 transition-all">
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                  <Activity size={14} className="text-indigo-500" /> Pulse_Stream
                </span>
                <span className="text-[8px] font-mono text-slate-400">ID: LIVE_SYNC</span>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { author: 'vc_office', text: 'New research grants authorized for 2026 strata.', time: '2m' },
                  { author: 'guild_news', text: 'Handover ceremony initialized at Main Hall.', time: '12m' }
                ].map((post, i) => (
                  <div key={i} className="space-y-1.5 group cursor-pointer">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-[var(--text-primary)] uppercase">@{post.author}</span>
                      <span className="text-slate-400 font-mono">{post.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed group-hover:text-[var(--brand-color)] transition-colors">"{post.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VAULT PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden flex flex-col shadow-xl hover:border-[var(--brand-color)]/30 transition-all">
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                  <BookOpen size={14} className="text-emerald-500" /> The_Vault_Assets
                </span>
                <span className="text-[8px] font-mono text-slate-400">ID: ENCRYPTED</span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { title: 'Computer Architecture II', type: 'PDF', wing: 'COCIS' },
                  { title: 'Structural Analysis', type: 'ZIP', wing: 'CEDAT' }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-[var(--radius-main)] border border-[var(--border-color)] hover:border-slate-400 transition-all cursor-pointer group shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={16} className="text-slate-400 group-hover:text-[var(--brand-color)]" />
                       <div className="min-w-0">
                          <p className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase">{file.title}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase">{file.wing} WING</p>
                       </div>
                    </div>
                    <Download size={14} className="text-slate-400 shrink-0 group-hover:text-[var(--brand-color)] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. OPPORTUNITIES PREVIEW */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden flex flex-col shadow-xl hover:border-[var(--brand-color)]/30 transition-all">
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                  <Zap size={14} className="text-amber-500" /> Opportunity_Nodes
                </span>
                <span className="text-[8px] font-mono text-slate-400">ID: ACTIVE</span>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { title: 'Neural Net Assistant', benefit: 'UGX 800k', type: 'Internship' },
                  { title: 'Constitutional Research', benefit: 'Verified Credential', type: 'Gig' }
                ].map((opp, i) => (
                  <div key={i} className="space-y-2 group cursor-pointer border-b border-[var(--border-color)] last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-black text-[var(--text-primary)] group-hover:text-[var(--brand-color)] transition-colors uppercase tracking-tight">{opp.title}</span>
                      <span className="text-[7px] font-black uppercase text-slate-400 px-2 py-0.5 bg-[var(--bg-primary)] rounded-full border border-[var(--border-color)]">{opp.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">
                       <span className="flex items-center gap-1.5"><Star size={10} className="text-amber-500"/> {opp.benefit}</span>
                       <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE GRID */}
      <section id="pulse" className="py-32 px-6 z-10 relative border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6 leading-none">Unified Academic <br /> Infrastructure.</h2>
            <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed">MakSocial synchronizes identity, data, and communication in a high-security strata across all university wings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={32}/>, title: 'Verified Nodes', desc: 'Every account is synchronized with university credentials for 100% data integrity.' },
              { icon: <Globe size={32}/>, title: 'Universal Hub', desc: 'Broadcast signals and coordinate across the entire 45,000+ student network.' },
              { icon: <MessageSquare size={32}/>, title: 'Encrypted Uplink', desc: 'Secure direct-link messaging and resource sharing for academic peer review.' },
              { icon: <Lock size={32}/>, title: 'Vault Security', desc: 'Highly secure, redundant repository for university assets and research documents.' }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-main)] group hover:border-[var(--brand-color)] transition-all shadow-sm hover:shadow-2xl">
                <div className="text-slate-400 mb-8 group-hover:scale-110 transition-transform group-hover:text-[var(--brand-color)]">{feature.icon}</div>
                <h4 className="text-xl font-black text-[var(--text-primary)] uppercase mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="py-48 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
             Establish <br /> Your Node.
           </h2>
           <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
             The Hill never sleeps. Establish your permanent node within the most advanced digital ecosystem at Makerere University.
           </p>
           <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-16 py-6 rounded-[var(--radius-main)] font-black text-sm uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl active:scale-95 hover:scale-105">
              Initialize Enrollment
           </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded">
                <Users size={24} className="text-[var(--brand-color)]" />
             </div>
             <span className="text-xl font-black uppercase text-[var(--text-primary)] tracking-tighter">MakSocial Protocol</span>
          </div>
          <div className="text-center md:text-right space-y-2">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
               © 2026 MakSocial Registry. <br /> Authorized for Makerere University Node Sync.
             </p>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-50">STATUS: ENCRYPTED_STABLE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
