const Seller = require('../models/SellerData');

const sellerSignup = async (req, res) => {
    const { name, email, password, shopName, address, category, upiId, contact } = req.body;

    try {
        const existing = await Seller.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Seller already exists' });

        const newSeller = new Seller({ 
            name, 
            email, 
            password, 
            shopName, 
            address, 
            category, 
            upiId,
            contact
        });
        
        await newSeller.save();
        res.status(201).json({ 
            message: 'Seller registered successfully',
            seller: {
                id: newSeller._id,
                name: newSeller.name,
                email: newSeller.email,
                shopName: newSeller.shopName
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        if (seller.password !== password) return res.status(401).json({ message: 'Incorrect password' });

        res.status(200).json({ 
            message: 'Login successful', 
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { sellerSignup, sellerLogin };