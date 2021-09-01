import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { Card, Form, Grid, Image, Loader, Transition } from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../auth";
import LikeButton from "../components/LikeButton";
import CommentButton from "../components/CommentButton";
import DeleteButton from "../components/DeleteButton";

export default function Post(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);

  const [commentBody, setCommentBody] = useState("");

  const [err, setErr] = useState(false);

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: {
      postId,
      body: commentBody,
    },
    update() {
      setCommentBody("");
    },
    onError(e){
        setErr(window.innerWidth >= 500 ? e.message : true)
    }
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createComment();
  };

  if (loading) return <Loader active>Loading Posts</Loader>;

  if (error)
    return (
      <h2 style={{ marginTop: "20vh", color: "red", textAlign: "center" }}>
        404 Error
      </h2>
    );

  const {
    id,
    body,
    username,
    createdAt,
    likes,
    comments,
    likeCount,
    commentCount,
  } = data.getPost;

  const random = Math.floor(Math.random() * 3 + 1);

  return (
    <Grid>
      <Grid.Row centered>
        <h1 style={{ marginTop: "10px" }}>
          Post Details
          <hr />
        </h1>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image floated="right" size="small" src={`/avatars/${random}.png`} />
        </Grid.Column>
        <Grid.Column width={14}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likes, likeCount }} />

              <CommentButton
                user={user}
                post={{ id, comments, commentCount }}
              />

              {user && user.username === username && (
                <DeleteButton
                  postId={id}
                  callback={() => props.history.push("/")}
                />
              )}
            </Card.Content>
          </Card>
          {(user || commentCount > 0) && <h2>Comments</h2>}
          {user && (
              <Form onSubmit={onSubmit}>
                <Form.Group>
                  <Form.Field>
                    <Form.Input
                      placeholder="Post a New Comment !"
                      name="commentBody"
                      onChange={(event) => {
                        setCommentBody(event.target.value);
                        if (event.target.value) setErr(false);
                      }}
                      value={commentBody}
                      error={err}
                    />
                  </Form.Field>
                  <Form.Button
                    type="submit"
                    content={window.innerWidth >= 1000 ? "Post" : undefined}
                    icon="add"
                    color="blue"
                    labelPosition={window.innerWidth >= 1000 ? "left" : undefined}
                  />
                </Form.Group>
              </Form>
          )}
          <Transition.Group>
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Transition.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        createdAt
        body
        username
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId : $postId, body : $body){
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`;
