
import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage } from './types';
import { MOCK_POSTS, MOCK_CHATS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v27_populated',
  USERS: 'maksocial_users_v26_registry',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v26_vault',
  CALENDAR: 'maksocial_calendar_v26_ roadmap',
  BOOKMARKS: 'maksocial_bookmarks_v26_favs',
  CHATS: 'maksocial_chats_hub_v1_sync',
  EMAILS: 'maksocial_emails_v26_prod_v2_mail',
  NOTIFICATIONS: 'maksocial_notifications_v26_signals',
  EVENTS: 'maksocial_events_v26_live',
  GROUPS: 'maksocial_groups_v26_clusters'
};

const INITIAL_USERS: User[] = [
  { id: 'vc_office', name: 'Prof. Barnabas Nawangwe', role: 'Vice Chancellor', avatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg', connections: 45000, email: 'vc@mak.ac.ug', college: 'Global', status: 'Graduate', subscriptionTier: 'Enterprise', joinedColleges: ['Global'], postsCount: 124, followersCount: 42000, followingCount: 89, totalLikesCount: 156000, badges: ['Verified', 'Admin'], verified: true, appliedTo: [] },
  { id: 'u-ninfa', name: 'Ninfa Monaldo', role: 'Web Architect', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa', connections: 1200, email: 'ninfa.m@mak.ac.ug', college: 'COCIS', status: 'Finalist', subscriptionTier: 'Pro', joinedColleges: ['COCIS'], postsCount: 45, followersCount: 890, followingCount: 150, totalLikesCount: 3400, badges: ['Verified'], verified: true, appliedTo: [], bio: 'Building the next generation of academic strata.' },
  { id: 'mak_library', name: 'Main Library Node', role: 'Information Hub', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Library', connections: 45000, email: 'library@mak.ac.ug', college: 'Global', status: 'Graduate', subscriptionTier: 'Enterprise', joinedColleges: ['Global'], postsCount: 560, followersCount: 45000, followingCount: 0, totalLikesCount: 89000, badges: ['Official'], verified: true, appliedTo: [] },
  { id: 'mak_unipod', name: 'Mak UniPod', role: 'Innovation Forge', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=UniPod', connections: 8000, email: 'unipod@mak.ac.ug', college: 'CEDAT', status: 'Graduate', subscriptionTier: 'Pro', joinedColleges: ['CEDAT'], postsCount: 89, followersCount: 7800, followingCount: 12, totalLikesCount: 12000, badges: ['Verified'], verified: true, appliedTo: [] },
  { id: 'guild_office', name: 'Guild Presidential Office', role: 'Student Leadership', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guild', connections: 25000, email: 'guild.president@mak.ac.ug', college: 'Global', status: 'Graduate', subscriptionTier: 'Pro', joinedColleges: ['Global'], postsCount: 230, followersCount: 28000, followingCount: 450, totalLikesCount: 92000, badges: ['Verified'], verified: true, appliedTo: [] },
  { id: 'mtn_partner', name: 'MTN Uganda', role: 'Corporate Node', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=MTN', connections: 50000, email: 'partners@mtn.co.ug', college: 'Global', status: 'Graduate', subscriptionTier: 'Enterprise', joinedColleges: ['Global'], postsCount: 12, followersCount: 50000, followingCount: 0, totalLikesCount: 450000, badges: ['Partner'], verified: true, appliedTo: [] },
  { id: 'u-julianne', name: 'Dr. Julianne O.', role: 'Senior Lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julianne', connections: 800, email: 'julianne.o@mak.ac.ug', college: 'COCIS', status: 'Graduate', subscriptionTier: 'Pro', joinedColleges: ['COCIS'], postsCount: 64, followersCount: 1200, followingCount: 80, totalLikesCount: 5600, badges: ['Verified', 'Faculty'], verified: true, appliedTo: [] },
  { id: 'airtel_partner', name: 'Airtel Uganda', role: 'Corporate Partner', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Airtel', connections: 48000, email: 'customercare@ug.airtel.com', college: 'Global', status: 'Graduate', subscriptionTier: 'Enterprise', joinedColleges: ['Global'], postsCount: 8, followersCount: 48000, followingCount: 0, totalLikesCount: 320000, badges: ['Partner'], verified: true, appliedTo: [] },
  { id: 'mak_security', name: 'Security Registry', role: 'Official Channel', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Security', connections: 45000, email: 'security@mak.ac.ug', college: 'Global', status: 'Graduate', subscriptionTier: 'Enterprise', joinedColleges: ['Global'], postsCount: 320, followersCount: 45000, followingCount: 0, totalLikesCount: 12000, badges: ['Official'], verified: true, appliedTo: [] },
  { id: 'u-peter', name: 'Counsel Peter', role: 'Legal Advisor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter', connections: 1200, email: 'peter.counsel@mak.ac.ug', college: 'LAW', status: 'Graduate', subscriptionTier: 'Pro', joinedColleges: ['LAW'], postsCount: 145, followersCount: 2300, followingCount: 120, totalLikesCount: 8900, badges: ['Verified'], verified: true, appliedTo: [] }
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
  getUsers: (): User[] => parseArray<User>(DB_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    return users.find(u => u.id === currentId) || users[1]; // default to Ninfa
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user; else users.push(user);
    db.saveUsers(users);
  },
  getPosts: (): Post[] => parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS),
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => db.savePosts([post, ...db.getPosts()]),
  likePost: (postId: string) => db.savePosts(db.getPosts().map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)),
  addComment: (postId: string, comment: any) => db.savePosts(db.getPosts().map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), comment], commentsCount: (p.commentsCount || 0) + 1 } : p)),
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
  getChats: (): ChatConversation[] => parseArray<ChatConversation>(DB_KEYS.CHATS, MOCK_CHATS),
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
