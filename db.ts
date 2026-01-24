
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType, Notification } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v17',
  USERS: 'maksocial_users_v17',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v8',
  CALENDAR: 'maksocial_calendar_v9',
  ADS: 'maksocial_ads_v4',
  OPPORTUNITIES: 'maksocial_opps_v3',
  NOTIFICATIONS: 'maksocial_notifications_v1'
};

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'n1',
    type: 'skill_match',
    title: 'AI Node Sync: Skill Detected',
    description: 'A new Research Grant in COCIS matches your credentials in [Python, AI Research].',
    timestamp: '10m ago',
    isRead: false,
    meta: { reason: 'AI SCAN', hash: '8f2a11' }
  },
  {
    id: 'n2',
    type: 'event',
    title: 'Protocol Reminder: Guild Assembly',
    description: 'The Emergency Guild Assembly at Freedom Square initiates tomorrow @ 10:00 AM.',
    timestamp: '2h ago',
    isRead: false,
    meta: { reason: 'CALENDAR', hash: 'e992bc' }
  },
  {
    id: 'n3',
    type: 'follow',
    title: 'New Node Uplink',
    description: 'Sarah CEDAT initiated a follow sequence with your node profile.',
    timestamp: '5h ago',
    isRead: true,
    meta: { nodeId: 'sarah_cedat', reason: 'NETWORK', hash: '411a0d' }
  },
  {
    id: 'n4',
    type: 'engagement',
    title: 'Signal Upvoted',
    description: 'Admin Registry and 12 others upvoted your latest Broadcast Signal.',
    timestamp: '1d ago',
    isRead: true,
    meta: { reason: 'ENGAGEMENT', hash: 'd9b1c2' }
  }
];

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
  getAds: (): Ad[] => parseArray<Ad>(DB_KEYS.ADS, []),
  saveAds: (ads: Ad[]) => localStorage.setItem(DB_KEYS.ADS, JSON.stringify(ads)),
  getNotifications: (): Notification[] => parseArray<Notification>(DB_KEYS.NOTIFICATIONS, INITIAL_NOTIFS),
  saveNotifications: (notifs: Notification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  addNotification: (notif: Notification) => {
    const notifs = db.getNotifications();
    db.saveNotifications([notif, ...notifs]);
  },
  getEvents: () => []
};
