# A Developer's Journal backend API

Implemented with

* ExpressJS
* MongoDB + Mongoose
* Jest + SuperTest(unit testing)

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
* Handle CORS 
* Implemented JWT authentication to block unauthorized access to protected routes
* Testing routes (unit testing with Jest and SuperTest & testing with postman)

## Development & Testing
`npm run serverstart`

## Deployment