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
import { REGISTER_ROUTE } from '../constants';
import RegisterForm from '../forms/RegisterForm';
import { useNavigate } from 'react-router';
import LoginOrRegister from '../components/LoginOrRegister';

export default function Register() {
  const navigate = useNavigate();
  const { values, handleChange } = useFormHook({
    username: '',
    password: '',
    email: '',
  });
  const { isLoading, makeRequest } = useFetch();
  const [registerError, setRegisterError] = useState({ message: '' });
  return (
    <Flex minH={'100vh'} align={'top'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} minW={'80vh'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Create An Account</Heading>
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
                  url: REGISTER_ROUTE,
                  method: 'POST',
                  body: values,
                },
                async data => {
                  if (data.data.data.error) {
                    setRegisterError({ message: data.data.data.error });
                  }
                  if (data.data.data.user) {
                    navigate('/authorize');
                  }
                }
              );
            }}
          >
            <RegisterForm
              values={values}
              handleChange={handleChange}
              isLoading={isLoading}
              registerError={registerError}
            />
          </form>
          <LoginOrRegister text={'Have an account? Login.'} navigatePage={'login'} />
        </Box>
      </Stack>
    </Flex>
  );
}
