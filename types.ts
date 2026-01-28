
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'forge' | 'groups' | 'search' | 'calendar' | 'resources' | 'settings' | 'thread' | 'opportunities' | 'notifications';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';
export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin' | 'Graduate' | 'Alumni' | 'Staff' | 'Official' | 'Corporate' | 'Academic Council';

export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

export interface GroupMessage {
  id: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: 'image' | 'document';
    data: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  isOfficial: boolean;
  creatorId: string;
  memberIds: string[];
  messages: GroupMessage[];
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  category: ResourceType;
  college: College | 'Global';
  course: string;
  year: string;
  author: string;
  authorRole: string;
  downloads: number;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP';
  fileData?: string;
  timestamp: string;
  aiSummary?: string;
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  authorRole: string;
  authorAvatar: string;
  authorAuthority?: AuthorityRole;
  timestamp: string;
  content: string;
  images?: string[];
  video?: string;
  hashtags: string[];
  likes: number;
  commentsCount: number;
  comments: Comment[];
  views: number;
  flags: string[]; 
  isOpportunity: boolean;
  college: College | 'Global';
  isEventBroadcast?: boolean;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventFlyer?: string;
  opportunityData?: {
    type: 'Internship' | 'Grant' | 'Gig' | 'Scholarship' | 'Workshop';
    deadline?: string;
    isAIVerified: boolean;
    detectedBenefit: string;
  };
  pollData?: PollData;
  // Fix: Added missing properties used in constants and components
  isAd?: boolean;
  eventId?: string;
  eventRegistrationLink?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connections: number;
  email?: string;
  college: College | 'Global';
  status: UserStatus;
  subscriptionTier: SubscriptionTier; 
  verified?: boolean;
  badges: string[];
  bio?: string;
  // Fix: Added missing properties used in db.ts and Admin.tsx
  joinedColleges?: string[];
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  totalLikesCount?: number;
  appliedTo?: string[];
  location?: string;
  skills?: string[];
  accountStatus?: 'Stable' | 'Suspended';
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voterIds: string[];
}

export interface PollData {
  options: PollOption[];
  totalVotes: number;
  expiresAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; 
  time: string;
  location: string;
  image?: string;
  category: 'Academic' | 'Social' | 'Sports' | 'Exams' | 'Other';
  createdBy: string;
  attendeeIds?: string[]; 
  registrationLink?: string;
}

export interface AppSettings {
  primaryColor: string;
  fontFamily: string;
  themePreset: 'standard' | 'oled' | 'tactical' | 'paper';
  borderRadius: string;
}

export interface Notification {
  id: string;
  type: 'skill_match' | 'engagement' | 'follow' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  meta?: {
    hash?: string;
    reason?: string;
  };
}

export interface Ad {
  id: string;
  clientName: string;
  title: string;
  reach: number;
  status: 'Active' | 'Pending' | 'Completed';
  budget: number;
  spent: number;
  clicks: number;
}

export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string };
  unreadCount: number;
  lastMessage: string;
  messages: { id: string; text: string; timestamp: string; isMe: boolean }[];
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  expenses: number;
  // Fix: Added missing properties used in db.ts
  subscribers?: number;
  growth?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  admin: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface FlaggedContent {
  id: string;
  contentType: 'post' | 'comment' | 'user';
  reason: string;
  reportedBy: string;
  contentPreview: string;
  timestamp: string;
}

export interface MarketService {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  title: string;
  description: string;
  price: string;
  category: string;
  college: College;
  rating: number;
  reviewsCount: number;
  isPromoted: boolean;
}

export interface LiveEvent {
  id: string;
  title: string;
  organizer: string;
  youtubeUrl: string;
}
