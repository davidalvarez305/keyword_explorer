import React from 'react';
import { Box } from '@chakra-ui/react';
import useLoginRequired from './hooks/useLoginRequired';

function App() {
  useLoginRequired();
  function getToken() {
    fetch(process.env.REACT_APP_AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scope: `https://www.googleapis.com/auth/webmasters`,
      }),
    })
      .then(async res => {
        const data = await res.json();
        if (data.data) {
          window.location.href = data.data;
        }
      })
      .catch(console.error);
  }

  function testRequest() {
    console.log(process.env.REACT_APP_KEYWORDS_API);
    fetch(process.env.REACT_APP_KEYWORDS_API, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async res => {
        const d = await res.json();
        console.log(d);
      })
      .catch(console.error);
  }

  return <Box>Hey there</Box>;
}

export default App;
