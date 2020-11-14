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
    return await User.create(userInfo);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updatePreferPartner = async ( userId, preferredPartner ) => {
  try {
    return await User.update(
      { _id: userId },
      { preferredPartner },
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
};
