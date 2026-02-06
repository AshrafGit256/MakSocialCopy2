
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'chats' | 'profile' | 'admin' | 'search' | 'calendar' | 'resources' | 'thread' | 'opportunities' | 'notifications' | 'gallery' | 'settings' | 'admin-calendar';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';
export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin' | 'Graduate' | 'Alumni' | 'Staff' | 'Official' | 'Corporate' | 'Academic Council';

export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: 'file' | 'folder' | 'image' | 'pdf' | 'docx';
  img?: string;
}

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
  folder: 'inbox' | 'sent' | 'draft' | 'trash' | 'spam' | 'junk';
  label?: 'Social' | 'Company' | 'Important' | 'Private';
  attachments?: EmailAttachment[];
}

export interface MakNotification {
  id: string;
  type: 'skill_match' | 'engagement' | 'follow' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  meta?: {
    nodeId?: string;
    nodeAvatar?: string;
    targetId?: string;
    reason?: string;
    hash?: string;
  };
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

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  authorAvatar?: string;
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string; status: 'online' | 'offline'; role?: string; phone?: string };
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  isGroup: boolean;
  messages: ChatMessage[];
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
  isAd?: boolean;
  video?: string;
  college: College | 'Global';
  parentId?: string;
  opportunityData?: {
    deadline?: string;
    type: 'Internship' | 'Grant' | 'Gig' | 'Scholarship' | 'Workshop';
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
  eventId?: string;
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

export interface AdminCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  youtubeUrl: string;
  organizer: string;
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

export interface GalleryItem {
  id: string;
  url: string;
  postId: string;
  likes: number;
  commentsCount: number;
  author: string;
}
