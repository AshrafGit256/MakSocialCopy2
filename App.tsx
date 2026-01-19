
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
import Events from './components/Events';
import Explore from './components/Explore';
import CalendarView from './components/Calendar';
import Search from './components/Search';
import { db } from './db';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Navigation states for deep linking
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

  const navigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setView('profile');
    setIsSidebarOpen(false);
  };

  const navigateToPost = (postId: string) => {
    setTargetPostId(postId);
    setView('home');
    setIsSidebarOpen(false);
  };

  const handleSetView = (newView: AppView) => {
    setView(newView);
    setIsSidebarOpen(false); // Close sidebar on view change (mobile)
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
      case 'events': return <Events isAdmin={userRole === 'admin'} />;
      case 'explore': return <Explore />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'search': return <Search onNavigateToProfile={navigateToProfile} onNavigateToPost={navigateToPost} />;
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
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] z-50">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <img
            src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
            alt="MakSocial Logo"
            className="h-8 grayscale brightness-0 dark:grayscale-0 dark:brightness-100"
            onClick={() => handleSetView('home')}
          />
          <div className="w-10"></div> {/* Spacer for alignment */}
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
