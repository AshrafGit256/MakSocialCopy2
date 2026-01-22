
import React, { useState, useEffect } from 'react';
import { AppView, User, College, UserStatus } from './types';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Explore from './components/Explore';
import CalendarView from './components/Calendar';
import Search from './components/Search';
import Resources from './components/Resources';
import SettingsView from './components/Settings';
import { db } from './db';
import { Menu, Home, Search as SearchIcon, Calendar, MessageCircle, User as UserIcon, Bell, Settings, Lock, Zap, ArrowLeft, Sun, Moon, Globe, ChevronDown, LayoutGrid } from 'lucide-react';

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
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
    }
    
    const saved = localStorage.getItem('maksocial_appearance');
    if (saved) {
      const s = JSON.parse(saved);
      const root = document.documentElement;
      root.style.setProperty('--brand-color', s.primaryColor);
      root.style.setProperty('--font-main', s.fontFamily);
      const scale = s.fontSize === 'sm' ? '0.9' : s.fontSize === 'lg' ? '1.1' : '1';
      root.style.setProperty('--text-scale', scale);
      root.setAttribute('data-contrast', s.contrast);
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
    setIsLoggedIn(true);
    setuserRole('student');
    setView('home');
    
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      role: 'University Student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      connections: 0,
      email: email,
      college: college,
      status: status,
      subscriptionTier: 'Free',
      accountStatus: 'Active',
      joinedColleges: [college],
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      totalLikesCount: 0,
      badges: [],
      appliedTo: []
    };
    
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
  };

  const handleSetView = (newView: AppView) => {
    if (userRole === 'admin' && newView !== 'admin') return;
    if (newView === 'resources' && currentUser?.subscriptionTier === 'Free') {
       alert("PROTOCOL LOCKED: Access to the Academic Vault requires a PRO subscription strata.");
       return;
    }
    setView(newView);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openThread = (postId: string) => {
    setActiveThreadId(postId);
    setView('thread');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoggedIn && userRole === 'admin') return <Admin onLogout={handleLogout} />;

    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed collegeFilter={activeSector} onOpenThread={openThread} onNavigateToProfile={handleNavigateToProfile} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} onOpenThread={openThread} onBack={() => setView('home')} onNavigateToProfile={handleNavigateToProfile} />;
      case 'groups': return <Feed collegeFilter={currentUser?.college} onOpenThread={openThread} onNavigateToProfile={handleNavigateToProfile} />;
      case 'messages': return <Chat />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={handleNavigateToProfile} />;
      case 'explore': return <Explore />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={handleNavigateToProfile} onNavigateToPost={(id) => openThread(id)} />;
      case 'resources': return <Resources />;
      case 'settings': return <SettingsView />;
      case 'admin': return <Admin onLogout={handleLogout} />;
      default: return <Feed collegeFilter={activeSector} onOpenThread={openThread} onNavigateToProfile={handleNavigateToProfile} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme font-sans relative">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="sticky top-0 z-[80] bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between transition-theme shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors active:scale-90 lg:hidden">
              <Menu size={22} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-indigo-600/10 border border-[var(--border-color)] rounded-xl transition-all group max-w-[180px] sm:max-w-none"
              >
                <div className="shrink-0 text-indigo-600">
                  {activeSector === 'Global' ? <Globe size={16} /> : <LayoutGrid size={16} />}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-tighter italic leading-none text-indigo-600 truncate">{activeSector} HUB</span>
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 whitespace-nowrap">Current Sector</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSectorDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[450]" onClick={() => setIsSectorDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[500] p-3 animate-in slide-in-from-top-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-2">Switch University Wing</p>
                    <button 
                      onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${activeSector === 'Global' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-[var(--bg-secondary)] text-slate-500'}`}
                    >
                      <Globe size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Global Pulse</span>
                    </button>
                    <div className="h-px bg-[var(--border-color)] my-2"></div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (
                        <button 
                          key={c}
                          onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); if(view !== 'home') setView('home'); }}
                          className={`flex items-center justify-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-[var(--bg-secondary)] text-slate-500'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-[var(--bg-secondary)] rounded-full transition-all active:scale-90">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => handleSetView('search')} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-all active:scale-95">
              <SearchIcon size={20} />
            </button>
            <button className="p-2.5 text-slate-500 relative hover:bg-[var(--bg-secondary)] rounded-full transition-all active:scale-95">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--sidebar-bg)]"></div>
            </button>
            {currentUser && (
               <button onClick={() => handleSetView('profile')} className="ml-1 active:scale-90 transition-transform">
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-white object-cover shadow-sm" alt="Profile" />
               </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-safe">
          {renderContent()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-[85] bg-[var(--sidebar-bg)]/95 backdrop-blur-xl border-t border-[var(--border-color)] flex items-center justify-between px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] transition-theme lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          {[
            { id: 'home', icon: <Home size={22} />, label: 'Feed' },
            { id: 'explore', icon: <SearchIcon size={22} />, label: 'Explore' },
            { id: 'calendar', icon: <Calendar size={22} />, label: 'Events' },
            { id: 'messages', icon: <MessageCircle size={22} />, label: 'Chats' },
            { id: 'settings', icon: <Settings size={22} />, label: 'UI' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSetView(item.id as AppView)}
              className={`flex-1 flex flex-col items-center gap-1 py-1 transition-all active:scale-90 ${view === item.id ? 'active-tab text-indigo-600' : 'text-slate-400'}`}
            >
              {item.icon}
              <span className={`text-[9px] font-black uppercase tracking-wider ${view === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
