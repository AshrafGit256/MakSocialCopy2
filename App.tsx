
import React, { useState, useEffect } from 'react';
import { AppView, User, College, UserStatus, AppSettings } from './types';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import ChatHub from './components/ChatHub';
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
import { Menu, Home, MessageCircle, User as UserIcon, Bell, Settings, Sun, Moon, Globe, ChevronDown, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setuserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSector, setActiveSector] = useState<College | 'Global'>('Global');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
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
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    setIsLoggedIn(true); setuserRole('student'); setView('home');
    const newUser: User = { id: Date.now().toString(), name: email.split('@')[0], role: 'University Student', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, connections: 0, email, college, status, subscriptionTier: 'Free', joinedColleges: [college], postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0, badges: [], appliedTo: [] };
    db.saveUsers([...db.getUsers(), newUser]);
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleSetView = (newView: AppView) => {
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
      case 'home': return <Feed collegeFilter={activeSector} onOpenThread={(id) => {setActiveThreadId(id); setView('thread');}} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'thread': return <Feed threadId={activeThreadId || undefined} onOpenThread={(id) => setActiveThreadId(id)} onBack={() => setView('home')} onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} triggerSafetyError={() => {}} />;
      case 'chats': return <ChatHub />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => { setSelectedUserId(null); setView('home'); }} onNavigateToProfile={(id) => setSelectedUserId(id)} onMessageUser={() => setView('chats')} />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} onNavigateToPost={(id) => {setActiveThreadId(id); setView('thread');}} />;
      case 'resources': return <Resources />;
      case 'market': return <Market />;
      case 'forge': return <Forge onNavigateToProfile={(id) => {setSelectedUserId(id); setView('profile');}} />;
      case 'settings': return <SettingsView />;
      case 'opportunities': return <Opportunities />;
      case 'notifications': return <NotificationsView />;
      case 'admin': return <Admin onLogout={() => {setIsLoggedIn(false); setView('landing');}} />;
      default: return <Feed collegeFilter={activeSector} onOpenThread={() => {}} onNavigateToProfile={() => {}} triggerSafetyError={() => {}} />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';
  if (!isLoggedIn && isAuthView) return renderContent();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar activeView={view} setView={handleSetView} isAdmin={userRole === 'admin'} onLogout={() => {setIsLoggedIn(false); setView('landing');}} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-[80] bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white hover:bg-white/5 rounded-full lg:hidden"><Menu size={22} /></button>
            <div className="relative">
              <button onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl transition-all group">
                <div className="shrink-0 text-[#10918a]">{activeSector === 'Global' ? <Globe size={18} /> : <LayoutGrid size={18} />}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#10918a]">{activeSector} HUB</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isSectorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSectorDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2d] border border-white/5 rounded-xl shadow-2xl z-[500] p-3 animate-in slide-in-from-top-2">
                  <button onClick={() => { setActiveSector('Global'); setIsSectorDropdownOpen(false); setView('home'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${activeSector === 'Global' ? 'bg-[#10918a] text-white' : 'hover:bg-white/5 text-slate-400'}`}><Globe size={16} /> <span className="text-[10px] font-black uppercase">Global Pulse</span></button>
                  <div className="grid grid-cols-2 gap-1.5">{['COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS', 'CAES', 'COBAMS', 'CEES', 'LAW'].map(c => (<button key={c} onClick={() => { setActiveSector(c as College); setIsSectorDropdownOpen(false); setView('home'); }} className={`flex items-center justify-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSector === c ? 'bg-[#10918a] text-white' : 'hover:bg-white/5 text-slate-400'}`}>{c}</button>))}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-white transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => handleSetView('notifications')} className="p-2 text-slate-500 hover:text-white relative"><Bell size={20} /> <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span></button>
            {currentUser && <button onClick={() => handleSetView('profile')} className="ml-1 active:scale-95 transition-transform"><img src={currentUser.avatar} className={`w-10 h-10 rounded-full border-2 ${view === 'profile' ? 'border-[#10918a]' : 'border-white/5'} bg-white object-cover`} alt="Profile" /></button>}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto no-scrollbar">{renderContent()}</main>
        
        <nav className="fixed bottom-0 left-0 right-0 z-[85] bg-[#1e1e2d]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 pt-3 pb-8 lg:hidden">
          {[
            { id: 'home', icon: <Home size={22} />, label: 'Feed' },
            { id: 'chats', icon: <MessageCircle size={22} />, label: 'Chats' },
            { id: 'search', icon: <Search size={22} />, label: 'Registry' },
            { id: 'settings', icon: <Settings size={22} />, label: 'Config' },
          ].map((item) => (
            <button key={item.id} onClick={() => handleSetView(item.id as AppView)} className={`flex-1 flex flex-col items-center gap-1 transition-all ${view === item.id ? 'text-[#10918a]' : 'text-slate-500'}`}>
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
