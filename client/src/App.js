import React from 'react';
import useLoginRequired from './hooks/useLoginRequired';
import KeywordPositions from './screens/KeywordPositions';
import Layout from './components/Layout';
import { Box } from '@chakra-ui/layout';
import { flexStyles } from './utils/flex';

export default function App() {
  useLoginRequired();

  return (
    <Layout>
      <Box sx={{ ...flexStyles, maxW: '100%' }}>
        <KeywordPositions />
      </Box>
    </Layout>
  );
}
