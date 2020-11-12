const express = require('express');
const router = express.Router();
const ROUTES = require('../constants/routes');

router.get(ROUTES.HOME, function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
