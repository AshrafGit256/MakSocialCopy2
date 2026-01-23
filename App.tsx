
import React, { useState, useEffect } from 'react';
import { AppView, User, College, UserStatus, AppSettings } from './types';
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
import { db } from './db';
import { Menu, Home, Search as SearchIcon, Calendar, MessageCircle, User as UserIcon, Bell, Settings, Lock, Zap, ArrowLeft, Sun, Moon, Globe, ChevronDown, LayoutGrid, GitPullRequest } from 'lucide-react';

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

  useEffect(() => {
    if (isLoggedIn) setCurrentUser(db.getUser());
    const applySettings = () => {
      const saved = localStorage.getItem('maksocial_appearance_v2');
      if (saved) {
        const s: AppSettings = JSON.parse(saved);
        const root = document.documentElement;
        root.style.setProperty('--brand-color', s.primaryColor);
        root.style.setProperty('--font-main', s.fontFamily);
        root.setAttribute('data-animations', s.animationsEnabled.toString());
        root.setAttribute('data-glow', s.glowEffects?.toString() || 'true');
        root.setAttribute('data-grid', s.showGrid?.toString() || 'true');
        if (s.themePreset === 'oled') {
          root.classList.add('dark');
          root.style.setProperty('--bg-primary', '#000000');
        } else if (s.themePreset === 'paper') {
          root.classList.remove('dark');
        }
      }
    };
    applySettings();
    window.addEventListener('storage', applySettings);
    return () => window.removeEventListener('storage', applySettings);
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
    const newUser: User = { id: Date.now().toString(), name: email.split('@')[0], role: 'University Student', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, connections: 0, email, college, status, subscriptionTier: 'Free', joinedColleges: [college], postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0, badges: [], appliedTo: [] };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleSetView = (newView: AppView) => {
    if (userRole === 'admin' && newView !== 'admin') return;
    if (newView === 'resources' && currentUser?.subscriptionTier === 'Free') {
       alert("PROTOCOL LOCKED: Access to the Academic Vault requires a PRO subscription strata.");
       return;
    }
    setView(newView); setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoggedIn && userRole === 'admin') return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed collegeFilter={activeSector} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'opportunities': return <Opportunities />;
      case 'messages': return <Chat />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} />;
      case 'forge': return <Forge onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} onNavigateToPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      case 'resources': return <Resources />;
      case 'settings': return <SettingsView />;
      case 'admin': return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
      default: return <Feed collegeFilter={activeSector} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] lg:hidden animate-in fade-in" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar activeView={view} setView={handleSetView} isAdmin={userRole === 'admin'} onLogout={() => {setIsLoggedIn(false); setView('landing');}} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="sticky top-0 z-[80] bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors lg:hidden"><Menu size={22} /></button>
            <div className="relative">
              <button onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)} className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-indigo-600/10 border border-[var(--border-color)] rounded-xl transition-all group max-w-[180px] sm:max-w-none">
                <div className="shrink-0 text-indigo-600">{activeSector === 'Global' ? <Globe size={16} /> : <LayoutGrid size={16} />}</div>
                <div className="flex flex-col text-left overflow-hidden"><span className="text-[10px] font-black uppercase tracking-tighter text-indigo-600 truncate">{activeSector} HUB</span></div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSectorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[450]" onClick={() => setIsSectorDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[500] p-3 animate-in slide-in-from-top-2">
                    <button onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${activeSector === 'Global' ? 'bg-indigo-600 text-white' : 'hover:bg-[var(--bg-secondary)] text-slate-500'}`}><Globe size={14} /> <span className="text-[10px] font-black uppercase">Global Pulse</span></button>
                    <div className="grid grid-cols-2 gap-1.5">{['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (<button key={c} onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }} className={`flex items-center justify-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-indigo-600 text-white' : 'hover:bg-[var(--bg-secondary)] text-slate-500'}`}>{c}</button>))}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:text-indigo-600">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => handleSetView('opportunities')} className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-full transition-all"><Zap size={20} fill="currentColor"/></button>
            {currentUser && <button onClick={() => handleSetView('profile')} className="ml-1 active:scale-90 transition-transform"><img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-white object-cover" alt="Profile" /></button>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-safe">{renderContent()}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-[85] bg-[var(--sidebar-bg)]/95 backdrop-blur-xl border-t border-[var(--border-color)] flex items-center justify-between px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
          {[
            { id: 'home', icon: <Home size={22} />, label: 'Feed' },
            { id: 'opportunities', icon: <Zap size={22} />, label: 'Bids' },
            { id: 'calendar', icon: <Calendar size={22} />, label: 'Events' },
            { id: 'messages', icon: <MessageCircle size={22} />, label: 'Chats' },
            { id: 'settings', icon: <Settings size={22} />, label: 'UI' },
          ].map((item) => (
            <button key={item.id} onClick={() => handleSetView(item.id as AppView)} className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all ${view === item.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              {item.id === 'opportunities' ? <Zap size={22} className="text-amber-500" fill={view === 'opportunities' ? "currentColor" : "none"} /> : item.icon}
              <span className={`text-[9px] font-black uppercase ${view === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
