
/* Fix: Added 'groups' and 'search' to AppView union type to match navigation items and App routing logic */
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'explore' | 'groups' | 'search';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';

export interface TimelineEvent {
  id: string;
  type: 'like' | 'comment' | 'profile_update' | 'new_post' | 'ad_created' | 'poll_created';
  userId: string;
  userName: string;
  userAvatar: string;
  targetId?: string;
  description: string;
  timestamp: string; // ISO string
  details?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  isActive: boolean;
  votedUserIds: string[];
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'moderation' | 'engagement' | 'system';
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Violation {
  id: string;
  userId: string;
  userName: string;
  content: string;
  media?: string; // base64 encoded image
  mimeType?: string;
  reason: string;
  timestamp: string;
  status: 'blocked' | 'reviewed_ok' | 'reviewed_confirmed';
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  images?: string[];
  video?: string;
  externalLink?: string; 
  hashtags: string[];
  likes: number;
  commentsCount: number;
  comments: Comment[];
  views: number;
  flags: string[]; 
  isOpportunity: boolean;
  applicants?: string[]; 
  college: College;
  aiMetadata?: {
    sentiment: 'Positive' | 'Neutral' | 'Critical';
    category: 'Academic' | 'Social' | 'Finance' | 'Career' | 'Urgent';
    isSafe?: boolean;
    safetyReason?: string;
  };
  // AD PROPERTIES
  isAd?: boolean;
  adPartnerName?: string;
  adCtaText?: string;
  adLink?: string;
  adAmountPaid?: number;
  adExpiryDate?: string;
  adNotes?: string;
  // MakTV PROPERTIES
  isMakTV?: boolean;
  makTVType?: 'Interview' | 'News' | 'Brief';
  makTVGuest?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  connections: number;
  email?: string;
  college: College;
  status: UserStatus;
  isSuspended?: boolean;
  warningsCount?: number;
  badges: Badge[];
  appliedTo?: string[];
  notifications?: Notification[];
}

export interface LiveEvent {
  id: string;
  title: string;
  youtubeUrl: string;
  isLive: boolean;
  organizer: string;
}

export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
  violations?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatConversation {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  unreadCount: number;
  messages: ChatMessage[];
}
