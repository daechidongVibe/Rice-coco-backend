const Payment = require('../models/Payment');
const User = require('../models/User');

exports.createService = async (userId, amount, productInfo) => {
  const payment = await Payment.create({
    buyer: userId,
    amount,
    productInfo
  });

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { payment: payment._id } });

  return payment;
};
