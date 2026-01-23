
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Type, Sliders, Box, Zap, 
  RefreshCcw, Monitor, Database, ShieldCheck, 
  Cpu, Activity, Radio, Layout, Check, 
  Maximize2, Grid3X3, Layers, Fingerprint,
  ChevronRight, Laptop, Moon, Sun, Ghost,
  MousePointer2, Square, Circle, Info, Eye,
  FileText, MessageCircle, Heart, Share2
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
  const [activeTab, setActiveTab] = useState<'visuals' | 'geometry' | 'behavior'>('visuals');
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
      // Added motionStrata default
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#4f46e5'
    };
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v2', JSON.stringify(settings));
    
    const root = document.documentElement;
    // Applying CSS Variables
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);
    
    // Applying Data Attributes
    root.setAttribute('data-animations', settings.animationsEnabled.toString());
    root.setAttribute('data-glow', settings.glowEffects.toString());
    root.setAttribute('data-grid', settings.showGrid.toString());
    
    // Applying Theme Presets
    if (settings.themePreset === 'oled') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--sidebar-bg', '#000000');
      root.style.setProperty('--border-color', '#1a1a1a');
    } else if (settings.themePreset === 'paper') {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
    } else if (settings.themePreset === 'tactical') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#161b22');
      root.style.setProperty('--border-color', '#30363d');
    }
  }, [settings]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: '4px',
      animationsEnabled: true,
      // Added motionStrata reset
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#4f46e5'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 pb-40 font-mono text-[var(--text-primary)]">
      
      {/* 1. TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
        <div className="flex items-center gap-6">
           <div className="p-5 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-600/20 text-white">
              <Cpu size={40} />
           </div>
           <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">OS.Customizer</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-2">Registry Configuration / Node v4.2.0</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button onClick={handleReset} className="px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center gap-2">
              <RefreshCcw size={14} /> Factory.Reset
           </button>
           <div className="px-5 py-2.5 bg-indigo-600/10 border border-indigo-600/20 rounded-md text-indigo-600 text-[9px] font-black uppercase flex items-center gap-2">
              <Radio size={12} className="animate-pulse" /> Uplink.Ready
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. LEFT: PREVIEW NODE */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] p-8 sticky top-24 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                 <Monitor size={16} /> Live.Signal_Preview
              </h3>
              
              <div className="space-y-6">
                 {/* MOCK POST COMPONENT */}
                 <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-6 space-y-4 shadow-sm" style={{ fontFamily: settings.fontFamily, borderRadius: settings.borderRadius }}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                             <Fingerprint size={20} />
                          </div>
                          <div>
                             <div className="h-2.5 w-24 bg-indigo-600/20 rounded-full mb-1"></div>
                             <div className="h-1.5 w-16 bg-slate-300 dark:bg-white/10 rounded-full"></div>
                          </div>
                       </div>
                       <Share2 size={14} className="text-slate-400" />
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed italic">
                       "Initializing deep signal preview. The university registry is now synchronized with your custom UI strata."
                    </p>
                    <div className="flex gap-4 pt-2">
                       <div className="flex items-center gap-1.5 text-rose-500"><Heart size={14} /><span className="text-[9px] font-black">4.2k</span></div>
                       <div className="flex items-center gap-1.5 text-indigo-600"><MessageCircle size={14} /><span className="text-[9px] font-black">89</span></div>
                    </div>
                 </div>

                 {/* MOCK UI ELEMENTS */}
                 <div className="grid grid-cols-2 gap-3">
                    <button className="bg-indigo-600 text-white p-3 flex flex-col items-center justify-center gap-2 shadow-lg" style={{ borderRadius: settings.borderRadius }}>
                       <Zap size={16} className={settings.glowEffects ? 'animate-pulse' : ''}/>
                       <span className="text-[8px] font-black uppercase">Active.Node</span>
                    </button>
                    <button className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-3 flex flex-col items-center justify-center gap-2" style={{ borderRadius: settings.borderRadius }}>
                       <Database size={16} className="text-slate-400" />
                       <span className="text-[8px] font-black uppercase text-slate-500">Registry</span>
                    </button>
                 </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)] flex items-center gap-4 text-slate-500">
                 <Info size={16} />
                 <p className="text-[8px] font-black uppercase tracking-widest leading-loose">
                    Preview uses localized variable injection. Actual signal transmission may vary based on terminal constraints.
                 </p>
              </div>
           </div>
        </aside>

        {/* 3. RIGHT: CONTROL MATRIX */}
        <main className="lg:col-span-8 space-y-12 pb-32">
           
           {/* TAB SWITCHER */}
           <div className="flex gap-2 p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] w-fit">
              {[
                { id: 'visuals', label: 'OS Visuals', icon: <Palette size={14}/> },
                { id: 'geometry', label: 'Geometry', icon: <Box size={14}/> },
                { id: 'behavior', label: 'Behaviors', icon: <Sliders size={14}/> }
              ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
                 >
                    {tab.icon} {tab.label}
                 </button>
              ))}
           </div>

           {activeTab === 'visuals' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
                 {/* Environment Presets */}
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1">Environment_Presets</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                         { id: 'tactical', label: 'Tactical Dark', icon: <Laptop size={18}/>, desc: 'Classic Registry' },
                         { id: 'oled', label: 'Pure OLED', icon: <Ghost size={18}/>, desc: 'Maximum Stealth' },
                         { id: 'paper', label: 'Paper White', icon: <FileText size={18}/>, desc: 'Light Mode' },
                         { id: 'standard', label: 'Slate Hybrid', icon: <Activity size={18}/>, desc: 'Medium Contrast' }
                       ].map(t => (
                          <button 
                            key={t.id}
                            onClick={() => setSettings({...settings, themePreset: t.id as any})}
                            className={`p-5 rounded-md border text-left transition-all group ${settings.themePreset === t.id ? 'bg-indigo-600 border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600/50'}`}
                          >
                             <div className="flex justify-between items-start mb-4">
                                {t.icon}
                                {settings.themePreset === t.id && <Check size={14} />}
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-widest">{t.label}</p>
                             <p className={`text-[7px] font-bold uppercase mt-1 opacity-50 ${settings.themePreset === t.id ? 'text-white' : 'text-slate-400'}`}>{t.desc}</p>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Signal Frequencies (Primary Colors) */}
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1">Frequency_Spectrum (Accent)</label>
                    <div className="flex flex-wrap gap-4">
                       {COLORS.map(c => (
                          <button 
                            key={c.hex}
                            onClick={() => setSettings({...settings, primaryColor: c.hex})}
                            className={`group relative flex flex-col items-center gap-3 transition-transform hover:scale-105`}
                          >
                             <div 
                               className={`w-14 h-14 rounded-md border-4 transition-all flex items-center justify-center ${settings.primaryColor === c.hex ? 'border-white shadow-2xl scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                               style={{ backgroundColor: c.hex }}
                             >
                                {settings.primaryColor === c.hex && <Check size={20} className="text-white" />}
                             </div>
                             <span className={`text-[7px] font-black uppercase tracking-widest ${settings.primaryColor === c.hex ? 'text-indigo-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>{c.name}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Typography Engines */}
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1">Typeface_Engine</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {FONTS.map(f => (
                          <button 
                            key={f.name}
                            onClick={() => setSettings({...settings, fontFamily: f.value})}
                            className={`p-6 border rounded-md text-left transition-all ${settings.fontFamily === f.value ? 'bg-indigo-600 text-white border-transparent shadow-lg' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600/30 text-slate-500'}`}
                            style={{ fontFamily: f.value }}
                          >
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-widest">{f.name}</span>
                                {settings.fontFamily === f.value && <Eye size={14}/>}
                             </div>
                             <p className="text-[8px] mt-2 opacity-60">"The quick brown fox jumps over the lazy student."</p>
                          </button>
                       ))}
                    </div>
                 </div>
              </section>
           )}

           {activeTab === 'geometry' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-300">
                 <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-main)] space-y-10">
                    {/* Radius Slider */}
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                             <Square size={14}/> Component_Geometry (Radius)
                          </label>
                          <span className="text-indigo-600 text-[10px] font-black uppercase">{settings.borderRadius}</span>
                       </div>
                       <input 
                         type="range" min="0" max="24" step="2"
                         value={parseInt(settings.borderRadius)}
                         onChange={(e) => setSettings({...settings, borderRadius: `${e.target.value}px`})}
                         className="w-full h-1 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-indigo-600"
                       />
                       <div className="flex justify-between text-[7px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Hard_Industrial (0px)</span>
                          <span>Soft_Minimal (12px)</span>
                          <span>Fluid_Modern (24px)</span>
                       </div>
                    </div>

                    <div className="h-px bg-[var(--border-color)]" />

                    {/* UI Density */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                          <Layers size={14}/> Interface_Density
                       </label>
                       <div className="grid grid-cols-3 gap-4">
                          {(['comfortable', 'compact', 'tight'] as const).map(d => (
                             <button
                               key={d}
                               onClick={() => setSettings({...settings, density: d})}
                               className={`py-4 rounded-md border text-[9px] font-black uppercase tracking-widest transition-all ${settings.density === d ? 'bg-indigo-600 text-white border-transparent' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-slate-400'}`}
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Toggles */}
                    {[
                      { id: 'animationsEnabled', label: 'Motion_Strata', icon: <Activity size={18}/>, desc: 'Enable fluid UI transitions' },
                      { id: 'glowEffects', label: 'Signal_Glow', icon: <Zap size={18}/>, desc: 'Neon active-state highlights' },
                      { id: 'showGrid', label: 'Tactical_Grid', icon: <Grid3X3 size={18}/>, desc: 'Background telemetry lines' },
                      { id: 'glassmorphism', label: 'Glass_Transparency', icon: <Layers size={18}/>, desc: 'Blur-based depth effects' }
                    ].map(toggle => (
                       <button
                         key={toggle.id}
                         onClick={() => setSettings({...settings, [toggle.id]: !settings[toggle.id as keyof AppSettings]})}
                         className={`p-6 rounded-md border text-left flex items-start gap-4 transition-all ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600/5 border-indigo-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-60'}`}
                       >
                          <div className={`p-2 rounded-lg ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-primary)] text-slate-400'}`}>
                             {toggle.icon}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${settings[toggle.id as keyof AppSettings] ? 'text-indigo-600' : 'text-slate-500'}`}>{toggle.label}</span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${settings[toggle.id as keyof AppSettings] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                   <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${settings[toggle.id as keyof AppSettings] ? 'left-5' : 'left-1'}`} />
                                </div>
                             </div>
                             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{toggle.desc}</p>
                          </div>
                       </button>
                    ))}
                 </div>

                 <div className="p-10 border border-dashed border-indigo-600/30 rounded-[var(--radius-main)] bg-indigo-600/5 flex flex-col items-center text-center space-y-6">
                    <ShieldCheck size={48} className="text-indigo-600 opacity-40" />
                    <div className="space-y-2">
                       <h4 className="text-xl font-black uppercase tracking-tighter italic">Integrity Shield Active</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] max-md leading-relaxed">
                          All customization variables are locally persistent and verified against the university registry. 
                          Changes do not affect main signal protocols.
                       </p>
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
