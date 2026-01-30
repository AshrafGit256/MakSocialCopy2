
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

const ADDITIONAL_POSTS: Post[] = [
  {
    id: 'opp-poster-3',
    author: 'CHUSS Research Wing',
    authorId: 'chuss_research',
    authorRole: 'Humanities Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CHUSS',
    timestamp: 'Just now',
    isOpportunity: true,
    opportunityData: {
      type: 'Workshop',
      isAIVerified: true,
      detectedBenefit: 'Global Certification'
    },
    images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200'],
    content: `<h1>Humanitarian Data Ethics Workshop</h1>
<p>Join the CHUSS research nodes for a three-day intensive protocol on data ethics in the global south. Limited slots for 4th-year students.</p>`,
    hashtags: ['#Ethics', '#Humanities', '#Workshop'],
    likes: 45,
    commentsCount: 3,
    comments: [],
    views: 1200,
    flags: [],
    college: 'CHUSS'
  },
  {
    id: 'opp-poster-4',
    author: 'Makerere Fintech Lab',
    authorId: 'fintech_mak',
    authorRole: 'Innovation Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=FIN',
    timestamp: '2h ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Internship',
      isAIVerified: true,
      detectedBenefit: 'UGX 1.2M Stipend'
    },
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200'],
    content: `<h1>Fintech Analyst Internship</h1>
<p>Seeking 3 students from COBAMS or COCIS wings to join our mobile money logic strata. Deep knowledge of transaction telemetry required.</p>`,
    hashtags: ['#Fintech', '#COBAMS', '#Internship'],
    likes: 210,
    commentsCount: 15,
    comments: [],
    views: 8900,
    flags: [],
    college: 'Global'
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
    const users = parseArray<User>(DB_KEYS.USERS, INITIAL_USERS);
    // Universal verification injection: force everyone to be verified
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
    const stored = parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS);
    if (!stored.find(p => p.id === 'opp-poster-4')) {
       const merged = [...ADDITIONAL_POSTS, ...stored];
       localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(merged));
       return merged;
    }
    return stored;
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
