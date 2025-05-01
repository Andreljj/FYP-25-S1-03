import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: UserData | null;
}

interface UserData {
  username: string;
  displayName: string;
  role: 'user' | 'sysadmin'; // added role type
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
 
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo logic
    if (username === 'sysadmin' && password === 'admin123') {
      setIsAuthenticated(true);
      setUser({
        username: 'sysadmin',
        displayName: 'System Administrator',
        role: 'sysadmin',
      });
      return true;
    } else if (username === 'test' && password === 'test') {
      setIsAuthenticated(true);
      setUser({
        username: 'test',
        displayName: 'Demo User',
        role: 'user',
      });
      return true;
    }
    return false;
  };

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
