import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import React from 'react';

export default function FilterInput({ ...props }) {
  return (
    <Box sx={{ maxW: 250 }}>
      <Input {...props} />
    </Box>
  );
}
