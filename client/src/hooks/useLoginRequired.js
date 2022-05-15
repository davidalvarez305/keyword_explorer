import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';

export default function useLoginRequired() {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthorized } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!isAuthorized) {
      navigate('/authorize');
    }
  }, []);
}
