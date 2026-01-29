
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
  EMAILS: 'maksocial_emails_v3'
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
    from: 'bettehagenes@gmail.com',
    fromName: 'Bette Hagenes',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bette',
    to: ['admin@mak.ac.ug'],
    subject: 'Project Handover / Final Strata',
    body: 'Hello! Bette\n\nI hope you\'re doing well. I would like to schedule a one-on-one meeting with you to discussing a new project. I\'ll send over the agenda in advance.\nThe meeting will be in my office, will you be available one-on-one 10 Oct, 2024 at 10PM? It\'s important that we have this meeting so that we can continue to work effectively together.\n\nI hope you can make it!\nBest,\nAR team',
    timestamp: 'sep 29',
    fullDate: 'Sep 29 2024, 4:00 PM',
    isRead: false,
    isStarred: false,
    folder: 'inbox',
    label: 'Important',
    attachments: [
      { id: 'at-1', name: "Meeting Paper's", size: '1MB', type: 'file' },
      { id: 'at-2', name: "Project Details", size: '18 Files', type: 'folder' }
    ]
  },
  {
    id: 'em-2',
    from: 'genehart@gmail.com',
    fromName: 'Gene Hart',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gene',
    to: ['admin@mak.ac.ug'],
    subject: 'System Software update / Node Sync',
    body: 'This is the content of the email. It may contain anything the user needs to broadcast across the hill nodes. System software is closer to the computer system.',
    timestamp: 'sep 23',
    fullDate: 'Sep 23 2024, 11:00 AM',
    isRead: true,
    isStarred: true,
    folder: 'inbox',
    label: 'Important'
  },
  {
    id: 'em-3',
    from: 'neilfisher@gmail.com',
    fromName: 'Neil Fisher',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neil',
    to: ['admin@mak.ac.ug'],
    subject: 'Resource Upload Protocol',
    body: 'It enables users to easily send and receive documents, images, links and other assets. An important feature of application software.',
    timestamp: 'Oct 23',
    fullDate: 'Oct 23 2024, 2:30 PM',
    isRead: true,
    isStarred: true,
    folder: 'inbox',
    label: 'Company'
  },
  {
    id: 'em-4',
    from: 'simonyoung@gmail.com',
    fromName: 'Simon Young',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simon',
    to: ['admin@mak.ac.ug'],
    subject: 'Cluster Authorization',
    body: 'Companies can use email to convey information to a large number of nodes simultaneously. This is a broadcast test.',
    timestamp: 'Dec 22',
    fullDate: 'Dec 22 2024, 9:00 AM',
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    label: 'Social'
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
