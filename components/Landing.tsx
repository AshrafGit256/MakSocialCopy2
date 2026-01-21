
import React from "react";
import { ArrowRight, Zap, Globe, Users, ShieldCheck, Sparkles, GraduationCap, Radio, Search, MessageSquare, BookOpen } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* NAVIGATION BAR - BLURRED FLOATING */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl">
        <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-2xl shadow-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase text-indigo-600">MakSocial</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Protocol</a>
            <a href="#network" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Nodes</a>
            <a href="#vault" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Vault</a>
          </div>

          <button
            onClick={onStart}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* HERO SECTION - IMMERSIVE DYNAMIC */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">v4.2 Stable | The Hill Connect</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Empowering <br />
              <span className="text-indigo-600">The Hill's</span> <br />
              Digital DNA.
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
              The premier social protocol for Makerere University. Synchronize with your college wing, access the academic vault, and broadcast opportunities across the network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStart}
                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95"
              >
                Initialize Profile <ArrowRight size={18} />
              </button>
              <button className="px-10 py-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95">
                Scan Protocol
              </button>
            </div>

            <div className="flex items-center gap-6 pt-10 border-t border-[var(--border-color)]">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] object-cover shadow-lg" />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="text-indigo-600">12.4k+</span> Nodes Active on the Hill
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Main Visual Component - Styled like a Terminal or High-end Dash */}
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] group">
               <img 
                 src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt="Makerere Campus Life" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent"></div>
               
               {/* Floating Data Widgets */}
               <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Live</span>
                  </div>
                  <p className="text-2xl font-black text-white mt-2 uppercase tracking-tighter">98.2% Engagement</p>
               </div>

               <div className="absolute bottom-10 left-10 right-10 bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                    <Radio className="text-rose-500" size={20} />
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Latest Broadcast</span>
                  </div>
                  <p className="text-white font-bold leading-relaxed italic text-sm">
                    "The 89th Guild Inauguration has been synchronized to the global pulse. Join your wing for updates."
                  </p>
               </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-600/20 blur-[60px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* METRIC STRIP */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: 'Active Nodes', val: '50,000+', icon: <Users size={24}/> },
            { label: 'Academic Units', val: '9 Wings', icon: <GraduationCap size={24}/> },
            { label: 'Asset Transfers', val: '1M+ Scans', icon: <Globe size={24}/> },
            { label: 'Uptime Protocol', val: '99.99%', icon: <ShieldCheck size={24}/> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2 text-white group">
               <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
               </div>
               <h3 className="text-4xl font-black tracking-tighter uppercase">{item.val}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE BENTO GRID */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">The Protocol Core</h2>
            <h3 className="text-5xl font-black tracking-tighter uppercase italic">Redefining Campus Intelligence.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Large Feature 1 */}
            <div className="md:col-span-2 relative h-[500px] rounded-[3rem] overflow-hidden border border-[var(--border-color)] group shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1523050338692-7b835a07973f?auto=format&fit=crop&w=1200" 
                 className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
               <div className="absolute bottom-12 left-12 space-y-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                    <Search size={24} />
                  </div>
                  <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Signal Discovery</h4>
                  <p className="text-slate-300 max-w-sm font-medium">Scan the global pulse for opportunities, research grants, and high-density academic signals shared in real-time.</p>
               </div>
            </div>

            {/* Small Feature 1 */}
            <div className="bg-indigo-600 rounded-[3rem] p-12 flex flex-col justify-between shadow-2xl shadow-indigo-600/20 text-white">
               <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center">
                  <MessageSquare size={32} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Node Communication</h4>
                  <p className="text-white/80 font-medium text-sm">Encrypted direct messaging and college wing channels for seamless collaboration.</p>
                  <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-6 py-2 rounded-full border border-white/20">Initialize Chat</button>
               </div>
            </div>

            {/* Small Feature 2 */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] p-12 flex flex-col justify-between shadow-lg">
               <div className="w-16 h-16 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center text-indigo-600">
                  <BookOpen size={32} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-[var(--text-primary)]">The Vault</h4>
                  <p className="text-slate-500 font-medium text-sm">Access the secure repository of past papers, research assets, and course-specific intelligence.</p>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-[8px] font-bold">+1k</div>
                  </div>
               </div>
            </div>

            {/* Large Feature 2 */}
            <div className="md:col-span-2 relative h-[500px] rounded-[3rem] overflow-hidden border border-[var(--border-color)] group shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200" 
                 className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
               <div className="absolute bottom-12 left-12 space-y-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                    <Radio size={24} />
                  </div>
                  <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Wing Specific Updates</h4>
                  <p className="text-slate-200 max-w-sm font-medium">Localized intelligence nodes for COCIS, CEDAT, LAW, and more. Your college's pulse, isolated and amplified.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-10">
           <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
             Join The <br />
             Hill Protocol.
           </h2>
           <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
             Secure your digital identity in the university's only verified network. Join 50k+ students redefining campus life.
           </p>
           <button
             onClick={onStart}
             className="bg-white text-indigo-600 px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
           >
             Initialize Registration
           </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-indigo-600 fill-indigo-600" />
            <span className="text-xl font-black italic tracking-tighter uppercase text-indigo-600">MakSocial</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Twitter (X)</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Instagram</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">University Hub</a>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            © 2026 MakSocial Registry. Makerere University Main Campus.
          </p>
        </div>
      </footer>

      {/* CSS For slow bounce */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
