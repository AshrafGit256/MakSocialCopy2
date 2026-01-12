
import React, { useState } from 'react';
import { College, UserStatus } from '../types';

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
    <div className="flex h-screen bg-[#020617] overflow-y-auto">
      <div className="hidden lg:block w-1/2 relative sticky top-0 h-screen">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" className="w-full h-full object-cover brightness-50" alt="Campus" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] to-transparent p-20 flex flex-col justify-end">
           <img src="MakSocial10.png" alt="Logo" className="w-48 mb-6" />
           <h1 className="text-6xl font-black text-white italic tracking-tighter">Your Identity. <br/>Validated.</h1>
           <p className="text-slate-400 text-lg mt-4 max-w-sm">Connect with the elite Makerere community through a secure, intelligence-driven network.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic tracking-tight">Onboard Node</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Platform Entrance Sequence</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-white/5 p-4 rounded-xl text-white outline-none border border-white/5 focus:border-indigo-500/30 transition-all text-sm" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">University Credential</label>
              <input type="email" placeholder="name@mak.ac.ug" className="w-full bg-white/5 p-4 rounded-xl text-white outline-none border border-white/5 focus:border-indigo-500/30 transition-all text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Academic Unit</label>
                <select className="w-full bg-white/5 p-4 rounded-xl text-slate-400 outline-none border border-white/5 text-sm appearance-none" value={college} onChange={e => setCollege(e.target.value as College)}>
                  {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Enrollment Stage</label>
                <select className="w-full bg-white/5 p-4 rounded-xl text-slate-400 outline-none border border-white/5 text-sm appearance-none" value={status} onChange={e => setStatus(e.target.value as UserStatus)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 p-5 rounded-xl text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all mt-6">Initialize Connection</button>
          </form>
          
          <p className="text-center text-slate-500 text-xs font-medium">
            Existing identity? <button onClick={onSwitchToLogin} className="text-white font-black hover:underline ml-1">Return to Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
