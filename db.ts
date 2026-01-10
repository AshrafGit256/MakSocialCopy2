
import { Post, User, College, UserStatus, LiveEvent, Notification, Violation, Comment } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v7',
  USERS: 'maksocial_users_v7',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  EVENTS: 'maksocial_events_v3',
  VIOLATIONS: 'maksocial_violations_v1'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah A.',
    role: 'CS Student',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    connections: 245,
    college: 'COCIS',
    status: 'Year 2',
    email: 'sarah@mak.ac.ug',
    badges: [{ id: 'b1', name: 'Top Contributor', icon: '🔥', color: 'text-orange-500' }],
    appliedTo: [],
    notifications: [],
    warningsCount: 0
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
    warningsCount: 0
  }
];

export const db = {
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    const posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS.map(p => ({ 
      ...p, 
      views: p.views || 0, 
      flags: p.flags || [],
      comments: p.comments || [],
      commentsCount: p.commentsCount || p.comments?.length || 0
    }));
    return posts;
  },
  savePosts: (posts: Post[]) => localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts)),
  
  getUsers: (): User[] => {
    const saved = localStorage.getItem(DB_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const updated = users.some(u => u.id === user.id) 
      ? users.map(u => u.id === user.id ? user : u)
      : [...users, user];
    db.saveUsers(updated);
  },

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    return users.find(u => u.id === currentId) || users[0];
  },

  getViolations: (): Violation[] => {
    const saved = localStorage.getItem(DB_KEYS.VIOLATIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveViolation: (violation: Violation) => {
    const violations = db.getViolations();
    localStorage.setItem(DB_KEYS.VIOLATIONS, JSON.stringify([violation, ...violations]));
  },
  updateViolationStatus: (id: string, status: Violation['status']) => {
    const violations = db.getViolations();
    const updated = violations.map(v => v.id === id ? { ...v, status } : v);
    localStorage.setItem(DB_KEYS.VIOLATIONS, JSON.stringify(updated));
  },

  sendWarning: (userId: string, reason: string) => {
    const users = db.getUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        const warnings = (u.warningsCount || 0) + 1;
        db.sendNotification(userId, {
          id: Date.now().toString(),
          userId,
          message: `⚠️ Official Warning: ${reason}. You now have ${warnings} warnings. Repeated violations will lead to permanent suspension.`,
          timestamp: 'Just now',
          isRead: false,
          type: 'moderation'
        });
        return { ...u, warningsCount: warnings, isSuspended: warnings >= 3 };
      }
      return u;
    });
    db.saveUsers(updated);
  },

  suspendUser: (userId: string) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, isSuspended: true } : u);
    db.saveUsers(updated);
    db.sendNotification(userId, {
      id: Date.now().toString(),
      userId,
      message: `🚫 Your account has been suspended indefinitely for severe policy violations.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'moderation'
    });
  },

  addComment: (postId: string, comment: Comment) => {
    const posts = db.getPosts();
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

  analyzeContent: (content: string) => {
    const lower = content.toLowerCase();
    let category: 'Academic' | 'Social' | 'Finance' | 'Career' | 'Urgent' = 'Social';
    if (lower.includes('deadline') || lower.includes('urgent')) category = 'Urgent';
    else if (lower.includes('job') || lower.includes('career')) category = 'Career';
    else if (lower.includes('course') || lower.includes('exam')) category = 'Academic';
    else if (lower.includes('fee') || lower.includes('money')) category = 'Finance';
    return { sentiment: 'Neutral' as const, category };
  },

  deletePost: (postId: string, deletedByUserId: string) => {
    const posts = db.getPosts();
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;
    if (deletedByUserId !== postToDelete.authorId) {
      db.sendNotification(postToDelete.authorId, {
        id: Date.now().toString(),
        userId: postToDelete.authorId,
        message: `Your post was removed by an administrator for policy violations.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'moderation'
      });
    }
    const updated = posts.filter(p => p.id !== postId);
    db.savePosts(updated);
    return updated;
  },

  flagPost: (postId: string, userId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId && !p.flags.includes(userId)) return { ...p, flags: [...p.flags, userId] };
      return p;
    });
    db.savePosts(updated);
    return updated;
  },

  incrementView: (postId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p);
    db.savePosts(updated);
    return updated;
  },

  sendNotification: (userId: string, notification: Notification) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, notifications: [notification, ...(u.notifications || [])] } : u);
    db.saveUsers(updated);
  },

  applyForOpportunity: (postId: string, userId: string) => {
    const posts = db.getPosts();
    const users = db.getUsers();
    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId);
    if (post && user) {
      if (!post.applicants?.includes(userId)) post.applicants = [...(post.applicants || []), userId];
      if (!user.appliedTo?.includes(postId)) user.appliedTo = [...(user.appliedTo || []), postId];
      db.savePosts(posts);
      db.saveUsers(users);
    }
  },

  likePost: (postId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    db.savePosts(updated);
    return updated;
  },

  getEvents: (): LiveEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : [{ id: 'e1', title: 'Makerere 100 Years Celebration', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLive: true, organizer: 'Admin' }];
  },
  saveEvents: (events: LiveEvent[]) => localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events)),
};
