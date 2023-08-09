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

const Post = require("../models/post");
const dbOps = require('../db/dbOps')
jest.spyOn(dbOps, 'findAllPosts').mockImplementation(async (conditionObj) => {
  console.log("mock findAllPosts function")
  const post_published = new Post({
    title: "post 1",
    content: "test content",
    date_created: Date.now(),
    is_published: true
  })
  const post_unpublished = new Post({
    title: "post 2",
    content: "unpublished test content",
    date_created: Date.now(),
  })
  if (Object.keys(conditionObj).length === 0) {
    return Promise.resolve([post_published, post_unpublished])
  }
  return Promise.resolve([post_published])
})
const postsRouter = require('../routes/posts');

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/posts", postsRouter);

describe('get all posts', () => {

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

  it("gets all published posts and returns code 200 - no authentication required", async () => {
    const res = await agent
      .get('/posts?published=true')
     
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1)
    expect(res.body[0].title).toBe('post 1');
    expect(res.body[0].content).toBe('test content');
  });

  it("gets all published and unpublished posts and returns code 200 - need authenticate user", async () => {
    const res = await agent
      .get('/posts')
     
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2)
    expect(res.body[0].title).toBe('post 1');
    expect(res.body[0].content).toBe('test content');
    expect(res.body[1].title).toBe('post 2');
    expect(res.body[1].content).toBe('unpublished test content');
  });
});