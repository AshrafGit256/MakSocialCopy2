import React, { useState, useEffect, useMemo } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Mic, Play, Search, Plus, 
  User as UserIcon, Link as LinkIcon,
  X, Database, Globe, Filter,
  ExternalLink, ShieldCheck,
  Cpu, Zap, Signal, Info,
  ChevronLeft, ChevronRight,
  SkipBack, SkipForward, Maximize2,
  ListMusic, Clock, LayoutGrid,
  Radio, PlayCircle
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const YEARS: UserStatus[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [showGlobal, setShowGlobal] = useState(false);
  
  // Playback State
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  const [recordForm, setRecordForm] = useState({
    title: '',
    lecturer: '',
    courseCode: '',
    college: currentUser.college as College,
    course: COURSES_BY_COLLEGE[currentUser.college as College]?.[0] || 'General',
    year: currentUser.status as UserStatus,
    audioUrl: '',
    description: ''
  });

  useEffect(() => {
    setLessons(db.getAudioLessons());
  }, []);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                            l.courseCode.toLowerCase().includes(search.toLowerCase());
      
      if (!showGlobal) {
        const isMyCollege = l.college === currentUser.college;
        const isMyYear = l.year === currentUser.status;
        return matchesSearch && isMyCollege && isMyYear;
      }
      return matchesSearch;
    });
  }, [lessons, search, showGlobal, currentUser]);

  const handleNext = () => {
    if (!activeLesson) return;
    const idx = filteredLessons.findIndex(l => l.id === activeLesson.id);
    if (idx < filteredLessons.length - 1) {
      setActiveLesson(filteredLessons[idx + 1]);
    } else {
      setActiveLesson(filteredLessons[0]);
    }
  };

  const handlePrev = () => {
    if (!activeLesson) return;
    const idx = filteredLessons.findIndex(l => l.id === activeLesson.id);
    if (idx > 0) {
      setActiveLesson(filteredLessons[idx - 1]);
    } else {
      setActiveLesson(filteredLessons[filteredLessons.length - 1]);
    }
  };

  const handleUpload = () => {
    if (!recordForm.title || !recordForm.audioUrl) {
      alert("Diagnostic: Title and Source Link are required.");
      return;
    }
    
    let sanitizedUrl = recordForm.audioUrl;
    if (sanitizedUrl.includes('drive.google.com')) {
       let id = '';
       if (sanitizedUrl.includes('/file/d/')) {
          id = sanitizedUrl.split('/file/d/')[1].split('/')[0];
       } else if (sanitizedUrl.includes('id=')) {
          id = sanitizedUrl.split('id=')[1].split('&')[0];
       }
       if (id) sanitizedUrl = `https://drive.google.com/file/d/${id}/preview`;
    }
    
    const newLesson: AudioLesson = {
      id: `aud-${Date.now()}`,
      title: recordForm.title,
      lecturer: recordForm.lecturer || 'Unknown Lecturer',
      courseCode: recordForm.courseCode || 'GEN 1000',
      course: recordForm.course,
      year: recordForm.year,
      college: recordForm.college,
      duration: 'TBD',
      date: 'Just now',
      audioUrl: sanitizedUrl,
      contributor: currentUser.name,
      contributorAvatar: currentUser.avatar,
      plays: 0,
      description: recordForm.description
    };

    db.addAudioLesson(newLesson);
    setLessons(db.getAudioLessons());
    setIsUploading(false);
    alert("Protocol Synchronized: Audio node registered.");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 pb-48 font-sans text-[var(--text-primary)] min-h-screen flex flex-col">
      
      {/* 1. TOP DASHBOARD BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-2xl">
              <Signal size={32} className="animate-pulse text-[var(--brand-color)]" />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Stream <span className="text-[var(--brand-color)]">Registry.</span></h1>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Bridge Access: Active</p>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-[var(--brand-color)] transition-all shadow-sm"
                placeholder="Query manifests..."
              />
           </div>
           <button 
             onClick={() => setIsUploading(true)}
             className="px-8 py-3.5 bg-[var(--brand-color)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
              <Plus size={16}/> Uplink
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* 2. SIDEBAR NAVIGATION */}
         <aside className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Navigation</h3>
               <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => setShowGlobal(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${!showGlobal ? 'bg-[var(--brand-color)] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                     <LayoutGrid size={18}/> {currentUser.college} Wing
                  </button>
                  <button 
                    onClick={() => setShowGlobal(true)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${showGlobal ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                     <Globe size={18}/> Global Registry
                  </button>
               </div>
            </div>

            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] space-y-4 shadow-sm">
               <div className="flex items-center gap-3">
                  <Cpu size={20} className="text-indigo-600"/>
                  <span className="text-[10px] font-black text-indigo-900 uppercase">System Stats</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-[8px] font-bold text-indigo-400 uppercase">Nodes</p>
                     <p className="text-xl font-black text-indigo-900 leading-none">{lessons.length}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[8px] font-bold text-indigo-400 uppercase">Uptime</p>
                     <p className="text-xl font-black text-indigo-900 leading-none">100%</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* 3. MAIN CONTENT: RECORDING GRID */}
         <main className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
               <h2 className="text-xl font-black uppercase tracking-tight">Recording Manifest ({filteredLessons.length})</h2>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  Sort: <span className="text-slate-900 cursor-pointer flex items-center gap-1">Newest <SkipForward size={12} className="rotate-90"/></span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredLessons.map(lesson => (
                 <div 
                   key={lesson.id} 
                   onClick={() => setActiveLesson(lesson)}
                   className={`group relative bg-white border rounded-[2rem] p-6 transition-all hover:shadow-2xl cursor-pointer flex flex-col ${activeLesson?.id === lesson.id ? 'border-[var(--brand-color)] ring-4 ring-[var(--brand-color)]/5' : 'border-slate-100'}`}
                 >
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-50 border border-slate-100 rounded text-slate-500">{lesson.courseCode}</span>
                       <div className="p-2 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={14} className="text-slate-400" />
                       </div>
                    </div>

                    <div className="space-y-3 flex-1">
                       <h3 className="text-lg font-black uppercase tracking-tighter leading-tight group-hover:text-[var(--brand-color)] transition-colors line-clamp-2">
                          {lesson.title}
                       </h3>
                       <div className="flex flex-wrap gap-2">
                          <span className="text-[8px] font-black uppercase bg-[var(--brand-color)]/10 text-[var(--brand-color)] px-2.5 py-1 rounded-full">{lesson.course}</span>
                          <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-full">{lesson.year}</span>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <img src={lesson.contributorAvatar} className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase text-slate-800 leading-none">{lesson.contributor}</span>
                             <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">{lesson.date}</span>
                          </div>
                       </div>
                       <div className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 ${activeLesson?.id === lesson.id ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                          {activeLesson?.id === lesson.id ? <Radio size={18} className="animate-pulse" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
                       </div>
                    </div>
                 </div>
               ))}

               {filteredLessons.length === 0 && (
                  <div className="col-span-full py-32 text-center space-y-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                     <Database size={64} className="mx-auto text-slate-200" />
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-400">Registry_Empty</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest max-w-xs mx-auto">No records detected in this sector. Try exploring the global hub.</p>
                     </div>
                     <button onClick={() => {setShowGlobal(true); setSearch('');}} className="px-10 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all shadow-sm">Sync Global</button>
                  </div>
               )}
            </div>
         </main>
      </div>

      {/* 4. PERSISTENT CONTROL DECK (BOTTOM PLAYER) */}
      {activeLesson && (
        <div className={`fixed left-0 right-0 z-[1000] bg-white border-t border-slate-200 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out ${isFocusMode ? 'bottom-0 h-[80vh] rounded-t-[3rem]' : 'bottom-0 md:bottom-0 lg:bottom-0 h-24 md:h-28'}`}>
           
           {/* Focus Mode Overlay Controls */}
           {isFocusMode && (
             <div className="absolute top-8 right-8 flex gap-3 z-[1100]">
                <button onClick={() => setIsFocusMode(false)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-all">
                   <X size={24}/>
                </button>
             </div>
           )}

           <div className="h-full flex flex-col">
              
              {/* COMPACT PLAYER BAR (Always visible or part of top in focus mode) */}
              <div className={`px-6 md:px-12 flex items-center justify-between ${isFocusMode ? 'py-8 border-b border-slate-50' : 'h-full'}`}>
                 
                 {/* Track Info */}
                 <div className="flex items-center gap-4 w-full md:w-1/3 overflow-hidden">
                    <div className="relative group shrink-0">
                       <img src={activeLesson.contributorAvatar} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-slate-100 object-cover bg-slate-50 shadow-md" />
                       <button 
                         onClick={() => setIsFocusMode(!isFocusMode)}
                         className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-2xl"
                       >
                          {isFocusMode ? <SkipForward size={18} className="rotate-90" /> : <Maximize2 size={18} />}
                       </button>
                    </div>
                    <div className="min-w-0 flex-1">
                       <h4 className="text-sm md:text-lg font-black uppercase tracking-tighter truncate leading-none mb-1.5">{activeLesson.title}</h4>
                       <div className="flex items-center gap-3">
                          <p className="text-[8px] md:text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest truncate">{activeLesson.lecturer}</p>
                          <span className="text-slate-300">•</span>
                          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{activeLesson.courseCode}</span>
                       </div>
                    </div>
                 </div>

                 {/* Playback Controls (Middle) */}
                 {!isFocusMode && (
                    <div className="hidden md:flex flex-col items-center gap-4 flex-1">
                       <div className="flex items-center gap-8">
                          <button onClick={handlePrev} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipBack size={24}/></button>
                          <button 
                            onClick={() => setIsFocusMode(true)}
                            className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                          >
                             <PlayCircle size={32} className="animate-pulse text-[var(--brand-color)]" />
                          </button>
                          <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipForward size={24}/></button>
                       </div>
                       <div className="w-full max-w-md h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--brand-color)] w-1/3 animate-pulse"></div>
                       </div>
                    </div>
                 )}

                 {/* Action Buttons (Right) */}
                 <div className="flex items-center justify-end gap-3 md:gap-6 w-1/3 hidden md:flex">
                    <button onClick={() => setIsFocusMode(!isFocusMode)} className={`p-3 rounded-2xl transition-all ${isFocusMode ? 'bg-[var(--brand-color)] text-white shadow-xl' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900'}`}>
                       <ListMusic size={20}/>
                    </button>
                    <button 
                      onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')}
                      className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl transition-all flex items-center gap-2"
                    >
                       <ExternalLink size={14}/> Full Screen
                    </button>
                 </div>

                 {/* Mobile Play/Expand Button */}
                 <div className="md:hidden">
                    <button 
                       onClick={() => setIsFocusMode(true)}
                       className="p-4 bg-[var(--brand-color)] text-white rounded-2xl shadow-xl animate-bounce"
                    >
                       <Play size={20} fill="currentColor"/>
                    </button>
                 </div>
              </div>

              {/* FOCUS MODE: EXPANDED CONTENT (THE IFRAME) */}
              {isFocusMode && (
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                   {/* Left side: Metadata and Art */}
                   <div className="hidden lg:flex w-[400px] flex-col p-12 space-y-8 bg-slate-50 overflow-y-auto no-scrollbar">
                      <div className="aspect-square w-full rounded-[3rem] overflow-hidden shadow-2xl bg-white p-4">
                         <img src={activeLesson.contributorAvatar} className="w-full h-full object-cover rounded-[2.5rem]" />
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">{activeLesson.title}</h2>
                            <p className="text-sm font-bold text-[var(--brand-color)] uppercase tracking-widest">{activeLesson.lecturer}</p>
                         </div>
                         <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400">
                               <Info size={16}/> Node Manifest
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{activeLesson.description}"</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-100 rounded-2xl">
                               <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Time Index</span>
                               <span className="text-sm font-black text-slate-700">{activeLesson.duration}</span>
                            </div>
                            <div className="p-4 bg-slate-100 rounded-2xl">
                               <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Plays</span>
                               <span className="text-sm font-black text-slate-700">{activeLesson.plays.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right side: The Bridge (Iframe) */}
                   <div className="flex-1 bg-black relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--brand-color) 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }}></div>
                      
                      {/* Control Overlays for cycling */}
                      <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all z-20 hidden md:block">
                         <SkipBack size={32} />
                      </button>
                      
                      <div className="w-full h-full max-w-5xl relative z-10 animate-in zoom-in-95 duration-500">
                         <iframe 
                           src={activeLesson.audioUrl} 
                           className="w-full h-full rounded-[2rem] border border-white/10 shadow-2xl" 
                           allow="autoplay"
                         ></iframe>
                      </div>

                      <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all z-20 hidden md:block">
                         <SkipForward size={32} />
                      </button>

                      {/* Mobile Cycle Controls */}
                      <div className="absolute bottom-10 flex gap-12 md:hidden">
                         <button onClick={handlePrev} className="p-4 bg-white/10 text-white rounded-full"><SkipBack size={24}/></button>
                         <button onClick={handleNext} className="p-4 bg-white/10 text-white rounded-full"><SkipForward size={24}/></button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* 5. UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 rounded-[3rem] shadow-2xl space-y-10 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3">
                    <Zap size={24} className="text-[var(--brand-color)]" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Uplink_Handshake</h2>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal_Title</label>
                    <input 
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-inner" 
                      value={recordForm.title}
                      onChange={e => setRecordForm({...recordForm, title: e.target.value})}
                      placeholder="e.g. Lec 05: Complex Numbers" 
                    />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drive_Link_Protocol</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 pl-12 text-xs font-bold outline-none focus:border-[var(--brand-color)] shadow-inner" 
                         value={recordForm.audioUrl}
                         onChange={e => setRecordForm({...recordForm, audioUrl: e.target.value})}
                         placeholder="Standard Drive Share Link..." 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target_Course</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[11px] font-bold outline-none"
                         value={recordForm.course}
                         onChange={e => setRecordForm({...recordForm, course: e.target.value})}
                       >
                          {(COURSES_BY_COLLEGE[recordForm.college] || []).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync_Level</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-[11px] font-bold outline-none"
                         value={recordForm.year}
                         onChange={e => setRecordForm({...recordForm, year: e.target.value as UserStatus})}
                       >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="p-6 bg-emerald-50 border border-dashed border-emerald-200 rounded-[2rem] flex items-center gap-5">
                    <div className="p-3 bg-white rounded-full text-emerald-500 shadow-sm">
                       <ShieldCheck size={24} />
                    </div>
                    <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest leading-relaxed">
                      All nodes are verified by the registry to ensure secure audio synchronization for the Hill community.
                    </p>
                 </div>

                 <button 
                   onClick={handleUpload}
                   className="w-full bg-[var(--brand-color)] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Authorize Sync
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LectureStream;
