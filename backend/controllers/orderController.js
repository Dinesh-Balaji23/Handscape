const OrderData = require('../models/OrderData');
const ShoppingCart = require('../models/ShoppingCart');
const ProductData = require('../models/ProductData');

// Create new order from cart
const createOrder = async (req, res) => {
  try {
    const { userId, userName, shippingAddress, sellerId, sellerName } = req.body;

    // 1. Get user's cart
    const cart = await ShoppingCart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.productName,
      productImage: item.productId.imagePath,
      price: item.productId.price,
      quantity: item.quantity
    }));

    // 3. Create order
    const newOrder = new OrderData({
      userId,
      userName,
      shippingAddress,
      sellerId,
      sellerName,
      items: orderItems,
      totalAmount: cart.totalAmount,
      estimatedDelivery: new Date(Date.now() + 7*24*60*60*1000) // 7 days from now
    });

    await newOrder.save();
    
    // 4. Clear cart
    await ShoppingCart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    res.status(201).json(newOrder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await OrderData.find({ userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by seller
const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const orders = await OrderData.find({ sellerId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedOrder = await OrderData.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus
};