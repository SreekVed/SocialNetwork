import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Grid, Loader } from "semantic-ui-react";

import PostCard from "../components/PostCard";

export default function Home() {
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);

  if (error)
    return (
      <h2 style={{ marginTop: "20vh", color: "red", textAlign: "center" }}>
        404 Error
      </h2>
    );

  return (
    <Grid columns={2} stackable>
      <Grid.Row centered>
        <h1 style={{ marginTop: "10px" }}>Sreek's Social Network</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Loader active style={{ marginTop: "20vh" }}>
            Loading Posts
          </Loader>
        ) : (
          data &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        username
        body
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;
