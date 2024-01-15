import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    return storedAuthStatus ? JSON.parse(storedAuthStatus) : false;
  });
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', JSON.stringify(status));
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
