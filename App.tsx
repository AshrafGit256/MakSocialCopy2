
import React, { useState, useEffect, useRef } from 'react';
import { AppView, User, College, UserStatus, AppSettings } from './types';
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
import Opportunities from './components/Opportunities';
import NotificationsView from './components/Notifications';
import Gallery from './components/Gallery';
import Settings from './components/Settings';
import MessageDropdown from './components/MessageDropdown';
import NotificationDropdown from './components/NotificationDropdown';
import SearchDrawer from './components/SearchDrawer';
import RightSidebar from './components/RightSidebar';
import LostAndFound from './components/LostAndFound';
import TicketsVault from './components/TicketsVault';
import Splash from './components/Splash';
import { db } from './db';
import { Menu, MessageCircle, Bell, Globe, ChevronDown, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setuserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSector, setActiveSector] = useState<College | 'Global'>('Global');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('maksocial_current_user_id');
    if (savedUserId) {
      const user = db.getUsers().find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setuserRole(user.email?.endsWith('@admin.mak.ac.ug') ? 'admin' : 'student');
        setView('home');
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const user = db.getUser();
      setCurrentUser(user);
      setUnreadMsgs(db.getChats().reduce((acc, c) => acc + c.unreadCount, 0));
      setUnreadNotifs(db.getNotifications().filter(n => !n.isRead).length);
    }
  }, [isLoggedIn, view]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', '#10918a');
    root.style.setProperty('--radius-main', '2px');
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--text-primary', '#0f172a');
    root.style.setProperty('--border-color', '#e2e8f0');
    document.documentElement.classList.remove('dark');
  }, [view]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
        setIsMsgOpen(false);
        setIsSectorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (email: string) => {
    const users = db.getUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      localStorage.setItem('maksocial_current_user_id', existingUser.id);
      setCurrentUser(existingUser);
    } else {
      const mockId = 'u-ninfa';
      localStorage.setItem('maksocial_current_user_id', mockId);
      setCurrentUser(db.getUser(mockId));
    }
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setuserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    const userId = Date.now().toString();
    const newUser: User = { 
      id: userId, 
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
      verified: true 
    };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', userId);
    setCurrentUser(newUser);
    setIsLoggedIn(true); 
    setuserRole('student'); 
    setView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('maksocial_current_user_id');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('landing');
  };

  const handleSetView = (newView: AppView) => {
    setView(newView); 
    setIsSidebarOpen(false);
    setIsNotifOpen(false);
    setIsMsgOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (isLoggedIn && userRole === 'admin') {
    return <Admin onLogout={handleLogout} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed collegeFilter={activeSector} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'chats': return <ChatHub />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} onMessageUser={() => setView('chats')} onUpdateCurrentUser={(u) => setCurrentUser(u)} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'admin-calendar': return <AdminCalendar />;
      case 'resources': return <Resources />;
      case 'opportunities': return <Opportunities />;
      case 'notifications': return <NotificationsView />;
      case 'gallery': return <Gallery onSelectPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      case 'settings': return <Settings />;
      case 'lost-found': return <LostAndFound onOpenChat={(id) => { setActiveThreadId(id); setView('chats'); }} />;
      case 'tickets': return <TicketsVault onBack={() => setView('home')} />;
      default: return <Feed collegeFilter={activeSector} onOpenThread={() => {}} onNavigateToProfile={() => {}} triggerSafetyError={() => {}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout} 
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
        <header ref={headerRef} className="sticky top-0 z-[80] bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 overflow-visible">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full lg:hidden shrink-0"><Menu size={22} /></button>
            <div className="relative">
              <button onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl transition-all group max-w-[150px] sm:max-w-none">
                <div className="shrink-0 text-[var(--brand-color)]">{activeSector === 'Global' ? <Globe size={16} /> : <LayoutGrid size={16} />}</div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--brand-color)] truncate">{activeSector} HUB</span>
                <ChevronDown size={12} className={`text-slate-500 transition-transform shrink-0 ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSectorDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl z-[500] p-3 animate-in slide-in-from-top-2">
                  <button onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); setView('home'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${activeSector === 'Global' ? 'bg-[var(--brand-color)] text-white' : 'hover:bg-[var(--bg-secondary)] text-slate-400'}`}><Globe size={16} /> <span className="text-[10px] font-black uppercase">Global Pulse</span></button>
                  <div className="grid grid-cols-2 gap-1.5">{['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (<button key={c} onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); setView('home'); }} className={`flex items-center justify-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-[var(--brand-color)] text-white' : 'hover:bg-[var(--bg-secondary)] text-slate-400'}`}>{c}</button>))}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 relative ml-2">
            <div className="relative shrink-0">
              <button 
                onClick={() => { setIsMsgOpen(!isMsgOpen); setIsNotifOpen(false); }} 
                className={`p-2 transition-colors relative ${isMsgOpen ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
              >
                <MessageCircle size={18} /> 
                {unreadMsgs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--brand-color)] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{unreadMsgs}</span>
                )}
              </button>
              {isMsgOpen && <MessageDropdown onClose={() => setIsMsgOpen(false)} onViewAll={() => handleSetView('chats')} />}
            </div>

            <div className="relative shrink-0">
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMsgOpen(false); }} 
                className={`p-2 transition-colors relative ${isNotifOpen ? 'text-[var(--brand-color)]' : 'text-slate-500 hover:text-[var(--text-primary)]'}`}
              >
                <Bell size={18} /> 
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
                )}
              </button>
              {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} onViewAll={() => handleSetView('notifications')} />}
            </div>

            {currentUser && (
              <button 
                onClick={() => handleSetView('profile')} 
                className="ml-1 shrink-0 active:scale-95 transition-transform flex items-center justify-center"
                style={{ width: '40px', height: '40px' }}
              >
                <img 
                  src={currentUser.avatar} 
                  className={`w-10 h-10 rounded-full border-2 aspect-square object-cover flex-shrink-0 ${view === 'profile' ? 'border-[var(--brand-color)]' : 'border-[var(--border-color)]'} bg-white`} 
                  alt="Profile" 
                />
              </button>
            )}
          </div>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto no-scrollbar">{renderContent()}</main>
          {(view === 'home' || view === 'thread') && <RightSidebar />}
        </div>
      </div>
    </div>
  );
};

export default App;
