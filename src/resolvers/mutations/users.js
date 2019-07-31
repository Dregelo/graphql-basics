import uuid from 'uuid/v4';

const createUser = (parent, { data }, { db }, info) => {
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
};
const deleteUser = (parent, { id }, { db }, info) => {
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
};

const updateUser = (parent, { id, data }, { db }, info) => {
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
};

export { createUser, deleteUser, updateUser };
