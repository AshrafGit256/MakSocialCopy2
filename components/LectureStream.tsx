import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Play, Search, Plus, 
  X, Database, Globe,
  ShieldCheck,
  Cpu, Zap, Signal, Info,
  SkipBack, SkipForward,
  Clock, Headphones,
  Upload,
  FileAudio,
  MoreVertical,
  Volume2,
  Pause,
  ExternalLink,
  Maximize2,
  Activity,
  Link
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
  const [showBridge, setShowBridge] = useState(false);
  
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

  // Handle Playback Logic based on Source Type
  useEffect(() => {
    if (activeLesson) {
      const isRemote = activeLesson.audioUrl.includes('drive.google.com');
      
      // If it's a local file, try to auto-play via the audio tag
      if (!isRemote && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {
            console.log("Interaction required for local playback");
            setIsPlaying(false);
        });
      } else {
        // If it's remote, we reset the audio tag to prevent source errors
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        setIsPlaying(true); // Remote iframe handles its own 'playing' state visually
      }
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
    
    const fileUrl = URL.createObjectURL(uploadForm.file);
    
    const newLesson: AudioLesson = {
      id: `aud-${Date.now()}`,
      title: uploadForm.title,
      lecturer: uploadForm.lecturer || 'Faculty Node',
      courseCode: uploadForm.courseCode || 'GEN 101',
      course: uploadForm.course,
      year: uploadForm.year,
      college: uploadForm.college,
      duration: 'Local Sync',
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
  };

  const isRemoteActive = activeLesson?.audioUrl.includes('drive.google.com');

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
      <div className="px-6 md:px-12 py-4 border-b border-slate-50 overflow-x-auto no-scrollbar flex items-center gap-2">
         <button 
            onClick={() => setActiveCollege('Global')}
            className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCollege === 'Global' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
         >
           All Hubs
         </button>
         {COLLEGES.map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c)}
             className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCollege === c ? 'bg-[var(--brand-color)] text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
           >
             {c} Wing
           </button>
         ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
         
         {/* 3. FEATURED BOX */}
         {!search && filteredLessons.length > 0 && activeCollege === 'Global' && (
           <section className="mb-12 bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                 <Headphones size={350} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-4 relative group/art">
                    <img src={filteredLessons[0].contributorAvatar} className="w-full h-full object-cover rounded-[2rem] grayscale group-hover/art:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center">
                        <Signal size={40} className="text-white animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-4 flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 bg-[var(--brand-color)] text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">New Node</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{filteredLessons[0].college}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-slate-900 drop-shadow-sm">{filteredLessons[0].title}</h1>
                    <p className="text-xl text-slate-500 font-medium italic">"{filteredLessons[0].lecturer} • {filteredLessons[0].courseCode}"</p>
                    <div className="pt-6">
                       <button 
                         onClick={() => setActiveLesson(filteredLessons[0])}
                         className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto md:mx-0"
                       >
                          <Play size={20} fill="currentColor" /> Initialize Audio Sync
                       </button>
                    </div>
                 </div>
              </div>
           </section>
         )}

         {/* 4. MASTER LIST */}
         <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <Activity size={16} className="text-[var(--brand-color)]" /> Stream Registry
               </h3>
               <div className="hidden md:flex items-center gap-24 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="w-32">Module</span>
                  <span className="w-24">Duration</span>
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
                       {activeLesson?.id === lesson.id ? (
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
                       <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lesson.lecturer}</p>
                          <span className="text-slate-200">•</span>
                          <span className="text-[9px] font-black text-slate-300 uppercase">{lesson.date}</span>
                       </div>
                    </div>

                    <div className="hidden md:flex items-center gap-24 shrink-0">
                       <div className="w-32">
                          <span className="text-[8px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">{lesson.courseCode}</span>
                       </div>
                       <div className="w-24 text-[10px] font-bold text-slate-400 flex items-center gap-2">
                          <Clock size={12} className="opacity-50"/> {lesson.duration}
                       </div>
                    </div>

                    <button className="p-2 text-slate-300 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all">
                       <MoreVertical size={18}/>
                    </button>
                 </div>
               ))}

               {filteredLessons.length === 0 && (
                  <div className="py-40 text-center space-y-6">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                        <Database size={40} className="text-slate-200" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Registry Sequence Nullified</p>
                        <p className="text-xs text-slate-400 font-medium">No telemetry detected in this sector.</p>
                     </div>
                  </div>
               )}
            </div>
         </section>
      </div>

      {/* 5. CONTROL DECK (BOTTOM PLAYER) */}
      {activeLesson && (
        <div className={`fixed bottom-0 left-0 right-0 z-[500] bg-white/95 backdrop-blur-3xl border-t border-slate-100 px-6 md:px-12 py-5 shadow-[0_-20px_60px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-4 transition-all duration-500 ${showBridge ? 'h-[500px]' : 'h-24 md:h-28'}`}>
           
           <div className="max-w-[1600px] mx-auto h-full flex flex-col">
              
              {/* Audio Implementation for Local Blobs */}
              <audio 
                ref={audioRef} 
                src={activeLesson.audioUrl} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNext}
                className="hidden"
              />

              {/* Main Control Bar */}
              <div className="flex items-center justify-between gap-8 h-20">
                
                {/* TRACK INFO */}
                <div className="flex items-center gap-5 w-1/4 min-w-0">
                    <div className="relative group shrink-0">
                        <img src={activeLesson.contributorAvatar} className="w-14 h-14 rounded-2xl object-cover shadow-xl border border-slate-100" alt="Node" />
                        {isRemoteActive && (
                            <button 
                                onClick={() => setShowBridge(!showBridge)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-2xl transition-all"
                            >
                                <Maximize2 size={16}/>
                            </button>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-black uppercase tracking-tight truncate leading-none">{activeLesson.title}</h5>
                            <span className={`px-1.5 py-0.5 rounded-[1px] text-[7px] font-black uppercase tracking-widest border ${isRemoteActive ? 'text-indigo-500 border-indigo-100' : 'text-emerald-500 border-emerald-100'}`}>
                                {isRemoteActive ? 'Remote Node' : 'Local Node'}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-widest truncate">{activeLesson.lecturer}</p>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex-1 flex flex-col items-center gap-3 max-w-xl">
                    <div className="flex items-center gap-10">
                        <button onClick={handlePrev} className="text-slate-400 hover:text-slate-900 transition-colors transform hover:scale-110 active:scale-95"><SkipBack size={24}/></button>
                        
                        {isRemoteActive ? (
                            <div className="flex flex-col items-center gap-1">
                                <button 
                                    onClick={() => setShowBridge(!showBridge)}
                                    className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/20 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Signal size={24} className="animate-pulse" />
                                </button>
                                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mt-1">Registry Link</span>
                            </div>
                        ) : (
                            <button 
                                onClick={() => {
                                    if (isPlaying) audioRef.current?.pause();
                                    else audioRef.current?.play();
                                }}
                                className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                            >
                                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="translate-x-0.5" />}
                            </button>
                        )}
                        
                        <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-colors transform hover:scale-110 active:scale-95"><SkipForward size={24}/></button>
                    </div>
                    
                    {!isRemoteActive && (
                        <div className="w-full flex items-center gap-4 px-4">
                            <span className="text-[9px] font-mono font-bold text-slate-400">00:00</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer relative group">
                                <div className={`h-full bg-[var(--brand-color)] w-1/3 transition-all ${isPlaying ? 'animate-shimmer' : ''}`}></div>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-slate-400">{activeLesson.duration}</span>
                        </div>
                    )}
                </div>

                {/* TOOLS */}
                <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                    {isRemoteActive && (
                         <button 
                            onClick={() => setShowBridge(!showBridge)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showBridge ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                         >
                            <Link size={14}/> Neural Bridge
                         </button>
                    )}
                    <div className="flex items-center gap-3 text-slate-400">
                        <Volume2 size={18} />
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 w-2/3"></div>
                        </div>
                    </div>
                    <button onClick={() => { setActiveLesson(null); setShowBridge(false); }} className="p-2 text-slate-300 hover:text-rose-500 transition-all transform hover:rotate-90">
                        <X size={20}/>
                    </button>
                </div>
              </div>

              {/* NEURAL BRIDGE IFRAME CONTAINER (Expanded View) */}
              {showBridge && isRemoteActive && (
                <div className="flex-1 mt-6 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-slate-100">
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                             <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/10">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Active Stream Integrity: 100%</span>
                             </div>
                        </div>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                             <button onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all border border-white/10">
                                <ExternalLink size={16}/>
                             </button>
                             <button onClick={() => setShowBridge(false)} className="p-2.5 bg-rose-500 text-white rounded-xl shadow-lg transition-all active:scale-90">
                                <X size={16}/>
                             </button>
                        </div>
                        <iframe 
                            src={activeLesson.audioUrl} 
                            className="w-full h-full border-none"
                            allow="autoplay"
                        ></iframe>
                    </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* 6. UPLOAD MODAL (WHITE) */}
      {isUploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] space-y-10 border border-slate-100 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--brand-color)] rounded-2xl shadow-xl shadow-[var(--brand-color)]/20">
                        <FileAudio size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Direct Uplink</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Commit audio node to local registry</p>
                    </div>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">1. Choose Logic Node (Audio)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 ${uploadForm.file ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5 shadow-inner' : 'border-slate-200 bg-slate-50'}`}
                    >
                       {uploadForm.file ? (
                          <div className="flex flex-col items-center gap-3 animate-in zoom-in-95">
                             <div className="p-5 bg-white rounded-3xl shadow-2xl border border-slate-50 text-[var(--brand-color)]"><FileAudio size={40} /></div>
                             <div className="text-center">
                                <span className="text-xs font-black uppercase text-slate-900 block truncate max-w-[240px]">{uploadForm.file.name}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Size: {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</span>
                             </div>
                          </div>
                       ) : (
                          <>
                             <div className="p-5 bg-white rounded-3xl text-slate-300 shadow-sm"><Plus size={32} /></div>
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Academic Signal</span>
                          </>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileChange} />
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Signal Title</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner text-slate-900" 
                         value={uploadForm.title}
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                         placeholder="e.g. Lec 12: Distributed Strata" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Module Code</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900" 
                            value={uploadForm.courseCode}
                            onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})}
                            placeholder="e.g. CSC 2201" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Source Node (Lecturer)</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900" 
                            value={uploadForm.lecturer}
                            onChange={e => setUploadForm({...uploadForm, lecturer: e.target.value})}
                            placeholder="Full Name..." 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleUpload}
                   disabled={!uploadForm.file || !uploadForm.title}
                   className="w-full bg-slate-900 hover:bg-black disabled:opacity-20 text-white py-5 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Authorize Commit to Registry
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
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LectureStream;