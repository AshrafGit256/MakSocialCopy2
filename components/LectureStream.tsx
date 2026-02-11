
import React, { useState, useEffect } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Mic, Play, Pause, Search, Plus, 
  Activity, User as UserIcon, Link as LinkIcon,
  X, SkipForward, SkipBack, Volume2, Upload,
  Database, Info, AlertCircle, Globe, Filter,
  ArrowRight, ExternalLink
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const YEARS: UserStatus[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [showGlobal, setShowGlobal] = useState(false);
  
  // Player state
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modal states
  const [isUploading, setIsUploading] = useState(false);
  
  const [recordForm, setRecordForm] = useState({
    title: '',
    lecturer: '',
    courseCode: '',
    college: currentUser.college as College,
    course: COURSES_BY_COLLEGE[currentUser.college as College][0],
    year: currentUser.status as UserStatus,
    audioUrl: '',
    description: ''
  });

  useEffect(() => {
    setLessons(db.getAudioLessons());
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.1, 100));
      }, 100);
    } else if (progress >= 100) {
      setIsPlaying(false);
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handlePlay = (lesson: AudioLesson) => {
    if (activeLesson?.id === lesson.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveLesson(lesson);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!recordForm.title || !recordForm.audioUrl) {
      alert("Missing Protocol Fields: Title and Source Link are mandatory.");
      return;
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
      audioUrl: recordForm.audioUrl,
      contributor: currentUser.name,
      contributorAvatar: currentUser.avatar,
      plays: 0,
      description: recordForm.description
    };

    db.addAudioLesson(newLesson);
    setLessons(db.getAudioLessons());
    setIsUploading(false);
    alert("Protocol Synchronized: Recording linked to the registry.");
  };

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                          l.courseCode.toLowerCase().includes(search.toLowerCase());
    
    // Default view is specific to user's course and year
    if (!showGlobal) {
      const isMyCollege = l.college === currentUser.college;
      const isMyYear = l.year === currentUser.status;
      return matchesSearch && isMyCollege && isMyYear;
    }

    return matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 pb-60 font-sans text-[var(--text-primary)]">
      
      {/* 1. COMPACT HERO SECTION */}
      <section className="relative rounded-[2rem] overflow-hidden mb-12 shadow-2xl min-h-[250px] flex flex-col justify-center px-8 md:px-16 py-12">
         <img 
           src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600" 
           className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4]" 
           alt="Lecture Background" 
         />
         <div className="absolute inset-0 bg-[var(--brand-color)]/20 backdrop-blur-[1px]"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

         <div className="relative z-10 space-y-4 max-w-xl animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-[var(--brand-color)] rounded-xl text-white">
                  <Mic size={24} />
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                  Lecture <span className="text-[var(--brand-color)]">Stream.</span>
               </h1>
            </div>
            <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed">
               Personalized audio registry for your study path. Synchronize with your classmates through verified recordings.
            </p>
            <div className="pt-2">
               <button 
                 onClick={() => setIsUploading(true)}
                 className="px-8 py-3 bg-[var(--brand-color)] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
               >
                  <Plus size={16}/> Uplink Recording Link
               </button>
            </div>
         </div>
      </section>

      {/* 2. SMART FILTERING TOOLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-[var(--border-color)] pb-8">
         <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center gap-3">
               <h2 className="text-xl font-black uppercase tracking-tighter">Study Signal</h2>
               <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-600 text-[8px] font-black uppercase tracking-widest animate-pulse">
                  {filteredLessons.length} NODES
               </div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               Viewing: {showGlobal ? 'Global Campus Registry' : `${currentUser.college} HUB • ${currentUser.status}`}
            </p>
         </div>

         <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)]" size={16} />
               <input 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-4 text-[11px] font-bold uppercase outline-none focus:border-[var(--brand-color)] transition-all shadow-inner"
                 placeholder="Filter by code or title..."
               />
            </div>
            
            <button 
               onClick={() => setShowGlobal(!showGlobal)}
               className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${showGlobal ? 'bg-slate-800 text-white border-transparent' : 'bg-white text-slate-500 border-slate-200'}`}
            >
               {showGlobal ? <Globe size={14}/> : <Filter size={14}/>}
               {showGlobal ? 'Switch to Personal' : 'Discover Global'}
            </button>
         </div>
      </div>

      {/* 3. SIMPLIFIED LESSON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredLessons.map(lesson => (
           <div 
             key={lesson.id} 
             className="group relative bg-white border border-[var(--border-color)] rounded-2xl p-6 transition-all hover:shadow-xl hover:border-[var(--brand-color)]/20 flex flex-col"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={lesson.contributorAvatar} 
                      className="w-10 h-10 rounded-full border border-slate-100 object-cover bg-slate-50" 
                      alt="Contributor" 
                    />
                    <div className="min-w-0">
                       <p className="text-[10px] font-black uppercase text-slate-900 truncate">{lesson.contributor}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{lesson.date}</p>
                    </div>
                 </div>
                 <div className="text-right shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded text-slate-500">{lesson.courseCode}</span>
                 </div>
              </div>

              <div className="space-y-3 flex-1">
                 <h3 className="text-lg font-black uppercase tracking-tighter leading-tight group-hover:text-[var(--brand-color)] transition-colors line-clamp-2">
                    {lesson.title}
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] font-black uppercase bg-[var(--brand-color)]/10 text-[var(--brand-color)] px-2 py-0.5 rounded">{lesson.course}</span>
                    <span className="text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded">{lesson.year}</span>
                 </div>
                 <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                    <span className="flex items-center gap-1.5"><UserIcon size={12}/> {lesson.lecturer}</span>
                    <span className="flex items-center gap-1.5"><LinkIcon size={12}/> Drive Node</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Runtime</span>
                    <span className="text-xs font-black text-slate-700">{lesson.duration}</span>
                 </div>
                 <button 
                   onClick={() => handlePlay(lesson)}
                   className={`p-4 rounded-full transition-all active:scale-90 shadow-lg ${activeLesson?.id === lesson.id && isPlaying ? 'bg-rose-500 text-white' : 'bg-[var(--brand-color)] text-white'}`}
                 >
                    {activeLesson?.id === lesson.id && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
                 </button>
              </div>
           </div>
         ))}

         {filteredLessons.length === 0 && (
            <div className="col-span-full py-32 text-center space-y-4 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
               <Database size={40} className="mx-auto text-slate-200" />
               <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-slate-500">Registry_Empty</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-xs mx-auto">No recordings match your specific course and year parameters.</p>
               </div>
               <button onClick={() => {setSearch(''); setShowGlobal(true);}} className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all">Search Global Hub</button>
            </div>
         )}
      </div>

      {/* 4. PLAYER (FLOATING) */}
      {activeLesson && (
        <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-80 lg:right-6 bg-slate-900 text-white p-4 md:p-6 rounded-3xl shadow-2xl border border-white/10 z-[100] animate-in slide-in-from-bottom-4 duration-400">
           <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
                 <div className="relative shrink-0">
                    <img src={activeLesson.contributorAvatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-white object-cover" />
                 </div>
                 <div className="min-w-0 flex-1">
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-tight truncate">{activeLesson.title}</h4>
                    <p className="text-[8px] font-black text-[var(--brand-color)] uppercase tracking-widest truncate">
                       {activeLesson.lecturer} • {activeLesson.courseCode}
                    </p>
                 </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[var(--brand-color)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                 <button className="text-white/40 hover:text-white"><SkipBack size={18}/></button>
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)}
                   className="p-3 bg-white text-black rounded-full shadow-lg active:scale-90"
                 >
                   {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="translate-x-0.5" />}
                 </button>
                 <button className="text-white/40 hover:text-white"><SkipForward size={18}/></button>
                 <div className="flex items-center gap-2">
                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    <button onClick={() => window.open(activeLesson.audioUrl, '_blank')} className="p-2 text-white/40 hover:text-[var(--brand-color)]"><ExternalLink size={18}/></button>
                    <button onClick={() => setActiveLesson(null)} className="p-2 text-white/40 hover:text-rose-500"><X size={18}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 5. UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-8 rounded-3xl shadow-2xl space-y-8 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--brand-color)]/10 text-[var(--brand-color)] rounded-lg">
                       <LinkIcon size={20}/>
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Synchronize_Link</h2>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-400 hover:text-rose-500"><X size={24}/></button>
              </div>

              <div className="space-y-5">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Session_Title</label>
                    <input 
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)]" 
                      value={recordForm.title}
                      onChange={e => setRecordForm({...recordForm, title: e.target.value})}
                      placeholder="e.g. Lec 04: Neural Networks" 
                    />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cloud_Source_Link (Drive, iCloud, etc.)</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 pl-12 text-xs font-bold outline-none focus:border-[var(--brand-color)]" 
                         value={recordForm.audioUrl}
                         onChange={e => setRecordForm({...recordForm, audioUrl: e.target.value})}
                         placeholder="https://drive.google.com/file/..." 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Target_Course</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[10px] font-bold outline-none"
                         value={recordForm.course}
                         onChange={e => setRecordForm({...recordForm, course: e.target.value})}
                       >
                          {COURSES_BY_COLLEGE[recordForm.college].map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Level_Allocation</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[10px] font-bold outline-none"
                         value={recordForm.year}
                         onChange={e => setRecordForm({...recordForm, year: e.target.value as UserStatus})}
                       >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Lecturer_Node</label>
                    <input 
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none" 
                      value={recordForm.lecturer}
                      onChange={e => setRecordForm({...recordForm, lecturer: e.target.value})}
                      placeholder="Name..." 
                    />
                 </div>

                 <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center gap-3">
                    <Info size={16} className="text-slate-400" />
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Ensure link access is set to "Anyone with link" for peer synchronization.
                    </p>
                 </div>

                 <button 
                   onClick={handleUpload}
                   className="w-full bg-[var(--brand-color)] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                 >
                   Authorize_Sync
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default LectureStream;
