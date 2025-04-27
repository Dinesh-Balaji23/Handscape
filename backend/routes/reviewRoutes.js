const express = require('express');
const router = express.Router();
const {
  addReview,
  getProductReviews,
  getUserReviews
} = require('../controllers/reviewController');

router.post('/reviews', addReview);
router.get('/products/:productId/reviews', getProductReviews);
router.get('/users/:userId/reviews', getUserReviews);

module.exports = router;