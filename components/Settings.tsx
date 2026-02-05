
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
  Monitor
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
    
    // Default to system preference if no saved settings
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      primaryColor: '#475569',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      borderRadius: '2px',
      themePreset: prefersDark ? 'tactical' : 'paper',
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
      root.style.setProperty('--text-primary', '#1e293b');
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

  const handleReset = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSettings({
      primaryColor: '#475569',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 'md',
      borderRadius: '2px',
      themePreset: prefersDark ? 'tactical' : 'paper',
      backgroundPattern: 'none'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-40 text-[var(--text-primary)] font-mono animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 md:p-4 bg-[var(--brand-color)] rounded-[var(--radius-main)] text-white shadow-xl shadow-[var(--brand-color)]/20">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">OS_Config</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Personalize node environment parameters</p>
          </div>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-500 rounded-sm text-[9px] font-black uppercase tracking-widest hover:text-rose-500 transition-all active:scale-95 shadow-sm">
          <RefreshCcw size={14} /> Revert_to_System_Defaults
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
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-main)] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 space-y-12">
          {activeTab === 'visuals' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                   <Monitor size={18} className="text-[var(--brand-color)]" />
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
                        onClick={() => setSettings({...settings, themePreset: p.id as any})}
                        className={`p-6 rounded-[var(--radius-main)] border text-left transition-all group ${settings.themePreset === p.id ? 'bg-[var(--brand-color)] border-transparent text-white shadow-xl ring-4 ring-[var(--brand-color)]/10' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--brand-color)]'}`}
                      >
                         <div className={`mb-4 p-2 w-fit rounded-lg ${settings.themePreset === p.id ? 'bg-white/10' : 'bg-[var(--bg-primary)]'} transition-colors`}>{p.icon}</div>
                         <p className="text-[11px] font-black uppercase tracking-widest">{p.label}</p>
                         <p className={`text-[9px] mt-1 font-bold ${settings.themePreset === p.id ? 'text-white/60' : 'text-slate-400'} uppercase`}>{p.desc}</p>
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                   <Palette size={18} className="text-[var(--brand-color)]" />
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Accent_Uplink_Matrix</label>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  {COLORS.map(c => (
                    <button 
                      key={c.hex}
                      onClick={() => setSettings({...settings, primaryColor: c.hex})}
                      className={`w-14 h-14 rounded-full border-4 transition-all relative shadow-sm ${settings.primaryColor === c.hex ? 'border-[var(--text-primary)] scale-110 shadow-xl' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                       {settings.primaryColor === c.hex && <div className="absolute inset-0 flex items-center justify-center text-white"><Circle size={14} fill="white"/></div>}
                    </button>
                  ))}
                  <div className="flex items-center gap-3 px-5 py-3 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)] shadow-inner">
                    <Hash size={16} className="text-slate-500"/>
                    <input 
                      type="text" 
                      value={settings.primaryColor} 
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="bg-transparent border-none outline-none text-[12px] font-black uppercase w-20 text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geometry' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-right-2">
                <div className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                      <Box size={18} className="text-[var(--brand-color)]" />
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Border_Radius_Protocol</label>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['0px', '2px', '8px', '16px'].map(r => (
                         <button 
                           key={r}
                           onClick={() => setSettings({...settings, borderRadius: r})}
                           className={`p-6 border transition-all text-center ${settings.borderRadius === r ? 'bg-[var(--brand-color)] border-transparent text-white shadow-xl' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--brand-color)]'}`}
                           style={{ borderRadius: r }}
                         >
                            <span className="text-[11px] font-black uppercase tracking-widest">{r === '0px' ? 'Tactical (0)' : r === '2px' ? 'Standard (2)' : r === '8px' ? 'Modern (8)' : 'Soft (16)'}</span>
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </main>
      </div>

      <div className="mt-20 p-8 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-[var(--radius-main)] flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
         <div className="flex items-center gap-6">
            <div className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--border-color)]">
               <ShieldCheck size={24} className="text-[var(--brand-color)]" />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest">Client_Storage_Sync</p>
               <p className="text-[11px] font-medium text-slate-500 max-w-lg leading-relaxed">
                 "UI Config parameters are stored within your local node registry (localStorage). These settings are synchronized across your specific terminal instance."
               </p>
            </div>
         </div>
         <button className="px-6 py-2 border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest hover:text-[var(--brand-color)] transition-all">Audit_Registry</button>
      </div>
    </div>
  );
};

export default Settings;
