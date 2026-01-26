
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
    id: 'poll-text-node-1',
    author: 'COCIS Council',
    authorId: 'cocis_hub',
    authorRole: 'Official Body',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=COCIS',
    authorAuthority: 'Official',
    timestamp: '15m ago',
    content: `<h1>Preferred Framework for Finalist Hackathon?</h1>
<p>We are allocating server clusters. Select your node's primary stack.</p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#TechStack', '#MakerereAI'],
    likes: 86,
    commentsCount: 24,
    comments: [],
    views: 450,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    pollData: {
      totalVotes: 142,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      options: [
        { id: 't1', text: 'React + Node.js (Stable)', votes: 75, voterIds: [] },
        { id: 't2', text: 'Python + Django (Legacy)', votes: 42, voterIds: [] },
        { id: 't3', text: 'Flutter (Mobile Wing)', votes: 25, voterIds: [] }
      ]
    }
  },
  {
    id: 'poll-img-node-1',
    author: 'CEDAT Arts Wing',
    authorId: 'cedat_arts',
    authorRole: 'Design Cluster',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CEDAT',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    content: `<h2>Guild 90th Cycle Logo Selection 🎨</h2>
<p>Which visual identity represents the legacy best?</p>`,
    customFont: '"Plus Jakarta Sans"',
    hashtags: ['#Design', '#Guild90'],
    likes: 520,
    commentsCount: 89,
    comments: [],
    views: 12000,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT',
    pollData: {
      totalVotes: 890,
      expiresAt: new Date(Date.now() + 172800000).toISOString(),
      options: [
        { 
          id: 'i1', 
          text: 'Minimalist Vector', 
          imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400', 
          votes: 540, 
          voterIds: [] 
        },
        { 
          id: 'i2', 
          text: 'Heritage Crest', 
          imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=400', 
          votes: 350, 
          voterIds: [] 
        }
      ]
    }
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
    user: { name: 'Guru A.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashraf'},
    lastMessage: 'The research notes are in the Vault.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Hey, did you see the new AI thesis?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just synced with that node.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The research notes are in the Vault.', timestamp: '10:10 AM', isMe: false },
    ]
  },
  {
    id: 'c2',
    user: { name: 'Sarah CEDAT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'},
    lastMessage: 'Circuit schematic verified.',
    unreadCount: 0,
    messages: [
      { id: 'm4', text: 'Sarah, is the Alpha-7 node ready?', timestamp: '09:00 AM', isMe: true },
      { id: 'm5', text: 'Circuit schematic verified. Ready for uplink.', timestamp: '09:15 AM', isMe: false },
    ]
  }
];
