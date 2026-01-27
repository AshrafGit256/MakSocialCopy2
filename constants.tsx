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
<p>I have received reports regarding connectivity issues in the CEDAT wing. I'm engaging with the technical team to ensure that nodes are restored before the end of the day.</p>`,
    hashtags: ['#MakInfrastructure', '#StudentWelfare'],
    likes: 245,
    commentsCount: 3,
    comments: [
      { id: 'c1', author: 'Shamim Nambassa', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shamim', text: 'Thank you Roy. Block B is particularly problematic.', timestamp: '10m ago' },
      { id: 'c2', author: 'Gilbert Nawangwe', authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC', text: 'Technical teams have been notified and are on site.', timestamp: '5m ago' }
    ],
    views: 1200,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT'
  },
  {
    id: 'p-2',
    author: 'Gilbert Nawangwe',
    authorId: 'vc_office',
    authorRole: 'Vice Chancellor',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC',
    authorAuthority: 'Administrator',
    timestamp: '1h ago',
    content: `<h2>Official Academic Update</h2>
<p>The academic council is reviewing the new research protocols for the postgraduate strata. We encourage all finalists to verify their graduation parameters in the central registry.</p>`,
    hashtags: ['#MakerereResearch', '#OfficialBroadcast'],
    likes: 890,
    commentsCount: 1,
    comments: [
      { id: 'c3', author: 'Roy Ssemboga', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roy', text: 'This is a welcome development for all students.', timestamp: '45m ago' }
    ],
    views: 5600,
    flags: [],
    isOpportunity: true,
    opportunityData: {
      type: 'Grant',
      isAIVerified: true,
      detectedBenefit: 'Research Support'
    },
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