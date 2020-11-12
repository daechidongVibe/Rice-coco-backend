const createError = require('http-errors');
const express = require('express');
const app = express();

const initLoader = require('./loaders');
const dbLoader = require('./loaders/db');

initLoader(app);
dbLoader();

const ROUTES = require('./constants/routes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(ROUTES.HOME, indexRouter);
app.use(ROUTES.USERS, usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
