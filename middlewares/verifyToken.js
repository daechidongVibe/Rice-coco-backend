const jwt = require('jsonwebtoken');
const RESPONSE = require('../constants/response');
const ROUTES = require('../constants/routes');

const verifyToken = async (req, res, next) => {
  if (
    req.path === `${ROUTES.USERS}${ROUTES.LOGIN}` ||
    req.path === `${ROUTES.USERS}${ROUTES.SIGNUP}`
  ) {
    return next();
  }

  let token;

  if (req.path === '/payment') {
    const { authToken } = req.query;

    token = authToken;
  } else {
    token = req.get('authorization');
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userInfo = userInfo;

    next();
  } catch (error) {
    res.status(401).json({ result: RESPONSE.UNAUTHORIZED });
  }
};

module.exports = verifyToken;
