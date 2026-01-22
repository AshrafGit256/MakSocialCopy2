
import React from 'react';
import { 
  Home, Search, Compass, MessageCircle, LayoutGrid, User, Calendar, BookOpen, Newspaper
} from 'lucide-react';
import { Post, AnalyticsData, ChatConversation, College } from './types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home Feed', icon: <Home size={22} /> },
  { id: 'search', label: 'Explore', icon: <Search size={22} /> },
  { id: 'calendar', label: 'Schedule', icon: <Calendar size={22} /> },
  { id: 'resources', label: 'The Vault', icon: <BookOpen size={22} /> },
  { id: 'explore', label: 'Discovery', icon: <Compass size={22} /> },
  { id: 'messages', label: 'Direct', icon: <MessageCircle size={22} /> },
  { id: 'groups', label: 'Wing Hubs', icon: <LayoutGrid size={22} /> },
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
    id: 'inst-1',
    author: 'MakUnipod',
    authorId: 'mak_unipod',
    authorRole: 'Innovation Wing',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Unipod',
    authorAuthority: 'Official',
    timestamp: 'Just now',
    content: `<h1>Prototyping Grant Signal Activated 🚀</h1>
<p style="text-align: justify;">We are offering <b>5 PROTOTYPING GRANTS</b> for the semester. If you have an engineering or design node ready for deployment, scan our table below:</p>
<table style="width:100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid var(--border-color);">
  <tr style="background-color: rgba(99, 102, 241, 0.1);">
    <th style="padding: 10px; border: 1px solid var(--border-color);">Batch</th>
    <th style="padding: 10px; border: 1px solid var(--border-color);">Focus Area</th>
    <th style="padding: 10px; border: 1px solid var(--border-color);">Grant Amount</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Alpha</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Renewable Energy</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">UGX 2,500,000</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid var(--border-color);">Beta</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">IoT Solutions</td>
    <td style="padding: 10px; border: 1px solid var(--border-color);">UGX 1,800,000</td>
  </tr>
</table>
<blockquote style="border-left: 4px solid #6366f1; padding-left: 10px; font-style: italic;">"Ideas are nodes; prototypes are the uplink."</blockquote>
<p style="text-align: center;"><span style="color: #6366f1; font-weight: 800; font-size: 1.2rem;">Apply via the Research Vault today!</span></p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#Innovation', '#MakUnipod', '#CEDAT'],
    likes: 1540,
    commentsCount: 89,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: true,
    college: 'CEDAT'
  },
  {
    id: 'inst-2',
    author: 'Mak AI Lab',
    authorId: 'mak_ailab',
    authorRole: 'Research Center',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=AILab',
    authorAuthority: 'Official',
    timestamp: '2h ago',
    content: `<h2>Neural Logic Internship Program 🧠</h2>
<p>Seeking <b>Graduate Research Assistants</b> for the <u>NLP and Computer Vision</u> clusters. Candidates must possess the following alphanumeric credentials:</p>
<ul style="list-style-type: disc; padding-left: 20px;">
  <li>Proficiency in <span style="background-color: #fef08a; padding: 2px 5px; border-radius: 4px; color: black;">Python & PyTorch</span></li>
  <li>Experience with Edge Computing</li>
  <li>Active participation in COCIS Labs</li>
</ul>
<p style="background-color: #ef4444; color: white; padding: 10px; border-radius: 6px; text-align: center; font-weight: 800;">DEADLINE: FRIDAY, 5:00 PM EAT</p>
<p>Visit our node at <a href="#">ai.mak.ac.ug/internships</a> for synchronization.</p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#AI', '#COCIS', '#Research'],
    likes: 892,
    commentsCount: 34,
    comments: [],
    views: 28000,
    flags: [],
    isOpportunity: true,
    college: 'COCIS'
  },
  {
    id: 'inst-3',
    author: 'Main Library',
    authorId: 'mak_library',
    authorRole: 'Knowledge Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Library',
    authorAuthority: 'Official',
    timestamp: '4h ago',
    content: `<h3>Universal Digital Access Synchronization 📚</h3>
<p>We are excited to announce full <b>IEEE and JSTOR integration</b> for all verified student nodes. Access scholarly intelligence from anywhere on the hill.</p>
<p style="font-family: serif; font-size: 1.1rem; line-height: 1.6;">"The library is not just a building; it is a globally distributed knowledge network."</p>
<p>Reading zones 1 through 4 are now operating on a <b>24/7 UPTIME PROTOCOL</b> for the examination period. Maintain silence logic at all times.</p>`,
    customFont: '"Playfair Display"',
    hashtags: ['#Library', '#Research', '#Makerere'],
    likes: 3200,
    commentsCount: 120,
    comments: [],
    views: 120000,
    flags: [],
    isOpportunity: false,
    college: 'Global'
  },
  {
    id: 'inst-4',
    author: 'Office of the VC',
    authorId: 'vc_office',
    authorRole: 'University Leadership',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC',
    authorAuthority: 'Super Admin',
    timestamp: '6h ago',
    content: `<h1>Scholarship Stratum Updated 🎓</h1>
<p style="color: #6366f1; font-weight: 800;">IMPORTANT BROADCAST FOR TOP PERFORMERS</p>
<p>The University Council has approved a <b>tuition waiver protocol</b> for the top 5% of nodes in each college wing. Eligibility logs are being compiled.</p>
<blockquote style="border-left: 4px solid #ef4444; padding-left: 10px; italic: true;">"Excellence is the currency of the hill."</blockquote>
<p>Please ensure your registry details are updated in the <a href="#">Academic Portal</a> by EOD tomorrow.</p>`,
    customFont: '"Inter"',
    hashtags: ['#Makerere', '#VCBroadcast', '#Scholarships'],
    likes: 12400,
    commentsCount: 450,
    comments: [],
    views: 250000,
    flags: [],
    isOpportunity: true,
    college: 'Global'
  },
  {
    id: 'inst-5',
    author: 'Centenary Bank',
    authorId: 'centenary_bank',
    authorRole: 'Financial Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cente',
    authorAuthority: 'Corporate',
    timestamp: '8h ago',
    content: `<p style="text-align: center;"><span style="font-size: 1.5rem; font-weight: 900; color: #1e3a8a;">CENTE-CONNECT 💳</span></p>
<p>Open a <b>Student Cente-Account</b> and enjoy <u>Zero Transaction Logic</u> on all campus withdrawals. We are deploying mobile nodes at Freedom Square all week.</p>
<p style="background-color: #10b981; color: white; padding: 5px; border-radius: 4px; font-weight: 800;">BONUS: First 50 nodes get UGX 10,000 instant sync!</p>`,
    customFont: '"Plus Jakarta Sans"',
    hashtags: ['#CenteBank', '#StudentFinance', '#Makerere'],
    likes: 2100,
    commentsCount: 67,
    comments: [],
    views: 45000,
    flags: [],
    isOpportunity: true,
    college: 'Global'
  },
  {
    id: 'inst-6',
    author: 'Stanbic Bank',
    authorId: 'stanbic_bank',
    authorRole: 'Commercial Partner',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Stanbic',
    authorAuthority: 'Corporate',
    timestamp: '10h ago',
    content: `<h2>Stanbic National Championship 2025 🏆</h2>
<p>Register your innovation team for the ultimate university battle. Top prize includes a <b>Sync Mission to Silicon Valley</b> and UGX 20M seed capital.</p>
<table style="width:100%; border: 1px solid #30363d; margin: 10px 0;">
  <tr>
    <th style="padding: 8px; text-align: left;">Category</th>
    <th style="padding: 8px; text-align: left;">Deadline</th>
  </tr>
  <tr>
    <td style="padding: 8px;">Business Idea</td>
    <td style="padding: 8px;">July 15</td>
  </tr>
  <tr>
    <td style="padding: 8px;">MVP / Prototype</td>
    <td style="padding: 8px;">August 20</td>
  </tr>
</table>
<p style="text-align: right;"><a href="#" style="color: #3b82f6; font-weight: 800;">Register Team Node &rarr;</a></p>`,
    customFont: '"JetBrains Mono"',
    hashtags: ['#StanbicChamps', '#Entrepreneurship', '#MakSocial'],
    likes: 1800,
    commentsCount: 45,
    comments: [],
    views: 32000,
    flags: [],
    isOpportunity: true,
    college: 'Global'
  },
  {
    id: 'inst-7',
    author: 'Agro-Chemical Hub',
    authorId: 'covab_agro',
    authorRole: 'Research & Science',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Agro',
    authorAuthority: 'Corporate',
    timestamp: '12h ago',
    content: `<h3>Precision Agriculture Workshop @ CoVAB Hub 🚜</h3>
<p>Learn how to deploy <b>drone telemetry and soil sensor logic</b> for modern crop management. This is a practical synchronization event at the CoVAB Farm Wing.</p>
<ul style="list-style-type: square; padding-left: 20px;">
  <li>Satellite imagery decoding</li>
  <li>Automated irrigation logic</li>
  <li>Organic pest management protocols</li>
</ul>
<p style="color: #059669; font-weight: 800;">Internship opportunities available for CAES finalists!</p>`,
    customFont: '"Inter"',
    hashtags: ['#AgroTech', '#CoVAB', '#Makerere'],
    likes: 940,
    commentsCount: 28,
    comments: [],
    views: 15000,
    flags: [],
    isOpportunity: true,
    college: 'CAES'
  }
];

export const ANALYTICS: AnalyticsData[] = [
  { day: 'Mon', posts: 120, activeUsers: 450, messages: 1200, revenue: 400, engagement: 1275 },
  { day: 'Tue', posts: 150, activeUsers: 520, messages: 1400, revenue: 600, engagement: 1530 },
  { day: 'Wed', posts: 200, activeUsers: 600, messages: 1800, revenue: 550, engagement: 1900 },
  { day: 'Thu', posts: 180, activeUsers: 580, messages: 1600, revenue: 800, engagement: 1770 },
  { day: 'Fri', posts: 250, activeUsers: 720, messages: 2100, revenue: 1200, engagement: 2330 },
  { day: 'Sat', posts: 100, activeUsers: 300, messages: 800, revenue: 400, engagement: 950 },
  { day: 'Sun', posts: 80, activeUsers: 250, messages: 600, revenue: 300, engagement: 775 },
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'c1',
    user: { name: 'Guru A.', avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg'},
    lastMessage: 'The research notes are in the Vault.',
    unreadCount: 2,
    messages: [
      { id: 'm1', text: 'Hey, did you see the new AI thesis?', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Yes, just synced with that node.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', text: 'The research notes are in the Vault.', timestamp: '10:10 AM', isMe: false },
    ]
  }
];
