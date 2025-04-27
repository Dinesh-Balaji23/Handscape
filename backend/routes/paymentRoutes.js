const express = require('express');
const router = express.Router();
const {
  processPayment,
  getPaymentHistory
} = require('../controllers/paymentController');

// Process payment
router.post('/payments', processPayment);

// Get payment history
router.get('/users/:userId/payments', getPaymentHistory);

module.exports = router;