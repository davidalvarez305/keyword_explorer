import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import useFetch from '../hooks/useFetch';
import { useState } from 'react';
import { REGISTER_ROUTE } from '../constants';
import RegisterForm from '../forms/RegisterForm';
import { useNavigate } from 'react-router';
import LoginOrRegister from '../components/LoginOrRegister';
import { Formik } from 'formik';

export default function Register() {
  const navigate = useNavigate();
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
          <Formik
            initialValues={{
              username: '',
              password: '',
              email: '',
            }}
            onSubmit={values => {
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
            <RegisterForm isLoading={isLoading} registerError={registerError} />
          </Formik>
          <LoginOrRegister
            text={'Have an account? Login.'}
            navigatePage={'login'}
          />
        </Box>
      </Stack>
    </Flex>
  );
}
