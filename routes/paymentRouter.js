const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.post('/', paymentController.createPayment);

paymentRouter.get('/', paymentController.authenticatePayment);

module.exports = paymentRouter;
