
import React from 'react';
import { 
  Home, Search, Compass, Film, MessageCircle, Users, Bell, PlusSquare, LayoutGrid, User,
  Globe, Calendar, ShoppingCart, Settings, ShieldAlert, BarChart3, Clock, Trash2, CheckCircle
} from 'lucide-react';
import { Post, User as UserType, ChatSession, AnalyticsData } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'explore', label: 'Explore', icon: <Compass size={22} /> },
  { id: 'reel', label: 'Reel', icon: <Film size={22} /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={22} /> },
  { id: 'network', label: 'Network', icon: <Users size={22} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={22} /> },
  { id: 'create', label: 'Create', icon: <PlusSquare size={22} /> },
  { id: 'groups', label: 'Groups', icon: <LayoutGrid size={22} /> },
  { id: 'profile', label: 'Profile', icon: <User size={22} /> },
];

export const TOP_NAV = [
  { id: 'network', label: 'Network', icon: <Globe size={18} className="mr-2" /> },
  { id: 'events', label: 'Events', icon: <Calendar size={18} className="mr-2" /> },
  { id: 'market', label: 'Market', icon: <ShoppingCart size={18} className="mr-2" /> },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah A.',
    authorRole: 'CS Student',
    authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
    timestamp: '2 hours ago',
    content: 'Excited about the new AI lab! Who\'s taking the Machine Learning course?',
    hashtags: ['#CCIS', '#AI', '#Makerere'],
    image: 'https://picsum.photos/seed/lab/800/450',
    likes: 42,
    comments: 12,
    isOpportunity: false,
  },
  {
    id: '2',
    author: 'Kato John',
    authorRole: 'Finalist',
    authorAvatar: 'https://i.pravatar.cc/150?u=kato',
    timestamp: 'Just now',
    content: 'OPPORTUNITY: Looking for a React developer to help with a campus startup project. Paid work!',
    hashtags: ['#Jobs', '#React', '#Dev'],
    image: 'https://picsum.photos/seed/tech/800/450',
    likes: 15,
    comments: 8,
    isOpportunity: true,
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    user: { id: 'u1', name: 'Sarah A.', role: 'CS Student', avatar: 'https://i.pravatar.cc/150?u=sarah', connections: 245 },
    lastMessage: 'Excited about the new AI lab!',
    unreadCount: 3,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hey, did you see the new timetable?', timestamp: '10:30 AM', isMe: false },
      { id: 'm2', senderId: 'me', text: 'Not yet, where can I find it?', timestamp: '10:31 AM', isMe: true },
      { id: 'm3', senderId: 'u1', text: 'I\'ll send it over in a bit. We should form a study group.', timestamp: '10:35 AM', isMe: false },
    ]
  },
  {
    id: 'c2',
    user: { id: 'u2', name: 'Kato John', role: 'Finalist', avatar: 'https://i.pravatar.cc/150?u=kato', connections: 512 },
    lastMessage: 'Can you share the notes?',
    unreadCount: 1,
    messages: []
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200 },
  { day: 'Tue', posts: 150, activeUsers: 520, messages: 1400 },
  { day: 'Wed', posts: 200, activeUsers: 600, messages: 1800 },
  { day: 'Thu', posts: 180, activeUsers: 580, messages: 1600 },
  { day: 'Fri', posts: 250, activeUsers: 720, messages: 2100 },
  { day: 'Sat', posts: 100, activeUsers: 300, messages: 800 },
  { day: 'Sun', posts: 80, activeUsers: 250, messages: 600 },
];
