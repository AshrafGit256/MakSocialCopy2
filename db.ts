
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

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'COCIS Annual Hackathon 2025',
    description: 'A 48-hour sprint for developers and innovators to build the next generation of campus solutions. Prize pool of 5M UGX.',
    date: getFutureDate(2),
    time: '09:00',
    location: 'COCIS Block B Labs',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200',
    createdBy: 'super_admin',
    attendeeIds: []
  },
  {
    id: 'e2',
    title: 'Freshers Bazaar Finale',
    description: 'The final night of the Bazaar. Live performances, vendor discounts, and networking nodes for all new arrivals.',
    date: getFutureDate(5),
    time: '18:00',
    location: 'Freedom Square',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200',
    createdBy: 'super_admin',
    attendeeIds: []
  },
  {
    id: 'e3',
    title: 'Career & Internship Expo',
    description: 'Meet industry leaders from MTN, Stanbic, and Google. Secure your internship node for the upcoming semester.',
    date: getFutureDate(12),
    time: '10:00',
    location: 'Main Hall',
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=1200',
    createdBy: 'super_admin',
    attendeeIds: []
  },
  {
    id: 'e4',
    title: 'Law Society Moot Court',
    description: 'High-stakes legal simulation featuring top finalists and guest judges from the High Court.',
    date: getFutureDate(15),
    time: '14:00',
    location: 'Law Auditorium',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200',
    createdBy: 'super_admin',
    attendeeIds: []
  }
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
    id: 'u3',
    name: 'Kevin M.',
    role: 'Graduate',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    connections: 560,
    college: 'CEDAT',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    accountStatus: 'Active',
    verified: true,
    joinedColleges: ['CEDAT', 'COCIS'],
    postsCount: 25,
    followersCount: 800,
    followingCount: 200,
    totalLikesCount: 2100,
    badges: ['Alumni'],
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
  },
  {
    id: 'mak_unipod',
    name: 'MakUnipod',
    role: 'Innovation Wing',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Unipod',
    connections: 1200,
    college: 'CEDAT',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['CEDAT', 'COCIS'],
    postsCount: 45,
    followersCount: 3400,
    followingCount: 10,
    totalLikesCount: 12000,
    badges: ['Official'],
    appliedTo: [],
    bio: 'The Makerere University Innovation Pod. Transforming student ideas into viable prototypes.'
  },
  {
    id: 'mak_ailab',
    name: 'Mak AI Lab',
    role: 'Research Center',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AILab',
    connections: 800,
    college: 'COCIS',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['COCIS'],
    postsCount: 110,
    followersCount: 5600,
    followingCount: 5,
    totalLikesCount: 15000,
    badges: ['Official'],
    appliedTo: [],
    bio: 'Artificial Intelligence & Data Science lab at Makerere University. Leading Africa through neural logic.'
  },
  {
    id: 'mak_library',
    name: 'Main Library',
    role: 'Knowledge Hub',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Library',
    connections: 10000,
    college: 'CHUSS',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['CHUSS', 'CONAS', 'CEDAT', 'COCIS'],
    postsCount: 300,
    followersCount: 45000,
    followingCount: 2,
    totalLikesCount: 89000,
    badges: ['Official'],
    appliedTo: [],
    bio: 'The custodian of knowledge at the Hill. 24/7 reading nodes and digital repository access.'
  },
  {
    id: 'vc_office',
    name: 'Office of the VC',
    role: 'University Leadership',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC',
    connections: 5000,
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['Global'],
    postsCount: 500,
    followersCount: 100000,
    followingCount: 1,
    totalLikesCount: 250000,
    badges: ['Super Admin'],
    appliedTo: [],
    bio: 'Official node for the Vice Chancellor, Makerere University. Registry and policy updates.'
  },
  {
    id: 'centenary_bank',
    name: 'Centenary Bank',
    role: 'Financial Partner',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cente',
    connections: 4500,
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['Global'],
    postsCount: 150,
    followersCount: 12000,
    followingCount: 20,
    totalLikesCount: 34000,
    badges: ['Corporate'],
    appliedTo: [],
    bio: 'The bank that cares for students. Cente-Connect banking nodes across campus.'
  },
  {
    id: 'stanbic_bank',
    name: 'Stanbic Bank',
    role: 'Commercial Partner',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Stanbic',
    connections: 3200,
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['Global'],
    postsCount: 80,
    followersCount: 15000,
    followingCount: 15,
    totalLikesCount: 21000,
    badges: ['Corporate'],
    appliedTo: [],
    bio: 'Moving forward together. Leading the Stanbic National Schools & University Championship.'
  },
  {
    id: 'covab_agro',
    name: 'Agro-Chemical Hub',
    role: 'Research & Science',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Agro',
    connections: 900,
    college: 'CAES',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    verified: true,
    joinedColleges: ['CAES', 'CONAS'],
    postsCount: 60,
    followersCount: 2100,
    followingCount: 8,
    totalLikesCount: 7800,
    badges: ['Corporate'],
    appliedTo: [],
    bio: 'Syngenta & Agro-Solutions Collective at CoVAB. Innovation in precision agriculture.'
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
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
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
