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
  Link,
  History,
  TrendingUp,
  Radio,
  Share2,
  Calendar
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const YEARS: UserStatus[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const Waveform: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="flex items-center gap-[2px] h-6">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className={`w-[3px] bg-[var(--brand-color)] rounded-full transition-all duration-300 ${isPlaying ? 'animate-waveform' : 'h-1'}`}
        style={{ 
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? `${Math.random() * 100}%` : '4px'
        }}
      />
    ))}
  </div>
);

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [activeCollege, setActiveCollege] = useState<College | 'Global'>('Global');
  
  // Playback State
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    setLessons(db.getAudioLessons().sort((a, b) => b.id.localeCompare(a.id)));
  }, []);

  useEffect(() => {
    if (activeLesson) {
      const isRemote = activeLesson.audioUrl.includes('drive.google.com');
      if (!isRemote && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        setIsPlaying(true);
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

  // Grouping logic for "Realistic" day view
  const groupedLessons = useMemo(() => {
    const groups: { [key: string]: AudioLesson[] } = {
        'Live Synchronizations': [],
        'Historical Logs': [],
        'Deep Archives': []
    };

    filteredLessons.forEach(l => {
        if (l.date === 'Just now' || l.date.includes('2026')) {
            groups['Live Synchronizations'].push(l);
        } else if (l.date.includes('Feb')) {
            groups['Historical Logs'].push(l);
        } else {
            groups['Deep Archives'].push(l);
        }
    });

    return groups;
  }, [filteredLessons]);

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
      duration: 'Live Sync',
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-44 selection:bg-[var(--brand-color)] selection:text-white">
      
      {/* 1. BROADCAST TOP BAR */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between gap-6 shadow-sm">
         <div className="flex items-center gap-4 shrink-0">
            <div className="p-2.5 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20">
               <Radio size={22} className="text-white animate-pulse" />
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Registry<span className="text-[var(--brand-color)]">.Pulse</span></h2>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Institutional Broadcast Strata</p>
            </div>
         </div>

         <div className="flex-1 max-w-xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-100 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner"
              placeholder="Query logic nodes (Title, Course, Lecturer)..."
            />
         </div>

         <button 
           onClick={() => setIsUploading(true)}
           className="px-6 py-3 bg-[var(--brand-color)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-[var(--brand-color)]/20"
         >
            <Upload size={16}/> Direct Uplink
         </button>
      </nav>

      {/* 2. SECTOR NAVIGATION */}
      <div className="px-6 lg:px-12 py-6 border-b border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-3 bg-white/50">
         <button 
            onClick={() => setActiveCollege('Global')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCollege === 'Global' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
         >
           Universal Feed
         </button>
         {COLLEGES.map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c)}
             className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCollege === c ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
           >
             {c} Sector
           </button>
         ))}
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-10">
         
         {/* 3. DYNAMIC HERO (Primary Uplink) */}
         {!search && filteredLessons.length > 0 && (
           <section className="mb-16 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--brand-color)]/20 to-transparent blur-3xl opacity-30 pointer-events-none"></div>
              <div className="bg-white rounded-[3rem] p-10 lg:p-16 border border-slate-200 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                 
                 <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-20">
                    <Headphones size={200} className="text-slate-200" />
                 </div>

                 <div className="w-64 h-64 rounded-[3.5rem] overflow-hidden shadow-2xl relative shrink-0 ring-8 ring-slate-50">
                    <img src={filteredLessons[0].contributorAvatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    {isPlaying && activeLesson?.id === filteredLessons[0].id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <Signal size={48} className="text-white animate-pulse" />
                        </div>
                    )}
                 </div>

                 <div className="flex-1 space-y-6 text-center lg:text-left z-10">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <span className="px-4 py-1.5 bg-rose-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-lg animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div> Latest Synchronization
                        </span>
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                            {filteredLessons[0].college} HUB
                        </span>
                    </div>

                    <div>
                        <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-slate-900 drop-shadow-sm">
                           {filteredLessons[0].title}
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-500 font-medium italic mt-3">
                           Broadcast by {filteredLessons[0].lecturer} • {filteredLessons[0].courseCode}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6">
                        <button 
                          onClick={() => setActiveLesson(filteredLessons[0])}
                          className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                        >
                           <Play size={24} fill="currentColor" /> Initialize Audio Link
                        </button>
                        <div className="flex items-center gap-8">
                           <div className="flex flex-col items-center lg:items-start">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Intensity</span>
                              <span className="text-lg font-black text-slate-900">4.8k SYNCED</span>
                           </div>
                           <div className="h-10 w-px bg-slate-200"></div>
                           <div className="flex flex-col items-center lg:items-start">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                              <span className="text-lg font-black text-slate-900">{filteredLessons[0].duration}</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
           </section>
         )}

         {/* 4. TEMPORAL STRATA LIST */}
         <div className="space-y-16">
            {/* Added type cast to Object.entries to fix 'unknown' type inference on dayLessons */}
            {(Object.entries(groupedLessons) as [string, AudioLesson[]][]).map(([dayLabel, dayLessons]) => dayLessons.length > 0 && (
                <section key={dayLabel} className="space-y-6">
                   <div className="flex items-center gap-6 border-b border-slate-200 pb-4 px-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                         {dayLabel === 'Live Synchronizations' ? <Zap size={18} className="text-amber-500" /> : <History size={18} />}
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">{dayLabel}</h3>
                      <div className="flex-1 h-px bg-slate-100"></div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">{dayLessons.length} NODES</span>
                   </div>

                   <div className="grid grid-cols-1 gap-2">
                      {dayLessons.map((lesson, idx) => (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLesson(lesson)}
                          className={`group flex items-center gap-6 px-8 py-5 rounded-[2rem] transition-all cursor-pointer border ${activeLesson?.id === lesson.id ? 'bg-white border-[var(--brand-color)] shadow-2xl scale-[1.01] z-10' : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200'}`}
                        >
                           <div className="w-12 shrink-0 flex items-center justify-center">
                              {activeLesson?.id === lesson.id && isPlaying ? (
                                 <Waveform isPlaying={true} />
                              ) : (
                                 <>
                                    <span className="text-xs font-black text-slate-300 group-hover:hidden">{idx + 1}</span>
                                    <Play size={20} className="text-slate-900 hidden group-hover:block" fill="currentColor" />
                                 </>
                              )}
                           </div>

                           <div className="flex-1 min-w-0">
                              <h4 className={`text-base md:text-lg font-black uppercase tracking-tight truncate ${activeLesson?.id === lesson.id ? 'text-[var(--brand-color)]' : 'text-slate-800'}`}>
                                 {lesson.title}
                              </h4>
                              <div className="flex items-center gap-4 mt-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database size={12}/> {lesson.lecturer}
                                 </p>
                                 <span className="text-slate-200">•</span>
                                 <span className="text-[9px] font-black text-slate-400 uppercase">{lesson.course}</span>
                              </div>
                           </div>

                           <div className="hidden lg:flex items-center gap-12 shrink-0">
                              <div className="text-right">
                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocol Code</p>
                                 <p className="text-xs font-black text-slate-500">{lesson.courseCode}</p>
                              </div>
                              <div className="w-24 text-right">
                                 <div className="flex items-center justify-end gap-2 text-slate-400 font-bold">
                                    <Clock size={14} className="opacity-50"/> 
                                    <span className="text-[11px] tabular-nums">{lesson.duration}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                                <button className="p-3 bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                                    <Share2 size={16}/>
                                </button>
                                <button className="p-3 bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16}/>
                                </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
            ))}

            {filteredLessons.length === 0 && (
               <div className="py-40 text-center space-y-8">
                  <div className="relative inline-block">
                     <div className="absolute inset-0 bg-slate-200 blur-3xl opacity-20 rounded-full scale-150"></div>
                     <Headphones size={80} className="mx-auto text-slate-200 relative z-10" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-2xl font-black uppercase tracking-tighter text-slate-300">Registry Sequence Nullified</p>
                     <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">No telemetry or academic signals detected in this sector. Try clearing your queries.</p>
                  </div>
                  <button onClick={() => setSearch('')} className="px-10 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all">Reset Sync</button>
               </div>
            )}
         </div>
      </div>

      {/* 5. MASTER CONTROL DECK (Hyper-Realistic Player) */}
      {activeLesson && (
        <div className={`fixed bottom-0 left-0 right-0 z-[500] transition-all duration-700 ease-out ${showBridge ? 'h-[650px]' : 'h-28 md:h-32'}`}>
           <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-3xl border-t border-slate-200 shadow-[0_-20px_80px_rgba(0,0,0,0.1)]"></div>
           
           <div className="max-w-[1600px] mx-auto h-full flex flex-col relative z-10 px-6 md:px-12 pt-6">
              
              {/* Actual Audio Component */}
              <audio 
                ref={audioRef} 
                src={activeLesson.audioUrl} 
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNext}
                className="hidden"
              />

              {/* Main Player UI */}
              <div className="flex items-center justify-between gap-10 h-16">
                
                {/* TRACK METADATA */}
                <div className="flex items-center gap-6 w-1/4 min-w-0">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-2 bg-[var(--brand-color)]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img src={activeLesson.contributorAvatar} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-2xl border border-white/10 relative z-10" alt="Artwork" />
                        {activeLesson.audioUrl.includes('drive.google.com') && (
                            <button 
                                onClick={() => setShowBridge(!showBridge)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-[1.5rem] transition-all z-20"
                            >
                                <Maximize2 size={20}/>
                            </button>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-base font-black uppercase tracking-tight truncate leading-none">{activeLesson.title}</h5>
                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[7px] font-black uppercase tracking-widest rounded-sm">Verified</div>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-widest truncate">{activeLesson.lecturer}</p>
                    </div>
                </div>

                {/* CENTER TRANSPORT CONTROLS */}
                <div className="flex-1 flex flex-col items-center gap-4 max-w-2xl">
                    <div className="flex items-center gap-12">
                        <button onClick={handlePrev} className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110 active:scale-95"><SkipBack size={28} fill="currentColor" /></button>
                        <button 
                            onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                            className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-900/40 hover:scale-110 active:scale-95 transition-all"
                        >
                           {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="translate-x-0.5" />}
                        </button>
                        <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110 active:scale-95"><SkipForward size={28} fill="currentColor" /></button>
                    </div>
                    
                    <div className="w-full flex flex-col gap-1.5">
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer relative group">
                            <div 
                                className="h-full bg-[var(--brand-color)] transition-all relative"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[var(--brand-color)] rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                            <span>{formatTime(currentTime)}</span>
                            <div className="flex items-center gap-3">
                                <Waveform isPlaying={isPlaying} />
                                <span className="opacity-40">SIGNAL STABLE</span>
                            </div>
                            <span>{activeLesson.duration}</span>
                        </div>
                    </div>
                </div>

                {/* TOOLS & DIAGNOSTICS */}
                <div className="hidden md:flex items-center justify-end gap-8 w-1/4">
                    {activeLesson.audioUrl.includes('drive.google.com') && (
                         <button 
                            onClick={() => setShowBridge(!showBridge)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${showBridge ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                         >
                            <Activity size={16} className={isPlaying ? 'animate-pulse' : ''} /> Neural Bridge
                         </button>
                    )}
                    <div className="flex items-center gap-4 text-slate-400 group/vol">
                        <Volume2 size={22} className="group-hover/vol:text-slate-900 transition-colors" />
                        <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 w-2/3 group-hover/vol:bg-[var(--brand-color)]"></div>
                        </div>
                    </div>
                    <button onClick={() => { setActiveLesson(null); setShowBridge(false); }} className="p-3 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <X size={20}/>
                    </button>
                </div>
              </div>

              {/* NEURAL BRIDGE VIEWPORT */}
              {showBridge && activeLesson.audioUrl.includes('drive.google.com') && (
                <div className="flex-1 mt-10 border-t border-slate-200 pt-10 animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative border-8 border-white">
                        <div className="absolute top-8 left-8 z-20">
                             <div className="px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full flex items-center gap-3 border border-white/10 shadow-2xl">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Stream Integrity Validated</span>
                             </div>
                        </div>
                        <div className="absolute top-8 right-8 z-20 flex gap-4">
                             <button onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')} className="p-4 bg-white text-black rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                                <ExternalLink size={18}/> Open External Node
                             </button>
                             <button onClick={() => setShowBridge(false)} className="p-4 bg-rose-600 text-white rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                <X size={20}/>
                             </button>
                        </div>
                        <iframe 
                            src={activeLesson.audioUrl} 
                            className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                            allow="autoplay"
                        ></iframe>
                    </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* 6. UPLOAD COMMIT MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-xl p-12 rounded-[4rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.3)] space-y-10 border border-slate-100 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-100 pb-10">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-[var(--brand-color)] rounded-[2rem] shadow-2xl shadow-[var(--brand-color)]/30">
                        <FileAudio size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Sync_Protocol</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Commit academic audio node</p>
                    </div>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-3 text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-full"><X size={32}/></button>
              </div>

              <div className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">1. Audio Payload (Logic Node)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-4 border-dashed rounded-[3rem] p-16 transition-all flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 ${uploadForm.file ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5 shadow-inner' : 'border-slate-100 bg-slate-50'}`}
                    >
                       {uploadForm.file ? (
                          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                             <div className="p-8 bg-white rounded-[3rem] shadow-2xl border border-slate-50 text-[var(--brand-color)]"><FileAudio size={48} /></div>
                             <div className="text-center">
                                <span className="text-sm font-black uppercase text-slate-900 block truncate max-w-[280px]">{uploadForm.file.name}</span>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase rounded">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Signal_Valid</span>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <>
                             <div className="p-6 bg-white rounded-[2rem] text-slate-300 shadow-sm"><Plus size={32} /></div>
                             <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Select Local Data Asset</span>
                          </>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setUploadForm({...uploadForm, file});
                    }} />
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Signal Identity</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner text-slate-900" 
                         value={uploadForm.title}
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                         placeholder="IDENTIFY_SYNC (e.g. Lec 12: Applied Physics)" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Sector Code</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900" 
                            value={uploadForm.courseCode}
                            onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})}
                            placeholder="PHY 2101" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Origin Node (Lecturer)</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900" 
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
                   className="w-full bg-slate-900 hover:bg-black disabled:opacity-20 text-white py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
                 >
                   Authorize Commit to Registry
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes waveform {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .animate-waveform {
          animation: waveform 0.8s ease-in-out infinite;
        }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LectureStream;