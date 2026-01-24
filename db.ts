
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v17',
  USERS: 'maksocial_users_v17',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v8',
  CALENDAR: 'maksocial_calendar_v9',
  ADS: 'maksocial_ads_v4',
  OPPORTUNITIES: 'maksocial_opps_v3'
};

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'IT', 'Information Systems'],
  CEDAT: ['Civil Engineering', 'Electrical Engineering', 'Mechanical', 'Architecture'],
  CHUSS: ['Psychology', 'Social Work', 'Literature', 'History'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  CONAS: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Business Admin', 'Statistics'],
  CEES: ['Education', 'Adult Education'],
  LAW: ['Bachelor of Laws']
};

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 4500000, expenses: 2100000, subscribers: 1240, growth: 12 },
  { month: 'Feb', revenue: 5200000, expenses: 2300000, subscribers: 1560, growth: 25 },
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Operating Systems - 2024 Past Paper',
    category: 'Past Paper',
    college: 'COCIS',
    course: 'Computer Science',
    year: 'Year 2',
    author: 'Admin_Registry',
    downloads: 1240,
    fileType: 'PDF',
    timestamp: '2 days ago'
  },
  {
    id: 'res-2',
    title: 'Structural Analysis III Notes',
    category: 'Notes/Books',
    college: 'CEDAT',
    course: 'Civil Engineering',
    year: 'Year 3',
    author: 'Lecturer_Sync',
    downloads: 890,
    fileType: 'PDF',
    timestamp: '5 days ago'
  },
  {
    id: 'res-3',
    title: 'Constitutional Law - Case Summaries',
    category: 'Notes/Books',
    college: 'LAW',
    course: 'Bachelor of Laws',
    year: 'Year 1',
    author: 'Guild_Vault',
    downloads: 3200,
    fileType: 'DOCX',
    timestamp: '1 week ago'
  }
];

const INITIAL_OPPORTUNITIES: Post[] = [
  {
    id: 'opp-1',
    author: 'Mak AI Lab',
    authorId: 'mak_ailab',
    authorRole: 'Research Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AILab',
    timestamp: '2h ago',
    content: 'Urgent: Seeking 5 Student Developers for a 48-hour NLP data labeling gig. Payment: 150k UGX per node.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Gig', '#AI'],
    likes: 42,
    commentsCount: 12,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: true,
    college: 'COCIS',
    opportunityData: {
      type: 'Gig',
      deadline: getFutureDate(1), 
      isAIVerified: true,
      detectedBenefit: 'Immediate Payment'
    }
  }
];

export const db = {
  getUsers: (): User[] => {
    try {
      const saved = localStorage.getItem(DB_KEYS.USERS);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    return users.find(u => u.id === currentId) || users[0];
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user;
    else users.push(user);
    db.saveUsers(users);
  },
  getPosts: (filter?: College | 'Global'): Post[] => {
    try {
      const saved = localStorage.getItem(DB_KEYS.POSTS);
      let posts: Post[] = MOCK_POSTS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) posts = parsed;
      }
      if (filter && filter !== 'Global') posts = posts.filter(p => p.college === filter);
      return posts;
    } catch (e) {
      return MOCK_POSTS;
    }
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    if (post.isOpportunity) db.addOpportunity(post);
  },
  getOpportunities: (): Post[] => {
    try {
      const saved = localStorage.getItem(DB_KEYS.OPPORTUNITIES);
      let opps: Post[] = INITIAL_OPPORTUNITIES;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) opps = parsed;
      }
      return opps;
    } catch (e) {
      return INITIAL_OPPORTUNITIES;
    }
  },
  saveOpportunities: (opps: Post[]) => localStorage.setItem(DB_KEYS.OPPORTUNITIES, JSON.stringify(opps)),
  addOpportunity: (post: Post) => {
    const opps = db.getOpportunities();
    if (!opps.find(o => o.id === post.id)) {
      db.saveOpportunities([post, ...opps]);
    }
  },
  deletePost: (postId: string) => {
    const posts = db.getPosts();
    db.savePosts(posts.filter(p => p.id !== postId));
    const opps = db.getOpportunities();
    db.saveOpportunities(opps.filter(o => o.id !== postId));
  },
  getResources: (): Resource[] => {
    try {
      const saved = localStorage.getItem(DB_KEYS.RESOURCES);
      if (saved) return JSON.parse(saved);
      return INITIAL_RESOURCES;
    } catch (e) {
      return INITIAL_RESOURCES;
    }
  },
  saveResource: (resource: Resource) => {
    const resources = db.getResources();
    const updated = [resource, ...resources];
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify(updated));
  },
  getCalendarEvents: (): CalendarEvent[] => {
    try {
      const saved = localStorage.getItem(DB_KEYS.CALENDAR);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([event, ...events]));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(ev => {
      if (ev.id === eventId) {
        const attendees = ev.attendeeIds || [];
        if (!attendees.includes(userId)) return { ...ev, attendeeIds: [...attendees, userId] };
      }
      return ev;
    });
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getAds: (): Ad[] => [],
  saveAds: (ads: Ad[]) => {},
  getEvents: () => []
};
