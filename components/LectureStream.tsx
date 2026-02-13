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
  Download,
  BookOpen,
  CheckCircle2,
  UserCheck,
  Filter,
  GraduationCap
} from 'lucide-react';

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
  
  // Enrollment State
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem(`enrolled_courses_${currentUser.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCourse, setSelectedCourse] = useState<string | 'All'>(() => {
    const saved = localStorage.getItem(`last_selected_course_${currentUser.id}`);
    return saved || 'All';
  });
  
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLessons(db.getAudioLessons());
  }, []);

  useEffect(() => {
    localStorage.setItem(`enrolled_courses_${currentUser.id}`, JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem(`last_selected_course_${currentUser.id}`, selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    if (activeLesson && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [activeLesson]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      // Rule 1: Always filter by user's current college hub
      if (l.college !== currentUser.college) return false;
      
      // Rule 2: Search filter
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                            l.lecturer.toLowerCase().includes(search.toLowerCase());
      
      // Rule 3: Enrolled course filter
      const matchesCourse = selectedCourse === 'All' || l.course === selectedCourse;
      
      return matchesSearch && matchesCourse;
    });
  }, [lessons, search, selectedCourse, currentUser.college]);

  const toggleEnroll = (courseName: string) => {
    setEnrolledCourses(prev => 
      prev.includes(courseName) ? prev.filter(c => c !== courseName) : [...prev, courseName]
    );
  };

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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40 selection:bg-[var(--brand-color)] selection:text-white">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between gap-6 border-b border-slate-100">
         <div className="flex items-center gap-4">
            <div className="flex gap-2">
               <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><ChevronRight className="rotate-180" size={18}/></button>
               <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><ChevronRight size={18}/></button>
            </div>
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={16} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-[11px] font-bold w-64 md:w-80 outline-none focus:ring-2 focus:ring-[var(--brand-color)]/20 transition-all"
                placeholder="Search recordings..."
              />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEnrollmentOpen(true)}
              className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
               Manage Courses
            </button>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black uppercase text-slate-400 leading-none">Identity Sync</p>
                  <p className="text-[11px] font-black text-[var(--brand-color)] mt-1">{currentUser.college} HUB</p>
               </div>
               <img src={currentUser.avatar} className="w-9 h-9 rounded-full border border-slate-200" alt="Me" />
            </div>
         </div>
      </nav>

      {/* 2. DYNAMIC HEADER SECTION */}
      <header className="relative px-8 pt-10 pb-12 flex flex-col md:flex-row items-end gap-10 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-color)]/10 via-white to-white -z-10"></div>
         
         <div className="w-52 h-52 md:w-64 md:h-64 rounded-xl shadow-[0_20px_50px_rgba(16,145,138,0.1)] overflow-hidden shrink-0 group relative border-4 border-white">
            <img src={filteredLessons[0]?.contributorAvatar || 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png'} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt="Cover" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
         </div>

         <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
               <Zap size={12} className="text-[var(--brand-color)]" fill="currentColor" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Registry_Log_Synchronization</p>
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
               {selectedCourse === 'All' ? `${currentUser.college} Pulse` : selectedCourse}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-slate-600">
               <span className="uppercase">{filteredLessons.length} synchronized segments</span>
               <span className="opacity-30">•</span>
               <span className="text-[var(--brand-color)] uppercase tracking-widest">{currentUser.status} / SEM 1</span>
            </div>
         </div>
      </header>

      {/* 3. COURSE TABS (Enrolled Logic Nodes) */}
      <div className="px-8 py-4 border-b border-slate-50 overflow-x-auto no-scrollbar flex items-center gap-2 sticky top-[65px] z-50 bg-white/50 backdrop-blur-md">
         <button 
           onClick={() => setSelectedCourse('All')}
           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${selectedCourse === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
         >
           Universals
         </button>
         {enrolledCourses.map(c => (
           <button 
             key={c}
             onClick={() => setSelectedCourse(c)}
             className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${selectedCourse === c ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-lg shadow-[var(--brand-color)]/20' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
           >
             {c}
           </button>
         ))}
         {enrolledCourses.length === 0 && (
           <span className="text-[10px] font-bold text-slate-300 italic px-4 uppercase tracking-widest">No nodes enrolled</span>
         )}
      </div>

      {/* 4. TRACKLIST TABLE */}
      <div className="px-8 mt-8">
         <div className="grid grid-cols-[30px_2fr_1fr_1fr_80px] gap-6 px-5 py-3 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="text-center">#</span>
            <span>Title / Lecturer</span>
            <span>Logic Hub</span>
            <span>Date Logged</span>
            <span className="text-right flex items-center justify-end gap-2"><Clock size={12}/> Runtime</span>
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
                             <Play size={14} className="hidden group-hover:block text-[var(--brand-color)]" fill="currentColor" />
                           </>
                        )}
                     </div>

                     <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg shadow-sm border border-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            <img src={lesson.contributorAvatar} className="w-full h-full object-cover" alt="Node" />
                        </div>
                        <div className="min-w-0">
                           <h4 className={`text-[13px] font-black truncate uppercase tracking-tight ${isActive ? 'text-[var(--brand-color)]' : 'text-slate-800'}`}>{lesson.title}</h4>
                           <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">{lesson.lecturer}</p>
                        </div>
                     </div>

                     <div className="text-[11px] font-black text-slate-500 uppercase tracking-tighter truncate">
                        {lesson.course}
                     </div>

                     <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {lesson.date}
                     </div>

                     <div className="text-[11px] font-mono text-slate-400 text-right tabular-nums">
                        {lesson.duration}
                     </div>
                  </div>
               );
            })}
         </div>

         {filteredLessons.length === 0 && (
            <div className="py-40 text-center space-y-4">
               <Headphones size={64} className="mx-auto text-slate-100" />
               <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-300">Registry_Manifest_Null</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Enroll in courses or search the universal hub to populate your feed.</p>
               </div>
               <button onClick={() => setIsEnrollmentOpen(true)} className="px-10 py-3 bg-slate-100 hover:bg-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Open Enrollment Portal</button>
            </div>
         )}
      </div>

      {/* 5. SPOTIFY PLAYER BAR */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 h-28 bg-white border-t border-slate-100 px-8 flex items-center justify-between z-[1000] shadow-[0_-10px_50px_rgba(0,0,0,0.03)] backdrop-blur-xl bg-white/95">
           <audio 
             ref={audioRef} src={activeLesson.audioUrl} 
             onTimeUpdate={handleTimeUpdate} onEnded={handleNext}
             onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
           />

           <div className="flex items-center gap-5 w-1/4 min-w-0">
              <div className="relative group shrink-0 shadow-2xl">
                 <img src={activeLesson.contributorAvatar} className="w-14 h-14 rounded-xl border-2 border-white object-cover shadow-sm" alt="Playing" />
                 <button className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"><Maximize2 size={16} className="text-white"/></button>
              </div>
              <div className="min-w-0">
                 <h5 className="text-[13px] font-black text-slate-900 truncate uppercase hover:underline cursor-pointer tracking-tight">{activeLesson.title}</h5>
                 <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase hover:text-[var(--brand-color)] transition-colors cursor-pointer">{activeLesson.lecturer}</p>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span className="text-[10px] font-black text-[var(--brand-color)] uppercase">{activeLesson.courseCode}</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl px-10">
              <div className="flex items-center gap-8 text-slate-400">
                 <button className="hover:text-[var(--brand-color)] transition-colors"><Shuffle size={18}/></button>
                 <button onClick={handlePrev} className="hover:text-slate-900 transition-colors active:scale-75"><SkipBack size={24} fill="currentColor"/></button>
                 <button 
                   onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                   className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-xl shadow-slate-200"
                 >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                 </button>
                 <button onClick={handleNext} className="hover:text-slate-900 transition-colors active:scale-75"><SkipForward size={24} fill="currentColor"/></button>
                 <button className="hover:text-[var(--brand-color)] transition-colors"><Repeat size={18}/></button>
              </div>
              <div className="w-full flex items-center gap-4">
                 <span className="text-[9px] font-black text-slate-400 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
                 <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden relative group cursor-pointer">
                    <div className="h-full bg-[var(--brand-color)] relative transition-all" style={{ width: `${(currentTime/duration)*100}%` }}>
                       <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[var(--brand-color)] rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity"></div>
                    </div>
                 </div>
                 <span className="text-[9px] font-black text-slate-400 w-10 tabular-nums">{activeLesson.duration}</span>
              </div>
           </div>

           <div className="hidden md:flex items-center justify-end gap-6 w-1/4 text-slate-400">
              <button className="hover:text-slate-900 transition-colors"><Mic2 size={18}/></button>
              <div className="flex items-center gap-3 group/vol">
                 <Volume2 size={20} className="group-hover/vol:text-slate-900 transition-colors" />
                 <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 group-hover/vol:bg-[var(--brand-color)] w-2/3 transition-all"></div>
                 </div>
              </div>
              <div className="h-8 w-px bg-slate-100 mx-2"></div>
              <button onClick={() => setActiveLesson(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
           </div>
        </div>
      )}

      {/* 6. ENROLLMENT PORTAL MODAL */}
      {isEnrollmentOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-10 border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4">
                       <GraduationCap size={32} className="text-[var(--brand-color)]" /> Enrollment_Portal
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronize your academic logic nodes</p>
                 </div>
                 <button onClick={() => setIsEnrollmentOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Hub</p>
                       <div className="flex items-center gap-3">
                          <Globe size={18} className="text-indigo-600"/>
                          <span className="text-lg font-black text-slate-900 uppercase">{currentUser.college} HUB</span>
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stata Level</p>
                       <div className="flex items-center gap-3">
                          <UserCheck size={18} className="text-emerald-600"/>
                          <span className="text-lg font-black text-slate-900 uppercase">{currentUser.status} / SEM 1</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <BookOpen size={16}/> Logic Manifest (Courses)
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                       {COURSES_BY_COLLEGE[currentUser.college].map(course => {
                          const isEnrolled = enrolledCourses.includes(course);
                          return (
                            <div 
                              key={course} 
                              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isEnrolled ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl ${isEnrolled ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-50 text-slate-400'}`}>
                                     <Activity size={20}/>
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-black uppercase text-slate-900">{course}</h4>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Registry Code: {course.slice(0, 3).toUpperCase()}_01</p>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => toggleEnroll(course)}
                                 className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEnrolled ? 'bg-slate-900 text-white' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                               >
                                  {isEnrolled ? 'Release Node' : 'Enroll Node'}
                               </button>
                            </div>
                          );
                       })}
                    </div>
                 </div>

                 <button onClick={() => setIsEnrollmentOpen(false)} className="w-full bg-[var(--brand-color)] hover:brightness-110 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-[var(--brand-color)]/20 active:scale-95 transition-all">Finalize Sync Sequence</button>
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