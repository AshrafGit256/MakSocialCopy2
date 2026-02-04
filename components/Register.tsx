
import React, { useState } from 'react';
import { College, UserStatus } from '../types';
import { ShieldCheck, Users, ArrowRight, User as UserIcon, Mail, BookOpen, GraduationCap, ChevronRight, Terminal, Activity, Database, Fingerprint, X } from 'lucide-react';

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
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden selection:bg-slate-700 selection:text-white font-sans transition-colors duration-500">
      {/* LEFT TACTICAL PANEL */}
      <div className="hidden lg:block w-1/2 relative bg-[#05080c] border-r border-[var(--border-color)]">
        <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale" alt="Graduation Spirit" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent p-20 flex flex-col justify-end">
           <div className="space-y-10 max-w-lg">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-[2px] flex items-center justify-center shadow-2xl">
                    <Users size={24} className="text-black fill-black/10" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-2">
                       <Activity size={12} className="animate-pulse" /> Enrollment_Active
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Node v4.2 Stable</p>
                 </div>
              </div>

              <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                Define Your <br /> 
                <span className="text-slate-500">Identity.</span>
              </h1>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-white/5 backdrop-blur-md rounded-[2px] border border-white/10 space-y-2">
                    <BookOpen size={18} className="text-slate-300" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Vault Access</h4>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Academic Repositories</p>
                 </div>
                 <div className="p-5 bg-white/5 backdrop-blur-md rounded-[2px] border border-white/10 space-y-2">
                    <Fingerprint size={18} className="text-slate-300" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Verified Log</h4>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Official Metadata</p>
                 </div>
              </div>
           </div>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* RIGHT AUTH PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-primary)] relative overflow-y-auto no-scrollbar">
        <div className="absolute top-10 right-10">
           <button onClick={onSwitchToLogin} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] transition-colors">Existing Node? Sign In</button>
        </div>

        <div className="w-full max-w-md py-12 space-y-10">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] text-slate-500 text-[9px] font-black uppercase tracking-widest">
                <Terminal size={14}/> Initialization_Sequence
             </div>
             <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">Node Registration.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Legal Alias</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] py-4 px-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-500/5 transition-all" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Wing Credential (Email)</label>
                <input 
                  type="email" 
                  placeholder="student@mak.ac.ug" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] py-4 px-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-500/5 transition-all" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Hub</label>
                  <select 
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] py-4 px-4 text-[10px] font-black uppercase text-[var(--text-primary)] outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer" 
                    value={college} 
                    onChange={e => setCollege(e.target.value as College)}
                  >
                    {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Strata Stage</label>
                  <select 
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] py-4 px-4 text-[10px] font-black uppercase text-[var(--text-primary)] outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer" 
                    value={status} 
                    onChange={e => setStatus(e.target.value as UserStatus)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--brand-color)] text-white font-black py-6 rounded-[2px] text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:brightness-110 active:scale-95 flex items-center justify-center gap-3"
            >
              Commit Node Identity <ArrowRight size={18} />
            </button>
          </form>

          <div className="pt-6 border-t border-[var(--border-color)] flex flex-col items-center gap-4 text-center">
             <div className="flex items-center gap-4 opacity-50">
                <Database size={16} className="text-slate-400" />
                <Terminal size={16} className="text-slate-400" />
                <Activity size={16} className="text-slate-400" />
             </div>
             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] max-w-[280px] leading-loose">
                By committing your node, you authorize synchronization with the Hill Intelligence Registry and agree to technical protocols.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
