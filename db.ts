import { Post, User, College, UserStatus, Resource, CalendarEvent, MakNotification, PlatformEmail, ChatConversation, LiveEvent, Group, GroupMessage, LostFoundItem, Ticket, AudioLesson } from './types';
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
  TICKETS: 'maksocial_tickets_registry',
  AUDIO_LESSONS: 'maksocial_audio_lessons'
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

// DIRECT STREAM LINK CONVERSION: 
// 1smJEC8rt9xFQveKsiGtoFSSI4YLz_Mzg is the ID provided by user
// Using drive.google.com/uc?export=download&id= format which is the most reliable for browsers to detect as media
const DIRECT_LINK = 'https://drive.google.com/uc?export=download&id=1smJEC8rt9xFQveKsiGtoFSSI4YLz_Mzg';

const MOCK_AUDIO_LESSONS: AudioLesson[] = [
  {
    id: 'aud-1',
    title: 'Introduction to Web Architecture',
    lecturer: 'Dr. John Male',
    courseCode: 'CSC 2100',
    course: 'Computer Science',
    year: 'Year 2',
    college: 'COCIS',
    duration: '45:20',
    date: '12 Feb 2026',
    audioUrl: DIRECT_LINK,
    contributor: 'Brian K.',
    contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
    plays: 1420,
    description: 'A deep dive into client-server models and distributed systems.'
  },
  {
    id: 'aud-2',
    title: 'Principles of Criminal Law',
    lecturer: 'Counsel Peter',
    courseCode: 'LAW 1205',
    course: 'Bachelor of Laws',
    year: 'Year 1',
    college: 'LAW',
    duration: '52:10',
    date: '10 Feb 2026',
    audioUrl: DIRECT_LINK,
    contributor: 'Sarah N.',
    contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    plays: 850,
    description: 'Understanding the elements of crime and burden of proof.'
  },
  {
    id: 'aud-3',
    title: 'Biochemistry: Metabolic Pathways',
    lecturer: 'Prof. Nalule',
    courseCode: 'CHS 3102',
    course: 'Medicine',
    year: 'Year 3',
    college: 'CHS',
    duration: '38:45',
    date: '08 Feb 2026',
    audioUrl: DIRECT_LINK,
    contributor: 'Opio Eric',
    contributorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Opio',
    plays: 2100,
    description: 'Discussing the Krebs cycle and electron transport chain mechanics.'
  }
];

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
  authorAvatar: 'https://static.vecteezy.com/system/resources/thumbnails/041/943/427/small/sport-logo-black-color-2-vector.jpg',
  authorAuthority: 'Official',
  timestamp: 'Sponsored',
  isCampaign: true,
  campaignData: {
    price: 'UGX 50,000',
    cta: 'Register NOW!',
    eventDate: '17 AUG 2025',
    location: 'Freedom Square',
    themeColor: '#10918a'
  },
  content: `<h1>Join us for the Makerere Marathon</h1><p>Enhance the student experience and run for a cause. Secure your official kit and entry today.</p>`,
  hashtags: ['#MAKRUN2025', '#MakerereAt100'],
  likes: 2450,
  commentsCount: 120,
  comments: [],
  views: 85000,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: ['https://pbs.twimg.com/media/Gwn2s3iW8AAncFH.jpg']
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
    if (!saved) return [CAMPAIGN_POST, ...MOCK_POSTS];
    return JSON.parse(saved);
  },
  updatePost: (post: Post) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === post.id ? post : p);
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(updated));
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
  toggleBookmark: (postId: string) => {
    const current = db.getBookmarks();
    const updated = current.includes(postId) 
      ? current.filter(id => id !== postId) 
      : [...current, postId];
    localStorage.setItem(DB_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
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
      title: 'Ticket Secured',
      description: `Your entry for ${ticket.eventTitle} is now in your vault.`,
      timestamp: 'Just now',
      isRead: false
    };
    db.saveNotifications([newNotif, ...notifs]);
  },
  getAudioLessons: (): AudioLesson[] => {
    const saved = localStorage.getItem(DB_KEYS.AUDIO_LESSONS);
    return saved ? JSON.parse(saved) : MOCK_AUDIO_LESSONS;
  },
  addAudioLesson: (lesson: AudioLesson) => {
    const lessons = db.getAudioLessons();
    localStorage.setItem(DB_KEYS.AUDIO_LESSONS, JSON.stringify([lesson, ...lessons]));
  }
};