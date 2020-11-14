const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const RESPONSE = require('../constants/response');

exports.login = async (req, res, next) => {
  const token = req.get('authorization');
  console.log(token, typeof token);
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
      return res.status(200).json(
        { result: RESPONSE.CAN_NOT_FIND }
      );
    }

    const { _id: userId } = user;

    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET
    );

    res.status(200).json(
      { result: RESPONSE.OK, user, token }
    );
  } catch (error) {
    res.status(500).json(
      { result: RESPONSE.FAILURE }
    );
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const { userInfo } = req.body;
  console.log(userInfo);

  try {
    const user = await userService.signup(userInfo);
    const { _id, email } = user;
    const token = jwt.sign(
      { _id, email },
      process.env.JWT_SECRET
    );

    res.status(201).json(
      { result: RESPONSE.OK, token }
    );
  } catch (error) {
    res.status(500).json(
      { result: RESPONSE.FAILURE }
    );
    next(error);
  }
};

exports.updatePreferPartner = async (req, res, next) => {
  console.log(res.locals.userInfo);
  const { userId } = res.locals.userInfo;
  const preferredPartner = req.body;

  console.log(userId, preferredPartner);

  try {
    const updatedUser = await userService.updatePreferPartner(userId, preferredPartner);

    console.log(updatedUser);

    if (updatedUser) {
      res.status(201).json(
        {
          result: RESPONSE.OK,
          updatedUser
        }
      );
    } else {
      res.json({
        result: RESPONSE.FAILURE,
        errMessage: RESPONSE.CAN_NOT_UPDATE
      });
    }
  } catch (err) {
    res.status(500).json(
      {
        result: RESPONSE.FAILURE,
        errMessage: RESPONSE.CAN_NOT_FIND
      }
    );

    next(error);
  }
};
