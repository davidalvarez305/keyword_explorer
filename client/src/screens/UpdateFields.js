import { Button, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import SimpleInputField from '../components/SimpleInputField';
import RequestErrorMessage from '../ui/RequestErrorMessage';
import useFetch from '../hooks/useFetch';
import { UPDATE_ROUTE } from '../constants';
import Layout from '../components/Layout';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function UpdateFields() {
  const { makeRequest, isLoading, error } = useFetch();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Layout>
      {user.username ? (
        <Formik
          initialValues={{
            semrush_api_key: user.semrush_api_key,
            serp_api_key: user.serp_api_key,
          }}
          onSubmit={values => {
            makeRequest(
              {
                url: `${UPDATE_ROUTE}`,
                method: 'PUT',
                body: values,
              },
              async res => {
                if (res.data.data.user) {
                  navigate('/');
                }
              }
            );
          }}
        >
          <Form>
            <Stack spacing={4} width={400}>
              <SimpleInputField
                label={'SEMRush API Key'}
                name="semrush_api_key"
                placeholder={'Enter SEMRush Api Key...'}
              />
              <SimpleInputField
                name="serp_api_key"
                label={'SERP Api Key'}
                placeholder={'Enter SERP Api Key...'}
              />
              <Stack spacing={10}>
                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  variant="outline"
                  type={'Submit'}
                >
                  Submit
                </Button>
                <RequestErrorMessage {...error} />)
              </Stack>
            </Stack>
          </Form>
        </Formik>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}
