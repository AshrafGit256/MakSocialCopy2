import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Zap, Globe, Users, ShieldCheck, 
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
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.1]" 
             style={{ backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[100px] rounded-full"></div>
      </div>

      {/* REFINED NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-[#0d1117]/90 backdrop-blur-md border-b border-[#30363d]' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-white">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Pulse', 'Vault', 'Opportunities', 'Forge'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onStart} className="px-5 py-2 text-white font-bold text-[10px] uppercase tracking-widest hover:text-indigo-400 transition-colors">Sign In</button>
            <button onClick={onStart} className="bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg">Initialize Node</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#161b22] rounded border border-[#30363d] mb-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Registry Protocol v4.2 Stable</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tight text-white uppercase mb-8">
            Empowering <br />
            <span className="text-indigo-500">The Hill's</span> <br />
            Digital DNA.
          </h1>
          
          <p className="text-lg text-[#8b949e] font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            The exclusive intelligence registry for Makerere University. Synchronize nodes, broadcast research signals, and access the scholarly vault.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-32">
            <button onClick={onStart} className="bg-white text-black px-10 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-[#f0f0f0] transition-all flex items-center justify-center gap-3 active:scale-95">
              Access Terminal <ArrowRight size={18} />
            </button>
            <button className="px-10 py-4 bg-[#161b22] border border-[#30363d] text-white rounded font-black text-xs uppercase tracking-widest hover:border-[#8b949e] transition-all active:scale-95 flex items-center justify-center gap-3">
              View Manifest <Database size={16} />
            </button>
          </div>

          {/* LIVE CONTENT PREVIEW GRID */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* 1. PULSE PREVIEW */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                  <Activity size={14}/> Pulse_Stream
                </span>
                <span className="text-[8px] font-mono text-slate-500">LIVE_HANDSHAKE</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { author: 'vc_office', text: 'New research grants authorized for 2026 strata.', time: '2m' },
                  { author: 'guild_news', text: 'Handover ceremony initialized at Main Hall.', time: '12m' }
                ].map((post, i) => (
                  <div key={i} className="space-y-1 group cursor-pointer">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-white">{post.author}</span>
                      <span className="text-slate-500 font-mono">{post.time} ago</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-indigo-400 transition-colors">"{post.text}"</p>
                  </div>
                ))}
                <div className="pt-4 mt-2 border-t border-[#30363d] flex justify-center">
                  <button className="text-[9px] font-bold uppercase text-slate-500 hover:text-white flex items-center gap-1">
                    View full manifest <ChevronRight size={12}/>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. VAULT PREVIEW */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <BookOpen size={14}/> The_Vault_Assets
                </span>
                <span className="text-[8px] font-mono text-slate-500">ENCRYPTED_STABLE</span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { title: 'Computer Architecture II', type: 'PDF', wing: 'COCIS' },
                  { title: 'Structural Analysis', type: 'ZIP', wing: 'CEDAT' }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#0d1117] rounded border border-[#30363d] hover:border-emerald-500/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={16} className="text-slate-500 group-hover:text-emerald-500" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-black text-white truncate">{file.title}</p>
                          <p className="text-[8px] text-slate-500 uppercase">{file.wing} WING</p>
                       </div>
                    </div>
                    <Download size={14} className="text-slate-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. OPPORTUNITIES PREVIEW */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                  <Zap size={14}/> Opportunity_Nodes
                </span>
                <span className="text-[8px] font-mono text-slate-500">ACTIVE_RECRUIT</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { title: 'Neural Net Assistant', benefit: 'UGX 800k', type: 'Internship' },
                  { title: 'Constitutional Research', benefit: 'Verified Credential', type: 'Gig' }
                ].map((opp, i) => (
                  <div key={i} className="space-y-1.5 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-white group-hover:text-amber-500 transition-colors">{opp.title}</span>
                      <span className="text-[8px] font-black uppercase text-amber-500 px-1.5 py-0.5 bg-amber-500/10 rounded">{opp.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                       <span>{opp.benefit}</span>
                       {/* Comment: Added ArrowUpRight icon to fix 'Cannot find name' error */}
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
      <section id="vault" className="py-32 px-6 z-10 relative border-t border-[#30363d]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Unified Academic Infrastructure.</h2>
            <p className="text-[#8b949e] font-medium max-w-xl">MakSocial synchronizes identity, data, and communication in a high-security strata across all 9 university wings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <ShieldCheck size={24}/>, title: 'Verified Nodes', desc: 'Every account is synchronized with university credentials.' },
              { icon: <Globe size={24}/>, title: 'Universal Hub', desc: 'Broadcast signals across the entire university network.' },
              { icon: <MessageSquare size={24}/>, title: 'Encrypted Uplink', desc: 'Secure direct-link messaging for academic peer review.' },
              { icon: <Lock size={24}/>, title: 'Vault Security', desc: 'Highly secure repository for university research assets.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-[#161b22] border border-[#30363d] rounded-lg group hover:border-indigo-500 transition-all">
                <div className="text-indigo-500 mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h4 className="text-lg font-black text-white uppercase mb-3">{feature.title}</h4>
                <p className="text-sm text-[#8b949e] leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="py-40 px-6 relative z-10 bg-gradient-to-b from-transparent to-indigo-950/20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
           <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
             Join The <br /> Registry.
           </h2>
           <p className="text-lg text-[#8b949e] font-medium max-w-xl mx-auto italic">
             The Hill never sleeps. Establish your node within the most advanced digital ecosystem at Makerere.
           </p>
           <button onClick={onStart} className="bg-indigo-600 text-white px-12 py-5 rounded font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-2xl active:scale-95">
              Initialize Enrollment
           </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-[#30363d] bg-[#0d1117] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <Zap size={20} className="text-white fill-white" />
             <span className="text-lg font-black uppercase text-white tracking-tighter">MakSocial Protocol</span>
          </div>
          <p className="text-[9px] font-bold text-[#8b949e] uppercase tracking-[0.4em] text-center md:text-right">
            © 2026 MakSocial Registry. <br /> Authorized for Makerere University Node Sync.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;