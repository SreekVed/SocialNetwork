import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";

import { FETCH_POSTS_QUERY } from "../pages/Home";

export default function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },

    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId),
          },
        });
      }

      if (callback) callback();
    },

    onError(err){
        alert(err.message)
    }
  });

  return (
    <>
      <Button
        floated="right"
        color="red"
        icon="trash"
        onClick={() => setConfirmOpen(true)}
      />

      <Confirm
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={deletePostOrComment}
        content={`Are you sure you want to delete this ${commentId ? 'comment' : 'post'} ?`}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
