
import React from 'react';
import { 
  Home, Search, MessageCircle, User, Calendar, BookOpen, Bell, Award, Users
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Pulse Feed', icon: <Home size={22} /> },
  { id: 'groups', label: 'Groups Hub', icon: <Users size={22} /> },
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
    id: 'p-ad-airtel',
    author: 'Airtel Uganda',
    authorId: 'airtel_official',
    authorRole: 'Network Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Airtel',
    authorAuthority: 'Corporate',
    isAd: true,
    timestamp: 'Just now',
    video: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Airtel2.mp4',
    content: `<h1>Airtel 5G: Speed for the Hill</h1>
<p>Experience the most aggressive 5G synchronization in Makerere. Whether it's uploading your research logs or streaming the latest strata updates, Airtel has the bandwidth you need.</p>`,
    hashtags: ['#Airtel5G', '#TheReason', '#MakConnect'],
    likes: 3800,
    commentsCount: 56,
    comments: [],
    views: 112000,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'p-ad-mtn',
    author: 'MTN Uganda',
    authorId: 'mtn_official',
    authorRole: 'Pulse Partner',
    authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    authorAuthority: 'Corporate',
    isAd: true,
    timestamp: 'Just now',
    video: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MTN.mp4',
    content: `<h1>MTN Pulse: Node Synchronization</h1>
<p>Get the most aggressive data bundles on the Hill. Dial <b>*157#</b> to synchronize your device with the Pulse strata. No sugary coating, just pure bandwidth for your research nodes.</p>`,
    hashtags: ['#MTNPulse', '#DataSync', '#MakerereConnect'],
    likes: 5400,
    commentsCount: 120,
    comments: [],
    views: 98000,
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
  }
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'chat-1',
    user: { name: 'Dr. John S.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    unreadCount: 2,
    lastMessage: 'Handshake successful. Ready for uplink.',
    messages: [
      { id: 'm1', text: 'Initializing protocol...', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Handshake successful. Ready for uplink.', timestamp: '10:01 AM', isMe: false }
    ]
  },
  {
    id: 'chat-2',
    user: { name: 'Sarah CEDAT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    unreadCount: 0,
    lastMessage: 'The CAD assets are synchronized.',
    messages: [
      { id: 'm3', text: 'Requesting CAD assets for wing review.', timestamp: '09:30 AM', isMe: true },
      { id: 'm4', text: 'The CAD assets are synchronized.', timestamp: '09:45 AM', isMe: false }
    ]
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 145, activeUsers: 480, messages: 1350, revenue: 420, engagement: 1350 },
  { day: 'Wed', posts: 180, activeUsers: 520, messages: 1600, revenue: 500, engagement: 1550 },
  { day: 'Thu', posts: 210, activeUsers: 600, messages: 1900, revenue: 620, engagement: 1800 },
  { day: 'Fri', posts: 240, activeUsers: 710, messages: 2400, revenue: 780, engagement: 2100 },
  { day: 'Sat', posts: 110, activeUsers: 320, messages: 900, revenue: 350, engagement: 950 },
  { day: 'Sun', posts: 90, activeUsers: 280, messages: 750, revenue: 280, engagement: 820 }
];
