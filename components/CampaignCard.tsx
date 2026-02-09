
import React, { useState } from 'react';
import { Post, User, Ticket } from '../types';
import { db } from '../db';
import { AuthoritySeal } from './Feed';
import { 
  Zap, MapPin, Calendar, CreditCard, 
  CheckCircle, Loader2, ShieldCheck, 
  Star, MessageCircle, Share2, Bookmark,
  MoreHorizontal, ChevronRight, X, Lock,
  Fingerprint
} from 'lucide-react';

const CampaignCard: React.FC<{ 
  post: Post; 
  currentUser: User; 
  onComplete: () => void;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}> = ({ post, currentUser, onComplete, isLiked = false, onLike, isBookmarked = false, onBookmark }) => {
  const [step, setStep] = useState<'view' | 'pay' | 'success'>('view');
  const [isBuying, setIsBuying] = useState(false);

  const handlePurchase = () => {
    setIsBuying(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TICK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        eventId: post.id,
        eventTitle: post.eventTitle || post.author + " Event",
        eventDate: post.campaignData?.eventDate || "TBA",
        eventLocation: post.campaignData?.location || "TBA",
        price: post.campaignData?.price || "UGX 0",
        ownerName: currentUser.name,
        purchaseDate: new Date().toLocaleDateString(),
        status: 'Valid',
        securityHash: Math.random().toString(16).substr(2, 8)
      };
      db.purchaseTicket(newTicket);
      setIsBuying(false);
      setStep('success');
    }, 1800);
  };

  return (
    <article className="bg-white border border-[var(--border-color)] rounded-[var(--radius-main)] overflow-hidden shadow-sm mb-6 transition-all hover:border-slate-300">
      {/* HEADER: Identical to standard posts */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={post.authorAvatar} 
              className="w-12 h-12 rounded-full border border-slate-100 object-cover shadow-sm" 
              alt={post.author} 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-black uppercase tracking-tight text-slate-900">{post.author}</h4>
                <AuthoritySeal role={post.authorAuthority} size={12} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                {post.authorRole} • Sponsored
              </p>
            </div>
          </div>
          <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-slate-100 mb-5"></div>

        {/* CONTENT */}
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="text-[16px] font-medium leading-relaxed text-slate-700 mb-4 post-content-markdown px-1" 
        />
      </div>

      {/* VISUAL ASSET: Poster Image */}
      {post.images && post.images.length > 0 && (
        <div className="relative group mx-5">
          <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative aspect-[4/5] sm:aspect-video">
            <img src={post.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Event Poster" />
            
            {/* Elegant Metadata Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
               <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                  <Calendar size={12} className="text-white" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{post.campaignData?.eventDate}</span>
               </div>
               <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                  <MapPin size={12} className="text-white" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{post.campaignData?.location}</span>
               </div>
            </div>

            {/* Official Campaign Tag */}
            <div className="absolute top-4 right-4">
               <div className="px-2 py-1 bg-[var(--brand-color)] text-white rounded text-[8px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                  Verified Protocol
               </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKET INTERFACE LAYER */}
      <div className="px-5 py-4">
        {step === 'view' && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-5 py-3">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Fee Registry</span>
                <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">{post.campaignData?.price}</span>
             </div>
             <button 
               onClick={() => setStep('pay')}
               className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
             >
               <Lock size={12} className="text-emerald-400" /> Secure Entry
             </button>
          </div>
        )}

        {step === 'pay' && (
          <div className="bg-slate-900 text-white rounded-xl p-6 animate-in slide-in-from-bottom-2 space-y-5 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Payment_Authorize</p>
                </div>
                <button onClick={() => setStep('view')} className="p-1 text-slate-500 hover:text-white"><X size={18}/></button>
             </div>
             <div className="flex items-center justify-between border-y border-white/5 py-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-black text-white shadow-xl shadow-amber-500/20">M</div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">MTN Pulse MoMo</span>
                      <span className="text-[8px] font-medium text-slate-500 uppercase">Synchronizing...</span>
                   </div>
                </div>
                <span className="text-base font-black text-emerald-400 tabular-nums tracking-tighter">{post.campaignData?.price}</span>
             </div>
             <button 
               onClick={handlePurchase}
               disabled={isBuying}
               className="w-full py-4 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl"
             >
               {isBuying ? <Loader2 size={16} className="animate-spin text-slate-900" /> : <Fingerprint size={18} className="text-[var(--brand-color)]" />}
               {isBuying ? 'Verifying Node...' : 'Authorize Commitment'}
             </button>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-in zoom-in-95 space-y-4 shadow-sm">
             <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 border-4 border-white">
                <CheckCircle size={24} className="text-white" />
             </div>
             <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest">Entry Protocol Successful</h4>
                <p className="text-[10px] text-emerald-600 font-medium leading-relaxed max-w-[200px] mx-auto">Digital pass has been committed to your <strong>Registry Vault</strong>.</p>
             </div>
             <button 
               onClick={() => { setStep('view'); onComplete(); }}
               className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md"
             >
               Confirm & Close
             </button>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS: Standard Post Bar */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={(e) => { e.stopPropagation(); onLike?.(post.id); }}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all group/btn active:scale-125"
            >
               <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-rose-50 text-rose-500 shadow-sm' : 'group-hover/btn:bg-rose-50'}`}>
                  <Star size={20} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
               </div>
               <span className={`text-[12px] font-black tracking-widest ${isLiked ? 'text-rose-500' : ''}`}>
                 {post.likes > 0 ? post.likes.toLocaleString() : 'STAR'}
               </span>
            </button>

            <button className="flex items-center gap-2 text-slate-400 hover:text-[var(--brand-color)] transition-all group/btn">
               <div className="p-2 rounded-full group-hover/btn:bg-teal-50">
                  <MessageCircle size={20} />
               </div>
               <span className="text-[12px] font-black tracking-widest">
                 {post.commentsCount > 0 ? post.commentsCount.toLocaleString() : 'REPLY'}
               </span>
            </button>

            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-all group/btn">
               <div className="p-2 rounded-full group-hover/btn:bg-indigo-50">
                  <Share2 size={20} />
               </div>
            </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark?.(post.id); }}
            className={`p-2 rounded-full transition-all active:scale-125 ${isBookmarked ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;
