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

const db = {
  users,
  posts,
  comments
};

export default db;
