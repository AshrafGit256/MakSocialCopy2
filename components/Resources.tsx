
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
  const [currentUser, setCurrentUser] = useState(db.getUser());
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
    const user = db.getUser();
    setCurrentUser(user);
    const sync = () => {
      setResources(db.getResources());
    };
    sync();
    const interval = setInterval(sync, 5000);
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
      link.download = res.title || 'academic_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      authorRole: currentUser.role || 'Verified User',
      downloads: 0,
      fileType: 'PDF',
      fileData: addForm.fileData || undefined,
      timestamp: formattedDate
    };
    db.saveResource(newRes);
    setResources(db.getResources());
    setIsAdding(false);
    setAddForm({ title: '', course: '', year: 'Year 1', category: 'Notes/Books', fileData: null, fileName: null });
    alert("Success: File uploaded to Study Resources.");
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 500);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 pb-40 animate-in fade-in duration-500 font-sans text-[var(--text-primary)]">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--brand-color)] rounded-md shadow-lg text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter leading-none">Study Resources</h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Shared notes, past papers, and research material</p>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for documents..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md py-2.5 pl-10 pr-4 text-[11px] font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-color)] shadow-sm"
            />
          </div>
          <button onClick={() => setIsAdding(true)} className="px-4 py-2.5 bg-[var(--brand-color)] hover:brightness-110 text-white rounded-md text-[10px] font-bold uppercase flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <Plus size={14} /> Upload File
          </button>
        </div>
      </header>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md mb-8 divide-y divide-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Select College</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] outline-none cursor-pointer"
              value={currentCollege}
              onChange={e => { setCurrentCollege(e.target.value as any); handleScan(); }}
            >
              <option value="Global">All Colleges</option>
              {Object.keys(COURSES_BY_COLLEGE).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Select Course</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] outline-none cursor-pointer"
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); handleScan(); }}
            >
              <option value="All">All Courses</option>
              {currentCollege !== 'Global' && COURSES_BY_COLLEGE[currentCollege as College].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">Academic Year</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-[11px] font-medium text-[var(--text-primary)] outline-none cursor-pointer"
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); handleScan(); }}
            >
              <option value="All">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md overflow-hidden relative shadow-sm">
        {isScanning && (
          <div className="absolute inset-0 z-10 bg-[var(--bg-primary)]/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-[var(--brand-color)]">
               <Activity size={18} className="animate-pulse" />
               <span className="text-[11px] font-bold uppercase tracking-widest">Searching library...</span>
            </div>
          </div>
        )}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)] text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-[var(--border-color)]">
                <th className="px-6 py-4">Document Name</th>
                <th className="px-6 py-4">Shared By</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Action</th>
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
                        <p className="text-[12px] font-bold text-[var(--text-primary)] group-hover:text-brand-primary transition-colors">{res.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{res.course} • {res.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-slate-700">{res.author}</span>
                       <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">{res.authorRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded-sm border border-brand-primary/10">{res.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] text-slate-500 font-medium">{res.timestamp}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setPreviewResource(res)}
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDownload(res)}
                        className="px-3 py-1.5 bg-[var(--brand-color)] hover:brightness-110 text-white text-[11px] font-bold rounded-md transition-all flex items-center gap-2 shadow-sm active:scale-95"
                      >
                        <Download size={14}/> Download
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center space-y-4">
                    <FilterX size={32} className="mx-auto text-slate-300" />
                    <p className="text-[12px] font-medium text-slate-500">No documents found matching your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in font-sans">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 rounded-md shadow-2xl space-y-6 border border-[var(--border-color)] max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
                 <div className="flex items-center gap-2">
                    <Upload size={18} className="text-[var(--brand-color)]" />
                    <h2 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-tight">Upload Resource</h2>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">1. Choose File</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 transition-all ${
                         addForm.fileData 
                         ? 'bg-[var(--brand-color)]/5 border-[var(--brand-color)]' 
                         : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--brand-color)]'
                      }`}
                    >
                       <Upload size={24} className={addForm.fileData ? 'text-[var(--brand-color)]' : 'text-slate-400'} />
                       <span className="text-[11px] font-bold">{addForm.fileName || 'Select a PDF or Document'}</span>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.pptx,.zip" />
                 </div>

                 <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">2. Document Title</label>
                      <input 
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-[13px] font-medium text-[var(--text-primary)] outline-none focus:border-[var(--brand-color)]" 
                        value={addForm.title} 
                        onChange={e => setAddForm({...addForm, title: e.target.value})} 
                        placeholder="e.g. Introduction to Physics Notes" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">3. Category</label>
                      <select 
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-3 text-[13px] font-medium text-[var(--text-primary)] outline-none" 
                        value={addForm.category} 
                        onChange={e => setAddForm({...addForm, category: e.target.value as ResourceType})}
                      >
                         {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                 </div>

                 <button 
                   onClick={handleAddResource} 
                   className="w-full bg-[var(--brand-color)] hover:brightness-110 py-4 rounded-md text-white font-bold text-[12px] uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all active:scale-95"
                   disabled={!addForm.title || !addForm.fileData}
                 >
                   Upload to Library
                 </button>
              </div>
           </div>
        </div>
      )}

      {previewResource && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in font-sans">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg rounded-md shadow-2xl flex flex-col border border-[var(--border-color)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                 <h2 className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{previewResource.title}</h2>
                 <button onClick={() => setPreviewResource(null)} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-10 flex flex-col items-center justify-center space-y-6">
                 <FileText size={80} className="text-[var(--brand-color)] opacity-20" />
                 <div className="text-center space-y-2">
                    <p className="text-base font-bold text-slate-800">{previewResource.title}</p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Resource Verified • {previewResource.fileType}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full pt-4">
                   <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Shared By</p>
                     <p className="text-[12px] font-bold text-slate-700 mt-1">{previewResource.author}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Downloads</p>
                     <p className="text-[12px] font-bold text-slate-700 mt-1">{previewResource.downloads.toLocaleString()}</p>
                   </div>
                 </div>
                 <button onClick={() => handleDownload(previewResource)} className="w-full py-4 bg-[var(--brand-color)] text-white rounded-md text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                    Download File <Download size={18}/>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
