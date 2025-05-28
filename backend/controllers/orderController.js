const OrderData = require('../models/OrderData');
const ShoppingCart = require('../models/ShoppingCart');
const ProductData = require('../models/ProductData');
const User = require('../models/UserData');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: 'rzp_test_8qY0PPemsA7yUW',
  key_secret: 'Fd5kXuZlWGH1Wzp2PzOJEh0w',
});

const createOrder = async (req, res) => {
  try {
    const { 
      userId,
      userName,
      paymentId,
      razorpayOrderId,
      cartItems,
      totalAmount,
      status = "Pending"
    } = req.body;

    const newOrder = new OrderData({
      userId,
      userName,
      items: cartItems.map(item => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        price: item.productId.price,
        quantity: item.quantity
      })),
      sellerId: cartItems[0].productId.sellerId,
      sellerName: cartItems[0].productId.sellerName,
      totalAmount,
      paymentId,
      razorpayOrderId,
      status,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      bookingDate: new Date()
    });

    const savedOrder = await newOrder.save();

    await ShoppingCart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ 
      error: 'Order processing failed',
      details: err.message 
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Fetching orders for username: ${username}`);
    
    const orders = await OrderData.find({ 
      $or: [
        { userId: username },
        { userName: username }
      ]
    });
    
    console.log(`Found ${orders.length} orders`);
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error in getUserOrders:', err);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: err.message 
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const orders = await OrderData.find({ sellerId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const createRazorpayOrder = async (req, res) => {
  try {
    const { username } = req.params;
    const { totalAmount } = req.body;

    console.log('Creating Razorpay order for user:', username);

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex")
    };

    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ order });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSellerAnalytics = async (req, res) => {
  try {
    const { sellername } = req.params;
    const orders = await OrderData.find({ sellerName: sellername });
    const products = await ProductData.find({ sellerName: sellername });

    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            count: 0,
            revenue: 0
          };
        }
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].revenue += item.quantity * item.price;
      });
    });

    res.status(200).json({
      totalOrders: orders.length,
      totalProducts: products.length,
      productSales: Object.values(productSales),
      statusDistribution: {
        Pending: orders.filter(o => o.status === 'Pending').length,
        Shipped: orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length,
        Cancelled: orders.filter(o => o.status === 'Cancelled').length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSellerOrdersByName = async (req, res) => {
  try {
    const { sellername } = req.params;
    console.log(`Fetching orders for seller: ${sellername}`);
    
    const orders = await OrderData.find({ sellerName: sellername })
      .sort({ bookingDate: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error in getSellerOrdersByName:', err);
    res.status(500).json({ 
      error: 'Failed to fetch seller orders',
      details: err.message 
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
  createRazorpayOrder,
  getSellerAnalytics,
  getSellerOrdersByName
};
