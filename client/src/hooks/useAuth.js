import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ME_ROUTE } from '../constants';
import useFetch from './useFetch';

const useAuth = () => {
  const navigate = useNavigate();
  const { makeRequest } = useFetch();
  useEffect(() => {
    makeRequest(
      {
        url: ME_ROUTE,
        method: 'GET',
      },
      async res => {
        if (res.data.data.error) {
          navigate('/login');
        }
        return;
      }
    );
  }, []);
};

export default useAuth;
