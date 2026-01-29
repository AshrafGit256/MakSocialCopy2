
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
      borderRadius: '6px',
      themePreset: 'tactical',
      backgroundPattern: 'none'
    };
  });

  const [fontSizeNumeric, setFontSizeNumeric] = useState(14);

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v3', JSON.stringify(settings));
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);
    root.style.setProperty('--base-font-size', `${fontSizeNumeric}px`);
  }, [settings, fontSizeNumeric]);

  const handleReset = () => {
    setSettings({
      primaryColor: '#64748b',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      borderRadius: '6px',
      themePreset: 'tactical',
      backgroundPattern: 'none'
    });
    setFontSizeNumeric(14);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-40 text-[var(--text-primary)] font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-sm text-white shadow-xl">
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
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
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
                        className={`p-6 rounded-sm border text-left transition-all ${settings.themePreset === p.id ? 'bg-indigo-600 border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-indigo-600'}`}
                      >
                         <div className="mb-4">{p.icon}</div>
                         <p className="text-[10px] font-black uppercase tracking-widest">{p.label}</p>
                      </button>
                   ))}
                </div>
              </div>
            </div>
          )}
          {/* ... Rest of Settings logic */}
        </main>
      </div>
    </div>
  );
};

export default Settings;
