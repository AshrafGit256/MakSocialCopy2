
import React, { useEffect, useState } from "react";
import { 
  ArrowRight, Users, Globe, ShieldCheck, 
  BookOpen, ChevronRight, Activity, Star, 
  Share2, Zap, MessageCircle, MapPin, 
  Bell, Image as ImageIcon, Camera,
  CheckCircle2, Heart, ExternalLink,
  Target, Cpu, Layers, Shield, Mail, 
  Info, Smartphone, Database, Compass,
  Sparkles, GraduationCap, Briefcase,
  Terminal, GitCommit, GitPullRequest, Search,
  Box, Code, Binary,
  /* Fix: Added missing ArrowUpRight icon import */
  ArrowUpRight
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const COLLEGES = [
  { id: 'COCIS', name: 'Computing & IT', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800' },
  { id: 'CEDAT', name: 'Engineering & Art', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800' },
  { id: 'CHUSS', name: 'Humanities & Soc Sci', img: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800' },
  { id: 'CONAS', name: 'Natural Sciences', img: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=800' },
  { id: 'CHS', name: 'Health Sciences', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800' },
  { id: 'CAES', name: 'Agricultural & Env', img: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=800' },
  { id: 'COBAMS', name: 'Business & Mgmt', img: 'https://images.unsplash.com/photo-1454165833767-02a6e30996d4?auto=format&fit=crop&w=800' },
  { id: 'CEES', name: 'Education', img: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800' },
  { id: 'LAW', name: 'School of Law', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800' },
  { id: 'CoVAB', name: 'Veterinary Medicine', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800' }
];

const SIGNALS = [
  { user: "Prof. Nawangwe", role: "Vice Chancellor", text: "Registry sync initialized for the new research strata. Excellence is mandatory.", avatar: "https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg" },
  { user: "Registry.Admin", role: "System Node", text: "New academic assets committed to the Vault. 42k files now live.", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=admin" },
  { user: "Guild.President", role: "Student Leader", text: "Freedom Square meeting at 16:00. Policy handshake required.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guild" },
  { user: "COCIS.Node", role: "Tech Wing", text: "Logic hackathon registration is now open for all final year nodes.", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cocis" }
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [signalIndex, setSignalIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => {
      setSignalIndex((prev) => (prev + 1) % SIGNALS.length);
    }, 5000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#f6f8fa] text-[#1f2328] min-h-screen selection:bg-[var(--brand-color)] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. GITHUB-STYLE NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[400] transition-all duration-300 border-b ${scrolled ? 'py-3 bg-[#ffffff]/90 backdrop-blur-md border-slate-200 shadow-sm' : 'py-5 bg-transparent border-transparent'}`}>
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-[#1f2328] rounded-lg flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                <Users size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase leading-none">MakSocial</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-0.5">Registry v5.2</span>
              </div>
            </div>
            
            <div className="hidden xl:flex items-center gap-8 ml-6">
              {['Repositories', 'Pull Requests', 'Intel Hub', 'The Hill'].map(item => (
                <a key={item} href="#" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1f2328] transition-all">{item}</a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={onStart} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#1f2328] px-4">Portal Log</button>
             <button onClick={onStart} className="bg-[#2da44e] text-white px-6 py-2 rounded-md font-bold text-[11px] uppercase tracking-widest shadow-sm hover:bg-[#2c974b] transition-all active:scale-95 border border-[rgba(31,35,40,0.15)]">Enroll Node</button>
          </div>
        </div>
      </nav>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 lg:px-12 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-7 space-y-10 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#f6f8fa] border border-slate-200 rounded-full animate-in slide-in-from-top-4 duration-700">
              <GitCommit size={14} className="text-[#2da44e]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Registry Online // 2.1k active nodes</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black leading-[0.85] tracking-tighter text-[#1f2328] uppercase">
              The Hill's <br />
              <span className="text-slate-200 italic font-serif lowercase">Intelligence Strata.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Makerere's unified social strata. Synchronize your academic journey, collaborate on project nodes, and access the hill's elite repository.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button onClick={onStart} className="bg-[#1f2328] text-white px-10 py-5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Initialize Login <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-10 py-5 border border-slate-200 bg-[#f6f8fa] text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-4 shadow-sm">
                Explore Repos <Database size={18} />
              </button>
            </div>
          </div>

          {/* INNOVATIVE SEQUENTIAL SIGNAL FEED */}
          <div className="lg:col-span-5 h-[500px] relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[#f6f8fa] rounded-[3rem] border-2 border-dashed border-slate-200 animate-pulse-slow"></div>
             
             <div className="relative w-full px-10">
                {SIGNALS.map((signal, i) => (
                  <div 
                    key={i} 
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${
                      signalIndex === i ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
                    }`}
                  >
                    <div className="w-full bg-white border border-slate-200 p-8 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] space-y-6">
                       <div className="flex items-center gap-4">
                          <img src={signal.avatar} className="w-14 h-14 rounded-2xl border border-slate-100 object-cover shadow-sm" />
                          <div>
                             <h4 className="text-sm font-black uppercase text-[#1f2328] tracking-tight">{signal.user}</h4>
                             <p className="text-[9px] font-bold text-[#2da44e] uppercase tracking-[0.2em]">{signal.role}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-2 px-2 py-1 bg-rose-50 text-rose-500 rounded-lg text-[8px] font-black uppercase">
                             <Activity size={10} className="animate-pulse" /> Live Signal
                          </div>
                       </div>
                       <p className="text-[15px] font-medium leading-relaxed text-slate-600 italic">"{signal.text}"</p>
                       <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <Star size={14} className="text-amber-500"/> Validated
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <MessageCircle size={14} className="text-blue-500"/> Commits
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* DECORATIVE TERMINAL ELEMENTS */}
             <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-300 uppercase tracking-[0.4em]">Node_Stream_v5.2</div>
             <div className="absolute bottom-4 right-10 flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${signalIndex === i ? 'bg-[#2da44e] w-4' : 'bg-slate-200'}`}></div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. RESTORED IMAGE MOSAIC GALLERY */}
      <section className="py-32 px-6 lg:px-12 bg-[#f6f8fa] border-y border-slate-200 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                   <Camera size={24}/>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Visual_Manifest</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-[#1f2328] tracking-tighter uppercase leading-none">Moments from <br /> <span className="text-slate-300">The Hill.</span></h2>
             </div>
             <div className="flex gap-4">
                <button onClick={onStart} className="px-8 py-3 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Global Feed</button>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-[200px]">
             {[
               "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg",
               "https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg",
               "https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg",
               "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg",
               "https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png",
               "https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg",
               "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw",
               "https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg",
               "https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg",
               "https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg"
             ].map((url, i) => (
               <div key={i} className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-2xl z-10 ${i % 3 === 0 ? 'md:row-span-2' : ''} ${i % 4 === 0 ? 'md:col-span-2' : ''}`}>
                  <img src={url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="p-3 bg-white rounded-full shadow-2xl"><ImageIcon size={20} className="text-[#1f2328]" /></div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. THE COLLEGE HUB GRID (Visual-Rich) */}
      <section className="py-40 px-6 lg:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
           <div className="max-w-4xl mb-32 space-y-8">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1f2328] uppercase leading-[0.85]">Ten Wings. <br /> <span className="text-slate-200">One Network.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">Connect with the official nodes of your faculty. Every college is synchronized into the central intelligence strata.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {COLLEGES.map((college, i) => (
                <div key={college.id} className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-200 bg-[#f6f8fa] hover:border-[#1f2328] hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-end p-8">
                   <div className="absolute inset-0 overflow-hidden">
                      <img src={college.img} className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   
                   <div className="relative z-10 transition-all transform group-hover:-translate-y-2 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20">
                            <span className="text-2xl font-black tracking-tighter text-[#1f2328] group-hover:text-white transition-colors">{college.id}</span>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-[#2da44e] animate-pulse"></div>
                      </div>
                      <p className="text-sm font-black text-slate-400 group-hover:text-white uppercase tracking-tight leading-tight">{college.name}</p>
                      <button className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1f2328] group-hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2">Initialize Sync <ChevronRight size={12}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. STUDY VAULT FEATURE (BENTO STYLE) */}
      <section className="py-48 px-6 lg:px-12 bg-[#f6f8fa] border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-12 space-y-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="p-4 bg-[#f6f8fa] rounded-2xl w-fit"><ShieldCheck size={32} className="text-[#2da44e]" /></div>
                 <h3 className="text-4xl font-black uppercase tracking-tighter italic">The Vault.</h3>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">42,000+ academic assets committed to the global strata. Notes, past papers, and research logs.</p>
              </div>
              <button onClick={onStart} className="w-full py-5 bg-[#1f2328] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">Open Repository</button>
           </div>

           <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-[#1f2328] rounded-[2.5rem] p-12 text-white flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Zap size={200} fill="currentColor" /></div>
                 <div className="space-y-6 relative z-10">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">Accelerator</span>
                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Global Sync <br /> Opportunities</h3>
                    <p className="text-white/60 font-medium">Direct linkage to international internships and project grants.</p>
                 </div>
                 {/* Fix: ArrowUpRight icon was missing in imports */}
                 <button onClick={onStart} className="w-fit mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#2da44e] transition-colors relative z-10">Sync Signals <ArrowUpRight size={14}/></button>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 flex flex-col justify-between shadow-sm group overflow-hidden">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                       <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node_Health: Stable</span>
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-[#1f2328]">Pulse Hub</h3>
                    <p className="text-slate-400 font-medium">Real-time student interaction across all campus sectors. Broadcast signals, share logic.</p>
                 </div>
                 <div className="flex items-center gap-4 pt-10 border-t border-slate-50 mt-10">
                    <div className="flex -space-x-3">
                       {[...Array(4)].map((_, i) => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Join 18.4k nodes</span>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="pt-40 pb-20 px-6 lg:px-12 bg-white border-t border-slate-200">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-40">
            
            <div className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1f2328] rounded-2xl flex items-center justify-center shadow-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <span className="text-3xl font-black tracking-tighter uppercase text-[#1f2328]">MakSocial</span>
               </div>
               <p className="text-[16px] text-slate-400 leading-loose font-medium max-w-sm">
                  The definitive digital stratum for the Makerere University ecosystem. Engineered for excellence, built for community.
               </p>
               <div className="flex gap-10 text-slate-300">
                  <Globe size={24} className="hover:text-[#1f2328] transition-colors cursor-pointer" /> 
                  <Target size={24} className="hover:text-[#1f2328] transition-colors cursor-pointer" /> 
                  <ShieldCheck size={24} className="hover:text-[#1f2328] transition-colors cursor-pointer" /> 
                  <Database size={24} className="hover:text-[#1f2328] transition-colors cursor-pointer" />
               </div>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#1f2328] border-b border-slate-100 pb-8">Registry Hubs</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {COLLEGES.slice(0, 6).map(c => (
                    <li key={c.id} className="hover:text-[#2da44e] cursor-pointer transition-colors flex items-center gap-4">
                       <ChevronRight size={12} className="text-slate-200" /> {c.name}
                    </li>
                  ))}
                  <li className="text-[#2da44e] font-black cursor-pointer hover:underline pt-4">+ All Hub Manifests</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#1f2328] border-b border-slate-100 pb-8">Portal Services</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Study Vault Protocol</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Career Sync Engine</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Digital Identity Registry</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Live Pulse Streams</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Community Governance</li>
               </ul>
            </div>

            <div className="space-y-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#1f2328] border-b border-slate-100 pb-8">System Compliance</h3>
               <ul className="space-y-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Community Manifesto</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Privacy Stratum</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Terms of Handshake</li>
                  <li className="hover:text-[#1f2328] cursor-pointer transition-colors">Developer Uplinks</li>
                  <li className="flex items-center gap-4 text-rose-500 cursor-pointer font-black pt-4">
                     <Info size={18}/> Report Signal Breach
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-20 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-12">
             <div className="flex flex-col lg:flex-row items-center gap-12">
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">© 2026 MakSocial Registry Core | Optimized for Hill Strata</p>
                <div className="hidden xl:flex items-center gap-6">
                   <div className="w-2 h-2 bg-[#2da44e] rounded-full animate-pulse shadow-[0_0_10px_#2da44e]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol_Stable_v5.2.0</span>
                </div>
             </div>
             <div className="flex gap-16 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-[#1f2328] transition-colors">Nodes</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Archive</a>
                <a href="#" className="hover:text-[#1f2328] transition-colors">Support</a>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Landing;
