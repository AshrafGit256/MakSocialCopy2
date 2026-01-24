
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User, Calendar, BookOpen, Newspaper, GitPullRequest
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: <Home size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'forge', label: 'The Forge', icon: <GitPullRequest size={22} /> },
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
  },
  {
    id: 'inst-2',
    author: 'Mak AI Lab',
    authorId: 'mak_ailab',
    authorRole: 'Research Center',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AILab',
    authorAuthority: 'Official',
    timestamp: '2h ago',
    content: `<h2>Neural Logic Internship Program 🧠</h2>
<p>Seeking <b>Graduate Research Assistants</b> for the <u>NLP and Computer Vision</u> clusters. Candidates must possess the following alphanumeric credentials:</p>
<ul style="list-style-type: disc; padding-left: 20px;">
  <li>Proficiency in <span style="background-color: #fef08a; padding: 2px 5px; border-radius: 4px; color: black;">Python & PyTorch</span></li>
  <li>Experience with Edge Computing</li>
  <li>Active participation in COCIS Labs</li>
</ul>
<p style="background-color: #ef4444; color: white; padding: 10px; border-radius: 6px; text-align: center; font-weight: 800;">DEADLINE: FRIDAY, 5:00 PM EAT</p>
<p>Visit our node at <a href="#">ai.mak.ac.ug/internships</a> for synchronization.</p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#AI', '#COCIS', '#Research'],
    likes: 892,
    commentsCount: 34,
    comments: [],
    views: 28000,
    flags: [],
    isOpportunity: true,
    college: 'COCIS'
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
  },
  {
    id: 'c3',
    user: { name: 'Admin Registry', avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png'},
    lastMessage: 'Protocol updated for semester 2.',
    unreadCount: 1,
    messages: [
      { id: 'm6', text: 'Query: When is the next vault sync?', timestamp: 'Yesterday', isMe: true },
      { id: 'm7', text: 'Protocol updated for semester 2. Check the Forge.', timestamp: 'Yesterday', isMe: false },
    ]
  },
  {
    id: 'c4',
    user: { name: 'Justice LAW', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Justice'},
    lastMessage: 'Legal brief finalized.',
    unreadCount: 0,
    messages: [
      { id: 'm8', text: 'Handshake: Discussing Article 45 compliance.', timestamp: '2 days ago', isMe: true },
      { id: 'm9', text: 'Legal brief finalized. Forwarding to CHS node.', timestamp: '2 days ago', isMe: false },
    ]
  }
];
