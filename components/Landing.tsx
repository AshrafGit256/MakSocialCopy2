
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  Search, BookOpen, ChevronRight,
  Database, Activity, Star, Share2, 
  Zap, Radio, MessageCircle, MapPin, 
  Bell, Image as ImageIcon, Camera,
  CheckCircle2, Heart, ExternalLink
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & Information Sciences' },
  { id: 'CEDAT', name: 'Engineering, Design, Art & Technology' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences' },
  { id: 'CONAS', name: 'Natural Sciences' },
  { id: 'CHS', name: 'Health Sciences' },
  { id: 'CAES', name: 'Agricultural & Environmental Sciences' },
  { id: 'COBAMS', name: 'Business & Management Sciences' },
  { id: 'CEES', name: 'Education & External Studies' },
  { id: 'LAW', name: 'School of Law' },
  { id: 'CoVAB', name: 'Veterinary Medicine & Bio-security' }
];

const CAMPUS_IMAGES = [
  "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg",
  "https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg",
  "https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg",
  "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg",
  "https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png",
  "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg",
  "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw"
];

const MOCK_STREAM_POSTS = [
  { author: "Vice Chancellor", text: "Welcome back to a new semester! Let's make it productive.", time: "2m", hasImage: true, img: CAMPUS_IMAGES[0] },
  { author: "Guild President", text: "Meeting at Freedom Square today at 4 PM. See you there!", time: "5m" },
  { author: "Careers Office", text: "New internships at Stanbic Bank just posted in the opportunities section.", time: "12m", hasImage: true, img: CAMPUS_IMAGES[4] },
  { author: "Library Node", text: "The North Wing is now open 24 hours for revision.", time: "18m" },
  { author: "CS Student", text: "Anyone interested in joining a hackathon team? DM me!", time: "1h", hasImage: true, img: CAMPUS_IMAGES[6] },
  { author: "UniPod", text: "Register for the Prototyping Workshop this Friday.", time: "2h" },
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeNotif, setActiveNotif] = useState(0);

  const notifs = [
    { title: "New Internship", body: "Full-stack role at TechLab", color: "bg-emerald-500" },
    { title: "Event Reminder", body: "Cultural Gala starts in 1 hour", color: "bg-blue-500" },
    { title: "Resource Alert", body: "New Past Papers for Year 2 uploaded", color: "bg-amber-500" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const notifTimer = setInterval(() => setActiveNotif(prev => (prev + 1) % notifs.length), 3500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(notifTimer);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen overflow-x-hidden selection:bg-[var(--brand-color)] selection:text-white font-sans">
      
      {/* 1. SIMPLE TOP NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-4 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--brand-color)] rounded-lg flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Community', 'Study Vault', 'Events', 'About'].map(item => (
              <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[var(--brand-color)] transition-all">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onStart} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Log In</button>
             <button onClick={onStart} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-lg">Get Started</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 lg:pt-52 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full mx-auto lg:mx-0">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest">Connect with Makerere Students</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
              Everything Makerere, <br />
              <span className="text-[var(--brand-color)]">All in One Place.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Share updates, find study materials, discover campus opportunities, and stay connected with your college community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-teal-600/20 hover:brightness-105 transition-all flex items-center justify-center gap-4 active:scale-95">
                Join the Community <ArrowRight size={18} />
              </button>
              <button className="px-10 py-5 border border-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4">
                Browse Materials <BookOpen size={18} />
              </button>
            </div>
          </div>

          {/* DYNAMIC SCROLLING FEED PREVIEW */}
          <div className="lg:col-span-6 relative h-[600px] hidden lg:block">
             <div className="absolute inset-0 p-4 space-y-6 overflow-hidden bg-slate-50 rounded-[40px] border border-slate-100">
                <div className="flex items-center justify-between mb-8 px-4 pt-4">
                   <div className="flex items-center gap-3">
                      <Activity size={16} className="text-rose-500" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Live Campus Feed</span>
                   </div>
                </div>

                <div className="space-y-6 animate-infinite-scroll px-2">
                   {[...MOCK_STREAM_POSTS, ...MOCK_STREAM_POSTS].map((post, i) => (
                     <div key={i} className="bg-white border border-slate-100 p-6 rounded-[24px] space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-50"></div>
                              <div>
                                 <p className="text-[11px] font-black uppercase text-slate-800 leading-none">{post.author}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{post.time} ago</p>
                              </div>
                           </div>
                           <Share2 size={14} className="text-slate-300" />
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed text-slate-600">"{post.text}"</p>
                        {post.hasImage && (
                          <div className="rounded-xl overflow-hidden aspect-video border border-slate-50">
                             <img src={post.img} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-6 pt-2 text-slate-300">
                           <div className="flex items-center gap-1.5"><Heart size={14}/> <span className="text-[10px]">24</span></div>
                           <div className="flex items-center gap-1.5"><MessageCircle size={14}/> <span className="text-[10px]">8</span></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* SMALL CLEAN ALERT */}
             <div className="absolute top-10 right-[-20px] z-50 animate-in slide-in-from-right-10">
                <div key={activeNotif} className="bg-white px-4 py-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3 max-w-[240px]">
                   <div className={`w-2 h-2 rounded-full shrink-0 ${notifs[activeNotif].color} animate-pulse`}></div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-800 truncate leading-none mb-1">{notifs[activeNotif].title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{notifs[activeNotif].body}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. CAMPUS LIFE GALLERY (PINTEREST STYLE) */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
             <div className="flex items-center justify-center gap-2 text-[var(--brand-color)]">
                <Camera size={20}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Our Campus Gallery</span>
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Moments from the Hill</h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
             {CAMPUS_IMAGES.map((img, i) => (
               <div key={i} className="relative group overflow-hidden rounded-2xl border border-white shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                  <img src={img} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt="Campus Life" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <ImageIcon size={20}/>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. THE TEN COLLEGES */}
      <section className="py-32 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                 <h2 className="text-4xl font-black tracking-tight text-slate-900">Explore by <span className="text-[var(--brand-color)]">College</span></h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">The platform is used by students in all academic wings</p>
              </div>
              <div className="flex items-center gap-10">
                 <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">10</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Colleges</p>
                 </div>
                 <div className="w-px h-10 bg-slate-100"></div>
                 <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">30k+</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Nodes</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {COLLEGES.map((college, i) => (
                <div key={college.id} className="p-8 bg-white border border-slate-100 rounded-[32px] hover:border-[var(--brand-color)] hover:shadow-xl transition-all group flex flex-col justify-between aspect-square">
                   <div>
                      <div className="flex justify-between items-start mb-6">
                         <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-[var(--brand-color)] transition-colors">{college.id}</span>
                         <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{college.name}</p>
                   </div>
                   <button className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-[var(--brand-color)] transition-all flex items-center gap-2">Visit Hub <ChevronRight size={12}/></button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. FEATURE SHOWCASE */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-48">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-5 space-y-8">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Shared <br /> Knowledge.</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                   Access the ultimate study library. From past papers to research notes, students across all colleges share their best resources here.
                </p>
                <div className="space-y-4">
                   {['Instant Document Downloads', 'College-Specific Filters', 'Verified Study Notes'].map(f => (
                     <div key={f} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        <CheckCircle2 size={18} className="text-emerald-500" /> {f}
                     </div>
                   ))}
                </div>
                <button onClick={onStart} className="inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[var(--brand-color)] border-b-2 border-[var(--brand-color)] pb-2 hover:gap-8 transition-all">
                   Explore the Study Vault <ExternalLink size={18} />
                </button>
             </div>
             <div className="lg:col-span-7 relative">
                <div className="aspect-video bg-slate-100 rounded-[40px] overflow-hidden shadow-2xl group border-[10px] border-white">
                   <img src={CAMPUS_IMAGES[1]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-12 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-4 mb-4">
                         <BookOpen size={32} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Main Library Hub</span>
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight">42,000+ Study Materials</h3>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-7 order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-6 pt-20">
                      <div className="p-10 bg-blue-50 rounded-[40px] flex flex-col items-center gap-6 text-center shadow-sm">
                         <ShieldCheck size={48} className="text-blue-500" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Verified Students</h4>
                      </div>
                      <div className="p-10 bg-rose-50 rounded-[40px] flex flex-col items-center gap-6 text-center shadow-sm">
                         <MapPin size={48} className="text-rose-500" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Live Campus Events</h4>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="p-10 bg-emerald-50 rounded-[40px] flex flex-col items-center gap-6 text-center shadow-sm">
                         <Zap size={48} className="text-emerald-500" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Smart Opportunities</h4>
                      </div>
                      <div className="p-10 bg-[var(--brand-color)] rounded-[40px] flex flex-col items-center gap-6 text-center shadow-2xl">
                         <Globe size={48} className="text-white" />
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">One Community</h4>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Join Your <br /> Peers.</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                   Connect with verified students from your faculty. Share tips, discuss projects, and stay updated with official news from the university administration.
                </p>
                <button onClick={onStart} className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl">Sign Up Today</button>
             </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-48 px-6 relative z-10 overflow-hidden text-center bg-slate-900">
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay">
           <img src={CAMPUS_IMAGES[0]} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
           <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">Your Campus. <br /> Your Network.</h2>
           <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
             The most active student network at Makerere University. Don't miss out on what's happening on the Hill.
           </p>
           <button onClick={onStart} className="bg-white text-slate-900 px-16 py-6 rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all active:scale-95">Create Free Account</button>
        </div>
      </section>

      {/* WORDY FOOTER */}
      <footer className="pt-24 pb-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--brand-color)] rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight uppercase">MakSocial</span>
               </div>
               <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                  The primary digital social network for Makerere University. We provide a safe, productive, and engaging ecosystem for students to communicate, collaborate, and access essential academic resources across all ten colleges.
               </p>
               <div className="flex gap-6 text-slate-300">
                  <Globe size={18} /> <Camera size={18} /> <ShieldCheck size={18} /> <Database size={18} />
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">The Colleges</h3>
               <ul className="space-y-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {COLLEGES.slice(0, 5).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">{c.name}</li>
                  ))}
                  <li className="text-[var(--brand-color)] cursor-pointer">+ View All Faculties</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">Navigation</h3>
               <ul className="space-y-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Study Vault Archive</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Campus Opportunities</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Event Calendar</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Official Bulletins</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Privacy Policy</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">Get Help</h3>
               <ul className="space-y-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Student Support</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Campus Safety</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Feedback Hub</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Terms of Service</li>
                  <li className="flex items-center gap-2 text-rose-500 cursor-pointer">Report an Issue</li>
               </ul>
            </div>

          </div>

          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-6">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 MakSocial Community. Built for the Hill.</p>
                <div className="hidden lg:flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">System Stable</span>
                </div>
             </div>
             <div className="flex gap-8 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                <a href="#" className="hover:text-slate-900 transition-colors">Instagram</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Twitter (X)</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Facebook</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes infiniteScroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .animate-infinite-scroll {
          animation: infiniteScroll 60s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
