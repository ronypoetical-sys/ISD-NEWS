
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ArticleStatus {
  PUBLISHED = 'published',
  PENDING = 'pending',
  REJECTED = 'rejected',
  DRAFT = 'draft',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  imageCaption?: string;      // Caption / keterangan foto
  metaDescription?: string;  // Meta deskripsi untuk SEO
  authorId: number;
  authorName: string;
  categoryId: string;
  tags?: string[];
  createdAt: string;
  status: ArticleStatus;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
}

// Mode penulisan konten artikel
export type ContentMode = 'text' | 'html';
