
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Post } from '../types';
import { ChevronRight, LayoutGrid, Search, Layers, Heart, MessageCircle } from 'lucide-react';

interface GalleryProps {
  onSelectPost: (postId: string) => void;
  userId?: string;
}

interface GalleryItem {
  id: string;
  url: string;
  postId: string;
  likes: number;
  commentsCount: number;
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
            commentsCount: p.commentsCount
          });
        });
      }
    });
    
    setItems(manifest);
  }, [userId]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-40 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col mb-10">
        <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">Visual Registry</h1>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">
          <Layers size={14} className="text-[#10918a]"/> <span>Apps</span> <ChevronRight size={10}/> <span>Gallery</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {items.map((item, idx) => {
            // Logic to create staggered effect like the screenshot
            const isLarge = idx % 10 === 0;
            const isTall = idx % 10 === 4 || idx % 10 === 8;
            const isWide = idx % 10 === 2;

            return (
              <div 
                key={item.id}
                onClick={() => onSelectPost(item.postId)}
                className={`group relative overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl z-10 ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : 
                  isTall ? 'md:row-span-2' : 
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  alt="Gallery Asset"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white backdrop-blur-[2px]">
                   <div className="flex items-center gap-2">
                      <Heart size={20} fill="white" />
                      <span className="text-sm font-black">{item.likes}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <MessageCircle size={20} fill="white" />
                      <span className="text-sm font-black">{item.commentsCount}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 bg-slate-50 dark:bg-white/5 border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)]">
          <LayoutGrid size={48} className="mx-auto text-slate-400 opacity-30" />
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Asset_Manifest: No visual nodes committed.</p>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Gallery;
