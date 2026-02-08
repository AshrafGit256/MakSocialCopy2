
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Star, 
  Share2, Zap, MessageCircle, MapPin, 
  Bell, Image as ImageIcon, Camera,
  CheckCircle2, Heart, ExternalLink,
  Target, Cpu, Layers, Shield, Mail, 
  Info, Smartphone, Database, Compass
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
  { url: "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg", height: "h-72" },
  { url: "https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg", height: "h-96" },
  { url: "https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg", height: "h-64" },
  { url: "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg", height: "h-80" },
  { url: "https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png", height: "h-96" },
  { url: "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg", height: "h-56" },
  { url: "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg", height: "h-80" },
  { url: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw", height: "h-72" }
];

const STREAM_POSTS = [
  { 
    user: "Prof. Nawangwe", 
    avatar: "https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg", 
    text: "Innovation is the heartbeat of the Hill. Excited to see the new project nodes!", 
    time: "2m", 
    hasImg: true, 
    img: GALLERY_IMAGES[0].url 
  },
  { 
    user: "Guild President", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guild", 
    text: "Freedom Square cleanup starts at 9 AM. Let's keep our heritage shining.", 
    time: "5m" 
  },
  { 
    user: "Career Hub", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Career", 
    text: "Top 5 software firms in Kampala are currently headhunting COCIS finalists.", 
    time: "12m", 
    hasImg: true, 
    img: GALLERY_IMAGES[4].url 
  },
  { 
    user: "UniPod Forge", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=UniPod", 
    text: "3D printers are now free for all final year engineering students.", 
    time: "1h", 
    hasImg: true, 
    img: GALLERY_IMAGES[6].url 
  }
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSignal, setActiveSignal] = useState(0);

  const signals = [
    { title: "Vault Sync", body: "12 new Past Papers added", color: "bg-emerald-500" },
    { title: "Opportunity", body: "Stanbic Internship is live", color: "bg-indigo-500" },
    { title: "Campus Pulse", body: "Freedom Sq Event @ 4PM", color: "bg-rose-500" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setActiveSignal(prev => (prev + 1) % signals.length), 3500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. STICKY GLASS NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[250] transition-all duration-700 ${scrolled ? 'py-4 bg-white/70 backdrop-blur-2xl border-b border-slate-100 shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['The Pulse', 'Study Vault', 'Opportunities', 'About'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
             <button onClick={onStart} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 px-2 transition-colors">Log In</button>
             <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-teal-500/30 hover:brightness-110 transition-all active:scale-95">Enroll Now</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 lg:pt-64 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-6 space-y-12 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full animate-in slide-in-from-top-4 duration-1000">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Registry Status: Live</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter text-slate-900">
              Life on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-color)] to-emerald-500 italic">The Hill.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Connect with classmates, access the world's largest student resource vault, and never miss a beat at Makerere University.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
              <button onClick={onStart} className="bg-slate-900 text-white px-14 py-7 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Enter Community <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-14 py-7 border border-slate-200 text-slate-500 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4">
                Explore Hubs <Compass size={20} />
              </button>
            </div>
          </div>

          {/* FLUID MARQUEE FEED */}
          <div className="lg:col-span-6 relative h-[700px] hidden lg:block overflow-hidden rounded-[4rem] border border-slate-100 bg-slate-50/30 p-8 shadow-2xl">
             <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent z-10"></div>
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
             
             <div className="flex items-center justify-between mb-12 px-4 pt-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-2xl shadow-xl"><Activity size={20} className="text-rose-500" /></div>
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Real-time Stream</span>
                </div>
             </div>

             <div className="space-y-8 animate-infinite-scroll">
                {[...STREAM_POSTS, ...STREAM_POSTS].map((post, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] space-y-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-700 group border border-slate-100/50">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <img src={post.avatar} className="w-14 h-14 rounded-full border-4 border-slate-50 object-cover shadow-lg transition-transform group-hover:scale-110" />
                           <div>
                              <div className="flex items-center gap-2">
                                 <p className="text-[14px] font-black uppercase text-slate-900 leading-none">{post.user}</p>
                                 <CheckCircle2 size={14} className="text-[var(--brand-color)]" fill="currentColor" stroke="white" />
                              </div>
                              <p className="text-[10px] font-black text-slate-300 uppercase mt-1.5">{post.time} ago</p>
                           </div>
                        </div>
                        <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors"><Share2 size={18} /></button>
                     </div>
                     <p className="text-[16px] font-medium leading-relaxed text-slate-500 italic">"{post.text}"</p>
                     {post.hasImg && (
                       <div className="rounded-3xl overflow-hidden aspect-video shadow-inner">
                          <img src={post.img} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                       </div>
                     )}
                     <div className="flex items-center gap-10 pt-2 text-slate-300">
                        <div className="flex items-center gap-2.5 cursor-pointer hover:text-rose-500 transition-colors"><Heart size={20}/> <span className="text-[12px] font-black">2.4k</span></div>
                        <div className="flex items-center gap-2.5 cursor-pointer hover:text-indigo-500 transition-colors"><MessageCircle size={20}/> <span className="text-[12px] font-black">182</span></div>
                     </div>
                  </div>
                ))}
             </div>

             {/* MICRO-SIGNAL PILL */}
             <div className="absolute top-12 right-12 z-[150] animate-in slide-in-from-right-10 duration-1000">
                <div key={activeSignal} className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white flex items-center gap-4 max-w-[320px]">
                   <div className={`w-3 h-3 rounded-full shrink-0 ${signals[activeSignal].color} animate-pulse shadow-[0_0_15px_currentColor]`}></div>
                   <div className="min-w-0">
                      <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tighter leading-none mb-1.5">{signals[activeSignal].title}</p>
                      <p className="text-[9px] text-slate-400 font-bold truncate uppercase tracking-widest leading-none">{signals[activeSignal].body}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. DRIFTING MASONRY GALLERY */}
      <section className="py-40 px-8 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
             <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--brand-color)]">
                   <Camera size={28}/>
                   <span className="text-[11px] font-black uppercase tracking-[0.5em]">The Visual Index</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">Moments from <br /> <span className="italic text-teal-600">The Hill.</span></h2>
             </div>
             <button onClick={onStart} className="px-12 py-5 bg-white border border-slate-200 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-xl transition-all shadow-sm">View Global Gallery</button>
          </div>

          <div className="flex gap-8 h-[900px] overflow-hidden">
             {/* Col 1 - Drift Slow */}
             <div className="flex-1 flex flex-col gap-8 animate-drift-slow">
                {[GALLERY_IMAGES[0], GALLERY_IMAGES[4], GALLERY_IMAGES[1], GALLERY_IMAGES[5]].map((img, i) => (
                   <div key={i} className={`relative group overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl shrink-0 ${img.height}`}>
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl"><ImageIcon size={20} className="text-slate-900"/></div>
                      </div>
                   </div>
                ))}
             </div>
             {/* Col 2 - Drift Fast */}
             <div className="flex-1 flex flex-col gap-8 animate-drift-fast mt-[-200px]">
                {[GALLERY_IMAGES[2], GALLERY_IMAGES[6], GALLERY_IMAGES[3], GALLERY_IMAGES[7]].map((img, i) => (
                   <div key={i} className={`relative group overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl shrink-0 ${img.height}`}>
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" />
                   </div>
                ))}
             </div>
             {/* Col 3 - Drift Slow Rev */}
             <div className="flex-1 hidden md:flex flex-col gap-8 animate-drift-slow-reverse">
                {[GALLERY_IMAGES[1], GALLERY_IMAGES[5], GALLERY_IMAGES[0], GALLERY_IMAGES[4]].map((img, i) => (
                   <div key={i} className={`relative group overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl shrink-0 ${img.height}`}>
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" />
                   </div>
                ))}
             </div>
             {/* Col 4 - Drift Medium */}
             <div className="flex-1 hidden lg:flex flex-col gap-8 animate-drift-medium mt-[-100px]">
                {[GALLERY_IMAGES[3], GALLERY_IMAGES[7], GALLERY_IMAGES[2], GALLERY_IMAGES[6]].map((img, i) => (
                   <div key={i} className={`relative group overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl shrink-0 ${img.height}`}>
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" />
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 4. THE COLLEGES GRID */}
      <section className="py-48 px-8">
        <div className="max-w-7xl mx-auto">
           <div className="max-w-4xl mb-32 space-y-8">
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 uppercase leading-[0.8]">One Network. <br /> <span className="text-slate-200">Ten Colleges.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">Every faculty, every course, every student. Connected through a single synchronized intelligence matrix.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {COLLEGES.map((college, i) => (
                <div key={college.id} className="p-12 bg-white border border-slate-100 rounded-[4rem] hover:border-slate-900 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all group flex flex-col justify-between aspect-square relative overflow-hidden shadow-sm">
                   <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Database size={180} />
                   </div>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                         <span className="text-4xl font-black tracking-tighter text-slate-900 group-hover:scale-110 transition-transform origin-left">{college.id}</span>
                         <div className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-indigo-500'} shadow-[0_0_15px_currentColor] animate-pulse`}></div>
                      </div>
                      <p className="text-[14px] font-black text-slate-400 leading-snug uppercase tracking-tight pr-6 group-hover:text-slate-900 transition-colors">{college.name}</p>
                   </div>
                   <button className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-slate-900 transition-all flex items-center gap-4">Initialize Sync <ChevronRight size={16}/></button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. STUDY VAULT FEATURE */}
      <section className="py-56 px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.1] grayscale scale-125">
           <img src={GALLERY_IMAGES[1].url} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto space-y-56 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
             <div className="lg:col-span-6 space-y-12">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-[11px] font-black uppercase tracking-[0.4em]">
                   <Shield size={16} className="text-emerald-400 shadow-[0_0_10px_#10b981]" /> Encrypted_Knowledge_Base
                </div>
                <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">The <br /> Study <br /> Vault.</h2>
                <p className="text-2xl md:text-3xl text-white/40 leading-relaxed font-medium">
                   Access 42,000+ verified academic assets. From clinical case studies to legacy codebases.
                </p>
                <div className="space-y-6">
                   {['Identity-Linked Verification', 'College-Restricted Strata', 'P2P Knowledge Exchange'].map(f => (
                     <div key={f} className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.5em] text-white/70">
                        <CheckCircle2 size={24} className="text-emerald-500" /> {f}
                     </div>
                   ))}
                </div>
                <button onClick={onStart} className="bg-white text-black px-16 py-8 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-5 active:scale-95">
                   Uplink to Vault <ExternalLink size={24} />
                </button>
             </div>
             <div className="lg:col-span-6 relative">
                <div className="aspect-[4/5] bg-white/5 rounded-[4rem] overflow-hidden shadow-[0_100px_150px_-30px_rgba(0,0,0,0.8)] border border-white/10 group relative">
                   <img src={GALLERY_IMAGES[6].url} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-[4s]" />
                   <div className="absolute inset-0 flex flex-col justify-end p-16 bg-gradient-to-t from-black via-black/20 to-transparent">
                      <div className="flex items-center gap-6 mb-6">
                         <div className="p-5 bg-white rounded-3xl"><BookOpen size={48} className="text-slate-900" /></div>
                         <div className="h-px flex-1 bg-white/20"></div>
                      </div>
                      <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Synchronized <br /> Intelligence.</h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 mt-6">Registry_Uptime: 99.9%</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="pt-40 pb-20 px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
            
            <div className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter uppercase text-slate-900">MakSocial</span>
               </div>
               <p className="text-[16px] text-slate-400 leading-loose font-medium">
                  The definitive digital stratum for the Makerere University ecosystem. Built to facilitate the rapid exchange of academic intelligence, student opportunities, and campus social pulse.
               </p>
               <div className="flex gap-10 text-slate-300">
                  <Globe size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Target size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <ShieldCheck size={24} className="hover:text-slate-900 transition-colors cursor-pointer" /> 
                  <Database size={24} className="hover:text-slate-900 transition-colors cursor-pointer" />
               </div>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-6">Academic Sectors</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {COLLEGES.slice(0, 6).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-colors flex items-center gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-teal-500 transition-colors"></div> {c.name}
                    </li>
                  ))}
                  <li className="text-[var(--brand-color)] font-black cursor-pointer hover:underline pt-4">+ All Campus Hubs</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-6">Registry Services</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Study Vault Access</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Career Opportunity Sync</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Innovation Hub Forge</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Event Temporals</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Digital Identity Registry</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Community Support</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900 border-b border-slate-100 pb-6">Registry Policy</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Community Protocol</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Signal Privacy</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Node Governance</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Developer Uplinks</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">System Transparency</li>
                  <li className="flex items-center gap-4 text-rose-500 cursor-pointer font-black pt-4">
                     <Info size={18}/> Report Signal Breach
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex flex-col md:flex-row items-center gap-12">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry Core</p>
                <div className="hidden lg:flex items-center gap-6">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol_Stable_v5.2.0</span>
                </div>
             </div>
             <div className="flex gap-16 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-slate-900 transition-colors">Manifesto</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Governance</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
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
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        @keyframes driftReverse {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-drift-slow {
          animation: drift 120s linear infinite;
        }
        .animate-drift-fast {
          animation: drift 80s linear infinite;
        }
        .animate-drift-medium {
          animation: drift 100s linear infinite;
        }
        .animate-drift-slow-reverse {
          animation: driftReverse 140s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
