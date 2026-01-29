
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Box, Zap, 
  RefreshCcw, ShieldCheck, 
  Activity, Laptop, FileText, Ghost,
  Settings as SettingsIcon,
  Circle,
  Hash
} from 'lucide-react';

const COLORS = [
  { name: 'Tactical Gray', hex: '#475569' },
  { name: 'Deep Indigo', hex: '#4f46e5' },
  { name: 'Ki Teal', hex: '#10918a' },
  { name: 'Cyber Sky', hex: '#0ea5e9' },
  { name: 'Toxic Emerald', hex: '#10b981' },
  { name: 'Pulse Rose', hex: '#f43f5e' },
  { name: 'Amber Warning', hex: '#f59e0b' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'geometry' | 'behavior' | 'system'>('visuals');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('maksocial_appearance_v3');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#10918a',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      borderRadius: '6px',
      themePreset: 'tactical',
      backgroundPattern: 'none'
    };
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v3', JSON.stringify(settings));
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);

    // Apply Preset Specific variables
    if (settings.themePreset === 'oled') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--bg-sidebar', '#050505');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--border-color', '#111111');
      document.documentElement.classList.add('dark');
    } else if (settings.themePreset === 'paper') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-sidebar', '#f1f5f9');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--border-color', '#e2e8f0');
      document.documentElement.classList.remove('dark');
    } else if (settings.themePreset === 'tactical') {
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#1e1e2d');
      root.style.setProperty('--bg-sidebar', '#1e1e2d');
      root.style.setProperty('--text-primary', '#c9d1d9');
      root.style.setProperty('--border-color', '#2a2a3a');
      document.documentElement.classList.add('dark');
    } else {
      // standard
      root.style.setProperty('--bg-primary', '#111827');
      root.style.setProperty('--bg-secondary', '#1f2937');
      root.style.setProperty('--bg-sidebar', '#1f2937');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--border-color', '#374151');
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#10918a',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      borderRadius: '6px',
      themePreset: 'tactical',
      backgroundPattern: 'none'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-40 text-[var(--text-primary)] font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[var(--brand-color)] rounded-xl text-white shadow-xl">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">OS_Config</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">personalize your node parameters</p>
          </div>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 px-6 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-sm text-[9px] font-black uppercase tracking-widest hover:text-rose-500 transition-all">
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
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-10">
          {activeTab === 'visuals' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-2">
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">Environment_Strata</label>
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
                        className={`p-6 rounded-xl border text-left transition-all ${settings.themePreset === p.id ? 'bg-[var(--brand-color)] border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--brand-color)]'}`}
                      >
                         <div className="mb-4">{p.icon}</div>
                         <p className="text-[10px] font-black uppercase tracking-widest">{p.label}</p>
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">Accent_Matrix</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(c => (
                    <button 
                      key={c.hex}
                      onClick={() => setSettings({...settings, primaryColor: c.hex})}
                      className={`w-12 h-12 rounded-full border-4 transition-all relative ${settings.primaryColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                       {settings.primaryColor === c.hex && <div className="absolute inset-0 flex items-center justify-center text-white"><Circle size={12} fill="white"/></div>}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)]">
                    <Hash size={14} className="text-slate-500"/>
                    <input 
                      type="text" 
                      value={settings.primaryColor} 
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="bg-transparent border-none outline-none text-[10px] font-bold uppercase w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)] flex items-center justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic">Live_Preview</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interface synchronization check</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded bg-[var(--brand-color)] shadow-lg"></div>
                   <div className="w-8 h-8 rounded border border-[var(--border-color)]"></div>
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
