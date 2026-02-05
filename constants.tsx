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
    authorAvatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA8FBMVEX/ywUAAAAAAAMAAAX/zQQAAAj/0Ab/0gdBNQPdtAPjtwX8zQT/ygj/zgYAAAv9ywaqiQaDawEWDwIeGQMvJQH0wwXYrgMoHgIAAwDsvwb/1QmMdAj1ywg6MAnJoAP5yAlURwVcSgfAmQiSeQN5YQNjTANJPgQjHgIVEAsKCwNCNgObfwizkQuEaQpQPAQgGwYlEgWUcAUxKwqlgQqjjA1vYQolGQJqVwQ0JQjAnwXOrAF3YgbjvACLdghJNw06MASyigwxMAXerglcTgZYRg3qxApyWw8XBAkfGAiKaQpkWAcTEwBNSAkEFQeulBQqKQyNsFPLAAANWklEQVR4nO2cC1vbxhKGpb1ia1drAjaWMJaxgQA2oYQkxDYpbSCU0/Q0///fnJmVLzTYYBLZSc8z79NiEELSp52dmZ3dTRAQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEUg3Ni5nEx4uvDy3+i4jEoEz4ja5XSgHLVapKUkSSpZoFO/VFrQZ8xwp9ufvRTP4NIBygsteVmu9fZ2z9Y29l8eXd4VOecHx292Hi5uXN8sH/S7bVrCb4AK+y/SZ/QOsiSZvfk1SHjIedhyJj/GMNCNvqRhfCL0/3tSrPaUFr91ObqIoP9Cx6zWqqst/DZUQFjIyGjD3+As3BylPH8C/9lf7tdzlClCyIXCfejFX1FFBkXaJ30z1p30ED3W2xBODbn6/3zgVdp3E+mUARC6UFnjUtsJDZqpOchJWc8Dvlh600ZXNBPI9E/h1LV9tu8z3HscvVw3M3YVCs4mHdbyLvPL+pTYSyc2CyH07n/7pcPA6PsT9AtHbp4pat/X3DG7z8yh6bk2CjvWxcnZ73+oFaDKFHNsizKMggb5VJtMOhXtofXB+/GTgjeSzi5CudbJwOnbfBjXawzgbBpc7gRcjltEymx6fhf6+f9yySzWqHJYZy3Ef6RD/g+7FuME1EjKbXP9q44k+hxx00OP0i+0ymnLniQIKxSodBZZcs/FZv4FiaPdrv9JIBQj6mNwYaOAOd1OQReDRwCb2mMw2gP70CJcu/Dr2OLDUdX5Pymb3+MsQpoFOh95ROWRzvsQj4UXL1tlyBVgQZDccJLBCH4n///HvBjBB5KRN6nCAEpgqtVrjd952WhvzBcduu8qqyJVi3QGGPT0hBcZ/6+4VFkyG9/K0HX+Z7sBAy3Ouhex3Jq9SF70Ul0YFbbkg4MK7mQ06gAEk+aDWg8NMZvFijAZiMTaJv0LuTYC8OnPDpzasXdUScnkodynLIc3jahL0GPM8H3RDH4a2EitFqVut7NSGId/DTjFQPGsRoiEzlR8S4BBMqQxQe9qi7+7kqXu79zn0J4J3Y1wFe4iv5oIlVqce4dC4+Z3PtolVlG0ALfkzWv/Z0wQeByWFUrSXSitCvBPrkPy7KTgPFAnryEG0GssSqoXYBGb69cnjb10tvQBTa5wfiOfpwfdRoaHIBYShNir4T8W+jyhXdovA7xcdtCL1nGzSYIPbjzoRhea7z+SS/1ZqNbwj33WZ7oSn6TiDkVkoLQPbQY8G4ybl3mznPpGKNU/xef70LneFdSy7yZ7kID4hAnPupB6r+S8Q34T+eUW5doqNA92GBplgNRalvmybH8M1nqm3yI0LX3MK6GtD6M+8tyqU53ML2W9Zh19eqzYZtdgPFg8OeDJb1e1fNFJXCkA+1WX+OMlOqG3Hs5fll8guFMZAcxZIiyHp4mNpjRBdHH4bDPBZPMDYtTgMIBk3hIYE0AjxoJTEZF/gf+vJk9HEJS2sdeAjL/qPq/KRLjgmQD80PGdxIx+9rZpS/32mnB26iqLwFnNiuVH1Kqmugjfn6CwOev6Wzmf3M5O7AbPWCYxDF5Da+lYCuK7AWkiGAkr0HCzGuLMseR3evGZHDhrLr2yUhJJGxG8Y33bYRlOb7TGI3/jKr5TH5ntruE5Lvp81TJe6rg7Mbodoh1Bg5dAOuGMxViwYWx4fTethfj8/CPNkE/+DWyr4SEoSCLb1LfIsLYmq/wrM1WCEm/6kk/9o+T7xrFzLi2O/SPKOe7MVHORzu8nZcdoC8lh/mhkkpm1U9ZUylfG4BsTOPzmkj4NgznKMSr6u18WHObFqvQVsAEZV1+0HOzmLFCKRP0dJCsqqHkiylkrK3xuk8rDIRd4z5/KxfbD+0mRyf2OpvjZe4pZOwG5x9coPsyXFSh5CW7mMLIlvI/3kuLkwfWjx2cs0ezibFCGAJ0Nc5hZH+MK2cldRlu3G1sbJwe+vrL4ekGAp7G8tE5/EuGcx8LtKHR/5GYvtWrorCuGAVqzz/F8WO5xFghnjhQxumTSbuVRJT66cK050tX62k+ewhZBJ/UD3d1tEA/DEYuDVxCW812ed+i0GQ7+NxhZUGF4WsQ2JwaJig0BuKkUxU/XF+3kRPOmiiatCF8dLRYSGGgryWev6cLU+hUOZ8CSx47655Cxt/qbOe+QpejKj4unmDEQcRUIQyr+2oxhaoNXo/J4+KqNpFt+0d4/aiDnkQLDIpxvxOzydOXxm4P2hBZV+OUC60UBwyYLHHwNm7AnlYoEl9OrSeFJcdCnXuHN3w0pR8p/HyHUzJx/QiCffznzgIKQ3Z6gGU7Fr9v2EXaMEiPvKUUFy9g2OSv2FULtOFVDweqmMLwMK4uorDO7i7v/Dw4/zNdTOGVN5aaLSr5dpBHAPJ8EYWb6a2fdsAqfyV9v4BCxj9XS1g0BFvtflxAodAHPhGqqcKGF7rjrbT7+H1HClXjlMk69Ma4pfXmQlb6opq2cYqAxXFnoTZ87W3qY2FtCA/mH/7tQgqtrcXMzwQnQbqowsBuQ07I61zWn1Zo0tyDFdgPVdNf8fTReuxYoQjSboyPW1HRQlaaK4z+in3etEAb2vxO/00Kq/SZaBQPS4+dNVEIGdsN+P4WBOTF2zAQ2eF0zv+JeFjBJFke2MKyNieiY9+1uwvkNKgw+HReeZPAkOsZCgNRmo6Sn1B44NcKrOvC5k1hmOAHZWwze+Ss+wphdA+J2bPaMIDB7WIK7UD6ml9TFVfIcKLmp+nluZ5vGPcU4jl+sv45Co3Q6+Mk6FGFel8y6OanUaFDYB+BWPjHJzd3+HRP4dgBPEsh3uVmtKZjvkIT2b73CfHjsevZiL5fMMOvnxzjf49CUd3gT7WhNZiygdfNCh7jq+Pcnb6Zu36wCIW29pRCofZ9M7OOLnhSCMM4ph0chjizXZgo+b66dW+6PcoV8o8ThW+8gqkXtBJT2KORQmPV3xKHt1ezZw2gi+ht6atxX7KCa22YuflqM+eDOatJxOXa1draVWu6ZgI8TQsOrX2ZJB/279fw8872ZOwaba1dXV0dV0cnREZ/gDOudmeHJRPpc19MDOOmLXpizwQNtFNcPlibU64VkbP/WMAEA9QIjrjGZCxu/AF7b8kGVhHtxCYMhJjIKTenYu90N6/ahh+UMwXPXUTGXnLIGn0hVwczX+CDOpzx8/vm3kRGfoqdLun2ExbjH4Qw/spmRj8QzvhaKYfRlnxlIQspQNVX2BJ0Gr8wr6uKrqk/jXE225eQu4ZS/r6kuwvbH3UCflFd1eqd6d11aVOG6Ef5ZmKXNEPqVD/GJTzgzL40VzxHKtQbX0MEjVuXanmLFfQAZ0h97B9mNnDzM5zicMJAkCgf+HDM/OTXMu+mSrik19tK2LOFe+zZN7Uq2/b2idHqOluSiY5u5sSn3dGaZclfNZVdvscRyr15l0/xgMAPkVjuawU3bjtx6NdxQ3BsDVKI/0u6JW5JMEKp3hdcL8zDOvSPvhLzgmVxRKr2BYKSf6eMveoLLYodx0xwEa6y/izDfJlgHO5/WqqFTu5rVLQt+ajjS7ZTSfQS1g4JYa0qn3FfDcebhS96qrji2mNEkJ+pWivM13fj4s/Pw5otPHgonfV387UR+cK9YaJW4rtHCNu+g65YD/PNTOFmp5RqayA3NYH55ukEgf088p0vbe59Hm81wf0pN6WVb/uyaeVlOFlvznm8uf2xkSpInKNvXoxpXJThDpWsOYzDycXByxw005UnUdBSqlHZubeDC+xpa69XBnv99g0S1upGqbKPliknu2fC3aZVS3JmjxIZYV37gPs1yn5bgl9Ccjzs1ayyym+NMcZvuMDREy6GxU0MCC6cMuhM8ARcQwWHcKtpVqtcv/f7LLA0zPJNHMMaRF0zf/3AklGqtCeln4qZGBVI/qvTKzWU1TAE8dtkwHShe8HoMMfgt/mcaYTXgBfSqFXWf+fTbUEY/EIef+5W1ert8x+4IM16LQwbY2ut+zIDPOjm7XaleZlUncatTyDD+pE7LnSDBkO0jqpJud9dv37H/Crg8Q4VvwmTv7htWv3Dt0GDZ3FWlyut6a4zHynDOvOTwSHbfLV/sX5W6fWbtSnNfu/8bHix++tpONpXhAplGE73rl20E42z4Y9VoVcjEV+yUOJTZZ+zmI96z3SG+5+wcPZxr4nhShUsBjE+bFeVelg0+IHAs1itm2drPoOcI+8p6n776YvWeQ3MWqx8M9fjQKiPMJLppLl9/ZJ9yzZZTOV3LirNLIXkzH172rAkwPs7gXuwwYvoarm9ffEy3wUyas36QznQZKPv/ZervU6znGm/PwUut+Q9B9+N0tY1ar91h78y37/YZBMfz9cw+AP4CwgIrfXzdrlh7E++Hf9rcP+sX+elkhr+swrrt/s3r47XsP67tnZwsLt/u97ttZu1agp9ToNT+Rm2NT8LiPOYn+KKd0xX/D+NkaZ+dRt+wU8MkSgrEpCPOpwL/LeJnPDwwX+iKEAQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQxP8l/wMM8uAWSgd8iAAAAABJRU5ErkJggg==',
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
    authorAvatar: '',
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
  authorAvatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
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
    images: ['https://github.com/AshrafGit256/MakSocialImages/blob/main/Public/journalism4.mp4']
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
