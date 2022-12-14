import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, TransitionGroup } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
const Home = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(FETCH_POSTS_QUERY);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading Posts..</h1>
        ) : (
          <TransitionGroup>
            {          data.getPosts &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
          </TransitionGroup>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
