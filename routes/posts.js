const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../lib/authenticate")

const postController = require("../controllers/postController")
const commentController = require('../controllers/commentController')

// get all posts
router.get('/', authenticateToken, postController.post_list)

// get post by id
router.get('/:postId', authenticateToken, postController.post_detail)

// create new post
router.post('/', authenticateToken, postController.new_post)

// update post by id
router.put('/:postId', authenticateToken, postController.update_post)

// delete post by id
router.delete('/:postId', authenticateToken, postController.delete_post)

// ***************** comments - no need to log in to comment ***********************************

// get all comments for a given post
router.get('/:postId/comments', commentController.comment_list)

// create new comment
router.post('/:postId/comments', commentController.new_comment)

// ********************* update comment are not supported ===========
// update a comment
// router.put('/:postId/comments/:commentId', commentController.update_comment)

// delete a comment - admin authorized feature
router.delete('/:postId/comments/:commentId', authenticateToken, commentController.delete_comment)


module.exports = router