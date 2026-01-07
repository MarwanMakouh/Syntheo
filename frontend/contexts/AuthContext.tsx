import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

type User = any;

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all users
        const usersResp = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
        if (usersResp.ok) {
          const usersJson = await usersResp.json();
          const list = usersJson.data || [];
          setAllUsers(list);

          // Don't set a default user - let role selection handle it
        } else {
          setAllUsers([]);
        }
      } catch (e) {
        console.error('Failed to load users for AuthContext:', e);
        setAllUsers([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, setCurrentUser, allUsers }}>
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
