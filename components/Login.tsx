
import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, Fingerprint, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:block w-1/2 relative bg-[#05080c]">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200"
          alt="Campus Intelligence"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c] via-[#05080c]/50 to-transparent p-24 flex flex-col justify-end space-y-8">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
              <Zap size={32} className="text-white fill-white" />
           </div>
           <h1 className="text-7xl font-black text-white italic tracking-tighter leading-tight uppercase">
            Access <br />
            The Hill.
          </h1>
          <p className="text-slate-300 text-xl max-w-md font-medium leading-relaxed italic border-l-4 border-indigo-600 pl-8">
            "Your digital gateway to the university's exclusive intelligence network. Access granted to verified student nodes only."
          </p>
        </div>
      </div>

      {/* Login Terminal Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#05080c] relative">
        <div className="absolute top-10 right-10">
           <button onClick={onSwitchToRegister} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all">Initialize New Node</button>
        </div>

        <div className="w-full max-w-md space-y-12 animate-in slide-in-from-right-10 duration-700">
          <div className="space-y-4 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-lg text-indigo-600 text-[8px] font-black uppercase tracking-widest mx-auto md:mx-0">
                Identity Authentication Terminal
             </div>
             <h2 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight italic">Welcome Back, <br />Node Controller.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Wing Credential (Email)</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                   <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@mak.ac.ug"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-6 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passcode Logic</label>
                  <a href="#" className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Reset Signal</a>
                </div>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                   <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl py-5 pl-12 pr-6 text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3"
            >
              Authorize Node Entrance <ArrowRight size={18} />
            </button>
          </form>

          <div className="pt-8 border-t border-[var(--border-color)] text-center">
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
               Encrypted by Hill Security Matrix v4.2 Stable
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
