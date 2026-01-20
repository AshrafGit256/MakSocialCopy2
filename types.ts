
export type AppView = 'landing' | 'login' | 'register' | 'home' | 'messages' | 'profile' | 'admin' | 'network' | 'market' | 'events' | 'analytics' | 'explore' | 'groups' | 'search' | 'calendar' | 'resources' | 'notifications';

export type UserStatus = 'Year 1' | 'Year 2' | 'Finalist' | 'Masters' | 'Graduate';
export type College = 'COCIS' | 'CEDAT' | 'CHUSS' | 'CONAS' | 'CHS' | 'CAES' | 'COBAMS' | 'CEES' | 'LAW';

export type AuthorityRole = 'Lecturer' | 'Administrator' | 'Chairperson' | 'GRC' | 'Student Leader' | 'Super Admin';

export type ResourceType = 'Test' | 'Past Paper' | 'Notes/Books' | 'Research' | 'Career';

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

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type: 'text' | 'image' | 'file' | 'emoji';
  attachmentUrl?: string;
  fileName?: string;
}

export interface ChatConversation {
  id: string;
  participants: string[]; 
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
  connectionStatus: 'pending' | 'accepted';
  requestedBy: string; 
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'like' | 'request' | 'event' | 'official' | 'mention' | 'synapse' | 'bookmark';
  senderAvatar?: string;
  senderName?: string;
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
  badges: string[];
  appliedTo: string[];
  notifications?: Notification[];
  bio?: string;
  iqCredits: number;
  skills: string[];
  intellectualSignature: string;
  isOnline?: boolean;
  lastSeen?: string;
  connectionsList: string[]; 
  pendingRequests: string[]; 
  bookmarkedPosts: string[]; 
  isVerified: boolean;
  courseAbbr: string;
  academicLevel: 'Undergrad' | 'Postgrad' | 'PhD' | 'Faculty';
  gender: 'M' | 'F' | 'Other';
  isSuspended: boolean;
  suspensionEnd?: string;
  medals: { id: string; name: string; icon: string }[];
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
  hashtags: string[];
  likes: number;
  commentsCount: number;
  comments: any[];
  views: number;
  flags: string[];
  isOpportunity: boolean;
  college: College | 'Global';
  isEventBroadcast?: boolean;
  eventId?: string;
  eventTitle?: string;
  eventFlyer?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventRegistrationLink?: string;
  aiMetadata?: { category: string; isSafe: boolean };
  images?: string[];
  video?: string;
  isMakTV?: boolean;
  makTVType?: 'News' | 'Interview';
  makTVGuest?: string;
  isAd?: boolean;
  adAmountPaid?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  createdBy: string;
  attendeeIds: string[];
  registrationLink?: string;
}

export interface CollegeStats {
  college: College;
  members: number;
  posts: number;
  engagement: number;
}

export interface TimelineEvent {
  id: string;
  type: string;
  userName: string;
  userAvatar: string;
  description: string;
  timestamp: string;
}

export interface Violation {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  timestamp: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
}

export interface LiveEvent {
  id: string;
  title: string;
  organizer: string;
  youtubeUrl: string;
}

export interface AnalyticsData {
  day: string;
  posts: number;
  activeUsers: number;
  messages: number;
  revenue: number;
  engagement: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  college: College;
  ownerId: string;
  ownerName: string;
  status: string;
  tags: string[];
  rolesNeeded: string[];
  team: { id: string; name: string; avatar: string }[];
  timestamp: string;
  progress: number;
}
