const asyncHandler = require("express-async-handler")
const { body, validationResult} = require("express-validator")

const Comment = require("../models/comment")

exports.comment_list = asyncHandler(async(req, res, next) => {
  const allComments = await Comment.find({ post: req.params.postId })
    .sort({ date_created: 1 })
    .exec();
  res.json(allComments)
})

exports.new_comment = [
  body("content")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("Content is required"),

  body("author_name")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("Your name is required."),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const comment = new Comment({
      content: req.body.content,
      author_name: req.body.author_name,
      date_created: Date.now(),
      post: req.params.postId,
      parent: req.body.parent_id ? req.body.parent_id : null
    });
    if(!errors.isEmpty()) {
      res.status(500).json({...comment._doc, errors: errors.array()})
    } else {
      await comment.save()
      res.status(200).send("comment saved successfully")
    }
  })
]

exports.update_comment = [
  body("content")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("Content is required"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.content,
      _id: req.params.commentId
    });
    if(!errors.isEmpty()) {
      res.status(500).json({...comment._doc, errors: errors.array()})
    } else {
      const theComment = await Comment.findByIdAndUpdate(req.params.commentId, comment, {});
      res.status(200).send("comment updated successfully")
    }
  })
]

// to support the comments threaded, only deletes content
exports.delete_comment = asyncHandler(async(req, res, next) => {
  const comment = new Comment({
    content: "This comment was deleted.",
    _id: req.params.commentId,
    is_deleted: true
  })
  const theComment = await Comment.findByIdAndUpdate(req.params.commentId, comment, {});
  res.status(200).send("comment deleted successfully")
})


