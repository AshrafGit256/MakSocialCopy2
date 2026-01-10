
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Landing from './components/Landing';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Admin from './components/Admin';
import { db } from './db';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentUser(db.getUser());
    }
  }, [isLoggedIn]);

  const handleLogin = (email: string) => {
    const isAdmin = email.toLowerCase().endsWith('@admin.mak.ac.ug');
    setIsLoggedIn(true);
    setUserRole(isAdmin ? 'admin' : 'student');
    setView(isAdmin ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
  };

  const renderContent = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} />;
      case 'home': return <Feed />;
      case 'messages': return <Chat />;
      case 'profile': return <Profile />;
      case 'admin': return userRole === 'admin' ? <Admin /> : <Feed />;
      default: return <Feed />;
    }
  };

  if (!isLoggedIn && (view === 'landing' || view === 'login')) {
    return renderContent();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#05080c] text-slate-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={view} 
        setView={setView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#05080c]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
