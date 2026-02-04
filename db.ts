
import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage } from './types';
import { MOCK_POSTS, MOCK_CHATS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v27',
  USERS: 'maksocial_users_v26',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v26',
  CALENDAR: 'maksocial_calendar_v26',
  BOOKMARKS: 'maksocial_bookmarks_v26',
  CHATS: 'maksocial_chats_hub_v1',
  EMAILS: 'maksocial_emails_v26_prod_v2',
  NOTIFICATIONS: 'maksocial_notifications_v26',
  EVENTS: 'maksocial_events_v26',
  GROUPS: 'maksocial_groups_v26'
};

const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Advanced Computer Architecture - Final Prep',
    category: 'Notes/Books',
    college: 'COCIS',
    course: 'Computer Science',
    year: 'Year 3',
    author: 'Dr. Julianne O.',
    authorRole: 'Lecturer',
    downloads: 142,
    fileType: 'PDF',
    timestamp: '12 May 2025'
  },
  {
    id: 'res-2',
    title: 'Structural Mechanics II - Past Paper 2024',
    category: 'Past Paper',
    college: 'CEDAT',
    course: 'Civil Engineering',
    year: 'Year 2',
    author: 'Eng. Mugisha P.',
    authorRole: 'GRC CEDAT',
    downloads: 89,
    fileType: 'PDF',
    timestamp: '15 May 2025'
  },
  {
    id: 'res-3',
    title: 'Constitutional Law - Case Study Registry',
    category: 'Research',
    college: 'LAW',
    course: 'Bachelor of Laws',
    year: 'Finalist',
    author: 'Counsel Peter',
    authorRole: 'Official',
    downloads: 210,
    fileType: 'PDF',
    timestamp: '10 May 2025'
  },
  {
    id: 'res-4',
    title: 'Microeconomics Theory - Test Blueprint',
    category: 'Test',
    college: 'COBAMS',
    course: 'Economics',
    year: 'Year 1',
    author: 'Prof. Wandera',
    authorRole: 'Staff',
    downloads: 56,
    fileType: 'PDF',
    timestamp: '18 May 2025'
  },
  {
    id: 'res-5',
    title: 'Human Anatomy - Dissection Guide v4',
    category: 'Notes/Books',
    college: 'CHS',
    course: 'Medicine',
    year: 'Year 2',
    author: 'Dr. Nalule',
    authorRole: 'Academic Council',
    downloads: 320,
    fileType: 'PDF',
    timestamp: '20 May 2025'
  }
];

const MOCK_NOTIFICATIONS: MakNotification[] = [
  {
    id: 'n1',
    type: 'follow',
    title: 'New Node Link',
    description: 'Shamim Nambassa (Guild President) initialized a permanent link with your terminal.',
    timestamp: '2m ago',
    isRead: false,
    meta: { hash: 'U882', nodeId: 'u-shamim', nodeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamim', reason: 'Following' }
  },
  {
    id: 'n2',
    type: 'skill_match',
    title: 'Neural Sync Detected',
    description: 'A node in CEDAT requires your Logic_Strata skills for project "Smart-Grid".',
    timestamp: '15m ago',
    isRead: false,
    meta: { hash: 'A4F2', reason: 'High Compatibility' }
  },
  {
    id: 'n3',
    type: 'event',
    title: 'New Protocol: Research Week',
    description: 'Prof. Barnabas uploaded a new event: "89th Research & Innovation Week". Access the coordination nodes now.',
    timestamp: '1h ago',
    isRead: false,
    meta: { hash: 'EVT9', nodeAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg' }
  }
];

const MOCK_EMAILS: PlatformEmail[] = [
  {
    id: 'e1',
    from: 'vc@mak.ac.ug',
    fromName: 'Prof. Barnabas Nawangwe',
    fromAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    to: ['student@mak.ac.ug'],
    subject: 'Academic Excellence Protocol 2026',
    body: 'Greetings Node,\n\nI am writing to formally synchronize our objectives regarding the upcoming research strata. Your contributions to the university matrix have been noted by the council.\n\nBest regards,\nBarnabas.',
    timestamp: '2h',
    fullDate: 'Feb 15, 2026 10:00 AM',
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    label: 'Important'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u-ninfa',
    name: 'Ninfa Monaldo',
    role: 'Web Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa',
    connections: 1200,
    email: 'ninfa.m@mak.ac.ug',
    college: 'COCIS',
    status: 'Finalist',
    subscriptionTier: 'Pro',
    joinedColleges: ['COCIS'],
    postsCount: 45,
    followersCount: 890,
    followingCount: 150,
    totalLikesCount: 3400,
    badges: ['Verified'],
    verified: true,
    appliedTo: [],
    bio: 'Building the next generation of academic strata.'
  }
];

const parseArray = <T>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) { return fallback; }
};

export const db = {
  getUsers: (): User[] => {
    return parseArray<User>(DB_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    const user = users.find(u => u.id === currentId) || users[0];
    return user;
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user; 
    else users.push(user);
    db.saveUsers(users);
  },
  getPosts: (): Post[] => {
    return parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS);
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
  },
  likePost: (postId: string) => {
    const posts = db.getPosts();
    db.savePosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  },
  addComment: (postId: string, comment: any) => {
    const posts = db.getPosts();
    db.savePosts(posts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), comment], commentsCount: (p.commentsCount || 0) + 1 } : p));
  },
  toggleBookmark: (postId: string) => {
    const bookmarks = parseArray<string>(DB_KEYS.BOOKMARKS, []);
    const idx = bookmarks.indexOf(postId);
    if (idx === -1) bookmarks.push(postId); else bookmarks.splice(idx, 1);
    localStorage.setItem(DB_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return bookmarks;
  },
  getBookmarks: (): string[] => parseArray<string>(DB_KEYS.BOOKMARKS, []),
  getResources: (): Resource[] => parseArray<Resource>(DB_KEYS.RESOURCES, MOCK_RESOURCES),
  saveResource: (resource: Resource) => {
    const current = db.getResources();
    const updated = [resource, ...current];
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify(updated));
    
    // Auto-generate notification for all nodes in the registry
    const notif: MakNotification = {
      id: `n-res-${Date.now()}`,
      type: 'system',
      title: 'Vault Asset Logged',
      description: `${resource.author} committed "${resource.title}" to the ${resource.college} vault Wing.`,
      timestamp: 'Just now',
      isRead: false,
      meta: { hash: 'VLT_SYNC', reason: 'Shared Asset' }
    };
    const notifications = db.getNotifications();
    db.saveNotifications([notif, ...notifications]);
  },
  getCalendarEvents: (): CalendarEvent[] => parseArray<CalendarEvent>(DB_KEYS.CALENDAR, []),
  saveCalendarEvent: (event: CalendarEvent) => localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([event, ...db.getCalendarEvents()])),
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(ev => ev.id === eventId ? { ...ev, attendeeIds: Array.from(new Set([...(ev.attendeeIds || []), userId])) } : ev);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getEmails: (): PlatformEmail[] => parseArray<PlatformEmail>(DB_KEYS.EMAILS, MOCK_EMAILS),
  saveEmails: (emails: PlatformEmail[]) => localStorage.setItem(DB_KEYS.EMAILS, JSON.stringify(emails)),
  getChats: (): ChatConversation[] => parseArray<ChatConversation>(DB_KEYS.CHATS, MOCK_CHATS),
  saveChats: (chats: ChatConversation[]) => localStorage.setItem(DB_KEYS.CHATS, JSON.stringify(chats)),
  getNotifications: (): MakNotification[] => parseArray<MakNotification>(DB_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS),
  saveNotifications: (notifications: MakNotification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
  deletePost: (id: string) => db.savePosts(db.getPosts().filter(p => p.id !== id)),
  getEvents: (): LiveEvent[] => parseArray<LiveEvent>(DB_KEYS.EVENTS, []),
  getOpportunities: (): Post[] => db.getPosts().filter(p => p.isOpportunity),
  getGroups: (): Group[] => parseArray<Group>(DB_KEYS.GROUPS, []),
  saveGroups: (groups: Group[]) => localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(groups)),
  addGroup: (group: Group) => db.saveGroups([...db.getGroups(), group]),
  addGroupMessage: (groupId: string, msg: GroupMessage) => {
    const groups = db.getGroups();
    const updated = groups.map(g => g.id === groupId ? { ...g, messages: [...g.messages, msg] } : g);
    db.saveGroups(updated);
  },
  joinGroup: (groupId: string, userId: string) => {
    const groups = db.getGroups();
    const updated = groups.map(g => g.id === groupId ? { ...g, memberIds: Array.from(new Set([...g.memberIds, userId])) } : g);
    db.saveGroups(updated);
  }
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['CS', 'SE', 'IT', 'IS'],
  CEDAT: ['Architecture', 'CE', 'ME', 'EE'],
  CHUSS: ['Psychology', 'Literature', 'Social Work'],
  CONAS: ['Biology', 'Chemistry', 'Physics'],
  CHS: ['Medicine', 'Nursing'],
  CAES: ['Agriculture', 'Environ'],
  COBAMS: ['Economics', 'Stats'],
  CEES: ['Education'],
  LAW: ['Bachelor of Laws']
};
