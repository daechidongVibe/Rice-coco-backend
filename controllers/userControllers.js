const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.login = async (req, res, next) => {
  const token = req.get('authorization');
  console.log(token);

  if (token !== "null") {
    try {
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.login(email);
      res.status(200).json({ result: 'ok', user });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'unauthorized' });
    }

    return;
  }

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
  const { userInfo } = req.body;
  console.log(userInfo);

  try {
    const user = await userService.signup(userInfo);
    const { _id, email } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET);

    res.status(201).json({ result: 'ok', token, user });
  } catch (error) {
    res.status(500).json({ result: 'failure' });
    next(error);
  }
};
