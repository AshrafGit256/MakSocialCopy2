
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Project } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Orbit, Search, Zap, Loader2, Sparkles, Brain, 
  Cpu, Target, Send, Users, ChevronRight, Share2 
} from 'lucide-react';

const Synapse: React.FC = () => {
  const [currentUser] = useState<User>(db.getUser());
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>(db.getUsers());
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Collect all projects for indexing
    const prj1: Project = { 
      id: 'prj-1', 
      title: 'MakChain', 
      description: 'Blockchain ledger for university elections.', 
      college: 'COCIS', 
      ownerId: 'u1', 
      ownerName: 'Guru A.', 
      status: 'Building', 
      tags: ['Blockchain', 'Solidity'], 
      rolesNeeded: ['Frontend Dev'], 
      team: [], 
      timestamp: '', 
      progress: 60 
    };
    setAllProjects([prj1]);
  }, []);

  const handleSynapseMatch = async () => {
    if (!query.trim()) return;
    setIsThinking(true);
    setMatches([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are the MakSocial Synapse AI. Your task is to match the current user's request with potential collaborators or projects.
        User Data: Name: ${currentUser.name}, Skills: ${currentUser.skills.join(', ')}, College: ${currentUser.college}.
        Available Nodes: ${allUsers.map(u => `${u.name} (Skills: ${u.skills?.join(', ')}, College: ${u.college})`).join('; ')}.
        Available Projects: ${allProjects.map(p => `${p.title} (Desc: ${p.description}, Tags: ${p.tags.join(', ')})`).join('; ')}.
        
        Return ONLY a JSON array of up to 3 objects with:
        {"type": "user" | "project", "id": string, "name": string, "matchReason": string, "synapseScore": number (0-100)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Request: ${query}`,
        config: { 
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '[]');
      setMatches(result);
    } catch (e) {
      console.error(e);
      alert("Synapse Frequency Mismatch. Please re-initialize signal.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-40">
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 bg-indigo-600/10 text-indigo-600 px-6 py-2 rounded-full border border-indigo-600/20 shadow-xl shadow-indigo-600/5 animate-pulse">
           <Orbit size={24}/>
           <span className="text-xs font-black uppercase tracking-[0.3em]">Synapse AI Active</span>
        </div>
        <h1 className="text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
          Intellectual <br/> Synchronization
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] max-w-xl mx-auto">
          Neural cross-disciplinary matching for high-velocity innovation.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 rounded-[3rem] blur opacity-20 group-focus-within:opacity-50 transition duration-700"></div>
          <div className="relative glass-card bg-[var(--sidebar-bg)] border-[var(--border-color)] rounded-[2.5rem] p-4 flex items-center gap-4 transition-theme shadow-2xl">
            <Brain className="text-indigo-600 ml-4" size={32}/>
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Who should I collaborate with for an AI-driven energy project?"
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-[var(--text-primary)] placeholder:text-slate-400 py-4"
              onKeyDown={e => e.key === 'Enter' && handleSynapseMatch()}
            />
            <button 
              onClick={handleSynapseMatch}
              disabled={isThinking || !query.trim()}
              className="bg-indigo-600 text-white p-6 rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50 active:scale-95"
            >
              {isThinking ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-card p-8 bg-[var(--bg-secondary)]/50 border-[var(--border-color)] transition-theme border-dashed">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Cpu size={14}/> Your Signature
              </h4>
              <div className="flex flex-wrap gap-2">
                 {currentUser.skills.map(s => (
                   <span key={s} className="px-3 py-1.5 bg-indigo-600/10 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-tight border border-indigo-600/20">{s}</span>
                 ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">IQ Credits</span>
                 <span className="text-lg font-black text-indigo-600">{currentUser.iqCredits}</span>
              </div>
           </div>
           
           <div className="glass-card p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Platform Velocity</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-3xl font-black">98.4%</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Cross-Wing Synchronization</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-11/12 animate-pulse"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {matches.map((match, i) => (
           <div key={i} className="glass-card bg-[var(--sidebar-bg)] border-[var(--border-color)] p-8 hover:border-indigo-500 transition-all shadow-xl group animate-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex justify-between items-start mb-8">
                 <div className={`p-4 rounded-2xl ${match.type === 'user' ? 'bg-indigo-600/10 text-indigo-600' : 'bg-rose-600/10 text-rose-600'}`}>
                    {match.type === 'user' ? <Users size={24}/> : <Target size={24}/>}
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">{match.synapseScore}%</span>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Synchronization</p>
                 </div>
              </div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-4">{match.name}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-8 border-l-2 border-indigo-600/30 pl-4">
                "{match.matchReason}"
              </p>
              <button className="w-full py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn">
                 Initialize Connection <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </div>
         ))}
         {isThinking && [1,2,3].map(i => (
           <div key={i} className="glass-card p-8 border-[var(--border-color)] bg-[var(--sidebar-bg)] animate-pulse flex flex-col justify-between h-80">
              <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
              <div className="space-y-4">
                 <div className="h-6 bg-slate-200 dark:bg-white/5 rounded-lg w-3/4"></div>
                 <div className="h-12 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
              </div>
              <div className="h-12 bg-slate-200 dark:bg-white/5 rounded-xl"></div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Synapse;
