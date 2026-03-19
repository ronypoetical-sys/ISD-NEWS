import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  addContributor: (name: string, email: string, password?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe JSON parse utility
const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

// Sanitize string input
const sanitizeString = (value: string): string =>
  value.trim().replace(/[<>"'&]/g, '');

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    const parsed = safeJsonParse<User | null>(stored, null);
    // Validate stored user still exists in users list
    if (!parsed) return null;
    const allUsers = safeJsonParse<User[]>(localStorage.getItem('app_users'), USERS);
    const found = allUsers.find(u => u.id === parsed.id && u.email === parsed.email);
    return found || null;
  });

  const [users, setUsers] = useState<User[]>(() =>
    safeJsonParse<User[]>(localStorage.getItem('app_users'), USERS)
  );

  const login = useCallback((email: string, password?: string): boolean => {
    const sanitizedEmail = sanitizeString(email);
    if (!sanitizedEmail || !password) return false;

    const foundUser = users.find(
      u => u.email === sanitizedEmail && u.password === password
    );

    if (foundUser) {
      // Store user without password for security
      const { password: _pwd, ...safeUser } = foundUser;
      // We need full user for role checks, but don't store password unnecessarily
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(safeUser));
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  const addContributor = useCallback((
    name: string,
    email: string,
    password?: string
  ): boolean => {
    if (user?.role !== UserRole.ADMIN) return false;

    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);

    if (!sanitizedName || !sanitizedEmail || !password) return false;
    if (password.length < 6) return false;

    // Check email uniqueness (case-insensitive)
    const emailExists = users.some(
      u => u.email.toLowerCase() === sanitizedEmail.toLowerCase()
    );
    if (emailExists) return false;

    const newUser: User = {
      id: Date.now(),
      name: sanitizedName,
      email: sanitizedEmail,
      password,
      role: UserRole.USER,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    return true;
  }, [user, users]);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addContributor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
