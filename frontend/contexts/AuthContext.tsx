import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

type User = any;

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Try to fetch a /users/me endpoint first (common pattern)
        let resp = null;
        try {
          resp = await fetch(`${API_BASE_URL}/users/me`);
        } catch (e) {
          resp = null;
        }

        if (resp && resp.ok) {
          const json = await resp.json();
          setCurrentUser(json.data || null);
        } else {
          // Fallback: fetch users and pick the first one
          const usersResp = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
          if (usersResp.ok) {
            const usersJson = await usersResp.json();
            const list = usersJson.data || [];
            setCurrentUser(list.length > 0 ? list[0] : null);
          } else {
            setCurrentUser(null);
          }
        }
      } catch (e) {
        console.error('Failed to load current user for AuthContext:', e);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
