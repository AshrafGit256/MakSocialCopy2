
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { LostFoundItem, User, College } from '../types';
import { 
  HelpCircle, Search, Plus, MapPin, Clock, 
  MessageSquare, Trash2, CheckCircle2, 
  Camera, X, Globe, ShieldCheck, 
  AlertCircle, ArrowUpRight, Info,
  Database, ArrowLeft
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

interface LostAndFoundProps {
  onOpenChat: (userId: string) => void;
}

const LostAndFound: React.FC<LostAndFoundProps> = ({ onOpenChat }) => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [currentUser] = useState<User>(db.getUser());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Lost' | 'Found'>('All');
  const [selectedCollege, setSelectedCollege] = useState<College | 'Global'>('Global');
  
  const [isAdding, setIsAdding] = useState(false);
  const [isClaiming, setIsClaiming] = useState<LostFoundItem | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    type: 'Lost' as 'Lost' | 'Found',
    title: '',
    description: '',
    location: '',
    college: 'Global' as College | 'Global',
    image: ''
  });

  useEffect(() => {
    setItems(db.getLostFound());
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!form.title || !form.description) return;
    
    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      type: form.type,
      title: form.title,
      description: form.description,
      location: form.location,
      images: form.image ? [form.image] : [],
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      status: 'Open',
      college: form.college
    };

    db.addLostFound(newItem);
    setItems(db.getLostFound());
    setIsAdding(false);
    setForm({ type: 'Lost', title: '', description: '', location: '', college: 'Global', image: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      db.deleteLostFound(id);
      setItems(db.getLostFound());
    }
  };

  const handleResolve = (id: string) => {
    db.resolveLostFound(id);
    setItems(db.getLostFound());
    alert("Great! This item has been marked as found and resolved.");
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesCollege = selectedCollege === 'Global' || item.college === selectedCollege;
    return matchesSearch && matchesType && matchesCollege;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-40 font-sans text-[var(--text-primary)]">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-[var(--brand-color)] rounded-xl text-white shadow-xl">
                <HelpCircle size={32} />
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">Lost & Found Hub</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">
                   Helping students recover lost items on campus
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-sm"
                placeholder="Search for an item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="bg-[var(--brand-color)] text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
           >
              <Plus size={18}/> Post an Item
           </button>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-[var(--border-color)] pb-6">
         <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)] shadow-inner">
            {(['All', 'Lost', 'Found'] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === type ? 'bg-[var(--brand-color)] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type}
              </button>
            ))}
         </div>
         <div className="h-6 w-px bg-[var(--border-color)] hidden md:block"></div>
         <select 
           className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:text-[var(--brand-color)] transition-colors"
           value={selectedCollege}
           onChange={(e) => setSelectedCollege(e.target.value as any)}
         >
           <option value="Global">All Hubs</option>
           {COLLEGES.map(c => <option key={c} value={c}>{c} HUB</option>)}
         </select>
      </div>

      {/* MAIN GRID */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className={`group relative bg-white border border-[var(--border-color)] transition-all hover:shadow-xl rounded-2xl flex flex-col overflow-hidden ${item.status === 'Resolved' ? 'opacity-50 grayscale' : ''}`}>
              
              <div className="p-6 space-y-4 flex-1">
                 <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${item.type === 'Lost' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                       {item.type} Item
                    </span>
                    {item.authorId === currentUser.id && (
                       <div className="flex gap-2">
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                          {item.status === 'Open' && <button onClick={() => handleResolve(item.id)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"><CheckCircle2 size={14}/></button>}
                       </div>
                    )}
                 </div>

                 <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[var(--brand-color)] transition-colors leading-tight">{item.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center gap-1"><MapPin size={12} /> {item.location}</div>
                       <div className="flex items-center gap-1"><Clock size={12} /> {item.timestamp}</div>
                    </div>
                 </div>

                 {item.images && item.images.length > 0 && (
                   <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-50">
                      <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   </div>
                 )}

                 <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                   {item.description}
                 </p>
              </div>

              <div className="px-6 py-4 border-t border-[var(--border-color)] bg-slate-50/50 flex items-center justify-between">
                 <div className="flex items-center gap-2 overflow-hidden">
                    <img src={item.authorAvatar} className="w-6 h-6 rounded-full border border-[var(--border-color)] object-cover" />
                    <span className="text-[10px] font-bold text-slate-500 truncate">{item.authorName}</span>
                 </div>
                 {item.status === 'Open' ? (
                   <button 
                     onClick={() => {
                       if (item.authorId === currentUser.id) return;
                       setIsClaiming(item);
                     }}
                     className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${item.type === 'Lost' ? 'bg-rose-600 text-white shadow-md' : 'bg-[var(--brand-color)] text-white shadow-md'} hover:brightness-110 active:scale-95`}
                   >
                     {item.type === 'Lost' ? 'I Found This' : 'This is Mine'} <ArrowUpRight size={12}/>
                   </button>
                 ) : (
                   <span className="text-[9px] font-black uppercase text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14}/> Resolved
                   </span>
                 )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 border-2 border-dashed border-[var(--border-color)] rounded-3xl bg-[var(--bg-secondary)]">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Database size={32} className="text-slate-200" />
           </div>
           <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">No items found</h3>
              <p className="text-[13px] font-medium text-slate-400">There are no posts for this section yet.</p>
           </div>
           <button onClick={() => { setSearch(''); setFilterType('All'); setSelectedCollege('Global'); }} className="px-8 py-2.5 bg-[var(--brand-color)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Clear Filters</button>
        </div>
      )}

      {/* CREATE MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 md:p-10 rounded-3xl shadow-2xl space-y-8 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <h2 className="text-2xl font-black text-slate-900">Post an Item</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={28}/></button>
              </div>
              
              <div className="space-y-6">
                 <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
                    {(['Lost', 'Found'] as const).map(t => (
                      <button 
                        key={t} 
                        onClick={() => setForm({...form, type: t})}
                        className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-[var(--brand-color)] text-white shadow-md' : 'text-slate-500'}`}
                      >
                        I {t} Something
                      </button>
                    ))}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Silver Calculator, Phone Charger" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campus Hub</label>
                        <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none appearance-none" value={form.college} onChange={e => setForm({...form, college: e.target.value as any})}>
                          <option value="Global">Whole Campus</option>
                          {COLLEGES.map(c => <option key={c} value={c}>{c} HUB</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Location</label>
                        <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Main Library Floor 2" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Add a Photo</label>
                    <div className="flex gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-8 border-2 border-dashed border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 transition-all flex flex-col items-center justify-center gap-2 group">
                          {form.image ? (
                             <img src={form.image} className="h-20 w-full object-cover rounded-xl" />
                          ) : (
                             <>
                                <Camera size={24} className="text-slate-400 group-hover:text-[var(--brand-color)]" />
                                <span className="text-[10px] font-bold text-slate-500">Take or Upload Photo</span>
                             </>
                          )}
                       </button>
                       {form.image && <button onClick={() => setForm({...form, image: ''})} className="p-4 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl active:scale-90 transition-all self-center"><X size={20}/></button>}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none h-32 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe identifying marks or details..." />
                 </div>

                 <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                    <AlertCircle size={20} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed">
                       Tip: Don't give away all the details (like passwords or ID numbers) so you can verify the real owner later.
                    </p>
                 </div>

                 <button onClick={handlePost} className="w-full bg-[var(--brand-color)] hover:brightness-110 py-5 rounded-2xl text-white font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Submit Post</button>
              </div>
           </div>
        </div>
      )}

      {/* CLAIM HANDSHAKE MODAL */}
      {isClaiming && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 md:p-10 rounded-3xl shadow-2xl space-y-8 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <h2 className="text-2xl font-black text-slate-900">Message the {isClaiming.type === 'Found' ? 'Finder' : 'Owner'}</h2>
                 <button onClick={() => setIsClaiming(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={28}/></button>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
                    <img src={isClaiming.authorAvatar} className="w-12 h-12 rounded-full border border-[var(--border-color)] object-cover bg-white" />
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect with</p>
                       <p className="text-base font-black text-slate-900 uppercase">{isClaiming.authorName}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase text-[var(--brand-color)] flex items-center gap-2"><ShieldCheck size={16}/> How to claim</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                       You are about to start a private chat with **{isClaiming.authorName}**. Please provide some proof or a description of the item to confirm it belongs to you.
                    </p>
                 </div>

                 <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                    <Info size={20} className="text-emerald-500" />
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">This helps keep the community safe and honest.</p>
                 </div>

                 <button 
                   onClick={() => {
                     onOpenChat(isClaiming.authorId);
                     setIsClaiming(null);
                   }}
                   className="w-full bg-[var(--brand-color)] hover:brightness-110 py-5 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                 >
                   Send a Message
                 </button>
              </div>
           </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default LostAndFound;
