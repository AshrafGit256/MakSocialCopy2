
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
    authorAvatar: 'https://thumbs.dreamstime.com/b/elevate-your-event-vibrant-alumni-meet-logo-designed-to-capture-spirit-connection-celebration-perfect-338077132.jpg',
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
    images: ['https://cioafrica.co/wp-content/uploads/2022/10/Makerere-Uni.jpg']
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
    authorAvatar: 'https://yt3.googleusercontent.com/gHH044hTirIU5EXvmfOn6yXwJKM2pQaU2nt9OWrsnQq_fj4YWeQpuofWvyF-S_edIRZjSty4ZA=s900-c-k-c0x00ffffff-no-rj',
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
      <p>Makerere University Innovation Pod (Mak UniPod) invites students from all colleges to access our <strong>advanced prototyping facilities</strong>, including 3D printing, electronics labs, and product design support.</p>
      <p>Final-year students, startup teams, and research groups can now submit their project concepts for <strong>rapid prototyping, mentorship, and technical validation</strong>.</p>
      <p>Visit the UniPod Forge to register your idea or message us here on MakSocial for guidance on how to get started.</p>
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
      <p>Dear Makerere students,</p>
      <p>I am pleased to inform you that following continuous engagement with university management, the Guild leadership has secured a resolution on key student welfare concerns, including allowances and academic support services.</p>
      <p>Implementation will begin next week, and further updates will be shared through official university channels and here on MakSocial.</p>
      <p>I encourage all students to remain united, informed, and actively engaged as we work together to improve the student experience at Makerere University.</p>
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
    images: ['https://eagle.co.ug/wp-content/uploads/2024/10/image-2024-10-29T151841.969-1024x485.png']
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
    college: 'CEDAT',
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
    authorAvatar: 'data:image/jpeg;base64,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',
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
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtAo0oNf-vgci6RcLlsbvGrRm7jJmUFAkyJQ&s',
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
    authorAvatar: 'https://totalenergies.ug/themes/custom/butterfly_theme/logo.svg?v=1.1',
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
    college: 'CHS',
    images: ['https://ugandaradionetwork.net/a/helpers/image.php?fileId=135221&m=0&w=1200&h=600']
  },
  {
    id: 'p-fun-1',
    author: 'Campus Fun Hub',
    authorId: 'campus_fun',
    authorRole: 'Student Entertainment',
    authorAvatar: 'https://img.freepik.com/premium-vector/fun-playful-logo-using-custom-typography-with-quirky-shapes-bright-colors_1307247-1830.jpg',
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
    user: { name: 'Dr. Julianne O.', avatar: 'https://media.licdn.com/dms/image/v2/C5603AQEbfx2r6KmEBQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1528009115211?e=2147483647&v=beta&t=P79glpXCLtisJ5uT6QkGpTtdDBZ1IHYCouww850tWFE', status: 'online', role: 'Faculty Node' },
    unreadCount: 2,
    lastMessage: 'Handshake successful. Ready for uplink.',
    lastTimestamp: '10:01 AM',
    isGroup: false,
    messages: [
      { id: 'm1', text: 'Initializing protocol...', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', text: 'Handshake successful. Ready for uplink.', timestamp: '10:01 AM', isMe: false }
    ]
  },
  {
    id: 'chat-2',
    user: { name: 'Counsel Peter', avatar: 'https://img.freepik.com/premium-photo/portrait-handsome-african-american-man-closeup-business-man-model_423170-2131.jpg', status: 'online', role: 'Legal Node' },
    unreadCount: 0,
    lastMessage: 'The mooter session is scheduled for Friday.',
    lastTimestamp: 'Yesterday',
    isGroup: false,
    messages: [
      { id: 'm3', text: 'Hello Counselor, when is the next moot?', timestamp: 'Yesterday', isMe: true },
      { id: 'm4', text: 'The mooter session is scheduled for Friday.', timestamp: 'Yesterday', isMe: false }
    ]
  },
  {
    id: 'chat-3',
    user: { name: 'Brian K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian', status: 'offline', role: 'CS Peer' },
    unreadCount: 1,
    lastMessage: 'Did you sync the repository yet?',
    lastTimestamp: '2h ago',
    isGroup: false,
    messages: [
      { id: 'm5', text: 'Working on the logic hub now.', timestamp: '4h ago', isMe: true },
      { id: 'm6', text: 'Did you sync the repository yet?', timestamp: '2h ago', isMe: false }
    ]
  },
  {
    id: 'chat-4',
    user: { name: 'Mak UniPod', avatar: 'https://unipod.mak.ac.ug/wp-content/uploads/2024/12/Unipod-Logo-SVG.svg', status: 'online', role: 'Innovation Node' },
    unreadCount: 0,
    lastMessage: 'Your prototype submission was received.',
    lastTimestamp: '5h ago',
    isGroup: false,
    messages: [
      { id: 'm7', text: 'Your prototype submission was received.', timestamp: '5h ago', isMe: false }
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
