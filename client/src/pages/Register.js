import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom"
import React, { useState,useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

const empty = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const REGISTER_USER = gql`
  mutation Register($registerInput: RegisterInput) {
    register(registerInput: $registerInput) {
      id
      token
      createdAt
      username
    }
  }
`;

const Register = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const [createUser, {data, loading, error }] = useMutation(REGISTER_USER, {
    update(_,{data: {register: userData}}){
      authCtx.login(userData)
    },
    onError(err){
      const catchErrors = err.graphQLErrors[0].extensions.errors
      setErrors(catchErrors)
    }
  });
  const [values, setValues] = useState(empty);
  if (error) {
    console.log("FOUND ERROR",errors);
  }

  const onChange = (event) => {
    setValues((previousValues) => {
      return { ...previousValues, [event.target.name]: event.target.value };
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    createUser({
      variables: { registerInput: values },
    });

    if(!error)
    {
    setValues(empty);
    navigate('/')
  }
  };
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="username..."
          name="username"
          type="text"
          error={errors.username ? true: false}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          error={errors.email ? true: false}
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          error={errors.password ? true: false}
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="confirm Password..."
          error={errors.confirmPassword ? true: false}
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
            )}
    </div> 
  );
};
export default Register;
