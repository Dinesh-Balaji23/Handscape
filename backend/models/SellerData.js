const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    upiId: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
}, {
    collection: 'SellerData' // Explicit collection name
});

module.exports = mongoose.model('SellerData', sellerSchema);