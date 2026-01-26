
import React, { useState, useEffect, useRef } from 'react';
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
import { db } from './db';
import { Menu, Home, Search as SearchIcon, Calendar, MessageCircle, User as UserIcon, Bell, Settings, Lock, Zap, ArrowLeft, Sun, Moon, Globe, ChevronDown, LayoutGrid, XCircle, X, ShoppingBag, Command, CheckCircle2, Info } from 'lucide-react';

const WhaleAlert: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const duration = 6000; // 6 seconds

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 10);
    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-lg animate-in slide-in-from-top-10 duration-500 ease-out">
      <div className="bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] p-5 flex items-center gap-5 relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
        
        {/* Verification Icon - High Fidelity */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
            <CheckCircle2 className="text-brand-accent" size={26} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-2 border-white dark:border-[#0f172a] animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase text-brand-accent tracking-[0.3em]">Protocol_Broadcast</span>
            <div className="h-px flex-1 bg-brand-accent/10"></div>
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)] leading-tight italic line-clamp-2">
            "{message}"
          </p>
        </div>

        {/* Close */}
        <button onClick={onDismiss} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-rose-500">
          <X size={18} />
        </button>

        {/* Progress Bar - GitHub/AdminLTE inspired timer */}
        <div className="absolute bottom-0 left-0 h-1 bg-brand-accent/30 transition-none" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setuserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSector, setActiveSector] = useState<College | 'Global'>('Global');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [safetyError, setSafetyError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
      setNotifications(db.getNotifications());
      
      // Auto-trigger example alert on successful login
      const timer = setTimeout(() => {
        setActiveAlert("Prof. Barnabas shared a new 'Final Exam' asset in CHS Wing.");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

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
    const newUser: User = { 
      id: Date.now().toString(), 
      name: email.split('@')[0], 
      role: 'University Student', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, 
      connections: 0, 
      email, 
      college, 
      status, 
      subscriptionTier: 'Free', 
      joinedColleges: [college], 
      postsCount: 0, 
      followersCount: 0, 
      followingCount: 0, 
      totalLikesCount: 0, 
      badges: [], 
      appliedTo: [],
      nodeAuthorityLevel: 1,
      missionProgress: 0
    };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleSetView = (newView: AppView) => {
    if (userRole === 'admin' && newView !== 'admin') return;
    if (newView !== 'messages') setActiveChatUserId(null);
    setView(newView); setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoggedIn && userRole === 'admin') {
    return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed collegeFilter={activeSector} triggerSafetyError={setSafetyError} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} triggerSafetyError={setSafetyError} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'opportunities': return <Opportunities />;
      case 'notifications': return <NotificationsView />;
      case 'messages': return <Chat initialTargetUserId={activeChatUserId || undefined} />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} onMessageUser={(id) => { setActiveChatUserId(id); setView('messages'); }} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} onNavigateToPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      case 'resources': return <Resources />;
      case 'market': return <Market />;
      case 'forge': return <Forge onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'settings': return <SettingsView />;
      case 'admin': return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
      default: return <Feed collegeFilter={activeSector} triggerSafetyError={setSafetyError} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative">
      {safetyError && (
        <div className="fixed top-20 right-6 z-[9999] animate-in slide-in-from-right-4">
           <div className="bg-white border border-[#dee2e6] rounded shadow-lg p-3 pr-8 flex items-start gap-4 max-w-sm relative">
              <XCircle className="text-[#dc3545]" size={36} />
              <p className="text-[#495057] text-sm font-bold leading-tight">{safetyError}</p>
              <button onClick={() => setSafetyError(null)} className="absolute top-2 right-2 text-[#adb5bd]"><X size={14} /></button>
           </div>
        </div>
      )}

      {activeAlert && <WhaleAlert message={activeAlert} onDismiss={() => setActiveAlert(null)} />}

      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[2000] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <Sidebar activeView={view} setView={handleSetView} isAdmin={userRole === 'admin'} onLogout={() => {setIsLoggedIn(false); setView('landing');}} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} unreadNotifications={notifications.filter(n => !n.isRead).length} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="sticky top-0 z-[80] bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl lg:hidden transition-colors"><Menu size={24} /></button>
            
            <div className="hidden md:flex items-center relative group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none group-focus-within:text-indigo-600 transition-colors">
                  <Command size={16} />
               </div>
               <input 
                  onClick={() => setView('search')}
                  readOnly
                  placeholder="Registry CLI / type '/' to search..." 
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 pl-12 pr-6 text-xs font-bold uppercase w-80 outline-none hover:border-indigo-500 transition-all cursor-pointer"
               />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-indigo-600 rounded-xl transition-all">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => handleSetView('notifications')} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-indigo-600 rounded-xl transition-all relative">
               <Bell size={20} />
               {notifications.some(n => !n.isRead) && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse border-2 border-[var(--bg-secondary)]"></span>}
            </button>
            <button onClick={() => handleSetView('profile')} className="ml-2 active:scale-90 transition-transform">
               <div className="p-0.5 glass-panel rounded-xl">
                  <img src={currentUser?.avatar} className="w-10 h-10 rounded-lg border border-[var(--border-color)] bg-white object-cover shadow-sm" alt="Node" />
               </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-safe">{renderContent()}</main>
        
        <nav className="fixed bottom-0 left-0 right-0 z-[85] bg-[var(--sidebar-bg)]/80 backdrop-blur-xl border-t border-[var(--border-color)] flex items-center justify-between px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
          {[
            { id: 'home', icon: <Home size={24} /> },
            { id: 'market', icon: <ShoppingBag size={24} /> },
            { id: 'calendar', icon: <Calendar size={24} /> },
            { id: 'notifications', icon: <Bell size={24} /> },
            { id: 'settings', icon: <Settings size={24} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => handleSetView(item.id as AppView)} className={`p-4 rounded-2xl transition-all ${view === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400'}`}>
              {item.icon}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
