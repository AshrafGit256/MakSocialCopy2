
import React, { useState, useEffect, useRef } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Resource, College, ResourceType } from '../types';
import { 
  FileText, Search, Download, Plus, BookOpen, 
  Briefcase, FileCode, FileArchive, Clock, Layers, 
  X, ChevronRight, Book, Eye, Upload, Folder, 
  Home, History, Database, ArrowLeft, ShieldAlert,
  Zap, Filter, GraduationCap
} from 'lucide-react';

const CATEGORIES: ResourceType[] = ['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'];
const VAULT_YEARS = ['2021', '2022', '2023', '2024', '2025'];
const STUDY_YEARS = ['Year I', 'Year II', 'Year III', 'Year IV', 'Year V'];
const SEMESTERS = ['Semester 1', 'Semester 2'] as const;

type VaultView = 'years' | 'courses' | 'studyLevels' | 'semesters' | 'files';

const Resources: React.FC = () => {
  const [currentUser] = useState(db.getUser());
  const [currentCollege] = useState<College>(currentUser.college);
  const [resources, setResources] = useState<Resource[]>(db.getResources());
  
  // Hierarchy Navigation State
  const [view, setView] = useState<VaultView>('years');
  const [selectedVaultYear, setSelectedVaultYear] = useState<string | null>(null);
  const [selectedVaultCourse, setSelectedVaultCourse] = useState<string | null>(null);
  const [selectedStudyYear, setSelectedStudyYear] = useState<string | null>(null);
  const [selectedVaultSemester, setSelectedVaultSemester] = useState<'Semester 1' | 'Semester 2' | null>(null);

  // Discovery / Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDiscoveryCategory, setActiveDiscoveryCategory] = useState<string>('All');
  
  const [isAdding, setIsAdding] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    course: '',
    academicYear: '2025',
    yearOfStudy: 'Year I',
    semester: 'Semester 1' as 'Semester 1' | 'Semester 2',
    category: 'Notes/Books' as ResourceType,
    fileType: 'PDF' as any,
    fileData: ''
  });

  useEffect(() => {
    setResources(db.getResources());
  }, []);

  // Simplified Filtering Logic
  const getFilteredFiles = () => {
    let base = resources.filter(res => res.college === currentCollege);

    // Discovery Mode: If user is searching or has a category selected (not All), show direct results
    if (searchQuery.trim() || activeDiscoveryCategory !== 'All') {
      return base.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              res.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeDiscoveryCategory === 'All' || res.category === activeDiscoveryCategory;
        return matchesSearch && matchesCategory;
      });
    }

    // Strict Hierarchy Mode
    if (selectedVaultYear) base = base.filter(r => r.academicYear === selectedVaultYear);
    if (selectedVaultCourse) base = base.filter(r => r.course === selectedVaultCourse);
    if (selectedStudyYear) base = base.filter(r => r.yearOfStudy === selectedStudyYear);
    if (selectedVaultSemester) base = base.filter(r => r.semester === selectedVaultSemester);

    return base;
  };

  const currentFiles = getFilteredFiles();
  const isDiscoveryMode = searchQuery.trim() !== '' || activeDiscoveryCategory !== 'All';

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
    if (!uploadForm.title || !uploadForm.course || !uploadForm.fileData) {
      alert("Missing data. Title, Course, and File are required.");
      return;
    }

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title: uploadForm.title,
      category: uploadForm.category,
      college: currentCollege,
      course: uploadForm.course,
      academicYear: uploadForm.academicYear,
      semester: uploadForm.semester,
      yearOfStudy: uploadForm.yearOfStudy, 
      author: currentUser.name,
      downloads: 0,
      fileType: uploadForm.fileType,
      fileData: uploadForm.fileData,
      timestamp: new Date().toISOString().split('T')[0]
    };

    db.addResource(newResource);
    setResources(db.getResources());
    setIsAdding(false);
    setUploadForm({ title: '', course: '', academicYear: '2025', yearOfStudy: 'Year I', semester: 'Semester 1', category: 'Notes/Books', fileType: 'PDF', fileData: '' });
  };

  const resetHierarchy = () => {
    setView('years');
    setSelectedVaultYear(null);
    setSelectedVaultCourse(null);
    setSelectedStudyYear(null);
    setSelectedVaultSemester(null);
    setSearchQuery('');
    setActiveDiscoveryCategory('All');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 space-y-12 pb-40">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 bg-indigo-600/10 text-indigo-600 px-3 py-1.5 rounded-xl w-fit border border-indigo-600/20">
              <Database size={16}/>
              <span className="text-[10px] font-black uppercase tracking-widest">{currentCollege} CENTRAL REGISTRY</span>
           </div>
           <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
             Academic Vault
           </h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Archive Synchronized since Epoch 2021</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Scan Course or Asset Title..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
              />
           </div>
           <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-3 hover:bg-indigo-700 transition-all active:scale-95">
              <Plus size={18} /> Push Asset
           </button>
        </div>
      </header>

      {/* Simplified Filter Chips - One click discovery */}
      <div className="flex flex-col space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quick Discovery Mode</label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setActiveDiscoveryCategory('All')} 
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeDiscoveryCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-slate-500'}`}
          >
            Browse Hierarchy
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => {
                setActiveDiscoveryCategory(cat);
                // Fix: Removed unnecessary check 'cat !== All' since CATEGORIES only contains ResourceType values, and 'All' is not one of them.
                setSearchQuery(''); 
              }} 
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeDiscoveryCategory === cat ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-secondary)] text-slate-500 border-[var(--border-color)] hover:border-indigo-500'}`}
            >
              All {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumbs / Path */}
      {!isDiscoveryMode && (
        <nav className="flex items-center gap-3 overflow-x-auto no-scrollbar py-4 border-b border-[var(--border-color)]">
           <button onClick={resetHierarchy} className="p-2 bg-[var(--bg-secondary)] rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"><Home size={18}/></button>
           <ChevronRight size={14} className="text-slate-300"/>
           <button onClick={() => setView('years')} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'years' ? 'text-indigo-600' : 'text-slate-400'}`}>Timeline</button>
           
           {selectedVaultYear && (
             <>
              <ChevronRight size={14} className="text-slate-300"/>
              <button onClick={() => setView('courses')} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'courses' ? 'text-indigo-600' : 'text-slate-400'}`}>{selectedVaultYear}</button>
             </>
           )}
           {selectedVaultCourse && (
             <>
              <ChevronRight size={14} className="text-slate-300"/>
              <button onClick={() => setView('studyLevels')} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'studyLevels' ? 'text-indigo-600' : 'text-slate-400'}`}>{selectedVaultCourse}</button>
             </>
           )}
           {selectedStudyYear && (
             <>
              <ChevronRight size={14} className="text-slate-300"/>
              <button onClick={() => setView('semesters')} className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${view === 'semesters' ? 'text-indigo-600' : 'text-slate-400'}`}>{selectedStudyYear}</button>
             </>
           )}
           {selectedVaultSemester && (
             <>
              <ChevronRight size={14} className="text-slate-300"/>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 whitespace-nowrap">{selectedVaultSemester}</span>
             </>
           )}
        </nav>
      )}

      {/* Hierarchy Explorer */}
      {!isDiscoveryMode && (
        <div className="animate-in fade-in duration-500">
           {view === 'years' && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {VAULT_YEARS.map(y => (
                  <button key={y} onClick={() => { setSelectedVaultYear(y); setView('courses'); }} className="glass-card group p-10 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-600 hover:shadow-2xl transition-all flex flex-col items-center gap-6">
                     <div className="w-16 h-16 bg-indigo-600/5 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><History size={32} /></div>
                     <span className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{y}</span>
                  </button>
                ))}
             </div>
           )}

           {view === 'courses' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <button onClick={() => setView('years')} className="glass-card p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 transition-all"><ArrowLeft size={32}/><span className="text-[10px] font-black uppercase">Back</span></button>
                {COURSES_BY_COLLEGE[currentCollege].map(c => (
                  <button key={c} onClick={() => { setSelectedVaultCourse(c); setView('studyLevels'); }} className="glass-card group p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-600 transition-all text-left">
                     <Folder className="text-slate-300 group-hover:text-indigo-600 mb-4 transition-colors" size={32} fill="currentColor"/>
                     <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{c}</h3>
                  </button>
                ))}
             </div>
           )}

           {view === 'studyLevels' && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <button onClick={() => setView('courses')} className="glass-card p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 transition-all"><ArrowLeft size={32}/></button>
                {STUDY_YEARS.map(sy => (
                  <button key={sy} onClick={() => { setSelectedStudyYear(sy); setView('semesters'); }} className="glass-card group p-10 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-600 transition-all flex flex-col items-center gap-6">
                     <div className="w-16 h-16 bg-emerald-600/5 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><GraduationCap size={32} /></div>
                     <span className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{sy}</span>
                  </button>
                ))}
             </div>
           )}

           {view === 'semesters' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {SEMESTERS.map(sem => (
                  <button key={sem} onClick={() => { setSelectedVaultSemester(sem); setView('files'); }} className="glass-card group p-12 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-600 transition-all flex flex-col items-center gap-6">
                     <Layers className="text-indigo-600" size={48}/>
                     <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{sem}</h3>
                  </button>
                ))}
             </div>
           )}
        </div>
      )}

      {/* Discovery Results / File View */}
      {(view === 'files' || isDiscoveryMode) && (
        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
                 <Zap className="text-indigo-600" size={24}/> 
                 {isDiscoveryMode ? `Discovery: ${activeDiscoveryCategory}s` : `${selectedVaultCourse} • ${selectedStudyYear} • ${selectedVaultSemester}`}
              </h3>
              {isDiscoveryMode && (
                <button onClick={resetHierarchy} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Exit Discovery</button>
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentFiles.map(res => (
                <div key={res.id} className="glass-card group bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500/50 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between min-h-[380px]">
                   <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">{getIcon(res.category)}</div>
                         <div className="text-right">
                            <span className="text-[8px] font-black uppercase bg-indigo-600 text-white px-2 py-1 rounded">{res.fileType}</span>
                            <p className="text-[7px] font-black uppercase text-slate-400 mt-2">{res.academicYear} • {res.yearOfStudy}</p>
                         </div>
                      </div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{res.course}</p>
                      <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tighter line-clamp-2 leading-tight mt-1">{res.title}</h3>
                   </div>
                   <div className="p-8 space-y-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-[var(--border-color)]">
                      <div className="flex items-center justify-between mb-2">
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{res.author}</p>
                         <p className="text-[10px] font-black text-[var(--text-primary)]">{res.downloads} Logs</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setPreviewResource(res)} className="flex-1 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600/5 hover:border-indigo-600 transition-all"><Eye size={14}/> Preview</button>
                         <button onClick={() => {}} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"><Download size={14} /> Fetch</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           {currentFiles.length === 0 && (
             <div className="py-20 text-center space-y-4">
                <ShieldAlert className="mx-auto text-slate-300" size={48}/>
                <p className="text-slate-500 font-black uppercase text-xs tracking-widest">No assets found in this stratum.</p>
             </div>
           )}
        </div>
      )}

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[250] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-xl bg-[var(--sidebar-bg)] p-10 rounded-[3rem] shadow-2xl border-[var(--border-color)] overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">Vault Ingest</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={28}/></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Signal Title</label>
                <input className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] text-sm outline-none font-bold" placeholder="e.g. Intro to Logic Notes" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Course ID</label>
                  <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={uploadForm.course} onChange={e => setUploadForm({ ...uploadForm, course: e.target.value })}>
                    <option value="">Select Course</option>
                    {COURSES_BY_COLLEGE[currentCollege].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
                   <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value as ResourceType })}>
                     {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Calendar Year</label>
                   <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={uploadForm.academicYear} onChange={e => setUploadForm({ ...uploadForm, academicYear: e.target.value })}>
                     {VAULT_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Year of Study</label>
                   <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={uploadForm.yearOfStudy} onChange={e => setUploadForm({ ...uploadForm, yearOfStudy: e.target.value })}>
                     {STUDY_YEARS.map(sy => <option key={sy} value={sy}>{sy}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Semester</label>
                   <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none" value={uploadForm.semester} onChange={e => setUploadForm({ ...uploadForm, semester: e.target.value as any })}>
                     {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">File Asset</label>
                <button onClick={() => fileInputRef.current?.click()} className="w-full p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-indigo-600 hover:bg-indigo-600/5 transition-all flex flex-col items-center justify-center gap-2 group">
                   {uploadForm.fileData ? <div className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Plus size={16}/> Ready for Ingest</div> : <><Upload size={24} className="text-slate-400 group-hover:text-indigo-600"/><span className="text-[9px] font-black uppercase text-slate-500">Pick from Device</span></>}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              </div>
              <button onClick={handleUpload} className="w-full bg-indigo-600 py-6 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all active:scale-[0.98]">Commence Asset Transfer</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-4xl bg-[var(--sidebar-bg)] p-10 rounded-[3rem] shadow-2xl border-[var(--border-color)] space-y-8">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl">{getIcon(previewResource.category)}</div>
                    <div>
                       <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{previewResource.title}</h2>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{previewResource.course} • {previewResource.yearOfStudy} • {previewResource.semester}</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewResource(null)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
              </div>
              <div className="p-20 bg-[var(--bg-secondary)] rounded-[2.5rem] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center text-center gap-4">
                 <FileText size={64} className="text-slate-300"/>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Encrypted Signal Protocol: Native preview restricted for {previewResource.fileType} formats. <br/> Access the source data through a direct fetch.</p>
                 <button onClick={() => {}} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30">Download Asset</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
