export interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: {
    id: string;
    path: string;
  };
  role?: {
    id: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

export interface PostImage {
  id: string;
  path: string;
}

export interface Post {
  id: string;
  name: string;
  content: string;
  user: User;
  comments: Comment[];
  images: PostImage[];
  createdAt: string;
}

export interface FileUpload {
  uri: string;
  name: string;
  type: string;
}

export interface SocialStats {
  postsCount: number;
  commentsCount: number;
  friendsCount: number;
}

export type PostTabType = 'all' | 'friends' | 'mine';

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}