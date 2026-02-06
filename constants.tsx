
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
  { id: 'n1', title: 'New research grants are now available for students.', category: 'Academic', time: '2m ago' },
  { id: 'n2', title: 'Welcome ceremony starts now at the Main Hall.', category: 'Campus', time: '12m ago' },
  { id: 'n3', title: 'Mak vs MUBs Football Today at the Arena.', category: 'Sports', time: 'Live' },
  { id: 'n4', title: 'Library maintenance scheduled for Sunday.', category: 'Admin', time: '5h ago' }
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
    eventDate: '2026-06-20T10:00:00',
    eventTime: '10:00',
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
  },
  {
    id: 'p-unipod-2',
    author: 'Mak UniPod',
    authorId: 'mak_unipod',
    authorRole: 'Innovation Forge',
    authorAvatar: 'https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg',
    authorAuthority: 'Official',
    timestamp: '1h ago',
    content: `
      <h1>Open Innovation Call: Prototype & Build</h1>

      <p>
        Makerere University Innovation Pod (Mak UniPod) invites students from all colleges 
        to access our <strong>advanced prototyping facilities</strong>, including 3D printing, 
        electronics labs, and product design support.
      </p>

      <p>
        Final-year students, startup teams, and research groups can now submit their project 
        concepts for <strong>rapid prototyping, mentorship, and technical validation</strong>.
      </p>

      <p>
        Visit the UniPod Forge to register your idea or message us here on MakSocial 
        for guidance on how to get started.
      </p>

      <p><strong>Build. Test. Innovate.</strong></p>
    `,
    hashtags: ['#MakUniPod', '#Innovation', '#Prototyping', '#Startups'],
    likes: 1240,
    commentsCount: 36,
    comments: [],
    views: 15420,
    flags: [],
    isOpportunity: true,
    college: 'CEDAT',
    images: [
      'https://www.undp.org/sites/g/files/zskgke326/files/styles/scaled_image_large/public/2024-12/boys_and_girls.jpg?itok=aY8OcUMK',
      'https://www.undp.org/sites/g/files/zskgke326/files/2024-03/student_on_the_cnc_milling_machine.jpg'
    ]
  },
  {
  id: 'p-guild-president-1',
  author: 'Office of the Guild President',
  authorId: 'guild_president',
  authorRole: 'Guild President',
  authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4InWGvYRKGuV-Qi3v4SansxAxWjDUWfdqig&s',
  authorAuthority: 'Student Leader',
  timestamp: '45m ago',
  content: `
    <h1>Message from the Guild President</h1>

    <p>
      Dear Makerere students,
    </p>

    <p>
      I am pleased to inform you that following continuous engagement with university 
      management, the Guild leadership has secured a resolution on key student welfare 
      concerns, including allowances and academic support services.
    </p>

    <p>
      Implementation will begin next week, and further updates will be shared through 
      official university channels and here on MakSocial.
    </p>

    <p>
      I encourage all students to remain united, informed, and actively engaged as we 
      work together to improve the student experience at Makerere University.
    </p>

    <p><strong>Service Above Self.</strong></p>
  `,
  hashtags: ['#GuildLeadership', '#StudentVoice', '#Makerere'],
  likes: 3450,
  commentsCount: 284,
  comments: [],
  views: 48700,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: [
    'https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png'
  ]
},
  {
    id: 'p-stud-x-1',
    author: 'Brian K.',
    authorId: 'u-brian',
    authorRole: 'CS Finalist',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
    timestamp: '20m ago',
    content: `<p>COCIS Wi-Fi is finally stable tonight. Grinding till morning 💻🔥</p>`,
    hashtags: ['#FinalYear', '#COCIS'],
    likes: 34,
    commentsCount: 2,
    comments: [],
    views: 420,
    flags: [],
    isOpportunity: false,
    college: 'COCIS',
    images: []
  },
  {
  id: 'p-lec-general-1',
  author: 'Dr. Julianne O.',
  authorId: 'u-julianne',
  authorRole: 'Senior Lecturer',
  authorAvatar: 'https://media.licdn.com/dms/image/v2/C5603AQEbfx2r6KmEBQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1528009115211?e=2147483647&v=beta&t=P79glpXCLtisJ5uT6QkGpTtdDBZ1IHYCouww850tWFE',
  authorAuthority: 'Lecturer',
  timestamp: '2h ago',
  content: `
    <h1>A Note to All Students</h1>
    <p>As the semester approaches its final phase, I encourage all students to plan their revision schedules early and make good use of the academic resources available across the university.</p>
    <p>Consistent effort, healthy rest, and academic integrity remain key to success.</p>
  `,
  hashtags: ['#AcademicAdvice', '#StudySmart', '#Makerere'],
  likes: 420,
  commentsCount: 27,
  comments: [],
  views: 9800,
  flags: [],
  isOpportunity: false,
  college: 'COCIS',
  images: []
},
  {
  id: 'p-ad-airtel',
  author: 'Airtel Uganda',
  authorId: 'airtel_partner',
  authorRole: 'Network Partner',
  authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGb5X14Mj1kTtRIuEZWnqS7dh4vfKGYMgGw&s',
  authorAuthority: 'Corporate',
  isAd: true,
  timestamp: '5h ago',
  content: `
    <h1>A Reason to Imagine: University Bundles</h1>
    <p>Switch to the smartphone network and enjoy unthrottled access to Microsoft Teams and Zoom for your online research. Dial <strong>*175*3#</strong>.</p>
  `,
  hashtags: ['#AirtelUniv', '#Imagination'],
  likes: 3100,
  commentsCount: 45,
  comments: [],
  views: 65000,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: ['https://pbs.twimg.com/media/GLXZVucWEAAi-rf.jpg']
},
  {
  id: 'p-stud-text-3',
  author: 'Kato M.',
  authorId: 'u-kato',
  authorRole: 'Software Engineering Student',
  authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kato',
  timestamp: '8m ago',
  content: `<p>Why does motivation always show up at 2:17 AM when the deadline is at 8:00 AM 😭💻</p>`,
  hashtags: ['#StudentLife', '#Deadlines'],
  likes: 143,
  commentsCount: 19,
  comments: [],
  views: 1200,
  flags: [],
  isOpportunity: false,
  college: 'COCIS',
  images: []
},
  {
  id: 'p-law-1',
  author: 'Counsel Peter',
  authorId: 'u-peter',
  authorRole: 'Legal Advisor',
  authorAvatar: 'https://img.freepik.com/premium-photo/portrait-handsome-african-american-man-closeup-business-man-model_423170-2131.jpg',
  authorAuthority: 'Official',
  timestamp: '7h ago',
  content: `
    <h1>Free Legal Clinic for First-Year Students</h1>
    <p>The Legal Clinic is offering free legal guidance to all first-year students on matters related to the Guild Constitution and student rights.</p>
  `,
  hashtags: ['#LegalClinic', '#StudentRights'],
  likes: 412,
  commentsCount: 25,
  comments: [],
  views: 3400,
  flags: [],
  isOpportunity: false,
  college: 'LAW',
  images: ['https://campusbee.ug/wp-content/uploads/2024/06/20240619_170258.jpg']
},
  {
  id: 'p-ad-stanbic',
  author: 'Stanbic Bank',
  authorId: 'stanbic_partner',
  authorRole: 'Finance Node',
  authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0s2wWh35UqBmtsFx7GsnO0XMDYuTWTapnQ&s',
  authorAuthority: 'Corporate',
  isAd: true,
  timestamp: '8h ago',
  content: `
    <h1>Flexi-Pay: Pay Tuition Easily</h1>
    <p>Settle your university fees instantly from your wing. Flexi-Pay is now fully synced with the Makerere Central Finance Hub.</p>
  `,
  hashtags: ['#EasyBanking', '#MakerereFlex'],
  likes: 1520,
  commentsCount: 15,
  comments: [],
  views: 43000,
  flags: [],
  isOpportunity: false,
  college: 'Global',
  images: ['https://www.independent.co.ug/wp-content/uploads/2025/06/Mellisa-Nyakwera-Solomon-Kimera.jpg']
},
  {
    id: 'p-grc-cedat-2',
    author: 'Nambasa S.',
    authorId: 'u-mugisha',
    authorRole: 'GRC CEDAT',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKVJA7A0yJBC5n42YzAU2GSUpUo46FdbUpBA&s',
    authorAuthority: 'Student Leader',
    timestamp: '20m ago',
    content: `<h1>CEDAT Wi-Fi Upgrade Completed</h1><p>The GRC has successfully upgraded the CEDAT common room Wi-Fi.</p>`,
    hashtags: ['#CEDATLife', '#TechAccess', '#GRCUpdates'],
    likes: 310,
    commentsCount: 18,
    comments: [],
    views: 5400,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: []
  },
  {
  id: 'p-chs-1',
  author: 'Dr. Nalule',
  authorId: 'u-nalule',
  authorRole: 'Medical Lead',
  authorAvatar: 'https://covab.mak.ac.ug/wp-content/uploads/2025/03/Nalule-Agnes-Sarah.jpg',
  authorAuthority: 'Official',
  timestamp: '9h ago',
  content: `<h1>Health Alert: Flu Cases in CHS Wing</h1><p>Several flu cases have been reported in the CHS wing. Students are advised to take precautions.</p>`,
  hashtags: ['#HealthFirst', '#CampusWellness'],
  likes: 570,
  commentsCount: 16,
  comments: [],
  views: 9100,
  flags: [],
  isOpportunity: false,
  college: 'CHS',
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSak_CcF8BjBbrszumAnLw34llp_XBI3f1xIA&s']
},
  {
  id: 'p-opp-2',
  author: 'Ministry of Science & Technology',
  authorId: 'moest_node',
  authorRole: 'Grant Provider',
  authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Gov',
  authorAuthority: 'Official',
  timestamp: '10h ago',
  isOpportunity: true,
  opportunityData: {
    type: 'Grant',
    isAIVerified: true,
    detectedBenefit: 'UGX 10M Fund'
  },
  content: `<h1>Makerere Innovation Grant: Sustainable Solutions</h1><p>The Ministry of Science & Technology is offering a UGX 10M grant for student projects focused on sustainable innovations.</p>`,
  hashtags: ['#Sustainability', '#StudentGrants', '#MakerereInnovation'],
  likes: 980,
  commentsCount: 48,
  comments: [],
  views: 20000,
  flags: [],
  college: 'Global',
  images: ['https://www.independent.co.ug/wp-content/uploads/2022/10/Musenero-science-1.jpg']
},
  {
    id: 'p-opp-hackathon-1',
    author: 'MIIC HUB',
    authorId: 'techhub_node',
    authorRole: 'Innovation Hub',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Miic',
    authorAuthority: 'Official',
    timestamp: '12m ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Grant',
      isAIVerified: true,
      detectedBenefit: 'Cash Prizes + Mentorship'
    },
    content: `<h1>🚀 Makerere Hackathon 2026 is Here!</h1><p>Are you ready to code, innovate, and compete? Join the Makerere Hackathon 2026!</p>`,
    hashtags: ['#MakerereHackathon', '#InnovationChallenge', '#TechAtMakerere'],
    likes: 720,
    commentsCount: 35,
    comments: [],
    views: 12500,
    flags: [],
    college: 'Global',
    images: ['https://miichub.com/wp-content/uploads/2025/07/IMG_8155-1024x683.jpg']
  },
  {
    id: 'p-news-1',
    author: 'Makerere University News',
    authorId: 'pulse_news',
    authorRole: 'Media Wing',
    authorAvatar: 'https://media.istockphoto.com/id/929047972/vector/world-news-flat-vector-icon-news-symbol-logo-illustration-business-concept-simple-flat.jpg?s=612x612&w=0&k=20&c=5jpcJ7xejjFa2qKCzeOXKJGeUl7KZi9qoojZj1Kq_po=',
    authorAuthority: 'Official',
    timestamp: '11h ago',
    content: `<h1>⚡ Exam Dates Official!</h1><p>Makerere students, mark your calendars! Logic testing kicks off on 12th December 2026.</p>`,
    hashtags: ['#ExamSeason', '#MakerereNews', '#StudySmart', '#CampusUpdate'],
    likes: 2500,
    commentsCount: 520,
    comments: [],
    views: 55000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://donnamorgancounselling.co.uk/wp-content/uploads/2023/03/exam-stress.jpg']
  },
  {
  id: 'p-stud-1',
  author: 'Opio Eric',
  authorId: 'u-opio',
  authorRole: 'Computer Science Student',
  authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Opio',
  timestamp: '12h ago',
  content: `<p>Just completed the <strong>COCIS Network Bootcamp</strong>! 🚀 Learned so much about routing and cloud networking.</p>`,
  hashtags: ['#NetworkBootcamp', '#COCIS', '#MakerereCS', '#HandsOnLearning'],
  likes: 150,
  commentsCount: 10,
  comments: [],
  views: 1200,
  flags: [],
  isOpportunity: false,
  college: 'COCIS',
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr12vxIIFkHgr9czQdx2-ZpJAQHsTuvVU83A&s']
},
  {
  id: 'p-opp-totalenergies',
  author: 'Total Energies Uganda',
  authorId: 'totalenergies_node',
  authorRole: 'Corporate Partner',
  authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Total',
  authorAuthority: 'Official',
  timestamp: '30m ago',
  isOpportunity: true,
  opportunityData: {
    type: 'Internship',
    isAIVerified: true,
    detectedBenefit: 'Stipend + Mentorship'
  },
  content: `<h1>💼 Total Energies Student Internship 2026</h1><p>Total Energies Uganda is inviting students from all colleges at Makerere to apply.</p>`,
  hashtags: ['#TotalEnergiesInternship', '#MakerereCareers', '#StudentOpportunities'],
  likes: 640,
  commentsCount: 22,
  comments: [],
  views: 10800,
  flags: [],
  college: 'Global',
  images: ['https://www.icanstudent.com/wp-content/uploads/2026/01/Delicate-Feminine-Interior-Designer-Featured-Products-Facebook-Post_20260110_072809_0000-940x675.png']
},
  {
    id: 'p-hospital-1',
    author: 'University Hospital',
    authorId: 'university_hospital',
    authorRole: 'Health Hub',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHQ7AXGqNl4CNxMtxquN03ZsS7q-EcOlu_7A&s',
    authorAuthority: 'Official',
    timestamp: '17h ago',
    content: `<h1>💉 Free Student Vaccinations</h1><p>Attention Makerere students! University Hospital is offering free vaccinations.</p>`,
    hashtags: ['#CampusHealth', '#StayProtected', '#MakerereWellness'],
    likes: 1450,
    commentsCount: 95,
    comments: [],
    views: 20000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://ugandaradionetwork.net/a/helpers/image.php?fileId=135221&m=0&w=1200&h=600']
  },
  {
    id: 'p-fun-1',
    author: 'Campus Fun Hub',
    authorId: 'campus_fun',
    authorRole: 'Student Entertainment',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Fun',
    authorAuthority: 'Official',
    timestamp: '5m ago',
    content: `<h1>😂 Campus Mood</h1><p>Why did the student bring a ladder to the exam? Because they heard the questions were on a higher level!</p>`,
    hashtags: ['#CampusHumor', '#StudentLife', '#ExamSeason'],
    likes: 320,
    commentsCount: 12,
    comments: [],
    views: 1500,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: []
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
