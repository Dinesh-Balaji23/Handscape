const ShoppingCart = require('../models/ShoppingCart');
const ProductData = require('../models/ProductData');
const UserData = require('../models/UserData');

const getCart = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await UserData.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cart = await ShoppingCart.findOne({ userId: user._id }).populate('items.productId');

    if (!cart) {
      cart = new ShoppingCart({ userId: user._id, items: [] });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, username } = req.body;

    if (!username || !productId) {
      return res.status(400).json({ success: false, message: "Username and product ID are required" });
    }

    const user = await UserData.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await ProductData.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await ShoppingCart.findOne({ userId: user._id });
    if (!cart) {
      cart = new ShoppingCart({ userId: user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: await cart.populate('items.productId')
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while adding to cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "Username is required" });

    const user = await UserData.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await ShoppingCart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

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
