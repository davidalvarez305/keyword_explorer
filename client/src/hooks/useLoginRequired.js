import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';

export default function useLoginRequired() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);
}
