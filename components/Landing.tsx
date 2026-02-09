
import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, Users, MessageSquare, 
  Calendar, BookOpen, ShieldCheck, 
  ChevronRight, Heart, Star, 
  Globe, Camera, MapPin, 
  Clock, Zap, Layout, 
  Search, Bell, Laptop,
  ArrowUpRight, Send, CheckCircle
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const LIVE_POSTS = [
  { author: "Opio Eric", text: "Just shared the CS study guide in the Vault! 📚", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400" },
  { author: "Sarah M.", text: "Found a lost calculator at the Main Library. Floor 2!", img: "https://images.unsplash.com/photo-1580894732230-28299ae40342?auto=format&fit=crop&w=400" },
  { author: "Sports Wing", text: "Mak Impalas win again! Freedom Square was lit! 🔥", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400" },
  { author: "Namusoke J.", text: "Anyone selling a laptop charger? DM me!", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400" },
  { author: "Guild Office", text: "Bazaar starts on Monday! Get your stalls ready.", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400" },
];

const CHAT_LOG = [
  { sender: "Ninfa", text: "Hey Brian! Are you coming to Freedom Square?" },
  { sender: "Brian", text: "Yeah, just finishing my project at the lab. 💻" },
  { sender: "Ninfa", text: "Cool! Don't forget the past papers!" },
  { sender: "Brian", text: "Got them! See you in 10 mins. ✌️" },
];

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
];

const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
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
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-3 bg-white shadow-lg border-b border-slate-100' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-xl group-hover:bg-[var(--brand-color)] transition-colors">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)]">The Campus Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hidden md:block">Login</button>
            <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--brand-color)] transition-all active:scale-95">
               Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: CLEAR CAMPUS VIEW */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
             className="w-full h-full object-cover opacity-80" 
             alt="Makerere Main Hall"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-10 animate-in slide-in-from-left-10 duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Campus Pulse Online</span>
              </div>
              <h1 className="text-[4.5rem] md:text-[8rem] font-black leading-[0.8] tracking-[-0.05em] uppercase text-slate-900">
                Your <br /> 
                <span className="text-[var(--brand-color)] italic">Campus.</span>
              </h1>
              <p className="max-w-lg text-lg md:text-2xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-[var(--brand-color)] pl-8">
                Welcome home, Makerere students. Share notes, find friends, and keep up with life at The Hill.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onStart} className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-[var(--brand-color)] transition-all flex items-center justify-center gap-4 group active:scale-95">
                Explore the Hub <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* SIDE PANEL: SCROLLING POSTS */}
          <div className="hidden lg:block relative h-[600px]">
             <div className="absolute top-0 right-0 w-80 h-[500px] overflow-hidden border border-slate-100 bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3">
                      <Camera size={18} className="text-[var(--brand-color)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">Campus Stream</span>
                   </div>
                </div>
                <div className="space-y-10 animate-marquee-vertical">
                   {[...LIVE_POSTS, ...LIVE_POSTS].map((post, i) => (
                     <div key={i} className="space-y-3">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} className="w-full h-full" />
                           </div>
                           <p className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-color)]">{post.author}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-tight">"{post.text}"</p>
                        <div className="rounded-xl overflow-hidden border border-slate-100">
                           <img src={post.img} className="w-full h-24 object-cover" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* FLOATING CHAT - REPOSITIONED & WHITE THEME */}
        <div className="hidden lg:block fixed bottom-10 left-10 w-80 bg-white border border-slate-100 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 z-50 animate-bounce-soft">
           <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Chat</span>
              </div>
              <Users size={16} className="text-slate-300" />
           </div>
           <div className="space-y-4 min-h-[120px] flex flex-col justify-end">
              {CHAT_LOG.slice(0, chatIdx).map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'Brian' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1`}>
                   <div className={`px-4 py-2 rounded-2xl text-xs font-medium max-w-[90%] ${msg.sender === 'Brian' ? 'bg-slate-100 text-slate-800 rounded-br-none' : 'bg-[var(--brand-color)] text-white rounded-bl-none shadow-sm'}`}>
                      {msg.text}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. HORIZONTAL COLLEGES SCROLL - IMPROVED DESIGN */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
           <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900">Explore <span className="text-[var(--brand-color)] italic">The Hubs.</span></h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Every college hub is active and online</p>
           </ScrollReveal>
        </div>

        <div className="relative">
           <div className="flex gap-6 px-6 animate-marquee-horizontal hover:pause transition-all">
              {[...COLLEGES, ...COLLEGES].map((college, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-72 relative rounded-3xl overflow-hidden group/card shadow-xl border border-white/20 transition-all hover:scale-105">
                   <img src={college.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{college.id}</h3>
                         <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest">{college.name}</p>
                         <button onClick={onStart} className="mt-4 flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0">
                            Sync Hub <ChevronRight size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. FEATURED EVENT POST - POST STYLE */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
           <ScrollReveal>
              <article className="bg-white border border-slate-100 rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                 <div className="p-6 md:p-10 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                          <Star size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Featured Event</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alumni Network & Guild</p>
                       </div>
                    </div>
                    <div className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 text-[10px] font-black uppercase tracking-widest animate-pulse">
                       Coming Soon
                    </div>
                 </div>

                 <div className="aspect-video relative overflow-hidden">
                    <img 
                      src="https://campusbee.ug/wp-content/uploads/2022/10/MAK-Gala.jpg" 
                      className="w-full h-full object-cover" 
                      alt="Homecoming Gala"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                 </div>

                 <div className="p-8 md:p-12 space-y-10">
                    <div className="space-y-4 text-center md:text-left">
                       <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">Homecoming <br /> <span className="text-slate-300 italic">Gala 2026.</span></h2>
                       <p className="text-xl text-slate-600 font-medium italic border-l-4 border-rose-500 pl-8 py-2">
                         The biggest gathering on the Hill. Connect with alumni and celebrate Makerere's century of legacy.
                       </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                         { val: timeLeft.days, label: 'Days' },
                         { val: timeLeft.hours, label: 'Hours' },
                         { val: timeLeft.mins, label: 'Mins' },
                         { val: timeLeft.secs, label: 'Secs' }
                       ].map(unit => (
                         <div key={unit.label} className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                            <p className="text-4xl md:text-5xl font-black text-slate-900 tabular-nums">{unit.val}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">{unit.label}</p>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 pt-4">
                       <button onClick={onStart} className="flex-1 py-6 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center gap-4 active:scale-95">
                          Get Early Tickets <ArrowUpRight size={18}/>
                       </button>
                       <button className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4">
                          View Program
                       </button>
                    </div>
                 </div>
              </article>
           </ScrollReveal>
        </div>
      </section>

      {/* 5. TOOLS LIST - REVEAL ON SCROLL */}
      <section className="py-40 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-24">
          <ScrollReveal>
             <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Tools for your <br /> <span className="text-[var(--brand-color)] italic">success.</span></h2>
                <p className="max-w-2xl mx-auto text-slate-600 text-xl font-medium">"Everything you need to navigate the Hill is right in your pocket."</p>
             </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: 'The Vault', desc: 'Download notes, books, and past papers instantly.', icon: <BookOpen className="text-indigo-600"/> },
               { title: 'Campus Chat', desc: 'Securely message anyone in your class or college.', icon: <MessageSquare className="text-rose-500"/> },
               { title: 'Bazaar', desc: 'Trade services, buy gear, or find student deals.', icon: <Zap className="text-amber-500"/> },
               { title: 'Digital IDs', desc: 'A verified student profile for the entire university.', icon: <ShieldCheck className="text-emerald-500"/> },
               { title: 'Study Hubs', desc: 'Find study groups or specialized college news.', icon: <Layout className="text-slate-400"/> },
               { title: 'Find My Gear', desc: 'Lost something? Check the campus lost & found.', icon: <Laptop className="text-[var(--brand-color)]"/> }
             ].map((feat, i) => (
               <ScrollReveal key={i}>
                  <div className="bg-white p-12 rounded-3xl border border-slate-100 hover:border-[var(--brand-color)] transition-all group relative overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-2xl">
                     <div className="space-y-6 relative z-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                           {feat.icon}
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">{feat.title}</h3>
                        <p className="text-slate-500 font-medium text-base leading-relaxed">{feat.desc}</p>
                     </div>
                     <button onClick={onStart} className="mt-10 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-[var(--brand-color)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                       Learn More <ChevronRight size={14}/>
                     </button>
                  </div>
               </ScrollReveal>
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
          <ScrollReveal>
             <div className="space-y-8">
               <div className="flex items-center justify-center gap-4 mb-10">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
                     <span className="text-slate-900 font-black text-5xl">M</span>
                  </div>
               </div>
               <h2 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic text-white">Join the <br /> <span className="text-[var(--brand-color)]">Family.</span></h2>
               <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto italic leading-relaxed">
                 "18,000 students and growing. Your campus social experience starts here."
               </p>
             </div>
          </ScrollReveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button onClick={onStart} className="px-20 py-10 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">
              Create My Profile
            </button>
            <div className="flex items-center gap-8 text-slate-500">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+30}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-left">
                  <p className="text-xl font-black text-white tracking-tighter">18,421</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Students Joined</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-60 pt-20 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-3">
                 <span className="text-2xl font-black tracking-tighter uppercase text-[var(--brand-color)]">MakSocial</span>
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Built for Makerere students</p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
              <a href="#" className="hover:text-white transition-all">Rules</a>
              <a href="#" className="hover:text-white transition-all">Privacy</a>
              <a href="#" className="hover:text-white transition-all">Help</a>
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
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
