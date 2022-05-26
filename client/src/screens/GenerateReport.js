import { Formik } from 'formik';
import React, { useState } from 'react';
import { GENERATE_REPORT_ROUTE } from '../constants';
import GenerateReportForm from '../forms/GenerateReportForm';
import useFetch from '../hooks/useFetch';
import { Button } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

export default function GenerateReport() {
  const { makeRequest, isLoading } = useFetch();
  const [downloadFile, setDownloadFile] = useState({
    file: null,
    fileName: '',
  });

  function FileDownload({ file, fileName }) {
    function handleClick() {
      saveAs(file, fileName);
    }
    return (
      <Button
        sx={{ my: 2.5 }}
        variant={'outline'}
        color={'green.400'}
        onClick={handleClick}
      >
        Download Report
      </Button>
    );
  }

  return (
    <>
      <Formik
        initialValues={{
          page: '',
        }}
        onSubmit={async values => {
          if (values.page === '') {
            return;
          }
          makeRequest(
            {
              url: GENERATE_REPORT_ROUTE + `/?page=${values.page}`,
              responseType: 'blog',
              headers: {
                Accept: 'application/octet-stream',
              },
            },
            res => {
              if (res.data) {
                const file = new Blob([res.data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const pagePath = new URL(values.page);
                const pathname = pagePath.pathname.split('/');
                const fileName = pathname[pathname.length - 1];
                setDownloadFile({ file, fileName });
              }
            }
          );
        }}
      >
        <GenerateReportForm isLoading={isLoading} />
      </Formik>
      {downloadFile.file && <FileDownload {...downloadFile} />}
    </>
  );
}
