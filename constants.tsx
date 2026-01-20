
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User, Calendar, BookOpen, Rocket, Bell, Orbit
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Intelligence Hub', icon: <Home size={22} /> },
  { id: 'synapse', label: 'Synapse AI', icon: <Orbit size={22} className="text-indigo-500" /> },
  { id: 'nexus', label: 'Project Nexus', icon: <Rocket size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={22} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'Academic Vault', icon: <BookOpen size={22} /> },
  { id: 'explore', label: 'Explore', icon: <Compass size={22} /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={22} /> },
  { id: 'groups', label: 'Colleges', icon: <LayoutGrid size={22} /> },
  { id: 'profile', label: 'Profile', icon: <User size={22} /> },
];

export const COLLEGE_BANNERS: Record<College, string> = {
  COCIS: 'https://cocis.mak.ac.ug/wp-content/uploads/2023/11/cropped-310964315_406158288372038_8724847734355824283_n.jpg',
  CEDAT: 'https://cedat.mak.ac.ug/wp-content/uploads/2025/02/CEDAT.jpg',
  CHUSS: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-QoIkQ0nQ2N73Nul0gfVlp1dqVQGGpB6W3A&s',
  CHS: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPL1UXf83MfnfVhZZDCSsLV7fNRedzZsgrng&s',
  CONAS: 'https://events.mak.ac.ug/sites/default/files/styles/large_crop/public/2024-02/Makerere-CoNAS-Department-of-Chemistry-Building.jpg?itok=ggYL8H6i',
  CAES: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7zXQnLfR09r8ZzOWYj9HikxcCeouKtbZw&s',
  COBAMS: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9_cgVOU3gaFxSIhXzzG_NGahErTclmQxKbQ&s',
  CEES: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXv9VuoL5yUJD7es8560C9qzaQpQfYKF9NLA&s',
  LAW: 'https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg'
};

export const MOCK_POSTS: Post[] = [
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
    eventFlyer: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvr2YhoOthHq7cV6DqnFdb9h0thE2b9DxHCA&s',
    eventDate: '2025-05-15',
    eventTime: '14:00',
    eventLocation: 'Main Hall, Makerere University',
    eventRegistrationLink: 'https://mak.ac.ug/guild'
  },
  {
    id: 'ev-broadcast-2',
    author: 'COCIS Admin',
    authorId: 'admin_cocis',
    authorRole: 'Academic Administrator',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    authorAuthority: 'Administrator',
    timestamp: '2 hours ago',
    content: 'The Innovation Challenge is now open for registration. Teams of up to 4 can apply to present their research and win significant funding.',
    hashtags: ['#InnovateMAK', '#Tech', '#COCIS'],
    likes: 89,
    commentsCount: 5,
    comments: [],
    views: 1200,
    flags: [],
    isOpportunity: true,
    college: 'COCIS',
    isEventBroadcast: true,
    eventId: 'ev-2',
    eventTitle: 'MAK Innovation Challenge 2025',
    eventFlyer: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200',
    eventDate: '2025-06-10',
    eventTime: '09:00',
    eventLocation: 'COCIS Conference Room',
    eventRegistrationLink: 'https://innovate.mak.ac.ug'
  },
  {
    id: 'global-1',
    author: 'Campus Admin',
    authorId: 'admin',
    authorRole: 'University Admin',
    authorAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
    authorAuthority: 'Administrator',
    timestamp: '1 hour ago',
    content: 'Welcome to the updated MakSocial! Please remember to join your college community to stay updated with academic news. Only global updates appear here.',
    hashtags: ['#MakSocial', '#Global', '#Makerere'],
    likes: 1200,
    comments: [],
    commentsCount: 200,
    views: 15000,
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
    lastMessage: 'The notes are on the portal.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Hey, did you see the new assignment?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just started working on it.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The notes are on the portal.', timestamp: '10:10 AM', isMe: false },
    ]
  }
];
