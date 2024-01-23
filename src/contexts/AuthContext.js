import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedAuthData = localStorage.getItem('authData');
    return storedAuthData
      ? JSON.parse(storedAuthData)
      : { isAuthenticated: false, userId: null, username: null, isAdmin: false };
  });

  const setAuthStatus = (status, userId = null, username = null, isAdmin = false) => {
    const newAuthData = { isAuthenticated: status, userId, username, isAdmin };
    setAuthData(newAuthData);
    localStorage.setItem('authData', JSON.stringify(newAuthData));
  };
  
  return (
    <AuthContext.Provider value={{ ...authData, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
