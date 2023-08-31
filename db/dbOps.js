const Post = require("../models/post");

async function saveUser(user) {
  await user.save()
}

async function findAllPosts(conditionObj) {
  return Post.find(conditionObj)
    .sort({ date_created: -1})
    .exec();
}

async function findPostById(postid) {
  return await Post.findById(postid).exec();
}

module.exports = {
  saveUser,
  findAllPosts,
  findPostById
}