import { Formik } from 'formik';
import React, { useState } from 'react';
import KeywordPositionsTable from '../components/KeywordPositionsTable';
import { KEYWORD_POSITIONS_ROUTE } from '../constants';
import useFetch from '../hooks/useFetch';
import KeywordPositionsForm from '../forms/KeywordPositionsForm';
import RequestErrorMessage from '../ui/RequestErrorMessage';

export default function KeywordPositions() {
  const { makeRequest, isLoading, error } = useFetch();
  const [toggleTable, setToggleTable] = useState(false);
  const [keywordPositions, setKeywordPositions] = useState([]);

  const pageRegex = /https:\/\/[a-z0-9.]+[.a-z]{5}\/[a-z0-9-\/]+/gm;
  const separatorRegex = /[\r\n\t, ]+/gm;

  if (toggleTable) {
    return (
      <KeywordPositionsTable
        keywordPositions={keywordPositions}
        setToggleTable={setToggleTable}
      />
    );
  }

  function validatePages(pages) {
    let validationArray = [];
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].match(pageRegex)) {
        validationArray = [...validationArray, pages[i]];
      }
    }
    return validationArray.length === 0;
  }

  return (
    <Formik
      initialValues={{
        pages: '',
      }}
      validate={values => {
        let errors = {};
        if (!validatePages(values.pages.split(separatorRegex))) {
          errors.token = 'Non-valid URL in form.';
        }
        return errors;
      }}
      onSubmit={async values => {
        if (values.pages === '') {
          return;
        }
        makeRequest(
          {
            url: KEYWORD_POSITIONS_ROUTE,
            method: 'POST',
            body: {
              pages: values.pages.split(separatorRegex),
            },
          },
          res => {
            if (res.data.data && res.data.data.length > 0) {
              setKeywordPositions(res.data.data);
            }
          }
        );
      }}
    >
      <>
        <KeywordPositionsForm
          keywordPositions={keywordPositions}
          isLoading={isLoading}
          setToggleTable={setToggleTable}
        />
        <RequestErrorMessage {...error} />
      </>
    </Formik>
  );
}
