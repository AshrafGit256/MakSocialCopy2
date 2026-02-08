
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Star, 
  Share2, Zap, MessageCircle, MapPin, 
  Bell, Image as ImageIcon, Camera,
  CheckCircle2, Heart, ExternalLink,
  Target, Cpu, Layers, Shield, Mail, 
  Info, Smartphone, Database
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & Information Sciences' },
  { id: 'CEDAT', name: 'Engineering, Design, Art & Tech' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences' },
  { id: 'CONAS', name: 'Natural Sciences' },
  { id: 'CHS', name: 'Health Sciences' },
  { id: 'CAES', name: 'Agricultural & Environmental' },
  { id: 'COBAMS', name: 'Business & Management' },
  { id: 'CEES', name: 'Education & External Studies' },
  { id: 'LAW', name: 'School of Law' },
  { id: 'CoVAB', name: 'Veterinary Medicine' }
];

const GALLERY_IMAGES = [
  { url: "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg", height: "h-64" },
  { url: "https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg", height: "h-80" },
  { url: "https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg", height: "h-60" },
  { url: "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg", height: "h-96" },
  { url: "https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png", height: "h-72" },
  { url: "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg", height: "h-56" },
  { url: "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg", height: "h-80" },
  { url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw", height: "h-64" }
];

const STREAM_POSTS = [
  { 
    user: "VC Office", 
    avatar: "https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg", 
    text: "Welcome to the new semester! Let's build the future together.", 
    time: "2m", 
    hasImg: true, 
    img: GALLERY_IMAGES[0].url 
  },
  { 
    user: "Guild President", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guild", 
    text: "Join us at Freedom Square at 4 PM for the unity meet.", 
    time: "5m" 
  },
  { 
    user: "Career Office", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Career", 
    text: "Stanbic Bank has posted 10 new internship slots for finalists.", 
    time: "12m", 
    hasImg: true, 
    img: GALLERY_IMAGES[4].url 
  },
  { 
    user: "Engineering Dept", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kato", 
    text: "New lab equipment arrived today at CEDAT. Practical sessions start Monday.", 
    time: "1h", 
    hasImg: true, 
    img: GALLERY_IMAGES[6].url 
  }
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeNotif, setActiveNotif] = useState(0);

  const notifs = [
    { title: "Study Help", body: "New Math Notes uploaded", color: "bg-emerald-500" },
    { title: "Job Alert", body: "Airtel Internships now open", color: "bg-indigo-500" },
    { title: "Campus News", body: "Guild Meeting today @ 5PM", color: "bg-amber-500" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setActiveNotif(prev => (prev + 1) % notifs.length), 4000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. MINIMALIST NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--brand-color)] rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Community', 'Study Vault', 'Jobs', 'Events'].map(item => (
              <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 hover:text-[var(--brand-color)] transition-all">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <button onClick={onStart} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 px-4">Log In</button>
             <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Join Now</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 lg:pt-60 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-6 space-y-10 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full animate-in slide-in-from-top-4 duration-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Our Campus is Live</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-slate-900">
              Your Campus, <br />
              <span className="text-[var(--brand-color)] italic">Together.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The official network for Makerere students. Connect with your classmates, find study materials, and discover opportunities on the hill.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
              <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-6 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl shadow-teal-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Create Account <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-6 border border-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4">
                Browse Vault <BookOpen size={18} />
              </button>
            </div>
          </div>

          {/* ADVANCED SCROLLING FEED PREVIEW */}
          <div className="lg:col-span-6 relative h-[650px] hidden lg:block overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50/50 shadow-2xl p-6">
             <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 to-transparent z-10"></div>
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
             
             <div className="flex items-center justify-between mb-10 px-4 pt-4">
                <div className="flex items-center gap-3">
                   <Activity size={18} className="text-rose-500" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Live Campus Feed</span>
                </div>
             </div>

             <div className="space-y-6 animate-infinite-scroll px-2">
                {[...STREAM_POSTS, ...STREAM_POSTS].map((post, i) => (
                  <div key={i} className="bg-white border border-slate-200/60 p-6 rounded-[2rem] space-y-4 shadow-sm hover:shadow-xl transition-all duration-500">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <img src={post.avatar} className="w-12 h-12 rounded-full border border-slate-100 object-cover shadow-sm" />
                           <div>
                              <div className="flex items-center gap-1.5">
                                 <p className="text-[12px] font-bold uppercase text-slate-900 leading-none">{post.user}</p>
                                 <CheckCircle2 size={12} className="text-[var(--brand-color)]" fill="currentColor" stroke="white" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{post.time} ago</p>
                           </div>
                        </div>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors"><Share2 size={16} /></button>
                     </div>
                     <p className="text-[14px] font-medium leading-relaxed text-slate-600">"{post.text}"</p>
                     {post.hasImg && (
                       <div className="rounded-2xl overflow-hidden aspect-video border border-slate-100">
                          <img src={post.img} className="w-full h-full object-cover" />
                       </div>
                     )}
                     <div className="flex items-center gap-8 pt-2 text-slate-400">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition-colors"><Heart size={16}/> <span className="text-[11px] font-bold">24</span></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-500 transition-colors"><MessageCircle size={16}/> <span className="text-[11px] font-bold">8</span></div>
                     </div>
                  </div>
                ))}
             </div>

             {/* SLEEK MINI ALERT */}
             <div className="absolute top-10 right-6 z-[150] animate-in slide-in-from-right-10 duration-700">
                <div key={activeNotif} className="bg-white px-5 py-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3 max-w-[280px]">
                   <div className={`w-2 h-2 rounded-full shrink-0 ${notifs[activeNotif].color} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
                   <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 truncate leading-none mb-1 uppercase tracking-tight">{notifs[activeNotif].title}</p>
                      <p className="text-[9px] text-slate-500 font-medium truncate uppercase tracking-widest">{notifs[activeNotif].body}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC DRIFTING PINTEREST GALLERY */}
      <section className="py-32 px-6 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--brand-color)]">
                   <Camera size={24}/>
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Campus Gallery</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Moments from <br /> <span className="italic text-teal-600">The Hill</span></h2>
             </div>
             <button onClick={onStart} className="px-10 py-4 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-[var(--brand-color)] hover:text-[var(--brand-color)] transition-all shadow-sm">Explore All Photos</button>
          </div>

          <div className="flex gap-6 overflow-hidden h-[800px]">
             {/* Column 1 - Drift Slow */}
             <div className="flex-1 flex flex-col gap-6 animate-drift-slow">
                {[GALLERY_IMAGES[0], GALLERY_IMAGES[4], GALLERY_IMAGES[0], GALLERY_IMAGES[4]].map((img, i) => (
                   <div key={i} className="relative group overflow-hidden rounded-[2rem] border border-white shadow-lg h-64 shrink-0">
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   </div>
                ))}
             </div>
             {/* Column 2 - Drift Fast */}
             <div className="flex-1 flex flex-col gap-6 animate-drift-fast mt-[-100px]">
                {[GALLERY_IMAGES[1], GALLERY_IMAGES[5], GALLERY_IMAGES[1], GALLERY_IMAGES[5]].map((img, i) => (
                   <div key={i} className="relative group overflow-hidden rounded-[2rem] border border-white shadow-lg h-80 shrink-0">
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   </div>
                ))}
             </div>
             {/* Column 3 - Drift Slow (Opposite) */}
             <div className="flex-1 hidden md:flex flex-col gap-6 animate-drift-slow-reverse">
                {[GALLERY_IMAGES[2], GALLERY_IMAGES[6], GALLERY_IMAGES[2], GALLERY_IMAGES[6]].map((img, i) => (
                   <div key={i} className="relative group overflow-hidden rounded-[2rem] border border-white shadow-lg h-72 shrink-0">
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   </div>
                ))}
             </div>
             {/* Column 4 - Drift Medium */}
             <div className="flex-1 hidden lg:flex flex-col gap-6 animate-drift-medium mt-[-50px]">
                {[GALLERY_IMAGES[3], GALLERY_IMAGES[7], GALLERY_IMAGES[3], GALLERY_IMAGES[7]].map((img, i) => (
                   <div key={i} className="relative group overflow-hidden rounded-[2rem] border border-white shadow-lg h-96 shrink-0">
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 4. THE TEN COLLEGES */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">Find your <br /> Faculty.</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">Connect with thousands of students from all ten colleges at Makerere University. Each college has its own dedicated community hub.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {COLLEGES.map((college, i) => (
                <div key={college.id} className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:border-[var(--brand-color)] hover:shadow-2xl transition-all group flex flex-col justify-between aspect-square relative overflow-hidden shadow-sm">
                   <div className="absolute -top-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <Database size={150} />
                   </div>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                         <span className="text-3xl font-black tracking-tighter text-slate-900 group-hover:text-[var(--brand-color)] transition-colors">{college.id}</span>
                         <div className={`w-2.5 h-2.5 rounded-full ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-indigo-500'} shadow-[0_0_10px_currentColor] animate-pulse`}></div>
                      </div>
                      <p className="text-[12px] font-bold text-slate-500 leading-snug uppercase tracking-tight pr-6">{college.name}</p>
                   </div>
                   <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 group-hover:text-[var(--brand-color)] transition-all flex items-center gap-3">Open Hub <ChevronRight size={14}/></button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. FEATURE SHOWCASE */}
      <section className="py-48 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
           <img src={GALLERY_IMAGES[1].url} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto space-y-48 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-5 space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">
                   <Shield size={14} className="text-emerald-400" /> Safe & Secure
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">Shared Knowledge.</h2>
                <p className="text-2xl text-white/50 leading-relaxed font-medium">
                   Access thousands of verified study materials. From lecture notes to old past papers, everything you need for academic success is here.
                </p>
                <div className="space-y-4">
                   {['Easy File Downloads', 'Filtered by Course', 'Verified by Students'].map(f => (
                     <div key={f} className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-white/70">
                        <CheckCircle2 size={20} className="text-emerald-500" /> {f}
                     </div>
                   ))}
                </div>
                <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-6 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-4 active:scale-95">
                   Enter the Vault <ExternalLink size={20} />
                </button>
             </div>
             <div className="lg:col-span-7 relative">
                <div className="aspect-video bg-white/5 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 group">
                   <img src={GALLERY_IMAGES[6].url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
                      <div className="flex items-center gap-5 mb-4">
                         <BookOpen size={40} className="text-emerald-500" />
                         <span className="text-[11px] font-bold uppercase tracking-[0.6em]">Academic Library</span>
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter italic">42,500+ Files Synced</h3>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="pt-32 pb-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            
            <div className="space-y-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tight uppercase text-slate-900">MakSocial</span>
               </div>
               <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                  The official community network for Makerere University. We connect students and faculty to foster collaboration, sharing, and growth.
               </p>
               <div className="flex gap-8 text-slate-300">
                  <Globe size={20} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Target size={20} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <ShieldCheck size={20} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Database size={20} className="hover:text-slate-900 transition-colors cursor-pointer" />
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-4">Our Colleges</h3>
               <ul className="space-y-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {COLLEGES.slice(0, 6).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-colors flex items-center gap-3">
                       <ChevronRight size={12} /> {c.name}
                    </li>
                  ))}
                  <li className="text-[var(--brand-color)] font-bold cursor-pointer hover:underline">+ All Other Hubs</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-4">Platform Services</h3>
               <ul className="space-y-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Study Resources</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Student Jobs</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Project Forge</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Events Calendar</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Student Support</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-900 border-b border-slate-100 pb-4">Legals</h3>
               <ul className="space-y-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Community Rules</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Developers</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">System Status</li>
                  <li className="flex items-center gap-3 text-rose-500 cursor-pointer font-bold">
                     <Info size={14}/> Report Content
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex flex-col md:flex-row items-center gap-10">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">© 2026 MakSocial Community System</p>
                <div className="hidden lg:flex items-center gap-4">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                   <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Mainframe Stable</span>
                </div>
             </div>
             <div className="flex gap-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                <a href="#" className="hover:text-slate-900 transition-colors">Twitter (X)</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Instagram</a>
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
          animation: infiniteScroll 40s linear infinite;
        }
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        @keyframes driftReverse {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-drift-slow {
          animation: drift 60s linear infinite;
        }
        .animate-drift-fast {
          animation: drift 45s linear infinite;
        }
        .animate-drift-medium {
          animation: drift 50s linear infinite;
        }
        .animate-drift-slow-reverse {
          animation: driftReverse 70s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
