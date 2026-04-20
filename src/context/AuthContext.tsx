import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

export interface ConnectionError {
  status?: number;
  message: string;
}

interface LocalUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: LocalUser | null;
  session: null;
  isHydrating: boolean;
  loading: boolean;
  profile: Record<string, any> | null;
  loadingProfile: boolean;
  login: (input?: { email?: string }) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  connectionError: ConnectionError | null;
  resetConnectionError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [connectionError, setConnectionError] = useState<ConnectionError | null>(null);

  const login = (input?: { email?: string }) => {
    const email = input?.email?.trim();
    setUser({ id: 'local-user', email: email || undefined });
    setProfile({
      id: 'local-user',
      full_name: 'Local User',
      email: email || '',
    });
    setConnectionError(null);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    setConnectionError(null);
  };

  const refreshAuth = async () => {};
  const refreshProfile = async () => {};
  const resetConnectionError = () => setConnectionError(null);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      session: null,
      isHydrating: false,
      loading: false,
      refreshAuth,
      isAuthenticated,
      setIsAuthenticated,
      profile,
      loadingProfile: false,
      refreshProfile,
      connectionError,
      resetConnectionError,
    }),
    [connectionError, isAuthenticated, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
