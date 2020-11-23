const express = require('express');
const usersRouter = express.Router();
const userControllers = require('../controllers/userControllers');
const ROUTES = require('../constants/routes');

usersRouter.get(ROUTES.USER_DETAIL, userControllers.getUserInfo);

usersRouter.post(ROUTES.LOGIN, userControllers.login);
usersRouter.post(ROUTES.SIGNUP, userControllers.signup);

usersRouter.put(
  ROUTES.USER_DETAIL,
  userControllers.updateUserInfo
);

usersRouter.put(
  ROUTES.USER_DETAIL + ROUTES.PREFERRED_PARTNER,
  userControllers.updatePreferredPartner
);

usersRouter.put(
  ROUTES.USER_DETAIL + ROUTES.PROMISE,
  userControllers.updatePromise
);

usersRouter.put(
  ROUTES.USER_DETAIL + ROUTES.FAVORITE_PARTNERS,
  userControllers.addFavoritePartners
);

module.exports = usersRouter;
