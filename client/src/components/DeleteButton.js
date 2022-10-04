import React, { useState } from "react";
import { Confirm, Button, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../utils/graphql";

const DeleteButton = (props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { postId, callback, commentId } = props;
  const mutation = commentId ? DELETE_COMMENT_MUTATION :DELETE_POST_MUTATION;
  const [deletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        });
      }
      if (callback) callback();
    },
  });

  return (
    <>
      <Button
        as="div"
        onClick={() => setConfirmOpen(true)}
        color="inverted red"
        floated="right"
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;

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
