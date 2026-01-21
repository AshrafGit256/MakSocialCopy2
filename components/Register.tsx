
import React, { useState } from 'react';
import { College, UserStatus } from '../types';
import { ShieldCheck, Zap, ArrowRight, User as UserIcon, Mail, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

interface RegisterProps {
  onRegister: (email: string, college: College, status: UserStatus) => void;
  onSwitchToLogin: () => void;
}

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const STATUSES: UserStatus[] = ['Year 1', 'Year 2', 'Finalist', 'Masters', 'Graduate'];

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState<College>('COCIS');
  const [status, setStatus] = useState<UserStatus>('Year 1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, college, status);
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Left Panel - The University Identity */}
      <div className="hidden lg:block w-1/2 relative bg-[#0f172a]">
        <img 
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200" 
          className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Makerere Spirit" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent p-24 flex flex-col justify-end space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                 <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">MakSocial Protocol</h2>
           </div>
           
           <h1 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            Define <br />
            Your <span className="text-indigo-500">Node</span>.
           </h1>
           
           <p className="text-slate-300 text-xl max-w-md font-medium leading-relaxed italic border-l-4 border-indigo-600 pl-8">
            "Every node matters. Register your identity within the university network to synchronize with the Hill's collective pulse."
           </p>

           <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                 <div className="p-2 bg-indigo-600 rounded-lg w-fit text-white"><BookOpen size={16}/></div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">Academic Assets</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Universal access to the Vault.</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                 <div className="p-2 bg-emerald-600 rounded-lg w-fit text-white"><ShieldCheck size={16}/></div>
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">Verified Node</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trusted university credentials.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Register Form Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0f172a] relative overflow-y-auto no-scrollbar">
        <div className="absolute top-10 right-10">
           <button onClick={onSwitchToLogin} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all">Existing Node? Sign In</button>
        </div>

        <div className="w-full max-w-md py-12 space-y-12 animate-in slide-in-from-left-10 duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-lg text-indigo-600 text-[8px] font-black uppercase tracking-widest">
                Identity Boarding Sequence
            </div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight italic">Initialize <br />Your Identity.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Onboarding new network participants</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
               <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Alias</label>
                <div className="relative">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                   <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Wing Credential (Email)</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                   <input 
                    type="email" 
                    placeholder="name@mak.ac.ug" 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Hub</label>
                  <div className="relative">
                     <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
                     <select 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-10 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all appearance-none" 
                      value={college} 
                      onChange={e => setCollege(e.target.value as College)}
                    >
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Strata Stage</label>
                  <div className="relative">
                     <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
                     <select 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-10 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all appearance-none" 
                      value={status} 
                      onChange={e => setStatus(e.target.value as UserStatus)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 mt-6 active:scale-95"
            >
              Commit Connection <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="pt-8 border-t border-[var(--border-color)] text-center space-y-4">
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
               By committing your identity, you agree to the Hill Protocol Guidelines.
             </p>
             <div className="flex justify-center gap-6 opacity-30">
                <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-5 h-5" />
                <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-5 h-5 rotate-45" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
