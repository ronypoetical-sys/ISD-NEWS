import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
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

// Generate URL-friendly slug from title
const generateSlug = (title: string, existingSlugs: string[] = []): string => {
  const base = title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);

  // Ensure unique slug
  let slug = base;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  // Build slug lookup map for faster searches
  const slugMap = useMemo(() => {
    const map = new Map<string, Article>();
    articles.forEach(a => map.set(a.slug, a));
    return map;
  }, [articles]);

  const idMap = useMemo(() => {
    const map = new Map<number, Article>();
    articles.forEach(a => map.set(a.id, a));
    return map;
  }, [articles]);

  const getArticleBySlug = useCallback(
    (slug: string) => slugMap.get(slug),
    [slugMap]
  );

  const getArticleById = useCallback(
    (id: number) => idMap.get(id),
    [idMap]
  );

  const addArticle = useCallback((
    articleData: Omit<Article, 'id' | 'slug' | 'createdAt'> & { slug?: string }
  ) => {
    setArticles(prev => {
      const existingSlugs = prev.map(a => a.slug);
      const newArticle: Article = {
        ...articleData,
        id: Date.now(),
        slug: articleData.slug || generateSlug(articleData.title, existingSlugs),
        createdAt: new Date().toISOString(),
      };
      return [newArticle, ...prev];
    });
  }, []);

  const updateArticle = useCallback((id: number, updatedData: Partial<Article>) => {
    setArticles(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        const newSlug = updatedData.slug
          ? updatedData.slug
          : updatedData.title && updatedData.title !== a.title
            ? generateSlug(updatedData.title, prev.filter(x => x.id !== id).map(x => x.slug))
            : a.slug;
        return { ...a, ...updatedData, slug: newSlug };
      })
    );
  }, []);

  const deleteArticle = useCallback((id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);

  const approveArticle = useCallback((id: number) => {
    updateArticle(id, { status: ArticleStatus.PUBLISHED });
  }, [updateArticle]);

  const value = useMemo(() => ({
    articles,
    getArticleBySlug,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    approveArticle,
  }), [articles, getArticleBySlug, getArticleById, addArticle, updateArticle, deleteArticle, approveArticle]);

  return (
    <ArticleContext.Provider value={value}>
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
