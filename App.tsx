
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
import SettingsView from './components/Settings'; // Replaced Events
import { db } from './db';
import { Menu, Home, Search as SearchIcon, Calendar, MessageCircle, User as UserIcon, Bell, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [targetPostId, setTargetPostId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
    }
    
    // Apply saved appearance settings on load
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

  const handleLogin = (email: string) => {
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setUserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
    if (isAdmin) setIsAdminMode(true);
    
    const user = db.getUser();
    db.saveUser({ ...user, email });
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    setIsLoggedIn(true);
    setUserRole('student');
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
    setIsAdminMode(false);
    setView('landing');
  };

  const handleSetView = (newView: AppView) => {
    if (userRole === 'admin' && newView !== 'admin') {
      return; 
    }

    setView(newView);
    setIsSidebarOpen(false);
    if ((newView as string) === 'admin') setIsAdminMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoggedIn && userRole === 'admin') {
      return <Admin onLogout={handleLogout} />;
    }

    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed targetPostId={targetPostId} onClearTarget={() => setTargetPostId(null)} />;
      case 'groups': return <Feed collegeFilter={currentUser?.college} />;
      case 'messages': return <Chat />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => setSelectedUserId(null)} />;
      case 'explore': return <Explore />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={(id) => { setSelectedUserId(id); setView('profile'); }} onNavigateToPost={(id) => { setTargetPostId(id); setView('home'); }} />;
      case 'resources': return <Resources />;
      case 'settings': return <SettingsView />;
      case 'admin': return <Admin onLogout={handleLogout} />;
      default: return <Feed />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';

  if (!isLoggedIn && isAuthView) {
    return renderContent();
  }

  if (isLoggedIn && userRole === 'admin') {
    return <Admin onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme font-sans relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
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
        <header className="sticky top-0 z-[80] bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between transition-theme">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors active:scale-90 lg:hidden">
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight leading-none uppercase italic text-indigo-600">MakSocial</h1>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">The Hill Connect</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
