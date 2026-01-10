
import { Post, User, College, UserStatus, LiveEvent, Notification } from './types';
import { MOCK_POSTS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts_v6',
  USERS: 'maksocial_users_v6',
  LOGGED_IN_ID: 'maksocial_current_user_id',
  EVENTS: 'maksocial_events_v3',
  NOTIFS: 'maksocial_notifs_v1'
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
    notifications: []
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
    notifications: []
  }
];

const INITIAL_EVENTS: LiveEvent[] = [
  { id: 'e1', title: 'Makerere 100 Years Celebration', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLive: true, organizer: 'Admin' }
];

export const db = {
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    const posts: Post[] = saved ? JSON.parse(saved) : MOCK_POSTS.map(p => ({ ...p, views: p.views || 0, flags: p.flags || [] }));
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
    const exists = users.find(u => u.id === user.id);
    let updated;
    if (exists) {
      updated = users.map(u => u.id === user.id ? user : u);
    } else {
      updated = [...users, user];
    }
    db.saveUsers(updated);
  },

  getUser: (id?: string): User => {
    const users = db.getUsers();
    const currentId = id || localStorage.getItem(DB_KEYS.LOGGED_IN_ID) || 'u1';
    return users.find(u => u.id === currentId) || users[0];
  },

  getEvents: (): LiveEvent[] => {
    const saved = localStorage.getItem(DB_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  },
  saveEvents: (events: LiveEvent[]) => localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events)),

  analyzeContent: (content: string) => {
    const lower = content.toLowerCase();
    let category: 'Academic' | 'Social' | 'Finance' | 'Career' | 'Urgent' = 'Social';
    
    if (lower.includes('deadline') || lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately')) {
      category = 'Urgent';
    } else if (lower.includes('job') || lower.includes('intern') || lower.includes('hiring') || lower.includes('career') || lower.includes('opportunity')) {
      category = 'Career';
    } else if (lower.includes('course') || lower.includes('exam') || lower.includes('lab') || lower.includes('lecture') || lower.includes('academic')) {
      category = 'Academic';
    } else if (lower.includes('fee') || lower.includes('money') || lower.includes('payment') || lower.includes('bank')) {
      category = 'Finance';
    }

    const sentiment = lower.length > 50 ? 'Positive' : 'Neutral';
    return { sentiment, category };
  },

  deletePost: (postId: string, deletedByUserId: string) => {
    const posts = db.getPosts();
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;

    // If deleted by an admin and the admin is not the author, notify the author
    if (deletedByUserId !== postToDelete.authorId) {
      db.sendNotification(postToDelete.authorId, {
        id: Date.now().toString(),
        userId: postToDelete.authorId,
        message: `Your post "${postToDelete.content.substring(0, 30)}..." was removed by an administrator for violating community guidelines.`,
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
      if (p.id === postId) {
        const flags = p.flags || [];
        if (!flags.includes(userId)) {
          return { ...p, flags: [...flags, userId] };
        }
      }
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
    const updated = users.map(u => {
      if (u.id === userId) {
        const notifs = u.notifications || [];
        return { ...u, notifications: [notification, ...notifs] };
      }
      return u;
    });
    db.saveUsers(updated);
  },

  applyForOpportunity: (postId: string, userId: string) => {
    const posts = db.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const applicants = post.applicants || [];
    if (!applicants.includes(userId)) {
      post.applicants = [...applicants, userId];
    }

    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const applied = user.appliedTo || [];
      if (!applied.includes(postId)) {
        user.appliedTo = [...applied, postId];
      }
    }

    db.savePosts(posts);
    db.saveUsers(users);
  },

  likePost: (postId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    db.savePosts(updated);
    return updated;
  },

  addComment: (postId: string, comment: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p);
    db.savePosts(updated);
    return updated;
  }
};
