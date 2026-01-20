
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
import Resources from './components/Resources';
import { db } from './db';
import { 
  Menu, Bell, X, Heart, UserPlus, Zap, ShieldAlert, Search as SearchIcon,
  MessageCircle, Plus, Home, Compass, User as UserIcon, ArrowRight, Settings, Layout, Monitor
} from 'lucide-react';

const NotificationsPanel: React.FC<{ isOpen: boolean, onClose: () => void, user: User, onClear: () => void }> = ({ isOpen, onClose, user, onClear }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-[110] w-full max-w-sm bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
               <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-slate-300">
                  <Bell size={40}/>
               </div>
               <p className="text-xs font-black uppercase text-slate-500 tracking-widest leading-relaxed">System Quiet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPanel: React.FC<{ isOpen: boolean, onClose: () => void, onNavigateToProfile: (uid: string) => void }> = ({ isOpen, onClose, onNavigateToProfile }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const users = db.getUsers().filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.college.toLowerCase().includes(q) ||
      u.courseAbbr.toLowerCase().includes(q)
    );
    setResults(users);
  }, [query]);

  return (
    <div className={`fixed inset-y-0 left-0 z-[110] w-full max-w-sm bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-6 h-24 flex items-center justify-between border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Search Nodes</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-rose-500 rounded-xl">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
           <div className="relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search people..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-indigo-600 transition-all"
                autoFocus
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {results.length > 0 ? (
            results.map(u => (
              <button 
                key={u.id}
                onClick={() => { onNavigateToProfile(u.id); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-600/5 transition-all group border border-transparent hover:border-indigo-600/10"
              >
                <img src={u.avatar} className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-black text-[var(--text-primary)] uppercase truncate leading-none">{u.name}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{u.college} • {u.status}</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>
            ))
          ) : query ? (
            <div className="py-20 text-center opacity-50">
               <p className="text-[10px] font-black uppercase tracking-widest">No nodes discovered</p>
            </div>
          ) : (
            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
               <SearchIcon size={48} />
               <p className="text-[10px] font-black uppercase tracking-widest">Awaiting signal...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
    if (isAdmin) setIsAdminMode(true);
    db.saveUser({ ...db.getUser(), email });
  };

  const handleRegister = (email: string, college: College, status: UserStatus) => {
    setIsLoggedIn(true);
    setUserRole('student');
    setView('home');
    const newUser = db.registerNode({ name: email.split('@')[0], email, college, status });
    localStorage.setItem('maksocial_current_user_id', newUser.id);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    setView('landing');
  };

  const handleSetView = (newView: AppView) => {
    if (newView === 'notifications') {
       setIsNotifPanelOpen(true);
       return;
    }
    if (newView === 'search') {
       setIsSearchPanelOpen(true);
       return;
    }
    if (newView === 'admin') {
      setIsAdminMode(true);
      return;
    }
    setView(newView);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'landing': return <Landing onStart={() => setView('login')} />;
      case 'login': return <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />;
      case 'register': return <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'home': return <Feed />;
      case 'groups': return <Feed collegeFilter={currentUser?.college} />;
      case 'messages': return <Chat />;
      case 'profile': return <Profile userId={selectedUserId || currentUser?.id} onNavigateBack={() => setSelectedUserId(null)} />;
      case 'explore': return <Explore />;
      case 'calendar': return <CalendarView isAdmin={userRole === 'admin'} />;
      case 'resources': return <Resources />;
      case 'admin': return <Admin onToggleView={() => setIsAdminMode(false)} onLogout={handleLogout} />;
      default: return <Feed />;
    }
  };

  const isAuthView = view === 'landing' || view === 'login' || view === 'register';

  if (!isLoggedIn && isAuthView) {
    return renderContent();
  }

  // Admin Mode completely replaces the UI with a self-contained AdminLTE layout
  if (isLoggedIn && isAdminMode && userRole === 'admin') {
    return <Admin onToggleView={() => setIsAdminMode(false)} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-theme font-sans relative">
      {(isSidebarOpen || isNotifPanelOpen || isSearchPanelOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity" onClick={() => { setIsSidebarOpen(false); setIsNotifPanelOpen(false); setIsSearchPanelOpen(false); }} />
      )}

      {/* Hide platform sidebar for admins when in platform view but offering them the switch */}
      <Sidebar 
        activeView={view} 
        setView={handleSetView} 
        isAdmin={userRole === 'admin'} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {currentUser && (
        <>
          <NotificationsPanel 
            isOpen={isNotifPanelOpen} 
            onClose={() => setIsNotifPanelOpen(false)} 
            user={currentUser}
            onClear={() => {}}
          />
          <SearchPanel 
            isOpen={isSearchPanelOpen} 
            onClose={() => setIsSearchPanelOpen(false)} 
            onNavigateToProfile={(uid) => { setSelectedUserId(uid); setView('profile'); }}
          />
        </>
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] z-50">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
            <Menu size={24} />
          </button>
          <span className="text-3xl font-cursive text-indigo-600">MakSocial</span>
          <button onClick={() => setIsNotifPanelOpen(true)} className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl relative">
            <Bell size={24} />
            {currentUser?.notifications?.some(n => !n.isRead) && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border border-white"></div>}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)] no-scrollbar pb-24 lg:pb-0">
          {renderContent()}
        </main>

        {/* Floating Bottom Navbar (Mobile Only) */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-black/90 dark:bg-[#020617]/95 border border-white/10 backdrop-blur-2xl rounded-full px-2 py-3 flex items-center justify-between shadow-2xl z-[55]">
           {[
             { id: 'home', icon: <Home size={22} /> },
             { id: 'search', icon: <SearchIcon size={22} /> },
             { id: 'explore', icon: <Compass size={22} /> },
             { id: 'messages', icon: <MessageCircle size={22} /> },
             { id: 'profile', icon: <UserIcon size={22} /> }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => handleSetView(item.id as AppView)}
               className={`flex-1 flex flex-col items-center gap-1 transition-all rounded-full py-2 ${view === item.id ? 'text-indigo-500 scale-110' : 'text-slate-500'}`}
             >
                {item.icon}
             </button>
           ))}
           <button 
              onClick={() => handleSetView('home')}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-600/30 active:scale-90 transition-transform mr-1"
           >
              <Plus size={20} />
           </button>
        </nav>

        {/* Floating Admin Toggle Button */}
        {userRole === 'admin' && (
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="hidden lg:flex fixed bottom-10 right-10 z-[100] bg-indigo-600 text-white px-6 py-4 rounded-3xl shadow-2xl items-center gap-3 hover:scale-105 active:scale-95 transition-all font-black text-xs uppercase tracking-widest group"
          >
            {isAdminMode ? <Layout size={20} className="group-hover:rotate-12" /> : <Monitor size={20} className="group-hover:rotate-12" />}
            {isAdminMode ? 'Hub View' : 'Admin Terminal'}
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
