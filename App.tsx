
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

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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
    
    // Fix: Added missing joinedColleges property to User object creation
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
  };

  const navigateToPost = (postId: string) => {
    setTargetPostId(postId);
    setView('home');
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
      case 'events': return <Events />;
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
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme font-sans">
      <Sidebar 
        activeView={view} 
        setView={setView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
