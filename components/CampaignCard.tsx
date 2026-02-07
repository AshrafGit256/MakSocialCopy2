
import React, { useState } from 'react';
import { Post, User, Ticket } from '../types';
import { db } from '../db';
import { AuthoritySeal } from './Feed';
import { 
  Zap, MapPin, Calendar, CreditCard, 
  CheckCircle, Loader2, ShieldCheck, 
  Star, MessageCircle, Share2, Bookmark,
  MoreHorizontal, ChevronRight, X
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
        eventTitle: post.eventTitle || "University Event",
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
    }, 2000);
  };

  return (
    <article className="bg-white border border-[var(--brand-color)] rounded-[var(--radius-main)] overflow-hidden shadow-md mb-6 transition-all hover:shadow-lg">
      {/* HEADER: Matches Normal Post */}
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
          <div className="flex items-center gap-2">
             <span className="text-[8px] font-black px-2 py-0.5 bg-[var(--brand-color)] text-white rounded-full uppercase tracking-widest animate-pulse">Official Campaign</span>
             <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
             </button>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-slate-100 mb-5"></div>

        {/* CONTENT */}
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="text-[16px] font-medium leading-relaxed text-slate-700 mb-4 post-content-markdown px-1" 
        />
      </div>

      {/* POSTER IMAGE */}
      {post.images && post.images.length > 0 && (
        <div className="relative group px-1">
          <div className="rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
            <img src={post.images[0]} className="w-full h-auto object-cover max-h-[550px]" alt="Event Poster" />
          </div>
          
          {/* Subtle Overlay Info - Only if not in pay mode */}
          {step === 'view' && (
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
               <div className="flex gap-3">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2">
                     <Calendar size={12} className="text-white" />
                     <span className="text-[10px] font-black text-white uppercase">{post.campaignData?.eventDate}</span>
                  </div>
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2">
                     <MapPin size={12} className="text-white" />
                     <span className="text-[10px] font-black text-white uppercase">{post.campaignData?.location}</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* COMPACT TICKET BAR */}
      <div className="px-5 py-4">
        {step === 'view' && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Fee</span>
                <span className="text-xl font-black text-slate-900">{post.campaignData?.price}</span>
             </div>
             <button 
               onClick={() => setStep('pay')}
               className="bg-[var(--brand-color)] hover:brightness-110 text-white px-6 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
             >
               <Zap size={14} fill="currentColor" /> Buy Ticket
             </button>
          </div>
        )}

        {step === 'pay' && (
          <div className="bg-slate-900 text-white rounded-xl p-5 animate-in slide-in-from-bottom-2 space-y-4">
             <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile Money Auth</p>
                <button onClick={() => setStep('view')} className="p-1 hover:text-rose-500"><X size={16}/></button>
             </div>
             <div className="flex items-center justify-between border-y border-white/10 py-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-black text-white">M</div>
                   <span className="text-xs font-bold uppercase">MTN MoMo Sync</span>
                </div>
                <span className="text-sm font-black text-emerald-400">{post.campaignData?.price}</span>
             </div>
             <button 
               onClick={handlePurchase}
               disabled={isBuying}
               className="w-full py-3 bg-white text-black rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
             >
               {isBuying ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
               {isBuying ? 'Verifying Node...' : 'Authorize Payment'}
             </button>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center animate-in zoom-in-95 space-y-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle size={20} className="text-white" />
             </div>
             <div className="space-y-1">
                <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Purchase Successful</p>
                <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">Your digital pass has been committed to your **Registry Vault**.</p>
             </div>
             <button 
               onClick={() => { setStep('view'); onComplete(); }}
               className="text-[9px] font-black text-emerald-700 uppercase tracking-widest hover:underline"
             >
               Dismiss Notice
             </button>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS: Matches Normal Post */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={(e) => { e.stopPropagation(); onLike?.(post.id); }}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all group/btn active:scale-125"
            >
               <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-rose-50 text-rose-500' : 'group-hover/btn:bg-rose-50'}`}>
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
            className={`p-2 rounded-full transition-all active:scale-125 ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;
