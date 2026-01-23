
import { Post, User, College, UserStatus, Resource, CalendarEvent, Ad, RevenuePoint, ResourceType } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v17',
  USERS: 'maksocial_users_v17',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  RESOURCES: 'maksocial_resources_v7',
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

const INITIAL_OPPORTUNITIES: Post[] = [
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
    likes: 42,
    commentsCount: 12,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: true,
    college: 'COCIS',
    opportunityData: {
      type: 'Gig',
      deadline: getFutureDate(1), // EXPIRING TOMORROW
      isAIVerified: true,
      detectedBenefit: 'Immediate Payment'
    }
  },
  {
    id: 'opp-2',
    author: 'Google DSC Mak',
    authorId: 'gdsc_mak',
    authorRole: 'Tech Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=GDSC',
    timestamp: '5h ago',
    content: 'The 2025 Core Team selection is open. Looking for leads in Web, Cloud, and AI wings.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Leadership', '#Tech'],
    likes: 89,
    commentsCount: 24,
    comments: [],
    views: 3400,
    flags: [],
    isOpportunity: true,
    college: 'Global',
    opportunityData: {
      type: 'Workshop',
      deadline: getFutureDate(3), // EXPIRING SOON
      isAIVerified: true,
      detectedBenefit: 'Core Team Roles'
    }
  },
  {
    id: 'opp-3',
    author: 'Mastercard Foundation',
    authorId: 'mcf_mak',
    authorRole: 'Sponsor Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=MCF',
    timestamp: '1d ago',
    content: 'Full Scholarship Call for CHS and CEDAT finalists. Must have a CGPA of 4.0 and above.',
    customFont: '"JetBrains Mono"',
    hashtags: ['#Scholarship', '#Grant'],
    likes: 450,
    commentsCount: 110,
    comments: [],
    views: 15000,
    flags: [],
    isOpportunity: true,
    college: 'Global',
    opportunityData: {
      type: 'Scholarship',
      deadline: getFutureDate(14),
      isAIVerified: true,
      detectedBenefit: 'Full Tuition Cover'
    }
  }
];

export const db = {
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID);
    return users.find(u => u.id === currentId) || users[0];
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) users[index] = user;
    else users.push(user);
    db.saveUsers(users);
  },
  getPosts: (filter?: College | 'Global'): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    let posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS;
    if (filter && filter !== 'Global') posts = posts.filter(p => p.college === filter);
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    if (post.isOpportunity) db.addOpportunity(post);
  },
  getOpportunities: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.OPPORTUNITIES);
    const opps: Post[] = saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    
    const now = new Date().getTime();
    return opps
      .filter(o => {
        if (!o.opportunityData?.deadline) return true;
        return new Date(o.opportunityData.deadline).getTime() >= now;
      })
      .sort((a, b) => {
        const da = a.opportunityData?.deadline ? new Date(a.opportunityData.deadline).getTime() : Infinity;
        const dbVal = b.opportunityData?.deadline ? new Date(b.opportunityData.deadline).getTime() : Infinity;
        return da - dbVal;
      });
  },
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
  getResources: (): Resource[] => [],
  getCalendarEvents: (): CalendarEvent[] => [],
  saveCalendarEvent: (event: CalendarEvent) => {},
  registerForEvent: (eventId: string, userId: string) => {},
  getAds: (): Ad[] => [],
  saveAds: (ads: Ad[]) => {},
  getEvents: () => []
};
