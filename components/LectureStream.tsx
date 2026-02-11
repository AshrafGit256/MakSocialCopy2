
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { AudioLesson, College, User } from '../types';
import { 
  Mic, Play, Pause, Headphones, Search, Plus, 
  ChevronRight, ArrowRight, Activity, Clock, 
  User as UserIcon, Share2, Filter, X, 
  SkipForward, SkipBack, Volume2, Upload,
  Database, Info, AlertCircle, HeadphonesIcon
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<College | 'Global'>('Global');
  const [currentUser] = useState<User>(db.getUser());
  
  // Player state
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modal states
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [recordForm, setRecordForm] = useState({
    title: '',
    lecturer: '',
    courseCode: '',
    college: currentUser.college as College,
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
    if (!recordForm.title) return;
    
    const newLesson: AudioLesson = {
      id: `aud-${Date.now()}`,
      title: recordForm.title,
      lecturer: recordForm.lecturer || 'Unknown Lecturer',
      courseCode: recordForm.courseCode || 'GEN 1000',
      college: recordForm.college,
      duration: '40:00',
      date: 'Just now',
      audioUrl: '#',
      contributor: currentUser.name,
      contributorAvatar: currentUser.avatar,
      plays: 0,
      description: recordForm.description
    };

    db.addAudioLesson(newLesson);
    setLessons(db.getAudioLessons());
    setIsUploading(false);
    setIsRecording(false);
    alert("Protocol Synchronized: Lesson added to the registry.");
  };

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                          l.courseCode.toLowerCase().includes(search.toLowerCase());
    const matchesCollege = selectedCollege === 'Global' || l.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 pb-60 font-sans text-[var(--text-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-[3rem] overflow-hidden mb-16 shadow-2xl min-h-[400px] flex flex-col justify-center px-10 md:px-20 py-20">
         <img 
           src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600" 
           className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" 
           alt="Lecture Background" 
         />
         <div className="absolute inset-0 bg-[var(--brand-color)]/30 backdrop-blur-[2px]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

         <div className="relative z-10 space-y-6 max-w-2xl animate-in slide-in-from-left-8 duration-700">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]">
               <Activity size={14} className="text-emerald-400 animate-pulse" /> Audio Registry Online
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
               Lecture <br /><span className="text-[var(--brand-color)]">Stream.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed">
               Missed a class? Listen to high-fidelity lesson recordings from every college hub. Sync your learning anywhere.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <button 
                 onClick={() => setIsRecording(true)}
                 className="px-10 py-5 bg-[var(--brand-color)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
               >
                  <Mic size={20}/> Start Recording
               </button>
               <button 
                 onClick={() => setIsUploading(true)}
                 className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-3"
               >
                  <Upload size={20}/> Upload Audio
               </button>
            </div>
         </div>
      </section>

      {/* 2. DISCOVERY TOOLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b border-[var(--border-color)] pb-10">
         <div className="flex flex-col gap-2 w-full md:w-auto">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Class Registry</h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredLessons.length} Signals Captured</span>
            </div>
         </div>

         <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)]" size={18} />
               <input 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-[var(--brand-color)] transition-all"
                 placeholder="Search by course or code..."
               />
            </div>
            <div className="flex bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border-color)]">
               <button 
                 onClick={() => setSelectedCollege('Global')}
                 className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedCollege === 'Global' ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
               >
                  Universal
               </button>
               <select 
                 className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest px-4 text-slate-500 cursor-pointer"
                 value={selectedCollege}
                 onChange={e => setSelectedCollege(e.target.value as any)}
               >
                  <option value="Global">Choose Hub</option>
                  {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
         </div>
      </div>

      {/* 3. LESSON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {filteredLessons.map(lesson => (
           <div 
             key={lesson.id} 
             className="group relative bg-white border border-[var(--border-color)] rounded-[3rem] p-8 transition-all hover:shadow-2xl hover:border-[var(--brand-color)]/20 flex flex-col"
           >
              <div className="flex justify-between items-start mb-8">
                 <div className="relative">
                    <img 
                      src={lesson.contributorAvatar} 
                      className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt="Contributor" 
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[var(--brand-color)] text-white rounded-full border-2 border-white shadow-sm">
                       <Mic size={10} />
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-slate-500">{lesson.college}</span>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{lesson.date}</p>
                 </div>
              </div>

              <div className="space-y-4 flex-1">
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-[var(--brand-color)] transition-colors line-clamp-2">
                    {lesson.title}
                 </h3>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><UserIcon size={14}/> {lesson.lecturer}</span>
                    <span className="flex items-center gap-1.5"><Activity size={14}/> {lesson.courseCode}</span>
                 </div>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-3 italic">
                   "{lesson.description}"
                 </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Runtime</span>
                    <span className="text-sm font-black text-slate-800">{lesson.duration}</span>
                 </div>
                 <button 
                   onClick={() => handlePlay(lesson)}
                   className={`p-5 rounded-full transition-all active:scale-90 shadow-xl ${activeLesson?.id === lesson.id && isPlaying ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-[var(--brand-color)] text-white shadow-[var(--brand-color)]/20'}`}
                 >
                    {activeLesson?.id === lesson.id && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="translate-x-0.5" />}
                 </button>
              </div>
           </div>
         ))}

         {filteredLessons.length === 0 && (
            <div className="col-span-full py-40 text-center space-y-6 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
               <Database size={48} className="mx-auto text-slate-200" />
               <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Registry_Empty</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">No audio nodes synchronized for this query.</p>
               </div>
               <button onClick={() => {setSearch(''); setSelectedCollege('Global');}} className="px-10 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--brand-color)] transition-all">Clear Filters</button>
            </div>
         )}
      </div>

      {/* 4. TACTICAL AUDIO PLAYER (FLOATING) */}
      {activeLesson && (
        <div className="fixed bottom-24 lg:bottom-6 left-6 right-6 lg:left-80 lg:right-6 bg-slate-900 text-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 z-[100] animate-in slide-in-from-bottom-10 duration-500">
           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                 <div className="relative shrink-0">
                    <img src={activeLesson.contributorAvatar} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 bg-white object-cover" />
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--brand-color)] animate-ping opacity-20"></div>
                 </div>
                 <div className="min-w-0 flex-1">
                    <h4 className="text-sm md:text-xl font-black uppercase tracking-tight truncate">{activeLesson.title}</h4>
                    <p className="text-[8px] md:text-[10px] font-black text-[var(--brand-color)] uppercase tracking-widest flex items-center gap-2 mt-1 truncate">
                       {activeLesson.courseCode} Hub <span className="text-white/20">•</span> {activeLesson.lecturer}
                    </p>
                 </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                 <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase text-white/40 tracking-widest">
                    <span>Streaming Signal</span>
                    <span>{Math.floor(progress * 4)} / {activeLesson.duration}</span>
                 </div>
                 <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer group">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[var(--brand-color)] shadow-[0_0_10px_#10918a] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8 shrink-0">
                 <button className="text-white/40 hover:text-white transition-colors"><SkipBack size={20}/></button>
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)}
                   className="p-4 md:p-6 bg-white text-black rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                 >
                   {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="translate-x-0.5" />}
                 </button>
                 <button className="text-white/40 hover:text-white transition-colors"><SkipForward size={20}/></button>
                 <div className="hidden lg:flex items-center gap-4">
                    <div className="h-8 w-px bg-white/10"></div>
                    <Volume2 size={20} className="text-white/40" />
                    <button onClick={() => setActiveLesson(null)} className="p-2 text-white/40 hover:text-rose-500 transition-colors"><X size={20}/></button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 5. MODALS */}
      {(isRecording || isUploading) && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[var(--bg-primary)] w-full max-w-xl p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-10 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--brand-color)] rounded-xl text-white">
                       {isRecording ? <Mic size={24}/> : <Upload size={24}/>}
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                       {isRecording ? 'Record_Session' : 'Uplink_Audio'}
                    </h2>
                 </div>
                 <button onClick={() => {setIsRecording(false); setIsUploading(false);}} className="p-2 bg-[var(--bg-secondary)] rounded-full text-slate-500 hover:text-rose-500 transition-all">
                    <X size={28}/>
                 </button>
              </div>

              {isRecording ? (
                <div className="flex flex-col items-center py-10 space-y-10">
                   <div className="relative">
                      <div className="absolute inset-0 bg-rose-500/20 blur-[50px] rounded-full animate-pulse"></div>
                      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-rose-500/20 flex flex-col items-center justify-center space-y-4">
                         <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-500/50 animate-bounce">
                            <Mic size={32}/>
                         </div>
                         <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">00:00:00</p>
                      </div>
                   </div>
                   <div className="text-center space-y-2">
                      <h4 className="text-lg font-black uppercase tracking-tight">Signal Capture Initialized</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ensuring Registry Compliance...</p>
                   </div>
                   <div className="flex gap-4 w-full">
                      <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Discard</button>
                      <button onClick={() => {setIsRecording(false); setIsUploading(true);}} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/30 active:scale-95 transition-all">Complete Capture</button>
                   </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lecture_Manifest</label>
                      <input 
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold uppercase outline-none focus:border-[var(--brand-color)]" 
                        value={recordForm.title}
                        onChange={e => setRecordForm({...recordForm, title: e.target.value})}
                        placeholder="Session Name..." 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target_Lecturer</label>
                         <input 
                           className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold uppercase outline-none" 
                           value={recordForm.lecturer}
                           onChange={e => setRecordForm({...recordForm, lecturer: e.target.value})}
                           placeholder="Name..." 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logic_Sector</label>
                         <select 
                           className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none"
                           value={recordForm.college}
                           onChange={e => setRecordForm({...recordForm, college: e.target.value as College})}
                         >
                            {COLLEGES.map(c => <option key={c} value={c}>{c} HUB</option>)}
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload_Description</label>
                      <textarea 
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-bold outline-none h-24 resize-none" 
                        value={recordForm.description}
                        onChange={e => setRecordForm({...recordForm, description: e.target.value})}
                        placeholder="Define learning parameters..."
                      />
                   </div>
                   <div className="p-6 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center gap-4 text-center">
                      <AlertCircle size={24} className="text-slate-400" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                        Verify you have permission to broadcast this session. All signals are cryptographically logged to your node.
                      </p>
                   </div>
                   <button 
                     onClick={handleUpload}
                     className="w-full bg-[var(--brand-color)] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
                   >
                     Authorize_Commit
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LectureStream;
