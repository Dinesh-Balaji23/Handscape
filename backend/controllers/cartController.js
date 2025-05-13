const ShoppingCart = require('../models/ShoppingCart');
const ProductData = require('../models/ProductData');
const UserData = require('../models/UserData');

const getCart = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Fetching cart for username: ${username}`); // Debug log

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await UserData.findOne({ name: username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    }

    let cart = await ShoppingCart.findOne({ userId: user._id }).populate('items.productId');

    if (!cart) {
      console.log(`Creating new cart for user: ${username}`);
      cart = new ShoppingCart({ userId: user._id, items: [] });
      await cart.save();
    }

    console.log(`Cart found:`, cart); // Debug log
    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, username } = req.body;

    // Input validation
    if (!username || !productId) {
      return res.status(400).json({ 
        success: false,
        message: "Username and product ID are required" 
      });
    }

    const user = await UserData.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const product = await ProductData.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    let cart = await ShoppingCart.findOne({ userId: user._id });
    if (!cart) {
      cart = new ShoppingCart({ userId: user._id, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId
    );

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
    console.error('Error in addToCart:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding to cart' 
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { username } = req.body; // Get username from request body

    if (!username) return res.status(400).json({ error: "Username is required" });

    // Find user by username
    const user = await UserData.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await ShoppingCart.findOne({ userId: user._id });
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