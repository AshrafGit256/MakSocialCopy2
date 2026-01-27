import React from 'react';
import { 
  Home, Search, MessageCircle, User, Calendar, BookOpen, Bell, Award
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: <Home size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'notifications', label: 'Signals', icon: <Bell size={22} /> },
  { id: 'messages', label: 'Direct', icon: <MessageCircle size={22} /> },
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
    author: 'Roy Ssemboga',
    authorId: 'roy_ssemboga',
    authorRole: 'Former Guild President',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy',
    authorAuthority: 'Student Leader',
    timestamp: '15m ago',
    content: `<h1>University Infrastructure Uplink</h1>
<p>I have received reports regarding connectivity issues in the CEDAT wing. I'm engaging with the technical team to ensure that nodes are restored before the end of the day. Please report specific block numbers below.</p>`,
    hashtags: ['#MakInfrastructure', '#StudentWelfare'],
    likes: 412,
    commentsCount: 3,
    comments: [
      { id: 'c1', author: 'Shamim Nambassa', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamim', text: 'Confirmed. Block B is currently offline since 08:00.', timestamp: '10m ago' },
      { id: 'c2', author: 'Gilbert Nawangwe', authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC', text: 'Technical teams have been notified and are on site for repairs.', timestamp: '5m ago' }
    ],
    views: 2500,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT'
  },
  {
    id: 'p-event-1',
    author: 'Gilbert Nawangwe',
    authorId: 'vc_office',
    authorRole: 'Vice Chancellor',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC',
    authorAuthority: 'Administrator',
    timestamp: '1h ago',
    isEventBroadcast: true,
    eventTitle: '89th Guild Inauguration Ceremony',
    eventDate: 'October 25, 2026',
    eventTime: '10:00 AM',
    eventLocation: 'Main Hall',
    eventFlyer: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=1200',
    content: `<h2>Official Invitation: Leadership Transition</h2>
<p>We invite all verified student nodes to witness the official swearing-in of the 89th Guild Cabinet. This ceremony marks a new chapter in student governance on the Hill.</p>`,
    hashtags: ['#Inauguration89', '#MakLeadership'],
    likes: 1250,
    commentsCount: 24,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-ad-1',
    author: 'Centenary Bank',
    authorId: 'centenary_node',
    authorRole: 'Strategic Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cente',
    authorAuthority: 'Corporate',
    timestamp: '2h ago',
    isAd: true,
    content: `<h2>Smart Student Banking Protocol</h2>
<p>Open a CenteStudent account today and enjoy zero maintenance fees and instant mobile banking sync. Get your verified student ID card linked for easier tuition processing.</p>
<img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200" class="rounded-lg my-4" />`,
    hashtags: ['#FinSync', '#StudentBanking'],
    likes: 89,
    commentsCount: 0,
    comments: [],
    views: 12400,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-opp-1',
    author: 'Dr. Jane Nalule',
    authorId: 'jane_nalule',
    authorRole: 'Head of Research',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    authorAuthority: 'Lecturer',
    timestamp: '3h ago',
    content: `<h2>Research Assistant Manifest: AI Ethics</h2>
<p>The COCIS AI Lab is recruiting 3 Finalist students for a cross-wing research project on ethical AI strata in East African governance. Experience with Python required.</p>`,
    hashtags: ['#ResearchOpportunity', '#COCIS', '#AI'],
    likes: 156,
    commentsCount: 8,
    comments: [],
    views: 4200,
    flags: [],
    isOpportunity: true,
    opportunityData: {
      type: 'Internship',
      isAIVerified: true,
      detectedBenefit: 'UGX 500k Stipend'
    },
    college: 'COCIS'
  },
  {
    id: 'p-2',
    author: 'Gilbert Nawangwe',
    authorId: 'vc_office',
    authorRole: 'Vice Chancellor',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC',
    authorAuthority: 'Administrator',
    timestamp: '5h ago',
    content: `<h2>Postgraduate Academic Update</h2>
<p>The academic council has reviewed the new strata for thesis submissions. All doctoral nodes must ensure their abstracts are uploaded to the central registry for peer review before the November deadline.</p>`,
    hashtags: ['#MakerereResearch', '#OfficialBroadcast'],
    likes: 890,
    commentsCount: 15,
    comments: [
      { id: 'c3', author: 'Roy Ssemboga', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy', text: 'This will help streamline the review cycles significantly.', timestamp: '45m ago' }
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