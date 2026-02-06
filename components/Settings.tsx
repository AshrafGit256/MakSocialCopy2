
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Palette, Box, Zap, 
  RefreshCcw, ShieldCheck, 
  Activity, Laptop, FileText, Ghost,
  Settings as SettingsIcon,
  Circle,
  Hash,
  ChevronRight,
  Monitor,
  Lock
} from 'lucide-react';

const COLORS = [
  { name: 'Tactical Gray', hex: '#475569' },
  { name: 'Deep Indigo', hex: '#4f46e5' },
  { name: 'Ki Teal', hex: '#10918a' },
  { name: 'Bronze Wood', hex: '#a87532' },
  { name: 'Cyber Sky', hex: '#0ea5e9' },
  { name: 'Toxic Emerald', hex: '#10b981' },
  { name: 'Pulse Rose', hex: '#f43f5e' },
  { name: 'Amber Warning', hex: '#f59e0b' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'geometry' | 'behavior' | 'system'>('visuals');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('maksocial_appearance_v3');
    if (saved) return JSON.parse(saved);
    
    // Site default: Paper (Light)
    return {
      primaryColor: '#10918a',
      fontFamily: 'Chirp, sans-serif',
      fontSize: 'md',
      borderRadius: '2px',
      themePreset: 'paper',
      backgroundPattern: 'none'
    };
  });

  useEffect(() => {
    localStorage.setItem('maksocial_appearance_v3', JSON.stringify(settings));
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor);
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);

    if (settings.themePreset === 'oled') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--border-color', '#111111');
      document.documentElement.classList.add('dark');
    } else if (settings.themePreset === 'paper') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--border-color', '#e2e8f0');
      document.documentElement.classList.remove('dark');
    } else if (settings.themePreset === 'tactical') {
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#1e1e2d');
      root.style.setProperty('--text-primary', '#c9d1d9');
      root.style.setProperty('--border-color', '#2a2a3a');
      document.documentElement.classList.add('dark');
    } else {
      root.style.setProperty('--bg-primary', '#111827');
      root.style.setProperty('--bg-secondary', '#1f2937');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--border-color', '#374151');
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  // handleReset disabled for locked state
  const handleReset = () => {
    console.warn("UNAUTHORIZED: Reset Protocol Terminated.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-40 text-[var(--text-primary)] font-sans animate-in fade-in duration-500 relative">
      
      {/* LOCKED OVERLAY - Pointer events enabled to capture all clicks and block interaction */}
      <div className="absolute inset-0 z-50 bg-[var(--bg-primary)]/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto cursor-not-allowed">
         <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center animate-in zoom-in-95 pointer-events-auto">
            <div className="p-5 bg-rose-500 rounded-full text-white shadow-xl shadow-rose-500/20">
               <Lock size={40} />
            </div>
            <div className="space-y-2">
               <h2 className="text-xl font-black uppercase tracking-tighter">UNAUTHORIZED_ACCESS</h2>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                 "UI configuration parameters have been locked by the Central Registry Administration to maintain system visual integrity."
               </p>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 opacity-50 grayscale">
        <div className="flex items-center gap-4">
          <div className="p-3 md:p-4 bg-slate-400 rounded-[var(--radius-main)] text-white shadow-xl">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">OS_Config</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Personalize node environment parameters</p>
          </div>
        </div>
        <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-400 rounded-sm text-[9px] font-black uppercase tracking-widest cursor-not-allowed">
          <RefreshCcw size={14} /> Revert_to_System_Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 opacity-40 grayscale pointer-events-none">
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'visuals', label: 'Visuals', icon: <Palette size={18}/> },
            { id: 'geometry', label: 'Geometry', icon: <Box size={18}/> },
            { id: 'behavior', label: 'Behavior', icon: <Activity size={18}/> },
            { id: 'system', label: 'Security', icon: <ShieldCheck size={18}/> }
          ].map(tab => (
            <button
              key={tab.id}
              disabled
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-main)] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-500 text-white shadow-lg' : 'text-slate-500'}`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-12">
          {activeTab === 'visuals' && (
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                   <Monitor size={18} className="text-slate-400" />
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Environment_Presets</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { id: 'tactical', label: 'Tactical (Dark)', icon: <Laptop size={16}/>, desc: 'High-contrast dark mode' },
                     { id: 'paper', label: 'Paper (Light)', icon: <FileText size={16}/>, desc: 'Clean academic light mode' },
                     { id: 'oled', label: 'Deep OLED', icon: <Ghost size={16}/>, desc: 'Pure black energy saver' },
                     { id: 'standard', label: 'Midnight', icon: <Activity size={16}/>, desc: 'Deep blue night mode' }
                   ].map(p => (
                      <button 
                        key={p.id}
                        disabled
                        className={`p-6 rounded-[var(--radius-main)] border text-left transition-all group ${settings.themePreset === p.id ? 'bg-slate-500 border-transparent text-white shadow-xl ring-4 ring-[var(--brand-color)]/10' : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}
                      >
                         <div className={`mb-4 p-2 w-fit rounded-lg ${settings.themePreset === p.id ? 'bg-white/10' : 'bg-[var(--bg-primary)]'}`}>{p.icon}</div>
                         <p className="text-[11px] font-black uppercase tracking-widest">{p.label}</p>
                         <p className={`text-[9px] mt-1 font-bold ${settings.themePreset === p.id ? 'text-white/60' : 'text-slate-400'} uppercase`}>{p.desc}</p>
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                   <Palette size={18} className="text-slate-400" />
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Accent_Uplink_Matrix</label>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  {COLORS.map(c => (
                    <button 
                      key={c.hex}
                      disabled
                      className={`w-14 h-14 rounded-full border-4 transition-all relative ${settings.primaryColor === c.hex ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="mt-20 p-8 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)] flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
         <div className="flex items-center gap-6">
            <div className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
               <ShieldCheck size={24} className="text-slate-400" />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest">Client_Storage_Sync</p>
               <p className="text-[11px] font-medium text-slate-500 max-w-lg leading-relaxed">
                 "UI Config parameters are stored within your local node registry (localStorage). Currently under administrative lock."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
