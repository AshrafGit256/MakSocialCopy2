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
  const [activeCollege, setActiveCollege] = useState<College | 'Global'>('Global');
  
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
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-32 selection:bg-[var(--brand-color)] selection:text-white">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-[#000000]/40 backdrop-blur-xl px-8 py-4 flex items-center justify-between gap-6">
         <div className="flex items-center gap-2">
            <div className="flex gap-2">
               <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ChevronRight className="rotate-180" size={20}/></button>
               <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ChevronRight size={20}/></button>
            </div>
            <div className="relative group ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#242424] hover:bg-[#2a2a2a] border-none rounded-full py-2.5 pl-10 pr-4 text-xs font-medium w-64 md:w-80 outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="What do you want to learn?"
              />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUploading(true)}
              className="bg-white text-black px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
               Upload Signal
            </button>
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden cursor-pointer active:scale-90 transition-transform">
               <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
         </div>
      </nav>

      {/* 2. DYNAMIC HEADER SECTION (Spotify Playlist Style) */}
      <header className="relative px-8 pt-8 pb-10 flex flex-col md:flex-row items-end gap-8 overflow-hidden">
         {/* Background Dynamic Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-color)]/40 to-[#121212] -z-10"></div>
         
         <div className="w-48 h-48 md:w-60 md:h-60 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 group relative">
            <img src={filteredLessons[0]?.contributorAvatar || currentUser.avatar} className="w-full h-full object-cover shadow-2xl" alt="Header" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
         </div>

         <div className="flex-1 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Registry_Log_Synchronization</p>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">Academic <span className="text-[var(--brand-color)]">Pulse</span></h1>
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold">
               <div className="flex items-center gap-1">
                  <img src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png" className="w-5 h-5 object-contain" />
                  <span>Makerere University</span>
               </div>
               <span className="opacity-40">•</span>
               <span>{filteredLessons.length} synchronized nodes</span>
               <span className="opacity-40">•</span>
               <span className="text-slate-400">v5.2 Global Strata</span>
            </div>
         </div>
      </header>

      {/* 3. CONTROL BAR */}
      <div className="px-8 py-6 flex items-center gap-8">
         <button 
           onClick={() => filteredLessons[0] && setActiveLesson(filteredLessons[0])}
           className="w-14 h-14 bg-[var(--brand-color)] text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[var(--brand-color)]/20"
         >
            <Play size={30} fill="currentColor" />
         </button>
         <button className="text-slate-400 hover:text-white transition-colors"><Heart size={32}/></button>
         <button className="text-slate-400 hover:text-white transition-colors"><Download size={24}/></button>
         <button className="text-slate-400 hover:text-white transition-colors ml-auto"><ListMusic size={24}/></button>
      </div>

      {/* 4. TRACKLIST TABLE (The Core Design) */}
      <div className="px-8 mt-4">
         <div className="grid grid-cols-[16px_1fr_1fr_1fr_80px] gap-4 px-4 py-3 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>#</span>
            <span>Title / Protocol</span>
            <span>Faculty Hub</span>
            <span>Date Committed</span>
            <span className="text-right"><Clock size={14}/></span>
         </div>

         <div className="mt-2 space-y-1">
            {filteredLessons.map((lesson, idx) => {
               const isActive = activeLesson?.id === lesson.id;
               return (
                  <div 
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`grid grid-cols-[16px_1fr_1fr_1fr_80px] gap-4 px-4 py-3 rounded-lg group hover:bg-white/10 cursor-pointer transition-all items-center ${isActive ? 'bg-white/5' : ''}`}
                  >
                     <div className="flex items-center justify-center text-xs font-bold text-slate-400">
                        {isActive && isPlaying ? (
                           <Equalizer />
                        ) : (
                           <>
                             <span className="group-hover:hidden">{idx + 1}</span>
                             <Play size={14} className="hidden group-hover:block text-white" fill="currentColor" />
                           </>
                        )}
                     </div>

                     <div className="flex items-center gap-4 min-w-0">
                        <img src={lesson.contributorAvatar} className="w-10 h-10 rounded shadow-lg object-cover shrink-0" />
                        <div className="min-w-0">
                           <h4 className={`text-sm font-black truncate uppercase tracking-tight ${isActive ? 'text-[var(--brand-color)]' : 'text-white'}`}>{lesson.title}</h4>
                           <p className="text-[11px] font-bold text-slate-400 truncate uppercase">{lesson.lecturer}</p>
                        </div>
                     </div>

                     <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">
                        {lesson.college} Sector / {lesson.courseCode}
                     </div>

                     <div className="text-xs font-bold text-slate-500 uppercase">
                        {lesson.date}
                     </div>

                     <div className="text-[11px] font-mono text-slate-400 text-right">
                        {lesson.duration}
                     </div>
                  </div>
               );
            })}
         </div>

         {filteredLessons.length === 0 && (
            <div className="py-40 text-center space-y-4 opacity-20">
               <Mic2 size={64} className="mx-auto" />
               <p className="text-sm font-black uppercase tracking-[0.4em]">Signal_Log_Nullified</p>
            </div>
         )}
      </div>

      {/* 5. SPOTIFY PLAYER BAR (Bottom) */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#000000] border-t border-white/5 px-6 flex items-center justify-between z-[2000] backdrop-blur-2xl">
           
           <audio 
             ref={audioRef} 
             src={activeLesson.audioUrl} 
             onTimeUpdate={handleTimeUpdate}
             onEnded={handleNext}
             onPlay={() => setIsPlaying(true)}
             onPause={() => setIsPlaying(false)}
           />

           {/* LEFT: Current Track Info */}
           <div className="flex items-center gap-4 w-1/4 min-w-0">
              <div className="relative group shrink-0">
                 <img src={activeLesson.contributorAvatar} className="w-14 h-14 rounded shadow-2xl" alt="Playing" />
                 <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Maximize2 size={16}/></button>
              </div>
              <div className="min-w-0">
                 <h5 className="text-[13px] font-black text-white truncate uppercase hover:underline cursor-pointer">{activeLesson.title}</h5>
                 <p className="text-[10px] font-bold text-slate-400 truncate uppercase hover:underline cursor-pointer">{activeLesson.lecturer}</p>
              </div>
              <button className="text-slate-400 hover:text-[var(--brand-color)] transition-all ml-2"><Heart size={16}/></button>
           </div>

           {/* CENTER: Transport Controls */}
           <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl px-8">
              <div className="flex items-center gap-6 text-slate-400">
                 <button className="hover:text-white transition-colors"><Shuffle size={18}/></button>
                 <button onClick={handlePrev} className="hover:text-white transition-colors active:scale-90"><SkipBack size={24} fill="currentColor"/></button>
                 <button 
                   onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                   className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                 >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                 </button>
                 <button onClick={handleNext} className="hover:text-white transition-colors active:scale-90"><SkipForward size={24} fill="currentColor"/></button>
                 <button className="hover:text-white transition-colors"><Repeat size={18}/></button>
              </div>
              <div className="w-full flex items-center gap-3">
                 <span className="text-[9px] font-mono text-slate-500 w-8 text-right">{formatTime(currentTime)}</span>
                 <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                    <div 
                      className="h-full bg-[var(--brand-color)] relative group-hover:bg-[#1ed760] transition-all"
                      style={{ width: `${(currentTime/duration)*100}%` }}
                    >
                       <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl"></div>
                    </div>
                 </div>
                 <span className="text-[9px] font-mono text-slate-500 w-8">{activeLesson.duration}</span>
              </div>
           </div>

           {/* RIGHT: Extra Tools */}
           <div className="hidden md:flex items-center justify-end gap-4 w-1/4 text-slate-400">
              <button className="hover:text-white transition-colors"><Mic2 size={16}/></button>
              <button className="hover:text-white transition-colors"><ListMusic size={16}/></button>
              <div className="flex items-center gap-2 group/vol">
                 <Volume2 size={18} className="group-hover/vol:text-white transition-colors" />
                 <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 group-hover/vol:bg-[var(--brand-color)] w-2/3"></div>
                 </div>
              </div>
              <button onClick={() => setActiveLesson(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={18}/></button>
           </div>
        </div>
      )}

      {/* 6. UPLOAD DIALOG (Spotify Themed) */}
      {isUploading && (
        <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-[#181818] w-full max-w-xl p-10 rounded-xl shadow-2xl border border-white/5 space-y-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                 <h2 className="text-2xl font-black uppercase tracking-tight">Upload Protocol</h2>
                 <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-white transition-colors"><X size={28}/></button>
              </div>
              
              <div className="space-y-6">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`w-full border-2 border-dashed border-white/10 rounded-xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all ${uploadForm.file ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : ''}`}
                 >
                    <FileAudio size={48} className={uploadForm.file ? 'text-[var(--brand-color)]' : 'text-slate-500'} />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{uploadForm.file ? uploadForm.file.name : 'Choose Audio File'}</span>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})} />

                 <div className="space-y-4">
                    <input className="w-full bg-[#242424] border-none rounded-lg p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-white/20" placeholder="Signal Title..." value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                       <input className="w-full bg-[#242424] border-none rounded-lg p-4 text-sm font-bold outline-none" placeholder="Sector Code (CSC 2100)" value={uploadForm.courseCode} onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})} />
                       <input className="w-full bg-[#242424] border-none rounded-lg p-4 text-sm font-bold outline-none" placeholder="Origin Node (Lecturer)" value={uploadForm.lecturer} onChange={e => setUploadForm({...uploadForm, lecturer: e.target.value})} />
                    </div>
                 </div>

                 <button onClick={handleUpload} disabled={!uploadForm.file || !uploadForm.title} className="w-full bg-[var(--brand-color)] text-black py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-30">Commit to Registry</button>
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