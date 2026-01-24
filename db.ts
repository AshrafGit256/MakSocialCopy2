
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v17',
  USERS: 'maksocial_users_v17',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v8',
  CALENDAR: 'maksocial_calendar_v9',
  ADS: 'maksocial_ads_v4',
  OPPORTUNITIES: 'maksocial_opps_v3'
};

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const COURSES_BY_COLLEGE: Record<College, string[]> = {
  COCIS: ['Computer Science', 'Software Engineering', 'IT', 'Information Systems'],
  CEDAT: ['Civil Engineering', 'Electrical Engineering', 'Mechanical', 'Architecture'],
  CHUSS: ['Psychology', 'Social Work', 'Literature', 'History'],
  CHS: ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  CONAS: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  CAES: ['Agriculture', 'Environmental Science', 'Food Science'],
  COBAMS: ['Economics', 'Business Admin', 'Statistics'],
  CEES: ['Education', 'Adult Education'],
  LAW: ['Bachelor of Laws']
};

export const REVENUE_HISTORY: RevenuePoint[] = [
  { month: 'Jan', revenue: 4500000, expenses: 2100000, subscribers: 1240, growth: 12 },
  { month: 'Feb', revenue: 5200000, expenses: 2300000, subscribers: 1560, growth: 25 },
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Operating Systems - 2024 Past Paper',
    category: 'Past Paper',
    college: 'COCIS',
    course: 'Computer Science',
    year: 'Year 2',
    author: 'Admin_Registry',
    downloads: 1240,
    fileType: 'PDF',
    timestamp: '2 days ago'
  },
  {
    id: 'res-2',
    title: 'Structural Analysis III Notes',
    category: 'Notes/Books',
    college: 'CEDAT',
    course: 'Civil Engineering',
    year: 'Year 3',
    author: 'Lecturer_Sync',
    downloads: 890,
    fileType: 'PDF',
    timestamp: '5 days ago'
  },
  {
    id: 'res-3',
    title: 'Constitutional Law - Case Summaries',
    category: 'Notes/Books',
    college: 'LAW',
    course: 'Bachelor of Laws',
    year: 'Year 1',
    author: 'Guild_Vault',
    downloads: 3200,
    fileType: 'DOCX',
    timestamp: '1 week ago'
  }
];

const INITIAL_OPPORTUNITIES: Post[] = [
  {
    id: 'opp-featured',
    author: 'Google Africa',
    authorId: 'google_africa',
    authorRole: 'Corporate Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Google',
    timestamp: '1h ago',
    content: 'The Google Developer Student Club (GDSC) lead applications for 2025/26 are now open. Influence the tech pulse on campus.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Tech', '#Leadership'],
    likes: 2450,
    commentsCount: 156,
    comments: [],
    views: 89000,
    flags: [],
    isOpportunity: true,
    college: 'Global',
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200'],
    opportunityData: {
      type: 'Workshop',
      deadline: getFutureDate(14),
      isAIVerified: true,
      detectedBenefit: 'Global Network'
    }
  },
  {
    id: 'opp-1',
    author: 'Mak AI Lab',
    authorId: 'mak_ailab',
    authorRole: 'Research Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AILab',
    timestamp: '2h ago',
    content: 'Urgent: Seeking 5 Student Developers for a 48-hour NLP data labeling gig. Payment: 150k UGX per node.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Gig', '#AI'],
    likes: 420,
    commentsCount: 12,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: true,
    college: 'COCIS',
    opportunityData: {
      type: 'Gig',
      deadline: getFutureDate(1), 
      isAIVerified: true,
      detectedBenefit: 'Immediate Payment'
    }
  },
  {
    id: 'opp-cedat-grant',
    author: 'MakUnipod',
    authorId: 'mak_unipod',
    authorRole: 'Innovation Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Unipod',
    timestamp: '5h ago',
    content: 'Innovation Grant: Alpha Cohort for Sustainable Energy Prototypes. We are funding up to 5 projects this semester.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Grant', '#Engineering'],
    likes: 890,
    commentsCount: 45,
    comments: [],
    views: 15000,
    flags: [],
    isOpportunity: true,
    college: 'CEDAT',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200'],
    opportunityData: {
      type: 'Grant',
      deadline: getFutureDate(30),
      isAIVerified: true,
      detectedBenefit: 'UGX 2.5M Fund'
    }
  },
  {
    id: 'opp-law-intern',
    author: 'Kats & Co.',
    authorId: 'kats_law',
    authorRole: 'Corporate Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=LawFirm',
    timestamp: '1d ago',
    content: 'Summer Clerkship Program: Open for 3rd and 4th Year Law students. High-intensity litigation exposure.',
    customFont: '"Plus Jakarta Sans"',
    hashtags: ['#Internship', '#Law'],
    likes: 120,
    commentsCount: 8,
    comments: [],
    views: 4500,
    flags: [],
    isOpportunity: true,
    college: 'LAW',
    opportunityData: {
      type: 'Internship',
      deadline: getFutureDate(7),
      isAIVerified: true,
      detectedBenefit: 'Professional Mentorship'
    }
  },
  {
    id: 'opp-chs-research',
    author: 'WHO Research Unit',
    authorId: 'who_unit',
    authorRole: 'Official Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=WHO',
    timestamp: '3d ago',
    content: 'Seeking Medical Students for Community Health Survey in Mulago. Research nodes needed for 2 weeks.',
    customFont: '"Inter"',
    hashtags: ['#Research', '#Medicine'],
    likes: 340,
    commentsCount: 22,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: true,
    college: 'CHS',
    images: ['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200'],
    opportunityData: {
      type: 'Research' as any,
      deadline: getFutureDate(5),
      isAIVerified: true,
      detectedBenefit: 'Research Credentials'
    }
  },
  {
    id: 'opp-cobams-scholar',
    author: 'Stanbic Bank',
    authorId: 'stanbic_mak',
    authorRole: 'Corporate Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Stanbic',
    timestamp: '4d ago',
    content: 'FinTech Scholarship: Full tuition coverage for top 10 Economics/Statistics students with a focus on Digital Banking.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Scholarship', '#Finance'],
    likes: 5600,
    commentsCount: 890,
    comments: [],
    views: 120000,
    flags: [],
    isOpportunity: true,
    college: 'COBAMS',
    images: ['https://www.intelligentcio.com/africa/wp-content/uploads/sites/5/2023/08/STANBIC-BANK_1000X450.jpg'],
    opportunityData: {
      type: 'Scholarship',
      deadline: getFutureDate(21),
      isAIVerified: true,
      detectedBenefit: 'Full Tuition'
    }
  }
];

const parseArray = <T>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.error(`Error parsing ${key} from storage:`, e);
    return fallback;
  }
};

export const db = {
  getUsers: (): User[] => parseArray<User>(DB_KEYS.USERS, []),
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return users[0] || {
      id: 'guest',
      name: 'Guest Node',
      role: 'Visitor',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Guest',
      connections: 0,
      college: 'Global',
      status: 'Year 1',
      subscriptionTier: 'Free',
      joinedColleges: ['Global'],
      postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0, badges: [], appliedTo: []
    };
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
    if (filter && filter !== 'Global') {
      posts = posts.filter(p => p.college === filter);
    }
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    if (post.isOpportunity) db.addOpportunity(post);
  },
  getOpportunities: (): Post[] => parseArray<Post>(DB_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES),
  saveOpportunities: (opps: Post[]) => localStorage.setItem(DB_KEYS.OPPORTUNITIES, JSON.stringify(opps)),
  addOpportunity: (post: Post) => {
    const opps = db.getOpportunities();
    if (!opps.find(o => o.id === post.id)) {
      db.saveOpportunities([post, ...opps]);
    }
  },
  deletePost: (postId: string) => {
    const posts = db.getPosts();
    db.savePosts(posts.filter(p => p.id !== postId));
    const opps = db.getOpportunities();
    db.saveOpportunities(opps.filter(o => o.id !== postId));
  },
  getResources: (): Resource[] => parseArray<Resource>(DB_KEYS.RESOURCES, INITIAL_RESOURCES),
  saveResource: (resource: Resource) => {
    const resources = db.getResources();
    localStorage.setItem(DB_KEYS.RESOURCES, JSON.stringify([resource, ...resources]));
  },
  getCalendarEvents: (): CalendarEvent[] => parseArray<CalendarEvent>(DB_KEYS.CALENDAR, []),
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
      }
      return ev;
    });
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
  },
  getAds: (): Ad[] => parseArray<Ad>(DB_KEYS.ADS, []),
  saveAds: (ads: Ad[]) => localStorage.setItem(DB_KEYS.ADS, JSON.stringify(ads)),
  getEvents: () => []
};
