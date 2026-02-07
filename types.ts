
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'chats' | 'profile' | 'admin' | 'search' | 'calendar' | 'resources' | 'thread' | 'opportunities' | 'notifications' | 'gallery' | 'settings' | 'admin-calendar' | 'lost-found' | 'tickets';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';
export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

/* Fix: Added missing AuthorityRole type definition */
export type AuthorityRole = 'Official' | 'Administrator' | 'Corporate' | 'Student Leader' | 'Lecturer' | 'Media Wing' | 'Faculty Node' | 'Legal Node' | 'CS Peer' | 'Innovation Node';

/* Fix: Added missing User interface */
export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connections: number;
  email: string;
  college: College;
  status: UserStatus;
  subscriptionTier: SubscriptionTier;
  joinedColleges: College[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalLikesCount: number;
  badges: string[];
  appliedTo: string[];
  verified: boolean;
  bio?: string;
}

/* Fix: Added missing AppSettings interface */
export interface AppSettings {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: string;
  themePreset: 'paper' | 'oled' | 'tactical' | 'standard';
  backgroundPattern: string;
}

/* Fix: Added missing AnalyticsData interface */
export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
}

/* Fix: Added missing ChatMessage interface */
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

/* Fix: Added missing ChatConversation interface */
export interface ChatConversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    role: string;
  };
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  isGroup: boolean;
  messages: ChatMessage[];
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  price: string;
  ownerName: string;
  purchaseDate: string;
  status: 'Valid' | 'Used' | 'Expired';
  securityHash: string; // For the "Visual Handshake"
}

/* Fix: Added missing Resource interface and type */
export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

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

/* Fix: Added missing CalendarEvent interface */
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Social' | 'Academic' | 'Sports' | 'Exams' | 'Other';
  registrationLink?: string;
  image?: string;
  createdBy: string;
  attendeeIds: string[];
}

/* Fix: Added missing MakNotification interface */
export interface MakNotification {
  id: string;
  type: 'skill_match' | 'engagement' | 'follow' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  meta?: {
    nodeAvatar?: string;
  };
}

/* Fix: Added missing EmailAttachment interface */
export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'file';
  img?: string;
}

/* Fix: Added missing PlatformEmail interface */
export interface PlatformEmail {
  id: string;
  from: string;
  fromName: string;
  fromAvatar: string;
  to: string[];
  subject: string;
  body: string;
  timestamp: string;
  fullDate: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'draft' | 'trash' | 'junk' | 'spam';
  label?: 'Social' | 'Company' | 'Important' | 'Private';
  attachments?: EmailAttachment[];
}

/* Fix: Added missing LiveEvent interface */
export interface LiveEvent {
  id: string;
  title: string;
  organizer: string;
  youtubeUrl: string;
}

/* Fix: Added missing GroupMessage interface */
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

/* Fix: Added missing Group interface */
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

/* Fix: Added missing LostFoundItem interface */
export interface LostFoundItem {
  id: string;
  type: 'Lost' | 'Found';
  title: string;
  description: string;
  location: string;
  images: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  status: 'Open' | 'Resolved';
  college: College | 'Global';
}

/* Fix: Added missing MarketService interface */
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

/* Fix: Added missing GalleryItem interface */
export interface GalleryItem {
  id: string;
  url: string;
  postId: string;
  likes: number;
  commentsCount: number;
  author: string;
}

/* Fix: Added missing AdminCalendarEvent interface */
export interface AdminCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
}

/* Fix: Added missing Comment interface */
export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  likes: number;
}

/* Fix: Added missing PollOption interface */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voterIds: string[];
}

/* Fix: Added missing PollData interface */
export interface PollData {
  totalVotes: number;
  expiresAt: string;
  options: PollOption[];
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
  isCampaign?: boolean; // New: To identify high-impact ads
  campaignData?: {
    price: string;
    cta: string;
    eventDate: string;
    location: string;
    themeColor: string;
  };
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
