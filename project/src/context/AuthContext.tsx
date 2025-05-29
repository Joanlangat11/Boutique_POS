import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@boutique.com', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'Cashier User', email: 'cashier@boutique.com', password: 'cashier123', role: 'cashier' as const },
  { id: '3', name: 'Manager User', email: 'manager@boutique.com', password: 'manager123', role: 'manager' as const }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('boutiqueUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect to login if no user is found
    if (!isLoading && !user && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const matchedUser = MOCK_USERS.find(u => 
        u.email === email && u.password === password
      );

      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('boutiqueUser', JSON.stringify(userWithoutPassword));
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('boutiqueUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};