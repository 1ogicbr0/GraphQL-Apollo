import { UserInputError } from "apollo-server";
import Post from "../../models/Post";
import checkAuth from "../../utils/check-auth";

const commentResolver = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: { body: "Comment body must not be empty" },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not Found");
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
        const {username} = await checkAuth(context);
        const post = await Post.findById(postId);
        if(!post){
            throw new UserInputError('Post Id not found');
        }else {
            const commentIndex = post.comments.findIndex( comment => comment.id === commentId)
            if(commentIndex<0){
                throw new UserInputError('Comment not found');
            }else{
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }else {
                    throw new UserInputError('You are not authorized to delete this comment')
                }
            }
        }
    },
  }
};

export default commentResolver;
