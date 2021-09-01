import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../auth";

export default function Login(props) {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    loginUser();
  };

  return (
    <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <Form.Input
        label="Username"
        placeholder="Enter Username"
        name="username"
        type="text"
        error={errors.username}
        value={values.username}
        onChange={onChange}
      />

      <Form.Input
        label="Password"
        placeholder="Enter Password"
        name="password"
        type="password"
        error={errors.password}
        value={values.password}
        onChange={onChange}
      />

      <Button type="submit" primary style={{ margin: "auto", display: "flex" }}>
        Login
      </Button>
      
    </Form>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
