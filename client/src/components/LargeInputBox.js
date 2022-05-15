import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Box } from '@chakra-ui/layout';
import { Textarea } from '@chakra-ui/textarea';
import { useField } from 'formik';
import React from 'react';

export default function LargeInputBox({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <Box>
      <FormControl>
        <FormLabel sx={{ display: 'flex', justifyContent: 'center' }}>
          {label}
        </FormLabel>
        <Textarea {...props} {...field} />
        {meta.error && meta.touched && (
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        )}
      </FormControl>
    </Box>
  );
}
