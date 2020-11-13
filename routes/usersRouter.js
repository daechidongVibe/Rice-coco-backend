const express = require('express');
const usersRouter = express.Router();
const userControllers = require('../controllers/userControllers');
const ROUTES = require('../constants/routes');

usersRouter.post(ROUTES.LOGIN, userControllers.login);
usersRouter.post(ROUTES.SIGNUP, userControllers.signup);

module.exports = usersRouter;
