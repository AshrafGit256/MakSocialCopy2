
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType, Notification, AuditLog, FlaggedContent, Comment, Group, GroupMessage, PlatformEmail } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v21',
  USERS: 'maksocial_users_v20',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v10',
  CALENDAR: 'maksocial_calendar_v10',
  ADS: 'maksocial_ads_v5',
  OPPORTUNITIES: 'maksocial_opps_v5',
  NOTIFICATIONS: 'maksocial_notifications_v5',
  BOOKMARKS: 'maksocial_bookmarks_v1',
  GROUPS: 'maksocial_groups_v1',
  EMAILS: 'maksocial_emails_v1'
};

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 4000, expenses: 2500, subscribers: 120, growth: 5 },
  { month: 'Feb', revenue: 4500, expenses: 2600, subscribers: 145, growth: 8 },
  { month: 'Mar', revenue: 5000, expenses: 2800, subscribers: 180, growth: 12 },
  { month: 'Apr', revenue: 6200, expenses: 3100, subscribers: 210, growth: 15 },
  { month: 'May', revenue: 7800, expenses: 3500, subscribers: 240, growth: 20 },
  { month: 'Jun', revenue: 3500, expenses: 2000, subscribers: 250, growth: -5 }
];

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'Information Systems', 'Information Technology'],
  CEDAT: ['Architecture', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
  CHUSS: ['Psychology', 'Philosophy', 'Literature', 'Social Work'],
  CONAS: ['Mathematics', 'Physics', 'Biology', 'Chemistry'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Public Health'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Statistics', 'Business Administration', 'Actuarial Science'],
  CEES: ['Education', 'Adult Education', 'Human Resource Development'],
  LAW: ['Civil Law', 'Criminal Law', 'International Law', 'Human Rights']
};

const MOCK_EMAILS: PlatformEmail[] = [
  {
    id: 'em-1',
    from: 'vc@mak.ac.ug',
    fromName: 'Prof. Barnabas Nawangwe',
    to: ['admin@mak.ac.ug'],
    subject: 'Hill Intelligence Strategy 2026',
    body: 'The central registry requires a full audit of all active signals in the COCIS wing before the end of the semester.',
    timestamp: '10:00 AM',
    isRead: false,
    folder: 'inbox'
  },
  {
    id: 'em-2',
    from: 'support@mak.ac.ug',
    fromName: 'Technical Council',
    to: ['admin@mak.ac.ug'],
    subject: 'System Maintenance: Node Blackout',
    body: 'We are scheduling a brief blackout for neural network maintenance on Saturday at 0300hrs.',
    timestamp: 'Yesterday',
    isRead: true,
    folder: 'inbox'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'vc_office',
    name: 'Prof. Barnabas Nawangwe',
    role: 'Vice Chancellor',
    avatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    connections: 45200,
    email: 'vc@mak.ac.ug',
    altEmail: 'barnabas.n@gmail.com',
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    joinedColleges: ['Global'],
    postsCount: 142,
    followersCount: 52000,
    followingCount: 12,
    totalLikesCount: 89000,
    badges: ['Official', 'Administrator', 'Verified'],
    appliedTo: [],
    bio: 'Architect of the Hill\'s future.',
    location: 'Main Administration Wing',
    skills: ['Institutional Leadership', 'Strategy'],
    socials: { twitter: '@ProfBarnabas', linkedin: 'bnawangwe', gmail: 'barnabas.n@gmail.com' }
  },
  {
    id: 'u-jayda',
    name: 'Jayda Ferry',
    role: 'Marketing Management',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jayda',
    connections: 840,
    email: 'jayda.f@mak.ac.ug',
    altEmail: 'jayda.ferry88@gmail.com',
    college: 'COBAMS',
    status: 'Finalist',
    subscriptionTier: 'Pro',
    joinedColleges: ['COBAMS'],
    postsCount: 20,
    followersCount: 450,
    followingCount: 210,
    totalLikesCount: 1200,
    badges: [],
    appliedTo: [],
    bio: 'The Marketing Development Manager builds a customer base for the food platform.',
    socials: { facebook: 'jayda.ferry', twitter: '@jayda_f', gmail: 'jayda.ferry88@gmail.com' }
  },
  {
    id: 'u-liya',
    name: 'Liya Tokyo',
    role: 'CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liya',
    connections: 2500,
    email: 'liya.t@admin.mak.ac.ug',
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    joinedColleges: ['Global'],
    postsCount: 45,
    followersCount: 8900,
    followingCount: 15,
    totalLikesCount: 15000,
    badges: ['Administrator', 'Verified'],
    appliedTo: [],
    bio: 'Manage overall operations and make major decisions affecting the platform.',
    socials: { linkedin: 'liyatokyo' }
  }
];

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
  getUsers: (): User[] => parseArray<User>(DB_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return users[0];
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
    if (filter && filter !== 'Global') posts = posts.filter(p => p.college === filter);
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
  },
  deletePost: (postId: string) => {
    const posts = db.getPosts();
    db.savePosts(posts.filter(p => p.id !== postId));
  },
  likePost: (postId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    db.savePosts(updated);
  },
  addComment: (postId: string, comment: Comment) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { 
      ...p, 
      comments: [...(p.comments || []), comment],
      commentsCount: (p.commentsCount || 0) + 1
    } : p);
    db.savePosts(updated);
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
        else return { ...ev, attendeeIds: attendees.filter(id => id !== userId) };
      }
      return ev;
    });
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  toggleVerification: (userId: string) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, verified: !u.verified } : u);
    db.saveUsers(updated);
  },
  getAds: (): Ad[] => parseArray<Ad>(DB_KEYS.ADS, []),
  getNotifications: (): Notification[] => parseArray<Notification>(DB_KEYS.NOTIFICATIONS, []),
  saveNotifications: (notifs: Notification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  addNotification: (notif: Notification) => {
    const notifs = db.getNotifications();
    db.saveNotifications([notif, ...notifs]);
  },
  getOpportunities: (): Post[] => {
    const posts = db.getPosts();
    return posts.filter(p => p.isOpportunity);
  },
  getGroups: (): Group[] => parseArray<Group>(DB_KEYS.GROUPS, []),
  saveGroups: (groups: Group[]) => localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(groups)),
  joinGroup: (groupId: string, userId: string) => {
    const groups = db.getGroups();
    const updated = groups.map(g => {
      if (g.id === groupId && !g.memberIds.includes(userId)) {
        return { ...g, memberIds: [...g.memberIds, userId] };
      }
      return g;
    });
    db.saveGroups(updated);
  },
  addGroupMessage: (groupId: string, msg: GroupMessage) => {
    const groups = db.getGroups();
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return { ...g, messages: [...(g.messages || []), msg] };
      }
      return g;
    });
    db.saveGroups(updated);
  },
  getEmails: (): PlatformEmail[] => parseArray<PlatformEmail>(DB_KEYS.EMAILS, MOCK_EMAILS),
  saveEmails: (emails: PlatformEmail[]) => localStorage.setItem(DB_KEYS.EMAILS, JSON.stringify(emails)),
  sendEmail: (email: PlatformEmail) => {
    const emails = db.getEmails();
    db.saveEmails([email, ...emails]);
  },
  getAuditLogs: (): AuditLog[] => [],
  getFlagged: (): FlaggedContent[] => [],
  getEvents: () => []
};
