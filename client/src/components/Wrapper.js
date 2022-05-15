import { Box } from '@chakra-ui/layout';
import React from 'react';
import { flexStyles } from '../utils/flex';

export default function Wrapper({ children }) {
  return <Box sx={{ ...flexStyles }}>{children}</Box>;
}
