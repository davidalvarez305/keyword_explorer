import { useState } from 'react';
import axios from 'axios';

function useFetchHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ message: '' });

  const makeRequest = async (config, callback) => {
    setIsLoading(true);
    setError({ message: '' });

    await axios({
      url: config.url,
      method: config.method ? config.method : undefined,
      headers: config.headers ? config.headers : undefined,
      withCredentials: true,
      data: config.body ? config.body : null,
      validateStatus: function (status) {
        return status < 500;
      },
    })
      .then(response => {
        setIsLoading(false);
        callback(response);
      })
      .catch(error => {
        setIsLoading(false);
        setError({ message: error.message });
      });
  };

  const errorCallback = callbackMessage => {
    setError({ message: callbackMessage });
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    makeRequest,
    errorCallback,
  };
}

export default useFetchHook;
