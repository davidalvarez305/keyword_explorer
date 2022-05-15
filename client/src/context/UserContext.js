import React, { createContext } from 'react';
import useAuth from '../hooks/useAuth';

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { isLoggedIn, Login, Logout } = useAuth();
  return (
    <UserContext.Provider value={{ isLoggedIn, Login, Logout }}>
      {children}
    </UserContext.Provider>
  );
}