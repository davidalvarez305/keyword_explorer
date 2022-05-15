import React, { createContext } from 'react';
import useAuth from '../hooks/useAuth';

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { isAuthorized, isLoggedIn, Login, Logout, setIsAuthorized } = useAuth();
  return (
    <UserContext.Provider value={{ isAuthorized, isLoggedIn, Login, Logout, setIsAuthorized }}>
      {children}
    </UserContext.Provider>
  );
}
