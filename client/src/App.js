import React from 'react';
import useLoginRequired from './hooks/useLoginRequired';
import KeywordPositions from './screens/KeywordPositions';

export default function App() {
  useLoginRequired();

  return <KeywordPositions />;
}
