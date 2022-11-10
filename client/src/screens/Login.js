import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import useFetch from '../hooks/useFetch';
import { useContext, useState } from 'react';
import LoginForm from '../forms/LoginForm';
import { LOGIN_ROUTE } from '../constants';
import { UserContext } from '../context/UserContext';
import LoginOrRegister from '../components/LoginOrRegister';
import { Formik } from 'formik';
import useLoginRequired from '../hooks/useLoginRequired';

export default function LoginScreen() {
  const { Login } = useContext(UserContext);
  const { isLoading, makeRequest } = useFetch();
  const [loginError, setLoginError] = useState({ message: '' });
  useLoginRequired();

  return (
    <Flex minH={'100vh'} align={'top'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} minW={'80vh'} py={12} px={6}>
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
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={values => {
              if (values.username === '' || values.password === '') {
                return;
              }
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
                    Login(data.data.data.user);
                  }
                }
              );
            }}
          >
            <LoginForm isLoading={isLoading} loginError={loginError} />
          </Formik>
          <LoginOrRegister text={'Create Account'} navigatePage={'register'} />
        </Box>
      </Stack>
    </Flex>
  );
}
