import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider initialized');

  useEffect(() => {
    // Check for existing user session on app load
    const storedUser = localStorage.getItem('crownLeatherUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('User session restored:', userData.email);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('crownLeatherUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log('Sign in attempt for:', email);
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users from localStorage
      const storedUsers = localStorage.getItem('crownLeatherUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user with matching email and password
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user session (exclude password from user object)
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('crownLeatherUser', JSON.stringify(userWithoutPassword));

      console.log('Sign in successful for:', email);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    console.log('Sign up attempt for:', email);
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users from localStorage
      const storedUsers = localStorage.getItem('crownLeatherUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In real app, this would be hashed
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('crownLeatherUsers', JSON.stringify(users));

      // Create user session (exclude password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('crownLeatherUser', JSON.stringify(userWithoutPassword));

      console.log('Sign up successful for:', email);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    console.log('User signed out');
    setUser(null);
    localStorage.removeItem('crownLeatherUser');
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};