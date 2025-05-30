const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
  createRazorpayOrder,
  getSellerAnalytics,
  getSellerOrdersByName
} = require('../controllers/orderController');

router.post('/orders', createOrder);
router.get('/user-orders/:username', getUserOrders);
router.get('/orders/seller-orders/:sellername', getSellerOrdersByName);
router.get('/seller', getSellerOrders);
router.route('/orders/status')
  .patch(updateOrderStatus)
  .options((req, res) => {
    res.header('Access-Control-Allow-Methods', 'PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).send();
  });

router.post('/cart/:username/razorpay', createRazorpayOrder);
router.get('/orders/seller-analytics/:sellername', getSellerAnalytics);

module.exports = router;
