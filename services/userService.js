const User = require('../models/User');

exports.login = async email => {
  try {
    return await User.findOne(
      { email },
      { history: 0, location: 0, updated_at: 0, created_at: 0, __v: 0 }
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.signup = async userInfo => {
  try {
    const {
      _id,
      nickname,
      gender,
      occupation,
      birthYear,
      email,
      favoritePartners,
    } = await User.create(userInfo);

    return {
      _id,
      nickname,
      gender,
      occupation,
      birthYear,
      email,
      favoritePartners,
    };
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updatePreferPartner = async (userId, preferredPartner) => {
  try {
    return await User.findOneAndUpdate(
      { _id: userId },
      { preferredPartner },
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updatePromise = async (userId, amount) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { promise: amount } }
    );

    return updatedUser;
  } catch (err) {
    console.error(err);
    next(err);
  }
};
