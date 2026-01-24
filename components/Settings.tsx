
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Type, Sliders, Box, Zap, 
  RefreshCcw, Monitor, Database, ShieldCheck, 
  Cpu, Activity, Radio, Layout, Check, 
  Maximize2, Grid3X3, Layers, Fingerprint,
  ChevronRight, Laptop, Moon, Sun, Ghost,
  MousePointer2, Square, Circle, Info, Eye,
  FileText, MessageCircle, Heart, Share2,
  Plus, Minus, Hash, Command, Globe
} from 'lucide-react';

const COLORS = [
  { name: 'Tactical Gray', hex: '#64748b' },
  { name: 'Deep Indigo', hex: '#4f46e5' },
  { name: 'Cyber Sky', hex: '#0ea5e9' },
  { name: 'Toxic Emerald', hex: '#10b981' },
  { name: 'Pulse Rose', hex: '#f43f5e' },
  { name: 'Amber Warning', hex: '#f59e0b' },
];

const FONTS = [
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Inter UI', value: '"Inter", sans-serif' },
  { name: 'Plus Jakarta', value: '"Plus Jakarta Sans", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Scholar Serif', value: '"Playfair Display", serif' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'geometry' | 'behavior' | 'system'>('visuals');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('maksocial_appearance_v2');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: '4px',
      animationsEnabled: true,
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#4f46e5'
    };
  });

  const [fontSizeNumeric, setFontSizeNumeric] = useState(14);

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v2', JSON.stringify(settings));
    
    const root = document.documentElement;
    // Applying CSS Variables
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);
    root.style.setProperty('--base-font-size', `${fontSizeNumeric}px`);
    
    // Applying Data Attributes
    root.setAttribute('data-animations', settings.animationsEnabled.toString());
    root.setAttribute('data-glow', settings.glowEffects.toString());
    root.setAttribute('data-grid', settings.showGrid.toString());
    
    // Applying Theme Presets - FIXED THEME BUG
    if (settings.themePreset === 'oled') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--sidebar-bg', '#000000');
      root.style.setProperty('--border-color', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#777777');
    } else if (settings.themePreset === 'paper') {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
      root.style.setProperty('--sidebar-bg', '#ffffff');
      root.style.setProperty('--border-color', '#e5e7eb');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#4b5563');
    } else if (settings.themePreset === 'tactical') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#161b22');
      root.style.setProperty('--sidebar-bg', '#010409');
      root.style.setProperty('--border-color', '#30363d');
      root.style.setProperty('--text-primary', '#c9d1d9');
      root.style.setProperty('--text-secondary', '#8b949e');
    } else {
      // Standard Slate
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#1e293b');
      root.style.setProperty('--bg-secondary', '#334155');
      root.style.setProperty('--border-color', '#475569');
    }
  }, [settings, fontSizeNumeric]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: '4px',
      animationsEnabled: true,
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#4f46e5'
    });
    setFontSizeNumeric(14);
  };

  const adjustFontSize = (delta: number) => {
    setFontSizeNumeric(prev => Math.min(Math.max(prev + delta, 10), 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 pb-40 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-600/20 text-white">
              <Cpu size={36} />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">OS_Registry_Config</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500 mt-2 flex items-center gap-2">
                 <Activity size={10} className="text-emerald-500" /> SYSTEM.NOMINAL / NODE_v4.2
              </p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={handleReset} className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-md text-[8px] font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center gap-2">
              <RefreshCcw size={12} /> Factory_Purge
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. LEFT: PREVIEW NODE */}
        <aside className="lg:col-span-4 space-y-6">
           <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-6 sticky top-24 shadow-sm space-y-6 overflow-hidden">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                 <Monitor size={14} /> Global_Signal_Preview
              </h3>
              
              <div className="space-y-4">
                 {/* MOCK POST COMPONENT */}
                 <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-5 space-y-3 shadow-sm transition-all duration-300" style={{ fontFamily: settings.fontFamily, borderRadius: settings.borderRadius }}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                             <Fingerprint size={20} />
                          </div>
                          <div>
                             <div className="h-2.5 w-24 bg-indigo-600/20 rounded-full mb-1"></div>
                             <div className="h-1.5 w-16 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                          </div>
                       </div>
                       <Command size={14} className="text-slate-400" />
                    </div>
                    <p className="font-medium leading-relaxed italic" style={{ fontSize: `${fontSizeNumeric}px` }}>
                       "Registry strata initialized. Visual telemetry is now synced with local node configurations."
                    </p>
                    <div className="flex gap-4 pt-1 opacity-60">
                       <div className="flex items-center gap-1.5 text-rose-500"><Heart size={12} /><span className="text-[8px] font-black uppercase">Sync</span></div>
                       <div className="flex items-center gap-1.5 text-indigo-600"><Share2 size={12} /><span className="text-[8px] font-black uppercase">Fork</span></div>
                    </div>
                 </div>

                 {/* MOCK UI ELEMENTS */}
                 <div className="grid grid-cols-2 gap-2">
                    <div className="bg-indigo-600 text-white p-3 flex flex-col items-center justify-center gap-1 shadow-lg" style={{ borderRadius: settings.borderRadius }}>
                       <Zap size={14} className={settings.glowEffects ? 'animate-pulse' : ''}/>
                       <span className="text-[7px] font-black uppercase tracking-widest">Active_Uplink</span>
                    </div>
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 flex flex-col items-center justify-center gap-1" style={{ borderRadius: settings.borderRadius }}>
                       <Database size={14} className="text-slate-400" />
                       <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Registry_Log</span>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                 <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-500">
                    <span>Signal_Strength</span>
                    <span className="text-emerald-500">98% Stable</span>
                 </div>
                 <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[98%] shadow-[0_0_8px_var(--brand-color)]"></div>
                 </div>
              </div>
           </div>
        </aside>

        {/* 3. RIGHT: CONTROL MATRIX */}
        <main className="lg:col-span-8 space-y-10">
           
           {/* TAB SWITCHER */}
           <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] w-full sm:w-fit">
              {[
                { id: 'visuals', label: 'Visual_Strata', icon: <Palette size={14}/> },
                { id: 'geometry', label: 'Geometry_Logic', icon: <Box size={14}/> },
                { id: 'behavior', label: 'Behaviors', icon: <Sliders size={14}/> },
                { id: 'system', label: 'System_Info', icon: <Info size={14}/> }
              ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
                 >
                    {tab.icon} {tab.label}
                 </button>
              ))}
           </div>

           {activeTab === 'visuals' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
                 {/* Environment Presets */}
                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1 flex items-center gap-2">
                       <Globe size={12}/> Environment_Parameters
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {[
                         { id: 'tactical', label: 'Tactical_Dark', icon: <Laptop size={16}/>, desc: 'Night Ops' },
                         { id: 'oled', label: 'Pure_OLED', icon: <Ghost size={16}/>, desc: 'Stealth' },
                         { id: 'paper', label: 'Light_Paper', icon: <FileText size={16}/>, desc: 'Day Ops' },
                         { id: 'standard', label: 'Hybrid_Blue', icon: <Activity size={16}/>, desc: 'Balanced' }
                       ].map(t => (
                          <button 
                            key={t.id}
                            onClick={() => setSettings({...settings, themePreset: t.id as any})}
                            className={`p-4 rounded-md border text-left transition-all group ${settings.themePreset === t.id ? 'bg-indigo-600 border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600/50'}`}
                          >
                             <div className="flex justify-between items-start mb-3">
                                {t.icon}
                                {settings.themePreset === t.id && <Check size={12} />}
                             </div>
                             <p className="text-[8px] font-black uppercase tracking-widest">{t.label}</p>
                             <p className={`text-[6px] font-bold uppercase mt-1 opacity-50 ${settings.themePreset === t.id ? 'text-white' : 'text-slate-400'}`}>{t.desc}</p>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Frequencies */}
                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1 flex items-center gap-2">
                       <Hash size={12}/> Frequency_Accent (Color)
                    </label>
                    <div className="flex flex-wrap gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)]">
                       {COLORS.map(c => (
                          <button 
                            key={c.hex}
                            onClick={() => setSettings({...settings, primaryColor: c.hex})}
                            className={`group relative flex flex-col items-center gap-2 transition-transform hover:scale-105`}
                          >
                             <div 
                               className={`w-12 h-12 rounded-md border-2 transition-all flex items-center justify-center ${settings.primaryColor === c.hex ? 'border-white shadow-2xl scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                               style={{ backgroundColor: c.hex }}
                             >
                                {settings.primaryColor === c.hex && <Check size={18} className="text-white" />}
                             </div>
                             <span className={`text-[6px] font-black uppercase tracking-widest ${settings.primaryColor === c.hex ? 'text-indigo-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>{c.name}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Font Numeric Control */}
                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1 flex items-center gap-2">
                       <Maximize2 size={12}/> Typography_Scale
                    </label>
                    <div className="flex items-center gap-6 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)]">
                       <button onClick={() => adjustFontSize(-1)} className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:text-indigo-600 transition-colors"><Minus size={16}/></button>
                       <div className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-2xl font-black italic tracking-tighter">{fontSizeNumeric}px</span>
                          <span className="text-[7px] font-black uppercase text-slate-400 tracking-[0.2em]">Scale_Resolution</span>
                       </div>
                       <button onClick={() => adjustFontSize(1)} className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:text-indigo-600 transition-colors"><Plus size={16}/></button>
                    </div>
                 </div>
              </section>
           )}

           {activeTab === 'geometry' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
                 <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] space-y-8">
                    {/* Radius Slider */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                             <Square size={14}/> Radius_Geometry
                          </label>
                          <span className="text-indigo-600 text-[10px] font-black uppercase">{settings.borderRadius}</span>
                       </div>
                       <input 
                         type="range" min="0" max="24" step="2"
                         value={parseInt(settings.borderRadius)}
                         onChange={(e) => setSettings({...settings, borderRadius: `${e.target.value}px`})}
                         className="w-full h-1 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-indigo-600"
                       />
                       <div className="flex justify-between text-[6px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Hard_Indus (0px)</span>
                          <span>Soft_Minimal (12px)</span>
                          <span>Fluid_Modern (24px)</span>
                       </div>
                    </div>

                    <div className="h-px bg-[var(--border-color)] opacity-40" />

                    {/* UI Density */}
                    <div className="space-y-4">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                          <Layers size={14}/> Interface_Density_Stack
                       </label>
                       <div className="grid grid-cols-3 gap-3">
                          {(['comfortable', 'compact', 'tight'] as const).map(d => (
                             <button
                               key={d}
                               onClick={() => setSettings({...settings, density: d})}
                               className={`py-3 rounded-md border text-[8px] font-black uppercase tracking-widest transition-all ${settings.density === d ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-slate-400'}`}
                             >
                                {d}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </section>
           )}

           {activeTab === 'behavior' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'animationsEnabled', label: 'Motion_Flux', icon: <Activity size={18}/>, desc: 'Enable UI transitions' },
                      { id: 'glowEffects', label: 'Signal_Glow', icon: <Zap size={18}/>, desc: 'Neon accent pulses' },
                      { id: 'showGrid', label: 'Telemetry_Grid', icon: <Grid3X3 size={18}/>, desc: 'System background grid' },
                      { id: 'glassmorphism', label: 'Blur_Optics', icon: <Layers size={18}/>, desc: 'Z-axis transparency' }
                    ].map(toggle => (
                       <button
                         key={toggle.id}
                         onClick={() => setSettings({...settings, [toggle.id]: !settings[toggle.id as keyof AppSettings]})}
                         className={`p-5 rounded-md border text-left flex items-start gap-4 transition-all ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600/5 border-indigo-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-60'}`}
                       >
                          <div className={`p-2 rounded-lg ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-primary)] text-slate-400'}`}>
                             {toggle.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${settings[toggle.id as keyof AppSettings] ? 'text-indigo-600' : 'text-slate-500'}`}>{toggle.label}</span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                   <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${settings[toggle.id as keyof AppSettings] ? 'left-5' : 'left-1'}`} />
                                </div>
                             </div>
                             <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest truncate">{toggle.desc}</p>
                          </div>
                       </button>
                    ))}
                 </div>
              </section>
           )}

           {activeTab === 'system' && (
              <section className="space-y-6 animate-in fade-in duration-300">
                 <div className="p-8 border border-dashed border-indigo-600/30 rounded-[var(--radius-main)] bg-indigo-600/5 space-y-6">
                    <ShieldCheck size={32} className="text-indigo-600" />
                    <div className="space-y-4">
                       <h4 className="text-xl font-black uppercase tracking-tighter italic">Integrity_Shield: Active</h4>
                       <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
                          All local environment variables are verified against the central Hill Registry. Personal stratification changes do not affect main signal integrity. Current session verified until next academic cycle reset.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-[8px] font-black uppercase tracking-[0.2em]">
                          <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md flex flex-col gap-1">
                             <span className="text-slate-400">Node_ID</span>
                             <span className="text-indigo-600 truncate">MD5_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                          </div>
                          <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md flex flex-col gap-1">
                             <span className="text-slate-400">Sync_Strata</span>
                             <span className="text-emerald-500">LEVEL_4_AUTH</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>
           )}

        </main>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Settings;
