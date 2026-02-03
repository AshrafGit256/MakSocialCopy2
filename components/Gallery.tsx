
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { GalleryItem } from '../types';
import { ChevronRight, LayoutGrid, Layers, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';

interface GalleryProps {
  onSelectPost: (postId: string) => void;
  userId?: string;
}

const Gallery: React.FC<GalleryProps> = ({ onSelectPost, userId }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const posts = db.getPosts();
    const manifest: GalleryItem[] = [];
    
    posts.forEach(p => {
      if (userId && p.authorId !== userId) return;
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, idx) => {
          manifest.push({
            id: `${p.id}-${idx}`,
            url: img,
            postId: p.id,
            likes: p.likes,
            commentsCount: p.commentsCount,
            author: p.author
          });
        });
      }
    });
    
    setItems(manifest);
  }, [userId]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 pb-40 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Visual Registry</h1>
        <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 sm:mt-2">
          <Layers size={14} className="text-[var(--brand-color)]"/> <span>Apps</span> <ChevronRight size={10}/> <span>Gallery</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5 sm:gap-4 auto-rows-auto sm:auto-rows-[250px]">
          {items.map((item, idx) => {
            const pattern = idx % 10;
            const isLarge = pattern === 0;
            const isTall = pattern === 4 || pattern === 8;
            const isWide = pattern === 2;

            return (
              <div 
                key={item.id}
                onClick={() => onSelectPost(item.postId)}
                className={`group relative overflow-hidden bg-[var(--bg-secondary)] cursor-pointer transition-all hover:scale-[1.01] hover:shadow-2xl z-10 border border-[var(--border-color)] sm:rounded-xl aspect-square sm:aspect-auto ${
                  `sm:${isLarge ? 'md:col-span-2 md:row-span-2' : 
                  isTall ? 'md:row-span-2' : 
                  isWide ? 'md:col-span-2' : ''}`
                }`}
              >
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000" 
                  alt="Gallery Asset"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 sm:gap-6 text-white backdrop-blur-[1px]">
                   <div className="flex items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                         <Heart size={14} className="sm:w-5 sm:h-5" fill="white" />
                         <span className="text-[10px] sm:text-sm font-black">{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                         <MessageCircle size={14} className="sm:w-5 sm:h-5" fill="white" />
                         <span className="text-[10px] sm:text-sm font-black">{item.commentsCount}</span>
                      </div>
                   </div>
                   <div className="hidden sm:flex absolute bottom-6 flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Source Node</span>
                      <span className="text-[11px] font-black uppercase tracking-tighter">{item.author}</span>
                   </div>
                   <div className="absolute top-2 right-2 sm:top-6 sm:right-6">
                      <ArrowUpRight size={14} className="sm:w-[18px] sm:h-[18px] text-white/60 group-hover:text-white transition-colors" />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 sm:py-40 text-center space-y-6 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)]">
          <LayoutGrid size={48} className="mx-auto text-slate-400 opacity-30" />
          <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Asset_Manifest: No visual nodes committed.</p>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Gallery;
