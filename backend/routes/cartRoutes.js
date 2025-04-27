const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  removeFromCart 
} = require('../controllers/cartController');

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);

module.exports = router;