
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User, Calendar, BookOpen, Newspaper
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Global Pulse', icon: <Home size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'Resource Vault', icon: <BookOpen size={22} /> },
  { id: 'explore', label: 'Explore', icon: <Compass size={22} /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={22} /> },
  { id: 'groups', label: 'Wing Hubs', icon: <LayoutGrid size={22} /> },
  { id: 'profile', label: 'Profile', icon: <User size={22} /> },
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
    id: 'art-1',
    author: 'Prof. Sserunjogi D.',
    authorId: 'lecturer_1',
    authorRole: 'Senior Researcher',
    authorAvatar: 'https://i.pravatar.cc/150?u=prof',
    authorAuthority: 'Lecturer',
    timestamp: '15m ago',
    content: `The Future of Artificial Intelligence on the Hill: A Decadal Outlook.

As we navigate the mid-2020s, the integration of Large Language Models within our academic framework is no longer a peripheral experiment but a central architectural necessity. Our recent studies at the COCIS Innovation Node suggest that by 2030, student-AI collaboration will account for 65% of all software engineering throughput on campus.

However, the ethical stratification of these tools remains a concern. How do we ensure that the "Hill Protocol" remains a human-first experience while leveraging the high-density analytical capabilities of neural networks? We are proposing a new "Verified Intelligence" badge for academic posts that utilize AI for data synthesis but remain human-authored in their final logic. 

The hill must not just adapt; it must lead. Our upcoming symposium in Freedom Square will address these precise intersections. Every node participant is encouraged to scan the full registry of this report in the Resource Vault.`,
    hashtags: ['#AIReseach', '#MakerereInnovation', '#DeepScan'],
    likes: 892,
    commentsCount: 45,
    comments: [],
    views: 12400,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    aiMetadata: { category: 'Academic', isSafe: true }
  },
  {
    id: 'art-2',
    author: 'Namono Grace',
    authorId: 'u45',
    authorRole: 'Literature Finalist',
    authorAvatar: 'https://i.pravatar.cc/150?u=grace',
    timestamp: '1 hour ago',
    content: `The digital age hasn't killed the book; it has redefined the library. My thesis explores the transition of African Literature from physical scrolls and bound volumes to high-density digital nodes. 

At Makerere, we see this transition most vividly. The CHUSS wing is no longer just a collection of lecture halls but a vibrant broadcast network where poetry is shared in real-time. We are seeing a resurgence of "Digital Orality"—using platforms like MakSocial to broadcast spoken word to thousands of nodes simultaneously. 

Literature is no longer a solitary act of reading but a collective act of synchronization. As we move forward, the "Academic Vault" will become our most precious cultural repository, housing not just papers, but the living voice of the hill.`,
    hashtags: ['#Literature', '#CHUSS', '#DigitalAfricanism'],
    likes: 567,
    commentsCount: 22,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    college: 'CHUSS',
    aiMetadata: { category: 'Social', isSafe: true }
  },
  {
    id: 'ev-broadcast-1',
    author: 'Guild Electoral Commission',
    authorId: 'super_admin',
    authorRole: 'Official Registry',
    authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    authorAuthority: 'Super Admin',
    timestamp: 'Just now',
    content: 'All students are invited to witness the 89th Guild Inauguration. This is a mandatory attendance event for student leaders.',
    hashtags: ['#Guild89', '#Inauguration', '#Makerere'],
    likes: 342,
    commentsCount: 12,
    comments: [],
    views: 2500,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    isEventBroadcast: true,
    eventId: 'ev-1',
    eventTitle: '89th Guild Inauguration Ceremony',
    eventDate: '2025-05-15',
    eventTime: '14:00',
    eventLocation: 'Main Hall, Makerere University'
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
