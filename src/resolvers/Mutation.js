import uuid from 'uuid/v4';

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const existingUser = db.users.some(user => user.email === data.email);

    if (existingUser) {
      throw new Error('Email taken.');
    }

    const newUser = {
      id: uuid(),
      ...data
    };
    db.users.push(newUser);
    return newUser;
  },
  deleteUser(parent, { id }, { db }, info) {
    const existingUserIndex = db.users.findIndex(user => user.id === id);
    if (existingUserIndex === -1) {
      throw new Error("User doesn't exist.");
    }

    const deletedUsers = db.users.splice(existingUserIndex, 1);

    db.posts = db.posts.filter(post => {
      const isMatch = post.author === id;
      if (isMatch) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !isMatch;
    });
    db.comments = db.comments.filter(comment => comment.author !== id);
    return deletedUsers[0];
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found.');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error('Email is already in use.');
      }
      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, { data }, { db }, info) {
    const existingUser = db.users.some(user => user.id === data.author);
    if (!existingUser) {
      throw new Error("User doesn't exist.");
    }

    const newPost = {
      id: uuid(),
      ...data
    };

    db.posts.push(newPost);
    return newPost;
  },
  deletePost(parent, { id }, { db }, info) {
    const postId = db.posts.findIndex(post => post.id === id);
    if (postId === -1) {
      throw new Error("Post doesn't exist.");
    }

    const deletedPost = db.posts.splice(postId, 1);

    db.comments = db.comments.filter(comment => comment.post !== id);
    return deletedPost[0];
  },
  updatePost(parent, { id, data }, { db }, info) {
    const post = db.posts.find(post => post.id === id);
    if (!post) {
      throw new Error("Post doesn't exist");
    }
    if (typeof data.title === 'string') {
      post.title = data.title;
    }
    if (typeof data.body === 'string') {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }
    return post;
  },
  createComment(parent, { data }, { db }, info) {
    const existingUserAndPost =
      db.users.some(user => user.id === data.author) &&
      db.posts.some(post => post.id === data.post && post.published);
    if (!existingUserAndPost) {
      throw new Error("User or post doesn't exist.");
    }
    const newComment = {
      id: uuid(),
      ...data
    };
    db.comments.push(newComment);
    return newComment;
  },
  deleteComment(parent, { id }, { db }, info) {
    const commentId = db.comments.findIndex(comment => comment.id === id);
    if (commentId === -1) {
      throw new Error("Comment doesn't exist.");
    }
    const deletedComment = db.comments.splice(commentId, 1);
    return deletedComment[0];
  },
  updateComment(parent, { id, data }, { db }, info) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error("Comment doesn't exist.");
    }
    if (typeof data.body === 'string') {
      comment.body = data.body;
    }
    return comment;
  }
};

export default Mutation;
