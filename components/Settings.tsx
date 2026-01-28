
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Type, Sliders, Box, Zap, 
  RefreshCcw, Monitor, Database, ShieldCheck, 
  Cpu, Activity, Radio, Layout, Check, 
  Maximize2, Grid3X3, Layers, Fingerprint,
  ChevronRight, Laptop, Moon, Sun, Ghost,
  MousePointer2, Square, Circle, Info, Eye,
  Plus, Minus, Hash, Command, Globe, Settings as SettingsIcon,
  FileText, MinusSquare
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
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'geometry' | 'behavior' | 'system'>('visuals');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('maksocial_appearance_v3');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: '6px',
      animationsEnabled: true,
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#6366f1',
      backgroundPattern: 'none'
    };
  });

  const [fontSizeNumeric, setFontSizeNumeric] = useState(() => {
    const saved = localStorage.getItem('maksocial_font_size');
    return saved ? parseInt(saved) : 14;
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v3', JSON.stringify(settings));
    localStorage.setItem('maksocial_font_size', fontSizeNumeric.toString());
    
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);
    root.style.setProperty('--base-font-size', `${fontSizeNumeric}px`);
    
    if (settings.themePreset === 'oled') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#050505');
      root.style.setProperty('--border-color', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
    } else if (settings.themePreset === 'paper') {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f6f8fa');
      root.style.setProperty('--border-color', '#d0d7de');
      root.style.setProperty('--text-primary', '#1f2328');
    } else if (settings.themePreset === 'tactical') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#161b22');
      root.style.setProperty('--border-color', '#30363d');
      root.style.setProperty('--text-primary', '#c9d1d9');
    } else {
      root.classList.add('dark');
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--border-color');
      root.style.removeProperty('--text-primary');
    }
  }, [settings, fontSizeNumeric]);

  const adjustFontSize = (delta: number) => {
    setFontSizeNumeric(prev => Math.min(Math.max(prev + delta, 10), 24));
  };

  const handleReset = () => {
    setSettings({
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: '6px',
      animationsEnabled: true,
      motionStrata: 'subtle',
      glassmorphism: true,
      glowEffects: true,
      themePreset: 'tactical',
      showGrid: true,
      accentColor: '#6366f1',
      backgroundPattern: 'none'
    });
    setFontSizeNumeric(14);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 pb-40 text-[var(--text-primary)] font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/20">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">OS_Config</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">personalize your node parameters</p>
          </div>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 px-6 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">
          <RefreshCcw size={14} /> Factory_Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'visuals', label: 'Visuals', icon: <Palette size={18}/> },
            { id: 'geometry', label: 'Geometry', icon: <Box size={18}/> },
            { id: 'behavior', label: 'Behavior', icon: <Activity size={18}/> },
            { id: 'system', label: 'Security', icon: <ShieldCheck size={18}/> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-10">
          {activeTab === 'visuals' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-2">
              {/* THEME SELECTOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <Monitor size={14}/> Environment_Strata
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { id: 'tactical', label: 'Dark Tactical', icon: <Laptop size={16}/> },
                     { id: 'oled', label: 'Pure OLED', icon: <Ghost size={16}/> },
                     { id: 'paper', label: 'Light Paper', icon: <FileText size={16}/> },
                     { id: 'standard', label: 'Standard Slate', icon: <Activity size={16}/> }
                   ].map(p => (
                      <button 
                        key={p.id}
                        onClick={() => setSettings({...settings, themePreset: p.id as any})}
                        className={`p-6 rounded-md border text-left transition-all ${settings.themePreset === p.id ? 'bg-indigo-600 border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600'}`}
                      >
                         <div className="mb-4">{p.icon}</div>
                         <p className="text-[10px] font-black uppercase tracking-widest">{p.label}</p>
                      </button>
                   ))}
                </div>
              </div>

              {/* BACKGROUND PATTERN SELECTOR - NEW POLISHED SECTION */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <Layers size={14}/> Background_Architecture
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {[
                     { id: 'none', label: 'Clean Slate', desc: 'Minimal solid color', icon: <MinusSquare size={16}/> },
                     { id: 'grid', label: 'Subtle Grid', desc: 'Precision square matrix', icon: <Grid3X3 size={16}/> },
                     { id: 'dots', label: 'Tactical Dots', desc: 'Radial data points', icon: <Circle size={16} className="fill-current"/> }
                   ].map(bg => (
                      <button 
                        key={bg.id}
                        onClick={() => setSettings({...settings, backgroundPattern: bg.id as any})}
                        className={`group p-6 rounded-md border text-left transition-all relative overflow-hidden ${settings.backgroundPattern === bg.id ? 'bg-indigo-600 border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600'}`}
                      >
                         {/* Mini Pattern Preview */}
                         <div className={`absolute inset-0 opacity-[0.05] pointer-events-none ${
                           bg.id === 'grid' ? 'bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:10px_10px]' : 
                           bg.id === 'dots' ? 'bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[size:6px_6px]' : ''
                         }`}></div>
                         
                         <div className="relative z-10">
                            <div className="mb-4 text-slate-400 group-hover:text-white transition-colors">{bg.icon}</div>
                            <p className="text-[10px] font-black uppercase tracking-widest">{bg.label}</p>
                            <p className="text-[8px] font-bold opacity-60 uppercase mt-1">{bg.desc}</p>
                         </div>
                         {settings.backgroundPattern === bg.id && (
                           <div className="absolute top-3 right-3"><Check size={14}/></div>
                         )}
                      </button>
                   ))}
                </div>
              </div>

              {/* ACCENT COLOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <Hash size={14}/> System_Accent
                </label>
                <div className="flex flex-wrap gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md">
                   {COLORS.map(c => (
                      <button 
                        key={c.hex}
                        onClick={() => setSettings({...settings, primaryColor: c.hex})}
                        className={`w-12 h-12 rounded-md border-4 transition-all flex items-center justify-center ${settings.primaryColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                        style={{ backgroundColor: c.hex }}
                      >
                        {settings.primaryColor === c.hex && <Check size={20} className="text-white" />}
                      </button>
                   ))}
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <Maximize2 size={14}/> Typography_Scale
                </label>
                <div className="flex items-center gap-8 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md">
                   <button onClick={() => adjustFontSize(-1)} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:text-indigo-600 active:scale-95 transition-all"><Minus size={20}/></button>
                   <div className="flex-1 text-center">
                      <span className="text-4xl font-black italic tracking-tighter">{fontSizeNumeric}px</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry_Scale</p>
                   </div>
                   <button onClick={() => adjustFontSize(1)} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:text-indigo-600 active:scale-95 transition-all"><Plus size={20}/></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geometry' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-2">
              <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <Square size={14}/> Border_Geometry
                    </label>
                    <span className="text-indigo-600 font-black text-xs">{settings.borderRadius}</span>
                  </div>
                  <input 
                    type="range" min="0" max="16" step="2"
                    value={parseInt(settings.borderRadius)}
                    onChange={(e) => setSettings({...settings, borderRadius: `${e.target.value}px`})}
                    className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                     <Type size={14}/> System_Font
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FONTS.map(f => (
                      <button 
                        key={f.name}
                        onClick={() => setSettings({...settings, fontFamily: f.value})}
                        className={`p-4 rounded-md border text-left flex items-center justify-between transition-all ${settings.fontFamily === f.value ? 'bg-indigo-600 text-white border-transparent' : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-indigo-600'}`}
                        style={{ fontFamily: f.value }}
                      >
                        <span className="text-sm font-bold uppercase">{f.name}</span>
                        {settings.fontFamily === f.value && <Check size={14}/>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-2">
              {[
                { id: 'animationsEnabled', label: 'Motion_Flux', icon: <Activity size={20}/>, desc: 'UI Transitions' },
                { id: 'showGrid', label: 'Telemetry_Grid', icon: <Grid3X3 size={20}/>, desc: 'Background grid' },
                { id: 'glassmorphism', label: 'Z_Opacity', icon: <Layers size={20}/>, desc: 'Layered blur' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSettings({...settings, [t.id]: !settings[t.id as keyof AppSettings]})}
                  className={`p-6 rounded-md border text-left flex items-start gap-5 transition-all ${settings[t.id as keyof AppSettings] ? 'bg-indigo-600/5 border-indigo-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] opacity-60'}`}
                >
                  <div className={`p-3 rounded-md ${settings[t.id as keyof AppSettings] ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-primary)] text-slate-400'}`}>
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${settings[t.id as keyof AppSettings] ? 'text-indigo-600' : 'text-slate-500'}`}>{t.label}</span>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${settings[t.id as keyof AppSettings] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${settings[t.id as keyof AppSettings] ? 'left-5' : 'left-1'}`} />
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'system' && (
            <div className="p-8 border border-dashed border-indigo-600/30 rounded-md bg-indigo-600/5 space-y-6 animate-in fade-in">
              <ShieldCheck size={48} className="text-indigo-600" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Registry_Status: Verified</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                  Local registry parameters are synchronized with the central protocol. Any shifts in visualization do not affect core identity data.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Uptime_Sequence</p>
                  <p className="text-sm font-black text-emerald-500">99.98% Stable</p>
                </div>
                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Decryption_Layer</p>
                  <p className="text-sm font-black text-indigo-500">Hill.Secure_v2</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
