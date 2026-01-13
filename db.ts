
import { Post, User, College, UserStatus, LiveEvent, Notification, Violation, Comment, Poll, TimelineEvent, CalendarEvent, CollegeStats } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v8',
  USERS: 'maksocial_users_v8',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  EVENTS: 'maksocial_events_v3',
  VIOLATIONS: 'maksocial_violations_v2',
  POLLS: 'maksocial_polls_v1',
  TIMELINE: 'maksocial_timeline_v1',
  CALENDAR: 'maksocial_calendar_v1',
  COLLEGE_STATS: 'maksocial_college_stats_v1'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Guru A.',
    role: 'CS Student',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    email: 'guru@mak.ac.ug',
    badges: [{ id: 'b1', name: 'Top Contributor', icon: '🔥', color: 'text-orange-500' }],
    appliedTo: [],
    notifications: [],
    warningsCount: 0,
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500,
    joinedColleges: ['COCIS']
  },
  {
    id: 'u2',
    name: 'Kato John',
    role: 'Finalist',
    avatar: 'https://i.pravatar.cc/150?u=kato',
    connections: 512,
    college: 'CEDAT',
    status: 'Finalist',
    email: 'kato@mak.ac.ug',
    badges: [],
    appliedTo: [],
    notifications: [],
    warningsCount: 0,
    postsCount: 8,
    followersCount: 890,
    followingCount: 215,
    totalLikesCount: 1200,
    joinedColleges: ['CEDAT']
  }
];

const INITIAL_COLLEGE_STATS: CollegeStats[] = [
  { id: 'COCIS', followers: 1200, postCount: 450, dean: 'Prof. Tonny Oyana', description: 'Center for Computing and Information Sciences.' },
  { id: 'CEDAT', followers: 850, postCount: 320, dean: 'Prof. Henry Alinaitwe', description: 'Engineering, Design, Art and Technology.' },
  { id: 'CHUSS', followers: 920, postCount: 280, dean: 'Dr. Josephine Ahikire', description: 'Humanities and Social Sciences.' },
  { id: 'CHS', followers: 1500, postCount: 600, dean: 'Prof. Damalie Nakanjako', description: 'College of Health Sciences.' },
  { id: 'CONAS', followers: 640, postCount: 150, dean: 'Prof. J.Y.T. Mugisha', description: 'College of Natural Sciences.' },
  { id: 'CAES', followers: 510, postCount: 120, dean: 'Prof. Bernard Bashaasha', description: 'Agricultural and Environmental Sciences.' },
  { id: 'COBAMS', followers: 1100, postCount: 410, dean: 'Prof. Eria Hisali', description: 'Business and Management Sciences.' },
  { id: 'CEES', followers: 730, postCount: 210, dean: 'Prof. Anthony Muwagga Mugagga', description: 'Education and External Studies.' },
  { id: 'LAW', followers: 1300, postCount: 500, dean: 'Dr. Ronald Naluwairo', description: 'The School of Law.' }
];

export const db = {
  getCollegeStats: (): CollegeStats[] => {
    const saved = localStorage.getItem(DB_KEYS.COLLEGE_STATS);
    return saved ? JSON.parse(saved) : INITIAL_COLLEGE_STATS;
  },
  saveCollegeStats: (stats: CollegeStats[]) => localStorage.setItem(DB_KEYS.COLLEGE_STATS, JSON.stringify(stats)),

  joinCollege: (userId: string, collegeId: College) => {
    const users = db.getUsers();
    const stats = db.getCollegeStats();
    
    const updatedUsers = users.map(u => {
      if (u.id === userId && !u.joinedColleges.includes(collegeId)) {
        return { ...u, joinedColleges: [...u.joinedColleges, collegeId] };
      }
      return u;
    });
    
    const updatedStats = stats.map(s => {
      if (s.id === collegeId) {
        return { ...s, followers: s.followers + 1 };
      }
      return s;
    });

    db.saveUsers(updatedUsers);
    db.saveCollegeStats(updatedStats);
    
    db.logTimelineEvent({
      type: 'profile_update',
      userId,
      userName: db.getUser(userId).name,
      userAvatar: db.getUser(userId).avatar,
      description: `Joined the ${collegeId} community node.`
    });
  },

  getTimeline: (): TimelineEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.TIMELINE);
    return saved ? JSON.parse(saved) : [];
  },
  logTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const timeline = db.getTimeline();
    const newEvent: TimelineEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.TIMELINE, JSON.stringify([newEvent, ...timeline].slice(0, 200)));
  },

  getPosts: (filter?: College | 'Global'): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    let posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;

    if (filter) {
        // Strict filtering as requested
        posts = posts.filter(p => p.college === filter || p.isAd || p.isMakTV);
    }

    const now = new Date().getTime();
    return posts.filter(p => {
      if (!p.isAd || !p.adExpiryDate) return true;
      return new Date(p.adExpiryDate).getTime() > now;
    });
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts));
  },

  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    
    const users = db.getUsers();
    const updatedUsers = users.map(u => u.id === post.authorId ? { ...u, postsCount: (u.postsCount || 0) + 1 } : u);
    db.saveUsers(updatedUsers);

    db.logTimelineEvent({
      type: 'new_post',
      userId: post.authorId,
      userName: post.author,
      userAvatar: post.authorAvatar,
      description: `Broadcasted a signal to ${post.college}.`,
      targetId: post.id
    });
  },
  
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    if (!saved) return INITIAL_USERS.map(u => ({...u, joinedColleges: u.joinedColleges || []}));
    return JSON.parse(saved).map((u: any) => ({...u, joinedColleges: u.joinedColleges || []}));
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  
  // Fix: Added saveUser method to handle single user updates
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    db.saveUsers(users);
  },

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    let user = users.find(u => u.id === currentId) || users[0];
    if (!user.joinedColleges) user.joinedColleges = [];
    return user;
  },

  getViolations: (): Violation[] => {
    const saved = localStorage.getItem(DB_KEYS.VIOLATIONS);
    return saved ? JSON.parse(saved) : [];
  },

  likePost: (postId: string) => {
    const posts = db.getPosts();
    const user = db.getUser();
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return posts;

    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    db.savePosts(updated);

    const users = db.getUsers();
    const updatedUsers = users.map(u => u.id === targetPost.authorId ? { ...u, totalLikesCount: (u.totalLikesCount || 0) + 1 } : u);
    db.saveUsers(updatedUsers);

    return updated;
  },

  deletePost: (postId: string, deletedByUserId: string) => {
    const posts = db.getPosts();
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);
    return updated;
  },

  getPolls: (): Poll[] => {
    const saved = localStorage.getItem(DB_KEYS.POLLS);
    if (!saved) return [];
    const polls: Poll[] = JSON.parse(saved);
    const now = new Date().getTime();
    return polls.map(p => ({
      ...p,
      isActive: p.isActive && new Date(p.expiresAt).getTime() > now
    }));
  },

  getEvents: (): LiveEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : [{ id: 'e1', title: 'Makerere 100 Years Celebration', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLive: true, organizer: 'Admin' }];
  },

  // Fix: Added getCalendarEvents method to resolve error in Calendar.tsx
  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  },

  // Fix: Added saveCalendarEvent method to resolve error in Calendar.tsx
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([...events, event]));
  }
};
