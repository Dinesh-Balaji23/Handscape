const PaymentData = require('../models/PaymentData');
const OrderData = require('../models/OrderData');

// Process new payment
const processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { orderId, userId, amount, paymentMethod, upiId } = req.body;

    // 1. Verify order exists and amount matches
    const order = await OrderData.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.totalAmount !== amount) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // 2. Create payment record
    const payment = new PaymentData({
      orderId,
      userId,
      amount,
      paymentMethod,
      upiId: paymentMethod === 'UPI' ? upiId : undefined,
      status: 'Pending'
    });

    await payment.save({ session });

    // 3. Simulate payment processing (replace with actual payment gateway integration)
    const paymentSuccess = await simulatePaymentGateway(paymentMethod);
    
    // 4. Update payment status
    payment.status = paymentSuccess ? 'Success' : 'Failed';
    payment.transactionId = paymentSuccess ? generateTransactionId() : undefined;
    await payment.save({ session });

    await session.commitTransaction();
    res.status(201).json(payment);

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await PaymentData.find({ userId: req.params.userId })
                                     .populate('orderId');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper functions
const simulatePaymentGateway = async (method) => {
  // Replace with actual payment gateway integration
  return new Promise(resolve => 
    setTimeout(() => resolve(Math.random() > 0.2), 1000)
  ); // 80% success rate
};

const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
};

module.exports = {
  processPayment,
  getPaymentHistory
};