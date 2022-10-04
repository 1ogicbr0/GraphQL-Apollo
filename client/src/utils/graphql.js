import { gql } from "graphql-tag";
 


export const FETCH_POSTS_QUERY = gql`
query Posts{
  getPosts {
    id
    body
    createdAt
    username
    comments {
      id
      createdAt
      username
      body
    }
    likes {
      id
      createdAt
      username
    }
    likeCount
    commentCount
  }
}
`;


export const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;