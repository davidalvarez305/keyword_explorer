import React, { createContext } from 'react';
import useAuth from '../hooks/useAuth';

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const { Login, Logout, user } = useAuth();
  return (
    <UserContext.Provider value={{ Login, Logout, user }}>
      {children}
    </UserContext.Provider>
  );
}
