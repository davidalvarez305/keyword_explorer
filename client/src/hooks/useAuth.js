import { useEffect, useState } from 'react';
import { LOGOUT_ROUTE, ME_ROUTE } from '../constants';
import useFetch from './useFetch';

export default function useAuth() {
  const { makeRequest } = useFetch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function Login(loggedIn) {
    setIsLoggedIn(loggedIn);
  }

  function Logout() {
    makeRequest(
      {
        url: `${LOGOUT_ROUTE}`,
        method: 'POST',
      },
      res => {
        if (res.data.data === 'Logged out!') {
          setIsLoggedIn(false);
        }
      }
    );
  }

  useEffect(() => {
    makeRequest(
      {
        url: `${ME_ROUTE}`,
        method: 'GET',
      },
      res => {
        if (res.data.data.user) {
          setIsLoggedIn(true);
        }
      }
    );
  }, []);

  return { isLoggedIn, Login, Logout };
}
