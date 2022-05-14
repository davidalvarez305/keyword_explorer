import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OAuth2() {
  const [code, setCode] = useState('');
  let [searchParams] = useSearchParams();
  useEffect(() => {
    searchParams.forEach((val, key) => {
      if (key === 'code') {
        setCode(val);
      }
    });
    if (code.length > 0) {
      /* fetch(process.env.REACT_APP_AUTH_API + "token", {
        method: "POST",
        body: JSON.stringify({
          code: code,
          scope: 'https://www.googleapis.com/auth/webmasters',
        }),
        headers: { "Content-Type": "application/json" },
      }); */
    }
  }, [code]);
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p style={{ fontSize: 32, fontFamily: 'Georgia' }}>{'...Loading'}</p>
    </div>
  );
}
