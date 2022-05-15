import React, { useEffect } from 'react';
import { REQUEST_TOKEN_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import CenterLoadingText from '../ui/CenterLoadingText';

export default function Authorize() {
  const { makeRequest, error } = useFetch();
  useEffect(() => {
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
  }, []);

  return <CenterLoadingText text={'Authorizing...'} errorMessage={error.message} />
}
