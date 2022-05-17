import { Box } from '@chakra-ui/layout';
import React from 'react';

export default function RequestErrorMessage({ message }) {
  return (
    <React.Fragment>
      {message.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'Georgia',
              color: 'red',
              fontSize: 18,
            }}
          >
            {message}
          </p>
        </Box>
      )}
    </React.Fragment>
  );
}
