
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
import Nexus from './components/Nexus';
import { db } from './db';
import { Menu, Home, BookOpen, LayoutGrid, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [targetPostId, setTargetPostId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
    }
  }, [isLoggedIn, view]);

  const handleLogin = (email: string) => {
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setUserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
    db.saveUser({ ...db.getUser(), email });
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
      badges: [],
      appliedTo: [],
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      totalLikesCount: 0,
      joinedColleges: [college]
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
    setView(newView);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
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
      case 'search': return <Search onNavigateToProfile={(uid) => { setSelectedUserId(uid); setView('profile'); }} onNavigateToPost={(pid) => { setTargetPostId(pid); setView('home'); }} />;
      case 'resources': return <Resources />;
      case 'nexus': return <Nexus />;
      case 'admin': return userRole === 'admin' ? <Admin /> : <Feed />;
      default: return <Feed />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';

  if (!isLoggedIn && isAuthView) {
    return renderContent();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme font-sans relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] z-50">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
            <Menu size={24} />
          </button>
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
            className="h-8 grayscale brightness-0 dark:grayscale-0 dark:brightness-100"
            onClick={() => handleSetView('home')}
          />
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-24 lg:pb-0">
          {renderContent()}
        </main>

        {/* Mobile Bottom Dock - X-Style */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-2xl rounded-[2.5rem] p-3 flex items-center justify-around shadow-2xl z-[55] ring-1 ring-white/5">
           {[
             { id: 'home', icon: <Home size={22} />, label: 'Pulse' },
             { id: 'resources', icon: <BookOpen size={22} />, label: 'Vault' },
             { id: 'groups', icon: <LayoutGrid size={22} />, label: 'Wing' },
             { id: 'profile', icon: <UserIcon size={22} />, label: 'Self' }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => handleSetView(item.id as AppView)}
               className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${view === item.id ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-500'}`}
             >
                {item.icon}
                <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
