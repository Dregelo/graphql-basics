import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

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
    published: true,
    author: '1'
  },
  {
    id: 'post2',
    title: 'Puddings are overrated',
    body: 'Big if true',
    published: false,
    author: '2'
  },
  {
    id: 'post3',
    title: 'You guys suck',
    body: 'Am I the only one who sees this?',
    published: true,
    author: '3'
  }
];

const comments = [
  {
    id: 'comment1',
    body: 'They are not misterious, stop spreading government propaganda',
    author: '3',
    post: 'post1'
  },
  {
    id: 'comment2',
    body: 'They are, wake up sheep',
    author: '1',
    post: 'post1'
  },
  {
    id: 'comment3',
    body: 'Why would you say something like this?',
    author: '1',
    post: 'post3'
  }
];

const typeDefs = `
    type Query {
      users(query: String): [User!]!
      posts(query: String): [Post!]!
      comments: [Comment!]!
      me: User!
      post: Post!
    }

    type Mutation {
      createUser(data: CreateUserInput!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String! 
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      body: String!
      author: ID!
      post: ID!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      body: String!
      author: User!
      post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
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
  },
  Mutation: {
    createUser(parent, { data }, ctx, info) {
      const existingUser = users.some(user => user.email === data.email);

      if (existingUser) {
        throw new Error('Email taken.');
      }

      const newUser = {
        id: uuid(),
        ...data
      };
      users.push(newUser);
      return newUser;
    },
    createPost(parent, { data }, ctx, info) {
      const existingUser = users.some(user => user.id === data.author);
      if (!existingUser) {
        throw new Error("User doesn't exists.");
      }

      const newPost = {
        id: uuid(),
        ...data
      };

      posts.push(newPost);
      return newPost;
    },
    createComment(parent, { data }, ctx, info) {
      const existingUserAndPost =
        users.some(user => user.id === data.author) &&
        posts.some(post => post.id === data.post && post.published);
      if (!existingUserAndPost) {
        throw new Error("User or post doesn't exist.");
      }
      const newComment = {
        id: uuid(),
        ...data
      };
      comments.push(newComment);
      return newComment;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
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
