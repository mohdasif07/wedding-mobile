import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { User, UserRole } from '../types';
import { Permission, can as checkPermission } from '../utils/permissions';
import { secureStorage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFamily: boolean;
  role: UserRole | null;
  can: (permission: Permission) => boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const token = await secureStorage.getAccessToken();
      if (!token) return;
      const { data } = await authApi.profile();
      setUser(data);
    } catch {
      await secureStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email: string, password: string, remember = false) => {
    const { data } = await authApi.login(email, password);
    await secureStorage.setTokens(data.tokens.access_token, data.tokens.refresh_token);
    await secureStorage.setRememberMe(remember);
    setUser(data.user);
  };

  const register = async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => {
    const { data } = await authApi.register(payload);
    await secureStorage.setTokens(data.tokens.access_token, data.tokens.refresh_token);
    setUser(data.user);
  };

  const logout = useCallback(async () => {
    const refresh = await secureStorage.getRefreshToken();

    // Update UI immediately so user leaves the main app without waiting on the network
    setUser(null);

    try {
      await authApi.logout(refresh ?? undefined);
    } catch {
      // Local session is still cleared below
    } finally {
      await secureStorage.clearTokens();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isFamily: user?.role === 'family_member',
      role: user?.role ?? null,
      can: (permission: Permission) => checkPermission(user?.role, permission),
      login,
      register,
      logout,
    }),
    [user, isLoading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
