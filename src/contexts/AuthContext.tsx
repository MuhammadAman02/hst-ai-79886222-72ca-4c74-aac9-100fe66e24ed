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

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider initialized');

  useEffect(() => {
    // Check for existing user session on app load
    const checkExistingSession = () => {
      console.log('Checking for existing user session');
      const savedUser = localStorage.getItem('crownLeatherUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('Found existing user session:', userData.email);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('crownLeatherUser');
        }
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log('Sign in attempt for:', email);
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in localStorage (simulating a database)
      const existingUsers = JSON.parse(localStorage.getItem('crownLeatherUsers') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === email);

      if (!existingUser) {
        throw new Error('No account found with this email address');
      }

      if (existingUser.password !== password) {
        throw new Error('Invalid password');
      }

      const userData: User = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        createdAt: existingUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem('crownLeatherUser', JSON.stringify(userData));
      console.log('User signed in successfully:', userData.email);
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

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('crownLeatherUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === email);

      if (userExists) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage (simulating database)
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('crownLeatherUsers', JSON.stringify(updatedUsers));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem('crownLeatherUser', JSON.stringify(userData));
      console.log('User signed up successfully:', userData.email);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    console.log('User signing out');
    setUser(null);
    localStorage.removeItem('crownLeatherUser');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};