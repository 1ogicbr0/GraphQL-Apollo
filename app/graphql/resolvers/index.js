import postResolvers from "./post";
import userResolvers from "./user";
import commentResolver from "./comments";

const resolvers = {
    Post: {
        likeCount:(parent) => parent.likes.length,
        commentCount:(parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolver.Mutation,
    },
    Subscription:{
        ...postResolvers.Subscription
    }
}

export default resolvers;