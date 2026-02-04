
import React, { useState, useEffect, useRef } from 'react';
import { AppView, User, College, UserStatus } from './types';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ChatHub from './components/ChatHub';
import Profile from './components/Profile';
import Admin from './components/Admin';
import CalendarView from './components/Calendar';
import AdminCalendar from './components/AdminCalendar';
import Resources from './components/Resources';
import SettingsView from './components/Settings';
import Opportunities from './components/Opportunities';
import NotificationsView from './components/Notifications';
import Gallery from './components/Gallery';
import EmailHub from './components/EmailHub';
import MessageDropdown from './components/MessageDropdown';
import NotificationDropdown from './components/NotificationDropdown';
import SearchDrawer from './components/SearchDrawer';
import { db } from './db';
import { Menu, MessageCircle, Bell, Settings, Sun, Moon, Globe, ChevronDown, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setuserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSector, setActiveSector] = useState<College | 'Global'>('Global');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Manifest Dropdown States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
      setUnreadMsgs(db.getChats().reduce((acc, c) => acc + c.unreadCount, 0));
      setUnreadNotifs(db.getNotifications().filter(n => !n.isRead).length);
    }
  }, [isLoggedIn, view]);

  useEffect(() => {
    const saved = localStorage.getItem('maksocial_appearance_v3');
    const defaultSettings = {
      primaryColor: '#475569',
      fontFamily: '"JetBrains Mono", monospace',
      borderRadius: '2px',
      themePreset: 'tactical'
    };
    
    const settings = saved ? JSON.parse(saved) : defaultSettings;
    const root = document.documentElement;
    root.style.setProperty('--brand-color', settings.primaryColor || '#475569');
    root.style.setProperty('--font-main', settings.fontFamily);
    root.style.setProperty('--radius-main', settings.borderRadius);
    
    if (settings.themePreset === 'paper') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
        setIsMsgOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    const saved = localStorage.getItem('maksocial_appearance_v3');
    if (saved) {
      const settings = JSON.parse(saved);
      settings.themePreset = newTheme ? 'tactical' : 'paper';
      localStorage.setItem('maksocial_appearance_v3', JSON.stringify(settings));
    }
  };

  const handleLogin = (email: string) => {
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setuserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    setIsLoggedIn(true); setuserRole('student'); setView('home');
    const newUser: User = { id: Date.now().toString(), name: email.split('@')[0], role: 'University Student', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, connections: 0, email, college, status, subscriptionTier: 'Free', joinedColleges: [college], postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0, badges: [], appliedTo: [], verified: true };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleSetView = (newView: AppView) => {
    setView(newView); setIsSidebarOpen(false);
    setIsNotifOpen(false);
    setIsMsgOpen(false);
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
      case 'home': return <Feed collegeFilter={activeSector} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'chats': return <ChatHub />;
      case 'email': return <EmailHub />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} onMessageUser={() => setView('chats')} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'admin-calendar': return <AdminCalendar />;
      case 'resources': return <Resources />;
      case 'settings': return <SettingsView />;
      case 'opportunities': return <Opportunities />;
      case 'notifications': return <NotificationsView />;
      case 'gallery': return <Gallery onSelectPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      default: return <Feed collegeFilter={activeSector} onOpenThread={() => {}} onNavigateToProfile={() => {}} triggerSafetyError={() => {}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={() => {setIsLoggedIn(false); setView('landing');}} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
      />

      <SearchDrawer 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectUser={(id) => {
          setSelectedUserId(id);
          setView('profile');
        }}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header ref={headerRef} className="sticky top-0 z-[80] bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full lg:hidden"><Menu size={22} /></button>
            <div className="relative">
              <button onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)} className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl transition-all group">
                <div className="shrink-0 text-[var(--brand-color)]">{activeSector === 'Global' ? <Globe size={18} /> : <LayoutGrid size={18} />}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)]">{activeSector} HUB</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSectorDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[500] p-3 animate-in slide-in-from-top-2">
                  <button onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); setView('home'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${activeSector === 'Global' ? 'bg-[var(--brand-color)] text-white' : 'hover:bg-white/5 text-slate-400'}`}><Globe size={16} /> <span className="text-[10px] font-black uppercase">Global Pulse</span></button>
                  <div className="grid grid-cols-2 gap-1.5">{['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (<button key={c} onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); setView('home'); }} className={`flex items-center justify-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-[var(--brand-color)] text-white' : 'hover:bg-white/5 text-slate-400'}`}>{c}</button>))}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-[var(--text-primary)] transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            
            <div className="relative">
              <button 
                onClick={() => { setIsMsgOpen(!isMsgOpen); setIsNotifOpen(false); }} 
                className={`p-2 transition-colors relative ${isMsgOpen ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
              >
                <MessageCircle size={20} /> 
                {unreadMsgs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--brand-color)] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-sm">{unreadMsgs}</span>
                )}
              </button>
              {isMsgOpen && <MessageDropdown onClose={() => setIsMsgOpen(false)} onViewAll={() => handleSetView('chats')} />}
            </div>

            <div className="relative">
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMsgOpen(false); }} 
                className={`p-2 transition-colors relative ${isNotifOpen ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
              >
                <Bell size={20} /> 
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-[var(--bg-primary)] animate-pulse shadow-sm"></span>
                )}
              </button>
              {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} onViewAll={() => handleSetView('notifications')} />}
            </div>

            {currentUser && <button onClick={() => handleSetView('profile')} className="ml-1 active:scale-95 transition-transform"><img src={currentUser.avatar} className={`w-10 h-10 rounded-full border-2 ${view === 'profile' ? 'border-[var(--brand-color)]' : 'border-[var(--border-color)]'} bg-white object-cover`} alt="Profile" /></button>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto no-scrollbar">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
