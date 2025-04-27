const ReviewData = require('../models/ReviewData');

// Add new review
const addReview = async (req, res) => {
  try {
    const { productId, productName, userId, userName, comment, rating } = req.body;

    // Validate rating (1-5 stars)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const newReview = new ReviewData({
      productId,
      productName,
      userId,
      userName,
      comment,
      rating
    });

    await newReview.save();
    res.status(201).json(newReview);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await ReviewData.find({ productId: req.params.productId })
                                  .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const reviews = await ReviewData.find({ userId: req.params.userId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getUserReviews
};