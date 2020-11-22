const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const RESPONSE = require('../constants/response');

exports.getUserInfo = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const result = await userService.getUserInfo(userId);

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const token = req.get('authorization');

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
  const userInfo = req.body;

  try {
    const user = await userService.signup(userInfo);
    const { _id, email } = user;
    const token = jwt.sign(
      { _id, email },
      process.env.JWT_SECRET
    );

    res.status(201).json(
      { result: RESPONSE.OK, token, user }
    );

  } catch (error) {
    res.status(500).json(
      { result: RESPONSE.FAILURE }
    );
    next(error);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const {
      result,
      updatedUser,
      errMessage
    } = await userService.updateUserInfo(userId, req.body);

    if (result === 'SUCCESS') {
      return res.json({
        status: RESPONSE.OK,
        updatedUser
      });
    }

    if (result === 'FAILURE') {
      return res.json({
        status: RESPONSE.FAILURE,
        errMessage
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.updatePreferPartner = async (req, res, next) => {
  const { userId } = req.params;
  const preferredPartner = req.body;

  try {
    const updatedUser = await userService.updatePreferPartner(userId, preferredPartner);

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

exports.updatePromise = async (req, res, next) => {
  const { amount } = req.body;
  const { userId } = res.locals;

  try {
    const updatedUser = await userService.updatePromise(userId, amount);

    if (updatedUser) {
      res.json({
        result: RESPONSE.OK,
        updatedUser
      });
    } else {
      res.json({
        result: RESPONSE.CAN_NOT_UPDATE
      });
    }
  } catch (err) {
    next(err);
  }

};

exports.addFavoritePartners = async (req, res, next) => {
  const { userId } = req.params;
  const { partnerNickname } = req.body;

  console.log(`partnerNickname : ${partnerNickname}`);
  console.log(`userId : ${userId}`);
  try {
    const partnerId = await userService.getPartnerIdByNickname(partnerNickname);
    const updatedUser = await userService.addFavoritePartners(userId, partnerId);

    res.json({ result: RESPONSE.OK, updatedUser });
  } catch (err) {
    res.json({ result: RESPONSE.FAILURE });
    next(err);
  }
}