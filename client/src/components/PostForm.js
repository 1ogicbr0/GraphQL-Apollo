import { gql } from "graphql-tag";
import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import  useForm  from '../hooks/useForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION,{
      variables: values,
      update(proxy, result){
          const data = proxy.readQuery({
              query: FETCH_POSTS_QUERY
          })
          console.log(result.data.createPost)
          console.log(data);

          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
              getPosts: [result.data.createPost, ...data.getPosts],
            },
          });
        values.body = '';
      }
  })

  function createPostCallback() {
      createPost();
  }
  return (
    <>
    <Form onSubmit={onSubmit}>
      <h2>Create a post</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi world"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
    {error && (
        <div className="ui error message" style={{marginBottom :20}}>
            <ul className="list">
                <li>{error.graphQLErrors[0].message}</li>
            </ul>
        </div>
    )}
  </>);
};

export default PostForm;

const CREATE_POST_MUTATION = gql`
mutation createPost($body:String!){
    createPost(body:$body){
        id
        body
        createdAt
        username
        likes{
            id
            username
            createdAt
        }
        likeCount
        comments{
            id
            createdAt
            body
            username
        }
        commentCount
    }
}
`;