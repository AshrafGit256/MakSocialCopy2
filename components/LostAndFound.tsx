
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { LostFoundItem, User, College } from '../types';
import { 
  HelpCircle, Search, Plus, MapPin, Clock, 
  MessageSquare, Trash2, CheckCircle2, 
  Camera, X, Globe, Filter, ShieldCheck, 
  AlertCircle, ArrowUpRight, Terminal, Database,
  ArrowLeft, Info
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const SHA_GEN = () => Math.random().toString(16).substring(2, 6).toUpperCase();

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
    if (window.confirm("Diagnostic: Proceed with permanent signal deletion from registry?")) {
      db.deleteLostFound(id);
      setItems(db.getLostFound());
    }
  };

  const handleResolve = (id: string) => {
    db.resolveLostFound(id);
    setItems(db.getLostFound());
    alert("Protocol Synchronized: Item marked as resolved.");
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesCollege = selectedCollege === 'Global' || item.college === selectedCollege;
    return matchesSearch && matchesType && matchesCollege;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-40 font-mono text-[var(--text-primary)]">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-indigo-600 rounded-none text-white shadow-2xl">
                <HelpCircle size={32} />
             </div>
             <div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Property_Vault</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2 flex items-center gap-2">
                   <Database size={14}/> Recovery & Lost Signal Registry
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none py-3.5 pl-12 pr-4 text-sm font-bold uppercase outline-none focus:border-indigo-600 transition-all shadow-inner"
                placeholder="Query Registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="bg-indigo-600 text-white px-8 py-3.5 rounded-none font-black text-[10px] uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
           >
              <Plus size={18}/> Broadcast Signal
           </button>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-[var(--border-color)] pb-6">
         <div className="flex bg-[var(--bg-secondary)] p-1 rounded-none border border-[var(--border-color)] shadow-inner">
            {(['All', 'Lost', 'Found'] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type}
              </button>
            ))}
         </div>
         <div className="h-6 w-px bg-[var(--border-color)] hidden md:block"></div>
         <select 
           className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
           value={selectedCollege}
           onChange={(e) => setSelectedCollege(e.target.value as any)}
         >
           <option value="Global">Universal HUB</option>
           {COLLEGES.map(c => <option key={c} value={c}>{c} WING</option>)}
         </select>
      </div>

      {/* MAIN GRID */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className={`group relative bg-white dark:bg-[#0a0a0a] border-l-4 transition-all hover:shadow-2xl flex flex-col ${item.status === 'Resolved' ? 'opacity-50 grayscale border-slate-400' : item.type === 'Lost' ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.05)]' : 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]'}`}>
              
              <div className="p-6 space-y-5 flex-1">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${item.type === 'Lost' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                          {item.type} Node
                       </span>
                       <p className="text-[8px] font-mono text-slate-400">MANIFEST_ID: {item.id.slice(-6)}</p>
                    </div>
                    {item.authorId === currentUser.id && (
                       <div className="flex gap-2">
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                          {item.status === 'Open' && <button onClick={() => handleResolve(item.id)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"><CheckCircle2 size={14}/></button>}
                       </div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400"/> {item.location}</div>
                       <div className="flex items-center gap-1"><Clock size={12} className="text-slate-400"/> {item.timestamp}</div>
                    </div>
                 </div>

                 {item.images && item.images.length > 0 && (
                   <div className="aspect-video rounded-none overflow-hidden border border-[var(--border-color)] bg-slate-100 dark:bg-white/5">
                      <img src={item.images[0]} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
                   </div>
                 )}

                 <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans line-clamp-3">
                   "{item.description}"
                 </p>
              </div>

              <div className="px-6 py-4 border-t border-[var(--border-color)] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <img src={item.authorAvatar} className="w-7 h-7 rounded-full border border-[var(--border-color)]" />
                    <span className="text-[10px] font-black uppercase text-slate-400 truncate">{item.authorName}</span>
                 </div>
                 {item.status === 'Open' ? (
                   <button 
                     onClick={() => {
                       if (item.authorId === currentUser.id) return;
                       setIsClaiming(item);
                     }}
                     className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${item.type === 'Lost' ? 'bg-rose-600 text-white shadow-rose-600/20' : 'bg-emerald-600 text-white shadow-emerald-600/20'} hover:brightness-110 active:scale-95`}
                   >
                     {item.type === 'Lost' ? 'I Found This' : 'Initiate Claim'} <ArrowUpRight size={12}/>
                   </button>
                 ) : (
                   <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                      <CheckCircle2 size={12}/> Resolved
                   </span>
                 )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 border border-dashed border-[var(--border-color)] rounded-none bg-[var(--bg-secondary)]">
           <Database size={48} className="mx-auto text-slate-200" />
           <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tighter">Manifest_Empty</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active signals detected for this sector.</p>
           </div>
           <button onClick={() => { setSearch(''); setFilterType('All'); setSelectedCollege('Global'); }} className="px-8 py-2 bg-indigo-600 text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reset Sync</button>
        </div>
      )}

      {/* CREATE MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 md:p-12 rounded-none shadow-2xl space-y-10 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-8">
                 <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-600">Initialize_Signal</h2>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500"><X size={32}/></button>
              </div>
              
              <div className="space-y-8">
                 <div className="flex bg-[var(--bg-secondary)] p-1 border border-[var(--border-color)]">
                    {(['Lost', 'Found'] as const).map(t => (
                      <button 
                        key={t} 
                        onClick={() => setForm({...form, type: t})}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property_Identifier</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all shadow-inner" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Silver Calculator, iPhone 13" />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol_Sector</label>
                    <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none p-4 text-sm font-bold outline-none" value={form.college} onChange={e => setForm({...form, college: e.target.value as any})}>
                       <option value="Global">Universal HUB</option>
                       {COLLEGES.map(c => <option key={c} value={c}>{c} HUB</option>)}
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last_Coordinates</label>
                    <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none p-4 text-sm font-bold outline-none focus:border-indigo-600 transition-all" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Main Hall Basement" />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual_Asset_Log</label>
                    <div className="flex gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-6 border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-2 group">
                          {form.image ? (
                             <img src={form.image} className="h-20 w-full object-cover" />
                          ) : (
                             <>
                                <Camera size={24} className="text-slate-400 group-hover:text-indigo-600" />
                                <span className="text-[9px] font-black uppercase text-slate-500">Pick From Device</span>
                             </>
                          )}
                       </button>
                       {form.image && <button onClick={() => setForm({...form, image: ''})} className="p-4 bg-rose-500 text-white rounded-none active:scale-90 transition-all"><X size={20}/></button>}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manifest_Directives</label>
                    <textarea className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-none p-4 text-sm font-bold outline-none h-32 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe identifying parameters..." />
                 </div>

                 <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-none flex items-start gap-4">
                    <AlertCircle size={20} className="text-amber-500 shrink-0" />
                    <p className="text-[9px] text-amber-700 font-bold uppercase leading-relaxed">
                       Security Advisory: Do not disclose precise identifying keys for valuable items. Verify ownership via secondary descriptive handshake.
                    </p>
                 </div>

                 <button onClick={handlePost} className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-none text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Broadcast Signal to Registry</button>
              </div>
           </div>
        </div>
      )}

      {/* CLAIM HANDSHAKE MODAL */}
      {isClaiming && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 md:p-12 rounded-none shadow-2xl space-y-8 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-600">Handshake_Init</h2>
                 <button onClick={() => setIsClaiming(null)} className="text-slate-400 hover:text-rose-500"><X size={32}/></button>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <img src={isClaiming.authorAvatar} className="w-12 h-12 rounded-full border border-[var(--border-color)]" />
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Establishing Uplink With</p>
                       <p className="text-sm font-black uppercase">{isClaiming.authorName}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2"><ShieldCheck size={14}/> Verification Protocol</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                       "You are about to initiate a private communication handshake. You will be redirected to the secure messaging portal to provide proof of ownership for **{isClaiming.title}**."
                    </p>
                 </div>

                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-none flex items-center gap-4">
                    <Info size={20} className="text-emerald-500" />
                    <p className="text-[9px] text-emerald-600 font-bold uppercase">Signal logic matched. Encryption valid.</p>
                 </div>

                 <button 
                   onClick={() => {
                     onOpenChat(isClaiming.authorId);
                     setIsClaiming(null);
                   }}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Establish Secure Uplink
                 </button>
              </div>
           </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LostAndFound;
