
import React, { useState } from 'react';
import { Post, User, Ticket } from '../types';
import { db } from '../db';
/* Fix: Imported ShieldCheck from lucide-react */
import { Zap, MapPin, Calendar, CreditCard, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

const CampaignCard: React.FC<{ post: Post; currentUser: User; onComplete: () => void }> = ({ post, currentUser, onComplete }) => {
  const [isBuying, setIsBuying] = useState(false);
  const [step, setStep] = useState<'view' | 'pay' | 'success'>('view');

  const handlePurchase = () => {
    setIsBuying(true);
    // Simulate Mobile Money Handshake
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TICK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        eventId: post.id,
        eventTitle: "Makerere Marathon 2025",
        eventDate: post.campaignData?.eventDate || "",
        eventLocation: post.campaignData?.location || "",
        price: post.campaignData?.price || "",
        ownerName: currentUser.name,
        purchaseDate: new Date().toLocaleDateString(),
        status: 'Valid',
        securityHash: Math.random().toString(16).substr(2, 8)
      };
      db.purchaseTicket(newTicket);
      setIsBuying(false);
      setStep('success');
    }, 2500);
  };

  return (
    <div className="bg-white border-2 border-[#10918a] rounded-none overflow-hidden mb-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      {/* Visual Header with Poster Aesthetic */}
      <div className="relative h-64 bg-[#10918a] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brush-stroke.png')]"></div>
        <img 
          src="https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg" 
          className="w-full h-full object-cover mix-blend-overlay grayscale"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
           <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-xl">
             Makerere <br/> <span className="text-amber-400">Marathon</span>
           </h2>
           <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Enhance the student experience</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {step === 'view' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-100">
               <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date</p>
                    <div className="flex items-center gap-2 text-[#10918a] font-black">
                       <Calendar size={16}/> 17 AUG
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Venue</p>
                    <div className="flex items-center gap-2 text-[#10918a] font-black">
                       <MapPin size={16}/> FREEDOM SQ.
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Entry Fee</p>
                  <p className="text-2xl font-black text-slate-900">{post.campaignData?.price}</p>
               </div>
            </div>

            <p className="text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

            <button 
              onClick={() => setStep('pay')}
              className="w-full py-5 bg-[#10918a] hover:bg-[#0d7a74] text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Zap size={20} fill="currentColor"/> {post.campaignData?.cta}
            </button>
          </>
        )}

        {step === 'pay' && (
          <div className="py-10 text-center space-y-8 animate-in slide-in-from-bottom-4">
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Mobile Money Checkout</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Payment Node Active</p>
             </div>
             
             <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center font-black text-white text-xl">M</div>
                   <div className="text-left">
                      <p className="text-xs font-black">MTN MoMo</p>
                      <p className="text-[10px] text-slate-400">{currentUser.name.split(' ')[0]}</p>
                   </div>
                </div>
                <p className="font-black text-[#10918a]">{post.campaignData?.price}</p>
             </div>

             <button 
               onClick={handlePurchase}
               disabled={isBuying}
               className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all flex items-center justify-center gap-3"
             >
               {isBuying ? <Loader2 size={20} className="animate-spin"/> : <CreditCard size={20}/>}
               {isBuying ? 'Synchronizing...' : 'Authorize Payment'}
             </button>
             <button onClick={() => setStep('view')} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">Cancel Transaction</button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-10 text-center space-y-8 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                <CheckCircle size={40} className="text-white" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-emerald-600">Payment Successful</h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  Your ticket has been added to your **Registry Vault**. Show the digital pass at Freedom Square for entry.
                </p>
             </div>
             <button 
               onClick={onComplete}
               className="w-full py-4 border-2 border-[#10918a] text-[#10918a] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#10918a] hover:text-white transition-all"
             >
               Return to Feed
             </button>
          </div>
        )}
      </div>

      <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
         <span>Powered by NCBA</span>
         <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Secure Protocol
         </div>
      </div>
    </div>
  );
};

export default CampaignCard;
