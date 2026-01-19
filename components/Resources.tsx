
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Resource, College } from '../types';
import { 
  FileText, Search, Download, Plus, BookOpen, 
  Filter, GraduationCap, Briefcase, FileCode,
  FileArchive, Clock, Layers, Trash2
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);

  const categories = ['All', 'Past Paper', 'Notes', 'Research', 'Career'];

  useEffect(() => {
    setResources(db.getResources());
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesCollege = selectedCollege === 'All' || res.college === selectedCollege;
    return matchesSearch && matchesCategory && matchesCollege;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'Past Paper': return <FileCode className="text-rose-500" size={24} />;
      case 'Notes': return <FileText className="text-indigo-500" size={24} />;
      case 'Research': return <FileArchive className="text-emerald-500" size={24} />;
      case 'Career': return <Briefcase className="text-amber-500" size={24} />;
      default: return <BookOpen className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 space-y-16 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
           <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter flex items-center gap-4">
             <BookOpen size={56} className="text-indigo-600" />
             Resource Lab
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Academic Signal Repository & Identity Vault</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
              />
           </div>
           <button onClick={() => alert("Upload initialized. Please select document protocol.")} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
              <Plus size={18} /> Initialize Upload
           </button>
        </div>
      </header>

      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-4 border-b border-[var(--border-color)]">
         <div className="flex items-center gap-3 pr-8 border-r border-[var(--border-color)]">
            <Filter size={18} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Filters</span>
         </div>
         <div className="flex gap-3">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600 bg-[var(--bg-secondary)] border border-[var(--border-color)]'}`}
              >
                {cat}
              </button>
            ))}
         </div>
         <div className="h-6 w-px bg-[var(--border-color)]"></div>
         <select 
           value={selectedCollege} 
           onChange={e => setSelectedCollege(e.target.value)}
           className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-6 py-2 text-[9px] font-black uppercase tracking-widest outline-none text-slate-500 cursor-pointer hover:border-indigo-600 transition-all"
         >
            <option value="All">All Wings</option>
            {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
         </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {filteredResources.map(res => (
           <div key={res.id} className="glass-card group bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all p-8 flex flex-col justify-between h-[340px]">
              <div>
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] transition-theme group-hover:scale-110">
                       {getIcon(res.category)}
                    </div>
                    <span className="text-[8px] font-black uppercase bg-indigo-600/10 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-600/20">{res.fileType}</span>
                 </div>
                 <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter line-clamp-2 leading-none mb-3">
                    {res.title}
                 </h3>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Uploaded by: {res.author}</p>
                 <div className="flex items-center gap-3 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><GraduationCap size={12}/> {res.college}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {res.timestamp}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest pt-6 border-t border-[var(--border-color)] transition-theme">
                    <span>{res.downloads.toLocaleString()} Access Logs</span>
                    <Layers size={14}/>
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all">
                    <Download size={16} /> Decrypt & Download
                 </button>
              </div>
           </div>
         ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="py-40 text-center space-y-6">
           <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[var(--border-color)] text-slate-300">
              <Search size={40} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No signals found in the vault</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Refine your search parameters or college wing filter.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
