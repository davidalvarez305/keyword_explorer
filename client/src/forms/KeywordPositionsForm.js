import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Form } from 'formik';
import React from 'react';
import LargeInputBox from '../components/LargeInputBox';
import { BsTable } from 'react-icons/bs';
import { flexStyles } from '../utils/flex';

export default function KeywordPositionsForm({
  isLoading,
  setToggleTable,
  keywordPositions,
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
          label={'Separate URLs by commas, spaces, tabs, or new lines.'}
          type={'text'}
          name={'pages'}
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
          {keywordPositions.length > 0 && (
            <Button
              variant="outline"
              color="green"
              leftIcon={<BsTable />}
              onClick={() => setToggleTable(true)}
            >
              See Results
            </Button>
          )}
        </Flex>
      </Box>
    </Form>
  );
}
