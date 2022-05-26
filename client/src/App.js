import React, { useState } from 'react';
import useLoginRequired from './hooks/useLoginRequired';
import KeywordPositions from './screens/KeywordPositions';
import Layout from './components/Layout';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { flexStyles } from './utils/flex';
import GenerateReport from './screens/GenerateReport';

export default function App() {
  useLoginRequired();
  const [showReport, setShowReport] = useState(false);

  function RenderOptionsButtons() {
    return (
      <Box sx={{ my: 5, ...flexStyles, maxW: '100%' }}>
        <Button
          variant={'outline'}
          colorScheme={'blue'}
          onClick={() => setShowReport(prev => !prev)}
        >
          Generate Report
        </Button>
      </Box>
    );
  }

  if (showReport) {
    return (
      <Layout>
        <GenerateReport />
        <RenderOptionsButtons />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ ...flexStyles, maxW: '100%' }}>
        <KeywordPositions />
      </Box>
      <RenderOptionsButtons />
    </Layout>
  );
}
