import { Input } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import React from 'react';

const SimpleInputField = ({
  value,
  name,
  handleChange,
  type,
  onPressEnter,
  placeholderValue,
}) => {
  return (
    <Box>
      <Input
        type={type ? type : `text`}
        size="md"
        onChange={handleChange}
        value={value}
        name={name}
        placeholder={placeholderValue ? placeholderValue : 'Input...'}
        onKeyDown={e => (onPressEnter ? onPressEnter(e) : undefined)}
      />
    </Box>
  );
};

export default SimpleInputField;
