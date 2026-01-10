
export type AppView = 'landing' | 'login' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events';

export interface Post {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  image?: string;
  hashtags: string[];
  likes: number;
  comments: number;
  isOpportunity: boolean;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  connections: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatSession {
  id: string;
  user: User;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
}
