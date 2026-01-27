import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType, Notification, AuditLog, FlaggedContent } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v17',
  USERS: 'maksocial_users_v17',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v8',
  CALENDAR: 'maksocial_calendar_v9',
  ADS: 'maksocial_ads_v4',
  OPPORTUNITIES: 'maksocial_opps_v3',
  NOTIFICATIONS: 'maksocial_notifications_v1',
  AUDIT_LOGS: 'maksocial_audit_v1',
  FLAGGED: 'maksocial_flagged_v1'
};

const INITIAL_AUDITS: AuditLog[] = [
  { id: 'a1', action: 'User Suspended', admin: 'SuperAdmin_X', target: 'Node_882', timestamp: '10m ago', severity: 'danger' },
  { id: 'a2', action: 'Registry Decryption', admin: 'System_Auto', target: 'Vault_Alpha', timestamp: '1h ago', severity: 'info' },
  { id: 'a3', action: 'Ad Approved', admin: 'AdManager_1', target: 'Centenary_Node', timestamp: '3h ago', severity: 'info' },
  { id: 'a4', action: 'Failed Login Attempt', admin: 'Sentinel', target: 'IP: 192.168.1.104', timestamp: '5h ago', severity: 'warning' },
];

const INITIAL_FLAGGED: FlaggedContent[] = [
  { id: 'f1', contentType: 'post', reason: 'Spam/Advertisement', reportedBy: 'u122', contentPreview: 'Buy cheap assignments now...', timestamp: '2h ago', status: 'pending' },
  { id: 'f2', contentType: 'user', reason: 'Impersonation', reportedBy: 'u88', contentPreview: 'Profile claiming to be VC', timestamp: '1d ago', status: 'pending' },
];

const INITIAL_ADS: Ad[] = [
  { id: 'ad1', clientName: 'Centenary Bank', title: 'Student Loan Protocol', reach: 45000, status: 'Active', budget: 1500000, spent: 850000, clicks: 1200, deadline: '2026-06-01' },
  { id: 'ad2', clientName: 'SafeBoda', title: 'Campus Delivery Alpha', reach: 28000, status: 'Active', budget: 500000, spent: 480000, clicks: 950, deadline: '2026-05-15' },
  { id: 'ad3', clientName: 'MTN Uganda', title: 'Data Pulse Bundle', reach: 89000, status: 'Active', budget: 2500000, spent: 1200000, clicks: 5400, deadline: '2026-12-31' },
];

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 4500000, expenses: 2100000, subscribers: 1240, growth: 12 },
  { month: 'Feb', revenue: 5200000, expenses: 2300000, subscribers: 1560, growth: 25 },
  { month: 'Mar', revenue: 4800000, expenses: 2200000, subscribers: 1720, growth: 10 },
  { month: 'Apr', revenue: 6100000, expenses: 2800000, subscribers: 2100, growth: 22 },
  { month: 'May', revenue: 7500000, expenses: 3100000, subscribers: 2550, growth: 18 },
];

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

const parseArray = <T>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.error(`Error parsing ${key} from storage:`, e);
    return fallback;
  }
};

export const db = {
  getUsers: (): User[] => parseArray<User>(DB_KEYS.USERS, []),
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return users[0] || {
      id: 'guest',
      name: 'Guest Node',
      role: 'Visitor',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Guest',
      connections: 0,
      college: 'Global',
      status: 'Year 1',
      subscriptionTier: 'Free',
      verified: true, // Protocol Update: All Guest Nodes are initialized as verified
      joinedColleges: ['Global'],
      postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0, badges: [], appliedTo: []
    };
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user;
    else users.push(user);
    db.saveUsers(users);
  },
  toggleVerification: (userId: string) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, verified: !u.verified } : u);
    db.saveUsers(updated);
  },
  getPosts: (filter?: College | 'Global'): Post[] => {
    let posts = parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS);
    if (filter && filter !== 'Global') {
      posts = posts.filter(p => p.college === filter);
    }
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    if (post.isOpportunity) db.addOpportunity(post);
  },
  getOpportunities: (): Post[] => parseArray<Post>(DB_KEYS.OPPORTUNITIES, []),
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
  getResources: (): Resource[] => parseArray<Resource>(DB_KEYS.RESOURCES, []),
  saveResource: (resource: Resource) => {
    const resources = db.getResources();
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([resource, ...resources]));
  },
  getCalendarEvents: (): CalendarEvent[] => parseArray<CalendarEvent>(DB_KEYS.CALENDAR, []),
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
  getAds: (): Ad[] => parseArray<Ad>(DB_KEYS.ADS, INITIAL_ADS),
  saveAds: (ads: Ad[]) => localStorage.setItem(DB_KEYS.ADS, JSON.stringify(ads)),
  getNotifications: (): Notification[] => parseArray<Notification>(DB_KEYS.NOTIFICATIONS, []),
  saveNotifications: (notifs: Notification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  addNotification: (notif: Notification) => {
    const notifs = db.getNotifications();
    db.saveNotifications([notif, ...notifs]);
  },
  getAuditLogs: (): AuditLog[] => parseArray<AuditLog>(DB_KEYS.AUDIT_LOGS, INITIAL_AUDITS),
  getFlagged: (): FlaggedContent[] => parseArray<FlaggedContent>(DB_KEYS.FLAGGED, INITIAL_FLAGGED),
  getEvents: () => []
};