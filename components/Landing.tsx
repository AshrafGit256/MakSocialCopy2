import React from "react";
import { 
  ArrowRight, Zap, Globe, Users, ShieldCheck, 
  Radio, Search, BookOpen, Terminal, Code,
  Activity, Database, Box, Cpu, Star, 
  ExternalLink, ChevronRight, Check, Hash,
  FileText, Download, TrendingUp, GitBranch,
  Lock, MessageSquare, Briefcase, GraduationCap
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

      {/* 2. HERO: THE PITCH */}
      <header className="pt-40 pb-20 px-6 border-b border-[#30363d] bg-grid-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1117]"></div>
        <div className="max-w-[1200px] mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1 bg-[#161b22] border border-[#30363d] rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8b949e]">Uplink: Live Connection to 50k+ Student Nodes</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-[0.85]">
            Everything inside <br />
            <span className="text-[#64748b]">The Registry.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8b949e] font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
            The Definitive Resource Hub, Signal Feed, and Opportunity Matrix for the University strata.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             <button onClick={onStart} className="px-12 py-5 bg-[#64748b] text-white rounded font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#475569] active:scale-95 transition-all">Start Synchronization</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-20 space-y-32 pb-40">
        
        {/* SECTION A: THE SIGNAL PULSE (LATEST POSTS) */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-[#64748b] pl-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.5em]">Module_01</h2>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">The Signal Pulse</h3>
              <p className="text-[#8b949e] font-bold uppercase text-xs tracking-widest">Real-time student broadcasts and research signals</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-6 py-2 rounded hover:border-[#64748b] transition-all">View Global Feed</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { author: 'MakUnipod', role: 'Innovation Wing', content: 'Prototyping Grant Alpha is now open. We are funding 5 hardware nodes this semester. CEDAT students apply now.', likes: '1.2k', tags: ['#Innovation', '#CEDAT'] },
              { author: 'Sarah C.', role: 'Computer Science', content: 'Seeking 2 nodes with React/Node.js credentials for a Fintech project. High intensity build starting Monday.', likes: '458', tags: ['#Dev', '#COCIS'] },
              { author: 'Guild89', role: 'Official', content: 'Official Protocol: General Assembly at Freedom Square tomorrow @ 10:00. Mandatory sync for all student nodes.', likes: '5.6k', tags: ['#Assembly', '#Official'] },
            ].map((post, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded p-6 space-y-6 hover:border-[#64748b] transition-all shadow-xl group">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${post.author}`} className="w-8 h-8 rounded bg-white border border-[#30363d]" />
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{post.author}</h4>
                    <p className="text-[8px] font-black text-[#64748b] uppercase tracking-widest">{post.role}</p>
                  </div>
                  <span className="ml-auto text-[8px] font-mono text-[#8b949e]">SHA_{Math.random().toString(16).slice(2,8).toUpperCase()}</span>
                </div>
                <p className="text-sm font-bold text-[#c9d1d9] leading-relaxed uppercase tracking-tight line-clamp-3">
                  "{post.content}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-[#30363d]">
                   <div className="flex items-center gap-1.5 text-[#8b949e]">
                      <Star size={12} className="group-hover:text-amber-500 transition-colors" />
                      <span className="text-[10px] font-black">{post.likes}</span>
                   </div>
                   {post.tags.map(tag => (
                     <span key={tag} className="text-[8px] font-black text-[#64748b] uppercase tracking-widest">{tag}</span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION B: BIDS & OPPORTUNITIES (SCREENSHOT SHOWCASE) */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-amber-600 pl-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.5em]">Module_02</h2>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Bids & Opportunities</h3>
              <p className="text-[#8b949e] font-bold uppercase text-xs tracking-widest">Gigs, Internships, and Research Grants</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-6 py-2 rounded hover:border-amber-600 transition-all">Search Manifest</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Styled Screenshot 1 */}
             <div className="relative group overflow-hidden rounded border border-[#30363d] bg-[#161b22] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200" 
                  className="w-full h-[400px] object-cover grayscale brightness-50 group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                   <div className="flex gap-2">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">High Intensity Gig</span>
                      <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/20">COCIS Hub</span>
                   </div>
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">AI Training Node Recruitment</h4>
                   <p className="text-sm font-bold text-[#8b949e] uppercase tracking-tight">Requirement: Python Strata 4+ / Computer Vision Logic</p>
                   <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Compensation</p>
                         <p className="text-lg font-black text-white uppercase tracking-tight">UGX 1.2M / Project</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Deadline</p>
                         <p className="text-lg font-black text-white uppercase tracking-tight">24H_REMAINING</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Styled Screenshot 2 */}
             <div className="relative group overflow-hidden rounded border border-[#30363d] bg-[#161b22] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200" 
                  className="w-full h-[400px] object-cover grayscale brightness-50 group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                   <div className="flex gap-2">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest">Official Internship</span>
                      <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/20">CEDAT Wing</span>
                   </div>
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Smart Grid Research Lead</h4>
                   <p className="text-sm font-bold text-[#8b949e] uppercase tracking-tight">In collaboration with the innovation center alpha node.</p>
                   <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Certification</p>
                         <p className="text-lg font-black text-white uppercase tracking-tight">Protocol Verified</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Vacancies</p>
                         <p className="text-lg font-black text-white uppercase tracking-tight">04 NODES</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* SECTION C: THE ACADEMIC VAULT (FILE LOGS) */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-l-4 border-emerald-600 pl-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em]">Module_03</h2>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">The Vault Manifest</h3>
              <p className="text-[#8b949e] font-bold uppercase text-xs tracking-widest">Decrypted academic assets and research repository</p>
            </div>
            <button onClick={onStart} className="text-[10px] font-black text-white uppercase tracking-widest bg-[#161b22] border border-[#30363d] px-6 py-2 rounded hover:border-emerald-600 transition-all">Explore Archives</button>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden shadow-2xl">
             <div className="px-6 py-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Database size={16} className="text-[#64748b]" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Current_Upload_Sequence</span>
                </div>
                <div className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#0d1117] border-b border-[#30363d] text-[9px] font-black text-[#8b949e] uppercase tracking-widest">
                      <tr>
                         <th className="px-8 py-4">Asset.Identifier</th>
                         <th className="px-8 py-4">Strata.Sector</th>
                         <th className="px-8 py-4">Node.Source</th>
                         <th className="px-8 py-4 text-right">Decryption</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#30363d]">
                      {[
                        { name: 'Distributed_Systems_P4.pdf', hub: 'COCIS', author: 'Dr. John', type: 'Past Paper' },
                        { name: 'Blockchain_Logic_v2.docx', hub: 'CEDAT', author: 'Asset Hub', type: 'Research' },
                        { name: 'Guild_Constitution_Revised.pdf', hub: 'LAW', author: 'Registry', type: 'Official' },
                        { name: 'Neural_Network_Basics.pptx', hub: 'COCIS', author: 'Sarah M.', type: 'Notes' },
                      ].map((asset, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-5 flex items-center gap-4">
                              <FileText size={18} className="text-[#64748b] group-hover:text-emerald-500 transition-colors" />
                              <span className="text-xs font-black text-white uppercase tracking-tight">{asset.name}</span>
                           </td>
                           <td className="px-8 py-5">
                              <span className="px-2 py-0.5 border border-[#30363d] rounded text-[8px] font-black text-[#8b949e] uppercase tracking-widest">{asset.hub} HUB</span>
                           </td>
                           <td className="px-8 py-5">
                              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{asset.author}</span>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Download_Uplink</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="p-8 bg-[#0d1117] border-t border-[#30363d] text-center">
                <p className="text-[10px] font-black text-[#8b949e] uppercase tracking-[0.4em]">Decrypted 108,492 scholarly assets successfully</p>
             </div>
          </div>
        </section>

        {/* SECTION D: INTERACTIVE ELEMENTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded space-y-6 group hover:border-[#64748b] transition-all">
              <div className="w-12 h-12 bg-[#64748b]/10 rounded flex items-center justify-center text-[#64748b] group-hover:scale-110 transition-transform">
                 <MessageSquare size={24} />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Direct Node Sync</h4>
              <p className="text-sm font-bold text-[#8b949e] leading-relaxed uppercase tracking-tight">Encrypted messaging for high-intensity research collaboration.</p>
              <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Protocol.V2_STABLE</span>
           </div>

           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded space-y-6 group hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                 <Zap size={24} />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">AI Node Scan</h4>
              <p className="text-sm font-bold text-[#8b949e] leading-relaxed uppercase tracking-tight">Automated opportunity matching based on your node's skill strata.</p>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Intelligence.ONLINE</span>
           </div>

           <div className="p-10 bg-[#161b22] border border-[#30363d] rounded space-y-6 group hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                 <Globe size={24} />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Wing Hubs</h4>
              <p className="text-sm font-bold text-[#8b949e] leading-relaxed uppercase tracking-tight">Dedicated infrastructure for all 9 university wings on the hill.</p>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">STRATA.GLOBAL</span>
           </div>
        </section>

      </main>

      {/* 3. TACTICAL FOOTER */}
      <footer className="py-32 px-6 border-t border-[#30363d] bg-[#010409]">
        <div className="max-w-[1440px] mx-auto text-center space-y-16">
           <div className="space-y-6">
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none animate-pulse">Confirm <br /> Uplink?</h2>
              <p className="text-xl text-[#8b949e] font-black uppercase tracking-tight max-w-2xl mx-auto">Join the campus intelligence network today.</p>
           </div>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={onStart} className="px-16 py-6 bg-white text-black rounded font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-[#c9d1d9] active:scale-95 transition-all">Create Node Identity</button>
           </div>
           <div className="pt-20 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-[#30363d]/30">
              <div className="flex items-center gap-3">
                 <Terminal size={18} className="text-[#64748b]" />
                 <span className="text-lg font-black tracking-tighter uppercase text-white">MakSocial</span>
              </div>
              <p className="text-[9px] font-black text-[#484f58] uppercase tracking-[0.4em]">© 2026 Registry Protocol. Verified Hill Infrastructure.</p>
           </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;