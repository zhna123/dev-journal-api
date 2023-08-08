
async function saveUser(user) {
  await user.save()
}

module.exports = {
  saveUser
}