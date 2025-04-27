const ShoppingCart = require('../models/ShoppingCart');
const ProductData = require('../models/ProductData');

// Get or create cart for user
const getCart = async (req, res) => {
  try {
    let cart = await ShoppingCart.findOne({ userId: req.user._id })
                                 .populate('items.productId');
    
    if (!cart) {
      cart = new ShoppingCart({ userId: req.user._id, items: [] });
      await cart.save();
    }
    
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verify product exists
    const product = await ProductData.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await ShoppingCart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new ShoppingCart({ userId: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(await cart.populate('items.productId'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await ShoppingCart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(await cart.populate('items.productId'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};   