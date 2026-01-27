import React from 'react';
import { 
  Home, Search, MessageCircle, User, Calendar, BookOpen, Bell, Award
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Pulse Feed', icon: <Home size={22} /> },
  { id: 'search', label: 'Registry', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'notifications', label: 'Signals', icon: <Bell size={22} /> },
  { id: 'messages', label: 'Uplink', icon: <MessageCircle size={22} /> },
  { id: 'profile', label: 'Terminal', icon: <User size={22} /> },
];

export const COLLEGE_BANNERS: Record<College, string> = {
  COCIS: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200',
  CEDAT: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=1200',
  CHUSS: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=1200',
  CHS: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200',
  CONAS: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=1200',
  CAES: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=1200',
  COBAMS: 'https://images.unsplash.com/photo-1454165833767-02a6e30996d4?auto=format&fit=crop&w=1200',
  CEES: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200',
  LAW: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200'
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p-1',
    author: 'Prof. Barnabas Nawangwe',
    authorId: 'vc_office',
    authorRole: 'Vice Chancellor',
    authorAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    authorAuthority: 'Administrator',
    timestamp: '10m ago',
    content: `<h1>University Research Protocol</h1>
<p>I am pleased to announce that the central registry has authorized new research grants for the 2026 academic strata. All college hubs should sync their proposals before the examination blackout.</p>`,
    hashtags: ['#OfficialBroadcast', '#MakerereProgress'],
    likes: 2410,
    commentsCount: 15,
    comments: [],
    views: 18000,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-event-1',
    author: 'Makerere Events Node',
    authorId: 'events_admin',
    authorRole: 'Official Community Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Events',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    isEventBroadcast: true,
    eventTitle: '89th Guild Inauguration Gala',
    eventDate: 'October 30, 2026',
    eventTime: '10:00 AM',
    eventLocation: 'Main Hall',
    eventFlyer: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=1200',
    content: `<h2>Leadership Transition Initialized</h2>
<p>The University Council invites all student nodes to witness the official swearing-in of the 89th Guild Cabinet. Synchronization starts at 1000hrs.</p>`,
    hashtags: ['#Guild89', '#Leadership'],
    likes: 890,
    commentsCount: 2,
    comments: [],
    views: 12400,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-ad-1',
    author: 'Centenary Bank',
    authorId: 'centenary_bank',
    authorRole: 'Strategic Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Bank',
    authorAuthority: 'Corporate',
    isAd: true,
    timestamp: '2h ago',
    content: `<h1>Smart Student Banking Uplink</h1>
<p>Open a CenteStudent account today with <b>ZERO</b> maintenance fees. Get instant tuition clearance synchronization and mobile app access. Visit our node at the Main Admin wing.</p>
<img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200" class="rounded-lg my-4" />`,
    hashtags: ['#FinancialSync', '#SmartBanking'],
    likes: 420,
    commentsCount: 8,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-opp-1',
    author: 'COCIS AI Lab',
    authorId: 'ai_lab_node',
    authorRole: 'Research Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AI',
    authorAuthority: 'Academic Council',
    timestamp: '3h ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Internship',
      isAIVerified: true,
      detectedBenefit: 'UGX 800k Stipend'
    },
    content: `<h1>Opportunity: Neural Network Assistant</h1>
<p>We are recruiting 5 finalist students for the Alpha-Sync project. Experience with Python logic and data stratification is mandatory.</p>`,
    hashtags: ['#AIRecruitment', '#COCIS', '#Opportunity'],
    likes: 670,
    commentsCount: 42,
    comments: [],
    views: 8900,
    flags: [],
    college: 'COCIS'
  },
  {
    id: 'p-2',
    author: 'Roy Ssemboga',
    authorId: 'roy_ssemboga',
    authorRole: 'Former Guild President',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy',
    authorAuthority: 'Student Leader',
    timestamp: '5h ago',
    content: `<h1>Campus Infrastructure Feedback</h1>
<p>I have received signals regarding the connectivity issues in the CEDAT wing. I'm engaging with the technical council to ensure the fiber nodes are stabilized before the research deadline.</p>`,
    hashtags: ['#StudentWelfare', '#CEDAT'],
    likes: 1250,
    commentsCount: 89,
    comments: [
      { id: 'c1', author: 'Shamim Nambassa', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamim', text: 'Confirmed. Block B is completely offline since 0800hrs.', timestamp: '4h ago' }
    ],
    views: 5600,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 150, activeUsers: 520, messages: 1400, revenue: 600, engagement: 1530 },
  { day: 'Wed', posts: 200, activeUsers: 600, messages: 1800, revenue: 550, engagement: 1900 },
  { day: 'Thu', posts: 180, activeUsers: 580, messages: 1600, revenue: 800, engagement: 1770 },
  { day: 'Fri', posts: 250, activeUsers: 720, messages: 2100, revenue: 1200, engagement: 2330 },
  { day: 'Sat', posts: 100, activeUsers: 300, messages: 800, revenue: 400, engagement: 950 },
  { day: 'Sun', posts: 80, activeUsers: 250, messages: 600, revenue: 300, engagement: 775 },
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'c1',
    user: { name: 'Roy Ssemboga', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy'},
    lastMessage: 'The research notes are in the Vault.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Roy, did you see the new AI thesis?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just synced with that node.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The research notes are in the Vault.', timestamp: '10:10 AM', isMe: false },
    ]
  },
  {
    id: 'c2',
    user: { name: 'Shamim Nambassa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamim'},
    lastMessage: 'Circuit schematic verified.',
    unreadCount: 0,
    messages: [
      { id: 'm4', text: 'Shamim, is the Alpha-7 node ready?', timestamp: '09:00 AM', isMe: true },
      { id: 'm5', text: 'Circuit schematic verified. Ready for uplink.', timestamp: '09:15 AM', isMe: false },
    ]
  }
];