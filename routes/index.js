const express = require('express');
const router = express.Router();
const ROUTES = require('../constants/routes');

router.get(ROUTES.HOME, (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
