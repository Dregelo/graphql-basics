import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

// Demo user Data
let users = [
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

let posts = [
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

let comments = [
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
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
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
    deleteUser(parent, { id }, ctx, info) {
      const existingUserIndex = users.findIndex(user => user.id === id);
      if (existingUserIndex === -1) {
        throw new Error("User doesn't exist.");
      }

      const deletedUsers = users.splice(existingUserIndex, 1);
      posts = posts.filter(post => {
        const isMatch = post.author !== id;
        if (isMatch) {
          comments = comments.filter(comment => comment.author !== id);
        }
        return isMatch;
      });
      comments = comments.filter(comment => comment.author !== id);
      return deletedUsers[0];
    },

    createPost(parent, { data }, ctx, info) {
      const existingUser = users.some(user => user.id === data.author);
      if (!existingUser) {
        throw new Error("User doesn't exist.");
      }

      const newPost = {
        id: uuid(),
        ...data
      };

      posts.push(newPost);
      return newPost;
    },
    deletePost(parent, { id }, ctx, info) {
      const postId = posts.findIndex(post => post.id === id);
      if (postId === -1) {
        throw new Error("Post doesn't exist.");
      }

      const deletedPost = posts.splice(postId, 1);

      comments = comments.filter(comment => comment.post !== id);
      return deletedPost[0];
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
    },
    deleteComment(parent, { id }, ctx, info) {
      const commentId = comments.findIndex(comment => comment.id === id);
      if (commentId === -1) {
        throw new Error("Comment doesn't exist.");
      }
      const deletedComment = comments.splice(commentId, 1);
      return deletedComment[0];
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
