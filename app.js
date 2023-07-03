require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

require("./mongoConfig")

const app = express();

app.use(cors({
  origin: [
    'http://localhost:8091',
    'http://localhost:8090',
    'https://dev-journal-psi.vercel.app'
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['Authorization']
}))

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/users', usersRouter);
app.use('/posts', postsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error
  res.status(err.status || 500);
  res.send(err)
});

module.exports = app;
