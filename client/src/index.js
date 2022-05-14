import { ChakraProvider } from '@chakra-ui/provider';
import theme from '@chakra-ui/theme';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OAuth2 from './pages/oauth2';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/oauth2" element={<OAuth2 />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
