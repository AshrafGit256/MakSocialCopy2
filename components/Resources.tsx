
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Resource, College, ResourceType } from '../types';
import { 
  FileText, Search, Download, Plus, BookOpen, 
  Filter, GraduationCap, Briefcase, FileCode,
  FileArchive, Clock, Layers, Trash2, X, ChevronDown,
  ChevronRight, CalendarDays, Book, Eye, Upload, File,
  Database, Shield, Fingerprint, Activity, Server,
  Lock, ArrowUpRight, FilterX, UserCheck
} from 'lucide-react';

const CATEGORIES: ResourceType[] = ['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const Resources: React.FC = () => {
  const [currentUser] = useState(db.getUser());
  const [currentCollege, setCurrentCollege] = useState<College | 'Global'>(currentUser.college);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
  const [isAdding, setIsAdding] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [addForm, setAddForm] = useState({ 
    title: '', 
    course: '', 
    year: 'Year 1', 
    category: 'Notes/Books' as ResourceType,
    fileData: null as string | null,
    fileName: null as string | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => {
      setResources(db.getResources());
    };
    sync();
    const interval = setInterval(sync, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesCollege = currentCollege === 'Global' || res.college === currentCollege;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const matchesCourse = selectedCourse === 'All' || res.course === selectedCourse;
      const matchesYear = selectedYear === 'All' || res.year === selectedYear;
      return matchesCollege && matchesSearch && matchesCategory && matchesCourse && matchesYear;
    });
  }, [resources, currentCollege, searchQuery, selectedCategory, selectedCourse, selectedYear]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAddForm({
          ...addForm,
          fileData: event.target?.result as string,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (res: Resource) => {
    if (res.fileData) {
      const link = document.createElement('a');
      link.href = res.fileData;
      link.download = res.title || 'academic_asset';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    alert(`Initiating decryption for ${res.title}. Contributor: ${res.author} [${res.authorRole}] [Status: Verified]`);
    const updated = resources.map(r => r.id === res.id ? {...r, downloads: r.downloads + 1} : r);
    setResources(updated);
  };

  const handleAddResource = () => {
    if (!addForm.title || !addForm.fileData) return;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRes: Resource = {
      id: Date.now().toString(),
      title: addForm.title,
      category: addForm.category,
      college: currentCollege === 'Global' ? currentUser.college : currentCollege,
      course: addForm.course || 'General',
      year: addForm.year,
      author: currentUser.name,
      authorRole: currentUser.role || 'Verified Node',
      downloads: 0,
      fileType: 'PDF',
      fileData: addForm.fileData || undefined,
      timestamp: formattedDate
    };
    db.saveResource(newRes);
    setResources(db.getResources());
    setIsAdding(false);
    setAddForm({ title: '', course: '', year: 'Year 1', category: 'Notes/Books', fileData: null, fileName: null });
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 pb-40 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--brand-color)] rounded-md shadow-lg text-white">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter leading-none">The.Vault</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Sector: {currentCollege} Wing / Nodes: {filteredResources.length}</p>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Query Alphanumeric Manifest..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2.5 pl-10 pr-4 text-[11px] font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-color)] shadow-sm"
            />
          </div>
          <button onClick={() => setIsAdding(true)} className="px-4 py-2.5 bg-[var(--brand-color)] hover:brightness-110 text-white rounded-md text-[10px] font-bold uppercase flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <Plus size={14} /> New.Log
          </button>
        </div>
      </header>

      {/* 2. FILTER MATRIX */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md mb-8 divide-y divide-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-bold uppercase text-slate-500">Wing.Sector</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[10px] font-bold uppercase text-[var(--text-primary)] outline-none cursor-pointer"
              value={currentCollege}
              onChange={e => { setCurrentCollege(e.target.value as any); handleScan(); }}
            >
              <option value="Global">Universal Hub</option>
              {Object.keys(COURSES_BY_COLLEGE).map(c => <option key={c} value={c}>{c} Wing</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-bold uppercase text-slate-500">Course.Logic</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[10px] font-bold uppercase text-[var(--text-primary)] outline-none cursor-pointer"
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); handleScan(); }}
            >
              <option value="All">Full Manifest</option>
              {currentCollege !== 'Global' && COURSES_BY_COLLEGE[currentCollege as College].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-bold uppercase text-slate-500">Year.Stratum</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[10px] font-bold uppercase text-[var(--text-primary)] outline-none cursor-pointer"
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); handleScan(); }}
            >
              <option value="All">All Levels</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="p-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => { setSelectedCategory('All'); handleScan(); }}
            className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase transition-all border ${selectedCategory === 'All' ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-white shadow-md' : 'bg-transparent border-[var(--border-color)] text-slate-500 hover:text-[var(--text-primary)]'}`}
          >
            All Signals
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat); handleScan(); }}
              className={`px-4 py-1.5 rounded-sm text-[9px] font-bold uppercase transition-all border ${selectedCategory === cat ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-white shadow-md' : 'bg-transparent border-[var(--border-color)] text-slate-500 hover:text-[var(--text-primary)]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. REGISTRY STREAM */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md overflow-hidden relative shadow-sm">
        {isScanning && (
          <div className="absolute inset-0 z-10 bg-[var(--bg-primary)]/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-[var(--brand-color)]">
               <Activity size={18} className="animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sector Scan Active...</span>
            </div>
          </div>
        )}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)] text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-[var(--border-color)]">
                <th className="px-6 py-4">Asset.Identifier</th>
                <th className="px-6 py-4">Node.Source</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Registry.Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Uplink</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <tr key={res.id} className="group hover:bg-[var(--bg-secondary)] transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-sm border ${
                        res.category === 'Past Paper' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' :
                        res.category === 'Research' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                        'border-[var(--brand-color)]/30 text-[var(--brand-color)] bg-[var(--brand-color)]/5'
                      }`}>
                         <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight group-hover:text-[var(--brand-color)] transition-colors">{res.title}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{res.course}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2">
                          <Fingerprint size={12} className="text-slate-400" />
                          <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight">{res.author}</span>
                       </div>
                       <span className="text-[8px] font-bold text-[var(--brand-color)] uppercase ml-5 opacity-70 tracking-widest">{res.authorRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[9px] font-bold text-[var(--brand-color)] uppercase">{res.college}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={12}/>
                       <span className="text-[9px] font-bold uppercase">{res.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 border border-[var(--border-color)] text-slate-500 rounded-sm">
                      {res.category === 'Test' ? '[EVAL]' : res.category === 'Past Paper' ? '[PATCH]' : '[STABLE]'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setPreviewResource(res)}
                        className="p-1.5 hover:bg-[var(--brand-color)]/10 rounded-md text-slate-400 hover:text-[var(--brand-color)] transition-colors"
                      >
                        <Eye size={14}/>
                      </button>
                      <button 
                        onClick={() => handleDownload(res)}
                        className="px-3 py-1.5 bg-[var(--brand-color)] hover:brightness-110 text-white text-[9px] font-bold uppercase rounded-md transition-all flex items-center gap-2 shadow-sm active:scale-95"
                      >
                        <Download size={12}/> Sync
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center space-y-4">
                    <FilterX size={32} className="mx-auto text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol.Silence / Manifest Nullified</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-[var(--border-color)]">
          {filteredResources.length > 0 ? filteredResources.map(res => (
            <div key={res.id} className="p-5 space-y-4 hover:bg-[var(--bg-secondary)] transition-all">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-sm border ${
                        res.category === 'Past Paper' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' :
                        res.category === 'Research' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                        'border-[var(--brand-color)]/30 text-[var(--brand-color)] bg-[var(--brand-color)]/5'
                      }`}>
                         <FileText size={16} />
                    </div>
                    <div>
                       <p className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{res.title}</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{res.course} • {res.college}</p>
                    </div>
                  </div>
               </div>
               <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-1.5 text-slate-500">
                        <Fingerprint size={10}/>
                        <span className="text-[8px] font-bold uppercase">{res.author} ({res.authorRole})</span>
                     </div>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{res.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setPreviewResource(res)} className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md text-slate-500"><Eye size={14}/></button>
                     <button onClick={() => handleDownload(res)} className="px-4 py-2 bg-[var(--brand-color)] text-white text-[9px] font-bold uppercase rounded-md flex items-center gap-2 shadow-md active:scale-95"><Download size={12}/> Sync</button>
                  </div>
               </div>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4">
              <FilterX size={32} className="mx-auto text-slate-300" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manifest Nullified</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 rounded-md shadow-2xl space-y-6 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
                 <div className="flex items-center gap-2">
                    <Database size={16} className="text-[var(--brand-color)]" />
                    <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Asset.Synchronization</h2>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                 {/* FILE SELECTOR (PROMINENT) */}
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">1. Document_Container</label>
                    <div className="relative group">
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 transition-all ${
                            addForm.fileData 
                            ? 'bg-[var(--brand-color)]/10 border-[var(--brand-color)]' 
                            : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5'
                         }`}
                       >
                          <div className={`p-4 rounded-full ${addForm.fileData ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                             <Upload size={24} />
                          </div>
                          <div className="text-center">
                             <p className={`text-[11px] font-black uppercase tracking-widest ${addForm.fileData ? 'text-[var(--brand-color)]' : 'text-slate-500'}`}>
                                {addForm.fileName || 'Initialize Device Uplink'}
                             </p>
                             <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">PDF, DOCX, PPTX, ZIP (MAX 25MB)</p>
                          </div>
                       </button>
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="hidden"
                       />
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         onChange={handleFileSelect}
                         accept=".pdf,.doc,.docx,.pptx,.zip"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">2. Asset_Metadata</label>
                    <div className="space-y-3">
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-color)] transition-all" 
                         value={addForm.title} 
                         onChange={e => setAddForm({...addForm, title: e.target.value})} 
                         placeholder="Asset Identity (e.g. Distributed Systems Final Notes)" 
                       />
                       <div className="grid grid-cols-2 gap-3">
                          <input 
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-color)] transition-all" 
                            value={addForm.course} 
                            onChange={e => setAddForm({...addForm, course: e.target.value})} 
                            placeholder="Course Code" 
                          />
                          <select 
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-xs font-bold text-[var(--text-primary)] outline-none" 
                            value={addForm.category} 
                            onChange={e => setAddForm({...addForm, category: e.target.value as ResourceType})}
                          >
                             {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 bg-[var(--brand-color)]/5 border border-dashed border-[var(--brand-color)]/20 rounded-md space-y-2">
                    <div className="flex items-center gap-2">
                       <UserCheck size={14} className="text-[var(--brand-color)]" />
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">Identity Verification</p>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">
                       Logging contribution as <span className="text-[var(--brand-color)] font-black">"{currentUser.name}"</span> with role <span className="text-[var(--brand-color)] font-black">[{currentUser.role}]</span>. 
                       Timestamp will be synchronized with central university time.
                    </p>
                 </div>

                 <button 
                   onClick={handleAddResource} 
                   className="w-full bg-[var(--brand-color)] hover:brightness-110 py-4 rounded-md text-white font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[var(--brand-color)]/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                   disabled={!addForm.title || !addForm.fileData}
                 >
                   Commit Protocol to Vault
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-3xl rounded-md shadow-2xl flex flex-col border border-[var(--border-color)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center bg-[var(--bg-secondary)] gap-4">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-[var(--brand-color)] rounded-md text-white"><FileText size={20} /></div>
                    <div>
                      <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">{previewResource.title}</h2>
                      <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{previewResource.course} / STRATUM: {previewResource.category}</p>
                    </div>
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto">
                   <button onClick={() => handleDownload(previewResource)} className="flex-1 sm:flex-none px-5 py-2 bg-[var(--brand-color)] text-white rounded-md text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all"><Download size={12}/> Sync.Asset</button>
                   <button onClick={() => setPreviewResource(null)} className="p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
                 </div>
              </div>
              <div className="flex-1 p-10 bg-slate-50 dark:bg-[#0d1117] flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                 <div className="relative">
                    <div className="p-12 bg-white dark:bg-black/40 border border-[var(--border-color)] rounded-[3rem] shadow-2xl relative z-10">
                       <FileText size={100} className="text-[var(--brand-color)] opacity-40 animate-pulse" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--brand-color)]/10 blur-[40px] rounded-full"></div>
                 </div>
                 
                 <div className="text-center space-y-6 max-w-md">
                    <div className="space-y-2">
                       <p className="text-sm font-black uppercase text-[var(--text-primary)] tracking-widest">{previewResource.title}</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em]">Asset_Status: Verified_Stable</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-dashed border-[var(--border-color)]">
                       <div className="text-center border-r border-[var(--border-color)]">
                          <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Source Node</p>
                          <p className="text-[10px] font-black text-[var(--brand-color)] uppercase">{previewResource.author}</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">[{previewResource.authorRole}]</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Registry Log</p>
                          <p className="text-[10px] font-black text-[var(--text-primary)] uppercase">{previewResource.timestamp}</p>
                          <p className="text-[8px] font-bold text-emerald-600 uppercase mt-0.5">Verified Commit</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleDownload(previewResource)}
                      className="w-full py-4 bg-[var(--bg-primary)] border border-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                       Initialize Decryption <ArrowUpRight size={16}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
