import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

export default function LikeButton({ post: { id, likes, likeCount }, user }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(user && likes.find((like) => like.username === user.username));
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      alert(err.message);
    },
  });

  const redirect = user
    ? null
    : {
        as: Link,
        to: "/login",
      };

  return (
    <Button
      {...redirect}
      style={{ marginRight: "5%" }}
      onClick={user && likePost}
      basic={!liked}
      color="red"
      content={window.innerWidth >= 1000 ? "Like" : ""}
      icon="heart"
      label={{
        basic: true,
        color: "red",
        pointing: "left",
        content: likeCount,
      }}
    />
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
