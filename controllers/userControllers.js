const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.login = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userService.login(email);

    if (!user) {
      return res.status(200).json({ result: 'no member information' });
    }

    const { _id: userId } = user;
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.status(200).json({ result: 'ok', user, token });
  } catch (error) {
    res.status(500).json({ result: 'failure' });
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const userInfo = req.body;

  try {
    const { _id: userId, email } = await userService.signup(userInfo);
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.status(201).json({ result: 'ok', token });
  } catch (error) {
    res.status(500).json({ result: 'failure' });
    next(error);
  }
};
