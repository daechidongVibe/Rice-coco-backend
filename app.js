const createError = require('http-errors');
const express = require('express');
const app = express();

const initLoader = require('./loaders');
const dbLoader = require('./loaders/db');

initLoader(app);
dbLoader();

const ROUTES = require('./constants/routes');
const usersRouter = require('./routes/usersRouter');
const meetingsRouter = require('./routes/meetingsRouter');
const paymentRouter = require('./routes/paymentRouter');

app.use(ROUTES.USERS, usersRouter);
app.use(ROUTES.MEETINGS, meetingsRouter);
app.use(ROUTES.PAYMENT, paymentRouter);

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
