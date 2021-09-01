import React, { useContext } from "react";
import { Card, Image } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../auth";
import LikeButton from "../components/LikeButton";
import CommentButton from "./CommentButton";
import DeleteButton from "./DeleteButton";

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

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image floated="right" size="mini" src={`/avatars/${random}.png`} />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <CommentButton user={user} post={{ id, comments, commentCount }} />

        {user && user.username === username && (
          <DeleteButton postId={id}/>
        )}
      </Card.Content>
    </Card>
  );
}
