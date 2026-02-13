import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Play, Search, Plus, 
  X, Database, Globe,
  Signal, Info,
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
  Link,
  History,
  TrendingUp,
  Radio,
  Share2,
  Calendar,
  Waves,
  Zap,
  Mic2,
  Settings,
  Cpu,
  ListMusic,
  Heart,
  Repeat,
  Shuffle,
  ChevronRight,
  Download
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const Equalizer: React.FC = () => (
  <div className="flex items-end gap-[2px] h-3 w-4">
    <div className="w-[3px] bg-[var(--brand-color)] rounded-full animate-eq-1 h-full"></div>
    <div className="w-[3px] bg-[var(--brand-color)] rounded-full animate-eq-2 h-2/3"></div>
    <div className="w-[3px] bg-[var(--brand-color)] rounded-full animate-eq-3 h-full"></div>
    <div className="w-[3px] bg-[var(--brand-color)] rounded-full animate-eq-1 h-1/2"></div>
  </div>
);

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  
  // Feature: Automatically detect user's college hub on initialization
  const [activeCollege, setActiveCollege] = useState<College | 'Global'>(currentUser.college);
  
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    setLessons(db.getAudioLessons().sort((a, b) => b.id.localeCompare(a.id)));
  }, []);

  useEffect(() => {
    if (activeLesson && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => setIsPlaying(false));
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    const idx = filteredLessons.findIndex(l => l.id === activeLesson?.id);
    if (idx < filteredLessons.length - 1) setActiveLesson(filteredLessons[idx + 1]);
  };

  const handlePrev = () => {
    const idx = filteredLessons.findIndex(l => l.id === activeLesson?.id);
    if (idx > 0) setActiveLesson(filteredLessons[idx - 1]);
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.file) return;
    const fileUrl = URL.createObjectURL(uploadForm.file);
    const newLesson: AudioLesson = {
      id: `aud-${Date.now()}`,
      title: uploadForm.title,
      lecturer: uploadForm.lecturer || 'Faculty Node',
      courseCode: uploadForm.courseCode || 'GEN 101',
      course: uploadForm.course,
      year: uploadForm.year,
      college: uploadForm.college,
      duration: '00:00',
      date: 'Just now',
      audioUrl: fileUrl,
      contributor: currentUser.name,
      contributorAvatar: currentUser.avatar,
      plays: 0,
      description: uploadForm.description
    };
    db.addAudioLesson(newLesson);
    setLessons([newLesson, ...db.getAudioLessons()]);
    setIsUploading(false);
    setUploadForm({ ...uploadForm, title: '', file: null });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40 selection:bg-[var(--brand-color)] selection:text-white">
      
      {/* 1. TOP NAVIGATION BAR - Light Glassmorphic */}
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl px-8 py-4 flex items-center justify-between gap-6 border-b border-slate-100">
         <div className="flex items-center gap-2">
            <div className="flex gap-2">
               <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><ChevronRight className="rotate-180" size={18}/></button>
               <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><ChevronRight size={18}/></button>
            </div>
            <div className="relative group ml-4 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={16} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-xs font-bold w-64 md:w-80 outline-none focus:ring-2 focus:ring-[var(--brand-color)]/20 transition-all shadow-inner"
                placeholder="Find a lecture or lecturer..."
              />
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsUploading(true)}
              className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
            >
               Upload Signal
            </button>
            <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Auto_Detected</p>
                    <p className="text-[11px] font-black text-[var(--brand-color)] mt-1">{currentUser.college} HUB</p>
                </div>
                <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden cursor-pointer active:scale-90 transition-transform p-0.5">
                   <img src={currentUser.avatar} className="w-full h-full object-cover rounded-full" alt="Profile" />
                </div>
            </div>
         </div>
      </nav>

      {/* 2. DYNAMIC HEADER SECTION (Spotify Light Mode) */}
      <header className="relative px-8 pt-10 pb-12 flex flex-col md:flex-row items-end gap-10 overflow-hidden">
         {/* Background Subtle Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-color)]/10 via-white to-white -z-10"></div>
         
         <div className="w-52 h-52 md:w-64 md:h-64 rounded-xl shadow-[0_20px_50px_rgba(16,145,138,0.15)] overflow-hidden shrink-0 group relative border-4 border-white">
            <img src={filteredLessons[0]?.contributorAvatar || currentUser.avatar} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt="Header" />
            <div className="absolute inset-0 bg-[var(--brand-color)]/5 group-hover:bg-transparent transition-colors"></div>
         </div>

         <div className="flex-1 space-y-5">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[var(--brand-color)] flex items-center justify-center">
                    <Zap size={8} className="text-white" fill="currentColor" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Registry_Log_Synchronization</p>
            </div>
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900 drop-shadow-sm">
                Academic <span className="text-[var(--brand-color)]">Pulse.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-slate-600">
               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                  <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-5 h-5 object-contain" />
                  <span className="uppercase tracking-tight">The Hill Strata</span>
               </div>
               <span className="opacity-30">•</span>
               <span className="text-slate-900 uppercase">{filteredLessons.length} NODES</span>
               <span className="opacity-30">•</span>
               <span className="text-[var(--brand-color)] uppercase tracking-widest">{activeCollege} HUB</span>
            </div>
         </div>
      </header>

      {/* SECTOR NAVIGATION */}
      <div className="px-8 py-4 border-b border-slate-50 overflow-x-auto no-scrollbar flex items-center gap-2 sticky top-[73px] z-50 bg-white/50 backdrop-blur-md">
         <button 
           onClick={() => setActiveCollege('Global')}
           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCollege === 'Global' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
         >
           Global Pulse
         </button>
         {COLLEGES.map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c)}
             className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCollege === c ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-lg shadow-[var(--brand-color)]/20' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
           >
             {c === currentUser.college ? '★ ' : ''}{c} WING
           </button>
         ))}
      </div>

      {/* 3. CONTROL BAR */}
      <div className="px-8 py-8 flex items-center gap-10">
         <button 
           onClick={() => filteredLessons[0] && setActiveLesson(filteredLessons[0])}
           className="w-16 h-16 bg-[var(--brand-color)] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_15px_40px_rgba(16,145,138,0.4)]"
         >
            <Play size={32} fill="currentColor" className="ml-1" />
         </button>
         <button className="text-slate-300 hover:text-rose-500 transition-colors active:scale-90"><Heart size={36}/></button>
         <button className="text-slate-300 hover:text-slate-900 transition-colors active:scale-90"><Download size={28}/></button>
         <button className="text-slate-300 hover:text-slate-900 transition-colors ml-auto"><ListMusic size={28}/></button>
      </div>

      {/* 4. TRACKLIST TABLE (Spotify Light Theme) */}
      <div className="px-8">
         <div className="grid grid-cols-[30px_2fr_1fr_1fr_80px] gap-6 px-5 py-3 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="text-center">#</span>
            <span>Title / Lecturer</span>
            <span>Course Code</span>
            <span>Committed</span>
            <span className="text-right flex items-center justify-end gap-2"><Clock size={14}/> Duration</span>
         </div>

         <div className="mt-2 space-y-1">
            {filteredLessons.map((lesson, idx) => {
               const isActive = activeLesson?.id === lesson.id;
               return (
                  <div 
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`grid grid-cols-[30px_2fr_1fr_1fr_80px] gap-6 px-5 py-4 rounded-xl group hover:bg-slate-50 cursor-pointer transition-all items-center border border-transparent ${isActive ? 'bg-slate-50 border-slate-100' : ''}`}
                  >
                     <div className="flex items-center justify-center text-xs font-bold text-slate-400">
                        {isActive && isPlaying ? (
                           <Equalizer />
                        ) : (
                           <>
                             <span className="group-hover:hidden tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                             <Play size={16} className="hidden group-hover:block text-[var(--brand-color)]" fill="currentColor" />
                           </>
                        )}
                     </div>

                     <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-lg shadow-sm border border-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            <img src={lesson.contributorAvatar} className="w-full h-full object-cover" alt="Node" />
                        </div>
                        <div className="min-w-0">
                           <h4 className={`text-[14px] font-black truncate uppercase tracking-tight ${isActive ? 'text-[var(--brand-color)]' : 'text-slate-800'}`}>{lesson.title}</h4>
                           <p className="text-[11px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">{lesson.lecturer}</p>
                        </div>
                     </div>

                     <div className="text-[11px] font-black text-slate-500 uppercase tracking-tighter truncate">
                        {lesson.courseCode}
                     </div>

                     <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {lesson.date}
                     </div>

                     <div className="text-[11px] font-mono text-slate-400 text-right tabular-nums font-bold">
                        {lesson.duration}
                     </div>
                  </div>
               );
            })}
         </div>

         {filteredLessons.length === 0 && (
            <div className="py-48 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                   <Mic2 size={48} className="text-slate-200" />
               </div>
               <div className="space-y-1">
                   <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-300">Registry_Strata_Empty</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">No academic signals detected in the {activeCollege} Wing.</p>
               </div>
               <button onClick={() => setActiveCollege('Global')} className="px-10 py-3 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] hover:text-[var(--brand-color)] transition-all">Scan Universal Strata</button>
            </div>
         )}
      </div>

      {/* 5. SPOTIFY PLAYER BAR (Light Theme) */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 h-28 bg-white/95 border-t border-slate-100 px-8 flex items-center justify-between z-[2000] backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
           
           <audio 
             ref={audioRef} 
             src={activeLesson.audioUrl} 
             onTimeUpdate={handleTimeUpdate}
             onEnded={handleNext}
             onPlay={() => setIsPlaying(true)}
             onPause={() => setIsPlaying(false)}
           />

           {/* LEFT: Current Node Metadata */}
           <div className="flex items-center gap-5 w-1/4 min-w-0">
              <div className="relative group shrink-0 shadow-2xl">
                 <img src={activeLesson.contributorAvatar} className="w-16 h-16 rounded-xl border-2 border-white object-cover" alt="Playing" />
                 <button onClick={() => {}} className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"><Maximize2 size={18} className="text-white"/></button>
              </div>
              <div className="min-w-0">
                 <h5 className="text-[14px] font-black text-slate-900 truncate uppercase hover:underline cursor-pointer tracking-tight">{activeLesson.title}</h5>
                 <div className="flex items-center gap-2 mt-1">
                    <p className="text-[11px] font-bold text-slate-400 truncate uppercase hover:text-[var(--brand-color)] transition-colors cursor-pointer">{activeLesson.lecturer}</p>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="text-[10px] font-black text-[var(--brand-color)] uppercase">{activeLesson.college} Hub</span>
                 </div>
              </div>
              <button className="text-slate-300 hover:text-rose-500 transition-all ml-3 active:scale-125"><Heart size={20}/></button>
           </div>

           {/* CENTER: Signal Controls */}
           <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl px-10">
              <div className="flex items-center gap-10 text-slate-400">
                 <button className="hover:text-[var(--brand-color)] transition-colors"><Shuffle size={18}/></button>
                 <button onClick={handlePrev} className="hover:text-slate-900 transition-colors active:scale-75"><SkipBack size={28} fill="currentColor"/></button>
                 <button 
                   onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                   className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-slate-200"
                 >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                 </button>
                 <button onClick={handleNext} className="hover:text-slate-900 transition-colors active:scale-75"><SkipForward size={28} fill="currentColor"/></button>
                 <button className="hover:text-[var(--brand-color)] transition-colors"><Repeat size={18}/></button>
              </div>
              <div className="w-full flex items-center gap-4">
                 <span className="text-[10px] font-black text-slate-400 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
                 <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden relative group cursor-pointer">
                    <div 
                      className="h-full bg-[var(--brand-color)] relative group-hover:brightness-110 transition-all"
                      style={{ width: `${(currentTime/duration)*100}%` }}
                    >
                       <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-[var(--brand-color)] rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"></div>
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 w-10 tabular-nums">{activeLesson.duration}</span>
              </div>
           </div>

           {/* RIGHT: System Tools */}
           <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-slate-400">
              <button className="hover:text-slate-900 transition-colors"><Mic2 size={18}/></button>
              <button className="hover:text-slate-900 transition-colors"><ListMusic size={18}/></button>
              <div className="flex items-center gap-3 group/vol">
                 <Volume2 size={20} className="group-hover/vol:text-slate-900 transition-colors" />
                 <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 group-hover/vol:bg-[var(--brand-color)] w-2/3 transition-all"></div>
                 </div>
              </div>
              <div className="h-8 w-px bg-slate-100 mx-2"></div>
              <button onClick={() => setActiveLesson(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-all active:scale-90"><X size={22}/></button>
           </div>
        </div>
      )}

      {/* 6. UPLOAD DIALOG (Light Spotify UI) */}
      {isUploading && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white w-full max-w-xl p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-10">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Sync_Log_Uplink</h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Commit new academic audio node</p>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X size={32}/></button>
              </div>
              
              <div className="space-y-8">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`w-full border-4 border-dashed border-slate-100 rounded-3xl p-20 flex flex-col items-center justify-center gap-5 cursor-pointer hover:bg-slate-50 hover:border-[var(--brand-color)]/30 transition-all group ${uploadForm.file ? 'border-[var(--brand-color)]/40 bg-[var(--brand-color)]/5 shadow-inner' : ''}`}
                 >
                    {uploadForm.file ? (
                        <div className="text-center space-y-3 animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto border border-slate-100 text-[var(--brand-color)]">
                                <FileAudio size={40} />
                            </div>
                            <span className="text-[12px] font-black uppercase tracking-tight text-slate-900 block truncate max-w-[300px]">{uploadForm.file.name}</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={40} className="text-slate-300 group-hover:text-[var(--brand-color)]" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-600">Authorize Payload</span>
                        </>
                    )}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})} />

                 <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Signal Identifier</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[var(--brand-color)]/5 focus:bg-white transition-all shadow-inner" 
                         placeholder="COMMIT_TITLE (e.g. Lec 04: Discrete Strata)" 
                         value={uploadForm.title} 
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})} 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Wing Sector</label>
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white transition-all shadow-inner" placeholder="CSC 2100" value={uploadForm.courseCode} onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Origin Node</label>
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white transition-all shadow-inner" placeholder="Full Academic Name" value={uploadForm.lecturer} onChange={e => setUploadForm({...uploadForm, lecturer: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <button onClick={handleUpload} disabled={!uploadForm.file || !uploadForm.title} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale">Authorize Protocol Commit</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes eq-1 { 0%, 100% { height: 30%; } 50% { height: 100%; } }
        @keyframes eq-2 { 0%, 100% { height: 100%; } 50% { height: 40%; } }
        @keyframes eq-3 { 0%, 100% { height: 60%; } 50% { height: 100%; } }

        .animate-eq-1 { animation: eq-1 0.6s ease-in-out infinite; }
        .animate-eq-2 { animation: eq-2 0.8s ease-in-out infinite; }
        .animate-eq-3 { animation: eq-3 0.7s ease-in-out infinite; }

        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LectureStream;