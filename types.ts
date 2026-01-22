
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'explore' | 'groups' | 'search' | 'calendar' | 'resources' | 'settings' | 'thread';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';
export type SubscriptionTier = 'Free' | 'Pro' | 'Enterprise';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin' | 'Graduate' | 'Alumni' | 'Staff' | 'Official' | 'Corporate';

export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

export interface AppSettings {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  contrast: 'normal' | 'high';
  density: 'comfortable' | 'compact' | 'tight';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animationsEnabled: boolean;
  glassmorphism: boolean;
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
  deadline: string; 
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  expenses: number;
  subscribers: number;
  growth: number;
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
  lastMessage: string;
  unreadCount: number;
  messages: { id: string; text: string; timestamp: string; isMe: boolean }[];
}

export interface LiveEvent {
  id: string;
  title: string;
  organizer: string;
  youtubeUrl: string;
}

export interface Resource {
  id: string;
  title: string;
  category: ResourceType;
  college: College;
  course: string;
  year: string;
  author: string;
  downloads: number;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP';
  fileData?: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'post' | 'update' | 'achievement' | 'comment';
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  connections: number;
  email?: string;
  // FIX: Allow 'Global' as a college value for administrative and corporate accounts
  college: College | 'Global';
  status: UserStatus;
  subscriptionTier: SubscriptionTier; 
  accountStatus?: 'Active' | 'Inactive' | 'Suspended';
  verified?: boolean;
  // FIX: Allow 'Global' in the list of joined colleges
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
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
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
  customFont?: string; 
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
  parentId?: string; // NEW: Supports threading/replies
  aiMetadata?: {
    category: 'Academic' | 'Social' | 'Finance' | 'Career' | 'Urgent';
    isSafe?: boolean;
  };
  // FIX: Missing properties used for broadcasting events and advertisements to resolve type errors in Admin, Events and Calendar components
  isEventBroadcast?: boolean;
  isAd?: boolean;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventId?: string;
  eventFlyer?: string;
  eventRegistrationLink?: string;
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
  isPromoted?: boolean;
}
