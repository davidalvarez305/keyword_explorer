import { Box, FormControl, FormLabel, Stack, Button } from '@chakra-ui/react';
import SimpleInputField from '../components/SimpleInputField';

export default function LoginForm({
  values,
  handleChange,
  isLoading,
  loginError,
}) {
  return (
    <Stack spacing={4}>
      <FormControl id="email">
        <FormLabel>Username</FormLabel>
        <SimpleInputField
          value={values.Username}
          handleChange={handleChange}
          name="username"
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <SimpleInputField
          value={values.Password}
          handleChange={handleChange}
          name="password"
          type="password"
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
              Sign in
            </Button>
            {loginError.message.length > 0 && (
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
                  {loginError.message}
                </p>
              </Box>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
