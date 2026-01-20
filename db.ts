
import { Post, User, College, UserStatus, ChatConversation, ChatMessage, Resource, CalendarEvent, CollegeStats, TimelineEvent, Violation, Poll, Notification, LiveEvent } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v13',
  USERS: 'maksocial_users_v14',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  CONVERSATIONS: 'maksocial_chats_v6',
  CALENDAR: 'maksocial_calendar_v5',
  COLLEGE_STATS: 'maksocial_college_stats_v13',
  TIMELINE: 'maksocial_timeline_v6',
  RESOURCES: 'maksocial_resources_v3'
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems'],
  CEDAT: ['Architecture', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Fine Art'],
  CHUSS: ['Psychology', 'Social Work', 'Literature', 'Journalism', 'Philosophy'],
  CONAS: ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'Geology'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry', 'Public Health'],
  CAES: ['Agriculture', 'Environmental Science', 'Forestry', 'Food Science'],
  COBAMS: ['Economics', 'Business Administration', 'Statistics', 'Commerce'],
  CEES: ['Education', 'Adult Education', 'Human Resource Management'],
  LAW: ['Bachelor of Laws']
};

const INITIAL_USERS: User[] = [
  {
    id: 'super_admin',
    name: 'Registry Command',
    role: 'Platform Architect',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    connections: 5000,
    college: 'COCIS',
    status: 'Graduate',
    email: 'admin@admin.mak.ac.ug',
    isVerified: true,
    courseAbbr: 'SYS',
    academicLevel: 'Faculty',
    gender: 'Other',
    isSuspended: false,
    joinedColleges: ['COCIS', 'CEDAT', 'LAW'],
    postsCount: 0,
    followersCount: 10000,
    followingCount: 0,
    totalLikesCount: 0,
    badges: ['Super Admin'],
    appliedTo: [],
    iqCredits: 9999,
    skills: ['Security', 'Governance'],
    intellectualSignature: '#E11D48',
    isOnline: true,
    connectionsList: [],
    pendingRequests: [],
    bookmarkedPosts: [],
    medals: []
  },
  {
    id: 'l1',
    name: 'Dr. Mukasa J.',
    role: 'Senior Lecturer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mukasa',
    connections: 450,
    college: 'COCIS',
    status: 'Graduate',
    email: 'mukasa@lecturer.mak.ac.ug',
    isVerified: true,
    courseAbbr: 'CS',
    academicLevel: 'Faculty',
    gender: 'M',
    isSuspended: false,
    joinedColleges: ['COCIS'],
    postsCount: 120,
    followersCount: 1200,
    followingCount: 50,
    totalLikesCount: 8900,
    badges: ['Researcher'],
    appliedTo: [],
    iqCredits: 5000,
    skills: ['Algorithms', 'AI'],
    intellectualSignature: '#4338CA',
    isOnline: false,
    connectionsList: [],
    pendingRequests: [],
    bookmarkedPosts: [],
    medals: [{ id: 'm1', name: 'Elite Mentor', icon: '🎓' }]
  },
  {
    id: 'sl1',
    name: 'Nakamya Sarah',
    role: 'Guild President',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahN',
    connections: 890,
    college: 'LAW',
    status: 'Finalist',
    email: 'sarah@guild.mak.ac.ug',
    isVerified: true,
    courseAbbr: 'LLB',
    academicLevel: 'Undergrad',
    gender: 'F',
    isSuspended: false,
    joinedColleges: ['LAW'],
    postsCount: 45,
    followersCount: 2500,
    followingCount: 200,
    totalLikesCount: 15000,
    badges: ['Student Leader'],
    appliedTo: [],
    iqCredits: 3400,
    skills: ['Policy', 'Oratory'],
    intellectualSignature: '#F43F5E',
    isOnline: true,
    connectionsList: [],
    pendingRequests: [],
    bookmarkedPosts: [],
    medals: [{ id: 'm2', name: 'Justice Pillar', icon: '⚖️' }]
  },
  {
    id: 'u1',
    name: 'Ashraf Guru',
    role: 'Node Architect',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    email: 'ashraf@students.mak.ac.ug',
    isVerified: false,
    courseAbbr: 'SE',
    academicLevel: 'Undergrad',
    gender: 'M',
    isSuspended: false,
    joinedColleges: ['COCIS'],
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500,
    badges: [],
    appliedTo: [],
    iqCredits: 1250,
    skills: ['React', 'Solidity'],
    intellectualSignature: '#4F46E5',
    isOnline: true,
    connectionsList: [],
    pendingRequests: [],
    bookmarkedPosts: [],
    medals: []
  }
];

export const db = {
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    return users.find(u => u.id === currentId) || users[0];
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) users[idx] = user;
    db.saveUsers(users);
  },

  registerNode: (userData: Partial<User>) => {
    const users = db.getUsers();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name || 'Unknown Node',
      role: userData.role || 'Student',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      connections: 0,
      email: userData.email,
      college: userData.college || 'COCIS',
      status: userData.status || 'Year 1',
      joinedColleges: [userData.college || 'COCIS'],
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      totalLikesCount: 0,
      badges: userData.badges || [],
      appliedTo: [],
      iqCredits: 500,
      skills: [],
      intellectualSignature: '#6366f1',
      connectionsList: [],
      pendingRequests: [],
      bookmarkedPosts: [],
      isVerified: userData.isVerified || false,
      courseAbbr: userData.courseAbbr || 'GEN',
      academicLevel: userData.academicLevel || 'Undergrad',
      gender: userData.gender || 'Other',
      isSuspended: false,
      medals: [],
      ...userData
    };
    users.push(newUser);
    db.saveUsers(users);
    return newUser;
  },

  toggleVerification: (userId: string) => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isVerified = !user.isVerified;
      db.saveUsers(users);
    }
  },

  suspendUser: (userId: string, durationDays: number) => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isSuspended = true;
      const end = new Date();
      end.setDate(end.getDate() + durationDays);
      user.suspensionEnd = end.toISOString();
      db.saveUsers(users);
    }
  },

  unsuspendUser: (userId: string) => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isSuspended = false;
      user.suspensionEnd = undefined;
      db.saveUsers(users);
    }
  },

  awardMedal: (userId: string, medal: { name: string, icon: string }) => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.medals.push({ id: `m-${Date.now()}`, ...medal });
      db.saveUsers(users);
    }
  },

  sendRequest: (fromId: string, toId: string) => {
    const users = db.getUsers();
    const toUser = users.find(u => u.id === toId);
    if (toUser && !toUser.pendingRequests.includes(fromId)) {
      toUser.pendingRequests.push(fromId);
      db.saveUsers(users);
      
      const chats = db.getConversations();
      const newChat: ChatConversation = {
        id: `chat-${Date.now()}`,
        participants: [fromId, toId],
        lastMessage: 'Neural handshake protocol initiated.',
        lastTimestamp: 'Just now',
        unreadCount: 1,
        connectionStatus: 'pending',
        requestedBy: fromId,
        messages: []
      };
      chats.push(newChat);
      db.saveConversations(chats);
    }
  },

  acceptRequest: (currentId: string, senderId: string) => {
    const users = db.getUsers();
    const me = users.find(u => u.id === currentId);
    const sender = users.find(u => u.id === senderId);
    
    if (me && sender) {
      me.pendingRequests = me.pendingRequests.filter(id => id !== senderId);
      if (!me.connectionsList.includes(senderId)) me.connectionsList.push(senderId);
      if (!sender.connectionsList.includes(currentId)) sender.connectionsList.push(currentId);
      db.saveUsers(users);
      
      const chats = db.getConversations();
      const chat = chats.find(c => c.participants.includes(currentId) && c.participants.includes(senderId));
      if (chat) {
        chat.connectionStatus = 'accepted';
        chat.lastMessage = 'Synchronized. Signaling channel open.';
        db.saveConversations(chats);
      }
    }
  },

  sendMessage: (chatId: string, message: Partial<ChatMessage>, fromId: string) => {
    const chats = db.getConversations();
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const fullMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        text: message.text || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true, 
        type: message.type || 'text',
        attachmentUrl: message.attachmentUrl,
        fileName: message.fileName
      };
      chat.messages.push(fullMsg);
      chat.lastMessage = message.type === 'text' ? message.text || '' : `Asset Transmission [${message.type}]`;
      chat.lastTimestamp = fullMsg.timestamp;
      db.saveConversations(chats);
    }
  },

  bookmarkPost: (userId: string, postId: string) => {
    const users = db.getUsers();
    const me = users.find(u => u.id === userId);
    const posts = db.getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (me && post) {
      if (me.bookmarkedPosts.includes(postId)) {
         me.bookmarkedPosts = me.bookmarkedPosts.filter(id => id !== postId);
      } else {
         me.bookmarkedPosts.push(postId);
         const authorId = post.authorId;
         const author = users.find(u => u.id === authorId);
         if (author && authorId !== userId) {
            const notif: Notification = {
               id: `bookmark-notif-${Date.now()}`,
               text: `${me.name} archived your broadcast to their vault.`,
               timestamp: 'Just now',
               isRead: false,
               type: 'bookmark',
               senderAvatar: me.avatar,
               senderName: me.name
            };
            author.notifications = [notif, ...(author.notifications || [])];
         }
      }
      db.saveUsers(users);
    }
  },

  getConversations: (): ChatConversation[] => {
    const saved = localStorage.getItem(DB_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveConversations: (chats: ChatConversation[]) => localStorage.setItem(DB_KEYS.CONVERSATIONS, JSON.stringify(chats)),

  getPosts: (filter?: College | 'Global', adminView?: boolean): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    const allPosts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;
    if (filter && filter !== 'Global') {
      return allPosts.filter(p => p.college === filter);
    }
    return allPosts;
  },
  addPost: (post: Post) => {
    const posts = db.getPosts();
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify([post, ...posts]));
  },
  updatePost: (post: Post) => {
    const posts = db.getPosts();
    const idx = posts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      posts[idx] = post;
      localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts));
    }
  },
  deletePost: (id: string, role?: string) => {
    const posts = db.getPosts();
    const updated = posts.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(updated));
  },
  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [];
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify([event, ...events]));
  },
  deleteCalendarEvent: (id: string) => {
    const events = db.getCalendarEvents();
    const updated = events.filter(e => e.id !== id);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      if (!events[idx].attendeeIds.includes(userId)) {
        events[idx].attendeeIds.push(userId);
        localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(events));
      }
    }
  },
  getResources: (): Resource[] => {
    const saved = localStorage.getItem(DB_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : [];
  },
  addResource: (res: Resource) => {
    const resources = db.getResources();
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([res, ...resources]));
  },
  getCollegeStats: (): CollegeStats[] => [],
  getTimeline: (): TimelineEvent[] => [],
  getViolations: (): Violation[] => [],
  getPolls: (): Poll[] => [],
  getEvents: (): LiveEvent[] => []
};
