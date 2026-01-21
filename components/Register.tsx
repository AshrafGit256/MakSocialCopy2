
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
      <div className="hidden lg:block w-1/2 relative bg-[#0f172a]">
        <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200" className="absolute inset-0 w-full h-full object-cover brightness-50 grayscale hover:grayscale-0 transition-all duration-1000" alt="Graduation Spirit" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent p-24 flex flex-col justify-end space-y-10">
           <h1 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">Define <br /> Your <span className="text-indigo-500">Node</span>.</h1>
           <p className="text-slate-300 text-xl max-w-md font-medium leading-relaxed italic border-l-4 border-indigo-600 pl-8">"Register your identity within the hill's collective network. Every node contributes to the research pulse."</p>
           <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                 <BookOpen size={20} className="text-indigo-500" />
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">Academic Assets</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Access the repository.</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                 <ShieldCheck size={20} className="text-emerald-500" />
                 <h4 className="text-sm font-black text-white uppercase tracking-tighter">Verified Node</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trusted credentials.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0f172a] relative overflow-y-auto no-scrollbar">
        <div className="absolute top-10 right-10">
           <button onClick={onSwitchToLogin} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">Existing Identity? Sign In</button>
        </div>
        <div className="w-full max-w-md py-12 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-lg text-indigo-600 text-[8px] font-black uppercase tracking-widest">Onboarding Sequence</div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight italic">Initialize Identity.</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
               <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Legal Alias</label>
                <input type="text" placeholder="e.g. Ashraf G." className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 px-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wing Credential (Email)</label>
                <input type="email" placeholder="name@mak.ac.ug" className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 px-6 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Hub</label>
                  <select className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 px-6 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] appearance-none" value={college} onChange={e => setCollege(e.target.value as College)}>
                    {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strata Stage</label>
                  <select className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 px-6 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] appearance-none" value={status} onChange={e => setStatus(e.target.value as UserStatus)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">Commit Identity <ArrowRight size={18} /></button>
          </form>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">By committing, you agree to the Hill Protocol.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
