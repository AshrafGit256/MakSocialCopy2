
import React, { useState, useEffect } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Project, College, User } from '../types';
import { 
  Rocket, Search, Plus, X, Users, Code, Cpu, 
  Lightbulb, Globe, ChevronRight, Zap, Target,
  Layers, MessageCircle, Send
} from 'lucide-react';

const Nexus: React.FC = () => {
  const [currentUser] = useState<User>(db.getUser());
  const [activeCollege, setActiveCollege] = useState<College>(currentUser.college);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    roles: ''
  });

  useEffect(() => {
    // Mock initializer for Project Nexus
    const initialProjects: Project[] = [
      { 
        id: 'prj-1', title: 'MakChain: Campus Ledger', description: 'Building a decentralized voting system for Guild elections using blockchain.', college: 'COCIS', ownerId: 'u1', ownerName: 'Guru A.', status: 'Building', tags: ['Blockchain', 'Solidity'], rolesNeeded: ['Frontend Dev'], team: [{ id: 'u1', name: 'Guru A.', avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg' }], timestamp: '2024-03-20', progress: 65 
      },
      { 
        id: 'prj-2', title: 'Eco-Brick Initiative', description: 'Recycling campus plastic waste into durable construction bricks.', college: 'CEDAT', ownerId: 'u2', ownerName: 'Sarah N.', status: 'Recruiting', tags: ['Civil', 'Eco'], rolesNeeded: ['Lab Tech'], team: [], timestamp: '2024-04-05', progress: 20 
      }
    ];
    setProjects(initialProjects);
  }, []);

  const collegeProjects = projects.filter(p => p.college === activeCollege);
  const filteredProjects = collegeProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!form.title || !form.description) return;
    const newPrj: Project = {
      id: `prj-${Date.now()}`,
      title: form.title,
      description: form.description,
      college: activeCollege,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      status: 'Recruiting',
      tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
      rolesNeeded: form.roles.split(',').map(r => r.trim()).filter(r => r),
      team: [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }],
      timestamp: new Date().toISOString().split('T')[0],
      progress: 0
    };
    setProjects([newPrj, ...projects]);
    setIsAdding(false);
    setForm({ title: '', description: '', tags: '', roles: '' });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 bg-indigo-600/10 text-indigo-600 px-3 py-1.5 rounded-xl w-fit border border-indigo-600/20">
              <Rocket size={16}/>
              <span className="text-[10px] font-black uppercase tracking-widest">{activeCollege} INNOVATION HUB</span>
           </div>
           <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
             Project Nexus
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Collaborative Laboratory for College Assets & Intelligence</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
              />
           </div>
           <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95">
              <Plus size={18} /> Start Project
           </button>
        </div>
      </header>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
         {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c as College)}
             className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeCollege === c ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-secondary)] text-slate-500 border-[var(--border-color)]'}`}
           >
             {c} Wing
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredProjects.map(prj => (
           <div key={prj.id} className="glass-card group bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500 transition-all p-8 flex flex-col justify-between h-[400px] shadow-sm hover:shadow-2xl">
              <div>
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] transition-all group-hover:scale-110">
                       <Cpu size={24} className="text-indigo-600" />
                    </div>
                    <span className="text-[8px] font-black uppercase bg-indigo-600 text-white px-3 py-1.5 rounded-lg">{prj.status}</span>
                 </div>
                 <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter line-clamp-2 leading-none mb-4">
                    {prj.title}
                 </h3>
                 <p className="text-xs text-slate-500 font-medium italic mb-6 line-clamp-3 leading-relaxed">"{prj.description}"</p>
              </div>

              <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
                 <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                       {prj.team.map((m, i) => (
                         <img key={i} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-[var(--sidebar-bg)] object-cover" />
                       ))}
                       {prj.rolesNeeded.length > 0 && (
                         <div className="w-8 h-8 rounded-full bg-indigo-600/10 border-2 border-[var(--sidebar-bg)] flex items-center justify-center text-indigo-600 font-black text-[8px]">+{prj.rolesNeeded.length}</div>
                       )}
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-[var(--text-primary)] leading-none">{prj.progress}%</p>
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Velocity</p>
                    </div>
                 </div>
                 
                 <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${prj.progress}%` }}></div>
                 </div>

                 <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Zap size={14} /> Join Project
                 </button>
              </div>
           </div>
         ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-xl bg-[var(--sidebar-bg)] p-10 rounded-[3rem] shadow-2xl border-[var(--border-color)] overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">New Nexus Protocol</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors p-2"><X size={28}/></button>
            </div>
            <div className="space-y-6">
              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold" placeholder="Project Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 h-32 resize-none transition-all font-bold" placeholder="Describe the innovation mission..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold" placeholder="Tags (AI, Physics, Hardware)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <button onClick={handleCreateProject} className="w-full bg-indigo-600 py-6 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-[0.98]">Deploy Project Node</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nexus;
