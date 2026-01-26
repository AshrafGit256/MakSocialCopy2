
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
    id: 'poll-text-1',
    author: 'COCIS Research Hub',
    authorId: 'cocis_hub',
    authorRole: 'Academic Council',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=COCIS',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    content: `<h1>Preferred Tech Stack for Finalist Projects?</h1>
<p>We are collecting metadata for the upcoming Hackathon. Which framework node should we prioritize for infrastructure support?</p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#TechStack', '#MakerereAI'],
    likes: 245,
    commentsCount: 12,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    pollData: {
      totalVotes: 86,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      options: [
        { id: 'opt1', text: 'React + Node.js (V8)', votes: 45, voterIds: [] },
        { id: 'opt2', text: 'Python + Django (Alpha)', votes: 20, voterIds: [] },
        { id: 'opt3', text: 'Flutter Mobile Link', votes: 21, voterIds: [] }
      ]
    }
  },
  {
    id: 'poll-img-1',
    author: 'CEDAT Arts Wing',
    authorId: 'cedat_arts',
    authorRole: 'Design Cluster',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CEDAT',
    authorAuthority: 'Official',
    timestamp: '3h ago',
    content: `<h2>Guild Logo Redesign Sequence 🎨</h2>
<p>Signal synchronization needed. Which visual identity node best represents the 90th Guild cycle?</p>`,
    customFont: '"Plus Jakarta Sans"',
    hashtags: ['#Design', '#Guild90'],
    likes: 560,
    commentsCount: 45,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT',
    pollData: {
      totalVotes: 320,
      expiresAt: new Date(Date.now() + 172800000).toISOString(),
      options: [
        { 
          id: 'img1', 
          text: 'Minimalist Vector', 
          imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400', 
          votes: 180, 
          voterIds: [] 
        },
        { 
          id: 'img2', 
          text: 'Classic Crest', 
          imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=400', 
          votes: 140, 
          voterIds: [] 
        }
      ]
    }
  },
  {
    id: 'inst-1',
    author: 'MakUnipod',
    authorId: 'mak_unipod',
    authorRole: 'Innovation Wing',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Unipod',
    authorAuthority: 'Official',
    timestamp: 'Just now',
    content: `<h1>Prototyping Grant Signal Activated 🚀</h1>
<p style="text-align: justify;">We are offering <b>5 PROTOTYPING GRANTS</b> for the semester. If you have an engineering or design node ready for deployment, scan our table below:</p>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid var(--border-color);">
  <tr style="background-color: rgba(99, 102, 241, 0.1);">
    <th style="padding: 10px; border: 1px solid var(--border-color);">Batch</th>
    <th style="padding: 10px; border: 1px solid var(--border-color);">Focus Area</th>
    <th style="padding: 10px; border: 1px solid var(--border-color);">Grant Amount</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Alpha</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Renewable Energy</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">UGX 2,500,000</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Beta</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">IoT Solutions</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">UGX 1,800,000</td>
  </tr>
</table>
<blockquote style="border-left: 4px solid #6366f1; padding-left: 10px; font-style: italic;">"Ideas are nodes; prototypes are the uplink."</blockquote>
<p style="text-align: center;"><span style="color: #6366f1; font-weight: 800; font-size: 1.2rem;">Apply via the Research Vault today!</span></p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#Innovation', '#MakUnipod', '#CEDAT'],
    likes: 1540,
    commentsCount: 89,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: true,
    college: 'CEDAT'
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 150, activeUsers: 520, messages: 1400, revenue: 600, engagement: 1530 },
  { day: 'Wed', posts: 200, activeUsers: 600, messages: 1800, revenue: 550, engagement: 1900 },
  { day: 'Thu', posts: 180, activeUsers: 580, messages: 1600, revenue: 800, engagement: 1770 },
  { day: 'Fri', posts: 250, activeUsers: 720, messages: 2100, revenue: 1200, engagement: 2330 },
  { day: 'Sat', posts: 100, activeUsers: 300, messages: 800, revenue: 400, engagement: 950 },
  // Fixed typo: changed 'growths' to 'messages' to align with AnalyticsData interface
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
