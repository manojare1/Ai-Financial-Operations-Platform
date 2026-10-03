import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, NotificationItem } from '../types';
import { DEMO_USERS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  signup: (name: string, email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with default customer Sarah Chen
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS.customer);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const role: UserRole = currentUser ? currentUser.role : 'customer';
  const isAuthenticated = currentUser !== null;

  const login = (email: string, targetRole: UserRole = 'customer'): boolean => {
    // If matching one of demo emails or any entered email
    const foundDemo = Object.values(DEMO_USERS).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (foundDemo) {
      setCurrentUser(foundDemo);
    } else {
      // Dynamic user
      setCurrentUser({
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: targetRole,
        phone: '+1 (555) 789-0123',
        accountNumber: '•••• 1024',
        tier: targetRole === 'customer' ? 'Corporate Standard' : undefined,
        department: targetRole !== 'customer' ? 'Operations' : undefined,
        kycStatus: 'verified',
        lastLogin: 'Just now'
      });
    }
    return true;
  };

  const signup = (name: string, email: string, targetRole: UserRole = 'customer') => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: targetRole,
      phone: '+1 (555) 555-0199',
      accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
      tier: targetRole === 'customer' ? 'Corporate Platinum' : undefined,
      department: targetRole !== 'customer' ? 'Operations' : undefined,
      kycStatus: 'verified',
      lastLogin: 'Just now'
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (DEMO_USERS[newRole]) {
      setCurrentUser(DEMO_USERS[newRole]);
    } else if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: newRole
      });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        signup,
        logout,
        switchRole,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
