import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';

export default function useLoginRequired() {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthorized } = useContext(UserContext);

  console.log('isLoggedIn: ', isLoggedIn);
  console.log('isAuthorized: ', isAuthorized);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    if (isLoggedIn && !isAuthorized) {
      navigate('/authorize');
    }
    if (isLoggedIn && isAuthorized) {
      navigate('/');
    }
  }, [isLoggedIn, isAuthorized]);
}
