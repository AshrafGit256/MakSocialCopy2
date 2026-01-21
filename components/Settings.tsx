
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Type, Maximize2, ShieldAlert, 
  Check, RefreshCcw, Layout, Sun, Moon,
  Contrast, AlignLeft, Sliders
} from 'lucide-react';

const COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Violet', hex: '#8b5cf6' }
];

const FONTS = [
  { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans"' },
  { name: 'Inter UI', value: '"Inter"' },
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
      density: 'comfortable'
    };
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance', JSON.stringify(settings));
    
    // Apply to DOM
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    
    const scale = settings.fontSize === 'sm' ? '0.9' : settings.fontSize === 'lg' ? '1.1' : '1';
    root.style.setProperty('--text-scale', scale);
    
    root.setAttribute('data-contrast', settings.contrast);
  }, [settings]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#6366f1',
      fontFamily: '"Plus Jakarta Sans"',
      fontSize: 'md',
      contrast: 'normal',
      density: 'comfortable'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <header className="space-y-4">
        <h1 className="text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
          Interface
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Universal UI Customization Protocol</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colors */}
        <section className="glass-card p-8 rounded-[2rem] bg-[var(--card-bg)] space-y-8 border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Palette className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Primary Signal</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {COLORS.map(color => (
              <button
                key={color.name}
                onClick={() => setSettings({ ...settings, primaryColor: color.hex })}
                className={`group relative h-16 rounded-2xl flex items-center justify-center transition-all ${settings.primaryColor === color.hex ? 'ring-4 ring-indigo-500/20 scale-95' : 'hover:scale-105'}`}
                style={{ backgroundColor: color.hex }}
              >
                {settings.primaryColor === color.hex && <Check className="text-white" size={24} />}
                <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600">{color.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="glass-card p-8 rounded-[2rem] bg-[var(--card-bg)] space-y-8 border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Type className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Typography Matrix</h3>
          </div>
          <div className="space-y-3">
            {FONTS.map(font => (
              <button
                key={font.name}
                onClick={() => setSettings({ ...settings, fontFamily: font.value })}
                className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${settings.fontFamily === font.value ? 'bg-indigo-600/5 border-indigo-600 text-indigo-600' : 'bg-[var(--bg-secondary)] border-transparent text-slate-500 hover:border-[var(--border-color)]'}`}
                style={{ fontFamily: font.value }}
              >
                <span className="text-sm font-bold">{font.name}</span>
                {settings.fontFamily === font.value && <Check size={18} />}
              </button>
            ))}
          </div>
        </section>

        {/* Text Scaling */}
        <section className="glass-card p-8 rounded-[2rem] bg-[var(--card-bg)] space-y-8 border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Maximize2 className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Signal Scaling</h3>
          </div>
          <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl gap-2">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <button
                key={size}
                onClick={() => setSettings({ ...settings, fontSize: size })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.fontSize === size ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                {size === 'sm' ? 'Compact' : size === 'md' ? 'Default' : 'Expanded'}
              </button>
            ))}
          </div>
        </section>

        {/* Contrast */}
        <section className="glass-card p-8 rounded-[2rem] bg-[var(--card-bg)] space-y-8 border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Contrast className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black uppercase tracking-tight">Accessibility</h3>
          </div>
          <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl gap-2">
            {(['normal', 'high'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setSettings({ ...settings, contrast: mode })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.contrast === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                {mode === 'normal' ? 'Standard' : 'High Contrast'}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <ShieldAlert size={20} />
          <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed max-w-sm">
            Appearance changes are localized to your session cache. System-wide protocol defaults remain unaffected.
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="px-10 py-5 bg-[var(--bg-secondary)] text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-95"
        >
          <RefreshCcw size={18} /> Revert Protocol
        </button>
      </div>
    </div>
  );
};

export default Settings;
