const express = require('express');
const usersRouter = express.Router();
const userControllers = require('../controllers/userControllers');
const ROUTES = require('../constants/routes');

usersRouter.post(ROUTES.LOGIN, userControllers.login);

usersRouter.post(ROUTES.SIGNUP, userControllers.signup);

usersRouter.put(
  ROUTES.USER_DETAIL,
  userControllers.updateUserInfo
);

usersRouter.put(
  ROUTES.USER_DETAIL + ROUTES.PREFERRED_PARTNER,
  userControllers.updatePreferPartner
);

usersRouter.put(
  ROUTES.USER_DETAIL + ROUTES.PROMISE,
  userControllers.updatePromise
);

module.exports = usersRouter;
