
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
    id: 'gal-1',
    author: 'Ninfa Monaldo',
    authorId: 'u-ninfa',
    authorRole: 'Wildlife Node',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa',
    timestamp: '2h ago',
    content: '<h1>Fauna Catalog_01</h1><p>Capturing the local fauna during the field research at the bio-wing. The biodiversity levels in the northern strata are peaking. #Nature #Science</p>',
    images: ['https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&w=800'],
    hashtags: ['#Nature', '#Science'],
    likes: 120,
    commentsCount: 5,
    comments: [],
    views: 450,
    flags: [],
    isOpportunity: false,
    college: 'CONAS'
  },
  {
    id: 'opp-poster-1',
    author: 'Makerere Innovation Hub',
    authorId: 'inn_hub',
    authorRole: 'Tech Incubator',
    authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    timestamp: '1h ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Grant',
      isAIVerified: true,
      detectedBenefit: 'UGX 10M Funding'
    },
    images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200'],
    content: `<h1>Innovation Challenge 2026</h1>
<p>We are looking for student-led startups to solve urban transportation issues. Successful nodes will receive seed funding and residency at the COCIS wing.</p>`,
    hashtags: ['#Innovation', '#Grant', '#Startup'],
    likes: 340,
    commentsCount: 18,
    comments: [],
    views: 5600,
    flags: [],
    college: 'Global'
  },
  {
    id: 'opp-poster-2',
    author: 'CEDAT Design Lab',
    authorId: 'cedat_design',
    authorRole: 'Creative Center',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    timestamp: '3h ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Gig',
      isAIVerified: true,
      detectedBenefit: 'Professional Portfolio'
    },
    images: ['https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200'],
    content: `<h1>Gig: UI/UX Signal Overhaul</h1>
<p>Seeking 2 final year designers to assist in the rebranding of the University registry interface. Remote synchronization allowed.</p>`,
    hashtags: ['#DesignGig', '#CEDAT', '#UIUX'],
    likes: 180,
    commentsCount: 12,
    comments: [],
    views: 3200,
    flags: [],
    college: 'CEDAT'
  },
  {
    id: 'opp-3',
    author: 'School of Law',
    authorId: 'law_wing',
    authorRole: 'Academic Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=LAW',
    timestamp: '5h ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Scholarship',
      isAIVerified: true,
      detectedBenefit: 'Full Tuition Waiver'
    },
    content: `<h1>Post-Grad Scholarship: Human Rights</h1>
<p>The Registry is offering 3 full scholarships for the Masters in Human Rights strata. Candidates must have a GPA above 4.0.</p>`,
    hashtags: ['#Scholarship', '#LAW', '#Academic'],
    likes: 890,
    commentsCount: 45,
    comments: [],
    views: 12000,
    flags: [],
    college: 'LAW'
  },
  {
    id: 'gal-2',
    author: 'Sarah CEDAT',
    authorId: 'u2',
    authorRole: 'Visual Architect',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    timestamp: '4h ago',
    content: '<h1>Design Strata_v4</h1><p>Cybernetic aesthetics in the design studio today. Future of tech nodes looks bright. Initializing new lighting protocols for the end-of-year showcase. #Cyberpunk #Design</p>',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800'],
    hashtags: ['#Cyberpunk', '#Design'],
    likes: 890,
    commentsCount: 22,
    comments: [],
    views: 2300,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT'
  },
  {
    id: 'gal-3',
    author: 'John COCIS',
    authorId: 'u1',
    authorRole: 'Core Dev',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    timestamp: '6h ago',
    content: '<h1>Macro System Check</h1><p>Spotted this little fellow near the server room. Mascot initialized and assigned to monitoring bandwidth logs. #Macro #Nature</p>',
    images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800'],
    hashtags: ['#Macro', '#Nature'],
    likes: 56,
    commentsCount: 2,
    comments: [],
    views: 120,
    flags: [],
    isOpportunity: false,
    college: 'COCIS'
  },
  {
    id: 'gal-4',
    author: 'Roy Ssemboga',
    authorId: 'roy_ssemboga',
    authorRole: 'Student Leader',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy',
    timestamp: '1d ago',
    content: '<h1>Hill Strata View</h1><p>A panoramic view of the Makerere Hill strata from the library peak. The synchronization of the campus architecture remains a masterpiece. #Makerere #View</p>',
    images: ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800'],
    hashtags: ['#Makerere', '#View'],
    likes: 450,
    commentsCount: 15,
    comments: [],
    views: 1800,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'gal-5',
    author: 'Ninfa Monaldo',
    authorId: 'u-ninfa',
    authorRole: 'Botanist Node',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa',
    timestamp: '1d ago',
    content: '<h1>Flora Intelligence</h1><p>Macro study of flora in the botanical wing. Genetic markers are appearing consistent with the Alpha-V strain. #Macro #Flowers</p>',
    images: ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800'],
    hashtags: ['#Macro', '#Flowers'],
    likes: 320,
    commentsCount: 10,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: false,
    college: 'CAES'
  },
  {
    id: 'gal-6',
    author: 'Alpha Node',
    authorId: 'u-alpha',
    authorRole: 'Protocol Scout',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha',
    timestamp: '2d ago',
    content: '<h1>Night Strata</h1><p>The main wing during the nocturnal cycle. Energy logs are efficient. #Night #Hill</p>',
    images: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800'],
    hashtags: ['#Night', '#Hill'],
    likes: 670,
    commentsCount: 30,
    comments: [],
    views: 3400,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'gal-7',
    author: 'Sarah CEDAT',
    authorId: 'u2',
    authorRole: 'Visual Architect',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    timestamp: '2d ago',
    content: '<h1>Mountain Sync</h1><p>Field research at the mountain base. Environmental nodes established. #Research #Mountain</p>',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800'],
    hashtags: ['#Research', '#Mountain'],
    likes: 1200,
    commentsCount: 45,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT'
  },
  {
    id: 'gal-8',
    author: 'Bette Hagenes',
    authorId: 'u-bette',
    authorRole: 'Registry Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bette',
    timestamp: '3d ago',
    content: '<h1>Architecture Logs</h1><p>Documentation of the structural integrity of the old wing. Preservation protocols active. #History #Arch</p>',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800'],
    hashtags: ['#History', '#Arch'],
    likes: 89,
    commentsCount: 4,
    comments: [],
    views: 500,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT'
  },
  {
    id: 'gal-9',
    author: 'Ninfa Monaldo',
    authorId: 'u-ninfa',
    authorRole: 'Wildlife Node',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninfa',
    timestamp: '4d ago',
    content: '<h1>Avian Intel</h1><p>Synchronizing the latest avian tracking data. #Birds #Bio</p>',
    images: ['https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&w=800'],
    hashtags: ['#Birds', '#Bio'],
    likes: 210,
    commentsCount: 12,
    comments: [],
    views: 1100,
    flags: [],
    isOpportunity: false,
    college: 'CONAS'
  }
];

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
  getPosts: (): Post[] => {
    const stored = parseArray<Post>(DB_KEYS.POSTS, MOCK_POSTS);
    // Ensure mock visual posts are injected if they don't exist in this version
    if (!stored.find(p => p.id === 'gal-9')) {
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
