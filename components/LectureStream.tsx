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
  Cpu
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const Waveform: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="flex items-end gap-[2px] h-6 px-2">
    {[...Array(14)].map((_, i) => (
      <div 
        key={i} 
        className={`w-[2px] bg-[var(--brand-color)] rounded-full transition-all duration-300 ${isPlaying ? 'animate-waveform' : 'h-1'}`}
        style={{ 
            animationDelay: `${i * 0.05}s`,
            height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : '4px'
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
    // Sort by most recent ID (mocking timestamp)
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

  // Organizing recordings into logical temporal clusters
  const groupedLessons = useMemo(() => {
    const groups: { [key: string]: AudioLesson[] } = {
        'Active Synchronizations (Today)': [],
        'Registry Logs (Yesterday)': [],
        'Legacy Archives': []
    };

    filteredLessons.forEach(l => {
        // Mock logic for "Today" and "Yesterday" based on hardcoded dates in db.ts
        if (l.date === 'Just now' || l.date.includes('12 Feb')) {
            groups['Active Synchronizations (Today)'].push(l);
        } else if (l.date.includes('10 Feb')) {
            groups['Registry Logs (Yesterday)'].push(l);
        } else {
            groups['Legacy Archives'].push(l);
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
      duration: 'Syncing',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-44 selection:bg-[var(--brand-color)] selection:text-white">
      
      {/* PROFESSIONAL NAV BAR */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-3xl border-b border-slate-200 px-6 lg:px-12 py-5 flex items-center justify-between gap-6 shadow-sm">
         <div className="flex items-center gap-4 shrink-0">
            <div className="p-3 bg-[var(--brand-color)] rounded-2xl shadow-xl shadow-[var(--brand-color)]/20 text-white">
               <Mic2 size={24} />
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Lecture<span className="text-[var(--brand-color)]">.Pulse</span></h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Academic Audio Strata</p>
            </div>
         </div>

         <div className="flex-1 max-w-2xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner"
              placeholder="Query logic nodes (Code, Title, Lecturer)..."
            />
         </div>

         <button 
           onClick={() => setIsUploading(true)}
           className="px-8 py-3.5 bg-[var(--brand-color)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 shadow-lg shadow-[var(--brand-color)]/20"
         >
            <Upload size={16}/> Direct Uplink
         </button>
      </nav>

      {/* SECTOR TABS */}
      <div className="px-6 lg:px-12 py-6 border-b border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-3 bg-white/50 sticky top-[81px] z-[90]">
         <button 
            onClick={() => setActiveCollege('Global')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCollege === 'Global' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
         >
           Universal Feed
         </button>
         {COLLEGES.map(c => (
           <button 
             key={c}
             onClick={() => setActiveCollege(c)}
             className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCollege === c ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
           >
             {c} Wing
           </button>
         ))}
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-12">
         
         {/* LATEST BROADCAST HERO */}
         {!search && filteredLessons.length > 0 && (
           <section className="mb-20 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--brand-color)] to-[#2dd4bf] rounded-[4rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
              <div className="bg-white rounded-[3.5rem] p-10 lg:p-20 border border-slate-100 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                 
                 <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-5 pointer-events-none">
                    <Waves size={350} className="text-[var(--brand-color)]" />
                 </div>

                 <div className="w-80 h-80 rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] relative shrink-0 ring-8 ring-slate-50">
                    <img src={filteredLessons[0].contributorAvatar} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Cover" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    {isPlaying && activeLesson?.id === filteredLessons[0].id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <Signal size={64} className="text-white animate-pulse" />
                        </div>
                    )}
                 </div>

                 <div className="flex-1 space-y-8 text-center lg:text-left z-10">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <span className="px-5 py-2 bg-rose-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-lg animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div> Primary Synchronization
                        </span>
                        <span className="px-5 py-2 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                            {filteredLessons[0].college} HUB
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-slate-900 drop-shadow-sm">
                           {filteredLessons[0].title}
                        </h1>
                        <p className="text-xl lg:text-3xl text-slate-500 font-medium italic mt-6 border-l-4 border-[var(--brand-color)]/30 pl-8">
                           Broadcast by {filteredLessons[0].lecturer} • {filteredLessons[0].courseCode}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-8">
                        <button 
                          onClick={() => setActiveLesson(filteredLessons[0])}
                          className="px-14 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[var(--brand-color)] hover:scale-105 active:scale-95 transition-all flex items-center gap-5"
                        >
                           <Play size={28} fill="currentColor" /> Initialize Link
                        </button>
                        <div className="flex items-center gap-12">
                           <div className="text-center lg:text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Density</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{(filteredLessons[0].plays + 1200).toLocaleString()} Nodes</p>
                           </div>
                           <div className="h-12 w-px bg-slate-200"></div>
                           <div className="text-center lg:text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Runtime</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{filteredLessons[0].duration}</p>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
           </section>
         )}

         {/* CLUSTERED REGISTRY LIST */}
         <div className="space-y-28">
            {(Object.entries(groupedLessons) as [string, AudioLesson[]][]).map(([dayLabel, dayLessons]) => dayLessons.length > 0 && (
                <section key={dayLabel} className="space-y-12">
                   <div className="flex items-center gap-8 border-b border-slate-200 pb-8 px-4">
                      <div className="p-4 bg-[var(--brand-color)]/10 rounded-[1.5rem] text-[var(--brand-color)] shadow-sm">
                         {dayLabel.includes('Active') ? <Zap size={24} /> : <History size={24} />}
                      </div>
                      <div>
                         <h3 className="text-lg font-black uppercase tracking-[0.4em] text-slate-900">{dayLabel}</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{dayLessons.length} Verified Segments</p>
                      </div>
                      <div className="flex-1 h-px bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v5.2.0</span>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      {dayLessons.map((lesson, idx) => (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLesson(lesson)}
                          className={`group flex items-center gap-10 px-10 py-8 rounded-[3rem] transition-all cursor-pointer border-2 ${activeLesson?.id === lesson.id ? 'bg-white border-[var(--brand-color)] shadow-2xl scale-[1.01] z-10' : 'bg-white border-transparent hover:bg-slate-50/80 hover:border-slate-200 shadow-sm'}`}
                        >
                           <div className="w-16 shrink-0 flex items-center justify-center">
                              {activeLesson?.id === lesson.id && isPlaying ? (
                                 <Waveform isPlaying={true} />
                              ) : (
                                 <div className="relative">
                                    <span className="text-base font-black text-slate-200 group-hover:opacity-0 transition-opacity">0{idx + 1}</span>
                                    <Play size={28} className="text-[var(--brand-color)] absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100" fill="currentColor" />
                                 </div>
                              )}
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className={`text-xl font-black uppercase tracking-tight truncate ${activeLesson?.id === lesson.id ? 'text-[var(--brand-color)]' : 'text-slate-800'}`}>
                                    {lesson.title}
                                 </h4>
                                 <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase text-slate-400 rounded-sm">SEG_{lesson.id.slice(-3)}</span>
                              </div>
                              <div className="flex items-center gap-6 mt-2">
                                 <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Database size={14} className="text-[var(--brand-color)]"/> {lesson.lecturer}
                                 </p>
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{lesson.course}</p>
                              </div>
                           </div>

                           <div className="hidden lg:flex items-center gap-20 shrink-0">
                              <div className="text-right space-y-1">
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol Code</p>
                                 <p className="text-sm font-black text-slate-600 tracking-tighter">{lesson.courseCode}</p>
                              </div>
                              <div className="w-32 text-right space-y-1">
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
                                 <div className="flex items-center justify-end gap-2 text-slate-900 font-black">
                                    <Clock size={16} className="text-[var(--brand-color)]"/> 
                                    <span className="text-sm tabular-nums">{lesson.duration}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2">
                                <button className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:text-[var(--brand-color)] hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90">
                                    <Share2 size={18}/>
                                </button>
                                <button className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90">
                                    <MoreVertical size={18}/>
                                </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
            ))}

            {filteredLessons.length === 0 && (
               <div className="py-48 text-center space-y-10">
                  <div className="relative inline-block">
                     <Headphones size={100} className="mx-auto text-slate-100" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <X size={40} className="text-rose-500 opacity-20" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-4xl font-black uppercase tracking-tighter text-slate-200">Registry Segment Null</p>
                     <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">No academic signals detected in this sector. Verify search parameters.</p>
                  </div>
                  <button onClick={() => { setSearch(''); setActiveCollege('Global'); }} className="px-14 py-4 bg-[var(--brand-color)] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 shadow-2xl transition-all active:scale-95">Reset Uplink</button>
               </div>
            )}
         </div>
      </div>

      {/* NEURAL AUDIO DECK: PERSISTENT PLAYER */}
      {activeLesson && (
        <div className={`fixed bottom-0 left-0 right-0 z-[500] transition-all duration-700 ease-out ${showBridge ? 'h-[720px]' : 'h-32 md:h-40'}`}>
           <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl border-t border-slate-200 shadow-[0_-30px_100px_rgba(0,0,0,0.12)]"></div>
           
           <div className="max-w-[1700px] mx-auto h-full flex flex-col relative z-10 px-8 md:px-12 pt-8 md:pt-10">
              
              <audio 
                ref={audioRef} 
                src={activeLesson.audioUrl} 
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNext}
                className="hidden"
              />

              <div className="flex items-center justify-between gap-12 h-24">
                
                {/* LOGIC NODE METADATA */}
                <div className="flex items-center gap-8 w-1/4 min-w-0">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-4 bg-[var(--brand-color)]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img src={activeLesson.contributorAvatar} className="w-20 h-20 md:w-24 md:h-24 rounded-[2.2rem] object-cover shadow-2xl border-4 border-white relative z-10" alt="Node" />
                        {activeLesson.audioUrl.includes('drive.google.com') && (
                            <button 
                                onClick={() => setShowBridge(!showBridge)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-[2.2rem] transition-all z-20"
                            >
                                <Maximize2 size={24}/>
                            </button>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-xl font-black uppercase tracking-tight truncate leading-none text-slate-800">{activeLesson.title}</h5>
                            <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[7px] font-black uppercase tracking-widest rounded-sm shrink-0">Node OK</div>
                        </div>
                        <p className="text-[11px] font-black text-[var(--brand-color)] uppercase tracking-[0.2em] truncate">{activeLesson.lecturer} • {activeLesson.courseCode}</p>
                    </div>
                </div>

                {/* TACTICAL TRANSPORT COMMANDS */}
                <div className="flex-1 flex flex-col items-center gap-6 max-w-3xl">
                    <div className="flex items-center gap-16">
                        <button onClick={handlePrev} className="text-slate-300 hover:text-[var(--brand-color)] transition-all hover:scale-110 active:scale-90"><SkipBack size={36} fill="currentColor" /></button>
                        <button 
                            onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                            className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-[var(--brand-color)] hover:scale-110 active:scale-95 transition-all"
                        >
                           {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="translate-x-1" />}
                        </button>
                        <button onClick={handleNext} className="text-slate-300 hover:text-[var(--brand-color)] transition-all hover:scale-110 active:scale-90"><SkipForward size={36} fill="currentColor" /></button>
                    </div>
                    
                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden cursor-pointer relative group">
                            <div 
                                className="h-full bg-[var(--brand-color)] transition-all relative"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-[var(--brand-color)] rounded-full shadow-xl scale-0 group-hover:scale-100 transition-transform"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                            <span>{formatTime(currentTime)}</span>
                            <div className="flex items-center gap-6">
                                <Waveform isPlaying={isPlaying} />
                                <span className="opacity-50">Frequency: Balanced</span>
                            </div>
                            <span>{activeLesson.duration}</span>
                        </div>
                    </div>
                </div>

                {/* UPLINK TOOLS */}
                <div className="hidden md:flex items-center justify-end gap-12 w-1/4">
                    {activeLesson.audioUrl.includes('drive.google.com') && (
                         <button 
                            onClick={() => setShowBridge(!showBridge)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${showBridge ? 'bg-[var(--brand-color)] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                         >
                            <TrendingUp size={18} className={isPlaying ? 'animate-bounce' : ''} /> Neural Link
                         </button>
                    )}
                    <div className="flex items-center gap-5 text-slate-300 group/vol">
                        <Volume2 size={24} className="group-hover/vol:text-[var(--brand-color)] transition-colors" />
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-slate-400 w-2/3 group-hover/vol:bg-[var(--brand-color)]"></div>
                        </div>
                    </div>
                    <button onClick={() => { setActiveLesson(null); setShowBridge(false); }} className="p-4 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90">
                        <X size={20}/>
                    </button>
                </div>
              </div>

              {/* NEURAL BRIDGE VIEWPORT: High-Fidelity Embedding */}
              {showBridge && activeLesson.audioUrl.includes('drive.google.com') && (
                <div className="flex-1 mt-12 border-t border-slate-100 pt-12 animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="w-full h-full bg-black rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(16,145,138,0.25)] relative border-[16px] border-white">
                        <div className="absolute top-10 left-10 z-20">
                             <div className="px-8 py-4 bg-black/40 backdrop-blur-2xl rounded-full flex items-center gap-5 border border-white/10 shadow-2xl">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Identity Handshake: Valid</span>
                             </div>
                        </div>
                        <div className="absolute top-10 right-10 z-20 flex gap-6">
                             <button onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')} className="p-6 bg-white text-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 font-black text-[11px] uppercase tracking-widest">
                                <ExternalLink size={20}/> External Registry
                             </button>
                             <button onClick={() => setShowBridge(false)} className="p-6 bg-rose-600 text-white rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                <X size={28}/>
                             </button>
                        </div>
                        <iframe 
                            src={activeLesson.audioUrl} 
                            className="w-full h-full border-none opacity-90 group-hover:opacity-100 transition-opacity"
                            allow="autoplay"
                        ></iframe>
                    </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* DIRECT UPLINK WORKSPACE: REDESIGNED FOR PROFESSIONAL USE */}
      {isUploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-3xl p-16 rounded-[4.5rem] shadow-[0_120px_200px_-50px_rgba(0,0,0,0.5)] space-y-16 border border-slate-50 relative max-h-[95vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-100 pb-12">
                 <div className="flex items-center gap-8">
                    <div className="p-6 bg-[var(--brand-color)] rounded-[2.5rem] shadow-2xl shadow-[var(--brand-color)]/30 text-white">
                        <FileAudio size={48} />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Sync_Protocol</h2>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.6em] mt-4">Commit academic audio node</p>
                    </div>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-5 text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-full"><X size={40}/></button>
              </div>

              <div className="space-y-16">
                 <div className="space-y-6">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">1. Logical Node Payload (Audio)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-4 border-dashed rounded-[4rem] p-24 transition-all flex flex-col items-center justify-center gap-10 cursor-pointer hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 ${uploadForm.file ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5 shadow-inner' : 'border-slate-100 bg-slate-50/50'}`}
                    >
                       {uploadForm.file ? (
                          <div className="flex flex-col items-center gap-8 animate-in zoom-in-95">
                             <div className="p-12 bg-white rounded-[4rem] shadow-2xl border border-slate-50 text-[var(--brand-color)]"><FileAudio size={80} /></div>
                             <div className="text-center">
                                <span className="text-xl font-black uppercase text-slate-900 block truncate max-w-[400px] tracking-tight">{uploadForm.file.name}</span>
                                <div className="flex items-center justify-center gap-6 mt-6">
                                    <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg">{(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Signal Integrity: High</span>
                                    </div>
                                </div>
                             </div>
                          </div>
                       ) : (
                          <>
                             <div className="p-10 bg-white rounded-[3rem] text-slate-200 shadow-sm"><Plus size={60} /></div>
                             <span className="text-sm font-black uppercase text-slate-400 tracking-[0.4em]">Authorize Data Source</span>
                          </>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setUploadForm({...uploadForm, file});
                    }} />
                 </div>

                 <div className="space-y-12">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Signal Identifier</label>
                       <input 
                         className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-7 text-lg font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] transition-all shadow-inner text-slate-900 placeholder:text-slate-300" 
                         value={uploadForm.title}
                         onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                         placeholder="COMMIT_IDENTIFIER (e.g. Lec 12: Distributed Strata)" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Protocol Code</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-7 text-base font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900 placeholder:text-slate-300" 
                            value={uploadForm.courseCode}
                            onChange={e => setUploadForm({...uploadForm, courseCode: e.target.value})}
                            placeholder="PHY 2101" 
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Origin Node (Lecturer)</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-7 text-base font-bold outline-none focus:bg-white focus:border-[var(--brand-color)] text-slate-900 placeholder:text-slate-300" 
                            value={uploadForm.lecturer}
                            onChange={e => setUploadForm({...uploadForm, lecturer: e.target.value})}
                            placeholder="Full Academic Name..." 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={handleUpload}
                   disabled={!uploadForm.file || !uploadForm.title}
                   className="w-full bg-slate-900 hover:bg-black disabled:opacity-20 text-white py-8 rounded-[3.5rem] font-black text-sm uppercase tracking-[0.6em] shadow-[0_30px_80px_rgba(0,0,0,0.4)] active:scale-95 transition-all"
                 >
                   Authorize Protocol Commit
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes waveform {
          0%, 100% { height: 4px; }
          50% { height: 28px; }
        }
        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LectureStream;