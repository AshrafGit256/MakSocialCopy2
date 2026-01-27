
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType, Notification, AuditLog, FlaggedContent } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v20',
  USERS: 'maksocial_users_v20',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v10',
  CALENDAR: 'maksocial_calendar_v10',
  ADS: 'maksocial_ads_v5',
  OPPORTUNITIES: 'maksocial_opps_v5',
  NOTIFICATIONS: 'maksocial_notifications_v5',
  BOOKMARKS: 'maksocial_bookmarks_v1'
};

// @fix: Added missing REVENUE_HISTORY export
export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 800000, expenses: 400000, subscribers: 120, growth: 5 },
  { month: 'Feb', revenue: 950000, expenses: 420000, subscribers: 145, growth: 12 },
  { month: 'Mar', revenue: 1200000, expenses: 450000, subscribers: 180, growth: 18 },
  { month: 'Apr', revenue: 1100000, expenses: 480000, subscribers: 175, growth: -2 },
  { month: 'May', revenue: 1400000, expenses: 500000, subscribers: 210, growth: 22 },
  { month: 'Jun', revenue: 1600000, expenses: 550000, subscribers: 240, growth: 15 },
];

// @fix: Added missing COURSES_BY_COLLEGE export
export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'Information Technology', 'Information Systems'],
  CEDAT: ['Architecture', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
  CHUSS: ['Psychology', 'Social Work', 'Literature', 'Philosophy'],
  CONAS: ['Mathematics', 'Physics', 'Biology', 'Chemistry'],
  CHS: ['Medicine', 'Surgery', 'Nursing', 'Pharmacy'],
  CAES: ['Agriculture', 'Environment Science', 'Food Science'],
  COBAMS: ['Economics', 'Business Administration', 'Statistics'],
  CEES: ['Education', 'Adult Education', 'Open & Distance Learning'],
  LAW: ['Commercial Law', 'Public Law', 'Civil Law']
};

const parseArray = <T>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
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
  },
  toggleBookmark: (postId: string) => {
    const bookmarks = parseArray<string>(DB_KEYS.BOOKMARKS, []);
    const index = bookmarks.indexOf(postId);
    if (index === -1) bookmarks.push(postId);
    else bookmarks.splice(index, 1);
    localStorage.setItem(DB_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return bookmarks;
  },
  getBookmarks: (): string[] => parseArray<string>(DB_KEYS.BOOKMARKS, []),
  deletePost: (postId: string) => {
    const posts = db.getPosts();
    db.savePosts(posts.filter(p => p.id !== postId));
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
  getNotifications: (): Notification[] => parseArray<Notification>(DB_KEYS.NOTIFICATIONS, []),
  saveNotifications: (notifs: Notification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  addNotification: (notif: Notification) => {
    const notifs = db.getNotifications();
    db.saveNotifications([notif, ...notifs]);
  },
  // @fix: Added missing getOpportunities method
  getOpportunities: (): Post[] => {
    const posts = db.getPosts();
    return posts.filter(p => p.isOpportunity);
  },
  getAuditLogs: (): AuditLog[] => [],
  getFlagged: (): FlaggedContent[] => [],
  getEvents: () => []
};
