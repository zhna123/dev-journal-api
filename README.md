# A Developer's Journal backend API
Implemented using ExpressJS

## APIs
* Display all blog posts: GET `/posts`
* Display blog post detail: GET `/posts/:postId`
* Create new blog post: POST `/posts`
* Update blog post: PUT `/posts/:postId`
* Delete blog post: DELETE `posts/:postId`

* Display all comments of a post: GET `/posts/:postId/comments`
* Add new comment: POST `/posts/:postId/comments`

## What I have learned
* Design flexible rest APIs
  - use query paremeters
* Implemented JWT authentication to block unauthorized access to protected routes
* Use refresh tokens for added security(I laid out the basics, but didn't use it in this project)
* Handle and return errors

## Deployment