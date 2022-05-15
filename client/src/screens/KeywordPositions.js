import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import KeywordPositionsTable from '../components/KeywordPositionsTable';
import LargeInputBox from '../components/LargeInputBox';
import { KEYWORD_POSITIONS_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import { BsTable } from 'react-icons/bs';
import { flexStyles } from '../utils/flex';
import createMatrix from '../utils/createMatrix';
import { data } from '../utils/data';

export default function KeywordPositions() {
  const { makeRequest } = useFetch();
  const [toggleTable, setToggleTable] = useState(false);
  const [keywordPositions, setKeywordPositions] = useState(data);

  if (toggleTable) {
    return (
      <KeywordPositionsTable
        keywordPositions={keywordPositions}
        setToggleTable={setToggleTable}
        setKeywordPositions={setKeywordPositions}
      />
    );
  }

  return (
    <Formik
      initialValues={{
        pages: '',
      }}
      onSubmit={async values => {
        makeRequest(
          {
            url: KEYWORD_POSITIONS_ROUTE,
            method: 'POST',
            body: values,
          },
          res => {
            setKeywordPositions(res.data.data);
          }
        );
      }}
    >
      {({ isSubmitting }) => (
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
              label={'Get keyword positions.'}
              type={'text'}
              name={'pages'}
            />
            <Flex flexDirection={'row'} gap={4}>
              <Button
                variant={'outline'}
                type={'submit'}
                isLoading={isSubmitting}
                colorScheme={'cyan'}
              >
                Submit
              </Button>
              {data.length > 0 && (
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
      )}
    </Formik>
  );
}
