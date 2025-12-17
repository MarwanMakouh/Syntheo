import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole } from '@/types/user';

interface RoleContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);

  const setSelectedRole = (role: UserRole) => {
    setSelectedRoleState(role);
  };

  const clearRole = () => {
    setSelectedRoleState(null);
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
