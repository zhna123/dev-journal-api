const request = require('supertest')
const express = require('express')

const dbOps = require('../db/dbOps')
jest.spyOn(dbOps, 'saveUser').mockImplementation(async (user) => {
  console.log("mock saveUser function - user saved successfully")
  return Promise.resolve()
})
const indexRouter = require('../routes/index')

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

describe('user sign up', () => {

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

  it("returns code 201 and success message", async () => {
    const res = await agent
      .post('/sign-up')
      .send("username=jan")
      .send("password=123456")
     
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(201);
    expect(res.body.msg).toBe('user signed up successfully');
  });
  
  it("returns validation error when missing password", async () => {
    const res = await agent
      .post('/sign-up')
      .send("username=jan")

    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe('password is required');
  });
});