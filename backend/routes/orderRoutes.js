const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/orders', createOrder);
router.get('/user', getUserOrders);
router.get('/seller', getSellerOrders);
router.patch('/status', updateOrderStatus);

module.exports = router;