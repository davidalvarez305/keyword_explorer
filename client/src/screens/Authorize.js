import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { REQUEST_TOKEN_ROUTE } from '../constants';
import { UserContext } from '../context/UserContext';
import useFetch from '../hooks/useFetch';
import CenterLoadingText from '../ui/CenterLoadingText';

export default function Authorize() {
  const { makeRequest, error } = useFetch();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.id && !user.refresh_token) {
      makeRequest(
        {
          url: `${REQUEST_TOKEN_ROUTE}`,
          method: 'POST',
          body: {
            scope: `https://www.googleapis.com/auth/webmasters`,
          },
        },
        res => {
          if (res.data.data) {
            window.location.href = res.data.data;
          }
        }
      );
    } else {
      navigate('/');
    }
  }, []);

  return (
    <CenterLoadingText text={'Authorizing...'} errorMessage={error.message} />
  );
}
