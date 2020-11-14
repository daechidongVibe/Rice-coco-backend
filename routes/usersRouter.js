const express = require('express');
const usersRouter = express.Router();
const userControllers = require('../controllers/userControllers');
const authenticateUser = require('../middlewares/authenticateUser');
const ROUTES = require('../constants/routes');

usersRouter.post(ROUTES.LOGIN, userControllers.login);
usersRouter.post(ROUTES.SIGNUP, userControllers.signup);
usersRouter.put(
  `${ROUTES.USER_DETAIL}${ROUTES.PREFERREDPARTNER}`,
  userControllers.updatePreferPartner
);

module.exports = usersRouter;
