
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
    <div className="flex h-screen bg-[#05080c] overflow-y-auto">
      <div className="hidden lg:block w-1/2 relative sticky top-0 h-screen">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Makerere_University_Main_Building.jpg" className="w-full h-full object-cover" alt="Campus" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c] to-transparent p-20 flex flex-col justify-end">
           <h1 className="text-7xl font-black text-white italic">Join the Elite</h1>
           <p className="text-slate-400 text-xl mt-4">Automate your college experience with MakSocial Intelligence.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-10">
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full bg-[#1a1f2e] p-4 rounded-2xl text-white outline-none border border-white/5" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" placeholder="Email (name@mak.ac.ug)" className="w-full bg-[#1a1f2e] p-4 rounded-2xl text-white outline-none border border-white/5" value={email} onChange={e => setEmail(e.target.value)} required />
            
            <div className="grid grid-cols-2 gap-4">
              <select className="bg-[#1a1f2e] p-4 rounded-2xl text-slate-400 outline-none border border-white/5" value={college} onChange={e => setCollege(e.target.value as College)}>
                {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-[#1a1f2e] p-4 rounded-2xl text-slate-400 outline-none border border-white/5" value={status} onChange={e => setStatus(e.target.value as UserStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 p-5 rounded-[2rem] text-white font-black text-lg shadow-xl hover:bg-blue-700 transition-all">Register Now</button>
          </form>
          <p className="text-center text-slate-500">Already a member? <button onClick={onSwitchToLogin} className="text-white font-bold underline">Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
