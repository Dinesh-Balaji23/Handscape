const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductData',
    required: true
  },
  productName: String,
  productImage: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  items: [orderItemSchema],
  sellerId: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: Date,
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: String, // Reference to Payments collection
  razorpayOrderId: String // Store Razorpay order ID
}, { collection: 'OrderData', timestamps: true });

module.exports = mongoose.model('OrderData', orderSchema);
