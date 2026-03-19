
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Article, ArticleStatus } from '../types';
import { ARTICLES } from '../constants';

interface ArticleContextType {
  articles: Article[];
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticleById: (id: number) => Article | undefined;
  addArticle: (article: Omit<Article, 'id' | 'slug' | 'createdAt'> & { slug?: string }) => void;
  updateArticle: (id: number, updatedArticle: Partial<Article>) => void;
  deleteArticle: (id: number) => void;
  approveArticle: (id: number) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  const getArticleBySlug = (slug: string) => {
    return articles.find(a => a.slug === slug);
  };

  const getArticleById = (id: number) => {
    return articles.find(a => a.id === id);
  }

  const addArticle = (articleData: Omit<Article, 'id' | 'slug' | 'createdAt'> & { slug?: string }) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now(),
      slug: articleData.slug || articleData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
      createdAt: new Date().toISOString(),
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: number, updatedData: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updatedData, slug: updatedData.slug || (updatedData.title ? updatedData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50) : a.slug) } : a));
  };
  
  const deleteArticle = (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const approveArticle = (id: number) => {
    updateArticle(id, { status: ArticleStatus.PUBLISHED });
  }

  return (
    <ArticleContext.Provider value={{ articles, getArticleBySlug, getArticleById, addArticle, updateArticle, deleteArticle, approveArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};
