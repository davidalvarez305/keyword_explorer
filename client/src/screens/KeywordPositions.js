import {  Formik } from 'formik';
import React, { useState } from 'react';
import KeywordPositionsTable from '../components/KeywordPositionsTable';
import { KEYWORD_POSITIONS_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import { data } from '../utils/data';
import KeywordPositionsForm from '../forms/KeywordPositionsForm';

export default function KeywordPositions() {
  const { makeRequest, isLoading } = useFetch();
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
      <KeywordPositionsForm
        keywordPositions={keywordPositions}
        isLoading={isLoading}
        setToggleTable={setToggleTable}
      />
    </Formik>
  );
}
