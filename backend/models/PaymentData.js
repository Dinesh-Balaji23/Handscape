const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderData',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD'],
    required: true
  },
  upiId: {
    type: String,
    validate: {
      validator: function(v) {
        return this.paymentMethod !== 'UPI' || /^[\w.-]+@[\w]+$/.test(v);
      },
      message: 'Invalid UPI ID format'
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Allows null for failed transactions
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update order status when payment succeeds
paymentSchema.post('save', async function(doc) {
  if (doc.status === 'Success') {
    const Order = mongoose.model('OrderData');
    await Order.findByIdAndUpdate(doc.orderId, { 
      $set: { status: 'Confirmed' },
      $push: { paymentHistory: doc._id }
    });
  }
});

module.exports = mongoose.model('PaymentData', paymentSchema);