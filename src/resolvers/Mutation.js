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
  }
};

export default Mutation;
