
import React from 'react';
import { 
  Home, Search, MessageCircle, User, Calendar, BookOpen, Bell, Award, Users
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College, AuthorityRole } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Pulse Feed', icon: <Home size={22} /> },
  { id: 'groups', label: 'Groups Hub', icon: <Users size={22} /> },
  { id: 'search', label: 'Registry', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'notifications', label: 'Signals', icon: <Bell size={22} /> },
  // Fixed: MessageCircle was used here but MessageSquare was imported. Swapped in imports above.
  { id: 'messages', label: 'Uplink', icon: <MessageCircle size={22} /> },
  { id: 'profile', label: 'Terminal', icon: <User size={22} /> },
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
    id: 'p-event-gala-2026',
    author: 'Mak Cultural Hub',
    authorId: 'cultural_hub',
    authorRole: 'Official Organizer',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Culture',
    authorAuthority: 'Official',
    timestamp: 'Just now',
    content: `<h1>MAK CULTURAL GALA 2026</h1><p>The biggest cultural celebration on The Hill is back. Expect high-intensity performances, traditional logic showcases, and a universal synchronization of Makerere's heritage wings.</p>`,
    hashtags: ['#CulturalGala', '#HeritageSync', '#Makerere2026'],
    likes: 850,
    commentsCount: 120,
    comments: [],
    views: 15000,
    flags: [],
    isOpportunity: false,
    isEventBroadcast: true,
    eventTitle: 'Cultural Gala 2026',
    eventDate: '2026-08-15',
    eventTime: '14:00',
    eventLocation: 'Freedom Square',
    college: 'Global',
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200']
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
    id: 'p-event-tech-summit',
    author: 'COCIS Innovation Node',
    authorId: 'cocis_tech',
    authorRole: 'Tech Lead',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Tech',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    content: `<h1>AI STRATA SUMMIT: THE NEXT FRONTIER</h1><p>Join us for an intense session on the future of Neural Networks within the university strata. Global logic architects from Google and Microsoft will be present for synchronization.</p>`,
    hashtags: ['#AISummit', '#TechNodes', '#InnovationForge'],
    likes: 420,
    commentsCount: 56,
    comments: [],
    views: 8900,
    flags: [],
    isOpportunity: false,
    isEventBroadcast: true,
    eventTitle: 'AI Strata Summit',
    eventDate: '2026-10-10',
    eventTime: '09:00',
    eventLocation: 'COCIS Conference Hall',
    college: 'COCIS',
    images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200']
  },
  {
    id: 'p-ad-mtn',
    author: 'MTN Uganda',
    authorId: 'mtn_partner',
    authorRole: 'Pulse Partner',
    authorAvatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA8FBMVEX/ywUAAAAAAAMAAAX/zQQAAAj/0Ab/0gdBNQPdtAPjtwX8zQT/ygj/zgYAAAv9ywaqiQaDawEWDwIeGQMvJQH0wwXYrgMoHgIAAwDsvwb/1QmMdAj1ywg6MAnJoAP5yAlURwVcSgfAmQiSeQN5YQNjTANJPgQjHgIVEAsKCwNCNgObfwizkQuEaQpQPAQgGwYlEgWUcAUxKwqlgQqjjA1vYQolGQJqVwQ0JQjAnwXOrAF3YgbjvACLdghJNw06MASyigwxMAXerglcTgZYRg3qxApyWw8XBAkfGAiKaQpkWAcTEwBNSAkEFQeulBQqKQyNsFPLAAANWklEQVR4nO2cC1vbxhKGpb1ia1drAjaWMJaxgQA2oYQkxDYpbSCU0/Q0///fnJmVLzTYYBLZSc8z79NiEELSp52dmZ3dTRAQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEUg3Ni5nEx4uvDy3+i4jEoEz4ja5XSgHLVapKUkSSpZoFO/VFrQZ8xwp9ufvRTP4NIBygsteVmu9fZ2z9Y29l8eXd4VOecHx292Hi5uXN8sH/S7bVrCb4AK+y/SZ/QOsiSZvfk1SHjIedhyJj/GMNCNvqRhfCL0/3tSrPaUFr91ObqIoP9Cx6zWqqst/DZUQFjIyGjD3+As3BylPH8C/9lf7tdzlClCyIXCfejFX1FFBkXaJ30z1p30ED3W2xBODbn6/3zgVdp3E+mUARC6UFnjUtsJDZqpOchJWc8Dvlh600ZXNBPI9E/h1LV9tu8z3HscvVw3M3YVCs4mHdbyLvPL+pE7LnSDBkO0jqpJud9dv37H/Crg8Q4VvwmTv7htWv3Dt0GDZ3FWlyut6a4zHynDOvOTwSHbfLV/sX5W6fWbtSnNfu/8bHix++tpONpXhAplGE73RL20E42z4Y9VoVcjEV+yUOJTZZ+zmI96z3SG+5+wcPZxr4nhShUsBjE+bFeVelg0+IHAs1itm2drPoOcI+8p6n776YvWeQ3MWqx8M9fjQKiPMJLppLl9/ZJ9yzZZTOV3LirNLIXkzH172rAkwPs7gXuwwYvoarm9ffEy3wUyas36QznQZKPv/ZervU6znGm/PwUut+Q9B9+N0tY1ar91h78y37/YZBMfz9cw+AP4CwgIrfXzdrlh7E++Hf9rcP+sX+elkhr+swrrt/s3r47XsP67tnZwsLt/u97ttZu1agp9ToNT+Rm2NT8LiPOYn+KKd0xX/D+NkaZ+dRt+wU8MkSgrEpCPOpwL/LeJnPDwwX+iKEAQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQxP8l/wMM8uAWSgd8iAAAAABJRU5ErkJggg==',
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
    id: 'p-opp-internship-2026',
    author: 'Innovation Forge',
    authorId: 'forge_hq',
    authorRole: 'Opportunity Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Forge',
    authorAuthority: 'Official',
    timestamp: '2h ago',
    content: `<h1>BLOCKCHAIN ARCHITECT INTERNSHIP</h1><p>The Innovation Forge is seeking three node architects to assist in the development of the MakSocial strata ledger. Paid position with full credentialing.</p>`,
    hashtags: ['#Internship2026', '#ForgeOpportunities', '#Web3Makerere'],
    likes: 312,
    commentsCount: 45,
    comments: [],
    views: 5600,
    flags: [],
    isOpportunity: true,
    opportunityData: {
      type: 'Internship',
      deadline: '2026-06-30',
      isAIVerified: true,
      detectedBenefit: 'Stipend + Cert'
    },
    college: 'Global',
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200']
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
