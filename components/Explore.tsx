
import React, { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, Users, MapPin, Sparkles, Hash, 
  Globe, Zap, ArrowUpRight, Radio, Cpu, Fingerprint,
  Mic2, BookOpen, Trophy, Palette, Code, ChevronRight,
  Navigation, Navigation2, Clock, Car, Footprints, Info,
  Search as SearchIcon, Compass, Map as MapIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapResponse, setMapResponse] = useState<string | null>(null);
  // Fixed state to use latitude/longitude property names as required by the GenAI Maps tool
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const [estimationMode, setEstimationMode] = useState<'walking' | 'driving'>('walking');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Corrected property names to match the expected schema for latLng grounding in retrievalConfig
        (pos) => setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.debug("Location blocked", err)
      );
    }
  }, []);

  const trendingTags = [
    { name: 'ResearchWeek', count: '5.2k', trend: '+12%', color: 'text-indigo-500' },
    { name: 'GuildElections', count: '8.4k', trend: '+45%', color: 'text-rose-500' },
    { name: 'InnovateMak', count: '2.1k', trend: '+8%', color: 'text-emerald-500' },
    { name: 'CampusCup', count: '1.8k', trend: '+5%', color: 'text-amber-500' },
  ];

  const poi = [
    { name: 'Main Hall', desc: 'Central Admin Node', time: '2m', color: 'bg-indigo-500' },
    { name: 'COCIS Block B', desc: 'Tech & Research Wing', time: '8m', color: 'bg-emerald-500' },
    { name: 'Freedom Square', desc: 'Public Assembly Hub', time: '5m', color: 'bg-rose-500' },
    { name: 'CEDAT Studio', desc: 'Design & Creative Node', time: '12m', color: 'bg-amber-500' }
  ];

  const handleMapSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingMap(true);
    try {
      // Re-initialize GenAI client right before the call to ensure fresh key access
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Updated to the correct full model name alias for Gemini Flash Lite 2.5 series
        model: "gemini-flash-lite-latest",
        contents: `Provide information about ${searchQuery} at Makerere University. Give me navigation tips and significance.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              // Ensure coordinates match the expected latitude/longitude schema for grounding
              latLng: userCoords || { latitude: 0.3348, longitude: 32.5684 }
            }
          }
        }
      });
      // Correctly accessing .text property on the response as per guidelines
      setMapResponse(response.text || "Scanning complete. Location identified.");
    } catch (e) {
      console.error(e);
      setMapResponse("Signal interrupted. Could not retrieve place data.");
    } finally {
      setIsSearchingMap(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 space-y-16 pb-40 animate-in fade-in duration-700">
      
      {/* 1. Global Intelligence Header */}
      <section className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/30">
              <Compass className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-[var(--text-primary)] uppercase leading-none italic">
                Discovery <span className="text-indigo-600">Hub</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.4em] text-[9px]">Campus Intelligence Stream</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center gap-4 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-[2.2rem] px-8 py-5">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                className="flex-1 bg-transparent border-none focus:outline-none text-lg font-medium text-[var(--text-primary)]"
                placeholder="Locate a hall, wing, or research node..."
              />
              <button 
                onClick={handleMapSearch}
                className="hidden sm:flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
              >
                {isSearchingMap ? <Cpu size={14} className="animate-spin" /> : <Navigation size={14} />} Execute Scan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campus Navigation & Intelligence Module (The "Google Map" Re-imagined) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3 italic">
                <MapIcon size={28} className="text-emerald-500" /> Navigation Protocol
              </h3>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Real-time geospatial synchronization for Makerere Main Campus</p>
           </div>
           <div className="flex bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border-color)] shadow-sm">
              <button onClick={() => setEstimationMode('walking')} className={`px-5 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${estimationMode === 'walking' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Footprints size={14}/> Walk</button>
              <button onClick={() => setEstimationMode('driving')} className={`px-5 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${estimationMode === 'driving' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Car size={14}/> Drive</button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">
          {/* THE MAP TERMINAL */}
          <div className="lg:col-span-8 relative rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-slate-900 group shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.02705494916!2d32.5645!3d0.3348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb868202958f%3A0xc5403e058c40b793!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1715694712202!5m2!1sen!2sug" 
              className="w-full h-full grayscale-[20%] dark:invert-[90%] dark:hue-rotate-[180deg] transition-all group-hover:grayscale-0"
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            />
            {/* Overlay Navigation HUD */}
            <div className="absolute top-8 left-8 p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl space-y-4 max-w-xs animate-in slide-in-from-left-5">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase text-emerald-500">System Nominal</span>
               </div>
               {mapResponse ? (
                 <div className="space-y-3">
                    <p className="text-sm font-black uppercase text-[var(--text-primary)]">Place Intelligence</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{mapResponse}</p>
                    <button onClick={() => setMapResponse(null)} className="text-[8px] font-black uppercase text-indigo-600 underline">Clear Signal</button>
                 </div>
               ) : (
                 <p className="text-xs text-slate-500 font-medium">Select a node or search for an asset to initialize place intelligence.</p>
               )}
            </div>

            {/* Quick Actions HUD */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
               <div className="flex gap-3">
                  {poi.map(item => (
                    <button key={item.name} className="px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col items-start gap-1 hover:bg-white/20 transition-all group">
                       <span className="text-[10px] font-black text-white uppercase">{item.name}</span>
                       <span className="text-[8px] text-white/60 font-medium">{item.time} {estimationMode === 'walking' ? 'walk' : 'drive'}</span>
                    </button>
                  ))}
               </div>
               <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-600/30 hover:scale-110 active:scale-95 transition-all">
                  <Navigation2 size={24}/>
               </button>
            </div>
          </div>

          {/* SIDEBAR: ROUTE PROCESSOR */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
             <div className="flex-1 glass-card bg-[var(--sidebar-bg)] border-[var(--border-color)] p-8 rounded-[3rem] shadow-xl space-y-8 overflow-y-auto no-scrollbar">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Estimator</h4>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Campus Travel Logs</h3>
                </div>

                <div className="space-y-6">
                   {[
                     { from: 'Current Node', to: 'Main Hall', time: '4m 32s', status: 'Optimal' },
                     { from: 'COCIS Wing', to: 'CEDAT Wing', time: '11m 15s', status: 'Moderate Traffic' },
                     { from: 'Hall of Residence', to: 'Freedom Sq.', time: '7m 20s', status: 'Crowded' }
                   ].map((route, i) => (
                     <div key={i} className="group relative p-6 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] hover:border-indigo-500 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="flex flex-col items-center gap-1 shrink-0">
                              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
                              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-slate-500 uppercase">{route.from}</p>
                              <p className="text-[9px] font-black text-slate-500 uppercase mt-4">{route.to}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black tracking-tight text-indigo-600">{route.time}</p>
                              <p className={`text-[8px] font-black uppercase ${route.status === 'Optimal' ? 'text-emerald-500' : 'text-amber-500'}`}>{route.status}</p>
                           </div>
                        </div>
                        <button className="w-full py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Start Guidance</button>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-indigo-600 rounded-[3rem] text-white space-y-4 shadow-2xl shadow-indigo-600/20">
                <div className="flex items-center gap-3">
                   <Info size={20}/>
                   <span className="text-[10px] font-black uppercase tracking-widest">Navigation Advisory</span>
                </div>
                <p className="text-sm font-medium leading-relaxed italic text-white/90">
                  "Heavy student congestion reported at Freedom Square due to the upcoming Guild synchronization event. Consider alternate routes via CHUSS Wing."
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Trending Intensity Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3 italic">
            <TrendingUp size={28} className="text-indigo-600" /> Hot Signals
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">Telemetry Updated 2m ago</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingTags.map((tag) => (
            <div key={tag.name} className="glass-card group p-8 bg-[var(--sidebar-bg)] border-[var(--border-color)] hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10">
                <Hash size={80} className={tag.color} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h4 className={`text-2xl font-black uppercase tracking-tighter ${tag.color}`}>#{tag.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag.count} ACTIVE SIGNALS</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-emerald-500 font-black text-sm">
                    <ArrowUpRight size={18} /> {tag.trend}
                  </div>
                  <div className="w-20 h-1 bg-slate-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-indigo-600 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Intelligence Reports Section */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3 italic">
          <Sparkles size={28} className="text-amber-500" /> Curated Assets
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[
            { title: 'The Makerere Blockchain Initiative', author: 'COCIS Lab Alpha', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200', tag: 'High Density' },
            { title: 'New Art: The Sculptures of CEDAT', author: 'Arts & Design Wing', img: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1200', tag: 'Visual Asset' }
          ].map((report, i) => (
            <div key={i} className="group relative rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-xl transition-all hover:shadow-2xl">
              <div className="h-[450px] relative overflow-hidden">
                <img src={report.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" alt={report.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute top-8 left-8">
                  <span className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {report.tag}
                  </span>
                </div>
                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
                  <div className="space-y-3">
                    <h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-lg italic">
                      {report.title}
                    </h4>
                    <div className="flex items-center gap-6 text-white/70 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Fingerprint size={16}/> ID: {report.author}</span>
                      <span className="flex items-center gap-2"><Radio size={16} className="text-rose-500"/> 4.2k NODES SCANNED</span>
                    </div>
                  </div>
                  <button className="px-10 py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-3 shadow-2xl active:scale-95">
                    Initialize Scan <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .glass-card {
          backdrop-blur: 12px;
          background: color-mix(in srgb, var(--card-bg) 80%, transparent);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Explore;
