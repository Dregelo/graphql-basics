const Query = {
  users(parent, { query }, { db }, info) {
    if (!query) {
      return db.users;
    } else {
      return db.users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
  posts(parent, { query }, { db }, info) {
    if (!query) {
      return db.posts;
    } else {
      return db.posts.filter(post => {
        return (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export default Query;
