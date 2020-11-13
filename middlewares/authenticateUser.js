const jwt = require('jsonwebtoken');
const response = require('../constants/response');

const authenticateUser = async (req, res, next) => {
  const token = req.get('token');

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userInfo = userInfo;
    next();
  } catch (error) {
    res.status(401).json({ error: response.UNAUTHORIZED });
  }
};

module.exports = authenticateUser;
