
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
    authorAvatar: 'https://businessfocus.co.ug/wp-content/uploads/2019/11/Nawangwe.jpg',
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
    authorAvatar: 'https://yt3.googleusercontent.com/KUU4mqp8QmSUU_LJi0GBUQKtIKCa1sX8lxJ2RZxSQnD-ZxLfESJTovLXRWTGsScZP0NxiZlckQ=s900-c-k-c0x00ffffff-no-rj',
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
    authorAvatar: 'data:image/jpeg;base64,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',
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
