import { Box } from '@chakra-ui/layout';
import React from 'react';
import { useNavigate } from 'react-router';

export default function LoginOrRegister({ navigatePage, text }) {
  const navigate = useNavigate();
  return (
    <Box
      p={2}
      display={'flex'}
      justifyContent={'flex-end'}
      alignItems={'center'}
      onClick={() => navigate(`/${navigatePage}`)}
      cursor={'pointer'}
      textColor={'blue.600'}
      fontWeight={'semibold'}
    >
      {text}
    </Box>
  );
}
