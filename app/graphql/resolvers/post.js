import { AuthenticationError, UserInputError } from "apollo-server";
import Post from "../../models/Post";
import checkAuth from "../../utils/check-auth";

const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      if(body.trim() === ""){
        throw new Error("Body cannot be empty")
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),

      });

      const post = await newPost.save();
      
      context.pubsub.publish('NEW_POST',{
        newPost: post
      })

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user && post && user.username === post.username) {
          await post.delete();
          return "Post has been deleted succesfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const likedPost =  post.likes.find((like) => like.username === username)
        if (likedPost) {
          //Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //Not liked, like post
          post.likes.unshift({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      }else{
        throw new UserInputError('Post not found')
      }
    },
  },
  Subscription:{
    newPost:{
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
};

export default postResolvers;
