import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRole } from '@/types/user';

interface RoleContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = '@syntheo_selected_role';

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load role from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedRole = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRole) {
          setSelectedRoleState(storedRole as UserRole);
        }
      } catch (e) {
        console.error('Failed to load role from storage:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setSelectedRole = async (role: UserRole) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, role);
      setSelectedRoleState(role);
    } catch (e) {
      console.error('Failed to save role to storage:', e);
      setSelectedRoleState(role);
    }
  };

  const clearRole = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSelectedRoleState(null);
    } catch (e) {
      console.error('Failed to clear role from storage:', e);
      setSelectedRoleState(null);
    }
  };

  return (
    <RoleContext.Provider value={{ selectedRole, setSelectedRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
