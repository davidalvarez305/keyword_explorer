import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React, { useEffect } from 'react';
import { REQUEST_TOKEN_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';

export default function Authorize() {
  const { makeRequest } = useFetch();
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

  return (
    <Box
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: 40,
        fontFamily: 'Georgia',
      }}
    >
      Authorizing...
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
}
