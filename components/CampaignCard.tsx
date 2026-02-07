
import React, { useState, useEffect } from 'react';
import { Post, User, Ticket } from '../types';
import { db } from '../db';
import { Zap, MapPin, Calendar, CreditCard, CheckCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

const CampaignCard: React.FC<{ post: Post; currentUser: User; onComplete: () => void; onNavigateToVault?: () => void }> = ({ post, currentUser, onComplete, onNavigateToVault }) => {
  const [isBuying, setIsBuying] = useState(false);
  const [step, setStep] = useState<'view' | 'pay' | 'success'>('view');
  const [hasTicket, setHasTicket] = useState(false);

  useEffect(() => {
    const tickets = db.getTickets();
    setHasTicket(tickets.some(t => t.eventId === post.id));
  }, [post.id, step]);

  const handlePurchase = () => {
    setIsBuying(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TICK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        eventId: post.id,
        eventTitle: post.eventTitle || "Makerere Event",
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

  const navigateToVault = () => {
    if (onNavigateToVault) {
      onNavigateToVault();
    }
    onComplete();
  };

  const themeColor = post.campaignData?.themeColor || '#10918a';

  return (
    <div className="bg-white border-2 rounded-none overflow-hidden mb-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500" style={{ borderColor: themeColor }}>
      <div className="relative h-64 overflow-hidden" style={{ backgroundColor: themeColor }}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brush-stroke.png')]"></div>
        {post.images && post.images.length > 0 ? (
          <img 
            src={post.images[0]} 
            className="w-full h-full object-cover mix-blend-overlay grayscale"
          />
        ) : (
          <div className="w-full h-full bg-black/10" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/20">
           <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-2xl">
             {post.eventTitle?.split(' ').slice(0, -1).join(' ')} <br/> <span className="text-amber-400">{post.eventTitle?.split(' ').pop()}</span>
           </h2>
           <p className="text-white font-bold uppercase tracking-widest text-[10px] bg-black/40 px-3 py-1 rounded-full">Official Enrollment Hub</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {step === 'view' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-100">
               <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date</p>
                    <div className="flex items-center gap-2 font-black" style={{ color: themeColor }}>
                       <Calendar size={16}/> {post.campaignData?.eventDate.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Venue</p>
                    <div className="flex items-center gap-2 font-black" style={{ color: themeColor }}>
                       <MapPin size={16}/> {post.campaignData?.location.split(' ')[0]}
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Entry Fee</p>
                  <p className="text-2xl font-black text-slate-900">{post.campaignData?.price}</p>
               </div>
            </div>

            <div className="text-slate-600 font-medium leading-relaxed post-content-markdown" dangerouslySetInnerHTML={{ __html: post.content }} />

            {hasTicket ? (
              <button 
                onClick={navigateToVault}
                className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 border-emerald-800"
              >
                <CheckCircle size={20}/> TICKET SECURED / VIEW IN VAULT
              </button>
            ) : (
              <button 
                onClick={() => setStep('pay')}
                className="w-full py-5 text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                style={{ backgroundColor: themeColor }}
              >
                <Zap size={20} fill="currentColor"/> {post.campaignData?.cta}
              </button>
            )}
          </>
        )}

        {step === 'pay' && (
          <div className="py-10 text-center space-y-8 animate-in slide-in-from-bottom-4">
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Mobile Money Checkout</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Payment Node Active</p>
             </div>
             
             <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg">M</div>
                   <div className="text-left">
                      <p className="text-xs font-black uppercase">MTN MoMo Sync</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.name.split(' ')[0]}_ID_LINKED</p>
                   </div>
                </div>
                <p className="font-black" style={{ color: themeColor }}>{post.campaignData?.price}</p>
             </div>

             <button 
               onClick={handlePurchase}
               disabled={isBuying}
               className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all flex items-center justify-center gap-3"
             >
               {isBuying ? <Loader2 size={20} className="animate-spin"/> : <CreditCard size={20}/>}
               {isBuying ? 'Synchronizing Transaction...' : 'Authorize Hill Payment'}
             </button>
             <button onClick={() => setStep('view')} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors tracking-widest">Abort Transaction</button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-10 text-center space-y-8 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                <CheckCircle size={40} className="text-white" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-emerald-600">Purchase Logged</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose">
                  Asset committed to Registry Vault. <br/> Use the visual pulse for rapid entry.
                </p>
             </div>
             <div className="flex flex-col gap-3">
                <button 
                  onClick={navigateToVault}
                  className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16}/> VIEW TICKET IN VAULT <ArrowRight size={16}/>
                </button>
                <button 
                  onClick={() => setStep('view')}
                  className="w-full py-4 border border-slate-200 text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] hover:bg-slate-50 transition-all"
                >
                  Back to Pulse Feed
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
         <span>Secure Node Endpoint</span>
         <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Transaction Verified
         </div>
      </div>
    </div>
  );
};

export default CampaignCard;
