const express = require('express');
const homeRouter = express.Router();
const ROUTES = require('../constants/routes');

homeRouter.get(ROUTES.HOME, (req, res, next) => {
  res.render('index', { title: 'RICE COCO' });
});

module.exports = homeRouter;
