
import { Post, User, College, UserStatus, LiveEvent, Notification, Violation, Comment, Poll, TimelineEvent, CalendarEvent } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v8',
  USERS: 'maksocial_users_v8',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  EVENTS: 'maksocial_events_v3',
  VIOLATIONS: 'maksocial_violations_v2',
  POLLS: 'maksocial_polls_v1',
  TIMELINE: 'maksocial_timeline_v1',
  CALENDAR: 'maksocial_calendar_v1'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Guru A.',
    role: 'CS Student',
    avatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/Ashraf.jpeg',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    email: 'guru@mak.ac.ug',
    badges: [{ id: 'b1', name: 'Top Contributor', icon: '🔥', color: 'text-orange-500' }],
    appliedTo: [],
    notifications: [],
    warningsCount: 0,
    postsCount: 12,
    followersCount: 1420,
    followingCount: 382,
    totalLikesCount: 4500
  },
  {
    id: 'u2',
    name: 'Kato John',
    role: 'Finalist',
    avatar: 'https://i.pravatar.cc/150?u=kato',
    connections: 512,
    college: 'CEDAT',
    status: 'Finalist',
    email: 'kato@mak.ac.ug',
    badges: [],
    appliedTo: [],
    notifications: [],
    warningsCount: 0,
    postsCount: 8,
    followersCount: 890,
    followingCount: 215,
    totalLikesCount: 1200
  }
];

export const db = {
  getCalendarEvents: (): CalendarEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ev-1',
        title: 'Mak Guild Presidential Debate',
        description: 'The final showdown before the elections. Witness the candidates define the future.',
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        time: '14:00',
        location: 'Freedom Square',
        image: 'https://img.freepik.com/free-vector/professional-debate-poster_742173-785.jpg',
        category: 'Academic',
        createdBy: 'admin'
      }
    ];
  },
  saveCalendarEvent: (event: CalendarEvent) => {
    const events = db.getCalendarEvents();
    const updated = [event, ...events.filter(e => e.id !== event.id)];
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(updated));
    
    db.logTimelineEvent({
      type: 'event_scheduled',
      userId: 'admin',
      userName: 'Campus Admin',
      userAvatar: 'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      description: `Scheduled a new campus event: "${event.title}"`,
      details: `${event.date} at ${event.location}`
    });
  },
  deleteCalendarEvent: (id: string) => {
    const events = db.getCalendarEvents();
    localStorage.setItem(DB_KEYS.CALENDAR, JSON.stringify(events.filter(e => e.id !== id)));
  },

  getTimeline: (): TimelineEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.TIMELINE);
    return saved ? JSON.parse(saved) : [];
  },
  logTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const timeline = db.getTimeline();
    const newEvent: TimelineEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.TIMELINE, JSON.stringify([newEvent, ...timeline].slice(0, 200)));
  },

  getPosts: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    const posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS.map(p => ({ 
      ...p, 
      views: p.views || 0, 
      flags: p.flags || [],
      comments: p.comments || [],
      commentsCount: p.commentsCount || 0
    }));

    const now = new Date().getTime();
    return posts.filter(p => {
      if (!p.isAd || !p.adExpiryDate) return true;
      return new Date(p.adExpiryDate).getTime() > now;
    });
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts));
  },

  addPost: (post: Post) => {
    const posts = db.getPosts();
    db.savePosts([post, ...posts]);
    
    // Increment post count
    const users = db.getUsers();
    const updatedUsers = users.map(u => u.id === post.authorId ? { ...u, postsCount: (u.postsCount || 0) + 1 } : u);
    db.saveUsers(updatedUsers);

    db.logTimelineEvent({
      type: 'new_post',
      userId: post.authorId,
      userName: post.author,
      userAvatar: post.authorAvatar,
      description: `Broadcasted a new signal: "${post.content.substring(0, 30)}..."`,
      targetId: post.id
    });
  },
  
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const oldUser = users.find(u => u.id === user.id);
    
    if (oldUser) {
      if (oldUser.name !== user.name) {
        db.logTimelineEvent({
          type: 'profile_update',
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          description: `Changed their name from "${oldUser.name}" to "${user.name}"`
        });
      }
      if (oldUser.bio !== user.bio) {
        db.logTimelineEvent({
          type: 'profile_update',
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          description: `Updated their bio`,
          details: user.bio
        });
      }
    }

    const updated = users.some(u => u.id === user.id) 
      ? users.map(u => u.id === user.id ? user : u)
      : [...users, user];
    db.saveUsers(updated);
  },

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    let user = users.find(u => u.id === currentId) || users[0];
    if (user.postsCount === undefined) {
      user = { ...user, postsCount: 0, followersCount: 0, followingCount: 0, totalLikesCount: 0 };
    }
    return user;
  },

  getViolations: (): Violation[] => {
    const saved = localStorage.getItem(DB_KEYS.VIOLATIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveViolation: (violation: Violation) => {
    const violations = db.getViolations();
    localStorage.setItem(DB_KEYS.VIOLATIONS, JSON.stringify([violation, ...violations]));
  },

  likePost: (postId: string) => {
    const posts = db.getPosts();
    const user = db.getUser();
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return posts;

    db.logTimelineEvent({
      type: 'like',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      targetId: postId,
      description: `Liked ${targetPost.author}'s post`
    });

    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    db.savePosts(updated);

    // Update author's impact score
    const users = db.getUsers();
    const updatedUsers = users.map(u => u.id === targetPost.authorId ? { ...u, totalLikesCount: (u.totalLikesCount || 0) + 1 } : u);
    db.saveUsers(updatedUsers);

    return updated;
  },

  addComment: (postId: string, comment: Comment) => {
    const posts = db.getPosts();
    const user = db.getUser();
    const targetPost = posts.find(p => p.id === postId);

    db.logTimelineEvent({
      type: 'comment',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      targetId: postId,
      description: `Commented on ${targetPost?.author}'s broadcast`,
      details: comment.text
    });

    const updated = posts.map(p => {
      if (p.id === postId) {
        const comments = [...(p.comments || []), comment];
        return { ...p, comments, commentsCount: comments.length };
      }
      return p;
    });
    db.savePosts(updated);
    return updated;
  },

  deletePost: (postId: string, deletedByUserId: string) => {
    const posts = db.getPosts();
    const targetPost = posts.find(p => p.id === postId);
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);

    // Decrement post count if needed
    if (targetPost) {
        const users = db.getUsers();
        const updatedUsers = users.map(u => u.id === targetPost.authorId ? { ...u, postsCount: Math.max(0, (u.postsCount || 0) - 1) } : u);
        db.saveUsers(updatedUsers);
    }
    return updated;
  },

  getPolls: (): Poll[] => {
    const saved = localStorage.getItem(DB_KEYS.POLLS);
    if (!saved) return [];
    const polls: Poll[] = JSON.parse(saved);
    const now = new Date().getTime();
    return polls.map(p => ({
      ...p,
      isActive: p.isActive && new Date(p.expiresAt).getTime() > now
    }));
  },

  savePoll: (poll: Poll) => {
    const polls = db.getPolls();
    const user = db.getUser();
    db.logTimelineEvent({
      type: 'poll_created',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      description: `Launched a campus poll: "${poll.question}"`,
      targetId: poll.id
    });
    localStorage.setItem(DB_KEYS.POLLS, JSON.stringify([poll, ...polls]));
  },

  voteInPoll: (pollId: string, optionId: string, userId: string) => {
    const polls = db.getPolls();
    const updated = polls.map(p => {
      if (p.id === pollId && !p.votedUserIds.includes(userId)) {
        return {
          ...p,
          votedUserIds: [...p.votedUserIds, userId],
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    });
    localStorage.setItem(DB_KEYS.POLLS, JSON.stringify(updated));
    return updated;
  },

  getEvents: (): LiveEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : [{ id: 'e1', title: 'Makerere 100 Years Celebration', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLive: true, organizer: 'Admin' }];
  }
};
