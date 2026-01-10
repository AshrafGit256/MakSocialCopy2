
import { Post, User, ChatSession } from './types';
import { MOCK_POSTS, MOCK_CHATS } from './constants';

const DB_KEYS = {
  POSTS: 'maksocial_posts',
  USER: 'maksocial_user',
  CHATS: 'maksocial_chats'
};

const DEFAULT_USER: User = {
  id: 'me',
  name: 'Alex Chen',
  role: 'Computer Science Student',
  avatar: 'https://i.pravatar.cc/200?u=alex',
  bio: 'Passionate about coding, coffee, and community building. Always down for a hackathon or a chat at the library. ☕️🚀',
  connections: 245
};

export const db = {
  getPosts: (): Post[] => {
    const saved = localStorage.getItem(DB_KEYS.POSTS);
    if (!saved) {
      localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(MOCK_POSTS));
      return MOCK_POSTS;
    }
    return JSON.parse(saved);
  },
  savePosts: (posts: Post[]) => {
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts));
  },
  getUser: (): User => {
    const saved = localStorage.getItem(DB_KEYS.USER);
    if (!saved) {
      localStorage.setItem(DB_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(saved);
  },
  saveUser: (user: User) => {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  },
  likePost: (postId: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    db.savePosts(updated);
    return updated;
  },
  addComment: (postId: string, comment: string) => {
    const posts = db.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments + 1 };
      }
      return p;
    });
    db.savePosts(updated);
    return updated;
  }
};
