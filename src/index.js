import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import ResolversBundle from './resolvers/ResolversBundle';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    ...ResolversBundle
  },
  context: {
    db
  }
});

server.start(() => {
  console.log('Server Started');
});
