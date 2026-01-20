
import React from 'react';
import { Rocket, ShieldCheck, ShoppingBag, ArrowRight, Github, Twitter, Facebook, Sparkles, Zap, Brain, Target, Globe, Users } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#05080c] text-white flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/5 blur-[150px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="px-12 py-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#05080c]/60">
        <div className="flex items-center gap-3">
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
            className="w-16 h-16 hover:scale-110 transition-transform"
          />
          <span className="text-3xl font-cursive text-indigo-500 hidden sm:block">MakSocial</span>
        </div>
        <div className="hidden md:flex items-center space-x-12 text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.4em]">Intelligence</a>
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.4em]">Vault</a>
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.4em]">Colleges</a>
          <a href="#" className="hover:text-white transition-all hover:tracking-[0.4em]">Security</a>
        </div>
        <button 
          onClick={onStart}
          className="bg-indigo-600 text-white px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 border border-white/10"
        >
          Initialize Node
        </button>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 relative py-32 lg:py-48">
        <div className="max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
              <Sparkles size={14}/> Network Synchronization Active
           </div>
           <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase italic">
             The <span className="text-indigo-500">Neural Hub</span> <br className="hidden md:block" /> for Elite Scholars.
           </h1>
           <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
             Bridge the gap between academic theory and community impact. MakSocial is the encrypted layer for collaboration across all university wings.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-white text-black px-14 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-white/10 hover:bg-indigo-500 hover:text-white"
              >
                Join the Network <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 px-14 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all backdrop-blur-xl text-white">
                Inspect Public Signals
              </button>
           </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-32 w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 px-6 animate-in fade-in duration-1000 delay-500">
           {[
             { val: '24k+', label: 'Active Nodes', icon: <Users size={16}/> },
             { val: '1.2M', label: 'Signal Broadcasts', icon: <Zap size={16}/> },
             { val: '9 Wings', label: 'College Synchronization', icon: <Target size={16}/> },
             { val: '99.9%', label: 'Registry Uptime', icon: <Globe size={16}/> },
           ].map((stat, i) => (
             <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-indigo-600/10 transition-all">
                <div className="text-indigo-500 mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-4xl font-black italic tracking-tighter mb-1">{stat.val}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Feature Clusters */}
      <section className="px-12 py-32 border-y border-white/5 bg-gradient-to-b from-[#05080c] to-indigo-900/5">
         <div className="max-w-7xl mx-auto space-y-32">
            <div className="flex flex-col md:flex-row items-end justify-between gap-10">
               <div className="space-y-6">
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Designed for <br/> <span className="text-indigo-500">Modern Academia.</span></h2>
                  <p className="text-slate-400 text-lg max-w-xl">Move beyond basic interaction. Access specialized vaults, live ceremony broadcasts, and discipline-specific hubs.</p>
               </div>
               <div className="h-[2px] flex-1 bg-white/5 mx-10 hidden lg:block"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { 
                   title: 'Neural Hubs', 
                   desc: 'Isolated college environments to focus on specific academic pulses and career signals.',
                   icon: <Brain className="text-indigo-500" size={48} />,
                   badge: 'WING PROTOCOL'
                 },
                 { 
                   title: 'Opportunity Feed', 
                   desc: 'Real-time transmission of internships, collaborative projects, and freelance node requests.',
                   icon: <Target className="text-rose-500" size={48} />,
                   badge: 'MARKET SYNC'
                 },
                 { 
                   title: 'Registry Control', 
                   desc: 'Admins maintain total node oversight with high-level diagnostic tools and forensic logs.',
                   icon: <ShieldCheck className="text-emerald-500" size={48} />,
                   badge: 'ADMIN COMMAND'
                 }
               ].map((feat, i) => (
                 <div key={i} className="group p-12 rounded-[3.5rem] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-indigo-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
                       {feat.icon}
                    </div>
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-10">{feat.badge}</div>
                    <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-all">
                       {React.cloneElement(feat.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{feat.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonial Cluster */}
      <section className="px-12 py-32 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-10">
               <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-tight">Validated by the <br/> Community.</h3>
               <div className="space-y-12">
                  <div className="p-10 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/20 relative">
                     <div className="text-7xl font-serif absolute -top-4 -left-4 text-indigo-500/20 leading-none">“</div>
                     <p className="text-xl italic font-medium text-slate-300">MakSocial has completely redefined how we share resources in the LAW wing. The archive is invaluable for finalists.</p>
                     <div className="mt-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                        <div>
                           <p className="font-black text-[10px] uppercase tracking-widest text-white">Namakula J.</p>
                           <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Finalist • School of Law</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative translate-x-12 hidden md:block">
                     <p className="text-xl italic font-medium text-slate-400">The Admin terminal gives our student leaders unprecedented oversight of guild communications.</p>
                     <div className="mt-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl"></div>
                        <div>
                           <p className="font-black text-[10px] uppercase tracking-widest text-white">Guild Speaker</p>
                           <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">89th Guild Council</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex-1 relative">
               <div className="w-full aspect-square bg-indigo-600/10 rounded-full blur-3xl absolute inset-0"></div>
               <img 
                 src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" 
                 alt="UI Overlay" 
                 className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:scale-105 transition-transform duration-1000"
               />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-24 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2 space-y-10">
               <div className="flex items-center gap-4">
                  <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-12 h-12" />
                  <span className="text-3xl font-cursive text-indigo-500">MakSocial</span>
               </div>
               <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-medium">The official digital stratum of Makerere University. Encrypted collaboration for the leaders of tomorrow.</p>
               <div className="flex gap-6">
                  <button className="text-slate-500 hover:text-indigo-500 transition-colors"><Twitter size={24} /></button>
                  <button className="text-slate-500 hover:text-indigo-500 transition-colors"><Github size={24} /></button>
                  <button className="text-slate-500 hover:text-indigo-500 transition-colors"><Facebook size={24} /></button>
               </div>
            </div>
            <div className="space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Network Wings</h4>
               <ul className="space-y-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Computing (COCIS)</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Engineering (CEDAT)</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Medicine (CHS)</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Humanities (CHUSS)</li>
               </ul>
            </div>
            <div className="space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System Protocol</h4>
               <ul className="space-y-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Node Registry</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Academic Vault</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Terminal Access</li>
                  <li className="hover:text-indigo-400 cursor-pointer transition-colors">Security Logic</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[9px] text-slate-600 font-black tracking-[0.5em] uppercase">© 2025 MAK SOCIAL NETWORK • ENGINEERING UNIT KAMPALA</p>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span className="hover:text-slate-400 cursor-pointer">Compliance</span>
               <span className="hover:text-slate-400 cursor-pointer">Encrypion</span>
               <span className="hover:text-slate-400 cursor-pointer">Protocol</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
