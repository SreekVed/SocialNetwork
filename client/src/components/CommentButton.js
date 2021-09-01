import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

export default function CommentButton({
  post: { id, comments, commentCount },
  user,
}) {
  return (
    <Button
      as={Link}
      to={user ? `/posts/${id}` : "/login"}
      onClick={() => console.log("comment")}
      basic={
        !(
          user && comments.find((comment) => comment.username === user.username)
        )
      }
      color="green"
      content={window.innerWidth >= 1000 ? "Comment" : ""}
      icon="comments"
      label={{
        basic: true,
        color: "green",
        pointing: "left",
        content: commentCount,
      }}
    />
  );
}
