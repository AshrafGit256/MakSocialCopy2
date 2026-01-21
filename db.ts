
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v15',
  USERS: 'maksocial_users_v15',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v5',
  CALENDAR: 'maksocial_calendar_v7',
  ADS: 'maksocial_ads_v2'
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'Information Technology', 'Information Systems'],
  CEDAT: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Fine Art'],
  CHUSS: ['Psychology', 'Social Work', 'Literature', 'History'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  CONAS: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Business Admin', 'Statistics'],
  CEES: ['Education', 'Adult Education'],
  LAW: ['Bachelor of Laws']
};

const INITIAL_ADS: Ad[] = [
  { id: 'ad-1', clientName: 'Coke Zero', title: 'Campus Refresh Tour', reach: 45000, status: 'Active', budget: 1200000, spent: 450000, clicks: 1200, deadline: '2025-05-30' },
  { id: 'ad-2', clientName: 'MTN Pulse', title: 'Summer Data Blast', reach: 89000, status: 'Active', budget: 2500000, spent: 1800000, clicks: 5600, deadline: '2025-06-15' },
  { id: 'ad-3', clientName: 'Standard Chartered', title: 'Student Savings Account', reach: 12000, status: 'Pending', budget: 800000, spent: 0, clicks: 0, deadline: '2025-07-01' },
];

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 4500000, expenses: 2100000, subscribers: 1240, growth: 12 },
  { month: 'Feb', revenue: 5200000, expenses: 2300000, subscribers: 1560, growth: 25 },
  { month: 'Mar', revenue: 4800000, expenses: 2200000, subscribers: 1890, growth: 21 },
  { month: 'Apr', revenue: 6100000, expenses: 2800000, subscribers: 2100, growth: 11 },
  { month: 'May', revenue: 7800000, expenses: 3100000, subscribers: 2840, growth: 35 },
  { month: 'Jun', revenue: 8900000, expenses: 3400000, subscribers: 3500, growth: 23 },
];

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Guru A.',
    role: 'University Student',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    subscriptionTier: 'Pro',
    accountStatus: 'Active',
    verified: true,
    joinedColleges: ['COCIS', 'CEDAT'],
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500,
    badges: [],
    appliedTo: [],
    bio: 'Software Engineering student passionate about full-stack development.',
    education: 'B.S. in Software Engineering',
    location: 'Kampala, Uganda',
    skills: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: 'u2',
    name: 'Sarah K.',
    role: 'University Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    connections: 110,
    college: 'LAW',
    status: 'Year 1',
    subscriptionTier: 'Free',
    accountStatus: 'Active',
    verified: false,
    joinedColleges: ['LAW'],
    postsCount: 4,
    followersCount: 230,
    followingCount: 150,
    totalLikesCount: 890,
    badges: [],
    appliedTo: []
  },
  {
    id: 'super_admin',
    name: 'System Admin',
    role: 'Super Admin',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    connections: 5000,
    college: 'COCIS',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    accountStatus: 'Active',
    verified: true,
    email: 'admin@admin.mak.ac.ug',
    joinedColleges: ['COCIS', 'CEDAT', 'LAW'],
    postsCount: 0,
    followersCount: 10000,
    followingCount: 0,
    totalLikesCount: 0,
    badges: ['Super Admin'],
    appliedTo: [],
  }
];

export const db = {
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    return users.find(u => u.id === currentId) || users[0];
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user;
    else users.push(user);
    db.saveUsers(users);
  },
  getPosts: (filter?: College | 'Global', showExpired = false): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    let posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;
    if (filter && filter !== 'Global') posts = posts.filter(p => p.college === filter);
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts(undefined, true);
    db.savePosts([post, ...posts]);
  },
  updatePost: (updatedPost: Post) => {
    const posts = db.getPosts(undefined, true);
    const updated = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    db.savePosts(updated);
  },
  deletePost: (postId: string, userId: string) => {
    const posts = db.getPosts(undefined, true);
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);
  },
  getResources: (): Resource[] => {
    const saved = localStorage.getItem(DB_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : [];
  },
  saveResources: (resources: Resource[]) => localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify(resources)),
  addResource: (res: Resource) => {
    const resources = db.getResources();
    db.saveResources([res, ...resources]);
  },
  deleteResource: (id: string) => {
    const resources = db.getResources();
    db.saveResources(resources.filter(r => r.id !== id));
  },
  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex !== -1) events[existingIndex] = event;
    else events.push(event);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(events));
  },
  deleteCalendarEvent: (id: string) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(events.filter(e => e.id !== id)));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(e => e.id === eventId ? { ...e, attendeeIds: [...(e.attendeeIds || []), userId] } : e);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getAds: (): Ad[] => {
    const saved = localStorage.getItem(DB_KEYS.ADS);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  },
  saveAds: (ads: Ad[]) => localStorage.setItem(DB_KEYS.ADS, JSON.stringify(ads)),
  getEvents: () => []
};
