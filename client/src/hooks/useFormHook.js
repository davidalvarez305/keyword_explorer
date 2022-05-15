import { useState } from 'react';

const useFormHook = initialValues => {
  const [values, setValues] = useState(initialValues);
  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  return {
    values,
    handleChange,
  };
};

export default useFormHook;