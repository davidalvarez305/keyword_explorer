import { Box, FormControl, FormLabel, Stack, Button } from '@chakra-ui/react';
import SimpleInputField from '../components/SimpleInputField';

export default function RegisterForm({
  values,
  handleChange,
  isLoading,
  registerError,
}) {
  return (
    <Stack spacing={4}>
      <FormControl id="username">
        <FormLabel>Username</FormLabel>
        <SimpleInputField
          value={values.Username}
          handleChange={handleChange}
          name="username"
          placeholderValue={'Enter username...'}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <SimpleInputField
          value={values.Password}
          handleChange={handleChange}
          name="password"
          type="password"
          placeholderValue={'Enter password...'}
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <SimpleInputField
          value={values.Email}
          handleChange={handleChange}
          name="email"
          type="email"
          placeholderValue={'Enter email...'}
        />
      </FormControl>
      <Stack spacing={10}>
        {isLoading ? (
          <Button
            isLoading={isLoading}
            loadingText="Submitting"
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            variant="outline"
          ></Button>
        ) : (
          <>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              type="submit"
              value="Submit"
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
          </>
        )}
      </Stack>
    </Stack>
  );
}
