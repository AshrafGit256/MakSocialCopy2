
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'forge' | 'groups' | 'search' | 'calendar' | 'resources' | 'settings' | 'thread' | 'opportunities' | 'notifications';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';
export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin' | 'Graduate' | 'Alumni' | 'Staff' | 'Official' | 'Corporate' | 'Academic Council';

export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: 'file' | 'folder';
}

export type EmailFolder = 'inbox' | 'sent' | 'draft' | 'starred' | 'spam' | 'trash';
export type EmailLabel = 'Social' | 'Company' | 'Important' | 'Private';

export interface PlatformEmail {
  id: string;
  from: string;
  fromName: string;
  fromAvatar: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  timestamp: string;
  fullDate: string;
  isRead: boolean;
  isStarred: boolean;
  folder: EmailFolder;
  label?: EmailLabel;
  attachments?: EmailAttachment[];
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  author?: string;
  authorAvatar?: string;
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string; role?: string; status?: 'online' | 'offline' };
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  isGroup: boolean;
  messages: ChatMessage[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connections: number;
  email?: string;
  altEmail?: string;
  college: College | 'Global';
  status: UserStatus;
  subscriptionTier: SubscriptionTier; 
  accountStatus?: 'Active' | 'Inactive' | 'Suspended';
  verified?: boolean;
  joinedColleges: (College | 'Global')[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalLikesCount: number;
  badges: string[];
  appliedTo: string[];
  bio?: string;
  education?: string;
  location?: string;
  skills?: string[];
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    gmail?: string;
  };
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
  imageUrl?: string;
  votes: number;
  voterIds: string[];
}

export interface PollData {
  options: PollOption[];
  totalVotes: number;
  expiresAt: string;
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
  hashtags: string[];
  likes: number;
  commentsCount: number;
  comments: Comment[];
  views: number;
  flags: string[]; 
  isOpportunity: boolean;
  college: College | 'Global';
  opportunityData?: {
    type: 'Internship' | 'Grant' | 'Gig' | 'Scholarship' | 'Workshop';
    deadline?: string;
    isAIVerified: boolean;
    detectedBenefit: string;
  };
  pollData?: PollData;
  isEventBroadcast?: boolean;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventFlyer?: string;
  eventRegistrationLink?: string;
  isAd?: boolean;
  video?: string;
  eventId?: string;
  parentId?: string;
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
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  borderRadius: string; 
  themePreset: 'standard' | 'oled' | 'tactical' | 'paper';
  backgroundPattern: 'none' | 'grid' | 'dots';
}

export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
}

export interface Ad {
  id: string;
  title: string;
  image?: string;
  video?: string;
  url: string;
  college: College | 'Global';
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
  fileType: string;
  fileData?: string;
  timestamp: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  youtubeUrl: string;
  organizer: string;
  status: 'live' | 'upcoming' | 'ended';
}

export interface MakNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'skill_match' | 'engagement' | 'follow' | 'event' | 'system';
  meta?: {
    hash?: string;
    reason?: string;
  };
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
