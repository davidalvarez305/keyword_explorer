import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import useFormHook from '../hooks/useFormHook';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import { LOGIN_ROUTE } from '../constants';

export default function Login() {
  const { values, handleChange } = useFormHook({ username: '', password: '' });
  const { isLoading, makeRequest } = useFetch();
  const [loginError, setLoginError] = useState({ message: '' });
  return (
    <Flex minH={'100vh'} align={'top'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            To the moon 🚀😎💻
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              makeRequest(
                {
                  url: LOGIN_ROUTE,
                  method: 'POST',
                  body: values,
                },
                async data => {
                  if (data.data.data.error) {
                    setLoginError({ message: data.data.data.error });
                  }
                  if (data.data.data.user) {
                    console.log(data.data.data);
                  }
                }
              );
            }}
          >
            <LoginForm
              values={values}
              handleChange={handleChange}
              isLoading={isLoading}
              loginError={loginError}
            />
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
