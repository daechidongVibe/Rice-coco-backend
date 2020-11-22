const User = require('../models/User');

exports.getUserInfo = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    return err;
  }
};

exports.login = async email => {
  try {
    return await User.findOne(
      { email },
      {
        history: 0,
        location: 0,
        updated_at: 0,
        created_at: 0,
        __v: 0
      }
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

exports.updateUserInfo = async (userId, userInfo) => {
  const { nickname, occupation }  = userInfo;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          nickname,
          occupation
        }
      },
      { new: true }
    );

    if (updatedUser) {
      return {
        result: 'SUCCESS',
        updatedUser
      };
    }

    return {
      result: 'FAILURE',
      errMessage: '유저가 없거나 업데이트에 실패하였습니다..'
    };
  } catch (err) {
    return err;
  }
};

exports.updatePreferPartner = async (userId, preferredPartner) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { preferredPartner },
      { new: true }
    );

    return updatedUser;
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

exports.getPartnerIdByNickname = async partnerNickname => {
  try {
    const { _id: partnerId } = await User.findOne({ nickname: partnerNickname });

    return partnerId;
  } catch (err) {
    return err;
  }
};

exports.addFavoritePartners = async (userId, partnerId) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { favoritePartners: partnerId } },
    );

    return updatedUser;
  } catch (err) {
    console.error(err);
    next(err);
  }
}
