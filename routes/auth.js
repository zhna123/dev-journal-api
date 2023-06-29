require('dotenv').config()
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const authenticate = require('../lib/jwt')

const User = require('../models/user')

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password"})
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);

let refreshTokens = []
// generate new access token after expire
router.post('/token', function(req, res, next) {
  // const refreshToken = req.body.token
  const { refreshToken } = req.body;
  if (refreshToken == null) {
    return res.sendStatus(401)
  }
  // check if we have a valid refreshToken
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403)
  }
  // verify refresh token, then generate access token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return req.sendStatus(403)
    }
    // only need username
    const token = authenticate.generateAccessToken({username: user.username})
    // Update the JWT token in the HTTP-only cookie
    res.cookie('jwt', token, { httpOnly: true });
    
    // Return a response with the new JWT token
    return res.json({ success: true, token });
    // res.json({ accessToken })
  })
})

router.post('/login', function (req, res, next) {

  passport.authenticate('local', {session: false}, (err, user, info, status) => {
    if (err) { return next(err) }
    if (!user) { 
      return res.sendStatus(401)
    }
    // need to manually log in the authenticated user - because we used AuthenticateCallback
    req.login(user, {session: false}, (err) => {
        if (err) { return next(err) }
        // generate token and refresh token after login
        const token = authenticate.generateAccessToken(user.toJSON())
        const expirationDate = authenticate.getExpirationDate()
        // const refreshToken = authenticate.generateRefreshToken(user.toJSON())
        // add the refresh token to storage
        // refreshTokens.push(refreshToken)
        // return res.json({token, refreshToken});
        // Set the token as an HTTP-only cookie
        res.cookie('jwt', token, { 
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        // Set the expiration time in another cookie
        res.cookie('jwtExpiration', expirationDate.toUTCString());
  
        return res.status(201).json({ success: true });
    });
  })(req, res, next); // invoke the middleware function returned by passport.authenticate()
});

router.delete('/logout', function(req, res, next) {
  // remove the current refresh token
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

module.exports = router;