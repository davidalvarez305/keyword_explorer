import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GET_ACCESS_TOKEN_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import { useNavigate } from 'react-router';
import CenterLoadingText from '../ui/CenterLoadingText';
import { UserContext } from '../context/UserContext';

export default function OAuth2() {
  const [code, setCode] = useState('');
  const [text, setText] = useState('Loading...');
  const { Login } = useContext(UserContext);
  const { makeRequest, error } = useFetch();
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
          Login(res.data.data);
          setText('Redirecting...');
          navigate('/');
        }
      );
    }
  }, [code]);
  return <CenterLoadingText text={text} errorMessage={error.message} />;
}
