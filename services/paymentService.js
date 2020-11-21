const Payment = require('../models/Payment');

exports.createService = async (userId, amount, productInfo) => {
  const payment = await Payment.create({
    buyer: userId,
    amount,
    productInfo
  });

  console.log('새롭게 만들어진 페이먼트..', payment);
  return payment
};
