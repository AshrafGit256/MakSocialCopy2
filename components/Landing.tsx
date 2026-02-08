
import React, { useEffect, useState, useRef } from "react";
// Added missing MoreVertical and Share2 icon imports from lucide-react
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  Search, MessageSquare, BookOpen, ChevronRight,
  Database, Terminal, Cpu, Activity, Lock,
  FileText, Star, GitFork, ExternalLink, Download,
  ArrowUpRight, Zap, Radio, CheckCircle2, MessageCircle,
  Layers, MapPin, Bell, Wifi, Sparkles, MoreVertical, Share2
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 
  'CAES', 'COBAMS', 'CEES', 'LAW', 'CoVAB'
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeedIdx, setActiveFeedIdx] = useState(0);
  const [currentNotif, setCurrentNotif] = useState(0);
  const [chatStep, setChatStep] = useState(0);

  const mockFeed = [
    { author: "VC_OFFICE", text: "New research grant protocol initialized for COCIS Finalists.", type: "Official" },
    { author: "GUILD_PRESIDENT", text: "Freedom Square sync event confirmed for 5 PM today. #MakerereAt100", type: "Social" },
    { author: "LIBRARY_NODE", text: "Main Library wing now open for 24-hour assessment prep.", type: "System" },
    { author: "CAREERS_HUB", text: "Airtel Uganda has uploaded 15 new internship nodes.", type: "Opportunity" },
  ];

  const mockChat = [
    { from: "Dr. Julianne", msg: "Uplink received. Have you completed the Logic Hub project?", side: "left" },
    { from: "You", msg: "Commit 7a42b pushed. Ready for validation.", side: "right" },
    { from: "Dr. Julianne", msg: "Validated. Excellent work, Student.", side: "left" },
  ];

  const mockNotifs = [
    "New Opportunity: Fullstack Developer @ TechLab",
    "Skill Match: AI Research Wing needs Python experts",
    "System Alert: Semester 2 Assessment Timetable Synced",
    "Social: 45 Students just joined the 'COCIS Developers' cluster"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Dynamic Logic Cycles
    const feedInterval = setInterval(() => setActiveFeedIdx(p => (p + 1) % mockFeed.length), 3000);
    const notifInterval = setInterval(() => setCurrentNotif(p => (p + 1) % mockNotifs.length), 4500);
    const chatInterval = setInterval(() => setChatStep(p => (p + 1) % 4), 2500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(feedInterval);
      clearInterval(notifInterval);
      clearInterval(chatInterval);
    };
  }, []);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen overflow-x-hidden selection:bg-[var(--brand-color)] selection:text-white font-sans transition-colors duration-500">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Layer 1: Campus Image Overlay */}
        <div className="absolute inset-0 opacity-[0.12] grayscale contrast-125">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover" />
        </div>
        {/* Layer 2: Geometric Registry Grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.2]" 
             style={{ backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        {/* Layer 3: Cyber Radiance */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--brand-color)]/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-white/90 backdrop-blur-md border-b border-slate-200' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[var(--brand-color)] rounded-[2px] flex items-center justify-center shadow-xl">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase text-slate-900">MakSocial</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Community', 'Study Vault', 'Registry', 'About'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[var(--brand-color)] transition-all">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onStart} className="px-5 py-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-[var(--brand-color)]">Log In</button>
            <button onClick={onStart} className="bg-[var(--brand-color)] hover:brightness-110 text-white px-8 py-3 rounded-[2px] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95">Enroll Now</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: DYNAMIC TELEMETRY */}
      <section className="relative pt-40 lg:pt-56 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm animate-in slide-in-from-top-4 duration-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Hill Registry Online</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter text-slate-900 uppercase">
              The Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-color)] to-emerald-600">Hill Pulse.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
              Synchronizing the collective intelligence of Makerere University. Connect with nodes across all colleges and access the Hill's ultimate resource vault.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={onStart} className="bg-slate-900 text-white px-12 py-5 rounded-[2px] font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl">
                Get Started <ArrowRight size={18} />
              </button>
              <button className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[2px] font-black text-xs uppercase tracking-[0.3em] hover:border-slate-400 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-sm">
                Explore Hubs <Database size={16} />
              </button>
            </div>
          </div>

          {/* DYNAMIC TELEMETRY VISUALS */}
          <div className="lg:col-span-5 relative h-[500px] hidden lg:block">
             
             {/* 1. DYNAMIC NOTIFICATION TOAST (TOP) */}
             <div className="absolute -top-10 right-0 w-80 bg-white border border-slate-200 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right-10 duration-500 z-30">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                      <Zap size={20} fill="currentColor" />
                   </div>
                   <div className="flex-1">
                      <p className="text-[9px] font-black uppercase text-slate-400">Signal_Received</p>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">{mockNotifs[currentNotif]}</p>
                   </div>
                </div>
             </div>

             {/* 2. CHAT PREVIEW WORKSPACE */}
             <div className="absolute top-10 left-0 w-full bg-white border border-slate-200 rounded-[2px] shadow-2xl overflow-hidden z-10 transition-transform hover:scale-105 duration-500">
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Active_Uplink: Faculty_Node</span>
                   </div>
                   <MoreVertical size={14} className="text-slate-400" />
                </div>
                <div className="p-6 space-y-4 h-64 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                   {mockChat.slice(0, chatStep + 1).map((msg, i) => (
                     <div key={i} className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[80%] p-3 rounded-[4px] text-[11px] font-medium shadow-sm ${msg.side === 'right' ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-100 text-slate-700'}`}>
                           {msg.msg}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                   <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                </div>
             </div>

             {/* 3. SCROLLING FEED PREVIEW */}
             <div className="absolute -bottom-10 right-[-20px] w-72 bg-slate-900 text-white p-6 rounded-none shadow-[0_50px_100px_rgba(0,0,0,0.5)] z-20 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                   <Radio size={16} className="text-rose-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global_Stream</span>
                </div>
                <div className="space-y-6">
                   <div key={activeFeedIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">@{mockFeed[activeFeedIdx].author}</p>
                      <p className="text-[12px] font-medium leading-relaxed italic text-slate-300">"{mockFeed[activeFeedIdx].text}"</p>
                      <div className="flex items-center gap-4 mt-3 opacity-40">
                         <Star size={12} /> <MessageCircle size={12} /> <Share2 size={12} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTOR STATUS GRID: THE TEN COLLEGES */}
      <section className="py-24 px-6 z-10 relative bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Sector Synchronization</h2>
             <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Active in all ten colleges of the university</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {COLLEGES.map((college, i) => (
              <div key={college} className="p-6 bg-white border border-slate-200 rounded-[2px] group hover:border-[var(--brand-color)] transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                   <div className="flex justify-between items-start">
                      <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-[var(--brand-color)] transition-colors">{college}</span>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status: <span className="text-emerald-600">Uplink Stable</span></p>
                      <div className="h-0.5 w-full bg-slate-100">
                         <div className="h-full bg-[var(--brand-color)]/20 w-full"></div>
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Database size={80} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE: HIGH-FIDELITY ASSETS */}
      <section className="py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* Feature 1: Study Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative">
                <div className="aspect-video bg-slate-900 rounded-[2px] overflow-hidden shadow-2xl border border-white/10 group">
                   <img src="https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                      <div className="flex items-center gap-3 text-white mb-2">
                         <BookOpen size={24} />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Resource_Index</span>
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">The Study Vault</h3>
                   </div>
                </div>
                <div className="absolute -bottom-6 -right-6 p-6 bg-white border border-slate-200 shadow-2xl rounded-xl z-20 hidden md:block">
                   <div className="flex items-center gap-4">
                      <FileText className="text-[var(--brand-color)]" size={32} />
                      <div>
                         <p className="text-[12px] font-black text-slate-800">42,500+ Assets</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">Synchronized across wings</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">Shared <br /> Intelligence.</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   Access a century of academic history. From past papers to research nodes, our Study Vault is the hill's largest repository of peer-validated materials.
                </p>
                <div className="space-y-4">
                   {['Instant Asset Downloads', 'Wing-Specific Filters', 'Registry Persistence'].map(f => (
                     <div key={f} className="flex items-center gap-3 text-slate-700 font-bold uppercase text-[10px] tracking-[0.2em]">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Feature 2: Verified Community */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
                <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">Verified <br /> Protocols.</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   No anonymous nodes. Every user on MakSocial is a validated student or staff member of Makerere University, ensuring a high-integrity ecosystem for communication.
                </p>
                <button onClick={onStart} className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)] group">
                   Initialize Security Handshake <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </div>
             <div className="relative">
                <div className="aspect-square bg-slate-100 rounded-full border border-slate-200 p-12 relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
                   <div className="relative z-10 w-full max-w-xs space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xl animate-in slide-in-from-left-${i*4} duration-1000`}>
                           <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"></div>
                           <div className="flex-1 space-y-1">
                              <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                              <div className="h-1.5 w-1/3 bg-slate-100 rounded"></div>
                           </div>
                           <ShieldCheck size={16} className="text-emerald-500" />
                        </div>
                      ))}
                   </div>
                </div>
                {/* Visual Anchor: University Logo Watermark */}
                <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="absolute -top-10 -right-10 w-32 h-32 opacity-10 rotate-12" />
             </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-48 px-6 relative z-10 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-[0.05] grayscale brightness-0 invert scale-110">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
           <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] font-black uppercase tracking-[0.5em]">
              <Wifi size={14} className="animate-pulse" /> System_Commit_Ready
           </div>
           <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
             Join the <br /> Registry.
           </h2>
           <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
             The Hill is waiting for your signal. Connect with classmates across all ten colleges and unlock the ultimate campus experience.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={onStart} className="w-full sm:w-auto bg-[var(--brand-color)] text-white px-16 py-6 rounded-[2px] font-black text-sm uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl active:scale-95">
                 Initialize Account
              </button>
              <button className="w-full sm:w-auto px-16 py-6 bg-transparent border border-white/20 text-white rounded-[2px] font-black text-sm uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
                 View Manifesto
              </button>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
             <div className="p-3 bg-slate-100 border border-slate-200 rounded-[2px]">
                <Users size={24} className="text-[var(--brand-color)]" />
             </div>
             <div>
                <span className="text-xl font-black uppercase text-slate-900 tracking-tighter">MakSocial</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Version 5.0.0 Stable_Node</p>
             </div>
          </div>
          <div className="flex gap-10">
             {['Governance', 'Privacy', 'Nodes', 'Support'].map(l => (
               <a key={l} href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[var(--brand-color)] transition-colors">{l}</a>
             ))}
          </div>
          <div className="text-center md:text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
               © 2026 Hill Registry. <br /> Built for the Makerere Community.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
