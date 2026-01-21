
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Type, Maximize2, ShieldAlert, 
  Check, RefreshCcw, Layout, Sun, Moon,
  Contrast, AlignLeft, Sliders, Zap, Sparkles,
  Layers, MousePointer2, Box, Command
} from 'lucide-react';

const COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Fuchsia', hex: '#d946ef' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Lime', hex: '#84cc16' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Slate', hex: '#64748b' }
];

const FONTS = [
  { name: 'Jakarta Sans', value: '"Plus Jakarta Sans"' },
  { name: 'Inter UI', value: '"Inter"' },
  { name: 'Poppins', value: '"Poppins"' },
  { name: 'Montserrat', value: '"Montserrat"' },
  { name: 'Lexend', value: '"Lexend"' },
  { name: 'Space Grotesk', value: '"Space Grotesk"' },
  { name: 'Outfit', value: '"Outfit"' },
  { name: 'Sora', value: '"Sora"' },
  { name: 'Playfair (Serif)', value: '"Playfair Display"' },
  { name: 'JetBrains (Mono)', value: '"JetBrains Mono"' }
];

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('maksocial_appearance');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#6366f1',
      fontFamily: '"Plus Jakarta Sans"',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: 'lg',
      animationsEnabled: true,
      glassmorphism: true
    };
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance', JSON.stringify(settings));
    
    // Apply to DOM
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    
    const scale = settings.fontSize === 'sm' ? '0.85' : settings.fontSize === 'lg' ? '1.15' : settings.fontSize === 'xl' ? '1.3' : '1';
    root.style.setProperty('--text-scale', scale);
    
    const radiusMap = {
      'none': '0rem',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '1rem',
      'xl': '1.5rem',
      'full': '9999px'
    };
    root.style.setProperty('--radius-main', radiusMap[settings.borderRadius]);
    
    root.setAttribute('data-contrast', settings.contrast);
    root.setAttribute('data-animations', settings.animationsEnabled.toString());
    root.setAttribute('data-glass', settings.glassmorphism.toString());
  }, [settings]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#6366f1',
      fontFamily: '"Plus Jakarta Sans"',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable',
      borderRadius: 'lg',
      animationsEnabled: true,
      glassmorphism: true
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-indigo-600 rounded-[var(--radius-main)] shadow-2xl shadow-indigo-600/20 text-white">
              <Command size={32} />
           </div>
           <div>
              <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
                Interface
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Central Appearance Control Protocol</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Primary Color Palette */}
        <div className="lg:col-span-2 space-y-10">
           <section className="glass-card p-10 space-y-10 border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Signal Frequency</h3>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Primary Accent</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                {COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSettings({ ...settings, primaryColor: color.hex })}
                    className={`group relative h-16 rounded-2xl flex items-center justify-center transition-all ${settings.primaryColor === color.hex ? 'ring-4 ring-indigo-500/20 scale-90' : 'hover:scale-105 active:scale-95'}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {settings.primaryColor === color.hex && <Check className="text-white" size={24} />}
                    <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{color.name}</span>
                  </button>
                ))}
              </div>
           </section>

           {/* Typography Matrix */}
           <section className="glass-card p-10 space-y-10 border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight">Textual Logic</h3>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">System Font</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FONTS.map(font => (
                  <button
                    key={font.name}
                    onClick={() => setSettings({ ...settings, fontFamily: font.value })}
                    className={`w-full p-5 rounded-2xl text-left border flex items-center justify-between transition-all ${settings.fontFamily === font.value ? 'bg-indigo-600/10 border-indigo-600 text-indigo-600' : 'bg-[var(--bg-secondary)] border-transparent text-slate-500 hover:border-indigo-600/30'}`}
                    style={{ fontFamily: font.value }}
                  >
                    <span className="text-sm font-black uppercase tracking-tight">{font.name}</span>
                    {settings.fontFamily === font.value && <div className="p-1 bg-indigo-600 rounded-full text-white"><Check size={12} /></div>}
                  </button>
                ))}
              </div>
           </section>
        </div>

        {/* Right Controls */}
        <div className="space-y-10">
           {/* Visual Scale */}
           <section className="glass-card p-10 space-y-8 border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <Maximize2 className="text-indigo-600" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Scaling</h3>
              </div>
              <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl gap-1">
                {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSettings({ ...settings, fontSize: size })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.fontSize === size ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-600'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
           </section>

           {/* Border Radius Control */}
           <section className="glass-card p-10 space-y-8 border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <Box className="text-indigo-600" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Corner Geometry</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map(radius => (
                  <button
                    key={radius}
                    onClick={() => setSettings({ ...settings, borderRadius: radius })}
                    className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${settings.borderRadius === radius ? 'bg-indigo-600 border-transparent text-white shadow-lg' : 'bg-[var(--bg-secondary)] border-transparent text-slate-500'}`}
                  >
                    {radius}
                  </button>
                ))}
              </div>
           </section>

           {/* Interaction Toggles */}
           <section className="glass-card p-10 space-y-8 border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <Zap className="text-indigo-600" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Behavioral Logic</h3>
              </div>
              <div className="space-y-4">
                 <button 
                   onClick={() => setSettings({...settings, animationsEnabled: !settings.animationsEnabled})}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${settings.animationsEnabled ? 'bg-indigo-600/10 text-indigo-600' : 'bg-[var(--bg-secondary)] text-slate-500'}`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Fluid Transitions</span>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${settings.animationsEnabled ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.animationsEnabled ? 'right-1' : 'left-1'}`} />
                    </div>
                 </button>

                 <button 
                   onClick={() => setSettings({...settings, glassmorphism: !settings.glassmorphism})}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${settings.glassmorphism ? 'bg-indigo-600/10 text-indigo-600' : 'bg-[var(--bg-secondary)] text-slate-500'}`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Reflective Layers</span>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${settings.glassmorphism ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.glassmorphism ? 'right-1' : 'left-1'}`} />
                    </div>
                 </button>

                 <button 
                   onClick={() => setSettings({...settings, contrast: settings.contrast === 'high' ? 'normal' : 'high'})}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${settings.contrast === 'high' ? 'bg-indigo-600/10 text-indigo-600' : 'bg-[var(--bg-secondary)] text-slate-500'}`}
                 >
                    <span className="text-[10px] font-black uppercase tracking-widest">Visual Sharpness</span>
                    <Contrast size={18} />
                 </button>
              </div>
           </section>
        </div>
      </div>

      {/* Footer / Reset Action */}
      <div className="pt-16 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6 text-slate-500 max-w-xl">
          <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl">
             <ShieldAlert size={28} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
            Interface modifications are cached within the local node environment. Universal protocol defaults remain active for other network participants.
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleReset}
             className="px-12 py-6 bg-[var(--bg-secondary)] text-slate-500 rounded-[var(--radius-main)] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-95 border border-transparent hover:border-rose-500/30"
           >
             <RefreshCcw size={18} /> Factory Reset
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
