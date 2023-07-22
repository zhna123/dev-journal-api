const indexRouter = require("../index");

const request = require("supertest");
const express = require("express");
const config = require("../../mongoConfigTesting");
// setting up a new express app
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

describe("index router", () => {

  let server
  let agent

  beforeAll( async () => {
    await config.initializeMongoServer()
  });

  beforeEach((done) => {
    server = app.listen(4000, () => {
      agent = request.agent(server)
      done()
    })
  })

  afterEach((done) => {
    server.close(done)
  })

  afterAll(async () => {
    await config.disconnect()
  });

  test("index route works", done => {
    agent
      .get("/")
      .expect("Content-Type", /text/)
      .expect(501, done)
  });

  test("sign-up get works", done => {
    agent
      .get("/sign-up")
      .expect("Content-Type", /text/)
      .expect(501, done)
  });

  test("sign-up post works", done => {
    agent
      .post("/sign-up")
      .send("username=user")
      .send("password=pwd")
      .set('Accept', 'application/json')
      .expect('Content-Type', /text/)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  })
})