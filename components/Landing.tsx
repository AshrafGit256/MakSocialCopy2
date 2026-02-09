
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  Calendar, BookOpen, Heart, Star, 
  Camera, MapPin, Zap, Layout, 
  Laptop, ArrowUpRight, Send, CheckCircle,
  ChevronRight, Globe, Bell, ShieldCheck
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const LIVE_POSTS = [
  { author: "Opio Eric", text: "Shared the CS study guide! 📚", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400" },
  { author: "Sarah M.", text: "Lost calculator at Library. Floor 2!", img: "https://images.unsplash.com/photo-1580894732230-28299ae40342?auto=format&fit=crop&w=400" },
  { author: "Sports Wing", text: "Freedom Square was lit! 🔥", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400" },
  { author: "Namusoke J.", text: "Anyone selling a charger?", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400" },
  { author: "Guild Office", text: "Bazaar starts Monday!", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400" },
];

const CHAT_LOG = [
  { sender: "Ninfa", text: "Hey! Coming to Freedom Square?" },
  { sender: "Brian", text: "Yeah, almost done at the lab. 💻" },
  { sender: "Ninfa", text: "Great! See you in 10 mins." },
  { sender: "Brian", text: "Confirming... see ya! ✌️" },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'CHUSS', name: 'Humanities', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'Law School', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: 'CHS', name: 'Medicine', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
];

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {children}
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [chatIdx, setChatIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date("2026-06-20T10:00:00").getTime() - new Date().getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    const chatTimer = setInterval(() => setChatIdx(prev => (prev + 1) % (CHAT_LOG.length + 2)), 3000);
    const scroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", scroll);
    return () => { clearInterval(timer); clearInterval(chatTimer); window.removeEventListener("scroll", scroll); };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. STICKY NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)]">Makerere Community</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={onStart} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Login</button>
            <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95">
               Join The Hill
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: IVORY TOWER FOCUS */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110" 
             alt="Makerere Main Hall"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-12">
            <Reveal>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur shadow-sm rounded-full border border-slate-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">18k students online</span>
                </div>
                <h1 className="text-[4rem] md:text-[7rem] font-black leading-[0.85] tracking-[-0.05em] uppercase text-slate-900">
                  Your <br /> 
                  <span className="text-[var(--brand-color)]">Campus.</span>
                </h1>
                <p className="max-w-md text-lg md:text-xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-[var(--brand-color)] pl-8">
                  The primary home for every student at Makerere. Share notes, find friends, and keep up with campus life.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStart} className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 active:scale-95">
                  Get Started <ArrowRight size={18} />
                </button>
                <button className="px-12 py-5 bg-white border border-slate-200 text-slate-500 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4">
                  Browse News
                </button>
              </div>
            </Reveal>
          </div>

          {/* RIGHT SIDE: LIVE FEED */}
          <div className="hidden lg:block relative h-[500px]">
             <Reveal delay={400}>
               <div className="absolute top-0 right-0 w-[340px] h-[450px] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                     <Camera size={18} className="text-[var(--brand-color)]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Campus Pulse</span>
                  </div>
                  <div className="space-y-12 animate-marquee-vertical">
                     {[...LIVE_POSTS, ...LIVE_POSTS].map((post, i) => (
                       <div key={i} className="space-y-4 group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} className="w-full h-full" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)]">{post.author}</p>
                          </div>
                          <div className="space-y-3 pl-11">
                             <p className="text-xs font-bold text-slate-700 leading-tight">"{post.text}"</p>
                             <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform group-hover:scale-[1.03]">
                                <img src={post.img} className="w-full h-24 object-cover" />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             </Reveal>
          </div>
        </div>

        {/* FLOATING CHAT: NON-OBSTRUCTIVE & WHITE */}
        <div className="hidden lg:block fixed bottom-10 right-10 w-[320px] bg-white border border-slate-200 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] p-6 z-[600] animate-bounce-soft">
           <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Chat</span>
              </div>
              <Users size={16} className="text-slate-300" />
           </div>
           <div className="space-y-4 min-h-[140px] flex flex-col justify-end">
              {CHAT_LOG.slice(0, chatIdx).map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'Brian' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1`}>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">{msg.sender}</span>
                   <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium max-w-[90%] shadow-sm ${msg.sender === 'Brian' ? 'bg-slate-100 text-slate-800 rounded-tr-none' : 'bg-[var(--brand-color)] text-white rounded-tl-none'}`}>
                      {msg.text}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. COLLEGES CAROUSEL - WIDE & CLEAN */}
      <section className="py-24 bg-slate-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
           <Reveal>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Explore <span className="text-[var(--brand-color)]">The Hubs.</span></h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Every college hub is active and sharing signals</p>
           </Reveal>
        </div>

        <div className="relative">
           <div className="flex gap-6 px-6 animate-marquee-horizontal hover:pause transition-all">
              {[...COLLEGES, ...COLLEGES].map((college, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-60 relative rounded-[2rem] overflow-hidden group/card shadow-lg border border-white/50 bg-white transition-all hover:scale-105">
                   <img src={college.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-80" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                         <p className="text-[9px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.name}</p>
                         <button onClick={onStart} className="mt-4 flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0">
                            Enter Hub <ChevronRight size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. EVENT SECTION - POST STYLE */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
           <Reveal>
              <article className="bg-white border border-slate-100 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
                 <div className="p-8 md:p-10 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                          <Star size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Campus Highlight</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Homecoming Committee</p>
                       </div>
                    </div>
                    <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-[9px] font-black uppercase tracking-widest animate-pulse">
                       Confirmed Event
                    </div>
                 </div>

                 <div className="aspect-[21/9] relative overflow-hidden group">
                    <img 
                      src="https://campusbee.ug/wp-content/uploads/2022/10/MAK-Gala.jpg" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt="Gala"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                 </div>

                 <div className="p-10 md:p-16 space-y-12">
                    <div className="space-y-6">
                       <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900 italic">Homecoming <span className="text-slate-300">Gala 2026.</span></h2>
                       <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                         The biggest gathering of the year at Freedom Square. Reunite with alumni and celebrate Makerere's rich legacy.
                       </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                         { val: timeLeft.days, label: 'Days' },
                         { val: timeLeft.hours, label: 'Hours' },
                         { val: timeLeft.mins, label: 'Mins' },
                         { val: timeLeft.secs, label: 'Secs' }
                       ].map(unit => (
                         <div key={unit.label} className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100 group hover:border-[var(--brand-color)] transition-all">
                            <p className="text-5xl font-black text-slate-900 tabular-nums group-hover:text-[var(--brand-color)] transition-colors">{unit.val}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2">{unit.label}</p>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                       <button onClick={onStart} className="flex-1 py-6 bg-rose-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center gap-4 active:scale-95">
                          Register Attendance <ArrowUpRight size={18}/>
                       </button>
                       <button className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                          View Itinerary
                       </button>
                    </div>
                 </div>
              </article>
           </Reveal>
        </div>
      </section>

      {/* 5. TOOLS LIST */}
      <section className="py-40 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-32">
          <Reveal>
             <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Tools for <br /> <span className="text-[var(--brand-color)]">your success.</span></h2>
                <p className="max-w-2xl mx-auto text-slate-500 text-xl font-medium italic">"Makerere Social is your companion from Year 1 to Graduation."</p>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: 'The Library', desc: 'Download shared lecture notes, books, and past papers.', icon: <BookOpen className="text-indigo-600"/> },
               { title: 'Chat Hub', desc: 'Securely message any student or lecturer on campus.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'The Bazaar', desc: 'Buy or sell gear, electronics, and laundry services.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital IDs', desc: 'Your verified student profile for the whole university.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Study Hubs', desc: 'Stay updated with specific news from your college.', icon: <Layout className="text-slate-400"/> },
               { title: 'Lost & Found', desc: 'Find missing items or report things you found.', icon: <Laptop className="text-[var(--brand-color)]"/> }
             ].map((feat, i) => (
               <Reveal key={i} delay={i * 100}>
                  <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 hover:border-[var(--brand-color)] transition-all group relative overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-2xl">
                     <div className="space-y-8 relative z-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                           {feat.icon}
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">{feat.title}</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{feat.desc}</p>
                     </div>
                     <button onClick={onStart} className="mt-12 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                       Explore <ChevronRight size={14}/>
                     </button>
                  </div>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <footer className="bg-slate-900 py-40 px-6 md:px-12 text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 pointer-events-none">
           <Users size={600} fill="currentColor" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-24">
          <Reveal>
             <div className="space-y-10">
               <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl rotate-12 transition-transform duration-700 hover:rotate-0">
                     <span className="text-slate-900 font-black text-5xl">M</span>
                  </div>
               </div>
               <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">Let's <span className="text-[var(--brand-color)]">Connect.</span></h2>
               <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto italic leading-relaxed opacity-80">
                 "Join the largest community of Makerere students today."
               </p>
             </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Create My Profile
            </button>
            <div className="flex items-center gap-8 text-slate-500">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-2xl font-black text-white tracking-tighter">18,421</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Students</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-60 pt-20 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <span className="text-2xl font-black tracking-tighter uppercase text-[var(--brand-color)]">MakSocial</span>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Built for Makerere by Mak Dev Group</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-all">Rules</a>
              <a href="#" className="hover:text-white transition-all">Privacy</a>
              <a href="#" className="hover:text-white transition-all">Support</a>
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
          animation: marqueeHorizontal 35s linear infinite;
          display: flex;
        }
        .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
