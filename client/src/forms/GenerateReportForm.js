import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Form } from 'formik';
import React from 'react';
import LargeInputBox from '../components/LargeInputBox';
import { flexStyles } from '../utils/flex';

export default function GenerateReportForm({
  isLoading,
}) {
  return (
    <Form>
      <Box
        sx={{
          ...flexStyles,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <LargeInputBox
          minH={'50vh'}
          minW={'33vw'}
          label={'Enter URL.'}
          type={'text'}
          name={'page'}
        />
        <Flex flexDirection={'row'} gap={4}>
          <Button
            variant={'outline'}
            type={'submit'}
            isLoading={isLoading}
            colorScheme={'cyan'}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </Form>
  );
}
