
import { Post, User, College, UserStatus, CollegeStats, LeadershipMember, TimelineEvent, CalendarEvent, Violation, LiveEvent, Notification, Resource } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v13',
  USERS: 'maksocial_users_v13',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  CALENDAR: 'maksocial_calendar_v5',
  COLLEGE_STATS: 'maksocial_college_stats_v13',
  TIMELINE: 'maksocial_timeline_v6',
  RESOURCES: 'maksocial_resources_v3'
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['BSCS', 'BSIT', 'BSSE', 'BSIS', 'BLIS'],
  CEDAT: ['BSCV', 'BSEL', 'BSME', 'BARC', 'BIFA'],
  CHUSS: ['BASW', 'BPSY', 'BAJR', 'BASS', 'BAAR'],
  CHS: ['MBChB', 'BSNU', 'BPHA', 'BDSU'],
  CONAS: ['BSPH', 'BSMA', 'BSBI', 'BSCH'],
  CAES: ['BSAG', 'BSFS', 'BSFO'],
  COBAMS: ['BSEC', 'BSST', 'BCOM', 'BSAS'],
  CEES: ['BEDU', 'BAED', 'BSED'],
  LAW: ['LLB']
};

const INITIAL_RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Data Structures Exam 2023', category: 'Past Paper', college: 'COCIS', course: 'BSCS', year: 'Year 2', author: 'Dr. John Kizito', downloads: 1240, fileType: 'PDF', timestamp: '2024-01-10' },
  { id: 'res-2', title: 'Constitution 101 Notes', category: 'Notes/Books', college: 'LAW', course: 'LLB', year: 'Year 1', author: 'Opio Samuel', downloads: 850, fileType: 'PDF', timestamp: '2024-02-15' },
  { id: 'res-3', title: 'Circuit Analysis Lab Report', category: 'Test', college: 'CEDAT', course: 'BSEL', year: 'Year 2', author: 'Eng. Sarah Nakato', downloads: 450, fileType: 'DOCX', timestamp: '2024-03-05' },
  { id: 'res-4', title: 'Microeconomics Finalist Guide', category: 'Career', college: 'COBAMS', course: 'BSEC', year: 'Finalist', author: 'Career Office', downloads: 3200, fileType: 'PDF', timestamp: '2024-04-20' },
];

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: '89th Guild Inauguration Ceremony',
    description: 'The official swearing-in of the 89th Guild Government. A historic day for student leadership at Makerere.',
    date: '2025-05-15',
    time: '14:00',
    location: 'Main Hall, Makerere University',
    category: 'Social',
    createdBy: 'super_admin',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvr2YhoOthHq7cV6DqnFdb9h0thE2b9DxHCA&s',
    attendeeIds: ['u1', 'admin_cocis'],
    registrationLink: 'https://mak.ac.ug/guild'
  },
  {
    id: 'ev-2',
    title: 'MAK Innovation Challenge 2025',
    description: 'Pitch your research and tech solutions to a panel of industrial experts. Funding and mentoring up for grabs.',
    date: '2025-06-10',
    time: '09:00',
    location: 'COCIS Conference Room',
    category: 'Academic',
    createdBy: 'admin_cocis',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200',
    attendeeIds: ['u1'],
    registrationLink: 'https://innovate.mak.ac.ug'
  }
];

const INITIAL_LEADERSHIP: Record<College, LeadershipMember[]> = {
  COCIS: [
    { id: 'l1', name: 'Dr. John Kizito', role: 'Lecturer', email: 'john.kizito@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l1' },
    { id: 'l2', name: 'Prof. Jude Lubega', role: 'Administrator', email: 'admin.cocis@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l2' },
    { id: 'l3', name: 'Opio Samuel', role: 'Chairperson', email: 'opio.s@mak.ac.ug', avatar: 'https://i.pravatar.cc/150?u=l3' }
  ],
  CEDAT: [], CHUSS: [], CHS: [], CONAS: [], CAES: [], COBAMS: [], CEES: [], LAW: []
};

const INITIAL_COLLEGE_STATS: CollegeStats[] = [
  { id: 'COCIS', followers: 1250, postCount: 450, dean: 'Prof. Tonny Oyana', description: 'Computing and Info Sciences.', leadership: INITIAL_LEADERSHIP.COCIS },
  { id: 'CEDAT', followers: 850, postCount: 320, dean: 'Prof. Henry Alinaitwe', description: 'Engineering, Design, Art and Tech.', leadership: [] },
  { id: 'LAW', followers: 1300, postCount: 500, dean: 'Dr. Ronald Naluwairo', description: 'The School of Law.', leadership: [] }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Guru A.',
    role: 'Student',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    joinedColleges: ['COCIS'],
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500,
    badges: [],
    appliedTo: []
  },
  {
    id: 'super_admin',
    name: 'System Admin',
    role: 'University Admin',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    connections: 5000,
    college: 'COCIS',
    status: 'Graduate',
    email: 'admin@admin.mak.ac.ug',
    joinedColleges: ['COCIS', 'CEDAT', 'LAW'],
    postsCount: 0,
    followersCount: 10000,
    followingCount: 0,
    totalLikesCount: 0,
    badges: ['Super Admin'],
    appliedTo: []
  }
];

export const db = {
  getCollegeStats: (): CollegeStats[] => {
    const saved = localStorage.getItem(DB_KEYS.COLLEGE_STATS);
    return saved ? JSON.parse(saved) : INITIAL_COLLEGE_STATS;
  },
  saveCollegeStats: (stats: CollegeStats[]) => localStorage.setItem(DB_KEYS.COLLEGE_STATS, JSON.stringify(stats)),

  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    const users: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    return users.map(u => ({ ...u, joinedColleges: u.joinedColleges || [] }));
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    const user = users.find(u => u.id === currentId) || users[0];
    return { ...user, joinedColleges: user.joinedColleges || [] };
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    const updatedUser = { ...user, joinedColleges: user.joinedColleges || [] };
    if (index !== -1) users[index] = updatedUser;
    else users.push(updatedUser);
    db.saveUsers(users);
  },

  getPosts: (filter?: College | 'Global', showExpired = false): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    let posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;
    if (filter && filter !== 'Global') posts = posts.filter(p => p.college === filter || p.isAd);
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts(undefined, true); 
    db.savePosts([post, ...posts]);
  },
  deletePost: (postId: string, userId: string) => {
    const posts = db.getPosts(undefined, true);
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);
    return updated;
  },

  joinCollege: (userId: string, collegeId: College) => {
    const users = db.getUsers();
    const stats = db.getCollegeStats();
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const joined = u.joinedColleges || [];
        if (!joined.includes(collegeId)) return { ...u, joinedColleges: [...joined, collegeId] };
      }
      return u;
    });
    const updatedStats = stats.map(s => s.id === collegeId ? { ...s, followers: s.followers + 1 } : s);
    db.saveUsers(updatedUsers);
    db.saveCollegeStats(updatedStats);
  },

  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    const existsIndex = events.findIndex(e => e.id === event.id);
    if (existsIndex !== -1) {
       events[existsIndex] = event;
    } else {
       events.push(event);
    }
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(events));
  },
  deleteCalendarEvent: (eventId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.filter(e => e.id !== eventId);
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  registerForEvent: (eventId: string, userId: string) => {
    const events = db.getCalendarEvents();
    const updated = events.map(e => {
      if (e.id === eventId) {
        const attendees = e.attendeeIds || [];
        if (!attendees.includes(userId)) {
          return { ...e, attendeeIds: [...attendees, userId] };
        }
      }
      return e;
    });
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },

  getResources: (): Resource[] => {
    const saved = localStorage.getItem(DB_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  },
  addResource: (res: Resource) => {
    const resources = db.getResources();
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([res, ...resources]));
  },

  updateCollegeLeadership: (collegeId: College, leadership: LeadershipMember[]) => {
    const stats = db.getCollegeStats();
    const updatedStats = stats.map(s => s.id === collegeId ? { ...s, leadership } : s);
    db.saveCollegeStats(updatedStats);
  },

  getTimeline: (): TimelineEvent[] => [],
  getViolations: (): Violation[] => [],
  getPolls: () => [],
  getEvents: (): LiveEvent[] => [
    { id: 'live-1', title: 'Makerere Innovation Hub Seminar', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', organizer: 'Mak Innovation Lab', isLive: true }
  ]
};
