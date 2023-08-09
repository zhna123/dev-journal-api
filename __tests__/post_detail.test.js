const request = require('supertest')
const express = require('express')

// mock authenticateToken in router
const auth = require("../lib/authenticate")
jest.spyOn(auth, 'authenticateToken').mockImplementation(
  (req, res, next) => {
    const { published } = req.query;
    if (published && published === 'true') {
      // pass authentication if retrieving published posts only
      return next()
    }
    // set authenticated user
    req.authenticatedUser = { userid: '678288616906366dc56a79e6', username: 'jan' };
    return next()
  }
)

const testPublishedPostId = "978288616906366dc56a79f6"
const testUnpublishedPostId = "67e288616906366dc56a7999"

const Post = require("../models/post");
const dbOps = require('../db/dbOps')
jest.spyOn(dbOps, 'findPostById').mockImplementation(async (testPublishedPostId) => {
  console.log("mock findPostById function")
  const post_published = new Post({
    title: "post 1",
    content: "test content",
    date_created: Date.now(),
    is_published: true,
    _id: testPublishedPostId
  })
  return Promise.resolve(post_published)
})
const postsRouter = require('../routes/posts');

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/posts", postsRouter);

describe('get post detail', () => {

  let server
  let agent

  beforeEach((done) => {
    server = app.listen(4000, () => {
      agent = request.agent(server)
      done()
    })
  })

  afterEach((done) => {
    jest.clearAllMocks()
    server.close(done)
  })

  it("gets a published post detail by its id and returns code 200", async () => {
    const res = await agent
      .get(`/posts/${testPublishedPostId}?published=true`)
     
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('post 1');
    expect(res.body.content).toBe('test content');
  });

  it("it returns code 401 if requesting a published post but the post is actually unpublished", async () => {
    
    jest.spyOn(dbOps, 'findPostById').mockImplementation(async (testUnpublishedPostId) => {
      console.log("mock findPostById function")
      const post_published = new Post({
        title: "post 2",
        content: "unpublished test content",
        date_created: Date.now(),
        _id: testUnpublishedPostId
      })
      return Promise.resolve(post_published)
    })
    
    const res = await agent
      .get(`/posts/${testUnpublishedPostId}?published=true`)
     
    expect(res.statusCode).toEqual(401);
  });

  it("it returns code 404 if post not found", async () => {
    
    jest.spyOn(dbOps, 'findPostById').mockImplementation(async (someid) => {
      console.log("mock findPostById function - no post found")
      return Promise.resolve(null)
    })
    
    const res = await agent
      .get('/posts/978288616906366dc56a7910?published=true')
     
    expect(res.statusCode).toEqual(404);
  });

  it("gets an unpublished post detail by its id and returns code 200", async () => {
    
    jest.spyOn(dbOps, 'findPostById').mockImplementation(async (testUnpublishedPostId) => {
      console.log("mock findPostById function")
      const post_published = new Post({
        title: "post 2",
        content: "unpublished test content",
        date_created: Date.now(),
        _id: testUnpublishedPostId
      })
      return Promise.resolve(post_published)
    })
    
    const res = await agent
      .get(`/posts/${testUnpublishedPostId}`)
     
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);  
    expect(res.body.title).toBe('post 2');
    expect(res.body.content).toBe('unpublished test content');
  });
});