
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
    content: `THE FUTURE OF AI: A DECADAL OUTLOOK 🔬\n\nRecent telemetry from the Hill suggests a 45% increase in neural-network assisted coding within COCIS. This post is styled in monospaced font to represent the raw data protocols we are monitoring.`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#AI', '#Data'],
    likes: 1200,
    commentsCount: 89,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    aiMetadata: { category: 'Academic', isSafe: true }
  },
  {
    id: 'art-2',
    author: 'Literature Hub',
    authorId: 'u45',
    authorRole: 'Scholarly Wing',
    authorAvatar: 'https://i.pravatar.cc/150?u=lit',
    timestamp: '1h ago',
    content: `The Elegance of the Written Word.\n\nIn this creative article, we explore the intersection of classical serif typography and modern student digital culture. Note the grace of the Playfair Display font applied specifically to this intelligence report.`,
    customFont: '"Playfair Display"',
    hashtags: ['#LiteraryHill'],
    likes: 892,
    commentsCount: 34,
    comments: [],
    views: 12000,
    flags: [],
    isOpportunity: false,
    college: 'CHUSS',
    images: ['https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=800'],
    aiMetadata: { category: 'Academic', isSafe: true }
  },
  {
    id: 'comic-shoutout',
    author: 'Meme Central',
    authorId: 'u99',
    authorRole: 'Social Hub',
    authorAvatar: 'https://i.pravatar.cc/150?u=meme',
    timestamp: '3h ago',
    content: `OMG GUYS! THE CHICKEN TONIGHT DEALS ARE CRAZY!! 🍗✨\n\nI used Comic Sans because this post is 100% vibes and zero stress. See you at the Food Court!`,
    customFont: '"Comic Sans MS", "Comic Sans", cursive',
    hashtags: ['#Vibes', '#MakFood'],
    likes: 4500,
    commentsCount: 200,
    comments: [],
    views: 98000,
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
