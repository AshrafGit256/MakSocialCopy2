
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Globe, Zap, MessageSquare, 
  Calendar, Database, ShieldCheck, Radio,
  Clock, Users, MapPin, ChevronRight,
  Layout, Sparkles, Terminal, Activity,
  Lock, ArrowUpRight, Signal, Box, Layers,
  Cpu, Bot, Radar
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const MOCK_SCROLL_POSTS = [
  { 
    author: "VC Office", 
    text: "New Research Grant of $2M synchronized for all CEDAT nodes.", 
    color: "text-indigo-600",
    img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400"
  },
  { 
    author: "Ninfa A.", 
    text: "Anyone have the past paper for Computer Security 2024?", 
    color: "text-[var(--brand-color)]",
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400"
  },
  { 
    author: "Guild President", 
    text: "Bazaar starts tomorrow at Freedom Square! 🚀", 
    color: "text-rose-500",
    img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400"
  },
  { 
    author: "Library Node", 
    text: "Vault updated: 400+ new law journals added.", 
    color: "text-emerald-600",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400"
  },
  { 
    author: "Brian K.", 
    text: "Grinding at COCIS Lab... coffee is the only logic left.", 
    color: "text-amber-500",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400"
  },
  { 
    author: "Sports Wing", 
    text: "Mak Impalas vs MUBS. Be there at 4 PM.", 
    color: "text-indigo-400",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400"
  },
];

const CHAT_LOG = [
  { sender: "Ninfa", text: "Hey Brian, did you sync the Project Alpha repository yet?" },
  { sender: "Brian", text: "Almost! Just committing the last logic block now." },
  { sender: "Ninfa", text: "Nice. The registry looks stable today. See you at Freedom Sq?" },
  { sender: "Brian", text: "Protocol confirmed. 10 mins! ✌️" },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'CHUSS', name: 'Humanities & Soc Sci', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' }
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [chatIdx, setChatIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 0, mins: 0, secs: 0 });

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
      
      {/* 1. STICKY NAV (DROPOX STYLE) */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-slate-900 rounded-[2px] flex items-center justify-center shadow-2xl group-hover:rotate-90 transition-transform duration-500">
                <Box size={22} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] mt-1">Intelligence Registry</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              {['Repositories', 'The_Hill', 'Sector_Hubs'].map(item => (
                <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-color)] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 hidden sm:block">Diagnostic Login</button>
             <button onClick={onStart} className="bg-slate-900 text-white px-10 py-4 rounded-[2px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95 flex items-center gap-3">
                Establish Link <ChevronRight size={14}/>
             </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE HILL IMMERSION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#fcfcfc]">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover grayscale opacity-10 scale-105" 
             alt="Makerere"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
           {/* Geometric Pattern Overlay */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--brand-color) 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <Activity size={14} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Central_Registry: Active // v5.2</span>
              </div>
              <h1 className="text-[4rem] md:text-[6rem] xl:text-[8rem] font-black leading-[0.85] tracking-[-0.05em] uppercase text-slate-900">
                The Hill <br /> 
                <span className="text-[var(--brand-color)]">Synchronized.</span>
              </h1>
              <p className="max-w-xl text-xl md:text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-200 pl-8">
                "Makerere's unified intelligence strata. Synchronize your logic, broadcast your signals, and conquer the semester."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button onClick={onStart} className="px-14 py-7 bg-slate-900 text-white rounded-[2px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                Establish Uplink <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-14 py-7 bg-white border border-slate-200 text-slate-500 rounded-[2px] font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-sm group">
                Explore_Vault <Database size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* 3. DYNAMIC PULSE STREAM (RIGHT SIDE OF HERO) */}
          <div className="hidden lg:block relative h-[700px] animate-in slide-in-from-right-10 duration-1000">
             {/* Auto-scrolling Pulse Feed */}
             <div className="absolute top-0 right-0 w-[380px] h-[550px] overflow-hidden border border-slate-100 bg-white/60 backdrop-blur-xl rounded-[2px] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3">
                      <Radio size={20} className="text-[var(--brand-color)] animate-pulse" />
                      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-800">Live_Pulse_Stream</span>
                   </div>
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">REAL-TIME</div>
                </div>
                <div className="space-y-10 animate-marquee-vertical">
                   {[...MOCK_SCROLL_POSTS, ...MOCK_SCROLL_POSTS].map((post, i) => (
                     <div key={i} className="space-y-4 group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} className="w-full h-full object-cover" />
                           </div>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${post.color}`}>{post.author}</p>
                        </div>
                        <div className="space-y-3 pl-11">
                           <p className="text-sm font-bold text-slate-700 leading-tight italic">"{post.text}"</p>
                           {post.img && (
                             <div className="rounded-[4px] overflow-hidden border border-slate-100 shadow-sm transition-all group-hover:shadow-md">
                                <img src={post.img} className="w-full h-24 object-cover" />
                             </div>
                           )}
                        </div>
                        <div className="h-px w-full bg-slate-50"></div>
                     </div>
                   ))}
                </div>
             </div>

             {/* 4. ANIMATED HANDSHAKE (CHAT MOCK) */}
             <div className="absolute bottom-4 left-0 w-[360px] bg-slate-900 text-white rounded-[2px] shadow-2xl border border-white/10 p-8 space-y-8 animate-bounce-soft z-20">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Node_Handshake</span>
                   </div>
                   <Users size={16} className="text-slate-500" />
                </div>
                <div className="space-y-6 min-h-[140px] flex flex-col">
                   {CHAT_LOG.slice(0, chatIdx).map((msg, i) => (
                     <div key={i} className={`flex flex-col ${msg.sender === 'Brian' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                        <div className="flex items-center gap-2 mb-1.5">
                           {msg.sender === 'Ninfa' && <div className="w-4 h-4 rounded-full bg-indigo-500"></div>}
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{msg.sender}</span>
                           {msg.sender === 'Brian' && <div className="w-4 h-4 rounded-full bg-[var(--brand-color)]"></div>}
                        </div>
                        <div className={`px-5 py-3 rounded-[2px] text-xs font-medium max-w-[85%] leading-relaxed shadow-lg ${msg.sender === 'Brian' ? 'bg-[var(--brand-color)] text-white' : 'bg-white/10 text-slate-200'}`}>
                           {msg.text}
                        </div>
                     </div>
                   ))}
                   {chatIdx < CHAT_LOG.length && (
                     <div className="flex gap-1.5 pt-2">
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-bounce delay-200"></div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. SECTOR STRATA: THE COLLEGE MATRIX */}
      <section className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24">
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-400">
                  <Layers size={32} />
                  <span className="text-[12px] font-black uppercase tracking-[0.6em]">Sector_Strata</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase leading-[0.8]">The <span className="text-slate-300">Wings.</span></h2>
             </div>
             <p className="max-w-md text-slate-500 font-medium leading-relaxed border-r-4 border-slate-100 pr-8 text-right hidden lg:block uppercase text-[10px] tracking-widest">
               Each college hub operates as a specialized intelligence node within the unified registry strata. Find your wing and synchronize.
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {COLLEGES.map((college) => (
               <div key={college.id} className="group relative h-[600px] overflow-hidden bg-slate-900 rounded-[2px] transition-all duration-1000 hover:shadow-2xl">
                  <img 
                    src={college.img} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60 group-hover:grayscale-0"
                    alt={college.id}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-end z-10 transition-transform duration-700 group-hover:-translate-y-4">
                     <div className="space-y-6">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                           <Layout size={28} className="text-white" />
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{college.id} HUB</h3>
                        <p className="text-[11px] font-black text-[var(--brand-color)] uppercase tracking-[0.3em]">{college.name}</p>
                        <div className="pt-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                           <button onClick={onStart} className="w-full py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all">
                              Initialize Sector Sync <ChevronRight size={14}/>
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-8 right-8 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-60">HUB_ONLINE</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. TEMPORAL EVENT HUB (COUNTDOWN) */}
      <section className="py-32 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-[0.03] scale-150 rotate-12">
            <Calendar size={400} fill="currentColor" />
         </div>
         
         <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-rose-600">
                    <Radar size={32} className="animate-pulse" />
                    <span className="text-[12px] font-black uppercase tracking-[0.6em]">System_Alert: Major_Event</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-[0.85]">Homecoming <br /> <span className="text-slate-300">2026.</span></h2>
                  <p className="text-xl text-slate-500 font-medium italic border-l-4 border-rose-200 pl-8 py-2">
                    "Freedom Square / Central Strata. The ultimate node synchronization for a century of Makerere excellence."
                  </p>
               </div>
               <button onClick={onStart} className="px-12 py-6 bg-rose-600 text-white rounded-[2px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-4 active:scale-95">
                  Secure_Pass_Registry <ArrowUpRight size={18}/>
               </button>
            </div>
            
            <div className="lg:col-span-7">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { val: timeLeft.days, label: 'Nodes_Days' },
                    { val: timeLeft.hours, label: 'Clock_Hours' },
                    { val: timeLeft.mins, label: 'Logic_Mins' },
                    { val: timeLeft.secs, label: 'Sync_Secs' }
                  ].map(unit => (
                    <div key={unit.label} className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2px] text-center shadow-xl group hover:border-[var(--brand-color)] transition-all">
                       <p className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter group-hover:text-[var(--brand-color)] transition-colors tabular-nums leading-none">
                         {unit.val.toString().padStart(2, '0')}
                       </p>
                       <div className="h-1 w-8 bg-slate-100 mx-auto my-4 group-hover:w-16 transition-all duration-500 group-hover:bg-[var(--brand-color)]"></div>
                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">{unit.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 7. SYSTEM CAPABILITIES (BENTO GRID) */}
      <section className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-[1440px] mx-auto space-y-24">
          <div className="text-center space-y-6">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">High Speed <br /> <span className="text-[var(--brand-color)] italic">Campus Logic.</span></h2>
             <p className="max-w-2xl mx-auto text-slate-500 text-xl font-medium italic">"Engineered for the Makerere ecosystem. Unified, Secure, Distributed."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-slate-200 border border-slate-200 rounded-[2px] overflow-hidden shadow-2xl">
             {[
               { title: 'The Vault', desc: 'Secure repository for 42k+ past papers, research strata, and academic manifests.', icon: <Database className="text-indigo-600"/> },
               { title: 'Secure Chats', desc: 'Encrypted peer-to-peer logic exchange across all faculty hubs and wings.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'The Bazaar', desc: 'Synchronized campus economy. Trade services, assets, and gig logic.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital Passes', desc: 'Advanced visual handshake protocol for all official campus entry nodes.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Live Pulse', desc: 'Real-time university signal broadcast from the Guild and Central Admin.', icon: <Radio className="text-[var(--brand-color)]"/> },
               { title: 'Study Strata', desc: 'AI-assisted scheduling for assessments and collaborative revision nodes.', icon: <Bot className="text-slate-500"/> }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-16 hover:bg-slate-50 transition-all group relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-5 transition-all translate-x-8 group-hover:translate-x-0 duration-700 scale-[3]">
                     {feat.icon}
                  </div>
                  <div className="space-y-8 relative z-10">
                     <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {feat.icon}
                     </div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{feat.title}</h3>
                     <p className="text-slate-500 font-medium text-base leading-relaxed">"{feat.desc}"</p>
                  </div>
                  <button onClick={onStart} className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    Query Node <ChevronRight size={14}/>
                  </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION FOOTER */}
      <footer className="bg-slate-900 py-40 px-6 md:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12">
           <Signal size={500} fill="currentColor" />
        </div>
        
        <div className="max-w-[1440px] mx-auto text-center relative z-10 space-y-20">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4 mb-10">
               <div className="w-20 h-20 bg-white rounded-[2px] flex items-center justify-center shadow-2xl rotate-45 group-hover:rotate-90 transition-all duration-1000">
                  <Box size={40} className="text-slate-900 -rotate-45" />
               </div>
            </div>
            <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">Join the <br /> <span className="text-[var(--brand-color)]">Registry.</span></h2>
            <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto italic leading-relaxed">
              "Verified student profile required. Enter your credentials to synchronize with the Hill Strata architecture v5.2"
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-[2px] font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Initialize_Link
            </button>
            <div className="flex items-center gap-8 text-slate-500">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-xl font-black text-white tracking-tighter">18.4K</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nodes Synced Online</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-60 pt-20 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-3">
                 <Box size={24} className="text-[var(--brand-color)]" />
                 <span className="text-2xl font-black tracking-tighter uppercase">MakSocial</span>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Hill Strata Architecture v5.2.0-Alpha</p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-all flex items-center gap-2"><Activity size={12}/> Telemetry</a>
              <a href="#" className="hover:text-white transition-all flex items-center gap-2"><ShieldCheck size={12}/> Audit_Log</a>
              <a href="#" className="hover:text-white transition-all flex items-center gap-2"><Lock size={12}/> Governance</a>
              <a href="#" className="hover:text-white transition-all flex items-center gap-2"><Terminal size={12}/> Node_API</a>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          animation: marqueeVertical 40s linear infinite;
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 6s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default Landing;
