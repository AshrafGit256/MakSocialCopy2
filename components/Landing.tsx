
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  Calendar, BookOpen, ShieldCheck, 
  ChevronRight, Heart, Star, 
  Globe, Camera, MapPin, 
  Clock, Zap, Layout, 
  Search, Bell, Laptop,
  /* Fix: Added missing ArrowUpRight import */
  ArrowUpRight
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const LIVE_POSTS = [
  { author: "Opio Eric", text: "Just shared the CS study guide in the Vault! 📚", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400" },
  { author: "Sarah M.", text: "Found a lost calculator at the Main Library. Check Lost & Found!", img: "https://images.unsplash.com/photo-1580894732230-28299ae40342?auto=format&fit=crop&w=400" },
  { author: "Sports Wing", text: "Mak Impalas win again! Freedom Square was lit! 🔥", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400" },
  { author: "Namusoke J.", text: "Anyone selling a laptop charger? DM me!", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400" },
  { author: "Guild Office", text: "Bazaar starts on Monday! Get your stalls ready.", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400" },
];

const CHAT_LOG = [
  { sender: "Ninfa", text: "Hey Brian! Are you coming to Freedom Square for the rally?" },
  { sender: "Brian", text: "Yeah, just finishing my project at the COCIS lab. 💻" },
  { sender: "Ninfa", text: "Cool! I'll save you a spot. Don't forget the past papers!" },
  { sender: "Brian", text: "Got them! See you in 10 mins. ✌️" },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
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
      
      {/* 1. CLEAN NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-4 bg-white shadow-md border-b border-slate-100' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center shadow-xl group-hover:bg-[var(--brand-color)] transition-colors">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)]">Student Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hidden md:block">Login</button>
            <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3.5 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95">
               Join The Hill
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: CLEAR CAMPUS VIEW */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-60 grayscale-[20%]" 
             alt="Makerere Main Hall"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-in slide-in-from-left-10 duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Campus Pulse Online</span>
              </div>
              <h1 className="text-[4.5rem] md:text-[7rem] font-black leading-[0.85] tracking-[-0.04em] uppercase text-slate-900">
                Life at <br /> 
                <span className="text-[var(--brand-color)] italic">The Hill.</span>
              </h1>
              <p className="max-w-lg text-lg md:text-2xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-[var(--brand-color)] pl-8">
                The home for all Makerere students. Share notes, find opportunities, and connect with your classmates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={onStart} className="px-12 py-6 bg-slate-900 text-white rounded-sm font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                Get Started <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-6 bg-white border border-slate-200 text-slate-500 rounded-sm font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-sm group">
                Browse News <Zap size={18} className="group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>

          {/* LIVE ACTIVITY PANEL */}
          <div className="hidden lg:block relative h-[650px] animate-in slide-in-from-right-10 duration-1000">
             {/* Scrolling Post Feed with Images */}
             <div className="absolute top-0 right-0 w-96 h-[500px] overflow-hidden border border-slate-100 bg-white/80 backdrop-blur-xl rounded-sm p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3">
                      <Camera size={18} className="text-[var(--brand-color)]" />
                      <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-800">Live Campus Stream</span>
                   </div>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Just now</span>
                </div>
                <div className="space-y-12 animate-marquee-vertical">
                   {[...LIVE_POSTS, ...LIVE_POSTS].map((post, i) => (
                     <div key={i} className="space-y-4 group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} className="w-full h-full" />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)]">{post.author}</p>
                        </div>
                        <div className="space-y-3 pl-11">
                           <p className="text-sm font-bold text-slate-700 leading-tight italic">"{post.text}"</p>
                           <div className="rounded-lg overflow-hidden border border-slate-100 shadow-sm transition-all group-hover:scale-[1.02]">
                              <img src={post.img} className="w-full h-32 object-cover" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Simple Student Chat Bubble */}
             <div className="absolute bottom-4 left-0 w-[360px] bg-slate-900 text-white rounded-sm shadow-2xl p-8 space-y-8 animate-bounce-soft z-20">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Student Chat</span>
                   </div>
                   <Users size={16} className="text-slate-500" />
                </div>
                <div className="space-y-6 min-h-[160px] flex flex-col justify-end">
                   {CHAT_LOG.slice(0, chatIdx).map((msg, i) => (
                     <div key={i} className={`flex flex-col ${msg.sender === 'Brian' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{msg.sender}</span>
                        <div className={`px-5 py-3 rounded-sm text-xs font-medium max-w-[85%] leading-relaxed ${msg.sender === 'Brian' ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'bg-white/10 text-slate-200'}`}>
                           {msg.text}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. HORIZONTAL COLLEGES SCROLL */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
           <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900">Explore <span className="text-slate-300 italic">The Wings.</span></h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Every college is represented here</p>
           </div>
           <div className="hidden md:flex gap-3">
              <div className="h-0.5 w-20 bg-[var(--brand-color)] mb-2"></div>
           </div>
        </div>

        <div className="relative group">
           <div className="flex gap-8 px-6 animate-marquee-horizontal hover:pause transition-all">
              {[...COLLEGES, ...COLLEGES].map((college, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-[450px] relative rounded-sm overflow-hidden group/card shadow-xl transition-all hover:scale-[1.02]">
                   <img src={college.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                   <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                         <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.name}</p>
                         <button onClick={onStart} className="mt-6 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all translate-y-4 group-hover/card:translate-y-0">
                            Enter Hub <ChevronRight size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. EVENT COUNTDOWN */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-[0.03] scale-[3] pointer-events-none rotate-12">
            <Calendar size={400} fill="currentColor" />
         </div>
         
         <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-rose-500">
                    <Star size={32} className="animate-pulse" />
                    <span className="text-[12px] font-black uppercase tracking-[0.6em]">Big Event Ahead</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">Homecoming <br /> <span className="text-slate-600 italic">2026.</span></h2>
                  <p className="text-xl text-slate-400 font-medium italic border-l-4 border-rose-500 pl-8 py-2">
                    Reconnect with the hill at Freedom Square. The biggest student gathering of the year.
                  </p>
               </div>
               <button onClick={onStart} className="px-12 py-6 bg-rose-600 text-white rounded-sm font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-rose-700 transition-all flex items-center gap-4 active:scale-95">
                  Get Your Ticket <ArrowUpRight size={18}/>
               </button>
            </div>
            
            <div className="lg:col-span-7">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { val: timeLeft.days, label: 'Days' },
                    { val: timeLeft.hours, label: 'Hours' },
                    { val: timeLeft.mins, label: 'Minutes' },
                    { val: timeLeft.secs, label: 'Seconds' }
                  ].map(unit => (
                    <div key={unit.label} className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-sm text-center shadow-2xl backdrop-blur-md group hover:border-[var(--brand-color)] transition-all">
                       <p className="text-5xl md:text-8xl font-black text-white tracking-tighter group-hover:text-[var(--brand-color)] transition-colors tabular-nums leading-none">
                         {unit.val.toString().padStart(2, '0')}
                       </p>
                       <div className="h-1 w-8 bg-white/20 mx-auto my-4 group-hover:w-16 transition-all duration-500 group-hover:bg-[var(--brand-color)]"></div>
                       <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">{unit.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. DROPBOX-LIKE FEATURES LIST */}
      <section className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Everything you <br /> <span className="text-[var(--brand-color)] italic">need to succeed.</span></h2>
             <p className="max-w-2xl mx-auto text-slate-500 text-xl font-medium italic">"Makerere Social is your pocket companion for the entire semester."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-sm overflow-hidden shadow-2xl">
             {[
               { title: 'The Vault', desc: 'Find past papers, books, and lecture notes from your seniors.', icon: <BookOpen className="text-indigo-600"/> },
               { title: 'Chat Hub', desc: 'Securely message any student or lecturer on campus.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'Campus Bazaar', desc: 'Buy and sell anything from laptops to laundry services.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital Passes', desc: 'Your ticket to every campus gala and student event.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'College Hubs', desc: 'Stay updated with specific news from your college wing.', icon: <Layout className="text-slate-400"/> },
               { title: 'Find My Gear', desc: 'A dedicated place for lost and found items on campus.', icon: <Laptop className="text-[var(--brand-color)]"/> }
             ].map((feat, i) => (
               <div key={i} className="bg-white p-16 hover:bg-slate-50 transition-all group relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-8 relative z-10">
                     <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        {feat.icon}
                     </div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{feat.title}</h3>
                     <p className="text-slate-500 font-medium text-base leading-relaxed">{feat.desc}</p>
                  </div>
                  <button onClick={onStart} className="mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    Open Feature <ChevronRight size={14}/>
                  </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <footer className="bg-slate-900 py-40 px-6 md:px-12 text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12">
           <Users size={500} fill="currentColor" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-20">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4 mb-10">
               <div className="w-20 h-20 bg-white rounded-sm flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <span className="text-slate-900 font-black text-4xl">M</span>
               </div>
            </div>
            <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">Start <br /> <span className="text-[var(--brand-color)]">Connecting.</span></h2>
            <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto italic leading-relaxed">
              "Join 18,000+ students already using the hill's social platform."
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-sm font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Create My Profile
            </button>
            <div className="flex items-center gap-8 text-slate-500">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-xl font-black text-white tracking-tighter">18,421</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Students Online</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-60 pt-20 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-3">
                 <span className="text-2xl font-black tracking-tighter uppercase text-[var(--brand-color)]">MakSocial</span>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Built for Makerere by Mak Dev Group</p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-all flex items-center gap-2">Community Rules</a>
              <a href="#" className="hover:text-white transition-all flex items-center gap-2">Security</a>
              <a href="#" className="hover:text-white transition-all flex items-center gap-2">Help Center</a>
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
        @keyframes marqueeHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-horizontal {
          animation: marqueeHorizontal 30s linear infinite;
          display: flex;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
