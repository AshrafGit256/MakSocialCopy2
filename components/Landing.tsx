
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  Search, MessageSquare, BookOpen, ChevronRight,
  Database, Terminal, Cpu, Activity, Lock,
  FileText, Star, GitFork, ExternalLink, Download,
  ArrowUpRight, Zap, Radio, CheckCircle2, MessageCircle,
  Layers, MapPin, Bell, Wifi, Sparkles, MoreVertical, Share2,
  GitBranch, Smartphone, Target, ShieldAlert
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & Info Sciences', nodes: '4.2k' },
  { id: 'CEDAT', name: 'Eng, Design, Art & Tech', nodes: '3.8k' },
  { id: 'CHUSS', name: 'Humanities & Social Sciences', nodes: '5.1k' },
  { id: 'CONAS', name: 'Natural Sciences', nodes: '2.9k' },
  { id: 'CHS', name: 'Health Sciences', nodes: '3.4k' },
  { id: 'CAES', name: 'Agricultural & Env Sciences', nodes: '2.7k' },
  { id: 'COBAMS', name: 'Business & Mgmt Sciences', nodes: '4.8k' },
  { id: 'CEES', name: 'Education & External Studies', nodes: '3.1k' },
  { id: 'LAW', name: 'School of Law', nodes: '1.2k' },
  { id: 'CoVAB', name: 'Vet Med, Bio-security & Agri', nodes: '1.9k' }
];

const MOCK_STREAM_POSTS = [
  { author: "Prof. Nawangwe", role: "VC Node", text: "New research initiative for Smart Cities launched at CEDAT.", time: "2m", color: "border-emerald-500" },
  { author: "Guild Office", role: "Student Leader", text: "Freedom Square sync event confirmed for 5 PM. #MakerereAt100", time: "5m", color: "border-indigo-500" },
  { author: "Career Hub", role: "Opportunity Node", text: "Airtel Uganda uploaded 15 new graduate trainee slots.", time: "12m", color: "border-amber-500" },
  { author: "Library Node", role: "Official Hub", text: "New 24/7 access protocol for the North Wing enabled.", time: "18m", color: "border-slate-500" },
  { author: "Jane D.", role: "Software Eng Student", text: "Looking for contributors for the Blockchain Protocol project.", time: "1h", color: "border-rose-500" },
  { author: "MIIC HUB", role: "Innovation Node", text: "Incubation cycle for Season 4 startups is now open for logic check.", time: "2h", color: "border-teal-500" },
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeNotif, setActiveNotif] = useState(0);
  const [chatLines, setChatLines] = useState(0);

  const notifs = [
    { title: "Opportunity Sync", body: "New Grant: UGX 10M for Tech Research", icon: <Zap className="text-amber-500"/> },
    { title: "Security Alert", body: "New device handshake detected at COCIS Lab", icon: <ShieldCheck className="text-emerald-500"/> },
    { title: "Social Pulse", body: "45 Nodes just joined 'The Hill Developers'", icon: <Users className="text-indigo-500"/> },
  ];

  const chatHandshake = [
    { from: "Dr. Julianne", text: "Uplink received. Have you pushed the repository?", side: "left" },
    { from: "You", text: "Commit 7a42b synced. Ready for validation.", side: "right" },
    { from: "Dr. Julianne", text: "Validation successful. Outstanding logic.", side: "left" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const notifTimer = setInterval(() => setActiveNotif(prev => (prev + 1) % notifs.length), 4000);
    const chatTimer = setInterval(() => setChatLines(prev => (prev + 1) % 4), 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(notifTimer);
      clearInterval(chatTimer);
    };
  }, []);

  return (
    <div className="bg-[#05080c] text-white min-h-screen overflow-x-hidden selection:bg-[var(--brand-color)] font-sans transition-all duration-500">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.25] grayscale contrast-125 saturate-50">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080c]/60 via-[#05080c]/90 to-[#05080c]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.1]" 
             style={{ backgroundImage: 'linear-gradient(#10918a 1px, transparent 1px), linear-gradient(90deg, #10918a 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/10' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--brand-color)] flex items-center justify-center shadow-[0_0_20px_rgba(16,145,138,0.4)]">
              <Smartphone size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">MakSocial</span>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            {['Nexus', 'Registry', 'Study Vault', 'Manifesto'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-[var(--brand-color)] transition-all">{item}</a>
            ))}
          </div>
          <button onClick={onStart} className="bg-white text-black px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95">Enroll Node</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 lg:pt-64 pb-32 px-6 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-7 space-y-12">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Hill Registry Online</span>
            </div>

            <h1 className="text-7xl md:text-[9rem] font-black leading-[0.8] tracking-tighter uppercase">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-color)] to-emerald-400">NexuS</span> <br />
              Protocol.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 font-medium max-w-xl leading-relaxed">
              The central nervous system for the Hill. Access shared intelligence, synchronize with opportunity nodes, and collaborate across all university sectors.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button onClick={onStart} className="bg-[var(--brand-color)] text-white px-12 py-6 font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(16,145,138,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Initialize <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-12 py-6 border border-white/20 text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-4">
                Audit Registry <Database size={18} />
              </button>
            </div>
          </div>

          {/* DYNAMIC TELEMETRY DISPLAY */}
          <div className="lg:col-span-5 relative h-[600px] hidden lg:block overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
             
             {/* Dynamic Feed Marquee */}
             <div className="absolute inset-0 p-8 space-y-6 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <Activity size={18} className="text-rose-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Global_Signal_Stream</span>
                   </div>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                      <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                      <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                   </div>
                </div>

                <div className="space-y-6 animate-infinite-scroll">
                   {[...MOCK_STREAM_POSTS, ...MOCK_STREAM_POSTS].map((post, i) => (
                     <div key={i} className={`p-6 bg-black/40 border-l-4 ${post.color} backdrop-blur-md rounded-r-xl space-y-3 transition-transform hover:scale-[1.02] shadow-xl`}>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10"></div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-tight leading-none">@{post.author}</p>
                                 <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">{post.role}</p>
                              </div>
                           </div>
                           <span className="text-[8px] font-mono text-white/30 uppercase">{post.time} ago</span>
                        </div>
                        <p className="text-[12px] font-medium leading-relaxed text-white/80">"{post.text}"</p>
                        <div className="flex items-center gap-4 pt-2 opacity-30">
                           <Star size={12}/> <MessageCircle size={12}/> <Share2 size={12}/>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Dynamic Notification Toast */}
             <div className="absolute top-10 right-6 w-72 z-50 animate-in slide-in-from-right-10 duration-700">
                <div key={activeNotif} className="bg-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 transform hover:scale-105 transition-transform duration-300">
                   <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {notifs[activeNotif].icon}
                   </div>
                   <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{notifs[activeNotif].title}</p>
                      <p className="text-[11px] font-black text-slate-900 leading-snug truncate">{notifs[activeNotif].body}</p>
                   </div>
                </div>
             </div>

             {/* Floating Chat Workspace */}
             <div className="absolute bottom-10 left-[-30px] w-80 bg-[#0a0c10] border border-white/10 rounded shadow-2xl z-40 p-5 space-y-4 animate-in slide-in-from-left-10 duration-700">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Secure_Handshake</span>
                   </div>
                   <MoreVertical size={14} className="text-white/20"/>
                </div>
                <div className="space-y-4 h-48 overflow-hidden">
                   {chatHandshake.slice(0, chatLines + 1).map((m, i) => (
                     <div key={i} className={`flex ${m.side === 'right' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] p-3 rounded text-[11px] font-medium leading-relaxed ${m.side === 'right' ? 'bg-[var(--brand-color)] text-white' : 'bg-white/5 text-white/70 border border-white/5'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                   <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--brand-color)] w-1/3 animate-pulse"></div>
                   </div>
                   <span className="text-[8px] font-mono text-white/20">SYNCING...</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* THE TEN COLLEGES: SECTOR STATUS */}
      <section className="py-32 px-6 z-10 relative bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Sector <span className="text-[var(--brand-color)]">Uplink</span> Status</h2>
                 <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] ml-1">Real-time synchronization across all university wings</p>
              </div>
              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Sync</p>
                    <p className="text-2xl font-black uppercase tracking-tighter">98.42%</p>
                 </div>
                 <div className="w-px h-12 bg-white/10"></div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Nodes</p>
                    <p className="text-2xl font-black uppercase tracking-tighter">31.2k</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5 border border-white/5">
              {COLLEGES.map((college, i) => (
                <div key={college.id} className="bg-[#05080c] p-8 space-y-6 hover:bg-white/[0.02] transition-all group relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                         <span className="text-3xl font-black tracking-tighter group-hover:text-[var(--brand-color)] transition-colors">{college.id}</span>
                         <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${i % 3 === 0 ? 'text-emerald-500 bg-emerald-500' : i % 2 === 0 ? 'text-indigo-500 bg-indigo-50' : 'text-rose-500 bg-rose-500'} animate-pulse`}></div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-white/40 uppercase tracking-widest truncate">{college.name}</p>
                         <p className="text-[10px] font-bold uppercase tracking-tighter text-emerald-400">{college.nodes} ACTIVE NODES</p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                         <button className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-all flex items-center gap-2">Enter Sector <ChevronRight size={12}/></button>
                      </div>
                   </div>
                   <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
                      <Database size={100} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE */}
      <section className="py-48 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-48">
          
          {/* Feature 1: Study Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-5 space-y-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">Institutional <br /> Intelligence.</h2>
                <p className="text-xl text-white/50 leading-relaxed font-medium">
                   Access the university's decentralized academic repository. From legacy past papers to active research nodes, the Vault is synchronized daily across all sectors.
                </p>
                <div className="space-y-4">
                   {['Blockchain Verified Material', 'Cross-College Resource Sharing', 'Instant Asset Retrieval'].map(f => (
                     <div key={f} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                     </div>
                   ))}
                </div>
                <button onClick={onStart} className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--brand-color)] border-b border-[var(--brand-color)] pb-2 group hover:gap-8 transition-all">
                   Initialize Vault Scan <ArrowUpRight size={18} />
                </button>
             </div>
             <div className="lg:col-span-7 relative">
                <div className="aspect-video bg-black border border-white/10 rounded overflow-hidden shadow-2xl group">
                   <img src="https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
                      <div className="flex items-center gap-4 mb-4">
                         <BookOpen size={32} className="text-emerald-500" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Accessing: Main_Library_Vault</span>
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">42,500+ Assets Synced</h3>
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 p-8 bg-[#10918a] text-white shadow-2xl rounded hidden lg:block transform hover:rotate-2 transition-transform">
                   <div className="flex items-center gap-6">
                      <FileText size={48} />
                      <div>
                         <p className="text-4xl font-black tracking-tighter">98%</p>
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Uptime Stability</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Feature 2: High Integrity Community */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
             <div className="lg:col-span-7 order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-6 pt-20">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-6 text-center shadow-xl">
                         <ShieldCheck size={48} className="text-emerald-400" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Identities</h4>
                      </div>
                      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-6 text-center shadow-xl">
                         <Target size={48} className="text-rose-500" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Precision Networking</h4>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-6 text-center shadow-xl">
                         <Cpu size={48} className="text-indigo-400" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Matching</h4>
                      </div>
                      <div className="p-10 bg-[var(--brand-color)] rounded-2xl flex flex-col items-center gap-6 text-center shadow-2xl">
                         <Globe size={54} className="text-white animate-spin-slow" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Hill Ecosystem</h4>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-5 space-y-10 order-1 lg:order-2">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">Handshake <br /> Protocols.</h2>
                <p className="text-xl text-white/50 leading-relaxed font-medium">
                   No anonymous noise. Every signal on MakSocial is mapped to a verified student or faculty identity. Establish secure links with peers, lecturers, and industry partners within a trusted stratum.
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <p className="text-3xl font-black tracking-tighter">0%</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Bot Infiltration</p>
                   </div>
                   <div>
                      <p className="text-3xl font-black tracking-tighter">100%</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Academic Integrity</p>
                   </div>
                </div>
                <button onClick={onStart} className="bg-white text-black px-12 py-5 font-black text-xs uppercase tracking-[0.4em] hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95 shadow-2xl">Initialize Secure Link</button>
             </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC CALL TO ACTION */}
      <section className="py-48 px-6 relative z-10 overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-[0.03] scale-125">
           <img src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
           <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] font-black uppercase tracking-[0.5em]">
              <Wifi size={14} className="animate-pulse" /> System_Commit_Ready
           </div>
           <h2 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-none italic">Join the <br /> Registry.</h2>
           <p className="text-xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
             Makerere University's ultimate social and academic stratum is ready for your signal. Synchronize your node today.
           </p>
           <button onClick={onStart} className="w-full sm:w-auto bg-[var(--brand-color)] text-white px-20 py-8 font-black text-sm uppercase tracking-[0.5em] shadow-[0_30px_60px_rgba(16,145,138,0.4)] hover:brightness-110 transition-all active:scale-95">Initialize Profile</button>
        </div>
      </section>

      {/* COMPREHENSIVE WORDY FOOTER */}
      <footer className="pt-32 pb-20 px-6 border-t border-white/5 bg-[#030508] z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
            
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--brand-color)] flex items-center justify-center">
                    <Smartphone size={16} className="text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">MakSocial</span>
               </div>
               <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                  The official digital social stratum and intelligence registry of Makerere University. Designed to facilitate seamless communication, resource sharing, and professional growth within the hill community. Operated by the Mak Dev Group under institutional protocols.
               </p>
               <div className="flex gap-6 opacity-30">
                  <Globe size={18} /> <Terminal size={18} /> <ShieldCheck size={18} /> <Database size={18} />
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Active_Sectors</h3>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/30">
                  {COLLEGES.slice(0, 5).map(c => (
                    <li key={c.id} className="hover:text-[var(--brand-color)] cursor-pointer transition-colors flex items-center gap-3">
                       <GitBranch size={12} className="opacity-40" /> {c.name}
                    </li>
                  ))}
                  <li className="text-[var(--brand-color)] cursor-pointer hover:underline">+ All Other Wings</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Intelligence_Hubs</h3>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/30">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Study Vault Registry</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Career Opportunity Node</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Sector Events Broadcast</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Official News Bulletin</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Innovation Forge</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">System_Governance</h3>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/30">
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Registry Manifesto</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Privacy & Security Stratum</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Node Operational Ethics</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors">Institutional Compliance</li>
                  <li className="hover:text-[var(--brand-color)] cursor-pointer transition-colors flex items-center gap-2">
                     <ShieldAlert size={12} className="text-rose-500" /> Report Protocol Breach
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 Hill Registry System</p>
                <div className="hidden lg:flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                   <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Mainframe_Stable_V5.0</span>
                </div>
             </div>
             <div className="flex gap-10 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                <a href="#" className="hover:text-white transition-colors">API_Access</a>
                <a href="#" className="hover:text-white transition-colors">Developer_Nexus</a>
                <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
             </div>
             <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                Built with <Sparkles size={12} className="text-amber-500" /> for the Hill Community
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
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
