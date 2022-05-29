import { useEffect, useState } from 'react';
import { LOGOUT_ROUTE, ME_ROUTE } from '../constants';
import useFetch from './useFetch';

export default function useAuth() {
  const { makeRequest } = useFetch();
  let userProps = {
    id: null,
    username: '',
    password: '',
    email: '',
    refresh_token: null,
    semrush_api_key: null,
    serp_api_key: null,
  };
  const [user, setUser] = useState(userProps);

  function Login(user) {
    setUser(user);
  }

  function Logout() {
    makeRequest(
      {
        url: `${LOGOUT_ROUTE}`,
        method: 'POST',
      },
      res => {
        if (res.data.data === 'Logged out!') {
          setUser(userProps);
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
          setUser(res.data.data.user);
        }
      }
    );
  }, []);

  return { Login, Logout, user };
}
