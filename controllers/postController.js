const asyncHandler = require("express-async-handler")
const { body, validationResult} = require("express-validator")

const Post = require("../models/post");
const { findAllPosts, findPostById } = require("../db/dbOps");

exports.post_list = asyncHandler(async(req, res, next) => {  
  const { published } = req.query;
  // see if published parameter is provided, if so check the value
  if (published && published === 'true') {  
    // retrieving published posts only
    const allPosts = await findAllPosts({is_published: published})
    return res.status(200).json(allPosts)  
  } 
  // all other scenarios need authorization
  // retrieving all posts
  const allPosts = await findAllPosts({})
  return res.status(200).json(allPosts) 
})

exports.post_detail = asyncHandler(async(req, res, next) => {

  const post = await findPostById(req.params.postId);
  if (post === null) {
    // no result
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }

  const { published } = req.query;
  // check if the post is actually published
  if (published && published === 'true') {   
    if (!post.is_published) {
      const err = new Error("Unauthorized request.");
      err.status = 401;
      return next(err);
    }
    // only return if the post is actually published
    return res.status(200).json(post)
  }
  // all other scenarios need authorization
  return res.status(200).json(post)
})

exports.new_post = [

  body("title")
  .trim()
  .escape(),

  body("content")
  .trim()
  .escape(),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date_created: Date.now(),
      is_published: req.body.is_published
    });
    if (!errors.isEmpty()) {
      res.status(500).json({...post._doc, errors: errors.array()})
    } else {
      const doc = await post.save()
      res.status(200).json(doc)
    }
  })
]

exports.update_post = [
  
  body("title")
  .trim()
  .escape(),

  body("content")
  .trim()
  .escape(),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date_updated: Date.now(),
      is_published: req.body.is_published,
      _id: req.params.postId
    });
    if (!errors.isEmpty()) {
      res.status(500).json({...post._doc, errors: errors.array()})
    } else {
      const thePost = await Post.findByIdAndUpdate(req.params.postId, post, {});
      res.status(200).json(thePost)
    }
  })

]

exports.delete_post = asyncHandler(async(req, res, next) => {
  await Post.findByIdAndRemove(req.params.postId);
  res.status(204).send("post deleted successfully")
})
