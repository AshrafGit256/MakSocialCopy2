
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
  { id: 'COCIS', name: 'Computing', img: 'data:image/jpeg;base64,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' },
  { id: 'CEDAT', name: 'Engineering', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT09ggtwrXbd0su5JR24fTIiNz20g2tDtK71A&s' },
  { id: 'CHUSS', name: 'Humanities', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-QoIkQ0nQ2N73Nul0gfVlp1dqVQGGpB6W3A&s' },
  { id: 'CONAS', name: 'Sciences', img: 'https://events.mak.ac.ug/sites/default/files/styles/large_crop/public/2023-06/1280px-Department_of_Chemistry%2C_Makerere_University.jpg?itok=Cu9dsUj6' },
  { id: 'LAW', name: 'Law School', img: 'https://i0.wp.com/campusbee.ug/wp-content/uploads/2024/03/IMG_20240319_175245.jpg?fit=1024%2C402&ssl=1' },
  { id: 'CHS', name: 'Medicine', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPL1UXf83MfnfVhZZDCSsLV7fNRedzZsgrng&s' },
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
                      src="https://i.ytimg.com/vi/JxpnV5937-U/maxresdefault.jpg" 
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
