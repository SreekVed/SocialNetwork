import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../auth";
import LikeButton from "../components/LikeButton";

export default function PostCard({
  post: {
    body,
    createdAt,
    id,
    username,
    likes,
    comments,
    likeCount,
    commentCount,
  },
}) {
  const { user } = useContext(AuthContext);

  const random = Math.floor(Math.random() * 3 + 1);

  const icon =
    random === 1 ? "matthew.png" : random === 2 ? "molly.png" : "daniel.jpg";

  return (
    <Card fluid>
      <Card.Content as={Link} to={user ? `/posts/${id}` : "/login"}>
        <Image
          floated="right"
          size="mini"
          src={`https://react.semantic-ui.com/images/avatar/large/${icon}`}
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <Button
          as={Link}
          to={user ? `/posts/${id}` : "/login"}
          onClick={commentPost}
          basic={
            !(
              user &&
              comments.find((comment) => comment.username === user.username)
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

        {user && user.username === username && (
          <Button
            floated="right"
            color="red"
            icon="trash"
            onClick={deletePost}
          />
        )}
      </Card.Content>
    </Card>
  );
}

function commentPost() {}

function deletePost() {}
