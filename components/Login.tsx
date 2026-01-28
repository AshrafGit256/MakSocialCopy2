
import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, Fingerprint, Lock, Mail, Activity, Terminal } from 'lucide-react';

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
    <div className="flex h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* LEFT TACTICAL PANEL */}
      <div className="hidden lg:block w-1/2 relative bg-[#05080c] border-r border-[#30363d]">
        <img
          src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqcyxlewzxagSqcM7aXE5JrGSLNyiGP7V4XR5PYmTliZcJOnRatS4B5-cUO2UgmsTfT9efVrOAS9Gx-NJk8oIZmgZDLPpvc3W6Fl6GeSh-sbqtKnImUNwovg9unJwqJb_5Rlw9lU_Nfgg69=s680-w680-h510-rw"
          alt="The Hill Architecture"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/60 to-transparent p-20 flex flex-col justify-end">
           <div className="space-y-8 max-w-lg">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-2xl">
                    <Zap size={24} className="text-black fill-black" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2">
                       <Activity size={12} className="animate-pulse" /> Protocol_Live
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Registry Encryption: AES-256</p>
                 </div>
              </div>
              
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                Access <br /> 
                <span className="text-indigo-500">The Hill.</span>
              </h1>
              
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 space-y-4">
                 <p className="text-slate-300 text-sm font-medium leading-relaxed">
                  "Your digital gateway to the university's exclusive intelligence network. Access granted to verified nodes only."
                 </p>
                 <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full"></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* RIGHT AUTH PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0d1117] relative">
        <div className="absolute top-10 right-10 flex items-center gap-4">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Node?</span>
           <button 
             onClick={onSwitchToRegister} 
             className="px-4 py-2 border border-[#30363d] rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all"
           >
             Initialize Registration
           </button>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded text-indigo-500 text-[9px] font-black uppercase tracking-widest">
                <Terminal size={14}/> Authentication_v4.2
             </div>
             <h2 className="text-4xl font-black text-white uppercase tracking-tight">Identity Handshake.</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Wing Credential (Email)</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                   <input 
                     type="email" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     placeholder="student@mak.ac.ug" 
                     className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/5 transition-all" 
                     required 
                   />
                </div>
              </div>
              <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Passcode Logic</label>
                   <button type="button" className="text-[9px] font-black uppercase text-indigo-500 hover:underline">Reset_Key</button>
                </div>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                   <input 
                     type="password" 
                     placeholder="••••••••" 
                     className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/5 transition-all" 
                     required 
                   />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-black font-black py-5 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:bg-[#f0f0f0] active:scale-95 flex items-center justify-center gap-3"
            >
              Authorize Node Entrance <ArrowRight size={18} />
            </button>
          </form>

          <div className="pt-6 border-t border-[#30363d] flex flex-col items-center gap-4 text-center">
             <div className="flex items-center gap-4 opacity-50">
                <ShieldCheck size={16} className="text-emerald-500" />
                <Fingerprint size={16} className="text-indigo-500" />
                <Activity size={16} className="text-rose-500" />
             </div>
             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] max-w-[240px] leading-loose">
                Telemetry synchronized with Hill Security Matrix v4.2 Stable. Authorized student access only.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
