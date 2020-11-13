const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const RESPONSE = require('../constants/response');

exports.login = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userService.login(email);

    if (!user) {
      return res.status(200).json({ result: RESPONSE.CAN_NOT_FIND });
    }

    const { _id: userId } = user;
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.status(200).json({ result: RESPONSE.OK, user, token });
  } catch (error) {
    res.status(500).json({ result: RESPONSE.FAILURE });
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const userInfo = req.body;

  try {
    const { _id: userId, email } = await userService.signup(userInfo);
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.status(201).json({ result: RESPONSE.OK, token });
  } catch (error) {
    res.status(500).json({ result: RESPONSE.FAILURE });
    next(error);
  }
};

exports.updatePreferPartner = async (req, res, next) => {
  const { userId } = req.params;
  const preferredPartner = req.body;

  try {
    await userService.updatePreferPartner(userId, preferredPartner);
    res.status(201).json({ result: RESPONSE.OK });
  } catch (err) {
    res.status(500).json({ result: RESPONSE.FAILURE, errMessage: RESPONSE.CAN_NOT_FIND });
    next(error);
  }
};
