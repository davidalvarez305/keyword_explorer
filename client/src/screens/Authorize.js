import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { REQUEST_TOKEN_ROUTE } from '../constants';
import { UserContext } from '../context/UserContext';
import useFetch from '../hooks/useFetch';
import useLoginRequired from '../hooks/useLoginRequired';
import CenterLoadingText from '../ui/CenterLoadingText';

export default function Authorize() {
  const { makeRequest, error } = useFetch();
  const navigate = useNavigate();
  const { isLoggedIn, isAuthorized } = useContext(UserContext);
  useEffect(() => {
    if (isLoggedIn && !isAuthorized) {
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
      navigate('/login');
    }
  }, [isLoggedIn, isAuthorized]);

  return (
    <CenterLoadingText text={'Authorizing...'} errorMessage={error.message} />
  );
}
