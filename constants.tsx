
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User, Calendar, BookOpen, Newspaper
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: <Home size={22} /> },
  { id: 'search', label: 'Explore', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'explore', label: 'Discovery', icon: <Compass size={22} /> },
  { id: 'messages', label: 'Direct', icon: <MessageCircle size={22} /> },
  { id: 'groups', label: 'Wing Hubs', icon: <LayoutGrid size={22} /> },
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
    id: 'creative-1',
    author: 'Literature Node Alpha',
    authorId: 'u_lit',
    authorRole: 'Scholarly Collective',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lit',
    authorAuthority: 'Lecturer',
    timestamp: 'Just now',
    content: `<h1>The Renaissance of the Hill</h1>
<p style="text-align: justify;">In this thesis, we explore the <u>profound transformation</u> of academic discourse through digital synchronization. Note the following observation logs:</p>
<blockquote style="text-align: center; border: none; font-size: 1.2rem;">"The book is a node in a much larger knowledge network."</blockquote>
<ul>
  <li><b>Phase I:</b> Textual Digitization</li>
  <li><b>Phase II:</b> Collective Commentary</li>
  <li><b>Phase III:</b> Neural Asset Management</li>
</ul>
<p>Visit the <a href="#">Resource Vault</a> for full telemetry.</p>`,
    customFont: '"Playfair Display"',
    hashtags: ['#Literature', '#CHUSS', '#Research'],
    likes: 842,
    commentsCount: 22,
    comments: [],
    views: 12400,
    flags: [],
    isOpportunity: false,
    college: 'CHUSS',
    aiMetadata: { category: 'Academic', isSafe: true }
  },
  {
    id: 'creative-2',
    author: 'Ashraf G.',
    authorId: 'u1',
    authorRole: 'Protocol Architect',
    authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    authorAuthority: 'Super Admin',
    timestamp: '2h ago',
    content: `<h2>Node Benchmark Results 🚀</h2>
<p>Current system latency logs for the COCIS Hub Wing:</p>
<table style="width:100%; border: 1px solid #30363d; margin: 15px 0;">
  <tr style="background: rgba(99, 102, 241, 0.1);">
    <th style="padding: 10px; text-align: left;">Segment</th>
    <th style="padding: 10px; text-align: left;">Latency</th>
  </tr>
  <tr>
    <td style="padding: 10px;">Primary Uplink</td>
    <td style="padding: 10px;">12.4ms</td>
  </tr>
  <tr>
    <td style="padding: 10px;">Vault Sync</td>
    <td style="padding: 10px;">4.8ms</td>
  </tr>
</table>
<p style="text-align: right;"><b>System Status:</b> <span style="background-color: #059669; color: white; padding: 2px 8px; border-radius: 4px;">NOMINAL</span></p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#SystemLog', '#COCIS', '#MakSocial'],
    likes: 1200,
    commentsCount: 45,
    comments: [],
    views: 89000,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    aiMetadata: { category: 'Academic', isSafe: true }
  },
  {
    id: 'creative-3',
    author: 'Social Vibes Node',
    authorId: 'u_vibes',
    authorRole: 'Campus Pulse',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vibes',
    timestamp: '5h ago',
    content: `<p style="text-align: center;"><span style="background-color: #fef08a; padding: 10px 20px; border-radius: 10px; color: black; font-size: 1.5rem;">OMG GUYS! CHICKEN TONIGHT DEALS ARE WILD! 🍗✨</span></p>
<p style="text-align: center;">I used <u>Comic Sans</u> because this post is <b>100% vibes</b> and <b>0% stress</b>. Meet us at the food court at 2PM for the synchronization event!</p>`,
    customFont: '"Comic Sans MS", "Comic Sans", cursive',
    hashtags: ['#FoodCourt', '#MakerereVibes'],
    likes: 450,
    commentsCount: 18,
    comments: [],
    views: 4500,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    aiMetadata: { category: 'Social', isSafe: true }
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
    user: { name: 'Guru A.', avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg'},
    lastMessage: 'The research notes are in the Vault.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Hey, did you see the new AI thesis?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just synced with that node.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The research notes are in the Vault.', timestamp: '10:10 AM', isMe: false },
    ]
  }
];
