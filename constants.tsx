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
    authorAvatar: 'data:image/png;base64,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',
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
  }
,
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
    authorAvatar: 'data:image/jpeg;base64,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',
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
  }
,
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

    <p>
      As the semester approaches its final phase, I encourage all students to 
      plan their revision schedules early and make good use of the academic 
      resources available across the university.
    </p>

    <p>
      Do not hesitate to consult your lecturers, use the library facilities, 
      and collaborate responsibly with your peers.
    </p>

    <p>
      Consistent effort, healthy rest, and academic integrity remain key to 
      success.
    </p>

    <p>
      Wishing you all the best in your studies.
    </p>

    <p>
      <strong>Dr. Julianne O.</strong><br />
      Senior Lecturer
    </p>
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
}
,
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
    <p>
      Switch to the smartphone network and enjoy unthrottled access to 
      Microsoft Teams and Zoom for your online research. Dial <strong>*175*3#</strong>.
    </p>
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
}
,
  {
  id: 'p-stud-text-3',
  author: 'Kato M.',
  authorId: 'u-kato',
  authorRole: 'Software Engineering Student',
  authorAvatar: 'data:image/jpeg;base64,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',
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
}
,
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
    <p>
      The Legal Clinic is offering free legal guidance to all first-year students 
      on matters related to the Guild Constitution and student rights.
    </p>
    <p>
      Visit the LAW Wing, Room 4B, for assistance.
    </p>
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
}
,
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
    <p>
      Settle your university fees instantly from your wing. Flexi-Pay is now fully synced 
      with the Makerere Central Finance Hub.
    </p>
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
}
,
 
  {
    id: 'p-grc-cedat-2',
    author: 'Nambasa S.',
    authorId: 'u-mugisha',
    authorRole: 'GRC CEDAT',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKVJA7A0yJBC5n42YzAU2GSUpUo46FdbUpBA&s',
    authorAuthority: 'Student Leader',
    timestamp: '20m ago',
    content: `
      <h1>CEDAT Wi-Fi Upgrade Completed</h1>
      <p>
        The GRC has successfully upgraded the CEDAT common room Wi-Fi. 
        Students can now enjoy faster and more stable internet for research, projects, and online classes.
      </p>
      <p>
        Please report any connectivity issues to the GRC office so we can address them promptly.
      </p>
    `,
    hashtags: ['#CEDATLife', '#TechAccess', '#GRCUpdates'],
    likes: 310,
    commentsCount: 18,
    comments: [],
    views: 5400,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: []
  }

,
  {
  id: 'p-chs-1',
  author: 'Dr. Nalule',
  authorId: 'u-nalule',
  authorRole: 'Medical Lead',
  authorAvatar: 'https://covab.mak.ac.ug/wp-content/uploads/2025/03/Nalule-Agnes-Sarah.jpg',
  authorAuthority: 'Official',
  timestamp: '9h ago',
  content: `
    <h1>Health Alert: Flu Cases in CHS Wing</h1>
    <p>
      Several flu cases have been reported in the CHS wing. Students are advised to 
      take precautions and update their wellness status at the university clinic.
    </p>
    <p>
      Free medical checks are available for all students—stay safe! 🩺
    </p>
  `,
  hashtags: ['#HealthFirst', '#CampusWellness'],
  likes: 570,
  commentsCount: 16,
  comments: [],
  views: 9100,
  flags: [],
  isOpportunity: false,
  college: 'CHS',
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSak_CcF8BjBbrszumAnLw34llp_XBI3f1xIA&s']
}

,
  {
  id: 'p-opp-2',
  author: 'Ministry of Science & Technology',
  authorId: 'moest_node',
  authorRole: 'Grant Provider',
  authorAvatar: 'https://media.licdn.com/dms/image/v2/C4D0BAQFCumMNaeQgew/company-logo_200_200/company-logo_200_200/0/1654524971607?e=2147483647&v=beta&t=FRkh-Xcwy1a2toQtR5d22fwImh8R_a_o2tcHeFafs6M',
  authorAuthority: 'Official',
  timestamp: '10h ago',
  isOpportunity: true,
  opportunityData: {
    type: 'Grant',
    isAIVerified: true,
    detectedBenefit: 'UGX 10M Fund'
  },
  content: `
    <h1>Makerere Innovation Grant: Sustainable Solutions</h1>
    <p>
      The Ministry of Science & Technology is offering a UGX 10M grant for student projects 
      focused on sustainable and eco-friendly innovations on campus. Projects can include solar labs, 
      energy efficiency, or green campus designs.
    </p>
    <p>
      Open to finalists from <strong>CEDAT</strong> and <strong>COCIS</strong>. Submit your proposals 
      via the MakSocial Opportunities section before the deadline.
    </p>
    <p>
      Bring your ideas to life and make a lasting impact! 🌱
    </p>
  `,
  hashtags: ['#Sustainability', '#StudentGrants', '#MakerereInnovation'],
  likes: 980,
  commentsCount: 48,
  comments: [],
  views: 20000,
  flags: [],
  college: 'Global',
  images: ['https://www.independent.co.ug/wp-content/uploads/2022/10/Musenero-science-1.jpg']
}

,
  {
    id: 'p-opp-hackathon-1',
    author: 'MIIC HUB',
    authorId: 'techhub_node',
    authorRole: 'Innovation Hub',
    authorAvatar: 'https://miichub.com/wp-content/uploads/2025/04/OFFICIAL-MIIC-LOGO-PDF.png',
    authorAuthority: 'Official',
    timestamp: '12m ago',
    isOpportunity: true,
    opportunityData: {
      type: 'Grant',
      isAIVerified: true,
      detectedBenefit: 'Cash Prizes + Mentorship'
    },
    content: `
      <h1>🚀 Makerere Hackathon 2026 is Here!</h1>
      <p>
        Are you ready to code, innovate, and compete? Join the <strong>Makerere Hackathon 2026</strong> 
        and showcase your tech skills! Open to all students across Makerere University.
      </p>
      <p>
        <strong>🗓 Application Deadline:</strong> 20th February 2026<br>
        <strong>💡 Prizes:</strong> Cash rewards, mentorship, and internship opportunities.
      </p>
      <p>
        Don’t wait! Submit your team projects through the MakSocial Opportunities section now and get ready 
        to hack your way to the top! 🔥
      </p>
    `,
    hashtags: ['#MakerereHackathon', '#InnovationChallenge', '#TechAtMakerere'],
    likes: 720,
    commentsCount: 35,
    comments: [],
    views: 12500,
    flags: [],
    college: 'Global',
    images: ['https://miichub.com/wp-content/uploads/2025/07/IMG_8155-1024x683.jpg']
  }

,
  {
    id: 'p-news-1',
    author: 'Makerere University News',
    authorId: 'pulse_news',
    authorRole: 'Media Wing',
    authorAvatar: 'https://media.istockphoto.com/id/929047972/vector/world-news-flat-vector-icon-news-symbol-logo-illustration-business-concept-simple-flat.jpg?s=612x612&w=0&k=20&c=5jpcJ7xejjFa2qKCzeOXKJGeUl7KZi9qoojZj1Kq_po=',
    authorAuthority: 'Official',
    timestamp: '11h ago',
    content: `
      <h1>⚡ Exam Dates Official!</h1>
      <p>
        Makerere students, mark your calendars! The University Council has confirmed the exam schedule. 
        <strong>Logic testing kicks off on 12th December 2026</strong> across all colleges.
      </p>
      <p>
        Start revising, organize your study groups, and get ready to ace your exams! 💪📚
      </p>
    `,
    hashtags: ['#ExamSeason', '#MakerereNews', '#StudySmart', '#CampusUpdate'],
    likes: 2500,
    commentsCount: 520,
    comments: [],
    views: 55000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://donnamorgancounselling.co.uk/wp-content/uploads/2023/03/exam-stress.jpg']
  }
,
  {
  id: 'p-stud-1',
  author: 'Opio Eric',
  authorId: 'u-opio',
  authorRole: 'Computer Science Student',
  authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Opio',
  timestamp: '12h ago',
  content: `
    <p>
      Just completed the <strong>COCIS Network Bootcamp</strong>! 🚀 Learned so much about routing, switching, and cloud networking. 
      Feeling ready to tackle real-world networking challenges. 💻🌐
    </p>
    <p>
      Shoutout to the instructors and peers for an amazing hands-on experience. Makerere CS students are leveling up! ⚡
    </p>
  `,
  hashtags: ['#NetworkBootcamp', '#COCIS', '#MakerereCS', '#HandsOnLearning'],
  likes: 150,
  commentsCount: 10,
  comments: [],
  views: 1200,
  flags: [],
  isOpportunity: false,
  college: 'COCIS',
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr12vxIIFkHgr9czQdx2-ZpJAQHsTuvVU83A&s']
}
,
  {
  id: 'p-opp-totalenergies',
  author: 'Total Energies Uganda',
  authorId: 'totalenergies_node',
  authorRole: 'Corporate Partner',
  authorAvatar: 'https://yt3.googleusercontent.com/0X4_rnOYEGy6oz2HKl6tzHANZwe1PrJYzpb6-a8fXSa9SEI2bucq9cs1fODEc4JTl_JzJp2YbQ=s900-c-k-c0x00ffffff-no-rj',
  authorAuthority: 'Official',
  timestamp: '30m ago',
  isOpportunity: true,
  opportunityData: {
    type: 'Internship',
    isAIVerified: true,
    detectedBenefit: 'Stipend + Mentorship'
  },
  content: `
    <h1>💼 Total Energies Student Internship 2026</h1>
    <p>
      Total Energies Uganda is inviting students from all colleges at Makerere to apply for our 
      3-month internship program. Gain hands-on experience, mentorship, and a monthly stipend.
    </p>
    <p>
      <strong>🗓 Application Deadline:</strong> 28th February 2026<br>
      <strong>Who Can Apply:</strong> All undergraduate finalists across Makerere University.
    </p>
    <p>
      Don’t miss this chance to learn from industry leaders and jumpstart your career! Apply via MakSocial Opportunities. 🌟
    </p>
  `,
  hashtags: ['#TotalEnergiesInternship', '#MakerereCareers', '#StudentOpportunities'],
  likes: 640,
  commentsCount: 22,
  comments: [],
  views: 10800,
  flags: [],
  college: 'Global',
  images: ['https://www.icanstudent.com/wp-content/uploads/2026/01/Delicate-Feminine-Interior-Designer-Featured-Products-Facebook-Post_20260110_072809_0000-940x675.png']
}
,
  {
    id: 'p-hospital-1',
    author: 'University Hospital',
    authorId: 'university_hospital',
    authorRole: 'Health Hub',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHQ7AXGqNl4CNxMtxquN03ZsS7q-EcOlu_7A&s',
    authorAuthority: 'Official',
    timestamp: '17h ago',
    content: `
      <h1>💉 Free Student Vaccinations</h1>
      <p>
        Attention Makerere students! University Hospital is offering <strong>free vaccinations</strong> 
        for all verified students. Ensure your health status is up to date and stay protected. 
      </p>
      <p>
        Visit the CHS Medical Wing and synchronize your health record today. Your wellness matters! 🌟
      </p>
    `,
    hashtags: ['#CampusHealth', '#StayProtected', '#MakerereWellness'],
    likes: 1450,
    commentsCount: 95,
    comments: [],
    views: 20000,
    flags: [],
    isOpportunity: false,
    college: 'Global',
    images: ['https://ugandaradionetwork.net/a/helpers/image.php?fileId=135221&m=0&w=1200&h=600']
  }
,
  {
    id: 'p-fun-1',
    author: 'Campus Fun Hub',
    authorId: 'campus_fun',
    authorRole: 'Student Entertainment',
    authorAvatar: 'https://img.freepik.com/premium-vector/fun-playful-logo-using-custom-typography-with-quirky-shapes-bright-colors_1307247-1830.jpg?semt=ais_user_personalization&w=740&q=80',
    authorAuthority: 'Official',
    timestamp: '5m ago',
    content: `
      <h1>😂 Campus Mood</h1>
      <p>
        Why did the student bring a ladder to the exam? Because they heard the questions were on a higher level! 🪜📚
      </p>
      <p>
        Keep calm, study smart, and maybe leave the ladder at home. 😎
      </p>
    `,
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
