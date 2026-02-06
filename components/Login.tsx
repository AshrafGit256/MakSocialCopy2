
import React, { useState } from 'react';
import { ShieldCheck, Users, ArrowRight, Fingerprint, Lock, Mail, Activity, Terminal, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--brand-color)] selection:text-white font-sans transition-colors duration-500">
      
      {/* LEFT PANEL - Hidden on Mobile */}
      <div className="hidden lg:block w-1/2 relative bg-[var(--bg-secondary)] dark:bg-[#05080c] border-r border-[var(--border-color)] overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw"
          alt="Campus Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-40 grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/95 dark:from-black/90 via-[var(--bg-primary)]/40 dark:via-black/40 to-transparent p-24 flex flex-col justify-end">
           <div className="space-y-10 max-w-lg animate-in slide-in-from-left-8 duration-700">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-[var(--brand-color)] dark:bg-white rounded-[var(--radius-main)] flex items-center justify-center shadow-2xl">
                    <Users size={28} className="text-white dark:text-black" />
                 </div>
                 <div className="space-y-1.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-300 flex items-center gap-2">
                       <Activity size={14} className="animate-pulse text-emerald-500" /> System Online
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Secure Student Login Enabled</p>
                 </div>
              </div>
              
              <h1 className="text-7xl font-black text-[var(--text-primary)] dark:text-white tracking-tighter uppercase leading-[0.85]">
                Login to <br /> 
                <span className="text-slate-400 dark:text-slate-500">The Hill.</span>
              </h1>
              
              <div className="p-8 bg-white/50 dark:bg-white/10 backdrop-blur-xl rounded-[var(--radius-main)] border border-[var(--border-color)] dark:border-white/10 space-y-5 shadow-2xl">
                 <p className="text-slate-600 dark:text-slate-200 text-base font-medium leading-relaxed italic">
                  "Connect with your campus community and access your academic profile instantly."
                 </p>
                 <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-2 h-2 bg-[var(--brand-color)]/30 rounded-full"></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL - Main Interaction Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 md:p-20 bg-[var(--bg-primary)] relative animate-in fade-in duration-500">
        
        {/* MOBILE TOP BAR NAVIGATION */}
        <div className="w-full max-w-md flex justify-between items-center mb-12 lg:absolute lg:top-10 lg:right-10 lg:mb-0">
           <div className="flex items-center gap-3 lg:hidden">
              <div className="w-8 h-8 bg-[var(--brand-color)] rounded-[var(--radius-main)] flex items-center justify-center shadow-lg">
                <Users size={16} className="text-white" />
              </div>
              <span className="text-sm font-black uppercase tracking-tight text-slate-900">MakSocial</span>
           </div>
           <button 
             onClick={onSwitchToRegister} 
             className="px-4 py-2 sm:px-6 sm:py-3 border border-[var(--border-color)] rounded-[var(--radius-main)] text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:border-slate-400 transition-all active:scale-95 shadow-sm flex items-center gap-2"
           >
             Register <ChevronRight size={14} className="hidden sm:block"/>
           </button>
        </div>

        <div className="w-full max-w-md space-y-10 sm:space-y-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Terminal size={14} className="text-[var(--brand-color)]" /> Student Login Portal
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">Welcome Back.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2 group">
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student Email</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={20} />
                   <input 
                     type="email" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     placeholder="yourname@mak.ac.ug" 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-4 sm:py-5 pl-14 pr-6 text-sm font-black text-[var(--text-primary)] outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 transition-all shadow-inner" 
                     required 
                   />
                </div>
              </div>
              <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                   <button type="button" className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 hover:text-[var(--brand-color)] transition-colors">Forgot?</button>
                </div>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={20} />
                   <input 
                     type="password" 
                     placeholder="••••••••" 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] py-4 sm:py-5 pl-14 pr-6 text-sm font-black text-[var(--text-primary)] outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 transition-all shadow-inner" 
                     required 
                   />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--brand-color)] text-white font-black py-5 sm:py-6 rounded-[var(--radius-main)] text-[11px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all shadow-2xl hover:brightness-110 active:scale-95 flex items-center justify-center gap-4 hover:scale-[1.02]"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-8 sm:pt-10 border-t border-[var(--border-color)] flex flex-col items-center gap-6 text-center opacity-70">
             <div className="flex items-center gap-8 text-slate-400">
                <ShieldCheck size={20} />
                <Fingerprint size={20} />
                <Activity size={20} />
             </div>
             <p className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] max-w-[280px] leading-loose">
                Your account is protected by the Hill Security Framework. Verified Makerere students only.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
