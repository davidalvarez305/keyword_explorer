import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';

export default function CenterLoadingText({ text, errorMessage }) {
  return (
    <>
      {errorMessage.length === 0 ? (
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
      ) : (
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
          {errorMessage}
        </Box>
      )}
    </>
  );
}
