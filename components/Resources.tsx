
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { Resource, College, ResourceType } from '../types';
import { 
  FileText, Search, Download, Plus, Database, 
  Clock, Fingerprint, Activity, Eye, Upload, X,
  ArrowUpRight, FilterX, UserCheck, Sparkles, BrainCircuit,
  Loader2, Cpu, ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CATEGORIES: ResourceType[] = ['Test', 'Past Paper', 'Notes/Books', 'Research', 'Career'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const Resources: React.FC = () => {
  const [currentUser] = useState(db.getUser());
  const [currentCollege, setCurrentCollege] = useState<College | 'Global'>(currentUser.college);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
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
    const sync = () => setResources(db.getResources());
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

  const handleAISummary = async (res: Resource) => {
    if (res.aiSummary) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this academic document metadata:
      Title: ${res.title}
      Category: ${res.category}
      Course: ${res.course}
      Year: ${res.year}
      
      Provide a highly tactical, bulleted summary (max 3 points) explaining why this asset is valuable for Makerere University students and what core concepts it likely covers. Use a professional, technical tone.`;
      
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      const summary = result.text;
      const updatedRes = { ...res, aiSummary: summary };
      db.saveResource(updatedRes); // Upsert logic in db handles this
      setResources(db.getResources());
      if (previewResource?.id === res.id) setPreviewResource(updatedRes);
    } catch (error) {
      console.error("AI Sync Error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

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
    setTimeout(() => setIsScanning(false), 600);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 pb-40 animate-in fade-in duration-500 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/20 text-white">
            <Database size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">The.Vault</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500"/> Sector: {currentCollege} Wing / Active_Nodes: {filteredResources.length}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Query Alphanumeric Manifest..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
            />
          </div>
          <button onClick={() => setIsAdding(true)} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            <Plus size={18} /> New.Log
          </button>
        </div>
      </header>

      {/* 2. FILTER MATRIX */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl mb-8 divide-y divide-[var(--border-color)] overflow-hidden shadow-xl shadow-black/5">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Wing.Sector</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none cursor-pointer hover:border-indigo-500 transition-colors"
              value={currentCollege}
              onChange={e => { setCurrentCollege(e.target.value as any); handleScan(); }}
            >
              <option value="Global">Universal Hub</option>
              {Object.keys(COURSES_BY_COLLEGE).map(c => <option key={c} value={c}>{c} Wing</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Course.Logic</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none cursor-pointer hover:border-indigo-500 transition-colors"
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); handleScan(); }}
            >
              <option value="All">Full Manifest</option>
              {currentCollege !== 'Global' && COURSES_BY_COLLEGE[currentCollege as College].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Year.Stratum</label>
            <select 
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none cursor-pointer hover:border-indigo-500 transition-colors"
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); handleScan(); }}
            >
              <option value="All">All Levels</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="p-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-black/20">
          <button 
            onClick={() => { setSelectedCategory('All'); handleScan(); }}
            className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${selectedCategory === 'All' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-transparent border-[var(--border-color)] text-slate-500 hover:text-[var(--text-primary)] hover:border-slate-400'}`}
          >
            Universal
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat); handleScan(); }}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-transparent border-[var(--border-color)] text-slate-500 hover:text-[var(--text-primary)] hover:border-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. REGISTRY STREAM */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden relative shadow-2xl shadow-black/5">
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4 text-indigo-500">
               <Cpu size={48} className="animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Scan Active...</span>
            </div>
          </div>
        )}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[var(--border-color)]">
                <th className="px-8 py-5">Asset.Identifier</th>
                <th className="px-8 py-5">Node.Source</th>
                <th className="px-8 py-5">Sector</th>
                <th className="px-8 py-5">Registry.Time</th>
                <th className="px-8 py-5 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <tr key={res.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl border ${
                        res.category === 'Past Paper' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' :
                        res.category === 'Research' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                        'border-indigo-500/20 text-indigo-500 bg-indigo-500/5'
                      }`}>
                         <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-[var(--text-primary)] uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{res.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-2">
                           {res.course} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {res.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2">
                          <Fingerprint size={12} className="text-slate-400" />
                          <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{res.author}</span>
                       </div>
                       <span className="text-[8px] font-black text-indigo-600 uppercase ml-5 opacity-60 tracking-widest">{res.authorRole}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-indigo-500 uppercase px-3 py-1 bg-indigo-500/5 border border-indigo-500/20 rounded-full">{res.college}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={12}/>
                       <span className="text-[10px] font-bold uppercase tracking-tight">{res.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setPreviewResource(res)}
                        className="p-2.5 hover:bg-indigo-600/10 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-600/20"
                      >
                        <Eye size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDownload(res)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95"
                      >
                        <Download size={14}/> Sync
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                       <FilterX size={64} />
                       <p className="text-[12px] font-black uppercase tracking-[0.4em]">Protocol.Silence / Manifest Nullified</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal - AI POWERED */}
      {previewResource && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-[var(--bg-primary)] w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl flex flex-col border border-[var(--border-color)] overflow-hidden">
              <div className="px-8 py-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)] shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white"><FileText size={24} /></div>
                    <div>
                      <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">{previewResource.title}</h2>
                      <p className="text-[9px] font-black text-slate-500 uppercase mt-0.5 tracking-[0.2em]">{previewResource.course} / STRATUM: {previewResource.category}</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewResource(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={28}/></button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                 {/* Visual Artifact */}
                 <div className="lg:w-1/2 bg-slate-50 dark:bg-black/40 flex flex-col items-center justify-center p-12 border-r border-[var(--border-color)]">
                    <div className="relative">
                       <div className="p-16 bg-white dark:bg-white/5 border border-[var(--border-color)] rounded-[4rem] shadow-2xl relative z-10">
                          <FileText size={120} className="text-indigo-600 opacity-20 animate-pulse" />
                       </div>
                       <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full"></div>
                    </div>
                    <div className="mt-12 text-center space-y-4">
                       <p className="text-xl font-black uppercase text-[var(--text-primary)] tracking-widest italic">{previewResource.title}</p>
                       <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] inline-block">Asset_Status: Verified_Stable</div>
                    </div>
                 </div>

                 {/* AI Insights Sidebar */}
                 <div className="lg:w-1/2 p-10 flex flex-col justify-between bg-white dark:bg-[#0d1117]">
                    <div className="space-y-8 overflow-y-auto no-scrollbar">
                       <div className="space-y-4">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                             <BrainCircuit size={16} className="text-indigo-600" /> Neural_Assessment
                          </h3>
                          
                          {previewResource.aiSummary ? (
                            <div className="p-6 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl animate-in slide-in-from-right-4">
                               <div className="prose prose-invert prose-sm text-slate-500 font-medium leading-relaxed italic whitespace-pre-line">
                                  {previewResource.aiSummary}
                               </div>
                               <div className="mt-6 flex items-center gap-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest border-t border-indigo-600/10 pt-4">
                                  <Sparkles size={10}/> Analyzed by Gemini Intelligence v3
                               </div>
                            </div>
                          ) : (
                            <div className="p-8 border-2 border-dashed border-[var(--border-color)] rounded-2xl text-center space-y-6">
                               <p className="text-xs text-slate-400 font-medium italic">"Initiate a neural scan to extract core tactical insights from this academic asset."</p>
                               <button 
                                 onClick={() => handleAISummary(previewResource)}
                                 disabled={isSummarizing}
                                 className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mx-auto shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all"
                               >
                                  {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                                  {isSummarizing ? 'Scanning Data...' : 'Initialize Neural Scan'}
                               </button>
                            </div>
                          )}
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
                             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Source Node</p>
                             <p className="text-[11px] font-black uppercase truncate">{previewResource.author}</p>
                          </div>
                          <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
                             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Registry Log</p>
                             <p className="text-[11px] font-black uppercase">{previewResource.timestamp}</p>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleDownload(previewResource)}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 mt-10"
                    >
                       Commit to Local Workspace <ArrowUpRight size={20}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-200">
           <div className="bg-[var(--bg-primary)] w-full max-w-xl p-10 rounded-[2.5rem] shadow-2xl space-y-8 border border-[var(--border-color)]">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <Database size={24} />
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Asset.Uplink</h2>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={28}/></button>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">1. Container_Initialization</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center gap-4 cursor-pointer group ${addForm.fileData ? 'bg-indigo-600/5 border-indigo-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600'}`}
                    >
                       <div className={`p-4 rounded-2xl ${addForm.fileData ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                          <Upload size={32} className={addForm.fileData ? '' : 'group-hover:animate-bounce'} />
                       </div>
                       <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-widest">{addForm.fileName || 'Initialize Device Uplink'}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">PDF, DOCX, PPTX, ZIP (MAX 25MB)</p>
                       </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.pptx,.zip" />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">2. Metadata_Validation</label>
                    <input 
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" 
                      value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} placeholder="Asset Identifier (e.g. OS Exam Prep 2025)" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all" 
                         value={addForm.course} onChange={e => setAddForm({...addForm, course: e.target.value})} placeholder="Course Logic" 
                       />
                       <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold text-[var(--text-primary)] outline-none" value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value as ResourceType})}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="p-5 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl flex items-center gap-4">
                    <UserCheck size={24} className="text-indigo-600" />
                    <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic uppercase">
                       "Contribution logged as <span className="text-indigo-600 font-black">"{currentUser.name}"</span>. Assets are synchronized with the Central Registry Council."
                    </p>
                 </div>

                 <button 
                   onClick={handleAddResource} 
                   className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-95 disabled:opacity-50"
                   disabled={!addForm.title || !addForm.fileData}
                 >
                   Commit Protocol to Vault
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
