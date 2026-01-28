
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Post } from '../types';
import { AuthoritySeal } from './Feed'; 
import { 
  MapPin, ArrowLeft, Globe, Zap, Radio, Share2, Database, 
  Terminal, Award, Trophy, Bookmark, Mail, Link as LinkIcon, 
  Calendar, GitCommit, Star, MessageCircle, Box, 
  Sparkles, Cpu, Loader2, ShieldCheck, Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SHA_GEN = () => Math.random().toString(16).substring(2, 8).toUpperCase();

const Profile: React.FC<{ userId?: string, onNavigateBack?: () => void, onNavigateToProfile?: (id: string) => void, onMessageUser?: (id: string) => void }> = ({ userId, onNavigateBack, onNavigateToProfile, onMessageUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'bookmarks' | 'achievements'>('signals');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [intelligenceBrief, setIntelligenceBrief] = useState<string | null>(null);
  
  const currentUser = db.getUser();
  const isOwnProfile = !userId || userId === currentUser.id;

  useEffect(() => {
    const targetId = userId || currentUser.id;
    const profileUser = db.getUsers().find(u => u.id === targetId) || (isOwnProfile ? currentUser : null);
    
    if (profileUser) {
      setUser(profileUser);
      const allPosts = db.getPosts();
      
      if (activeTab === 'signals') {
        setDisplayedPosts(allPosts.filter(p => p.authorId === targetId));
      } else if (activeTab === 'bookmarks') {
        const bookmarks = db.getBookmarks();
        setDisplayedPosts(allPosts.filter(p => bookmarks.includes(p.id)));
      } else {
        setDisplayedPosts([]);
      }
    }
  }, [userId, currentUser.id, isOwnProfile, activeTab]);

  const handleNeuralPersonaScan = async () => {
    if (!user) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a Strategic Persona Scan for this university node:
      Name: ${user.name}
      Role: ${user.role}
      Hub: ${user.college}
      Status: ${user.status}
      Bio: ${user.bio}
      Connections: ${user.connections}
      
      Generate a professional "Registry Intelligence Brief" (max 80 words). Use a technical, cybernetic tone. Focus on their academic 'DNA' and their value to the ${user.college} wing. Format it as a tactical report with a SHA-256 integrity signature at the end.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setIntelligenceBrief(response.text);
    } catch (e) {
      console.error(e);
      setIntelligenceBrief("NEURAL_SCAN_FAILURE: Signal interference detected. Re-initialize sequence.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-screen font-mono text-slate-400 uppercase tracking-[0.5em] animate-pulse">
       Target_Node_Nullified
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto pb-40 font-mono text-[var(--text-primary)] relative">
      
      {/* 1. Profile Dashboard Header */}
      <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-white/80 dark:bg-black/80 sticky top-0 z-[100] backdrop-blur-md">
         <div className="flex items-center gap-6">
            <button onClick={onNavigateBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-all text-slate-500"><ArrowLeft size={20}/></button>
            <div className="flex flex-col">
               <h2 className="text-[14px] font-black uppercase italic tracking-tighter leading-none">{user.name.toLowerCase()}</h2>
               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                  <Activity size={10} className="animate-pulse" /> Registry_Status: STABLE_NODE
               </span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 rounded-nexus">
               <Share2 size={12}/> Broadcast_Identity
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 2. Left Identity Column */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[60px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700"></div>
                <img src={user.avatar} className="w-full aspect-square rounded-full border-4 border-[var(--border-color)] bg-white object-cover shadow-2xl relative z-10 grayscale-[20%] group-hover:grayscale-0 transition-all" />
                <div className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-900 rounded-full border border-[var(--border-color)] shadow-2xl z-20">
                   <AuthoritySeal role="Official" size={28} />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-tight glow-text">{user.name}</h1>
                <div className="flex items-center gap-3">
                   <p className="text-lg text-slate-400 font-bold tracking-tight">@{user.name.toLowerCase().replace(/\s/g, '')}</p>
                   <span className="px-2 py-0.5 bg-indigo-600/10 text-indigo-600 rounded text-[8px] font-black uppercase tracking-widest border border-indigo-600/20">Verified_DNA</span>
                </div>
              </div>

              {/* AI Strategic Assessment Panel */}
              <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-nexus space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={80} />
                 </div>
                 <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
                       <Sparkles size={14}/> Neural_Assessment
                    </h4>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Model: G-3-FLASH</span>
                 </div>
                 
                 {intelligenceBrief ? (
                   <div className="space-y-4 animate-in slide-in-from-bottom-2">
                      <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                         "{intelligenceBrief}"
                      </p>
                      <button onClick={() => setIntelligenceBrief(null)} className="text-[8px] font-black text-indigo-500 uppercase underline">Re-Scan Node</button>
                   </div>
                 ) : (
                   <div className="text-center space-y-4">
                      <p className="text-[10px] text-slate-500 font-medium italic">"Initiate persona scan to calculate node's strategic value in the Hill registry."</p>
                      <button 
                        onClick={handleNeuralPersonaScan}
                        disabled={isAnalyzing}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-nexus font-black text-[9px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                      >
                         {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14}/>}
                         {isAnalyzing ? 'SYNCHRONIZING...' : 'INITIALIZE NEURAL SCAN'}
                      </button>
                   </div>
                 )}
              </div>

              <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="p-2 bg-[var(--bg-secondary)] rounded-nexus"><MapPin size={14}/></div> {user.college} WING
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="p-2 bg-[var(--bg-secondary)] rounded-nexus"><Calendar size={14}/></div> SINCE: {user.status}
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="p-2 bg-[var(--bg-secondary)] rounded-nexus"><Mail size={14}/></div> NODE_{user.id.slice(0,6)}@MAK.AC.UG
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)]">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-nexus text-center border border-[var(--border-color)]">
                       <p className="text-xl font-black">{user.followersCount}</p>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Direct_Uplinks</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-nexus text-center border border-[var(--border-color)]">
                       <p className="text-xl font-black">{user.totalLikesCount}</p>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Trust_Rating</p>
                    </div>
                 </div>
              </div>
            </div>
          </aside>

          {/* 3. Right Activity Column */}
          <main className="lg:col-span-8 space-y-10">
            <nav className="flex items-center gap-10 border-b border-[var(--border-color)]">
              {[
                { id: 'signals', label: 'Commit History', icon: <Terminal size={14}/> },
                { id: 'bookmarks', label: 'Vaulted Assets', icon: <Bookmark size={14}/> },
                { id: 'achievements', label: 'Credentials', icon: <Award size={14}/> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-5 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 animate-in fade-in slide-in-from-bottom-1"></div>}
                </button>
              ))}
            </nav>

            <div className="space-y-12">
              {displayedPosts.map(p => (
                <div key={p.id} className="nexus-card rounded-nexus overflow-hidden transition-all group hover:border-indigo-600/50">
                   <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/10">
                      <div className="flex items-center gap-3">
                        <Box size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">MANIFEST_SEQ::{SHA_GEN().slice(0, 6)}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{p.timestamp}</span>
                   </div>

                   <div className="p-8">
                      <div dangerouslySetInnerHTML={{ __html: p.content }} className="text-sm font-medium leading-relaxed text-[var(--text-primary)] post-content-markdown" />
                   </div>

                   <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between bg-slate-900/40">
                      <div className="flex items-center gap-10">
                         <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">
                            <Star size={14} /> <span className="ticker-text">{p.likes}</span>
                         </div>
                         <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                            <MessageCircle size={14} /> <span className="ticker-text">{p.commentsCount}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">SHA-256_VERIFIED</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      </div>
                   </div>
                </div>
              ))}
              {displayedPosts.length === 0 && (
                <div className="py-40 text-center space-y-8 opacity-40">
                   <Database size={64} className="mx-auto text-slate-600" />
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic">Sector_Blank</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No matching telemetry committed to this strata.</p>
                   </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
