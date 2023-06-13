require('dotenv').config()
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '200s'});
}

function generateRefreshToken(user) {
  // invalidate in server manually
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
}