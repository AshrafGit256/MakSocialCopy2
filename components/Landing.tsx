
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Globe, Zap, MessageSquare, 
  Calendar, Database, ShieldCheck, Radio,
  Clock, Users, MapPin, ChevronRight,
  Layout, Sparkles, Terminal, Activity,
  Lock, ArrowUpRight, Signal
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const MOCK_SCROLL_POSTS = [
  { author: "VC Office", text: "New Research Grant of $2M synchronized for all CEDAT nodes.", color: "text-indigo-600" },
  { author: "Ninfa A.", text: "Anyone have the past paper for Computer Security 2024?", color: "text-[var(--brand-color)]" },
  { author: "Guild President", text: "Bazaar starts tomorrow at Freedom Square! 🚀", color: "text-rose-500" },
  { author: "Library Node", text: "Vault updated: 400+ new law journals added.", color: "text-emerald-600" },
  { author: "Brian K.", text: "Grinding at COCIS Lab... coffee is the only logic left.", color: "text-amber-500" },
  { author: "Sports Wing", text: "Mak Impalas vs MUBS. Be there at 4 PM.", color: "text-indigo-400" },
];

const CHAT_LOG = [
  { sender: "Ninfa", text: "Hey Brian, did you sync the Project Alpha repository yet?" },
  { sender: "Brian", text: "Almost! Just committing the last logic block now." },
  { sender: "Ninfa", text: "Nice. The registry looks stable today. See you at Freedom Sq?" },
  { sender: "Brian", text: "Protocol confirmed. 10 mins! ✌️" },
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [chatIdx, setChatIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 0, mins: 0, secs: 0 });

  // Event Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date("2026-06-20T10:00:00");
      const diff = target.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    // Chat Animation logic
    const chatTimer = setInterval(() => {
      setChatIdx(prev => (prev + 1) % (CHAT_LOG.length + 2));
    }, 3000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(timer);
      clearInterval(chatTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. STICKY NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-[2px] flex items-center justify-center shadow-xl">
              <Signal size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">MakSocial</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {['The_Vault', 'Hill_Pulse', 'Registry'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors">{item}</a>
            ))}
            <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-[2px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all">
               Initialize_Uplink
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE HILL IMMERSION */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover grayscale opacity-10 scale-110" 
             alt="Makerere"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-in slide-in-from-left-10 duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <Activity size={14} className="text-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600">Central_Registry: Active</span>
              </div>
              <h1 className="text-[4.5rem] md:text-[7rem] font-black leading-[0.85] tracking-[-0.04em] uppercase text-slate-900">
                The Hill <br /> 
                <span className="text-[var(--brand-color)]">Synchronized.</span>
              </h1>
              <p className="max-w-lg text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-8">
                "Makerere's primary intelligence strata. Communicate, collaborate, and conquer the semester."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={onStart} className="px-12 py-6 bg-slate-900 text-white rounded-[2px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                Establish Link <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-6 bg-white border border-slate-200 text-slate-500 rounded-[2px] font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-sm">
                Explore_Public_Vault
              </button>
            </div>
          </div>

          {/* DYNAMIC ACTIVITY WINDOW */}
          <div className="hidden lg:block relative h-[600px] animate-in slide-in-from-right-10 duration-1000">
             {/* Scrolling Post Feed */}
             <div className="absolute top-0 right-0 w-80 h-[500px] overflow-hidden border border-slate-100 bg-slate-50/50 backdrop-blur-sm rounded-[2px] p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                   <Radio size={16} className="text-[var(--brand-color)] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live_Pulse_Stream</span>
                </div>
                <div className="space-y-8 animate-marquee-vertical">
                   {[...MOCK_SCROLL_POSTS, ...MOCK_SCROLL_POSTS].map((post, i) => (
                     <div key={i} className="space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                        <p className={`text-[10px] font-black uppercase tracking-tighter ${post.color}`}>{post.author}</p>
                        <p className="text-sm font-bold text-slate-700 leading-tight">"{post.text}"</p>
                        <div className="h-px w-8 bg-slate-200"></div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Animated Chat Bubble */}
             <div className="absolute bottom-10 left-0 w-[340px] bg-slate-900 text-white rounded-[2px] shadow-2xl border border-white/10 p-6 space-y-6 animate-bounce-soft">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Uplink_Handshake</span>
                   </div>
                   <Users size={14} className="text-slate-500" />
                </div>
                <div className="space-y-4 min-h-[100px]">
                   {CHAT_LOG.slice(0, chatIdx).map((msg, i) => (
                     <div key={i} className={`flex flex-col ${msg.sender === 'Brian' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <span className="text-[8px] font-black text-slate-500 uppercase mb-1">{msg.sender}</span>
                        <div className={`px-4 py-2 rounded-[2px] text-xs font-medium max-w-[80%] ${msg.sender === 'Brian' ? 'bg-[var(--brand-color)] text-white' : 'bg-white/10 text-slate-200'}`}>
                           {msg.text}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT COUNTDOWN SECTION */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
         <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-4">
               <div className="flex items-center gap-3 text-rose-600">
                  <Calendar size={28} />
                  <span className="text-[12px] font-black uppercase tracking-[0.5em]">Critical_Event</span>
               </div>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Makerere <br /> Homecoming 2026</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Freedom Square / Main Administration Strata</p>
            </div>
            
            <div className="lg:col-span-6 flex justify-between gap-4">
               {[
                 { val: timeLeft.days, label: 'Days' },
                 { val: timeLeft.hours, label: 'Hours' },
                 { val: timeLeft.mins, label: 'Mins' },
                 { val: timeLeft.secs, label: 'Secs' }
               ].map(unit => (
                 <div key={unit.label} className="flex-1 bg-white border border-slate-200 p-6 rounded-[2px] text-center shadow-sm group hover:border-[var(--brand-color)] transition-all">
                    <p className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter group-hover:text-[var(--brand-color)] transition-colors tabular-nums">{unit.val}</p>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2">{unit.label}</p>
                 </div>
               ))}
            </div>

            <div className="lg:col-span-2">
               <button onClick={onStart} className="w-full py-10 bg-slate-900 text-white rounded-[2px] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-rose-600 transition-all active:scale-95 shadow-xl">
                  Secure_Pass
               </button>
            </div>
         </div>
      </section>

      {/* 4. FEATURE GRID: DROPBOX STYLE */}
      <section className="py-40 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24">
             <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-[0.85]">Engineered for <br /> <span className="text-slate-300 italic">The Hill.</span></h2>
                <div className="h-2 w-40 bg-[var(--brand-color)]"></div>
             </div>
             <p className="max-w-sm text-slate-500 font-medium text-lg italic border-r-4 border-slate-100 pr-8 text-right">
               Everything you need to navigate Makerere University in one unified, high-speed registry.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-slate-200 border border-slate-200 rounded-[2px] overflow-hidden shadow-2xl">
             {[
               { title: 'Study Vault', desc: 'Secure repository for 42k+ past papers and research notes.', icon: <Database className="text-indigo-600"/> },
               { title: 'Secure Chats', desc: 'Encrypted peer-to-peer logic exchange across all wings.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'The Bazaar', desc: 'Synchronized peer services, laundry, and gig economy.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital Passes', desc: 'Visual handshake protocol for all campus event entry.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Live Pulse', desc: 'Real-time signal broadcast from the Guild and Admin nodes.', icon: <Radio className="text-[var(--brand-color)]"/> },
               { title: 'Study Strata', desc: 'Intelligent scheduling for assessmemt and assessors.', icon: <Clock className="text-slate-400"/> }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500 scale-150">
                     {feat.icon}
                  </div>
                  <div className="mb-8">{feat.icon}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">{feat.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                  <button onClick={onStart} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all">Learn More <ArrowUpRight size={14}/></button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER */}
      <footer className="bg-slate-900 py-40 px-6 md:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12">
           <Signal size={400} fill="currentColor" />
        </div>
        
        <div className="max-w-[1440px] mx-auto text-center relative z-10 space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">Join the <br /> <span className="text-[var(--brand-color)]">Registry.</span></h2>
            <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto italic leading-relaxed">
              "Verified student profile required. Enter your credentials to synchronize with the Hill Strata architecture."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button onClick={onStart} className="px-16 py-8 bg-white text-slate-900 rounded-[2px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Initialize_Link
            </button>
            <div className="flex items-center gap-6 text-slate-500">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">18.4k Nodes Synced</span>
            </div>
          </div>
        </div>

        <div className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 MakSocial Registry | Hill Strata Architecture v5.2</p>
           <div className="flex gap-12 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-colors">Telemetry</a>
              <a href="#" className="hover:text-white transition-colors">Audit_Log</a>
              <a href="#" className="hover:text-white transition-colors">Governance</a>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          animation: marqueeVertical 30s linear infinite;
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
