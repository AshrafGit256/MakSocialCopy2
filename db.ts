
import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v25',
  USERS: 'maksocial_users_v25',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v25',
  CALENDAR: 'maksocial_calendar_v25',
  BOOKMARKS: 'maksocial_bookmarks_v25',
  CHATS: 'maksocial_chats_hub_v1',
  EMAILS: 'maksocial_emails_v25',
  NOTIFICATIONS: 'maksocial_notifications_v25',
  EVENTS: 'maksocial_events_v25',
  GROUPS: 'maksocial_groups_v25'
};

const INITIAL_EMAILS: PlatformEmail[] = [
  {
    id: 'em-1',
    from: 'bettehagenes@gmail.com',
    fromName: 'Bette Hagenes',
    fromAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bette',
    to: ['admin@mak.ac.ug'],
    subject: 'Project Handover / Final Strata',
    body: 'Hello! Bette\n\nI hope you\'re doing well. I would like to schedule a one-on-one meeting with you to discuss a new project...',
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
  }
];

const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'c-1',
    user: { name: 'Jerry Ladies', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jerry', status: 'online', role: 'UX Designer' },
    unreadCount: 0,
    lastMessage: 'Great to hear!',
    lastTimestamp: '2:06PM',
    isGroup: false,
    messages: [
      { id: 'm1', text: 'Hi Ninfa Monaldo can we go over the project details for the upcoming presentation?', timestamp: '2:00PM', isMe: false },
      { id: 'm2', text: 'Sure, Jerry.', timestamp: '2:02PM', isMe: true },
      { id: 'm3', text: 'I was just reviewing our notes.', timestamp: '2:02PM', isMe: true },
      { id: 'm4', text: 'What do you want to start with?', timestamp: '2:02PM', isMe: true },
      { id: 'm5', text: 'Let\'s begin with the project timeline.', timestamp: '2:03PM', isMe: false },
      { id: 'm6', text: 'Are we on track to meet the deadlines?', timestamp: '2:03PM', isMe: false },
      { id: 'm7', text: 'Yes, mostly.', timestamp: '2:02PM', isMe: true },
      { id: 'm8', text: 'We completed the initial research phase and the design draft.', timestamp: '2:02PM', isMe: true },
      { id: 'm9', text: 'Great to hear!', timestamp: '2:06PM', isMe: false }
    ]
  },
  {
    id: 'c-2',
    user: { name: 'Office Group', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Office', status: 'online', role: 'Official Hub' },
    unreadCount: 2,
    lastMessage: 'Hi Bette How are you?',
    lastTimestamp: '2:30AM',
    isGroup: true,
    messages: []
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
  getUsers: (): User[] => parseArray<User>(DB_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    return users.find(u => u.id === currentId) || users[0];
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
  getEmails: (): PlatformEmail[] => parseArray<PlatformEmail>(DB_KEYS.EMAILS, INITIAL_EMAILS),
  saveEmails: (emails: PlatformEmail[]) => localStorage.setItem(DB_KEYS.EMAILS, JSON.stringify(emails)),
  sendEmail: (email: PlatformEmail) => {
    const emails = db.getEmails();
    db.saveEmails([email, ...emails]);
  },
  getChats: (): ChatConversation[] => parseArray<ChatConversation>(DB_KEYS.CHATS, INITIAL_CHATS),
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
