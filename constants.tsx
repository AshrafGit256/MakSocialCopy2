
import React from 'react';
import { 
  Home, Search, MessageCircle, User, Calendar, BookOpen, Bell, Award, Users
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College, AuthorityRole } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: <Home size={22} /> },
  { id: 'groups', label: 'Groups Hub', icon: <Users size={22} /> },
  { id: 'search', label: 'Search', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'Study Vault', icon: <BookOpen size={22} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={22} /> },
  { id: 'messages', label: 'Messages', icon: <MessageCircle size={22} /> },
  { id: 'profile', label: 'My Profile', icon: <User size={22} /> },
];

export const MOCK_NEWS = [
  { id: 'n1', title: 'Makerere Research Hub secures $2M grant for AI development.', category: 'Research', time: '5m ago', source: 'Admin Node' },
  { id: 'n2', title: 'Guild President announces new campus lighting initiative.', category: 'Campus', time: '18m ago', source: 'Guild Office' },
  { id: 'n3', title: 'Mak Impalas prepare for inter-university basketball finals.', category: 'Sports', time: '1h ago', source: 'Sports Wing' },
  { id: 'n4', title: 'Library registry migration completed successfully.', category: 'Admin', time: '2h ago', source: 'The Vault' }
];

export const COLLEGE_BANNERS: Record<College, string> = {
  COCIS: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200',
  CEDAT: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=1200',
  CHUSS: 'https://images.unsplash.com/photo-1491843384429-181717b8e24f?auto=format&fit=crop&w=1200',
  CHS: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200',
  CONAS: 'https://images.unsplash.com/photo-1532187875605-183881249611?auto=format&fit=crop&w=1200',
  CAES: 'https://images.unsplash.com/photo-1495107336214-bca9f1d95c18?auto=format&fit=crop&w=1200',
  COBAMS: 'https://images.unsplash.com/photo-1454165833767-02a6e30996d4?auto=format&fit=crop&w=1200',
  CEES: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200',
  LAW: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200'
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p-event-homecoming-2026',
    author: 'Makerere Alumni Association',
    authorId: 'alumni_office',
    authorRole: 'Official Node',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Alumni',
    authorAuthority: 'Official',
    timestamp: 'Just now',
    isEventBroadcast: true,
    eventTitle: 'Grand Alumni Homecoming 2026',
    eventDate: '2026-10-20T10:00:00',
    eventTime: '10:00 AM',
    eventLocation: 'Freedom Square',
    content: `<h1>Grand Homecoming 2026</h1><p>Calling all former students! Join us for a day of networking, mentorship, and celebration as we honor a century of excellence at The Hill.</p>`,
    hashtags: ['#Homecoming', '#MakerereAlumni', '#Heritage'],
    likes: 420,
    commentsCount: 35,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://campusbee.ug/wp-content/uploads/2019/11/Makerere-Alumni.jpg']
  },
  {
    id: 'p-cedat-spec-1',
    author: 'Architecture Dept',
    authorId: 'cedat_dept',
    authorRole: 'Official Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CEDAT',
    authorAuthority: 'Official',
    timestamp: '12m ago',
    content: `<h1>Final Year Exhibition</h1><p>Our architectural blueprints for the new library wing are ready for the public jury. Come witness innovation at the CEDAT Design Center this Friday.</p>`,
    hashtags: ['#CEDAT', '#Architecture', '#MakerereDesign'],
    likes: 124,
    commentsCount: 15,
    comments: [],
    views: 2400,
    flags: [],
    isOpportunity: false,
    college: 'CEDAT',
    images: ['https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=1200']
  },
  {
    id: 'p-cocis-spec-1',
    author: 'Tech Research Lab',
    authorId: 'cocis_lab',
    authorRole: 'Research Unit',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=COCIS',
    authorAuthority: 'Academic Council',
    timestamp: '25m ago',
    content: `<h1>Cloud Server Upgrade</h1><p>The COCIS internal cluster will undergo synchronization at 23:00. Local node access may be intermittent during the registry sync.</p>`,
    hashtags: ['#COCIS', '#CloudSync', '#MakTech'],
    likes: 89,
    commentsCount: 4,
    comments: [],
    views: 1800,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    images: []
  },
  {
    id: 'p-law-spec-1',
    author: 'Makerere Law Society',
    authorId: 'law_society',
    authorRole: 'Student Society',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=LAW',
    authorAuthority: 'Student Leader',
    timestamp: '45m ago',
    content: `<h1>Moot Court Finals</h1><p>The highly anticipated Moot Court finals are happening today at the School of Law. Defending champions from Year 3 are ready for the challenge.</p>`,
    hashtags: ['#MakLaw', '#MootCourt', '#Justice'],
    likes: 310,
    commentsCount: 22,
    comments: [],
    views: 4500,
    flags: [],
    isOpportunity: false,
    college: 'LAW',
    images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200']
  },
  {
    id: 'p-chs-spec-1',
    author: 'Medical Students Assoc',
    authorId: 'chs_assoc',
    authorRole: 'Student Assoc',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CHS',
    authorAuthority: 'Student Leader',
    timestamp: '1h ago',
    content: `<h1>Blood Donation Drive</h1><p>Join us at the CHS wing today for our annual blood donation drive. Every drop counts toward saving lives at Mulago.</p>`,
    hashtags: ['#MakMedicine', '#DonateLife', '#CHS'],
    likes: 540,
    commentsCount: 48,
    comments: [],
    views: 6700,
    flags: [],
    isOpportunity: false,
    college: 'CHS',
    images: ['https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200']
  },
  {
    id: 'p-vc-1',
    author: 'Prof. Barnabas Nawangwe',
    authorId: 'vc_office',
    authorRole: 'Vice Chancellor',
    authorAvatar: 'https://marcopolis.net/wp-content/uploads/uganda_report/2020/interviews/makerere_university/Professor_Barnabas_Nawangwe_Vice_Chancellor_of_Makerere_University.jpg',
    authorAuthority: 'Administrator',
    timestamp: '15m ago',
    content: `<h1>Central Administration Directive</h1><p>The University Council has officially synchronized the new research innovation strata. We are prioritizing the development of local logic hubs in all colleges.</p>`,
    hashtags: ['#RegistrySync', '#MakerereResearch'],
    likes: 1240,
    commentsCount: 45,
    comments: [],
    views: 12000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://www.monitor.co.ug/resource/image/4501730/landscape_ratio3x2/1200/800/30bf0642ec5596d69a097b2e29a19774/Za/latest15pix.jpg']
  },
  {
    id: 'p-ad-mtn',
    author: 'MTN Uganda',
    authorId: 'mtn_partner',
    authorRole: 'Pulse Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=MTN',
    authorAuthority: 'Corporate',
    isAd: true,
    timestamp: 'Just now',
    content: `<h1>MTN Pulse: Data Synchronization</h1><p>Fuel your research node with the most aggressive data bundles on the Hill. Dial *157# to sync your device with the Pulse strata.</p>`,
    hashtags: ['#MTNPulse', '#UnlimitedSync'],
    likes: 840,
    commentsCount: 12,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://www.mtn.co.ug/wp-content/uploads/2021/11/MTN-HVP-Social-post-1.jpg']
  },
  {
    id: 'p-lib-1',
    author: 'Main Library Node',
    authorId: 'mak_library',
    authorRole: 'Official Hub',
    authorAvatar: 'https://static.vecteezy.com/system/resources/thumbnails/004/297/596/small/education-logo-open-book-dictionary-textbook-or-notebook-with-sunrice-icon-modern-emblem-idea-concept-design-for-business-libraries-schools-universities-educational-courses-vector.jpg',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    content: `<h1>LIBRARY OPENING HOURS UPDATED</h1>
              <p>Hello Makerere community,</p>
              <p>
              The Main Library will be open from <strong>8:00 AM to 10:00 PM</strong> starting next week, Monday. 
              This is to support students preparing for coursework, research, and examinations.
              </p>
              <p>
              All students are reminded to carry their <strong>valid student ID</strong> when accessing library services. 
              Silent study zones must be respected, and group discussions should only take place in designated areas.
              </p>
              <p>
              For assistance, visit the Reference Desk or send us a message right here on MakSocial.
              </p>
              <p>Happy studying 📖</p>
              `,
    hashtags: ['#TheVault', '#ResearchIntegrity'],
    likes: 312,
    commentsCount: 8,
    comments: [],
    views: 5600,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://campusbee.ug/wp-content/uploads/2022/06/FB_IMG_16565179974172233.jpg']
  }
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'chat-1',
    user: { name: 'Dr. Julianne O.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julianne', status: 'online', role: 'Faculty Node' },
    unreadCount: 2,
    lastMessage: 'Handshake successful. Ready for uplink.',
    lastTimestamp: '10:01 AM',
    isGroup: false,
    messages: [
      { id: 'm1', text: 'Initializing protocol...', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Handshake successful. Ready for uplink.', timestamp: '10:01 AM', isMe: false }
    ]
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 145, activeUsers: 480, messages: 1350, revenue: 420, engagement: 1350 },
  { day: 'Wed', posts: 180, activeUsers: 520, messages: 1600, revenue: 500, engagement: 1550 },
  { day: 'Thu', posts: 210, activeUsers: 600, messages: 1900, revenue: 620, engagement: 1800 },
  { day: 'Fri', posts: 240, activeUsers: 710, messages: 2400, revenue: 780, engagement: 2100 },
  { day: 'Sat', posts: 110, activeUsers: 320, messages: 900, revenue: 350, engagement: 950 },
  { day: 'Sun', posts: 90, activeUsers: 280, messages: 750, revenue: 280, engagement: 820 }
];
