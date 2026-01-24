
import React from "react";
import { 
  ArrowRight, Zap, Globe, Users, ShieldCheck, 
  Radio, Search, BookOpen, Terminal, Code,
  Activity, Database, Box, Cpu, Star, 
  ExternalLink, ChevronRight, Check, Hash,
  FileText, Download, TrendingUp, GitBranch,
  Lock, MessageSquare, Briefcase, GraduationCap,
  Share2, Filter, LayoutGrid, Eye, Clock, Shield,
  // Fix: Adding missing imports for Heart and MessageCircle
  Heart, MessageCircle
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen font-sans selection:bg-[#64748b]/30">
      
      {/* 1. MINIMALIST NAV - PROMPTS.CHAT STYLE */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-1.5 bg-[#161b22] border border-[#30363d] rounded text-[#64748b]">
              <Terminal size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase text-white leading-none">MakSocial</span>
              <span className="text-[8px] font-black uppercase text-[#64748b] tracking-[0.4em]">Registry Protocol</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={onStart} className="hidden md:block text-[10px] font-black uppercase tracking-widest text-[#8b949e] hover:text-white transition-colors">Documentation</button>
             <button
               onClick={onStart}
               className="bg-white text-black px-6 py-2.5 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#c9d1d9] transition-all active:scale-95 shadow-xl"
             >
               Initialize Node
             </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE CENTRAL PITCH */}
      <header className="pt-48 pb-20 px-6 border-b border-[#30363d] bg-grid-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1117]"></div>
        
        {/* Ambient background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#64748b]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#161b22] border border-[#30363d] rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8b949e]">Status: Synchronized with 50,000+ Active Nodes</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase text-white leading-[0.8] animate-in slide-in-from-bottom-8 duration-700">
            The Complete <br />
            <span className="text-[#64748b]">Campus Registry.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-[#8b949e] font-bold max-w-3xl mx-auto leading-relaxed uppercase tracking-tight opacity-80">
            Stop guessing. Start synchronizing. Access the definitive collection of research, opportunities, and student intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
             <button onClick={onStart} className="w-full sm:w-auto px-16 py-6 bg-[#64748b] text-white rounded font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-[#475569] active:scale-95 transition-all flex items-center justify-center gap-3 group">
               Establish Uplink <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <div className="flex items-center gap-3 px-6 py-4 bg-[#161b22] border border-[#30363d] rounded-2xl">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <img key={i} src={`https://api.dicebear.com/7.x/identicon/svg?seed=${i}node`} className="w-8 h-8 rounded-full border-2 border-[#0d1117] bg-[#161b22]" />
                   ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Joined by 4.2k+ nodes this week</span>
             </div>
          </div>
        </div>
      </header>

      {/* 3. THE LIVE CATALOG (PROMPTS.CHAT STYLE) */}
      <main className="max-w-[1440px] mx-auto px-6 py-24 space-y-40 pb-60">
        
        {/* MODULE 1: THE SIGNAL PULSE (REAL POST PREVIEWS) */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-8 border-[#64748b] pl-10">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.5em]">Module_01</h2>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter">The Signal Pulse</h3>
              <p className="text-[#8b949e] font-bold uppercase text-sm tracking-[0.2em]">Real-time broadcasts from official wings and student nodes</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-8 py-3 rounded-xl hover:border-[#64748b] transition-all flex items-center gap-2">
              Explore Live Feed <ExternalLink size={14}/>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                author: 'MakUnipod', 
                role: 'Innovation Hub', 
                content: '<h1>Alpha Grant Activated</h1><p>We are funding 5 hardware prototyping projects this semester. CEDAT nodes priority.</p>', 
                likes: '1.2k', 
                comments: '45',
                tag: 'Official'
              },
              { 
                author: 'Sarah.CS', 
                role: 'Year 3 COCIS', 
                content: '<blockquote>Seeking a DevOps node</blockquote><p>Building a high-intensity Fintech bridge. React/Node/AWS credentials required.</p>', 
                likes: '856', 
                comments: '12',
                tag: 'Gig'
              },
              { 
                author: 'Guild_Admin', 
                role: 'Guild Secretariat', 
                content: '<h3>General Assembly Protocol</h3><p>Freedom Square / Friday 10:00. Mandatory node sync for all representatives.</p>', 
                likes: '4.5k', 
                comments: '210',
                tag: 'Urgent'
              },
            ].map((post, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 hover:border-[#64748b] hover:shadow-2xl hover:translate-y-[-4px] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-1 bg-white rounded-lg">
                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${post.author}`} className="w-10 h-10 object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{post.author}</h4>
                    <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">{post.role}</p>
                  </div>
                  <div className="ml-auto text-[8px] font-mono text-slate-500">COMMIT_{Math.random().toString(16).slice(2,8).toUpperCase()}</div>
                </div>
                <div 
                  className="text-sm font-bold text-[#c9d1d9] leading-relaxed uppercase tracking-tight line-clamp-4 preview-rich-text"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex items-center justify-between pt-6 border-t border-[#30363d]">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#8b949e] group-hover:text-rose-500 transition-colors">
                        <Heart size={14} /> <span className="text-[10px] font-black">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8b949e] group-hover:text-indigo-500 transition-colors">
                        <MessageCircle size={14} /> <span className="text-[10px] font-black">{post.comments}</span>
                      </div>
                   </div>
                   <span className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-[8px] font-black uppercase text-[#64748b] tracking-widest">{post.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODULE 2: BIDS & OPPORTUNITIES (SCREENSHOT PREVIEW) */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-8 border-orange-600 pl-10">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em]">Module_02</h2>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Opportunities Matrix</h3>
              <p className="text-[#8b949e] font-bold uppercase text-sm tracking-[0.2em]">Validated Gigs, Internships, and Academic Scholarships</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-8 py-3 rounded-xl hover:border-orange-600 transition-all">Search Manifest</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* Styled Opportunity Card 1 */}
             <div className="relative group overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-2xl h-[550px]">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200" 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent"></div>
                <div className="absolute top-8 left-8 flex gap-3">
                   <div className="px-4 py-2 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">High Intensity Gig</div>
                   <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">COCIS Wing</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6">
                   <div className="space-y-2">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Neural Network Data Trainer</h4>
                      <p className="text-sm font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Required: Python Strata 4 / Deep Learning Logic / 10h Week</p>
                   </div>
                   <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                      <div>
                         <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">Decryption Benefit</p>
                         <p className="text-2xl font-black text-white">UGX 1.5M / MONTH</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1">Registry Deadline</p>
                         <p className="text-2xl font-black text-white uppercase">48H REMAINING</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Styled Opportunity Card 2 */}
             <div className="relative group overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-2xl h-[550px]">
                <img 
                  src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200" 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent"></div>
                <div className="absolute top-8 left-8 flex gap-3">
                   <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Official Internship</div>
                   <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">CEDAT Hub</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6">
                   <div className="space-y-2">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Smart Grid Research Lead</h4>
                      <p className="text-sm font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Collaborate with the Innovation Centre Alpha Node on urban power sync.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                      <div>
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Certification</p>
                         <p className="text-2xl font-black text-white uppercase">PROTOCOL VERIFIED</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Node Openings</p>
                         <p className="text-2xl font-black text-white">04 VACANCIES</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* MODULE 3: THE VAULT MANIFEST (TABLE PREVIEW) */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-8 border-emerald-500 pl-10">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Module_03</h2>
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter">The Vault Manifest</h3>
              <p className="text-[#8b949e] font-bold uppercase text-sm tracking-[0.2em]">Decrypted academic repository of papers, theses, and technical assets</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-8 py-3 rounded-xl hover:border-emerald-500 transition-all flex items-center gap-2">
               Open Repository <Database size={14}/>
            </button>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-[2rem] overflow-hidden shadow-2xl">
             <div className="px-8 py-6 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Database size={18} className="text-[#64748b]" />
                   <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Live_Asset_Transmission_Log</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-rose-500/40"></div>
                   <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0d1117] border-b border-[#30363d] text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                      <tr>
                         <th className="px-10 py-5">Asset.Identifier</th>
                         <th className="px-10 py-5">Wing.Sector</th>
                         <th className="px-10 py-5">Node.Author</th>
                         <th className="px-10 py-5">Stratum</th>
                         <th className="px-10 py-5 text-right">Decryption</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#30363d]">
                      {[
                        { name: 'Distributed_Systems_P4.pdf', hub: 'COCIS', author: 'Dr. John', type: 'Year 4' },
                        { name: 'Smart_Contract_Logic_v2.docx', hub: 'CEDAT', author: 'Innovate_Lab', type: 'Research' },
                        { name: 'Legal_Brief_Article_45.pdf', hub: 'LAW', author: 'Sarah.M', type: 'Finalist' },
                        { name: 'Neural_Flow_Sequence.pptx', hub: 'COCIS', author: 'AI_Lab', type: 'Masters' },
                        { name: 'Micro_Grid_Telemetry.zip', hub: 'CEDAT', author: 'Asset_Registry', type: 'Technical' },
                        { name: 'Global_Health_Pulse.pdf', hub: 'CHS', author: 'Dr. Nalule', type: 'Public' },
                      ].map((asset, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <FileText size={20} className="text-[#64748b] group-hover:text-emerald-500 transition-colors" />
                                 <span className="text-xs font-black text-white uppercase tracking-widest">{asset.name}</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <span className="px-3 py-1 border border-[#30363d] rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">{asset.hub} WING</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-xs font-bold text-[#64748b] uppercase tracking-tight">{asset.author}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{asset.type}</span>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:underline flex items-center gap-2 ml-auto group/btn">
                                 SYNC_UPLINK <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             <div className="p-10 bg-[#0d1117] border-t border-[#30363d] text-center">
                <div className="flex flex-col items-center gap-4">
                   <p className="text-[11px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Decrypted 108,492 scholarly assets successfully verified</p>
                   <div className="flex gap-2">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i < 15 ? 'bg-emerald-500/40' : 'bg-[#30363d]'}`}></div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* MODULE 4: OTHER APP INFRASTRUCTURE */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded-[2rem] space-y-8 hover:border-[#64748b] transition-all group shadow-xl">
              <div className="w-14 h-14 bg-[#64748b]/10 rounded-2xl flex items-center justify-center text-[#64748b] group-hover:scale-110 transition-transform shadow-inner">
                 <Users size={28} />
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Node Discovery</h4>
                 <p className="text-xs font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Browse student profiles verified by their academic wing and skill strata.</p>
              </div>
              <span className="inline-block text-[9px] font-black text-[#64748b] uppercase tracking-widest">Protocol.V2_STABLE</span>
           </div>

           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded-[2rem] space-y-8 hover:border-indigo-600 transition-all group shadow-xl">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-inner">
                 <Zap size={28} />
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">AI Node Scan</h4>
                 <p className="text-xs font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Automated matching algorithm identifies opportunities based on your data strands.</p>
              </div>
              <span className="inline-block text-[9px] font-black text-indigo-600 uppercase tracking-widest">Neural.ACTIVE</span>
           </div>

           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded-[2rem] space-y-8 hover:border-emerald-500 transition-all group shadow-xl">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-inner">
                 <MessageSquare size={28} />
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Forge Sync</h4>
                 <p className="text-xs font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Encrypted direct messaging for high-intensity research and collaboration nodes.</p>
              </div>
              <span className="inline-block text-[9px] font-black text-emerald-500 uppercase tracking-widest">Encryption.STABLE</span>
           </div>

           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded-[2rem] space-y-8 hover:border-rose-500 transition-all group shadow-xl">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform shadow-inner">
                 <Shield size={28} />
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Guard</h4>
                 <p className="text-xs font-bold text-[#8b949e] uppercase tracking-widest leading-relaxed">Secure credentials verified by institutional auth protocols for total trust.</p>
              </div>
              <span className="inline-block text-[9px] font-black text-rose-500 uppercase tracking-widest">Sec.PROTOCOL_V4</span>
           </div>
        </section>

      </main>

      {/* 4. FINAL CALL TO ACTION */}
      <footer className="py-40 px-6 border-t border-[#30363d] bg-[#010409] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-[1440px] mx-auto text-center space-y-20 relative z-10">
           <div className="space-y-8">
              <h2 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] animate-pulse">
                Uplink <br />
                Required.
              </h2>
              <p className="text-xl md:text-3xl text-[#8b949e] font-black uppercase tracking-tight max-w-3xl mx-auto leading-tight">
                Don't be a disconnected node. Join the definitive intelligence matrix for university excellence.
              </p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button onClick={onStart} className="px-20 py-8 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-[0.4em] shadow-2xl hover:bg-[#c9d1d9] active:scale-95 transition-all">Create Node Identity</button>
              <button className="text-xs font-black uppercase tracking-widest text-[#8b949e] hover:text-white flex items-center gap-3 transition-colors">
                Read Registry Whitepaper <ExternalLink size={18} />
              </button>
           </div>

           <div className="pt-32 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-[#30363d]/40">
              <div className="flex items-center gap-4">
                 <div className="p-2 bg-[#161b22] border border-[#30363d] rounded text-[#64748b]">
                    <Terminal size={24} />
                 </div>
                 <span className="text-2xl font-black tracking-tighter uppercase text-white">MakSocial</span>
              </div>
              
              <div className="flex gap-10">
                 <a href="#" className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Protocol Status</a>
                 <a href="#" className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Wing Map</a>
                 <a href="#" className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Audit logs</a>
              </div>

              <p className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.4em]">
                © 2026 MakSocial Registry Protocol. Built for the hill.
              </p>
           </div>
        </div>
      </footer>

      <style>{`
        .preview-rich-text h1, .preview-rich-text h2, .preview-rich-text h3 {
          font-weight: 900;
          color: white;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .preview-rich-text blockquote {
          border-left: 4px solid #64748b;
          padding-left: 1rem;
          color: #8b949e;
          margin: 1rem 0;
        }
        .preview-rich-text p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Landing;
