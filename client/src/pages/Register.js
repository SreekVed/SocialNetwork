import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../auth";

export default function Register(props) {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
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
    addUser();
  };

  return (
    <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
      <h1 style={{ textAlign: "center" }}>Register</h1>
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
        label="Email"
        placeholder="Enter Email"
        name="email"
        type="email"
        error={errors.email}
        value={values.email}
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
      <Form.Input
        label="Confirm Password"
        placeholder="Confirm Password"
        name="confirmPassword"
        type="password"
        error={errors.confirmPassword}
        value={values.confirmPassword}
        onChange={onChange}
      />

      <Button type="submit" primary style={{ margin: "auto", display: "flex" }}>
        Register
      </Button>
    </Form>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
