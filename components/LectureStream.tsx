import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Play, Search, Plus, 
  User as UserIcon, 
  X, Database, Globe, Filter,
  ExternalLink, ShieldCheck,
  Cpu, Zap, Signal, Info,
  SkipBack, SkipForward,
  Clock, List,
  Headphones,
  Upload,
  FileAudio,
  MoreVertical,
  Volume2,
  // Fix: Import Pause icon from lucide-react
  Pause
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const YEARS: UserStatus[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [activeCollege, setActiveCollege] = useState<College | 'Global'>('Global');
  
  // Playback State
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    lecturer: '',
    courseCode: '',
    college: currentUser.college as College,
    course: COURSES_BY_COLLEGE[currentUser.college as College]?.[0] || 'General',
    year: currentUser.status as UserStatus,
    file: null as File | null,
    description: ''
  });

  useEffect(() => {
    setLessons(db.getAudioLessons());
  }, []);

  useEffect(() => {
    if (activeLesson && audioRef.current) {
      audioRef.current.play().catch(() => console.log("User interaction required"));
      setIsPlaying(true);
    }
  }, [activeLesson]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                            l.courseCode.toLowerCase().includes(search.toLowerCase()) ||
                            l.lecturer.toLowerCase().includes(search.toLowerCase());
      
      const matchesCollege = activeCollege === 'Global' || l.college === activeCollege;
      return matchesSearch && matchesCollege;
    });
  }, [lessons, search, activeCollege]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadForm({ ...uploadForm, file });
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.file) {
      alert("Diagnostic: Audio file and title are mandatory for uplink.");
      return;
    }
    
    // Create a local URL for the uploaded file
    const fileUrl = URL.createObjectURL(uploadForm.file);
    
    const newLesson: AudioLesson = {
      id: `aud-${Date.now()}`,
      title: uploadForm.title,
      lecturer: uploadForm.lecturer || 'Faculty Node',
      courseCode: uploadForm.courseCode || 'GEN 101',
      course: uploadForm.course,
      year: uploadForm.year,
      college: uploadForm.college,
      duration: 'Direct Stream',
      date: 'Just now',
      audioUrl: fileUrl,
      contributor: currentUser.name,
      contributorAvatar: currentUser.avatar,
      plays: 0,
      description: uploadForm.description
    };

    db.addAudioLesson(newLesson);
    setLessons(db.getAudioLessons());
    setIsUploading(false);
    setUploadForm({ ...uploadForm, title: '', file: null });
    alert("Protocol Synchronized: Local file committed to session registry.");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      
      {/* 1. TOP HEADER & SEARCH */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4 shrink-0">
            <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg">
               <Headphones size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Lecture <span className="text-[var(--brand-color)]">Stream</span></h2>
         </div>

         <div className="flex-1 max-w-2xl mx-0 md:mx-8 relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-full py-3 pl-12 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-sm"
              placeholder="Search recordings, codes, or lecturers..."
            />
         </div>

         <button 
           onClick={() => setIsUploading(true)}
           className="px-6 py-3 bg-[var(--brand-color)] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[var(--brand-color)]/20"
         >
            <Upload size={14}/> Direct Uplink
         </button>
      </nav>

      {/* 2. CATEGORY SELECTOR */}
      <div className="px-6 md:px-12 py-6 border-b border-slate-50 overflow-x-auto no-scrollbar flex items-center gap-3">
         <button 
            onClick={() => setActiveCollege('Global')}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCollege === 'Global' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
         >
           Universal Stream
         </button>
         {COLLEGES.map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c)}
             className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCollege === c ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
           >
             {c} HUB
           </button>
         ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
         
         {/* 3. FEATURED BOX */}
         {!search && filteredLessons.length > 0 && activeCollege === 'Global' && (
           <section className="mb-12 bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Signal size={300} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl bg-white p-4">
                    <img src={filteredLessons[0].contributorAvatar} className="w-full h-full object-cover rounded-[1.5rem]" />
                 </div>
                 <div className="space-y-4 flex-1 text-center md:text-left">
                    <span className="px-3 py-1 bg-[var(--brand-color)]/10 text-[var(--brand-color)] rounded-lg text-[9px] font-black uppercase tracking-widest">Latest Sync Node</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-slate-900">{filteredLessons[0].title}</h1>
                    <p className="text-xl text-slate-500 font-medium">{filteredLessons[0].lecturer} • {filteredLessons[0].courseCode}</p>
                    <div className="pt-4">
                       <button 
                         onClick={() => setActiveLesson(filteredLessons[0])}
                         className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto md:mx-0"
                       >
                          <Play size={20} fill="currentColor" /> Play Now
                       </button>
                    </div>
                 </div>
              </div>
           </section>
         )}

         {/* 4. MASTER LIST */}
         <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-4">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Stream Registry</h3>
               <div className="hidden md:flex items-center gap-24 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="w-32">Course</span>
                  <span className="w-20">Duration</span>
               </div>
            </div>

            <div className="space-y-1">
               {filteredLessons.map((lesson, idx) => (
                 <div 
                   key={lesson.id} 
                   onClick={() => setActiveLesson(lesson)}
                   className={`group flex items-center gap-6 px-6 py-4 rounded-2xl transition-all cursor-pointer border border-transparent ${activeLesson?.id === lesson.id ? 'bg-[var(--brand-color)]/5 border-[var(--brand-color)]/10 shadow-sm' : 'hover:bg-slate-50'}`}
                 >
                    <div className="w-8 shrink-0 flex items-center justify-center">
                       {activeLesson?.id === lesson.id && isPlaying ? (
                          <Signal size={18} className="text-[var(--brand-color)] animate-pulse" />
                       ) : (
                          <span className="text-xs font-black text-slate-300 group-hover:hidden">{idx + 1}</span>
                       )}
                       <Play size={18} className={`text-slate-900 hidden ${activeLesson?.id === lesson.id ? 'hidden' : 'group-hover:block'}`} fill="currentColor" />
                    </div>

                    <div className="flex-1 min-w-0">
                       <h4 className={`text-sm md:text-base font-black uppercase tracking-tight truncate ${activeLesson?.id === lesson.id ? 'text-[var(--brand-color)]' : 'text-slate-800'}`}>
                          {lesson.title}
                       </h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{lesson.lecturer}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-24 shrink-0">
                       <div className="w-32">
                          <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded">{lesson.courseCode}</span>
                       </div>
                       <div className="w-20 text-[10px] font-bold text-slate-400 flex items-center gap-2">
                          <Clock size={12}/> {lesson.duration}
                       </div>
                    </div>

                    <button className="p-2 text-slate-300 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all">
                       <MoreVertical size={18}/>
                    </button>
                 </div>
               ))}

               {filteredLessons.length === 0 && (
                  <div className="py-40 text-center space-y-4">
                     <Database size={48} className="mx-auto text-slate-100" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No telemetry detected in this sector</p>
                  </div>
               )}
            </div>
         </section>
      </div>

      {/* 5. CONTROL DECK (BOTTOM PLAYER) */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-6 md:px-12 py-5 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-4">
           <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
              
              {/* Audio Implementation */}
              <audio 
                ref={audioRef} 
                src={activeLesson.audioUrl} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNext}
              />

              {/* TRACK INFO */}
              <div className="flex items-center gap-5 w-1/4 min-w-0">
                 <img src={activeLesson.contributorAvatar} className="w-14 h-14 rounded-2xl object-cover shadow-xl border border-slate-100 shrink-0" alt="Node" />
                 <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-black uppercase tracking-tight truncate leading-none mb-1.5">{activeLesson.title}</h5>
                    <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-widest truncate">{activeLesson.lecturer}</p>
                 </div>
              </div>

              {/* CONTROLS */}
              <div className="flex-1 flex flex-col items-center gap-3 max-w-xl">
                 <div className="flex items-center gap-8">
                    <button onClick={handlePrev} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipBack size={24}/></button>
                    <button 
                      onClick={() => {
                        if (isPlaying) audioRef.current?.pause();
                        else audioRef.current?.play();
                      }}
                      className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                       {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="translate-x-0.5" />}
                    </button>
                    <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipForward size={24}/></button>
                 </div>
                 <div className="w-full flex items-center gap-4 px-4">
                    <span className="text-[9px] font-mono font-bold text-slate-400">00:00</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer relative group">
                       <div className={`h-full bg-[var(--brand-color)] w-1/3 transition-all ${isPlaying ? 'animate-shimmer' : ''}`}></div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400">{activeLesson.duration}</span>
                 </div>
              </div>

              {/* TOOLS */}
              <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Volume2 size={18} />
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-400 w-2/3"></div>
                    </div>
                 </div>
                 <button onClick={() => setActiveLesson(null)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                    <X size={20}/>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 6. UPLOAD MODAL (WHITE) */}
      {isUploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl space-y-10 border border-slate-100 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg"><FileAudio size={24} className="text-[var(--brand-color)]" /></div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Sync_Local_Audio</h2>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><X size={28}/></button>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Choose Recording Node</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 ${uploadForm.file ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : 'border-slate-200'}`}
                    >
                       {uploadForm.file ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="p-4 bg-white rounded-2xl shadow-xl"><FileAudio size={32} className="text-[var(--brand-color)]" /></div>
                             <span className="text-xs font-black uppercase text-slate-900 text-center truncate max-w-xs">{uploadForm.file.name}</span>
                          </div>
                       ) : (
                          <>
                             <div className="p-4 bg-slate-50 rounded-2xl text-slate-400"><Plus size={32} /></div>
                             <span className="text-[10px] font-black uppercase text-slate-400">Drag & Drop or Click to Pick</span>
                          </>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileChange} />
                 </div>

                 <div className="space-y-5">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Signal_Title</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner" 
                         value={uploadForm.title}
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                         placeholder="e.g. Lec 12: Distributed Systems" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course_Code</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none" 
                            value={uploadForm.courseCode}
                            onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})}
                            placeholder="e.g. CSC 2200" 
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lecturer</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none" 
                            value={uploadForm.lecturer}
                            onChange={e => setUploadForm({...uploadForm, lecturer: e.target.value})}
                            placeholder="Lecturer Name..." 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleUpload}
                   disabled={!uploadForm.file || !uploadForm.title}
                   className="w-full bg-slate-900 hover:bg-black disabled:opacity-30 text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Commit to Registry
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-shimmer {
           background: linear-gradient(90deg, var(--brand-color) 0%, #2dd4bf 50%, var(--brand-color) 100%);
           background-size: 200% 100%;
           animation: shimmer-load 2s linear infinite;
        }
        @keyframes shimmer-load {
           0% { background-position: 100% 0; }
           100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
};

export default LectureStream;