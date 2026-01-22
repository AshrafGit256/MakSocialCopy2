
import React, { useState, useEffect, useRef } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Resource, College, ResourceType } from '../types';
import { 
  FileText, Search, Download, Plus, BookOpen, 
  Filter, GraduationCap, Briefcase, FileCode,
  FileArchive, Clock, Layers, Trash2, X, ChevronDown,
  ChevronRight, CalendarDays, Book, Eye, Upload, File
} from 'lucide-react';

const CATEGORIES: ResourceType[] = ['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const Resources: React.FC = () => {
  const [currentUser] = useState(db.getUser());
  // FIX: Updated currentCollege state to allow 'Global' to match User.college type
  const [currentCollege, setCurrentCollege] = useState<College | 'Global'>(currentUser.college);
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
  const [isAdding, setIsAdding] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    course: '',
    year: 'Year 1',
    category: 'Notes/Books' as ResourceType,
    fileType: 'PDF' as any,
    fileData: ''
  });

  useEffect(() => {
    setResources(db.getResources());
  }, []);

  const collegeResources = resources.filter(res => res.college === currentCollege);

  const filteredResources = collegeResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesCourse = selectedCourse === 'All' || res.course === selectedCourse;
    const matchesYear = selectedYear === 'All' || res.year === selectedYear;
    return matchesSearch && matchesCategory && matchesCourse && matchesYear;
  });

  const getIcon = (category: ResourceType) => {
    switch (category) {
      case 'Test': return <Clock className="text-amber-500" size={24} />;
      case 'Past Paper': return <FileCode className="text-rose-500" size={24} />;
      case 'Notes/Books': return <Book className="text-indigo-500" size={24} />;
      case 'Research': return <FileArchive className="text-emerald-500" size={24} />;
      case 'Career': return <Briefcase className="text-sky-500" size={24} />;
      default: return <BookOpen className="text-slate-500" size={24} />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm({ 
          ...uploadForm, 
          fileData: reader.result as string,
          fileType: file.name.split('.').pop()?.toUpperCase() as any || 'PDF'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.course) {
      alert("Required Signal: Title and Course must be defined.");
      return;
    }

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title: uploadForm.title,
      category: uploadForm.category,
      college: currentCollege as College, // Manual cast as only specific colleges have vaults
      course: uploadForm.course,
      year: uploadForm.year,
      author: currentUser.name,
      downloads: 0,
      fileType: uploadForm.fileType,
      fileData: uploadForm.fileData,
      timestamp: new Date().toISOString().split('T')[0]
    };

    db.addResource(newResource);
    setResources(db.getResources());
    setIsAdding(false);
    setUploadForm({ title: '', course: '', year: 'Year 1', category: 'Notes/Books', fileType: 'PDF', fileData: '' });
  };

  const handleDownload = (res: Resource) => {
    if (!res.fileData) {
      alert("Asset Data Nullified: No local file content found for this mock entry.");
      return;
    }
    const link = document.createElement('a');
    link.href = res.fileData;
    link.download = `${res.title.replace(/\s+/g, '_')}.${res.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Increment downloads in mock DB
    const updated = resources.map(r => r.id === res.id ? {...r, downloads: r.downloads + 1} : r);
    setResources(updated);
    // Persist if using real local storage logic in db.ts
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 bg-indigo-600/10 text-indigo-600 px-3 py-1.5 rounded-xl w-fit border border-indigo-600/20">
              <GraduationCap size={16}/>
              <span className="text-[10px] font-black uppercase tracking-widest">{currentCollege} WING RESOURCE LAB</span>
           </div>
           <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
             Academic Vault
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Secure Repository for Course Assets & Intelligence</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search vault signals..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
              />
           </div>
           <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95">
              <Plus size={18} /> Initialize Upload
           </button>
        </div>
      </header>

      {/* Dynamic Filters Bar */}
      <div className="glass-card p-6 bg-[var(--sidebar-bg)] border-[var(--border-color)] shadow-sm space-y-6">
         <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Wing Selection</label>
               <select 
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none"
                  value={currentCollege}
                  onChange={(e) => setCurrentCollege(e.target.value as College)}
               >
                  {Object.keys(COURSES_BY_COLLEGE).map(c => <option key={c} value={c}>{c} Wing</option>)}
               </select>
            </div>

            <div className="space-y-2 flex-1 min-w-[200px]">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Logic</label>
               <select 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
               >
                  <option value="All">All Courses in Wing</option>
                  {/* FIX: Guarded COURSES_BY_COLLEGE access against 'Global' value */}
                  {currentCollege !== 'Global' && COURSES_BY_COLLEGE[currentCollege].map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Year Stratum</label>
               <select 
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
               >
                  <option value="All">All Levels</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
            </div>
         </div>

         <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)] overflow-x-auto no-scrollbar">
            <button 
               onClick={() => setSelectedCategory('All')}
               className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[var(--bg-secondary)] text-slate-500'}`}
            >
               All Signals
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[var(--bg-secondary)] text-slate-500 border border-[var(--border-color)] hover:border-indigo-500 hover:text-indigo-600'}`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
         {filteredResources.map(res => (
           <div key={res.id} className="glass-card group bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all flex flex-col justify-between min-h-[380px]">
              <div className="p-8">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] transition-all group-hover:scale-110 group-hover:shadow-lg">
                       {getIcon(res.category)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[8px] font-black uppercase bg-indigo-600 text-white px-2 py-1 rounded shadow-md">{res.fileType}</span>
                       <span className="text-[7px] font-black uppercase text-slate-400">{res.timestamp}</span>
                    </div>
                 </div>

                 <div className="space-y-1 mb-4">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{res.course}</p>
                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter line-clamp-2 leading-tight">
                       {res.title}
                    </h3>
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] font-black uppercase px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 rounded border border-[var(--border-color)]">{res.year}</span>
                    <span className="text-[8px] font-black uppercase px-2 py-1 bg-amber-500/10 text-amber-600 rounded border border-amber-500/20">{res.category}</span>
                 </div>
              </div>

              <div className="p-8 space-y-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-[var(--border-color)]">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-[10px]">{res.author[0]}</div>
                       <div className="min-w-0">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Source</p>
                          <p className="text-[10px] font-bold text-[var(--text-primary)] truncate uppercase">{res.author}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[14px] font-black text-[var(--text-primary)] leading-none">{res.downloads.toLocaleString()}</p>
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Logs</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setPreviewResource(res)}
                      className="flex-1 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600/5 hover:border-indigo-600 transition-all active:scale-95"
                    >
                       <Eye size={14}/> Preview
                    </button>
                    <button 
                      onClick={() => handleDownload(res)}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                       <Download size={14} /> Download
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="py-40 text-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-32 h-32 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[var(--border-color)] text-slate-300">
              <Search size={56} />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter italic">Vault Data Nullified</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">No signals matching your current stratum parameters.</p>
           </div>
           <button onClick={() => { setSelectedCourse('All'); setSelectedYear('All'); setSelectedCategory('All'); setSearchQuery(''); }} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Flush All Filters</button>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-5xl h-[85vh] bg-[var(--sidebar-bg)] p-0 rounded-[3rem] shadow-2xl border-[var(--border-color)] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]/50">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                    {getIcon(previewResource.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
                      {previewResource.title}
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                       {previewResource.course} • {previewResource.year} • {previewResource.fileType} Format
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDownload(previewResource)}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                     <Download size={18} /> Confirm Download
                  </button>
                  <button onClick={() => setPreviewResource(null)} className="text-slate-500 hover:text-rose-500 transition-colors p-2">
                    <X size={28}/>
                  </button>
               </div>
            </div>
            
            <div className="flex-1 bg-slate-900/50 flex items-center justify-center p-12 overflow-hidden">
               {previewResource.fileData ? (
                  previewResource.fileType === 'PDF' ? (
                    <iframe 
                      src={previewResource.fileData} 
                      className="w-full h-full rounded-2xl border-4 border-white shadow-2xl bg-white"
                      title="Asset Preview"
                    />
                  ) : (
                    <div className="text-center space-y-6">
                       <div className="p-10 bg-white/10 rounded-full border border-white/20 text-white/40 mx-auto w-fit">
                          <File size={80}/>
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Native Preview Unavailable</h4>
                          <p className="text-sm text-slate-400 font-medium">This document format ({previewResource.fileType}) requires external decryption. Please download to view.</p>
                       </div>
                    </div>
                  )
               ) : (
                  <div className="text-center space-y-4">
                    <div className="p-8 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-500 mx-auto w-fit">
                       <ShieldAlert size={48}/>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Intelligence Signal Nullified</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Asset data not cached in local stratum.</p>
                    </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-xl bg-[var(--sidebar-bg)] p-10 rounded-[3rem] shadow-2xl border-[var(--border-color)] overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">
                  Asset Manifest
                </h2>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Initialize University Knowledge Synchronization</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors p-2">
                <X size={28}/>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Document Protocol Title</label>
                <input
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none focus:border-indigo-600 transition-all font-bold"
                  placeholder="e.g. Data Structures Test 1 - 2024"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Unit (Course)</label>
                <select 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold appearance-none"
                  value={uploadForm.course}
                  onChange={e => setUploadForm({ ...uploadForm, course: e.target.value })}
                >
                  <option value="">Select Target Course</option>
                  {/* FIX: Guarded COURSES_BY_COLLEGE access against 'Global' value */}
                  {currentCollege !== 'Global' && COURSES_BY_COLLEGE[currentCollege].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Year Stratum</label>
                   <select 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold appearance-none"
                     value={uploadForm.year}
                     onChange={e => setUploadForm({ ...uploadForm, year: e.target.value })}
                   >
                     {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
                   <select 
                     className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold appearance-none"
                     value={uploadForm.category}
                     onChange={e => setUploadForm({ ...uploadForm, category: e.target.value as ResourceType })}
                   >
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Asset Selection (PDF/DOCX)</label>
                <div className="flex gap-4">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="flex-1 p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-3 group"
                   >
                      {uploadForm.fileData ? (
                         <div className="flex items-center gap-3">
                            <FileCheck size={24} className="text-emerald-500" />
                            <div className="text-left">
                               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Uploaded</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Format: {uploadForm.fileType}</p>
                            </div>
                         </div>
                      ) : (
                         <>
                            <Upload size={24} className="text-slate-400 group-hover:text-indigo-600" />
                            <span className="text-[9px] font-black uppercase text-slate-500">Pick Signal from Device</span>
                         </>
                      )}
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileSelect} 
                     accept=".pdf,.docx,.pptx,.zip" 
                     className="hidden" 
                   />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleUpload}
                  className="w-full bg-indigo-600 py-6 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Plus size={20}/> Push Asset to Vault
                </button>
                <p className="text-[8px] font-black text-slate-500 uppercase text-center mt-6 tracking-[0.2em]">Synchronizing with the {currentCollege} Central Registry</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon helper
const FileCheck = ({size, className}: {size: number, className: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="m9 15 2 2 4-4"/>
  </svg>
);

const ShieldAlert = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default Resources;
