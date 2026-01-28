
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType, Notification, AuditLog, FlaggedContent, Comment, Group, GroupMessage } from './types';
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
  GROUPS: 'maksocial_groups_v1'
};

const MOCK_GROUPS: Group[] = [
  {
    id: 'g-1',
    name: '89th Guild Cabinet',
    description: 'Official coordination hub for the Guild Leadership. Strategy sessions and welfare reports.',
    image: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    isOfficial: true,
    creatorId: 'vc_office',
    memberIds: ['vc_office', 'u1', 'u2', 'u3'],
    category: 'Global',
    messages: [
      { id: 'm1', author: 'Guild President', authorId: 'gp', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GP', text: 'Has the welfare report for CEDAT been synchronized yet?', timestamp: '09:00 AM' },
      { id: 'm2', author: 'Secretary General', authorId: 'u2', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SG', text: 'Processing now. We found some connectivity issues in the North Wing.', timestamp: '09:05 AM' },
      { id: 'm3', author: 'Prof. Barnabas', authorId: 'vc_office', authorAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg', text: 'Ensure the 89th inauguration ceremony budget is finalized by EOD.', timestamp: '10:30 AM' }
    ]
  },
  {
    id: 'g-2',
    name: 'COCIS Alpha-Net',
    description: 'A deep-tech hub for AI research, cybersecurity drills, and software architecture.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400',
    isOfficial: false,
    creatorId: 'u1',
    memberIds: ['u1', 'u4', 'u5'],
    category: 'COCIS',
    messages: [
      { id: 'm4', author: 'Admin Node', authorId: 'u1', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', text: 'I have uploaded the new neural network weights for the exam-bot project.', timestamp: 'Yesterday' },
      { id: 'm5', author: 'Security Lead', authorId: 'u4', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sec', text: 'Verified. SHA-256 handshake successful.', timestamp: 'Yesterday', attachment: { name: 'model_weights.bin', type: 'document', data: '#' } }
    ]
  },
  {
    id: 'g-3',
    name: 'CEDAT Design Lab',
    description: 'Visual arts, architecture prototypes, and 3D modeling synchronization.',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=400',
    isOfficial: false,
    creatorId: 'u2',
    memberIds: ['u2', 'u6'],
    category: 'CEDAT',
    messages: [
      { id: 'm6', author: 'Sarah Design', authorId: 'u2', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', text: 'Check out the proposed structure for the new Student Center.', timestamp: '11:20 AM', attachment: { name: 'render_v1.png', type: 'image', data: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800' } },
      { id: 'm7', author: 'Architect Node', authorId: 'u6', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arch', text: 'The glass facade looks impressive, but we need to check the structural integrity of the west wing.', timestamp: '11:45 AM' }
    ]
  },
  {
    id: 'g-4',
    name: 'Hill Marathon Committee',
    description: 'Organizing the 2026 Hill Marathon. Athletics and logistics sync.',
    image: 'https://images.unsplash.com/photo-1461896756981-2258bb3f6714?auto=format&fit=crop&w=400',
    isOfficial: true,
    creatorId: 'u3',
    memberIds: ['u3', 'u7', 'u8'],
    category: 'Global',
    messages: [
      { id: 'm8', author: 'Sports Rep', authorId: 'u3', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sports', text: 'Registration nodes are now active at Freedom Square.', timestamp: '08:00 AM' }
    ]
  }
];

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 800000, expenses: 600000, subscribers: 120, growth: 5 },
  { month: 'Feb', revenue: 950000, expenses: 650000, subscribers: 150, growth: 12 },
  { month: 'Mar', revenue: 1200000, expenses: 700000, subscribers: 200, growth: 15 },
  { month: 'Apr', revenue: 1100000, expenses: 750000, subscribers: 180, growth: -5 },
  { month: 'May', revenue: 1500000, expenses: 800000, subscribers: 250, growth: 20 },
  { month: 'Jun', revenue: 1800000, expenses: 850000, subscribers: 300, growth: 25 }
];

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems'],
  CEDAT: ['Architecture', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
  CHUSS: ['Psychology', 'Social Work', 'Journalism', 'Literature'],
  CONAS: ['Mathematics', 'Physics', 'Biology', 'Chemistry'],
  CHS: ['Medicine', 'Nursing', 'Public Health', 'Pharmacy'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Statistics', 'Business Administration', 'Commerce'],
  CEES: ['Education', 'Adult Education', 'Distance Learning'],
  LAW: ['Bachelor of Laws', 'Human Rights', 'Commercial Law']
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: '89th Guild Inauguration Gala',
    description: 'The official synchronization ceremony for the new student leadership.',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    location: 'Freedom Square / Main Hall',
    image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=1200',
    category: 'Social',
    createdBy: 'vc_office',
    attendeeIds: []
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
    skills: ['Institutional Leadership', 'Strategy']
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
  getCalendarEvents: (): CalendarEvent[] => parseArray<CalendarEvent>(DB_KEYS.CALENDAR, INITIAL_EVENTS),
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
  getGroups: (): Group[] => parseArray<Group>(DB_KEYS.GROUPS, MOCK_GROUPS),
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
  getAuditLogs: (): AuditLog[] => [],
  getFlagged: (): FlaggedContent[] => [],
  getEvents: () => []
};
