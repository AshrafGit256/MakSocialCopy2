
import React, { useState } from 'react';

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
    <div className="flex h-screen bg-[#05080c]">
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/makerere_at_night.webp"
          alt="Campus"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c]/80 to-transparent flex flex-col justify-end p-20">
           <h1 className="text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
  Your University,<br />
  Your Network
</h1>

           <p className="text-slate-300 text-xl mt-6 max-w-md font-medium">Join thousands of students and share what matters to your community.</p>
           <div className="mt-8 flex gap-4">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/50">Admin: name@admin.mak.ac.ug</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/50">User: name@mak.ac.ug</span>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-12">
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
          />

          <div className="space-y-2">
             <h2 className="text-3xl font-black text-white">Welcome Back</h2>
             <p className="text-slate-500 font-medium">Please enter your university credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">University Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@mak.ac.ug"
                className="w-full bg-[#1a1f2e] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-xs font-bold text-blue-500 hover:underline">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1a1f2e] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-slate-700"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] text-lg transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
            >
              Login to Account
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
             New to Mak Social? <button onClick={onSwitchToRegister} className="text-white font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
