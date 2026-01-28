
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView, User, College, UserStatus, AppSettings, Notification } from './types';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Forge from './components/Forge';
import CalendarView from './components/Calendar';
import Search from './components/Search';
import Resources from './components/Resources';
import SettingsView from './components/Settings';
import Opportunities from './components/Opportunities';
import NotificationsView from './components/Notifications';
import Market from './components/Market';
import Groups from './components/Groups';
import { db } from './db';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Menu, Home, Search as SearchIcon, Calendar, MessageCircle, 
  User as UserIcon, Bell, Settings, Lock, Zap, ArrowLeft, 
  Sun, Moon, Globe, ChevronDown, LayoutGrid, XCircle, X, 
  ShoppingBag, Users, Command, ArrowRight, Mic, Cpu, Radio,
  Activity, Sparkles, BookOpen
} from 'lucide-react';

const CommandPalette: React.FC<{ isOpen: boolean, onClose: () => void, onNavigate: (view: AppView) => void }> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isNeuralProcessing, setIsNeuralProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const commands: { label: string, view: AppView, icon: any }[] = [
    { label: 'Pulse Feed', view: 'home', icon: <Home size={16}/> },
    { label: 'The Vault', view: 'resources', icon: <BookOpen size={16}/> },
    { label: 'Groups Hub', view: 'groups', icon: <Users size={16}/> },
    { label: 'Marketplace', view: 'market', icon: <ShoppingBag size={16}/> },
    { label: 'The Forge', view: 'forge', icon: <Zap size={16}/> },
    { label: 'Registry Search', view: 'search', icon: <SearchIcon size={16}/> },
    { label: 'Notifications', view: 'notifications', icon: <Bell size={16}/> },
    { label: 'My Profile', view: 'profile', icon: <UserIcon size={16}/> }
  ];

  const handleNeuralQuery = async () => {
    if (query.length < 5) return;
    setIsNeuralProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User is searching a university social network with these views: ${commands.map(c => c.label).join(', ')}. 
        Based on user query: "${query}", suggest the single best view ID to navigate to. 
        Only return the ID from this list: home, resources, groups, market, forge, search, notifications, profile. 
        If it's a specific question, answer it concisely (max 15 words) then suggest a view.`
      });
      setAiSuggestions(response.text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsNeuralProcessing(false);
    }
  };

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-start justify-center p-6 sm:p-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
       <div className="bg-[#0b0f1a] w-full max-w-2xl rounded-nexus border border-[#1e293b] shadow-2xl shadow-black overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-[#1e293b] flex items-center gap-4 bg-[#020617]">
             <Command size={20} className="text-indigo-500" />
             <input 
               autoFocus
               placeholder="Neural Command: Type to navigate or query the Registry..." 
               className="bg-transparent border-none outline-none text-sm font-bold text-white flex-1 placeholder:text-slate-600"
               value={query}
               onChange={e => setQuery(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleNeuralQuery()}
             />
             <div className="flex items-center gap-2">
                {isNeuralProcessing && <Cpu size={16} className="text-indigo-500 animate-spin" />}
                <div className="px-2 py-1 bg-[#1e293b] rounded text-[9px] font-black text-slate-500 uppercase tracking-widest border border-[#30363d]">ENTER_QUERY</div>
             </div>
          </div>
          
          <div className="max-h-[450px] overflow-y-auto p-4 no-scrollbar">
             {aiSuggestions && (
               <div className="mb-6 p-4 bg-indigo-600/10 border border-indigo-600/30 rounded-nexus animate-in slide-in-from-top-1">
                  <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                     <Sparkles size={12}/> Neural_Insight
                  </div>
                  <p className="text-xs text-slate-300 font-medium italic">"{aiSuggestions}"</p>
               </div>
             )}

             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 ml-2">Registry_Navigation_Protocol</p>
                {filtered.map(cmd => (
                  <button 
                    key={cmd.view} 
                    onClick={() => { onNavigate(cmd.view); onClose(); }}
                    className="w-full flex items-center justify-between p-4 rounded-nexus hover:bg-indigo-600/20 transition-all group text-left border border-transparent hover:border-indigo-600/30"
                  >
                     <div className="flex items-center gap-4 text-slate-300 group-hover:text-white transition-colors">
                        <div className="p-2 bg-[#1e293b] rounded-nexus group-hover:bg-indigo-600/40">{cmd.icon}</div>
                        <span className="text-xs font-black uppercase tracking-widest">{cmd.label}</span>
                     </div>
                     <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
             </div>
          </div>
          <div className="p-4 bg-[#020617] border-t border-[#1e293b] flex items-center justify-between">
             <div className="flex items-center gap-6 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                <span className="flex items-center gap-1.5"><ArrowRight size={10}/> Select_Node</span>
                <span className="flex items-center gap-1.5"><Activity size={10}/> Registry_v4.2.0</span>
             </div>
             <span className="text-[8px] font-mono text-slate-700">AES-256_ENCRYPTED_HANDSHAKE</span>
          </div>
       </div>
       <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

const NexusVoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'REPLYING'>('IDLE');
  
  const toggleNexus = () => {
    setIsActive(!isActive);
    setStatus(isActive ? 'IDLE' : 'LISTENING');
    // Implementation of Gemini Live API handshake would go here
    // Guideline: const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // const sessionPromise = ai.live.connect({ model: 'gemini-2.5-flash-native-audio-preview-12-2025', ... });
  };

  return (
    <button 
      onClick={toggleNexus}
      className={`fixed bottom-24 right-8 z-[1000] p-5 rounded-full shadow-2xl transition-all active:scale-95 group border-2 ${
        isActive 
        ? 'bg-rose-600 border-rose-400 animate-pulse text-white' 
        : 'bg-indigo-600 border-indigo-400 text-white'
      }`}
    >
      <div className="relative">
         {isActive ? <Radio size={28} /> : <Mic size={28} />}
         {isActive && (
           <div className="absolute -top-12 right-0 bg-black/80 backdrop-blur-md px-4 py-2 rounded-nexus border border-rose-500/50 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
              {status}_STRATA_ACTIVE
           </div>
         )}
      </div>
      <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
    </button>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setuserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [activeSector, setActiveSector] = useState<College | 'Global'>('Global');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [prefilledSearchQuery, setPrefilledSearchQuery] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
      setNotifications(db.getNotifications());
    }
  }, [isLoggedIn, view]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogin = (email: string) => {
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setuserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
    const user = db.getUser();
    db.saveUser({ ...user, email });
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    setIsLoggedIn(true); setuserRole('student'); setView('home');
    const newUser: User = { id: Date.now().toString(), name: email.split('@')[0], role: 'University Student', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, connections: 0, email, college, status, subscriptionTier: 'Free', verified: false, badges: [] };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleSetView = (newView: AppView) => {
    if (userRole === 'admin' && newView !== 'admin') return;
    if (newView !== 'messages') setActiveChatUserId(null);
    if (newView !== 'search') setPrefilledSearchQuery(null);
    setView(newView); setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHashtagClick = (tag: string) => {
    setPrefilledSearchQuery(tag);
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  if (isLoggedIn && userRole === 'admin') {
    return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed collegeFilter={activeSector} triggerSafetyError={() => {}} onHashtagClick={handleHashtagClick} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} triggerSafetyError={() => {}} onHashtagClick={handleHashtagClick} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'opportunities': return <Opportunities />;
      case 'notifications': return <NotificationsView />;
      case 'messages': return <Chat initialTargetUserId={activeChatUserId || undefined} />;
      case 'groups': return <Groups />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} onMessageUser={(id) => { setActiveChatUserId(id); setView('messages'); }} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search initialQuery={prefilledSearchQuery || undefined} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} onNavigateToPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      case 'resources': return <Resources />;
      case 'market': return <Market />;
      case 'forge': return <Forge onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'settings': return <SettingsView />;
      case 'admin': return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
      default: return <Feed collegeFilter={activeSector} triggerSafetyError={() => {}} onHashtagClick={handleHashtagClick} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onNavigate={handleSetView} />
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] lg:hidden animate-in fade-in" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar activeView={view} setView={handleSetView} isAdmin={userRole === 'admin'} onLogout={() => {setIsLoggedIn(false); setView('landing');}} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} unreadNotifications={unreadNotifs} />
      
      {isLoggedIn && <NexusVoiceAssistant />}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="sticky top-0 z-[80] bg-[var(--bg-primary)]/80 backdrop-blur-2xl border-b border-[var(--border-color)] px-4 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full lg:hidden"><Menu size={22} /></button>
            <div className="relative">
              <button onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)} className="flex items-center gap-3 px-4 py-2 bg-indigo-600/5 hover:bg-indigo-600/10 border border-indigo-600/20 rounded-nexus transition-all group">
                <Globe size={16} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 truncate">{activeSector} WING</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSectorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[450]" onClick={() => setIsSectorDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#0b0f1a] border border-[#1e293b] rounded-nexus shadow-2xl z-[500] p-4 animate-in slide-in-from-top-2">
                    <button onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-nexus transition-all mb-3 ${activeSector === 'Global' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600/10 text-slate-500'}`}>
                       <Globe size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Universal Registry</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">{['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (<button key={c} onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }} className={`flex items-center justify-center py-3 rounded-nexus text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#1e293b] text-slate-400 hover:text-white'}`}>{c}</button>))}</div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setIsCommandPaletteOpen(true)} className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-[#0b0f1a] border border-[#1e293b] rounded-nexus text-[10px] font-black uppercase text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all shadow-inner">
               <Command size={14}/> NEURAL_UPLINK <span className="px-1.5 py-0.5 bg-[#1e293b] rounded text-[8px] border border-[#30363d]">⌘K</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-indigo-500 transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => handleSetView('notifications')} className="p-2 text-slate-500 hover:text-indigo-500 relative transition-colors">
               <Bell size={20} />
               {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-[#020617] shadow-[0_0_8px_#e11d48]"></span>}
            </button>
            {currentUser && <button onClick={() => handleSetView('profile')} className="ml-2 active:scale-90 transition-transform"><img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-600/30 bg-white object-cover shadow-2xl hover:border-indigo-500" alt="Profile" /></button>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto relative no-scrollbar pb-safe">{renderContent()}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-[85] bg-[#020617]/90 backdrop-blur-3xl border-t border-[#1e293b] flex items-center justify-between px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden shadow-[0_-15px_40px_-5px_rgba(0,0,0,0.5)]">
          {[
            { id: 'home', icon: <Home size={24} />, label: 'Registry' },
            { id: 'groups', icon: <Users size={24} />, label: 'Clusters' },
            { id: 'market', icon: <ShoppingBag size={24} />, label: 'Bazaar' },
            { id: 'calendar', icon: <Calendar size={24} />, label: 'Log' },
            { id: 'notifications', icon: <Bell size={24} />, label: 'Signals' },
          ].map((item) => (
            <button key={item.id} onClick={() => handleSetView(item.id as AppView)} className={`flex-1 flex flex-col items-center gap-2 py-1 transition-all ${view === item.id ? 'text-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>
              <div className={`relative transition-transform duration-300 ${view === item.id ? 'scale-110 -translate-y-1' : ''}`}>{item.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${view === item.id ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
              {view === item.id && <div className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
