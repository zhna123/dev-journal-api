const asyncHandler = require("express-async-handler")
const { body, validationResult} = require("express-validator")

const bcrypt =require("bcryptjs")
const User = require("../models/user")

exports.index = asyncHandler(async(req, res, next) => {
  res.send("home page is not implemented yet")
})

exports.signup_get = asyncHandler(async(req, res, next) => {
  res.send("sign-up get request is not implemented yet")
})

exports.signup_post = [
  body("username")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("user name is required"),

  body("password")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("password is required"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      username: req.body.username,
    });
    if(!errors.isEmpty) {
      res.send("sign up validation error:" + errors.array())
    } else {
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        if (err) {
          return next(err)
        }else {
          user.password = hashedPassword;
          await user.save();
          res.send("user signed up successfully")
        }
      })
    }
  }) 
]