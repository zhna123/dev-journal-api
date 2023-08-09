
async function saveUser(user) {
  await user.save()
}

async function findAllPosts(conditionObj) {
  return await Post.find(conditionObj)
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