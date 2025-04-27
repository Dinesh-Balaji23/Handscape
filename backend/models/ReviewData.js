const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductData',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update product rating stats when new review is added
reviewSchema.post('save', async function() {
  const Product = mongoose.model('ProductData');
  const reviews = await this.model('ReviewData').find({ productId: this.productId });
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = (totalRating / reviews.length).toFixed(1);
  
  await Product.findByIdAndUpdate(this.productId, {
    avgRating,
    reviewCount: reviews.length
  });
});

module.exports = mongoose.model('ReviewData', reviewSchema);