import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { flexStyles } from '../utils/flex';

export default function NavBar() {
  const { Logout } = useContext(UserContext);
  return (
    <Box sx={{ ...flexStyles, my: 5 }}>
      <Button variant={'outline'} colorScheme={'pink'} onClick={() => Logout()}>
        Logout
      </Button>
    </Box>
  );
}
