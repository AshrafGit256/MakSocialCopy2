
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'explore', label: 'Explore', icon: <Compass size={22} /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={22} /> },
  { id: 'groups', label: 'Colleges', icon: <LayoutGrid size={22} /> },
  { id: 'profile', label: 'Profile', icon: <User size={22} /> },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah A.',
    // Fixed: Added missing authorId
    authorId: 'u1',
    authorRole: 'CS Student',
    authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
    timestamp: '2 hours ago',
    content: 'Excited about the new AI lab in COCIS block B!',
    hashtags: ['#COCIS', '#AI', '#Makerere'],
    images: ['https://picsum.photos/seed/lab/800/450'],
    likes: 42,
    // Fix: Updated comments to be an array and added commentsCount
    comments: [],
    commentsCount: 12,
    // Fix: Added missing required views property
    views: 120,
    // Fix: Added missing required flags property
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    aiMetadata: { sentiment: 'Positive', category: 'Academic' }
  },
  {
    id: '2',
    author: 'Admin',
    // Fixed: Added missing authorId
    authorId: 'admin',
    authorRole: 'University Admin',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '1 day ago',
    content: 'All Finalists from CEDAT are reminded to clear with the library by Friday.',
    hashtags: ['#CEDAT', '#Graduation'],
    likes: 155,
    // Fix: Updated comments to be an array and added commentsCount
    comments: [],
    commentsCount: 48,
    // Fix: Added missing required views property
    views: 850,
    // Fix: Added missing required flags property
    flags: [],
    isOpportunity: true,
    college: 'CEDAT',
    aiMetadata: { sentiment: 'Neutral', category: 'Career' }
  }
];

// Fix: Adding missing required 'engagement' property to match AnalyticsData type
export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 150, activeUsers: 520, messages: 1400, revenue: 600, engagement: 1530 },
  { day: 'Wed', posts: 200, activeUsers: 600, messages: 1800, revenue: 550, engagement: 1900 },
  { day: 'Thu', posts: 180, activeUsers: 580, messages: 1600, revenue: 800, engagement: 1770 },
  { day: 'Fri', posts: 250, activeUsers: 720, messages: 2100, revenue: 1200, engagement: 2330 },
  { day: 'Sat', posts: 100, activeUsers: 300, messages: 800, revenue: 400, engagement: 950 },
  { day: 'Sun', posts: 80, activeUsers: 250, messages: 600, revenue: 300, engagement: 775 },
];

// Added to fix the import error in components/Chat.tsx
export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'c1',
    user: { name: 'Sarah A.', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    lastMessage: 'The notes are on the portal.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Hey, did you see the new assignment?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just started working on it.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The notes are on the portal.', timestamp: '10:10 AM', isMe: false },
    ]
  },
  {
    id: 'c2',
    user: { name: 'Kato John', avatar: 'https://i.pravatar.cc/150?u=kato' },
    lastMessage: 'See you at the library.',
    unreadCount: 0,
    messages: [
      { id: 'm4', text: 'Are we meeting today?', timestamp: 'Yesterday', isMe: false },
      { id: 'm5', text: 'Yeah, 2 PM?', timestamp: 'Yesterday', isMe: true },
      { id: 'm6', text: 'See you at the library.', timestamp: 'Yesterday', isMe: false },
    ]
  }
];
