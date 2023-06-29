require('dotenv').config()
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '900s'});
}

function getExpirationDate() {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 900 * 1000); // 15m from now
  return expirationDate;
}

function generateRefreshToken(user) {
  // invalidate in server manually
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getExpirationDate
}