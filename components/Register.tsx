
import React, { useState } from 'react';
import { College, UserStatus } from '../types';
import { ShieldCheck, Users, ArrowRight, User as UserIcon, Mail, BookOpen, GraduationCap, ChevronRight, Terminal, Activity, Database, Fingerprint, X, Shield, Lock } from 'lucide-react';

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
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden selection:bg-[var(--brand-color)] selection:text-white font-sans transition-colors duration-500">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:block w-1/2 relative bg-[var(--bg-secondary)] dark:bg-[#05080c] border-r border-[var(--border-color)] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-30 grayscale contrast-125" alt="Campus Life" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/95 dark:from-black/90 via-[var(--bg-primary)]/40 dark:via-black/40 to-transparent p-24 flex flex-col justify-end">
           <div className="space-y-12 max-w-lg animate-in slide-in-from-left-8 duration-700">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-[var(--brand-color)] dark:bg-white rounded-[var(--radius-main)] flex items-center justify-center shadow-2xl">
                    <Users size={28} className="text-white dark:text-black" />
                 </div>
                 <div className="space-y-1.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                       <Activity size={14} className="animate-pulse text-emerald-500" /> New Enrollment
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connect with Makerere students today</p>
                 </div>
              </div>

              <h1 className="text-7xl font-black text-[var(--text-primary)] dark:text-white tracking-tighter uppercase leading-[0.85]">
                Create Your <br /> 
                <span className="text-slate-400 dark:text-slate-500">Profile.</span>
              </h1>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-white/50 dark:bg-white/10 backdrop-blur-xl rounded-[var(--radius-main)] border border-[var(--border-color)] dark:border-white/10 space-y-3 shadow-2xl group hover:border-[var(--brand-color)]/30 transition-all">
                    <BookOpen size={20} className="text-emerald-500" />
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] dark:text-white uppercase tracking-widest">Study Notes</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Access Shared Material</p>
                 </div>
                 <div className="p-6 bg-white/50 dark:bg-white/10 backdrop-blur-xl rounded-[var(--radius-main)] border border-[var(--border-color)] dark:border-white/10 space-y-3 shadow-2xl group hover:border-[var(--brand-color)]/30 transition-all">
                    <Fingerprint size={20} className="text-indigo-500" />
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] dark:text-white uppercase tracking-widest">Verified Ads</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Trusted Campus Info</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-primary)] relative overflow-y-auto no-scrollbar animate-in fade-in duration-500">
        <div className="absolute top-10 right-10">
           <button onClick={onSwitchToLogin} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[var(--brand-color)] transition-colors flex items-center gap-3 group">
              Already have an account? Sign In <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="w-full max-w-md py-16 space-y-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Terminal size={16} className="text-[var(--brand-color)]" /> Start Your Registration
             </div>
             <h2 className="text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">Join Today.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                   <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={20} />
                   <input 
                     type="text" 
                     placeholder="e.g. Namusoke Sarah" 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-5 pl-14 pr-6 text-sm font-black text-[var(--text-primary)] outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 transition-all shadow-inner" 
                     value={name} 
                     onChange={e => setName(e.target.value)} 
                     required 
                   />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student Email</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={20} />
                   <input 
                     type="email" 
                     placeholder="yourname@mak.ac.ug" 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-5 pl-14 pr-6 text-sm font-black text-[var(--text-primary)] outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 transition-all shadow-inner" 
                     value={email} 
                     onChange={e => setEmail(e.target.value)} 
                     required 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your College</label>
                  <div className="relative">
                     <select 
                       className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-5 px-6 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none focus:border-slate-500 transition-all appearance-none cursor-pointer shadow-inner pr-12" 
                       value={college} 
                       onChange={e => setCollege(e.target.value as College)}
                     >
                       {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Year</label>
                  <div className="relative">
                     <select 
                       className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-5 px-6 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none focus:border-slate-500 transition-all appearance-none cursor-pointer shadow-inner pr-12" 
                       value={status} 
                       onChange={e => setStatus(e.target.value as UserStatus)}
                     >
                       {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--brand-color)] text-white font-black py-6 rounded-[var(--radius-main)] text-xs uppercase tracking-[0.4em] transition-all shadow-2xl hover:brightness-110 active:scale-95 flex items-center justify-center gap-4 hover:scale-[1.02]"
            >
              Create My Account <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-10 border-t border-[var(--border-color)] flex flex-col items-center gap-6 text-center opacity-60">
             <div className="flex items-center gap-8 text-slate-400">
                <Database size={20} />
                <Terminal size={20} />
                <Activity size={20} />
             </div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] max-w-[320px] leading-loose">
                By joining, you agree to our community guidelines and university digital protocols. We protect your data with Makerere security standards.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
