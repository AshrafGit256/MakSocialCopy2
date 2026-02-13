import React, { useState, useEffect, useMemo } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
import { 
  Play, Search, Plus, 
  User as UserIcon, Link as LinkIcon,
  X, Database, Globe, Filter,
  ExternalLink, ShieldCheck,
  Cpu, Zap, Signal, Info,
  ChevronLeft, ChevronRight,
  SkipBack, SkipForward, Maximize2,
  ListMusic, Clock, LayoutGrid,
  Radio, PlayCircle, Pause,
  Volume2, MoreHorizontal, List,
  Monitor, Headphones
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
  const [showBridge, setShowBridge] = useState(false);
  
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
                            l.courseCode.toLowerCase().includes(search.toLowerCase()) ||
                            l.lecturer.toLowerCase().includes(search.toLowerCase());
      
      if (!showGlobal) {
        const isMyCollege = l.college === currentUser.college;
        return matchesSearch && isMyCollege;
      }
      return matchesSearch;
    });
  }, [lessons, search, showGlobal, currentUser]);

  const latestLesson = filteredLessons[0];

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
      alert("System: All primary data nodes required.");
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
    alert("Registry: Audio node synchronized.");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-[var(--brand-color)] selection:text-white pb-32">
      
      {/* 1. TOP NAVIGATION / SEARCH BAR */}
      <nav className="sticky top-0 z-[100] bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-[var(--brand-color)] rounded-lg shadow-lg">
               <Headphones size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter hidden sm:block">Audio <span className="text-[var(--brand-color)]">Registry</span></h2>
         </div>

         <div className="flex-1 max-w-2xl mx-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm font-medium outline-none focus:bg-white/10 focus:border-[var(--brand-color)] transition-all"
              placeholder="Search lectures, lecturers, or codes..."
            />
         </div>

         <button 
           onClick={() => setIsUploading(true)}
           className="px-6 py-2.5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
         >
            <Plus size={14}/> Uplink
         </button>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 space-y-12">
         
         {/* 2. FEATURED HERO (SPOTIFY STYLE) */}
         {!search && latestLesson && (
            <section className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent z-10"></div>
               <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-[3s]" 
                  alt="Featured" 
               />
               
               <div className="relative z-20 p-8 md:p-16 flex flex-col items-start gap-6 max-w-2xl">
                  <span className="px-4 py-1.5 bg-[var(--brand-color)] text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">Newest Synchronized Node</span>
                  <div className="space-y-2">
                     <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{latestLesson.title}</h1>
                     <p className="text-lg md:text-xl text-slate-400 font-medium italic opacity-80">{latestLesson.lecturer} • {latestLesson.courseCode}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                     <button 
                       onClick={() => setActiveLesson(latestLesson)}
                       className="px-10 py-5 bg-[var(--brand-color)] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-[var(--brand-color)]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                     >
                        <Play size={20} fill="currentColor" /> Play Now
                     </button>
                     <button 
                       onClick={() => setShowGlobal(!showGlobal)}
                       className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                     >
                        {showGlobal ? <Radio size={20}/> : <Globe size={20}/>} {showGlobal ? 'Local Hub' : 'Browse Global'}
                     </button>
                  </div>
               </div>
            </section>
         )}

         {/* 3. TRACKLIST SECTION */}
         <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="text-lg font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                  <List size={20}/> Recording Manifest
               </h3>
               <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase">
                  <span className="hidden md:block">Title</span>
                  <span className="hidden md:block">Course</span>
                  <span className="hidden md:block">Time</span>
               </div>
            </div>

            <div className="space-y-1">
               {filteredLessons.map((lesson, idx) => (
                 <div 
                   key={lesson.id} 
                   onClick={() => setActiveLesson(lesson)}
                   className={`group flex items-center gap-6 px-6 py-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 border border-transparent ${activeLesson?.id === lesson.id ? 'bg-white/10 border-white/10' : ''}`}
                 >
                    <div className="w-8 shrink-0 flex items-center justify-center">
                       {activeLesson?.id === lesson.id ? (
                          <Signal size={16} className="text-[var(--brand-color)] animate-pulse" />
                       ) : (
                          <span className="text-xs font-black text-slate-600 group-hover:hidden">{idx + 1}</span>
                       )}
                       <Play size={16} className={`text-white hidden ${activeLesson?.id === lesson.id ? 'hidden' : 'group-hover:block'}`} fill="currentColor" />
                    </div>

                    <div className="flex-1 min-w-0">
                       <h4 className={`text-sm md:text-base font-black uppercase tracking-tight truncate ${activeLesson?.id === lesson.id ? 'text-[var(--brand-color)]' : 'text-slate-100'}`}>
                          {lesson.title}
                       </h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{lesson.lecturer}</p>
                    </div>

                    <div className="hidden md:flex flex-1 items-center gap-3">
                       <span className="text-[10px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-slate-400">{lesson.courseCode}</span>
                       <span className="text-[10px] font-bold text-slate-500 uppercase truncate">{lesson.course}</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 shrink-0">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Clock size={12}/> {lesson.duration}
                       </div>
                       <button className="p-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={18}/>
                       </button>
                    </div>
                 </div>
               ))}

               {filteredLessons.length === 0 && (
                  <div className="py-32 text-center space-y-4">
                     <Database size={48} className="mx-auto text-slate-700" />
                     <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">No signals detected in this sector</p>
                  </div>
               )}
            </div>
         </section>
      </div>

      {/* 4. MASTER CONTROL DECK (BOTTOM) */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] bg-[#0f172a]/95 backdrop-blur-2xl border-t border-white/5 px-6 md:px-12 py-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
           <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
              
              {/* NOW PLAYING METADATA */}
              <div className="flex items-center gap-4 w-1/4 min-w-0">
                 <div className="relative group shrink-0">
                    <img src={activeLesson.contributorAvatar} className="w-14 h-14 rounded-xl object-cover shadow-2xl border border-white/5" alt="Node" />
                    <button 
                      onClick={() => setShowBridge(!showBridge)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all rounded-xl"
                    >
                       {showBridge ? <X size={18}/> : <Maximize2 size={18} />}
                    </button>
                 </div>
                 <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-black uppercase tracking-tight truncate leading-none mb-1.5">{activeLesson.title}</h5>
                    <p className="text-[10px] font-bold text-[var(--brand-color)] uppercase tracking-widest truncate">{activeLesson.lecturer}</p>
                 </div>
              </div>

              {/* CENTER CONTROLS */}
              <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl">
                 <div className="flex items-center gap-8">
                    <button onClick={handlePrev} className="text-slate-500 hover:text-white transition-colors"><SkipBack size={24}/></button>
                    <button 
                      onClick={() => setShowBridge(!showBridge)}
                      className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                       <Play size={24} fill="currentColor" className="translate-x-0.5" />
                    </button>
                    <button onClick={handleNext} className="text-slate-500 hover:text-white transition-colors"><SkipForward size={24}/></button>
                 </div>
                 <div className="w-full flex items-center gap-4">
                    <span className="text-[9px] font-mono text-slate-500">00:00</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
                       <div className="h-full bg-[var(--brand-color)] w-1/3 group-hover:bg-white transition-all"></div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{activeLesson.duration}</span>
                 </div>
              </div>

              {/* ACTION BAR */}
              <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                 <button 
                   onClick={() => setShowBridge(!showBridge)}
                   className={`p-2 rounded-lg transition-all ${showBridge ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                 >
                    <Monitor size={20} />
                 </button>
                 <div className="flex items-center gap-3 text-slate-500">
                    <Volume2 size={20} />
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-2/3"></div>
                    </div>
                 </div>
                 <button onClick={() => setActiveLesson(null)} className="p-2 text-slate-500 hover:text-rose-500 transition-all">
                    <X size={20}/>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 5. FLOATING BRIDGE VIEWPORT (THE PLAYER) */}
      {activeLesson && showBridge && (
        <div className="fixed bottom-28 right-6 z-[600] w-full max-w-[450px] aspect-video bg-black rounded-3xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
           <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button 
                onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all border border-white/5"
              >
                <ExternalLink size={14}/>
              </button>
              <button 
                onClick={() => setShowBridge(false)}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-all border border-white/5"
              >
                <X size={14}/>
              </button>
           </div>
           <iframe 
             src={activeLesson.audioUrl} 
             className="w-full h-full" 
             allow="autoplay"
           ></iframe>
        </div>
      )}

      {/* 6. UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0f172a] w-full max-w-lg p-10 rounded-[3rem] shadow-2xl space-y-8 border border-white/10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                 <div className="flex items-center gap-3">
                    <Headphones size={24} className="text-[var(--brand-color)]" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Commit_Audio</h2>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-500 hover:text-rose-500 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Signal_Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-inner text-white" 
                      value={recordForm.title}
                      onChange={e => setRecordForm({...recordForm, title: e.target.value})}
                      placeholder="e.g. Lec 05: Data Structures" 
                    />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Google_Drive_Source</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                       <input 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-bold outline-none focus:border-[var(--brand-color)] shadow-inner text-white" 
                         value={recordForm.audioUrl}
                         onChange={e => setRecordForm({...recordForm, audioUrl: e.target.value})}
                         placeholder="Paste Drive link protocol..." 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target_Course</label>
                       <select 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] font-bold outline-none text-white appearance-none"
                         value={recordForm.course}
                         onChange={e => setRecordForm({...recordForm, course: e.target.value})}
                       >
                          {(COURSES_BY_COLLEGE[recordForm.college] || []).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sync_Year</label>
                       <select 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] font-bold outline-none text-white appearance-none"
                         value={recordForm.year}
                         onChange={e => setRecordForm({...recordForm, year: e.target.value as UserStatus})}
                       >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lecturer_Node</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all shadow-inner text-white" 
                      value={recordForm.lecturer}
                      onChange={e => setRecordForm({...recordForm, lecturer: e.target.value})}
                      placeholder="Node Identifier (Name)..." 
                    />
                 </div>

                 <div className="p-5 bg-indigo-500/5 border border-dashed border-indigo-500/20 rounded-2xl flex items-center gap-4">
                    <Info size={24} className="text-indigo-400 shrink-0" />
                    <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest leading-relaxed">
                      Files will be routed via the Secure Bridge to ensure 100% playback availability across the student strata.
                    </p>
                 </div>

                 <button 
                   onClick={handleUpload}
                   className="w-full bg-[var(--brand-color)] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Commit to Registry
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
