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
import { useContext, useState } from 'react';
import LoginForm from '../forms/LoginForm';
import { LOGIN_ROUTE } from '../constants';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';
import LoginOrRegister from '../components/LoginOrRegister';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { Login } = useContext(UserContext);
  const { values, handleChange } = useFormHook({ username: '', password: '' });
  const { isLoading, makeRequest } = useFetch();
  const [loginError, setLoginError] = useState({ message: '' });
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
                    Login(true);
                    navigate('/');
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
          <LoginOrRegister text={'Create Account'} navigatePage={'register'} />
        </Box>
      </Stack>
    </Flex>
  );
}
