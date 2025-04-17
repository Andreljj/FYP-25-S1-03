// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: UserData | null;
}

// User data type
interface UserData {
  username: string;
  displayName: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  user: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    // In a real app, you would check local storage, async storage, or cookies
    // For demo, we'll just leave this empty
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials with your API
    // For now, we'll just accept demo_user/password
    if (username === 'test' && password === 'test') {
      setIsAuthenticated(true);
      setUser({
        username: username,
        displayName: 'Demo User',
      });
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};