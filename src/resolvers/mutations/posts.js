import uuid from 'uuid/v4';

const createPost = (parent, { data }, { db, pubsub }, info) => {
  const existingUser = db.users.some(user => user.id === data.author);
  if (!existingUser) {
    throw new Error("User doesn't exist.");
  }

  const newPost = {
    id: uuid(),
    ...data
  };

  db.posts.push(newPost);

  if (newPost.published) {
    pubsub.publish(`post`, {
      post: {
        mutation: 'CREATED',
        data: newPost
      }
    });
  }

  return newPost;
};
const deletePost = (parent, { id }, { db, pubsub }, info) => {
  const postId = db.posts.findIndex(post => post.id === id);
  if (postId === -1) {
    throw new Error("Post doesn't exist.");
  }

  const [deletedPost] = db.posts.splice(postId, 1);

  db.comments = db.comments.filter(comment => comment.post !== id);

  if (deletedPost.published) {
    pubsub.publish('post', {
      post: {
        mutation: 'DELETED',
        data: deletedPost
      }
    });
  }

  return deletedPost;
};
const updatePost = (parent, { id, data }, { db, pubsub }, info) => {
  const post = db.posts.find(post => post.id === id);
  const originalPost = { ...post };
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

    if (originalPost.published && !post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: originalPost
        }
      });
    } else if (!originalPost.published && post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }
  } else if (post.published) {
    pubsub.publish('post', {
      post: {
        mutation: 'UPDATED',
        data: post
      }
    });
  }

  return post;
};

export { createPost, deletePost, updatePost };
