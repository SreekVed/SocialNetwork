import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

export default function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const random = Math.floor(Math.random() * 3 + 1);

  const icon =
    random === 1 ? "matthew.png" : random === 2 ? "molly.png" : "daniel.jpg";

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
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
        <Button
          onClick={likePost}
          floated="left"
          color="red"
          content="Like"
          icon="heart"
          label={{
            basic: true,
            color: "red",
            pointing: "left",
            content: likeCount,
          }}
        />

        <Button
          onClick={commentPost}
          floated="right"
          color="green"
          content="Comment"
          icon="comments"
          label={{
            basic: true,
            color: "green",
            pointing: "left",
            content: commentCount,
          }}
        />
      </Card.Content>
    </Card>
  );
}

function likePost(){

}

function commentPost(){
    
}
