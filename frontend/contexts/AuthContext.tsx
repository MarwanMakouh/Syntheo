import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

type User = any;

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@syntheo_current_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    (async () => {
      try {
        // Load stored user
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setCurrentUserState(JSON.parse(storedUser));
        }

        // Fetch all users
        const usersResp = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
        if (usersResp.ok) {
          const usersJson = await usersResp.json();
          const list = usersJson.data || [];
          setAllUsers(list);
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

  // Wrapper to persist user to storage
  const setCurrentUser = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setCurrentUserState(user);
    } catch (e) {
      console.error('Failed to save user to storage:', e);
      setCurrentUserState(user);
    }
  };

  // Logout function to clear storage
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCurrentUserState(null);
    } catch (e) {
      console.error('Failed to clear user from storage:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, setCurrentUser, allUsers, logout }}>
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
