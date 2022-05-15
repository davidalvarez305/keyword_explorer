import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { useField } from 'formik';
import React from 'react';

export default function SimpleInputField({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <Input {...props} {...field} />
        {meta.error && meta.touched && (
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        )}
      </FormControl>
    </Box>
  );
}
