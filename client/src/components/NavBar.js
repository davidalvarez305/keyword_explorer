import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { flexStyles } from '../utils/flex';

export default function NavBar() {
  const { Logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ ...flexStyles, my: 5, gap: 2, flexDirection: 'horizontal' }}>
      {location.pathname !== '/' && (
        <Button
          variant={'outline'}
          colorScheme={'grey'}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
      )}
      <Button variant={'outline'} colorScheme={'pink'} onClick={() => Logout()}>
        Logout
      </Button>
      <Button
        variant={'outline'}
        colorScheme={'black'}
        onClick={() => navigate('/update')}
      >
        Update
      </Button>
    </Box>
  );
}
