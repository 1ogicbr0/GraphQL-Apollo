import { ApolloServer } from "apollo-server";
import { PubSub } from 'graphql-subscriptions';
import typeDefs from './app/graphql/typeDefs'
import resolvers from "./app/graphql/resolvers";
import  connectDB from './app/config/db';

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ( {req, pubsub} )
});


connectDB()
.then(server.listen({ port: 5000 }).then((res) => {
  console.log(`Server running at ${res.url}`);
}));
