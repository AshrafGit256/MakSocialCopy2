
import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage, LostFoundItem, Ticket } from './types';
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
  GROUPS: 'maksocial_groups_v26_clusters',
  LOST_FOUND: 'maksocial_lost_found_registry',
  TICKETS: 'maksocial_tickets_registry'
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'Information Technology', 'Information Systems'],
  CEDAT: ['Architecture', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
  CHUSS: ['Psychology', 'Philosophy', 'Literature', 'History'],
  CONAS: ['Biology', 'Physics', 'Chemistry', 'Mathematics'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Business Administration', 'Statistics'],
  CEES: ['Education', 'Adult Education'],
  LAW: ['Bachelor of Laws'],
};

const INITIAL_USERS: User[] = [
  {
    id: 'u-ninfa',
    name: 'Ninfa A.',
    role: 'University Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa',
    connections: 120,
    email: 'ninfa@student.mak.ac.ug',
    college: 'COCIS',
    status: 'Year 2',
    subscriptionTier: 'Free',
    joinedColleges: ['COCIS'],
    postsCount: 15,
    followersCount: 200,
    followingCount: 150,
    totalLikesCount: 450,
    badges: ['Early Adopter'],
    appliedTo: [],
    verified: true,
    bio: 'Software enthusiast at Makerere.'
  }
];

const CAMPAIGN_POST: Post = {
  id: 'campaign-marathon-2025',
  author: 'Makerere Sports Council',
  authorId: 'sports_node',
  authorRole: 'Official Organizer',
  authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
  authorAuthority: 'Official',
  timestamp: 'Sponsored',
  isCampaign: true,
  eventTitle: "Makerere Marathon 2025",
  campaignData: {
    price: 'UGX 50,000',
    cta: 'BUY OFFICIAL KIT & TICKET',
    eventDate: '17 AUG 2025',
    location: 'Freedom Square',
    themeColor: '#10918a'
  },
  content: `<h1>Join us for the Makerere Marathon</h1><p>Enhance the student experience and run for a cause. Secure your official kit and entry today through the Hill Registry.</p>`,
  hashtags: ['#MAKRUN2025', '#MakerereAt100'],
  likes: 2450,
  commentsCount: 120,
  comments: [],
  views: 85000,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: ['https://endowment.mak.ac.ug/makrun/assets/img/races/about-min.png']
};

const CAMPAIGN_TECH_POST: Post = {
  id: 'campaign-tech-expo-2025',
  author: 'COCIS Innovation Hub',
  authorId: 'tech_node',
  authorRole: 'Innovation Lead',
  authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=tech',
  authorAuthority: 'Official',
  timestamp: 'Sponsored',
  isCampaign: true,
  eventTitle: "Mak Tech Expo 2025",
  campaignData: {
    price: 'UGX 30,000',
    cta: 'SECURE TECH PASS',
    eventDate: '24 NOV 2025',
    location: 'COCIS Block B',
    themeColor: '#4f46e5'
  },
  content: `<h1>Mak Tech Expo 2025: Future Strata</h1><p>Experience the latest in AI, Robotics, and Blockchain from the next generation of innovators. Get your limited access digital pass now.</p>`,
  hashtags: ['#MakTechExpo', '#InnovationStrata', '#FutureHill'],
  likes: 3100,
  commentsCount: 85,
  comments: [],
  views: 92000,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200']
};

export const db = {
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u-ninfa';
    return users.find(u => u.id === currentId) || INITIAL_USERS[0];
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === user.id ? user : u);
    db.saveUsers(updated);
  },
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    if (!saved) return [CAMPAIGN_POST, CAMPAIGN_TECH_POST, ...MOCK_POSTS];
    return JSON.parse(saved);
  },
  addPost: (post: Post) => {
    const posts = db.getPosts();
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify([post, ...posts]));
  },
  getChats: (): ChatConversation[] => {
    const saved = localStorage.getItem(DB_KEYS.CHATS);
    return saved ? JSON.parse(saved) : MOCK_CHATS;
  },
  saveChats: (chats: ChatConversation[]) => localStorage.setItem(DB_KEYS.CHATS, JSON.stringify(chats)),
  getNotifications: (): MakNotification[] => {
    const saved = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveNotifications: (notifs: MakNotification[]) => localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs)),
  getResources: (): Resource[] => {
    const saved = localStorage.getItem(DB_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : [];
  },
  saveResource: (res: Resource) => {
    const resources = db.getResources();
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([res, ...resources]));
  },
  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([event, ...events]));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(e => {
      if (e.id === eventId) {
        const attendeeIds = e.attendeeIds || [];
        if (!attendeeIds.includes(userId)) {
          return { ...e, attendeeIds: [...attendeeIds, userId] };
        }
      }
      return e;
    });
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getEmails: (): PlatformEmail[] => {
    const saved = localStorage.getItem(DB_KEYS.EMAILS);
    return saved ? JSON.parse(saved) : [];
  },
  saveEmails: (emails: PlatformEmail[]) => localStorage.setItem(DB_KEYS.EMAILS, JSON.stringify(emails)),
  getEvents: (): LiveEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : [];
  },
  getOpportunities: (): Post[] => {
    return db.getPosts().filter(p => p.isOpportunity);
  },
  getGroups: (): Group[] => {
    const saved = localStorage.getItem(DB_KEYS.GROUPS);
    return saved ? JSON.parse(saved) : [];
  },
  saveGroups: (groups: Group[]) => localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(groups)),
  addGroupMessage: (groupId: string, msg: GroupMessage) => {
    const groups = db.getGroups();
    const updated = groups.map(g => g.id === groupId ? { ...g, messages: [...g.messages, msg] } : g);
    db.saveGroups(updated);
  },
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
  getLostFound: (): LostFoundItem[] => {
    const saved = localStorage.getItem(DB_KEYS.LOST_FOUND);
    return saved ? JSON.parse(saved) : [];
  },
  addLostFound: (item: LostFoundItem) => {
    const items = db.getLostFound();
    localStorage.setItem(DB_KEYS.LOST_FOUND, JSON.stringify([item, ...items]));
  },
  deleteLostFound: (id: string) => {
    const items = db.getLostFound();
    localStorage.setItem(DB_KEYS.LOST_FOUND, JSON.stringify(items.filter(i => i.id !== id)));
  },
  resolveLostFound: (id: string) => {
    const items = db.getLostFound();
    const updated = items.map(i => i.id === id ? { ...i, status: 'Resolved' as const } : i);
    localStorage.setItem(DB_KEYS.LOST_FOUND, JSON.stringify(updated));
  },
  getBookmarks: (): string[] => {
    const saved = localStorage.getItem(DB_KEYS.BOOKMARKS);
    return saved ? JSON.parse(saved) : [];
  },
  getTickets: (): Ticket[] => {
    const saved = localStorage.getItem(DB_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : [];
  },
  purchaseTicket: (ticket: Ticket) => {
    const tickets = db.getTickets();
    localStorage.setItem(DB_KEYS.TICKETS, JSON.stringify([ticket, ...tickets]));
    const notifs = db.getNotifications();
    const newNotif: MakNotification = {
      id: `nt-${Date.now()}`,
      type: 'event',
      title: 'Official Ticket Secured',
      description: `Your entry kit for ${ticket.eventTitle} has been registered to your ID.`,
      timestamp: 'Just now',
      isRead: false
    };
    db.saveNotifications([newNotif, ...notifs]);
  },
};
