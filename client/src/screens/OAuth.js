import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GET_ACCESS_TOKEN_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router';

export default function OAuth2() {
  const [code, setCode] = useState('');
  const [text, setText] = useState('Loading...');
  const { makeRequest } = useFetch();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  useEffect(() => {
    searchParams.forEach((val, key) => {
      if (key === 'code') {
        setCode(val);
      }
    });
    if (code.length > 0) {
      makeRequest(
        {
          url: GET_ACCESS_TOKEN_ROUTE,
          method: 'POST',
          body: {
            code: code,
            scope: 'https://www.googleapis.com/auth/webmasters',
          },
        },
        res => {
          if (res.data.data) {
            setText('Redirecting...');
            navigate('/');
          }
        }
      );
    }
  }, [code]);
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
      {text}
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
