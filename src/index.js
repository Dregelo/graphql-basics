import { GraphQLServer } from 'graphql-yoga';

// Demo user Data
const users = [
  {
    id: '1',
    name: 'Peter',
    email: 'peter@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Kalasnyikov',
    email: 'kalasnyikov@example.com',
    age: 75
  },
  {
    id: '3',
    name: 'Balmut',
    email: 'balmut@example.com'
  }
];

const posts = [
  {
    id: 'post1',
    title: 'How I Met My Pudding',
    body: 'Puddings are a misterious type',
    published: true
  },
  {
    id: 'post2',
    title: 'Puddings are overrated',
    body: 'Big if true',
    published: false
  },
  {
    id: 'post3',
    title: 'You guys suck',
    body: 'Am I the only one who sees this?',
    published: true
  }
];

const typeDefs = `
    type Query {
      users(query: String): [User!]!
      posts(query: String): [Post!]!
      me: User!
      post: Post!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
`;
const resolvers = {
  Query: {
    users(parent, { query }, ctx, info) {
      if (!query) {
        return users;
      } else {
        const queriedUsers = users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        return queriedUsers;
      }
    },
    posts(parent, { query }, ctx, info) {
      if (!query) {
        return posts;
      } else {
        const queriedPosts = posts.filter(post => {
          return (
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
          );
        });
        return queriedPosts;
      }
    },
    me() {
      return {
        id: '123098',
        name: 'Peter',
        email: 'peter@example.com',
        age: 28
      };
    },
    post() {
      return {
        id: 'post123',
        title: 'The curious case of Teddy the Bear',
        body: 'Teddy is not a bear nor a man',
        published: true
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Server Started');
});
