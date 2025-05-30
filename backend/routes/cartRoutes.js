const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.post('/cart/add', addToCart);
router.get('/cart/:username', getCart);
router.delete('/cart/remove/:productId', removeFromCart);

module.exports = router;
