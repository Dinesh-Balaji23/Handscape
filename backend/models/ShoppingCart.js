const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductData',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const shoppingCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { collection: 'ShoppingCart' });

// Auto-calculate total before saving
shoppingCartSchema.pre('save', async function(next) {
  const cart = this;
  let total = 0;
  
  for (const item of cart.items) {
    const product = await mongoose.model('ProductData').findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  
  cart.totalAmount = total;
  cart.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);