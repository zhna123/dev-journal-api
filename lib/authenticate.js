const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const { published } = req.query;
  if (published && published === 'true') {
    // pass authentication if retrieving published posts only
    return next()
  }
  // Access the JWT token from the request cookies
  const token = req.cookies.jwt;
  if (token == null) {
    return res.sendStatus(401)
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send(err);
    }
    req.user = user
    next()
  })
}

module.exports = {
  authenticateToken
}