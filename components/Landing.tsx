import React from "react";
import { 
  ArrowRight, Zap, Globe, Users, ShieldCheck, 
  Sparkles, GraduationCap, Radio, Search, 
  MessageSquare, BookOpen, Terminal, Code,
  GitBranch, Activity, Database, Box, Cpu,
  Star, Command, ExternalLink, ChevronRight, Check
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen overflow-x-hidden selection:bg-[#64748b]/30 font-sans">
      
      {/* 1. PRODUCT NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="p-1.5 bg-[#161b22] border border-[#30363d] rounded group-hover:border-[#64748b] transition-all">
              <Terminal size={18} className="text-[#64748b]" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] hover:text-white transition-colors">Infrastructure</a>
            <a href="#vault" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] hover:text-white transition-colors">The Vault</a>
            <a href="#impact" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] hover:text-white transition-colors">Network Stats</a>
          </div>

          <div className="flex items-center gap-4">
             <button
               onClick={onStart}
               className="bg-white text-black px-6 py-2 rounded font-black text-[10px] uppercase tracking-widest hover:bg-[#c9d1d9] transition-all active:scale-95 shadow-lg"
             >
               Initialize Node
             </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: CLARITY & POWER */}
      <section className="relative pt-48 pb-32 px-6 bg-grid-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117] to-[#0d1117]"></div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-[#64748b]/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Registry v4.2 Stable Release</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase text-white">
                The Central <span className="text-[#64748b]">Hub</span> For Campus <br /> Intelligence.
              </h1>

              <p className="text-lg md:text-xl text-[#8b949e] font-bold max-w-xl leading-relaxed">
                Connect with verified student nodes across all university wings. Broadcast academic signals, collaborate in secure forges, and access the scholarly vault.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={onStart}
                  className="bg-[#64748b] text-white px-10 py-5 rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-[#475569] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Start Your Registry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-6 pl-4 border-l border-[#30363d]">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}99`} className="w-10 h-10 rounded-full border-2 border-[#0d1117] bg-[#161b22]" />
                      ))}
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-white text-sm font-black">50,000+ Nodes</p>
                      <p className="text-[#8b949e] text-[9px] font-bold uppercase tracking-widest">Active Synchronizations</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
               <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative rounded-[1.5rem] border border-[#30363d] bg-[#161b22] p-2 overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200" 
                    className="w-full rounded-[1rem] object-cover h-[500px] grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                    alt="Collaboration Image"
                  />
                  <div className="absolute bottom-10 left-10 p-6 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-xs">
                     <p className="text-[9px] font-black uppercase text-[#64748b] tracking-widest mb-2">Live Node Activity</p>
                     <p className="text-xs font-bold text-white leading-relaxed">
                        "Node 4A91 synchronized with the Academic Vault in the COCIS Wing."
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT TOUR: HOW IT WORKS */}
      <section id="features" className="py-32 px-6 border-t border-[#30363d]">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Feature 1: The Registry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative rounded-[2rem] overflow-hidden border border-[#30363d] h-[450px]">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200" 
                  className="w-full h-full object-cover grayscale brightness-50"
                  alt="Students Networking"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-8 bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl space-y-4 max-w-xs">
                      <Users size={40} className="text-indigo-500" />
                      <h4 className="text-xl font-black uppercase text-white tracking-tighter">Unified Registry</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Every student is a node. Find peers by skill, hub, or project intent.</p>
                   </div>
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.5em]">Module_01</h2>
                <h3 className="text-5xl font-black tracking-tighter uppercase text-white leading-[1]">Identity <br />Synchronization.</h3>
                <p className="text-lg text-[#8b949e] font-bold leading-relaxed">
                   Stop working in silos. The Registry connects you to the entire Makerere intelligence network. Browse student profiles verified by their academic wing.
                </p>
                <ul className="space-y-4">
                   {[
                     'Direct Node Messaging (Encrypted)',
                     'Wing-Specific Identity Badges',
                     'Skill Strata Verification'
                   ].map(item => (
                     <li key={item} className="flex items-center gap-3 text-sm font-black uppercase text-white tracking-widest">
                        <Check size={18} className="text-emerald-500" /> {item}
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          {/* Feature 2: The Vault */}
          <div id="vault" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
                <h2 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.5em]">Module_02</h2>
                <h3 className="text-5xl font-black tracking-tighter uppercase text-white leading-[1]">The Academic <br />Resource Vault.</h3>
                <p className="text-lg text-[#8b949e] font-bold leading-relaxed">
                   Access over 100,000 decrypted academic assets. Share, sync, and download past papers, research theses, and technical briefs curated by the community.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                      <p className="text-2xl font-black text-white">100k+</p>
                      <p className="text-[9px] font-black uppercase text-[#64748b] tracking-widest">Logged Assets</p>
                   </div>
                   <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                      <p className="text-2xl font-black text-white">UGX 0</p>
                      <p className="text-[9px] font-black uppercase text-[#64748b] tracking-widest">Access Fee</p>
                   </div>
                </div>
             </div>
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                <div className="relative rounded-[2rem] overflow-hidden border border-[#30363d] h-[550px] shadow-2xl">
                   <img 
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200" 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-1000"
                    alt="Library Assets"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
                   <div className="absolute bottom-10 left-10 right-10 grid grid-cols-1 gap-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <BookOpen size={16} className="text-[#64748b]" />
                              <span className="text-[10px] font-black uppercase text-white tracking-widest">Asset_Log_{i}284.PDF</span>
                           </div>
                           <span className="text-[8px] font-bold text-[#64748b] uppercase">Verified</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS STRIP */}
      <section id="impact" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.5em]">Real-Time Metrics</h2>
              <h3 className="text-4xl font-black tracking-tighter uppercase text-black italic">Network Velocity.</h3>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Verified Student Nodes', val: '50,000+', icon: <Users size={24}/> },
              { label: 'Signals Transmitted', val: '1.2M+', icon: <Radio size={24}/> },
              { label: 'Repository Assets', val: '108,492', icon: <Database size={24}/> },
              { label: 'Uptime Protocol', val: '99.99%', icon: <ShieldCheck size={24}/> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3 text-black group">
                 <div className="p-4 bg-black/5 rounded-2xl group-hover:scale-110 transition-transform text-[#64748b]">
                    {item.icon}
                 </div>
                 <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">{item.val}</h3>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-48 px-6 relative overflow-hidden bg-[#0d1117]">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
           <div className="inline-block p-4 bg-[#64748b] rounded-2xl shadow-2xl mb-6">
              <Terminal size={48} className="text-white" />
           </div>
           <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] animate-in slide-in-from-bottom-10">
             Uplink <br />
             Confirmed.
           </h2>
           <p className="text-xl text-[#8b949e] font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
             Join the definitive intelligence network for university excellence. Register your node to begin synchronization.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <button
                onClick={onStart}
                className="bg-white text-black px-16 py-7 rounded font-black text-sm uppercase tracking-[0.3em] hover:bg-[#c9d1d9] transition-all shadow-2xl active:scale-95 flex items-center gap-4"
              >
                Create Account <Zap size={20} fill="currentColor" />
              </button>
              <button className="text-[11px] font-black uppercase tracking-widest text-[#8b949e] hover:text-white flex items-center gap-2 group transition-all">
                Registry Docs <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-20 px-6 border-t border-[#30363d] bg-[#010409]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#161b22] border border-[#30363d] rounded text-[#64748b]">
              <Terminal size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">MakSocial</span>
          </div>
          
          <div className="flex gap-10">
             <a href="#" className="text-[9px] font-black uppercase text-[#8b949e] hover:text-white transition-colors">Repository</a>
             <a href="#" className="text-[9px] font-black uppercase text-[#8b949e] hover:text-white transition-colors">Protocol Status</a>
             <a href="#" className="text-[9px] font-black uppercase text-[#8b949e] hover:text-white transition-colors">Audit Log</a>
          </div>

          <p className="text-[9px] font-black text-[#484f58] uppercase tracking-[0.3em]">
            © 2026 MakSocial Registry. Initialized via Open Protocol.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;