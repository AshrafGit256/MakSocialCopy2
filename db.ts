import { Post, User, College, UserStatus, CollegeStats, LeadershipMember, TimelineEvent, CalendarEvent, Violation, LiveEvent } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v12',
  USERS: 'maksocial_users_v12',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  CALENDAR: 'maksocial_calendar_v4',
  COLLEGE_STATS: 'maksocial_college_stats_v12',
  TIMELINE: 'maksocial_timeline_v5'
};

const INITIAL_LEADERSHIP: Record<College, LeadershipMember[]> = {
  COCIS: [
    { id: 'l1', name: 'Dr. John Kizito', role: 'Lecturer', email: 'john.kizito@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l1' },
    { id: 'l2', name: 'Prof. Jude Lubega', role: 'Administrator', email: 'admin.cocis@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l2' },
    { id: 'l3', name: 'Opio Samuel', role: 'Chairperson', email: 'opio.s@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l3' }
  ],
  CEDAT: [], CHUSS: [], CHS: [], CONAS: [], CAES: [], COBAMS: [], CEES: [], LAW: []
};

const INITIAL_COLLEGE_STATS: CollegeStats[] = [
  { id: 'COCIS', followers: 1250, postCount: 450, dean: 'Prof. Tonny Oyana', description: 'Center for Computing and Information Sciences.', leadership: INITIAL_LEADERSHIP.COCIS },
  { id: 'CEDAT', followers: 850, postCount: 320, dean: 'Prof. Henry Alinaitwe', description: 'Engineering, Design, Art and Technology.', leadership: [] },
  { id: 'CHUSS', followers: 920, postCount: 280, dean: 'Dr. Josephine Ahikire', description: 'Humanities and Social Sciences.', leadership: [] },
  { id: 'CHS', followers: 1500, postCount: 600, dean: 'Prof. Damalie Nakanjako', description: 'College of Health Sciences.', leadership: [] },
  { id: 'CONAS', followers: 640, postCount: 150, dean: 'Prof. J.Y.T. Mugisha', description: 'College of Natural Sciences.', leadership: [] },
  { id: 'CAES', followers: 510, postCount: 120, dean: 'Prof. Bernard Bashaasha', description: 'Agricultural and Environmental Sciences.', leadership: [] },
  { id: 'COBAMS', followers: 1100, postCount: 410, dean: 'Prof. Eria Hisali', description: 'Business and Management Sciences.', leadership: [] },
  { id: 'CEES', followers: 730, postCount: 210, dean: 'Prof. Anthony Muwagga Mugagga', description: 'Education and External Studies.', leadership: [] },
  { id: 'LAW', followers: 1300, postCount: 500, dean: 'Dr. Ronald Naluwairo', description: 'The School of Law.', leadership: [] }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Guru A.',
    role: 'Student',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    joinedColleges: ['COCIS'],
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500,
    badges: [],
    appliedTo: []
  },
  {
    id: 'admin_cocis',
    name: 'COCIS Admin',
    role: 'College Administrator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    connections: 1000,
    college: 'COCIS',
    status: 'Masters',
    email: 'admin.cocis@mak.ac.ug',
    joinedColleges: ['COCIS'],
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    totalLikesCount: 0,
    badges: [],
    appliedTo: []
  }
];

export const db = {
  getCollegeStats: (): CollegeStats[] => {
    const saved = localStorage.getItem(DB_KEYS.COLLEGE_STATS);
    return saved ? JSON.parse(saved) : INITIAL_COLLEGE_STATS;
  },
  saveCollegeStats: (stats: CollegeStats[]) => localStorage.setItem(DB_KEYS.COLLEGE_STATS, JSON.stringify(stats)),

  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    const users: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    return users.map(u => ({ ...u, joinedColleges: u.joinedColleges || [] }));
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    const user = users.find(u => u.id === currentId) || users[0];
    return { ...user, joinedColleges: user.joinedColleges || [] };
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    const updatedUser = { ...user, joinedColleges: user.joinedColleges || [] };
    if (index !== -1) users[index] = updatedUser;
    else users.push(updatedUser);
    db.saveUsers(users);
  },

  getPosts: (filter?: College | 'Global'): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    let posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;
    if (filter) posts = posts.filter(p => p.college === filter || p.isAd || p.isMakTV);
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
  },
  deletePost: (postId: string, userId: string) => {
    const posts = db.getPosts();
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);
    return updated;
  },

  joinCollege: (userId: string, collegeId: College) => {
    const users = db.getUsers();
    const stats = db.getCollegeStats();
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const joined = u.joinedColleges || [];
        if (!joined.includes(collegeId)) {
          return { ...u, joinedColleges: [...joined, collegeId] };
        }
      }
      return u;
    });
    const updatedStats = stats.map(s => {
      if (s.id === collegeId) return { ...s, followers: s.followers + 1 };
      return s;
    });
    db.saveUsers(updatedUsers);
    db.saveCollegeStats(updatedStats);
  },

  updateCollegeLeadership: (collegeId: College, leadership: LeadershipMember[]) => {
    const stats = db.getCollegeStats();
    const updated = stats.map(s => s.id === collegeId ? { ...s, leadership } : s);
    db.saveCollegeStats(updated);
  },

  logTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const saved = localStorage.getItem(DB_KEYS.TIMELINE);
    const timeline = saved ? JSON.parse(saved) : [];
    const newEvent = { ...event, id: Date.now().toString(), timestamp: new Date().toISOString() };
    localStorage.setItem(DB_KEYS.TIMELINE, JSON.stringify([newEvent, ...timeline].slice(0, 50)));
  },

  getTimeline: (): TimelineEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.TIMELINE);
    return saved ? JSON.parse(saved) : [];
  },

  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([...events, event]));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(e => e.id === eventId ? { ...e, attendeeIds: [...(e.attendeeIds || []), userId] } : e);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },

  getEvents: (): LiveEvent[] => [
    {
      id: 'live-1',
      title: 'Makerere Innovation Hub Seminar',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      organizer: 'Mak Innovation Lab',
      isLive: true
    }
  ],

  getViolations: (): Violation[] => [],
  getPolls: () => []
};