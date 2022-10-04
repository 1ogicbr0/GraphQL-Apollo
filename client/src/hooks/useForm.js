import { useState } from "react";
import { useNavigate } from "react-router-dom";



const useForm = (callback, initialState = {}, graphqlInput) => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues((previousValues) => {
      return { ...previousValues, [event.target.name]: event.target.value };
    });
    console.log(values)
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback({
      variables: values,
    });
    console.log(values)
    
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};

export default useForm;
