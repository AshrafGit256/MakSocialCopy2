
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'explore' | 'groups' | 'search' | 'calendar';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin';

/* Added missing AnalyticsData interface */
export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
}

/* Added missing Chat types */
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string };
  lastMessage: string;
  unreadCount: number;
  messages: ChatMessage[];
}

/* Added missing Notification interface */
export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

/* Added missing Violation interface */
export interface Violation {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

/* Added missing LiveEvent interface */
export interface LiveEvent {
  id: string;
  title: string;
  youtubeUrl: string;
  organizer: string;
  isLive: boolean;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: AuthorityRole;
  email: string;
  avatar?: string;
}

export interface CollegeStats {
  id: College;
  followers: number;
  postCount: number;
  dean: string;
  description: string;
  leadership: LeadershipMember[];
}

export interface TimelineEvent {
  id: string;
  type: 'like' | 'comment' | 'profile_update' | 'new_post' | 'ad_created' | 'poll_created' | 'event_scheduled' | 'event_reminder';
  userId: string;
  userName: string;
  userAvatar: string;
  targetId?: string;
  description: string;
  timestamp: string; 
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
  /* Added missing registrationLink */
  registrationLink?: string;
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  authorRole: string;
  authorAvatar: string;
  authorAuthority?: AuthorityRole; // Added to track which badge to show
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
  isAd?: boolean;
  isMakTV?: boolean;
  isEventBroadcast?: boolean;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventTitle?: string;
  /* Added missing eventRegistrationLink */
  eventRegistrationLink?: string;
  /* Added missing MakTV and Ad specific fields */
  makTVType?: 'News' | 'Interview';
  makTVGuest?: string;
  adPartnerName?: string;
  adCtaText?: string;
  adLink?: string;
  adAmountPaid?: number;
  aiMetadata?: {
    category: 'Academic' | 'Social' | 'Finance' | 'Career' | 'Urgent';
    isSafe?: boolean;
    safetyReason?: string;
    /* Added missing sentiment */
    sentiment?: string;
  };
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connections: number;
  email?: string;
  college: College;
  status: UserStatus;
  joinedColleges: College[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalLikesCount: number;
  /* Added missing fields used in Profile and App components */
  badges: string[];
  appliedTo: string[];
  notifications?: Notification[];
  bio?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string, text: string, votes: number }[];
  isActive: boolean;
  expiresAt: string;
}