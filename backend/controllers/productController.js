const ProductData = require('../models/ProductData');

const addProduct = async (req, res) => {
    try {
        const { productName, category, description, price, sellerName } = req.body;
        const sellerId = req.body.sellerId || req.user?.sellerId; // Adjust based on your auth

        const newProduct = new ProductData({
            productName,
            category,
            sellerId,
            sellerName,
            description,
            price,
            imagePath: req.file.path
        });

        res.status(201).json({
            success: true,
            product: newProduct
          });
        } catch (err) {
          res.status(500).json({
            success: false,
            message: err.message
          });
        }
};

const getProductsBySeller = async (req, res) => {
    try {
        const products = await ProductData.find({ sellerName: req.params.sellerName });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProductRating = async (req, res) => {
    try {
        const productId = req.params.productId;
        
        // Calculate new average rating
        const reviews = await ReviewData.find({ productId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        
        // Update product
        const updatedProduct = await ProductData.findByIdAndUpdate(
            productId,
            { 
                avgRating: parseFloat(avgRating.toFixed(1)),
                reviewCount: reviews.length 
            },
            { new: true }
        );
        
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addProduct,
    getProductsBySeller,
    updateProductRating
};