const axios = require('axios');

const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment');

exports.createPayment = async (req, res, next) => {
  try {
    const { userId } = res.locals.userInfo;
    const { amount, productInfo } = req.body;

    const result = await paymentService.createService(userId, amount, productInfo);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.authenticatePayment = async (req, res, next) => {
  // 웹뷰에서 결제시도 이후 해당 API로 리다이렉트

  // imp_success 로 결제 성공여부 판단
  // imp_uid - 아임포트 결제정보 id
  // merchant_uid - RICE COCO 서버 DB 에 만들어진 결제정보 id
  const { imp_success, imp_uid, merchant_uid } = req.query;

  const isPaymentSucceed = imp_success === 'false' ? false : true;

  // 결제 Authentication (교차 검증)
  if (isPaymentSucceed) {
    // 1. 아임포트 accessToken 발행
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        imp_key: process.env.IAMPORT_KEY,
        imp_secret: process.env.IAMPORT_SECRET
      }
    });

    const { access_token } = getToken.data.response;

    console.log('액세스 토큰! => ', access_token);

    // 2. 발급받은 토큰과 imp_uid로 아임포트 서버에 실제로 결제된 정보 조회
    const getPaymentInfo = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: "get",
      headers: { "Authorization": access_token }
    });

    const paymentData = getPaymentInfo.data.response;

    console.log('아임포트에서 조회한 결제정보! => ', paymentData);

    // 3. RICE COCO DB에 저장되어 있는 주문 정보 조회
    const order = await Payment.findById(paymentData.merchant_uid);
    const amountToBePaid = order.amount;

    // 4. 아임포트의 결제정보(paymentData)와 RICE COCO의 주문정보(order)의 결제 금액을 비교하고, 이상이 없다면 검증된 데이터를 RICE COCO 서버 DB에 저장
    const { amount, status } = paymentData;

    console.log('아임포트 결제정보의 금액 => ', amount);
    console.log('Rice coco 주문정보의 금액 => ', amountToBePaid);
    console.log('둘이 같은가요? => ', amount === amountToBePaid);

    if (amount === amountToBePaid) {
      await Payment.findByIdAndUpdate(
        merchant_uid,
        {
          $set: {
            paymentData,
            isVerified: true
          }
        }
      );

      switch (status) {
        case 'ready':
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          res.send({ status: 'vbankIssued', message: '가상계좌 발급 성공' });
          break;
        case 'paid':
          res.send({ status: 'success', message: '일반 결제 성공' });
          break;
      }
    } else {
      throw { status: 'forgery', message: '위조된 결제시도' };
    }
  }
};
