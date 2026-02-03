
import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v27',
  USERS: 'maksocial_users_v26',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v26',
  CALENDAR: 'maksocial_calendar_v26',
  BOOKMARKS: 'maksocial_bookmarks_v26',
  CHATS: 'maksocial_chats_hub_v1',
  EMAILS: 'maksocial_emails_v26_prod',
  NOTIFICATIONS: 'maksocial_notifications_v26',
  EVENTS: 'maksocial_events_v26',
  GROUPS: 'maksocial_groups_v26'
};

const MOCK_EMAILS: PlatformEmail[] = [
  {
    id: 'e1',
    from: 'vc@mak.ac.ug',
    fromName: 'Prof. Barnabas Nawangwe',
    fromAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    to: ['student@mak.ac.ug'],
    subject: 'Academic Excellence Protocol 2026',
    body: 'Greetings Node,\n\nI am writing to formally synchronize our objectives regarding the upcoming research strata. Your contributions to the university matrix have been noted by the council. Please ensure your research assets are committed to the vault before the semester blackout.\n\nBest regards,\nBarnabas.',
    timestamp: '2h',
    fullDate: 'Feb 15, 2026 10:00 AM',
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    label: 'Important'
  },
  {
    id: 'e2',
    from: 'fintech@hub.ug',
    fromName: 'Neil Fisher',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neil',
    to: ['student@mak.ac.ug'],
    subject: 'Internship Logic Synchronization',
    body: 'Hello,\n\nOur fintech lab is seeking new nodes for the mobile money strata. We enabled users to easily send and receive documents and we need someone to optimize the transaction telemetry.\n\nRegards,\nNeil.',
    timestamp: 'Oct 23',
    fullDate: 'Oct 23, 2025 4:00 PM',
    isRead: true,
    isStarred: true,
    folder: 'inbox',
    label: 'Company'
  },
  {
    id: 'e3',
    from: 'simon.young@mak.ac.ug',
    fromName: 'Simon Young',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simon',
    to: ['student@mak.ac.ug'],
    subject: 'Social Strata Update',
    body: 'Hey,\n\nCompanies can use email to convey information to a large number of nodes. We are organizing a peer-to-peer logic exchange at the Freedom Square. You should synchronize with us.\n\nSimon.',
    timestamp: 'Dec 22',
    fullDate: 'Dec 22, 2025 11:30 AM',
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    label: 'Social'
  },
  {
    id: 'e4',
    from: 'gene.hart@cocis.mak.ac.ug',
    fromName: 'Gene Hart',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gene',
    to: ['student@mak.ac.ug'],
    subject: 'System Software Stratification',
    body: 'This is the content of the email. It may contain anything the user needs. System Software is closer to the computer system and we need to discuss the low-level logic implementation.',
    timestamp: 'Sep 23',
    fullDate: 'Sep 23, 2025 2:15 PM',
    isRead: false,
    isStarred: false,
    folder: 'inbox',
    label: 'Important'
  },
  {
    id: 'e5',
    from: 'bette.h@gmail.com',
    fromName: 'Bette Haganes',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bette',
    to: ['student@mak.ac.ug'],
    subject: 'One-on-one Meeting Protocol',
    body: 'Hello Bette,\n\nI hope you\'re doing well. I would like to schedule a one-on-one meeting with you to discussing a new project. I\'ll send over the agenda in advance. The meeting will be in my office, will you be available one-on-one 10 Oct, 2024 at 10PM ? It\'s important that we have this meeting so that we can continue to work effectively together.\n\nI hope you can make it!\n\nBest,\nAR team',
    timestamp: 'Sep 29',
    fullDate: 'Sep 29, 2024 4:00 PM',
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    label: 'Company',
    attachments: [
      { id: 'att1', name: 'Meeting Paper.pdf', size: '1MB', type: 'pdf' },
      { id: 'att2', name: 'Project Details', size: '18 Files', type: 'folder' }
    ]
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
  },
  {
    id: 'u-sarah',
    name: 'Sarah CEDAT',
    role: 'Visual Architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    connections: 840,
    email: 'sarah.c@mak.ac.ug',
    college: 'CEDAT',
    status: 'Finalist',
    subscriptionTier: 'Free',
    joinedColleges: ['CEDAT'],
    postsCount: 22,
    followersCount: 450,
    followingCount: 200,
    totalLikesCount: 1200,
    badges: ['Verified'],
    verified: true,
    appliedTo: [],
    bio: 'Pushing pixel-perfect designs in the engineering wing.'
  },
  {
    id: 'u-roy',
    name: 'Roy Ssemboga',
    role: 'Student Leader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy',
    connections: 4500,
    email: 'roy.s@mak.ac.ug',
    college: 'CHS',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    joinedColleges: ['CHS', 'Global'],
    postsCount: 156,
    followersCount: 12000,
    followingCount: 300,
    totalLikesCount: 45000,
    badges: ['Verified', 'Leader'],
    verified: true,
    appliedTo: [],
    bio: 'Former Guild President. Committed to student welfare protocols.'
  },
  {
    id: 'u-john',
    name: 'Dr. John S.',
    role: 'Senior Lecturer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    connections: 2300,
    email: 'john.s@mak.ac.ug',
    college: 'COCIS',
    status: 'Masters',
    subscriptionTier: 'Pro',
    joinedColleges: ['COCIS', 'Global'],
    postsCount: 89,
    followersCount: 2100,
    followingCount: 100,
    totalLikesCount: 5600,
    badges: ['Verified', 'Academic'],
    verified: true,
    appliedTo: [],
    bio: 'Lead researcher in distributed intelligence matrices.'
  },
  {
    id: 'u-nawangwe',
    name: 'Prof. Barnabas Nawangwe',
    role: 'Administrator',
    avatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    connections: 10000,
    email: 'vc@mak.ac.ug',
    college: 'Global',
    status: 'Graduate',
    subscriptionTier: 'Enterprise',
    joinedColleges: ['Global'],
    postsCount: 300,
    followersCount: 85000,
    followingCount: 50,
    totalLikesCount: 99000,
    badges: ['Verified', 'Admin'],
    verified: true,
    appliedTo: [],
    bio: 'Vice Chancellor. Orchestrating the Hill’s academic strata.'
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
    const users = parseArray<User>(DB_KEYS.USERS, INITIAL_USERS);
    return users.map(u => ({ ...u, verified: true }));
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    const user = users.find(u => u.id === currentId) || users[0];
    return { ...user, verified: true };
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = { ...user, verified: true }; 
    else users.push({ ...user, verified: true });
    db.saveUsers(users);
  },
  getPosts: (): Post[] => {
    return parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS);
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => db.savePosts([post, ...db.getPosts()]),
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
  getResources: (): Resource[] => parseArray<Resource>(DB_KEYS.RESOURCES, []),
  saveResource: (resource: Resource) => localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([resource, ...db.getResources()])),
  getCalendarEvents: (): CalendarEvent[] => parseArray<CalendarEvent>(DB_KEYS.CALENDAR, []),
  saveCalendarEvent: (event: CalendarEvent) => localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([event, ...db.getCalendarEvents()])),
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(ev => ev.id === eventId ? { ...ev, attendeeIds: Array.from(new Set([...(ev.attendeeIds || []), userId])) } : ev);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getEmails: (): PlatformEmail[] => parseArray<PlatformEmail>(DB_KEYS.EMAILS, MOCK_EMAILS),
  saveEmails: (emails: PlatformEmail[]) => localStorage.setItem(DB_KEYS.EMAILS, JSON.stringify(emails)),
  sendEmail: (email: PlatformEmail) => {
    const emails = db.getEmails();
    db.saveEmails([email, ...emails]);
  },
  getChats: (): ChatConversation[] => parseArray<ChatConversation>(DB_KEYS.CHATS, []),
  saveChats: (chats: ChatConversation[]) => localStorage.setItem(DB_KEYS.CHATS, JSON.stringify(chats)),
  getNotifications: (): MakNotification[] => parseArray<MakNotification>(DB_KEYS.NOTIFICATIONS, []),
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
