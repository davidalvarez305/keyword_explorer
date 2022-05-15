import { useEffect } from 'react';
import { ME_ROUTE } from '../constants';
import useFetch from './useFetch';

const useAuth = () => {
  const { makeRequest } = useFetch();
  useEffect(() => {
    makeRequest(
      {
        url: ME_ROUTE,
        method: 'GET',
      },
      async res => {
        console.log('res data: ', res.data);
        const data = await res.json();
        console.log('data: ', data);
        if (!data) {
          return;
        }
        return;
      }
    );
  });
};

export default useAuth;
