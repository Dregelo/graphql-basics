import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import ResolversBundle from './resolvers/ResolversBundle';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    ...ResolversBundle
  },
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log('Server Started');
});
