import React, { useState, useEffect } from 'react';
import { db, COURSES_BY_COLLEGE } from '../db';
import { AudioLesson, College, User, UserStatus } from '../types';
// Added missing Info icon to imports
import { 
  Mic, Play, Search, Plus, 
  Activity, User as UserIcon, Link as LinkIcon,
  X, Database, Globe, Filter,
  ArrowRight, ExternalLink, ShieldCheck,
  Cpu, Zap, Loader2, Signal, Info
} from 'lucide-react';

const COLLEGES: College[] = ['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'];
const YEARS: UserStatus[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Finalist', 'Masters', 'Graduate'];

const LectureStream: React.FC = () => {
  const [lessons, setLessons] = useState<AudioLesson[]>([]);
  const [search, setSearch] = useState('');
  const [currentUser] = useState<User>(db.getUser());
  const [showGlobal, setShowGlobal] = useState(false);
  
  // New "Bridge" state
  const [activeLesson, setActiveLesson] = useState<AudioLesson | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const handlePlay = (lesson: AudioLesson) => {
    setActiveLesson(lesson);
  };

  const handleUpload = () => {
    if (!recordForm.title || !recordForm.audioUrl) {
      alert("Diagnostic: Title and Source Link are required for registration.");
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
       if (id) {
          sanitizedUrl = `https://drive.google.com/file/d/${id}/preview`;
       }
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
    alert("Protocol Synchronized: Audio node registered.");
  };

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                          l.courseCode.toLowerCase().includes(search.toLowerCase());
    
    if (!showGlobal) {
      const isMyCollege = l.college === currentUser.college;
      const isMyYear = l.year === currentUser.status;
      return matchesSearch && isMyCollege && isMyYear;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 pb-60 font-sans text-[var(--text-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-[2rem] overflow-hidden mb-12 shadow-2xl min-h-[300px] flex flex-col justify-center px-8 md:px-16 py-12">
         <img 
           src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600" 
           className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4]" 
           alt="Lecture Background" 
         />
         <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

         <div className="relative z-10 space-y-4 max-w-xl animate-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-[var(--brand-color)] rounded-2xl text-white shadow-xl">
                  <Signal size={32} className="animate-pulse" />
               </div>
               <div>
                  <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                     Lecture <span className="text-[var(--brand-color)]">Stream.</span>
                  </h1>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-1">Guaranteed Neural Bridge Playback</p>
               </div>
            </div>
            <p className="text-base text-white/70 font-medium leading-relaxed">
               Access the collective intelligence of the Hill. Every recording is synced via the secure Neural Bridge for 100% playback stability.
            </p>
            <div className="pt-4">
               <button 
                 onClick={() => setIsUploading(true)}
                 className="px-10 py-4 bg-[var(--brand-color)] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                  <Plus size={18}/> Uplink New Recording
               </button>
            </div>
         </div>
      </section>

      {/* 2. FILTERING TOOLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-[var(--border-color)] pb-8">
         <div className="flex flex-col gap-1 w-full md:w-auto">
            <h2 className="text-xl font-black uppercase tracking-tighter">Study Signal Manifest</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               HUB: {showGlobal ? 'Global Registry' : `${currentUser.college} • ${currentUser.status}`}
            </p>
         </div>

         <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--brand-color)] transition-colors" size={18} />
               <input 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-[var(--brand-color)] transition-all shadow-inner"
                 placeholder="Search by topic or code..."
               />
            </div>
            
            <button 
               onClick={() => setShowGlobal(!showGlobal)}
               className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${showGlobal ? 'bg-slate-800 text-white border-transparent shadow-lg' : 'bg-white text-slate-500 border-slate-200'}`}
            >
               {showGlobal ? <Globe size={16}/> : <Filter size={16}/>}
               {showGlobal ? 'Personal Strata' : 'Explore Global'}
            </button>
         </div>
      </div>

      {/* 3. LESSON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredLessons.map(lesson => (
           <div 
             key={lesson.id} 
             onClick={() => handlePlay(lesson)}
             className="group relative bg-white border border-[var(--border-color)] rounded-3xl p-8 transition-all hover:shadow-2xl hover:border-[var(--brand-color)] cursor-pointer flex flex-col"
           >
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                    <img src={lesson.contributorAvatar} className="w-12 h-12 rounded-full border border-slate-100 object-cover bg-slate-50" />
                    <div>
                       <p className="text-[11px] font-black uppercase text-slate-900">{lesson.contributor}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lesson.date}</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-lg text-slate-500">{lesson.courseCode}</span>
              </div>

              <div className="space-y-4 flex-1">
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-[var(--brand-color)] transition-colors line-clamp-2">
                    {lesson.title}
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black uppercase bg-[var(--brand-color)]/10 text-[var(--brand-color)] px-3 py-1 rounded-lg">{lesson.course}</span>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <span className="flex items-center gap-2"><UserIcon size={14}/> {lesson.lecturer}</span>
                    <span className="flex items-center gap-2 text-emerald-500"><Zap size={14}/> Stable Node</span>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Temporal Length</span>
                    <span className="text-sm font-black text-slate-700">{lesson.duration}</span>
                 </div>
                 <div className="p-4 bg-slate-900 text-white rounded-2xl group-hover:bg-[var(--brand-color)] transition-all shadow-xl active:scale-90">
                    <Play size={20} fill="currentColor" className="translate-x-0.5" />
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* 4. NEURAL BRIDGE MODAL (THE PLAYER) */}
      {activeLesson && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
           <div className="bg-slate-900 w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden relative">
              
              {/* TOP LOGIC BAR */}
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-[var(--brand-color)] rounded-xl text-white">
                       <Cpu size={24} className="animate-pulse" />
                    </div>
                    <div>
                       <h4 className="text-sm md:text-lg font-black text-white uppercase tracking-tighter leading-none">{activeLesson.title}</h4>
                       <p className="text-[10px] font-black text-[var(--brand-color)] uppercase tracking-[0.3em] mt-1">Neural_Bridge_Active • ID_{activeLesson.id.slice(-4)}</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveLesson(null)} className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white transition-all rounded-2xl text-slate-400">
                    <X size={28} />
                 </button>
              </div>

              {/* THE NEURAL HUB (EMBEDDED PLAYER) */}
              <div className="flex-1 bg-black relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--brand-color) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
                 
                 <div className="w-full h-full relative z-10 p-2 md:p-8">
                    <iframe 
                      src={activeLesson.audioUrl} 
                      className="w-full h-full rounded-2xl border border-white/5 shadow-2xl" 
                      allow="autoplay"
                    ></iframe>
                 </div>
              </div>

              {/* BOTTOM STATUS BAR */}
              <div className="px-8 py-6 bg-slate-950 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                 <div className="flex items-center gap-4">
                    <img src={activeLesson.contributorAvatar} className="w-10 h-10 rounded-full border border-white/10" />
                    <div className="min-w-0">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{activeLesson.contributor}</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Origin_Node</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                       <span className="text-[10px] font-black text-white uppercase">{activeLesson.courseCode}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stability</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase">SYNCHRONIZED</span>
                    </div>
                 </div>
                 <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => window.open(activeLesson.audioUrl.replace('/preview', '/view'), '_blank')}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                       <ExternalLink size={14}/> Open Node
                    </button>
                    <button className="px-6 py-2.5 bg-[var(--brand-color)] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                       <ShieldCheck size={14}/> Verify
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 5. UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[var(--bg-primary)] w-full max-w-lg p-10 rounded-[3rem] shadow-2xl space-y-8 border border-[var(--border-color)] relative">
              <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                 <div className="flex items-center gap-3">
                    <Zap size={24} className="text-[var(--brand-color)]" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Uplink_Handshake</h2>
                 </div>
                 <button onClick={() => setIsUploading(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><X size={32}/></button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal_Title</label>
                    <input 
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm font-bold outline-none focus:border-[var(--brand-color)]" 
                      value={recordForm.title}
                      onChange={e => setRecordForm({...recordForm, title: e.target.value})}
                      placeholder="e.g. Lec 05: Logic Systems" 
                    />
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drive_Link_Protocol</label>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 pl-12 text-xs font-bold outline-none focus:border-[var(--brand-color)]" 
                         value={recordForm.audioUrl}
                         onChange={e => setRecordForm({...recordForm, audioUrl: e.target.value})}
                         placeholder="Paste standard Drive share link here..." 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target_Course</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[11px] font-bold outline-none appearance-none"
                         value={recordForm.course}
                         onChange={e => setRecordForm({...recordForm, course: e.target.value})}
                       >
                          {(COURSES_BY_COLLEGE[recordForm.college] || []).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync_Level</label>
                       <select 
                         className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-[11px] font-bold outline-none appearance-none"
                         value={recordForm.year}
                         onChange={e => setRecordForm({...recordForm, year: e.target.value as UserStatus})}
                       >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                    </div>
                 </div>

                 {/* Fixed: Use Info icon after adding it to imports to resolve line 341 error */}
                 <div className="p-5 bg-indigo-50 border border-dashed border-indigo-200 rounded-2xl flex items-center gap-4">
                    <Info size={24} className="text-indigo-500 shrink-0" />
                    <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-widest leading-relaxed">
                      All links will be automatically routed through the Neural Bridge to ensure playback integrity across all student nodes.
                    </p>
                 </div>

                 <button 
                   onClick={handleUpload}
                   className="w-full bg-[var(--brand-color)] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   Commit to Hub
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LectureStream;