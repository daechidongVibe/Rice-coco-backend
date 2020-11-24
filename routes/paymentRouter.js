const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.get('/', paymentController.authenticatePayment);
paymentRouter.post('/', paymentController.createPayment);

module.exports = paymentRouter;
