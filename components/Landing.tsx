
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Zap, Globe, Users, ShieldCheck, 
  Sparkles, GraduationCap, Radio, Search, 
  MessageSquare, BookOpen, ChevronRight,
  Database, Terminal, Cpu, Activity, Lock
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
      
      {/* BACKGROUND ELEMENTS - GITHUB STYLE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.15]" 
             style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* NAVIGATION BAR - REFINED MINI */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d]' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-110">
              <Zap size={22} className="text-black fill-black" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase text-white">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Registry', 'Nodes', 'Architecture', 'Protocol'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8b949e] hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onStart}
              className="px-6 py-2.5 bg-transparent border border-[#30363d] text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={onStart}
              className="bg-white text-black px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#f0f0f0] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Initialize Node
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - THE HILL'S DNA */}
      <section className="relative pt-60 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
          
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8b949e]">Registry Protocol v4.2 Stable</span>
            <ChevronRight size={14} className="text-[#30363d]" />
          </div>

          <div className="space-y-6 max-w-5xl">
            <h1 className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter text-white uppercase italic">
              Empowering <br />
              <span className="bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent">The Hill's</span> <br />
              Digital DNA.
            </h1>
            <p className="text-lg md:text-xl text-[#8b949e] font-medium max-w-2xl mx-auto leading-relaxed">
              Makerere's premier intelligence registry. Synchronize academic nodes, broadcast opportunities, and scale research collaboration across the university strata.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="group bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0f0f0] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-white/10"
            >
              Access Terminal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-12 py-5 bg-[#161b22] border border-[#30363d] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#1c2128] hover:border-[#8b949e] transition-all active:scale-95 flex items-center justify-center gap-3">
              Explore Strata <Database size={16} />
            </button>
          </div>

          {/* ACTIVITY GRAPHICS */}
          <div className="w-full max-w-4xl pt-20">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-[2rem] p-1 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
               <div className="bg-[#161b22] rounded-[1.8rem] p-8 md:p-12 border border-[#30363d] flex flex-col md:flex-row items-center gap-12 text-left">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg"><Terminal size={20} className="text-emerald-500" /></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Live_Uplink</span>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Real-time Node Pulse</h3>
                    <p className="text-sm text-[#8b949e] leading-relaxed">
                      Monitoring 50,000+ student entities across 9 academic wings. Every commit, every signal, unified in a single high-performance strata.
                    </p>
                    <div className="flex gap-2 h-1 w-full bg-[#0d1117] rounded-full overflow-hidden">
                       {[...Array(12)].map((_, i) => (
                         <div key={i} className={`h-full flex-1 ${i < 8 ? 'bg-emerald-500 animate-pulse' : 'bg-[#30363d]'}`} 
                              style={{ animationDelay: `${i * 100}ms` }}></div>
                       ))}
                    </div>
                  </div>
                  <div className="w-full md:w-64 aspect-square bg-[#0d1117] border border-[#30363d] rounded-[2rem] flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                     <Cpu size={80} className="text-[#30363d] group-hover:text-emerald-500/50 transition-all duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFINED METRICS */}
      <section className="border-y border-[#30363d] bg-[#161b22]/30 py-16 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Active_Nodes', val: '52,401', icon: <Users size={20}/> },
            { label: 'Wing_Clusters', val: '09', icon: <GraduationCap size={20}/> },
            { label: 'Registry_Syncs', val: '1.4M+', icon: <Globe size={20}/> },
            { label: 'Uptime_Protocol', val: '99.98%', icon: <ShieldCheck size={20}/> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 group">
               <div className="text-[#8b949e] group-hover:text-white transition-colors">
                  {item.icon}
               </div>
               <div className="space-y-0">
                 <h3 className="text-3xl font-black tracking-tighter text-white tabular-nums">{item.val}</h3>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b949e]">{item.label}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* OBSIDIAN BENTO GRID - ARCHITECTURE */}
      <section id="architecture" className="py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.5em]">System Architecture</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Built for the Global Student.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LARGE TILE 1 */}
            <div className="md:col-span-2 bg-[#161b22] border border-[#30363d] rounded-[3rem] p-10 flex flex-col justify-between group hover:border-[#8b949e] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12">
                  <Search size={240} className="text-white" />
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="w-14 h-14 bg-[#0d1117] border border-[#30363d] rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Search size={28} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Signal Discovery</h4>
                    <p className="text-[#8b949e] max-w-md font-medium text-lg leading-relaxed">
                      Advanced search algorithms to scan the global pulse. Locating research grants, technical papers, and student innovations with sub-second latency.
                    </p>
                  </div>
               </div>
               <div className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
                 <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Indexed_Clusters</span>
                 <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified_Sources</span>
               </div>
            </div>

            {/* SMALL TILE 1 */}
            <div className="bg-indigo-600 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl shadow-indigo-600/20 text-white group hover:scale-[1.02] transition-all">
               <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20">
                  <MessageSquare size={32} className="fill-white" />
               </div>
               <div className="space-y-6">
                  <h4 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Node Sync</h4>
                  <p className="text-white/80 font-medium leading-relaxed">
                    Encrypted direct-link messaging and isolated wing channels for high-density collaboration.
                  </p>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all">Establish Protocol</button>
               </div>
            </div>

            {/* SMALL TILE 2 */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[3rem] p-10 flex flex-col justify-between group hover:border-[#8b949e] transition-all">
               <div className="w-16 h-16 bg-[#0d1117] border border-[#30363d] rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                  <BookOpen size={32} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-white">The Vault</h4>
                  <p className="text-[#8b949e] font-medium leading-relaxed">
                    Unrestricted access to the secure repository of past papers, research assets, and scholarly intelligence.
                  </p>
                  <div className="flex -space-x-3 pt-4">
                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#161b22] bg-[#30363d]" />)}
                    <div className="w-10 h-10 rounded-full border-2 border-[#161b22] bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">+4k</div>
                  </div>
               </div>
            </div>

            {/* LARGE TILE 2 */}
            <div className="md:col-span-2 relative h-[500px] rounded-[3rem] overflow-hidden border border-[#30363d] group shadow-xl bg-[#0d1117]">
               <img 
                 src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200" 
                 className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
               <div className="absolute bottom-12 left-12 space-y-6 pr-12">
                  <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-500 backdrop-blur-md">
                    <Radio size={28} className="animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic">Wing Broadcasts</h4>
                    <p className="text-[#8b949e] max-w-lg font-medium text-lg">
                      Localized intelligence nodes for COCIS, CEDAT, and LAW. Your college's pulse, isolated and amplified within the Hill Registry.
                    </p>
                  </div>
                  <div className="flex gap-4">
                     {['COCIS', 'CEDAT', 'LAW', 'CHS'].map(w => (
                       <span key={w} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-[#8b949e] uppercase tracking-widest">{w} Hub</span>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL PROTOCOL JOIN */}
      <section className="py-48 px-6 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-500">
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Node Enrollment</span>
           </div>
           <h2 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none">
             Join The <br />
             Hill Registry.
           </h2>
           <p className="text-xl md:text-2xl text-[#8b949e] font-medium max-w-2xl mx-auto leading-relaxed italic">
             "The Hill never sleeps. Synchronize your identity with the most advanced digital strata at Makerere University."
           </p>
           <div className="pt-8">
            <button
              onClick={onStart}
              className="bg-white text-black px-16 py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-[#f0f0f0] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 hover:scale-105"
            >
              Initialize Node Registration
            </button>
           </div>
        </div>
      </section>

      {/* GITHUB STYLE FOOTER */}
      <footer className="py-24 px-6 border-t border-[#30363d] bg-[#0d1117] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Zap size={28} className="text-white fill-white" />
              <span className="text-2xl font-black italic tracking-tighter uppercase text-white">MakSocial</span>
            </div>
            <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-[0.5em] leading-loose">
              © 2026 MakSocial Registry Protocol. <br />
              Authorized for Makerere University Node Sync.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
             <div className="space-y-4">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Protocol</h4>
                <ul className="space-y-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                   <li className="hover:text-white cursor-pointer">Registry</li>
                   <li className="hover:text-white cursor-pointer">Documentation</li>
                   <li className="hover:text-white cursor-pointer">Security</li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Nodes</h4>
                <ul className="space-y-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                   <li className="hover:text-white cursor-pointer">Directory</li>
                   <li className="hover:text-white cursor-pointer">Opportunities</li>
                   <li className="hover:text-white cursor-pointer">Uplink</li>
                </ul>
             </div>
             <div className="space-y-4 col-span-2 md:col-span-1">
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">System</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500">
                   <Activity size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Global Sync: Stable</span>
                </div>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Landing;
