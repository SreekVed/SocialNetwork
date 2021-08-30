import React, { useState } from "react";
import { Form, Grid } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../pages/Home";

export default function PostForm() {
  const [body, setBody] = useState("");

  const [error, setError] = useState(false);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: { body },
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      setBody("");
    },
    onError() {
      setError(true);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createPost();
  };

  return (
    <Grid.Row centered>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Field>
            <Form.Input
              placeholder="Create a New Post !"
              name="body"
              onChange={(event) => {
                setBody(event.target.value);
                if (event.target.value) setError(false);
              }}
              value={body}
              error={error}
            />
          </Form.Field>
          <Form.Button
            type="submit"
            content="Post"
            icon="add"
            color="blue"
            labelPosition="left"
          />
        </Form.Group>
      </Form>
    </Grid.Row>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        createdAt
        username
        id
      }
      comments {
        createdAt
        body
        username
        id
      }
      likeCount
      commentCount
    }
  }
`;
