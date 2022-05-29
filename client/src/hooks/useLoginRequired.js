import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';

export default function useLoginRequired() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
    if (user.id && !user.refresh_token) {
      navigate('/authorize');
    }
    if (user.id && user.refresh_token) {
      navigate('/');
    }
  }, [user]);
}
