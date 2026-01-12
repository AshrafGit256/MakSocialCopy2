
import React from 'react';
import { Rocket, ShieldCheck, ShoppingBag, ArrowRight, Github, Twitter, Facebook } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#05080c] text-white flex flex-col overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="px-8 py-6 flex items-center justify-between sticky top-0 z-50 glass-card border-b border-white/5">
        <div className="flex items-center space-x-1">
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="Campus"
            className="w-20 y-20"
          />
        </div>
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold tracking-wide uppercase">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
        </div>
        <button 
          onClick={onStart}
          className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/10"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 relative py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
              Official University Network
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
             Connect with your <br/>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Makerere Community</span>
           </h1>
           <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
             The premier digital hub for university students, faculty, and alumni. Share opportunities, build networks, and grow together.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-blue-600/30"
              >
                Join Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-[2rem] font-black text-lg transition-all backdrop-blur-xl">
                Explore Public Feed
              </button>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-32 bg-white/[0.02] border-y border-white/5">
         <div className="max-w-7xl mx-auto">
            <div className="mb-20 space-y-4">
               <h2 className="text-4xl font-black">Everything you need to thrive.</h2>
               <p className="text-slate-500 text-lg">Integrated tools designed specifically for the university lifestyle.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { 
                   title: 'College Hubs', 
                   desc: 'Join discipline-specific groups and discussions. Connect with peers from your college.',
                   icon: <Rocket className="text-blue-500" size={32} />,
                   color: 'bg-blue-500/10'
                 },
                 { 
                   title: 'Opportunity Market', 
                   desc: 'Find internships, freelance gigs, and project collaborations posted by fellow students.',
                   icon: <ShoppingBag className="text-green-500" size={32} />,
                   color: 'bg-green-500/10'
                 },
                 { 
                   title: 'Secure Messaging', 
                   desc: 'Fast, encrypted private and group chats with multimedia and file sharing support.',
                   icon: <ShieldCheck className="text-purple-500" size={32} />,
                   color: 'bg-purple-500/10'
                 }
               ].map((feat, i) => (
                 <div key={i} className="glass-card p-10 rounded-[3rem] hover:translate-y-[-10px] transition-all duration-500 border border-white/5 group">
                    <div className={`w-20 h-20 ${feat.color} rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                       {feat.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="space-y-6 max-w-sm">
               <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-xl"></div>
                  <span className="text-2xl font-black tracking-tighter uppercase italic">Mak Social</span>
               </div>
               <p className="text-slate-500">The central platform for student communication and campus events at Makerere University.</p>
               <div className="flex gap-4">
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Twitter size={18} /></button>
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Github size={18} /></button>
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={18} /></button>
               </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-32">
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest">Platform</h4>
                  <ul className="space-y-2 text-sm text-slate-500 font-medium">
                     <li className="hover:text-blue-400 cursor-pointer">Mobile App</li>
                     <li className="hover:text-blue-400 cursor-pointer">Admin Portal</li>
                     <li className="hover:text-blue-400 cursor-pointer">Security</li>
                     <li className="hover:text-blue-400 cursor-pointer">Privacy</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest">University</h4>
                  <ul className="space-y-2 text-sm text-slate-500 font-medium">
                     <li className="hover:text-blue-400 cursor-pointer">News</li>
                     <li className="hover:text-blue-400 cursor-pointer">Colleges</li>
                     <li className="hover:text-blue-400 cursor-pointer">Alumni</li>
                     <li className="hover:text-blue-400 cursor-pointer">Library</li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest">Support</h4>
                  <ul className="space-y-2 text-sm text-slate-500 font-medium">
                     <li className="hover:text-blue-400 cursor-pointer">Help Center</li>
                     <li className="hover:text-blue-400 cursor-pointer">Safety</li>
                     <li className="hover:text-blue-400 cursor-pointer">Terms</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-xs text-slate-600 font-bold tracking-widest uppercase">© 2025 MAK SOCIAL NETWORK • HANDCRAFTED IN KAMPALA</p>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
