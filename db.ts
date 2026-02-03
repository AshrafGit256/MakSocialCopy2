
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
  EMAILS: 'maksocial_emails_v26',
  NOTIFICATIONS: 'maksocial_notifications_v26',
  EVENTS: 'maksocial_events_v26',
  GROUPS: 'maksocial_groups_v26'
};

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
    // Fixed: 'Year 3' is not a valid UserStatus. Changed to 'Finalist'.
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
  getEmails: (): PlatformEmail[] => parseArray<PlatformEmail>(DB_KEYS.EMAILS, []),
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
