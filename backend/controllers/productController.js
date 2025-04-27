const ProductData = require('../models/ProductData');
const Seller = require('../models/SellerData');
const mongoose = require('mongoose');

const addProduct = async (req, res) => {
    try {
        const { productName, category, description, price } = req.body;
        const sellerName = req.params.sellername;

        // Validate required fields
        if (!productName || !category || !description || !price) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }

        if (!sellerName) {
            return res.status(400).json({
                success: false,
                message: "Seller name is required in URL"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        // Find seller by name (case insensitive search)
        const seller = await Seller.findOne({ 
            name: { $regex: new RegExp(sellerName, 'i') } 
        });
        
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }
        const normalizedImagePath = req.file.path.replace(/\\/g, '/');

        const newProduct = new ProductData({
            productName,
            category,
            sellerId: seller._id,
            sellerName: seller.name,
            description,
            price,
            imagePath: normalizedImagePath
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            product: savedProduct,
            message: "Product added successfully"
        });
    } catch (err) {
        console.error("Error adding product:", err);
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