const jwt = require('jsonwebtoken');
const RESPONSE = require('../constants/response');
const ROUTES = require('../constants/routes');

const authenticateUser = async (req, res, next) => {
  if (
    (req.path === ROUTES.USERS + ROUTES.LOGIN) ||
    (req.path === ROUTES.USERS + ROUTES.SIGNUP)
    ) {
    return next();
  }

  const token = req.get('authorization');

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userInfo = userInfo;

    next();
  } catch (error) {
    res.status(401).json(
      { error: RESPONSE.UNAUTHORIZED }
    );
  }
};

module.exports = authenticateUser;
