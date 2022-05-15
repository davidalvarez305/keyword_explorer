import { Box, Stack, Button } from '@chakra-ui/react';
import { Form } from 'formik';
import SimpleInputField from '../components/SimpleInputField';

export default function RegisterForm({ isLoading, registerError }) {
  return (
    <Form>
      <Stack spacing={4}>
        <SimpleInputField
          label={'Username'}
          name="username"
          placeholder={'Enter username...'}
        />
        <SimpleInputField
          name="password"
          type="password"
          label={'Password'}
          placeholder={'Enter password...'}
        />
        <SimpleInputField
          name="email"
          type="email"
          label={'Email'}
          placeholder={'Enter email...'}
        />
        <Stack spacing={10}>
          <Button
            isLoading={isLoading}
            loadingText="Submitting"
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            variant="outline"
            type={'Submit'}
          >
            Register
          </Button>
          {registerError.message.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'Georgia',
                  color: 'red',
                  fontSize: 18,
                }}
              >
                {registerError.message}
              </p>
            </Box>
          )}
          )
        </Stack>
      </Stack>
    </Form>
  );
}
