import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth";
import useForm from "../hooks/useForm";
const initialState = {
  username: "",
  password: "",
};

const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      token
      email
      createdAt
      username
    }
  }
`;

const Login = (props) => {
    const authCtx = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER, {
    update(_, {data: {login: userData}}) {
      authCtx.login(userData);
    },
    onError(err) {
      const catchErrors = err.graphQLErrors[0].extensions.errors;
      setErrors(catchErrors);
      console.log(catchErrors);
    },
  });

  const onChange = (event) => {
    setValues((previousValues) => {
      return { ...previousValues, [event.target.name]: event.target.value };
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    loginUser({
      variables: values,
    });
    if(!error){
        setValues(initialState);
        navigate('/')
    }
  };

  if (error) {
    console.log("FOUND ERROR", errors);
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="username..."
          name="username"
          type="text"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          error={errors.password ? true : false}
          name="password"
          type="password"
          value={values.password}
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
export default Login;
