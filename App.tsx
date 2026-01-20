
import React, { useState, useEffect } from 'react';
import { AppView, User, College, UserStatus, Notification } from './types';
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
import Synapse from './components/Synapse';
import { db } from './db';
// Added Orbit and Rocket to lucide-react imports
import { Menu, Home, BookOpen, LayoutGrid, User as UserIcon, Bell, X, Heart, UserPlus, Zap, ShieldAlert, Orbit, Rocket } from 'lucide-react';

const NotificationsPanel: React.FC<{ isOpen: boolean, onClose: () => void, user: User, onClear: () => void }> = ({ isOpen, onClose, user, onClear }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-[100] w-full max-w-sm bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-6 h-24 flex items-center justify-between border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
             <Bell className="text-indigo-600" size={24}/>
             <h2 className="text-2xl font-black uppercase tracking-tighter">Notifications</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-rose-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {user.notifications && user.notifications.length > 0 ? (
            user.notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${n.isRead ? 'bg-transparent border-transparent' : 'bg-indigo-600/5 border-indigo-600/10'}`}>
                 <div className="shrink-0 pt-1">
                    {n.type === 'like' && <Heart size={18} className="text-rose-500" fill="currentColor"/>}
                    {n.type === 'request' && <UserPlus size={18} className="text-indigo-600"/>}
                    {n.type === 'event' && <Zap size={18} className="text-amber-500"/>}
                    {n.type === 'official' && <ShieldAlert size={18} className="text-rose-600"/>}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{n.text}</p>
                    <span className="text-[10px] font-black uppercase text-slate-500 mt-2 block">{n.timestamp}</span>
                 </div>
                 {!n.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-2 shadow-lg shadow-indigo-600/50"></div>}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
               <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-slate-300">
                  <Bell size={40}/>
               </div>
               <p className="text-xs font-black uppercase text-slate-500 tracking-widest leading-relaxed">System Quiet: No signals detected in the notification registry.</p>
            </div>
          )}
        </div>

        {user.notifications && user.notifications.length > 0 && (
          <div className="p-6 border-t border-[var(--border-color)]">
             <button onClick={onClear} className="w-full py-4 rounded-2xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Clear All Signals</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  
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
      joinedColleges: [college],
      notifications: [],
      iqCredits: 100,
      skills: [],
      intellectualSignature: '#6366f1'
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
    if (newView === 'notifications') {
       setIsNotifPanelOpen(true);
       return;
    }
    setView(newView);
    setIsSidebarOpen(false);
  };

  const handleClearNotifs = () => {
    if (currentUser) {
       const updatedUser = { ...currentUser, notifications: [] };
       db.saveUser(updatedUser);
       setCurrentUser(updatedUser);
    }
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
      case 'synapse': return <Synapse />;
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
      
      {isNotifPanelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setIsNotifPanelOpen(false)} />
      )}

      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {currentUser && (
        <NotificationsPanel 
          isOpen={isNotifPanelOpen} 
          onClose={() => setIsNotifPanelOpen(false)} 
          user={currentUser}
          onClear={handleClearNotifs}
        />
      )}

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
          <button onClick={() => setIsNotifPanelOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl relative transition-colors">
            <Bell size={24} />
            {currentUser?.notifications?.some(n => !n.isRead) && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border border-white"></div>}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-24 lg:pb-0">
          {renderContent()}
        </main>

        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-2xl rounded-[2.5rem] p-3 flex items-center justify-around shadow-2xl z-[55] ring-1 ring-white/5">
           {[
             { id: 'home', icon: <Home size={22} />, label: 'Pulse' },
             { id: 'synapse', icon: <Orbit size={22} />, label: 'AI' },
             { id: 'nexus', icon: <Rocket size={22} />, label: 'Nexus' },
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
